import React, { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link } from "react-router-dom";
import GetAuthToken from "TokenImport/GetAuthToken";

//i18n
import { withTranslation } from "react-i18next";
import { API_GET_ROLE_PERMSSIONS_DATA } from "Apis/api";
import axios from "axios";

const SidebarContent = (props) => {
  const ref = useRef();
  const [permissions, setPermissions] = useState(null);

  console.log("permissions data in sidebar", permissions);

  const config = GetAuthToken();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  const fetchPermissions = async () => {
    try {
      const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config);
      setPermissions(data.select_user_role_id.permissions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <React.Fragment>
      <SimpleBar className="h-100 mt-1" ref={ref}>
        <div id="sidebar-menu" className="pb-3">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.module_name === "Dashboard" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li
              className={
                permissions &&
                permissions.some((eachItem) => eachItem.module_name === "Roles" && eachItem.method_name === "Show")
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/ta-roles">
                <i className="bx bx-bolt-circle"></i>
                <span>{props.t("Roles")}</span>
              </Link>
            </li>

            <li
              className={
                permissions &&
                permissions.some((eachItem) => eachItem.module_name === "User" && eachItem.method_name === "Show")
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/ta-user">
                <i className="bx bx-user"></i>
                <span>{props.t("User")}</span>
              </Link>
            </li>

            <li
              className={
                permissions &&
                permissions.some(
                  (eachItem) => eachItem.module_name === "Clients" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/taerp-clients">
                <i className="bx bxs-label"></i>
                <span>{props.t("Clients")}</span>
              </Link>
            </li>
            <li
              className={
                permissions &&
                permissions.some(
                  (eachItem) => eachItem.module_name === "Projects" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/ta-projects">
                <i className="bx bxl-pinterest-alt"></i>
                <span>{props.t("Projects")}</span>
              </Link>
            </li>
            <li
              className={
                permissions &&
                permissions.some(
                  (eachItem) => eachItem.module_name === "Interview" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/ta-interviews">
                <i className="bx bx-user-voice"></i>
                <span>{props.t("Interview")}</span>
              </Link>
            </li>

            <li
              className={
                permissions &&
                permissions.some(
                  (eachItem) => eachItem.module_name === "Technology" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/ta-tech">
                <i className="bx bx-command"></i>
                <span>{props.t("Technology")}</span>
              </Link>
            </li>

            <li
              className={
                permissions &&
                permissions.some((eachItem) => eachItem.module_name === "Task" && eachItem.method_name === "Show")
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/tasks-list">
                <i className="bx bx-task"></i>
                <span>{props.t("Task")}</span>
              </Link>
            </li>

            <li
              className={
                permissions &&
                permissions.some(
                  (eachItem) =>
                    eachItem.module_name === "Daily Checkin-Out" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Late CheckIn-Out" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Miss Checkout" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Reports-Logs" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow">
                <i className="bx bx-list-ol"></i>
                <span>{props.t("Reports")}</span>
              </Link>
              <ul className="sub-menu">
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Reports-Logs" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/logs">{props.t("Logs")}</Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Daily Checkin-Out" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/daily-checkin-checkout">
                    {props.t("Daily Checkin-Out")}
                  </Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Daily Checkin-Out" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/breaks-data">{props.t("Breaks")}</Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Late CheckIn-Out" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/late-checkins">{props.t("Late CheckIn-Out")}</Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Miss CheckOut" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/miss-checkouts">{props.t("Miss Checkout")}</Link>
                </li>
              </ul>
            </li>

            <li
              className={
                permissions &&
                permissions.some(
                  (eachItem) =>
                    eachItem.module_name === "Leave" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Leave Type" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Leave History" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Holidays" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow">
                <i className="bx bx-run"></i>
                <span>{props.t("Leave")}</span>
              </Link>
              <ul className="sub-menu">
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Leave" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-leaves">{props.t("Leave")}</Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Leave Approve" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/pending-leave-approvals">
                    {props.t("Pending Leave Approvals")}
                  </Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Leave Type" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-leave-types">{props.t("Leave Type")}</Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Leave History" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-leave-history">{props.t("Leave History")}</Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Holidays" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-holidays">{props.t("Holidays")}</Link>
                </li>
              </ul>
            </li>

            <li
              className={
                permissions &&
                permissions.some(
                  (eachItem) =>
                    eachItem.module_name === "Lead" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Resume Upload" && eachItem.method_name === "Show"||
                    eachItem.module_name === "Employee Award" && eachItem.method_name === "Show"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store"></i>
                <span>{props.t("HRM Dashboard")}</span>
              </Link>
              <ul className="sub-menu">
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Employee Award" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-employee-awards">
                    {props.t("Employee Awards")}
                  </Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Employee Award" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-employee-awards-type">
                    {props.t("Awards Type")}
                  </Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Lead" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-hrm/lead">{props.t("Lead")}</Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Resume Upload" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/ta-hrm/resume-upload">
                    {props.t("Resume Upload")}
                  </Link>
                </li>
                <li
                  className={
                    permissions &&
                    permissions.some(
                      (eachItem) => eachItem.module_name === "Resume Upload" && eachItem.method_name === "Show"
                    )
                      ? ""
                      : "d-none"
                  }
                >
                  <Link to="/document-types">
                    {props.t("Documents Type")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li
              className={
                permissions &&
                permissions.some((eachItem) => eachItem.module_name === "Chats" && eachItem.method_name === "Show")
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow">
                <i className="fas fa-comment"></i>
                <span>{props.t("Chats")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/ta-personal-chats">
                    {props.t("Personal Chats")}
                  </Link>
                </li>
              </ul>
            </li> */}

            <li
              className={
                permissions &&
                permissions.some((eachItem) => eachItem.module_name === "Chats" && eachItem.method_name === "Show")
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/chats-test" >
                <i className="fas fa-comment"></i>
                <span>{props.t("Chats")}</span>
              </Link>
            </li>

            <li
              className={
                permissions &&
                permissions.some((eachItem) => eachItem.module_name === "Chats" && eachItem.method_name === "Show")
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/screenshots">
                <i className="bx bxs-camera"></i>
                <span>{props.t("Screenshots")}</span>
              </Link>
            </li>
          </ul>
          
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
