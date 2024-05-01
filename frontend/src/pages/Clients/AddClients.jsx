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
} from "reactstrap";
import { useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import {
  API_ADD_CLIENTS,
  API_GET_CLIENTS_BY_ID,
  API_UPDATE_CLIENTS,
  API_GET_ALL_ROLES,
} from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";
import { validationSchema } from "./validation";



const AddClients = () => {
  // Local storage token Start
  const config = GetAuthToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [rolesData, setRolesData] = useState();

  document.title = "Add Client | TechAstha"

  const [clientData, setClientData] = useState({});

  useEffect(() => {
    clientDataById();
  }, [id]);
  const clientDataById = async () => {
    try {
      const { data } = await axios.get(
        `${API_GET_CLIENTS_BY_ID}${id}/`,
        config
      );
      setClientData(data.data[0]);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };

  // form validation start

  const initialValues = id
    ? {
        username: clientData?.client_username,
        password: clientData?.password,
        client_role: clientData?.client_role,
        client_name: clientData?.client_name || "",
        client_email: clientData?.client_email || "",
        client_phone_no: clientData?.client_phone_no || "",
        client_address: clientData?.client_address || "",
      }
    : {
        username: "",
        password: "",
        client_role: "",
        client_name: "",
        client_email: "",
        client_phone_no: "",
        client_address: "",
      };

  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const apiUrl = id ? `${API_UPDATE_CLIENTS}${id}/` : API_ADD_CLIENTS;

        const { data } = await axios.post(apiUrl, values, config);
        const msg = id
          ? "Client Updated successfully"
          : "Client added successfully";
        toast.success(msg, {
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
  const getRolesData = async () => {
    try {
      const { data } = await axios.get(API_GET_ALL_ROLES, config);
      setRolesData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRolesData();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>{id ? "Update" : "Create "} Client </h3>
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
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="client_email">Client Name</Label>
                          <Input
                            name="client_name"
                            id="client_name"
                            placeholder="Client Name"
                            type="text"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.client_name || ""}
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
                      <Col md="4">
                        <FormGroup>
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
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="username">User Name</Label>
                          <Input
                            name="username"
                            id="username"
                            placeholder="Client username"
                            type="text"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.username &&
                              validation.errors.username
                            }
                          />
                          {validation.touched.username &&
                            validation.errors.username && (
                              <FormFeedback type="invalid">
                                {validation.errors.username}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="client_phone_no">
                            Client Phone No.
                          </Label>
                          <Input
                            name="client_phone_no"
                            id="client_phone_no"
                            placeholder="Client Phone No."
                            type="text"
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

                      <Col md="4">
                        <FormGroup>
                          <Label for="basicpill-phone_no-input3">
                            Password *
                          </Label>
                          <Input
                            name="password"
                            placeholder="Enter Password"
                            type="password"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="client_role">
                            Select Client Role
                          </Label>
                          <Input
                            name="client_role"
                            id="client_role"
                            placeholder="Client Role"
                            type="select"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.client_role || ""}
                            invalid={
                              validation.touched.client_role &&
                              validation.errors.client_role
                            }
                          >
                            <option value="" disabled>
                              Select Role
                            </option>
                            {rolesData &&
                              rolesData.map(
                                (eachItem, index) =>
                                  eachItem.role_status == true && (
                                    <option
                                      key={index}
                                      value={eachItem.role_id}
                                    >
                                      {eachItem.role_name}
                                    </option>
                                  )
                              )}
                          </Input>
                          {validation.touched.client_role &&
                            validation.errors.client_role && (
                              <FormFeedback type="invalid">
                                {validation.errors.client_role}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup>
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
                    <div className="float-end mt-4">
                      <Button color="primary" type="submit">
                        {id ? "Update" : "Submit"}
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

export default AddClients;
