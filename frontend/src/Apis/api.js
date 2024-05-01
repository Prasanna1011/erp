// API_BASE_URL

// LOGIN API'S
export const API_LOGIN = `${API_BASE_URL}/api/login/`;

// Clients

export const API_ADD_CLIENTS = `${API_BASE_URL}/api/client/`;
export const API_GET_ALL_CLIENTS = `${API_BASE_URL}/api/get-clients/`;
export const API_GET_ALL_CLIENTS_PAGINATED = `${API_BASE_URL}/api/client-list-view/`;
export const API_GET_CLIENTS_BY_ID = `${API_BASE_URL}/api/get-client/`;
export const API_DELETE_CLIENTS = `${API_BASE_URL}/api/remove-client/`;
export const API_UPDATE_CLIENTS = `${API_BASE_URL}/api/upgrade-client/`;

// Holidays
export const API_GET_HOLIDAY = `${API_BASE_URL}/api/get-holidays/`;
export const API_ADD_HOLIDAY = `${API_BASE_URL}/api/add-holidays/`;
export const API_GET_HOLIDAY_BY_ID = `${API_BASE_URL}/api/get-holiday/`;
export const API_DELETE_HOLIDAY = `${API_BASE_URL}/api/delete-holiday/`;
export const API_UPDATE_HOLIDAY = `${API_BASE_URL}/api/upgrade-holidays/`;

// Leave Types

export const API_ADD_LEAVE_TYPE = `${API_BASE_URL}/api/add-leavetype/`;
export const API_GET_LEAVE_TYPE = `${API_BASE_URL}/api/get-leavetypes/`;
export const API_GET_LEAVE_TYPE_BY_ID = `${API_BASE_URL}/api/get-one-leavetype/`;
export const API_DELETE_LEAVE_TYPE = `${API_BASE_URL}/api/delete-leavetype/`;
export const API_UPDATE_LEAVE_TYPE = `${API_BASE_URL}/api/upgrade-leavetype/`;

// Candidate Lead
export const API_ADD_LEAD = `${API_BASE_URL}/api/get-all-leads/`;
export const API_TO_ADD_LEAD = `${API_BASE_URL}/api/add-lead/`;
export const API_DELETE_LEAD = `${API_BASE_URL}/api/delete-lead/`;
export const API_GET_LEAD_BY_ID = `${API_BASE_URL}/api/get-one-lead/`;
export const API_UPDATE_LEAD = `${API_BASE_URL}/api/upgrade-lead/`;

// TECHNOLOGY
export const API_TECHNOLOGY_POST_GET = `${API_BASE_URL}/api/get-technology/`;
export const API_TECHNOLOGY_UPDATE_GETBYID = `${API_BASE_URL}/api/upgrade-technology/`;
export const API_DELETE_TECHNOLOGY = `${API_BASE_URL}/api/delete-technology/`;
export const API_POST_TECHNOLOGY = `${API_BASE_URL}/api/technology/`;

//

// RESUME
export const API_RESUME_UPLOAD_GET_POST = `${API_BASE_URL}/api/add-resume/`;
export const API_RESUME_UPLOAD_DELETE = `${API_BASE_URL}/api/delete-resume/`;
export const API_RESUME_GET_ALL = `${API_BASE_URL}/api/get-all-resume/`;

// ROLE AND PERMISSION
// modules names
export const API_MODULE_NAME_GET = `${API_BASE_URL}/api/get-all-module/`;
export const API_METHOD_NAME_GET = `${API_BASE_URL}/api/get-method/`;

// Create Role
export const API_ROLE_ADD = `${API_BASE_URL}/api/roles/`;
export const API_GET_ALL_ROLES = `${API_BASE_URL}/api/get-all-roles/`;
export const API_ROLE_DELETE = `${API_BASE_URL}/api/delete-role/`;
export const API_ROLES_GET_UPDATE_BY_ID = `${API_BASE_URL}/api/upgrade-roles/`;
export const API_USER_GET_ROLES_PERMISSIONS = `${API_BASE_URL}/api/get-user-roles-permissions/`;
export const API_GET_PAGINATED_ROLES_DATA = `${API_BASE_URL}/api/role-list-view/`;

//Positions
export const API_GET_POSITIONS = `${API_BASE_URL}/api/get-position/`;

// USERS
export const API_ADD_USERS = `${API_BASE_URL}/api/createuser/`;
export const API_GET_USERS = `${API_BASE_URL}/api/get-users/`;
export const API_GET_USER_BY_ID = `${API_BASE_URL}/api/get-user/`;
export const API_DELETE_USER = `${API_BASE_URL}/api/delete-user/`;
export const API_UPDATE_USER = `${API_BASE_URL}/api/upgrade-user/`;
export const API_USER_STATUS_TOGGLE = `${API_BASE_URL}/api/disable-user/`;
export const API_GET_SENIOR = `${API_BASE_URL}/api/get-seniors-list/`;
export const API_GET_SENIORS_FOR_SINGLE_VALUE = `${API_BASE_URL}/api/get-seniors/`;
export const API_GET_USERS_PAGINATED = `${API_BASE_URL}/api/tauser-list-view/`;

