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
import { API_EDIT_EMPLOYEE_AWARD_TYPE } from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";

const EditEmployeeAwardType = () => {
  const [initialAwardsData, setInitialAwardsData] = useState();
  const { id } = useParams();
  const config = GetAuthToken();
  const navigate = useNavigate();

  document.title = "Edit Award Types | TechAstha";

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (initialAwardsData && initialAwardsData.name) || "",
      is_active: (initialAwardsData && initialAwardsData.is_active) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Award Name"),
      is_active: Yup.boolean().notRequired(),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        for (const key in values) {
          if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        }
        const { data } = await axios.put(
          `${API_EDIT_EMPLOYEE_AWARD_TYPE}${id && id}/`,
          formData,
          config
        );
        toast.success(`Award Type Edit successfull`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/ta-employee-awards-type");
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


  const getEmployeeTypeInitialValues = async () => {
    try {
      const { data } = await axios.get(
        `${API_EDIT_EMPLOYEE_AWARD_TYPE}${id && id}/`,
        config
      );
      setInitialAwardsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployeeTypeInitialValues();
  }, []);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Edit Candidate Lead</h3>
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
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">Award Type</Label>
                          <Input
                            name="name"
                            placeholder="Enter Award Type"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.name || ""}
                            invalid={
                              validation.touched.name && validation.errors.name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.name && validation.errors.name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">Is Active</Label>
                          <Input
                            name="is_active"
                            type="checkbox"
                            className="form-control"
                            id="validationCustom02"
                            onClick={() =>
                              validation.setFieldValue(
                                "is_active",
                                !validation.values.is_active
                              )
                            }
                            onBlur={validation.handleBlur}
                            value={validation.values.is_active || ""}
                            invalid={
                              validation.touched.is_active &&
                              validation.errors.is_active
                                ? true
                                : false
                            }
                            checked={validation.values.is_active}
                          />
                          {validation.touched.is_active &&
                          validation.errors.is_active ? (
                            <FormFeedback type="invalid">
                              {validation.errors.is_active}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
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

export default EditEmployeeAwardType;
