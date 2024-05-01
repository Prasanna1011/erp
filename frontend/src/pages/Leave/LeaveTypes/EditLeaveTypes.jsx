import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Badge,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import {
  API_ADD_CLIENTS,
  API_ADD_HOLIDAY,
  API_ADD_LEAVE_TYPE,
  API_GET_LEAVE_TYPE_BY_ID,
  API_UPDATE_LEAVE_TYPE,
} from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
const EditLeaveTypes = () => {
  const [leaveDataById, setLeaveDataById] = useState([]);
  const { id } = useParams();
  // Local storage token Start
  const config = GetAuthToken();

  document.title = "Edit Leave Types | TechAstha";

  // form validation start

  const navigate = useNavigate();
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      leave_type: leaveDataById.leave_type || "",
      leave_days: leaveDataById.leave_days || "",
      status: leaveDataById.status || false,
    },
    validationSchema: Yup.object({
      leave_type: Yup.string().required("Please Enter Title"),
      leave_days: Yup.string()
        .required("Leave Days Must Be Required")
        .matches(/^[0-9]+$/, "Leave Days can only contain digits"),
      status: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${API_UPDATE_LEAVE_TYPE}${id}/`,
          values,
          config
        );
        toast.success(`Leave Type added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/ta-leave-types");
      } catch (error) {
        toast.error(`Something went Wrong`, {
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
  // form validation End

  // fetch data by id start
  const getLeaveTypeDataById = async () => {
    try {
      const { data } = await axios.get(
        `${API_GET_LEAVE_TYPE_BY_ID}${id}/`,
        config
      );
      setLeaveDataById(data.data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getLeaveTypeDataById();
  }, []);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Create Leave Types</h3>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={validation.handleSubmit}
                >
                  <Row>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="leave_type">Leave Type</Label>
                        <Input
                          name="leave_type"
                          id="leave_type"
                          placeholder="Enter Holiday Title"
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.leave_type || ""}
                          invalid={
                            validation.touched.leave_type &&
                            validation.errors.leave_type
                          }
                        />
                        {validation.touched.leave_type &&
                          validation.errors.leave_type && (
                            <FormFeedback type="invalid">
                              {validation.errors.leave_type}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="leave_days">Leave Days</Label>
                        <Input
                          name="leave_days"
                          id="leave_days"
                          placeholder="Enter Days"
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.leave_days || ""}
                          invalid={
                            validation.touched.leave_days &&
                            validation.errors.leave_days
                          }
                        />
                        {validation.touched.leave_days &&
                          validation.errors.leave_days && (
                            <FormFeedback type="invalid">
                              {validation.errors.leave_days}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" className=" ms-0 ps-0">
                      <FormGroup check className="mt-2 ">
                        <label htmlFor="leave_days" className="form-label ">
                          Status :
                        </label>
                        <br />
                        <Label check>
                          <Input
                            type="checkbox"
                            name="status"
                            checked={validation.values.status}
                            onChange={validation.handleChange}
                            className="form-control mx-2 "
                            onClick={() =>
                              validation.setFieldValue(
                                "status",
                                !validation.values.status
                              )
                            }
                          />
                          {validation.values.status === true ? (
                            <Button
                              type="button"
                              className="btn btn-success btn-sm "
                            >
                              <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
                              Active
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              className="btn btn-danger btn-sm"
                            >
                              <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                              Inactive
                            </Button>
                          )}
                        </Label>
                        {validation.touched.status &&
                          validation.errors.status && (
                            <FormFeedback className="d-block">
                              {validation.errors.status}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row></Row>
                  <div className="float-end mt-4">
                    <Button color="primary" type="submit">
                      Submit form
                    </Button>

                    <Link to={"/taerp-clients"}>
                      <Button
                        className="ms-2 px-4"
                        color="danger"
                        type="Cancel"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditLeaveTypes;
