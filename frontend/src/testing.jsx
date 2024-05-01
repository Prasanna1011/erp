import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import GetAuthToken from "TokenImport/GetAuthToken"
import {
  API_METHOD_NAME_GET,
  API_MODULE_NAME_GET,
  API_ROLE_ADD,
} from "Apis/api"
import axios from "axios"
import { toast } from "react-toastify"

const AddRole = () => {
  const [modulesNames, setModulesNames] = useState([])
  const [methodsNames, setMethodsNames] = useState([])
  const [rolePermissions, setRolePermissions] = useState([]) // To store role permissions

  const navigate = useNavigate()
  const config = GetAuthToken()

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      role_name: "",
      role_description: "",
      role_status: false || "",
    },
    validationSchema: Yup.object({
      role_name: Yup.string().required("Please Enter Title"),
      role_description: Yup.string().required("Leave Days Must Be Required"),
      role_status: Yup.boolean(),
    }),
    //   onSubmit: async values => {
    //     // Prepare the role permission data
    //     const rolePermissionsData = modulesNames.map(moduleItem => ({
    //       module_id: moduleItem.id,
    //       method_id: methodsNames
    //         .map(methodItem =>
    //           values[`status_${moduleItem.id}_${methodItem.id}`]
    //             ? methodItem.id
    //             : null
    //         )
    //         .filter(methodId => methodId !== null),
    //     }))

    //     // Create the final payload in the desired format
    //     const payload = {
    //       role_name: values.role_name,
    //       role_description: values.role_description,
    //       role_status: values.role_status,
    //       permission: rolePermissionsData,
    //     }

    //     console.log(payload)

    //     // Here, you can send the payload to your API or perform any other action with it.
    //   },
    // })

    onSubmit: async values => {
      // Create the final payload in the desired format
      const payload = {
        role_name: values.role_name,
        role_status: values.role_status,
        permission: modulesNames.map(moduleItem => {
          return {
            module_id: moduleItem.id,
            method_id: methodsNames
              .filter(
                methodItem => values[`status_${moduleItem.id}_${methodItem.id}`]
              )
              .map(methodItem => methodItem.id),
          }
        }),
      }

      // Here, you can send the payload to your API or perform any other action with it.
      console.log(payload)

      const { data } = await axios.post(API_ROLE_ADD, payload, config)
    },
  })
  const getModulesNames = async () => {
    const { data } = await axios.get(API_MODULE_NAME_GET, config)
    setModulesNames(data.data)
  }

  const getMethods = async () => {
    const { data } = await axios.get(API_METHOD_NAME_GET, config)
    setMethodsNames(data.data)
  }

  useEffect(() => {
    getModulesNames()
    getMethods()
  }, [])

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Create role</h3>
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
                          {modulesNames.map(moduleItem => (
                            <Col md="4" key={moduleItem.id}>
                              <Card>
                                <h5 className="card-header bg-Dark bg-gradient  border-bottom text-uppercase">
                                  {moduleItem.options}
                                </h5>
                                <CardBody>
                                  <CardText>
                                    {methodsNames.map(methodItem => (
                                      <Col
                                        md="12"
                                        key={methodItem.id}
                                        className="ms-0 ps-0"
                                      >
                                        <FormGroup check className=" ">
                                          <br />
                                          <Label check>
                                            <Input
                                              type="checkbox"
                                              name={`status_${moduleItem.id}_${methodItem.id}`}
                                              checked={
                                                validation.values[
                                                  `status_${moduleItem.id}_${methodItem.id}`
                                                ]
                                              }
                                              onChange={validation.handleChange}
                                              onClick={() =>
                                                !validation.values[
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
  )
}

export default AddRole
