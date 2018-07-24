import React from 'react'
import { Link } from 'react-router'
import ReportFilter from './ReportFilter'
import DefaultLayout from '../../common/DefaultLayout';
import axios from 'axios';
import getUserDetails from '../../common/CredentialDomain';
import './masterReport.scss';
import '../salesReport/style.scss';


class MasterReport extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
            pageHead:{
                pagehead:'Master Report',
                dashboard: 'Dashboard',
                setup: 'reports'
            },
            data:[],
            snapShop:[],
        	fromDate:'',
			toDate: '',
			fromStartTime: null,
			fromEndTime: null
		}
	}

	componentDidMount = () => {
		//this.getMasterReport();
	}

	getMasterReport = () => {
		var that = this;
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();
		reqQuery["fromdate"] = "06/08/2017 06:00:00";
		reqQuery["todate"] = "06/08/2017 23:59:00";
		reqQuery["businessdayids"] = [];

		axios.post(`${process.env.API_HOST}/ReportServices/MasterReport.svc/GetMasterReports/json`, reqQuery)
		.then(function(response){
			console.log(response)
			if (response.status >= 400) {
				console.log('response.status.400')
			}else{
				that.setState({
					data: response.data.MasterSales,
					snapShop: response.data.MasterSales[0]
				})
			}
		})
		.catch(function (error) {
	   		console.log("Bad Response");
		});
	}
	render() {
		const {pageHead} = this.state;
		var currentDomain = window.sessionStorage.getItem("currentdomainname");
        var currentStore = window.sessionStorage.getItem("currentstorename");
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
									<div className="tab-content-1" id="masterReport">
										<ReportFilter snapShop={this.state.snapShop} reportData={this.state.data}/>
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
export default MasterReport;
