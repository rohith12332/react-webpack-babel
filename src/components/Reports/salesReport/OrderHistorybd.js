import React, {Component, PropTypes} from 'react';

import moment from 'moment';

import Select from 'react-select';

import classnames from 'classnames';

import getUserDetails from '../../common/CredentialDomain';

import axios from 'axios';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import DatePicker from 'material-ui/DatePicker';

import injectTapEventPlugin from 'react-tap-event-plugin';

import TableSpinner from '../../common/TableSpinner';

import Tab from 'react-bootstrap/lib/Tab';

import Tabs from 'react-bootstrap/lib/Tabs';

import TimePicker from 'material-ui/TimePicker';

global.$ = require('jquery');


class OrderHistorybd extends Component{
 constructor(props) {
   super(props);
   this.state={
     data:[],
     business_days:[],
     businessdays:[],
     OrderHistoryReport:[],
     isLoading: false,
     businessTable: false,
     errors:{},
     generateReportByDateTime:{
       fromDate:'',
       toDate: '',
       fromStartTime:null,
       fromEndTime:null
     }
   }
 }

 componentDidMount() {
   var self = this;
   var that = this;
   this.OrdersHistoryReportBasedOnBD();
   this.getBusinessDays();

   $(document).ready(function() {
     $('#businessTable').dataTable({
       "order": [[ 0, "desc" ]],
       "bAutoWidth": false,
       "paging": true,
       "bDestroy": true,
       dom: 'Bfrtip',
           buttons: ['excel', 'pdf'],
/*				"fnDrawCallback": function() {
         that.forceUpdate();
       },*/
     });
     $('body').find("#businessTable").wrap("<div>");
   });
 }

 OrdersHistoryReportBasedOnBD = () => {
   var that = this;
   this.setState({isLoading: true})
   var reqQuery = {};
   reqQuery['userdetails'] = getUserDetails();
   reqQuery['typeoffiltersearch'] = '0';
   reqQuery["fromdate"] = "";
   reqQuery["todate"] = "";
   reqQuery["businessdayids"] = [];

   //console.log(JSON.stringify(reqQuery));
   axios.post(`${process.env.API_HOST}/ReportServices/GetOrderHistoryReport.svc/OrdersHistoryReportBasedOnBD/json`, reqQuery)
   .then(function(response){
     //console.log(response);
     var totalordersum = response.data.totalordersum;
/*			response.data.orderhistoryreportlist.push({
       billno:"",
       dateandtime:"",
       isorderdeleted:"",
       isvoiddone:"",
       noofitems:"Total",
       orderno: "",
       paymenttype: "",
       status: "",
       timestamp:"",
       total:totalordersum,
       type: ""
     });*/
/*			response.data.orderhistoryreportlist.sort(function(a, b){
       return a.dateandtime - b.dateandtime;
     })*/
     response.data.orderhistoryreportlist.reverse();
     //console.log(response.data.orderhistoryreportlist);
     //return false;

     if (response.status >= 400) {
       console.log('response.status.400')
     }else{
       if(response.data.orderhistoryreportlist == null) response.data.orderhistoryreportlist = [];
       that.setState({
         OrderHistoryReport:response.data.orderhistoryreportlist,
         businessTable: true,
         isLoading: false
       })

/*				$('#businessTable').dataTable({
         // "responsive": {
         // 	details: {
         // 		display: $.fn.dataTable.Responsive.display.childRowImmediate,
         // 		type: ''
         // 	}
         // },
         "order": [[ 0, "desc" ]],
         "bAutoWidth": false,
         "paging": true,
         "bDestroy": true,
         dom: 'Bfrtip',
             buttons: [
             {
                  extend: 'pdf',
                  footer: true
              },
              {
                  extend: 'excel',
                  footer: true
              }
           ],
         "fnDrawCallback": function() {
           that.forceUpdate();
         },
         "footerCallback": function ( row, data, start, end, display ) {
           var api = this.api(), data;
                 // Remove the formatting to get integer data for summation
                 var intVal = function ( i ) {
                     return typeof i === 'string' ?
                         i.replace(/[\$,]/g, '')*1 :
                         typeof i === 'number' ?
                             i : 0;
                 };
                 console.log(api.column(3).data().sum());
                 var total2 = api.column(3).data().sum();
           $(api.column(3).footer()).html(total2);
             }
       });
     //$('#businessTable').wrap('<div></div>');
     //$('body').find("#businessTable").css('background','green');
     $('body').find("#businessTable").wrap("<div>");*/
     }
   }).catch(function (error) {
       console.log("Bad Response");
   });
 }

