import { put, takeLatest } from "redux-saga/effects"
import {
  getTechnologyRequestSuccess,
  getTechnologyRequestFailure,
} from "../technologyGet/techGetAction" // Assuming your action file is named "actions.js"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { API_TECHNOLOGY_POST_GET } from "Apis/api"
import { GET_TECHNOLOGY_REQUEST } from "./techGetActionTypes"
import GetAuthToken from "TokenImport/GetAuthToken"
// import { navigate } from "react-router-dom" // You should import navigate from your router library

// Local storage token Start
const config = GetAuthToken()
console.log(config)
// Local storage token End

function* getTechnologies(action) {
  try {
    console.log("action", action.payload)
    const { payload } = action // Assuming you have values in your action
    console.log("payloadValues", payload)
    const { data } = yield axios.get(API_TECHNOLOGY_POST_GET, config)

    yield put(getTechnologyRequestSuccess(data))
    // yield navigate("/ta-tech") // Use your router library's navigation function here
  } catch (error) {
    yield put(getTechnologyRequestFailure(error))
  }
}

function* getTechnologySagaWatch() {
  yield takeLatest(GET_TECHNOLOGY_REQUEST, getTechnologies)
}

export default getTechnologySagaWatch
