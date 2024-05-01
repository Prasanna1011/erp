import {
  ADD_TECHNOLOGY_REQUEST,
  ADD_TECHNOLOGY_SUCCESS,
  ADD_TECHNOLOGY_FAIL,
} from "./techActionTypes"

const initialState = {
  loading: false,
  error: null,
  data: {},
}

const addTechnologyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TECHNOLOGY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case ADD_TECHNOLOGY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      }
    case ADD_TECHNOLOGY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default addTechnologyReducer
