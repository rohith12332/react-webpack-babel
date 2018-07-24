import React from 'react';

import Select from 'react-select';

import TextInput from '../common/TextInput';

import DefaultLayout from '../common/DefaultLayout'

import {browserHistory, Link} from 'react-router';

import classnames from 'classnames';

import getUserDetails from '../common/CredentialDomain';

import Button from 'react-bootstrap/lib/Button';

import Modal from 'react-bootstrap/lib/Modal';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import FormControl from 'react-bootstrap/lib/FormControl';

import DatePicker from 'material-ui/DatePicker';

import getCurrentDate from '../common/Date';

import Tabelify from '../react-tabelify/Tabelify';

import moment from 'moment';

import axios from 'axios';

import PurchaseTable from './PurchaseTable';

import PurchaseSearchTable from './PurchaseSearchTable';

import jsPDF from 'jspdf';

var _ = require('underscore');

class PurchaseOrder extends React.Component{
    constructor(props) {
        super(props);
        const date = moment(new Date()).format("DD-MM-YYYY");
        const poDate = moment(new Date()).format("PODDMMYYYYHHMMSS");

        this.state = {
          pageHead:{
            pagehead:'Purchase Order',
            dashboard: 'Dashboard',
            setup: 'Setup'
          },

          poSearchByDate:{
            "fromdate":"",
            "todate":"",
            "index":2147483647,
            "posearchtext":"",
            "recordcount":2147483647,
          },
          "vendorid":"1627aea5-8e0a-4371-9022-9b504344e724",
          "poaddress":{
            FromStore:{

            },
            ToVendor:{

            }
          },
          ponum:"",
          selectedVendorId:{},
          podata:[],
          showModal: false,
          showEditModal:false,
          VendorAccountsList:[],
          purchaseorderlist:[],
          errors:{},
          msgSuccess: "",
          msgFailure: "",
          isLoading: false,
          reportTable: false,
          pochildList: [],
          poTable: false,
          date: date,
          poDate:poDate,
          poType: "1",
          showInvoice: false,
          showSearchTable: false,
          showTable:false
        }

        this.selectVendor = this.selectVendor.bind(this);
        this.selectSearchVendor = this.selectSearchVendor.bind(this);
        this.searchFieldChange = this.searchFieldChange.bind(this);
        this.onReset = this.onReset.bind(this);

    }


  componentDidMount() {
    this.getAllVendors();
    this.GetPoNum();

        $(document).ready(function() {
          $('.SalesByReport__Item').click(function(){
            $(this).addClass('current').siblings().removeClass('current');
          });
          $(document).on("click", "#btnExport", function(e){
            e.preventDefault();
            //getting data from our table
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = document.getElementById('pdfwraper');
            var table_html = table_div.outerHTML.replace(/ /g, '%20');

            var a = document.createElement('a');
            a.href = data_type + ', ' + table_html;
            a.download = 'PurchaseOrder_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
            a.click();
          });
        });
    }

    GetPoNum = () => {
      let that = this;
      let reqQuery = {};
      reqQuery["userdetails"] = getUserDetails();
      //console.log(JSON.stringify(reqQuery))

      axios.post(`${process.env.API_HOST}/ManageCreatePoNumber.svc/GetPurchasenumber/json`, reqQuery)
        .then(function (response) {
          console.log(response);
          if (response.data.PONum == null) response.data.ponum = "";
          that.setState({
            ponum: response.data.PONum,

          });


        })
        .catch(function (error) {
          console.log(error);
        });
    }

  selectVendor(element){
    delete this.state.errors.selectedVendorId;
    this.setState({ selectedVendorId : element })
  }

  selectSearchVendor(element){
    this.setState({ vendorid : element })
  }

  searchFieldChange(event){
      var field = event.target.name;
      this.setState({
          posearchtext:event.target.value
      })
  }

