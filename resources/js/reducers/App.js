import { INIT_ROOM_STATE,
         WAITING_ANSWER,
         PINGING } from '../actions/actions';

const initialState = {
    readonly: false,
    csrf: document.querySelector('meta[name="csrf-token"]').getAttribute('content')
};

export function App (state = initialState, action) {
    
    switch (action.type) {
        case INIT_ROOM_STATE:
            return Object.assign({}, state, {
                readonly: true,
                csrf: action.payload.csrf,
                roomid: action.payload.roomid,
                nickname: action.payload.nickname
            });

        case WAITING_ANSWER:
            return Object.assign({}, state, {
                pc: action.payload.pc
            });

        case PINGING:
        return Object.assign({}, state, {
            ping: true
        });
        default:
            return state;
    }
}