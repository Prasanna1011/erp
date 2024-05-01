import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  API_GET_LEAVE_TYPE,
  API_GET_LEAVE_TYPE_BY_ID,
  GET_LEAVES_BY_ID_UPDATED_LEAVES,
} from "Apis/api";
import { toast } from "react-toastify";

const EditLeaves = () => {
  const location = useLocation();
  const leaveId = location && location.state.Id;
  const [leaveTypeData, setLeaveTypeData] = useState();
  const [leavesByIdData, setLeavesDataById] = useState();
  const config = GetAuthToken();
  const navigate = useNavigate();

  document.title = "EDit Leaves | TechAstha";

  const [dateTypes, setDateTypes] = useState({});

  const getLeaveTypesData = async () => {
    try {
      const { data } = await axios.get(API_GET_LEAVE_TYPE, config);
      setLeaveTypeData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: leavesByIdData && leavesByIdData.leave_data.leave_title,
      leavetype_id: leavesByIdData && leavesByIdData.leave_data.leavetype_id,
      startdate: leavesByIdData && leavesByIdData.leave_data.startdate,
      enddate: leavesByIdData && leavesByIdData.leave_data.enddate,
      reason: leavesByIdData && leavesByIdData.leave_data.reason,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Leave Title."),
      leavetype_id: Yup.string().required("Please Select Leave Type."),
      startdate: Yup.date().required("Start Date is Required."),
      enddate: Yup.date().required("End Date is Required."),
      reason: Yup.string().required("Leave Reason is Required."),
    }),
    onSubmit: async (values) => {
      const leaves = [];
      const { startdate, enddate } = values;
      const startDate = new Date(startdate);
      const endDate = new Date(enddate);

      for (
        let currentDate = startDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        leaves.push({
          leave_date: formattedDate,
          leave_day: dateTypes[formattedDate] || "Full",
        });
      }

      try {
        const { data } = await axios.post(
          `${GET_LEAVES_BY_ID_UPDATED_LEAVES}${leaveId}/`,
          { ...values, leaves },
          config
        );
        toast.success(`Leave Updated Successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/ta-leaves");
      } catch (error) {
        toast.success(`Something went wrong`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  const handleDateChange = (date, type) => {
    setDateTypes((prevDateTypes) => ({
      ...prevDateTypes,
      [date]: type,
    }));
  };

  const renderDateFields = () => {
    const { startdate, enddate } = validation.values;
    const startDate = new Date(startdate);
    const endDate = new Date(enddate);
    const dateFields = [];

    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      dateFields.push(
        <FormGroup key={formattedDate} className="mb-3">
          <Label htmlFor={`validationCustomDate_${formattedDate}`}>
            {formattedDate}
          </Label>
          <Input
            type="select"
            name={`${formattedDate}_type`}
            id={`validationCustomDate_${formattedDate}`}
            onChange={(e) => handleDateChange(formattedDate, e.target.value)}
          >
            <option value="Full" defaultValue={true}>
              Full Day
            </option>
            <option value="First Half">First Half</option>
            <option value="Second Half">Second Half</option>
          </Input>
        </FormGroup>
      );
    }

    return dateFields;
  };

  const getLeavesById = async () => {
    try {
      const { data } = await axios.get(
        `${GET_LEAVES_BY_ID_UPDATED_LEAVES}${leaveId}/`,
        config
      );
      setLeavesDataById(data.data);
    } catch (error) {
      console.log("Error in getting leaves by Id", error);
    }
  };

  useEffect(() => {
    getLeaveTypesData();
    getLeavesById();
  }, []);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col lg="8">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <h5>Edit Leave</h5>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col lg="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom01">Leave Title</Label>
                        <Input
                          name="title"
                          placeholder="Enter Leave Title"
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.title || ""}
                          invalid={
                            validation.touched.title && validation.errors.title
                              ? true
                              : false
                          }
                        />
                        {validation.touched.title && validation.errors.title ? (
                          <FormFeedback type="invalid">
                            {validation.errors.title}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom02">
                          Select Leave Type
                        </Label>
                        <Input
                          type="select"
                          name="leavetype_id"
                          id="validationCustom02"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.leavetype_id || ""}
                          invalid={
                            validation.touched.leavetype_id &&
                            validation.errors.leavetype_id
                              ? true
                              : false
                          }
                        >
                          <option value="" disabled>
                            Select Leave Type
                          </option>
                          {leaveTypeData &&
                            leaveTypeData.map(
                              (leave) =>
                                leave.status === true && (
                                  <option key={leave.id} value={leave.id}>
                                    {leave.leave_type}
                                  </option>
                                )
                            )}
                        </Input>
                        {validation.touched.leavetype_id &&
                        validation.errors.leavetype_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.leavetype_id}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom03">Start Date</Label>
                        <Input
                          name="startdate"
                          placeholder="Enter Start Date"
                          type="date"
                          className="form-control"
                          id="validationCustom03"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.startdate || ""}
                          invalid={
                            validation.touched.startdate &&
                            validation.errors.startdate
                              ? true
                              : false
                          }
                        />
                        {validation.touched.startdate &&
                        validation.errors.startdate ? (
                          <FormFeedback type="invalid">
                            {validation.errors.startdate}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom04">End Date</Label>
                        <Input
                          name="enddate"
                          placeholder="Enter Start Date"
                          type="date"
                          className="form-control"
                          id="validationCustom04"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.enddate || ""}
                          invalid={
                            validation.touched.enddate &&
                            validation.errors.enddate
                              ? true
                              : false
                          }
                        />
                        {validation.touched.enddate &&
                        validation.errors.enddate ? (
                          <FormFeedback type="invalid">
                            {validation.errors.enddate}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">{renderDateFields()}</Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom05">Task Title</Label>
                        <Input
                          name="reason"
                          placeholder="Enter Leave Reason"
                          type="textarea"
                          className="form-control"
                          id="validationCustom05"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.reason || ""}
                          invalid={
                            validation.touched.reason &&
                            validation.errors.reason
                              ? true
                              : false
                          }
                        />
                        {validation.touched.reason &&
                        validation.errors.reason ? (
                          <FormFeedback type="invalid">
                            {validation.errors.reason}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button
                    color="primary"
                    type="submit"
                    className="d-flex justify-content-end"
                  >
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <h5>Leave History</h5>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditLeaves;