// Projets
export const API_ADD_PROJECT = `${API_BASE_URL}/api/create-project/`;
export const API_GET_PROJECTS = `${API_BASE_URL}/api/get-project/`;
export const API_GET_PAGINATED_PROJECTS_DATA = `${API_BASE_URL}/api/project-list-view/`;
export const API_UPDATE_PROJECT = `${API_BASE_URL}/api/upgrade-project/`;
export const API_PROJECT_STATUS_TOGGLE = `${API_BASE_URL}/api/project-status/`;
export const API_DELETE_PROJECT = `${API_BASE_URL}/api/delete-project/`;

// Inetrview
export const API_ADD_INTERVIEW = `${API_BASE_URL}/api/add-interview/`;
export const API_UPDATE_INTERVIEW = `${API_BASE_URL}/api/interiview/`;
export const API_GET_INTERVIEW = `${API_BASE_URL}/api/get-interview/`;
export const API_GET_INTERVIEW_BY_ID = `${API_BASE_URL}/api/get-interview/`;
export const API_GET_PAGINATED_INTERVIEW_DATA = `${API_BASE_URL}/api/interivew-list/`;
export const API_DELETE_INTERVIEW = `${API_BASE_URL}/api/delete-interview/`;

//Task
export const API_CREATE_TASK = `${API_BASE_URL}/api/create-task/`;
export const API_TASK_STATUS_UPDATE = `${API_BASE_URL}/api/task-upgrade-status/`;
export const API_DELETE_TASKS = `${API_BASE_URL}/api/delete-Task/`;
export const API_UPDATE_TASK = `${API_BASE_URL}/api/upgrade-task/`;
export const API_GET_TASK_LIST = `${API_BASE_URL}/api/get-task-list/`;
export const API_TASK_PAUSE_OR_RESUME = `${API_BASE_URL}/api/task-on/`;
export const API_GET_TASK_LIST_WITH_FILTERS = `${API_BASE_URL}/api/task-filter/`
export const API_TASK_COMMENT = `${API_BASE_URL}/api/task-comment/`
export const API_TASK_ACTIVITY = `${API_BASE_URL}/api/get-task-time-log/`
export const GET_FILTER_TASK_API = `${API_BASE_URL}/api/Get-ProjectBy-User/`
export const GET_DEVELOPERS_IN_PROJECT = `${API_BASE_URL}/api/get-developers-in-project/`

//Leaves
export const API_ADD_GET_LEAVES = `${API_BASE_URL}/api/add-leave/`;
export const API_GET_LEAVES_LIST = `${API_BASE_URL}/api/leave-list/`;
export const DELETE_LEAVES = `${API_BASE_URL}/api/delete-leave/`;
export const GET_LEAVES_BY_ID_UPDATED_LEAVES = `${API_BASE_URL}/api/upgrade-leave/`;
export const GET_PARTICULAR_USER_LEAVE_HISTORY = `${API_BASE_URL}/api/leave-history/`;
export const GET_COMPLETE_LEAVE_HISTORY = `${API_BASE_URL}/api/leave-historyreport/ `;
export const APPROVE_LEAVE_API = `${API_BASE_URL}/api/approved-leave/`;
export const GET_PAGINATED_REPORTS_DATA = `${API_BASE_URL}/api/reports-logs-list/`;
export const GET_LEAVES_BY_ID =`${API_BASE_URL}/api/get-leave-id/`;

//Checkin checkout
// export const API_GET_CHECK_IN_CHECK_OUT_BY_ID = `${API_BASE_URL}/api/dailycheckincheckout/`;
export const API_CHECK_IN = `${API_BASE_URL}/api/checkin/`;
export const API_CHECK_OUT = `${API_BASE_URL}/api/checkout/ `;
export const API_GET_CHECK_IN_CHECKOUT_STATUS = `${API_BASE_URL}/api/get-chekin-checkout/`;
export const API_MISS_CHECKOUT = `${API_BASE_URL}/api/miss-checkout/`;
export const API_PARTICULAR_USER_CHECKIN_CHECKOUT_DATA = `${API_BASE_URL}/api/get-user-chekin-checkout/`;
export const API_GET_CHECKIN_CHECKOUT_LIST_DATA = `${API_BASE_URL}/api/daily-checkin-checkout-list/`;

//Breaks
export const API_GET_BREAKS = `${API_BASE_URL}/api/Get-break/`;
export const API_START_BREAK = `${API_BASE_URL}/api/break/`;
export const API_END_BREAK = `${API_BASE_URL}/api/break-out/`;
export const API_GET_ALL_BREAKS_DATA = `${API_BASE_URL}/api/daily-breakin-breakout-list/`;

