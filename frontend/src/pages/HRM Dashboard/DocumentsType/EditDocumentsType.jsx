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
import { API_UPDATE_DOCUMENTS_TYPE } from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";

const EditDocumentsType = () => {
  const [documenstDataById, setDocumenstsDataById] = useState();

  const { id } = useParams();
  const config = GetAuthToken();
  const navigate = useNavigate();

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      document_name: documenstDataById?.document_name || "",
      is_active: documenstDataById?.is_active,
    },
    validationSchema: Yup.object({
      document_name: Yup.string().required("Please Enter Document Name"),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.patch(
          `${API_UPDATE_DOCUMENTS_TYPE}${id}/`,
          values,
          config
        );
        toast.success(`Document Name Updated successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/document-types");
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

  const getTechnologyDataById = async () => {
    try {
      const { data } = await axios.get(
        `${API_UPDATE_DOCUMENTS_TYPE}${id}/`,
        config
      );
      setDocumenstsDataById(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTechnologyDataById();
  }, []);

  document.title = "Edit Documents | TechAstha";
  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Edit Documents</h3>
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
                    <Col md="6  ">
                      <FormGroup className="mb-3">
                        <Label htmlFor="document_name">Document Name*</Label>
                        <Input
                          name="document_name"
                          id="document_name"
                          placeholder="Enter Document Name"
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.document_name || ""}
                          invalid={
                            validation.touched.document_name &&
                            validation.errors.document_name
                          }
                        />
                        {validation.touched.document_name &&
                          validation.errors.document_name && (
                            <FormFeedback type="invalid">
                              {validation.errors.document_name}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                    <Col md="6" className=" ms-0 ps-0">
                      <FormGroup check className="mt-2 ">
                        <label htmlFor="is_active" className="form-label ">
                          Status :
                        </label>
                        <br />
                        <Label check>
                          <Input
                            type="checkbox"
                            name="is_active"
                            checked={validation.values.is_active}
                            onChange={validation.handleChange}
                            className="form-control mx-2 "
                            onClick={() =>
                              validation.setFieldValue(
                                "is_active",
                                !validation.values.is_active
                              )
                            }
                          />
                          {validation.values.is_active === true ? (
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
                        {validation.touched.is_active &&
                          validation.errors.is_active && (
                            <FormFeedback className="d-block">
                              {validation.errors.is_active}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="float-end mt-4">
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
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

export default EditDocumentsType;
