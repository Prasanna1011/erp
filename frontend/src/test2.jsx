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
import { API_METHOD_NAME_GET, API_MODULE_NAME_GET } from "Apis/api"
import axios from "axios"
import { toast } from "react-toastify"

const AddRole = () => {
  const [modulesNames, setModulesNames] = useState([])
  const [methodsNames, setMethodsNames] = useState([])
  // Local storage token Start
  const config = GetAuthToken()

  // form validation start

  const navigate = useNavigate()
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      role_name: "",
      role_description: "",
      role_status: false,
      permission: [],
    },
    validationSchema: Yup.object({
      role_name: Yup.string().required("Please Enter Title"),
      role_description: Yup.string().required("Leave Days Must Be Required"),
      role_status: Yup.boolean(),
    }),
    onSubmit: async values => {
      // Construct the desired JSON object
      const requestBody = {
        role_name: values.role_name,
        role_description: values.role_description,
        role_status: values.role_status,
        permission: [],
      }

      // Iterate through modules and methods to build the permission array
      modulesNames.forEach(moduleItem => {
        const methods = methodsNames.map(methodItem => ({
          module_id: moduleItem.id,
          method_id: values[`status_${moduleItem.id}_${methodItem.id}`]
            ? [1, 2, 3, 4] // You can replace this with the actual method IDs
            : [],
        }))

        requestBody.permission.push(...methods)
      })

      console.log(requestBody)

      // Now, you can send `requestBody` to your server using Axios or any other HTTP library.
      // For example:
      // const response = await axios.post("/your-api-endpoint", requestBody);

      // Handle the response here, and navigate if needed.
    },
  })
  // form validation End

  // Get Module names start
  const getModulesNames = async () => {
    const { data } = await axios.get(API_MODULE_NAME_GET, config)
    setModulesNames(data.data)
    console.log(modulesNames)
  }
  // Get Module names End

  // Get Methods  start
  const getMethods = async () => {
    const { data } = await axios.get(API_METHOD_NAME_GET, config)
    setMethodsNames(data.data)
    console.log(modulesNames)
  }
  // Get Methods End

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
                            name="method_status"
                            checked={validation.values.method_status}
                            onChange={validation.handleChange}
                            className="form-control mx-2 "
                            onClick={() =>
                              validation.setFieldValue(
                                "method_status",
                                !validation.values.method_status
                              )
                            }
                          />
                          {validation.values.method_status === true ? (
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
                        {validation.touched.method_status &&
                          validation.errors.method_status && (
                            <FormFeedback className="d-block">
                              {validation.errors.method_status}
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
                                              onClick={
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



onSubmit: async values => {
  // Create the final payload in the desired format
  const payload = {
    role_name: values.role_name,
    role_status: values.role_status,
    permission: modulesNames.map(moduleItem => {
      return {
        module_id: moduleItem.id,
        method_id: methodsNames.map(methodItem =>
          values[`status_${moduleItem.id}_${methodItem.id}`]
            ? methodItem.id
            : null
        ),
      };
    },
  };

  // Log the payload
  console.log(payload);

  try {
    // Send a POST request to the API
    const response = await axios.post(API_ROLE_ADD, payload, config);

    // Handle the response as needed
    console.log('Response:', response.data);

    // You can also store the response data in a variable if needed
    const responseData = response.data;
  } catch (error) {
    // Handle errors, e.g., network issues or server errors
    console.error('Error:', error);
  }
}
