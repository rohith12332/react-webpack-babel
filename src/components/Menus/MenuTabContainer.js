import React from 'react';
import { Link, browserHistory } from 'react-router';
import DefaultLayout from '../common/DefaultLayout';
import MenusTab from './MenusTab';
import MenuGroupsTab from './MenuGroupsTab';
/*import TabSecondary from './TabSecondary';*/

class MenuTabContainer extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			pageHead:{
				pagehead:'Menus',
				dashboard: 'Dashboard',
				setup: 'Setup'
			},
			Menus:[],
			TabPrimary:"Menu Groups",
			TabSecondary:"Menus"
		}
	}

	render(){
        var currentDomain = window.sessionStorage.getItem("currentdomainname");
        var currentStore = window.sessionStorage.getItem("currentstorename");
				const {pageHead} = this.state;
		return(
		<DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './menu.svg')}/> <h2>{pageHead.pagehead}</h2></div>
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

				          <div className="" id="menulist">
				            <div className="tabbable-panel">
				              <div className="tabbable-line">
				                <ul className="nav custom-nav-tabs ">
				                  <li><a href="#menugroups" data-toggle="tab">{this.state.TabPrimary}</a></li>
				                  <li className="active"><a href="#menus" data-toggle="tab">{this.state.TabSecondary}</a></li>
				                </ul>
				                <div className="tab-content">
					                <MenusTab />
					                <MenuGroupsTab/>
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
export default MenuTabContainer;