  handleDatePickerStartDate = (event, date) => {
    delete this.state.errors.fromdate;
        var DatePickedUp = moment(date).format("DD-MM-YYYY");
        var poSearchByDate = this.state.poSearchByDate;
        poSearchByDate['fromdate'] = DatePickedUp;

    this.setState({
      poSearchByDate: poSearchByDate
    })
  }


  handleDatePickerEndDate = (event, date) => {
    delete this.state.errors.todate;
    var DatePickedUp = moment(date).format("DD-MM-YYYY");
        var poSearchByDate = this.state.poSearchByDate;
        poSearchByDate['todate'] = DatePickedUp;
    this.setState({
      poSearchByDate: poSearchByDate
    })
  }


  openDatePickerDay = () => {
    this.refs.datePickerDay.focus();
  }

  openStartDatePicker = () => {
      this.refs.datePickerStartDate.focus();
    }
  openStartDatePicker1 = () => {
      this.refs.datePickerStartDate1.focus();
    }

  openEndDatePicker = () => {
      this.refs.datePickerEndDate.focus();
    }



  handleValidation = () => {
    let errors = {};

    if (this.state.selectedVendorId.value == null) {
      errors.selectedVendorId = "Please select the Vendor"
    }

    this.setState({
      errors
    }); //Set Errors state

    return Object.keys(errors).length == 0;
  }

    handleSearchValidation = () => {
    let errors = {};

    if (this.state.poSearchByDate.fromdate === '') {
      errors.fromdate = "Please select start date"
    }

    if (this.state.poSearchByDate.todate === '') {
      errors.todate = "Please select end date"
    }


    this.setState({
      errors
    }); //Set Errors state

    return Object.keys(errors).length == 0;
  }

  onReset(event) {
      browserHistory.push('/purchaseorder')
  }


//get all purcase Orders

  poSearchByDate = () => {
    this.setState({showSearchTable: true,showTable: true})
    var that = this;
    var reqQuery = {};
    var reqQuery2 = {};
    var poSearchByDate = this.state.poSearchByDate;

    var fromdate = this.state.poSearchByDate.fromdate;
    var todate = this.state.poSearchByDate.todate;
    var posearchtext = poSearchByDate.posearchtext;
    var vendorid = this.state.vendorid.value;


    reqQuery = poSearchByDate;
    reqQuery['userdetails'] = getUserDetails();
    reqQuery["vendorid"] = vendorid;
    reqQuery["fromdate"] = fromdate;
    reqQuery["todate"] = todate;
    console.log(JSON.stringify(reqQuery))
    axios.post(`${process.env.API_HOST}/ManagePurchaseOrder.svc/GetAllPurchaseOrders/json`, reqQuery)
    .then(function(response){
      console.log(response.data)
      if(response.data.statusCode == 200){
        that.setState({
          purchaseorderlist: response.data.purchaseorderlist
        });

        reqQuery2["vendorid"] = response.data.purchaseorderlist[0].vendor_id;
        reqQuery2["storeid"] = window.sessionStorage.getItem('storeid');
        reqQuery2['userdetails'] = getUserDetails();
        console.log(JSON.stringify(reqQuery2))


        //Get PO Address
        axios.post(`${process.env.API_HOST}/ManagePurchaseOrder.svc/GetAddressDetails/json`, reqQuery2)
        .then(function(response){
          console.log(response.data)
          if(response.data.statusCode == 200){
            that.setState({
              poaddress:response.data
            })
          }
        }).catch(function (error) {
          console.log("Bad Response");
        });
      }else{
        console.log(response.status)
      }
    }).catch(function (error) {
        console.log("Bad Response");
    });
}

//get all vendors

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
          VendorAccountsList: data.VendorAccountsList,
        });
    });
  }

//po creation

