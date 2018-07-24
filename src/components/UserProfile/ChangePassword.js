import React, { Component } from 'react';

import PropTypes from 'prop-types';

import TextInput from '../common/TextInput';

import classnames from 'classnames';

import getUserDetails from '../common/CredentialDomain';

import axios from 'axios';

//import Button from 'material-ui/Button';

//import RaisedButton from 'material-ui/RaisedButton';

//import { withStyles, createStyleSheet } from 'material-ui/styles';

import { Link, browserHistory } from 'react-router';


global.$s = require('jquery');
const style = {
  margin: 12,
};
/*const styleSheet = createStyleSheet('ChangePassword', theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none',
  }
}));
*/
class ChangePassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"Password": {
				"newpassword":"",
				"confirmnewpassword":"",
				"oldpassword":"",
				"userid":"1627aea5-8e0a-4371-9022-9b504344e724",
			},
			"errors": {},
			"msgFailure":"",
			"msgSuccess":""
		}
	}
	componentDidMount = () => {
		
	}

	validatePassword(value){
      var text = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
      return text.test(value);
	}

	handleValidation = () => {
		let errors = {};
		if (this.state.Password.newpassword.trim() == '') {
			errors.newpassword = "Please enter new password";
		}else if (!this.validatePassword(this.state.Password.newpassword)) {
			errors.newpassword = "Password must container CAPITAL letter, special character and min 8 character length"
		}
		if (this.state.Password.oldpassword.trim() == '') {
			errors.oldpassword = "Please enter old password"
		}
		if (this.state.Password.confirmnewpassword.trim() == '') {
			errors.confirmnewpassword = "Please enter Confirm New Password"
		}
		if (document.getElementById('newpassword').value !==
			document.getElementById('confirmnewpassword').value 
			&& document.getElementById('confirmnewpassword').value !='') {
			errors.confirmnewpassword = "Password did not matched"
		} else {
			//errors.confirmnewpassword = "Password did not matched"
		}
						
		this.setState({
			errors
		}); //Set Errors state

		return Object.keys(errors).length == 0;		
	}

	onChange = (e) => {
		const field = e.target.name;
		let Password = this.state.Password;
		Password[field] = e.target.value;

		if (!!this.state.errors[e.target.name]) {
          let errors = Object.assign({}, this.state.errors);
          delete errors[e.target.name];
          this.setState({
              errors
          });
      	}
		this.setState({
      		Password: Password
  		})

	}

	onSubmit = () => {
		var that = this;
		var reqQuery = {};
		var userprofile = JSON.parse(window.sessionStorage.getItem("userprofile")); 
		var updatePassword = this.state.Password;
		var isValid = this.handleValidation();

		if(isValid){
			reqQuery['newpassword'] = updatePassword.newpassword;
			reqQuery['oldpassword'] = updatePassword.oldpassword;
			reqQuery['userid'] = userprofile.userprofile.Id;

			console.log(reqQuery)
			axios.post(`${process.env.API_HOST}/ManageCustomers.svc/ChangePassword/json`, reqQuery)
			.then(function (response) {
				if (response.status >= 400) {
					that.setState({
						"msgFailure":response.data.statusMessage
					})			
				}else{
					that.setState({
						"msgSuccess":response.data.statusMessage
					});
					setTimeout(function(){
						sessionStorage.clear();
						browserHistory.push('/');
					}, 5000)
				}
			}).catch(function(error){
				console.log(error);
			});
		}
	}
	render(){
		const ChangePassword = this.state.Password;
		const {msgFailure, msgSuccess} = this.state;
		return(
			<div className="addproduct-wrap">
			<div className="widget widget-small">
					{msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
			          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			          {msgFailure}
			        </div>}
			        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
			          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			          {msgSuccess}
			        </div>}
	        	<div className="row">
			        <div className="col-sm-12">
			          <div className={classnames('form-group', { error: !!this.state.errors.oldpassword})}>
			              <TextInput
			                type="password" 
			                name="oldpassword"
			                id="oldpassword"
			                label="Old Password"
			                tabindex="1"
			                required="*"
			                value={ChangePassword.oldpassword}
			                placeholder=""
			                className={classnames('form-control', { error: !!this.state.errors.oldpassword})}
			                onChange={this.onChange}
			              />
			              <span>{this.state.errors.oldpassword}</span>
			          </div>
			        </div>	 
			        <div className="col-sm-12">
			          <div className={classnames('form-group', { error: !!this.state.errors.newpassword})}>
			              <TextInput
			                type="password" 
			                name="newpassword"
			                id="newpassword"
			                label="New Password"
			                tabindex="1"
			                required="*"
			                value={ChangePassword.newpassword}
			                placeholder=""
			                className={classnames('form-control', { error: !!this.state.errors.newpassword})}
			                onChange={this.onChange}
			              />
			              <span>{this.state.errors.newpassword}</span>
			          </div>
			        </div>
			        <div className="col-sm-12">
			          <div className={classnames('form-group', { error: !!this.state.errors.confirmnewpassword})}>
			              <TextInput
			                type="password" 
			                name="confirmnewpassword"
			                id="confirmnewpassword"
			                label="Confirm New Password"
			                tabindex="1"
			                required="*"
			                value={ChangePassword.confirmnewpassword}
			                placeholder=""
			                className={classnames('form-control', { error: !!this.state.errors.confirmnewpassword})}
			                onChange={this.onChange}
			              />
			              <span id='message'></span>
			              <span>{this.state.errors.confirmnewpassword}</span>
			          </div>
			        </div>	
			        <div className="col-sm-12">
			        {/*<RaisedButton label="Primary" primary={true} style={style} onClick = {() => {this.onSubmit()}}/>*/}
			        <button type="submit" className="btn btn-primary" onClick = {() => {this.onSubmit()}}>Change Password</button>
			        </div>        			               		
	        	</div>
        	</div>
			</div>
		)
	}
}

export default ChangePassword;