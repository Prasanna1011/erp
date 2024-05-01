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
import { TablePagination } from "@mui/material";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";
import { API_DELETE_LEAVE_TYPE, API_GET_LEAVE_TYPE, API_GET_ROLE_PERMSSIONS_DATA } from "Apis/api";
import { toast } from "react-toastify";
import { DNA } from "react-loader-spinner";
const LeaveTypes = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [deletePopup, setdeletePopup] = useState(false);
  const [deleteLeveTypeId, setdeleteLeveTypeId] = useState(null);
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState()

  // Delete popup Modal Start
  function deletePopupFun() {
    setdeletePopup(!deletePopup);
  }
  // Delete popup Modal End

  // Local storage token Start
  const config = GetAuthToken();

  // Local storage token End

  document.title = "Leave Types | TechAstha";

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = leaveTypes.filter((item) => {
      const searchString = `${item.leave_days} ${item.leave_type}  `; // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(searchData);
  };

  // Search Filter End
  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End

  // Get all Leave Types Start
  const getLeaveTypes = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(API_GET_LEAVE_TYPE, config);
      setLeaveTypes(data.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  };
  // Get all Leave Types End

  // Delete Leave Type By ID Start
  const deleteLeveById = async () => {
    try {
      const { data } = await axios.delete(
        `${API_DELETE_LEAVE_TYPE}${deleteLeveTypeId}/`,
        config
      );
      toast.success(`Leave Type Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getLeaveTypes();
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

  const fetchUserPermissions = async () => {
    try {
      const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config);
      setPermissions(data?.select_user_role_id?.permissions)
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };


  useEffect(() => {
    getLeaveTypes();
    fetchUserPermissions()
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, leaveTypes]);


  const rolePermissions = permissions && permissions?.filter(eachPermission => eachPermission.module_name === "Leave Type");
  const allPermissions = [].concat(...(rolePermissions || []));

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Leave Types List</h3>
                  {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Add") && (
                  <Link to="/ta-leave-types-add">
                    <Button className="px-4" color="primary">
                      Create
                    </Button>
                  </Link>)}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <div className="d-flex mb-3 justify-content-center">
            <input
              className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded "
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {searchQuery.length >= 1 ? (
              <Button
                className="btn btn-sm "
                onClick={() => {
                  const input = searchInputRef.current;
                  if (input) {
                    input.select();
                    document.execCommand("cut");
                  }
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            ) : (
              <Button className=" btn btn-sm " onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </Button>
            )}
          </div>


          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  {loading === true ? (<div
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
                  </div>) : (<div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">No.</th>
                          <th className="text-center">Leave Types</th>
                          <th className="text-center">Leave Numbers</th>
                          <th className="text-center">Leave Status</th>
                          {allPermissions && allPermissions.some(eachItem => eachItem.method_name === "Update" || eachItem.method_name === "Delete") && (
                            <th className="text-center">Actions</th>
                          )}
                        </tr>
                      </thead>

                      <tbody className="">
                        {(searchQuery
                          ? filteredData
                          : leaveTypes &&
                          leaveTypes.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        ).map((item, index) => (
                          <tr key={item.id}>
                            <th scope="row" className="text-center">
                              {index + 1}
                            </th>
                            <td className="text-center">{item.leave_type}</td>
                            <td className="text-center">{item.leave_days}</td>
                            <td className="text-center">
                              {item.status === true ? (
                                <Button
                                  type="button"
                                  className="btn btn-success btn-sm "
                                >
                                  <i className="bx bx-check-double font-size-16 align-middle"></i>
                                  Active
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  className="btn btn-danger btn-sm  "
                                >
                                  <i className="bx bx-block font-size-16 align-middle "></i>
                                  Inactive
                                </Button>
                              )}
                            </td>
                            {allPermissions && allPermissions.some(eachItem => eachItem.method_name === "Update" || eachItem.method_name === "Delete" ) && (
                            <td className="text-center">
                              {/* Edit Button  */}
                              {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Update") && (
                              <Link to={`/ta-leave-types-edit/${item.id}`}>
                                <Button color="warning" className="btn  btn-sm">
                                  <i className="fas fa-pen-fancy"></i>
                                </Button>
                              </Link>)}
                              {/* Delete Button */}
                              {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Delete") && (
                              <Button
                                color="danger"
                                className="btn btn-warning btn-sm ms-2"
                                onClick={() => {
                                  setdeleteLeveTypeId(item.id); // Pass the client ID
                                  deletePopupFun();
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>)}
                            </td>)}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>)}

                </CardBody>
                <TablePagination
                  className=" d-flex justfy-content-start"
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={leaveTypes.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Delete Popup Modal start */}

        <div>
          <Modal
            isOpen={deletePopup}
            toggle={() => {
              deletePopupFun();
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">Delete Leave Type</h5>
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
            <div className="modal-body">
              <p>Are you sure you want to delete this Leave Type ?</p>
            </div>
            <div className="modal-footer">
              <Button
                color="danger"
                className="btn btn-warning btn-sm ms-2"
                onClick={() => {
                  deleteLeveById(); // Execute the deleteLeveById function
                  deletePopupFun(); // Close the modal
                }}
              >
                Confirm Delete
              </Button>
              <Button
                color="secondary"
                className="btn btn-secondary btn-sm ms-2"
                onClick={() => {
                  deletePopupFun(); // Close the modal without deleting
                }}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>

        {/* Delete Popup Modal End */}
      </div>
    </>
  );
};

export default LeaveTypes;