 generateReport = () => {
   var that = this;
   this.setState({
     isLoading: true,
     businessTable: false
   })
   $("#businessTable").dataTable().fnDestroy();
   var business_days = this.state.business_days;
   var businessDaysId = business_days.map(function(o){
     //return {BusinessdayId:o.id}
     return o.id
   })
   //console.log(businessDaysId);
   var reqQuery = {};
   reqQuery['userdetails'] = getUserDetails();
   reqQuery['typeoffiltersearch'] = '1';
   reqQuery["fromdate"] = "";
   reqQuery["todate"] = "";
   reqQuery["businessdayids"] = businessDaysId;

   console.log(JSON.stringify(reqQuery));
   axios.post(`${process.env.API_HOST}/ReportServices/GetOrderHistoryReport.svc/OrdersHistoryReportBasedOnBD/json`, reqQuery)
   .then(function(response){
     console.log(response.data.orderhistoryreportlist);
     if (response.status >= 400) {
       console.log('response.status.400')
     }else{
       if(response.data.orderhistoryreportlist == null) response.data.orderhistoryreportlist = [];
       that.setState({
         OrderHistoryReport:response.data.orderhistoryreportlist,
         businessTable: true,
         isLoading: false
       })
/*				$(document).ready(function() {
         $('#businessTable').dataTable({
           "order": [[ 0, "desc" ]],
           "bAutoWidth": false,
           "paging": true,
           "bDestroy": true,
           dom: 'Bfrtip',
               buttons: ['excel', 'pdf'],
           "fnDrawCallback": function() {
             that.forceUpdate();
           },
         });
         $('body').find("#businessTable").wrap("<div>");
       });*/
     }
   }).catch(function (error) {
       console.log("Bad Response");
   });
 }

 generateReportByDateTime = () => {
   var that = this;
   this.setState({
     isLoading: true,
     businessTable: false
   })
   $("#businessTable").dataTable().fnDestroy();
   const {startDate, endDate, fromStartTime, fromEndTime} = this.state;
   var reqQuery = {};
   reqQuery['userdetails'] = getUserDetails();
   reqQuery['typeoffiltersearch'] = '2';
   reqQuery["fromdate"] = startDate + ' ' + fromStartTime;
   reqQuery["todate"] = endDate + ' ' + fromEndTime;
   reqQuery["businessdayids"] = [];
   console.log(JSON.stringify(reqQuery));

   axios.post(`${process.env.API_HOST}/ReportServices/GetOrderHistoryReport.svc/OrdersHistoryReportBasedOnBD/json`, reqQuery)
   .then(function(response){
     //console.log(response);
     if (response.status >= 400) {
       console.log('response.status.400')
     }else{
       if(response.data.orderhistoryreportlist == null) response.data.orderhistoryreportlist = [];
       that.setState({
         OrderHistoryReport:response.data.orderhistoryreportlist,
         businessTable: true,
         isLoading: false
       })
/*				$(document).ready(function() {
         $('#businessTable').dataTable({
           "bAutoWidth": false,
           "order": [[ 0, "desc" ]],
           "paging": true,
           "bDestroy": true,
           dom: 'Bfrtip',
               buttons: ['excel', 'pdf'],
           "fnDrawCallback": function() {
             that.forceUpdate();
           },
         });
         $('body').find("#businessTable").wrap("<div>");
       });*/
     }
   }).catch(function (error) {
       console.log("Bad Response");
   });
 }

