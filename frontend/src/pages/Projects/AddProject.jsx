import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { validationSchema } from "./Validation";
import FormikSelect from "components/Formik/FormikSelect";
import {
  API_ADD_PROJECT,
  API_GET_ALL_CLIENTS,
  API_GET_USERS,
  API_UPDATE_PROJECT,
} from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken";
import { useNavigate } from "react-router-dom";

const config = GetAuthToken();

const AddProject = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);

  const navigate = useNavigate();

  const [clientsData, setClientsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    const getProjectById = async (id) => {
      const { data } = await axios.get(`${API_UPDATE_PROJECT}${id}/`, config);
      setProjectData(data.data);
    };
    id && getProjectById(id);
  }, [id]);

  useEffect(() => {
    getClientData();
    getUsers();
  }, []);

  document.title = "Add Project | TechAstha";

  const getClientData = async () => {
    try {
      const { data } = await axios.get(API_GET_ALL_CLIENTS, config);
      setClientsData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get(API_GET_USERS, config);
      setUsersData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const OptionClients = clientsData.map((client) => {
    return {
      value: client.id,
      label: client.client_name,
    };
  });

  const OptionUsers =
    usersData &&
    usersData.map((i) => ({
      value: i.id,
      label: i.firstname,
    }));

  const initialValues = id
    ? {
        name: (projectData && projectData?.name) || "",
        estimate_cost: (projectData && projectData?.estimate_cost) || "",
        estimate_hours: (projectData && projectData?.estimate_hours) || "",
        select_client: {
          value: (projectData && projectData?.select_client?.id) || "",
          label: (projectData && projectData?.select_client?.client_name) || "",
        },
        developers:
          projectData && projectData?.developers
            ? projectData.developers.map((developer) => ({
                value: developer.id,
                label: `${developer.firstname} ${developer.lastname}`,
              }))
            : [],
        description: (projectData && projectData?.description) || "",
        select_file: "",
        status: projectData && projectData?.status,
      }
    : {
        name: "",
        estimate_cost: "",
        estimate_hours: "",
        select_client: "",
        developers: [],
        description: "",
        select_file: "",
        status: true,
      };

  const onSubmit = async (values, actions) => {
    try {
      // Extract developers data
      const developersData = values.developers.map((value) => value.value);
      const modifiedValues = {
        ...values,
        select_client: values.select_client.value,
        developers: developersData,
      };

      const formData = new FormData();
      // Append form data
      for (const key in modifiedValues) {
        if (values[key] !== null && modifiedValues[key] !== undefined) {
          formData.append(key, modifiedValues[key]);
        }
      }

      // Append developers data
      formData.append("developers", JSON.stringify(developersData));

      try {
        const apiUrl = id ? `${API_UPDATE_PROJECT}${id}/` : API_ADD_PROJECT;
        const { data } = await axios.post(apiUrl, formData, config);

        navigate("/ta-projects");
        toast.success(`Project Details were successfully added`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        actions.setSubmitting(false);
      } catch (error) {
        console.log("Error submitting data:", error);
      }
    } catch (error) {
      toast.error(`Something went Wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate("/ta-projects");
    }
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Projects" breadcrumbItem="Projects" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  {/* <CardTitle className="mb-4">Create New Project</CardTitle> */}
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                    isInitialValid={true}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      handleBlur,
                    }) => (
                      <Form>
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <Label for="projectNAme">Project Name</Label>
                              <Field
                                type="text"
                                name="name"
                                id="projectNAme"
                                as={Input}
                                invalid={errors.name && touched.name}
                              />
                              {/* Display validation error if any */}
                              {errors.name && touched.name && (
                                <div className="invalid-feedback">
                                  {errors.name}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="estimate_cost">Cost Estimation</Label>
                              <Field
                                className="no-spinners"
                                type="number"
                                name="estimate_cost"
                                inputMode="numeric"
                                id="estimate_cost"
                                as={Input}
                                invalid={
                                  errors.estimate_cost && touched.estimate_cost
                                }
                              />
                              {/* Display validation error if any */}
                              {errors.estimate_cost &&
                                touched.estimate_cost && (
                                  <div className="invalid-feedback">
                                    {errors.estimate_cost}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label for="estimate_hours">Estimate Hours</Label>
                              <Field
                                className="no-spinners"
                                type="number"
                                inputMode="numeric"
                                name="estimate_hours"
                                id="estimate_hours"
                                as={Input}
                                invalid={
                                  errors.estimate_hours &&
                                  touched.estimate_hours
                                }
                              />
                              {/* Display validation error if any */}
                              {errors.estimate_hours &&
                                touched.estimate_hours && (
                                  <div className="invalid-feedback">
                                    {errors.estimate_hours}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="6">
                            <FormGroup>
                              <FormikSelect
                                name="select_client"
                                label="Select Client "
                                isMulti={false}
                                options={OptionClients}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <FormikSelect
                                name="developers"
                                label="Select Members"
                                isMulti={true}
                                options={OptionUsers}
                                value={values.developers.map((developer) => ({
                                  value: developer.id,
                                  label: `${developer.firstname} ${developer.lastname}`,
                                }))}
                                onChange={(selectedOptions) => {
                                  const selectedValues = selectedOptions.map(
                                    (option) => parseInt(option.value)
                                  );
                                  setFieldValue("developers", selectedValues);
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <Label for="description">
                                Project description
                              </Label>
                              <Field
                                type="textarea"
                                name="description"
                                id="description"
                                as={Input}
                                style={{ height: "150px" }}
                                invalid={
                                  errors.description && touched.description
                                }
                              />
                              {/* Display validation error if any */}
                              {errors.description && touched.description && (
                                <div className="invalid-feedback">
                                  {errors.description}
                                </div>
                              )}
                            </FormGroup>
                          </Col>

                          <Col md="12">
                            <div className="mb-3">
                              <Label for="basicpill-phone_no-input3">
                                Choose File
                              </Label>
                              <Input
                                name="select_file"
                                type="file"
                                className="form-control"
                                onChange={(event) => {
                                  const file =
                                    event.currentTarget.files &&
                                    event.currentTarget.files[0];

                                  // Check if a new file is selected, if not, keep the existing value
                                  setFieldValue(
                                    "select_file",
                                    file ? file : values.select_file
                                  );
                                }}
                                onBlur={handleBlur}
                                invalid={
                                  touched.select_file && errors.select_file
                                }
                              />
                              {touched.select_file && errors.select_file ? (
                                <FormFeedback type="invalid">
                                  {errors.select_file}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        <Button type="submit" color="primary">
                          {id ? "Update" : "create"}
                        </Button>
                        <Link to={"/ta-projects"}>
                          <Button
                            className="ms-2 px-4"
                            color="danger"
                            type="Cancel"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddProject;
