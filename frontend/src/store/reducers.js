import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"


//tasks
import tasks from "./tasks/reducer"


//Dashboard
import Dashboard from "./dashboard/reducer"


// technology
import addTechnologyReducer from "./technology/reducers"

//

import getTechnologyReducer from "../store/technology/technologyGet/techGetReducers"
import updateTechnologyReducer from "../store/technology/technologyEdit/editTechReducers"
import clientReducer from "./slices/clientSlice";

import dashboardDataReducers from "./ReportsData/reducer"

import ChatsReducers from "./Chats/reducer"

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  tasks,
  Dashboard,
  addTechnologyReducer,
  getTechnologyReducer,
  updateTechnologyReducer,
  clientReducer,
  dashboardDataReducers,
  ChatsReducers
})

export default rootReducer