 handlefromStartTime = (event, date) => {
   var fromStartTime = moment(date).format('HH:mm:ss');
     this.setState({fromStartTime: fromStartTime})
   }

   handlefromEndTime = (event, date) => {
   var fromEndTime = moment(date).format('HH:mm:ss');
     this.setState({fromEndTime: fromEndTime})
   }
 handleDatePickerStartDate = (event, date) => {
   delete this.state.errors.startDate;
   var DatePickedUp = moment(date).format("DD/MM/YYYY");
   this.setState({
     startDate: DatePickedUp
   })
 }

 handleDatePickerEndDate = (event, date) => {
   delete this.state.errors.endDate;
   var DatePickedUp = moment(date).format("DD/MM/YYYY");
   this.setState({
     endDate: DatePickedUp
   })
 }

 openDatePickerDay = () => {
   this.refs.datePickerDay.focus();
 }

 openStartDatePicker = () => {
     this.refs.datePickerStartDate.focus();
   }

 openEndDatePicker = () => {
     this.refs.datePickerEndDate.focus();
   }


 getBusinessDays = () => {
   var that = this;
   var reqQuery = {};
   reqQuery['userdetails'] = getUserDetails();
   //console.log(JSON.stringify(reqQuery))

   axios.post(`${process.env.API_HOST}/ManageBusinessday.svc/GetAllBusinessDays/json`, reqQuery)
   .then(function(response){
     if (response.status >= 400) {
       console.log('response.status.400')
     }else{
       that.setState({
         businessdays: response.data.BussinessDayList
       })
     }
   }).catch(function (error) {
       console.log("Bad Response");
   });
 }

 handleBusinessDays = (name, value) => {
   this.setState({
     business_days: value
   })
 }


