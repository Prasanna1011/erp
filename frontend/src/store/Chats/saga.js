import { put, takeEvery } from "redux-saga/effects";
import { GET_CONTACTS, GET_CHATS , GET_GROUPS } from "./actionTypes";
import { getContactsSuccess, getContactsFail, getChatsSuccess, getChatsFail, getGroupsSuccess, getGroupsFail } from "./actions";
import { API_GET_CHAT_USERS_LIST, API_GROUP_LIST_GET } from "Apis/api";
import axios from "axios";
import GetAuthToken from "TokenImport/GetAuthToken"

const config = GetAuthToken()

function* onGetContacts() {
    try {
        const { data } = yield axios.get(API_GET_CHAT_USERS_LIST, config)
        yield put(getContactsSuccess(data))
    } catch (error) {
        yield put(getContactsFail(error))
    }
}

function* onGetGroups() {
    try{
        console.log('onGetGroups saga called');
        const { data } = yield axios.get(`${API_GROUP_LIST_GET}?is_personal=false`, config);
        yield put(getGroupsSuccess(data))
    }catch(error){
        yield put(getGroupsFail(error))
    }
}

function* onGetChats() {
    try{
        console.log('onGetChats saga called');
        const { data } = yield axios.get(`${API_GROUP_LIST_GET}?is_personal=true`, config);
        yield put(getChatsSuccess(data))
    }catch(error){
        yield put(getChatsFail(error))
    }
}

function* chatsSagaWatch() {
    yield takeEvery(GET_CONTACTS, onGetContacts)
    yield takeEvery(GET_CHATS, onGetChats)
    yield takeEvery(GET_GROUPS, onGetGroups)
}

export default chatsSagaWatch