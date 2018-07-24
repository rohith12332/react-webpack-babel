import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from '../common/Checkbox';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import 'react-datepicker/dist/react-datepicker';
import TextInput from '../common/TextInput';
import classnames from 'classnames';
import moment from 'moment';
import getUserDetails from '../common/CredentialDomain';
import TimePicker from 'rc-time-picker';

import Tabelify from '../react-tabelify/Tabelify';


var _ = require('underscore');

//Table Column Defination
var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Interval Name"
    },
    {
        "columnName": "Type",
        "displayName": "Type"
    },
    {
        "columnName": "amountorpercent",
        "displayName": "Price/Percentage"
    },
    {
        "columnName": "starttime",
        "displayName": "Start Time"
    },
    {
        "columnName": "endtime",
        "displayName": "End Time"
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


  class PricingInterval extends React.Component {
  constructor(props) {

    super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.state = {
      showModal: false,
      msgFailure:"",
      msgSuccess:"",
      showEditModal:false,
      PricingIntervals:[],
      selectedOption:'1',
      Start_Time:[],
      End_Time :[],
      isLoading: true,
      errors:{},
      pageHead:{
				pagehead:'Pricing Intervals',
				dashboard: 'Dashboard',
				setup: 'Setup'
			},
	 singlepricinginterval:{},
	 pricinginterval:{
		amountorpercent:0,
    createdby:'',
    createddate:'',
    endtime:'',
    fridayendtime:'',
    fridaystarttime:'',
    id:'1627aea5-8e0a-4371-9022-9b504344e724',
    isdeleted:false,
    isdollarsoff:true,
    ispercentoff:false,
    isspecifiedprice:false,
    modifiedby:'',
    modifieddate:'',
    mondayendtime:'',
    mondaystarttime:'',
    name:'',
    runfriday:false,
    runmonday:false,
    runsaturday:false,
    runsunday:false,
    runthursday:false,
    runtuesday:false,
    runwednesday:false,
    saturdayendtime:'',
    saturdaystarttime:'',
    starttime:'',
    store_id:'1627aea5-8e0a-4371-9022-9b504344e724',
    sundayendtime:'',
    sundaystarttime:'',
    thursdayendtime:'',
    thursdaystarttime:'',
    tuesdayendtime:'',
    tuesdaystarttime:'',
    wednesdayendtime:'',
    wednesdaystarttime:''
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
        btnText: 'Add PricingInterval'
      }
    }
    this.dayofweek = this.dayofweek.bind(this);
    this.handleRadioCheck = this.handleRadioCheck.bind(this);
    this.onChange = this.onChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.StartTimePicker = this.StartTimePicker.bind(this);
    this.EndTimePicker = this.EndTimePicker.bind(this);
    this.EditPricingInterval = this.EditPricingInterval.bind(this);
    this.RemovePricingInterval = this.RemovePricingInterval.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    /*this.open = this.open.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.close = this.close.bind(this);
    this.SetRadioButton = this.SetRadioButton.bind(this);*/

  }

RemovePricingInterval(PricingIntervalID){
var id;
var DelPricingInterval = {};
var that = this;
id = PricingIntervalID;
var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
var credentials = getUserDetails();
credentials["storeuniquekey"] = storeuniquekey;
credentials["domainuniquekey"] = domainuniquekey;
var index = -1;
var _totalpricingintervals = this.state.PricingIntervals.length;
for( var i = 0; i < _totalpricingintervals; i++ ) {
if(this.state.PricingIntervals[i].id == id){
index = i;
break;
}
}
this.state.PricingIntervals.splice( index, 1 );
this.setState( {PricingIntervals: this.state.PricingIntervals});
DelPricingInterval['priceintevalid'] =  PricingIntervalID;
DelPricingInterval['userdetails']  =  getUserDetails();
DelPricingInterval['isdeleted']    =  true;
console.log(JSON.stringify(DelPricingInterval));
const request = new Request(`${process.env.API_HOST}/ManagePriceIntervalDiscounts.svc/DeletePriceIntervalDiscount/json`, {
method: 'POST',
headers: new Headers({
'Content-Type': 'application/json'
}),
body: JSON.stringify(DelPricingInterval)
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
});
 setTimeout(function() {
  that.setState({
    msgSuccess: ''
    });
}, 2000)
}
}).catch(function(error) {
return error;
})
}

