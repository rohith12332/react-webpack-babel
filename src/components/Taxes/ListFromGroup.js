import React, {PropTypes} from 'react';
import { browserHistory, Link } from 'react-router';

import Tabelify from '../react-tabelify/Tabelify';

var _ = require('underscore');


//Table Column Defination
var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Tax Config Name"
    },
    {
        "columnName": "rate",
        "displayName": "Rate",
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
    this.handleAddTaxGroup = this. handleAddTaxGroup.bind(this);
    this.handleungroupTax = this.handleungroupTax.bind(this);
    this.handleGroupSelect = this.handleGroupSelect.bind(this);
    this.modalHandler = this.modalHandler.bind(this);
    this.resetHandler = this.resetHandler.bind(this);



    this.state = {
      taxes:[],
      tableConfig: {
          columnMetadata: columnMetadata,
          currentPage: 1,
          showCheckbox:true,
          onChangeGrid: this.onChangeGrid,
          selectedRows: {},
          onRowClick: this.onRowClick,
          resultsPerPage: 10,
          localSearch: true,
          btnText: 'Add Tax Group'
      }
    }
  }

  handleAddTaxGroup(event){
    event.preventDefault();
    this.props.open();
  }


  handleungroupTax(id){
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
      taxes: data.selectedRows,
      tableConfig: tableConfig
    });
  }

  handleGroupSelect(element){
    var stateObj = {};
    var finalObj = [];

    stateObj = this.state.taxes;

    for (var key in stateObj) {
      finalObj.push(stateObj[key].data);
    }

    this.props.updateOnMove(element, finalObj);

    console.log(this.state.tableConfig.selectedRows)
  }

  render(){
    //console.log(this.props)
    return(
      <div className="products-right-table">
      <Tabelify
        style={{margin:'30px'}} {...this.state.tableConfig}
        data={this.props.taxconfigurationList}
        ungroupHandler={this.handleungroupTax}
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