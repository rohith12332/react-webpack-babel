import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
import Checkbox from '../common/Checkbox';
import RadioInput from '../common/RadioInput';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import classnames from 'classnames';
import TextInput from '../common/TextInput';
import getCurrentDate from '../common/Date';
import SideBarRight from '../common/SideBarRight';
import getUserDetails from '../common/CredentialDomain';
import Tabelify from '../react-tabelify/Tabelify';
import './discounts.css';
var discount = require('./discount.svg');
var _ = require('underscore');

//Table Column Defination
var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Discount Name"
    },
    {
        "columnName": "Type",
        "displayName": "Discount Type",
    },
    {
        "columnName": "variableAmount",
        "displayName": "VariableAmount",
    },
    {
        "columnName": "variablePercentage",
        "displayName": "VariablePercentage",
    },
    {
        "columnName": "Rate",
        "displayName": "Rate",
    },
    {
        "columnName": "id",
        "displayName": "Actions",
        render:()=>{
            return <div></div>
        },
        "flexBasis":'190px'
    }
];

class Discounts extends React.Component{
  constructor(props) {
    super(props);
        this.onChangeGrid = this.onChangeGrid.bind(this);
        this.state = {
        msgSuccess: "",
        msgFailure: "",
        showModal: false,
        showEditModal: false,
        discounts:[],
        singlediscountinformation:{},
        errors: [],
        pageHead:{
        pagehead:'Discounts',
        dashboard: 'Dashboard',
        setup: 'Setup'
      },
          discountinformation:{
            cancombine:false,
            createdby:"",
            createddate:"",
            id:"1627aea5-8e0a-4371-9022-9b504344e724",
            isdeleted:false,
            isvariableamount:false,
            isvariablepercent:true,
            modifiedby:"",
            modifieddate:"",
            name:"",
            promptusertoenternotes:false,
            rateasdollaroramount:0,
            rateasdollarorpercent:0,
            store_id:"1627aea5-8e0a-4371-9022-9b504344e724",
            typeofdiscount:2,
            usecouponapi:false
          },

          tableConfig: {
            data:[],
            columnMetadata: columnMetadata,
            currentPage: 1,
            showCheckbox: false,
            onChangeGrid: this.onChangeGrid,
            selectedRows: {},
            onRowClick: this.onRowClick,
            resultsPerPage: 10,
            localSearch: true,
            btnText: 'Add Discount'
          },
          singleDiscount:"",
          checked:1,
          isamount:false,
          ispercentage:false,
          readamount : true,
          readpercentage:true,
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.editClose = this.editClose.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.handlePromotionCheck = this.handlePromotionCheck.bind(this);
        this.handleCheckAmountorPercent = this.handleCheckAmountorPercent.bind(this);
        this.RemoveDiscounts = this.RemoveDiscounts.bind(this);
        this.onChange = this.onChange.bind(this);

  }
  componentDidMount() {
    this.getAllDiscounts();
  }
    open() {
      var that = this;
      that.handleCheckAmountorPercent('isvariablepercent');
       return that.setState({
          showModal: true,
          discountinformation:{
            cancombine:false,
            createdby:"",
            createddate:"",
            id:"1627aea5-8e0a-4371-9022-9b504344e724",
            isdeleted:false,
            isvariableamount:false,
            isvariablepercent:true,
            modifiedby:"",
            modifieddate:"",
            name:"",
            promptusertoenternotes:false,
            rateasdollaroramount:0,
            rateasdollarorpercent:0,
            store_id:"1627aea5-8e0a-4371-9022-9b504344e724",
            typeofdiscount:2,
            usecouponapi:false
          },
          isamount:false,
          ispercentage:false,
          readamount : true,
          readpercentage:true
        });

    }
    close(event){
        this.setState({
            showModal: false
        });
    }

    editClose(){
        this.setState({showEditModal: false});
    }



handleChange(event){
let field = event.target.name;
var EditModal = this.state.showEditModal;
var discounts ={};
    if(event.target.type =='checkbox'){
        if(EditModal)
        {
            discounts = this.state.singlediscountinformation;
            discounts[field]=event.target.checked;
            this.setState({
                singlediscountinformation : discounts
            })
        }
        else
        {
            discounts = this.state.discountinformation;
            discounts[field]=event.target.checked;
            this.setState({
                discountinformation : discounts
            })
        }
    }
}

  validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }

