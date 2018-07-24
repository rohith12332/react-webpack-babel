import React from 'react';
import ReactDOM from 'react-dom';
import DefaultLayout from '../common/DefaultLayout'
import TextInput from '../common/TextInput';
import Checkbox from '../common/Checkbox';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
import classnames from 'classnames';
import { browserHistory, Link } from 'react-router';
import getCurrentDate from '../common/Date';
import update from 'react-addons-update';
import getUserDetails from '../common/CredentialDomain';
import Confirm from 'react-confirm-bootstrap';
class AddUserRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleOptions: {
        label: ' ',
        value: ' '
      },
      singleRole:[],
      roles:[],
      addUserRole: [],
      "roleinformation": {
        "accesslevel": {
          "canaccesssystemconfig": false,
          "canapplyadditionalsurcharge": false,
          "canapplycomptoitem": false,
          "canapplyhousepayment": false,
          "canapplyvoidtoitem": false,
          "canbatchpayments": false,
          "cancaptureelectronicpayments": false,
          "canclosehouse": false,
          "canforceunlockterminal": false,
          "cannosale": false,
          "canorder": false,
          "canpayin": false,
          "canpayout": false,
          "canpromocheck": false,
          "canreopenorder": false,
          "cansearchallpayments": false,
          "canseeotherusersorders": false,
          "cansetmagstripe": false,
          "cantaxfree": false,
          "cantransferorder": false,
          "canviewreports": false,
          "canvoidpayment": false,
          "checkouts": false,
          "discounts": false,
          "employee": false,
          "isdeleted": false,
          "master": false,
          "name": "",
          "onetouch": false,
          "payroll": false,
          "requiremagcardlogin": false,
          "sales": false
        },
        "id":"00000000-0000-0000-0000-000000000000",
        "isdeleted": false,
        "name": "",
        "roledescription": "",
      },
      "userdetails": {
        "domainadmin": false,
        "domainuniquekey": "",
        "password": "",
        "storeuniquekey": "",
        "storeuser": "",
        "superadmin": "",
        "username": ""
      },
      errors: {},
      isLoading: true,
      "msgSuccess": "",
      "msgFailure": "",
      "btnUpdateRole":false,
      "btnAddRole":true,
      "editRole": false,
      "buttonEdit": false,
      "roleId":''
    }
    this.handlechange = this.handlechange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSelectRole = this.onSelectRole.bind(this);
    this.addAllccessLevel = this.addAllccessLevel.bind(this);
    this.removeAllccessLevel = this.removeAllccessLevel.bind(this);
    this.removeAllccessLevel = this.removeAllccessLevel.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.discard = this.discard.bind(this);
  }
  componentDidMount() {
    this.getUserRole();
  }

  onSelectRole(element) {
    this.setState({
        btnUpdateRole: true,
        btnAddRole: false,
        buttonEdit: true,
        roleOptions: element,
        roleId: element.value
    });

    var that = this;
    var roleid = element.value;
    var getRole = {};

    getRole["roleid"] = roleid;
    getRole["userdetails"] = getUserDetails();

    const request = new Request(`${process.env.API_HOST}/ManageRoles.svc/GetSingleRole/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(getRole)
    });

    fetch(request)
    .then(function(response) {
      if(response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      that.setState({
        roleinformation:{
          name:data.singlerole.name,
          accesslevel: data.singlerole.accesslevel,
          id:roleid,
          isdeleted: false
        },
        singleRole: data.singlerole
      });
    });
  }

  getUserRole() {
    var that = this;
    var reqQuery = {};
    reqQuery["userdetails"] = getUserDetails();
    const request = new Request(`${process.env.API_HOST}/ManageRoles.svc/GetAllRoles/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(reqQuery)
    });
    fetch(request)
      .then(function(response) {
        if(response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        //var tableConfig = that.state.tableConfig;
        //tableConfig['isLoading'] = false;
        if(data.rolelist === null) data.rolelist = [];
        that.setState({
          roles: data.rolelist
        });
      });
  }

  handleValidation() {
    var errors = {};
    if(this.state.roleinformation.name === '') {
      errors.name = "Role cannot be empty"
    }
    this.setState({ errors });
    window.scrollTo(0,0);
    return Object.keys(errors).length == 0;
  }

  onChange(event) {
    this.setState({
      isEditable: true,
      editRole: true
    });
    //console.log(this.state.errors);
    var field = event.target.name;
    var roleinformation = this.state.roleinformation;
    roleinformation[field] = event.target.value;

    if(!!this.state.errors[event.target.name]) {
      var errors = Object.assign({}, this.state.errors);
      delete errors[event.target.name];
      this.setState({
        errors
      });
    }

    return this.setState({
      roleinformation: roleinformation
    });
  }
  onSubmit(event) {
    var that = this;
    event.preventDefault();
    var roleinformation = {};
    var isValid = this.handleValidation();

    if(isValid) {
      const addrole = {};

      var CreateRole = this.state.name;
      var RoleDescription = this.state.roleOptions.value;
      var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
      var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
      var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');


      credentials["domainuniquekey"] = domainuniquekey;
      credentials["storeuniquekey"] = storeuniquekey;

      addrole["roleinformation"] = this.state.roleinformation;
      addrole["userdetails"] = credentials;

      var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');

      credentials["storeuniquekey"] = storeuniquekey;
      roleinformation['roleinformation'] = this.state.roleinformation;
      roleinformation['userdetails'] = credentials;

      if(this.state.roleinformation.id !== "00000000-0000-0000-0000-000000000000"){
        var ROLEAPI = `${process.env.API_HOST}/ManageRoles.svc/UpdateRole/json`;
      }else{
        var ROLEAPI = `${process.env.API_HOST}/ManageRoles.svc/CreateRole/json`;
      }

      const request = new Request(ROLEAPI, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(roleinformation)
      });
      return fetch(request).then(function(response) {
          return response.json();
      }).then(function(data) {
          if (data.statusCode >= 400) {
              that.setState({
                  msgFailure: data.statusMessage
              })
          } else {
              var roleinformation = that.state.roleinformation;
              roleinformation['name'] = "";
              that.setState({
                  msgSuccess: data.statusMessage
              });
              setTimeout(function() {
                  location.reload();
              }, 5000)

          }
      }).catch(function(error) {
          return error;
      })
    }
  }
  addAllccessLevel(event){
    event.preventDefault();
    var accesslevel = this.state.roleinformation.accesslevel;
    accesslevel.canaccesssystemconfig = true;
    accesslevel.canaccesssystemconfig = true,
    accesslevel.canapplyadditionalsurcharge = true,
    accesslevel.canapplycomptoitem = true,
    accesslevel.canapplyhousepayment = true,
    accesslevel.canapplyvoidtoitem = true,
    accesslevel.canbatchpayments = true,
    accesslevel.cancaptureelectronicpayments = true,
    accesslevel.canclosehouse = true,
    accesslevel.canforceunlockterminal = true,
    accesslevel.cannosale = true,
    accesslevel.canorder = true,
    accesslevel.canpayin = true,
    accesslevel.canpayout = true,
    accesslevel.canpromocheck = true,
    accesslevel.canreopenorder = true,
    accesslevel.cansearchallpayments = true,
    accesslevel.canseeotherusersorders = true,
   // accesslevel.cansetmagstripe = true,
    accesslevel.cantaxfree = true,
    accesslevel.cantransferorder = true,
    accesslevel.canviewreports = true,
    accesslevel.canvoidpayment = true,
    accesslevel.checkouts = true,
    accesslevel.discounts = true,
    accesslevel.employee = true,
   // accesslevel.isdeleted = true,
    accesslevel.master = true,
    accesslevel.onetouch = true,
    accesslevel.payroll = true,
   // accesslevel.requiremagcardlogin = true,
    accesslevel.sales = true
    this.forceUpdate();
  }
  removeAllccessLevel(event){
    event.preventDefault();
    var accesslevel = this.state.roleinformation.accesslevel;
    accesslevel.canaccesssystemconfig = false;
    accesslevel.canaccesssystemconfig = false,
    accesslevel.canapplyadditionalsurcharge = false,
    accesslevel.canapplycomptoitem = false,
    accesslevel.canapplyhousepayment = false,
    accesslevel.canapplyvoidtoitem = false,
    accesslevel.canbatchpayments = false,
    accesslevel.cancaptureelectronicpayments = false,
    accesslevel.canclosehouse = false,
    accesslevel.canforceunlockterminal = false,
    accesslevel.cannosale = false,
    accesslevel.canorder = false,
    accesslevel.canpayin = false,
    accesslevel.canpayout = false,
    accesslevel.canpromocheck = false,
    accesslevel.canreopenorder = false,
    accesslevel.cansearchallpayments = false,
    accesslevel.canseeotherusersorders = false,
    accesslevel.cansetmagstripe = false,
    accesslevel.cantaxfree = false,
    accesslevel.cantransferorder = false,
    accesslevel.canviewreports = false,
    accesslevel.canvoidpayment = false,
    accesslevel.checkouts = false,
    accesslevel.discounts = false,
    accesslevel.employee = false,
    accesslevel.isdeleted = false,
    accesslevel.master = false,
    accesslevel.onetouch = false,
    accesslevel.payroll = false,
    accesslevel.requiremagcardlogin = false,
    accesslevel.sales = false
    this.forceUpdate();
  }
  resetForm(event){
      var roleOptions = {
        roleOptions: {
        label: ' ',
        value: ' '
      }
    }
    var currentState = {
        "accesslevel": {
          "canaccesssystemconfig": false,
          "canapplyadditionalsurcharge": false,
          "canapplycomptoitem": false,
          "canapplyhousepayment": false,
          "canapplyvoidtoitem": false,
          "canbatchpayments": false,
          "cancaptureelectronicpayments": false,
          "canclosehouse": false,
          "canforceunlockterminal": false,
          "cannosale": false,
          "canorder": false,
          "canpayin": false,
          "canpayout": false,
          "canpromocheck": false,
          "canreopenorder": false,
          "cansearchallpayments": false,
          "canseeotherusersorders": false,
          "cansetmagstripe": false,
          "cantaxfree": false,
          "cantransferorder": false,
          "canviewreports": false,
          "canvoidpayment": false,
          "checkouts": false,
          "discounts": false,
          "employee": false,
          "isdeleted": false,
          "master": false,
          "name": "",
          "onetouch": false,
          "payroll": false,
          "requiremagcardlogin": false,
          "sales": false
        },
        "id":"00000000-0000-0000-0000-000000000000",
        "isdeleted": false,
        "name": "",
        "roledescription": ""
    }

    this.setState({
      roleOptions: roleOptions,
      roleinformation:currentState,
      editRole: false,
      buttonEdit: false
    })
  }
  handlechange(event) {
    var accesslevel = {};
    var roleinformation = {};
    var field = event.target.name;
    if(event.target.type == 'checkbox') {
      accesslevel = this.state.roleinformation.accesslevel;
      accesslevel[field] = event.target.checked;
      return this.setState({
        roleinformation: {
          accesslevel: accesslevel,
          id: this.state.roleinformation.id,
          isdeleted: this.state.roleinformation.isdeleted,
          name: this.state.roleinformation.name,
          roledescription: this.state.roleinformation.roledescription
        }
      })
    } else {
      roleinformation = this.state.roleinformation;
      roleinformation[field] = event.target.value;
      return this.setState({
        roleinformation: {
          accesslevel: this.state.roleinformation.accesslevel,
          id: this.state.roleinformation.id,
          isdeleted: this.state.roleinformation.isdeleted,
          name: roleinformation.name,
          roledescription: roleinformation.roledescription
        }
      })
    }
  }
  discard(){
    browserHistory.push('/setup')
  }
  onConfirm(id) {
		this.handleDelete(id);
	}

    onReset(event) {
      browserHistory.push('/setup')
  }

  handleDelete(id){
      var that = this;
      var delQuery = {};
      var index = -1;
      var _totalroles = this.state.roles.length;
      for( var i = 0; i < _totalroles; i++ ) {
        if(this.state.roles[i].id == id){
          index = i;
          break;
        }
      }
      this.state.roles.splice( index, 1 );

      delQuery['isdeleted'] = true;
      delQuery['roleid'] = id;
      delQuery['userdetails'] = getUserDetails();

      const request = new Request(`${process.env.API_HOST}/ManageRoles.svc/DeleteRole/json`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(delQuery)
      });

      return fetch(request).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.statusCode >= 400) {
          that.setState({
            msgFailure: data.statusMessage
          })
          setTimeout(function() {
            that.setState({
              msgFailure: ''
            });
          }, 5000)
        } else {
          that.setState({
            msgSuccess: data.statusMessage
          });
          setTimeout(function() {
          that.setState({
            msgSuccess: ''
          });
          location.reload();
          }, 1000)
        }
      }).catch(function(error) {
        return error;
      })
  }
