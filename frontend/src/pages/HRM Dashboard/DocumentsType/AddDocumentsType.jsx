import React from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import { useNavigate } from "react-router-dom";
import { API_POST_DOCUMENTS_TYPE } from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";

const AddDocumentsType = () => {
  document.title = "Add Documents | TechAstha";
  const config = GetAuthToken();
  const navigate = useNavigate();

  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      document_name: "",
      is_active: true,
    },
    validationSchema: Yup.object({
      document_name: Yup.string().required("Please Enter Title"),
      is_active: Yup.boolean(),
    }),
    onSubmit: async(values) => {
      try{
        const {data} = await axios.post(API_POST_DOCUMENTS_TYPE, values, config)
        toast.success(`Documents Type Added successfully`, {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          navigate("/document-types");
      }catch(error){
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

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Add Document</h3>
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

export default AddDocumentsType;
