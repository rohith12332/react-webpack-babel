var React = require('react');
import { browserHistory, Link } from 'react-router';
import Select from 'react-select';
var GridHeader = require('./GridHeader.js');
var GridFooter = require('./GridFooter.js');
var GridRows = require('./GridRows.js');
import Spinner from '../common/spinner';
import _ from "underscore";

var SmartGrid = React.createClass({
    getOrderedColumns: function (columnMetadata) {
        return columnMetadata;
    },
    onChangeGrid: function (event, data) {
        data = data || {};
        this.props.onChangeGrid && this.props.onChangeGrid(event, data, this.props.elementId);
    },
    getDefaultProps: function () {
        return ({
            className: '',
            data: null,
            resultsPerPage: 10,
            currentPage: 1,
            sortColumn: '',
            sortDirection: '',
            forceRender: false,
            loading: false,
            layout: '',
            actionList: [],
            onActionClick: ()=> {
            },
            onHeaderClick: null,
            onFooterClick: null,
            showHeader: true,
            showFooter: true,
            selectedRows: {},
            elementId: null,
            searchable: false,
            base64: "data:image/jpeg;base64,",
            transform: function (response, elementId) {
                return response.body.data;
            }
        })
    },
    modalHandler: function(event){
        event.preventDefault();
        this.props.modalHandler();
    },
    resetHandler: function(event){
        event.preventDefault();
        this.props.resetHandler();
    },
    sortDataOnColumn: function (data) {

        if (this.props.sortColumn === '')
            return data;
        data.map((item, index)=>{
            item['_index']=index;
        })
        data.sort((a, b)=> {
            if (this.props.sortDirection === 'ASC') {
                let num = a[this.props.sortColumn].toString().localeCompare(b[this.props.sortColumn].toString());
                if(num>0)
                    return 1;
                if(num <0)
                    return -1;
                if(a['_index']>b['_index'] )
                    return 1;
                else
                    return -1
            }
            else {
                let num =  b[this.props.sortColumn].toString().localeCompare(a[this.props.sortColumn].toString());
                if(num>0)
                    return 1;
                if(num <0)
                    return -1;
                console.log(a);
                console.log(b);
                console.log();
                if(a['_index']>b['_index'] )
                    return 1;
                else
                    return -1
            }
        })
        return data;
    },
    getResponseData: function () {
        var startIndex = (this.props.currentPage - 1) * this.props.resultsPerPage;
        var endIndex = startIndex + this.props.resultsPerPage;
        var data = this.sortDataOnColumn(this.props.data);
        data = this.patternMatch(this.state.search,data);
        console.log(data)
        data = data.slice(startIndex, endIndex);
        return data;
        console.log(data)
    },
    patternMatch: function(text,data){
        if(!text){return data}
        var that = this;
        var columnMetadata = this.props.columnMetadata;

        var filteredData = [];
        data.map( row=>{
            var rowMatched = false;
            let columns = Object.keys(row);
            for(let i=0;i<columns.length;i++){
                if(columns[i]==='_index')
                    continue;
                let columnValue = row[columns[i]];
                let formattedValue = columnValue;
                if(typeof formattedValue === 'string' && formattedValue.toLowerCase().indexOf(text.trim().toLowerCase())!=-1){
                    rowMatched = true;
                    break;
                }
            }
            if(rowMatched===true)
                filteredData.push(row);
        })
        return filteredData;
    },
    searchHandler: function(event) {
        this.setState({
            search: event.target.value,
            
        })
       this.props.onChangeGrid(event, {
                currentPage: 1
            });
        
    },


    selectGroupHandler: function(element){
        this.props.handleGroupSelect(element);
        this.setState({
            PrinterGroupOptions: element
        })
    },
    getInitialState: function(){
        return {
            PrinterGroupOptions: {
                label: '',
                value: ''
            }
        };
    },
    render: function () {
        console.log(this.state.search)
        console.log(this.props)
        console.log(this.props.data.length)
        console.log(this.props.resultsPerPage)
        console.log(this.props.currentPage)
        var PrinterGroupOptions = this.props.PrinterGroups;
        if(PrinterGroupOptions !== undefined){
            PrinterGroupOptions = PrinterGroupOptions.map(function(o) {
                return {
                  label: o.name,
                  value: o.id
                }
            });
        }

        var data = this.props.data ? this.getResponseData() : null;
        if(this.props.data.length<this.props.resultsPerPage && this.props.currentPage>1){
            this.props.onChangeGrid(null, {
                currentPage:1
            });
        }



        var resultsOnPage = data && data.length <= this.props.resultsPerPage ? data.length : this.props.resultsPerPage;
        //console.log(this.props.isLoading)
        return (
            <div className={'gridParent'}>
            {
                this.props.localSearch?
                <div className="row">
                    <div className="col-sm-12">
                      <div className="table-info-topwrap">
                        <div className="tble-left-links">
                          <ul>
                            <li>
                              <div className="searchInput">
                              <input
                                type="SmartInput"
                                placeholder="Enter Search Keyword"
                                value={this.state.search}
                                className="form-control"
                                onChange={this.searchHandler}
                                />
                                <label htmlFor="search" className="icon icon-1202" rel="tooltip" title="search"></label>
                              </div>
                            </li>
                             {this.props.moveTo && <li className="moveto-wrap">
                             <Select
                              name="selectrole"
                              searchable={this.props.searchable}
                              value={this.state.PrinterGroupOptions.value}
                              options={PrinterGroupOptions}
                              onChange={this.selectGroupHandler}
                              />
                              </li>}
                              {/* Show Reset Button When Moving Product to Another Group*/}
                              {this.props.moveTo && <li className="reset-list">
                              <div className="blue-links">
                                <Link to="#" onClick={this.resetHandler}><i className="fa fa-refresh"></i>&nbsp;&nbsp;&nbsp;Reset</Link>
                                </div>
                              </li>}
                          </ul>
                        </div>
                        {!this.props.btnAdd &&
                        <div className="tble-right-links">
                          <ul>
                            <li className="add-user-right-link">
                              <div className="blue-links">
                                {this.props.modalHandler && <Link to="#" onClick={this.modalHandler}><i className="icon icon-1189"></i>{this.props.btnText}</Link>}
                                {this.props.urlHandler && <Link to={this.props.btnUrl}><i className="icon icon-1189"></i>{this.props.btnText}</Link>}
                              </div>
                            </li>
                          </ul>
                        </div> }

                      </div>
                    </div>
                </div>
                :null
                }
                <div className="table-responsive dashbord-table">
                <table className="table table-striped table-hover table-fw-widget table-curved">
                    <tr>
                        <td>
                <div className="smartGridScroll">
                    <div className={'smartGrid '+ this.props.layout}
                         style={{width:this.props.width}}>

                        <GridHeader {...this.props}
                            className=''
                            style={{}}
                            onChangeGrid={this.onChangeGrid}
                            resultsOnPage={resultsOnPage}
                            data={data}
                        />
                        {this.props.isLoading && <Spinner />}
                        <GridRows {...this.props}
                            className=''
                            style={{}}
                            onChangeGrid={this.onChangeGrid}
                            resultsOnPage={resultsOnPage}
                            data={data}
                        />

                    </div>
                </div>

                <GridFooter {...this.props}
                    className=''
                    style={{}}
                    currentPage={parseInt(this.props.currentPage)}
                    totalCount={this.props.data.length}
                    onChangeGrid={this.onChangeGrid}
                    resultsOnPage={resultsOnPage}/>
                    </td>
                    </tr>
            </table>
            </div>
            </div>
        );

    }
});

module.exports = SmartGrid;


