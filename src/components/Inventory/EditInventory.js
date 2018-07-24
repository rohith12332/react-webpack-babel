import React from 'react';
import DefaultLayout from '../common/DefaultLayout'
import Select from 'react-select';
import TextInput from '../common/TextInput';
import { browserHistory, Link } from 'react-router';
import classnames from 'classnames';
import getUserDetails from '../common/CredentialDomain';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DatePicker from "material-ui/DatePicker";
import getCurrentDate from '../common/Date';
import Tabelify from '../react-tabelify/Tabelify';
import axios from 'axios';
import moment from 'moment';



var _ = require('underscore');

class EditInventory extends React.Component{
	constructor(props) {
		super(props);
		this.onChangeGrid = this.onChangeGrid.bind(this);
		this.state = {
			invoice_value:{
				label:'',
				value:''
			},
			product_value:{
				label:'',
				value:''
			},
			barcode_value:{
				label:'',
				value:''
			},
			barCode:'',
			selectedmeasureunitId:'',
			pageHead:{
				pagehead:'Inventory',
				dashboard: 'Dashboard',
				setup: 'Setup'
			},
		    "inventory":{
			"ActualOnHandQty":0,
			"actualprice":0,
			"batchid":"1627aea5-8e0a-4371-9022-9b504344e724",
			"batchno":"String content",
			"claimqty":0,
			"createdby":"String content",
			"createddate":"String content",
			"discountpriceperunit":0,
			"id":"1627aea5-8e0a-4371-9022-9b504344e724",
			"intransitqty":0,
			"invoiceid":"1627aea5-8e0a-4371-9022-9b504344e724",
			"invoicelineitem_id":"1627aea5-8e0a-4371-9022-9b504344e724",
			"isdeleted":false,
			"modifiedby":"String content",
			"modifieddate":"String content",
			"mrppriceperunit":0,
			"name":"String content",
			"notes":"String content",
			"onhandqty":0,
			"onorderqty":0,
			"priceperunit":0,
			"prodexpirydate":new Date(),
			"prodmfgdate":new Date(),
			"prodreceivedate":new Date(),
			"productdesc":"String content",
			"productid":"1627aea5-8e0a-4371-9022-9b504344e724",
			"productimage":[],
			"receivedqty":0,
			"storagelocation":"String content",
			"store_id":"1627aea5-8e0a-4371-9022-9b504344e724",
			"storelocation_id":"1627aea5-8e0a-4371-9022-9b504344e724",
			"userid":"1627aea5-8e0a-4371-9022-9b504344e724"
			},
			MeasurementsList :[],
			productsList :[],
			toDate:'',
			fromDate :'',
			getInvoiceDate:'',
			InvoicesList:[],
			errors:{}
		}
		this.updateInvoice = this.updateInvoice.bind(this);
		this.updateProduct = this.updateProduct.bind(this);
		this.updateBarcode = this.updateBarcode.bind(this);
		this.getReceivedDate = this.getReceivedDate.bind(this);
		this.getManufactureDate = this.getManufactureDate.bind(this);
		this.getExpiryDate = this.getExpiryDate.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onBlur   = this.onBlur.bind(this);
		this.onSubmit  = this.onSubmit.bind(this);
		this.onClose   = this.onClose.bind(this);
		
	}

	 onClose(event)
	 {
        browserHistory.push('/inventory');
	 }

	 onChange(event) {
	   
	     const field = event.target.name;
	     if(field =='barCode')
	     {
	     	this.setState({
		    barCode: event.target.value
		  });
	     }
	     else
	     {
	     	var inventory = this.state.inventory;
	     	inventory[field]=event.target.value;
	     	this.setState({
		    inventory: inventory
		  });
	     }
         
         
	    if(!!this.state.errors[event.target.name]) {
	    let errors = Object.assign({}, this.state.errors);
	     delete errors[event.target.name];
	     this.setState({errors});
  }
}

/*  comparetwodates()
  {
  	var manfdate = this.state.inventory.prodmfgdate;
  	var expirydate = this.state.inventory.prodexpirydate;
  	console.log(manfdate);
  	console.log(expirydate);
  }*/

