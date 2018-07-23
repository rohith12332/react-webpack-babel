import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
const history = createBrowserHistory()

import store from './store';
import AppRoutes from './Routes';

import './css/index.scss';

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppRoutes />
        </ConnectedRouter>
    </Provider>,
  document.getElementById('root')
);