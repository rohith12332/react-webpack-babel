// @flow
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import HeaderNoSidebar from '../common/HeaderNoSidebar';
import Sidebar from '../common/Sidebar';
import SideBarRight from '../common/SideBarRight';
import Footer from '../common/Footer';
import {Link} from 'react-router';
import ChangePassword from './ChangePassword';
import ChangePersonalInformation from './ChangePersonalInformation';

let currentDomain = window.sessionStorage.getItem("currentdomainname");
let currentStore = window.sessionStorage.getItem("currentstorename");

const TabContainer = props =>
  <div style={{ padding: 20 }}>
    {props.children}
  </div>;

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styleSheet = createStyleSheet('UserProfile', theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

class UserProfile extends Component {
  state = {
    index: 1,
  };

  handleChange = (event, index) => {
    this.setState({ index });
  };

  render() {
    const classes = this.props.classes;

    return (
      <div className="am-wrapper am-fixed-sidebar">
        <HeaderNoSidebar />
        <Sidebar />
        <div className="am-content">
          <div className="page-head">
            <div className="domain-icon"> <img src={require( '../Users/user-list.svg')}/> </div>
            <h2>Profile</h2>
            <ol className="breadcrumb">
              <li><Link to={`/domains`}>{currentDomain}</Link></li>
              <li><Link to={`/stores`}>{currentStore}</Link></li>
              <li><Link to={`/dashboard`}>Dashboard</Link></li>
              <li><Link to={`/setup`}>Setup</Link></li>
              <li>User Profile</li>
            </ol>
          </div>
			<div className={classes.root}>
		        <AppBar position="static" style={{ backgroundColor: '#414d5f' }}>
		          <Tabs index={this.state.index} onChange={this.handleChange}>
		            <Tab label="Personal Information" />
		            <Tab label="Password Change" />
		          </Tabs>
		        </AppBar>
		        {this.state.index === 0 &&
		          <TabContainer>
		           <ChangePersonalInformation />
		          </TabContainer>}
		        {this.state.index === 1 &&
		          <TabContainer>
		            <ChangePassword />
		          </TabContainer>}
		      </div>
          <Footer />
        </div>
        <SideBarRight />
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(UserProfile);