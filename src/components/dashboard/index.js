import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as sessionActions from '../../actions/sessionActions';
import HeaderNoSidebar     from '../common/HeaderNoSidebar';
import Sidebar from '../common/Sidebar';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import DefaultLayout from '../common/DefaultLayout'
import '../../styles/tabs.scss';


class Dashboard extends Component {
constructor(props) {
  super();
  this.logOut = this.logOut.bind(this);
}

logOut(event) {
  event.preventDefault();
  this.props.actions.logOutUser();
}
render(){
    return(
      <div className="dashboard">
          <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
            <h2>Dashboard</h2>
      </div>
    )
  }
}
export default Dashboard;
