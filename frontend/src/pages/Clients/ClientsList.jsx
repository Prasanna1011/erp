import React, { useState, useRef, useEffect } from "react"; // Import React and necessary hooks
import { Link } from "react-router-dom"; // Import Link component from react-router-dom
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
  Modal, // Import components from reactstrap library
  CardTitle,
} from "reactstrap";
import { TablePagination } from "@mui/material"; // Import TablePagination from Material-UI
import axios from "axios"; // Import Axios for HTTP requests
import {
  API_DELETE_CLIENTS,
  API_GET_ALL_CLIENTS_PAGINATED,
  API_DOWNLOAD_CLIENT_CSV,
  API_GET_ROLE_PERMSSIONS_DATA,
} from "Apis/api"; // Import API endpoints
import GetAuthToken from "TokenImport/GetAuthToken"; // Import function to get authentication token
import { toast } from "react-toastify"; // Import toast component from react-toastify
import { DNA } from "react-loader-spinner"; // Import DNA component from react-loader-spinner

const ClientsList = () => {
  // State variables using the useState hook
  const [clientsData, setClientsData] = useState([]);
  const [deletePopup, setdeletePopup] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchClientId, setSearchClientId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterBy, setFilterBy] = useState(false);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(); // Permission state

  // Local storage token Start
  const config = GetAuthToken(); // Get authentication token
  document.title = "Client | TechAstha"; // Set document title
  // Local storage token End

  // Delete popup Modal Start
  const deletePopupFun = () => {
    setdeletePopup(!deletePopup); // Toggle delete popup state
  };

  // Clients data Get Start
  const clientsDataGet = async () => {
    try {
      setLoading(true); // Set loading to true
      const { data } = await axios.get( // HTTP GET request
        `${API_GET_ALL_CLIENTS_PAGINATED}?address=${searchAddress}&client_id=${searchClientId}&email=${searchEmail}&name=${searchName}&phone=${searchPhone}&page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setClientsData(data.results); // Set clients data
      setNextPage(data.next); // Set next page
      setPreviousPage(data.previous); // Set previous page
      const totalPages = Math.ceil(data.count / pageSize);

      let startPage = Math.max(1, pageNumber - 1);
      let endPage = Math.min(totalPages, startPage + 2);

      if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
      }

      setVisiblePageNumbers(
        [...Array(endPage - startPage + 1)].map((_, index) => startPage + index)
      );
      setLoading(false); // Set loading to false
    } catch (error) {
      setLoading(false); // Set loading to false on error
      console.log(error);
    }
  };

  // Delete Client By ID Start
  const handleClientsDelete = async (id) => {
    try {
      const { data } = await axios.delete( // HTTP DELETE request
        `${API_DELETE_CLIENTS}${id}/`,
        config
      );
      toast.success(`Client Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      clientsDataGet(); // Fetch updated clients data
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

  const handleNextPage = () => {
    if (nextPage) {
      setPageNumber(pageNumber + 1); // Increment page number
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setPageNumber(pageNumber - 1); // Decrement page number
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize); // Set new page size
    setPageNumber(1); // Reset page number to 1
  };

  const downloadCsv = async () => {
    try {
      const { data } = await axios.get( // HTTP GET request for CSV download
        API_DOWNLOAD_CLIENT_CSV,
        config,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([data], { type: "application/csv" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `ClientData.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toggleExportData();
    } catch (error) {
      console.log("Error downloading file:", error);
    }
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
    fetchUserPermissions();
  }, []);

  const rolePermissions =
    permissions &&
    permissions?.filter(
      (eachPermission) => eachPermission.module_name === "Clients"
    );
  const allPermissions = [].concat(...(rolePermissions || []));

  useEffect(() => {
    clientsDataGet();
  }, [
    pageNumber,
    pageSize,
    searchAddress,
    searchClientId,
    searchEmail,
    searchName,
    searchPhone,
    filterBy,
  ]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Clients List</h3>
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
                        (eachItem) => eachItem?.method_name === "Export"
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
                        (eachItem) => eachItem?.method_name === "Add"
                      ) && (
                        <Link to="/taerp-add-clients">
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
                <CardBody className="d-flex align-items-center justify-content-start">
                  <div className="me-2">
                    <label className="text-bold text-dark">
                      Filter By Name :
                    </label>
                    <Input
                      type="search"
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Enter Name"
                    />
                  </div>
                  <div className="me-2">
                    <label className="text-bold text-dark">
                      Filter By Email :
                    </label>
                    <Input
                      type="search"
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="Enter Email"
                    />
                  </div>
                  <div className="me-2">
                    <label className="text-bold text-dark">
                      Filter By Phone :
                    </label>
                    <Input
                      type="search"
                      onChange={(e) => setSearchPhone(e.target.value)}
                      placeholder="Enter Phone"
                    />
                  </div>
                  <div className="me-2">
                    <label className="text-bold text-dark">
                      Filter By Address :
                    </label>
                    <Input
                      type="search"
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="Enter Address"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
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
                    <div className="table-responsive">
                      <Table className="align-middle ">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center">No.</th>
                            <th className="text-center">Client Name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Phone </th>
                            <th className="text-center">Address</th>
                            {allPermissions &&
                              allPermissions.some(
                                (eachItem) =>
                                  eachItem?.method_name === "Update" ||
                                  eachItem?.method_name === "Delete"
                              ) && <th className="text-center">Actions</th>}
                          </tr>
                        </thead>

                        <tbody className="">
                          {clientsData &&
                            clientsData?.map((item, index) => (
                              <tr key={item?.id}>
                                <th scope="row" className="text-center">
                                  {index + 1}
                                </th>
                                <td className="text-center">
                                  {item?.client_name}
                                </td>
                                <td className="text-center">
                                  {item?.client_email}
                                </td>
                                <td className="text-center">
                                  {item?.client_phone_no}
                                </td>
                                <td className="text-center">
                                  {item?.client_address}
                                </td>
                                {allPermissions &&
                                  allPermissions.some(
                                    (eachItem) =>
                                      eachItem?.method_name === "Update" ||
                                      eachItem?.method_name === "Delete"
                                  ) && (
                                    <td className="text-center">
                                      {allPermissions &&
                                        allPermissions.find(
                                          (eachItem) =>
                                            eachItem?.method_name === "Update"
                                        ) && (
                                          <Link
                                            to={`/taerp-edit-clients/${item?.id}`}
                                          >
                                            <Button
                                              color="warning"
                                              className="btn  btn-sm"
                                            >
                                              <i className="fas fa-pen-fancy"></i>
                                            </Button>
                                          </Link>
                                        )}
                                      {allPermissions &&
                                        allPermissions.find(
                                          (eachItem) =>
                                            eachItem?.method_name === "Delete"
                                        ) && (
                                          <Button
                                            color="danger"
                                            className="btn  btn-sm m-2"
                                            onClick={() =>
                                              setDeleteClientId(item?.id) ||
                                              deletePopupFun()
                                            }
                                          >
                                            <i className="fas fa-trash"></i>
                                          </Button>
                                        )}
                                    </td>
                                  )}
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
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
          </Row>
        </Container>

        <div>
          <Modal
            isOpen={deletePopup}
            toggle={deletePopupFun}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">Delete Client</h5>
              <button
                type="button"
                onClick={deletePopupFun}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this client?</p>
            </div>
            <div className="modal-footer">
              <Button
                color="danger"
                className="btn btn-warning btn-sm ms-2"
                onClick={() => {
                  handleClientsDelete(deleteClientId);
                  deletePopupFun();
                }}
              >
                Confirm Delete
              </Button>
              <Button
                color="secondary"
                className="btn btn-secondary btn-sm ms-2"
                onClick={deletePopupFun}
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

export default ClientsList;
