import React from 'react';
import Select from 'react-select';
import TextInput from '../common/TextInput';
import DefaultLayout from '../common/DefaultLayout'
import { browserHistory, Link } from 'react-router';
import classnames from 'classnames';
import getUserDetails from '../common/CredentialDomain';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DatePicker from "material-ui/DatePicker";
import getCurrentDate from '../common/Date';
var invoice = require('./invoice.svg');
import Tabelify from '../react-tabelify/Tabelify';
import moment from 'moment';
import axios from 'axios';
//import DatePicker from 'react-datepicker';
var _ = require('underscore');

class Invoice extends React.Component{
  constructor(props) {
      super(props);
      this.onChangeGrid = this.onChangeGrid.bind(this);
      this.state = {
          vendor_value:{
              label:'',
              value:''
          },
          selectedVendorId:'',
          pageHead:{
              pagehead:'Invoices',
              dashboard: 'Dashboard',
              setup: 'Setup'
          },
          "tableConfig": {
          data:[],
          isLoading: true,
          "columnMetadata": [
              {
                  "columnName": "name",
                  "displayName": "Name"
               },
              // {
              //     "columnName": "invoicedate",
              //     "displayName": "Invoice Date"
              // },
               {
                   "columnName": "invoicetotal",
                  "displayName": "Invoice Amount"
               },
              {
                  "columnName": "purchaseitemscount",
                  "displayName": "Item Count"
              },              
              {
                  "columnName": "id",
                  "displayName": "Action",
                  render:()=>{
                      return <div></div>
                  },
                  "flexBasis":'190px'
              }
          ],
          "currentPage": 1,
          "showCheckbox": true,
          "onChangeGrid": this.onChangeGrid,
          "selectedRows": {},
          "onRowClick": this.onRowClick,
          "resultsPerPage": 10,
          "localSearch": true,
          "btnText": 'Add Invoice',
          "showImage": true
          },
          Singleinvoice :{},
          "invoicelineitems":{
             "amounttransactiondate":"29-07-2018 15:10:02",
             "amounttransactionid":"",
             "amounttransactiontype":"",
             "id":"f9a03653-339b-485b-946e-5e0d870a2ecf",
             "invoicedate":new Date(),
             "invoiceid":"1627aea5-8e0a-4371-9022-9b504344e724",
             "invoicetotal":"0",
             "isdataentrycomplete":false,
             "isdeleted":false,
             "name":"",
             "purchaseitemscount":"0",
             "purchaseorder_id":null,
             "remarks":"",
             "store_id":"1627aea5-8e0a-4371-9022-9b504344e724",
             "sysconfig_id":"1627aea5-8e0a-4371-9022-9b504344e724",
             "vendoraccountid":"",
             "vendorid":""

          },
          getInvoiceDate:'',
          showModal: false,
          showEditModal:false,
          VendorAccountsList:[],
          errors:{},
          msgSuccess: "",
          msgFailure: "",
          toDate:'',
          fromDate :'',
          toDateValue :'',
          fromDateValue:'',
          invoicetextsearch:''
      }

      this.updateVendor = this.updateVendor.bind(this);
      this.onChange = this.onChange.bind(this);
      this.open = this.open.bind(this);
      this.getToDate              = this.getToDate.bind(this);
      this.getFromDate            = this.getFromDate.bind(this);
      this.close = this.close.bind(this);
      this.getInvoiceDate = this.getInvoiceDate.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onUpdate = this.onUpdate.bind(this);
      this.editHandler = this.editHandler.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.getInvoiceDateOnEdit = this.getInvoiceDateOnEdit.bind(this);
      this.searchFieldChange = this.searchFieldChange.bind(this);
      this.handleSearchReset = this.handleSearchReset.bind(this);
      this.editClose = this.editClose.bind(this);
      this.updatesearchVendor = this.updatesearchVendor.bind(this);
      this.removeInvoice = this.removeInvoice.bind(this);
  }
  componentDidMount() {
      this.getAllVendors();
      this.getAllInvoices();
  }

