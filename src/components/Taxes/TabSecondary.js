import React from 'react';
import axios from 'axios';
import { browserHistory, Link } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
import Checkbox from '../common/Checkbox';
import classnames from 'classnames';
import TextInput from '../common/TextInput';
import getUserDetails from '../common/CredentialDomain';
import getCurrentDate from '../common/Date';
import moment from 'moment';

import Tabelify from '../react-tabelify/Tabelify';
import TimePicker from 'rc-time-picker';
var _ = require('underscore');


//Table Column Defination
var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Taxes"
    },
    {
        "columnName": "rate",
        "displayName": "Rate"
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

class TabSecondary extends React.Component{
  constructor(props) {
    super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.state = {
   "taxconfiguration":{
        "alwaysruntax":true,
        "createdby":"",
        "createddate":"",
        "endtime":"",
        "starttime":"",
        "flatfee":12678967.543233,
        "id":"1627aea5-8e0a-4371-9022-9b504344e724",
        "isdeleted":false,
        "isflatfee":true,
        "isinclusivetax":true,
        "modifiedby":"",
        "modifieddate":"",
        "name":"",
        "rate":"",
        "runfriday":false,
        "runmonday":false,
        "runsaturday":false,
        "runsunday":false,
        "runthursday":false,
        "runtuesday":false,
        "runwednesday":false,
        "store_id":"1627aea5-8e0a-4371-9022-9b504344e724",
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
          btnText: 'Add Tax'
      },
        hidden:false,
        runtax:true,
        showModal: false,
        showEditModal: false,
        errors:{},
        taxes:[],
        SingleTaxConfiguration:{},
        "msgSuccess": "",
        "msgFailure": "",
    }

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.dayofweek = this.dayofweek.bind(this);
    this.handlechange = this.handlechange.bind(this);
    this.handlechange1 = this.handlechange1.bind(this);
    this.StartTimePicker = this.StartTimePicker.bind(this);
    this.EndTimePicker = this.EndTimePicker.bind(this);
    this.modifyTax = this.modifyTax.bind(this);
    this.deleteTax = this.deleteTax.bind(this);
    this.onUpdateTax = this.onUpdateTax.bind(this);
    this.resetHandler = this.resetHandler.bind(this)
  }

 componentDidMount() {
    this.getAllTaxes();
  }


validatepmornot(value) {
    var expr = /pm/; // no quotes her
    return expr.test(value);
}


handleValidation(){
    let errors = {};
    //Form validation error message
    var taxconfiguration = {};
    var EditModal = this.state.showEditModal;
    if(EditModal)
      {
       taxconfiguration = this.state.SingleTaxConfiguration;
      }
      else
      {
       taxconfiguration = this.state.taxconfiguration;
      }

    if (taxconfiguration.name.trim() === '') {
      errors.name = "Tax name can't be empty"
    }

    if (taxconfiguration.rate === '') {
      errors.rate = "Rate can't be empty"
    }

    if(this.state.taxconfiguration.alwaysruntax == false){
        if (taxconfiguration.starttime === '') {
            errors.starttime = "Start Time can't be empty"
        }
        if (taxconfiguration.endtime === '') {
            errors.endtime = "End Time can't be empty"
        }

    if(taxconfiguration.runmonday === false && taxconfiguration.runtuesday === false && taxconfiguration.runwednesday === false && taxconfiguration.runthursday === false && taxconfiguration.runfriday === false && taxconfiguration.runsaturday === false && taxconfiguration.runsunday === false){
      errors.day = "Select Day"
    }
    }


  this.setState({ errors }); //Set Errors state
  return Object.keys(errors).length == 0;
  }


  open() {
    var taxconfiguration = this.state.taxconfiguration;
    taxconfiguration['alwaysruntax'] = true;
    this.setState({
      taxconfiguration:taxconfiguration,
      showModal: true
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

  resetHandler(){
    console.log('cli')
  }


StartTimePicker(element){

console.log(element);
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
    //const taxconfiguration = this.state.taxconfiguration;

   }
     var EditModal = this.state.showEditModal;
if(EditModal)
     {
      this.state.SingleTaxConfiguration["starttime"] = time;
      //this.setState({SingleTaxConfiguration.starttime:time})
      //    console.log(this.state.SingleTaxConfiguration);
     }
     else
     {
      this.state.taxconfiguration["starttime"]=time;
      //console.log(this.state.taxconfiguration);
     }

     if(!!this.state.errors["starttime"]) {
      let errors = Object.assign({}, this.state.errors);
       delete errors["starttime"];
       this.setState({errors});
    }
 }
   //console.log(this.state.taxconfiguration);

}


validatePMpmornot(value){
  var expr = /PM/;  // no quotes her
  return expr.test(value);
}


EndTimePicker(element){
   console.log(element);
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
     console.log('inside-endtime');
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
    //const taxconfiguration = this.state.taxconfiguration;

   }
   var EditModal = this.state.showEditModal;
   if(EditModal)
   {  this.state.SingleTaxConfiguration["endtime"]=time;

    //this.setState({SingleTaxConfiguration.endtime:time})
    console.log(this.state.SingleTaxConfiguration);
   }
   else
   {
    this.state.taxconfiguration["endtime"]=time;
    console.log(this.state.taxconfiguration);
   }

   console.log(time);

    if(!!this.state.errors["endtime"]) {
    let errors = Object.assign({}, this.state.errors);
     delete errors["endtime"];
     this.setState({errors});
  }
  }
   //console.log(this.state.taxconfiguration);

}


ComparetwoTimes(starttime, endtime) {
    var startHours;
    var startMinutes;
    var endHours;
    var endMinutes;

    if (this.validatepmornot(starttime)) {
      console.log(starttime);
      startHours = parseInt(starttime.substring(0, 2));
      console.log(startHours);
        if (startHours != 12) {
          startHours = startHours + 12;
        }
        startMinutes = parseInt(starttime.substring(4));
      } else {
        startHours = parseInt(starttime.substring(0, 2));
        startMinutes = parseInt(starttime.substring(4));
      }
      if (this.validatepmornot(endtime)) {
        console.log(endtime);
        endHours = parseInt(endtime.substring(0, 2));
        console.log(endHours);
        if (endHours != 12) {
          endHours = endHours + 12;;
        }
        endMinutes = parseInt(endtime.substring(4));
      } else {
        endHours = parseInt(endtime.substring(0, 2));
        endMinutes = parseInt(endtime.substring(4));
      }
      console.log('endhours' + endHours);
      console.log('startHours' + startHours);
      if (endHours > startHours) {
        return true;
      } else {
        return false;
      }
  }


dayofweek(event)
  {
      var EditModal = this.state.showEditModal;
      var taxconfigurationedit ={};
      if(EditModal)
      {
        taxconfigurationedit = this.state.SingleTaxConfiguration;

        if(taxconfigurationedit[event.target.name])
        taxconfigurationedit[event.target.name] = false;
        else
        taxconfigurationedit[event.target.name] = true;
        this.setState({
        SingleTaxConfiguration: taxconfigurationedit
        });
      }
      else
      {
        taxconfigurationedit = this.state.taxconfiguration;
        if(taxconfigurationedit[event.target.name])
        taxconfigurationedit[event.target.name] = false;
        else
        taxconfigurationedit[event.target.name] = true;
        this.setState({
          taxconfiguration: taxconfigurationedit
        });
    }
}


  //Get single Tax on modal
modifyTax(TaxConfigurationID)
   {
    console.log(this.state.tableConfig.data);
    var that = this;
    //this.setState({showEditModal: true});
    var index = -1;
    var _totaltaxes = this.state.tableConfig.data.length;
    var sliced = {};
    for( var i = 0; i < _totaltaxes; i++ ) {
      if(this.state.tableConfig.data[i].id == TaxConfigurationID){

          sliced = this.state.tableConfig.data[i];
          //console.log(sliced);
          this.state.SingleTaxConfiguration = sliced;
          var st = null;
          var et = null;
          if(moment( sliced.starttime).isValid())
          {
            st = moment(sliced.starttime);
            et = moment(sliced.endtime);
          }
          else
          {
             st =  moment("10/10/2017 " +sliced.starttime);
             et =  moment("10/10/2017 " +sliced.endtime);

          }

          this.state.Start_Time = st;
          this.state.End_Time = et;
        index = i;

         this.setState({
          hidden: sliced.isinclusivetax,
          runtax: sliced.alwaysruntax,
          Start_Time :st,
          End_Time:et,
          errors:{}
    });
        break;
      }

    }

    //this.SetRadioButton(sliced);
    this.setState({showEditModal: true});
    console.log(this.state.SingleTaxConfiguration)
  }



deleteTax(taxConfigurationID){
    var that = this;
    var delQuery = {};
    var index = -1;
    var _totaltaxes = this.state.tableConfig.data.length;
    for( var i = 0; i < _totaltaxes; i++ ) {
      if(this.state.tableConfig.data[i].id == taxConfigurationID){
        index = i;
        break;
      }
    }
    this.state.tableConfig.data.splice( index, 1 );


    //this.setState({printers: this.state.printers});

/*    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var credentials = getUserDetails();
    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;*/

    delQuery['isdeleted'] = true;
    delQuery['taxConfigurationID'] = taxConfigurationID;
    delQuery['userdetails'] = getUserDetails();

    console.log(JSON.stringify(delQuery));

    const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/DeleteTaxConfiguration/json`, {
      method: 'POST',
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify(delQuery)
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      if (data.statusCode >= 400) {
        that.setState({
          msgFailure: data.statusMessage
        })
      } else {
        that.setState({
          msgSuccess: data.statusMessage
        });
        setTimeout(function () {
        that.setState({
          msgSuccess:''
        })
        window.location.reload();
      }, 2000)
    }
    }).catch(function(error) {
      return error;
    })
  }



getAllTaxes(){
  var that = this;
  var reqQuery = {};
/*  var credentials = getUserDetails();
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  credentials['storeuniquekey'] = storeuniquekey;*/
  reqQuery['userdetails'] = getUserDetails();


  const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/GetTaxConfigurations/json`, {
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
      console.log(data);

      var tableConfig = that.state.tableConfig;
      var totaltaxes = data.taxconfigurationList.length;

        var taxesarr =[];
        for(var i = 0; i < data.taxconfigurationList.length; i++) {
          //console.log(data.taxconfigurationList);
         var obj = data.taxconfigurationList[i];
         if(obj.starttime ==="" && obj.endtime === ""){
          taxesarr.push(obj);
         } else{
           var starttime =   moment(obj.starttime).format('hh:mm a');
           var endtime   =   moment(obj.endtime).format('hh:mm a');
           obj.starttime = starttime.toString();
           obj.endtime = endtime.toString();
           taxesarr.push(obj);
         }
       }

      //return false;
     tableConfig['data'] = data.taxconfigurationList;
     tableConfig['data'] = taxesarr;
      that.setState({
        tableConfig: tableConfig,
        dayparts: taxesarr
      });
   });
}




   onChange(event) {
    this.setState({isEditable: true});
    var field = event.target.name;
    var EditModal = this.state.showEditModal;
    var taxconfiguration ={};
    if(EditModal)
    taxconfiguration = this.state.SingleTaxConfiguration;
    else
    taxconfiguration = this.state.taxconfiguration;

    taxconfiguration[field] = event.target.value;
    if(!!this.state.errors[event.target.name]) {
    let errors = Object.assign({}, this.state.errors);
     delete errors[event.target.name];
     this.setState({errors});
  }

}

 handlechange(event) {
    var isinclusivetax = {};
    var field = event.target.name;
    isinclusivetax = event.target.checked;
    console.log(isinclusivetax)
    return this.setState({
      hidden: isinclusivetax
    })
 }


 handlechange1(event){
  let field = event.target.name;
  var EditModal = this.state.showEditModal;
  var taxconfiguration = this.state.taxconfiguration;
  taxconfiguration["alwaysruntax"] = event.target.checked;

  if(taxconfiguration.alwaysruntax === false){
    taxconfiguration["starttime"] = '';
    taxconfiguration["endtime"] = '';

    this.setState({
        taxconfiguration: taxconfiguration
    });
  }

  this.setState({
      taxconfiguration: taxconfiguration,
      runtax: event.target.checked
  });


/*  if(EditModal)
  {
    if(taxconfiguration.alwaysruntax = true){
      taxconfiguration['starttime'] = "12:00 AM"
      taxconfiguration['endtime'] = "11:59 PM"

    return this.setState({
    SingleTaxConfiguration : taxconfiguration,
    runtax: event.target.checked
      })
  }
}
else
{
    taxconfiguration = this.state.taxconfiguration;
    taxconfiguration["alwaysruntax"] = event.target.checked;
    if(taxconfiguration.alwaysruntax = true){
    taxconfiguration['starttime'] = "12:00 AM"
    taxconfiguration['endtime'] = "11:59 PM"
    return this.setState({
    taxconfiguration : taxconfiguration,
    runtax: event.target.checked
      })
    }
  }*/
}


