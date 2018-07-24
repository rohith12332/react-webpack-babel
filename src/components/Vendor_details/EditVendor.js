import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import AddVendorForm from './AddVendorForm';
import EditVendorForm from './EditVendorForm';
import Footer from '../common/Footer';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';

// JQUERY
global.jQuery = require('jquery');

class EditVendor extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		pageHead:{
          pagehead:'Vendor Details',
          dashboard:'Dashboard',
          setup: 'Setup'
        }

		}
	}


render(){
	const {pageHead} = this.state;
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
		return(
		<DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './domains-icon.svg')}/> <h2>{pageHead.pagehead}</h2> </div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                      <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
	         </div>
			 <main>
			<div className="row">
				<div className="col-sm-12 ">
					<div className="addproduct-wrap">
						<EditVendorForm location={this.props.location.pathname}/>
					</div>
				</div>
			</div>
			</main>
 		</DefaultLayout>
		)
	}
}
export default EditVendor;