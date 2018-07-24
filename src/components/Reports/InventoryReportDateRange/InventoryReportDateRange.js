import React, { Component } from 'react';
import { Link } from 'react-router';
import InventoryReport from './InventoryReport';
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

class InventoryReportDateRange extends Component{
    constructor(props){
        super(props);
        this.state = {
            pageHead:{
              pagehead:'Inventory Reports',
              dashboard: 'Dashboard',
              setup: 'reports'
            },
            businessdays:[],
            inventoryreportlist:[],
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
            a.download = 'DeletedItemReport_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
            a.click();
          });
        });
    }


  getBusinessDays = () => {
    var that = this;
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();
    console.log(JSON.stringify(reqQuery))

    axios.post(`${process.env.API_HOST}/ManageBusinessday.svc/GetInvDRExistsBusinessDays/json`, reqQuery)
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


  getInventoryReport = () => {
    var that = this;
    var reqQuery = {}
    var storeid = window.sessionStorage.getItem("storeid");
    var business_days = [];
    business_days.push(this.state.business_days.id);
    reqQuery['businessdays'] = business_days;
    reqQuery["startdate"] = "";
    reqQuery["enddate"] = "";
    reqQuery["damagedqty"] = "";
    reqQuery["inventory"] = "";
    reqQuery["storeid"] = storeid;
    reqQuery['userdetails'] = getUserDetails();
    console.log(JSON.stringify(reqQuery))

		axios.post(`${process.env.API_HOST}/ReportServices/GetSaleCumInventorySummaryReport.svc/GetSaleCumInventorySummaryReport/json`, reqQuery)
		.then(function(response){
        console.log(response);
			if (response.status >= 400) {
				  console.log('response.status.400')
			}else{
				that.setState({
          salecuminvsummaryreport: response.data.salecuminvsummaryreport,
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
                  <div className="master-table">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="">
                          <div className="tabbable-panel">
                            <div className="tab-content-1" id="inventoryReport">
                            <div className="filterbyDate" style={{marginTop: 10}}>
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
                                    <button className="btn btn-primary" style={{'padding': '12px 24px','marginTop': '26px'}} onClick={this.getInventoryReport}>Generate</button>
                                  </div>
                                </div>
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
                                Inventory Report
                                </td>
                              </tr>
                              <tr>
                                <td height="19px" colSpan="2" />
                              </tr>
                            </table>
                              <div className="table-responsive dashbord-table">
                                <InventoryReport salecuminvsummaryreport={this.state.salecuminvsummaryreport} />
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
export default InventoryReportDateRange;