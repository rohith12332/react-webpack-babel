import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from '../common/Checkbox';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import 'react-datepicker/dist/react-datepicker';
import TextInput from '../common/TextInput';
import classnames from 'classnames';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

import Tabelify from '../react-tabelify/Tabelify';


var _ = require('underscore');

//Table Column Defination
var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Electronic  Name"
    },

    /*{
        "columnName": "isspecifiedprice",
        "displayName": "Specified Price"
    },*/
    {
        "columnName": "id",
        "displayName": "Action",
        render:()=>{
            return <div></div>
        },
        "flexBasis":'190px'
    }
  ];


  class ElectronicPayment extends React.Component {
  constructor(props) {

    super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.state = {
      showModal: false,
      msgFailure:"",
      msgSuccess:"",
      showEditModal:false,
      ElectronicPayments:[],
      pageHead:{
				pagehead:'Electronic Payment',
				dashboard: 'Dashboard',
				setup: 'Setup'
			},

	tableConfig: {
        data:[],
        columnMetadata: columnMetadata,
        currentPage: 1,
        showCheckbox: false,
        onChangeGrid: this.onChangeGrid,
        selectedRows: {},
        onRowClick: this.onRowClick,
        resultsPerPage: 10,
        localSearch: true,
        btnText: 'Add ElectronicPayment',
        btnUrl:'ElectronicPayments/new'
      }
    }
    this.RemoveElectronicPayment = this.RemoveElectronicPayment.bind(this);
    this.EditElectronicPayment = this.EditElectronicPayment.bind(this);
  }

RemoveElectronicPayment(ElectronicPaymentID){
var id;
var DelElectronicPayment = {};
var that = this;
id = ElectronicPaymentID;
var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
credentials["storeuniquekey"] = storeuniquekey;
credentials["domainuniquekey"] = domainuniquekey;
var index = -1;
var _totalElectronicPayments = this.state.ElectronicPayments.length;
for( var i = 0; i < _totalElectronicPayments; i++ ) {
if(this.state.ElectronicPayments[i].id == id){
index = i;
break;
}
}
this.state.ElectronicPayments.splice( index, 1 );
this.setState( {ElectronicPayments: this.state.ElectronicPayments});
DelElectronicPayment['processorconfigurationid'] =  ElectronicPaymentID;
DelElectronicPayment['userdetails']  =  credentials;
DelElectronicPayment['isdeleted']    =  true;
console.log(JSON.stringify(DelElectronicPayment));
const request = new Request(`${process.env.API_HOST}/ManageProcessorConfigurations.svc/DeleteProcessorconfiguration/json`, {
method: 'POST',
headers: new Headers({
'Content-Type': 'application/json'
}),
body: JSON.stringify(DelElectronicPayment)
});
return fetch(request).then(function(response) {
return response.json();
}).then(function(data) {
if (data.statusCode >= 400) {
that.setState({
msgFailure: data.statusMessage
})
} else {
that.setState({
msgSuccess: data.statusMessage
});

}
}).catch(function(error) {
return error;
})
}

   GetElectronicPayments() {
    var that = this;
    var credentials = {};
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['index'] = 2147483647;
    credentials['recordcount'] = 2147483647;
    credentials["userdetails"] = JSON.parse(window.sessionStorage.getItem("userDetails"));
    credentials["userdetails"]['storeuniquekey'] = storeuniquekey;
    const request = new Request(`${process.env.API_HOST}/ManageProcessorConfigurations.svc/GetAllProcessorconfiguration/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(credentials)
    });
    fetch(request)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
         console.log(data.processorconfigrationlist);
         var tableConfig = that.state.tableConfig;
         tableConfig['data'] = data.processorconfigrationlist;
         that.setState({
          tableConfig: tableConfig,
          ElectronicPayments: data.processorconfigrationlist
        });
   });
  }

componentDidMount() {
    this.GetElectronicPayments();
  }

   onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
    });
  }

 EditElectronicPayment(ElectronicPaymentid){
    browserHistory.push(`/ElectronicPayments/${ElectronicPaymentid}`)
  }


render()
  {
      var currentDomain = window.sessionStorage.getItem("currentdomainname");
      var currentStore = window.sessionStorage.getItem("currentstorename");
  	 const {pageHead,ElectronicPayments,msgFailure,msgSuccess} = this.state;
     const format = 'h:mm a';
     const active = "day-active";
     const inactive = "";
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
            <div className=" widget-fulwidth" id="electronicpayments">
            {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {msgFailure}
            </div>}
            {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {msgSuccess}  </div>}
            <div className="master-table">
              <div className="row">
              <div className="col-sm-12">
                <div className="">
                  <div className="" id="electronicpayments">
                  <Tabelify
                  style={{margin:'30px'}} {...this.state.tableConfig}
                  urlHandler
                  deleteHandler={this.RemoveElectronicPayment}
                  editHandler={this.EditElectronicPayment}
                  />
              </div>
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
export default ElectronicPayment;