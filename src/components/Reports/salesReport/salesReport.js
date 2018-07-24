import React, {Component, PropTypes} from 'react';

import { logOutUser } from '../../../actions/sessionActions';

import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';

import { browserHistory, Link } from 'react-router';

import GrossRevenue from './GrossRevenue';

import Taxes from './Taxes';

import NetRevenue from './NetRevenue';

import AvgOrder from './AvgOrder';

import BestPaymentType from './BestPaymentType';

import axios from 'axios';

import getUserDetails from '../../common/CredentialDomain';

import RevenueChart from './RevenueChart';

import PaymentTypeChart from './PaymentTypeChart';

import WeeklyChart from './WeeklyChart';

import ProductGroupChart from './ProductGroupChart';

import ProductsChart from './ProductsChart';

import Max from './Max';

import Min from './Min';

import YearReportChart from './YearReportChart';

import moment from 'moment';

import _ from 'underscore';

import Tab from 'react-bootstrap/lib/Tab';

import Tabs from 'react-bootstrap/lib/Tabs';

global.$ = require('jquery');

import ReportBin from './ReportBin';

import OrderHistorybd from './OrderHistorybd';

//import LopMonHoc from './LopMonHoc';
import StoreInformation from './StoreInformation';

import DefaultLayout from '../../common/DefaultLayout';

import './style.scss';

import ReactSelect from '../../react-select/main';

class salesReport extends Component{
	constructor(props) {
		super(props);
		this.state={
			salesHistory:{
				"avgorder": 0.00,
				"bestpaymenttype":"",
				"grossrevenue": 0.00,
				"netrevenue": 0.00,
				"taxes": 0.00
			},
			minMax:{
				bottom5:[],
				top5:[]
			},
			SalesReport: [],
      todayTransaction: [],

		}
	}

	componentDidMount = () => {
		this.getSalesHistory();
		this.GetSalesReportDetails();
		this.TopsellingProductsReport();

		$(document).ready(function(){
			$(this).scrollTop(0);
		});
	}
 	componentWillMount = () => {

		var userdata = JSON.parse(window.sessionStorage.getItem("userdata"));
		var canviewreports;
		if(userdata.accesslevelinfo === undefined){
			canviewreports = true;
		}else{
			canviewreports = userdata.accesslevelinfo.canviewreports
		}

		if(canviewreports === false ){
			browserHistory.push('/setup')
		}
 	}

	getSalesHistory = () => {
    var that = this;
    //Request Query
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();
    axios.post(`${process.env.API_HOST}/ReportServices/ManageSalesReports.svc/GetSalesHistory/json`, reqQuery).then(function(response) {
      //console.log(response)
      if (response.status >= 400) {
        console.log('response.status.400')
      } else {
        that.setState({salesHistory: response.data})
      }
    }).catch(function(error) {
      console.log("Bad Response");
    });
  }

	GetSalesReportDetails = () => {
    var that = this;
    //Request Query
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();
    console.log(JSON.stringify(reqQuery));
    axios.post(`${process.env.API_HOST}/ReportServices/ManageSalesReports.svc/GetSalesReportDetails/json`, reqQuery).then(function(response) {
      console.log(response)
      if (response.status >= 400) {
        console.log('response.status.400')
      } else {
        that.setState({SalesReport: response.data})
        // Data for Payment Type Chart
      }
    }).catch(function(error) {
      console.log("Bad Response");
    });
  }

	TopsellingProductsReport = () => {
    var that = this;
    //Request Query
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();
    console.log(JSON.stringify(reqQuery));
    axios.post(`${process.env.API_HOST}/ReportServices/TopSellingProdcutReports.svc/TopsellingProductsReport/json`, reqQuery).then(function(response) {
      console.log(response)
      if (response.status >= 400) {
        console.log('response.status.400')
      } else {
        that.setState({minMax: response.data})
        // Data for Payment Type Chart
      }
    }).catch(function(error) {
      console.log("Bad Response");
    });
  }

	logOut = (event) => {
		event.preventDefault();
		this.props.actions.logOutUser();
	}

