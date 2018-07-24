import React, { Component } from 'react';
import { Link } from 'react-router';
import DefaultLayout from '../../common/DefaultLayout';
import Transaction from './Transaction';
import getUserDetails from '../../common/CredentialDomain';
import axios from 'axios';
import jsPDF from 'jspdf';
import classnames from 'classnames';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

class DeletedItemsListReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            pageHead:{
                pagehead:'Exceptional Reports',
                dashboard: 'Dashboard',
                setup: 'reports'
            },
            deleteditemslist:[],
            generateReportByDateTime:{
              fromDate:'',
              toDate: '',
              fromStartTime:null,
              fromEndTime:null
            },
            errors:{},
            showTable: false
        }
    }
    componentDidMount() {
        //this.getInventoryStockReport();

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
            a.download = 'DeletedItemReport_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
            a.click();
          });
        });
    }
    handleDatePickerStartDate = (event, date) => {
      delete this.state.errors.fromDate;
          var DatePickedUp = moment(date).format("MM-DD-YYYY");
      this.setState({
        fromDate: DatePickedUp
      })
    }

    handleDatePickerEndDate = (event, date) => {
      delete this.state.errors.toDate;
      var DatePickedUp = moment(date).format("MM-DD-YYYY");
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


    getDeletedItemReport = () => {
    var that = this;
    var reqQuery = {}
    const {fromDate, toDate, fromStartTime, fromEndTime} = this.state;


    var storeid = window.sessionStorage.getItem("storeid");
    reqQuery['userdetails'] = getUserDetails();
    reqQuery['ResponseType'] = "String content";
    reqQuery['businessdays'] = []

    reqQuery["startdate"] = fromDate + ' ' + fromStartTime;
    reqQuery["enddate"] = toDate + ' ' + fromEndTime;
    reqQuery["storeid"] = storeid;
    reqQuery["typeofdiscount"] = "String content";

    console.log(JSON.stringify(reqQuery))

		axios.post(`${process.env.API_HOST}/ReportServices/DeletedItemsListReport.svc/DeletedKitchenSentItemsList/json`, reqQuery)
		.then(function(response){
        console.log(response);
			if (response.status >= 400) {
				  console.log('response.status.400')
			}else{
				that.setState({
          deleteditemslist: response.data.deleteditemslist,
          showTable: true
				})
			}
		}).catch(function (error) {
	   		console.log("Bad Response");
    });
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

					pdf.save('DeletedItemReport.pdf');
				}
				})
		}
    render(){
      console.log(this.state)
        const {pageHead} = this.state;
        const {fromStartTime ,fromEndTime} = this.state.generateReportByDateTime;
		    var currentDomain = window.sessionStorage.getItem("currentdomainname");
        var currentStore = window.sessionStorage.getItem("currentstorename");
        //console.log(this.state)
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
                  <div className="master-table">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="">
                          <div className="tabbable-panel">
                            <div className="tab-content-1" id="inventoryReport">
                            <div className="filterbyDate" style={{marginTop: 10}}>
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
                              <div className="col-ls-12">Note: Data availble from Jan 2018</div>
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
                            <button className="btn btn-primary" onClick={this.getDeletedItemReport} style={{'padding': '12px 24px'}}>Generate</button>
                            </div>
                            {/* <div className="col-lg-1 col-md-6 col-sm-6" style={{'marginTop': '22px'}}>
                              <button className="btn btn-default" onClick={this.generateReportByDateTimeFunc} style={{'padding': '12px 24px'}}>Reset</button>
                            </div> */}

                        </div>
                          </MuiThemeProvider>
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
                                KOT Exceptional Report
                                </td>
                              </tr>
                              <tr>
                                <td height="19px" colSpan="2" />
                              </tr>
                            </table>
                              <div className="table-responsive dashbord-table">
                                <Transaction deleteditemslist={this.state.deleteditemslist} />
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
export default DeletedItemsListReport;
