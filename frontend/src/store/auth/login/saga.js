import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes"
import { apiError, loginSuccess, logoutUserSuccess } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper"
import { API_LOGIN } from "Apis/api"
import axios from "axios"
import { toast } from "react-toastify"


function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(axios.post, `${API_LOGIN}`, {
      username_or_email: user.username_or_email,
      password: user.password,
    })
    localStorage.setItem("authUser", JSON.stringify(response.data))

    yield put(loginSuccess(response.data))
    toast.success("Login successfully ", {
      autoClose: 3000,
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    })
    history("/dashboard")

    // Show success toast when the login is successful
  } catch (error) {
    history("/login")
    toast.error("Check User Id or Password", {
      autoClose: 3000,
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    })
  }
}
// login user End

// login user End

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout)
      yield put(logoutUserSuccess(response))
    }
    console.log("history", history)
    history("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(fireBaseBackend.socialLoginUser, data, type)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
