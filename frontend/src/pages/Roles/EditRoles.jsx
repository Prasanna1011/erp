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
  CardText,
  CardTitle,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import {
  API_METHOD_NAME_GET,
  API_MODULE_NAME_GET,
  API_ROLE_ADD,
  API_ROLES_GET_UPDATE_BY_ID,
} from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";



const EditRole = () => {
  const [modulesNames, setModulesNames] = useState([]);
  const [methodsNames, setMethodsNames] = useState([]);
  const { id } = useParams();
  const [rolePermissionData, setRolePermssionData] = useState();

  document.title = "Edit Role | TechAstha"

  const navigate = useNavigate();
  const config = GetAuthToken();

  const getRolesById = async () => {
    try {
      const { data } = await axios.get(
        `${API_ROLES_GET_UPDATE_BY_ID}${id}/`,
        config
      );
      setRolePermssionData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      role_name: rolePermissionData && rolePermissionData?.role_name,
      role_description:
        rolePermissionData && rolePermissionData?.role_description,
      role_status: rolePermissionData && rolePermissionData?.role_status,
    },
    validationSchema: Yup.object({
      role_name: Yup.string().required("Role Name is Required"),
      role_description: Yup.string().required("Role Description is Required"),
      role_status: Yup.boolean(),
    }),

    onSubmit: async (values) => {
      const payload = {
        role_name: values.role_name,
        role_status: values.role_status,
        role_description: values.role_description,
        permission: modulesNames.map((moduleItem) => {
          return {
            module_id: moduleItem.id,
            method_id: methodsNames
              .filter(
                (methodItem) =>
                  values[`status_${moduleItem.id}_${methodItem.id}`]
              )
              .map((methodItem) => methodItem.id),
          };
        }),
      };
      try {
        const { data } = await axios.post(
          `${API_ROLES_GET_UPDATE_BY_ID}${id}/`,
          payload,
          config
        );
        navigate("/ta-roles");
        toast.success(`Role Updated successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Role Updated Failed`, {
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
  const getModulesNames = async () => {
    try {
      const { data } = await axios.get(API_MODULE_NAME_GET, config);
      setModulesNames(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMethods = async () => {
    try {
      const { data } = await axios.get(API_METHOD_NAME_GET, config);
      setMethodsNames(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getModulesNames();
    getMethods();
    getRolesById();
  }, []);

  useEffect(() => {
    // Check if rolePermissionData is available and set default values
    if (rolePermissionData) {
      const defaultValues = {
        role_name: rolePermissionData.role_name || "",
        role_description: rolePermissionData.role_description || "",
        role_status: rolePermissionData.role_status || false,
      };

      modulesNames.forEach((moduleItem) => {
        methodsNames.forEach((methodItem) => {
          const permission =
            rolePermissionData.permissions &&
            rolePermissionData.permissions.find(
              (perm) =>
                perm.module_id === moduleItem.id &&
                perm.method_ids.includes(methodItem.id)
            );

          const fieldName = `status_${moduleItem.id}_${methodItem.id}`;
          defaultValues[fieldName] = permission !== undefined;
        });
      });

      validation.setValues({
        ...validation.values,
        ...defaultValues,
      });
    }
  }, [modulesNames, methodsNames, rolePermissionData]);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Edit role</h3>
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
                        <Label htmlFor="role_name">Role</Label>
                        <Input
                          name="role_name"
                          id="role_name"
                          placeholder="Enter Role Name"
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.role_name || ""}
                          invalid={
                            validation.touched.role_name &&
                            validation.errors.role_name
                          }
                        />
                        {validation.touched.role_name &&
                          validation.errors.role_name && (
                            <FormFeedback type="invalid">
                              {validation.errors.role_name}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="role_description">Description</Label>
                        <Input
                          name="role_description"
                          id="role_description"
                          placeholder="Enter Description"
                          type="textarea"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.role_description || ""}
                          invalid={
                            validation.touched.role_description &&
                            validation.errors.role_description
                          }
                        />
                        {validation.touched.role_description &&
                          validation.errors.role_description && (
                            <FormFeedback type="invalid">
                              {validation.errors.role_description}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" className=" ms-0 ps-0">
                      <FormGroup check className="mt-2 ">
                        <label
                          htmlFor="role_description"
                          className="form-label "
                        >
                          Status
                        </label>
                        <br />
                        <Label check>
                          <Input
                            type="checkbox"
                            name="role_status"
                            checked={validation.values.role_status}
                            onChange={validation.handleChange}
                            className="form-control mx-2 "
                            onClick={() =>
                              validation.setFieldValue(
                                "role_status",
                                !validation.values.role_status
                              )
                            }
                          />
                          {validation.values.role_status === true ? (
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
                        {validation.touched.role_status &&
                          validation.errors.role_status && (
                            <FormFeedback className="d-block">
                              {validation.errors.role_status}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Card className="mt-5 shadow-sm bg-secondary bg-soft">
                        <h5 className="card-header bg-primary text-light border-bottom border-top text-uppercase mb-4">
                          Role Access
                        </h5>
                        <Row>
                          {modulesNames.map((moduleItem) => (
                            <Col md="4" key={moduleItem.id}>
                              <Card>
                                <h5 className="card-header bg-Dark bg-gradient  border-bottom text-uppercase">
                                  {moduleItem.options}
                                </h5>
                                <CardBody>
                                  <CardText>
                                    {methodsNames.map((methodItem) => (
                                      <Col
                                        md="12"
                                        key={methodItem.id}
                                        className="ms-0 ps-0"
                                      >
                                        <FormGroup check className=" ">
                                          <br />
                                          <Label check>
                                            {/* <Input
                                              type="checkbox"
                                              name={`status_${moduleItem.id}_${methodItem.id}`}
                                              onClick={() => {
                                                const fieldName = `status_${moduleItem.id}_${methodItem.id}`;
                                                const isChecked =
                                                  !validation.values[fieldName];

                                                validation.setFieldValue(
                                                  fieldName,
                                                  isChecked
                                                );
                                              }}
                                              checked={
                                                validation.values[
                                                  `status_${moduleItem.id}_${methodItem.id}`
                                                ]
                                              }
                                            /> */}
                                            <Input
                                              type="checkbox"
                                              name={`status_${moduleItem.id}_${methodItem.id}`}
                                              onClick={() => {
                                                const fieldName = `status_${moduleItem.id}_${methodItem.id}`;
                                                const isChecked =
                                                  !validation.values[fieldName];

                                                validation.setFieldValue(
                                                  fieldName,
                                                  isChecked
                                                );
                                              }}
                                              checked={
                                                validation.values[
                                                  `status_${moduleItem.id}_${methodItem.id}`
                                                ]
                                              }
                                            />

                                            {methodItem.method}
                                          </Label>
                                          {validation.touched[
                                            `status_${moduleItem.id}_${methodItem.id}`
                                          ] &&
                                            validation.errors[
                                              `status_${moduleItem.id}_${methodItem.id}`
                                            ] && (
                                              <FormFeedback className="d-block">
                                                {
                                                  validation.errors[
                                                    `status_${moduleItem.id}_${methodItem.id}`
                                                  ]
                                                }
                                              </FormFeedback>
                                            )}
                                        </FormGroup>
                                      </Col>
                                    ))}
                                  </CardText>
                                </CardBody>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    </Col>
                  </Row>
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

export default EditRole;