//Calendar
export const API_CALENDAR_EVENTS = `${API_BASE_URL}/api/calender-data/`;

//Late Checkin
export const API_LATE_CHECKIN_DATA = `${API_BASE_URL}/api/late-checkin/`;

//Miss Checkout
export const API_MISSED_CHECKOUT_DATA = `${API_BASE_URL}/api/miss-checkout/`;

//Roles Permissions Get
export const API_GET_ROLE_PERMSSIONS_DATA = `${API_BASE_URL}/api/get-user-roles-permissions/`;

//TaUser Profile APIs
export const API_GET_UPDATE_USER_PROFILE = `${API_BASE_URL}/api/update-user-profile/`;

//Employee Awards
export const API_EMPLOYEE_LIST = `${API_BASE_URL}/api/employee-award-list/`;
export const API_ADD_EMPLOYEE_AWARDS = `${API_BASE_URL}/api/employee-award-add/`;
export const API_DELETE_EMPLOYEE_AWARDS = `${API_BASE_URL}/api/employee-award-delete/`;
export const API_EDIT_EMPLOYEE_AWARDS = `${API_BASE_URL}/api/employee-award-update/`;

//Employee Award Types
export const API_GET_EMPLOYEE_AWARD_TYPE = `${API_BASE_URL}/api/award-type-list/`;
export const API_ADD_EMPLOYEE_AWARD_TYPE = `${API_BASE_URL}/api/award-type-add/`;
export const API_DELETE_EMPLOYEE_AWARD_TYPE = `${API_BASE_URL}/api/award-type-delete/`;
export const API_EDIT_EMPLOYEE_AWARD_TYPE = `${API_BASE_URL}/api/award-type-update/`;

//Documents Type 
export const API_POST_DOCUMENTS_TYPE = `${API_BASE_URL}/api/document-detail-add/`
export const API_GET_DOCUMENTS_TYPE = `${API_BASE_URL}/api/document-detail-list/`
export const API_UPDATE_DOCUMENTS_TYPE = `${API_BASE_URL}/api/document-detail-update/`
export const API_DELETE_DOCUMENTS_TYPE = `${API_BASE_URL}/api/document-detail-delete/`
export const API_GET_ALL_DOCUMENTS_TYPE = `${API_BASE_URL}/api/get-docs-all/`

export const API_GET_DASHBOARD_AWARDS = `${API_BASE_URL}/api/dashboard/employee-awards/`;
export const API_GET_DASHBOARD_BREAKS_DATA = `${API_BASE_URL}/api/dashboard/today-break-list/`;

//Chat Servers
export const API_GET_CHAT_USERS_LIST = `${API_BASE_URL}/chats/user-list/`;
export const API_POST_PERSONAL_CHAT_GROUP = `${API_BASE_URL}/chats/personal-chat-group/`;
export const API_GET_CHAT_HISTORY = `${API_BASE_URL}/chats/group-messages/`;
export const API_CREATE_GROUP = `${API_BASE_URL}/chats/members-create-group/`;
export const API_GROUP_LIST_GET = `${API_BASE_URL}/chats/group-list/`;
export const API_REMOVE_MEMBERS_FROM_GROUP = `${API_BASE_URL}/chats/remove-member-grom-group/`
export const API_CHATS_ONLINE_STATUS = `${API_BASE_URL}/chats/profile-status-update/`
export const API_CHATS_PROFILE_PICTURE = `${API_BASE_URL}/chats/profile-update/`
export const API_CHATS_ATTACHMENTS = `${API_BASE_URL}/chats/attachement/`
export const API_GROUP_NAME_PIC_UPDATE = `${API_BASE_URL}/chats/group-get-update/`
export const API_ADD_MEMBERS_TO_GROUP = `${API_BASE_URL}/chats/add-members-to-group/`

//change password
export const API_CHANGE_PASSWORD = `${API_BASE_URL}/api/changepassword/ `;


//CSV export
export const API_ROLE_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-role-export/`
export const API_DOWNLOAD_CLIENT_CSV = `${API_BASE_URL}/api/get-client-export/`;
export const API_USER_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-tauser-export/`
export const API_INTERVIEW_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-interview-export/`
export const API_BREAKS_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-break-export/`
export const API_LEAVE_TYPES_DOWNLOAD_CSV = `${API_BASE_URL}/api/leavetype-export/`
export const API_LEAVES_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-leaves-exports/`
export const API_HOLIDAYS_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-holiday-export/`
export const API_LEAD_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-leads-export/`
export const API_PROJECT_DOWNLOAD_CSV = `${API_BASE_URL}/api/get-project-export/`

//Screenshots 
export const API_GET_SCREENSHOTS = `${API_BASE_URL}/api/screenshot-listview/`