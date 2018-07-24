/*eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';


// JQUERY
global.jQuery = require('jquery');

import './styles/reset.scss';
import './styles/utilities.scss';
import './styles/typography.scss';
import './styles/header.scss';
import './styles/wrapper.css';
import './styles/form.scss';
import './styles/content.scss';
import './styles/grid-table.scss';
import './styles/table-pagination.scss';
import './styles/sidebar.scss';
import './styles/layout.scss';
import './styles/widget.scss';
import './styles/style.scss';
import './styles/responsive.css';
import './styles/line-icons.css';
import './styles/stroke.css';
import './styles/loader.css';
import './styles/login.scss';
import './styles/table-spiner.css';
import './styles/pageHead.scss';
import './styles/react-tabelify.css';
import './styles/dashboardTitle.scss';
import './styles/footer.scss';
import './styles/react-select.min.css';
import './styles/flex.scss';
import './styles/report.scss';

const store = configureStore();


render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);