  removeInvoice(itemId)
  {
    var that = this;
    var delQuery = {};
    var index = -1;

      var tableConfig = that.state.tableConfig;
      var inventorylen = tableConfig['data'].length;
      var Inventoryarr = tableConfig['data'];
    

    for( var i = 0; i < inventorylen; i++ ) {
      if(Inventoryarr.id == itemId){
        index = i;
        break;
      }
    }
    tableConfig['data'].splice( index, 1 );  
    this.setState({tableConfig: tableConfig});

    delQuery['isdeleted'] = true;
    delQuery['invoiceid'] = itemId;
    delQuery['userdetails'] = getUserDetails();

    const request = new Request(`${process.env.API_HOST}//ManageInvoiceLineItems.svc/DeleteInvoiceLineItem/json`, {
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
      } else {
        that.setState({
          msgSuccess: data.statusMessage
        })
        setTimeout(function() {
          that.setState({
            msgSuccess: ''
          })
        }, 2000)      
      }
    }).catch(function(error) {
      return error;
    })
  }

  getFromDate(event, date){
      var FromDate = moment(date).format("DD-MM-YYYY");
      console.log(typeof(FromDate))
      this.setState({
          fromDate:date
          //fromDateValue: fromDateValue
      })
  }
 
  getToDate(event, date){
      var ToDate = moment(date).format("DD-MM-YYYY");
      this.setState({
          toDate:date
          //toDateValue:toDateValue
      })
  }

  openDatePickerDay = () => {
    this.refs.datePickerDay.focus();
  };

  openStartDatePicker = () => {
    this.refs.datePickerStartDate.focus();
  };

  openDatePickerFrom = () => {
    this.refs.datePickerFrom.focus();
  };

  openDatePickerTo = () => {
    this.refs.datePickerTo.focus();
  };

  openEndDatePicker = () => {
    this.refs.datePickerEndDate.focus();
  };



  onUpdate()
  {
      var that = this;
      var prevState = {};
      var newState = {};
      var getInvoiceVendor;
      var getInvoiceDate;

      getInvoiceVendor = this.state.vendor_value.value;


     // getInvoiceDate = moment(this.state.getInvoiceDateOnEdit).format("DD-MM-YYYY HH:mm:ss");

        //console.log(getInvoiceDate)

         var invDate = this.state.invoicelineitems.invoicedate;
         console.log(invDate)
          prevState = this.state.Singleinvoice;
          prevState["vendoraccountid"] = getInvoiceVendor;
          prevState["vendorid"] = getInvoiceVendor;
          newState['invoicelineitems'] = prevState;
          console.log(prevState)
          

        if(typeof(invDate) == 'object'){
          console.log(invDate)
          console.log(typeof(invDate))
          const parseInvDate = moment(invDate).format('DD-MM-YYYY HH:mm:ss');
          console.log(parseInvDate)
         // newState['invoicelineitems']['invoicedate'] = parseInvDate;
          newState['invoicelineitems']['invoicedate'] = parseInvDate;
          
        } 
        
          console.log(newState)
       // newState['invoicelineitems']['invoicedate'] = invDate;

       // AddUser['User']['birthdate'] =  this.state.User.birthdate;
      
/*      var invDate = this.state.invoicelineitems.invoicedate;
      console.log(invDate)
      const parseInvDate = moment(invDate).format('DD-MM-YYYY HH:mm:ss');*/

      
         // console.log(getInvoiceDate)
          newState['userdetails'] = getUserDetails();

   //   return false;
      var tableConfig = that.state.tableConfig;
      var inventorylen = tableConfig['data'].length;
      var Inventoryarr =tableConfig['data'];
      for (var i = 0; i < inventorylen; i++) {
          Inventoryarr[i] =prevState;
      //var obj = Inventoryarr[i];
      //obj["InvoiceNumber"] =that.getInvoiceNumber(obj.invoicelineitem_id);
      //obj["prodexpirydate"] = moment(obj.prodexpirydate,'YYYY-MM-DD').format("DD-MM-YYYY");
      //Inventoryarr.push(obj);
      }
      
      console.log(JSON.stringify(newState));

      //return false;
      var isValid = this.handleValidation();

      if(isValid)
      {
        const request = new Request(`${process.env.API_HOST}/ManageInvoiceLineItems.svc/UpdateInvoiceLineItem/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(newState)
      });
      fetch(request)
        .then(function(response) {
         // console.log(data)
          if(response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        })
          .then(function(data) {
              that.getAllInvoices();
              if (data.statusCode >= 400) {
                that.setState({
                    msgFailure: data.statusMessage
                })
              } else {
                //prevState.id = data.InvoiceID;
                //Inventoryarr.push(prevState);
                tableConfig['data'] = Inventoryarr;
                that.setState({
                    msgSuccess: data.statusMessage,
                    showEditModal: false,
                    tableConfig:tableConfig
                })
                setTimeout(function(){
                  that.setState({
                      msgSuccess: ''
                  })
                }, 2000)
              }
          });         
      }
      
  }
  

  getAllInvoices(){
    var that = this;
    var reqQuery = {};
    reqQuery['fromdate'] = "String content";
    reqQuery['todate'] = "String content";
    reqQuery['invoicetextsearch'] = "String content";
    reqQuery['vendorAccountId'] = "1627aea5-8e0a-4371-9022-9b504344e724";
    reqQuery['userdetails'] = getUserDetails();

  console.log(JSON.stringify(reqQuery));

  axios.post(`${process.env.API_HOST}/ManageInvoiceLineItems.svc/GetAllInvoiceLineItems/json`, reqQuery)
  .then(function (response) {
        console.log(response.data.InvoiceList);
        var tableConfig = that.state.tableConfig;
        tableConfig['data'] = response.data.InvoiceList;
        tableConfig['isLoading'] = false;
        that.setState({
          tableConfig: tableConfig
        });   
  })
  .catch(function (error) {
      console.log(error);
  });

  }

  //Fetch All Vendors
  getAllVendors() {
        var that = this;
        var credentials = {};
        credentials['userdetails'] = getUserDetails();

        const request = new Request(`${process.env.API_HOST}/ManageVendorAccount.svc/GetAllVendors/json`, {
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
            that.setState({
              VendorAccountsList: data.VendorAccountsList
            });
        });
    }

  open(event) {
      this.setState({
          showModal: true,
          "invoicelineitems":{
             "amounttransactiondate":"29-06-2017 00:00:00",
             "amounttransactionid":"",
             "amounttransactiontype":"",
             "id":"f9a03653-339b-485b-946e-5e0d870a2ecf",
             "invoicedate":"",
             "invoiceid":"1627aea5-8e0a-4371-9022-9b504344e724",
             "invoicetotal":"0",
             "isdataentrycomplete":false,
             "isdeleted":false,
             "name":"",
             "purchaseitemscount":"0",
             "purchaseorder_id":null,
             "remarks":"",
             "store_id":"1627aea5-8e0a-4371-9022-9b504344e724",
             "sysconfig_id":"1627aea5-8e0a-4371-9022-9b504344e724",
             "vendoraccountid":"",
             "vendorid":""

          }
      })
  }

  close(event){
      this.setState({
          showModal: false
      })
  }

  editClose(event){
      this.setState({
          showEditModal: false
      })
  }

  getInvoiceDate(event, date){
      var momentParsed;
      var InvoiceDate = moment(date).format("DD-MM-YYYY");
      console.log(date)
      this.setState({
          getInvoiceDate:date
      })
  }

/*  getInvoiceDateOnEdit(event, date){
    let invoicelineitems = this.state.invoicelineitems;
    invoicelineitems["invoicedate"] = date;
    this.setState({invoicelineitems: invoicelineitems});
  }*/

    getInvoiceDateOnEdit(event, date){
    let invoicelineitems = this.state.Singleinvoice;
    invoicelineitems["invoicedate"] = date;
    console.log(date)
    this.setState({
      invoicelineitems: invoicelineitems
    });
  }

/*  getInvoiceDateOnEdit(event, date){
  var reg_date = this.state.invoicelineitems.val();
  console.log(reg_date);
  reg_date =  moment(reg_date).format("YYYY/MMM/DD");
  console.log(reg_date);
  return;
}*/

  updateVendor(element){
      
      this.setState(
      {
          vendor_value:{
              label:element.label,
              value:element.value
          }   
      }
      )
  }

   updatesearchVendor(element){
      
      this.setState(
      {
          selectedVendorId : element.value
      }
      )
  }


  
  onChange(event){
      var Invoice ={}
       var EditModal = this.state.showEditModal;
          if(EditModal)
          {
            Invoice = this.state.Singleinvoice;
          }
          else
          {
            Invoice = this.state.invoicelineitems;
          }
      var field = event.target.name;
      Invoice[field] = event.target.value;
      this.setState({
          invoicelineitems:Invoice
      })
  }
  
  editHandler(item){
      var that =  this;
      var reqQuery = {};

      reqQuery['invoiceid'] = item;
      reqQuery['userdetails'] = getUserDetails();

      axios.post(`${process.env.API_HOST}/ManageInvoiceLineItems.svc/GetSingleInvoiceLineItem/json`, reqQuery)
       .then(function (response) {
          var responseinvoice = response.data.invoicerole;
          console.log(JSON.stringify(responseinvoice));
          var dateinvoice= moment(responseinvoice.invoicedate,'YYYY-MM-DD');
          that.setState({
              Singleinvoice: responseinvoice,
              showEditModal :true,
              vendor_value :{value:responseinvoice.vendoraccountid},
              getInvoiceDate :dateinvoice
          })

          console.log(that.state);
       })
      .catch(function (error) {
         console.log(error);
      });     
      
  } 


  searchFieldChange(event){
      var field = event.target.name;
      this.setState({
          invoicetextsearch:event.target.value
      })
  }


  handleSearchReset(){
     var that = this;
      this.setState({
          invoicetextsearch:'',
          fromDate :'',
          toDate :'',
          selectedVendorId:''
      })
      this.getAllInvoices();
  }


  handleSearch(){
      var that = this;
      var invoiceRequest = {};

     
      var vendorid = that.state.selectedVendorId;
      var fromDate = moment(that.state.fromDate).format("DD-MM-YYYY HH:mm:ss");
      var toDate = moment(that.state.toDate).format("DD-MM-YYYY HH:mm:ss");
      var invoicesearch = that.state.invoicetextsearch

      if(vendorid =="")
      {
       vendorid ='1627aea5-8e0a-4371-9022-9b504344e724';
      }
      if(fromDate =="")
      {
       fromDate ='String content';
      }
      if(toDate =="")
      {
          toDate='String content' ; 
      }
      if(invoicesearch=="")
      {
         invoicesearch='String content';
      }

      invoiceRequest['vendorAccountId'] = vendorid;
      invoiceRequest['fromdate'] = fromDate;
      invoiceRequest['todate'] = toDate;
      invoiceRequest['invoicetextsearch'] = invoicesearch;
      invoiceRequest['index'] ='1';
      invoiceRequest['recordcount'] ='20';
      invoiceRequest['userdetails'] = getUserDetails();
      console.log(invoiceRequest);

      console.log(JSON.stringify(invoiceRequest));

      axios.post(`${process.env.API_HOST}/ManageInvoiceLineItems.svc/GetAllInvoiceLineItems/json`, invoiceRequest)
      .then(function (response) {
          console.log(response.data.InvoiceList);

            var tableConfig = that.state.tableConfig;
            tableConfig['data'] = response.data.InvoiceList;
            tableConfig['isLoading'] = false;
            that.setState({
              tableConfig: tableConfig
            });   
      })
      .catch(function (error) {
          console.log(error);
      });
  }


handleValidation(){

      let errors = {};
      //Form validation error message
       var invoice ={};
       var EditModal = this.state.showEditModal;
          if(EditModal)
          {
          invoice = this.state.Singleinvoice;
          }
          else
          {
          invoice = this.state.invoicelineitems;
          }

      if(invoice.vendoraccountid ==='')
       {
          errors.vendor = "Select vendor Name";
       }
  
      if (invoice.name.trim() ==='') {
          errors.name = "Name should not be empty";
      }

      if (invoice.invoicedate === ''){
          errors.invoicedate = "Invoice  should not be empty";
      }

      if(invoice.invoicetotal ===''|| invoice.invoicetotal ==="0")
      {
        errors.invoicetotal = "invoice total should not be empty or zero"; 
      }

       if(invoice.purchaseitemscount ===''|| invoice.purchaseitemscount ==="0")
      {
        errors.purchaseitemscount = "Items count should not be empty or zero"; 
      }
      
      this.setState({ errors }); //Set Errors state
      return Object.keys(errors).length == 0;
 }


  onSubmit(){
      var that = this;
      var prevState = {};
      var newState = {};
      var getInvoiceVendor;
      var getInvoiceDate;

      getInvoiceVendor = this.state.vendor_value.value;
      getInvoiceDate =  moment(this.state.getInvoiceDate).format("DD-MM-YYYY HH:mm:ss");
      prevState = this.state.invoicelineitems; 

      prevState["vendoraccountid"] = getInvoiceVendor;
      prevState["vendorid"] = getInvoiceVendor;
      prevState["invoicedate"] = getInvoiceDate;

      newState['invoicelineitems'] = prevState;
      newState['userdetails'] = getUserDetails();

      var tableConfig = that.state.tableConfig;
      var inventorylen = tableConfig['data'].length;
      var Inventoryarr =tableConfig['data'];

      console.log(JSON.stringify(newState));
      //return false;
      var isValid = this.handleValidation();

      if(isValid)
      {
            const request = new Request(`${process.env.API_HOST}/ManageInvoiceLineItems.svc/CreateInvoiceLineItem/json`, {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify(newState)
          });
          fetch(request)
            .then(function(response) {
              if(response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            })
              .then(function(data) {
                console.log(data)
                  that.getAllInvoices();
                  if (data.statusCode >= 400) {
                    that.setState({
                        msgFailure: data.statusMessage
                    })
                  } else {
                    prevState.id = data.InvoiceID;
                    Inventoryarr.push(prevState);
                    tableConfig['data'] = Inventoryarr;
                    that.setState({
                        msgSuccess: data.statusMessage,
                        showModal: false,
                        tableConfig:tableConfig
                    })
                    setTimeout(function(){
                      that.setState({
                          msgSuccess: ''
                      })
                    }, 2000)
                  }
              });         
          }
      
  }

  onChangeGrid(event, data) {
      var tableConfig = this.state.tableConfig;
      _.extend(tableConfig, data);
      this.setState({
        tableConfig: tableConfig
      });
  }   
  render(){
    console.log(this.state)
      var {pageHead, VendorAccountsList,msgFailure, msgSuccess,Singleinvoice} = this.state;
     
      VendorAccountsList = VendorAccountsList.map(function(o) {
          return {
            label: o.name,
            value: o.id
          }
      });
  var currentDomain = window.sessionStorage.getItem("currentdomainname");
  var currentStore = window.sessionStorage.getItem("currentstorename");

    const parseInvoiceDate = moment(this.state.invoicelineitems.invoicedate, 'DD-MM-YYYY,hh:mm:ss a')
    const parseInvDate = new Date(parseInvoiceDate)

    console.log(parseInvDate)

    const parseInvoiceDateOnEdit = moment(this.state.Singleinvoice.invoicedate, 'DD-MM-YYYY,hh:mm:ss a')
    const parseInvDateOnEdit = new Date(parseInvoiceDateOnEdit)

    console.log(parseInvDateOnEdit)

return(
<DefaultLayout>
<div className="page-head inner__pageHead">
  <div className="domain-icon"> <img src={require( './invoice.svg')}/> <h2>{pageHead.pagehead}</h2></div>
      <ol className="breadcrumb">
          <li><Link to={`/domains`}>{currentDomain}</Link></li>
          <li><Link to={`/stores`}>{currentStore}</Link></li>  
          <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
          <li><Link to={`/InventoryLanding`}>Inventory Details</Link></li>
          <li><Link className="active" to={`/invoices`}>Invoices</Link></li>
      </ol>              
</div>
<main>
  <div className="master-table" id = "invoice">
      <div className="row">
          <div className="col-sm-12">
              {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                {msgFailure}
              </div>}
              {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                {msgSuccess}
              </div>} 
              <div >
                  <div className="row">
                    
                    <div className="col-sm-12 col-md-6 col-lg-3">
                      <div className="form-group">
                        <label className="control-label">Vendor</label>
                          <Select
                            name="vendors"
                            value={this.state.selectedVendorId}
                            options={VendorAccountsList}
                            onChange={this.updatesearchVendor}
                            />
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-2">
                      <div className={classnames('form-group', { error: !!this.state.errors.invoicetextsearch})}>
                          <TextInput
                            type="text" 
                            name="invoicetextsearch"
                            label="Invoice #"
                            value={this.state.invoicetextsearch}
                            placeholder=""
                            className={classnames('form-control', { error: !!this.state.errors.invoicetextsearch})}
                            onChange={this.searchFieldChange}
                          />
                          <span>{this.state.errors.invoicetextsearch}</span>
                      </div>
                    </div>
                    <MuiThemeProvider>
                          <div className="row">
                          <div className={classnames('form-group col-sm-12 col-md-6 col-lg-3 reactDatepicker', { error: !!this.state.errors.fromDate})}>
                          <label className="control-label">Dated From</label>
                            <div className="datepicker-wrapper">
                              <DatePicker
                                id="datePickerFrom"
                                ref='datePickerFrom'
                                formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                                onChange={this.getFromDate}
                                value={this.state.fromDate}
                                className="m-datePicker"
                                textFieldStyle={{'height':'40px'}}
                              />
                            </div>
                            <div className="input-group-addon btn btn-secondary" onClick={this.openDatePickerFrom}><i className="icon icon-799"></i></div>
                          <span className="clearfix" style={{'display':'block'}}>{this.state.errors.fromDate}</span>
                        </div>
                          <div className={classnames('form-group col-sm-12 col-md-6 col-lg-3 reactDatepicker', { error: !!this.state.errors.toDate})}>
                          <label className="control-label">Dated To</label>
                            <div className="datepicker-wrapper">
                              <DatePicker
                                onChange={this.getToDate}
                                value={this.state.toDate}
                                ref='datePickerTo'
                                id="datePickerTo"
                                formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                                className="m-datePicker"
                                textFieldStyle={{'height':'40px'}}
                              />
                            </div>
                            <div className="input-group-addon btn btn-secondary" onClick={this.openDatePickerTo}><i className="icon icon-799"></i></div>
                            <span>{this.state.errors.toDate}</span>
                        </div>
                      </div>
                    </MuiThemeProvider>


{/*                                   <div className="col-sm-12 col-md-6 col-lg-2">
                                 <div className="form-group reactDatepicker">
                                  <label className="control-label"> Date Range From</label>
                                  <DatePicker className="react-datepicker-txt"
                                    selected={this.state.fromDate}
                                    value={this.state.fromDate}
                                    onChange={this.getFromDate}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select" />
                                    <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
                                  </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-2">
                                  <div className="form-group reactDatepicker">
                                  <label className="control-label"> Date Range To</label>
                                  <DatePicker className="react-datepicker-txt"
                                    selected={this.state.toDate}
                                    value={this.state.toDate}
                                    onChange={this.getToDate}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select" />
                                    <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
                                  </div>
                                </div>*/}


                                {/* <div className="col-sm-12 col-md-2">
                                  <div className="form-group">
                                    <div className="po-search-wrap">
                                      <button onClick={this.handleSearch} type="button" className="btn btn-primary btn-rounded"><i className="icon icon-1202"></i> Search</button>
                                      <button onClick={this.handleSearchReset} type="reset" className="btn btn-primary btn-rounded"><i className="icon icon-1202"></i> Reset</button>
                                    </div>
                                  </div>
                                </div>                                                                                                
                              </div> */}
                              
               <div className="col-sm-12 col-md-6 col-lg-1">
                <div className="form-group">
                  <div className="po-search-wrap">
                    <button type="submit" className="btn btn-primary btn-rounded" onClick={this.handleSearch}><i className="icon icon-1202"></i> Search</button>
                  </div>
                </div>
              </div>  
              <div className="col-sm-12 col-md-6 col-lg-1">
                <div className="form-group">
                  <div className="po-search-wrap">
                  <div className='blue-links'>
                  <button type="button" className="btn btn-primary btn-rounded" onClick={this.handleSearchReset}><i className="fa fa-refresh"></i> Reset</button>
                  </div>
                  </div>
                </div>
              </div>               
                      </div>


                      <div className="row">
                          <div className="col-sm-12 md-mb-20">
                              <hr />
                          </div>
                      </div>
                      <Tabelify
                        modalHandler={this.open}
                        style={{margin:'30px'}} {...this.state.tableConfig}
                        editHandler={this.editHandler}
                        deleteHandler={this.removeInvoice}
                      />
                  </div>
              </div>
          </div>
            <Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>
            <form>
              <Modal.Header closeButton>
                <Modal.Title>Add Invoice</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div className={classnames('form-group', { error: !!this.state.errors.vendor})}>
                <label className="control-label">Vendor <span className="required">*</span></label>
                <Select
                  name="country"
                  value={this.state.vendor_value.value}
                  options={VendorAccountsList}
                  onChange={this.updateVendor}
                  />
                   <span>{this.state.errors.vendor}</span>
              </div>
                <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                    <TextInput
                      type="text" 
                      name="name"
                      label="Invoice #"
                      value={this.state.name}
                      placeholder=""
                      required="*"
                      className={classnames('form-control', { error: !!this.state.errors.name})}
                      onChange={this.onChange}
                    />
                    <span>{this.state.errors.name}</span>
                </div>  
                <MuiThemeProvider>
                      <div className="row">
                      <div className={classnames('form-group col-lg-12 reactDatepicker', { error: !!this.state.errors.invoicedate})}>
                      <label className="control-label">Invoice date</label>
                        <div className="datepicker-wrapper">
                          <DatePicker
                            id="datePickerStartDate"
                            ref='datePickerStartDate'
                            formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                            onChange={this.getInvoiceDate}
                            value={this.state.getInvoiceDate}
                            className="m-datePicker"
                            textFieldStyle={{'height':'40px'}}
                          />
                        </div>
                        <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
                      <span className="clearfix" style={{'display':'block'}}>{this.state.errors.invoicedate}</span>
                    </div>
                  </div>
                </MuiThemeProvider>

{/*                 <div className={classnames('form-group reactDatepicker', { error: !!this.state.errors.invoicedate})}>
                    <label className="control-label">Invoice Date <span className="required">*</span></label>
                    <DatePicker className="react-datepicker-txt"                                            
                      selected={this.state.getInvoiceDate}
                      value={this.state.getInvoiceDate}
                      onChange={this.getInvoiceDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select" />
                  <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
                  <span>{this.state.errors.invoicedate}</span>
                </div>  */}


                <div className={classnames('form-group', { error: !!this.state.errors.invoicetotal})}>
                    <TextInput
                      type="text" 
                      name="invoicetotal"
                      label="Invoice Amount"
                      value={this.state.invoicetotal}
                      placeholder=""
                      required="*"
                      className={classnames('form-control', { error: !!this.state.errors.invoicetotal})}
                      onChange={this.onChange}
                    />
                    <span>{this.state.errors.invoicetotal}</span>
                </div>
                <div className={classnames('form-group', { error: !!this.state.errors.purchaseitemscount})}>
                    <TextInput
                      type="text" 
                      name="purchaseitemscount"
                      label="Purchase Count"
                      value={this.state.purchaseitemscount}
                      placeholder=""
                      required="*"
                      className={classnames('form-control', { error: !!this.state.errors.purchaseitemscount})}
                      onChange={this.onChange}
                    />
                    <span>{this.state.errors.purchaseitemscount}</span>
                </div>                                                          
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn-submit" onClick={this.onSubmit}>Submit</Button>
                <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
              </Modal.Footer>
            </form>
            </Modal>  

           <Modal show={this.state.showEditModal} onHide={this.close} backdrop={false} keyboard={false}>
          <form>
            <Modal.Header closeButton>
              <Modal.Title>Update Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className={classnames('form-group', { error: !!this.state.errors.vendor})}>
              <label className="control-label">Vendor <span className="required">*</span></label>
              <Select
                name="country"
                value={this.state.vendor_value.value}
                options={VendorAccountsList}
                onChange={this.updateVendor}
                />
                 <span>{this.state.errors.vendor}</span>
            </div>
              <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                  <TextInput
                    type="text" 
                    name="name"
                    label="Invoice #"
                    value={this.state.Singleinvoice.name}
                    placeholder=""
                    required="*"
                    className={classnames('form-control', { error: !!this.state.errors.name})}
                    onChange={this.onChange}
                  />
                  <span>{this.state.errors.name}</span>
              </div> 
                  <MuiThemeProvider>
                      <div className="row">
                      <div className={classnames('form-group col-lg-12 reactDatepicker', { error: !!this.state.errors.invoicedate})}>
                      <label className="control-label">Invoice date</label>
                        <div className="datepicker-wrapper">
                          <DatePicker
                            id="datePickerStartDate"
                            ref='datePickerStartDate'
                            formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                            onChange={this.getInvoiceDateOnEdit}
                            value={parseInvDateOnEdit}
                            className="m-datePicker"
                            textFieldStyle={{'height':'40px'}}
                          />
                        </div>
                        <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
                      <span className="clearfix" style={{'display':'block'}}>{this.state.errors.invoicedate}</span>
                    </div>
                  </div>
                </MuiThemeProvider>

{/*              <div className={classnames('form-group reactDatepicker', { error: !!this.state.errors.invoicedate})}>
                  <label className="control-label">Invoice Date <span className="required">*</span></label>
                  <DatePicker className="react-datepicker-txt"                                            
                    selected={this.state.getInvoiceDate}
                    value={this.state.getInvoiceDate}
                    onChange={this.getInvoiceDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select" />
                <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
                <span>{this.state.errors.invoicedate}</span>
              </div> */} 

                <div className={classnames('form-group', { error: !!this.state.errors.invoicetotal})}>
                    <TextInput
                      type="text" 
                      name="invoicetotal"
                      label="Invoice Amount"
                      value={this.state.Singleinvoice.invoicetotal}
                      placeholder=""
                      required="*"
                      className={classnames('form-control', { error: !!this.state.errors.invoicetotal})}
                      onChange={this.onChange}
                    />
                    <span>{this.state.errors.invoicetotal}</span>
                </div>
                <div className={classnames('form-group', { error: !!this.state.errors.purchaseitemscount})}>
                    <TextInput
                      type="text" 
                      name="purchaseitemscount"
                      label="Purchase Count"
                      value={this.state.Singleinvoice.purchaseitemscount}
                      placeholder=""
                      required="*"
                      className={classnames('form-control', { error: !!this.state.errors.purchaseitemscount})}
                      onChange={this.onChange}
                    />
                    <span>{this.state.errors.purchaseitemscount}</span>
                </div>                                                          
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn-submit" onClick={this.onUpdate}>Update</Button>
                <Button className="btn-cancel" onClick={this.editClose}>Cancel</Button>
              </Modal.Footer>
            </form>
            </Modal>
            </div>  
            </main>
        </DefaultLayout>                                        

      )
  }
}
export default Invoice;