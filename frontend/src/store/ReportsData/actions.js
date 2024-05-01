import {
    API_DASHBOARD_GET_CHECKIN_DATA, 
    API_DASHBOARD_CHECKIN_DATA_SUCCESS,
    API_DASHBOARD_CHECKIN_DATA_FAILURE,
    API_DASHBOARD_BREAKS_DATA_SUCCESS,
    API_DASHBOARD_BREAKS_DATA_FAILURE,
    API_DASHBOARD_BREAKS_DATA
} from "./actionTypes"

export const getCheckinData = () => ({
    type: API_DASHBOARD_GET_CHECKIN_DATA,
})

export const getCheckInDataSuccess = (dashboardCheckInData) => ({
    type: API_DASHBOARD_CHECKIN_DATA_SUCCESS,
    payload: dashboardCheckInData
})

export const getCheckInDataFailure = (dashboardCheckInData) => ({
    type: API_DASHBOARD_CHECKIN_DATA_FAILURE,
    payload: dashboardCheckInData
})

export const getBreaksData = () => ({
    type: API_DASHBOARD_BREAKS_DATA
})

export const getBreaksDataSuccess = (dashboardBreaksData) => ({
    type: API_DASHBOARD_BREAKS_DATA_SUCCESS,
    payload: dashboardBreaksData
})

export const getBreaksDataFailure = (dashboardBreaksData) => ({
    type: API_DASHBOARD_BREAKS_DATA_FAILURE,
    payload: dashboardBreaksData
})