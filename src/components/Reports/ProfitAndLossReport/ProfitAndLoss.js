import React from 'react'
import { Link } from 'react-router'
import axios from 'axios';
import ProfitAndLossMain from './ProfitAndLossMain'
import DefaultLayout from '../../common/DefaultLayout';
import getUserDetails from '../../common/CredentialDomain';
import '../salesReport/style.scss';


class ProfitAndLoss extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
            pageHead:{
                pagehead:'Profit and Loss',
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
										<ProfitAndLossMain snapShop={this.state.snapShop} reportData={this.state.data}/>
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
export default ProfitAndLoss;
