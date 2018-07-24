import React, {PropTypes} from 'react';
import { Link, IndexLink } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as sessionActions from '../../actions/sessionActions';
import * as today from '../common/Date';
import auth from '../../auth/authenticator'
import moment from 'moment';
global.jQuery = require('jquery');

var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format(' h:mm:ss A, MM-DD-YYYY'));
};

class HeaderNoSidebar extends React.Component {
  constructor(props) {
    super();
    this.logOut = this.logOut.bind(this);
  }
  componentDidMount() {
    //Jquery Script for header Date and Time
    jQuery(document).ready(function() {
      //initialize the javascript
      App.init();
      datetime = jQuery('#datetime')
      update();
      setInterval(update, 1000);
    })
  }

  logOut(event) {
    event.preventDefault();
    this.props.actions.logOutUser();
  }

  render() {
    if (auth.loggedIn()) {
      return (
      <nav className="navbar navbar-default am-top-header">
      <div className="container-fluid">
        <div className="navbar-header">
            <div className="device-logo"><span><img width="130px" src={require('./cascadia-liquor-store.png')} /></span></div>
            <a href="#" className="am-toggle-left-sidebar navbar-toggle collapsed">
              <span className="icon-bar"><span></span><span></span><span></span></span>
            </a>
            <a href="index.html" className="navbar-brand"><img width="130px" src={require('./cascadia-liquor-store.png')} /></a>
        </div>
        <a href="#" className="am-toggle-right-sidebar">
          <span className="icon s7-menu2"></span>
        </a>
        {/* <a href="#" data-toggle="collapse" data-target="#am-navbar-collapse" className="am-toggle-top-header-menu collapsed ">
          <span className="icon icon-559"></span>
        </a> */}
        <div id="am-navbar-collapse" className="navbar-collapse">
            <ul className="nav navbar-nav navbar-right am-user-nav">
              <li className="dropdown">
                  <a href="#" data-toggle="dropdown" role="button" aria-expanded="false" className="dropdown-toggle">
                    <b><img src={require('./user.svg')} /></b>
                    <span className="user-name hidden-md-up">Samantha Amaretti</span> <span className="angle-down icon-559"></span>
                  </a>
                  <ul role="menu" className="dropdown-menu">
                    <li><a href="#"> <span className="icon icon-1222"></span>My profile</a></li>
                    <li><a href="#"> <span className="icon icon-886"></span>Settings</a></li>
                    <li><a href="/logout" onClick={this.logOut}> <img src={require('./power.svg')} /> Sign Out</a></li>
                  </ul>
              </li>
            </ul>
            <ul className="navbar-nav navbar-right dashboard_time hidden-sm-down">
              <li><a className="def-cursor" href="#"> <img src={require('./clock.svg')} /><b id="datetime"></b></a></li>
            </ul>
        </div>
      </div>
      </nav>
      );
    } else {
      return (
        <nav>

        </nav>
      );
    }
  }
}

HeaderNoSidebar.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
  return {logged_in: state.session};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNoSidebar);