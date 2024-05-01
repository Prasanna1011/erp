// sagas.js
import { takeLatest, call, put } from "redux-saga/effects";
import {
  addClientPending,
  addClientSuccess,
  addClientFailure,
  getClientPending,
  getClientSuccess,
  getClientFailure,
  updateClientSuccess,
  updateClientFailure,
} from "./clientSlice";
import {
  API_ADD_CLIENTS,
  API_GET_CLIENTS_BY_ID,
  API_UPDATE_CLIENTS,
} from "Apis/api";
import axios from "axios";
import GetAuthToken from "TokenImport/GetAuthToken";

function* addClientSaga(action) {
  try {
    yield put(addClientPending());
    const config = GetAuthToken();
    const { data } = yield call(
      axios.post,
      API_ADD_CLIENTS,
      action.payload,
      config
    );
    yield put(addClientSuccess(data.data));
  } catch (error) {
    yield put(addClientFailure(error));
  }
}

function* getClientByIdSaga(action) {
  try {
    yield put(getClientPending()); // Dispatch the pending action
    const config = GetAuthToken();
    const apiUrl = `${API_GET_CLIENTS_BY_ID}${action.payload}/`;
    const { data } = yield call(axios.get, apiUrl, config);
    yield put(getClientSuccess(data.data[0]));
  } catch (error) {
    yield put(getClientFailure(error));
  }
}

function* updateClientSaga(action) {
  try {
    yield put(getClientPending()); // Dispatch the pending action
    const config = GetAuthToken();
    const apiUrl = `${API_UPDATE_CLIENTS}${action.payload.id}/`;
    const { data } = yield call(
      axios.post,
      apiUrl,
      action.payload.data,
      config
    );
    yield put(updateClientSuccess(data.data));
  } catch (error) {
    yield put(updateClientFailure(error));
  }
}

// Watcher Saga
function* rootSaga() {
  yield takeLatest("ADD_CLIENT", addClientSaga);
  yield takeLatest("GET_CLIENT_BY_ID", getClientByIdSaga);
  yield takeLatest("UPDATE_CLIENT", updateClientSaga);
  // ... Other watcher sagas
}

export default rootSaga;
