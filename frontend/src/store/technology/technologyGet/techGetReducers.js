import {
  GET_TECHNOLOGY_REQUEST,
  GET_TECHNOLOGY_SUCCESS,
  GET_TECHNOLOGY_FAIL,
} from "../technologyGet/techGetActionTypes"

const initialState = {
  loading: false,
  error: null,
  data: {},
}

const getTechnologyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TECHNOLOGY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case GET_TECHNOLOGY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      }
    case GET_TECHNOLOGY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default getTechnologyReducer
