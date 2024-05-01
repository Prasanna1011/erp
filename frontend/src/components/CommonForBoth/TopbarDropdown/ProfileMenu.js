import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import { API_BASE_URL, API_GET_UPDATE_USER_PROFILE } from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [userId, setUserId] = useState()
  const [username, setusername] = useState("");
  const [profilePicture, setProfilePicture] = useState()


  const config = GetAuthToken();


  useEffect(() => {
    const fetchUserId = () => {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setUserId(obj.data.user_id);
        setusername(obj.data.name);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (location.pathname === "/dashboard" || location.pathname === "/") {
      getTaUserProfileData();
    }
  }, [location.pathname]);


  const getTaUserProfileData = async () => {
    try {
      if (userId) {
        const { data } = await axios.get(
          `${API_GET_UPDATE_USER_PROFILE}${userId}/`,
          config
        );
        if (data?.choose_profile_picture) {
          setProfilePicture(data?.choose_profile_picture);
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

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={profilePicture&&profilePicture}
            alt="Profile"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/tauser-profile">
            <DropdownItem>
              {" "}
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {props.t("Profile")}{" "}
            </DropdownItem>
          </Link>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);