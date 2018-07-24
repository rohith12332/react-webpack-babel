import React from 'react';
import AddUserForm from './AddUserForm';
import Footer from '../common/Footer';
import { browserHistory, Link } from 'react-router';
import DefaultLayout from '../common/DefaultLayout'
// JQUERY
global.jQuery = require('jquery');
let currentDomain = window.sessionStorage.getItem("currentdomainname");
let currentStore = window.sessionStorage.getItem("currentstorename");
class AddUser extends React.Component {
    constructor(props) {
      super(props);
      this.state = {}
    }
    render() {
     return(
			 <DefaultLayout>
			    <div className="page-head inner__pageHead">
			      <div className="domain-icon"> <img src={require( './user-list.svg')}/> <h2>Add User</h2></div>
		            <ol className="breadcrumb">
		              <li><Link to={`/domains`}>{currentDomain}</Link></li>
		              <li><Link to={`/stores`}>{currentStore}</Link></li>
		              <li><Link to={`/dashboard`}>Dashboard</Link></li>
		              <li><Link to={`/setup`}>Setup</Link></li>
		              <li><Link to={`/users`}>Users</Link></li>
		              <li>Add Users</li>
		            </ol>
		            
			    </div>
					<main>
			      <div className="row">
			        <div className="col-sm-12 ">
			          <div className="addproduct-wrap">
			            <AddUserForm />
			          </div>
			        </div>
			      </div>
					</main>
			 </DefaultLayout>
		)
	}
}
export default AddUser;