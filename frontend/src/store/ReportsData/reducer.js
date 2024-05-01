import { 
    API_DASHBOARD_CHECKIN_DATA_FAILURE,
    API_DASHBOARD_CHECKIN_DATA_SUCCESS,
    API_DASHBOARD_BREAKS_DATA_SUCCESS,
    API_DASHBOARD_BREAKS_DATA_FAILURE,
} from "./actionTypes"

const INIT_STATE = {
    checkInData: [],
    BreaksData: [],
    error: []
}

const dashboardDataReducers = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_DASHBOARD_CHECKIN_DATA_SUCCESS: 
            return {
                ...state, 
                dashboardCheckInData: action.payload
            };

        case API_DASHBOARD_CHECKIN_DATA_FAILURE: 
            return {
                ...state,
                dashboardCheckInData: action.payload
            };
        
        case API_DASHBOARD_BREAKS_DATA_SUCCESS: 
            return {
                ...state,
                dashboardBreaksData: action.payload
            };

        case API_DASHBOARD_BREAKS_DATA_FAILURE:
            return {
                ...state,
                dashboardBreaksData: action.payload
            }

        default: 
            return state;
    }
}

export default dashboardDataReducers;