onSubmit(event) {
  event.preventDefault();
  var that = this;
  var isValid = this.handleValidation();
  if(isValid){
  var prpReq = {};
  var taxconfiguration = this.state.taxconfiguration;


/*  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
  credentials["domainuniquekey"] = domainuniquekey;
  credentials["storeuniquekey"] = storeuniquekey;*/


  prpReq['userdetails'] = getUserDetails();

  taxconfiguration['isinclusivetax'] = this.state.hidden;
  taxconfiguration['alwaysruntax'] = taxconfiguration.alwaysruntax;


  if(!taxconfiguration.alwaysruntax === false){
    taxconfiguration["starttime"] = '12:00 AM';
    taxconfiguration["endtime"] = '11:59 PM';

    this.setState({
        taxconfiguration: taxconfiguration
    });
  }



  prpReq['taxconfiguration'] = taxconfiguration;

   const addtaxes = {};
    var taxdata = this.state.taxconfiguration;


      addtaxes["taxconfiguration"] = taxdata;
      addtaxes["userdetails"] = getUserDetails();

      var oldState = this.state.tableConfig.data;

    console.log(JSON.stringify(addtaxes));
    const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/CreateTaxConfiguration/json`, {
        method: 'POST',
        headers: new Headers({
        'Content-Type':'application/json'
        }),
        body: JSON.stringify(addtaxes)
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
      taxes : oldState
      })
      setTimeout(function () {
      that.setState({
        msgFailure:''
      })
      window.location.reload();
    }, 2000)
}
 else{
        var newState = taxdata;
        newState.id = data.taxconfigurationid;
        oldState.push(newState);
        console.log(oldState);
        var tableConfig = that.state.tableConfig;
        tableConfig['data'] = oldState;
        that.setState({
        msgSuccess: data.statusMessage,
        showModal: false,
        tableConfig: tableConfig,
        taxes : oldState
        })
        setTimeout(function () {
        that.setState({
          msgSuccess:''
        })
        window.location.reload();
      }, 2000)
      }
    }).catch(error => {
   return error;
   });
// }
 }
}

onUpdateTax(){
    var that = this;
    var isValid = this.handleValidation();
    if(isValid){
    var updateQuery = {};
    var updatedTax = this.state.SingleTaxConfiguration;
    updatedTax['id'] = this.state.SingleTaxConfiguration.id;
    updatedTax['isinclusivetax'] = this.state.hidden;
    updatedTax['alwaysruntax'] = this.state.runtax;


/*    var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');

    credentials["domainuniquekey"] = domainuniquekey;
    credentials['storeuniquekey'] = storeuniquekey;*/

    updateQuery["userdetails"] = getUserDetails();

    updateQuery["taxconfiguration"] = updatedTax


    if(this.state.taxconfiguration.name ==""){
      updateQuery["taxconfiguration"]["name"] = this.state.SingleTaxConfiguration.name
    }
      const edittaxes = {};
      var taxdata = this.state.SingleTaxConfiguration;


      edittaxes["taxconfiguration"] = taxdata;
      edittaxes["userdetails"] = getUserDetails();

      var oldState = this.state.tableConfig.data;


    console.log(JSON.stringify(updateQuery))
    const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/UpdateTaxConfiguration/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(updateQuery)
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
                  showEditModal: false
              })
          } else {

          var _totaltaxes = that.state.tableConfig.data.length;

          for( var i = 0; i < _totaltaxes; i++ ) {
            var taxes = that.state.tableConfig.data;
            var taxconfigurationid = updateQuery.taxconfiguration.id;

            if(taxes[i].id == taxconfigurationid){
                taxes[i] = updateQuery.taxconfiguration;
            }
          }
          //updateQuery
          that.setState({
              showEditModal: false,
              msgSuccess: data.statusMessage
          });
        setTimeout(function() {
        that.setState({
          msgSuccess:''
        })
        window.location.reload();
      }, 2000);
        }
     });
  }
}


  onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
    });
  }



  render(){
    console.log(this.state.taxconfiguration)
    var { taxes, msgFailure, msgSuccess,SingleTaxConfiguration,runtax } = this.state;

       const format = 'h:mm a';
       const active = "day-active";
       const inactive = "";

    return (
      <div className="tab-pane active" id="taxes">

        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        {msgSuccess}
        </div>}

        <Tabelify
          resetHandler = {this.resetHandler}
          style={{margin:'30px'}} {...this.state.tableConfig}
          modalHandler = {this.open}
          editHandler = {this.modifyTax}
          deleteHandler = {this.deleteTax}
          />

        <Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>

        <form>
          <Modal.Header closeButton>
            <Modal.Title>Add Tax</Modal.Title>
          </Modal.Header>
          <Modal.Body>

           <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
                type="text"
                name="name"
                label="Tax Name"
                value={this.state.name}
                placeholder=""
                required="*"
                className={classnames('form-control', { error: !!this.state.errors.name})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.name}</span>
          </div>


           <div className={classnames('form-group', { error: !!this.state.errors.rate})}>
               <TextInput
                  type="text"
                  name="rate"
                  label="Rate"
                  value={this.state.rate}
                  placeholder=""
                  required="*"
                  onChange={this.onChange}
                  className={classnames('form-control', { error: !!this.state.errors.rate})}
                  />
                  <span>{this.state.errors.rate}</span>
            </div>

          <div className="row">
            <div className="col-sm-6">
             <div className="form-group">
            <Checkbox
              onChange={this.handlechange}
              checked={this.state.hidden}
              name="hidden"
              id="hidden"
              required="*"
              label="Is Inclusive (Hidden) Tax"
            />
          </div>
            </div>


            <div className="col-sm-6">
             <div className="form-group">
            <Checkbox
              onChange={this.handlechange1}
              checked={this.state.taxconfiguration.alwaysruntax}
              name="runtax"
              id="runtax"
              required="*"
              label="Always Run Tax"
            />
          </div>
            </div>
          </div>

        {!this.state.taxconfiguration.alwaysruntax ? <div>
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
               <li><a name="runmonday" className={this.state.taxconfiguration.runmonday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>M</a></li>
                <li><a name="runtuesday" className={this.state.taxconfiguration.runtuesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                <li><a name="runwednesday" className={this.state.taxconfiguration.runwednesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>W</a></li>
                <li><a name="runthursday" className={this.state.taxconfiguration.runthursday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                <li><a name="runfriday" className={this.state.taxconfiguration.runfriday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>F</a></li>
                <li><a name="runsaturday" className={this.state.taxconfiguration.runsaturday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                <li><a name="runsunday" className={this.state.taxconfiguration.runsunday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
              </ul>
          </div> <span>{this.state.errors.day}</span>
          </div>
          </div>
          :null}
      </Modal.Body>
      <Modal.Footer>
      <Button className="btn-submit"  onClick={this.onSubmit}>Submit</Button>
      <Button className="btn-cancel"  onClick={this.close}>Cancel</Button>
      </Modal.Footer>
    </form>
</Modal>




    <Modal show={this.state.showEditModal} onHide={this.close} backdrop={false} keyboard={false}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Edit Tax</Modal.Title>
          </Modal.Header>
          <Modal.Body>

           <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
                  type="text"
                  name="name"
                  label="Tax Name"
                  //value={this.state.SingleTaxConfiguration.name}
                  defaultValue={this.state.SingleTaxConfiguration.name}
                  placeholder=""
                  required="*"
                  className={classnames('form-control', { error: !!this.state.errors.name})}
                  onChange={this.onChange}
                />
              <span>{this.state.errors.name}</span>
          </div>


           <div className={classnames('form-group', { error: !!this.state.errors.rate})}>
               <TextInput
                    type="text"
                    name="rate"
                    label="Rate"
                    //value={this.state.SingleTaxConfiguration.rate}
                    defaultValue={this.state.SingleTaxConfiguration.rate}
                    placeholder=""
                    required="*"
                    onChange={this.onChange}
                    className={classnames('form-control', { error: !!this.state.errors.rate})}
                    />
                  <span>{this.state.errors.rate}</span>
            </div>

          <div className="row">
            <div className="col-sm-6">
             <div className="form-group">
            <Checkbox
                onChange={this.handlechange}
                checked={this.state.hidden}
                name="hidden"
                id="hidden"
                required="*"
                label="Is Inclusive (Hidden) Tax"
              />
          </div>

            </div>

            <div className="col-sm-6">
             <div className="form-group">
            <Checkbox
                onChange={this.handlechange1}
                checked={this.state.runtax}
                name="runtax"
                id="runtax"
                required="*"
                label="Always Run Tax"
              />
          </div>
            </div>
          </div>
      {!runtax ? <div>
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
               <li><a name="runmonday" className={this.state.SingleTaxConfiguration.runmonday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>M</a></li>
                <li><a name="runtuesday" className={this.state.SingleTaxConfiguration.runtuesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                <li><a name="runwednesday" className={this.state.SingleTaxConfiguration.runwednesday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>W</a></li>
                <li><a name="runthursday" className={this.state.SingleTaxConfiguration.runthursday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                <li><a name="runfriday" className={this.state.SingleTaxConfiguration.runfriday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>F</a></li>
                <li><a name="runsaturday" className={this.state.SingleTaxConfiguration.runsaturday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                <li><a name="runsunday" className={this.state.SingleTaxConfiguration.runsunday==true?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
              </ul>
          </div> <span>{this.state.errors.day}</span>
          </div>
          </div>
          :null}
      </Modal.Body>
      <Modal.Footer>
      <Button className="btn-submit"  onClick={this.onUpdateTax}>Submit</Button>
      <Button className="btn-cancel"  onClick={this.close}>Cancel</Button>
      </Modal.Footer>
    </form>
</Modal>
    </div>
    )
  }
}
export default TabSecondary;