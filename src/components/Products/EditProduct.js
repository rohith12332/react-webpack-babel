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
import MetaRepeater from './MetaRepeater';
import getCurrentDate from '../common/Date';
import axios from 'axios';
var _ = require('underscore');

class EditProduct extends Component{
	constructor(props) {
		super(props);
		this.state = {
				pageHead:{
					pagehead:'Edit Product',
					dashboard: 'Dashboard',
					setup: 'Setup'
				},
				"Product":{
					"caloriecount": 0,
					"color":"",
					"countsassalesrevenue": false,
					"createdby":"OnePos",
					"createddate": getCurrentDate(),
					"downtick": 0,
					"id":"1627aea5-8e0a-4371-9022-9b504344e724",
					"image":[],
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
						"name":"",
						"mname":"",
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
					"useweightpricing": false
				},
				"vendorids":"",
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
				revenuetypeFieldEdit:"",
				ProductList:[],
				imagePreview:'',
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
				//selectVendorAccountsList:[],
				selectVendorAccountsList:{
					label:"",
					value:""
				},
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
				metaproductlist: [],
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
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
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
		var that = this;
		this.GetAllProducts();
		this.GetProductgroups();

		this.getAllVendors();
		this.getRevenueType();
		this.getTaxGroups();
		this.GetPrintergroups();
		this.GetMeasurementType();

		this.getSingleProduct();
		setTimeout(function(){
			that.getSinglePrinterGroup();
		}, 2000)

		$("html, body").stop().animate({scrollTop:0}, 500, 'swing', function() {});
	}

//******************REPEATER ***************/
  handleNameChange = (evt) => {
    this.setState({ quantity: evt.target.value });
  }

	handleProductSelect = (idx) => (evt) => {
		//console.log(evt.target.options[ evt.target.selectedIndex ].value)
		if(this.state.metaproductlist === null) this.state.metaproductlist = [];
		const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
		  if (idx !== sidx) return shareholder;
		  return {
		  	...shareholder,
		  	id: evt.target.options[ evt.target.selectedIndex ].id,
		  	name: evt.target.options[ evt.target.selectedIndex ].text
		  };
		});
		this.setState({
		  metaproductlist: newShareholders
		  //,selectAllProducts: evt
		});
	}

  handleMeasurementTypeSelect = (idx) => (evt) => {
  	if(this.state.metaproductlist === null) this.state.metaproductlist = [];
    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, mid: evt.target.options[ evt.target.selectedIndex ].id, mname: evt.target.options[ evt.target.selectedIndex ].text};
    });
    this.setState({
      metaproductlist: newShareholders
      //,selectMeasurementType: evt
    });
  }

  handleShareholderNameChange = (idx) => (evt) => {
  	if(this.state.metaproductlist === null) this.state.metaproductlist = [];
    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {

	//console.log(newShareholders)

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
  	if(this.state.metaproductlist === null) this.state.metaproductlist = [];
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
	//console.log(this.state.selectVendorAccountsList.length)

/*	if (this.state.selectVendorAccountsList.length == 0) {
		errors.selectVendorAccountsList = "Please select Vendor"
	}*/
	if (this.state.selectRevenueType.value === '') {
		errors.selectRevenueType = "Please select Revenue Type"
	}
	if (this.state.selectMeasurementType.value === '') {
		errors.selectMeasurementType = "Please select Measurement Type"
	}
	if (this.state.Product.maxfloorqty === '') {
		document.getElementById("maxfloorqty").focus();
		errors.maxfloorqty = "Max Floor Qty can't be empty"
	}
	
	if(this.state.Product.promptforprice === false){
		if (this.state.Product.price === '') {
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

	onCancel(){
		browserHistory.push('/products')
	}

	getSinglePrinterGroup(){
		//Get Single Printer Group
		var productgroupprinterid = this.state.Product.productgroupprinterid;
		var PrinterGroup = this.state.PrinterGroups;

		var obj = PrinterGroup.filter(function ( obj ) {
		    return obj.id === productgroupprinterid;
		})[0];

		if(obj !== undefined){
			this.setState({
				selectPrinterGroups: {
				label:obj.name,
				value:obj.id
				}
			})
		}

		//Get Single Product Group
		var productgroupid = this.state.Product.productgroupid;
		var ProductGroups = this.state.ProductGroups;

		var obj2 = ProductGroups.filter(function ( obj2 ) {
		    return obj2.id === productgroupid;
		})[0];

		if(obj2 !== undefined){
			this.setState({
				selectProductGroup: {
				label:obj2.name,
				value:obj2.id
				}
			})
		}

		//Get Single Measurement Type
		var measuringunitid = this.state.Product.measuringunitid;
		var MeasuringUnitsList = this.state.MeasuringUnitsList;

		var obj3 = MeasuringUnitsList.filter(function ( obj3 ) {
		    return obj3.id === measuringunitid;
		})[0];

		if(obj3 !== undefined){
			this.setState({
				selectMeasurementType: {
				label:obj3.name,
				value:obj3.id
				}
			})
		}

		//Get Single Revenue Type
		var revenuetypeid = this.state.Product.revenuetypeid;
		var RevenueTypeList = this.state.RevenueTypeList;

		var obj4 = RevenueTypeList.filter(function ( obj4 ) {
		    return obj4.id === revenuetypeid;
		})[0];

		if(obj4 !== undefined){
			this.setState({
				selectRevenueType: {
				label:obj4.name,
				value:obj4.id
				}
			})
		}

		//Get Single TaxGroup
		var taxgroupid = this.state.Product.taxgroupid;
		var taxGroupList = this.state.taxGroupList;

		var obj5 = taxGroupList.filter(function ( obj5 ) {
		    return obj5.id === taxgroupid;
		})[0];

		if(obj5 !== undefined){
			this.setState({
				selectTaxGroup: {
				label:obj5.name,
				value:obj5.id
				}
			})
		}
	}

	getSingleProduct() {
		var that = this;
		var reqQuery = {};
		var productid;

		productid = this.props.location.pathname.split('/')[2];

		reqQuery['userdetails'] = getUserDetails();
		reqQuery['productid'] = productid;

        //function to convert base64 image
        function arrayBufferToBase64( buffer ) {
			var binary = '';
			var bytes = new Uint8Array( buffer );
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
			  binary += String.fromCharCode( bytes[ i ] );
			}
			return window.btoa( binary );
        }

        console.log(JSON.stringify(reqQuery));

		axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetSingleProduct/json`, reqQuery)
		 .then(function (response) {
		 	console.log(response)
		 	var response,
		 	productGroup,
		 	PrinterGroups,
		 	productgroupprinterid,
		 	revenuetypeid,
		 	taxgroupid,
		 	imageArray,
		 	base64;
		 	response = response.data.Product;
			imageArray = response.image;

			/* get single product group by passing printer group id
			Call Single Group by ID */

			//productgroupprinterid = response.productgroupprinterid;
			//revenuetypeid = response.revenuetypeid;
			//taxgroupid = response.taxgroupid;

			//that.GetSinglePrinterGroup(productgroupprinterid);
			//that.getSingleTaxGroup(taxgroupid);
			//that.getSingleRevenueType(revenuetypeid);

			that.setState({
				metaproductlist:response.metaproductlist
			})

			var reqQuery = {};
			reqQuery['ProductId'] = response.id;
			reqQuery['userdetails'] = getUserDetails();
			console.log(reqQuery)

			axios.post(`${process.env.API_HOST}/ManageVendorProducts.svc/GetAllVendorsUnderProduct/json`, reqQuery)
			.then(function(response){
				console.log(response)
			var VendorAccountsList = that.state.VendorAccountsList;
			var vendorproductlist = response.data.vendorproductlist;


			console.log(VendorAccountsList)
			console.log(vendorproductlist)

			var props = ['id', 'name'];
			var result = VendorAccountsList.filter(function(o1){
			    // filter out (!) items in result2
			    return vendorproductlist.some(function(o2){
			        return o1.id === o2.vendoraccountid; // assumes unique id
			    });
			}).map(function(o){
			    return props.reduce(function(newo, name){
			        newo[name] = o[name];
			        return newo;
			    }, {});
			});
			function changeData(data){
			    for(var i = 0; i < data.length; i++){
			        if(data[i].hasOwnProperty("id")){
			            data[i]["value"] = data[i]["id"];
			            data[i]["label"] = data[i]["name"];
			        }
			    }
			}

			changeData(result);
			that.setState({
				selectVendorAccountsList: result
			})

			console.log(result) 
			}).catch(function (error) {
		   		console.log("Bad Response");
			});

			//base64 image convert
			base64 = imageArray != null ? "data:image/jpg;base64,"+ arrayBufferToBase64(imageArray):"";

			that.setState({
				Product: response,
				imagePreview: base64
			})
		 })
		.catch(function (error) {
		   console.log(error);
		});
	}

	//Get single TaxGroup
	getSingleTaxGroup(itemId){
		var that = this;
		var reqQuery = {};

		reqQuery['TaxgroupID'] = itemId;
		reqQuery['userdetails'] = getUserDetails();
		axios.post(`${process.env.API_HOST}/ManageTaxes.svc/GetSingleTaxGroup/json`, reqQuery)
		 .then(function (response) {
		 	var response = response.data.taxGroup;
		    that.setState({
		      selectTaxGroup: {
		      	label: response.name,
		      	value: response.id
		      }
		    });
		 })
		 .catch(function (error) {
		   console.log(error);
		});
	}

	//get single printer group
	GetSinglePrinterGroup(itemId){
		var that = this;
		var reqQuery = {};

		reqQuery['printergroupId'] = itemId;
		reqQuery['userdetails'] = getUserDetails();
		//console.log(JSON.stringify(reqQuery))
		const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/GetSinglePrinterGroup/json`, {
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
		    if(data.printerGroup.Printers === null) data.printerGroup.Printers = [];
		    that.setState({
		      selectPrinterGroups: {
		      	label: data.printerGroup.name,
		      	value: data.printerGroup.id
		      }
		    });
		});
	}


	//TextFields Change handller
	onChange(e){
		const field = e.target.name;
		let Product = this.state.Product;
		Product[field] = e.target.value;
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
		//console.log(vendorProductInfo)
		
		var isValid = this.handleValidation();

		if(isValid) {

			$("html, body").stop().animate({scrollTop:0}, 500, 'swing', function() {});

  		getProductState['productgroupid'] = this.state.selectProductGroup.value;
  		getProductState['revenuetypeid'] = this.state.selectRevenueType.value;
  		getProductState['measuringunitid'] = this.state.selectMeasurementType.value;
  		getProductState['taxgroupid'] = this.state.selectTaxGroup.value;
  		getProductState['productgroupprinterid'] = this.state.selectPrinterGroups.value;

  		//console.log(getProductState['image'])
/*  		if(getProductState['image'].length == 0)
           getProductState['image'] = null;
  		*/
  		vendors = this.state.selectVendorAccountsList;
  		console.log(vendors)

  		var vendorid = vendors.map(function(o){
			return{
				value:o.id
			}
		})
  		console.log(vendorid);
  		//return false;
  	
/*  		if(getProductState['image'].length==0)
  		{
          getProductState['image'] = null;
  		}*/

  		reqQuery['Product'] = getProductState;
  		reqQuery['vendorids'] = vendorid;
  		reqQuery['Product']['metaproductlist'] = getMetaData;
  		reqQuery['Product']["IsMobileAccess"] = true;
  		reqQuery['userdetails'] = getUserDetails();

  		if(this.state.Product.promptforprice == true){
			reqQuery['Product']['price'] = 0;
  		}

  		console.log(JSON.stringify(reqQuery))

		axios.post(`${process.env.API_HOST}/ManageProducts.svc/UpdateProduct/json`, reqQuery)
		 .then(function (response) {

		 	console.log(response)

/*		   	vendorProductQuery['VProductinformation'] = vendorProductInfo;
		   	console.log(vendorProductInfo)
			
		   	vendorProductQuery['userdetails'] = getUserDetails();

			console.log(vendorProductQuery)
		   	vendorProductQuery['VProductinformation']['productid'] = response.data.productid;
		   	
		   	console.log(response.data.productid)

		   	vendorProductQuery['VProductinformation']['name'] = "OnePos";
		   	vendorProductQuery['VProductinformation']['vendoraccountid'] = vendors;
			console.log(JSON.stringify(vendorProductQuery));

			

			axios.post(`${process.env.API_HOST}/ManageVendorProducts.svc/CreateVendorProduct/json`, vendorProductQuery)
			.then(function(response){
				console.log(response)
			}).catch(function (error) {
		   		console.log("Bad Response");
			});
*/


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
				}, 5000)
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
				Product: Product
			})
		}
		if(event.target.name == 'isagerestrict'){
			var Product = this.state.Product;
			Product['isagerestrict'] = event.target.checked;
			this.setState({
				Product: Product
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
		/*switch (name) {*/
			if(name =='productgroup'){
			    this.setState({
          			selectProductGroup:value
      			})
      		}
      		if(name =='measurementtype'){
      			var Product = this.state.Product;
      			var pricemethod = 0;
      			if(value.label =='Unit') var pricemethod = 1;
				Product['pricemethod'] = pricemethod;
			    this.setState({
          			selectMeasurementType:value,
          			Product: Product
      			})
      		}
      		if(name =='taxgroup'){
      			this.setState({
          			selectTaxGroup:value
      			})
      		}
      		if(name =='printergroup'){
      			this.setState({
          			selectPrinterGroups:value
      			})
      		}

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

	handleVendorAccountList(name, value){
		for(var v in value){
			if(value.hasOwnProperty(v)){
				value[v]["label"] = value[v].label;
				value[v]["value"] = value[v].value;
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
		  	//console.log(data)
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


	//Fetch Single Revenue Type
	getSingleRevenueType(itemId){
	    var that = this;
	    var credentials = {};
	    credentials['userdetails'] = getUserDetails();
	    credentials['revenuetypeid'] = itemId;

	   // console.log(JSON.stringify(credentials));
	    const request = new Request(`${process.env.API_HOST}/ManageRevenueTypes.svc/GetSingleRevenueType/json`, {
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
	      	console.log(data)
		    that.setState({
		      selectRevenueType: {
		      	label: data.revenuetype.name,
		      	value: data.revenuetype.id
		      }
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
		//console.log(data)
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

	updateRevenueType(e){
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
				  })
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
		if(file !== null){
			Products['image'] = this.convertDataURIToBinary(file);
		}else{
			Products['image'] = null;
		}
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
			if(this.state.metaproductlist === null) this.state.metaproductlist = [];
		//console.log(this.state.selectVendorAccountsList)
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
		  MetaProduct.push(<option id={ProductList[k].id} key={ProductList[k].id} value={ProductList[k].name}>{ProductList[k].name}</option>);
		}


		for (let k = 0; k < MeasuringUnitsList.length; k++) {
		  MetaMeasuringUnit.push(<option id={MeasuringUnitsList[k].id} key={MeasuringUnitsList[k].id} value={MeasuringUnitsList[k].measurement}>{MeasuringUnitsList[k].measurement}</option>);
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
              <div className="domain-icon"> <img src={require( './product-box.svg')}/> <h2>{pageHead.pagehead}</h2></div>
              <ol className="breadcrumb">
								<li><Link to={`/domains`}>{currentDomain}</Link></li>
								<li><Link to={`/stores`}>{currentStore}</Link></li>
								<li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
								<li><Link to={`/setup`}>{pageHead.setup}</Link></li>
								<li className="active">{pageHead.pagehead}</li>
              </ol>
            </div>
						<main>
			      <div className="row">
			        <div className="col-sm-12 ">
								{msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
			          	<button type="button" className="close" data-dismiss="alert" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
			          {msgFailure}
			        </div>}
			        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
			          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			          {msgSuccess}
			        </div>}
			          <div className="addproduct-wrap buttonalign">
			            <div className="widget widget-small">
				          <div className={classnames('form-group', { error: !!this.state.errors.name})}>
				              <TextInput
				                type="text"
				                name="name"
				                label="Product Name"
				                required="*"
				                value={Product.name}
				                placeholder=""
				                onChange={this.onChange}
				                className={classnames('form-control', { error: !!this.state.errors.name})}
				              />
				              <span>{this.state.errors.name}</span>
				  		  </div>
							<div className={classnames('form-group', { error: !!this.state.errors.selectProductGroup})}>
			                  <label className="control-label">Product Group <span className="required">*</span></label>
			                    <Select
						          name="productgroup"
						          value={this.state.selectProductGroup.value}
						          options={ProductGroup}
						          onChange={this.handleSelectItems.bind(this, 'productgroup')}
						        />
						      <span id="selectProductGroup">{this.state.errors.selectProductGroup}</span>
			                </div>
			                <div className="form-group multiselect-wrap">
			                  <label>Vendor</label>
			                    <Select
						          name="vendors"
						          value={this.state.selectVendorAccountsList}
						          options={VendorAccounts}
						          onChange={this.handleVendorAccountList.bind(this, 'vendors')}
						          multi={true}
						        />
			                </div>
			                <div className={classnames('form-group', { error: !!this.state.errors.selectRevenueType})}>
			                  <label>Revenue Type <span className="required">*</span></label>
			                    <Select
						          name="revenuetype"
						          value={this.state.selectRevenueType.value}
						          options={RevenueType}
						          onChange={this.updateRevenueType}
						        />
						    <span>{this.state.errors.selectRevenueType}</span>
                          <div className="row">
                              <div className="col-sm-12 u-mt10 btn-revenue">
                                  <div className="pull-right">
                                      <button
	                                      className="btn btn-primary"
	                                      title="Add Revenue Type"
	                                      disabled={this.state.disableAdd}
	                                      onClick={this.open}><i className="fa fa-plus" title="Add Revenue Type"></i>
                                      </button>&nbsp;


                                      <Confirm
					                      onConfirm={this.deleteRevenueType}
					                      body="Are you sure you want to delete this?"
					                      confirmText="Confirm Delete"
					                      className="btn-store-bin"
					                      title="Deleting Revenue Type">
				                      	<button
					                      	className="btn btn-danger"
					                      	disabled={this.state.disableDelete}><i className="fa fa-minus"></i>
				                      	</button>
				                    </Confirm>&nbsp;

                                      <button
                                      	className="btn btn-warning"
                                      	title="Edit Revenue Type"
                                      	disabled={this.state.disableEdit}
                                      	onClick={this.openEdit}><i className="fa fa-pencil" title="Edit Revenue Type"></i>
                                      </button>

                                  </div>
                              </div>
                          </div>
			                </div>
			                <div className={classnames('form-group multiselect-wrap', { error: !!this.state.errors.selectMeasurementType})}>
			                  <label>Measurement Type<span className="required">*</span></label>
			                    <Select
						          name="measurementtype"
						          value={this.state.selectMeasurementType.value}
						          options={optionMeasuringUnitsList}
						          onChange={this.handleSelectItems.bind(this, 'measurementtype')}
						        />
						    	<span>{this.state.errors.selectMeasurementType}</span>
			                </div>
			                <div className="form-group">
								<TextInput
									type="text"
									name="invcap"
									label="Threshold Limit"
									value={Product.invcap}
									defaultValue=""
									placeholder=""
									className="form-control"
									onChange={this.onChange}
								/>
							</div>
							<div className="form-group">
								<TextInput
									type="text"
									name="menuposition"
									label="Menu Position"
									value={Product.menuposition}
									defaultValue=""
									placeholder=""
									className="form-control"
									onChange={this.onChange}
								/>
							</div>
							<div className={classnames('form-group', { error: !!this.state.errors.upc})}>
								<TextInput
									type="text"
									name="upc"
									label="UPC"
									value={Product.upc}
									placeholder=""
									className={classnames('form-control', { error: !!this.state.errors.upc})}
									onChange={this.onChange}
								/>
								<span>{this.state.errors.upc}</span>
							</div>
							<div className={classnames('form-group', { error: !!this.state.errors.maxfloorqty})}>
								<TextInput
									type="text"
									name="maxfloorqty"
									label="Max Floor Capacity"
									required="*"
									value={Product.maxfloorqty}
									defaultValue=""
									placeholder=""
									className={classnames('form-control', { error: !!this.state.errors.maxfloorqty})}
									onChange={this.onChange}
								/>
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

							<div className={classnames('form-group', { error: !!this.state.errors.price})}>
					              <TextInput
					                type="text"
					                name="price"
					                label="Price"
					                value={Product.price}
					                defaultValue=""
					                required="*"
					                placeholder=""
					                className={classnames('form-control', { error: !!this.state.errors.price})}
					                onChange={this.onChange}
					                disabled={Product.promptforprice}
					              />
					              <span>{this.state.errors.price}</span>
					  		</div>
			              	{/*Product.promptforprice &&
												<div className={classnames('form-group', { error: !!this.state.errors.price})}>
																	<TextInput
																		type="text"
																		name="price"
																		label="Price"
																		value= "0"
																		defaultValue=""
																		disabled="disabled"
																		placeholder=""
																		className={classnames('form-control', { error: !!this.state.errors.price})}
																		onChange={this.onChange}
																	/>
																	<span>{this.state.errors.price}</span>
													</div>*/}

			                <div className={classnames('form-group', { error: !!this.state.errors.selectTaxGroup})}>
			                  <label>Tax Group<span className="required">*</span></label>
		                    <Select
					          name="taxGroup"
					          value={this.state.selectTaxGroup.value}
					          options={taxGroup}
					          onChange={this.handleSelectItems.bind(this, 'taxgroup')}
					        />
					        <span>{this.state.errors.selectTaxGroup}</span>
			                </div>

			            </div>
			            <ImageUpload getPreview={this.getPreview} getImage={this.state.imagePreview} />
			            <div className="widget widget-small">
			              <div className="row">
			                <div className="col-sm-12">
			                  <div className="product-widget-head bottom20">Printers</div>
			                </div>
			              </div>
			                <div className={classnames('form-group', { error: !!this.state.errors.selectPrinterGroups})}>
			                  <label>Printer Group<span className="required"> *</span></label>

		                    <Select
					          name="printergroup"
					          value={this.state.selectPrinterGroups.value}
					          options={optionPrinterGroup}
					          onChange={this.handleSelectItems.bind(this, 'printergroup')}
					        />
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

						{!Product.metaproductdata && <button
							type="button"
							onClick={this.handleAddShareholder}
							className="btn btn-primary md-trigger btn-addmeta">Add Metadata
						</button>}
						{this.state.metaproductlist.map((shareholder, idx) => (
				          <div className="row metadata" key={idx}>
					          <div className="col-sm-4">
					          	<div className="form-group">

						          <select
						          	className="form-control"
						          	onChange={this.handleProductSelect(idx)}
						          	value={shareholder.name}
						          >
						          	<option>Select Product</option>
						          	{MetaProduct}
						          </select>
						        </div>
					          </div>

					          <div className="col-sm-4">
					          	<div className="form-group">
						          <select
						          	className="form-control"
						          	onChange={this.handleMeasurementTypeSelect(idx)}
						          	value={shareholder.mname}
						          	>
						          <option>Select Measurement Type</option>
						          	{MetaMeasuringUnit}
						          </select>
						        </div>
						      </div>
					          <div className="col-sm-3">
					          	<div className="form-group">
						            <input
						              type="text"
						              placeholder="Quantity"
						              className="form-control"
						              value={shareholder.quantity}
						              onChange={this.handleShareholderNameChange(idx)}
						            />
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
					</div>
				</div>
			</div>
			</main>
			</DefaultLayout>
		)
	}
}
export default EditProduct;