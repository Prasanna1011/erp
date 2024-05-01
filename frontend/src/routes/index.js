import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// //Tasks
import TasksList from "../pages/Tasks/tasks-list";
import TasksCreate from "../pages/Tasks/tasks-create";

// //Projects
import ProjectsGrid from "../pages/Projects/projects-grid";
import ProjectsList from "../pages/Projects/projects-list";
import ProjectsOverview from "../pages/Projects/ProjectOverview/projects-overview";
import ProjectsCreate from "../pages/Projects/projects-create";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

//Contacts
import DailyCheckinCheckOut from "pages/Reports/DailyCheckinCheckOut";
import ClientsList from "pages/Clients/ClientsList";
import AddClients from "pages/Clients/AddClients";
import EditClients from "pages/Clients/EditClients";
import HolidaysHome from "pages/Leave/Holidays/HolidaysHome";
import AddHoliday from "pages/Leave/Holidays/AddHoliday";
import EditHoliday from "pages/Leave/Holidays/EditHoliday";
import LeaveTypes from "pages/Leave/LeaveTypes/LeaveTypes";
import AddLeaveTypes from "pages/Leave/LeaveTypes/AddLeaveTypes";
import EditLeaveTypes from "pages/Leave/LeaveTypes/EditLeaveTypes";
import AddRole from "pages/Roles/AddRole";
import RolesHome from "pages/Roles/RolesHome";
import AddLead from "pages/HRM Dashboard/Lead/AddLead";
import HomeLead from "pages/HRM Dashboard/Lead/HomeLead";
import EditLead from "pages/HRM Dashboard/Lead/EditLead";
import HomeTechnology from "pages/Technology/HomeTechnology";
import AddTechnology from "pages/Technology/AddTechnology";
import EditTechnology from "pages/Technology/EditTechnology";
import AddResumeUpload from "pages/HRM Dashboard/Resume Upload/AddResumeUpload";
import HomeResume from "pages/HRM Dashboard/Resume Upload/HomeResume";
import AddUser from "pages/Users/AddUser";
import User from "pages/Users";
import Projects from "pages/Projects";
import AddProject from "pages/Projects/AddProject";
import Interview from "pages/Interview";
import AddInterview from "pages/Interview/AddInterview";
import TaskHome from "pages/Tasks/TaskHome";
import Leaves from "pages/Leave/Leaves/Leaves.jsx";
import AddLeaves from "pages/Leave/Leaves/AddLeaves";
import EditLeaves from "pages/Leave/Leaves/EditLeaves";
import EditRole from "pages/Roles/EditRoles";
import LeaveHistory from "pages/Leave/LeaveHistory/LeaveHistory.jsx";
import BreaksData from "pages/Reports/BreaksData";
import LateCheckinData from "pages/Reports/LateCheckinData";
import MissCheckoutData from "pages/Reports/MissCheckoutData";
import PendingLeaveApproval from "pages/Leave/Leaves/PendingLeaveApproval";
import LogsData from "pages/Reports/LogsData";
import TaUserProfile from "pages/UserProfile/UserProfile.jsx";
import EmployeeAwards from "pages/HRM Dashboard/EmployeeAwards/EmployeeAwards.jsx";
import AddEmployeeAwards from "pages/HRM Dashboard/EmployeeAwards/AddEmployeeAwards.jsx";
import AddAwardTypes from "pages/HRM Dashboard/AwardTypes/AddAwardTypes.jsx";
import AwardTypes from "pages/HRM Dashboard/AwardTypes/AwardTypes.jsx";
import ChatComponent from "pages/TaChats/Chats.jsx";
import EditEmployeeAward from "pages/HRM Dashboard/EmployeeAwards/EditEmployeeAward";
import EditEmployeeAwardType from "pages/HRM Dashboard/AwardTypes/EditEmployeeAwardType";
import DocumentsType from "pages/HRM Dashboard/DocumentsType/DocumentsType";
import AddDocumentsType from "pages/HRM Dashboard/DocumentsType/AddDocumentsType"
import EditDocumentsType from "pages/HRM Dashboard/DocumentsType/EditDocumentsType"
import ChatsTest from "pages/ChatsTest/ChatsTest";
import ScreenShots from "pages/ScreenShots/ScreenShots";

