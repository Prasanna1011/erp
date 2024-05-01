import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Input,
  Container,
  Table,
  Modal,
} from "reactstrap";
import GetAuthToken from "TokenImport/GetAuthToken";
import { API_GET_DOCUMENTS_TYPE, API_DELETE_DOCUMENTS_TYPE } from "Apis/api";
import { toast } from "react-toastify";

const DocumentsType = () => {
  document.title = "Documents Type | TechAstha";
  const config = GetAuthToken();
  const [documentsData, setDocumentsData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);

  const deleteDocumentsType = async (id) => {
    try {
      const { data } = await axios.delete(`${API_DELETE_DOCUMENTS_TYPE}${id}/`, config);
      toast.success(`Document Type Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getDocumentsData()
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

  const getDocumentsData = async () => {
    try {
      const { data } = await axios.get(API_GET_DOCUMENTS_TYPE, config);
      setDocumentsData(data.results);
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
    getDocumentsData();
  }, [pageNumber, pageSize, nextPage, previousPage]);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Documents Type</h3>
                <Link to="/add-document-types">
                  <button className="btn btn-sm btn-primary">
                    Add Document Type
                  </button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <div className="table-responsive">
                  <Table className="align-middle ">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">No.</th>
                        <th className="text-center">Document Name</th>
                        <th className="text-center">Action </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentsData &&
                        documentsData.map((eachDoc, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {eachDoc?.document_name}
                            </td>
                            <td className="text-center">
                              <Link to={`/edit-documents-type/${eachDoc?.id}`}>
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
                                  deleteDocumentsType(eachDoc?.id);
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </td>
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
        </Row>
      </Container>
    </div>
  );
};

export default DocumentsType;
