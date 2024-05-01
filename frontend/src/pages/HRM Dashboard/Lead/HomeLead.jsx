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
import { API_ADD_LEAD, API_BASE_URL, API_DELETE_LEAD, API_LEAD_DOWNLOAD_CSV } from "Apis/api";
import warningImage from "../../../assets/images/warning/warning.png";
import { toast } from "react-toastify";
import { DNA } from "react-loader-spinner";

const HomeLead = () => {
  const [leadData, setLeadData] = useState([]);
  const [deleteDataById, setdeleteDataById] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchContact, setSearchContact] = useState("");
  const [searchEducation, setSearchEducation] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLeadId, setSearchLeadId] = useState("");
  const [searchTechnology, setSearchTechnology] = useState("");
  const [searchUploadCv, setSearchUploadCv] = useState("");
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false)

  const config = GetAuthToken();

  document.title = "Leads | TechAstha";

  function deletePopupFun() {
    setDeletePopup(!deletePopup);
  }

  const getLeadData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${API_ADD_LEAD}?contact=${searchContact}&education=${searchEducation}&email=${searchEmail}&firstname=${searchFirstName}&lead_id=${searchLeadId}&technology=${searchTechnology}&upload_cv=${searchUploadCv}&page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setLeadData(data.results);
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
    }
  };

  const downloadCsv = async () => {
    try {
      const { data } = await axios.get(API_LEAD_DOWNLOAD_CSV, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([data], { type: "application/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `LeadData.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toggleExportData();
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  const deleteResume = async () => {
    try {
      const { data } = await axios.delete(
        `${API_DELETE_LEAD}${deleteDataById}/`,
        config
      );
      toast.success(`Technology Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getLeadData();
    } catch (error) {
      console.log(error);
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
    getLeadData();
  }, [
    pageNumber,
    pageSize,
    nextPage,
    previousPage,
    searchContact,
    searchEducation,
    searchEmail,
    searchFirstName,
    searchLeadId,
    searchTechnology,
    searchUploadCv,
  ]);

 

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Candidate Leads</h3>
                  <div>
                    <Button
                      className="px-4 me-2"
                      color="secondary"
                      onClick={downloadCsv}
                    >
                      Export
                    </Button>
                    <Link to="/ta-hrm/lead-add">
                      <Button className="px-4" color="primary">
                        Create
                      </Button>
                    </Link>
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
                          <th className="text-center">Full Name</th>
                          <th className="text-center">Email</th>
                          <th className="text-center">Contact No. </th>
                          <th className="text-center">Technology </th>
                          <th className="text-center">Education </th>
                          <th className="text-center">CV Download </th>
                          <th className="text-center">Action </th>
                        </tr>
                      </thead>

                      <tbody>
                        {leadData &&
                          leadData.map((item, index) => (
                            <tr key={item.id}>
                              <th scope="row" className="text-center">
                                {index + 1}
                              </th>
                              <td className="text-center">
                                {item.firstname} {item.lastname}
                              </td>
                              <td className="text-center">
                                {item.email_address}
                              </td>
                              <td className="text-center">
                                {item.contact_number}
                              </td>
                              <td className="text-center">
                                {item.select_technology.technology_name}
                              </td>
                              <td className="text-center">{item.education}</td>
                              <td className="text-center">
                                <a
                                  href={`${API_BASE_URL}${item.upload_cv}`}
                                  target="cv"
                                  rel="noopener noreferrer"
                                >
                                  {item.upload_cv.split("/").pop()}
                                </a>
                              </td>
                              <td className="text-center">
                                <Link to={`/ta-hrm/lead-edit/${item.id}`}>
                                  <Button
                                    color="warning"
                                    className="btn  btn-sm me-2"
                                  >
                                    <i className="fas fa-pen-fancy"></i>
                                  </Button>
                                </Link>

                                <Button
                                  color="danger"
                                  className="btn btn-warning btn-sm "
                                  onClick={() => {
                                    setdeleteDataById(item.id);
                                    deletePopupFun();
                                  }}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        {/* {(searchQuery
                          ? filteredData
                          : leadData &&
                            leadData.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                        ).map((item, index) => (
                          <tr key={item.id}>
                            <th scope="row" className="text-center">{index + 1}</th>
                            <td className="text-center">
                              {item.firstname} {item.lastname}
                            </td>
                            <td className="text-center">{item.email_address}</td>
                            <td className="text-center">{item.contact_number}</td>
                            <td className="text-center">{item.select_technology_name}</td>
                            <td className="text-center">{item.education}</td>
                            <td className="text-center">
                              <a
                                href={`${API_BASE_URL}${item.upload_cv}`}
                                target="cv"
                                rel="noopener noreferrer"
                              >
                                {item.upload_cv.split("/").pop()}
                              </a>
                            </td>
                            <td className="text-center">
                    
                              <Link to={`/ta-hrm/lead-edit/${item.id}`}>
                                <Button
                                  color="warning"
                                  className="btn  btn-sm me-2"
                                >
                                  <i className="fas fa-pen-fancy"></i>
                                </Button>
                              </Link>
              
                              <Button
                                color="danger"
                                className="btn btn-warning btn-sm "
                                onClick={() => {
                                  setdeleteDataById(item.id); 
                                  deletePopupFun();
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </td>
                          </tr>
                        ))} */}
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
            toggle={() => {
              deletePopupFun();
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">Delete Candidate Leade </h5>
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
              <p className="fs-5">
                Are you sure you want to delete this Candidate Leade?
              </p>
            </div>

            <div className="modal-footer">
              <Button
                color="danger"
                className="btn btn-warning  ms-2 px-4"
                onClick={() => {
                  deleteResume();
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

export default HomeLead;
