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
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import GetAuthToken from "TokenImport/GetAuthToken"
import { API_ADD_CLIENTS, API_ADD_HOLIDAY } from "Apis/api"
import axios from "axios"
import { toast } from "react-toastify"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import { format } from "date-fns"
const AddHoliday = () => {
  // Local storage token Start
  const config = GetAuthToken()

  document.title = "Add Holidays | TechAstha";

  const navigate = useNavigate()
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      holiday_title: "",
      holiday_date: "",
      status: true,
    },
    validationSchema: Yup.object({
      holiday_title: Yup.string().required("Please Enter Title"),
      holiday_date: Yup.date().required("Holiday Date required"),
      status: Yup.boolean(),
    }),
    onSubmit: async values => {
      try {
        const { data } = await axios.post(API_ADD_HOLIDAY, values, config)
        toast.success(`Holiday added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        })
        navigate("/ta-holidays")
      } catch (error) {
        toast.error(`Something went Wrong`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        })
      }
    },
  })
  // form validation End
  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Create Holidays</h3>
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
                        <Label htmlFor="holiday_title">Holiday Title</Label>
                        <Input
                          name="holiday_title"
                          id="holiday_title"
                          placeholder="Holiday Title"
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.holiday_title || ""}
                          invalid={
                            validation.touched.holiday_title &&
                            validation.errors.holiday_title
                          }
                        />
                        {validation.touched.holiday_title &&
                          validation.errors.holiday_title && (
                            <FormFeedback type="invalid">
                              {validation.errors.holiday_title}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label htmlFor="holiday_date" className="form-label">
                          Joined On
                        </label>
                        <Flatpickr
                          id="holiday_date"
                          name="holiday_date"
                          placeholder="dd-mm-yyyy"
                          className={`form-control ${
                            validation.touched.holiday_date &&
                            validation.errors.holiday_date
                              ? "is-invalid"
                              : ""
                          }`}
                          value={validation.values.holiday_date}
                          onChange={date => {
                            const formattedDate = format(date[0], "yyyy-MM-dd") // Format the date
                            validation.setFieldValue(
                              "holiday_date",
                              formattedDate
                            )
                          }}
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                        />
                        {validation.touched.holiday_date &&
                          validation.errors.holiday_date && (
                            <div className="invalid-feedback">
                              {validation.errors.holiday_date}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" className=" ms-0 ps-0">
                      <FormGroup check className="mt-2 ">
                        <label htmlFor="holiday_date" className="form-label ">
                          Event Type :
                        </label>
                        <br />
                        <Label check>
                          <Input
                            type="checkbox"
                            name="status"
                            checked={validation.values.status}
                            onChange={validation.handleChange}
                            className="form-control mx-2 "
                            onClick={() =>
                              validation.setFieldValue(
                                "status",
                                !validation.values.status
                              )
                            }
                          />
                          Holiday
                        </Label>
                        {validation.touched.status &&
                          validation.errors.status && (
                            <FormFeedback className="d-block">
                              {validation.errors.status}
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
  )
}

export default AddHoliday
