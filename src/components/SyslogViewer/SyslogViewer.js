import React from 'react';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import Footer from '../common/Footer';
import SideBarRight from '../common/SideBarRight';
import DefaultLayout from '../common/DefaultLayout';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
import classnames from 'classnames';

import Tabelify from '../react-tabelify/Tabelify'
var _ = require('underscore');

//Table Column Defination
var columnMetadata = [
    {
        "columnName": "userid",
        "displayName": "Account Name"
    },
    {
        "columnName": "datestamp",
        "displayName": "Date & Time",
    },
    {
        "columnName": "action",

        "displayName": "Action",
    }
];

class SyslogViewer extends React.Component{
	constructor(props) {
		super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.state = {
      isLoading: true,
      tableConfig: {
          data:[],
          columnMetadata: columnMetadata,
          currentPage: 1,
          showCheckbox:false,
          onChangeGrid: this.onChangeGrid,
          selectedRows: {},
          onRowClick: this.onRowClick,
          resultsPerPage: 50,
          localSearch: true,
      },
      pageHead:{
        pagehead:'Syslog Viewer',
        dashboard: 'Dashboard',
        setup: 'Setup'
      }
    }

	}

  componentDidMount() {
    this.getSysConfig();
  }


 getSysConfig(){
  var that = this;
  var reqQuery = {};
  var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  credentials['storeuniquekey'] = storeuniquekey;

  reqQuery['index'] = 2147483647;
  reqQuery['recordcount'] = 2147483647;
  reqQuery['userdetails'] = credentials;
  const request = new Request(`${process.env.API_HOST}/ManagePciLogs.svc/GetPciLogs/json`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(reqQuery)
  });
  fetch(request)
    .then(function(response) {
      if(response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      console.log(data)
      if(data.PciLogAPIRequest == null) data.PciLogAPIRequest = [];
      var tableConfig = that.state.tableConfig;
      if(data.PciLogAPIRequest == null){
        data.PciLogAPIRequest=[]

      }

      tableConfig['data'] = data.PciLogAPIRequest;
      console.log(tableConfig)
      //return false;
      tableConfig['data'] = data.PciLogAPIRequest;
      tableConfig['isLoading'] = false;
      that.setState({
        tableConfig: tableConfig
      });
   });
}

   onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
        tableConfig: tableConfig
    });
  }

  render(){

    const {pageHead} = this.state;
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    const {msgSuccess, msgFailure} = this.state;

    return(
        <DefaultLayout>
            <div className="page-head inner__pageHead">
              <div className="domain-icon"><img src={require('./syslog.svg')} /><h2>{pageHead.pagehead}</h2></div>
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
                    <div className="" id="systemLogViewer">
                        <div className="syslog">
                            <Tabelify
                              style={{margin:'30px'}}
                              {...this.state.tableConfig}

                              />
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
export default SyslogViewer;