  onBlur(element)
  {
  	//console.log(element.target.value);
    var that = this;
  	var fieldname = element.target.name;
  	var fieldvalue = element.target.value;
  	var inventory = that.state.inventory;
  	if(fieldname =='receivedqty')
  	{
  	   //alert(fieldname);
       var units = inventory["priceperunit"];

        if(units !=""&& units !="0")
        {
        	inventory["actualprice"]=  fieldvalue * parseInt(inventory["priceperunit"]);
        }

        that.setState({
					inventory:inventory
				});
  	}
  	else if(fieldname =='priceperunit')
  	{
  	   //alert(fieldname);
       inventory["actualprice"]=  fieldvalue * parseInt(inventory["receivedqty"]);
        that.setState({
					inventory:inventory
				});
  	}


  }

 onSubmit(e){
		
		let that = this;
		let reqQuery = {};
		
		var isvalid = this.handleValidation();
		//let getProductState = this.state.Product;
		if(isvalid)
		{
  		reqQuery['inventorycountlog'] = this.state.inventory;

  		    var expirydate = this.state.inventory.prodexpirydate;
		    if(typeof(expirydate) == 'object'){
		      console.log(expirydate)
		      console.log(typeof(expirydate))
		      const parseExpDate = moment(expirydate).format('DD-MM-YYYY HH:mm:ss');
		      console.log(parseExpDate)
		      reqQuery['inventorycountlog']['prodexpirydate'] = parseExpDate;
		    } 

        	reqQuery['inventorycountlog']['prodexpirydate'] =  this.state.inventory.prodexpirydate;

/*		var expirydate = this.state.inventory.prodexpirydate;
	    const parseExpDate = moment(expirydate).format('DD-MM-YYYY HH:mm:ss');
	    reqQuery['inventorycountlog']['prodexpirydate'] = parseExpDate;*/

	      var manufdate = this.state.inventory.prodmfgdate;
		    if(typeof(manufdate) == 'object'){
		      console.log(manufdate)
		      console.log(typeof(manufdate))
		      const parseManDate = moment(manufdate).format('DD-MM-YYYY HH:mm:ss');
		      console.log(parseManDate)
		      reqQuery['inventorycountlog']['prodmfgdate'] = parseManDate;
		    } 

        	reqQuery['inventorycountlog']['prodmfgdate'] =  this.state.inventory.prodmfgdate;

/*	    var manufdate = this.state.inventory.prodmfgdate;
	    const parseManDate = moment(manufdate).format('DD-MM-YYYY HH:mm:ss');
	    reqQuery['inventorycountlog']['prodmfgdate'] = parseManDate;*/

	    	var recevdate = this.state.inventory.prodreceivedate;
		    if(typeof(recevdate) == 'object'){

		      console.log(recevdate)

		      console.log(typeof(recevdate))

		      const parseRecDate = moment(recevdate).format('DD-MM-YYYY HH:mm:ss');
		      console.log(parseRecDate)
		      reqQuery['inventorycountlog']['prodreceivedate'] = parseRecDate;
		    } 

        	reqQuery['inventorycountlog']['prodreceivedate'] =  this.state.inventory.prodreceivedate;

/*	    var recevdate = this.state.inventory.prodreceivedate;
	    const parseRecDate = moment(recevdate).format('DD-MM-YYYY HH:mm:ss');
	    reqQuery['inventorycountlog']['prodreceivedate'] = parseRecDate;*/

  		reqQuery['userdetails'] = getUserDetails();
		console.log(JSON.stringify(reqQuery));
		//return false;
        
		axios.post(`${process.env.API_HOST}/ManageInventoryCountLog.svc/UpdateInventorycountlog/json`, reqQuery)
		 .then(function (response) {
			
			if (response.status >= 400) {
				that.setState({
					"msgFailure":response.data.statusMessage
				})			
			}else{
				that.setState({
					"msgSuccess":response.data.statusMessage
				});
				setTimeout(function(){
					browserHistory.push('/inventory');
				}, 2000)
			}
		 })
		.catch(function (error) {
		   console.log(error);
		});
	}
}



