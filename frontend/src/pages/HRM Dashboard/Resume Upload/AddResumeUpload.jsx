import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import {
  API_ADD_CLIENTS,
  API_ADD_HOLIDAY,
  API_ADD_LEAVE_TYPE,
  API_RESUME_UPLOAD_GET_POST,
  API_TECHNOLOGY_POST_GET,
} from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";

const AddResumeUpload = () => {
  const [techData, setTechData] = useState([]);
  // Local storage token Start
  const config = GetAuthToken();

  document.title = "Resume Upload | TechAstha";

  // form validation start

  const navigate = useNavigate();
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      technology: "",
      upload_cv: null,
    },
    validationSchema: Yup.object({
      technology: Yup.string().required("Please select technology"),
      upload_cv: Yup.mixed().required("Resume must be required"), // Change to Yup.mixed()
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("technology", values.technology);
        if (values.upload_cv) {
          formData.append("upload_cv", values.upload_cv);
        }

        const { data } = await axios.post(
          API_RESUME_UPLOAD_GET_POST,
          formData, // Use formData as the request data
          config
        );

        toast.success(`CV added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/ta-hrm/resume-upload");
      } catch (error) {
        console.error(error);
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
  // form validation End

  const fetchTechnologyNames = async () => {
    try {
      const { data } = await axios.get(API_TECHNOLOGY_POST_GET, config);
      setTechData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTechnologyNames();
  }, []);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Upload Resume</h3>
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
                  encType="multipart/form-data"
                >
                  <Row>
                    <Col md="6">
                      <FormGroup
                        className={`mb-3 ${
                          validation.touched.technology &&
                          validation.errors.technology
                            ? "has-error"
                            : ""
                        }`}
                      >
                        <Label htmlFor="technology">Technology</Label>
                        <select
                          name="technology"
                          id="technology"
                          className={`form-control ${
                            validation.touched.technology &&
                            validation.errors.technology
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.technology || ""}
                        >
                          <option value="">Select Technology</option>
                          {techData.map((item) => (
                            <option
                              key={item.technology_id}
                              value={item.technology_id}
                            >
                              {item.technology_name}
                            </option>
                          ))}
                        </select>
                        {validation.touched.technology &&
                          validation.errors.technology && (
                            <FormFeedback type="invalid">
                              {validation.errors.technology}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label htmlFor="upload_cv">Resume</Label>
                      <Input
                        type="file"
                        className={`form-control ${
                          validation.touched.upload_cv &&
                          validation.errors.upload_cv
                            ? "is-invalid"
                            : ""
                        }`}
                        id="upload_cv"
                        name="upload_cv"
                        onChange={(event) => {
                          const selectedFile = event.currentTarget.files[0];
                          validation.setFieldValue(
                            "upload_cv",
                            selectedFile || null
                          );
                        }}
                        onBlur={validation.handleBlur}
                      />

                      {validation.touched.upload_cv &&
                        validation.errors.upload_cv && (
                          <FormFeedback type="invalid">
                            {validation.errors.upload_cv}
                          </FormFeedback>
                        )}
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

export default AddResumeUpload;
