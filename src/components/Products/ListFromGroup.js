import React, {PropTypes} from 'react';
import { browserHistory, Link } from 'react-router';

import Tabelify from '../react-tabelify/Tabelify';
var _ = require('underscore');

//Table Column Defination
var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Product Name"
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


class ListFromGroup extends React.Component{
  constructor(props) {
    super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.handleAddPrinterGroup = this.handleAddPrinterGroup.bind(this);
    this.handleungroupProduct = this.handleungroupProduct.bind(this);
    this.handleGroupSelect = this.handleGroupSelect.bind(this);
    this.modalHandler = this.modalHandler.bind(this);
    this.resetHandler = this.resetHandler.bind(this);

    this.state = {
      products:[],
      tableConfig: {
          columnMetadata: columnMetadata,
          currentPage: 1,
          showCheckbox:true,
          onChangeGrid: this.onChangeGrid,
          selectedRows: {},
          onRowClick: this.onRowClick,
          resultsPerPage: 10,
          localSearch: true,
          btnText: 'Add Product Group'
      }
    }
  }

  handleAddPrinterGroup(event){
    event.preventDefault();
    this.props.open();
  }

  handleungroupProduct(id){
    this.props.handleUngroup(id)
  }

  modalHandler(event){
    this.props.modalHandler()
  }

  resetHandler(event){
      this.props.resetHandler()
  }
  onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);

    this.setState({
      products: data.selectedRows,
      tableConfig: tableConfig
    });
  }

  handleGroupSelect(element){
    var stateObj = {};
    var finalObj = [];

    stateObj = this.state.products;
    for (var key in stateObj) {
      finalObj.push(stateObj[key].data);
    }
    this.props.updateOnMove(element, finalObj);
  }

  render(){
    return(
      <div className="products-right-table">
      <Tabelify
        style={{margin:'30px'}} {...this.state.tableConfig}
        data={this.props.productsList}
        ungroupHandler={this.handleungroupProduct}
        PrinterGroups={this.props.PrinterGroups}
        modalHandler={this.modalHandler}
        moveTo
        resetHandler={this.resetHandler}
        handleGroupSelect={this.handleGroupSelect}
      />
      </div>
    )
  }
}
export default ListFromGroup;