	componentDidMount() {
		this.getAllInvoices();
		//this.getInventories('String content','String content','1627aea5-8e0a-4371-9022-9b504344e724','String content');
		this.getAllProducts();
        this.getAllMeasurementTypes();
        this.getSingleInventory();
	}

	getMeasurementId(productid)
	{
		console.log(productid);
		var that = this;
		var products = this.state.productsList;

		console.log(products.length);

		 for(var i=0;i < products.length;i++)
		 {
            if(products[i].id === productid)
            {
               that.setState({

					"selectedmeasureunitId":products[i].measuringunitid
				})			

            	break;
            }
		 }
	}


	getSingleInventory()
	{
        var that = this;
        var id = this.props.location.pathname.split('/')[2];
	    var reqQuery = {};
	    reqQuery['userdetails'] = getUserDetails();
	    reqQuery['inventoryid'] = id;
	    reqQuery['invoiceid']='00000000-0000-0000-0000-000000000000';
        reqQuery['productid']='00000000-0000-0000-0000-000000000000';

	    console.log(JSON.stringify(reqQuery))

	    axios.post(`${process.env.API_HOST}/ManageInventoryCountLog.svc/GetSingleInventorycountlog/json`, reqQuery)
	     .then(function (response) {
	        console.log(response)
	      if (response.data.status >= 400) {
	        that.setState({
	          msgFailure: response.data.statusMessage
	        })
	      } else {
	      
	      	console.log(response.data.inventorycountlogs);
	        if(response.data.inventorycountlogs == null) response.data.inventorycountlogs = [];

	        var inventory = response.data.inventorycountlogs;
	        var invoiceid = inventory.invoicelineitem_id;
	        var productid = inventory.productid;

            console.log(inventory.prodreceivedate);
            console.log(inventory.prodexpirydate);
            console.log(inventory.prodmfgdate);

	        inventory["prodreceivedate"] = inventory.prodreceivedate; //moment(inventory.prodreceivedate,'YYYY-MM-DD');
	        inventory["prodexpirydate"] = inventory.prodexpirydate; //moment(inventory.prodexpirydate,'YYYY-MM-DD');
	        inventory["prodmfgdate"] = inventory.prodmfgdate; //moment(inventory.prodmfgdate,'YYYY-MM-DD');

	        
	        setTimeout(function(){
					that.getMeasurementId(productid);
				}, 2000);

	        that.setState({
	          inventory: inventory,
	          invoice_value:{
			  value:invoiceid
			  },
	          product_value:{
			  value:productid
			  },
			  barcode_value:{
			  value:productid
			  }

	        });
	      }

	     })
	    .catch(function (error) {
	       console.log(error);
	    });
	}


