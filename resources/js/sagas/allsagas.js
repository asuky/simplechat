import { takeEvery } from 'redux-saga/effects';

import { INIT_ROOM_STATE, WAITING_ANSWER } from '../actions/actions';

import { initConnection, checkAnswer } from './RoomMgmt';

export function* allSagas() {
    yield takeEvery(INIT_ROOM_STATE, initConnection);
    yield takeEvery(WAITING_ANSWER, checkAnswer);
    
}

export default allSagas;