createPO = () => {
  this.setState({showSearchTable: true,showTable: true})
    var that = this;
    var isValid = this.handleValidation();
    if(isValid) {
    var reqQuery = {};
    var reqQuery2 = {};
    reqQuery['userdetails'] = getUserDetails();
    reqQuery["vendorid"] = this.state.selectedVendorId.value;

    console.log(JSON.stringify(reqQuery))
    axios.post(`${process.env.API_HOST}/ManagePurchaseOrder.svc/BeforePurchaseOrderCreate/json`, reqQuery)
    .then(function(response){
      //console.log(response)
      if(response.data.statusCode == 200){

        that.setState({
          pochildList:response.data.pochildList,
          poTable: true
        })

        reqQuery2["vendorid"] = that.state.selectedVendorId.value;
        reqQuery2["storeid"] = window.sessionStorage.getItem('storeid');
        reqQuery2['userdetails'] = getUserDetails();
        console.log(JSON.stringify(reqQuery2))

        //Get PO Address
        axios.post(`${process.env.API_HOST}/ManagePurchaseOrder.svc/GetAddressDetails/json`, reqQuery2)
        .then(function(response){
          console.log(response)

          if(response.data.statusCode == 200){
            that.setState({
              poaddress:response.data
            })
          }

        }).catch(function (error) {
          console.log("Bad Response");
        });
      }
    }).catch(function (error) {
      console.log("Bad Response");
    });
  }
}