 render(){
   //console.log(this.state)
   const {fromStartTime ,fromEndTime} = this.state.generateReportByDateTime;

   if(this.state.businessdays != undefined){
     var businessdaysOptions = this.state.businessdays.map(function(o){
       return {
         label: o.businessdaydatestamp +' / '+ o.checkoutdatestamp,
         value: o.businessdaydatestamp +' / '+ o.checkoutdatestamp,
         id: o.id
       }
     })
   }

   //console.log(typeof(this.state.OrderHistoryReport));
   var reportData = this.state.OrderHistoryReport.reverse();
   //console.log(reportData)
   //var that = this;
   $(document).ready(function() {
         $('#businessTable').dataTable({
           "bAutoWidth": false,
           "order": [[ 0, "desc" ]],
           "paging": true,
           "bDestroy": true,
           dom: 'Bfrtip',
               buttons: ['excel', 'pdf'],
/*						"fnDrawCallback": function() {
             this.forceUpdate();
           },*/
         });
         $('body').find("#businessTable").wrap("<div>");
       });


   if(reportData == undefined) return false;
   var items = reportData.map(function(item, i){
     var itemStatus;

     if(item.status == 'Completed'){
       itemStatus = true
     }
     else{
       itemStatus = false
     }
     //console.log(item)
     return(
            <tr className="odd" key={i}>
               <td>{item.dateandtime}</td>
               <td>{item.billno}</td>
               <td className="">{item.noofitems}</td>
               <td className="">{item.total}</td>
               <td className="">{item.paymenttype}</td>
               <td className="">{item.timestamp}</td>
               {itemStatus && <td className=""><span className="label label-confirm">{item.status}</span></td>}
               {!itemStatus && <td className=""><span className="label label-pending">{item.status}</span></td>}
            </tr>
     )
   })

   return(
       <div className="">
{/*		    <div className="widget-head">
            <div className="title">Order Received</div>
         </div>*/}
         {/*<button onClick={this.FilterDataTable}>Daily</button>*/}
         <Tabs id="sales-report" className="byBusinessDays">
       <Tab eventKey={1} title="Date Range">
     <MuiThemeProvider>
           <div className="row">
           <div className={classnames('form-group col-lg-3 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.startDate})}>
           <label className="control-label">From Date</label>
             <div className="datepicker-wrapper">
               <DatePicker
                 id="datePickerStartDate"
                 ref='datePickerStartDate'
                 //container="inline"
         //mode="landscape"
         formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                 onChange={this.handleDatePickerStartDate}
                 onClick={this.openStartDatePicker}
         className="m-datePicker"
         textFieldStyle={{'height':'40px'}}
               />
             </div>
             <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
           <span>{this.state.errors.startDate}</span>
         </div>
         <div className={classnames('form-group col-lg-2 col-md-6 col-sm-6 recTimepicker', { error: !!this.state.errors.endDate})}>
           <label className="control-label">Time</label>
           <TimePicker
           format="24hr"
           hintText=""
           value={fromStartTime}
           onChange={this.handlefromStartTime}
           textFieldStyle={{
         'width':'100%',
         'height':'40px'
       }}
       className="m-timePicker"
         />
         </div>
           <div className={classnames('form-group col-lg-3 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.endDate})}>
           <label className="control-label">To Date</label>
             <div className="datepicker-wrapper">
               <DatePicker
                  onChange={this.handleDatePickerEndDate}
                 ref='datePickerEndDate'
                 id="datePickerEndDate"
                 formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                 //container="inline" mode="landscape"
                 onClick={this.openEndDatePicker}
         className="m-datePicker"
         textFieldStyle={{'height':'40px'}}
               />
             </div>
             <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
             <span>{this.state.errors.endDate}</span>
         </div>
         <div className={classnames('form-group col-lg-2 col-md-6 col-sm-6 recTimepicker', { error: !!this.state.errors.endDate})}>
           <label className="control-label">Time</label>
           <TimePicker
           format="24hr"
           hintText=""
           value={fromEndTime}
           onChange={this.handlefromEndTime}
           textFieldStyle={{'width':'100%'}}
       className="m-timePicker"
       textFieldStyle={{'height':'40px'}}
         />
         </div>

         <div className="col-md-2 col-sm-6" style={{'marginTop': '22px'}}>
           <button className="btn btn-primary" onClick={this.generateReportByDateTime} style={{'padding': '12px 24px'}}>Generate</button>
         </div>

     </div>
     </MuiThemeProvider>
       </Tab>
       <Tab eventKey={2} title="Business Days">
         <div className="row">
           <div className={classnames('form-group filter col-md-10', { error: !!this.state.errors.business_days})}>
             <label>Select Businessdays</label>
             <Select
               name="businessDays"
               value={this.state.business_days}
               options={businessdaysOptions}
               onChange={this.handleBusinessDays.bind(this, 'businessDays')}
               multi={true}
             />
             <span>{this.state.errors.business_days}</span>
             </div>
             <div className="form-group col-md-1">
               <button className="btn btn-primary" style={{'padding': '12px 24px','marginTop': '26px'}} onClick={this.generateReport}>Generate</button>
             </div>
             </div>
       </Tab>
   </Tabs>

         <div className="dashbord-table">
       {this.state.isLoading && <TableSpinner />}
       {this.state.businessTable &&
     <table id="businessTable" className="display nowrap table table-striped table-hover table-fw-widget">
     <thead>
        <tr>
           <th>Transaction Date</th>
           <th>Order No</th>
           <th>Total Items</th>
           <th>Total Amount</th>
           <th>Payment Mode</th>
           <th>Transaction Time</th>
           <th>Status</th>
        </tr>
     </thead>
     <tfoot>
         <tr>
             <th></th>
             <th></th>
             <th>Total:</th>
             <th></th>
             <th></th>
             <th></th>
             <th></th>
         </tr>
     </tfoot>
     <tbody>
     {items}
     </tbody>
     </table>
   }
         </div>
       </div>
   )
 }
}
export default OrderHistorybd;
