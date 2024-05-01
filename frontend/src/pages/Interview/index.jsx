import React, { useState, useRef, useEffect } from "react";

import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Container,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Formik } from "formik";

import GetAuthToken from "TokenImport/GetAuthToken";
import {
  API_GET_INTERVIEW,
  API_UPDATE_INTERVIEW,
  API_GET_PAGINATED_INTERVIEW_DATA,
  API_DELETE_INTERVIEW,
  API_INTERVIEW_DOWNLOAD_CSV,
  API_GET_ROLE_PERMSSIONS_DATA,
} from "Apis/api";
import axios from "axios";
import FormikSelect from "components/Formik/FormikSelect";
import { feedbackValidation } from "./Validation";
import { OptionStatus, selectionOptions } from "constants/basic";
import { toast } from "react-toastify";
import { DNA } from "react-loader-spinner";

const Interview = () => {
  const [interviewData, setInterviewData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState()

  document.title = "Interview | TechAstha";

  const config = GetAuthToken();

  const handleInterviewDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${API_DELETE_INTERVIEW}${id}/`,
        config
      );
      getInterviewData();
      toast.success(`Interview has been deleted`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
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
      const { data } = await axios.get(API_INTERVIEW_DOWNLOAD_CSV, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([data], { type: "application/csv" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `InterviewData.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toggleExportData();
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  const getInterviewData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${API_GET_PAGINATED_INTERVIEW_DATA}?page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setInterviewData(data.results);
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
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  };

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formdata = {
      ...values,
      interview_status: values.interview_status.value,
      selection_status: values.selection_status.value,
    };
    try {
      const { data } = await axios.patch(
        `${API_UPDATE_INTERVIEW}${selectedId}/`,
        formdata,
        config
      );
      handleCloseModal();
      getInterviewData();
    } catch (error) { }
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
      setPermissions(data?.select_user_role_id?.permissions)
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    getInterviewData();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchUserPermissions()
  }, [])

  const rolePermissions = permissions && permissions?.filter(eachPermission => eachPermission.module_name === "User");
  const allPermissions = [].concat(...(rolePermissions || []));


  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Interview</h3>
                  <div>
                  {allPermissions && allPermissions.find((eachItem) => eachItem?.method_name === "Export") && (
                    <Button
                      className="px-4 m-1"
                      color="secondary"
                      onClick={downloadCsv}
                    >
                      Export
                    </Button>)}
                    {allPermissions && allPermissions.find((eachItem) => eachItem?.method_name === "Add") && (
                    <Link to="/ta-interviews-add">
                      <Button className="px-4 m-1" color="primary">
                        Create
                      </Button>
                    </Link>)}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  {loading === true ? <div
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
                  </div> : (<div className="table-responsive">
                    {interviewData && interviewData.length > 0 ? (
                      <Table className="align-middle ">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center">No.</th>
                            <th className="text-center">Candidate Name</th>
                            <th className="text-center">Assign To</th>
                            <th className="text-center">Interview Slot</th>
                            <th className="text-center">Interview Link</th>
                            <th className="text-center">Technology </th>
                            <th className="text-center">Working Exp. </th>
                            <th className="text-center">Feedback Note</th>
                            <th ClassName="text-center">Selection Status</th>
                            <th className="text-center">Interview Note</th>
                            <th className="text-center">Status </th>
                            {allPermissions && allPermissions.some(eachItem => eachItem?.method_name === "Update" || eachItem?.method_name === "Delete") && (
                            <th className="text-center">Actions</th>
                          )}
                          </tr>
                        </thead>

                        <tbody className="">
                          {interviewData &&
                            interviewData.map((item, index) => (
                              <tr key={item?.id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item?.candidate_name}
                                </td>
                                <td className="text-center">
                                  {item?.interview_assign_to?.firstname}
                                </td>
                                <td className="text-center">
                                  {item?.interview_date
                                    ? new Date(
                                      item.interview_date
                                    ).toLocaleString("en-US", {
                                      hour12: true,
                                      year: "numeric",
                                      month: "numeric",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                    })
                                    : "No Date"}
                                </td>
                                <td className="text-center">
                                  {item?.interview_link ? (
                                    <a
                                      href={item.interview_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Interview Link
                                    </a>
                                  ) : (
                                    <div>Walk In</div>
                                  )}
                                </td>

                                <td className="text-center">
                                  {item?.select_technology?.technology_name}
                                </td>
                                <td className="text-center">
                                  {item?.total_work_experience
                                    ? item.total_work_experience
                                    : "Fresher"}
                                </td>
                                <td className="text-center">
                                  {item?.feedback_note === null
                                    ? "No Record"
                                    : item?.feedback_note}
                                </td>
                                <td className="text-center">
                                  {item?.selection_status}
                                </td>
                                <td className="text-center">
                                  {item?.interview_notes === null
                                    ? "No Record"
                                    : item?.interview_notes}
                                </td>
                                <td className="text-center">
                                  {item?.interview_status === "Active" ? (
                                    <Button
                                      type="button"
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleOpenModal(item.id)}
                                    >
                                      <i className="bx bx-check font-size-16 align-middle me-2"></i>
                                      Active
                                    </Button>
                                  ) : item?.interview_status === "Completed" ? (
                                    <Button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                    // onClick={() => handleOpenModal(item.id)}
                                    >
                                      <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                                      Completed
                                    </Button>
                                  ) : item?.interview_status === "Cancel" ? (
                                    <Button
                                      type="button"
                                      className="btn btn-warning btn-sm"
                                    >
                                      <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                                      Canceled
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                    // onClick={() => statusToggle(item.id)}
                                    // disabled={isStatusDisable}
                                    >
                                      <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                                      Inactive
                                    </Button>
                                  )}
                                </td>
                                {allPermissions && allPermissions.some(eachItem => eachItem?.method_name === "Update" || eachItem?.method_name === "Delete") && (
                                <td className="text-center">
                                  {allPermissions && allPermissions.find((eachItem) => eachItem?.method_name === "Update") && (
                                  <Link to={`/ta-inetrview-edit/${item?.id}`}>
                                    <Button
                                      color="warning"
                                      className="btn  btn-sm m-2"
                                    >
                                      <i className="fas fa-pen-fancy"></i>
                                    </Button>
                                  </Link>)}
                                  {allPermissions && allPermissions.find((eachItem) => eachItem?.method_name === "Delete") && (
                                  <Button
                                    color="danger"
                                    className="btn  btn-sm m-2"
                                    onClick={() =>
                                      handleInterviewDelete(item?.id)
                                    }
                                  >
                                    <i className="fas fa-trash"></i>
                                  </Button>)}
                                </td>)}
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p>No interview data available</p>
                    )}
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
        <Modal isOpen={showModal} toggle={handleCloseModal}>
          <ModalHeader toggle={handleCloseModal}>Feedback Form</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                interview_status: "",
                feedback_note: "",
                selection_status: "",
              }}
              validationSchema={feedbackValidation}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange, handleSubmit }) => (
                <Card>
                  <CardBody>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <FormikSelect
                              id="interview_status"
                              name="interview_status"
                              label="Interview Status "
                              isMulti={false}
                              options={OptionStatus}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <FormikSelect
                              id="selection_status"
                              name="selection_status"
                              label="Interview selection_status "
                              isMulti={false}
                              options={selectionOptions}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label for="formFeedback">Feedback</Label>
                            <Input
                              type="textarea"
                              name="feedback_note"
                              id="formfeedback_note"
                              rows="3"
                              value={values.feedback_note}
                              onChange={handleChange}
                              invalid={
                                errors.feedback_note && touched.feedback_note
                              }
                            />
                            {errors.feedback_note && touched.feedback_note && (
                              <div className="invalid-feedback">
                                {errors.feedback_note}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                    </Form>
                  </CardBody>
                  {/* <div className="d-flex justify-content-between">
                    <div>
                      <span className=" text-dark ms-4 me-1">Showing</span>
                      <select
                        onChange={(e) => handlePageSizeChange(e)}
                        style={{ height: "20px", marginTop: "4px" }}
                        defaultValue={pageSize}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
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
                  </div> */}
                </Card>
              )}
            </Formik>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default Interview;
