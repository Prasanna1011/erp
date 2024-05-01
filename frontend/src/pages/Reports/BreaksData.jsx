import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Table,
  Input,
  Button,
} from "reactstrap";
import { Breadcrumbs } from "@mui/material";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {
  API_BREAKS_DOWNLOAD_CSV,
  API_GET_ALL_BREAKS_DATA,
  API_GET_CHAT_USERS_LIST,
  API_GET_USERS,
} from "Apis/api";
import { DNA } from "react-loader-spinner";

const BreaksData = () => {
  const [breaksData, setBreaksData] = useState();
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState();
  const [date, setDate] = useState("");
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterBy, setFilterBy] = useState(false);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false)


  const config = GetAuthToken();
  document.title = "Breaks | Tech Astha";

  const getCheckinCheckoutDataList = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${API_GET_ALL_BREAKS_DATA}?employee_id=${employeeId}&date=${date}&page=${pageNumber}&page_size=${pageSize}&from_date=${fromDate}&to_date=${toDate}`,
        config
      );
      setBreaksData(data.results);
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
      const { data } = await axios.get(API_BREAKS_DOWNLOAD_CSV, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([data], { type: "application/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `BreaksData.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toggleExportData();
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  useEffect(() => {
    getCheckinCheckoutDataList();
    getUsersData();
  }, [
    employeeId,
    date,
    pageNumber,
    pageSize,
    nextPage,
    previousPage,
    fromDate,
    toDate,
  ]);



  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Breaks</h3>
                <div>
                  <Button
                    className="px-4 me-2"
                    color="secondary"
                    onClick={downloadCsv}
                  >
                    Export
                  </Button>
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
                        <th className="text-center">Employee</th>
                        <th className="text-center">Work Date</th>
                        <th className="text-center">Start Time </th>
                        <th className="text-center">End Time </th>
                        <th className="text-center">Break duration </th>
                      </tr>
                    </thead>

                    <tbody>
                      {breaksData &&
                        breaksData.map((eachItem, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {eachItem?.employee?.firstname +
                                " " +
                                eachItem?.employee?.lastname}
                            </td>
                            <td className="text-center">
                              {eachItem?.created_at.split("T")[0]}
                            </td>
                            <td className="text-center">
                              {eachItem?.start_time}
                            </td>
                            <td className="text-center">{eachItem.end_time ? eachItem.end_time : "__ : __"}</td>
                            <td className="text-center">
                              {eachItem.durations ? eachItem.durations : "__ : __"}
                            </td>
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

export default BreaksData;
