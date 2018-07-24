import React from 'react';
import { Link, browserHistory } from 'react-router';
import DefaultLayout from '../common/DefaultLayout';
import TabPrimary from './TabPrimary';
import TabSecondary from './TabSecondary';


class MainContainer extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			pageHead:{
				pagehead:'Taxes',
				dashboard: 'Dashboard',
				setup: 'Setup'
			},
			printers:[],
			TabPrimary:"Tax Groups",
			TabSecondary:"Taxes"
		}
	}

	render(){
		const {pageHead} = this.state;
		var currentDomain = window.sessionStorage.getItem("currentdomainname");
		var currentStore = window.sessionStorage.getItem("currentstorename");
		return(
			<DefaultLayout>
            <div className="page-head inner__pageHead">
							<div className="domain-icon"> <img src={require( './tax.svg')}/> <h2>{pageHead.pagehead}</h2></div>
							<ol className="breadcrumb">
								<li><Link to={`/domains`}>{currentDomain}</Link></li>
								<li><Link to={`/stores`}>{currentStore}</Link></li>
								<li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
								<li><Link to={`/setup`}>{pageHead.setup}</Link></li>
								<li className="active">{pageHead.pagehead}</li>
							</ol>
            </div>
						<main>
        	<div className="master-table">
			      <div className="row">
			        <div className="col-sm-12">

			          <div className="">
			            <div className="tabbable-panel">
			              <div className="tabbable-line">
			                <ul className="nav custom-nav-tabs">
			                  <li><a href="#taxgroup" className="active" data-toggle="tab">{this.state.TabPrimary}</a></li>
			                  <li className="active"><a href="#taxes" data-toggle="tab">{this.state.TabSecondary}</a></li>
			                </ul>
			                <div className="tab-content">
				                <TabPrimary />
				                <TabSecondary />
			                </div>
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
export default MainContainer;