const authProtectedRoutes = [
  {
    path: "/dashboard",
    component: <Dashboard />,
    module_name: "Dashboard",
    method_name: "View",
  },

  {
    path: "/tauser-profile",
    component: <TaUserProfile />,
    module_name: "Dashboard",
    method_name: "View",
  },

  // Users
  {
    path: "/ta-user",
    component: <User />,
    module_name: "User",
    method_name: "View",
  },
  {
    path: "/ta-user-add",
    component: <AddUser />,
    module_name: "User",
    method_name: "Add",
  },
  {
    path: "/ta-user-edit/:user_id",
    component: <AddUser />,
    module_name: "User",
    method_name: "Update",
  },

  // Clients
  {
    path: "/taerp-clients",
    component: <ClientsList />,
    module_name: "Clients",
    method_name: "View",
  },
  {
    path: "/taerp-add-clients",
    component: <AddClients />,
    module_name: "Clients",
    method_name: "Add",
  },
  {
    path: "/taerp-edit-clients/:id",
    component: <AddClients />,
    module_name: "Clients",
    method_name: "Update",
  },

  // projects
  {
    path: "/ta-projects",
    component: <Projects />,
    module_name: "Projects",
    method_name: "View",
  },
  {
    path: "/ta-project-add",
    component: <AddProject />,
    module_name: "Projects",
    method_name: "Add",
  },
  {
    path: "/ta-project-edit/:id",
    component: <AddProject />,
    module_name: "Projects",
    method_name: "Update",
  },

  // Interview
  {
    path: "/ta-interviews",
    component: <Interview />,
    module_name: "Interview",
    method_name: "View",
  },
  {
    path: "/ta-interviews-add",
    component: <AddInterview />,
    module_name: "Interview",
    method_name: "Add",
  },
  {
    path: "/ta-inetrview-edit/:id",
    component: <AddInterview />,
    module_name: "Interview",
    method_name: "Update",
  },

  //Holidays
  {
    path: "/ta-holidays",
    component: <HolidaysHome />,
    module_name: "Holidays",
    method_name: "View",
  },
  {
    path: "/ta-holidays-add",
    component: <AddHoliday />,
    module_name: "Holidays",
    method_name: "Add",
  },
  {
    path: "/ta-holidays-edit/:id",
    component: <EditHoliday />,
    module_name: "Holidays",
    method_name: "Update",
  },

  // leave Types
  {
    path: "/ta-leave-types",
    component: <LeaveTypes />,
    module_name: "Leave Type",
    method_name: "View",
  },
  {
    path: "/ta-leave-types-add",
    component: <AddLeaveTypes />,
    module_name: "Leave Type",
    method_name: "Add",
  },
  {
    path: "/ta-leave-types-edit/:id",
    component: <EditLeaveTypes />,
    module_name: "Leave Type",
    method_name: "Update",
  },

  //leaves
  {
    path: "/ta-leaves",
    component: <Leaves />,
    module_name: "Leave",
    method_name: "View",
  },
  {
    path: "/add-leaves",
    component: <AddLeaves />,
    module_name: "Leave",
    method_name: "Add",
  },
  {
    path: "/edit-leaves",
    component: <EditLeaves />,
    module_name: "Leave",
    method_name: "Update",
  },
  {
    path: "/pending-leave-approvals",
    component: <PendingLeaveApproval />,
    module_name: "Leave Approve",
    method_name: "View",
  },

  //leave-history
  {
    path: "/ta-leave-history",
    component: <LeaveHistory />,
    module_name: "Leave History",
    method_name: "View",
  },

  //  Technology
  {
    path: "/ta-tech",
    component: <HomeTechnology />,
    module_name: "Technology",
    method_name: "View",
  },
  {
    path: "/ta-tech-add",
    component: <AddTechnology />,
    module_name: "Technology",
    method_name: "Add",
  },
  {
    path: "/ta-tech-edit/:id",
    component: <EditTechnology />,
    module_name: "Technology",
    method_name: "Update",
  },

  // Reports
  {
    path: "/daily-checkin-checkout",
    component: <DailyCheckinCheckOut />,
    module_name: "Daily Checkin-Out",
    method_name: "View",
  },
  {
    path: "/breaks-data",
    component: <BreaksData />,
    module_name: "Daily Checkin-Out",
    method_name: "View",
  },
  {
    path: "/late-checkins",
    component: <LateCheckinData />,
    module_name: "Late CheckIn-Out",
    method_name: "View",
  },
  {
    path: "/miss-checkouts",
    component: <MissCheckoutData />,
    module_name: "Miss CheckOut",
    method_name: "View",
  },
  {
    path: "/logs",
    component: <LogsData />,
    module_name: "Reports-Logs",
    method_name: "View",
  },

  //  Roles
  {
    path: "/ta-roles-add",
    component: <AddRole />,
    module_name: "Roles",
    method_name: "Add",
  },
  {
    path: "/ta-roles-edit/:id",
    component: <EditRole />,
    module_name: "Roles",
    method_name: "Update",
  },
  {
    path: "/ta-roles",
    component: <RolesHome />,
    module_name: "Roles",
    method_name: "View",
  },

  // HRM Dashboard
  {
    path: "/ta-hrm/lead",
    component: <HomeLead />,
    module_name: "Lead",
    method_name: "View",
  },
  {
    path: "/ta-hrm/lead-add",
    component: <AddLead />,
    module_name: "Lead",
    method_name: "Add",
  },
  {
    path: "/ta-hrm/lead-edit/:id",
    component: <EditLead />,
    module_name: "Lead",
    method_name: "Update",
  },
  {
    path: "/ta-hrm/resume-upload",
    component: <HomeResume />,
    module_name: "Resume Upload",
    method_name: "View",
  },
  {
    path: "/ta-hrm/resume-upload-add",
    component: <AddResumeUpload />,
    module_name: "Resume Upload",
    method_name: "Add",
  },

  {
    path: "/ta-employee-awards",
    component: <EmployeeAwards />,
    module_name: "Employee Award",
    method_name: "View",
  },

  {
    path: "/add-employee-awards",
    component: <AddEmployeeAwards />,
    module_name: "Employee Award",
    method_name: "Add",
  },

  {
    path: "/ta-awards/award-edit/:id",
    component: <EditEmployeeAward />,
    module_name: "Employee Award",
    method_name: "Update",
  },

  {
    path: "/add-employee-awards-type",
    component: <AddAwardTypes />,
    module_name: "Employee Award",
    method_name: "Add",
  },

  {
    path: "/ta-awards-type/award-type-edit/:id",
    component: <EditEmployeeAwardType />,
    module_name: "Employee Award",
    method_name: "Update",
  },

  {
    path: "/ta-employee-awards-type",
    component: <AwardTypes />,
    module_name: "Employee Award",
    method_name: "View",
  },

  //Chats
  {
    path: "/ta-personal-chats",
    component: <ChatComponent />,
    module_name: "Chats",
    method_name: "View",
  },

  {
    path: "/chats-test",
    component: <ChatsTest />,
    module_name: "Chats",
    method_name: "View",
  },

  // Tasks
  {
    path: "/tasks-list",
    component: <TasksList />,
    module_name: "Task",
    method_name: "View",
  },
  {
    path: "/tasks-create",
    component: <TasksCreate />,
    module_name: "Task",
    method_name: "Add",
  },

  { path: "/screenshots", component: <ScreenShots /> },

  { path: "/document-types", component: <DocumentsType /> },
  { path: "/add-document-types", component: <AddDocumentsType /> },
  {path: "/edit-documents-type/:id", component: <EditDocumentsType/>},

  //Projects
  { path: "/projects-grid", component: <ProjectsGrid /> },
  { path: "/projects-list", component: <ProjectsList /> },
  { path: "/projects-overview", component: <ProjectsOverview /> },
  { path: "/projects-overview/:id", component: <ProjectsOverview /> },
  { path: "/projects-create", component: <ProjectsCreate /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
