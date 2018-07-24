import React from 'react';
import { browserHistory, Link } from 'react-router';
import axios from 'axios';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
//import Checkbox from '../common/Checkbox';
import classnames from 'classnames';
import TextInput from '../common/TextInput';
import getCurrentDate from '../common/Date';
import getUserDetails from '../common/CredentialDomain';
import Tabelify from '../react-tabelify/Tabelify';
var _ = require('underscore');


class TabSecondary extends React.Component{
	constructor(props) {
		super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.state = {
      errors:{},
      "msgSuccess": "",
      "msgFailure": "",
      "tableConfig": {
        data:[],
        isLoading: true,
        "columnMetadata": [
            {
              "columnName": "image",
              "displayName": "Product Image"
            },
            {
              "columnName": "name",
              "displayName": "Product Name"
            },
            {
              "columnName": "upc",
              "displayName": "Barcode",
            },
            {
              "columnName": "productgroupname",
              "displayName": "Product Group Name",
            },
            {
              "columnName": "invcap",
              "displayName": "Threshold Limit",
            },
            {
              "columnName": "measuringunitname",
              "displayName": "Measuring Unit Name",
            },
            {
              "columnName": "price",
              "displayName": "Price",
            },

            {
            "columnName": "id",
            "displayName": "Action",
            render:()=>{
                return <div></div>
            },
            "flexBasis":'190px'
            }
        ],
        "currentPage": 1,
        "showCheckbox": true,
        "onChangeGrid": this.onChangeGrid,
        "selectedRows": {},
        "onRowClick": this.onRowClick,
        "resultsPerPage": 10,
        "localSearch": true,
        "btnText": 'Add Product',
        "btnUrl":'products/new',
        "showImage": true
      }
    }
    this.deleteProduct = this.deleteProduct.bind(this);
    this.resetHandler = this.resetHandler.bind(this)
	}

  componentDidMount() {
    this.getAllProducts();
  }

  //Modify product handler redirects to single product page
  modifyProduct(productId){
    browserHistory.push(`/products/${productId}`)
  }
  resetHandler(){
    console.log('cli')
  }
  //Delete the product
  deleteProduct(productId){
    var that = this;
    var delQuery = {};
    // match id to splice from the product list
    var index = -1;
    var _totalproduct = this.state.tableConfig.data.length;
    for( var i = 0; i < _totalproduct; i++ ) {
      if(this.state.tableConfig.data[i].id == productId){
        index = i;
        break;
      }
    }
    this.state.tableConfig.data.splice( index, 1 );
    delQuery['isdeleted'] = true;
    delQuery['ProductID'] = productId;
    delQuery['userdetails'] = getUserDetails();

    axios.post(`${process.env.API_HOST}/ManageProducts.svc/DeleteProduct/json`, delQuery)
     .then(function (response) {
        if (response.data.status >= 400) {
          that.setState({
            msgFailure: response.data.statusMessage
          })
        } else {
          that.setState({
            msgSuccess: response.data.statusMessage
          });
            setTimeout(function(){
                that.setState({"msgSuccess":""})
            }, 5000)
        }
     })
    .catch(function (error) {
       console.log(error);
    });
  }


//Fetch All products
getAllProducts(){
    var that = this;
    var reqQuery = {};
    reqQuery['ismobileaccess'] = false;
    reqQuery['isall'] = true;
    reqQuery["isdisplaymetaproducts"] = true;
    reqQuery['userdetails'] = getUserDetails();

    console.log(reqQuery)
    axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetProducts/json`, reqQuery)
    .then(function (response) {
      console.log(response)
        if (response.data.status >= 400) {
            that.setState({
              msgFailure: response.data.statusMessage
            })
        }
        else {
            if(response.data.productsList == null) response.data.productsList = [];
            var tableConfig = that.state.tableConfig;
            var totalProducts = response.data.productsList.length;

            tableConfig['data'] = response.data.productsList;
            tableConfig['isLoading'] = false;
            that.setState({
                tableConfig: tableConfig
            });
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}
  //handle grid click
  onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
    });
  }
  render(){
        var {msgFailure, msgSuccess} = this.state;
        return <div className="tab-pane active" id="products">
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        {msgSuccess}
        </div>}

        <Tabelify
          urlHandler
          resetHandler = {this.resetHandler}
          style={{margin:'30px'}} {...this.state.tableConfig}
          editHandler={this.modifyProduct}
          deleteHandler={this.deleteProduct}
        />
    </div>
  }
}
export default TabSecondary;
