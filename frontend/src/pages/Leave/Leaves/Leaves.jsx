import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  Table,
} from "reactstrap";
import {
  API_ADD_GET_LEAVES,
  API_GET_CHAT_USERS_LIST,
  API_GET_LEAVES_LIST,
  API_GET_ROLE_PERMSSIONS_DATA,
  API_GET_USERS,
  API_LEAVES_DOWNLOAD_CSV,
  DELETE_LEAVES,
  GET_LEAVES_BY_ID_UPDATED_LEAVES,
  GET_LEAVES_BY_ID
} from "Apis/api.js";
import GetAuthToken from "TokenImport/GetAuthToken";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DNA } from "react-loader-spinner";

const Leaves = () => {
  const [leaveData, setLeaveData] = useState();
  const [leavesDataById, setLeavesDataById] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modal_center, setmodal_center] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState();
  const [fromDate, setFromDate] = useState("");
  const [statusCheck, setStatusCheck] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterBy, setFilterBy] = useState(false);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState()

  document.title = "Leaves | TechAstha";

  const config = GetAuthToken();
  const navigate = useNavigate();

  const getLeavesData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${API_GET_LEAVES_LIST}?employee_id=${employeeId}&from_date=${fromDate}&status=${statusCheck}&to_date=${toDate}&page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setLeaveData(data.results);
      setLoading(false)
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
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const deleteLeaves = async (id) => {
    try {
      const { data } = await axios.delete(`${DELETE_LEAVES}${id}/`, config);
      toast.success(`Leave  Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getLeavesData();
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

  const getLeavesById = async (id) => {
    setmodal_center(!modal_center);
    try {
      const { data } = await axios.get(
        `${GET_LEAVES_BY_ID}${id}/`,
        config
      );
      console.log("View Leave Data By Id", data);
      setLeavesDataById(data);
    } catch (error) {
      console.log("Error in getting leaves by Id", error);
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

  const getUsersData = async () => {
    try {
      const { data } = await axios.get(API_GET_USERS, config);
      setEmployeeData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadCsv = async () => {
    try {
      const { data } = await axios.get(API_LEAVES_DOWNLOAD_CSV, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([data], { type: "application/csv" });
      console.log("blob", blob);
      console.log("blob size", blob.size);

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `LeavesData.csv`;
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
      setPermissions(data?.select_user_role_id?.permissions)
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    fetchUserPermissions()
  }, [])

  const rolePermissions = permissions && permissions?.filter(eachPermission => eachPermission.module_name === "Leave");
  const allPermissions = [].concat(...(rolePermissions || []));

  useEffect(() => {
    getLeavesData();
    getUsersData();
  }, [
    pageNumber,
    pageSize,
    nextPage,
    previousPage,
    employeeId,
    fromDate,
    toDate,
  ]);


  return (
    <div className="page-content">
      <Container fluid={true}>
        <Modal isOpen={modal_center} size="lg" centered>
          <div className="modal-header">
            <h5 className="modal-title mt-0">Leave Details</h5>
            <button
              type="button"
              onClick={() => {
                setmodal_center(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Row className="border-bottom mb-2">
              <Col lg="6">
                <h6>
                  UserName:{" "}
                  {leavesDataById && leavesDataById.leave_data.user_name}
                </h6>
              </Col>
              <Col lg="6">
                <h6>
                  Title:{" "}
                  {leavesDataById && leavesDataById.leave_data.leave_title}
                </h6>
              </Col>
            </Row>
            <Row className="border-bottom mb-2">
              <Col lg="6">
                <h6>
                  Leave Type:{" "}
                  {leavesDataById && leavesDataById.leave_data.leavetype_name}
                </h6>
              </Col>
              <Col lg="6">
                <h6>
                  Reason: {leavesDataById && leavesDataById.leave_data.reason}
                </h6>
              </Col>
            </Row>
            <Row className="border-bottom mb-2">
              <Col lg="6">
                <h6>
                  Start Date:{" "}
                  {leavesDataById && leavesDataById.leave_data.startdate}
                </h6>
              </Col>
              <Col lg="6">
                <h6>
                  End Date:{" "}
                  {leavesDataById && leavesDataById.leave_data.enddate}
                </h6>
              </Col>
            </Row>
            <Row className="border-bottom mb-2">
              <Col lg="6">
                <h6>
                  Apply Date:{" "}
                  {leavesDataById &&
                    leavesDataById.leave_data.leave_apply_date.split("T")[0]}
                </h6>
              </Col>
              <Col lg="6">
                <h6>
                  Total Days:{" "}
                  <span>
                    {leavesDataById && leavesDataById.leave_data.totaldays}
                  </span>
                </h6>
              </Col>
            </Row>
            <div
              className="table-responsive pt-2"
              style={{ overflowY: "auto", height: "300px" }}
            >
              <Table className="align-middle ">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Leave Type</th>
                  </tr>
                </thead>
                <tbody>
                  {leavesDataById &&
                    leavesDataById?.leave_totals?.map((eachLeave, index) => (
                      <tr key={index}>
                        <td>{eachLeave.leave_date}</td>
                        <td>{eachLeave.leave_day}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Leaves</h3>
                <div>
                  <Button
                    className="px-4 me-2"
                    color="warning"
                    onClick={() => setFilterBy(!filterBy)}
                  >
                    Filter
                  </Button>
                  {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Export") && (
                    <Button
                      className="px-4 me-2"
                      color="secondary"
                      onClick={downloadCsv}
                    >
                      Export
                    </Button>)}
                  {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Add") && (
                    <Link to="/add-leaves">
                      <Button className="px-4" color="primary">
                        Create
                      </Button>
                    </Link>)}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className={filterBy === true ? "" : "d-none"}>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex align-items-center justify-content-start">
                <div className="me-1">
                  <label className="text-bold text-dark">Start Date :</label>
                  <Input
                    type="date"
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="me-1">
                  <label className="text-bold text-dark">End Date :</label>
                  <Input
                    type="date"
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-bold text-dark">
                    Filter By Employee
                  </label>
                  <Input
                    type="select"
                    onChange={(e) => setEmployeeId(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employeeData &&
                      employeeData.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.firstname + " " + employee.lastname}
                        </option>
                      ))}
                  </Input>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

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
                        <th className="text-center">Name</th>
                        <th className="text-center">Leave Type</th>
                        <th className="text-center">Leave Title</th>
                        <th className="text-center">Leave Reason</th>
                        <th className="text-center">Notes by Authority</th>
                        <th className="text-center">Leave Approved by</th>
                        <th className="text-center">Start Date</th>
                        <th className="text-center">End Date</th>
                        <th className="text-center">Applied Date</th>
                        <th className="text-center">Total Days</th>
                        <th className="text-center">Status</th>
                        {allPermissions && allPermissions.some(eachItem => eachItem.method_name === "Update" || eachItem.method_name === "Delete" || eachItem.method_name === "View") && (
                          <th className="text-center">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {leaveData &&
                        leaveData.map((eachItem, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {eachItem.user_l.firstname +
                                " " +
                                eachItem.user_l.lastname}
                            </td>
                            <td className="text-center">
                              {eachItem.leavetype_id.leave_type}
                            </td>
                            <td className="text-center">{eachItem.title}</td>
                            <td className="text-center">{eachItem.reason}</td>
                            <td className="text-center">
                              {eachItem.l_notes === null
                                ? "No Record"
                                : eachItem.l_notes}
                            </td>

                            <td className="text-center">
                              {eachItem.approvedBy === null
                                ? "No Record"
                                : eachItem.approvedBy.firstname +
                                " " +
                                eachItem.approvedBy.lastname}
                            </td>
                            <td className="text-center">
                              {eachItem.startdate}
                            </td>
                            <td className="text-center">{eachItem.enddate}</td>
                            <td className="text-center">
                              {eachItem.leave_apply_date.split("T")[0]}
                            </td>
                            <td className="text-center">
                              {eachItem.totaldays}
                            </td>
                            <td className="text-center">{eachItem.status}</td>
                            {allPermissions && allPermissions.some(eachItem => eachItem.method_name === "Update" || eachItem.method_name === "Delete" || eachItem.method_name === "View") && (
                              <td className="text-center">
                                {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Update") && (
                                  <Link
                                    to="/edit-leaves"
                                    state={{ Id: eachItem.id }}
                                  >
                                    <button className="btn btn-warning btn-sm m-1">
                                      <i className="fas fa-pen-fancy"></i>
                                    </button>
                                  </Link>)}
                                {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "View") && (
                                  <button
                                    className="btn btn-primary btn-sm m-1"
                                    onClick={() => getLeavesById(eachItem.id)}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>)}
                                {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Delete") && (
                                  <button
                                    className="btn btn-danger btn-sm m-1"
                                    onClick={() => deleteLeaves(eachItem.id)}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>)}
                              </td>)}
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>)}

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
                      className={`btn btn-sm btn-primary m-1 ${page === pageNumber ? "active" : ""
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
    </div>
  );
};

export default Leaves;
