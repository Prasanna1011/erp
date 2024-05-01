import React, { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  InputGroupText,
  Label,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Button,
  InputGroup,
} from "reactstrap";
import * as Yup from "yup";
import { format } from "date-fns";
import { ErrorMessage, FieldArray, useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import classnames from "classnames";
import { Link, useParams, useHistory, useNavigate } from "react-router-dom";
import Select from "react-select";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";
import {
  API_ADD_USERS,
  API_BASE_URL,
  API_GET_ALL_DOCUMENTS_TYPE,
  API_GET_ALL_ROLES,
  API_GET_POSITIONS,
  API_GET_SENIOR,
  API_GET_USER_BY_ID,
  API_TECHNOLOGY_POST_GET,
  API_UPDATE_USER,
} from "Apis/api";
import { getValidationSchema } from "./Validation";
import { blood_groups, nearestRelativeNames } from "constants/basic";

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState([]);
  const [activeTab, setactiveTab] = useState(1);

  const { user_id } = useParams();

  const [passedSteps, setPassedSteps] = useState([1]);

  const [userRolesData, setUserRolesData] = useState([]);
  const [seniors, setSeniors] = useState([]);

  const [technologyData, setTechnologyData] = useState([]);
  const [positionData, setPositionData] = useState([]);

  const [docImages, setDocImages] = useState([]);
  const [docNames, setDocNames] = useState([]);
  const [documentTypes, setDocumentTypes] = useState();

  const [rows1, setRows1] = useState([{ id: 1 }]);
  const [formRows, setFormRows] = useState([
    { id: 1, doc_name: "", doc_file: "" },
  ]);



  const handleAddRowNested = () => {
    const newRows = [...rows1];
    newRows.push({ id: newRows.length + 1 });
    setRows1(newRows);
  };

  const handleRemoveRow = (id) => {
    if (id !== 1) {
      const newRows = rows1.filter((row) => row.id !== id);
      setRows1(newRows);
    }
  };

  const onAddFormRow = () => {
    const newFormRows = [...formRows];
    newFormRows.push({
      id: newFormRows.length + 1,
      doc_name: "",
      doc_file: null,
    });
    setFormRows(newFormRows);
  };

  const onDeleteFormRow = (id) => {
    if (id !== 1) {
      const newFormRows = formRows.filter((row) => row.id !== id);
      setFormRows(newFormRows);
    }
  };

  const handleNestedInputChange = (id, key, value) => {
    const newRows = rows1.map((row) => {
      if (row.id === id) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setRows1(newRows);
  };

  const handleFormInputChange = (id, key, value) => {
    const newFormRows = formRows.map((row) => {
      if (row.id === id) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setFormRows(newFormRows);
  };

  const handleFileChange = (id, file) => {


    const newFormRows = formRows.map((row) => {
      if (row.id === id) {
        return { ...row, doc_img: file };
      }
      return row;
    });

    setFormRows(newFormRows);
  };



  const getDocumentsTypes = async () => {
    try {
      const { data } = await axios.get(API_GET_ALL_DOCUMENTS_TYPE, config);
      setDocumentTypes(data.data);
    } catch (error) {
      console.log(error);
    }
  };





  useEffect(() => {
    const getUserById = async () => {
      const { data } = await axios.get(
        `${API_GET_USER_BY_ID}${user_id}/`,
        config
      );
      setUserData(data.data);
    };
    user_id && getUserById();
  }, [user_id]);


  useEffect(() => {
    getUserRoles();
    getTechnologies();
    getPosition();
    getSeniors();
    getDocumentsTypes();
  }, []);

  //meta title
  document.title = "Add User |  TechAstha";

  const getUserRoles = async () => {
    try {
      const { data } = await axios.get(API_GET_ALL_ROLES, config);
      setUserRolesData(data.data);
    } catch (error) {
      console.log(error);
    }
  };


  // get Technology Data Start

  const getTechnologies = async () => {
    try {
      const { data } = await axios.get(API_TECHNOLOGY_POST_GET, config);
      setTechnologyData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get Positions Data  start
  const getPosition = async () => {
    try {
      const { data } = await axios.get(API_GET_POSITIONS, config);
      setPositionData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get Seniors Data  start
  const getSeniors = async (id) => {
    try {
      const { data } = await axios.get(`${API_GET_SENIOR}`, config);
      setSeniors(data);
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();
  // token
  const config = GetAuthToken();
  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];
      if (tab >= 1 && tab <= 6) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  const initialValues = user_id
    ? {
      ...userData,
      currentStep: 1,
      last_company_name: userData && userData.last_company_name,
      last_company_designation: userData && userData.last_company_designation,
      last_company_skills: userData && userData.last_company_skills,
      last_company_joining_date:
        userData && userData.last_company_joining_date,
      last_company_reliving_date:
        userData && userData.last_company_reliving_date,
      choose_profile_picture: "",
      aadhar_card: "",
      last_qualification_certificate: "",
      select_senior_authority_id:
        userData &&
          userData.select_senior_authority_id !== undefined &&
          userData.select_senior_authority_id !== null
          ? userData.select_senior_authority_id
          : [],
      pan_card: "",
    }
    : {
      currentStep: 1,
      firstname: "",
      middlename: "",
      lastname: "",
      gender: "Male",
      choose_profile_picture: "",
      current_address: "",
      permanent_address: "",
      same_as_permanent_address: false,
      phone_no: "",
      personal_email_id: "",
      company_email_id: "",
      pan_no: "",
      d_o_b: "",
      blood_group: "A-",
      married_status: "Single" || "",
      marriage_anniversary_date: "",
      skype_id: "",
      status: true,
      native_place: "",
      emergency_contact_name: "",
      emergency_phone_no: "",
      relation_with_emergency_phone_no_id: "",
      reference_name: "",
      reference_email: "",
      reference_contact: "",
      reference_designation: "",
      comments: "",

      // tab 2
      date_of_joing: "",
      date_of_resignation: "",
      date_of_reliving: "",
      select_user_role_id: "",
      select_senior_authority_id: [],

      // tab 3
      is_fresher: true,
      last_company_name: "",
      last_company_designation: "",
      last_company_skills: "",
      last_company_joining_date: "",
      last_company_reliving_date: "",
      // work_experience_certificate: "",
      // work_experience_reliving_letter: "",
      // work_experience_salary_slip: "",

      // tab 4
      last_degree_cretificate: "",
      last_qualification_year: "",
      last_university_name: "",
      last_qualification_cgpa: "",

      // tab 5
      // aadhar_card: "",
      // pan_card: "",
      // last_qualification_certificate: "",
      doc_name: [],
      doc_img: [],


      // Tab 6
      username: "",
      password: "",
      ip_address: "",
      is_remote: true,
      select_department_id: "",
      select_position_id: "",
    };
  const onSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== null && values[key] !== undefined) {
          if (key === "select_senior_authority_id") {
            const valueToAppend = Array.isArray(values[key])
              ? values[key].map((item) => item.value)
              : [values[key].value];
            formData.append(key, JSON.stringify(valueToAppend));
          } else {
            formData.append(key, values[key]);
          }
        }
      }

      // Append doc_names to FormData
      const docNames = formRows.map(item => item.doc_name);
      if (docNames != '') {
        docNames.forEach(name => formData.append('doc_name', name));
      }
      

      // Append doc_imgs to FormData
      const docFiles = formRows.map(item => item.doc_img);
      if (docFiles != '') {
        docFiles.forEach(file => formData.append('doc_img', file));
      }


      const APIURL = user_id ? API_UPDATE_USER + `${user_id}/` : API_ADD_USERS;
      const { data } = await axios.post(APIURL, formData, config);
      navigate("/ta-user");
      const msg = user_id
        ? `User Updated successfully`
        : `User added successfully`;
      toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
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

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues,
    validationSchema: getValidationSchema(1),
    onSubmit,
  });


  const handleNext = async () => {
    const validationSchema = getValidationSchema(validation.values.currentStep);

    try {
      await validationSchema.validate(validation.values, { abortEarly: false });

      validation.setFieldValue(
        "currentStep",
        validation.values.currentStep + 1
      );

      toggleTab(activeTab + 1);
    } catch (validationErrors) {
      if (validationErrors.inner && validationErrors.inner.length >= 0) {
        validationErrors.inner.forEach((error) => {
          validation.setFieldError(error.path, error.message);
        });
      }
      const allFields = Object.keys(validation.values);
      const touchedFields = allFields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});

      validation.setTouched(touchedFields);

      toast.error("Please correct the highlighted errors before proceeding.", {
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
        <Container fluid={true}>
          <Breadcrumbs title="User" breadcrumbItem="users" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                    enctype="multipart/form-data"
                  >
                    <div className="wizard clearfix">
                      <div className="steps clearfix">
                        <ul>
                          <NavItem
                            className={classnames({ current: activeTab === 1 })}
                          >
                            <NavLink
                              className={classnames({
                                current: activeTab === 1,
                              })}
                              onClick={() => {
                                setactiveTab(1);
                                validation.setFieldValue(
                                  "currentStep",
                                  (validation.values.currentStep = 1)
                                );
                              }}
                              disabled={!(passedSteps || []).includes(1)}
                            >
                              <span className="number">1.</span> Basic Info.
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({ current: activeTab === 2 })}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === 2,
                              })}
                              onClick={() => {
                                setactiveTab(2);
                                validation.setFieldValue(
                                  "currentStep",
                                  (validation.values.currentStep = 2)
                                );
                              }}
                              disabled={!(passedSteps || []).includes(2)}
                            >
                              <span className="number">2.</span> Reporting
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({ current: activeTab === 3 })}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === 3,
                              })}
                              onClick={() => {
                                setactiveTab(3);
                                validation.setFieldValue(
                                  "currentStep",
                                  (validation.values.currentStep = 3)
                                );
                              }}
                              disabled={!(passedSteps || []).includes(3)}
                            >
                              <span className="number">3.</span>
                              History
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({ current: activeTab === 4 })}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === 4,
                              })}
                              onClick={() => {
                                setactiveTab(4);
                                validation.setFieldValue(
                                  "currentStep",
                                  (validation.values.currentStep = 4)
                                );
                              }}
                              disabled={!(passedSteps || []).includes(4)}
                            >
                              <span className="number">4.</span>
                              Education
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({ current: activeTab === 5 })}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === 5,
                              })}
                              onClick={() => {
                                setactiveTab(5);
                                validation.setFieldValue(
                                  "currentStep",
                                  (validation.values.currentStep = 5)
                                );
                              }}
                              disabled={!(passedSteps || []).includes(5)}
                            >
                              <span className="number">5.</span>Documents
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({ current: activeTab === 6 })}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === 6,
                              })}
                              onClick={() => {
                                setactiveTab(6);
                                validation.setFieldValue(
                                  "currentStep",
                                  (validation.values.currentStep = 6)
                                );
                              }}
                              disabled={!(passedSteps || []).includes(6)}
                            >
                              <span className="number">6.</span> Login Info.
                            </NavLink>
                          </NavItem>
                        </ul>
                      </div>
                      <div className="content clearfix">
                        <TabContent activeTab={activeTab} className="body">
                          <TabPane tabId={1}>
                            <Row>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="firstname">
                                    First name *
                                  </Label>
                                  <Input
                                    name="firstname"
                                    placeholder="First name"
                                    type="text"
                                    className="form-control"
                                    id="firstname"
                                    onChange={(e) => {
                                      validation.handleChange(e);
                                      validation.setFieldValue(
                                        "username",
                                        `ta_${e.target.value}`
                                      );
                                    }}
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
                                  <Label htmlFor="validationCustom01">
                                    Middle name *
                                  </Label>
                                  <Input
                                    name="middlename"
                                    placeholder="Middle name"
                                    type="text"
                                    className="form-control"
                                    id="validationCustom01"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.middlename || ""}
                                    invalid={
                                      validation.touched.middlename &&
                                        validation.errors.middlename
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.middlename &&
                                    validation.errors.middlename ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.middlename}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>

                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom02">
                                    Last name *
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

                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">Gender * </Label>
                                  <Input
                                    name="gender"
                                    type="select"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.gender || ""}
                                    invalid={
                                      validation.touched.gender &&
                                        validation.errors.gender
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="" disabled>
                                      Select Gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </Input>
                                  {validation.touched.gender &&
                                    validation.errors.gender ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.gender}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-phone_no-input3">
                                    Choose Profile Picture
                                  </Label>
                                  <Input
                                    name="choose_profile_picture"
                                    type="file"
                                    className="form-control"
                                    onChange={(event) => {
                                      const file =
                                        event.currentTarget.files &&
                                        event.currentTarget.files[0];

                                      // Check if a new file is selected, if not, keep the existing value
                                      validation.setFieldValue(
                                        "choose_profile_picture",
                                        file
                                          ? file
                                          : validation.values
                                            .choose_profile_picture
                                      );
                                    }}
                                    // onChange={event =>
                                    //   validation.setFieldValue(
                                    //     "choose_profile_picture",
                                    //     event.currentTarget.files &&
                                    //       event.currentTarget.files[0]
                                    //       ? event.currentTarget.files[0]
                                    //       : null
                                    //   )
                                    // }
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched
                                        .choose_profile_picture &&
                                      validation.errors.choose_profile_picture
                                    }
                                  />
                                  {validation.touched.choose_profile_picture &&
                                    validation.errors.choose_profile_picture ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.choose_profile_picture}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              {user_id ? (
                                <>
                                  <Col lg="6">
                                    <div className="py-2 text-center">
                                      <img
                                        className="rounded-circle avatar-lg"
                                        alt={
                                          validation.values
                                            .choose_profile_picture.name
                                        }
                                        src={`${API_BASE_URL}${userData.choose_profile_picture}`}
                                        data-holder-rendered="true"
                                      />
                                    </div>
                                  </Col>
                                </>
                              ) : (
                                <Col lg="6">
                                  {validation.values.choose_profile_picture && (
                                    <div className="py-2 text-center">
                                      {validation.values
                                        .choose_profile_picture instanceof
                                        File && (
                                          <img
                                            className="rounded-circle avatar-lg"
                                            alt={
                                              validation.values
                                                .choose_profile_picture.name
                                            }
                                            src={URL.createObjectURL(
                                              validation.values
                                                .choose_profile_picture
                                            )}
                                            data-holder-rendered="true"
                                          />
                                        )}
                                    </div>
                                  )}
                                </Col>
                              )}
                            </Row>

                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Permanent Address *</Label>
                                  <Input
                                    name="permanent_address"
                                    placeholder="Permanent Address"
                                    type="textarea"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.permanent_address || ""
                                    }
                                    invalid={
                                      validation.touched.permanent_address &&
                                        validation.errors.permanent_address
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.permanent_address &&
                                    validation.errors.permanent_address ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.permanent_address}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Current Address *</Label>
                                  <Input
                                    name="current_address"
                                    placeholder="Current Address"
                                    type="textarea"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values
                                        .same_as_permanent_address
                                        ? validation.values.permanent_address
                                        : validation.values.current_address ||
                                        ""
                                    }
                                    readOnly={
                                      validation.values
                                        .same_as_permanent_address
                                        ? true
                                        : false
                                    }
                                    invalid={
                                      validation.touched.current_address &&
                                        validation.errors.current_address
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.current_address &&
                                    validation.errors.current_address ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.current_address}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col md="12" className="ms-0 ps-0">
                                <FormGroup check className="mt-2">
                                  <Label htmlFor="">
                                    Current address same As Permanent Address *
                                  </Label>
                                  <Input
                                    type="checkbox"
                                    name="same_as_permanent_address"
                                    checked={
                                      validation.values
                                        .same_as_permanent_address
                                    }
                                    onChange={validation.handleChange}
                                    className="form-control mx-2"
                                    onClick={() => {
                                      validation.setValues({
                                        ...validation.values,
                                        same_as_permanent_address:
                                          !validation.values
                                            .same_as_permanent_address,
                                        current_address:
                                          validation.values.permanent_address,
                                      });
                                    }}
                                  />
                                  {validation.touched
                                    .same_as_permanent_address &&
                                    validation.errors
                                      .same_as_permanent_address ? (
                                    <FormFeedback className="d-block">
                                      {
                                        validation.errors
                                          .same_as_permanent_address
                                      }
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="mt-3">
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Phone No. *</Label>
                                  <Input
                                    name="phone_no"
                                    placeholder="Phone No"
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.phone_no || ""}
                                    invalid={
                                      validation.touched.phone_no &&
                                        validation.errors.phone_no
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.phone_no &&
                                    validation.errors.phone_no ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.phone_no}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Personal Email Id *</Label>
                                  <Input
                                    name="personal_email_id"
                                    placeholder="Personal Email Id"
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.personal_email_id || ""
                                    }
                                    invalid={
                                      validation.touched.personal_email_id &&
                                        validation.errors.personal_email_id
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.personal_email_id &&
                                    validation.errors.personal_email_id ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.personal_email_id}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Company Email Id *</Label>
                                  <Input
                                    name="company_email_id"
                                    placeholder="Company Email Id"
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.company_email_id || ""
                                    }
                                    invalid={
                                      validation.touched.company_email_id &&
                                        validation.errors.company_email_id
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.company_email_id &&
                                    validation.errors.company_email_id ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.company_email_id}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> PAN No.</Label>
                                  <Input
                                    name="pan_no"
                                    placeholder="Enter Pancard No."
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.pan_no || ""}
                                    invalid={
                                      validation.touched.pan_no &&
                                        validation.errors.pan_no
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.pan_no &&
                                    validation.errors.pan_no ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.pan_no}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="">
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Date Of Birth *</Label>
                                  <Input
                                    name="d_o_b"
                                    placeholder="Birth Date"
                                    type="date"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.d_o_b || ""}
                                    invalid={
                                      validation.touched.d_o_b &&
                                        validation.errors.d_o_b
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.d_o_b &&
                                    validation.errors.d_o_b ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.d_o_b}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label for="blood_group">Blood Group</Label>
                                  <Input
                                    type="select"
                                    name="blood_group"
                                    id="blood_group"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.blood_group}
                                    defaultValue={
                                      validation.values.blood_group || ""
                                    }
                                    invalid={
                                      validation.touched.blood_group &&
                                        validation.errors.blood_group
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="" disabled>
                                      Select Blood Group
                                    </option>
                                    {blood_groups.map((group, key) => (
                                      <option key={key} value={group}>
                                        {group}
                                      </option>
                                    ))}
                                  </Input>
                                  {validation.touched.blood_group &&
                                    validation.errors.blood_group ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.blood_group}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">Married Status * </Label>
                                  <Input
                                    name="married_status"
                                    type="select"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.married_status || ""
                                    }
                                    invalid={
                                      validation.touched.married_status &&
                                        validation.errors.married_status
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="" disabled>
                                      Select married_status
                                    </option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                  </Input>
                                  {validation.touched.married_status &&
                                    validation.errors.married_status ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.married_status}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>

                              <Col md="3" className=" ms-0 ps-0">
                                <FormGroup check className="mt-2 ">
                                  <label htmlFor="" className="form-label ">
                                    Status
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
                                    {validation.values.status === true ? (
                                      <Button
                                        type="button"
                                        className="btn btn-success btn-sm "
                                      >
                                        <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                                        Active
                                      </Button>
                                    ) : (
                                      <Button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                      >
                                        <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                                        InActive
                                      </Button>
                                    )}
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
                            <Row className=" border-bottom ">
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Skype Id</Label>
                                  <Input
                                    name="skype_id"
                                    placeholder="Enter Skype Id"
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.skype_id || ""}
                                    invalid={
                                      validation.touched.skype_id &&
                                        validation.errors.skype_id
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.skype_id &&
                                    validation.errors.skype_id ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.skype_id}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>

                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor=""> Native Place *</Label>
                                  <Input
                                    name="native_place"
                                    placeholder="Enter Native Place"
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.native_place || ""}
                                    invalid={
                                      validation.touched.native_place &&
                                        validation.errors.native_place
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.native_place &&
                                    validation.errors.native_place ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.native_place}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>

                              <Col lg="3">
                                {validation.values.married_status ===
                                  "Married" && (
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="">
                                        Marriage Anniversary Date
                                      </Label>
                                      <DatePicker
                                        selected={
                                          validation.values
                                            .marriage_anniversary_date
                                            ? new Date(
                                              validation.values.marriage_anniversary_date
                                            )
                                            : null
                                        }
                                        onChange={(date) => {
                                          validation.setFieldValue(
                                            "marriage_anniversary_date",
                                            date ? format(date, "yyyy-MM-dd") : ""
                                          );
                                        }}
                                        onBlur={validation.handleBlur}
                                        showTimeSelect={false}
                                        dateFormat="MMMM d, yyyy"
                                        className={`form-control ${validation.touched
                                          .marriage_anniversary_date &&
                                          validation.errors
                                            .marriage_anniversary_date
                                          ? "is-invalid"
                                          : ""
                                          }`}
                                      />
                                      {validation.touched
                                        .marriage_anniversary_date &&
                                        validation.errors
                                          .marriage_anniversary_date ? (
                                        <FormFeedback type="invalid">
                                          {
                                            validation.errors
                                              .marriage_anniversary_date
                                          }
                                        </FormFeedback>
                                      ) : null}
                                    </FormGroup>
                                  )}
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="4">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">
                                    Emergency Contact Name *
                                  </Label>
                                  <Input
                                    name="emergency_contact_name"
                                    placeholder="Emergency Contact Name"
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values
                                        .emergency_contact_name || ""
                                    }
                                    invalid={
                                      validation.touched
                                        .emergency_contact_name &&
                                        validation.errors.emergency_contact_name
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.emergency_contact_name &&
                                    validation.errors.emergency_contact_name ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.emergency_contact_name}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">
                                    Emergency Phone No. *
                                  </Label>
                                  <Input
                                    name="emergency_phone_no"
                                    placeholder="Emergency Pnone No. "
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.emergency_phone_no || ""
                                    }
                                    invalid={
                                      validation.touched.emergency_phone_no &&
                                        validation.errors.emergency_phone_no
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.emergency_phone_no &&
                                    validation.errors.emergency_phone_no ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.emergency_phone_no}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">
                                    Relationship With Emergency Phone No. *
                                  </Label>
                                  <Input
                                    type="select"
                                    name="relation_with_emergency_phone_no_id"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values
                                        .relation_with_emergency_phone_no_id ||
                                      ""
                                    }
                                    invalid={
                                      validation.touched
                                        .relation_with_emergency_phone_no_id &&
                                        validation.errors
                                          .relation_with_emergency_phone_no_id
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="" disabled>
                                      Select Relationship
                                    </option>
                                    {nearestRelativeNames.map((name, key) => (
                                      <option key={key} value={name}>
                                        {name}
                                      </option>
                                    ))}
                                  </Input>
                                  {validation.touched
                                    .relation_with_emergency_phone_no_id &&
                                    validation.errors
                                      .relation_with_emergency_phone_no_id ? (
                                    <FormFeedback type="invalid">
                                      {
                                        validation.errors
                                          .relation_with_emergency_phone_no_id
                                      }
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">Reference Name</Label>
                                  <Input
                                    name="reference_name"
                                    placeholder="Reference Name "
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.reference_name || ""
                                    }
                                    invalid={
                                      validation.touched.reference_name &&
                                        validation.errors.reference_name
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.reference_name &&
                                    validation.errors.reference_name ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.reference_name}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">Reference Email</Label>
                                  <Input
                                    name="reference_email"
                                    placeholder="Refrence Email "
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.reference_email || ""
                                    }
                                    invalid={
                                      validation.touched.reference_email &&
                                        validation.errors.reference_email
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.reference_email &&
                                    validation.errors.reference_email ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.reference_email}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">Reference Contact</Label>
                                  <Input
                                    name="reference_contact"
                                    placeholder="Refrence Contact "
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.reference_contact || ""
                                    }
                                    invalid={
                                      validation.touched.reference_contact &&
                                        validation.errors.reference_contact
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.reference_contact &&
                                    validation.errors.reference_contact ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.reference_contact}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                              <Col lg="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">
                                    Reference Designation
                                  </Label>
                                  <Input
                                    name="reference_designation"
                                    placeholder="Refrence Designation "
                                    type="text"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation?.values
                                        ?.reference_designation || ""
                                    }
                                    invalid={
                                      validation.touched
                                        .reference_designation &&
                                        validation.errors.reference_designation
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.reference_designation &&
                                    validation.errors.reference_designation ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.reference_designation}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="12">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="">Comments</Label>
                                  <Input
                                    name="comments"
                                    placeholder="Enter Comment "
                                    type="textarea"
                                    className="form-control"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.comments || ""}
                                    invalid={
                                      validation.touched.comments &&
                                        validation.errors.comments
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.comments &&
                                    validation.errors.comments ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.comments}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                          </TabPane>
                          <TabPane tabId={2}>
                            <div>
                              <Row>
                                <Col lg="4">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="">Date Of Joining *</Label>
                                    <Input
                                      name="date_of_joing"
                                      placeholder="Date Of Joining  "
                                      type="date"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values.date_of_joing || ""
                                      }
                                      invalid={
                                        validation.touched.date_of_joing &&
                                          validation.errors.date_of_joing
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.date_of_joing &&
                                      validation.errors.date_of_joing ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.date_of_joing}
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>
                                <Col lg="4">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="">
                                      Date of Resignation{" "}
                                    </Label>
                                    <Input
                                      name="date_of_resignation"
                                      placeholder="Date Of Resignation  "
                                      type="date"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values.date_of_resignation ||
                                        ""
                                      }
                                      invalid={
                                        validation.touched
                                          .date_of_resignation &&
                                          validation.errors.date_of_resignation
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.date_of_resignation &&
                                      validation.errors.date_of_resignation ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.date_of_resignation}
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>
                                <Col lg="4">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor=""> Date of Reliving </Label>
                                    <Input
                                      name="date_of_reliving"
                                      placeholder="Date Of Reliving  "
                                      type="date"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values.date_of_reliving || ""
                                      }
                                      invalid={
                                        validation.touched.date_of_reliving &&
                                          validation.errors.date_of_reliving
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.date_of_reliving &&
                                      validation.errors.date_of_reliving ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.date_of_reliving}
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>
                                <Col lg="4">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="userRole">
                                      User Role *
                                    </Label>
                                    <Input
                                      type="select"
                                      name="select_user_role_id"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values.select_user_role_id ||
                                        []
                                      }
                                      invalid={
                                        validation.touched
                                          .select_user_role_id &&
                                          validation.errors.select_user_role_id
                                          ? true
                                          : false
                                      }
                                    >
                                      <option value="" disabled>
                                        Select User Role
                                      </option>
                                      {userRolesData.map((item, index) => (
                                        <option
                                          key={index}
                                          value={parseInt(item.role_id, 10)}
                                        >
                                          {item.role_name}
                                        </option>
                                      ))}
                                    </Input>
                                    {validation.touched.select_user_role_id &&
                                      validation.errors.select_user_role_id ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.select_user_role_id}
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>

                                <Col lg="4">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="userRole">
                                      Select Senior Authority *
                                    </Label>
                                    <Select
                                      name="select_senior_authority_id"
                                      className={
                                        validation.errors
                                          .select_senior_authority_id &&
                                          validation.touched
                                            .select_senior_authority_id
                                          ? "is-invalid"
                                          : ""
                                      }
                                      options={
                                        seniors &&
                                        seniors.map((item) => ({
                                          value: item.id,
                                          label: item.name,
                                        }))
                                      }
                                      isMulti
                                      onChange={(selectedOptions) => {
                                        // Handle the change of selected options here
                                        validation.setFieldValue(
                                          "select_senior_authority_id",
                                          selectedOptions
                                        );
                                      }}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values
                                          .select_senior_authority_id || []
                                      }
                                    />
                                    {validation.touched
                                      .select_senior_authority_id &&
                                      validation.errors
                                        .select_senior_authority_id && (
                                        <FormFeedback type="invalid">
                                          {
                                            validation.errors
                                              .select_senior_authority_id
                                          }
                                        </FormFeedback>
                                      )}
                                  </FormGroup>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane tabId={3}>
                            <div>
                              <Row>
                                <Col lg="12">
                                  <FormGroup className="mt-2 ">
                                    <div className=" form-check-right">
                                      <Label>Is Fresher</Label>
                                      <Input
                                        type="checkbox"
                                        name="is_fresher"
                                        checked={validation.values.is_fresher}
                                        onChange={validation.handleChange}
                                        className="form-control mx-2 "
                                        onClick={() =>
                                          validation.setFieldValue(
                                            "is_fresher",
                                            !validation.values.is_fresher
                                          )
                                        }
                                      />
                                    </div>

                                    {validation.touched.is_fresher &&
                                      validation.errors.is_fresher && (
                                        <FormFeedback className="d-block">
                                          {validation.errors.is_fresher}
                                        </FormFeedback>
                                      )}
                                  </FormGroup>
                                </Col>
                                {validation.values.is_fresher === false && (
                                  <>
                                    <Col lg="4">
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="">
                                          Last Company name *
                                        </Label>
                                        <Input
                                          name="last_company_name"
                                          placeholder="Last Company Name  "
                                          type="text"
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={
                                            validation.values
                                              .last_company_name || ""
                                          }
                                          invalid={
                                            validation.touched
                                              .last_company_name &&
                                              validation.errors.last_company_name
                                              ? true
                                              : false
                                          }
                                        />
                                        {validation.touched
                                          .lastUivercityNamelast_company_name &&
                                          validation.errors.last_company_name ? (
                                          <FormFeedback type="invalid">
                                            {
                                              validation.errors
                                                .last_company_name
                                            }
                                          </FormFeedback>
                                        ) : null}
                                      </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="">
                                          Last Company Designation *
                                        </Label>
                                        <Input
                                          name="last_company_designation"
                                          placeholder="Last Company Designation "
                                          type="text"
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={
                                            validation.values
                                              .last_company_designation || ""
                                          }
                                          invalid={
                                            validation.touched
                                              .last_company_designation &&
                                              validation.errors
                                                .last_company_designation
                                              ? true
                                              : false
                                          }
                                        />
                                        {validation.touched
                                          .lastUivercityNamelast_company_designation &&
                                          validation.errors
                                            .last_company_designation ? (
                                          <FormFeedback type="invalid">
                                            {
                                              validation.errors
                                                .last_company_designation
                                            }
                                          </FormFeedback>
                                        ) : null}
                                      </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="">
                                          Last Company Skills *
                                        </Label>
                                        <Input
                                          name="last_company_skills"
                                          placeholder="Last Company Skills "
                                          type="text"
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={
                                            validation.values
                                              .last_company_skills || ""
                                          }
                                          invalid={
                                            validation.touched
                                              .last_company_skills &&
                                              validation.errors
                                                .last_company_skills
                                              ? true
                                              : false
                                          }
                                        />
                                        {validation.touched
                                          .lastUivercityNamelast_company_skills &&
                                          validation.errors
                                            .last_company_skills ? (
                                          <FormFeedback type="invalid">
                                            {
                                              validation.errors
                                                .last_company_skills
                                            }
                                          </FormFeedback>
                                        ) : null}
                                      </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="">
                                          Last Company's Joining Date *
                                        </Label>
                                        <Input
                                          name="last_company_joining_date"
                                          placeholder="Last Company's Joining Date  "
                                          type="date"
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={
                                            validation.values
                                              .last_company_joining_date || ""
                                          }
                                          invalid={
                                            validation.touched
                                              .last_company_joining_date &&
                                              validation.errors
                                                .last_company_joining_date
                                              ? true
                                              : false
                                          }
                                        />
                                        {validation.touched
                                          .last_company_joining_date &&
                                          validation.errors
                                            .last_company_joining_date ? (
                                          <FormFeedback type="invalid">
                                            {
                                              validation.errors
                                                .last_company_joining_date
                                            }
                                          </FormFeedback>
                                        ) : null}
                                      </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="">
                                          Last Company's reliving Date *
                                        </Label>
                                        <Input
                                          name="last_company_reliving_date"
                                          placeholder="Last Company's reliving Date  "
                                          type="date"
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={
                                            validation.values
                                              .last_company_reliving_date || ""
                                          }
                                          invalid={
                                            validation.touched
                                              .last_company_reliving_date &&
                                              validation.errors
                                                .last_company_reliving_date
                                              ? true
                                              : false
                                          }
                                        />
                                        {validation.touched
                                          .last_company_reliving_date &&
                                          validation.errors
                                            .last_company_reliving_date ? (
                                          <FormFeedback type="invalid">
                                            {
                                              validation.errors
                                                .last_company_reliving_date
                                            }
                                          </FormFeedback>
                                        ) : null}
                                      </FormGroup>
                                    </Col>
                                    {/* 
                                    <Col lg={4}>
                                      <Label>Experience Certificate</Label>
                                      <Input
                                        name="work_experience_certificate"
                                        placeholder="Add Experience File"
                                        type="file"
                                        className="form-control"
                                        onChange={(event) =>
                                          validation.setFieldValue(
                                            "work_experience_certificate",
                                            event.currentTarget.files[0]
                                          )
                                        }
                                        onBlur={validation.handleBlur}
                                        invalid={
                                          validation.touched
                                            .work_experience_certificate &&
                                            validation.errors
                                              .work_experience_certificate
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched
                                        .work_experience_certificate &&
                                        validation.errors
                                          .work_experience_certificate ? (
                                        <FormFeedback type="invalid">
                                          {
                                            validation.errors
                                              .work_experience_certificate
                                          }
                                        </FormFeedback>
                                      ) : null}
                                    </Col> */}

                                    {/* <Col lg={4}>
                                      <Label>Relieving Letter</Label>
                                      <Input
                                        name="work_experience_reliving_letter"
                                        placeholder="Add Releaving Letter File"
                                        type="file"
                                        className="form-control"
                                        onChange={(event) =>
                                          validation.setFieldValue(
                                            "work_experience_reliving_letter",
                                            event.currentTarget.files[0]
                                          )
                                        }
                                        onBlur={validation.handleBlur}
                                        invalid={
                                          validation.touched
                                            .work_experience_reliving_letter &&
                                            validation.errors
                                              .work_experience_reliving_letter
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched
                                        .work_experience_reliving_letter &&
                                        validation.errors
                                          .work_experience_reliving_letter ? (
                                        <FormFeedback type="invalid">
                                          {
                                            validation.errors
                                              .work_experience_reliving_letter
                                          }
                                        </FormFeedback>
                                      ) : null}
                                    </Col> */}

                                    {/* <Col lg={4}>
                                      <Label>Salary Slips</Label>
                                      <Input
                                        name="work_experience_salary_slip"
                                        placeholder="Add Salary Slips File"
                                        type="file"
                                        className="form-control"
                                        onChange={(event) =>
                                          validation.setFieldValue(
                                            "work_experience_salary_slip",
                                            event.currentTarget.files[0]
                                          )
                                        }
                                        onBlur={validation.handleBlur}
                                        invalid={
                                          validation.touched
                                            .work_experience_salary_slip &&
                                            validation.errors
                                              .work_experience_salary_slip
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched
                                        .work_experience_salary_slip &&
                                        validation.errors
                                          .work_experience_salary_slip ? (
                                        <FormFeedback type="invalid">
                                          {
                                            validation.errors
                                              .work_experience_salary_slip
                                          }
                                        </FormFeedback>
                                      ) : null}
                                    </Col> */}
                                  </>
                                )}
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane tabId={4}>
                            <div>
                              <Row>
                                <Col lg="6">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="">
                                      Last Degree Certificate *
                                    </Label>
                                    <Input
                                      name="last_degree_cretificate"
                                      placeholder="Last Degree Certificate  "
                                      type="text"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values
                                          .last_degree_cretificate || ""
                                      }
                                      invalid={
                                        validation.touched
                                          .last_degree_cretificate &&
                                          validation.errors
                                            .last_degree_cretificate
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched
                                      .last_degree_cretificate &&
                                      validation.errors
                                        .last_degree_cretificate ? (
                                      <FormFeedback type="invalid">
                                        {
                                          validation.errors
                                            .last_degree_cretificate
                                        }
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>
                                <Col lg="6">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="">
                                      Last Qualification Year *
                                    </Label>
                                    <Input
                                      name="last_qualification_year"
                                      placeholder="Last Qualification Year"
                                      type="number"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values
                                          .last_qualification_year || ""
                                      }
                                      invalid={
                                        validation.touched
                                          .last_qualification_year &&
                                          validation.errors
                                            .last_qualification_year
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched
                                      .last_qualification_year &&
                                      validation.errors
                                        .last_qualification_year ? (
                                      <FormFeedback type="invalid">
                                        {
                                          validation.errors
                                            .last_qualification_year
                                        }
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="6">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="">
                                      Last University name *
                                    </Label>
                                    <Input
                                      name="last_university_name"
                                      placeholder="Last Univercity Name  "
                                      type="text"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values
                                          .last_university_name || ""
                                      }
                                      invalid={
                                        validation.touched
                                          .last_university_name &&
                                          validation.errors.last_university_name
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched
                                      .lastUivercityNamelast_university_name &&
                                      validation.errors.last_university_name ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.last_university_name}
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>
                                <Col lg="6">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="">
                                      Last Qualification CGPA/Percentile *
                                    </Label>
                                    <Input
                                      name="last_qualification_cgpa"
                                      placeholder="Last Univercity Name  "
                                      type="text"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values
                                          .last_qualification_cgpa || ""
                                      }
                                      invalid={
                                        validation.touched
                                          .last_qualification_cgpa &&
                                          validation.errors
                                            .last_qualification_cgpa
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched
                                      .lastUivercityNamelast_qualification_cgpa &&
                                      validation.errors
                                        .last_qualification_cgpa ? (
                                      <FormFeedback type="invalid">
                                        {
                                          validation.errors
                                            .last_qualification_cgpa
                                        }
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane tabId={5}>
                            <div>
                              <Row>
                                <div>
                                  {formRows.map((formRow) => (
                                    <Row key={formRow.id}>
                                      <Col lg={5} className="mb-3">
                                        <label htmlFor={`name-${formRow.id}`}>Document Name</label>
                                        <select
                                          id={`name-${formRow.id}`}
                                          value={formRow.doc_name}
                                          className="form-control"
                                          onChange={(e) =>
                                            handleFormInputChange(
                                              formRow.id,
                                              "doc_name",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">--- Select Document Name ---</option>
                                          {documentTypes &&
                                            documentTypes.map((eachDoc, idx) => (
                                              <option key={idx} value={eachDoc.name}>
                                                {eachDoc.name}
                                              </option>
                                            ))}
                                        </select>

                                      </Col>
                                      <Col lg={5} className="mb-3">
                                        <label htmlFor={`file-${formRow.id}`}>File</label>
                                        <input
                                          type="file"
                                          id={`file-${formRow.id}`}
                                          className="form-control"
                                          onChange={(e) => {
                                            const file = e.currentTarget.files && e.currentTarget.files[0];
                                            handleFileChange(formRow.id, file);
                                          }}
                                        />

                                      </Col>
                                      <Col lg={2} className="align-self-center">
                                        <div className="d-grid">
                                          <input
                                            type="button"
                                            className="btn btn-primary"
                                            value="Delete"
                                            onClick={() => onDeleteFormRow(formRow.id)}
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  ))}
                                </div>
                                <input
                                  type="button"
                                  className="btn btn-success mt-3 mt-lg-0"
                                  value="Add"
                                  onClick={() => onAddFormRow()}
                                />












                                {/* <Col lg="4">
                                  <div className="mb-3">
                                    <Label for="basicpill-phone_no-input3">
                                      Aadhar Card *
                                    </Label>
                                    <Input
                                      name="aadhar_card"
                                      placeholder="select Adhar Card"
                                      type="file"
                                      className="form-control"
                                      onChange={(event) =>
                                        validation.setFieldValue(
                                          "aadhar_card",
                                          event.currentTarget.files[0]
                                        )
                                      }
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.aadhar_card &&
                                        validation.errors.aadhar_card
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.aadhar_card &&
                                    validation.errors.aadhar_card ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.aadhar_card}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label for="basicpill-phone_no-input3">
                                      PAN Card *
                                    </Label>
                                    <Input
                                      name="pan_card"
                                      placeholder="select PAN Card"
                                      type="file"
                                      className="form-control"
                                      onChange={(event) =>
                                        validation.setFieldValue(
                                          "pan_card",
                                          event.currentTarget.files[0]
                                        )
                                      }
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.pan_card &&
                                        validation.errors.pan_card
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.pan_card &&
                                    validation.errors.pan_card ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.pan_card}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label for="basicpill-phone_no-input3">
                                      Last Qualification Certificate *
                                    </Label>
                                    <Input
                                      name="last_qualification_certificate"
                                      placeholder="Last Qualification Certificate"
                                      type="file"
                                      className="form-control"
                                      onChange={(event) =>
                                        validation.setFieldValue(
                                          "last_qualification_certificate",
                                          event.currentTarget.files[0]
                                        )
                                      }
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched
                                          .last_qualification_certificate &&
                                        validation.errors
                                          .last_qualification_certificate
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched
                                      .last_qualification_certificate &&
                                    validation.errors
                                      .last_qualification_certificate ? (
                                      <FormFeedback type="invalid">
                                        {
                                          validation.errors
                                            .last_qualification_certificate
                                        }
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col> */}
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane tabId={6}>
                            <div>
                              <Row>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label for="basicpill-phone_no-input3">
                                      Username
                                    </Label>
                                    <Input
                                      name="username"
                                      placeholder="Username"
                                      type="text"
                                      className="form-control"
                                      disabled={true}
                                      value={`ta_${validation.values.firstname}`}
                                      readOnly // This makes the input field read-only
                                      invalid={
                                        validation.touched.username &&
                                          validation.errors.username
                                          ? true
                                          : false
                                      }
                                    />

                                    {validation.touched.username &&
                                      validation.errors.username ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.username}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label for="basicpill-phone_no-input3">
                                      Password *
                                    </Label>
                                    <InputGroup>
                                      <Input
                                        name="password"
                                        placeholder="Enter Password"
                                        type={
                                          showPassword ? "text" : "password"
                                        }
                                        className="form-control"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.password || ""}
                                        invalid={
                                          validation.touched.password &&
                                            validation.errors.password
                                            ? true
                                            : false
                                        }
                                      />
                                      <InputGroupText>
                                        <Button
                                          type="button"
                                          className="btn btn-sm "
                                          onClick={() =>
                                            setShowPassword(!showPassword)
                                          }
                                          color="info" // Adjust the color as needed
                                        >
                                          {showPassword ? (
                                            <span className="fas fa-eye-slash"></span>
                                          ) : (
                                            <span
                                              className="fas fa-eye
"
                                            ></span>
                                          )}
                                        </Button>
                                      </InputGroupText>
                                    </InputGroup>
                                    {validation.touched.password &&
                                      validation.errors.password ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.password}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label for="basicpill-phone_no-input3">
                                      Ip Address *
                                    </Label>
                                    <Input
                                      name="ip_address"
                                      placeholder="Enter Ip Address"
                                      type="ip_address"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.ip_address || ""}
                                      invalid={
                                        validation.touched.ip_address &&
                                          validation.errors.ip_address
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.ip_address &&
                                      validation.errors.ip_address ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.ip_address}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label for="basicpill-phone_no-input3">
                                      Select Department *
                                    </Label>
                                    <Input
                                      type="select" // Correcting the input type to 'select'
                                      name="select_department_id"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values
                                          .select_department_id || ""
                                      }
                                      invalid={
                                        validation.touched
                                          .select_department_id &&
                                          validation.errors.select_department_id
                                          ? true
                                          : false
                                      }
                                    >
                                      <option value="" disabled>
                                        Select Technology
                                      </option>
                                      {technologyData.map((item, index) => (
                                        <option
                                          key={index}
                                          value={item.technology_id}
                                        >
                                          {item.technology_name}
                                        </option>
                                      ))}
                                    </Input>

                                    {validation.touched.select_department_id &&
                                      validation.errors.select_department_id ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.select_department_id}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="userRole">
                                      Select Position *
                                    </Label>
                                    <Input
                                      type="select"
                                      name="select_position_id"
                                      className="form-control"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values.select_position_id ||
                                        ""
                                      }
                                      invalid={
                                        validation.touched.select_position_id &&
                                          validation.errors.select_position_id
                                          ? true
                                          : false
                                      }
                                    >
                                      <option value="" disabled>
                                        Select Position
                                      </option>
                                      {positionData.map((item, index) => (
                                        <option
                                          key={index}
                                          value={item.position_id}
                                        >
                                          {item.position_name}
                                        </option>
                                      ))}
                                    </Input>
                                    {validation.touched.select_position_id &&
                                      validation.errors.select_position_id ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.select_position_id}
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </Col>

                                <Col md="4" className=" ms-0 ps-0">
                                  <FormGroup check className="mt-2 ">
                                    <label htmlFor="" className="form-label ">
                                      Is Remote
                                    </label>
                                    <br />
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="is_remote"
                                        checked={validation.values.is_remote}
                                        value={validation.values.is_remote}
                                        onChange={validation.handleChange}
                                        className="form-control mx-2 "
                                        onClick={() =>
                                          validation.setFieldValue(
                                            "is_remote",
                                            !validation.values.is_remote
                                          )
                                        }
                                      />
                                      {validation.values.is_remote === true ? (
                                        <Button
                                          type="button"
                                          className="btn btn-success btn-sm "
                                        >
                                          <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
                                          Yes
                                        </Button>
                                      ) : (
                                        <Button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                        >
                                          <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                                          No
                                        </Button>
                                      )}
                                    </Label>
                                    {validation.touched.is_remote &&
                                      validation.errors.is_remote && (
                                        <FormFeedback className="d-block">
                                          {validation.errors.is_remote}
                                        </FormFeedback>
                                      )}
                                  </FormGroup>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>
                      <div className="actions clearfix">
                        <ul>
                          <li
                            className={
                              activeTab === 1 ? "previous disabled" : "previous"
                            }
                          >
                            <Link
                              to="#"
                              onClick={() => {
                                toggleTab(activeTab - 1);
                                validation.setFieldValue(
                                  "currentStep",
                                  (validation.values.currentStep || 1) - 1
                                );
                              }}
                            >
                              Previous
                            </Link>
                          </li>
                          <li
                            className={
                              activeTab === 6 ? "next disabled" : "next"
                            }
                          >
                            <Link to="#" onClick={handleNext}>
                              Next
                            </Link>
                          </li>

                          {activeTab === 6 && (
                            <>
                              {user_id ? (
                                <li>
                                  <Button
                                    className="btn btn-success"
                                    type="submit"
                                  >
                                    UPDATE
                                  </Button>
                                </li>
                              ) : (
                                <li>
                                  <Button
                                    className="btn btn-success"
                                    type="submit"
                                  >
                                    SUBMIT
                                  </Button>
                                </li>
                              )}
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddUser;
