import React from 'react';

global.$ = require('jquery');

import moment from 'moment';

import Select from 'react-select';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import DatePicker from 'material-ui/DatePicker';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Tab from 'react-bootstrap/lib/Tab';

import Tabs from 'react-bootstrap/lib/Tabs';

import TimePicker from 'material-ui/TimePicker';

import classnames from 'classnames';

import getUserDetails from '../../common/CredentialDomain';

import axios from 'axios';

import Spinner from '../../common/spinner';

import multiselect from 'bootstrap-multiselect/dist/js/bootstrap-multiselect';

import jsPDF from 'jspdf';

import NumberFormat from 'react-number-format';


class ProfitAndLossMain extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			business_days:[],
			businessdays:[],
			errors:{},
			data: [],
			snapShop:[],
			isLoading: false,
			reportTable: false
		}
	}
	componentDidMount = () => {
		this.getBusinessDays();

		$(document).ready(function() {
			$('.SalesByReport__Item').click(function(){
				$(this).addClass('current').siblings().removeClass('current');
				//console.log($(this))
			  //$('li.SalesByReport__Item').removeClass('isActive');
			  //$(this).addClass('isActive');
			});
		  $(document).on("click", "#btnExport", function(e){
			  e.preventDefault();
			  //getting data from our table
			  var data_type = 'data:application/vnd.ms-excel';
			  var table_div = document.getElementById('pdfContainer');
			  var table_html = table_div.outerHTML.replace(/ /g, '%20');

			  var a = document.createElement('a');
			  a.href = data_type + ', ' + table_html;
			  a.download = 'masterReport_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
			  a.click();
		  });
	  });

	}





	getBusinessDays = () => {
		var that = this;
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();

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

	getStoreDetails = (item) => {
		var that = this;
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();

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

  	generateReportByBusinessDayFunc = () => {
  		var that = this;
  		this.setState({isLoading: true, reportTable: false})

		var business_days = this.state.business_days;
		var businessDaysId = business_days.map(function(o){
			//return {BusinessdayId:o.id}
			return o.id
		})

		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();
		reqQuery["fromdate"] = "";
		reqQuery["todate"] = "";
		reqQuery["bussinessdayids"] = businessDaysId;

		console.log(JSON.stringify(reqQuery))

		axios.post(`${process.env.API_HOST}/ReportServices/GetProfitnLossReport.svc/ProfitnLossReport/json`, reqQuery)
		.then(function(response){

			console.log(response)
			var masterObject = response.data.profitnlossreport;
			var masterFirstObject = response.data.profitnlossreport.Crprofitnlossreportlist;
			var masterSecondObject = response.data.profitnlossreport.Drprofitnlossreportlist;

			console.log(masterObject)
			console.log(masterFirstObject)
			console.log(masterSecondObject)

			if (response.status >= 400) {
				that.setState({
					isLoading: false,
					reportTable: false
				})
				console.log('response.status.400')
			}else{
				that.setState({
					data: response.data.profitnlossreport,
					snapShop: response.data.profitnlossreport,
					reportTable: true,
					isLoading: false,
				})
			}
		})
		.catch(function (error) {
	   		console.log("Bad Response");
		});
  	}

	handleDatePickerStartDate = (event, date) => {
		delete this.state.errors.fromDate;
        var DatePickedUp = moment(date).format("DD/MM/YYYY HH:mm:ss");
		this.setState({
			fromDate: DatePickedUp
		})
	}

	handleDatePickerEndDate = (event, date) => {
		delete this.state.errors.toDate;
		var DatePickedUp = moment(date).format("DD/MM/YYYY HH:mm:ss");
		this.setState({
			toDate: DatePickedUp
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

  	generateReportByDateTimeFunc = () => {
  		var that = this;
  		this.setState({isLoading: true, reportTable: false})
		const {fromDate, toDate} = this.state;
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();
		reqQuery["fromdate"] = fromDate;
    	reqQuery["enddate"] = toDate;
    	console.log(reqQuery["fromdate"])
    	console.log(reqQuery["enddate"])
		reqQuery["bussinessdayids"] = "";

		console.log(JSON.stringify(reqQuery))

		axios.post(`${process.env.API_HOST}/ReportServices/GetProfitnLossReport.svc/ProfitnLossReport/json`, reqQuery)
		.then(function(response){

			console.log(response)
			var masterObject = response.data.profitnlossreport;
			var masterFirstObject = response.data.profitnlossreport.Crprofitnlossreportlist;
			var masterSecondObject = response.data.profitnlossreport.Drprofitnlossreportlist;

			console.log(masterObject)
			console.log(masterFirstObject)
			console.log(masterSecondObject)

			if (response.status >= 400) {
				that.setState({
					isLoading: false,
					reportTable: false
				})
				console.log('response.status.400')
			}else{
				that.setState({
					data: response.data.profitnlossreport,
					snapShop: response.data.profitnlossreport,
					reportTable: true,
					isLoading: false,
				})
			}
		})
		.catch(function (error) {
	   		console.log("Bad Response");
		});
  	}

	generateReport = () => {
		console.log(this.state.business_days);
	}

  	handleValidation = () => {
		let errors = {};
		if (this.state.report_type.value === null || this.state.report_type.value == '') {
			errors.report_type = "Please select Sales Report By"
		}
		if (this.state.generateReportByDateTime.fromDate === '') {
			errors.fromDate = "Please select start date"
		}
		if (this.state.generateReportByDateTime.toDate === '') {
			errors.toDate = "Please select end date"
		}
		this.setState({
		  errors
		}); //Set Errors state

		return Object.keys(errors).length == 0;
  	}



	makePDF() {
			var quotes = document.getElementById('pdfContainer');
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
						//pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight );
						pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight,'','FAST');

					} else {
						while(leftHeight > 0) {
							pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight,'','FAST');

							//pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight)
							leftHeight -= pageHeight;
							position -= 841.89;
							//avoid blank page
							if(leftHeight > 0) {
								pdf.addPage();
								//footer()
							}
						}
					}

					pdf.save('ProfitAndLoss Report.pdf');
				}
				})
		}


	render() {

		var currentDomain = window.sessionStorage.getItem("currentdomainname");
        var currentStore = window.sessionStorage.getItem("currentstorename");

		const snapshot = this.state.snapShop;
		var today = new Date();

		console.log(this.state)
		if(this.state.businessdays != undefined){
			var businessdaysOptions = this.state.businessdays.map(function(o){
				return {
					label: o.businessdaydatestamp +' / '+ o.checkoutdatestamp,
					value: o.businessdaydatestamp +' / '+ o.checkoutdatestamp,
					id: o.id
				}
			})
		}



		if(this.state.snapShop.Crprofitnlossreportlist === undefined) this.state.snapShop.Crprofitnlossreportlist = [];
		var j= 1 ;
		const items = this.state.snapShop.Crprofitnlossreportlist.map((item,i)=>{
			return(
				<tbody key={i} >
					<tr className="paymentSalesCell">
						<td style={{backgroundColor:'#dcf3ee',border:'1px solid white',}}>{j++}</td>
						<td style={{backgroundColor:'#e8e7e3',border:'1px solid white',}}>{item.CrDesc}</td>
						<td style={{backgroundColor:'#dcf3ee',border:'1px solid white',}}>{item.CrAmt}</td>
						<td style={{backgroundColor:'#e8e7e3',border:'1px solid white',}}></td>
					</tr>
				</tbody>
			)
		})

		if(this.state.snapShop.Drprofitnlossreportlist === undefined) this.state.snapShop.Drprofitnlossreportlist = [];
		var j= 1 ;
		const items1 = this.state.snapShop.Drprofitnlossreportlist.map((item)=>{
			return(
				<tbody>
					<tr className="paymentSalesCell">
						<td style={{backgroundColor:'#dcf3ee',border:'1px solid white',}}>{j++}</td>
						<td style={{backgroundColor:'#e8e7e3',border:'1px solid white',}}>{item.DrDesc}</td>
						<td style={{backgroundColor:'#dcf3ee',border:'1px solid white',}}>{item.DrAmt}</td>
						<td style={{backgroundColor:'#e8e7e3',border:'1px solid white',}}></td>
					</tr>
				</tbody>
			)
		})

		//console.log(this.state.snapShop.Crprofitnlossreportlist);

		return(
			<div className="header masterReport">

			{this.state.isLoading && <Spinner />}
	          <Tabs id="sales-report" className="byBusinessDays">
			    <Tab eventKey={1} title="Date Range">
				<MuiThemeProvider>
	          	<div className="row">
	          	<div className={classnames('form-group col-lg-3 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.fromDate})}>
		          <label className="control-label">From Date</label>
		            <div className="datepicker-wrapper">
		              <DatePicker
		              	id="datePickerStartDate"
		                ref='datePickerStartDate'
		                autoOk
		                formatDate={(date) => moment(date).format('DD-MM-YYYY')}
		                //container="inline" mode="landscape"
		                onChange={this.handleDatePickerStartDate}
		                onClick={this.openStartDatePicker}
                        className="m-datePicker"
                        textFieldStyle={{'height':'40px'}}
		              />
		            </div>
		            <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
		        	<span className="clearfix" style={{'display':'block'}}>{this.state.errors.fromDate}</span>
		        </div>
	          	<div className={classnames('form-group col-lg-3 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.toDate})}>
		          <label className="control-label">To Date</label>
		            <div className="datepicker-wrapper">
		              <DatePicker
		                 onChange={this.handleDatePickerEndDate}
		                ref='datePickerEndDate'
		                id="datePickerEndDate"
		                autoOk
		                formatDate={(date) => moment(date).format('DD-MM-YYYY')}
		                //container="inline" mode="landscape"
		                onClick={this.openEndDatePicker}
                        className="m-datePicker"
                        textFieldStyle={{'height':'40px'}}
		              />
		            </div>
		            <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
		            <span>{this.state.errors.toDate}</span>
		        </div>

		        <div className="col-lg-1 col-md-6 col-sm-6" style={{'marginTop': '22px'}}>
					<button className="btn btn-primary" onClick={this.generateReportByDateTimeFunc} style={{'padding': '12px 24px'}}>Generate</button>
		        </div>
				</div>
			    </MuiThemeProvider>
			    </Tab>
			    <Tab eventKey={2} title="Business Days">
	    		<div className="row">
			        <div className={classnames('form-group filter col-md-4', { error: !!this.state.errors.business_days})}>
				        <div className="row1">
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
			        </div>
		            <div className="form-group col-md-1">
		            	<button className="btn btn-primary" style={{'padding': '12px 24px','marginTop': '26px'}} onClick={this.generateReportByBusinessDayFunc}>Generate</button>
		            </div>
				</div>
			    </Tab>
			</Tabs>

			{this.state.reportTable &&
			<div>
			<div style={{'textAlign': 'center', 'marginBottom':'30px'}}>
					<a id="btnExport"><i className="fa fa-file-excel-o" aria-hidden="true"></i><br />Excel</a>
					<a id="btnExportPdf" onClick={this.makePDF}><i className="fa fa-file-pdf-o" aria-hidden="true"></i><br />PDF</a>
			</div>
			<div id="pdfContainer">
				<div style={{textAlign:'center'}}>
					<h2>Welcome to {currentStore}</h2>
					<h2>Profit And Loss Report</h2>
					<h4>For the Period Ended {moment(today).format('YYYY')}</h4>
				</div>
				<table className="display nowrap table  table-hover" id="paymentSales">
						<thead>
							<tr style={{border:'1px solid white'}}>
								<th style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>SL No.</th>
								<th style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Income</th>
								<th style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Amount</th>
								<th style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Amount</th>
							</tr>
						</thead>

							{items}

						<tr style={{backgroundColor:'#E0FFE0'}}>
							<td style={{height:40,border:'1px solid white', }}>
							</td>
							<td style={{height:40,border:'1px solid white',}}>
							</td>
							<td style={{height:40,border:'1px solid white',}}>
							</td>
							<td style={{height:40,border:'1px solid white',}}>
							</td>
						</tr>

							<tr className="paymentTotal" >
								<td style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Total Income</td>
								<td style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}></td>
								<td style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>{this.state.snapShop.creditamount}</td>
								<td style={{
									'background':'rgb(78, 205, 196)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}></td>
							</tr>
						<thead>
							<tr>
								<th style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>SL No.</th>
								<th style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Expense</th>
								<th style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Amount</th>
								<th style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Amount</th>
							</tr>
						</thead>

							{items1}

							<tr style={{backgroundColor:'#E0FFE0'}}>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
							</tr>

							<tr className="paymentTotal" >
								<td
								style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Total Expenses</td>
								<td style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}></td>
								<td style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>{this.state.snapShop.debitamount}</td>
								<td style={{
									'background':'rgb(93, 96, 96)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}></td>
							</tr>

							<tr style={{backgroundColor:'#E0FFE0'}}>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
								<td style={{height:40,border:'1px solid white',}}>
								</td>
							</tr>
						<tfoot>
							<tr className="paymentTotal">
								<td style={{
									'background':'rgb(64, 170, 22)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>Profit & Loss</td>
								<td style={{
									'background':'rgb(64, 170, 22)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}></td>
								<td style={{
									'background':'rgb(64, 170, 22)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}>{this.state.snapShop.differenceamount}</td>
								<td style={{
									'background':'rgb(64, 170, 22)',
									border:'1px solid white',
									'color':'white',
									'fontSize': '15px'
								}}></td>
							</tr>
						</tfoot>
				</table>
				</div>
			</div>}
			</div>
		)
	}
}
export default ProfitAndLossMain;