StartTimePicker(element) {
  if(element._d !=null)
   {
       var time= element._d.toLocaleTimeString();
       console.log(time);
        var hh = time.split(":")[0];
       var mm = time.split(":")[1];
       if(this.validatePMpmornot(time))
       {

         hh = parseInt(hh)+12;
         console.log(hh);
         console.log('inside-start');
       }
       if(hh > 12)
       {
        hh = parseInt(hh)-12;
        time = hh +":"+mm+" pm";
       }
       else{
        if(hh ==0)
        {
          hh = 12;
        }
       time = hh  +":"+mm+" am";

   }
      var EditModal = this.state.showEditModal;
      if (EditModal) {
        this.state.singlepricinginterval["starttime"] = time;
        console.log(this.state.singlepricinginterval);
      } else {
        this.state.pricinginterval["starttime"] = time;
        console.log(this.state.pricinginterval);
      }
      if (!!this.state.errors["starttime"]) {
        let errors = Object.assign({}, this.state.errors);
        delete errors["starttime"];
        this.setState({
          errors
        });
      }
    }
  }

  validatePMpmornot(value){
  var expr = /PM/;  // no quotes her
  return expr.test(value);
}

  EndTimePicker(element) {
   if(element._d !=null)
   {
       var time= element._d.toLocaleTimeString();
       console.log(time);
        var hh = time.split(":")[0];
       var mm = time.split(":")[1];
       if(this.validatePMpmornot(time))
       {

         hh = parseInt(hh)+12;
         console.log(hh);
         console.log('inside-start');
       }
       if(hh > 12)
       {
        hh = parseInt(hh)-12;
        time = hh +":"+mm+" pm";
       }
       else{
        if(hh ==0)
        {
          hh = 12;
        }
       time = hh  +":"+mm+" am";

    }
      var EditModal = this.state.showEditModal;
      if (EditModal) {
        this.state.singlepricinginterval["endtime"] = time;
        console.log(this.state.singledaypart);
      } else {
        this.state.pricinginterval["endtime"] = time;
      }
      if (!!this.state.errors["endtime"]) {
        let errors = Object.assign({}, this.state.errors);
        delete errors["endtime"];
        this.setState({
          errors
        });
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

handleValidation(){
let errors = {};
//Form validation error message
var pricinginterval = {};
var EditModal = this.state.showEditModal;
if(EditModal)
{
pricinginterval = this.state.singlepricinginterval;
}
else
{
pricinginterval = this.state.pricinginterval;
}

console.log(pricinginterval);
if (pricinginterval.name === '') {
  document.getElementById("name").focus();
  errors.name = "Interval name can't be empty"
}

if (pricinginterval.amountorpercent === '') {
    errors.amountorpercent = "Price can't be empty"
}

if (pricinginterval.starttime === '') {
    errors.starttime = "Start Time can't be empty"
}
if (pricinginterval.endtime === '') {
    errors.endtime = "End Time can't be empty"
}
if(pricinginterval.runmonday === false && pricinginterval.runtuesday === false && pricinginterval.runwednesday === false && pricinginterval.runthursday === false && pricinginterval.runfriday === false && pricinginterval.runsaturday === false && pricinginterval.runsunday === false){
  errors.day = "Select Day"
}

this.setState({ errors }); //Set Errors state
return Object.keys(errors).length == 0;
}

   getPricingIntervals() {
    var that = this;
    var credentials = {};
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['index'] = 2147483647;
    credentials['recordcount'] = 2147483647;
    credentials["userdetails"] = getUserDetails();
    credentials["userdetails"]['storeuniquekey'] = storeuniquekey;
    const request = new Request(`${process.env.API_HOST}/ManagePriceIntervalDiscounts.svc/GetAllPriceIntervalDiscounts/json`, {
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
         console.log(data.priceintevallist);
         var priceintevalsarr =[];
        for(var i = 0; i < data.priceintevallist.length; i++) {
           var obj = data.priceintevallist[i];
           var starttime =   moment(obj.starttime).format('hh:mm a');
           var endtime   =   moment(obj.endtime).format('hh:mm a');
           obj.starttime = starttime.toString();
           obj.endtime   =   endtime.toString();

           var type ="";
           if(obj.isdollarsoff === true)
           {
             type ="Discount By Amount";
           }
           else if(obj.ispercentoff === true)
           {
             type="Discount By Percentage";
           }
           else if(obj.isspecifiedprice === true)
           {
             type="Use Specified price";
           }

           obj["Type"] = type;

           priceintevalsarr.push(obj);

         }

         var tableConfig = that.state.tableConfig;
         tableConfig['isLoading'] = false;
         tableConfig['data'] = priceintevalsarr;
         that.setState({
          tableConfig: tableConfig,
          PricingIntervals: priceintevalsarr
        });
   });
  }

  close(event)
  {
    var EditModal = this.state.showEditModal;
    if(EditModal)
    {
      this.setState({
      showEditModal: false,
      errors:{}
     });
    }
    else
    {
      this.setState({
      showModal: false,
      errors:{}
     });
    }

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
        const addpricinginterval = {};
        var pricingintervaldata = this.state.singlepricinginterval;
        pricingintervaldata.mondaystarttime = pricingintervaldata.starttime;
        pricingintervaldata.mondayendtime = pricingintervaldata.endtime;
        pricingintervaldata.sundaystarttime = pricingintervaldata.starttime;
        pricingintervaldata.sundayendtime = pricingintervaldata.endtime;
        pricingintervaldata.saturdaystarttime = pricingintervaldata.starttime;
        pricingintervaldata.saturdayendtime = pricingintervaldata.endtime;
        pricingintervaldata.tuesdaystarttime = pricingintervaldata.starttime;
        pricingintervaldata.tuesdayendtime = pricingintervaldata.endtime;
        pricingintervaldata.wednesdaystarttime = pricingintervaldata.starttime;
        pricingintervaldata.wednesdayendtime = pricingintervaldata.endtime;
        pricingintervaldata.thursdaystarttime = pricingintervaldata.starttime;
        pricingintervaldata.thursdayendtime = pricingintervaldata.endtime;
        pricingintervaldata.fridaystarttime = pricingintervaldata.starttime;
        pricingintervaldata.fridayendtime = pricingintervaldata.endtime;

    addpricinginterval["priceintevalinformation"] = pricingintervaldata;
    addpricinginterval["userdetails"] = getUserDetails();
    var oldpricingintervalState = this.state.tableConfig.data;
    var _totalpricingintervals = that.state.tableConfig.data.length;
    var obj ={};
    for( var i = 0; i < _totalpricingintervals; i++ ) {
    var priceinterval = that.state.tableConfig.data;
    var priceintervalId = this.state.singlepricinginterval.id;
    if(oldpricingintervalState[i].id == priceintervalId){
       obj = pricingintervaldata;
               var type ="";
               if(obj.isdollarsoff === true)
               {
                 type ="Discount By Amount";
               }
               else if(obj.ispercentoff === true)
               {
                 type="Discount By Percentage";
               }
               else if(obj.isspecifiedprice === true)
               {
                 type="Use Specified price";
               }

               obj["Type"] = type;

    oldpricingintervalState[i] =obj;
    }
}

    console.log(JSON.stringify(addpricinginterval));
    const request = new Request(`${process.env.API_HOST}/ManagePriceIntervalDiscounts.svc/UpdatePriceIntervalDiscount/json`, {
    method: 'POST',
    headers: new Headers({
    'Content-Type':'application/json'
    }),
    body: JSON.stringify(addpricinginterval)
    });
    return fetch(request).then(response => {
    if (response.status >= 400) throw new Error("Bad response from server");
    return response.json();
    }).then(function(data) {
    if (data.statusCode !== 200) {

    that.setState({
    msgFailure: data.statusMessage,
    tableConfig: tableConfig,
    showEditModal: false,
    PricingIntervals : oldpricingintervalState
    })
    }else{

    var tableConfig = that.state.tableConfig;
    tableConfig['data'] = oldpricingintervalState;
    that.setState({
    msgSuccess: data.statusMessage,
    showEditModal: false,
    tableConfig: tableConfig,
    PricingIntervals : oldpricingintervalState
    });
    setTimeout(function() {
      that.setState({
        msgSuccess: ''
        });
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
    var isValid =  this.handleValidation();
    var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var credentials = getUserDetails();
    credentials["domainuniquekey"] = domainuniquekey;
    credentials["storeuniquekey"] = storeuniquekey;
    if(isValid){
    const addpricinginterval = {};
    var pricingintervaldata = this.state.pricinginterval;
    pricingintervaldata.mondaystarttime = pricingintervaldata.starttime;
    pricingintervaldata.mondayendtime = pricingintervaldata.endtime;
    pricingintervaldata.sundaystarttime = pricingintervaldata.starttime;
    pricingintervaldata.sundayendtime = pricingintervaldata.endtime;
    pricingintervaldata.saturdaystarttime = pricingintervaldata.starttime;
    pricingintervaldata.saturdayendtime = pricingintervaldata.endtime;
    pricingintervaldata.tuesdaystarttime = pricingintervaldata.starttime;
    pricingintervaldata.tuesdayendtime = pricingintervaldata.endtime;
    pricingintervaldata.wednesdaystarttime = pricingintervaldata.starttime;
    pricingintervaldata.wednesdayendtime = pricingintervaldata.endtime;
    pricingintervaldata.thursdaystarttime = pricingintervaldata.starttime;
    pricingintervaldata.thursdayendtime = pricingintervaldata.endtime;
    pricingintervaldata.fridaystarttime = pricingintervaldata.starttime;
    pricingintervaldata.fridayendtime = pricingintervaldata.endtime;

    addpricinginterval["priceintevalinformation"] = pricingintervaldata;
    addpricinginterval["userdetails"] = getUserDetails();
    var oldpricingintervalState = this.state.tableConfig.data;

    console.log(JSON.stringify(addpricinginterval));

    const request = new Request(`${process.env.API_HOST}/ManagePriceIntervalDiscounts.svc/CreatePriceIntervalDiscount/json`, {
    method: 'POST',
    headers: new Headers({
    'Content-Type':'application/json'
    }),
    body: JSON.stringify(addpricinginterval)
    });
    return fetch(request).then(response => {
    if (response.status >= 400) throw new Error("Bad response from server");
    return response.json();
    }).then(function(data) {
    if (data.statusCode !== 200) {

    that.setState({
    msgFailure: data.statusMessage,
    tableConfig: tableConfig,
    showModal: false,
    PricingIntervals : oldpricingintervalState
    })
    }else{

          var newpricingintervalState = pricingintervaldata;
          newpricingintervalState.id = data.roleid;
           var type ="";
           if(newpricingintervalState.isdollarsoff === true)
           {
             type ="Discount By Amount";
           }
           else if(newpricingintervalState.ispercentoff === true)
           {
             type="Discount By Percentage";
           }
           else if(newpricingintervalState.isspecifiedprice === true)
           {
             type="Use Specified price";
           }

           newpricingintervalState["Type"] = type;

oldpricingintervalState.push(newpricingintervalState);
console.log(oldpricingintervalState);
var tableConfig = that.state.tableConfig;
tableConfig['data'] = oldpricingintervalState;

that.setState({
msgSuccess: data.statusMessage,
showModal: false,
tableConfig: tableConfig,
PricingIntervals : oldpricingintervalState
});
setTimeout(function() {
  that.setState({
    msgSuccess: ''
    });
}, 2000)
}
}).catch(error => {
return error;
});
}
// }
}

  EditPricingInterval(id)
  {


    var index = -1;
    var _totalpricingintervals = this.state.tableConfig.data.length;
    var sliced = {};
    var selectedOption='1';
    for( var i = 0; i < _totalpricingintervals; i++ ) {
      if(this.state.tableConfig.data[i].id == id){

          sliced = this.state.tableConfig.data[i];
          var st = null;
          var et = null;
          if(sliced.isspecifiedprice== true)
          {
             selectedOption ='3';
          }
          else if(sliced.isdollarsoff== true)
          {
           selectedOption ='1';
          }
          else if(sliced.ispercentoff== true)
          {
            selectedOption ='2';
          }
          if(moment( sliced.starttime).isValid())
          {
            st = moment(sliced.starttime);
            et = moment(sliced.endtime);
          }
          else
          {
            st =  moment("10/10/2017 " +sliced.starttime);
            et = moment("10/10/2017 " +sliced.endtime);

          }
          this.state.Start_Time = st;
          this.state.End_Time = et;
        index = i;
         this.setState({
          singlepricinginterval: sliced,
          selectedOption : selectedOption,
          Start_Time :st,
          End_Time:et,
          errors:{}
    });
        break;
      }
    }

    //this.SetRadioButton(sliced);
    this.setState({showEditModal: true});
  }



   onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
    });
  }



   handleRadioCheck(event){
    var Rvalue = event.target.parentNode.children[0].value;

    var EditModal = this.state.showEditModal;
    var pricinginterval ={};

    if(EditModal)
    {
       pricinginterval = this.state.singlepricinginterval;
    }

    else
    {
        pricinginterval = this.state.pricinginterval;
    }

    pricinginterval.isdollarsoff =false;
    pricinginterval.ispercentoff =false;
    pricinginterval.isspecifiedprice = false;
    if(Rvalue ==="1")
    {
      pricinginterval.isdollarsoff=true;
    }
    else if (Rvalue ==="2")
    {
      pricinginterval.ispercentoff =true;
    }
    else if (Rvalue ==="3")
    {
     pricinginterval.isspecifiedprice = true;
    }

    console.log(Rvalue);
    console.log(pricinginterval);


     if(EditModal)
    {
       this.setState({
       selectedOption: event.target.parentNode.children[0].value,
       singlepricinginterval:pricinginterval

    });
    }

    else
    {
        this.setState({
      selectedOption: event.target.parentNode.children[0].value,
       pricinginterval:pricinginterval

    });
    }


  }

  componentDidMount() {
    this.getPricingIntervals();
  }

  dayofweek(event)
  {
    var EditModal = this.state.showEditModal;
    var pricingintervaledit ={};
    if(EditModal)
    {
      pricingintervaledit = this.state.singlepricinginterval;

      if(pricingintervaledit[event.target.name])
      pricingintervaledit[event.target.name] = false;
      else
      pricingintervaledit[event.target.name] = true;
      this.setState({
      singlepricinginterval: pricingintervaledit
      });
    }
    else
    {
      pricingintervaledit = this.state.pricinginterval;
      if(pricingintervaledit[event.target.name])
      pricingintervaledit[event.target.name] = false;
      else
      pricingintervaledit[event.target.name] = true;
      this.setState({
        pricinginterval: pricingintervaledit
      });
    }


  }


   onChange(event) {
    this.setState({isEditable: true});
    const field = event.target.name;
    var EditModal = this.state.showEditModal;
    var pricinginterval ={};
    if(EditModal)
    pricinginterval = this.state.singlepricinginterval;
    else
    pricinginterval = this.state.pricinginterval;

    pricinginterval[field] = event.target.value;
    if(!!this.state.errors[event.target.name]) {
    let errors = Object.assign({}, this.state.errors);
     delete errors[event.target.name];
     this.setState({errors});
  }

}

open(event)
{
this.setState({
showModal: true,
pricinginterval:{
    amountorpercent:0,
    createdby:'',
    createddate:'',
    endtime:'',
    fridayendtime:'',
    fridaystarttime:'',
    id:'1627aea5-8e0a-4371-9022-9b504344e724',
    isdeleted:false,
    isdollarsoff:true,
    ispercentoff:false,
    isspecifiedprice:false,
    modifiedby:'',
    modifieddate:'',
    mondayendtime:'',
    mondaystarttime:'',
    name:'',
    runfriday:false,
    runmonday:false,
    runsaturday:false,
    runsunday:false,
    runthursday:false,
    runtuesday:false,
    runwednesday:false,
    saturdayendtime:'',
    saturdaystarttime:'',
    starttime:'',
    store_id:'1627aea5-8e0a-4371-9022-9b504344e724',
    sundayendtime:'',
    sundaystarttime:'',
    thursdayendtime:'',
    thursdaystarttime:'',
    tuesdayendtime:'',
    tuesdaystarttime:'',
    wednesdayendtime:'',
    wednesdaystarttime:''
  },
  selectedOption:'1',

 errors:{}
});
}

render()
  {
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
     const {pageHead,PricingIntervals,msgFailure,msgSuccess} = this.state;
     const format = 'h:mm a';
     const active = "day-active";
     const inactive = "";
     return(
        <DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './pricing-interval.svg')}/> <h2>{pageHead.pagehead}</h2></div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                      <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
            </div>
            <main>
            <div className="master-table" id="PricingIntervals">
                {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              {msgFailure}
            </div>}
            {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {msgSuccess}  </div>}
                  <div className="row">
                    <div className="col-sm-12">
                        <div className="">
                          <div className="" id="PricingIntervals">
                       <Tabelify
              style={{margin:'30px'}} {...this.state.tableConfig}
              modalHandler={this.open}
              editHandler={this.EditPricingInterval}
              deleteHandler={this.RemovePricingInterval}
              />
              </div>
              </div>
              </div>
              </div>
          <Modal show={this.state.showEditModal}  onHide={this.close} backdrop={false} keyboard={false}>
          <form>
            <Modal.Header closeButton>
            <Modal.Title>Edit Pricing Interval Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
              type="text"
              name="name"
              label="Interval Name"
              value={this.state.singlepricinginterval.name}
              defaultValue={this.state.singlepricinginterval.name}
              placeholder=""
              required="*"
              onChange={this.onChange}
              className={classnames('form-control', { error: !!this.state.errors.name})}
              />
              <span>{this.state.errors.name}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.amountorpercent})}>
              <TextInput
              type="text"
              name="amountorpercent"
              label="Interval Price"
              value={this.state.singlepricinginterval.amountorpercent}
              defaultValue={this.state.singlepricinginterval.amountorpercent}
              placeholder=""
              required="*"
              onChange={this.onChange}
              className={classnames('form-control', { error: !!this.state.errors.amountorpercent})}
              />
              <span>{this.state.errors.amountorpercent}</span>
            </div>
            <div className="row">
              <div className="col-sm-8 discount-radio-wrap">
                <div className="form-group">
                  <div className="am-radio inline" onClick={this.handleRadioCheck}>
                    <input
                    type="radio"
                    value="1"
                    checked={this.state.selectedOption === '1'}
                    name="pricinginterval"
                    onChange={this.onChange}
                    />
                    <label htmlFor="pricinginterval"><span>Discount by Amount</span></label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="am-radio inline" onClick={this.handleRadioCheck}>
                    <input
                    type="radio"
                    value="3"
                    checked={this.state.selectedOption === '3'}
                    name="pricinginterval"
                    onChange={this.onChange}
                    />
                    <label htmlFor="pricinginterval"><span>Use Specified Price</span></label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="am-radio inline" onClick={this.handleRadioCheck}>
                    <input
                    type="radio"
                    value="2"
                    checked={this.state.selectedOption === '2'}
                    name="pricinginterval"
                    onChange={this.onChange}
                    />
                    <label htmlFor="pricinginterval"><span>Discount by Percent</span></label>
                  </div>
                </div>

              </div>


            </div>

            <div className="modal-subhead">
                When to Run
              </div>
              <div className="row">
                <div className="col-sm-6">

                <div className={classnames('form-group', { error: !!this.state.errors.starttime})}>
                <label className="control-label">Start Time<span className="required">*</span></label>
                <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
                   <TimePicker
                   showSecond={false}
                  defaultValue={this.state.Start_Time}
                  name="starttime"
                  format = {format}
                  onChange={this.StartTimePicker}
                  className="form-control bordernull"
                  use12Hours

                  />
                  <span className="input-group-addon btn btn-primary">
                <i className="icon icon-213 s7-date"></i></span>
                </div>
                <span>{this.state.errors.starttime}</span>
                  </div>
              </div>

                <div className="col-sm-6">
                  <div className={classnames('form-group', { error: !!this.state.errors.endtime})}>
                <label className="control-label">End Time<span className="required">*</span></label>
                <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
                   <TimePicker
                  showSecond={false}
                  name   ="endtime"
                  format = {format}
                  defaultValue={this.state.End_Time}
                  onChange={this.EndTimePicker}
                  className="form-control bordernull"
                  use12Hours

                  />
                  <span className="input-group-addon btn btn-primary">
                <i className="icon icon-213 s7-date"></i></span>
                </div>
                <span>{this.state.errors.endtime}</span>
                  </div>
              </div>
                </div>

               <div className="modal-subhead">
                Days to Run
              </div>

               <div className={classnames('form-group', { error: !!this.state.errors.day})}>
              <div className="days-select-wrap">
                  <ul>
                   <li><a name="runmonday" className={this.state.singlepricinginterval.runmonday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>M</a></li>
                    <li><a name="runtuesday" className={this.state.singlepricinginterval.runtuesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                    <li><a name="runwednesday" className={this.state.singlepricinginterval.runwednesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>W</a></li>
                    <li><a name="runthursday" className={this.state.singlepricinginterval.runthursday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                    <li><a name="runfriday" className={this.state.singlepricinginterval.runfriday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>F</a></li>
                    <li><a name="runsaturday" className={this.state.singlepricinginterval.runsaturday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                    <li><a name="runsunday" className={this.state.singlepricinginterval.runsunday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                  </ul>
              </div> <span>{this.state.errors.day}</span>
              </div>
          </Modal.Body>
          <Modal.Footer>
          <Button className="btn-submit"  onClick={this.onUpdate}>Submit</Button>
          <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
          </Modal.Footer>
        </form>
        </Modal>



        <Modal show={this.state.showModal}  onHide={this.close} backdrop={false} keyboard={false}>
          <form>
            <Modal.Header closeButton>
            <Modal.Title>Add Pricing Interval Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body>
           <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
              type="text"
              name="name"
              label="Interval Name"
              value={this.state.pricinginterval.name}
              defaultValue={this.state.pricinginterval.name}
              placeholder=""
              required="*"
              onChange={this.onChange}
              className={classnames('form-control', { error: !!this.state.errors.name})}
              />
              <span>{this.state.errors.name}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.amountorpercent})}>
              <TextInput
              type="text"
              name="amountorpercent"
              label="Interval Price"
              value={this.state.pricinginterval.amountorpercent}
              defaultValue={this.state.pricinginterval.amountorpercent}
              placeholder=""
              required="*"
              onChange={this.onChange}
              className={classnames('form-control', { error: !!this.state.errors.amountorpercent})}
              />
              <span>{this.state.errors.amountorpercent}</span>
            </div>
            <div className="row">
              <div className="col-sm-8 discount-radio-wrap">
                <div className="form-group">
                  <div className="am-radio inline" onClick={this.handleRadioCheck}>
                    <input
                    type="radio"
                    value="1"
                    checked={this.state.selectedOption === '1'}
                    name="pricinginterval"
                    onChange={this.onChange}
                    />
                    <label htmlFor="pricinginterval"><span>Discount by Amount</span></label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="am-radio inline" onClick={this.handleRadioCheck}>
                    <input
                    type="radio"
                    value="3"
                    checked={this.state.selectedOption === '3'}
                    name="pricinginterval"
                    onChange={this.onChange}
                    />
                    <label htmlFor="pricinginterval"><span>Use Specified Price</span></label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="am-radio inline" onClick={this.handleRadioCheck}>
                    <input
                    type="radio"
                    value="2"
                    checked={this.state.selectedOption === '2'}
                    name="pricinginterval"
                    onChange={this.onChange}
                    />
                    <label htmlFor="pricinginterval"><span>Discount by Percent</span></label>
                  </div>
                </div>

              </div>


            </div>

            <div className="modal-subhead">
                When to Run
              </div>
              <div className="row">
                <div className="col-sm-6">

                <div className={classnames('form-group', { error: !!this.state.errors.starttime})}>
                <label className="control-label">Start Time<span className="required">*</span></label>
                <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
                   <TimePicker
                  showSecond={false}
                  name   ="starttime"
                  format = {format}
                  onChange={this.StartTimePicker}
                  className="form-control bordernull"
                  use12Hours

                  />

                  <span className="input-group-addon btn btn-primary">
                <i className="icon icon-213 s7-date"></i></span>
                </div>
                <span>{this.state.errors.starttime}</span>
              </div>
                </div>
                <div className="col-sm-6">
                   <div className={classnames('form-group', { error: !!this.state.errors.endtime})}>
                <label className="control-label">End Time<span className="required">*</span></label>
                <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
                   <TimePicker
                  showSecond={false}
                  name   ="endtime"
                  format = {format}
                  onChange={this.EndTimePicker}
                  className="form-control bordernull"
                  use12Hours

                  />
                  <span className="input-group-addon btn btn-primary">
                <i className="icon icon-213 s7-date"></i></span>
                </div>
                <span>{this.state.errors.endtime}</span>
              </div>
                </div>
              </div>
               <div className="modal-subhead">
                Days to Run <span className="required">*</span>
              </div>

               <div className={classnames('form-group', { error: !!this.state.errors.day})}>
              <div className="days-select-wrap" >
                  <ul>
                    <li><a name="runmonday" className={this.state.pricinginterval.runmonday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>M</a></li>
                    <li><a name="runtuesday" className={this.state.pricinginterval.runtuesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                    <li><a name="runwednesday" className={this.state.pricinginterval.runwednesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>W</a></li>
                    <li><a name="runthursday" className={this.state.pricinginterval.runthursday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                    <li><a name="runfriday" className={this.state.pricinginterval.runfriday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>F</a></li>
                    <li><a name="runsaturday" className={this.state.pricinginterval.runsaturday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                    <li><a name="runsunday" className={this.state.pricinginterval.runsunday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                  </ul>
                  </div>
                  <span>{this.state.errors.day}</span>
              </div>

          </Modal.Body>
          <Modal.Footer>
          <Button className="btn-submit"  onClick={this.onSubmit}>Submit</Button>
          <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
          </Modal.Footer>
        </form>
        </Modal>
     </div>
     </main>
    </DefaultLayout>
    )
  }
}
export default PricingInterval;