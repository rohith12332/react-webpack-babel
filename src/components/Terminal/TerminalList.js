import React from 'react';
import {browserHistory} from 'react-router';
import Tabelify from '../react-tabelify/Tabelify';

var _ = require('underscore');

var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Terminal Name"
    },
    {
        "columnName": "profitcentername",
        "displayName": "Profit Center"
    },
    {
        "columnName": "electronicpaymentname",
        "displayName": "Electronic Processing Config",
    },
    {
        "columnName": "localprintername",
        "displayName": "Local Printer",
    },
    {
        "columnName": "menugroupname",
        "displayName": "Menu Group",
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

class TerminalList extends React.Component {
	constructor(props) {
    super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
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
        btnText: 'Add Terminal',
        btnUrl:'terminal/new'
      }

    }
    this.deleteTerminal = this.deleteTerminal.bind(this);
    this.modifyTerminal = this.modifyTerminal.bind(this);

  }

  onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
    });
  }

  deleteTerminal(terminalid){
    this.props.onRemoveTerminal(terminalid);
  }

  modifyTerminal(terminalid){
    browserHistory.push(`/terminal/${terminalid}`)
  }
   render(){
    const terminal = this.props.terminal;
        return(
        <div>
          <Tabelify
          style={{margin:'30px'}} data={terminal} {...this.state.tableConfig}
          urlHandler
          editHandler={this.modifyTerminal}
          deleteHandler={this.deleteTerminal}
          />
      </div>
        );
    }
    }
export default TerminalList;

