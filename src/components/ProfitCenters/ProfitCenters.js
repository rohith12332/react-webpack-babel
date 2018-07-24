import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from '../common/Checkbox';
import DefaultLayout from '../common/DefaultLayout';
import {browserHistory, Link } from 'react-router';
import 'react-datepicker/dist/react-datepicker';
import TextInput from '../common/TextInput';
import classnames from 'classnames';
import moment from 'moment';
import getUserDetails from '../common/CredentialDomain';
import TimePicker from 'rc-time-picker';
import Tabelify from '../react-tabelify/Tabelify';
var _ = require('underscore');
//Table Column Defination
var columnMetadata = [{
    "columnName": "name",
    "displayName": "Profit Center Name"
  },
  {
    "columnName": "id",
    "displayName": "Action",
    render: () => {
      return <div></div>
    },
    "flexBasis": '190px'
  }
];

class ProfitCenter extends React.Component {
    constructor(props) {
      super(props);
      this.onChangeGrid = this.onChangeGrid.bind(this);
      this.state = {
        showModal: false,
        msgFailure: "",
        msgSuccess: "",
        showEditModal: false,
        ProfitCenters: [],
        selectedOption: '1',
        Start_Time: [],
        End_Time: [],
        errors: {},
        isLoading: true,
        pageHead: {
          pagehead: 'Profit Centers',
          dashboard: 'Dashboard',
          setup: 'Setup'
        },
        singleprofitcenter: {},
        profitcenter: {
          "createdby": "",
          "createddate": "",
          "id": "1627aea5-8e0a-4371-9022-9b504344e724",
          "isdeleted": false,
          "modifiedby": "String content",
          "modifieddate": "String content",
          "name": "String content",
          "store_id": "1627aea5-8e0a-4371-9022-9b504344e724",
          "surchargeableproductgroups": [],
          "surchargegroupid": "1627aea5-8e0a-4371-9022-9b504344e724",
          "taxableproductgroups": [],
          "taxgroupid": "1627aea5-8e0a-4371-9022-9b504344e724",
        },
        tableConfig: {
          data: [],
          columnMetadata: columnMetadata,
          currentPage: 1,
          showCheckbox: false,
          onChangeGrid: this.onChangeGrid,
          selectedRows: {},
          onRowClick: this.onRowClick,
          resultsPerPage: 10,
          localSearch: true,
          btnText: 'Add Profit Center',
          btnUrl: 'ProfitCenters/new'
        }
      }
      this.RemoveProfitcenter = this.RemoveProfitcenter.bind(this);
      this.EditProfitCenter = this.EditProfitCenter.bind(this);
    }

    RemoveProfitcenter(ProfitCenterID) {
      var id;
      var DelProfitCenter = {};
      var that = this;
      id = ProfitCenterID;
      var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
      var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
      var credentials = getUserDetails();
      credentials["storeuniquekey"] = storeuniquekey;
      credentials["domainuniquekey"] = domainuniquekey;
      var index = -1;
      var _totalProfitCenters = this.state.ProfitCenters.length;
      for (var i = 0; i < _totalProfitCenters; i++) {
        if (this.state.ProfitCenters[i].id == id) {
          index = i;
          break;
        }
      }
      this.state.ProfitCenters.splice(index, 1);
      this.setState({
        ProfitCenters: this.state.ProfitCenters
      });
      DelProfitCenter['profitCenterID'] = ProfitCenterID;
      DelProfitCenter['userdetails'] = getUserDetails();
      DelProfitCenter['isdeleted'] = true;
      console.log(JSON.stringify(DelProfitCenter));
      const request = new Request(`${process.env.API_HOST}/ManageProfitCenters.svc/DeleteProfitCenter/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(DelProfitCenter)
      });
      return fetch(request).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.statusCode >= 400) {
          that.setState({
            msgFailure: data.statusMessage
          })
          setTimeout(function() {
            that.setState({
              msgFailure: ''
            })
          }, 5000)
        } else {
          that.setState({
            msgSuccess: data.statusMessage
          })
          setTimeout(function() {
            that.setState({
              msgSuccess: ''
            })
            browserHistory.push('/ProfitCenters')
          }, 5000)
        }
      }).catch(function(error) {
        return error;
      })
    }

    GetProfitCenters() {
          var that = this;
          var credentials = {};
          var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
          credentials["userdetails"] = getUserDetails();
          credentials["userdetails"]['storeuniquekey'] = storeuniquekey;
          const request = new Request(`${process.env.API_HOST}/ManageProfitCenters.svc/GetProfitCenters/json`, {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify(credentials)
          });
          fetch(request).then(function(response) {
            return response.json();
          }).then(function(data) {
            var tableConfig = that.state.tableConfig;
            tableConfig['data'] = data.ProfitCenterList;
            tableConfig['isLoading'] = false;
            that.setState({
              tableConfig: tableConfig,
              ProfitCenters: data.ProfitCenterList
            });
          });
        }
    componentDidMount() {
      this.GetProfitCenters();
    }
    onChangeGrid(event, data) {
      var tableConfig = this.state.tableConfig;
      _.extend(tableConfig, data);
      this.setState({
        tableConfig: tableConfig
      });
    }
    EditProfitCenter(ProfitCenterid) {
      browserHistory.push(`/profitcenters/${ProfitCenterid}`)
    }
render()
  {
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
  	 const {pageHead,PricingIntervals,msgFailure,msgSuccess} = this.state;
     const format = 'h:mm a';
     const active = "day-active";
     const inactive = "";
  	 return(
        <DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './profit-center-head.svg')}/> <h2>{pageHead.pagehead}</h2></div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                      <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
            </div>
            <div className="master-table" id="ProfitCenters">
            {msgFailure &&
              <div className="alert alert-warning alert-dismissible" role="alert"> <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> {msgFailure} </div>} {msgSuccess &&
              <div className="alert alert-success alert-dismissible" role="alert"> <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> {msgSuccess} </div>}
              <div className="row">
                <div className="col-sm-12">
                    <div className="">
                      <div className="" id="ProfitCenters">
                  <Tabelify style={{margin: '30px'}} {...this.state.tableConfig} urlHandler deleteHandler={this.RemoveProfitcenter} editHandler={this.EditProfitCenter} /> </div>
                  </div>
                </div>
              </div>
            </div>
        </DefaultLayout>

  	)
  }
}
export default ProfitCenter;