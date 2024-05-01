import {
    GET_CONTACTS_SUCCESS,
    GET_CONTACTS_FAIL,
    GET_CHATS_SUCCESS,
    GET_CHATS_FAIL,
    GET_GROUPS_SUCCESS,
    GET_GROUPS_FAIL,
} from "./actionTypes"

const INIT_STATE = {
    contacts: [],
    groups: [],
    chats: [],
    error: {},
}

const ChatsReducers = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CONTACTS_SUCCESS:
            return {
                ...state,
                contacts: action.payload,
            }

        case GET_CONTACTS_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_CHATS_SUCCESS:
            return {
                ...state,
                chats: action.payload,
            }

        case GET_CHATS_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_GROUPS_SUCCESS:
            return {
                ...state,
                groups: action.payload,
            }

        case GET_GROUPS_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        default:
            return state
    }
}

export default ChatsReducers