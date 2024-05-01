import {
  GET_TECHNOLOGY_REQUEST,
  GET_TECHNOLOGY_SUCCESS,
  GET_TECHNOLOGY_FAIL,
} from "../technologyGet/techGetActionTypes"

export const getTechnologyRequest = data => ({
  type: GET_TECHNOLOGY_REQUEST,
  payload: data,
})

export const getTechnologyRequestSuccess = data => ({
  type: GET_TECHNOLOGY_SUCCESS,
  payload: data,
})

export const getTechnologyRequestFailure = error => ({
  type: GET_TECHNOLOGY_FAIL,
  payload: error,
})
