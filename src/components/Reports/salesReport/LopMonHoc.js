import React, {Component, PropTypes} from 'react';
import getUserDetails from '../../common/CredentialDomain';
import axios from 'axios';
global.$ = require('jquery');

var LopMonHoc = React.createClass({
 	getInitialState: function(){
 		return {data: []}
 	},

	OrdersHistoryReportBasedOnBD: function(){
		var that = this;
		//Request Query
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();
		//console.log(reqQuery);
		axios.post(`${process.env.API_HOST}/ReportServices/GetOrderHistoryReport.svc/OrdersHistoryReportBasedOnBD/json`, reqQuery)
		.then(function(response){
			console.log(response)
			if (response.status >= 400) {
				console.log('response.status.400')
			}else{
				that.setState({
					data:response.data.orderhistoryreportlist
				})
				// Data for Payment Type Chart
			}
		}).catch(function (error) {
	   		console.log("Bad Response");
		});
	},
/* 	loadData: function(){
 		$.ajax({
 			url: '/daotao/lops',
 			success: function(data){
 				this.setState({data: data.lops});
 			}.bind(this)
 		})
 	},*/
 	componentWillMount: function(){
 		this.OrdersHistoryReportBasedOnBD();
 	},
 	componentDidMount: function(){
 		var self = this;
 		$(document).ready(function() {
 		$('#table-ex').dataTable({
		  "bAutoWidth": false,
		  "paging": true,
		  "bDestroy": true,
		  "fnDrawCallback": function() {
            	self.forceUpdate();
          },
		});
		});
 	},
 	componentDidUpdate: function(){
 		$(document).ready(function() {
 		$('#table-ex').dataTable({
		  "bAutoWidth": false,
		  "paging": true,
		  "bDestroy": true,
		});
		});
 	},
 	render: function(){
 		var x = this.state.data.map(function(d, index){
 			return <tr key={d}><td>{index+1}</td><td>{d.dateandtime}</td><td>{d.billno}</td></tr>
 		});
		return(
		               <div className="widget widget-small">
		                  <div className="widget-head">
		                     <div className="title">Order Received</div>
		                  </div>
		                  <div id="orderHistory"></div>
		                  <div className="table-responsive dashbord-table">

		                     <table id="table-ex" className="display nowrap table table-striped table-hover table-fw-widget table-curved">
		                        <thead>
		                           <tr>
		                              <th>Date</th>
		                              <th>Order No</th>
		                              <th>Total Items</th>
		                              <th>Total</th>
		                              <th>Payment Mode</th>
		                              <th>Status</th>
		                           </tr>
		                        </thead>
		                        <tbody>
		                           {x}
		                        </tbody>
		                     </table>
		                  </div>
		               </div>
		)
 	}
 });
export default LopMonHoc;