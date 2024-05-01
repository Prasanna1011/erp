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
  API_GET_LEAVES_LIST,
  GET_LEAVES_BY_ID_UPDATED_LEAVES,
  APPROVE_LEAVE_API,
} from "Apis/api.js";
import GetAuthToken from "TokenImport/GetAuthToken";
import { toast } from "react-toastify";
import { DNA } from "react-loader-spinner";
import nopending from "../../../assets/images/profile-img.png"

const PendingLeaveApproval = () => {
  const [leaveData, setLeaveData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modal_center, setmodal_center] = useState(false);
  const [leavesDataById, setLeavesDataById] = useState();
  const [leaveApprovalStatus, setLeaveApprovalStatus] = useState("Approved");
  const [leaveApprovalComments, setLeaveApprovalComments] = useState();
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false)
  const config = GetAuthToken();

  document.title = "Pending Leave Approvals | TechAstha";

  const getLeavesById = async (id) => {
    setmodal_center(!modal_center);
    try {
      const { data } = await axios.get(
        `${GET_LEAVES_BY_ID_UPDATED_LEAVES}${id}/`,
        config
      );
      setLeavesDataById(data.data);
    } catch (error) {
      console.log("Error in getting leaves by Id", error);
    }
  };

  const approveLeave = async (id) => {
    const payload = {
      status: leaveApprovalStatus,
      l_notes: leaveApprovalComments,
    };
    try {
      const { data } = await axios.post(
        `${APPROVE_LEAVE_API}${id}/`,
        payload,
        config
      );
      toast.success(`Leave  Status Updated Successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getLeavesData();
      setmodal_center(false);
    } catch (error) {
      toast.error(`Leave  Status is Not Updated.`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const getLeavesData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${API_GET_LEAVES_LIST}?employee_id=${""}&from_date=${""}&status=${"Pending"}&to_date=${""}`,
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
      setLoading(false)
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

  useEffect(() => {
    getLeavesData();
  }, [pageNumber, pageSize, nextPage, previousPage]);

  if (loading === true) {
    return <div
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
  }

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
              style={{ overflowY: "auto", height: "auto" }}
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
                    leavesDataById.leave_total_data.map((eachLeave, index) => (
                      <tr key={index}>
                        <td>{eachLeave.leave_date}</td>
                        <td>{eachLeave.leave_day}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label>Select Status</Label>
                  <Input
                    type="select"
                    onChange={(e) => setLeaveApprovalStatus(e.target.value)}
                  >
                    <option value="Approved" selected>
                      Approved
                    </option>
                    <option value="Rejected">Rejected</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label>Comments, If any</Label>
                  <Input
                    type="textarea"
                    onChange={(e) => setLeaveApprovalComments(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={() =>
                  approveLeave(leavesDataById && leavesDataById.leave_data.id)
                }
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Pending Leave Approvals</h3>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            <Card className="pb-5">
              <CardBody>
                {leaveData && leaveData.length > 0 ? (
                  <div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">No.</th>
                          <th className="text-center">UserName</th>
                          <th className="text-center">Leave Type</th>
                          <th className="text-center">Start Date</th>
                          <th className="text-center">End Date</th>
                          <th className="text-center">Applied Date</th>
                          <th className="text-center">Total Days</th>
                          <th className="text-center">Actions</th>
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

                              <td className="text-center">
                                {eachItem.startdate}
                              </td>
                              <td className="text-center">
                                {eachItem.enddate}
                              </td>
                              <td className="text-center">
                                {eachItem.leave_apply_date.split("T")[0]}
                              </td>
                              <td className="text-center">
                                {eachItem.totaldays}
                              </td>

                              <td className="text-center">
                                <button
                                  className="btn btn-primary btn-sm m-1"
                                  onClick={() => getLeavesById(eachItem.id)}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Row className="justify-content-center">
                  <Col lg={4}>
                    <div className="maintenance-img">
                      <img src={nopending} alt="" className="img-fluid mx-auto d-block" />
                    </div>
                  </Col>
                  <h3 className="text-center m-3">No Pending Leave Approvals!</h3>
                </Row>
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
    </div>
  );
};

export default PendingLeaveApproval;
