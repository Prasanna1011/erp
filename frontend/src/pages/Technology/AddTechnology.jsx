import React from "react"
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
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import GetAuthToken from "TokenImport/GetAuthToken"
import { API_TECHNOLOGY_POST_GET } from "Apis/api"
import axios from "axios"
import { toast } from "react-toastify"
import { addTechnologyRequest } from "store/actions"
import { useSelector, useDispatch, connect } from "react-redux"

const AddTechnology = ({ addTechnologyRequest }) => {
  // Local storage token Start
  const config = GetAuthToken()

  // form validation start

  const navigate = useNavigate()
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      technology_name: "",
      is_active: true,
    },
    validationSchema: Yup.object({
      technology_name: Yup.string().required("Please Enter Title"),

      is_active: Yup.boolean(),
    }),
    onSubmit: values => {
      addTechnologyRequest(values, navigate("/ta-tech"))
    },
  })

  document.title = "Add Technology | TechAstha";

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Create Technology</h3>
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
                        <Label htmlFor="technology_name">Technology</Label>
                        <Input
                          name="technology_name"
                          id="technology_name"
                          placeholder="Enter Technology Name"
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.technology_name || ""}
                          invalid={
                            validation.touched.technology_name &&
                            validation.errors.technology_name
                          }
                        />
                        {validation.touched.technology_name &&
                          validation.errors.technology_name && (
                            <FormFeedback type="invalid">
                              {validation.errors.technology_name}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" className=" ms-0 ps-0">
                      <FormGroup check className="mt-2 ">
                        <label htmlFor="leave_days" className="form-label ">
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
                      Submit form
                    </Button>

                    <Link to={"/ta-tech-add"}>
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

// export default AddNewLocation
const mapStateToProps = state => ({
  data: state,
})

const mapDispatchToProps = dispatch => ({
  addTechnologyRequest: values => dispatch(addTechnologyRequest(values)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTechnology)

// export default AddTechnology
