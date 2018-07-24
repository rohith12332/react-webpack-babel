import React, { Component } from 'react';
import DefaultLayout from '../common/DefaultLayout';
import {browserHistory, Link} from 'react-router';
import Select from 'react-select';
import Checkbox from '../common/Checkbox';
import getUserDetails from '../common/CredentialDomain';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import TextInput from '../common/TextInput';
import Confirm from 'react-confirm-bootstrap';
import classnames from 'classnames';
import ImageUpload from './ReactImageUpload';
var repeater = require('jquery.repeater');
//import MetaRepeater from './MetaRepeater';
import getCurrentDate from '../common/Date';
//import IncorporationForm from './IncorporationForm';
import axios from 'axios';
import './Product.css';

class AddProduct extends Component{
	constructor(props) {
		super(props);
		this.state = {
				pageHead:{
					pagehead:'Add Product',
					dashboard: 'Dashboard',
					setup: 'Setup'
				},
				"Product":{
					"caloriecount": 0,
					"color":"",
					"countsassalesrevenue": false,
					"createdby":"OnePos",
					"createddate":getCurrentDate(),
					"downtick": 0,
					"id":"1627aea5-8e0a-4371-9022-9b504344e724",
					"image":null,
					"inclusivetiprateid":"1627aea5-8e0a-4371-9022-9b504344e724",
					"invcap": 0,
					"isactive":true,
					"isagerestrict":false,
					"isdeleted": false,
					"isdisplayonbilling":false,
					"isgiftcard":false,
					"longname":"",
					"maxfloorqty": 0,
					"menuposition": 0,
					"metaproductdata":"",
					"metaproductlist":[{
						"id":"1627aea5-8e0a-4371-9022-9b504344e724",
						"mid":"1627aea5-8e0a-4371-9022-9b504344e724",
						"mname":"",
						"name":"",
						"quantity":""
					}],
					"modifiedby":"OnePos",
					"modifieddate":getCurrentDate(),
					"name":"",
					"plu":"",
					"price": 0,
					"pricemethod": 0,
					"priceperunitofweight": 0,
					"productgroupid":"1627aea5-8e0a-4371-9022-9b504344e724",
					"productgroupprinterid":"1627aea5-8e0a-4371-9022-9b504344e724",
					"promptformetadata":false,
					"promptforprice":false,
					"removeatzerocount":false,
					"revenuetypeid":"1627aea5-8e0a-4371-9022-9b504344e724",
					"sku":"",
					"store_id":"1627aea5-8e0a-4371-9022-9b504344e724",
					"storeid":"1627aea5-8e0a-4371-9022-9b504344e724",
					"surchargegroupid":"1627aea5-8e0a-4371-9022-9b504344e724",
					"taxgroupid":"1627aea5-8e0a-4371-9022-9b504344e724",
					"unitofweightsize": 0,
					"upc":"",
					"useweightpricing":false
				},
				"revenuetypeinformation": {
					createdby: "OnePos",
					createddate: getCurrentDate(),
					id: "1627aea5-8e0a-4371-9022-9b504344e724",
					isdeleted: false,
					modifiedby: "OnePos",
					modifieddate: getCurrentDate(),
					name: "",
					store_id: "1627aea5-8e0a-4371-9022-9b504344e724"
				},
				"VProductinformation": [{
					"createdate": "\/Date(928129800000+0530)\/",
					"createddate": "\/Date(928129800000+0530)\/",
					"createdby":"String content",
					"id":"1627aea5-8e0a-4371-9022-9b504344e724",
					"isactive": true,
					"isdeleted": false,
					"modifiedby": "OnePos",
					"modifieddate": "\/Date(928129800000+0530)\/",
					"name":"",
					"productid": "1627aea5-8e0a-4371-9022-9b504344e724",
					"store_id": "1627aea5-8e0a-4371-9022-9b504344e724",
					"vendoraccountid": "1627aea5-8e0a-4371-9022-9b504344e724"
				}],
				enablePrice: true,
				revenuetypeFieldEdit:"",
				ProductList:[],
				ProductGroups:[],
				VendorAccountsList:[],
				RevenueTypeList:[],
				taxGroupList:[],
				PrinterGroups:[],
				revenuetype:[],
				MeasuringUnitsList:[],
				MeasurementType:[],

				selectProductGroup:{
					label:"",
					value:""
				},
				selectVendorAccountsList:[],
				selectRevenueType: {
					label:"",
					value:""
				},
				selectTaxGroup: {
					label:"",
					value:""
				},
				selectPrinterGroups: {
					label:"",
					value:""
				},
				selectAllProducts: {
					label:"",
					value:""
				},
				selectMeasurementType:{
					label:'',
					value:''
				},
				quantity: '',
		        id: '',
		        mid:'',
				"metaproductlist":[],
				errors:{},
				modelTitle:'',
				modelMode:'',
				showModal:false,
				disableAdd: false,
				disableEdit: true,
				disableDelete: true,
				disabledUpdate: true,
				msgSuccess: "",
          		msgFailure: ""
		}
		this.onChange = this.onChange.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.getPreview = this.getPreview.bind(this);
		this.updateRevenueType = this.updateRevenueType.bind(this);
		this.addRevenueType = this.addRevenueType.bind(this);
		this.editRevenueType = this.editRevenueType.bind(this);
		this.deleteRevenueType = this.deleteRevenueType.bind(this);
		this.open = this.open.bind(this);
		this.openEdit = this.openEdit.bind(this);
		this.close = this.close.bind(this);
		this.modelFieldChange = this.modelFieldChange.bind(this);
		this.handleRevenueValidation = this.handleRevenueValidation.bind(this);
		this.handleSelectItems = this.handleSelectItems.bind(this);
		this.handlechange = this.handlechange.bind(this);
		this.convertDataURIToBinary = this.convertDataURIToBinary.bind(this);

		/********REPEATER **********/
		this.handleProductSelect = this.handleProductSelect.bind(this);
		this.handleMeasurementTypeSelect = this.handleMeasurementTypeSelect.bind(this);
	}

