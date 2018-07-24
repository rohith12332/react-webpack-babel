import React from 'react';
import DefaultLayout from '../common/DefaultLayout'
import Select from 'react-select';
import TextInput from '../common/TextInput';
import { browserHistory, Link } from 'react-router';
import classnames from 'classnames';
import getUserDetails from '../common/CredentialDomain';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
//import DatePicker from 'react-datepicker';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DatePicker from "material-ui/DatePicker";
import getCurrentDate from '../common/Date';
import Tabelify from '../react-tabelify/Tabelify';
import moment from 'moment';
import axios from 'axios';

var _ = require('underscore');

class Inventory extends React.Component{
	constructor(props) {
		super(props);
		this.onChangeGrid = this.onChangeGrid.bind(this);
		this.state = {
			invoice_value:{
				label:'',
				value:'1627aea5-8e0a-4371-9022-9b504344e724'
			},
			product_value:{
				label:'String content',
				value:'String content'

			},
			pageHead:{
				pagehead:'Inventory',
				dashboard: 'Dashboard',
				setup: 'Setup'
			},
			"tableConfig": {
			data:[],
			isLoading: true,
			"columnMetadata": [

			    {
			        "columnName": "notes",
			        "displayName": "Name"
			    },
			    {
			        "columnName": "invoicenumber",
			        "displayName": "Invoice Number"
			    },
			    {
			        "columnName": "prodexpirydate",
			        "displayName": "Expiry Date",
			    },
			    {
			        "columnName": "claimqty",
			        "displayName": "Damaged Qty",
			    },
                {
			        "columnName": "onhandqty",
			        "displayName": "Current Qty",
			    },
			    {
			        "columnName": "measuringunitname",
			        "displayName": "Units",
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
			"btnText": 'Add Inventory',
			 btnUrl: 'inventory/new',
			"showImage": true
			},
			toDate:'',
			fromDate :'',
			toDateValue :'',
			fromDateValue:'',
			getInvoiceDate:'',
			showModal: false,
			InvoicesList:[],
			productsList:[],
			Inventorylist:[],
			errors:{}
		}

		this.updateInvoice 			= this.updateInvoice.bind(this);
		this.updateProduct 			= this.updateProduct.bind(this);
		this.InventorySearch 		= this.InventorySearch.bind(this);
		this.getInvoiceDate 		= this.getInvoiceDate.bind(this);
		this.getToDate 				= this.getToDate.bind(this);
		this.getFromDate 			= this.getFromDate.bind(this);
		this.deleteinventory        = this.deleteinventory.bind(this);
		this.clear                  = this.clear.bind(this);
		//this.modifyInventory 		= this.modifyInventory.bind(this);

	}

	componentDidMount() {
		this.getAllInvoices();
		this.getAllProducts();
		this.getInventories('String content','String content','1627aea5-8e0a-4371-9022-9b504344e724','String content');
	}

	modifyInventory(id){
    	browserHistory.push(`/inventory/${id}`)
    }

    clear()
    {
    	this.setState({
    		 toDate:'',
    		 fromDate:'',
    		 product_value:{
				label:'String content'
			},
			invoice_value:{
				value:'1627aea5-8e0a-4371-9022-9b504344e724'
			}
    	});
        this.getInventories('String content','String content','1627aea5-8e0a-4371-9022-9b504344e724','String content');
    }




	 deleteinventory(itemId){

      var that = this;
      var delQuery = {};
      var index = -1;
      var _totalinventory = this.state.Inventorylist.length;

      for( var i = 0; i < _totalinventory; i++ ) {
        if(this.state.Inventorylist[i].id == itemId){
          index = i;
          break;
        }
      }
      this.state.Inventorylist.splice( index, 1 );
      this.setState({Inventorylist: this.state.Inventorylist});

      delQuery['isdeleted'] = true;
      delQuery['Inventoryid'] = itemId;
      delQuery['userdetails'] = getUserDetails();

      const request = new Request(`${process.env.API_HOST}/ManageInventoryCountLog.svc/DeleteInventorycountlog/json`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(delQuery)
      });

      return fetch(request).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.statusCode >= 400) {
          that.setState({
            msgFailure: data.statusMessage
          })
        } else {
          that.setState({
            msgSuccess: data.statusMessage
          })
          setTimeout(function() {
            that.setState({
              msgSuccess: ''
            })
          }, 2000)
        }
      }).catch(function(error) {
        return error;
      })
  }




	InventorySearch(element)
	{
		var that = this;

		var productname = this.state.product_value.label;
		var invoiceid   = this.state.invoice_value.value;
		var todate      = this.state.toDate;
		var fromdate    = this.state.fromDate;
		//this.getInventories('01/01/2017','UPC-12345678','1627aea5-8e0a-4371-9022-9b504344e724','07/07/2017');
		this.getInventories(fromdate,productname,invoiceid,todate);


	}



	getAllProducts(){
	    var that = this;
	    var reqQuery = {};
	    reqQuery['userdetails'] = getUserDetails();
	    reqQuery['isall'] = true;
	    reqQuery["ismobileaccess"] = false;
	    reqQuery["isdisplaymetaproducts"] = false;
	    console.log(JSON.stringify(reqQuery))


	    axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetProducts/json`, reqQuery)
	     .then(function (response) {
	        console.log(response)
	      if (response.data.status >= 400) {
	        that.setState({
	          msgFailure: response.data.statusMessage
	        })
	      } else {
	        if(response.data.productsList == null) response.data.productsList = [];
	        console.log(response.data.productsList);
	        that.setState({
	          productsList: response.data.productsList
	        });
	      }

	     })
	    .catch(function (error) {
	       console.log(error);
	    });
	}



    getInventories(fromdate,productname,invoiceid,todate){
	  var that = this;
	  var reqQuery = {};
	  if(todate == '')
	   {
          todate ='String content';
	   }
	  if(fromdate =='')
	   {
         fromdate ='String content';
	   }

	  reqQuery['fromdate'] =fromdate;
	  reqQuery['index'] ='1';
	  reqQuery['inventorysearchtext'] =productname;
	  reqQuery['invoiceid'] =invoiceid;
	  reqQuery['recordcount'] ='20';
	  reqQuery['todate'] =todate;
	  reqQuery['userdetails'] = getUserDetails();

	  console.log(JSON.stringify(reqQuery));

	  const request = new Request(`${process.env.API_HOST}/ManageInventoryCountLog.svc/GetAllInventorycountlog/json`, {
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
	      if(data.InventorycountlogList == null) data.InventorycountlogList = [];
	      var tableConfig = that.state.tableConfig;
	      var inventorylen = data.InventorycountlogList.length;
	      var Inventoryarr = [];
	        for (var i = 0; i < inventorylen; i++) {
	            var obj = data.InventorycountlogList[i];
	            //obj["InvoiceNumber"] =that.getInvoiceNumber(obj.invoicelineitem_id);
	            // obj["prodexpirydate"] = moment(obj.prodexpirydate,'YYYY-MM-DD').format("DD-MM-YYYY");
	            Inventoryarr.push(obj);
	      	}

	      tableConfig['data'] = Inventoryarr;
	      tableConfig['isLoading'] = false;
	      that.setState({
	        tableConfig: tableConfig,
	        Inventorylist :Inventoryarr
	      });

	   });
	}

	getInvoiceNumber(id)
	{
		 var datalen =this.state.InvoicesList;
		 for (var i = 0; i < datalen.length; i++) {
		 	if(datalen[i].id==id)
		 	{
		 		return datalen[i].name;
		 	}
		 }
	}

	//Fetch All Vendors
	getAllInvoices() {

	var that = this;
	var credentials = {};
	  credentials['fromdate'] ='String content';
	  credentials['index'] ='1';
	  credentials['invoicetextsearch'] ='String content';
	  credentials['vendorAccountId'] ='1627aea5-8e0a-4371-9022-9b504344e724';
	  credentials['recordcount'] ='20';
	  credentials['todate'] ='String content';
	  credentials['userdetails'] = getUserDetails();



		const request = new Request(`${process.env.API_HOST}/ManageInvoiceLineItems.svc/GetAllInvoiceLineItems/json`, {
		  method: 'POST',
		  headers: new Headers({
		    'Content-Type': 'application/json'
		  }),
		  body: JSON.stringify(credentials)
		});
		fetch(request)
		  .then(function(response) {
		    return response.json();
		  }).then(function(data) {
		    that.setState({
		      InvoicesList: data.InvoiceList
		    });
		});
	}


	getInvoiceDate(element){
		var momentParsed;

		this.setState({
			getInvoiceDate:element
		})
	}

 convertdate(str) {
    var mnths = {
        Jan:"01", Feb:"02", Mar:"03", Apr:"04", May:"05", Jun:"06",
        Jul:"07", Aug:"08", Sep:"09", Oct:"10", Nov:"11", Dec:"12"
    }
    return [ parseInt(str.substring(8,10)), mnths[str.substring(4,7)], parseInt(str.substring(11,15)) ].join("-");
   }

/*	getFromDate(element){
		var fromDateValue = this.convertdate(element.toDate().toString());
		this.setState({
			fromDate:element,
			fromDateValue: fromDateValue
		})
	}*/

  openDatePickerDay = () => {
    this.refs.datePickerDay.focus();
  };

  openStartDatePicker = () => {
    this.refs.datePickerStartDate.focus();
  };

  openEndDatePicker = () => {
    this.refs.datePickerEndDate.focus();
  };


  getFromDate(event, date){
      var FromDate = moment(date).format("DD-MM-YYYY");
      console.log(typeof(FromDate))
      this.setState({
          fromDate:date
      })
  }

/*    getToDate(element){
    	var toDateValue = this.convertdate(element.toDate().toString());
		this.setState({
			toDate:element,
			toDateValue:toDateValue
		})
	}*/

  getToDate(event, date){
      var ToDate = moment(date).format("DD-MM-YYYY");
      this.setState({
          toDate:date
      })
  }

	updateInvoice(element){

		this.setState(
		{
			invoice_value:{
				label:element.label,
				value:element.value
			}
		}
		)
	}

	updateProduct(element)
	{

      // based on value of product selected we vil get  barcode if exists
      this.setState(
		{
			product_value:{
				label:element.label,
				value:element.value
			}
		}
		)
	}

	onChangeGrid(event, data) {
		var tableConfig = this.state.tableConfig;
		console.log(tableConfig)
		_.extend(tableConfig, data);
		this.setState({
		  tableConfig: tableConfig
		});
	}
	render(){
		console.log(this.props);
		var {pageHead, InvoicesList,productsList,msgSuccess,msgFailure} = this.state;

		InvoicesList = InvoicesList.map(function(o) {
	        return {
	          label: o.name,
	          value: o.id
	        }
    	});

    	productsList = productsList.map(function(o) {
	        return {
	          label: o.name,
	          value: o.id
	        }
    	});
	    var currentDomain = window.sessionStorage.getItem("currentdomainname");
	    var currentStore = window.sessionStorage.getItem("currentstorename");
		return(

			 <DefaultLayout>
			    <div className="page-head inner__pageHead">
					<div className="domain-icon"> <img src={require( './Inventory.svg')}/> <h2>{pageHead.pagehead}</h2></div>
					<ol className="breadcrumb">
		                <li><Link to={`/domains`}>{currentDomain}</Link></li>
		                <li><Link to={`/stores`}>{currentStore}</Link></li>
						<li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
						<li><Link to={`/InventoryLanding`}>Inventory </Link></li>
						<li className="active">Inventory Details</li>
					</ol>
			    </div>
					<main>
					<div className="master-table" id = "inventory">
					{msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
				          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				          {msgFailure}
				        </div>}
				        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
				          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				          {msgSuccess}
				        </div>}
						<div className="row">
							<div className="col-sm-12">
								<div  id="Inventory">
								 	<div className="row">
						              <div className="col-sm-12 col-md-6 col-lg-3">
						                <div className="form-group">
						                  <label className="control-label">Invoice</label>
									        <Select
									          name="country"
									          value={this.state.invoice_value.value}
									          options={InvoicesList}
									          onChange={this.updateInvoice}
									          />
						                </div>
						              </div>

						              <div className="col-sm-12 col-md-6 col-lg-2">


	                                 <div className="form-group">
						                  <label className="control-label">Product</label>
									        <Select
									          name="country"
									          value={this.state.product_value.value}
									          options={productsList}
									          onChange={this.updateProduct}
									          />
						                </div>



								        {/*<div className={classnames('form-group', { error: !!this.state.errors.productName})}>
								            <TextInput
								              type="text"
								              name="productName"
								              label="product Name #"
								              value={this.state.productName}
								              placeholder=""
								              className={classnames('form-control', { error: !!this.state.errors.productName})}
								              onChange={this.onChange}
								            />
								            <span>{this.state.errors.productName}</span>
								        </div>*/}

						              </div>

									 <MuiThemeProvider>
				                          <div className="row">
				                          <div className={classnames('form-group col-sm-12 col-md-6 col-lg-3 reactDatepicker', { error: !!this.state.errors.fromDate})}>
				                          <label className="control-label">Dated From</label>
				                            <div className="datepicker-wrapper">
				                              <DatePicker
				                                id="datePickerStartDate"
				                                ref='datePickerStartDate'
				                                formatDate={(date) => moment(date).format('DD-MM-YYYY')}
				                                onChange={this.getFromDate}
				                                value={this.state.fromDate}
				                                className="m-datePicker"
				                                textFieldStyle={{'height':'40px'}}
				                              />
				                            </div>
				                            <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
				                          <span className="clearfix" style={{'display':'block'}}>{this.state.errors.fromDate}</span>
				                        </div>
				                          <div className={classnames('form-group col-sm-12 col-md-6 col-lg-3 reactDatepicker', { error: !!this.state.errors.toDate})}>
				                          <label className="control-label">Dated To</label>
				                            <div className="datepicker-wrapper">
				                              <DatePicker
				                                onChange={this.getToDate}
				                                value={this.state.toDate}
				                                ref='datePickerEndDate'
				                                id="datePickerEndDate"
				                                formatDate={(date) => moment(date).format('DD-MM-YYYY')}
				                                className="m-datePicker"
				                                textFieldStyle={{'height':'40px'}}
				                              />
				                            </div>
				                            <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
				                            <span>{this.state.errors.toDate}</span>
				                        </div>
				                      </div>
				                    </MuiThemeProvider>


{/*						              <div className="col-sm-12 col-md-6 col-lg-2">
	                                   <div className="form-group reactDatepicker">
								        <label className="control-label"> Date Range From</label>
								        <DatePicker className="react-datepicker-txt"
								          selected={this.state.fromDate}
								          value={this.state.fromDate}
								          onChange={this.getFromDate}
								          peekNextMonth
								          showMonthDropdown
								          showYearDropdown
								          dropdownMode="select" />
								          <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
								        </div>
						              </div>
						              <div className="col-sm-12 col-md-6 col-lg-2">
						                <div className="form-group reactDatepicker">
								        <label className="control-label"> Date Range To</label>
								        <DatePicker className="react-datepicker-txt"
								          selected={this.state.toDate}
								          value={this.state.toDate}
								          onChange={this.getToDate}
								          peekNextMonth
								          showMonthDropdown
								          showYearDropdown
								          dropdownMode="select" />
								          <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
								        </div> </div>*/}



						              <div className="col-sm-12 col-md-6 col-lg-1">
						                <div className="form-group">
						                  <div className="po-search-wrap">
						                    <button type="submit" className="btn btn-primary btn-rounded" onClick={this.InventorySearch}><i className="icon icon-1202"></i> Search</button>
						                  </div>
						                </div>
						              </div>
						              <div className="col-sm-12 col-md-6 col-lg-1">
						                <div className="form-group">
						                  <div className="po-search-wrap">
						                  <div className='blue-links'>
						                  <button type="button" className="btn btn-primary btn-rounded" onClick={this.clear}><i className="fa fa-refresh"></i> Reset</button>
						              	  </div>
						                  </div>
						                </div>
						              </div>
	{/*					              <div className="col-sm-12 col-md-1">
						              	<div className="po-search-wrap">
						              	<div className='blue-links'>
						              		<a href="javascript:void(0)" onClick={this.clear}><i className="fa fa-refresh"></i></a>
						              	</div>
						              	</div>
						              </div>*/}
								 	</div>
									<div className="row">
										<div className="col-sm-12 md-mb-20">
											<hr />
										</div>
									</div>


							          <Tabelify style={{margin: '30px'}} {...this.state.tableConfig} urlHandler deleteHandler={this.deleteinventory} editHandler={this.modifyInventory} />

								</div>
							</div>
						</div>
					</div>
					</main>
			 </DefaultLayout>

		)
	}
}
export default Inventory;
