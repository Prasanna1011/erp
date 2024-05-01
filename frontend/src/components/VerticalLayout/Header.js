import PropTypes from "prop-types";
import React, { useState } from "react";

import { connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Modal,
} from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
// import { getBreaksData, getCheckinData } from "store/ReportsData/actions";
import { useDispatch } from "react-redux";
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
  getCheckinData,
  getBreaksData,
} from "../../store/actions";

import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import techAstha from "../../assets/images/portalImages/techastha.png"

import logo from "../../assets/images/logo.svg";
import logoLightSvg from "../../assets/images/logo-light.svg";

//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import // showRightSidebarAction,
// toggleLeftmenu,
// changeSidebarType,
"../../store/actions";
import axios from "axios";
import {
  API_CHECK_IN,
  API_CHECK_OUT,
  API_GET_CHECK_IN_CHECKOUT_STATUS,
  API_GET_BREAKS,
  API_END_BREAK,
  API_START_BREAK,
  API_MISS_CHECKOUT,
  API_PARTICULAR_USER_CHECKIN_CHECKOUT_DATA,
} from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken";
import { useEffect } from "react";

const Header = ({
  props,
  getCheckinData,
  getBreaksData,
  showRightSidebarAction,
  showRightSidebar,
}) => {
  const [checkIn, setCheckIn] = useState();
  const [breakTaken, setBreakTaken] = useState();
  const [checkInCheckOutData, setCheckInCheckOutData] = useState();
  const [modal_center, setmodal_center] = useState(false);
  const config = GetAuthToken();
  const dispatch = useDispatch();

  console.log("Checkin", checkIn);
  console.log("checkInCheckOutData", checkInCheckOutData);

  function tog_center() {
    setmodal_center(!modal_center);
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      misscheckout_time: "",
      misscheckout_reason: "",
    },
    validationSchema: Yup.object({
      misscheckout_time: Yup.string().required(
        "Please Select Actual Checkout Time"
      ),
      misscheckout_reason: Yup.string().required(
        "Please Enter Miss Checkout Reason"
      ),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(API_CHECK_OUT, values, config);
        toast.success("Checked Out Successfully.", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        dispatch(getCheckinData());
        getCheckInOrCheckoutStatus();
        setmodal_center(false);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const getCheckinCheckoutDetails = async () => {
    try {
      const { data } = await axios.get(
        API_PARTICULAR_USER_CHECKIN_CHECKOUT_DATA,
        config
      );
      setCheckInCheckOutData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBreakData = async () => {
    try {
      const { data } = await axios.get(API_GET_BREAKS, config);
      setBreakTaken(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBreakout = async (e) => {
    try {
      const { data } = await axios.post(API_END_BREAK, e.target.value, config);
      toast.success("Your Break has end.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      dispatch(getBreaksData());
      getBreakData();
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleBreakIn = async (e) => {
    try {
      const { data } = await axios.post(
        API_START_BREAK,
        e.target.value,
        config
      );
      toast.success("Your Break has Started.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      dispatch(getBreaksData());
      getBreakData();
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const getCheckInOrCheckoutStatus = async () => {
    try {
      const { data } = await axios.get(
        API_GET_CHECK_IN_CHECKOUT_STATUS,
        config
      );
      setCheckIn(data.data);
    } catch (error) {
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleCheckIn = async (e) => {
    try {
      const { data } = await axios.post(API_CHECK_IN, e.target.value, config);
      toast.success("Checked In Successfully.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getCheckInOrCheckoutStatus();
      dispatch(getCheckinData());
    } catch (error) {
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleCheckOut = async (e) => {
    if (checkIn && checkIn.miss_checkout === true) {
      setmodal_center(true);
    } else {
      try {
        const { data } = await axios.post(
          API_CHECK_OUT,
          e.target.value,
          config
        );
        toast.success("Checked Out Successfully.", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        getCheckInOrCheckoutStatus();
        dispatch(getCheckinData());
      } catch (error) {
        toast.error("Something went wrong.", {
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

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  useEffect(() => {
    getCheckInOrCheckoutStatus();
    getCheckinCheckoutDetails();
    getBreakData();
  }, []);

  return (
    <React.Fragment>
      <header id="page-topbar">
        <Modal
          isOpen={modal_center}
          toggle={() => {
            tog_center();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Miss Checkout Details</h5>
            <button
              type="button"
              onClick={() => {
                setmodal_center(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form
              className="needs-validation"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <Row>
                <Col md="12">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">
                      Select Actual Checkout Time
                    </Label>
                    <Input
                      name="misscheckout_time"
                      placeholder="Enter Checkout Time"
                      type="time"
                      className="form-control"
                      id="validationCustom01"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.misscheckout_time || ""}
                      invalid={
                        validation.touched.misscheckout_time &&
                        validation.errors.misscheckout_time
                          ? true
                          : false
                      }
                    />
                    {validation.touched.misscheckout_time &&
                    validation.errors.misscheckout_time ? (
                      <FormFeedback type="invalid">
                        {validation.errors.misscheckout_time}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom02">Enter Reason</Label>
                    <Input
                      name="misscheckout_reason"
                      placeholder="Enter Reason"
                      type="textarea"
                      className="form-control"
                      id="validationCustom02"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.misscheckout_reason || ""}
                      invalid={
                        validation.touched.misscheckout_reason &&
                        validation.errors.misscheckout_reason
                          ? true
                          : false
                      }
                    />
                    {validation.touched.misscheckout_reason &&
                    validation.errors.misscheckout_reason ? (
                      <FormFeedback type="invalid">
                        {validation.errors.misscheckout_reason}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
                >
                  <span className="fas fa-sign-out-alt fs-5 pe-2"></span>
                  Check-out
                </button>
              </div>
            </Form>
          </div>
        </Modal>
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img className="bg-light mt-1 ps-3 pe-3 p-1 rounded"  src={techAstha} alt="" height="22" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img className="bg-light mt-1 ps-3 pe-3 p-1 rounded"  src={techAstha} alt="" height="50" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            {checkIn && checkIn.status == true && (
              <div className="d-flex align-items-center">
                {breakTaken && breakTaken.status === true ? (
                  <button
                    className="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
                    onClick={(e) => handleBreakout(e)}
                    value="Breakout"
                  >
                    End Break
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
                    onClick={(e) => handleBreakIn(e)}
                    value="BreakIn"
                  >
                    Start Break
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="d-flex">
            <div className="d-flex align-items-center">
              {checkIn && checkIn.status === true ? (
                <button
                  className="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    if (breakTaken && breakTaken.status === true) {
                      toast.success(`End Break Before Checking Out`, {
                        position: "top-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                      });
                    } else {
                      handleCheckOut(e);
                    }
                  }}
                  value="CheckOut"
                >
                  <span className="fas fa-sign-out-alt fs-5 pe-2"></span>
                  Check-out
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
                  onClick={(e) => handleCheckIn(e)}
                  value="CheckIn"
                >
                  <span className="fas fa-sign-in-alt fs-5 pe-2 text-center"></span>
                  Check-in
                </button>
              )}
            </div>

            <ProfileMenu />

            <div
              onClick={() => {
                showRightSidebarAction(!showRightSidebar);
              }}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <i className="bx bx-cog bx-spin" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
  getCheckinData,
  getBreaksData,
})(withTranslation()(Header));
