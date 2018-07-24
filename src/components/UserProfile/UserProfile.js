// @flow
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import DefaultLayout from '../common/DefaultLayout'
import {Link} from 'react-router';
import ChangePassword from './ChangePassword';
//import ChangePersonalInformation from './ChangePersonalInformation';

let currentDomain = window.sessionStorage.getItem("currentdomainname");
let currentStore = window.sessionStorage.getItem("currentstorename");

class UserProfile extends Component {
  state = {
  };
  render() {
		var currentDomain = window.sessionStorage.getItem("currentdomainname");
		var currentStore = window.sessionStorage.getItem("currentstorename");
    return (

      <DefaultLayout>
        <div className="page-head inner__pageHead">
            <div className="domain-icon"> <img src={require( '../Users/user-list.svg')}/> <h2>Profile</h2></div>

            <ol className="breadcrumb">
              <li><Link to={`/domains`}>{currentDomain}</Link></li>
              <li><Link to={`/stores`}>{currentStore}</Link></li>
              <li><Link to={`/dashboard`}>Dashboard</Link></li>
              <li><Link to={`/setup`}>Setup</Link></li>
              <li>User Profile</li>
            </ol>
        </div>
        <main>
          <div className="md-mt-50">
            <ChangePassword />
          </div>
        </main>

      </DefaultLayout>
    );
  }
}

export default UserProfile;