  validateNumber(value) {
      var onlynumber = /^\d*$/;
      return onlynumber.test(value);
  }

   handleValidation() {
      let errors = {};
       var discount ={};
       var EditModal = this.state.showEditModal;
       if(EditModal)
        {discount = this.state.singlediscountinformation;}
       else
        {discount = this.state.discountinformation;}


      //Form validation error message

      if (discount.name.trim() === '') {
        document.getElementById("name").focus();
        errors.name = "Discount Name can't be empty"
      }

      if(this.state.ispercent)
      {
        if(parseInt(discount.rateasdollarorpercent.trim())==0)
        {
         errors.readpercentage = "Discount percentage can't be empty";
        }else if (!this.validateNumber(discount.rateasdollarorpercent)) {
          document.getElementById("rateasdollarorpercent").focus();
          errors.readpercentage = "Invalid Percentage"
      }

        if(parseInt(discount.rateasdollarorpercent) >100)
        {
         errors.readpercentage = "Discount Percentage should not greater than 100";
        }
      }

      if(this.state.isamount)
      {
          if(parseInt(discount.rateasdollaroramount.trim())==0)
          {
           errors.readamount =" Discount Amount can't be empty";
          }else if (!this.validateNumber(discount.rateasdollaroramount)) {
          document.getElementById("rateasdollaroramount").focus();
          errors.readamount = "Invalid Amount"
      }
    }

      this.setState({
          errors
      }); //Set Errors state

      return Object.keys(errors).length == 0;
  }


