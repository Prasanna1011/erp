import { put, takeEvery, takeLatest } from "redux-saga/effects"
import { getCheckInDataSuccess, getCheckInDataFailure, getBreaksDataSuccess, getBreaksDataFailure } from "./actions"
import { API_DASHBOARD_GET_CHECKIN_DATA, API_DASHBOARD_BREAKS_DATA } from "./actionTypes"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import {
    API_PARTICULAR_USER_CHECKIN_CHECKOUT_DATA,
    API_GET_DASHBOARD_BREAKS_DATA
  } from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken"

const config = GetAuthToken()

function* getDashboardCheckinData(action) {
    try{
        const {payload} = action
        const {data} = yield axios.get(API_PARTICULAR_USER_CHECKIN_CHECKOUT_DATA, config)
        yield put(getCheckInDataSuccess(data))
    }catch(error){
        yield put(getCheckInDataFailure(error))
    }
}

function* getDashboardBreaksData(action) {
    try{
        const {data} = yield axios.get(API_GET_DASHBOARD_BREAKS_DATA, config)
        yield put(getBreaksDataSuccess(data))
    }catch(error){
        yield put(getBreaksDataFailure(error))
    }
}

function* getDashboardCkeckinDataSagaWatch() {
    yield takeEvery(API_DASHBOARD_GET_CHECKIN_DATA, getDashboardCheckinData)
    yield takeEvery(API_DASHBOARD_BREAKS_DATA, getDashboardBreaksData)
}

export default getDashboardCkeckinDataSagaWatch