import React, {Component} from 'react';

import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import DatePicker from 'material-ui/DatePicker';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Chart from 'chart.js'

import Select from 'react-select';

import getUserDetails from '../../common/CredentialDomain';

import axios from 'axios';

import ReportBinChild from './ReportBinChild';

import NumberFormat from 'react-number-format';

import jsPDF from 'jspdf';

import classnames from 'classnames';

import Spinner from '../../common/spinner';

import OrderHistorybd from './OrderHistorybd';


injectTapEventPlugin()

class ReportBin extends Component {
constructor(props) {
		super(props);
		this.state = {
			report_type: {
              label: '',
              value: ''
     		},
     		reportTable: false,
     		bydate:"",
     		startDate:"",
     		endDate:"",
     		showByDate: false,
     		showByDateRange: false,
     		ReportBin:[],
     		storeInfo:[],
     		totalInfo:[],
     		isLoading: false,
     		errors:{}
		}
	}
	componentDidMount = () => {
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
			    var table_div = document.getElementById('reportbyTypeContainer');
			    var table_html = table_div.outerHTML.replace(/ /g, '%20');

			    var a = document.createElement('a');
			    a.href = data_type + ', ' + table_html;
			    a.download = 'exported_table_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
			    a.click();
			});
/*			$(document).on("click", "#btnExportPdf", function(e){
			    e.preventDefault();

			    //getting data from our table
			    var data_type = 'data:application/pdf';
			    var table_div = document.getElementById('reportbyTypeContainer');
			   var table_html = table_div.outerHTML.replace(/ /g, '%20');

			    var a = document.createElement('a');
			    a.href = data_type ;
			    a.download = 'exported_table_' + Math.floor((Math.random() * 9999999) + 1000000) + '.pdf';
			    a.click();
			});	*/
		});
	}

	updateSalesType = (element) => {
	  delete this.state.errors.report_type;
      this.setState({
          report_type: element
      });
	}

	handleDatePickerDay = (event, date) => {
		var DatePickedUp = moment(date).format("DD/MM/YYYY");
		this.setState({
			bydate: DatePickedUp
		})
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

  	handleRadioCheck = (e) => {
  		console.log(e.target.innerHTML)
  	}

  	showByDate = () => {
  		this.setState({
  			showByDate: true,
  			showByDateRange: false
  		})
  	}

  	showByDateRange = (e) => {
        e.preventDefault();
  		this.setState({
  			showByDate: false,
  			showByDateRange: true
  		})
  	}
	ReportBin = (e) => {
        e.preventDefault();
		var that = this;
        var isValid = this.handleValidation();
        if(isValid) {
		    this.setState({isLoading: true, reportTable: false})
			var reqQuery = {};
			reqQuery["businessdays"] = [];
			reqQuery["startdate"]= this.state.startDate;
			reqQuery["enddate"]= this.state.endDate;
			reqQuery["saletype"]= this.state.report_type.value;
			reqQuery['userdetails'] = getUserDetails();
			console.log(JSON.stringify(reqQuery))

			axios.post(`${process.env.API_HOST}/ReportServices/GetSalesReport.svc/GetSalesReports/json`, reqQuery)
			.then(function(response){
				if (response.status >= 400) {
					console.log('response.status.400')
				}else{
	  				var storeInfo = response.data.SalesReport[Object.keys(response.data.SalesReport)[0]];
	  				var totalInfo = response.data.SalesReport[Object.keys(response.data.SalesReport)[0]];
					that.setState({
						isLoading: false,
						ReportBin:response.data.SalesReport,
						storeInfo:storeInfo,
						totalInfo:totalInfo,
						reportTable: true
					})
				}
			}).catch(function (error) {
		   		console.log("Bad Response");
			});
		}
	}
    ReportReset = (e) => {
        e.preventDefault();

        this.setState({
            report_type: {
              label: '',
              value: ''
            },
            startDate:'',
            endDate: '',
            reportTable: false,
            showByDateRange: false
        })
    }

    makePDF() {
    	var quotes = document.getElementById('reportbyTypeContainer');
		html2canvas(quotes, {
			onrendered: function(canvas) {
				var pdf = new jsPDF('p', 'pt', 'a4');
				var options = {
					pagesplit: true
				};
				pdf.addHTML($(".pdf-wrapper"), options, function()
				{
					pdf.save("test.pdf");
				});
			}
		});
	}
	generatePDF = () => {
/*		var l = {
         orientation: 'l',
         unit: 'mm',
         format: 'a4',
         compress: true,
         fontSize: 8,
         lineHeight: 1,
         autoSize: false,
         printHeaders: true
     };
		var doc = new jsPDF(l, '', '', '');
		doc.setFontSize('10', 'pt', 'letter','true');
		doc.fromHTML($('.reportbyTypeContainer').html(), 15, 15, {
        	'width': '100%'
    	});
    	doc.save('Sales-Report.pdf');*/

			var pdf = new jsPDF('p', 'pt', 'letter');
	        // source can be HTML-formatted string, or a reference
	        // to an actual DOM element from which the text will be scraped.
	        var source = $('.reportbyTypeContainer')[0];

	        // we support special element handlers. Register them with jQuery-style
	        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
	        // There is no support for any other type of selectors
	        // (class, of compound) at this time.
	        var specialElementHandlers = {
	            // element with id of "bypass" - jQuery style selector
	            '#bypassme': function (element, renderer) {
	                // true = "handled elsewhere, bypass text extraction"
	                return true
	            }
	        };
	        var margins = {
	            top: 80,
	            fontSize: 8,
	            bottom: 60,
	            left: 40,
	            right: 40,
	            width: 700,
	            format: 'a4',
	            autoSize:false
	        };
	        // all coords and widths are in jsPDF instance's declared units
	        // 'inches' in this case
	        pdf.fromHTML(
	            source, // HTML string or DOM elem ref.
	            margins.left, // x coord
	            margins.top, { // y coord
	                'width': margins.width, // max width of content on PDF
	                'elementHandlers': specialElementHandlers
	            },

	            function (dispose) {
	                // dispose: object with X, Y of the last line add to the PDF
	                //          this allow the insertion of new lines after html
	                pdf.save('sales-report.pdf');
	            }, margins
	        );
	    }


  	handleValidation = () => {
      let errors = {};
      if (this.state.report_type.value === null || this.state.report_type.value == '') {
          errors.report_type = "Please select Sales Report By"
      }
      if (this.state.startDate === '') {
      	errors.startDate = "Please select start date"
      }
      if (this.state.endDate === '') {
      	errors.endDate = "Please select end date"
      }
      this.setState({
          errors
      }); //Set Errors state

      return Object.keys(errors).length == 0;
  }

  render() {
  	//console.log(this.state)
  	const { ReportBin, storeInfo, totalInfo } = this.state;

  	var revenueType = ReportBin.map(function(o){
  		return o.revenuetypename
	});

  	//console.log(itemSum)
	var productGroupNames = [];
	$.each(revenueType, function(i, el){
	    if($.inArray(el, productGroupNames) === -1) productGroupNames.push(el);
	});


	var matched = [];
	var DataArray = {};

	for(var i = 0; i < productGroupNames.length; i++ ){
		for(var j in ReportBin){
			if(productGroupNames[i] == ReportBin[j].revenuetypename)
			{
				matched.push(ReportBin[j])
			}
		}
			DataArray[i] = matched;
         	matched = [];
	}


     //console.log(objtest);
	 var items = productGroupNames.map((item, i) => (
		<div key={i}>
		<table width="100%" style={{'background':'#4ECDC4'}}>
			<tr>
				<td colSpan="2" style={{'fontSize':'20px', 'color':'white', 'padding':'5px'}}>
                    {item}
				</td>
			</tr>
		</table>
		 <ReportBinChild data={DataArray} count={i} productGroupNames={item}/>
		 </div>
	))


  	var salesbyreport = [
  		{
  			label:"Sales by Employee",
  			value:"Sales by Employee"
  		},
  		{
  			label:"Sales by Product Group",
  			value:"Sales by Product Group"
  		},
  		{
  			label:"Sales by Daypart",
  			value:"Sales by Daypart"
  		},
  		{
  			label:"Sales by Revenue Type",
  			value:"Sales by Revenue Type"
  		},
  		{
  			label:"Sales by Profit Center",
  			value:"Sales by ProfitCenter"
  		}
  	]
    return (
    	<div className="SalesByReport">
            <form ref={(input) => this.SalesByReportForm = input}>
            <div className="row">
		        <div className={classnames('form-group filter col-md-4', { error: !!this.state.errors.report_type})}>
		        <label>Sales Report By</label>
		        <Select
		          name="reportType"
		          value={this.state.report_type.value}
		          options={salesbyreport}
		          onChange={this.updateSalesType}
		        />
		        <span>{this.state.errors.report_type}</span>
		        </div>
	            <div className="form-group col-md-1">
	            	<button className="btn btn-primary" style={{'padding': '12px 24px','marginTop': '23px'}} onClick={(e) => this.showByDateRange(e)}>By Date Range</button>
	            </div>
{/*	            <div className="form-group col-md-1">
	            	<button className="btn btn-primary" style={{'padding': '12px 24px','margin-top': '22px', 'margin-left': '10px'}} onClick={this.showByDate}>By Days</button>
	            </div>*/}
			</div>
		<MuiThemeProvider>
          <div>

          <div className="clearfix"></div>
          	{this.state.showByDate && <div className="form-group col-md-4 reactDatepicker fullwidth clearfix">
	          <label className="control-label">By Date</label>
	            <div className="datepicker-wrapper">
	              <DatePicker
	              	id="datePickerDay"
	                ref='datePickerDay'
	                autoOk
	                //container="inline" mode="landscape"
	                onChange={this.handleDatePickerDay}
	                onClick={this.openDatePickerDay}
	              />
	            </div>
	            <div className="input-group-addon btn btn-secondary" onClick={this.openDatePickerDay}><i className="icon icon-799"></i></div>
	        </div>}


          	{this.state.showByDateRange &&
          	<div className="row">
          	<div className={classnames('form-group reactDatepicker clearfix col-md-3 col-sm-5', { error: !!this.state.errors.startDate})}>
	          <label className="control-label">From</label>
	            <div className="datepicker-wrapper">
	              <DatePicker
	              	id="datePickerStartDate"
	                ref='datePickerStartDate'
	                autoOk
	                //container="inline" mode="landscape"
	                onChange={this.handleDatePickerStartDate}
	                onClick={this.openStartDatePicker}
	              />
	            </div>
	            <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
	        	<span>{this.state.errors.startDate}</span>
	        </div>
          	<div className={classnames('form-group reactDatepicker clearfix col-md-3 col-sm-5', { error: !!this.state.errors.endDate})}>
	          <label className="control-label">To</label>
	            <div className="datepicker-wrapper">
	              <DatePicker
	                 onChange={this.handleDatePickerEndDate}
	                ref='datePickerEndDate'
	                id="datePickerEndDate"
	                autoOk
	                //container="inline" mode="landscape"
	                onClick={this.openEndDatePicker}
	              />
	            </div>
	            <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
	            <span>{this.state.errors.endDate}</span>
	        </div>
	        <div className="col-md-3 col-sm-3" style={{'marginTop': '24px'}}>
                <button className="btn btn-primary" onClick={(e) => this.ReportBin(e)} style={{'padding': '12px 24px'}}>Generate</button>&nbsp;&nbsp;
	        	<button className="btn btn-primary" onClick={(e) => this.ReportReset(e)} style={{'padding': '12px 24px'}}>Reset</button>
	        </div>
			</div>
	    	}
          </div>
          </MuiThemeProvider>
          </form>
          		 {this.state.isLoading && <Spinner />}
		         {this.state.reportTable && <div className="row">
		            <div className="col-sm-12">

						<div className="reportbyTypeContainer" id="reportbyTypeContainer">
							<div className="table-responsive dashbord-table">

							<table width="100%" className="tableHeadStyle">
							<tr>
								<td colSpan="2" style={{'color':'black', 'textAlign': 'center'}}>
									<a id="btnExport1" onClick={this.makePDF}><i className="fa fa-file-pdf-o" aria-hidden="true"></i><br />Download Now</a>
									<a id="btnExport"><i className="fa fa-file-pdf-o" aria-hidden="true"></i><br />Download XLS</a>
									{/*<a id="btnExportPdf" onClick={this.makePDF}><i className="fa fa-file-pdf-o" aria-hidden="true"></i><br />Download PDF</a>*/}
								</td>
							</tr>
							<tr>
								<td style={{'fontSize':'30px', 'color':'black', 'textAlign': 'center'}}>Welcome to {storeInfo.reportaddress1}</td>
							</tr>
							<tr>
								<td style={{'textAlign': 'center', 'fontSize':'15px', 'color':'rgba(0,0,0,.87)'}}>{storeInfo.reportaddress2} {storeInfo.reportaddress3}</td>
							</tr>
							<tr>
								<td style={{'textAlign': 'center', 'fontSize':'25px', 'color':'black'}}>{this.state.report_type.value}</td>
							</tr>
							<tr>
								<td style={{'textAlign': 'center', 'fontSize':'15px', 'color':'rgba(0,0,0,.87)'}}>{this.state.startDate} to {this.state.endDate}</td>
							</tr>
							<tr>
								<td style={{'textAlign': 'center', 'fontSize':'15px', 'color':'rgba(0,0,0,.87)'}}></td>
							</tr>
							<tr>
								<td height="15px" colSpan="2"></td>
							</tr>
							</table>

							{items}

							<table width="100%">
								<tr>
						         	<td colSpan="3" style={{'fontSize':'18px','background':'#4ECDC4', 'color':'white', 'padding':'6px'}}>Totals for all Product Groups</td>
						       	</tr>
					       	</table>

							 <table className="display table table-productgroup-items">
							    <thead>
							       <tr>
							          <th>Gross Revenue</th>
							          <th>Total Discounts</th>
							          <th>Net Revenue</th>
							       </tr>
							    </thead>
							    <tbody>
							       <tr>
							       	<td><NumberFormat value={totalInfo.grosstotal} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
							       	<td><NumberFormat value={totalInfo.grossdiscounts} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
							       	<td><NumberFormat value={totalInfo.nettotal} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
							       </tr>
							    </tbody>
							 </table>
							</div>
						</div>



		            </div>
		         </div>}
		         {/*<OrderHistorybd data={this.props.OrderHistoryReport} />  */}
		</div>
    );
  }
}
export default ReportBin;