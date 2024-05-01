import { put, takeLatest } from "redux-saga/effects"
import { ADD_TECHNOLOGY_REQUEST } from "./techActionTypes"
import {
  addTechnologyRequestSuccess,
  addTechnologyRequestFailure,
} from "./action.js" // Assuming your action file is named "actions.js"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import GetAuthToken from "TokenImport/GetAuthToken"
import axios from "axios"
import { API_POST_TECHNOLOGY } from "Apis/api"
// import { navigate } from "react-router-dom" // You should import navigate from your router library

// Local storage token Start
const config = GetAuthToken()
// Local storage token End

function* addTechnologies(action) {
  try {
    console.log("action", action.payload)
    console.log("config saga", config)
    const { payload } = action // Assuming you have values in your action
    console.log("payloadValues", payload)
    const { data } = yield axios.post(API_POST_TECHNOLOGY, payload, config)

    toast.success(`Technology added successfully`, {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    })

    yield put(addTechnologyRequestSuccess(data))
    // yield navigate("/ta-tech") // Use your router library's navigation function here
  } catch (error) {
    yield put(addTechnologyRequestFailure(error))
    toast.error(`Something went Wrong`, {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    })
  }
}

function* addTechnologySagaWatch() {
  yield takeLatest(ADD_TECHNOLOGY_REQUEST, addTechnologies)
}

export default addTechnologySagaWatch
