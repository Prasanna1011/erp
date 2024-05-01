import {
  ADD_TECHNOLOGY_REQUEST,
  ADD_TECHNOLOGY_SUCCESS,
  ADD_TECHNOLOGY_FAIL,
} from "./techActionTypes"

export const addTechnologyRequest = data => ({
  type: ADD_TECHNOLOGY_REQUEST,
  payload: data,
})

export const addTechnologyRequestSuccess = data => ({
  type: ADD_TECHNOLOGY_SUCCESS,
  payload: data,
})

export const addTechnologyRequestFailure = error => ({
  type: ADD_TECHNOLOGY_FAIL,
  payload: error,
})
