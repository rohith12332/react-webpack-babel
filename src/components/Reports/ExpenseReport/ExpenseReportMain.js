import React, { Component } from 'react';
import { Link } from 'react-router';
import ExpenseReport from './ExpenseReport';
import DefaultLayout from '../../common/DefaultLayout';
import getUserDetails from '../../common/CredentialDomain';
import axios from 'axios';
import jsPDF from 'jspdf';
import classnames from 'classnames';
import Select from 'react-select';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


class ExpenseReportMain extends Component{
    constructor(props){
        super(props);
        this.state = {
            pageHead:{
                pagehead:'Expense Reports',
                dashboard: 'Dashboard',
                setup: 'reports'
            },
            businessdays:[],
            ExpenseReports:[],
            errors:{},
            showTable: false
        }
    }

    componentDidMount() {
        //this.getInventoryStockReport();
        this.getBusinessDays();

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
            a.download = 'ExpenseReport_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
            a.click();
          });
        });
    }


  getBusinessDays = () => {
    var that = this;
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();
    console.log(JSON.stringify(reqQuery))

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


  getExpenseReport = () => {
    var that = this;
    var reqQuery = {}
    var storeid = window.sessionStorage.getItem("storeid");
    const {startDate, endDate} = this.state;
    var business_days = [];
    business_days.push(this.state.business_days.id);

    console.log(business_days);
    reqQuery['BussinessDays'] = business_days;
    reqQuery["EndDate"] = "";
    reqQuery["StartDate"] = "";
    console.log(reqQuery["EndDate"])
    console.log(reqQuery["StartDate"])
    reqQuery["Store_ID"] = storeid;
    reqQuery['userdetails'] = getUserDetails();
    console.log(JSON.stringify(reqQuery))

		axios.post(`${process.env.API_HOST}/ReportServices/ManageExpensereport.svc/GetExpenseReports/json`, reqQuery)
		.then(function(response){
        console.log(response);
        console.log(response.status)
      if (response.status >= 400) {
          console.log('response.status.400')
      }else {
          if(response.data.ExpenseReports == null) response.data.ExpenseReports = [];
          console.log(response.data.ExpenseReports);
          that.setState({
            ExpenseReports: response.data.ExpenseReports,
            showTable: true
          });
        }
		}).catch(function (error) {
	   		console.log("Bad Response");
    });
    }

  getExpenseReportBydatetime = () => {
    var that = this;
    var reqQuery = {}
    var storeid = window.sessionStorage.getItem("storeid");
    const {startDate, endDate} = this.state;

    var business_days = this.state.business_days;
    console.log(business_days);
    reqQuery['BussinessDays'] = business_days;
    reqQuery["EndDate"] = moment(endDate).format("DD/MM/YYYY HH:mm:ss");
    reqQuery["StartDate"] = moment(startDate).format("DD/MM/YYYY HH:mm:ss");
    console.log(reqQuery["EndDate"])
    console.log(reqQuery["StartDate"])
    reqQuery["Store_ID"] = storeid;
    reqQuery['userdetails'] = getUserDetails();
    console.log(JSON.stringify(reqQuery))

    axios.post(`${process.env.API_HOST}/ReportServices/ManageExpensereport.svc/GetExpenseReports/json`, reqQuery)
    .then(function(response){
        console.log(response);
        console.log(response.status)
      if (response.status >= 400) {
          console.log('response.status.400')
      }else {
          if(response.data.ExpenseReports == null) response.data.ExpenseReports = [];
          console.log(response.data.ExpenseReports);
          that.setState({
            ExpenseReports: response.data.ExpenseReports,
            showTable: true
          });
        }
    }).catch(function (error) {
        console.log("Bad Response");
    });
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

    makePDF() {
			var quotes = document.getElementById('pdfwraper');
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

					pdf.save('ExpenseReport.pdf');
				}
				})
		}


    render(){
      console.log(this.state)
        const {pageHead} = this.state;
		    var currentDomain = window.sessionStorage.getItem("currentdomainname");
        var currentStore = window.sessionStorage.getItem("currentstorename");
        //console.log(this.state)

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
            <DefaultLayout>
                <div className="page-head inner__pageHead">
                    <div className="domain-icon"><img src={require( './sales.svg')}/> <h2>{pageHead.pagehead}</h2></div>
                    <ol className="breadcrumb">
                        <li><Link to={`/domains`}>{currentDomain}</Link></li>
                        <li><Link to={`/stores`}>{currentStore}</Link></li>
                        <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                        <li><Link to={`/reports`}>{pageHead.setup}</Link></li>
                        <li className="active">{pageHead.pagehead}</li>
                    </ol>
                </div>
                <main>
                  <div className="master-table" id="expense">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="">
                          <div className="tabbable-panel">
                            <div className="tab-content-1" id="inventoryReport">
                            <div className="filterbyDate" style={{marginTop: 10}}>
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
                                            autoOk
                                            //container="inline"
                                            //mode="landscape"
                                            onChange={this.handleDatePickerStartDate}
                                            formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                                            onClick={this.openStartDatePicker}
                                            className="m-datePicker"
                                            textFieldStyle={{'height':'40px'}}
                                          />
                                        </div>
                                        <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
                                      <span>{this.state.errors.startDate}</span>
                                    </div>
                                      <div className={classnames('form-group col-lg-3 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.endDate})}>
                                      <label className="control-label">To Date</label>
                                        <div className="datepicker-wrapper">
                                          <DatePicker
                                             onChange={this.handleDatePickerEndDate}
                                            ref='datePickerEndDate'
                                            id="datePickerEndDate"
                                            autoOk
                                            //container="inline" mode="landscape"
                                            formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                                            onClick={this.openEndDatePicker}
                                            className="m-datePicker"
                                            textFieldStyle={{'height':'40px'}}
                                          />
                                        </div>
                                        <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
                                        <span>{this.state.errors.endDate}</span>
                                    </div>
                                    <div className="col-md-2 col-sm-6" style={{'marginTop': '22px'}}>
                                      <button className="btn btn-primary" onClick={this.getExpenseReportBydatetime} style={{'padding': '12px 24px'}}>Generate</button>
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
                                          //multi={true}
                                        />
                                        <span>{this.state.errors.business_days}</span>
                                        </div>
                                        <div className="form-group col-md-1">
                                          <button className="btn btn-primary" style={{'padding': '12px 24px','marginTop': '26px'}} onClick={this.getExpenseReport}>Generate</button>
                                        </div>
                                        </div>
                                  </Tab>
                              </Tabs>
                              </div>
                            {this.state.showTable && <div>
                            <div style={{ textAlign: "center", "marginTop": "10px" }}>
                                <a id="btnExport">
                                <i className="fa fa-file-excel-o" aria-hidden="true" />
                                <br />Excel
                                </a>
                                <a id="btnExportPdf" onClick={this.makePDF}>
                                <i className="fa fa-file-pdf-o" aria-hidden="true" />
                                <br />PDF
                                </a>
                            </div>
                            <div id="pdfwraper">
                            <table width="100%" className="tableHeadStyle">
                              <tr>
                                <td height="19px" colSpan="2" />
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    height: "40px",
                                    fontSize: "25px",
                                    color: "black",
                                    textAlign: "center"
                                  }}
                                >Welcome to {currentStore}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    height: "30px",
                                    textAlign: "center",
                                    fontSize: "20px",
                                    color: "black"
                                  }}
                                >
                                Expense Report
                                </td>
                              </tr>
                              <tr>
                                <td height="19px" colSpan="2" />
                              </tr>
                            </table>
                              <div className="table-responsive dashbord-table">
                                <ExpenseReport ExpenseReports={this.state.ExpenseReports} />
                              </div>
                            </div>
                            </div>}

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
export default ExpenseReportMain;
