import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import AddTerminalForm from './AddTerminalForm';
import Footer from '../common/Footer';
import TextInput from '../common/TextInput';
import Checkbox from '../common/Checkbox';
import Select from 'react-select';
import classnames from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import getUserDetails from '../common/CredentialDomain';
import ImageUpload from '../Products/ReactImageUpload';
import '../Products/ReactImageUpload.css';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';

// JQUERY
global.jQuery = require('jquery');
class AddTerminal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        pageHead:{
          pagehead:'Terminal',
          dashboard:'Dashboard',
          setup: 'Setup'
      }

      }
    }
    render() {
    const {pageHead} = this.state;
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
     return(
     	<DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './terminal.svg')}/> <h2>{pageHead.pagehead}</h2> </div>
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
		            <AddTerminalForm />
		            </div>
		        </div>
		     </div>
		     </main>
 		</DefaultLayout>

		)
	}
}
export default AddTerminal;