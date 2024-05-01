// sagas.js
import { takeLatest, call, put } from "redux-saga/effects"
import axios from "axios"
import {
  UPDATE_TECHNOLOGY_REQUEST,
  UPDATE_TECHNOLOGY_SUCCESS,
  UPDATE_TECHNOLOGY_FAILURE,
} from "../technologyEdit/editTechActionTypes"

import GetAuthToken from "TokenImport/GetAuthToken"
import { API_TECHNOLOGY_UPDATE_GETBYID } from "Apis/api"

function* updateTechnologySaga({ payload: { id, data } }) {
  try {
    const config = GetAuthToken()
    yield call(
      axios.post,
      `${API_TECHNOLOGY_UPDATE_GETBYID}${id}/`,
      data,
      config
    )
    yield put(UPDATE_TECHNOLOGY_SUCCESS())
  } catch (error) {
    yield put(UPDATE_TECHNOLOGY_FAILURE(error))
  }
}

function* watchUpdateTechnology() {
  yield takeLatest(UPDATE_TECHNOLOGY_REQUEST, updateTechnologySaga)
}

export default watchUpdateTechnology