	//Fetch All Measurement Type
	getAllMeasurementTypes(){
		var that = this;
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();
		const request = new Request(`${process.env.API_HOST}/ManageMeasuringUnits.svc/GetMeasuringUnits/json`, {
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
		  that.setState({
		    MeasurementsList: data.MeasuringUnitsList
		  });
		});
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

	//Fetch All invoices
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


  openDatePickerDay = () => {
    this.refs.datePickerDay.focus();
  };

  openManufactureDate = () => {
    this.refs.datePickerManuDate.focus();
  };

  openReceivedDate = () => {
    this.refs.datePickerRecDate.focus();
  };

   openExpiryDate = () => {
    this.refs.datePickerExpDate.focus();
  };

  
	
/*	getReceivedDate(element){
		
		 console.log("Recevied Date");
		 console.log(element);
		 var inventory = this.state.inventory;
		 inventory["prodreceivedate"] = element;
		this.setState({
			inventory:inventory
		})
	}*/

  getReceivedDate(event, date){
    let inventorycountlog = this.state.inventory;
    inventorycountlog["prodreceivedate"] = moment(date).format('DD-MM-YYYY HH:mm:ss');
    console.log(date)
    this.setState({
      inventorycountlog: inventorycountlog
    });
  }

    getManufactureDate(event, date){
    let inventorycountlog = this.state.inventory;
    inventorycountlog["prodmfgdate"] = moment(date).format('DD-MM-YYYY HH:mm:ss');
    console.log(date)
    this.setState({
      inventorycountlog: inventorycountlog
    });
  }
     getExpiryDate(event, date){
    let inventorycountlog = this.state.inventory;
    inventorycountlog["prodexpirydate"] = moment(date).format('DD-MM-YYYY HH:mm:ss');
    console.log(date)
    this.setState({
      inventorycountlog: inventorycountlog
    });
  }

/*	getManufactureDate(element){

		 var inventory = this.state.inventory;
		 inventory["prodmfgdate"] = element;
		this.setState({
			inventory:inventory
		})
	}*/
   
/*    getExpiryDate(element){

		 var inventory = this.state.inventory;
		 inventory["prodexpirydate"] = element;
		this.setState({
			inventory:inventory
		})
	}*/


	updateProduct(element)
	{

	  //alert(112);
      //console.log(element.item.measuringunitid);
      //console.log(element.item.upc);

      var inventory = this.state.inventory;
	  inventory["productid"] = element.value;
	  inventory["notes"]=element.label;
      // based on value of product selected we vil get  barcode if exists 
      this.setState(
		{
			product_value:{
				label:element.label,
				value:element.value
			},
			selectedmeasureunitId:element.item.measuringunitid,
			barcode_value:{value:element.value},
			inventory:inventory	
		}
		)
	}

	// need to put barcode dropdown list

	updateBarcode(element)
	{
     
      // based on value of product selected we vil get  barcode if exists 
       var inventory = this.state.inventory;
	   inventory["productid"] = element.value;
	   inventory["notes"]=element.item.name;
      this.setState(
		{
			barcode_value:{
				label:element.label,
				value:element.value
			},
			product_value:{value:element.value},
			selectedmeasureunitId:element.item.measuringunitid,	
			inventory:inventory	

		}
		)
	}

	updateInvoice(element){
		var inventory = this.state.inventory;
	    inventory["invoicelineitem_id"] = element.value;
	    inventory["invoiceid"] = element.value;
	    console.log(invoiceid)
		this.setState(
		{
			invoice_value:{
				label:element.label,
				value:element.value
			}	,
			inventory:inventory

		}
		)
	}
	
	onChangeGrid(event, data) {
		var tableConfig = this.state.tableConfig;
		_.extend(tableConfig, data);
		this.setState({
		  tableConfig: tableConfig
		});
	}



  Comparebetweenmanrec()
  {
  	var manfdate = this.state.inventory.prodmfgdate;
  	var recevdate = this.state.inventory.prodreceivedate;
  	console.log(manfdate);
  	console.log(recevdate);
    var isbefore = moment(recevdate).isBefore( moment(manfdate));
    return isbefore;

  }

  Comparebetweenrecexp()
  {
  	var recevdate = this.state.inventory.prodreceivedate;
  	var expirydate = this.state.inventory.prodexpirydate;
  	console.log(recevdate);
  	console.log(expirydate);
    var isbefore = moment(expirydate).isBefore( moment(recevdate));
    return isbefore;

  }

     handleValidation(){

		let errors = {};
		//Form validation error message
		var inventory = this.state.inventory;

		if(inventory.invoiceid ==='')
		 {
            errors.invoice = "Select Invoice Name";
		 }
	
		if (inventory.productid === '') {
		    errors.product = "Select Product Name";
		 }

		if (inventory.receivedqty === 0 || inventory.receivedqty === '') {
		    errors.receivedqty = "Recevied qty should not be empty or zero";
		}

		if (inventory.prodmfgdate === ''){
		    errors.prodmfgdate = "product manf date should not be empty";
		}

		if (inventory.prodexpirydate === '')
		{
		    errors.prodexpirydate = "product expiry date should not be empty";
		}

		if (inventory.prodreceivedate === ''){
		    errors.prodreceivedate = "product recevied date should not be empty";
		}

		if(inventory.prodmfgdate !='' && inventory.prodreceivedate !='')
		{
           if(this.Comparebetweenmanrec())
           {
           	  errors.prodmfgdate = "manfacture date should be less than Recevied Date";
           }
		}

		if(inventory.prodreceivedate !='' && inventory.prodexpirydate !='')
		{
           if(this.Comparebetweenrecexp())
           {
           	  errors.prodexpirydate = "Expiry Date should be greater than received date";
           }
		}
		
		if(inventory.priceperunit ===''|| inventory.priceperunit ==0)
		{
          errors.priceperunit = "Price per unit should not be empty or zero"; 
		}
		
		this.setState({ errors }); //Set Errors state
		return Object.keys(errors).length == 0;
   }



	render(){
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
		var {pageHead, InvoicesList,productsList,MeasurementsList,msgSuccess,msgFailure} = this.state;

		InvoicesList = InvoicesList.map(function(o) {
	        return {
	          label: o.name,
	          value: o.id
	        }
    	});

    	var products = productsList.map(function(o) {
	        return {
	          label: o.name,
	          value: o.id,
	          item : o
	        }
    	});

    	MeasurementsList = MeasurementsList.map(function(o) {
	        return {
	          label: o.measurement,
	          value: o.id
	        }
    	});

    	var barcodelist =  productsList.map(function(o) {
		    		return {
	    				label: o.upc,
		         		 value: o.id,
		          		 item : o
			         }
	        
    	});

    	    const parseManuDate = moment(this.state.inventory.prodmfgdate, 'DD-MM-YYYY,hh:mm:ss a')
    		const parseMDate = new Date(parseManuDate)
    		console.log(parseMDate)

    		const parseexpDate = moment(this.state.inventory.prodexpirydate, 'DD-MM-YYYY,hh:mm:ss a')
    		const parseEDate = new Date(parseexpDate)
    		console.log(parseEDate)

    		const parserecDate = moment(this.state.inventory.prodreceivedate, 'DD-MM-YYYY,hh:mm:ss a')
    		const parseRDate = new Date(parserecDate)
    		console.log(parseRDate)

		return(
			 <DefaultLayout>
			    <div className="page-head inner__pageHead">
					<div className="domain-icon"> <img src={require( './Inventory.svg')}/> <h2>{pageHead.pagehead}</h2></div>						
					<ol className="breadcrumb">
		                <li><Link to={`/domains`}>{currentDomain}</Link></li>
		                <li><Link to={`/stores`}>{currentStore}</Link></li>  						
						<li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
						<li><Link to={`/InventoryLanding`}>Inventory</Link></li>
						<li><Link className="active" to={`/inventory`}>Inventory Details</Link></li>
						<li className="active">Edit Inventory</li>
					</ol>	            
			    </div>
					<main>
				<div  id = "inventory">
					{msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
			          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			          {msgFailure}
			        </div>}
			        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
			          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			          {msgSuccess}
			        </div>}	
				      <div className="row">
				        <div className="col-sm-12 ">
				          <div className="addproduct-wrap editbutton">
				            <div className="widget widget-small">
				              <form action="#" className="">
				               <div className={classnames('form-group', { error: !!this.state.errors.invoice})}>
					                  <label className="control-label">Invoice <span className="required">*</span></label>
								        <Select
								          name="invoice"
								          value={this.state.invoice_value.value}
								          options={InvoicesList}
								          onChange={this.updateInvoice}
								          />
								          <span>{this.state.errors.invoice}</span>
					                </div>
			                <div className="row">
			                  <div className="col-sm-6">
			                    <div className={classnames('form-group', { error: !!this.state.errors.product})}>
			                      <label className="control-label">Product Name <span className="required">*</span></label>
								        <Select disabled="true"
								          name="product"
								          value={this.state.product_value.value}
								          options={products}
								          onChange={this.updateProduct}
								          />
								           <span>{this.state.errors.product}</span>
				                    </div>
				                  </div>
				                  <div className="col-sm-6">
				                    <div className="form-group">
				                     <label className="control-label">Barcode </label>
								        <Select disabled="true"
								          name="barcode"
								          value={this.state.barcode_value.value}
								          options={barcodelist}
								          onChange={this.updateBarcode}
								          />
				                    </div>
				                  </div>
				                </div>
				                <div className="row">
				                  <div className="col-sm-6">
				                    <div className="form-group">
				                       <TextInput
							          type="text"
							          name="batchno"
							          label="Batch No"
							          value={this.state.inventory.batchno}
							          defaultValue={this.state.inventory.batchno}
							          placeholder=""
							          onChange={this.onChange}
							          className='form-control'
							          />
				                    </div>
				                  </div>
				                  <div className="col-sm-6">
				                    <div className={classnames('form-group', { error: !!this.state.errors.receivedqty})}>
				                       <TextInput
							          type="text"
							          name="receivedqty"
							          label="Recevied Qty"
							          value={this.state.inventory.receivedqty}
							          defaultValue={this.state.inventory.receivedqty}
							          placeholder=""
							          required="*"
							          onChange={this.onChange}
							          onBlur = {this.onBlur}
							          className='form-group'
							          />
							          <span>{this.state.errors.receivedqty}</span>
				                    </div>
				                  </div>
				                </div>
			                <div className="row">
			                  <div className="col-sm-6">
			                    <div className="form-group">
			                     <TextInput
						          type="text"
						          name="claimqty"
						          label="Damaged Qty"
						          value={this.state.inventory.claimqty}
						          defaultValue={this.state.inventory.claimqty}
						          placeholder="count"
						          onChange={this.onChange}
						          className='form-control'
						          />
			                    </div>
			                  </div>
			                  <div className="col-sm-6">
			                    <div className="form-group">
			                   
				                  <label className="control-label">Measure Units</label>
							        <Select  disabled="true"
							          name="Measureunits"
							          value={this.state.selectedmeasureunitId}
							          options={MeasurementsList}
							          />					                
				                    </div>
				                  </div>
				                </div>

				         <MuiThemeProvider>
			              <div className="row">
			              <div className={classnames('form-group col-lg-6 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.prodmfgdate})}>
			              <label className="control-label">Manufacture Date</label>
			                <div className="datepicker-wrapper">
			                  <DatePicker
			                    value={parseMDate}
			                    onChange={this.getManufactureDate}
			                    id="datePickerManuDate"
			                    ref='datePickerManuDate'
			                    formatDate={(date) => moment(date).format('DD-MM-YYYY')}
			                    className="m-datePicker"
			                    textFieldStyle={{'height':'40px'}}
			                  />
			                </div>
			                <div className="input-group-addon btn btn-secondary" onClick={this.openManufactureDate}><i className="icon icon-799"></i></div>
			              <span className="clearfix" style={{'display':'block'}}>{this.state.errors.prodmfgdate}</span>
			            </div>


			              <div className={classnames('form-group col-lg-6 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.prodreceivedate})}>
			              <label className="control-label">Received Date</label>
			                <div className="datepicker-wrapper">
			                  <DatePicker
			                    onChange={this.getReceivedDate}
			                    value={parseRDate}
			                    ref='datePickerRecDate'
			                    id="datePickerRecDate"
			                    formatDate={(date) => moment(date).format('DD-MM-YYYY')}
			                    className="m-datePicker"
			                    textFieldStyle={{'height':'40px'}}
			                  />
			                </div>
			                <div className="input-group-addon btn btn-secondary" onClick={this.openReceivedDate}><i className="icon icon-799"></i></div>
			                <span>{this.state.errors.prodreceivedate}</span>
			            </div>


			           	<div className={classnames('form-group col-lg-6 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.prodexpirydate})}>
			              <label className="control-label">Expiry Date</label>
			                <div className="datepicker-wrapper">
			                  <DatePicker
			                    onChange={this.getExpiryDate}
			                    value={parseEDate}
			                    ref='datePickerExpDate'
			                    id="datePickerExpDate"
			                    formatDate={(date) => moment(date).format('DD-MM-YYYY')}
			                    className="m-datePicker"
			                    textFieldStyle={{'height':'40px'}}
			                  />
			                </div>
			                <div className="input-group-addon btn btn-secondary" onClick={this.openExpiryDate}><i className="icon icon-799"></i></div>
			                <span>{this.state.errors.prodexpirydate}</span>
			            </div>
			          </div>
			        </MuiThemeProvider>

{/*                  <div className={classnames('form-group reactDatepicker', { error: !!this.state.errors.prodmfgdate})}>

							        <label className="control-label">Manufacture Date <span className="required">*</span></label>
							        <DatePicker className="react-datepicker-txt"
							          selected={this.state.inventory.prodmfgdate}
							          value={this.state.inventory.prodmfgdate}
							          onChange={this.getManufactureDate}
							          peekNextMonth
							          showMonthDropdown
							          showYearDropdown
							          dropdownMode="select" />
							          <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
							           <span>{this.state.errors.prodmfgdate}</span>
							        </div>
							        
          
                  <div className={classnames('form-group reactDatepicker', { error: !!this.state.errors.prodreceivedate})}>
							        <label className="control-label">Received Date <span className="required">*</span></label>
							        <DatePicker className="react-datepicker-txt"
							          selected={this.state.inventory.prodreceivedate}
							          value={this.state.inventory.prodreceivedate}
							          onChange={this.getReceivedDate}
							          peekNextMonth
							          showMonthDropdown
							          showYearDropdown
							          dropdownMode="select" />
							          <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
							           <span>{this.state.errors.prodreceivedate}</span>
							        </div>
             
               
                 <div className={classnames('form-group reactDatepicker', { error: !!this.state.errors.prodexpirydate})}>
							        <label className="control-label">Expiry Date <span className="required">*</span></label>
							        <DatePicker className="react-datepicker-txt"
							          selected={this.state.inventory.prodexpirydate}
							          value={this.state.inventory.prodexpirydate}
							          onChange={this.getExpiryDate}
							          peekNextMonth
							          showMonthDropdown
							          showYearDropdown
							          dropdownMode="select" />
							          <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
							           <span>{this.state.errors.prodexpirydate}</span>
							        </div>*/}

              
				                <div className="row">
				                  <div className="col-sm-4">
				                     <div className={classnames('form-group', { error: !!this.state.errors.priceperunit})}>
				                      <TextInput
							          type="text"
							          name="priceperunit"
							          label="Cost Per Unit"
							          value={this.state.inventory.priceperunit}
							          defaultValue={this.state.inventory.priceperunit}
							          placeholder=""
							          required="*"
							          onChange={this.onChange}
							          onBlur = {this.onBlur}
							          className='form-group'
							          />
							          <span>{this.state.errors.priceperunit}</span>
				                    </div>
				                  </div>
				                  <div className="col-sm-4">
				                    <div className="form-group">
				                      <TextInput
							          type="text"
							          name="actualprice"
							          label="Actual Price"
							          value={this.state.inventory.actualprice}
							          defaultValue={this.state.inventory.actualprice}
							          placeholder=""
							          onChange={this.onChange}
							          onBlur = {this.onBlur}
							          className='form-control'
							          />
				                    </div>
				                  </div>
				                  <div className="col-sm-4">
				                    <div className="form-group">
				                     <div className="form-group">
				                      <TextInput
							          type="text"
							          name="discountpriceperunit"
							          label="Instant Discount"
							          value={this.state.inventory.discountpriceperunit}
							          defaultValue={this.state.inventory.discountpriceperunit}
							          placeholder=""
							          onChange={this.onChange}
							          onBlur = {this.onBlur}
							          className='form-control'
							          />
				                    </div>
				                    </div>
				                  </div>
				                </div>
				              </form>
				            </div>
				            <div >
						      <div className="col-sm-12 form-bot-butn-wrap">
						        <div className="form-bot-butns round-btns">
						          <button type="submit" onClick={this.onSubmit} className="btn btn-primary">Save</button>
						          <button type="submit" onClick={this.onClose}  className="btn btn-default">Cancel</button>
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
export default EditInventory;