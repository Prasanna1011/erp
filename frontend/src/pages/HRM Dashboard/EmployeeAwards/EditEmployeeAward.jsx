import React, { useState, useEffect } from "react";
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
  Table,
} from "reactstrap";
import * as Yup from "yup";
import { ErrorMessage, Field, useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import {
  API_EDIT_EMPLOYEE_AWARDS,
  API_GET_EMPLOYEE_AWARD_TYPE,
  API_GET_USERS,
} from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";

const EditEmployeeAward = () => {
  const [initialAwardsData, setInitialAwardsData] = useState();
  const [userData, setUsersData] = useState();
  const [AwardsTypeData, setAwardTypesData] = useState();
  const { id } = useParams();
  const config = GetAuthToken();
  const navigate = useNavigate();

  document.title = "Edit Employee Awards | TechAstha";

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      employee: initialAwardsData && initialAwardsData?.employee,
      award_type: initialAwardsData && initialAwardsData?.award_type,
      award_date: initialAwardsData && initialAwardsData?.award_date,
      title: initialAwardsData && initialAwardsData?.title,
      certificate: null,
    },
    validationSchema: Yup.object({
      employee: Yup.string().required("Select Employee"),
      award_type: Yup.string().required("Select Award Type"),
      award_date: Yup.date().required("Select Date"),
      certificate: Yup.mixed().required("Certificate is Required"),
      title: Yup.string().required("Title is Required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        for (const key in values) {
          if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        }
        const { data } = await axios.patch(
          `${API_EDIT_EMPLOYEE_AWARDS}${id && id}/`,
          formData,
          config
        );
        toast.success(`Award Edit successful`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/ta-employee-awards");
      } catch (error) {
        console.log(error);
        toast.error(`Something went wrong`, {
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

  const getAwardsInitialData = async () => {
    try {
      const { data } = await axios.get(
        `${API_EDIT_EMPLOYEE_AWARDS}${id && id}/`,
        config
      );
      setInitialAwardsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAwardTypeData = async () => {
    try {
      const { data } = await axios.get(API_GET_EMPLOYEE_AWARD_TYPE, config);
      setAwardTypesData(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsersData = async () => {
    try {
      const { data } = await axios.get(API_GET_USERS, config);
      setUsersData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAwardsInitialData();
    getAwardTypeData();
    getUsersData();
  }, []);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Edit Awards</h3>
              </CardBody>
            </Card>
          </Col>
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                    encType="multipart/form-data"
                  >
                    <Row>
                      <Col lg="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">
                            Select Employee
                          </Label>
                          <Input
                            type="select"
                            name="employee"
                            id="validationCustom02"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.employee || ""}
                            invalid={
                              validation.touched.employee &&
                              validation.errors.employee
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled>
                              Select Employee
                            </option>
                            {userData &&
                              userData.map(
                                (user) =>
                                  user?.status === true && (
                                    <option key={user?.id} value={user?.id}>
                                      {user?.firstname +
                                        " " +
                                        user?.lastname}
                                    </option>
                                  )
                              )}
                          </Input>
                          {validation.touched.employee &&
                          validation.errors.employee ? (
                            <FormFeedback type="invalid">
                              {validation.errors.employee}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">
                            Select Award Type
                          </Label>
                          <Input
                            type="select"
                            name="award_type"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.award_type || ""}
                            invalid={
                              validation.touched.award_type &&
                              validation.errors.award_type
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled>
                              Select Award Type
                            </option>
                            {AwardsTypeData &&
                              AwardsTypeData.map(
                                (award) =>
                                  award?.is_active === true && (
                                    <option key={award?.id} value={award?.id}>
                                      {award?.name}
                                    </option>
                                  )
                              )}
                          </Input>
                          {validation.touched.award_type &&
                          validation.errors.award_type ? (
                            <FormFeedback type="invalid">
                              {validation.errors.award_type}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom03">
                            Select Date
                          </Label>
                          <Input
                            name="award_date"
                            placeholder="Select Date"
                            type="date"
                            className="form-control"
                            id="validationCustom03"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.award_date || ""}
                            invalid={
                              validation.touched.award_date &&
                              validation.errors.award_date
                                ? true
                                : false
                            }
                          />
                          {validation.touched.award_date &&
                          validation.errors.award_date ? (
                            <FormFeedback type="invalid">
                              {validation.errors.award_date}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">Title</Label>
                          <Input
                            name="title"
                            placeholder="Enter Title"
                            type="text"
                            className="form-control"
                            id="validationCustom04"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.title || ""}
                            invalid={
                              validation.touched.title &&
                              validation.errors.title
                                ? true
                                : false
                            }
                          />
                          {validation.touched.title &&
                          validation.errors.title ? (
                            <FormFeedback type="invalid">
                              {validation.errors.title}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6" className="mb-3">
                        <Label htmlFor="certificate1">Certificate</Label>
                        {/* <Input
                          type="file"
                          className={`form-control ${
                            validation.touched.certificate &&
                            validation.errors.certificate
                              ? "is-invalid"
                              : ""
                          }`}
                          id="certificate1"
                          name="certificate"
                          onChange={(event) => {
                            const selectedFile = event.currentTarget.files[0];
                            validation.setFieldValue(
                              "certificate",
                              selectedFile || null
                            );
                          }}
                          onBlur={validation.handleBlur}
                        /> */}
                        <Input
                          type="file"
                          className={`form-control ${
                            validation.touched.certificate &&
                            validation.errors.certificate
                              ? "is-invalid"
                              : ""
                          }`}
                          id="certificate1"
                          name="certificate"
                          onChange={(event) => {
                            const selectedFile = event.currentTarget.files[0];
                            validation.setFieldValue(
                              "certificate",
                              selectedFile || null
                            );
                          }}
                        />

                        {validation.touched.certificate &&
                          validation.errors.certificate && (
                            <FormFeedback type="invalid">
                              {validation.errors.certificate}
                            </FormFeedback>
                          )}
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Row>
      </Container>
    </div>
  );
};

export default EditEmployeeAward;