  RemoveDiscounts(itemId){

      var that = this;
      var delQuery = {};
      var index = -1;
      var _discountslen= this.state.discounts.length;

      for( var i = 0; i < _discountslen; i++ ) {
        if(this.state.discounts[i].id == itemId){
          index = i;
          break;
        }
      }
      this.state.discounts.splice( index, 1 );
      this.setState({discounts: this.state.discounts});

      delQuery['isdeleted'] = true;
      delQuery['discountid'] = itemId;
      delQuery['userdetails'] = getUserDetails();

      console.log(delQuery);

      const request = new Request(`${process.env.API_HOST}/ManageDiscounts.svc/DeleteDiscount/json`, {
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





  onUpdate(event) {
  event.preventDefault();
  var that = this;
  var isValid =  this.handleValidation();
  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  var credentials = getUserDetails();
  credentials["domainuniquekey"] = domainuniquekey;
  credentials["storeuniquekey"] = storeuniquekey;
  if(isValid){
  const updateDiscount = {};
   updateDiscount["discountinformation"] = this.state.singlediscountinformation;
   updateDiscount["userdetails"] = credentials;
  var olddiscounts = this.state.tableConfig.data;
  var olddiscountslen = that.state.tableConfig.data.length;
  for( var i = 0; i < olddiscountslen; i++ ) {
  var discounts = that.state.tableConfig.data;
  var DiscountID = this.state.singlediscountinformation.id;
  if(discounts[i].id == DiscountID){
        // discounts[i] = this.state.singlediscountinformation;
         var obj = this.state.singlediscountinformation;
          var rate =0;
           obj["variableAmount"] = obj.isvariableamount ===true?"Yes":"No";
            obj["variablePercentage"] = obj.isvariablepercent ===true?"Yes":"No";
            console.log(obj);
             if(obj.isvariableamount === false &&  obj.isvariablepercent === false)
             {
               if(parseInt(obj.rateasdollaroramount) >0)
               {
                rate = obj.rateasdollaroramount;
               }
               if(parseInt(obj.rateasdollarorpercent)>0)
               {
                rate = obj.rateasdollarorpercent;
               }
             }

             obj["Rate"]=rate;
             var type ="";
             if(parseInt(obj.typeofdiscount) === 2)
             {
               type ="promotion";
             }
             else if(parseInt(obj.typeofdiscount) === 1)
             {
               type="void";
             }
             else if(parseInt(obj.typeofdiscount) === 3)
             {
               type="comp";
            }
            obj["Type"] =type;
            discounts[i] = obj;

  }
  }
  console.log(JSON.stringify(updateDiscount));
  const request = new Request(`${process.env.API_HOST}/ManageDiscounts.svc/UpdateDiscount/json`, {
  method: 'POST',
  headers: new Headers({
  'Content-Type':'application/json'
  }),
  body: JSON.stringify(updateDiscount)
  });
  return fetch(request).then(response => {
  if (response.status >= 400) throw new Error("Bad response from server");
  return response.json();
  }).then(function(data) {
  if (data.statusCode !== 200) {
  that.setState({
  msgFailure: data.statusMessage,
  showEditModal: false
  })
  }else{

  that.setState({
  msgSuccess: data.statusMessage,
  showEditModal: false,
  discounts : discounts,
  isamount:false,
          ispercentage:false,
          readamount : true,
          readpercentage:true
  });
  setTimeout(function() {
            that.setState({
              msgSuccess: ''
            })
          }, 2000)
  }
  }).catch(error => {
  return error;
  });
  }
  // }
  }



  onSubmit(event) {
  event.preventDefault();
  var that = this;
  var isValid = this.handleValidation();
  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  var credentials = getUserDetails();
  credentials["domainuniquekey"] = domainuniquekey;
  credentials["storeuniquekey"] = storeuniquekey;
  if(isValid){
  const addDiscount = {};

  addDiscount["discountinformation"] = this.state.discountinformation;
  addDiscount["userdetails"] = credentials;

  var oldDiscountState = this.state.discounts;

  console.log(JSON.stringify(addDiscount));

  const request = new Request(`${process.env.API_HOST}/ManageDiscounts.svc/CreateDiscount/json`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type':'application/json'
    }),
    body: JSON.stringify(addDiscount)
  });

  return fetch(request).then(response => {
    if (response.status >= 400) throw new Error("Bad response from server");
    return response.json();
  }).then(function(data) {
    console.log(data);
    if (data.statusCode !== 200) {
      that.setState({
        msgFailure: data.statusMessage,
        showModal: false,
        discounts : oldDiscountState
      })
    }else{
     //console.log(addDiscount.discountinformation.id);
      var obj = addDiscount.discountinformation;
           obj.id = data.DiscountID;
           var rate =0;
           obj["variableAmount"] = obj.isvariableamount ===true?"Yes":"No";
            obj["variablePercentage"] = obj.isvariablepercent ===true?"Yes":"No";
             if(obj.isvariableamount === false &&  obj.isvariablepercent === false)
             {
               if(parseInt(obj.rateasdollaroramount) >0)
               {
                rate = obj.rateasdollaroramount;
               }
               if(parseInt(obj.rateasdollarorpercent)>0)
               {
                rate = obj.rateasdollarorpercent;
               }
             }

             obj["Rate"]=rate;
             var type ="";
             if(parseInt(obj.typeofdiscount) === 2)
             {
               type ="promotion";
             }
             else if(parseInt(obj.typeofdiscount) === 1)
             {
               type="void";
             }
             else if(parseInt(obj.typeofdiscount) === 3)
             {
               type="comp";
            }
            obj["Type"] =type;


      oldDiscountState.push(obj);

      console.log(obj);

      that.setState({
        msgSuccess: data.statusMessage,
        showModal: false,
        discounts : oldDiscountState,
        isamount:false,
        ispercentage:false,
        readamount : true,
        readpercentage:true
      });
       setTimeout(function() {
            that.setState({
              msgSuccess: ''
            })
          }, 2000)

    }
  }).catch(error => {
      return error;
    });
  }

// }

}