generatePO = () => {
   this.setState({showInvoice : true,showTable:true})
   var json = '[';
   var otArr = [];
   var tbl2 = $('#poTable tbody tr').each(function(i) {
      var x = $(this).children();
      var itArr = [];

      x.each(function() {
         //itArr.push($(this).attr('data-name')+":"+'"'+$(this).attr('data-title')+'"');
         var itemName = $(this).attr('data-name');
         var itemVal = $(this).attr('data-title');

         itArr.push('"'+itemName+'":"'+itemVal+'"')
      });
      otArr.push('{' + itArr.join(',') + '}');

   })
   json += otArr.join(",") + ']'
   var data = json.toString();
   if (data.includes('\"')) { data = JSON.parse(data); }

   var modifiedRecord = [];

   data.map(function(d){
      if(d.requestqty == 0 ){
      }else{
        modifiedRecord.push(d)
      }
   })

  // console.log(data);
   this.setState({podata : modifiedRecord})

    var purchaseorderinfo = {
      "CreatedBy":"String content",
      "ModifiedBy":"String content",
      "id":"1627aea5-8e0a-4371-9022-9b504344e724",
      "isdeleted":false,
      "isforwardtoretailer":true,
      "isnew":true,
      "name":"",
      "remarks":"String content",
      "store_Id":"1627aea5-8e0a-4371-9022-9b504344e724",
      "totpoapprprice":12678967,
      "userid":"1627aea5-8e0a-4371-9022-9b504344e724",
      "vendor_id":"2a0defe7-be89-4d0e-ad27-c8f3f6a781dc"
    }


   var reqQuery = {}
    var isValid = this.handleValidation();
    if(isValid) {
   var vendor_id = this.state.selectedVendorId.value;
   var name = this.state.ponum;
   var purchaseDate = this.state.date;

   reqQuery['userdetails'] = getUserDetails();
   reqQuery['pochildinfolist'] = modifiedRecord;
   reqQuery['purchaseorderinfo'] = purchaseorderinfo;
   reqQuery['purchaseorderinfo']['vendor_id'] = vendor_id;
   reqQuery['purchaseorderinfo']['name'] = name;

   console.log(JSON.stringify(reqQuery))

    axios.post(`${process.env.API_HOST}/ManagePurchaseOrder.svc/CreatePurchaseOrder/json`, reqQuery)
      .then(function(response){
        console.log(response);

        }).catch(function (error) {
            console.log("Bad Response");
      });
    }
  }


  makePDF () {
      var quotes = document.getElementById('invoiceGeneration');
      html2canvas(quotes, {
        onrendered:function(canvas) {
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;

          //The height of the canvas which one pdf page can show;
          var pageHeight = contentWidth / 592.28 * 841.89;
          console.log(pageHeight);
          //return false;
          //the height of canvas that haven't render to pdf
          var leftHeight = contentHeight;
          //addImage y-axial offset
          var position = 0;
          //a4 format [595.28,841.89]
          var imgWidth = 595.28;
          var imgHeight = 592.28/contentWidth * contentHeight;

          var pageData = canvas.toDataURL('image/png', 1.0);

          var pdf = new jsPDF('', 'pt', 'a4');
          pdf.page = 1;
          function footer(){
            pdf.text(150,285, 'page ' + pdf.page);
            pdf.page ++;
          };

           if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight );
          } else {
            while(leftHeight > 0) {
              pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight;
              position -= 841.89;
              //avoid blank page
              if(leftHeight > 0) {
                pdf.addPage();
                //footer()
              }
            }
          }
          pdf.save('PurchaseOrder.pdf');
        }
      })
  }
  handleSearchType = (e) => {
    console.log(e.target.value)
    var poType = e.target.value;
    this.setState({poType: poType})
  }

  render(){
      console.log(this.state)
        var currentDomain = window.sessionStorage.getItem("currentdomainname");
        var currentStore = window.sessionStorage.getItem("currentstorename");

        const {
          pageHead,
          VendorAccountsList,
          SearchVendorAccountsList,
          msgFailure, msgSuccess } = this.state;


       var VendorAccounts = VendorAccountsList.map(function(o){
          return{
            label:o.name,
            value:o.id
          }
        })

        const items = this.state.podata.map((item, i) =>{
          return(
            <tr>
              <td style={{'padding':5}} data-title={i++}>{i}</td>
              <td style={{'padding':5}}>{item.productname}</td>
              <td style={{'padding':5}}>{item.requestqty}</td>
            </tr>
          )
        })
        return(
          <DefaultLayout>
              <div className="page-head inner__pageHead">
                <div className="domain-icon"> <h2>{pageHead.pagehead}</h2></div>
                  <ol className="breadcrumb">
                    <li><Link to={`/domains`}>{currentDomain}</Link></li>
                    <li><Link to={`/stores`}>{currentStore}</Link></li>
                    <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                    <li><Link to={`/InventoryLanding`}>Inventory Details</Link></li>
                    <li><Link className="active">purchaseorder</Link></li>
                  </ol>
              </div>

              <main>
                <div className="master-table" id="PO">
                  <div className="row">
                    <div className="col-sm-12">

                      <div className="row">
                        <div className="col-sm-12">
                          <div className="col-sm-4">
                          <div className="row">
                            <div className="col-sm-6">
                              <label className="control-label">
                                <input type="radio" name="poType" value="1" onChange={this.handleSearchType}  checked={this.state.poType === '1'} />
                                &nbsp;&nbsp;<strong>CREATE PO</strong>
                                </label>
                            </div>
                            <div className="col-sm-6">
                              <label className="control-label">
                                <input type="radio" name="poType" value="2" onChange={this.handleSearchType} checked={this.state.poType === '2'} />
                                &nbsp;&nbsp;<strong>SEARCH PO</strong>
                                </label>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-12"><hr style={{ 'marginTop': 10}} /></div>
                      {this.state.poType === "1" && <div>
                      <div className="col-xs-12 col-md-4">
                        <div className={classnames('form-group', { error: !!this.state.errors.selectedVendorId })}>
                          <label className="control-label">Vendors</label>
                            <Select
                              name="vendors"
                              value={this.state.selectedVendorId.value}
                              options={VendorAccounts}
                              onChange={this.selectVendor}
                            />
                            <span>{this.state.errors.selectedVendorId}</span>
                        </div>
                      </div>

                      <div className="col-xs-12 col-md-3">
                        <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                          <TextInput
                            type="text"
                            name="name"
                            label="PO #"
                            value= {this.state.ponum}
                            disabled={true}
                            placeholder=""
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-xs-12 col-md-3">
                        <div className="form-group">
                          <TextInput
                            type="text"
                            name="podate"
                            label="Today Date"
                            value={this.state.date}
                            disabled={true}
                            placeholder=""
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-xs-12 col-md-2">
                        <div className="po-search-wrap createpo">
                          <button
                            type="submit"
                            className="btn btn-primary btn-rounded"
                            onClick={this.createPO}>Create</button>
                        </div>
                      </div>
                    </div>}

                    </div>
                  </div>


                  {this.state.poType === "2" && <div>
                  <div className="col-xs-12 col-md-4">
                    <div className={classnames('form-group', { error: !!this.state.errors.vendorid })}>
                      <label className="control-label">Vendor</label>
                        <Select
                          name="vendors"
                          value={this.state.vendorid.value}
                          options={VendorAccounts}
                          onChange={this.selectSearchVendor}
                        />
                        <span>{this.state.errors.vendorid}</span>
                    </div>
                  </div>
                  <MuiThemeProvider>
                  <div>
                  <div className="col-xs-12 col-md-3">
                    <div className={classnames('form-group reactDatepicker', { error: !!this.state.errors.fromdate})}>
                      <label className="control-label">From Date</label>
                        <div className="datepicker-wrapper">
                          <DatePicker
                            id="datePickerStartDate"
                            ref='datePickerStartDate'
                            formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                            onChange={this.handleDatePickerStartDate}
                            onClick={this.openStartDatePicker}
                            className="m-datePicker"
                            textFieldStyle={{'height':'40px'}}
                          />
                        </div>
                        <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
                      <span className="clearfix" style={{'display':'block'}}>{this.state.errors.fromdate}</span>
                    </div>
                  </div>

                  <div className="col-xs-12 col-md-3">
                    <div className={classnames('form-group reactDatepicker', { error: !!this.state.errors.todate})}>
                      <label className="control-label">To Date</label>

                        <div className="datepicker-wrapper">
                          <DatePicker
                            onChange={this.handleDatePickerEndDate}
                            ref='datePickerEndDate'
                            id="datePickerEndDate"
                            formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                            onClick={this.openEndDatePicker}
                            className="m-datePicker"
                            textFieldStyle={{'height':'40px'}}
                          />
                        </div>

                        <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
                        <span>{this.state.errors.todate}</span>
                      </div>
                    </div>
                    </div>
                  </MuiThemeProvider>
                  <div className="col-xs-12 col-md-2">
                    <div className="po-search-wrap createpo">
                      <button
                        type="submit"
                        className="btn btn-primary btn-rounded"
                        onClick={this.poSearchByDate}>Generate</button>
                    </div>
                  </div>
                  <div className= "clearfix" ></div>
                  </div>
                  }

                  {this.state.poType === "1" &&
                  <div className="row">
                    <div className="col-md-12">
                    {this.state.showTable &&
                      <div className="table-responsive dashbord-table" id="pdfwraper">
                        <PurchaseTable
                          purchaseorderlist={this.state.pochildList}
                          generatePO={this.generatePO}
                          onReset={this.onReset}
                        />
                      </div>
                    }
                    </div>
                  </div>}
                  {this.state.poType === "2" &&
                  <div className="row">
                    <div className="col-md-12">
                    {this.state.showTable &&
                      <div className="table-responsive dashbord-table" id="pdfwraper">
                        <PurchaseSearchTable
                          poTyoe={this.state.poType}
                          purchaseorderlist={this.state.purchaseorderlist}
                          generatePO={this.createPO}
                          poaddress={this.state.poaddress}
                          showSearchTable={this.state.showSearchTable}
                          onReset={this.onReset}
                        />
                      </div>}
                    </div>
                  </div>}

                  {this.state.showInvoice && this.state.poType === "1" &&
                    <div className="row">
                      <div className="col-md-12">
                      <div style={{textAlign: 'center'}}>
                            <a id="btnExportPdf" style={{textAlign: 'center'}} onClick={this.makePDF}>
                              <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                              <br />PDF</a>
                          </div>
                        <div id="invoiceGeneration" style={{'width':768, 'marginLeft':'auto','marginRight':'auto','padding':20}}>
                        <table className="table" cellPadding="20">

                        <tr>
                          <td colSpan="2" style={{'textAlign':'center'}}>
                            <h2>PURCHASE ORDER</h2>
                          </td>
                        </tr>

                        <tr>
                        <td style={{verticalAlign:'top'}}>
                        <strong>Store Address:</strong> {this.state.poaddress.FromStore.address1}
                        {this.state.poaddress.FromStore.city},<br />
                        {this.state.poaddress.FromStore.state},
                        {this.state.poaddress.FromStore.country}
                        {this.state.poaddress.FromStore.zipcode}<br />
                        <strong>Phone</strong>: {this.state.poaddress.FromStore.phonenumber}
                        </td>
                          <td style={{textAlign:'right', verticalAlign:'top'}}>
                            <strong>PO Number :</strong> {this.state.ponum}<br />
                            <strong>PO Date :</strong> {this.state.date}
                          </td>
                        </tr>
                        <tr>
                          <td style={{height: 5, textAlign:'right'}}></td>
                        </tr>
                        <tr>

                          <td style={{textAlign:'right', verticalAlign:'top'}}>

                          {/* <img src={require('./barcode.gif')} width="260"/> */}
                          </td>
                        </tr>
                        <tr>
                          <td style={{height: 40, textAlign:'right'}}></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                          &nbsp;
                          </td>
                        </tr>
                          <tr>
                            <td style={{verticalAlign:'top'}}>
                            <table width="90%">
                              <tr>
                                <td>
                                  <h2 style={{backgroundColor:'rgb(78, 205, 196)', color:'white', fontSize:16, padding: 10}}>Vendor Details:</h2>
                                  {this.state.poaddress.ToVendor.address1}
                                  {this.state.poaddress.ToVendor.city},<br />
                                  {this.state.poaddress.ToVendor.state},
                                  {this.state.poaddress.ToVendor.country}
                                  {this.state.poaddress.ToVendor.zipcode}<br />
                                  <strong>Phone</strong>: {this.state.poaddress.ToVendor.phonenumber}
                                </td>
                              </tr>
                              </table>
                            </td>
                            <td style={{textAlign:'right'}}>
                              <table width="100%" style={{textAlign:'left'}} border="0">
                              <tr>
                                <td>
                                  <h2 style={{backgroundColor:'rgb(78, 205, 196)', color:'white', fontSize:16, padding: 10}}>Billing Address:</h2>
                                  {this.state.poaddress.FromStore.address1}
                                  {this.state.poaddress.FromStore.city},<br />
                                  {this.state.poaddress.FromStore.state},
                                  {this.state.poaddress.FromStore.country}
                                  {this.state.poaddress.FromStore.zipcode}<br />
                                  <strong>Phone</strong>: {this.state.poaddress.FromStore.phonenumber}
                                </td>
                              </tr>
                              </table>

                            </td>
                          </tr>
                          <tr>
                            <td style={{height: 30}}></td>
                            <td style={{height: 30}}></td>
                            </tr>

                          <tr>
                            <td colSpan="2">
                            <table className="table" border="0">
                            <tr style={{backgroundColor:'#556270'}}>
                              <th style={{padding:10, color:'white'}}>SN.</th>
                              <th style={{padding:10, color:'white'}}>Product Name</th>
                              {/* <th style={{padding:10, color:'white'}}>Max Floor Qty</th>
                              <th style={{padding:10, color:'white'}}>On Hand Qty</th> */}
                              <th style={{padding:10, color:'white'}}>Request Qty</th>
                            </tr>
                              {items}
                            </table>
                            </td>
                          </tr>
                        </table>
                        <div style={{textAlign:'center', fontWeight:'bold'}}>This is computer generated purchase order and do not require any stamp or signature</div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </main>
        </DefaultLayout>
        )
    }
}
export default PurchaseOrder;