	componentDidMount() {
		this.GetAllProducts();
		this.GetProductgroups();
		this.getAllVendors();
		this.getRevenueType();
		this.getTaxGroups();
		this.GetPrintergroups();
		this.GetMeasurementType();

		$("html, body").stop().animate({scrollTop:0}, 500, 'swing', function() {});
	}
	//******************REPEATER ***************/
	  handleNameChange = (evt) => {
	    this.setState({ quantity: evt.target.value });
	  }

	  handleProductSelect = (idx) => (evt) => {
	  	//console.log(evt.target.options[ evt.target.selectedIndex ].value)
	    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
	      if (idx !== sidx) return shareholder;
	      return { ...shareholder, id: evt.target.options[ evt.target.selectedIndex ].value, name: evt.target.options[ evt.target.selectedIndex ].text};
	    });
	    this.setState({
	      metaproductlist: newShareholders
	      //,selectAllProducts: evt
	    });
	  }

	  handleMeasurementTypeSelect = (idx) => (evt) => {
	    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
	      if (idx !== sidx) return shareholder;
	      return { ...shareholder, mid: evt.target.options[ evt.target.selectedIndex ].value, mname: evt.target.options[ evt.target.selectedIndex ].text};
	    });
	    this.setState({
	      metaproductlist: newShareholders
	      //,selectMeasurementType: evt
	    });
	  }

	  handleShareholderNameChange = (idx) => (evt) => {
	    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
	      if (idx !== sidx) return shareholder;
	      return { ...shareholder, quantity: evt.target.value};
	    });
	    this.setState({ metaproductlist: newShareholders });
	  }

	  handleSubmit = (evt) => {
	    const { quantity, metaproductlist } = this.state;
	    alert(`Incorporated: ${quantity} with ${metaproductlist} metaproductlist`);
	  }

	  handleAddShareholder = () => {
	    this.setState({ metaproductlist: this.state.metaproductlist.concat([{ quantity: ''}]) });
	  }

	  handleRemoveShareholder = (idx) => () => {
	    this.setState({ metaproductlist: this.state.metaproductlist.filter((s, sidx) => idx !== sidx) });
	  }


  	validateNumber(value) {
      var onlynumber = /^[1-9]\d*(\.\d+)?$/;
      return onlynumber.test(value);
	}


  handleValidation() {
	let errors = {};
	//Form validation error message

	if (this.state.selectProductGroup.value === '') {
		errors.selectProductGroup = "Please select Product Group"
	}
	console.log(this.state.selectVendorAccountsList.length)

/*	if (this.state.selectVendorAccountsList.length == 0) {
		errors.selectVendorAccountsList = "Please select Vendor"
	}*/
	if (this.state.selectRevenueType.value === '') {
		errors.selectRevenueType = "Please select Revenue Type"
	}
	if (this.state.selectMeasurementType.value === '') {
		errors.selectMeasurementType = "Please select Measurement Type"
	}
	if (this.state.Product.maxfloorqty === '' || this.state.Product.maxfloorqty === 0) {
		document.getElementById("maxfloorqty").focus();
		errors.maxfloorqty = "Max Floor Qty can't be empty"
	}
	if(this.state.Product.promptforprice === false || this.state.Product.promptformetadata === false ){
		if (this.state.Product.price === '' ) {
			document.getElementById("price").focus();
			errors.price = "Price can't be empty"
		}
	}


	if (this.state.selectTaxGroup.value === '') {
		errors.selectTaxGroup = "Please select TaxGroup"
	}
	if (this.state.selectPrinterGroups.value === '') {
		errors.selectPrinterGroups = "Please select Printer Group"
	}
	if (this.state.Product.name.trim() === '') {
		document.getElementById("name").focus();
		errors.name = "Product Name can't be empty"
	}

	this.setState({
		errors
	}); //Set Errors state

	return Object.keys(errors).length == 0;
  }

	//TextFields Change handller
	onChange(e){
		const field = e.target.name;
		let Product = this.state.Product;
		Product[field] = e.target.value;

		if (!!this.state.errors[e.target.name]) {
          let errors = Object.assign({}, this.state.errors);
          delete errors[e.target.name];
          this.setState({
              errors
          });
      	}
		this.setState({
      		Product: Product
  		})
	}

	onSubmit(e){
		e.preventDefault();
		let that = this;
		let reqQuery = {};
		let vendors = [];
		let vendorProductQuery = {};
		let getProductState = this.state.Product;
		let getMetaData = this.state.metaproductlist;
		let vendorProductInfo = this.state.VProductinformation;
		var isValid = this.handleValidation();

		if(isValid) {

			// Scroll to top

			$("html, body").stop().animate({scrollTop:0}, 500, 'swing', function() {});

  		getProductState['productgroupid'] = this.state.selectProductGroup.value;
  		getProductState['revenuetypeid'] = this.state.selectRevenueType.value;
  		getProductState['measuringunitid'] = this.state.selectMeasurementType.value;
  		getProductState['taxgroupid'] = this.state.selectTaxGroup.value;
  		getProductState['productgroupprinterid'] = this.state.selectPrinterGroups.value;

  		vendors = this.state.selectVendorAccountsList;
  		reqQuery['Product'] = getProductState;
  		reqQuery['Product']['metaproductlist'] = getMetaData;
  		reqQuery['userdetails'] = getUserDetails();
			console.log(JSON.stringify(reqQuery));

			axios.post(`${process.env.API_HOST}/ManageProducts.svc/CreateProduct/json`, reqQuery)
			 .then(function (response) {
			   	var selectedVendors = vendors;
				var productId = response.data.productid;
				var productname = that.state.Product.name;
				var reqQuery = {};
				for(var v in selectedVendors){
					if(selectedVendors.hasOwnProperty(v)){

						selectedVendors[v]["productid"] = productId;
						selectedVendors[v]["name"] = productname;
					}
				}

				reqQuery['VProductinformation'] = selectedVendors;
				reqQuery['userdetails'] = getUserDetails();

				console.log(JSON.stringify(reqQuery));
				axios.post(`${process.env.API_HOST}/ManageVendorProducts.svc/CreateVendorProduct/json`, reqQuery)
				.then(function(response){
				}).catch(function (error) {
			   		console.log("Bad Response");
				});

				//Check Product Status
				if (response.status >= 400) {
					that.setState({
						"msgFailure":response.data.statusMessage
					})
				}else{
					that.setState({
						"msgSuccess":response.data.statusMessage
					});

					setTimeout(function(){
						browserHistory.push('/products');
					}, 3000)
				}
			 })
			.catch(function (error) {
			   console.log(error);
			});
		}
	}

	// Checkboxes Change Handle
	handlechange(event){
		if(event.target.name == 'promptforprice'){
			var Product = this.state.Product;
			Product['promptforprice'] = event.target.checked;
			Product['promptformetadata'] = false;
			Product['useweightpricing'] = false;

			this.setState({
				Product: Product,
				enablePrice: event.target.checked
			})
		}
		if(event.target.name == 'useweightpricing'){
			var Product = this.state.Product;
			Product['useweightpricing'] = event.target.checked;
			Product['promptforprice'] = false;
			Product['promptformetadata'] = false;

			this.setState({
				Product: Product,
				useweightpricing: event.target.checked
			})
		}
		if(event.target.name == 'metaproductdata'){
			var Product = this.state.Product;
			Product['promptformetadata'] = event.target.checked;
			Product['promptforprice'] = false;
			Product['useweightpricing'] = false;
			console.log(Product)

			this.setState({
				Product: Product,
			})
		}
		if(event.target.name == 'isagerestrict'){
			var Product = this.state.Product;
			Product['isagerestrict'] = event.target.checked;
			this.setState({
				Product: Product,
				enablePrice: event.target.checked
			})
		}
		if(event.target.name == 'isdisplayonbilling'){
			var Product = this.state.Product;
			Product['isdisplayonbilling'] = event.target.checked;
			this.setState({
				Product: Product
			})
		}
	}

	//Handle Select boxes - Get Select Name and Value(value and label)
	handleSelectItems(name, value){
		if(name == 'productgroup'){
			delete this.state.errors.selectProductGroup;
		    this.setState({
      			selectProductGroup: value
  			})
		}
		if(name == 'measurementtype'){
  			delete this.state.errors.selectMeasurementType;
  			var Product = this.state.Product;
  			var pricemethod = 0;
  			if(value.label =='Unit') var pricemethod = 1;
			Product['pricemethod'] = pricemethod;
		    this.setState({
      			selectMeasurementType: value,
      			Product: Product
  			})
		}

  		if(name == 'taxgroup'){
			delete this.state.errors.selectTaxGroup;
			this.setState({
  				selectTaxGroup: value
			})
		}
		if(name == 'printergroup'){
  			delete this.state.errors.selectPrinterGroups;
  			this.setState({
      			selectPrinterGroups: value
  			})
		}

		/*
		switch (name) {
			case 'productgroup':
				delete this.state.errors.selectProductGroup;
			    this.setState({
          			selectProductGroup: value
      			})
      		case 'measurementtype':
      			delete this.state.errors.selectMeasurementType;
      			var Product = this.state.Product;
      			var pricemethod = 0;
      			if(value.label =='Unit') var pricemethod = 1;
				Product['pricemethod'] = pricemethod;
			    this.setState({
          			selectMeasurementType: value,
          			Product: Product
      			})
      		case 'taxgroup':
      			delete this.state.errors.selectTaxGroup;
      			this.setState({
          			selectTaxGroup: value
      			})
      		case 'printergroup':
      			delete this.state.errors.selectPrinterGroups;
      			this.setState({
          			selectPrinterGroups: value
      			})
		}*/
	}

	handleVendorAccountList(name, value){
		delete this.state.errors.selectVendorAccountsList;
		for(var v in value){
			if(value.hasOwnProperty(v)){
				value[v]["createdate"] = "\/Date(928129800000+0530)\/";
				value[v]["createdby"] = "String content";
				value[v]["createddate"] = "\/Date(928129800000+0530)\/";
				value[v]["id"] = "1627aea5-8e0a-4371-9022-9b504344e724";
				value[v]["isactive"] = true;
				value[v]["isdeleted"] = false;
				value[v]["modifiedby"] = "String content";
				value[v]["modifieddate"] = "\/Date(928129800000+0530)\/";
				value[v]["name"] = value[v].label;
				value[v]["productid"] = "1627aea5-8e0a-4371-9022-9b504344e724";
				value[v]["store_id"] = "1627aea5-8e0a-4371-9022-9b504344e724";
				value[v]["vendoraccountid"] = value[v].value;
			}
		}
		this.setState({
			selectVendorAccountsList: value
		})
	}

	//Fetch All Products
	GetAllProducts(){
	    var that = this;
	    var reqQuery = {};

	    reqQuery['isall'] = true;
	    reqQuery['ismobileaccess'] = false;
	    reqQuery['userdetails'] = getUserDetails();
	    reqQuery["isdisplaymetaproducts"] = true;

	    const request = new Request(`${process.env.API_HOST}/ManageProducts.svc/GetProducts/json`, {
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
	      	if(data.productsList == null) data.productsList = [];
	        that.setState({
	          ProductList: data.productsList
	        });
	    });
	}

	//Fetch All Product Group
	GetProductgroups(){
	    var that = this;
	    var reqQuery = {};
	    reqQuery['userdetails'] = getUserDetails();
	    const request = new Request(`${process.env.API_HOST}/ManageProducts.svc/GetProductGroups/json`, {
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
	      	//console.log(data)
	        that.setState({
	          ProductGroups: data.productsList
	        });
	    });
	}

	//Fetch All Vendors
	getAllVendors() {
		var that = this;
		var credentials = {};
		credentials['userdetails'] = getUserDetails();

		const request = new Request(`${process.env.API_HOST}/ManageVendorAccount.svc/GetAllVendors/json`, {
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
		      VendorAccountsList: data.VendorAccountsList
		    });
		});
	}

	//Fetch All Revenue Type
	getRevenueType(){
	    var that = this;
	    var credentials = {};
	    credentials['userdetails'] = getUserDetails();
	    const request = new Request(`${process.env.API_HOST}/ManageRevenueTypes.svc/GetAllRevenueTypes/json`, {
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
	          RevenueTypeList: data.revenuelist
	        });
	    });
	}

	//Fetch All Tax Groups
	getTaxGroups(){
		var that = this;
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();
		const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/GetTaxGroups/json`, {
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
		  that.setState({
		    taxGroupList: data.taxGroupList
		  });
		});
	}

	//Fetch All Printer Groups
	GetPrintergroups(){
		var that = this;
		var reqQuery = {};
		reqQuery['userdetails'] = getUserDetails();
		const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/GetPrinterGroups/json`, {
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
		  that.setState({
		    PrinterGroups: data.printergroups
		  });
		});
	}

	//Fetch All Measurement Type
	GetMeasurementType(){
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
		    MeasuringUnitsList: data.MeasuringUnitsList
		  });
		});
	}
	open(e){
		var revenueState = this.state.revenuetypeinformation;
		var mode = e.target.title.slice(0, 1);
	    revenueState['name'] = "";
		this.setState({
			revenuetypeFieldEdit: name,
			revenuetypeinformation:revenueState,
			showModal: true,
			modelMode: mode,
			modelTitle: e.target.title,
			errors: {}
		})
	}

	openEdit(e){
		var mode = e.target.title.slice(0, 1);
		var id = this.state.selectRevenueType.value;
		var name = this.state.selectRevenueType.label;

		this.setState({
			disabledUpdate: true,
			revenuetypeFieldEdit: name,
			showModal: true,
			modelMode: mode,
			modelTitle: e.target.title,
			errors: {}
		})
	}

	close(){
	    var revenueState = this.state.revenuetypeinformation;
	    revenueState['name'] = "";
	    this.setState({
	    	showModal: false,
			revenuetypeinformation:revenueState
	    })
	}

	onCancel(){
		browserHistory.push('/products')
	}
	updateRevenueType(e){
		delete this.state.errors.selectRevenueType;
		this.setState({
			selectRevenueType:{
				label:e.label,
				value:e.value
			},
			disableAdd: false,
			disableEdit: false,
			disableDelete: false
		})
	}

	modelFieldChange(event){
		'use strict';

		if (!!this.state.errors[event.target.name]) {
		  let errors = Object.assign({}, this.state.errors);

		  delete errors[event.target.name];
		  this.setState({
		      errors
		  });
		}

	    var revenueState = this.state.revenuetypeinformation;
	    revenueState['name'] = event.target.value;
	    return this.setState({
			revenuetypeinformation:revenueState,
			disabledUpdate: false
	    })
	}

	handleRevenueValidation() {
	    var errors = {};
	    if(this.state.revenuetypeinformation.name === '') {
	      errors.revenuetype = "Revenue Type cannot be empty"
	    }
	    this.setState({ errors });
	    window.scrollTo(0,0);
	    return Object.keys(errors).length == 0;
	}

	addRevenueType(){
		var that = this;
		var reqQuery = {};
    	var revenuetypeinformation = this.state.revenuetypeinformation;
		reqQuery['userdetails'] = getUserDetails();
    	reqQuery['revenuetypeinformation'] = revenuetypeinformation;

    	var isValid = this.handleRevenueValidation();

    	if(isValid){
			const request = new Request(`${process.env.API_HOST}/ManageRevenueTypes.svc/CreateRevenueType/json`, {
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

				if (data.statusCode >= 400) {
				  that.setState({
				      msgFailure: data.statusMessage,
				      showModal: false
				  })
				} else {
				  that.setState({
				      msgSuccess: data.statusMessage,
				      showModal: false,
				      selectRevenueType:{
				      	label: '',
				      	value:''
				      }
				  });
				  setTimeout(function(){
				  	that.setState({
				  		msgSuccess: ''
				  	})
				  }, 3000)
				}
				that.getRevenueType();
			});
		}
	}

	editRevenueType(){
		var that = this;
		var reqQuery = {};
		var id = this.state.selectRevenueType.value;
		var revenuetypeinformation = this.state.revenuetypeinformation;
	    revenuetypeinformation['id'] = id;

	    reqQuery['userdetails'] = getUserDetails();
	    reqQuery['revenuetypeinformation'] = revenuetypeinformation;

		const request = new Request(`${process.env.API_HOST}/ManageRevenueTypes.svc/UpdateRevenueType/json`, {
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

			if (data.statusCode >= 400) {
			  that.setState({
			      msgFailure: data.statusMessage,
			      showModal: false
			  })
			} else {
			  that.setState({
			      msgSuccess: data.statusMessage,
			      showModal: false,
			      selectRevenueType:{
			      	label: '',
			      	value:''
			      }
			  });
			  setTimeout(function(){
			  	that.setState({
			  		msgSuccess: ''
			  	})
			  }, 3000)
			}
			that.getRevenueType();
		});
	}

	deleteRevenueType(){
		var that = this;
		var reqQuery = {};
		var id = this.state.selectRevenueType.value;
		var revenuetypeinformation = this.state.revenuetypeinformation;
	    revenuetypeinformation['id'] = id;

		reqQuery = {
			"isdeleted":true,
			"revenueid": id,
			"userdetails":getUserDetails()
		}

		const request = new Request(`${process.env.API_HOST}/ManageRevenueTypes.svc/DeleteRevenueType/json`, {
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

			if (data.statusCode >= 400) {
			  that.setState({
			      msgFailure: data.statusMessage,
			      showModal: false
			  })
			} else {
			  that.setState({
			      msgSuccess: data.statusMessage,
			      showModal: false,
			      selectRevenueType:{
			      	label: '',
			      	value:''
			      }
			  });
		  	setTimeout(function(){
			  	that.setState({
			  		msgSuccess: ''
			  	})
			  }, 3000)
			}
			that.getRevenueType();
		});
	}




	convertDataURIToBinary(dataURI) {
	  var BASE64_MARKER = ';base64,';
	  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	  var base64 = dataURI.substring(base64Index);
	  var raw = window.atob(base64);
	  var rawLength = raw.length;
	  var array = new Array(new ArrayBuffer(rawLength));

	  for(var i = 0; i < rawLength; i++) {
	    array[i] = raw.charCodeAt(i);
	  }
	  return array;
	}


	getPreview(file){
		var Products = this.state.Product;
		Products['image'] = this.convertDataURIToBinary(file);
		this.setState({
			Product: Products
		})
	}




	render(){
		console.log(this.state)
		var currentDomain = window.sessionStorage.getItem("currentdomainname");
		var currentStore = window.sessionStorage.getItem("currentstorename");
		const {
			pageHead,
			ProductGroups,
			VendorAccountsList,
			RevenueTypeList,
			taxGroupList,
			PrinterGroups,
			ProductList,
			modelMode,
			MeasuringUnitsList,
			Product,
			msgFailure, msgSuccess } = this.state;

		//console.log(ProductList)
		//ProductGroups
		var ProductGroup = ProductGroups.map(function(o){
			return{
				value:o.id,
				label:o.name
			}
		})
		//VendorAccountsList
		var VendorAccounts = VendorAccountsList.map(function(o){
			return{
				label:o.name,
				value:o.id
			}
		})
		//RevenueTypeList
		var RevenueType = RevenueTypeList.map(function(o){
			return{
				label:o.name,
				value:o.id
			}
		})
		//TaxGroupList
		var taxGroup = taxGroupList.map(function(o){
			return{
				label:o.name,
				value:o.id
			}
		})
		//selectPrinterGroups
		var optionPrinterGroup = PrinterGroups.map(function(o){
			return{
				label:o.name,
				value:o.id
			}
		})
		//ProductList
		var AllProducts = ProductList.map(function(o){
			return{
				label:o.name,
				value:o.id
			}
		})

		//Meta Product Dropdown value
		let MetaProduct = [];
		let MetaMeasuringUnit = [];

		for (let k = 0; k < ProductList.length; k++) {
		  MetaProduct.push(<option key={ProductList[k].id} value={ProductList[k].id}>{ProductList[k].name}</option>);
		}

		for (let k = 0; k < MeasuringUnitsList.length; k++) {
		  MetaMeasuringUnit.push(<option key={MeasuringUnitsList[k].id} value={MeasuringUnitsList[k].id}>{MeasuringUnitsList[k].measurement}</option>);
		}


		//MeasuringUnitsList
		var optionMeasuringUnitsList = MeasuringUnitsList.map(function(o){
			return{
				label:o.measurement,
				value:o.id
			}
		})

		return(
		<DefaultLayout>
			<div className="page-head inner__pageHead">
					<div className="domain-icon"> <img src={require( './product-box.svg')}/>
							<h2>{pageHead.pagehead}</h2>
					</div>
					<ol className="breadcrumb">
							<li>
									<Link to={`/domains`}>{currentDomain}</Link>
							</li>
							<li>
									<Link to={`/stores`}>{currentStore}</Link>
							</li>
							<li>
									<Link to={`/dashboard`}>{pageHead.dashboard}</Link>
							</li>
							<li>
									<Link to={`/setup`}>{pageHead.setup}</Link>
							</li>
							<li>
									<Link to={`/products`}>Products</Link>
							</li>
							<li className="active">{pageHead.pagehead}</li>
					</ol>
			</div>
			<main>
			<div className="row">
					<div className="col-sm-12 ">
							{msgFailure &&
							<div className="alert alert-warning alert-dismissible" role="alert">
									<button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> {msgFailure}
							</div>} {msgSuccess &&
							<div className="alert alert-success alert-dismissible" role="alert">
									<button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> {msgSuccess}
							</div>}
							<div className="addproduct-wrap">
									<div className="widget widget-small">
											<div className={classnames( 'form-group', { error: !!this.state.errors.name})}>
													<TextInput type="text" name="name" label="Product Name" required="*" value={this.state.name} defaultValue="" placeholder="" className={classnames( 'form-control', { error: !!this.state.errors.name})} onChange={this.onChange} />
													<span>{this.state.errors.name}</span>
											</div>
											<div className={classnames( 'form-group', { error: !!this.state.errors.selectProductGroup})}>
													<label className="control-label">Product Group <span className="required">*</span></label>
													<Select name="productgroup" value={this.state.selectProductGroup.value} options={ProductGroup} onChange={this.handleSelectItems.bind(this, 'productgroup')} />
													<span id="selectProductGroup">{this.state.errors.selectProductGroup}</span>
											</div>
											<div className='form-group multiselect-wrap'>
													<label>Vendor</label>
													<Select name="vendors" value={this.state.selectVendorAccountsList} options={VendorAccounts} onChange={this.handleVendorAccountList.bind(this, 'vendors')} multi={true} /> {/*
													<span>{this.state.errors.selectVendorAccountsList}</span>*/}
											</div>

											<div className={classnames( 'form-group', { error: !!this.state.errors.selectRevenueType})}>
													<label>Revenue Type <span className="required">*</span></label>
													<Select name="revenuetype" value={this.state.selectRevenueType.value} options={RevenueType} onChange={this.updateRevenueType} />
													<span>{this.state.errors.selectRevenueType}</span>
													<div className="row">
															<div className="col-sm-12 u-mt10 btn-revenue">
																	<div className="pull-right">
																			<button className="btn btn-primary" title="Add Revenue Type" disabled={this.state.disableAdd} onClick={this.open}><i className="fa fa-plus" title="Add Revenue Type"></i>
																				</button>&nbsp;


																			<Confirm onConfirm={this.deleteRevenueType} body="Are you sure you want to delete this?" confirmText="Confirm Delete" className="btn-store-bin" title="Deleting Revenue Type">
																					<button className="btn btn-danger" disabled={this.state.disableDelete}><i className="fa fa-minus"></i>
																	</button>
																			</Confirm>&nbsp;

																			<button className="btn btn-warning" title="Edit Revenue Type" disabled={this.state.disableEdit} onClick={this.openEdit}><i className="fa fa-pencil" title="Edit Revenue Type"></i>
																				</button>
																	</div>
															</div>
													</div>
											</div>
											<div className={classnames( 'form-group multiselect-wrap', { error: !!this.state.errors.selectMeasurementType})}>
													<label>Measurement Type<span className="required">*</span></label>
													<Select name="measurementtype" value={this.state.selectMeasurementType.value} options={optionMeasuringUnitsList} onChange={this.handleSelectItems.bind(this, 'measurementtype')} />
													<span>{this.state.errors.selectMeasurementType}</span>
											</div>
											<div className="form-group">
													<TextInput type="text" name="invcap" label="Threshold Limit" value={this.state.invcap} defaultValue="" placeholder="" className="form-control" onChange={this.onChange} />
											</div>
											<div className="form-group">
													<TextInput type="text" name="menuposition" label="Menu Position" value={this.state.menuposition} defaultValue="" placeholder="" className="form-control" onChange={this.onChange} />
											</div>
											<div className={classnames( 'form-group', { error: !!this.state.errors.upc})}>
													<TextInput type="text" name="upc" label="Barcode" value={this.state.upc} defaultValue="" placeholder="" className={classnames( 'form-control', { error: !!this.state.errors.upc})} onChange={this.onChange} />
													<span>{this.state.errors.upc}</span>
											</div>
											<div className={classnames( 'form-group', { error: !!this.state.errors.maxfloorqty})}>
													<TextInput type="text" name="maxfloorqty" label="Max Floor Capacity" required="*" value={this.state.maxfloorqty} defaultValue="" placeholder="" className={classnames( 'form-control', { error: !!this.state.errors.maxfloorqty})} onChange={this.onChange} />
													<span>{this.state.errors.maxfloorqty}</span>
											</div>


									</div>
									<div className="widget widget-small">
											<div className="form-group">
													<div className="row">
															<div className="col-sm-4">
																	<label>Prompt for Price
																		<a className="productoptions"> (?) <div><img style={{maxWidth: '400px'}} src={require( './PromptForPrice.png')} /></div></a>
																	</label>
																	<Checkbox
																		onChange={this.handlechange}
																		checked={Product.promptforprice}
																		name="promptforprice"
																		id="promptforprice"
																		label=""
																	/>
															</div>
															<div className="col-sm-4">
																<label>Prompt for metadata
																	<a className="productoptions"> (?) <div><img style={{maxWidth: '400px'}} src={require( './PromptForMetaData.png')} /></div></a>
																</label>
																<Checkbox
																	onChange={this.handlechange}
																	checked={Product.promptformetadata}
																	name="metaproductdata"
																	id="metaproductdata"
																	label=""
																/>
															</div>
															<div className="col-sm-4">
																<label>Prompt for Weight
																	<a className="productoptions"> (?) <div><img style={{maxWidth: '400px'}} src={require( './WeightPriceAsking.png')} /></div></a>
																</label>
																<Checkbox
																	onChange={this.handlechange}
																	checked={Product.useweightpricing}
																	name="useweightpricing"
																	id="useweightpricing"
																	label=""
																/>
														</div>
													</div>
											</div>
										</div>

									<div className="widget widget-small">
											<div className="row">
													<div className="col-sm-12">
															<div className="product-widget-head bottom20">Pricing & Taxes</div>
													</div>
											</div>

											<div className={classnames( 'form-group', { error: !!this.state.errors.price})}>
													<TextInput 
													type="text" 
													name="price" 
													label="Price" 
													value={this.state.price} 
													defaultValue="" 
													required="*" 
													placeholder="" 
													className={classnames( 'form-control', { error: !!this.state.errors.price})} 
													onChange={this.onChange} 
													disabled={Product.promptforprice || Product.promptformetadata} />
													<span>{this.state.errors.price}</span>
											</div>
											{/*this.state.enablePrice &&
											<div className={classnames( 'form-group', { error: !!this.state.errors.price})}>
													<TextInput type="text" name="price" label="Price" value="0" defaultValue="" disabled="disabled" placeholder="" className={classnames( 'form-control', { error: !!this.state.errors.price})} onChange={this.onChange} />
													<span>{this.state.errors.price}</span>
											</div>*/}
											<div className={classnames( 'form-group', { error: !!this.state.errors.selectTaxGroup})}>
													<label>Tax Group<span className="required">*</span></label>
													<Select name="taxGroup" value={this.state.selectTaxGroup.value} options={taxGroup} onChange={this.handleSelectItems.bind(this, 'taxgroup')} />
													<span>{this.state.errors.selectTaxGroup}</span>
											</div>

									</div>
									<ImageUpload getPreview={this.getPreview} />
									<div className="widget widget-small">
											<div className={classnames( 'form-group', { error: !!this.state.errors.selectPrinterGroups})}>
													<label>Printer Group<span className="required"> *</span></label>

													<Select name="printergroup" value={this.state.selectPrinterGroups.value} options={optionPrinterGroup} onChange={this.handleSelectItems.bind(this, 'printergroup')} />
													<span>{this.state.errors.selectPrinterGroups}</span>
											</div>

									</div>
									<div className="widget widget-small">
											<div className="form-group">
													<label className="control-label">Age Restricted Product</label>
													<div className="">
															<div className="switch-button switch-button-info">
																	<input type="checkbox" onChange={this.handlechange} checked={Product.isagerestrict} name="isagerestrict" id="isagerestrict" />
																	<span><label htmlFor="isagerestrict"></label></span>
															</div>
													</div>
											</div>

											<div className="form-group">
													<label className="control-label">Display on Billing Screen</label>
													<div className="">
															<div className="switch-button switch-button-info">
																	<input type="checkbox" onChange={this.handlechange} checked={Product.isdisplayonbilling} name="isdisplayonbilling" id="isdisplayonbilling" />
																	<span><label htmlFor="isdisplayonbilling"></label></span>
															</div>
													</div>
											</div>
									</div>
									{/* <div className="widget widget-small">
											<div className="form-group">
													<Checkbox onChange={this.handlechange} checked={Product.metaproductdata} name="metaproductdata" id="metaproductdata" label="Prompt for Metadata" />
											</div>
											<div className="form-group">
													<Checkbox
														onChange={this.handlechange}
														checked={Product.useweightpricing}
														name="useweightpricing"
														id="useweightpricing"
														label="Prompt for Weight"
													/>
											</div>
									</div> */}
									{/*
									<MetaRepeater ProductList={this.state.ProductList} Measurement={this.state.MeasuringUnitsList} />*/} {/*
									<IncorporationForm ProductList={this.state.ProductList} Measurement={this.state.MeasuringUnitsList} />*/}

									{!Product.metaproductdata && <button
										type="button"
										onClick={this.handleAddShareholder}
										className="btn btn-primary md-trigger btn-addmeta">Add Metadata
									</button>}
									{this.state.metaproductlist.map((shareholder, idx) => (
									<div className="row metadata" key={idx}>
											<div className="col-sm-4">
													<div className="form-group">
															<select className="form-control " key={idx} onChange={this.handleProductSelect(idx)} value={this.state.metaproductlist.name}>
													<option>Select Product</option>
													{MetaProduct}
												</select>
													</div>
											</div>

											<div className="col-sm-4">
													<div className="form-group">
															<select className="form-control" onChange={this.handleMeasurementTypeSelect(idx)}>
												<option>Select Measurement Type</option>
													{MetaMeasuringUnit}
												</select>
													</div>
											</div>
											<div className="col-sm-3">
													<div className="form-group">
															<input type="text" placeholder="Quantity" className="form-control" value={shareholder.quantity} onChange={this.handleShareholderNameChange(idx)} />
													</div>
											</div>

											<div className="metadata-butn-wrap">
													<a onClick={this.handleRemoveShareholder(idx)}><i className="icon icon-1089"></i></a>
											</div>
									</div>
									))}


									<div className="col-sm-12 form-bot-butn-wrap">
											<div className="form-bot-butns round-btns">
													<button type="submit" className="btn btn-primary md-trigger" data-modal="full-success" onClick={this.onSubmit}>Save</button>
													<button type="submit" className="btn btn-default md-trigger" data-modal="full-danger" onClick={this.onCancel}>Cancel</button>
											</div>
									</div>

							</div>
					</div>

			</div>

			<Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>
					<form>
							<Modal.Header closeButton>
									<Modal.Title>{this.state.modelTitle}</Modal.Title>
							</Modal.Header>
							<Modal.Body>
									<div className={classnames( 'form-group', { error: !!this.state.errors.revenuetype})}>
											<TextInput type="text" name="revenuetype" label="Revenue Type" value={this.state.revenuetypeField} defaultValue={this.state.revenuetypeFieldEdit} placeholder="" required="*" className={classnames( 'form-control', { error: !!this.state.errors.revenuetype})} onChange={this.modelFieldChange} />
											<span>{this.state.errors.revenuetype}</span>
									</div>
							</Modal.Body>
							<Modal.Footer>
									{modelMode == 'A' ?
									<Button className="btn-submit" onClick={this.addRevenueType}>Add Revenue Type</Button>: null} {modelMode == 'E' ?
									<Button className="btn-submit" disabled={this.state.disabledUpdate}onClick={this.editRevenueType}>Update Revenue Type</Button>: null}
									<Button className="btn-cancel" onClick={this.close}>Cancel</Button>
							</Modal.Footer>
					</form>
			</Modal>
			</main>
		</DefaultLayout>
		)
	}
}
export default AddProduct;