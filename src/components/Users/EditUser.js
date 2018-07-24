import React from 'react';
import EditUserForm from './EditUserForm';
import { browserHistory, Link } from 'react-router';
import DefaultLayout from '../common/DefaultLayout'

// JQUERY
global.jQuery = require('jquery');
let currentDomain = window.sessionStorage.getItem("currentdomainname");
let currentStore = window.sessionStorage.getItem("currentstorename");

class EditUser extends React.Component{
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render(){
		return(
			<DefaultLayout>
		    <div className="page-head">
		      <div className="domain-icon"> <img src={require( './user-list.svg')}/> <h2>Edit User</h2></div>

	            <ol className="breadcrumb">
	              <li><Link to={`/domains`}>{currentDomain}</Link></li>
	              <li><Link to={`/stores`}>{currentStore}</Link></li>
	              <li><Link to={`/dashboard`}>Dashboard</Link></li>
	              <li><Link to={`/setup`}>Setup</Link></li>
	              <li><Link to={`/users`}>Users</Link></li>
	              <li>Edit Users</li>
	            </ol>
		    </div>
			<main>
				<div className="row">
					<div className="col-sm-12 ">
						<div className="addproduct-wrap">
							<EditUserForm location={this.props.location.pathname}/>
						</div>
					</div>
				</div>
			</main>
			</DefaultLayout>
			)
}
}
export default EditUser;