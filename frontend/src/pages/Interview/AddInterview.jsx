import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

//Import Date Picker
// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { validationSchema } from "./Validation";
import FormikSelect from "components/Formik/FormikSelect";
import {
  API_ADD_INTERVIEW,
  API_GET_INTERVIEW_BY_ID,
  API_GET_SENIOR,
  API_TECHNOLOGY_POST_GET,
  API_UPDATE_INTERVIEW,
  API_GET_SENIORS_FOR_SINGLE_VALUE,
} from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken";
import DatePicker from "components/Formik/DatePicker";
import { OptionStatus } from "constants/basic";

const AddInterview = () => {
  //meta title
  const config = GetAuthToken();
  const navigate = useNavigate();

  const { id } = useParams();

  const [interviewData, setInterviewData] = useState(null);

  const [technology, setTechnology] = useState([]);
  const [seniors, setSeniors] = useState([]);

  document.title = "Add Interview | TechAstha";

  useEffect(() => {
    const getInterviewById = async (id) => {
      const { data } = await axios.get(
        `${API_GET_INTERVIEW_BY_ID}${id}/`,
        config
      );
      setInterviewData(data);
    };
    id && getInterviewById(id);
  }, [id]);

  useEffect(() => {
    getTechnolgy();
    getSeniors();
  }, []);

  const getTechnolgy = async () => {
    try {
      const { data } = await axios.get(API_TECHNOLOGY_POST_GET, config);
      setTechnology(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSeniors = async () => {
    try {
      const { data } = await axios.get(
        API_GET_SENIORS_FOR_SINGLE_VALUE,
        config
      );
      setSeniors(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const OptionTechnology =
    technology &&
    technology.map((i) => {
      return {
        value: i?.technology_id,
        label: i?.technology_name,
      };
    });

  const OptionSeniors =
    seniors &&
    seniors.map((i) => {
      return {
        value: i?.id,
        label: i?.firstname,
      };
    });

  const initialValues = id
    ? {
        is_fresher: interviewData && interviewData?.is_fresher,
        is_walk_in: interviewData && interviewData?.is_walk_in,
        candidate_name: interviewData && interviewData?.candidate_name,
        total_work_experience:
          interviewData && interviewData?.total_work_experience,
        interview_link: interviewData && interviewData?.interview_link,
        interview_status: interviewData && interviewData?.interview_status,

        interview_status:
          {
            value: interviewData && interviewData?.interview_status,
            label: interviewData && interviewData?.interview_status,
          } || "",
        select_technology:
          {
            value: interviewData && interviewData?.select_technology?.id,
            label:
              interviewData &&
              interviewData?.select_technology?.technology_name,
          } || "",
        interview_assign_to:
          {
            value: interviewData && interviewData?.interview_assign_to?.id,
            label:
              interviewData && interviewData?.interview_assign_to?.firstname,
          } || "",
        interview_date: interviewData && interviewData?.interview_date,

        cv_upload: "",
        interview_notes: interviewData && interviewData?.interview_notes,
        feedback_note: (interviewData && interviewData?.feedback_note) || "",
      }
    : {
        is_fresher: true,
        is_walk_in: true,

        candidate_name: "",
        total_work_experience: "",
        interview_link: "",
        interview_date: "",

        interview_status: [],
        select_technology: "",
        interview_assign_to: [],

        cv_upload: "",
        interview_notes: "",
        feedback_note: "",
      };

  const onSubmit = async (values, actions) => {
    try {
      // Handle form submission logic here
      const modifiedValues = {
        ...values,
        select_technology: values.select_technology.value,
        interview_assign_to: values.interview_assign_to.value,
        interview_status: values.interview_status.value,
      };

      const formData = new FormData();

      // Merge the form data with the original values
      for (const key in modifiedValues) {
        if (values[key] !== null && modifiedValues[key] !== undefined) {
          formData.append(key, modifiedValues[key]);
        }
      }
      // const apiUrl = id ? `${API_UPDATE_INTERVIEW}${id}/` : API_ADD_INTERVIEW;
      // const { data } = await axios.post(apiUrl, formData, config);

      if (id) {
        const { data } = await axios.put(
          `${API_UPDATE_INTERVIEW}${id}/`,
          formData,
          config
        );
        navigate("/ta-interviews");
      } else {
        // If id doesn't exist, it means you want to create a new resource
        const { data } = await axios.post(API_ADD_INTERVIEW, formData, config);
      }
      const msg = id
        ? "Interview Updated successfully"
        : "Interview added successfully";
      navigate("/ta-interviews");
      toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      actions.setSubmitting(false);
    } catch (error) {
      toast.error(`Something went Wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Interview" breadcrumbItem="Schedule Interview" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  {/* <CardTitle className="mb-4">Set Interview Schedule</CardTitle> */}
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                  >
                    {({
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      handleBlur,
                      handleChange,
                    }) => (
                      <Form>
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <div className="form-check form-switch mb-3">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="is_fresher"
                                  name="is_fresher"
                                  checked={values.is_fresher}
                                  onChange={handleChange}
                                  onClick={() =>
                                    setFieldValue(
                                      "is_fresher",
                                      !values.is_fresher
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="customSwitchsizesm"
                                >
                                  Is Fresher
                                </label>

                                {touched.is_fresher && errors.is_fresher && (
                                  <FormFeedback className="d-block">
                                    {errors.is_fresher}
                                  </FormFeedback>
                                )}
                              </div>
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <div className="form-check form-switch mb-3">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="is_walk_in"
                                  name="is_walk_in"
                                  checked={values.is_walk_in}
                                  onChange={handleChange}
                                  onClick={() =>
                                    setFieldValue(
                                      "is_walk_in",
                                      !values.is_walk_in
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="customSwitchsizesm"
                                >
                                  Is Walkin
                                </label>

                                {touched.is_walk_in && errors.is_walk_in && (
                                  <FormFeedback className="d-block">
                                    {errors.is_walk_in}
                                  </FormFeedback>
                                )}
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col md="6">
                            <FormGroup>
                              <Label for="candidate_name">Candidate Name</Label>
                              <Field
                                type="text"
                                name="candidate_name"
                                id="candidate_name"
                                as={Input}
                                invalid={
                                  errors.candidate_name &&
                                  touched.candidate_name
                                }
                              />
                              {/* Display validation error if any */}
                              {errors.candidate_name &&
                                touched.candidate_name && (
                                  <div className="invalid-feedback">
                                    {errors.candidate_name}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          {/* <Col md="6">
                            <FormGroup>
                              <DatePicker
                                label="Select a date"
                                name="interview_date"
                                id="interview_date"
                                invalid={
                                  errors.interview_date &&
                                  touched.interview_date
                                }
                              />
                              {errors.interview_date &&
                                touched.interview_date && (
                                  <div className="invalid-feedback">
                                    {errors.interview_date}
                                  </div>
                                )}
                            </FormGroup>
                          </Col> */}
                          <Col md="6">
                            <FormGroup>
                              <DatePicker
                                label="Select a date"
                                name="interview_date"
                                id="interview_date"
                                invalid={
                                  errors.interview_date &&
                                  touched.interview_date
                                }
                              />
                              {errors.interview_date &&
                                touched.interview_date && (
                                  <div className="invalid-feedback">
                                    {errors.interview_date}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          {!values.is_fresher && (
                            <Col md="6">
                              <FormGroup>
                                <Label for="total_work_experience">
                                  Total Work Experience
                                </Label>
                                <Field
                                  type="number"
                                  name="total_work_experience"
                                  id="total_work_experience"
                                  as={Input}
                                  invalid={
                                    errors.total_work_experience &&
                                    touched.total_work_experience
                                  }
                                />
                                {/* Display validation error if any */}
                                {errors.total_work_experience &&
                                  touched.total_work_experience && (
                                    <div className="invalid-feedback">
                                      {errors.total_work_experience}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>
                          )}
                          {!values.is_walk_in && (
                            <Col md="6">
                              <FormGroup>
                                <Label for="interview_link">
                                  Interview Link
                                </Label>
                                <Field
                                  type="text"
                                  name="interview_link"
                                  id="interview_link"
                                  as={Input}
                                  invalid={
                                    errors.interview_link &&
                                    touched.interview_link
                                  }
                                />
                                {/* Display validation error if any */}
                                {errors.interview_link &&
                                  touched.interview_link && (
                                    <div className="invalid-feedback">
                                      {errors.interview_link}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>
                          )}
                        </Row>
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <FormikSelect
                                id="interview_status"
                                name="interview_status"
                                label="Select Status "
                                isMulti={false}
                                options={OptionStatus}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <FormikSelect
                                id="select_technology"
                                name="select_technology"
                                label="Select Technology "
                                isMulti={false}
                                options={OptionTechnology}
                              />
                            </FormGroup>
                          </Col>
                          {/* <Col md="4">
                            <FormGroup>
                              <FormikSelect
                                id="interview_assign_to"
                                name="interview_assign_to "
                                label="Interview Assign To "
                                isMulti={false}
                                options={OptionSeniors}
                              />
                            </FormGroup>
                          </Col> */}
                          <Col md="4">
                            <FormGroup>
                              <Label for="interview_assign_to">
                                Interview Assign To
                              </Label>
                              <Input
                                type="select"
                                id="interview_assign_to"
                                name="interview_assign_to"
                                value={values.interview_assign_to.value}
                                onChange={(e) =>
                                  setFieldValue("interview_assign_to", {
                                    value: e.target.value,
                                    label:
                                      e.target.options[e.target.selectedIndex]
                                        .text,
                                  })
                                }
                                invalid={
                                  errors.interview_assign_to &&
                                  touched.interview_assign_to
                                }
                              >
                                <option value="" label="Select an option" />
                                {OptionSeniors.map((senior) => (
                                  <option
                                    key={senior?.value}
                                    value={senior?.value}
                                    label={senior?.label}
                                  />
                                ))}
                              </Input>
                              {touched.interview_assign_to &&
                                errors.interview_assign_to && (
                                  <FormFeedback className="d-block">
                                    {errors.interview_assign_to}
                                  </FormFeedback>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md="12">
                            <div className="mb-3">
                              <Label for="basicpill-phone_no-input3">
                                CV Upload
                              </Label>
                              <Input
                                name="cv_upload"
                                type="file"
                                className="form-control"
                                onChange={(event) => {
                                  const file =
                                    event.currentTarget.files &&
                                    event.currentTarget.files[0];

                                  // Check if a new file is selected, if not, keep the existing value
                                  setFieldValue(
                                    "cv_upload",
                                    file ? file : values.cv_upload
                                  );
                                }}
                                onBlur={handleBlur}
                                invalid={touched.cv_upload && errors.cv_upload}
                              />
                              {touched.cv_upload && errors.cv_upload ? (
                                <FormFeedback type="invalid">
                                  {errors.cv_upload}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <Label for="interview_notes">
                                Interview Notes
                              </Label>
                              <Field
                                type="textarea"
                                name="interview_notes"
                                id="interview_notes"
                                as={Input}
                                invalid={
                                  errors.interview_notes &&
                                  touched.interview_notes
                                }
                              />
                              {/* Display validation error if any */}
                              {errors.interview_notes &&
                                touched.interview_notes && (
                                  <div className="invalid-feedback">
                                    {errors.interview_notes}
                                  </div>
                                )}
                            </FormGroup>
                          </Col>
                          {values.interview_status.value == "Completed" && (
                            <Col md="12">
                              <FormGroup>
                                <Label for="interview_notes">
                                  Feedback Notes
                                </Label>
                                <Field
                                  type="textarea"
                                  name="feedback_note"
                                  id="feedback_note"
                                  as={Input}
                                  invalid={
                                    errors.feedback_note &&
                                    touched.feedback_note
                                  }
                                />
                                {/* Display validation error if any */}
                                {errors.feedback_note &&
                                  touched.feedback_note && (
                                    <div className="invalid-feedback">
                                      {errors.feedback_note}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>
                          )}
                        </Row>

                        <Button type="submit" color="primary">
                          {id ? "Update" : "Schedule Interview"}
                        </Button>

                        <Link to={"/ta-interviews"}>
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

export default AddInterview;
