import {
    GET_CONTACTS,
    GET_CONTACTS_FAIL,
    GET_CONTACTS_SUCCESS,
    GET_GROUPS,
    GET_GROUPS_FAIL,
    GET_GROUPS_SUCCESS,
    GET_CHATS,
    GET_CHATS_FAIL,
    GET_CHATS_SUCCESS,
} from "./actionTypes"

export const getContacts = () => ({
    type: GET_CONTACTS,
  })
  
  export const getContactsSuccess = contacts => ({
    type: GET_CONTACTS_SUCCESS,
    payload: contacts,
  })
  
  export const getContactsFail = error => ({
    type: GET_CONTACTS_FAIL,
    payload: error,
  })

  export const getChats = () => ({
    type: GET_CHATS,
  })
  
  export const getChatsSuccess = chats => ({
    type: GET_CHATS_SUCCESS,
    payload: chats,
  })
  
  export const getChatsFail = error => ({
    type: GET_CHATS_FAIL,
    payload: error,
  })
  
  export const getGroups = () => ({
    type: GET_GROUPS,
  })
  
  export const getGroupsSuccess = groups => ({
    type: GET_GROUPS_SUCCESS,
    payload: groups,
  });
  
  export const getGroupsFail = error => ({
    type: GET_GROUPS_FAIL,
    payload: error,
  })