  getAllDiscounts(){
    var that = this;
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();

    const request = new Request(`${process.env.API_HOST}/ManageDiscounts.svc/GetAllDiscounts/json`, {
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
        var tableConfig = that.state.tableConfig;
        var totalDiscountslen = data.DiscountList.length;
        var totalDiscountarr = [];
        for (var i = 0; i < totalDiscountslen; i++) {
            var obj = data.DiscountList[i];
           // obj["Rate"] =
             var rate =0;
            obj["variableAmount"] = obj.isvariableamount ===true?"Yes":"No";
            obj["variablePercentage"] = obj.isvariablepercent ===true?"Yes":"No";

             if(obj.isvariableamount === false &&  obj.isvariablepercent === false)
             {
               if(parseInt(obj.rateasdollaroramount) >0)
               {
                rate = obj.rateasdollaroramount;
               }
               if(parseInt(obj.rateasdollarorpercent)>0)
               {
                rate = obj.rateasdollarorpercent;
               }
             }

             obj["Rate"]=rate;
             var type ="";
             if(parseInt(obj.typeofdiscount) === 2)
             {
               type ="promotion";
             }
             else if(parseInt(obj.typeofdiscount) === 1)
             {
               type="void";
             }
             else if(parseInt(obj.typeofdiscount) === 3)
             {
               type="comp";
            }
            obj["Type"] =type;
           // obj["prodexpirydate"] = moment(obj.prodexpirydate,'YYYY-MM-DD').format("DD-MM-YYYY");
            totalDiscountarr.push(obj);
      }
            //rateasdollaroramount:0,
            //rateasdollarorpercent:0,
          tableConfig['data'] = totalDiscountarr;
          that.setState({
            tableConfig: tableConfig,
          discounts  :totalDiscountarr
        });
     });
  }

      editHandler(id){
          var index = -1;
          var _Discounts = this.state.tableConfig.data.length;
          var sliced = {};
          for( var i = 0; i < _Discounts; i++ ) {
          if(this.state.tableConfig.data[i].id == id){
          sliced = this.state.tableConfig.data[i];
          index = i;
          break;
          }
          }
          this.setState({
          singlediscountinformation: sliced
          });
          this.getpopulatewithbuttons(sliced);
          this.setState({showEditModal: true});
    }

    getpopulatewithbuttons(discount)
    {
       var that = this;
       var  isvariablepercent = false;
       var  ispercent = false;
       var  isvariableamount = false;
       var  isamount = false;
       var readamount = true;
       var  readpercentage=true;

       if(discount['isvariablepercent'] ===true)
       {
         isvariablepercent = true;
       }
       else if( parseInt(discount['rateasdollarorpercent']) > 0)
       {
          ispercent = true;
          readpercentage = false;
       }
       else if(discount['isvariableamount'] ===true)
       {
        isvariableamount = true;
       }
       else if( parseInt(discount['rateasdollaroramount']) > 0)
       {
        isamount =true;
        readamount = false;
       }
       var discountinformation = discount;
       discountinformation['isvariablepercent'] = isvariablepercent;
       discountinformation['isvariableamount'] = isvariableamount;

       console.log(discountinformation);
       that.setState({
            singlediscountinformation: discountinformation,
            isamount : isamount,
            ispercent : ispercent,
            readamount : readamount,
            readpercentage :readpercentage
        });

    }



    onChange(e){

      var that = this;

    var EditModal = that.state.showEditModal;
    var discountinformation ={};
    const field = e.target.name;
    if(EditModal)
    {discountinformation = that.state.singlediscountinformation;
     discountinformation[field] = e.target.value;
     that.setState({
      singlediscountinformation: discountinformation
       })
    }
    else
    {discountinformation = that.state.discountinformation;
      console.log(discountinformation);

     discountinformation[field] = e.target.value;

     that.setState({
      discountinformation: discountinformation
       })
    }

    if(!!that.state.errors[e.target.name]) {
      let errors = Object.assign({}, that.state.errors);
       delete errors[e.target.name];
       that.setState({errors});
     }

  if(e.target.name ==='rateasdollarorpercent')
  {
  if(!!that.state.errors["readpercentage"]) {
          let errors = Object.assign({}, that.state.errors);
           delete errors["readpercentage"];
           that.setState({errors});
  }
 }
 if(e.target.name ==='rateasdollaroramount')
  {
  if(!!that.state.errors["readamount"]) {
          let errors = Object.assign({}, that.state.errors);
           delete errors["readamount"];
           that.setState({errors});
  }
 }



  }


   handlePromotionCheck(id){
         var EditModal = this.state.showEditModal;
         var discountinformation ={};
         if(EditModal)
          {
          discountinformation = this.state.singlediscountinformation;
          discountinformation['typeofdiscount'] = id;
        this.setState({
            singlediscountinformation: discountinformation
        });
          }
        else
          { discountinformation = this.state.discountinformation;
            discountinformation['typeofdiscount'] = id;
        this.setState({
            discountinformation: discountinformation
        });

          }


    }


