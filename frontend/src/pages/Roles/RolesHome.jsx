import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Table,
  Modal,
} from "reactstrap";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";
import warningImage from "../../assets/images/warning/warning.png";
import {
  API_GET_ALL_ROLES,
  API_ROLE_DELETE,
  API_GET_PAGINATED_ROLES_DATA,
  API_ROLE_DOWNLOAD_CSV,
  API_GET_ROLE_PERMSSIONS_DATA,
} from "Apis/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DNA } from "react-loader-spinner";

const RolesHome = () => {
  const [deleteDataById, setdeleteDataById] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [rolesData, setRolesData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchRoleId, setSearchRoleId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filterBy, setFilterBy] = useState(false);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState();

  document.title = "Role | TechAstha";

  const config = GetAuthToken();
  const navigate = useNavigate();

  function deletePopupFun() {
    setDeletePopup(!deletePopup);
  }

  const deleteRole = async () => {
    try {
      const { data } = await axios.delete(
        `${API_ROLE_DELETE}${deleteDataById}/`,
        config
      );
      toast.success(`Role Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getRolesData();
      navigate("/ta-roles");
    } catch (error) {
      toast.error("something went wrong", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const downloadCsv = async () => {
    try {
      const { data } = await axios.get(API_ROLE_DOWNLOAD_CSV, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([data], { type: "application/csv" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `rolesData.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toggleExportData();
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  const getRolesData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_GET_PAGINATED_ROLES_DATA}?name=${searchName}&role_id=${searchRoleId}&page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setRolesData(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      const totalPages = Math.ceil(data.count / pageSize);

      let startPage = Math.max(1, pageNumber - 1);
      let endPage = Math.min(totalPages, startPage + 2);

      if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
      }

      setVisiblePageNumbers(
        [...Array(endPage - startPage + 1)].map((_, index) => startPage + index)
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPageNumber(1);
  };

  const fetchUserPermissions = async () => {
    try {
      const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config);
      setPermissions(data?.select_user_role_id?.permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    getRolesData();
  }, [pageNumber, pageSize, searchRoleId, searchName, filterBy]);

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  const rolePermissions =
    permissions &&
    permissions?.filter(
      (eachPermission) => eachPermission.module_name === "Roles"
    );
  const allPermissions = [].concat(...(rolePermissions || []));

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Roles</h3>
                  <div>
                    <Button
                      className="px-4 me-2"
                      color="warning"
                      onClick={() => setFilterBy(!filterBy)}
                    >
                      Filter
                    </Button>
                    {allPermissions &&
                      allPermissions.find(
                        (eachItem) => eachItem.method_name === "Export"
                      ) && (
                        <Button
                          className="px-4 me-2"
                          color="secondary"
                          onClick={downloadCsv}
                        >
                          Export
                        </Button>
                      )}

                    {allPermissions &&
                      allPermissions.find(
                        (eachItem) => eachItem.method_name === "Add"
                      ) && (
                        <Link to="/ta-roles-add">
                          <Button className="px-4" color="primary">
                            Create
                          </Button>
                        </Link>
                      )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className={filterBy === true ? "" : "d-none"}>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex align-items-center justify-content-between">
                  <div>
                    <label className="text-bold text-dark">
                      Filter By Name :
                    </label>
                    <Input
                      type="search"
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Enter Name"
                      className="form-control"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            {loading === true ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "100vh" }}
              >
                <DNA
                  height={100}
                  width={100}
                  radius={9}
                  color="green"
                  ariaLabel="loading"
                  wrapperClass="custom-loader-wrapper"
                />
              </div>
            ) : (
              <Col xl={12}>
                <Card className="pb-5">
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="align-middle ">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center">No.</th>
                            <th className="text-center">Role Name</th>
                            <th className="text-center">Status</th>
                            {allPermissions &&
                              allPermissions.some(
                                (eachItem) =>
                                  eachItem.method_name === "Update" ||
                                  eachItem.method_name === "Delete"
                              ) && <th className="text-center">Actions</th>}
                          </tr>
                        </thead>

                        <tbody>
                          {rolesData &&
                            rolesData.map((item, index) => (
                              <tr key={item?.id}>
                                <th scope="row" className="text-center">
                                  {index + 1}
                                </th>
                                <td className="text-center">
                                  {item?.role_name}
                                </td>
                                <td className="text-center">
                                  {item?.role_status === true ? (
                                    <Button
                                      type="button"
                                      className="btn btn-success btn-sm "
                                    >
                                      <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
                                      Active
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                    >
                                      <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                                      Inactive
                                    </Button>
                                  )}
                                </td>
                                {allPermissions &&
                                  allPermissions.some(
                                    (eachItem) =>
                                      eachItem.method_name === "Update" ||
                                      eachItem.method_name === "Delete"
                                  ) && (
                                    <td className="text-center">
                                      {allPermissions &&
                                        allPermissions.find(
                                          (eachItem) =>
                                            eachItem.method_name === "Update"
                                        ) && (
                                          <Link
                                            to={`/ta-roles-edit/${item.id}`}
                                          >
                                            <Button
                                              color="warning"
                                              className="btn  btn-sm me-2"
                                            >
                                              <i className="fas fa-pen-fancy"></i>
                                            </Button>
                                          </Link>
                                        )}

                                      {allPermissions &&
                                        allPermissions.find(
                                          (eachItem) =>
                                            eachItem.method_name === "Delete"
                                        ) && (
                                          <Button
                                            color="danger"
                                            className="btn btn-warning btn-sm ms-2"
                                            onClick={() => {
                                              setdeleteDataById(item.id);
                                              deletePopupFun();
                                            }}
                                          >
                                            <i className="fas fa-trash-alt"></i>
                                          </Button>
                                        )}
                                    </td>
                                  )}
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className=" text-dark ms-4 me-1">Showing</span>
                      <select
                        onChange={(e) => handlePageSizeChange(e)}
                        style={{ height: "20px", marginTop: "4px" }}
                        defaultValue={pageSize}
                      >
                        <option value={5}>5</option>
                        <option value={10} selected>
                          10
                        </option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={100}>100</option>
                      </select>
                      <span className=" text-dark m-1">Items per page</span>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-primary m-1"
                        onClick={handlePreviousPage}
                      >
                        Previous
                      </button>
                      {visiblePageNumbers.map((page) => (
                        <button
                          key={page}
                          className={`btn btn-sm btn-primary m-1 ${
                            page === pageNumber ? "active" : ""
                          }`}
                          onClick={() => setPageNumber(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className="btn btn-sm btn-primary m-1 me-4"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
        <div>
          <Modal
            isOpen={deletePopup}
            toggle={() => {
              deletePopupFun();
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">Delete VC</h5>
              <button
                type="button"
                onClick={() => {
                  deletePopupFun();
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              className="modal-body"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={warningImage}
                alt="Warning"
                className="img-fluid"
                style={{ height: "100px" }}
              />
              <p>Are you sure you want to delete Role?</p>
            </div>

            <div className="modal-footer">
              <Button
                color="danger"
                className="btn btn-warning  ms-2 px-4"
                onClick={() => {
                  deleteRole();
                  deletePopupFun();
                }}
              >
                Confirm Delete
              </Button>
              <Button
                color="secondary"
                className="btn btn-secondary  ms-2 px-5"
                onClick={() => {
                  deletePopupFun();
                }}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default RolesHome;
