import { takeEvery, actionChannel, put } from 'redux-saga/effects';

import { INIT_ROOM_STATE, WAITING_ANSWER } from '../actions/actions';

import { initConnection, checkAnswer } from './RoomMgmt';

import { pinger } from './RoomMgmt';

export function* allSagas() {

    const callbackChannel = yield actionChannel('OPEN_CHATFORM');

    yield takeEvery(INIT_ROOM_STATE, initConnection, callbackChannel);
    yield takeEvery(WAITING_ANSWER, checkAnswer);
    yield takeEvery(callbackChannel, pinger);
}

export default allSagas;