    handleCheckAmountorPercent(field)
    {
       console.log(field);

       var that = this;

       var  isvariablepercent = false;
       var  ispercent = false;
       var  isvariableamount = false;
       var  isamount = false;
       var  rateasdollaroramount =0;
       var  rateasdollarorpercent=0;

       var readamount = true;
       var  readpercentage=true;

       if(field ==='isvariablepercent')
       {
         isvariablepercent = true;
       }
       else if(field ==='ispercent')
       {
          ispercent = true;
          readpercentage = false;
       }
       else if(field ==='isvariableamount')
       {
        isvariableamount = true;
       }
       else if(field ==='isamount')
       {
        isamount =true;
        readamount = false;
       }
         var discountinformation = {};
         var EditModal = that.state.showEditModal;
         var discountinformation ={};

         if(EditModal)
          {
           discountinformation = that.state.singlediscountinformation;
           discountinformation['isvariablepercent'] = isvariablepercent;
           discountinformation['rateasdollarorpercent'] = rateasdollarorpercent;
           discountinformation['isvariableamount'] = isvariableamount;
           discountinformation['rateasdollaroramount'] = rateasdollaroramount;
            that.setState({
                singlediscountinformation: discountinformation,
                isamount : isamount,
                ispercent : ispercent,
                readamount : readamount,
                readpercentage :readpercentage
            });

          }
        else
              {

                 discountinformation = that.state.discountinformation;
                 discountinformation['isvariablepercent'] = isvariablepercent;
                 discountinformation['rateasdollarorpercent'] = rateasdollarorpercent;
                 discountinformation['isvariableamount'] = isvariableamount;
                 discountinformation['rateasdollaroramount'] = rateasdollaroramount;
                  that.setState({
                discountinformation: discountinformation,
                isamount : isamount,
                ispercent : ispercent,
                readamount : readamount,
                readpercentage :readpercentage
            });

          }

          if(!!this.state.errors["readpercentage"]) {
          let errors = Object.assign({}, this.state.errors);
           delete errors["readpercentage"];
           this.setState({errors});
  }

   if(!!this.state.errors["readamount"]) {
          let errors = Object.assign({}, this.state.errors);
           delete errors["readamount"];
           this.setState({errors});
  }


    }

  onChangeGrid(event, data) {
    var tableconfig = this.state.tableConfig;
    _.extend(tableconfig, data);
    this.setState({
      tableConfig: tableconfig
    });
  }

  render(){
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    var {discountinformation,singlediscountinformation,discounts,msgFailure,msgSuccess,pageHead} = this.state;
    return(
      <DefaultLayout>
        <div className="page-head inner__pageHead">
          <div className="domain-icon"> <img src={require('./discount.svg')} /> <h2>{pageHead.pagehead}</h2></div>
          <ol className="breadcrumb">
            <li><Link to={`/domains`}>{currentDomain}</Link></li>
            <li><Link to={`/stores`}>{currentStore}</Link></li>
            <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
            <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
            <li className="active">{pageHead.pagehead}</li>
          </ol>
        </div>

          <main>
          {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgFailure}
          </div>}
          {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgSuccess}
          </div>}
          <div className="master-table">
            <div className="row">
            <div className="col-sm-12">
            <div className="" id="discount">
                <Tabelify
                    style={{margin:'30px'}} {...this.state.tableConfig}
                    modalHandler={this.open}
                    editHandler={this.editHandler}
                    deleteHandler={this.RemoveDiscounts}
                    />
                <Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Discount</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                        <TextInput
                        name="name"
                        label="Discount Name"
                        value={this.state.name}
                        defaultValue={this.state.name}
                        placeholder=""
                        required="*"
                        className={classnames('form-control', { error: !!this.state.errors.name})}
                        onChange={this.onChange}
                        />
                        <span>{this.state.errors.name}</span>
                    </div>

