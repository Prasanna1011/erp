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
import { API_GET_USERS, GET_PAGINATED_REPORTS_DATA } from "Apis/api";
import { DNA } from "react-loader-spinner";

const LogsData = () => {
  const [logsData, setLogsData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [filterBy, setFilterBy] = useState(false);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const config = GetAuthToken();

  document.title = "Logs | TechAstha";

  const getLogsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${GET_PAGINATED_REPORTS_DATA}?page=${pageNumber}&page_size=${pageSize}&from_date=${fromDate}&to_date=${toDate}&employee_id=${employee_id}&search=${search}`,
        config
      );
      setLogsData(data.results);
      setLoading(false);
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
      setLoading(false);
    }
  };

  const getUsersData = async () => {
    try {
      const { data } = await axios.get(API_GET_USERS, config);
      setUser(data.data);
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
    getLogsData();
    getUsersData();
  }, [pageNumber, pageSize, fromDate, toDate, search, employee_id]);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Logs</h3>
                <div>
                  <Button
                    className="px-4 me-2"
                    color="warning"
                    onClick={() => setFilterBy(!filterBy)}
                  >
                    Filter
                  </Button>
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
                  <label className="text-bold text-dark">Start Date :</label>
                  <Input
                    type="date"
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="me-2">
                  <label className="text-bold text-dark">End Date :</label>
                  <Input
                    type="date"
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div className="me-2">
                  <label className="text-bold text-dark">Search :</label>
                  <Input
                    type="search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-bold text-dark">
                    Search By User :
                  </label>
                  <Input
                    type="select"
                    onChange={(e) => setEmployeeId(e.target.value)}
                  >
                    <option disabled selected value="">
                      Select User
                    </option>
                    {user &&
                      user?.map((eachUser) => (
                        <option value={eachUser?.id}>
                          {eachUser?.firstname + eachUser?.lastname}
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
                          <th className="text-center">Created At</th>
                          <th className="text-center">Action</th>
                          <th className="text-center">Description</th>
                          <th className="text-center">IP</th>
                          <th className="text-center">Employee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsData &&
                          logsData.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">{item?.created_at}</td>
                              <td className="text-center">{item?.action}</td>
                              <td className="text-center">
                                {item?.description}
                              </td>
                              <td className="text-center">
                                {item?.ip_address === null
                                  ? "No Record"
                                  : item?.ip_address}
                              </td>
                              <td className="text-center">
                                {item?.user?.firstname + " " + item?.user?.lastname}
                              </td>
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
    </div>
  );
};

export default LogsData;
