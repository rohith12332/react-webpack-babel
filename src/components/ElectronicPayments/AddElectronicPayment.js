import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import Button from 'react-bootstrap/lib/Button';
import Checkbox from '../common/Checkbox';
import FormControl from 'react-bootstrap/lib/FormControl';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import Select from 'react-select';
import TextInput from '../common/TextInput';
import getUserDetails from '../common/CredentialDomain';
import classnames from 'classnames';
var creditdebit = require('./credit-debit-porcess.png');
var Giftcard = require('./gift-card-process.png');
import './ElectronicPayment.css';

var _ = require('underscore');


  class AddElectronicPayment extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      msgFailure:"",
      msgSuccess:"",
      errors:{},
      pageHead:{
				pagehead:'Add ElectronicPayment',
				dashboard: 'Dashboard',
				setup: 'Setup'
			},
	   GatewaysList:[],
     SelectedCredit:0,
     SelectedRoom:'',
     SelectedGift:0,
     ProductGroups:[],

	   ElectronicPayment:{
		 "createdby":"",
     "createddate":"",
     "creditisenabled":false,
     "ep1credit":"",
     "ep1gift":"",
     "ep2credit":"",
     "ep2gift":"",
     "giftisenabled":false,
     "id":"1627aea5-8e0a-4371-9022-9b504344e724",
     "isdeleted":false,
     "merchantidcredit":"",
     "merchantidgift":"",
     "merchantidroomservice":"",
     "merchantpasswordcredit":"",
     "merchantpasswordgift":"",
     "merchantpasswordroomservice":"",
     "modifiedby":"",
    "modifieddate":"",
    "name":"",
    "portcredit":"",
    "portgift":"",
    "processinggatewaycredit":0,
    "processinggatewaygift":0,
    "processinggatewayroom":0,
    "roomserviceisenabled":false,
    "securedeviceidcredit":"",
    "securedeviceidgift":"",
    "store_id":"1627aea5-8e0a-4371-9022-9b504344e724"

	  }
    }
    this.updateCredit = this.updateCredit.bind(this);
    this.updateGift = this.updateGift.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
  event.preventDefault();
  var that = this;
  var isValid = this.handleValidation();
  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  var storeuniquekey = window.sessionStorage.getItem("storeuniquekey");
  var credentials = getUserDetails();
  credentials["domainuniquekey"] = domainuniquekey;
  credentials["storeuniquekey"] = storeuniquekey;

  if(isValid){
  const addElectronicPayment = {};

  var ElectronicPayment = this.state.ElectronicPayment;
  //profitCenter.taxgroupid = this.state.SelectedTaxGroupId;

  ElectronicPayment.processinggatewaycredit=that.state.SelectedGift;
  ElectronicPayment.processinggatewaycredit=that.state.SelectedCredit;
  ElectronicPayment.processinggatewayroom=0;

  addElectronicPayment["processorconfigurationinformation"] = ElectronicPayment;
  addElectronicPayment["userdetails"] = credentials;
  console.log(JSON.stringify(addElectronicPayment));
  const request = new Request(`${process.env.API_HOST}/ManageProcessorConfigurations.svc/CreateProcessorconfiguration/json`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type':'application/json'
    }),
    body: JSON.stringify(addElectronicPayment)
  });

  return fetch(request).then(response => {
    if (response.status >= 400) throw new Error("Bad response from server");
    return response.json();
  }).then(function(data) {
    console.log(data);
    if (data.statusCode !== 200) {
      that.setState({
        msgFailure: data.statusMessage,
      })
    }else{
      console.log('success');
        window.scrollTo(0, 0);
      that.setState({
        msgSuccess: data.statusMessage
      })
      setTimeout(function() {
          browserHistory.push('/ElectronicPayments')
      }, 5000)
    }
  }).catch(error => {
      return error;
    });
  }
}


onReset(event) {
      browserHistory.push('/ElectronicPayments')
  }

onChange(event) {

    const field = event.target.name;
    var ElectronicPayment ={};
    ElectronicPayment = this.state.ElectronicPayment;
    ElectronicPayment[field] = event.target.value;
    this.setState({ElectronicPayment:ElectronicPayment});
    if(!!this.state.errors[event.target.name]) {
    let errors = Object.assign({}, this.state.errors);
    delete errors[event.target.name];
    this.setState({errors});
}
}
 updateCredit(element) {

      this.setState({
        SelectedCredit: element.value
      });

  }

  updateGift(element) {

     this.setState({
        SelectedGift: element.value
      });

  }

 componentDidMount() {


  }


handleChange(event){
let field = event.target.name;
var ElectronicPayment = this.state.ElectronicPayment;
if(event.target.type =='checkbox'){
   ElectronicPayment[field]= event.target.checked;
}
this.setState({
ElectronicPayment : ElectronicPayment
})

}

validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }

handleValidation(){
let errors = {};
//Form validation error message
var ElectronicPayment = this.state.ElectronicPayment;

if (ElectronicPayment.name === '') {
  document.getElementById("name").focus();
errors.name = "Electronic Payment name can't be empty"
}

this.setState({ errors }); //Set Errors state
return Object.keys(errors).length == 0;
}