render(){
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    console.log(this.state);
    var id = this.state.roleId;
    const {msgSuccess, msgFailure, singleRole} = this.state;
    const {accesslevel} = this.state.roleinformation;
    var roleOptions = this.state.roles;
    roleOptions = roleOptions.map(function(o) {
        return {
          label: o.name,
          value: o.id
        }
    });
return(
        <DefaultLayout>
          <div className="page-head inner__pageHead">
              <div className="domain-icon"> <img src={require('./user-roles.svg')}/> <h2>User Roles</h2></div>
              <ol className="breadcrumb">
                  <li><Link to={`/domains`}>{currentDomain}</Link></li>
                  <li><Link to={`/stores`}>{currentStore}</Link></li>
                  <li><Link to={`/dashboard`}>Dashboard</Link></li>
                  <li> <Link to={`/setup`}>Setup</Link> </li>
                  <li className="active">User Roles</li>
              </ol>
          </div>
          <main>
          <div className="row form-group">
            <div className="col-sm-12 ">
              <div className="addproduct-wrap " id = "userroles">
              <form ref="form">
            {msgFailure &&
            <div className="alert alert-warning alert-dismissible" role="alert">
               <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
               {msgFailure}
            </div>
            }
            {msgSuccess &&
            <div className="alert alert-success alert-dismissible" role="alert">
               <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
               {msgSuccess}
            </div>
            }
            <div className="row form-group">
               <div className="col-sm-12 ">
                  <div className="addproduct-wrap">
                     <div className="widget widget-small">
                        <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                        <TextInput
                        type="text"
                        name="name"
                        label="Create Role"
                        value={this.state.roleinformation.name}
                        placeholder=""
                        required="*"
                        className={classnames('form-control', { error: !!this.state.errors.name})}
                        onChange={this.onChange} />
                        <span>{this.state.errors.name}</span>
                     </div>
                     <div className="row form-group">
                        <div className="col-md-11">
                           <div className={classnames('form-group', { error: !!this.state.errors.selectrole})}>
                           <label>Roles</label>
                           <Select
                              disabled={this.state.editRole}
                              name="selectrole"
                              value={this.state.roleOptions.value}
                              options={roleOptions}
                              onChange={this.onSelectRole}
                              />
                           <span>{this.state.errors.selectrole}</span>
                        </div>
                     </div>
                     {this.state.buttonEdit &&
                     <div className="col-md-1">
                        <div className="tble-actionlinks role-width">
                           <ul>
                              <li>
                                 <Confirm
                                    onConfirm={this.onConfirm.bind(this, id)} body="Are you sure you want to delete this?"
                                    confirmText="Confirm Delete"
                                    className="btn-store-bin"
                                    title="Deleting User">
                                    <a className="icon-delete"><i className="icon icon-1089"></i></a>
                                 </Confirm>
                              </li>
                           </ul>
                        </div>
                     </div>
                     }
                  </div>
               </div>
               <div className="widget widget-small">
                  <div className="row form-group">
                     <div className="col-sm-12 bottom20">
                        <div className="pull-right">
                           <button className="btn btn-primary" onClick={this.addAllccessLevel}>Select All</button>&nbsp;
                           <button className="btn btn-danger" onClick={this.removeAllccessLevel}>Deselect All</button>&nbsp;
                           <button className="btn btn-warning" type="reset" onClick={this.resetForm}>Reset</button>
                        </div>
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-12">
                        <div className="modal-subhead">System Access</div>
                     </div>
                  </div>
{/*                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.requiremagcardlogin}
                           name="requiremagcardlogin"
                           id="requiremagcardlogin"
                           label="Require User to use Magcard to Login"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.cansetmagstripe}
                           name="cansetmagstripe"
                           id="cansetmagstripe"
                           label="Can Set Mag Stripe Password"
                           />
                     </div>
                  </div>*/}
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canorder}
                           name="canorder"
                           id="canorder"
                           label="Can Place Order"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canpayin}
                           name="canpayin"
                           id="canpayin"
                           label="Can Pay In"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canpayout}
                           name="canpayout"
                           id="canpayout"
                           label="Can Pay Out"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canaccesssystemconfig}
                           name="canaccesssystemconfig"
                           id="canaccesssystemconfig"
                           label="Can Access System Config"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.cansearchallpayments}
                           name="cansearchallpayments"
                           id="cansearchallpayments"
                           label="Can Search all Payments"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.cantransferorder}
                           name="cantransferorder"
                           id="cantransferorder"
                           label="Can Transfer Order"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.cannosale}
                           name="cannosale"
                           id="cannosale"
                           label="Can No Sale"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canapplycomptoitem}
                           name="canapplycomptoitem"
                           id="canapplycomptoitem"
                           label="Can Apply Comp"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canvoidpayment}
                           name="canvoidpayment"
                           id="canvoidpayment"
                           label="Can Void Payment"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canapplyadditionalsurcharge}
                           name="canapplyadditionalsurcharge"
                           id="canapplyadditionalsurcharge"
                           label="Can Apply Additional Surcharge"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canreopenorder}
                           name="canreopenorder"
                           id="canreopenorder"
                           label="Can Reopen Orders"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canseeotherusersorders}
                           name="canseeotherusersorders"
                           id="canseeotherusersorders"
                           label="Can See Other User's Orders"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.cantaxfree}
                           name="cantaxfree"
                           id="cantaxfree"
                           label="Can Apply Tax Free"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canclosehouse}
                           name="canclosehouse"
                           id="canclosehouse"
                           label="Can Close The House"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canforceunlockterminal}
                           name="canforceunlockterminal"
                           id="canforceunlockterminal"
                           label="Can Force Unlock Terminal"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canpromocheck}
                           name="canpromocheck"
                           id="canpromocheck"
                           label="Can Apply Promo"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canapplyvoidtoitem}
                           name="canapplyvoidtoitem"
                           id="canapplyvoidtoitem"
                           label="Can Apply Void"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-12">
                        <div className="modal-subhead">Report Access</div>
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.canviewreports}
                           name="canviewreports"
                           id="canviewreports"
                           label="Can View Dashboard"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.master}
                           name="master"
                           id="master"
                           label="Master Report"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.sales}
                           name="sales"
                           id="sales"
                           label="Sales Report"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.discounts}
                           name="discounts"
                           id="discounts"
                           label="Discounts Report"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.payroll}
                           name="payroll"
                           id="payroll"
                           label="Payroll Report"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.checkouts}
                           name="checkouts"
                           id="checkouts"
                           label="Checkouts Report"
                           />
                     </div>
                  </div>
                  <div className="row form-group">
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.onetouch}
                           name="onetouch"
                           id="onetouch"
                           label="OneTouch Report"
                           />
                     </div>
                     <div className="col-sm-6">
                        <Checkbox
                           onChange={this.handlechange}
                           checked={accesslevel.employee}
                           name="employee"
                           id="employee"
                           label="Employee Report"
                           />
                     </div>
                  </div>
               </div>
            </div>
         </div>
         </div>
         <div className="col-sm-12 form-bot-butn-wrap">
              <div className="form-bot-butns round-btns">
                <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Save</button>
                <button type="reset" onClick={this.onReset} className="btn btn-default">Cancel</button>
              </div>
              </div>
      </form>
              </div>
            </div>
          </div>
        </main>
        </DefaultLayout>
    )
  }
}
export default AddUserRole;