                        <div className="row">
                        <div className="col-sm-12 discount-radio-wrap">

                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 2)}>
                                    <input
                                    type='radio'
                                    name='typeofdiscount'
                                    id='one'
                                    checked={this.state.discountinformation.typeofdiscount === 2}
                                    />
                                    <label htmlFor="typeofdiscount"><span>Check if this is a promotion</span></label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 1)}>
                                    <input
                                    type='radio'
                                    name='typeofdiscount'
                                    id='two'
                                    checked={this.state.discountinformation.typeofdiscount === 1}
                                    />
                                    <label htmlFor="typeofdiscount"><span>Check if this is a Void (item never made)</span></label>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 3)}>
                                    <input
                                    type='radio'
                                    name='typeofdiscount'
                                    id='three'
                                    checked={this.state.discountinformation.typeofdiscount === 3}
                                    />
                                    <label htmlFor="typeofdiscount"><span>Check if this a Comp (item made but returned)</span></label>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="form-group">
                        <Checkbox
                            onChange={this.handleChange}
                            checked={this.state.handleChange}
                            name="promptusertoenternotes"
                            id="promptusertoenternotes"
                            label="Check to Force the User to Enter Notes"
                        />
                        </div>
                        <div className="row">
                        <div className="col-sm-12">
                            <div className="disc-pers-amont discount-radio-wrap">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'isvariablepercent')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='isvariablepercent'
                                    checked={this.state.discountinformation.isvariablepercent === true}
                                    />
                                    <label htmlFor="isvariablepercent"><span>Check to allow the User to Select the Percent on the Fly</span></label>
                                </div>
                            </div>


                            <div className="row">

                            <div className="col-sm-7">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'ispercent')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='ispercent'
                                    checked={this.state.ispercent === true}
                                    />
                                    <label htmlFor="rateasdollarorpercent"><span>Or use this Percentage Off</span></label>
                                </div>
                            </div>
                            </div>
                                <div className="col-sm-4">

                                    <div className={classnames('form-group hidelabel', { error: !!this.state.errors.readpercentage})}>
                                    <TextInput
                                    name="rateasdollarorpercent"
                                    readOnly={this.state.readpercentage}
                                    defaultValue={this.state.discountinformation.rateasdollarorpercent}
                                    value = {this.state.discountinformation.rateasdollarorpercent}
                                    placeholder="0.000%"
                                    className={classnames('form-group', { error: !!this.state.errors.readpercentage})}
                                    onChange={this.onChange}
                                    />
                                    <span>{this.state.errors.readpercentage}</span>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="disc-pers-amont discount-radio-wrap">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'isvariableamount')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='isvariableamount'
                                    checked={this.state.discountinformation.isvariableamount === true}
                                    />
                                    <label htmlFor="isvariableamount"><span>Check to allow the User to Select the Amount on the Fly</span></label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-7">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'isamount')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='isamount'
                                    checked={this.state.isamount === true}
                                    />
                                    <label htmlFor="rateasdollaroramount"><span>Or use this Amount off</span></label>
                                </div>
                            </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className={classnames('form-group hidelabel', { error: !!this.state.errors.readamount})}>
                                    <TextInput
                                    name="rateasdollaroramount"
                                    readOnly={this.state.readamount}
                                    defaultValue={this.state.discountinformation.rateasdollaroramount}
                                    value = {this.state.discountinformation.rateasdollaroramount}
                                    placeholder="0.00"
                                        className={classnames('form-group', { error: !!this.state.errors.readamount})}
                                    onChange={this.onChange}
                                    />
                                    <span>{this.state.errors.readamount}</span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className="btn-submit" onClick={this.onSubmit}>Submit</Button>
                    <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
                    </Modal.Footer>
                </form>
                </Modal>


                <Modal show={this.state.showEditModal} onHide={this.close} backdrop={false} keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit Discount</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                        <TextInput
                        name="name"
                        label="Discount Name"
                        value={this.state.singlediscountinformation.name}
                        defaultValue={this.state.singlediscountinformation.name}
                        placeholder=""
                        required="*"
                        className={classnames('form-control', { error: !!this.state.errors.name})}
                        onChange={this.onChange}
                        />
                        <span>{this.state.errors.name}</span>
                    </div>

                        <div className="row">
                        <div className="col-sm-12 discount-radio-wrap">

                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 2)}>
                                    <input
                                    type='radio'
                                    name='typeofdiscount'
                                    id='one'
                                    checked={this.state.singlediscountinformation.typeofdiscount === 2}
                                    />
                                    <label htmlFor="typeofdiscount"><span>Check if this is a promotion</span></label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 1)}>
                                    <input
                                    type='radio'
                                    name='typeofdiscount'
                                    id='two'
                                    checked={this.state.singlediscountinformation.typeofdiscount === 1}
                                    />
                                    <label htmlFor="typeofdiscount"><span>Check if this is a Void (item never made)</span></label>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 3)}>
                                    <input
                                    type='radio'
                                    name='typeofdiscount'
                                    id='three'
                                    checked={this.state.singlediscountinformation.typeofdiscount === 3}
                                    />
                                    <label htmlFor="typeofdiscount"><span>Check if this a Comp (item made but returned)</span></label>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="form-group">
                        <Checkbox
                            onChange={this.handleChange}
                            checked={this.state.singlediscountinformation.promptusertoenternotes===true}
                            name="promptusertoenternotes"
                            id="promptusertoenternotes"
                            label="Check to Force the User to Enter Notes"
                        />
                        </div>


                        <div className="row">
                        <div className="col-sm-12">
                            <div className="disc-pers-amont discount-radio-wrap">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'isvariablepercent')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='isvariablepercent'
                                    checked={this.state.singlediscountinformation.isvariablepercent === true}
                                    />
                                    <label htmlFor="isvariablepercent"><span>Check to allow the User to Select the Percent on the Fly</span></label>
                                </div>
                            </div>


                            <div className="row">

                            <div className="col-sm-7">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'ispercent')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='ispercent'
                                    checked={this.state.ispercent === true}
                                    />
                                    <label htmlFor="rateasdollarorpercent"><span>Or use this Percentage Off</span></label>
                                </div>
                            </div>
                            </div>
                                <div className="col-sm-4">

                                    <div className={classnames('form-group hidelabel', { error: !!this.state.errors.readpercentage})}>
                                    <TextInput
                                    name="rateasdollarorpercent"
                                    readOnly={this.state.readpercentage}
                                    defaultValue={this.state.singlediscountinformation.rateasdollarorpercent}
                                    value = {this.state.singlediscountinformation.rateasdollarorpercent}
                                    placeholder="0.000%"
                                    className={classnames('form-group', { error: !!this.state.errors.readpercentage})}
                                    onChange={this.onChange}
                                    />
                                    <span>{this.state.errors.readpercentage}</span>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="disc-pers-amont discount-radio-wrap">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'isvariableamount')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='isvariableamount'
                                    checked={this.state.singlediscountinformation.isvariableamount === true}
                                    />
                                    <label htmlFor="isvariableamount"><span>Check to allow the User to Select the Amount on the Fly</span></label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-7">
                            <div className="form-group">
                                <div className="am-radio inline" onClick={this.handleCheckAmountorPercent.bind(this, 'isamount')}>
                                    <input
                                    type='radio'
                                    name='amountorpercentagegroup'
                                    id='isamount'
                                    checked={this.state.isamount === true}
                                    />
                                    <label htmlFor="rateasdollaroramount"><span>Or use this Amount off</span></label>
                                </div>
                            </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className={classnames('form-group hidelabel', { error: !!this.state.errors.readamount})}>
                                    <TextInput
                                    name="rateasdollaroramount"
                                    readOnly={this.state.readamount}
                                    defaultValue={this.state.singlediscountinformation.rateasdollaroramount}
                                    value = {this.state.singlediscountinformation.rateasdollaroramount}
                                    placeholder="0.00"
                                        className={classnames('form-group', { error: !!this.state.errors.readamount})}
                                    onChange={this.onChange}
                                    />
                                    <span>{this.state.errors.readamount}</span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className="btn-submit" onClick={this.onUpdate}>Submit</Button>
                    <Button className="btn-cancel" onClick={this.editClose}>Cancel</Button>
                    </Modal.Footer>
                </form>
                </Modal>
</div>
</div>
</div>
          </div>
          </main>
      </DefaultLayout>
    )
  }
}
export default Discounts;