	render(ReactElement, DOMElement, callback){
		const currentDomain = window.sessionStorage.getItem("currentdomainname");
		const currentStore = window.sessionStorage.getItem("currentstorename");
		const currentStoreAddress = window.sessionStorage.getItem("currentstoreaddress");
		//console.log(this.state)
		const {avgorder, bestpaymenttype, grossrevenue, netrevenue, taxes} = this.state.salesHistory;
		var revenuereport = this.state.SalesReport.revenuereport;
		var paymenttypereport = this.state.SalesReport.paymenttypereport;
		var weeklyreport = this.state.SalesReport.weeklyreport;
		var productgroupreport = this.state.SalesReport.productgroupreport;
		var revenueyearsreport = this.state.SalesReport.revenueyearsreport;

		var Bottom5sellingreportlist = this.state.minMax.Bottom5sellingreportlist;
    var top5sellingreportlist = this.state.minMax.top5sellingreportlist;
		console.log(this.state);

		var revenuerpt = [];
		var paymenttyperpt = [];
		var weeklyrpt = [];
		var productgrouprpt = [];
		var productrpt = [];
		var revenueyearsrpt = [];
		var top5 = [];
    var bottom5 = [];

		var rows = [
			['Mar ', 4898532],
			['Apr ', 3730261],
			['May ', 2678455],
			['Jun ', 2678414],
			['Jul ', 2674510],
			['Aug ', 2878455],
			['Sep ', 2668455],
			['Oct ', 2657855],
			['Nov ', 6738455],
			['Dec ', 2678450]
		];

		if (Bottom5sellingreportlist != undefined) {
      Bottom5sellingreportlist.map(function(o) {
        bottom5.push([o.productname, o.productcount,o.totalsales])
      });
    }

    if (top5sellingreportlist != undefined) {
      top5sellingreportlist.map(function(o) {
        top5.push([o.productname, o.productcount,o.totalsales])
      });
    }

		if(revenuereport != undefined){
			revenuereport.map(function(o){
				revenuerpt.push([o.monthname, o.saleamount] )
			});
		}

		if(paymenttypereport != undefined){
			paymenttypereport.map(function(o){
				paymenttyperpt.push([o.paymenttypename, o.percentagevalue] )
			});
		}
		if(weeklyreport != undefined){
			weeklyreport.map(function(o){
				weeklyrpt.push([o.weekname, o.saleamount, o.weekdate] )
			});
		}
		if(revenueyearsreport != undefined){
			revenueyearsreport.map(function(o){
				revenueyearsrpt.push([o.year, o.saleamount] )
			});
		}
		if(productgroupreport != undefined){
			productgroupreport.map(function(o){
				productgrouprpt.push([o.productgroupname, o.percentagevalue] )
			});
		}
		//console.log(paymenttypereport)

		$('body').on('click', '.panel-heading span.clickable', function(e){
		    var $this = $(this);
			if(!$this.hasClass('panel-collapsed')) {

				$this.parents('.panel').find('.panel-body').hide();
				$this.addClass('panel-collapsed');
				$this.find('i').removeClass('fa-minus').addClass('fa-plus');
			} else {
				$this.parents('.panel').find('.panel-body').show();
				$this.removeClass('panel-collapsed');
				$this.find('i').removeClass('fa-plus').addClass('fa-minus');
			}
		})

		//if (this.props.logged_in) {
		return(
			<DefaultLayout>
			<main className="container-fluid">
		      <div id="salesReport">
			  {/* <ReactSelect /> */}
				  <StoreInformation currentDomain={currentDomain} currentStore={currentStore} />
				  <div className="row">
					<div className="col-md-12">
						<div className="row">
							<GrossRevenue data={grossrevenue} />
							<NetRevenue data={netrevenue} />
							<Taxes data={taxes} />
							<AvgOrder data={avgorder} />
							<BestPaymentType data={bestpaymenttype} />
						</div>
					</div>
		     </div>

				 <div className="row">

			 		<div className="col-sm-12 col-lg-4" >
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h3 className="panel-title"></h3>
								<span className="pull-right clickable"><i className="fa fa-minus"></i></span>
							</div>
							<div className="panel-body">
							<Tabs id="sales-report">
							    <Tab eventKey={1} title="Revenue">
							    	<RevenueChart revenuereport={revenuerpt} />
							    </Tab>
							    <Tab eventKey={2} title="Weekly">
							    	<WeeklyChart weeklyreport={weeklyrpt}/>
							    </Tab>
							    {/*}<Tab eventKey={3} title="Payment Type">
							    	<PaymentTypeChart paymenttypereport={paymenttyperpt}/>
							    </Tab>
							    <Tab eventKey={4} title="Product Group">
							    	<ProductGroupChart productgroupreport={productgrouprpt}/>
							    </Tab>*/}
						  	</Tabs>
							</div>
						</div>
		      </div>

				<div className="col-sm-12 col-lg-4">
				 <div className="panel panel-primary">
					 <div className="panel-heading">
						 <h3 className="panel-title"></h3>
						 <span className="pull-right clickable"><i className="fa fa-minus"></i></span>
					 </div>
					 <div className="panel-body">
						 <Tabs id="year-report">
							 <Tab eventKey={1} title="Year">
								 <YearReportChart revenueyearsrpt={revenueyearsrpt} />
							 </Tab>
						 </Tabs>
					 </div>
				 </div>
			 </div>

			 <div className="col-sm-12 col-lg-4">
				<div className="panel panel-primary">
					<div className="panel-heading">
						<h3 className="panel-title"></h3>
						<span className="pull-right clickable">
							<i className="fa fa-minus"></i>
						</span>
					</div>
					<div className="panel-body">
						<Tabs id="sales-report">
						<Tab eventKey={1} title="Top 5 Selling Products">
						<Max top5sellingreportlist={top5}/>
						</Tab>
						<Tab eventKey={2} title="Bottom 5 Selling Products">
 						 <Min Bottom5sellingreportlist={bottom5} />
 					 </Tab>
						</Tabs>
					</div>
				</div>
			</div>
			 </div>

		        <div className="row">
		            <div className="col-sm-12 col-lg-12">
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h3 className="panel-title"></h3>
								<span className="pull-right clickable"><i className="fa fa-minus"></i></span>
							</div>
							<div className="panel-body">
								<OrderHistorybd />
							</div>
						</div>
		            </div>
		        </div>
		      </div>
			  </main>
			</DefaultLayout>
		// )}else{
		// return(
		// 	<li><a href="/logout" onClick={this.logOut}> <span className="icon icon-1110"></span>Sign Out</a></li>
		// )}
		)}
}
salesReport.propTypes = {
	actions: PropTypes.object.isRequired
}
function mapStateToProps(state, ownProps) {
	return {logged_in: state.session};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({logOutUser}, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(salesReport);
