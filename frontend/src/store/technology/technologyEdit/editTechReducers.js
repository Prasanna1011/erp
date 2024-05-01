import {
  UPDATE_TECHNOLOGY_REQUEST,
  UPDATE_TECHNOLOGY_SUCCESS,
  UPDATE_TECHNOLOGY_FAILURE,
} from "../technologyEdit/editTechActionTypes"

const initialState = {
  loading: false,
  error: null,
  data: {},
}

const updateTechnologyReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TECHNOLOGY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case UPDATE_TECHNOLOGY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      }
    case UPDATE_TECHNOLOGY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default updateTechnologyReducer
