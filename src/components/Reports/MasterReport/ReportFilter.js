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

import RevenueType from './RevenueType'

import jsPDF from 'jspdf';

import NumberFormat from 'react-number-format';

class ReportFilter extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			business_days:[],
			businessdays:[],
			errors:{},
			data: [],
			snapShop:[],
			revenueType: [],
			generateReportByDateTime:{
				fromDate:'',
				toDate: '',
				fromStartTime:null,
				fromEndTime:null
			},
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

	handleDatePickerStartDate = (event, date) => {
		delete this.state.errors.fromDate;
        var DatePickedUp = moment(date).format("DD/MM/YYYY");
		this.setState({
			fromDate: DatePickedUp
		})
	}

	handleDatePickerEndDate = (event, date) => {
		delete this.state.errors.toDate;
		var DatePickedUp = moment(date).format("DD/MM/YYYY");
		this.setState({
			toDate: DatePickedUp
		})
	}

	handlefromStartTime = (event, date) => {
		var fromStartTime = moment(date).format('HH:mm:ss');
		this.setState({fromStartTime: fromStartTime})
	}
 	handlefromEndTime = (event, date) => {
 		var fromEndTime = moment(date).format('HH:mm:ss');
 		this.setState({fromEndTime: fromEndTime})
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

	handleBusinessDays = (name, value) => {
		this.setState({
			business_days: value
		})
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
		if (this.state.generateReportByDateTime.fromStartTime === '') {
			errors.fromStartTime = "Please select start time"
		}
		if (this.state.generateReportByDateTime.fromEndTime === '') {
			errors.fromEndTime = "Please select end time"
		}
		this.setState({
		  errors
		}); //Set Errors state

		return Object.keys(errors).length == 0;
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
		reqQuery["businessdayids"] = businessDaysId;

		console.log(JSON.stringify(reqQuery))

            // var revenueType = MasterReport.map(function(o){
			// 	return {
			// 		'revenueType': o.revenuetype,
			// 		'grosssalesforrevtype': o.grosssalesforrevtype,
			// 		'comps': o.comps,
			// 		'promos': o.promos,
			// 		'voids': o.voids,
			// 		'netsalesforrevenuetype': o.netsalesforrevenuetype
			// 	}
			// });

			// this.setState({
			// 	snapShop: MasterReport[0],
			// 	revenueType: revenueType,
			// 	reportTable: true,
			// 	isLoading: false,
			// })
			// console.log(revenueType)

		axios.post(`${process.env.API_HOST}/ReportServices/MasterReport.svc/GetMasterReports/json`, reqQuery)
		.then(function(response){
			var masterFirstObject = response.data.MasterSales[0];

			var paymentSalesTotal = {
				"visatotal": masterFirstObject.visagrat + masterFirstObject.visatotal,
				"mastercardtotal": masterFirstObject.mastergrat + masterFirstObject.mastercardtotal,
				"discovertotal": masterFirstObject.discovergrat + masterFirstObject.discovertotal,
				"amextotal": masterFirstObject.amexgrat + masterFirstObject.amextotal,
				"giftcardtranstotal": masterFirstObject.giftcardtiptotal + masterFirstObject.giftcardtranstotal,
				"otheredctotal": masterFirstObject.otheredcgrat + masterFirstObject.otheredctotal,
				"CashTotal": masterFirstObject.cashtotal + masterFirstObject.cashtotal,
				"TotalChecks": masterFirstObject.TotalChecks + masterFirstObject.TotalChecks,
				"roomchargetotal": masterFirstObject.roomchargetipstotal + masterFirstObject.roomchargetotal,
				"comppaymenttotal": masterFirstObject.comppaymentgratuitytotal + masterFirstObject.comppaymenttotal,
				"othertendertype": masterFirstObject.othertendertypegratuity + masterFirstObject.othertendertype,
				"AccountTotal": masterFirstObject.AccountTotal + masterFirstObject.othertendertype
			}
            console.log(response.data.MasterSales);

			var revenueType = response.data.MasterSales.map(function(o){
				return {
					'revenueType': o.revenuetype,
					'grosssalesforrevtype': o.grosssalesforrevtype,
					'comps': o.comps,
					'promos': o.promos,
					'voids': o.voids,
					'netsalesforrevenuetype': o.netsalesforrevenuetype
				}
            });

			if (response.status >= 400) {
				that.setState({
					isLoading: false,
					reportTable: false
				})
				console.log('response.status.400')
			}else{
				that.setState({
					data: response.data.MasterSales,
					snapShop: response.data.MasterSales[0],
					reportTable: true,
					isLoading: false,
					revenueType: revenueType,
					paymentSalesTotal: paymentSalesTotal
				})
			}
		})
		.catch(function (error) {
	   		console.log("Bad Response");
		});
  	}
	generateReportByDateTimeFunc = () => {
		var that = this;
		//var isValid = this.handleValidation();
		//console.log(isValid)
		//if(isValid){
			this.setState({isLoading: true, reportTable: false})
			const {fromDate, toDate, fromStartTime, fromEndTime} = this.state;
			var reqQuery = {};
			reqQuery['userdetails'] = getUserDetails();
			reqQuery["startdate"] = fromDate + ' ' + fromStartTime;
			reqQuery["enddate"] = toDate + ' ' + fromEndTime;;
			reqQuery["businessdayids"] = [];

			console.log(JSON.stringify(reqQuery))
            // reqQuery = {
            //     "userdetails":{
            //        "username":"mail2azmal@gmail.com",
            //        "password":"123456",
            //        "superadmin":true,
            //        "domainadmin":false,
            //        "storeuser":false,
            //        "domainuniquekey":"59fe20ed-dc61-4fef-9dbc-578fe433ee21",
            //        "storeuniquekey":"4c64cdcb-e30f-4f34-a91d-a7d6002081bb"
            //     },
            //     "startdate":"01/09/2017 11:51:55",
            //     "enddate":"09/10/2017 11:51:59",
            //     "businessdayids":[]
            //  }

			axios.post(`${process.env.API_HOST}/ReportServices/MasterReport.svc/GetMasterReports/json`, reqQuery)
			.then(function(response){
				console.log(response.data);
                var masterFirstObject = response.data.MasterSales[0];

                var paymentSalesTotal = {
                    "visatotal": masterFirstObject.visagrat + masterFirstObject.visatotal,
                    "mastercardtotal": masterFirstObject.mastergrat + masterFirstObject.mastercardtotal,
                    "discovertotal": masterFirstObject.discovergrat + masterFirstObject.discovertotal,
                    "amextotal": masterFirstObject.amexgrat + masterFirstObject.amextotal,
                    "giftcardtranstotal": masterFirstObject.giftcardtiptotal + masterFirstObject.giftcardtranstotal,
                    "otheredctotal": masterFirstObject.otheredcgrat + masterFirstObject.otheredctotal,
                    "CashTotal": masterFirstObject.cashtotal + masterFirstObject.cashtotal,
                    "TotalChecks": masterFirstObject.TotalChecks + masterFirstObject.TotalChecks,
                    "roomchargetotal": masterFirstObject.roomchargetipstotal + masterFirstObject.roomchargetotal,
                    "comppaymenttotal": masterFirstObject.comppaymentgratuitytotal + masterFirstObject.comppaymenttotal,
                    "othertendertype": masterFirstObject.othertendertypegratuity + masterFirstObject.othertendertype,
                    "AccountTotal": masterFirstObject.AccountTotal + masterFirstObject.othertendertype
                }

                // var visatotal = masterFirstObject.visagrat + masterFirstObject.visatotal;
                // var mastercardtotal = masterFirstObject.mastergrat + masterFirstObject.mastercardtotal;
                // var discovertotal = masterFirstObject.discovergrat + masterFirstObject.discovertotal;
                // var amextotal = masterFirstObject.amexgrat + masterFirstObject.amextotal;
                // var giftcardtranstotal = masterFirstObject.giftcardtiptotal + masterFirstObject.giftcardtranstotal;
                // var otheredctotal = masterFirstObject.otheredcgrat + masterFirstObject.otheredctotal;
                // var CashTotal = masterFirstObject.CashTotal + masterFirstObject.CashTotal;
                // var TotalChecks = masterFirstObject.TotalChecks + masterFirstObject.TotalChecks;
                // var roomchargetotal = masterFirstObject.roomchargetipstotal + masterFirstObject.roomchargetotal;
                // var comppaymenttotal = masterFirstObject.comppaymentgratuitytotal + masterFirstObject.comppaymenttotal;
                // var othertendertype = masterFirstObject.othertendertypegratuity + masterFirstObject.othertendertype;
                // var AccountTotal = masterFirstObject.AccountTotal + masterFirstObject.othertendertype;

                //console.log(VisaTotal);


                var revenueType = response.data.MasterSales.map(function(o){
                    return {
                        'revenueType': o.revenuetype,
                        'grosssalesforrevtype': o.grosssalesforrevtype,
                        'comps': o.comps,
                        'promos': o.promos,
                        'voids': o.voids,
                        'netsalesforrevenuetype': o.netsalesforrevenuetype
                    }
                });

                var paymentSales = response.data.MasterSales.map(function(o){
                    return {
                        'revenueType': o.revenuetype,
                        'grosssalesforrevtype': o.grosssalesforrevtype,
                        'comps': o.comps,
                        'promos': o.promos,
                        'voids': o.voids,
                        'netsalesforrevenuetype': o.netsalesforrevenuetype
                    }
                });

				if (response.status >= 400) {
					that.setState({
						isLoading: false,
						reportTable: false
					})
					console.log('response.status.400')
				}else{
					that.setState({
						data: response.data.MasterSales,
						snapShop: response.data.MasterSales[0],
						reportTable: true,
                        isLoading: false,
                        revenueType: revenueType,
                        paymentSalesTotal: paymentSalesTotal
					})
				}
			})
			.catch(function (error) {
		   		console.log("Bad Response");
			});
		//}
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

					pdf.save('MasterReport.pdf');
				}
				})
		}
	render() {
		const {fromStartTime ,fromEndTime} = this.state.generateReportByDateTime;
		const snapshot = this.state.snapShop;
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
		        <div className={classnames('form-group col-lg-2 col-md-6 col-sm-6 recTimepicker', { error: !!this.state.errors.fromStartTime})}>
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
	          	<div className={classnames('form-group col-lg-3 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.toDate})}>
		          <label className="control-label">To Date</label>
		            <div className="datepicker-wrapper">
		              <DatePicker
		                 onChange={this.handleDatePickerEndDate}
		                ref='datePickerEndDate'
		                id="datePickerEndDate"
		                autoOk
		                //container="inline" mode="landscape"
		                onClick={this.openEndDatePicker}
                        className="m-datePicker"
                        textFieldStyle={{'height':'40px'}}
		              />
		            </div>
		            <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
		            <span>{this.state.errors.toDate}</span>
		        </div>
		        <div className={classnames('form-group col-lg-2 col-md-6 col-sm-6 recTimepicker', { error: !!this.state.errors.fromEndTime})}>
		          <label className="control-label">Time</label>
		          <TimePicker
		          format="24hr"
		          hintText=""
		          value={fromEndTime}
		          onChange={this.handlefromEndTime}
                  textFieldStyle={{
                    'width':'100%',
                    'height':'40px'
			       }}
                  className="m-timePicker"
		        />
		        </div>

		        <div className="col-lg-1 col-md-6 col-sm-6" style={{'marginTop': '22px'}}>
					<button className="btn btn-primary" onClick={this.generateReportByDateTimeFunc} style={{'padding': '12px 24px'}}>Generate</button>
		        </div>
		        {/* <div className="col-lg-1 col-md-6 col-sm-6" style={{'marginTop': '22px'}}>
		        	<button className="btn btn-default" onClick={this.generateReportByDateTimeFunc} style={{'padding': '12px 24px'}}>Reset</button>
		        </div> */}
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
			<div style={{'textAlign': 'center', 'margin-bottom':'30px'}}>
					<a id="btnExport"><i className="fa fa-file-excel-o" aria-hidden="true"></i><br />Excel</a>
					<a id="btnExportPdf" onClick={this.makePDF}><i className="fa fa-file-pdf-o" aria-hidden="true"></i><br />PDF</a>
			</div>
			<div id="pdfContainer">
				<div style={{textAlign:'center'}}>
					<h2>MASTER REPORT</h2>
					<h4>From {this.state.fromDate} &nbsp; {this.state.fromStartTime} to {this.state.toDate} &nbsp; {this.state.fromEndTime}</h4>
				</div>
				<table className="display nowrap table table-striped table-hover" style={{border: 0}}>
						<tr>
							<td colSpan="4" style={{
								'background':'rgb(78, 205, 196)',
								'padding': '10px',
								'color':'white',
								'fontSize': '15px'
							}}>
								Snapshot
							</td>
						</tr>
						<tr>
							<td>
								<table className="table child-table">
									<tr>
										<td><strong>Gross Sales:</strong></td>
										<td>{this.state.snapShop.totalsales}</td>
									</tr>
									<tr>
										<td><strong>Net Sales:</strong></td>
										<td>{this.state.snapShop.netsales}</td>
									</tr>
									<tr>
										<td><strong>Total Comps:</strong></td>
										<td>{this.state.snapShop.totalcomps}</td>
									</tr>
									<tr>
										<td><strong>Total Voids:</strong></td>
										<td>{this.state.snapShop.totalvoids}</td>
									</tr>
									<tr>
										<td><strong>Total Promos:</strong></td>
										<td>{this.state.snapShop.totalpromos}</td>
									</tr>
								</table>
							</td>
							<td>
								<table className="table child-table">
									<tr>
										<td><strong>Check Average</strong></td>
										<td>
										<NumberFormat value={this.state.snapShop.totalsales/ this.state.snapShop.perpersonaverage} displayType={'text'} thousandSeparator={true} decimalPrecision={2} />


										</td>
									</tr>
									<tr>
										<td><strong>Order Count:</strong></td>
										<td>{this.state.snapShop.perpersonaverage}</td>
									</tr>
									<tr>
										<td><strong>Comp Count:</strong></td>
										<td>{this.state.snapShop.compcount}</td>
									</tr>
									<tr>
										<td><strong>Void Count:</strong></td>
										<td>{this.state.snapShop.voidcount}</td>
									</tr>
									<tr>
										<td><strong>Promo Count:</strong></td>
										<td>{this.state.snapShop.promocount}</td>
									</tr>
								</table>
							</td>
						</tr>
				</table>
				<table className="display nowrap table table-striped table-hover" id="paymentSales">
						<thead>
						<tr>
							<td colSpan="6" style={{
								'background':'rgb(78, 205, 196)',
								'padding': '10px',
								'color':'white',
								'fontSize': '15px'
							}}>
								Sales Data
							</td>
						</tr>
							<tr>
								<th>Revenue Type</th>
								<th>Gross Sales No Tax</th>
								<th>Comps</th>
								<th>Promos</th>
								<th>Voids</th>
								<th>Net Sales No Tax</th>
							</tr>
						</thead>
						{this.state.revenueType.map((obj, i) => <RevenueType revenueType={obj} key={i}/>)}
						<tfoot>
							<tr className="paymentTotal">
								<td>Total</td>
								<td>{this.state.snapShop.totalsales}</td>
								<td>{this.state.snapShop.totalcomps}</td>
								<td>{this.state.snapShop.totalpromos}</td>
								<td>{this.state.snapShop.totalvoids}</td>
								<td>{this.state.snapShop.netsales}</td>
							</tr>
						</tfoot>
				</table>
				<table className="display nowrap table table-striped table-hover" id="paymentSales">
						<thead>
						<tr>
							<td colSpan="4" style={{
								'background':'rgb(78, 205, 196)',
								'padding': '10px',
								'color':'white',
								'fontSize': '15px'
							}}>
								Payment Sales
							</td>
						</tr>
							<tr>
								<th>Tender</th>
								<th>Tips</th>
								<th>Sale</th>
								<th>Total</th>
							</tr>
						</thead>

						<tr className="paymentSalesCell">
							<td>Visa</td>
							<td>{this.state.snapShop.visagrat}</td>
							<td>{this.state.snapShop.visatotal}</td>
							<td>{this.state.paymentSalesTotal.visatotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>MasterCard</td>
							<td>{this.state.snapShop.mastergrat}</td>
							<td>{this.state.snapShop.mastercardtotal}</td>
							<td>{this.state.paymentSalesTotal.mastercardtotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Discover</td>
							<td>{this.state.snapShop.discovergrat}</td>
							<td>{this.state.snapShop.discovertotal}</td>
							<td>{this.state.paymentSalesTotal.discovertotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>American Express</td>
							<td>{this.state.snapShop.amexgrat}</td>
							<td>{this.state.snapShop.amextotal}</td>
							<td>{this.state.paymentSalesTotal.amextotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Gift Card</td>
							<td>{this.state.snapShop.giftcardtiptotal}</td>
							<td>{this.state.snapShop.giftcardtranstotal}</td>
							<td>{this.state.paymentSalesTotal.giftcardtranstotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Other EDC</td>
							<td>{this.state.snapShop.otheredcgrat}</td>
							<td>{this.state.snapShop.otheredctotal}</td>
							<td>{this.state.paymentSalesTotal.otheredctotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Cash</td>
							<td>N/A</td>
							<td>{this.state.snapShop.cashtotal}</td>
							<td>{this.state.snapShop.cashtotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Check</td>
							<td>N/A</td>
							<td>{this.state.snapShop.TotalChecks}</td>
							<td>{this.state.snapShop.TotalChecks}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Room Charge</td>
							<td>{this.state.snapShop.roomchargetipstotal}</td>
							<td>{this.state.snapShop.roomchargetotal}</td>
							<td>{this.state.paymentSalesTotal.roomchargetotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Comp Pay</td>
							<td>{this.state.snapShop.comppaymentgratuitytotal}</td>
							<td>{this.state.snapShop.comppaymenttotal}</td>
							<td>{this.state.paymentSalesTotal.comppaymenttotal}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Other Tender</td>
							<td>{this.state.snapShop.othertendertypegratuity}</td>
							<td>{this.state.snapShop.othertendertype}</td>
							<td>{this.state.paymentSalesTotal.othertendertype}</td>
						</tr>
						<tr className="paymentSalesCell">
							<td>Account Charge</td>
							<td>N/A</td>
							<td>{this.state.snapShop.accounttotal}</td>
							<td>{this.state.snapShop.accounttotal}</td>
						</tr>
						<tfoot>
							<tr className="paymentTotal">
								<td>Gross Receipts</td>
								<td>{this.state.snapShop.gratuitytotal}</td>
								<td>{this.state.snapShop.paymentstotal}</td>
								<td>{this.state.snapShop.gratuitytotal+this.state.snapShop.paymentstotal}</td>
							</tr>
						</tfoot>
				</table>
				<table className="display nowrap table table-striped table-hover">
					<tr>
						<td width="60%" valign="top" style={{'vertical-align':'top'}}>
							<table className="display nowrap table table-striped table-hover" id="paymentSales">
									<thead>
									<tr>
										<td colSpan="4" style={{
											'background':'rgb(78, 205, 196)',
											'padding': '10px',
											'color':'white',
											'fontSize': '15px'
										}}>
											Taxes
										</td>
									</tr>
										<tr>
											<th>Taxable Sales</th>
											<th>Taxes Collected</th>
										</tr>
									</thead>

									<tr className="paymentSalesCell">
										<td>
											<table>
													<tr>
															<td>Inclusively Taxable Sales:</td>
															<td>&nbsp;&nbsp; {this.state.snapShop.inclusivelytaxable}</td>
													</tr>
													<tr>
															<td>Exclusively Taxable Sales:</td>
															<td>&nbsp;&nbsp; {this.state.snapShop.exclusivelytaxable}</td>
													</tr>
													<tr>
															<td>Tax Exempt Sales:</td>
															<td>&nbsp;&nbsp; {this.state.snapShop.nontaxablesales}</td>
													</tr>
											</table>
									</td>
									<td>
									<table>
									<tr>
											<td>Inclusive Taxes:</td>
											<td>&nbsp;&nbsp; {this.state.snapShop.inclusivetaxes}</td>
									</tr>
									<tr>
											<td>Exclusive Tax:</td>
											<td>&nbsp;&nbsp; {this.state.snapShop.totalexclusivetaxes}</td>
									</tr>
									</table>
									</td>
									</tr>
							</table>
							<table className="display nowrap table table-striped table-hover" id="paymentSales">
									<thead>
									<tr>
										<td colSpan="2" style={{
											'background':'rgb(78, 205, 196)',
											'padding': '10px',
											'color':'white',
											'fontSize': '15px'
										}}>
											Misc. Notes
										</td>
									</tr>
										<tr>
											<th>Type</th>
											<th>Description</th>
										</tr>
									</thead>

									<tr className="paymentSalesCell">
										<td>Cash Over/Short:</td>
										<td>{this.state.snapShop.cashoverage}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>Check Over/Short:</td>
										<td>{this.state.snapShop.checkaverage}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>Weather:</td>
										<td>{this.state.snapShop.weather}</td>
									</tr>
							</table>
						</td>
						<td width="40%" style={{'verticalAlign': 'text-top'}}>
							<table className="display nowrap table table-striped table-hover" id="paymentSales">
									<thead>
									<tr>
										<td colSpan="4" style={{
											'background':'rgb(78, 205, 196)',
											'padding': '10px',
											'color':'white',
											'fontSize': '15px'
										}}>
											Checkout Summary
										</td>
									</tr>
									</thead>

									<tr className="paymentSalesCell">
										<td>+Total Sales:</td>
										<td>{this.state.snapShop.totalsales}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Exclusive Tax:</td>
										<td>{this.state.snapShop.totalexclusivetaxes}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Day's Cash Start:</td>
										<td>{this.state.snapShop.daycashstart}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Paid In:</td>
										<td>{this.state.snapShop.totalpaidin}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Credit Card Tips:</td>
										<td>{this.state.snapShop.alledccreditcardtiptotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Gift Card Tips:</td>
										<td>{this.state.snapShop.giftcardtiptotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Tips:</td>
										<td>{this.state.snapShop.roomchargetotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Auto Gratuity:</td>
										<td>{this.state.snapShop.autogratuitytotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Comp Tender Tips:</td>
										<td>{this.state.snapShop.comppaymenttotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>+Other Tender Tips:</td>
										<td>{this.state.snapShop.othertendertype}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Total Discounts:</td>
										<td>{this.state.snapShop.totaldiscounts}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Credit Tenders:</td>
										<td>{this.state.snapShop.alledctendertotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Check Tenders:</td>
										<td>{this.state.snapShop.totalchecks}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Overall Discounts:</td>
										<td>{this.state.snapShop.overalldiscount}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Account Tenders:</td>
										<td>{this.state.snapShop.accounttotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Other Tenders:</td>
										<td>{this.state.snapShop.othertendertype}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Gift Tenders:</td>
										<td>{this.state.snapShop.giftcardtranstotal}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Paid Out:</td>
										<td>{this.state.snapShop.totalpaidout}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>Cash Due:</td>
										<td>{this.state.snapShop.totalduehouse}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>Checks Due:</td>
										<td>{this.state.snapShop.totalchecks}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td><strong>Total Due:</strong></td>
										<td>{this.state.snapShop.totalduehouse}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td><strong>Total Owed:</strong></td>
										<td>{this.state.snapShop.totalowed}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Cash Deposits:</td>
										<td>{this.state.snapShop.cashdeposits}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td>-Check Deposits:</td>
										<td>{this.state.snapShop.checkdeposits}</td>
									</tr>
									<tr className="paymentSalesCell">
										<td><strong>Amount Short:</strong></td>
										<td>{this.state.snapShop.Short}</td>
									</tr>
							</table>
						</td>
					</tr>
				</table>
				</div>
			</div>}
			</div>
		)
	}
}
export default ReportFilter;