render()
  {
      var currentDomain = window.sessionStorage.getItem("currentdomainname");
      var currentStore = window.sessionStorage.getItem("currentstorename");
     var that = this;
  	 const {pageHead,msgFailure,msgSuccess,GatewaysList,ProductGroups} = this.state;
  	 var paymentGateways =[];
    paymentGateways.push({"label":"None","value":0});
    paymentGateways.push({"label":"DatacapActiveX","value":1});
    paymentGateways.push({"label":"DatacapHttp","value":2});
    paymentGateways.push({"label":"usaEpay","value":3});
    paymentGateways.push({"label":"Mercury","value":4});
    paymentGateways.push({"label":"IND_Innotivi","value":5});

     return(
      <DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require('./electronic-payments.svg')} /> <h2>{pageHead.pagehead}</h2></div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                      <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
            </div>
            <main>
    {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msgSuccess}  </div>}

    <div className="row">
        <div className="col-sm-12 ">
          <div className="addproduct-wrap">
            <div className="widget widget-small">
              <form action="#" className="">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="electronic-payment-head bottom20">Electronic Payment Configuration</div>
                    <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                    <TextInput
                    type="text"
                    name="name"
                    label="Payment Configuration Name"
                    value={this.state.ElectronicPayment.name}
                    defaultValue={this.state.ElectronicPayment.name}
                    placeholder=""
                    required="*"
                    onChange={this.onChange}
                    className={classnames('form-control', { error: !!this.state.errors.name})}
                    />
                    <span>{this.state.errors.name}</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="widget widget-small">
              <form action="#" className="">
                <div className="credit-debit-process-icon"><img src={creditdebit} alt="Credit and Debit Processing"/></div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="electronic-payment-head bottom20">Credit and Debit Processing</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">

                    <TextInput
                    type="text"
                    name="merchantidcredit"
                    label="Merchant ID"
                    value={this.state.ElectronicPayment.merchantidcredit}
                    defaultValue={this.state.ElectronicPayment.merchantidcredit}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />

                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">


                      <TextInput
                    type="text"
                    name="merchantpasswordcredit"
                    label="Passcode"
                    value={this.state.ElectronicPayment.merchantpasswordcredit}
                    defaultValue={this.state.ElectronicPayment.merchantpasswordcredit}
                    placeholder=""
                    onChange={this.onChange}
                    className='form-control'
                    />



                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">

                       <TextInput
                    type="text"
                    name="ep1credit"
                    label="Primary Endpoint"
                    value={this.state.ElectronicPayment.ep1credit}
                    defaultValue={this.state.ElectronicPayment.ep1credit}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                    <TextInput
                    type="text"
                    name="ep2credit"
                    label="Secondary Endpoint"
                    value={this.state.ElectronicPayment.ep2credit}
                    defaultValue={this.state.ElectronicPayment.ep2credit}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                    <TextInput
                    type="text"
                    name="securedeviceidcredit"
                    label="Secure Device ID"
                    value={this.state.ElectronicPayment.securedeviceidcredit}
                    defaultValue={this.state.ElectronicPayment.securedeviceidcredit}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                     <TextInput
                    type="text"
                    name="portcredit"
                    label="Remote TCP/IP Port"
                    value={this.state.ElectronicPayment.portcredit}
                    defaultValue={this.state.ElectronicPayment.portcredit}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Gateway Type<span className="required">*</span></label>
                  <Select
                    name="CreditPaymentGateway"
                    value={this.state.SelectedCredit}
                    options={paymentGateways}
                    onChange={this.updateCredit}
                  />
                </div>

                  <Checkbox
                                  onChange={this.handleChange}
                                  checked={this.state.handleChange}
                                  name="creditisenabled"
                                  id="creditisenabled"
                                  label="Enabled"
                                  />

              </form>
            </div>
            <div className="widget widget-small">
              <form action="#" className="">
                <div className="credit-debit-process-icon"><img src={Giftcard} alt="Credit and Debit Processing"/></div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="electronic-payment-head bottom20">Gift Card Processing</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <TextInput
                    type="text"
                    name="merchantidgift"
                    label="Merchant ID"
                    value={this.state.ElectronicPayment.merchantidgift}
                    defaultValue={this.state.ElectronicPayment.merchantidgift}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                    <TextInput
                    type="text"
                    name="merchantpasswordgift"
                    label="Passcode"
                    value={this.state.ElectronicPayment.merchantpasswordgift}
                    defaultValue={this.state.ElectronicPayment.merchantpasswordgift}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                     <TextInput
                    type="text"
                    name="ep1gift"
                    label="Primary Endpoint"
                    value={this.state.ElectronicPayment.ep1gift}
                    defaultValue={this.state.ElectronicPayment.ep1gift}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <TextInput
                    type="text"
                    name="ep2gift"
                    label="Secondary Endpoint"
                    value={this.state.ElectronicPayment.ep2gift}
                    defaultValue={this.state.ElectronicPayment.ep2gift}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <TextInput
                    type="text"
                    name="securedeviceidgift"
                    label="Secure Device ID"
                    value={this.state.ElectronicPayment.securedeviceidgift}
                    defaultValue={this.state.ElectronicPayment.securedeviceidgift}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <TextInput
                    type="text"
                    name="portgift"
                    label="Remote TCP/IP Port"
                    value={this.state.ElectronicPayment.portgift}
                    defaultValue={this.state.ElectronicPayment.portgift}
                    placeholder=""

                    onChange={this.onChange}
                    className='form-control'
                    />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Gateway Type<span className="required">*</span></label>
                  <Select
                    name="GiftPaymentGateway"
                    value={this.state.SelectedGift}
                    options={paymentGateways}
                    onChange={this.updateGift}
                  />
                </div>
               <Checkbox
                  onChange={this.handleChange}
                  checked={this.state.handleChange}
                  name="giftisenabled"
                  id="giftisenabled"
                  label="Enabled"
                  />
              </form>
            </div>
              <div className="col-sm-12 form-bot-butn-wrap">
                <div className="form-bot-butns round-btns">
                  <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Save</button>
                  <button type="reset"  className="btn btn-default" onClick={this.onReset}>Cancel</button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </main>
 </DefaultLayout>

  	)
  }
}
export default AddElectronicPayment;


