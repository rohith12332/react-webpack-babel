import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';
global.$p = require('jquery');

const Breadcrumbs = () => {
	'use strict';
	let currentDomain = window.sessionStorage.getItem("currentdomainname");
	let currentStore = window.sessionStorage.getItem("currentstorename");
	let currentModule = $p('.page-head h2').text();

	return(
        <ol className="breadcrumb">
          <li><Link to={`/domains`}>{currentDomain}</Link></li>
          <li><Link to={`/stores`}>{currentStore}</Link></li>
          <li><Link to={`/dashboard`}>Dashboard</Link></li>
          <li><Link to={`/setup`}>Setup</Link></li>
          <li className="active">{currentModule}</li>
        </ol>		
	)
};
export default Breadcrumbs;