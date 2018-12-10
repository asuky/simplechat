import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import App from './components/App';

import rootReducer from './reducers/reducers';

import { updateField,
         initRoomState } from './actions/actions';

import allSagas from './sagas/allsagas';

const sagaMiddlewares = createSagaMiddleware();
const logger = createLogger();
const store = createStore(rootReducer, applyMiddleware(sagaMiddlewares, logger));
sagaMiddlewares.run(allSagas);

const mapStateToProps = (state) => {
    return {
        roomid: state.ChatUI.roomid,
        nickname: state.ChatUI.nickname,
        button_label: state.ChatUI.button_label,
        readonly: state.App.readonly,
        csrf: state.App.csrf
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateField: (property, value) => { dispatch(updateField(property, value)); },
        initRoomState: (roomid, nickname, csrf) => { dispatch(initRoomState(roomid, nickname, csrf)); },
        pinging: () => { dispatch(pinging()); }
    };
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root')
);