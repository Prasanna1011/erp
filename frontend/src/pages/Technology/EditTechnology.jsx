import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
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
import {
  API_TECHNOLOGY_POST_GET,
  API_TECHNOLOGY_UPDATE_GETBYID,
} from "Apis/api"
import axios from "axios"
import { toast } from "react-toastify"

const EditTechnology = () => {
  const [techDataById, setTechDataById] = useState([])
  const { id } = useParams()
  // Local storage token Start
  const config = GetAuthToken()

  document.title = "Edit Technology | TechAstha";

  // form validation start

  const navigate = useNavigate()
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      technology_name: techDataById?.technology_name || "",
      is_active: techDataById?.is_active || false,
    },
    validationSchema: Yup.object({
      technology_name: Yup.string().required("Please Enter Technology"),
      is_active: Yup.boolean(),
    }),
    onSubmit: async values => {
      try {
        const { data } = await axios.post(
          `${API_TECHNOLOGY_UPDATE_GETBYID}${id}/`,
          values,
          config
        )
        toast.success(`Technology added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        })
        navigate("/ta-tech")
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

  // get Technologydata By ID Start

  const getTechnologyDataById = async () => {
    try{
      const { data } = await axios.get(
        `${API_TECHNOLOGY_UPDATE_GETBYID}${id}/`,
        config
      )
      setTechDataById(data.data)
    }catch(error){
      console.log(error);
    }
  }


  useEffect(() => {
    getTechnologyDataById()
  }, [])

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Edit Technology</h3>
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

                    <Link to={"/ta-tech"}>
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

export default EditTechnology
