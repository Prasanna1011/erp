import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { GET_COMPLETE_LEAVE_HISTORY } from "Apis/api.js";
import GetAuthToken from "TokenImport/GetAuthToken";
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
import { DNA } from "react-loader-spinner";

const LeaveHistory = () => {
  const [leaveHistoryData, setLeaveHistoryData] = useState();
  const [loading, setLoading] = useState(false)
  const config = GetAuthToken();

  document.title = "Leave History | TechAstha";

  const getLeaveHistoryData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(GET_COMPLETE_LEAVE_HISTORY, config);
      setLeaveHistoryData(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    getLeaveHistoryData();
  }, []);

  const reportData = leaveHistoryData && leaveHistoryData.report;

  if (!reportData || reportData.length === 0) {
    return null;
  }

  const tableHeaders = Object.keys(reportData && reportData[0]);



  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Leave History</h3>
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
                  <Table className="align-middle">
                    <thead className="table-light">
                      <tr>
                        {tableHeaders.map((header, index) => (
                          <th key={index} className="text-center">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((rowData, rowIndex) => (
                        <tr key={rowIndex}>
                          {tableHeaders.map((header, cellIndex) => (
                            <td key={cellIndex} className="text-center">
                              {rowData[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>)}

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeaveHistory;
