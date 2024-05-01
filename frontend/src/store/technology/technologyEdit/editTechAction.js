import {
  UPDATE_TECHNOLOGY_REQUEST,
  UPDATE_TECHNOLOGY_SUCCESS,
  UPDATE_TECHNOLOGY_FAILURE,
} from "../technologyEdit/editTechActionTypes"

export const updateTechnologyRequest = data => ({
  type: UPDATE_TECHNOLOGY_REQUEST,
  payload: {id,data},
})

export const updateTechnologyRequestSuccess = data => ({
  type: UPDATE_TECHNOLOGY_SUCCESS,
  payload: data,
})

export const updateTechnologyRequestFailure = error => ({
  type: UPDATE_TECHNOLOGY_FAILURE,
  payload: error,
})
