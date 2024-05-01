import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_GET_CLIENTS_BY_ID, API_UPDATE_CLIENTS } from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken";



const EditClients = () => {
  const [clientData, setclientData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const config = GetAuthToken();

  // form validation start
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      client_name: clientData.client_name,
      client_email: clientData.client_email,
      client_phone_no: clientData.client_phone_no,
      client_address: clientData.client_address,
    },
    validationSchema: Yup.object({
      client_name: Yup.string().required("Please Enter Client Name"),
      client_email: Yup.string()
        .email("Invalid email address")
        .required("Please Enter Client email"),
      client_phone_no: Yup.string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must not exceed 10 digits")
        .required("Please Enter Your client_phone_no"),

      client_address: Yup.string().required("Please Enter Client Address"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${API_UPDATE_CLIENTS}${id}/`,
          values,
          config
        );

        toast.success(`Client Updated successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/taerp-clients");
      } catch (error) {
        console.log(error);
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
  const clientDataById = async () => {
    try {
      const { data } = await axios.get(
        `${API_GET_CLIENTS_BY_ID}${id}/`,
        config
      );
      setclientData(data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  document.title = "Edit Client | TechAstha";

  useEffect(() => {
    clientDataById();
  }, [id]);

  useEffect(() => {
    clientDataById();
  }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Create Client </h3>
                  <Link to="/offers-add"></Link>
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
                          <Label htmlFor="client_name">Client name</Label>
                          <Input
                            name="client_name"
                            id="client_name"
                            placeholder="Client name"
                            type="text"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values?.client_name || ""}
                            invalid={
                              validation.touched.client_name &&
                              validation.errors.client_name
                            }
                          />
                          {validation.touched.client_name &&
                            validation.errors.client_name && (
                              <FormFeedback type="invalid">
                                {validation.errors.client_name}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="client_email">Client Email id</Label>
                          <Input
                            name="client_email"
                            id="client_email"
                            placeholder="Client Email id"
                            type="text"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.client_email || ""}
                            invalid={
                              validation.touched.client_email &&
                              validation.errors.client_email
                            }
                          />
                          {validation.touched.client_email &&
                            validation.errors.client_email && (
                              <FormFeedback type="invalid">
                                {validation.errors.client_email}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="client_phone_no">
                            Client Phone No.
                          </Label>
                          <Input
                            name="client_phone_no"
                            id="client_phone_no"
                            placeholder="Client Phone No."
                            type="number"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.client_phone_no || ""}
                            invalid={
                              validation.touched.client_phone_no &&
                              validation.errors.client_phone_no
                            }
                          />
                          {validation.touched.client_phone_no &&
                            validation.errors.client_phone_no && (
                              <FormFeedback type="invalid">
                                {validation.errors.client_phone_no}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="client_address">Client Address</Label>
                          <Input
                            name="client_address"
                            id="client_address"
                            placeholder="Client Address"
                            type="textarea"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.client_address || ""}
                            invalid={
                              validation.touched.client_address &&
                              validation.errors.client_address
                            }
                          />
                          {validation.touched.client_address &&
                            validation.errors.client_address && (
                              <FormFeedback type="invalid">
                                {validation.errors.client_address}
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
    </>
  );
};

export default EditClients;
