import React, { useState, useEffect } from "react";
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
  Table,
} from "reactstrap";
import * as Yup from "yup";
import { ErrorMessage, Field, useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import ReactQuill, { Quill, editor } from "react-quill";
import "react-quill/dist/quill.snow.css";

import { API_TO_ADD_LEAD, API_TECHNOLOGY_POST_GET } from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";
const AddLead = () => {
  const [techData, setTechData] = useState([]);

  document.title = "Add Lead | TechAstha";

  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ size: [] }],
      ["script", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["direction", { align: [] }],
      ["link", "image", "video", "formula"],
    ],
  };

  // Local storage token Start
  const config = GetAuthToken();

  // Local storage token End

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstname: "",
      lastname: "",
      select_gender: "",
      education: "",
      select_technology: "",
      past_company_name: "",
      experience: "",
      email_address: "",
      contact_number: "",
      ctc: "",
      ectc: "",
      source: "",
      upload_cv: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Please enter your First Name"),
      lastname: Yup.string().required("Please enter your Last Name"),
      select_gender: Yup.string().required("Please select a Gender"),
      education: Yup.string().required("Please enter your Education"),
      contact_number: Yup.string()
        .required("Please Enter Contact Number")
        .min(10, "Contact Number must be at least 10 characters")
        .max(10, "Contact Number must not exceed 10 characters"),
      select_technology: Yup.string().required("Please select a Technology"),
      past_company_name: Yup.string().required(
        "Please enter the Past Company Name"
      ),
      experience: Yup.string()
        .required("Please Enter Experience")
        .matches(/^\d+(\.\d+)?$/, "Experience must be a decimal number"),
      email_address: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter your Email Address"),
      ctc: Yup.string().required("Please enter your Current CTC"),
      ectc: Yup.string().required("Please enter your Expected CTC"),
      source: Yup.string().required("Please enter the Source"),
      upload_cv: Yup.mixed().required("Please upload your CV"),
      remarks: Yup.mixed(),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Merge the form data with the original values
        for (const key in values) {
          if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        }

        const { data } = await axios.post(API_TO_ADD_LEAD, formData, config);
        toast.success(`Lead added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/ta-hrm/lead");
      } catch (error) {
        console.log(error);
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

  //  Technology Data
  const fetchTechnologyNames = async () => {
    const { data } = await axios.get(API_TECHNOLOGY_POST_GET, config);
    setTechData(data.data);
  };

  useEffect(() => {
    fetchTechnologyNames();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Create Candidate Lead</h3>
                </CardBody>
              </Card>
            </Col>
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <Form
                      className="needs-validation"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <Row>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">
                              First name
                            </Label>
                            <Input
                              name="firstname"
                              placeholder="First name"
                              type="text"
                              className="form-control"
                              id="validationCustom01"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.firstname || ""}
                              invalid={
                                validation.touched.firstname &&
                                validation.errors.firstname
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.firstname &&
                            validation.errors.firstname ? (
                              <FormFeedback type="invalid">
                                {validation.errors.firstname}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom02">
                              Last name
                            </Label>
                            <Input
                              name="lastname"
                              placeholder="Last name"
                              type="text"
                              className="form-control"
                              id="validationCustom02"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.lastname || ""}
                              invalid={
                                validation.touched.lastname &&
                                validation.errors.lastname
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.lastname &&
                            validation.errors.lastname ? (
                              <FormFeedback type="invalid">
                                {validation.errors.lastname}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>Gender</Label>
                            <Input
                              name="select_gender"
                              type="select" // Change the input type to "select"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.select_gender || ""}
                              invalid={
                                validation.touched.select_gender &&
                                validation.errors.select_gender
                                  ? true
                                  : false
                              }
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </Input>
                            {validation.touched.select_gender &&
                            validation.errors.select_gender ? (
                              <FormFeedback type="invalid">
                                {validation.errors.select_gender}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>

                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>Education</Label>
                            <Input
                              name="education"
                              placeholder="Enter Education"
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.education || ""}
                              invalid={
                                validation.touched.education &&
                                validation.errors.education
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.education &&
                            validation.errors.education ? (
                              <FormFeedback type="invalid">
                                {validation.errors.education}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="3">
                          <FormGroup
                            className={`mb-3 ${
                              validation.touched.select_technology &&
                              validation.errors.select_technology
                                ? "has-error"
                                : ""
                            }`}
                          >
                            <Label htmlFor="select_technology">
                              Technology
                            </Label>
                            <select
                              name="select_technology"
                              id="select_technology"
                              className={`form-control ${
                                validation.touched.select_technology &&
                                validation.errors.select_technology
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.select_technology || ""}
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
                            {validation.touched.select_technology &&
                              validation.errors.select_technology && (
                                <FormFeedback type="invalid">
                                  {validation.errors.select_technology}
                                </FormFeedback>
                              )}
                          </FormGroup>
                        </Col>

                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>Past Company Name</Label>
                            <Input
                              name="past_company_name"
                              placeholder="Enter Past Company Name"
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.past_company_name || ""}
                              invalid={
                                validation.touched.past_company_name &&
                                validation.errors.past_company_name
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.past_company_name &&
                            validation.errors.past_company_name ? (
                              <FormFeedback type="invalid">
                                {validation.errors.past_company_name}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>Experience</Label>
                            <Input
                              name="experience"
                              placeholder="Enter Experience"
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.experience || ""}
                              invalid={
                                validation.touched.experience &&
                                validation.errors.experience
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.experience &&
                            validation.errors.experience ? (
                              <FormFeedback type="invalid">
                                {validation.errors.experience}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>Email </Label>
                            <Input
                              name="email_address"
                              placeholder="Enter Email "
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email_address || ""}
                              invalid={
                                validation.touched.email_address &&
                                validation.errors.email_address
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email_address &&
                            validation.errors.email_address ? (
                              <FormFeedback type="invalid">
                                {validation.errors.email_address}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>Contact Number </Label>
                            <Input
                              name="contact_number"
                              placeholder="Enter Contact Number "
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.contact_number || ""}
                              invalid={
                                validation.touched.contact_number &&
                                validation.errors.contact_number
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.contact_number &&
                            validation.errors.contact_number ? (
                              <FormFeedback type="invalid">
                                {validation.errors.contact_number}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>CTC </Label>
                            <Input
                              name="ctc"
                              placeholder="Enter CTC "
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.ctc || ""}
                              invalid={
                                validation.touched.ctc && validation.errors.ctc
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.ctc && validation.errors.ctc ? (
                              <FormFeedback type="invalid">
                                {validation.errors.ctc}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>ECTC </Label>
                            <Input
                              name="ectc"
                              placeholder="Ecpected CTC "
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.ectc || ""}
                              invalid={
                                validation.touched.ectc &&
                                validation.errors.ectc
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.ctc &&
                            validation.errors.ectc ? (
                              <FormFeedback type="invalid">
                                {validation.errors.ectc}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>Source </Label>
                            <Input
                              name="source"
                              placeholder="Enter source "
                              type="text"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.source || ""}
                              invalid={
                                validation.touched.source &&
                                validation.errors.source
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.source &&
                            validation.errors.source ? (
                              <FormFeedback type="invalid">
                                {validation.errors.source}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={3} className="mb-3">
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
                            onChange={(event) =>
                              validation.setFieldValue(
                                "upload_cv",
                                event.currentTarget.files[0]
                              )
                            }
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
                      <Row>
                        <Col md={12}>
                          <FormGroup className="mb-3 ">
                            <Label htmlFor="editor">Remarks</Label>
                            <ReactQuill
                              theme="snow"
                              name="remarks"
                              value={validation.values.remarks}
                              className={`editor-input form-control ${
                                validation.touched.remarks &&
                                validation.errors.remarks
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={(value) => {
                                validation.setFieldValue("remarks", value);
                              }}
                              onBlur={validation.handleBlur}
                              modules={modules}
                            />
                            {validation.touched.remarks &&
                            validation.errors.remarks ? (
                              <FormFeedback type="invalid">
                                {validation.errors.remarks}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button color="primary" type="submit">
                        Submit form
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddLead;
