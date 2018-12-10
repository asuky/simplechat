export const UPDATE_FIELD='UPDATE_FIELD';
export const INIT_ROOM_STATE='INIT_ROOM_STATE';
export const PINGING='PINGING';

export const SEND_RESPONSE='SEND_RESPONSE';
export const WAITING_ANSWER='WAITING_ANSWER';
export const START_COMMUNICATION='START_COMMUNICATION';

export function pinging() {
    return {
        type: PINGING
    }
}

export function updateField(property, value) {
    return {
        type: UPDATE_FIELD,
        payload: {
            [property]: value
        }
    }
}

export function initRoomState(roomid, nickname, csrf) {
    return {
        type: INIT_ROOM_STATE,
        payload: {
            "csrf": csrf,
            "roomid": roomid,
            "nickname": nickname
        }
    }
}

export function sendResponse() {
    return {
        type: SEND_RESPONSE
    }
}

export function waitingAnswer(peerConnection) {
    return {
        type: WAITING_ANSWER,
        payload: {
            "pc": peerConnection
        }
    }
}

export function startCommunication(dataChannel) {
    return {
        type: START_COMMUNICATION
    }
}