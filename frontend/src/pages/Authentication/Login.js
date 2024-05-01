import PropTypes from "prop-types"
import React from "react"

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

//Social Media Imports
import { GoogleLogin } from "react-google-login"
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"

// actions
import { loginUser, socialLogin } from "../../store/actions"

// import images
import profile from "assets/images/profile-img.png"
import logo from "assets/images/logo.svg"
import techAstha from "assets/images/portalImages/techastha.png"
//Import config
import { facebook, google } from "../../config"

const Login = props => {
  //meta title
  document.title = "Login | Skote - React Admin & Dashboard Template"

  const dispatch = useDispatch()

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username_or_email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username_or_email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: values => {
      console.log("values ",values);
      dispatch(loginUser(values, props.router.navigate))
    },
  })

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }))

  const signIn = (res, type) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        username_or_email: res.profileObj.username_or_email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.router.navigate, type))
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        username_or_email: res.username_or_email,
        token: res.accessToken,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.router.navigate, type))
    }
  }

  //handleGoogleLoginResponse
  const googleResponse = response => {
    signIn(response, "google")
  }

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  const facebookResponse = response => {
    signIn(response, "facebook")
  }

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Row>
                <Col xs={7}>
                  <div className="ms-5 p-4">
                    <img
                      className=" "
                      alt="150x150"
                      width="250"
                      height="130"
                      src={techAstha}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        {/* <p>Sign in to continue to Skote.</p> */}
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="logo-light-element">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">User Name</Label>
                        <Input
                          name="username_or_email"
                          className="form-control"
                          placeholder="User Name"
                          type="username_or_email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username_or_email || ""}
                          invalid={
                            validation.touched.username_or_email &&
                            validation.errors.username_or_email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.username_or_email &&
                        validation.errors.username_or_email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.username_or_email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} TechAstha. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by TechAstha
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
