import React, {Component} from 'react';
import { Link } from 'react-router';
import DefaultLayout from '../../common/DefaultLayout';
import SalesReportBy from './salesReportBy'
import './style.css';

class SalesReportWrap extends Component{
    constructor(props) {
        super(props)
        this.state = {
            pageHead:{
                pagehead:'Sales Report',
                dashboard: 'Dashboard',
                setup: 'reports'
            }

        }
    }

    render(){
        const {pageHead} = this.state;
        var currentDomain = window.sessionStorage.getItem("currentdomainname");
        var currentStore = window.sessionStorage.getItem("currentstorename");
        return(
            <DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './reports.svg')} /> <h2>{pageHead.pagehead}</h2></div>
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
            <div className="widget-fulwidth">
              <div className="row">
                <div className="col-sm-12">
                  <div >
                    <div className="tabbable-panel">
                        <div className="tab-content">
                            <SalesReportBy />
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
export default SalesReportWrap;