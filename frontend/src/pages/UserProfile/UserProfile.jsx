import React, { useState, useEffect, useRef } from "react";
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
import {
  API_GET_UPDATE_USER_PROFILE,
  API_BASE_URL,
  API_CHANGE_PASSWORD,
} from "Apis/api";
import axios from "axios";
import { blood_groups, nearestRelativeNames } from "constants/basic";
import { toast } from "react-toastify";

const TaUserProfile = () => {
  const [profileInitialData, setProfileInitialData] = useState();
  const [userId, setUserId] = useState();
  const [profilePicturePreview, setProfilePicturePreview] = useState();

  const fileInputRef = useRef(null);




  const config = GetAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = () => {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setUserId(obj.data.user_id);
      }
    };

    fetchUserId();
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("choose_profile_picture", file)
      try {
        const { data } = await axios.patch(`${API_GET_UPDATE_USER_PROFILE}${userId}/`,
          formData,
          config)
        toast.success(`Profile Picture Changed Successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        getTaUserProfileData()
        navigate("/dashboard");
      } catch (error) {
        toast.error(`There was an issue while changing profile picure`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  };

  const getTaUserProfileData = async () => {
    try {
      if (userId) {
        const { data } = await axios.get(
          `${API_GET_UPDATE_USER_PROFILE}${userId}/`,
          config
        );
        setProfileInitialData(data);
        if (data?.choose_profile_picture) {
          setProfilePicturePreview(data?.choose_profile_picture);
        }
      }
    } catch (error) {
      console.log("Error fetching user profile data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getTaUserProfileData();
    }
  }, [userId]);

  const passwordValidation = useFormik({
    enableReinitialize: true,

    initialValues: {
      old_password: "",
      password: "",
      password2: "",
    },
    validationSchema: Yup.object({
      old_password: Yup.string().required("Current Password is Required"),
      password: Yup.string().required("New Password is Required"),
      password2: Yup.string().required("Confirming New Password is Required"),
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

        const { data } = await axios.post(
          API_CHANGE_PASSWORD,
          formData,
          config
        );
        toast.success(`Password Updated successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/dashboard");
      } catch (error) {
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

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      firstname: profileInitialData && profileInitialData?.firstname,
      middlename: profileInitialData && profileInitialData?.middlename,
      lastname: profileInitialData && profileInitialData?.lastname,
      gender: profileInitialData && profileInitialData?.gender,
      personal_email_id:
        profileInitialData && profileInitialData?.personal_email_id,
      phone_no: profileInitialData && profileInitialData?.phone_no,
      current_address: profileInitialData && profileInitialData?.current_address,
      same_as_permanent_address:
        profileInitialData && profileInitialData?.same_as_permanent_address,
      permanent_address:
        profileInitialData && profileInitialData?.permanent_address,
      d_o_b: profileInitialData && profileInitialData?.d_o_b,
      emergency_contact_name:
        profileInitialData && profileInitialData?.emergency_contact_name,
      relation_with_emergency_phone_no_id:
        profileInitialData &&
        profileInitialData?.relation_with_emergency_phone_no_id,
      blood_group: profileInitialData && profileInitialData?.blood_group,
      emergency_phone_no:
        profileInitialData && profileInitialData?.emergency_phone_no,
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Please Enter Your First Name"),
      middlename: Yup.string().required("Please Enter Your Middle Name"),
      lastname: Yup.string().required("Please Enter Your Last Name"),
      gender: Yup.string().required("Please Select Your Gender"),
      personal_email_id: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter your Email Address"),
      phone_no: Yup.string()
        .required("Please Enter Contact Number")
        .min(10, "Contact Number must be at least 10 characters")
        .max(10, "Contact Number must not exceed 10 characters"),
      current_address: Yup.string().required("Please Enter Current Address"),
      same_as_permanent_address: Yup.boolean().notRequired(),
      permanent_address: Yup.string().required(
        "Please Enter Permanent Address"
      ),
      d_o_b: Yup.date().required("Please Enter Date of Birth"),
      emergency_contact_name: Yup.string().required(
        "Please Enter Emergency Contact Name"
      ),
      relation_with_emergency_phone_no_id: Yup.string().required(
        "Stating Relation with Emergency Contact is required"
      ),
      blood_group: Yup.string().required("Blood Group is Required."),
      emergency_phone_no: Yup.number().required(
        "Emergency Contact Number is Required."
      ),
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

        const { data } = await axios.patch(
          `${API_GET_UPDATE_USER_PROFILE}${userId}/`,
          formData,
          config
        );
        toast.success(`Profile Updated successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/dashboard");
      } catch (error) {
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

  useEffect(() => {
    getTaUserProfileData();
  }, []);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>User Profile</h3>
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">First name</Label>
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">
                            Middle name
                          </Label>
                          <Input
                            name="middlename"
                            placeholder="Middle name"
                            type="text"
                            className="form-control"
                            id="validationCustom02"
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom03">Last name</Label>
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
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">
                            Personal Email
                          </Label>
                          <Input
                            name="personal_email_id"
                            placeholder="Email"
                            type="text"
                            className="form-control"
                            id="validationCustom04"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.personal_email_id || ""}
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom05">
                            Phone Number
                          </Label>
                          <Input
                            name="phone_no"
                            placeholder="Phone Number"
                            type="text"
                            className="form-control"
                            id="validationCustom05"
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom06">
                            Select Gender
                          </Label>
                          <Input
                            type="select"
                            name="gender"
                            id="validationCustom06"
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
                            <option disabled>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                          </Input>
                          {validation.touched.gender &&
                            validation.errors.gender ? (
                            <FormFeedback type="invalid">
                              {validation.errors.gender}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Row>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom08">
                              Current Address
                            </Label>
                            <Input
                              name="current_address"
                              placeholder="Current Address"
                              type="textarea"
                              className="form-control"
                              id="validationCustom08"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.current_address || ""}
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

                        <Col md={6}>
                          {" "}
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom09">
                              Permanent Address
                            </Label>
                            <Input
                              name="Permanent_address"
                              placeholder="permanent_address Address"
                              type="textarea"
                              className="form-control"
                              id="validationCustom09"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.permanent_address || ""}
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
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom10">
                              Date of Birth
                            </Label>
                            <Input
                              name="d_o_b"
                              placeholder="Date of Birth"
                              type="date"
                              className="form-control"
                              id="validationCustom10"
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
                        <Col md="6">
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
                              defaultValue={validation.values.blood_group || ""}
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
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom12">
                              Emergency Contact Name
                            </Label>
                            <Input
                              name="emergency_contact_name"
                              placeholder="Emergency Conatact Name"
                              type="text"
                              className="form-control"
                              id="validationCustom12"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.emergency_contact_name || ""
                              }
                              invalid={
                                validation.touched.emergency_contact_name &&
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
                        <Col md="4">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom12">
                              Emergency Contact Number
                            </Label>
                            <Input
                              name="emergency_phone_no"
                              placeholder="Emergency Conatact Number"
                              type="text"
                              className="form-control"
                              id="validationCustom13"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.emergency_phone_no || ""}
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
                                  .relation_with_emergency_phone_no_id || ""
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
                      <Button className="btn btn-primary" type="submit">
                        SUBMIT
                      </Button>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Change Profile Picture</h3>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Col lg="12">
                    <img src={profilePicturePreview&&profilePicturePreview} style={{ height: "150px", width: "150px" }} className="rounded-circle m-2" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <button onClick={handleButtonClick} className="btn bttn-sm btn-primary">Change Profile Picture</button>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Change Password</h3>
              </CardBody>
            </Card>
          </Col>
          <Col xl="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={(e) => {
                    e.preventDefault();
                    passwordValidation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col md="4">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom01">
                          Current Password
                        </Label>
                        <Input
                          name="old_password"
                          placeholder="Enter Current Password"
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          onChange={passwordValidation.handleChange}
                          onBlur={passwordValidation.handleBlur}
                          value={passwordValidation.values.old_password || ""}
                          invalid={
                            passwordValidation.touched.old_password &&
                              passwordValidation.errors.old_password
                              ? true
                              : false
                          }
                        />
                        {passwordValidation.touched.old_password &&
                          passwordValidation.errors.old_password ? (
                          <FormFeedback type="invalid">
                            {passwordValidation.errors.old_password}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom02">New Password</Label>
                        <Input
                          name="password"
                          placeholder="Enter New Password"
                          type="text"
                          className="form-control"
                          id="validationCustom02"
                          onChange={passwordValidation.handleChange}
                          onBlur={passwordValidation.handleBlur}
                          value={passwordValidation.values.password || ""}
                          invalid={
                            passwordValidation.touched.password &&
                              passwordValidation.errors.password
                              ? true
                              : false
                          }
                        />
                        {passwordValidation.touched.password &&
                          passwordValidation.errors.password ? (
                          <FormFeedback type="invalid">
                            {passwordValidation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom03">
                          Confirm New Password
                        </Label>
                        <Input
                          name="password2"
                          placeholder="Enter Current Password"
                          type="text"
                          className="form-control"
                          id="validationCustom03"
                          onChange={passwordValidation.handleChange}
                          onBlur={passwordValidation.handleBlur}
                          value={passwordValidation.values.password2 || ""}
                          invalid={
                            passwordValidation.touched.password2 &&
                              passwordValidation.errors.password2
                              ? true
                              : false
                          }
                        />
                        {passwordValidation.touched.password2 &&
                          passwordValidation.errors.password2 ? (
                          <FormFeedback type="invalid">
                            {passwordValidation.errors.password2}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Button className="btn btn-primary" type="submit">
                      SUBMIT
                    </Button>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TaUserProfile;
