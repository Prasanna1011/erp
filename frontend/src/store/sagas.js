import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import tasksSaga from "./tasks/saga"
import dashboardSaga from "./dashboard/saga"
import addTechnologySagaWatch from "./technology/technologySaga"
import getTechnologySagaWatch from "./technology/technologyGet/techGetSaga"
import watchUpdateTechnology from "./technology/technologyEdit/editTechSaga"
import getDashboardCkeckinDataSagaWatch from "./ReportsData/saga"
import chatsSagaWatch from "./Chats/saga"

export default function* rootSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(tasksSaga),
    fork(dashboardSaga),
    fork(addTechnologySagaWatch),
    fork(getTechnologySagaWatch),
    fork(getTechnologySagaWatch),
    fork(watchUpdateTechnology),
    fork(getDashboardCkeckinDataSagaWatch),
    fork(chatsSagaWatch)
  ])
}