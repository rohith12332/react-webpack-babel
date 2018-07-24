import React from 'react';
import {browserHistory} from 'react-router';
import Tabelify from '../react-tabelify/Tabelify';

var _ = require('underscore');

var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Vendor Shop Name"
    },
    {
        "columnName": "firstname",
        "displayName": "Name"
    },
    {
        "columnName": "emailaddress",
        "displayName": "Email Address",
    },
    {
        "columnName": "telephone",
        "displayName": "Phone",
    },
    {
        "columnName": "city",
        "displayName": "City",
    },
    {
        "columnName": "country",
        "displayName": "Country",
    },
    {
        "columnName": "id",
        "displayName": "Action",
        render:()=>{
            return <div></div>
        },
        "flexBasis":'190px'
    }
];

class VendorList extends React.Component {
	constructor(props) {
    super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.deletevendor = this.deletevendor.bind(this);
    this.state = {
      tableConfig: {
        columnMetadata: columnMetadata,
        currentPage: 1,
        showCheckbox: false,
        onChangeGrid: this.onChangeGrid,
        selectedRows: {},
        onRowClick: this.onRowClick,
        resultsPerPage: 10,
        localSearch: true,
        btnText: 'Add Vendor',
        btnUrl:'vendors/new'
      }
    }
  }

  onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
    });
  }

  deletevendor(vendorid){
    this.props.onRemoveVendor(vendorid);
  }

  modifyVendor(vendorid){
    browserHistory.push(`/vendors/${vendorid}`)
  }
   render(){
    const vendors = this.props.vendors;
    	return(
        <div>
          <Tabelify
          style={{margin:'30px'}} data={vendors} {...this.state.tableConfig}
          urlHandler
          editHandler={this.modifyVendor}
          deleteHandler={this.deletevendor}
          />
          </div>
    	);
    }
	}
export default VendorList;
