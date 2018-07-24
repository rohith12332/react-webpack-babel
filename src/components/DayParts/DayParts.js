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
import TimePicker from 'rc-time-picker';
import './DayPart.css';
import getCurrentDate from '../common/Date';
import getUserDetails from '../common/CredentialDomain';
import Tabelify from '../react-tabelify/Tabelify';


var _ = require('underscore');

var columnMetadata = [
  {
  "columnName": "name",
  "displayName": "Name"
  },
  {
  "columnName": "starttime",
  "displayName": "Start time"
  },
  {
  "columnName": "endtime",
  "displayName": "End time"
  },
  {
  "columnName": "daypartordinal",
  "displayName": "Daypart Order"
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



class DayPart extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.state = {
       showModal: false,
       showEditModal :false,
       msgFailure:"",
       msgSuccess:"",
       dayparts: [],
       Start_time:[],
       End_time :[],
       singledaypart:{},

       Current_DayPart :{},
      pageHead:{
        pagehead:'DayParts',
        dashboard: 'Dashboard',
        setup: 'Setup'
            },
       daypart:
       {
        starttime:'',
        createdby:'',
        createddate: getCurrentDate(),
        isdeleted: false,
        daypartordinal:'0',
        endtime:'',
        id:'1227aea5-8e0a-4371-9022-9b504344e724',
        isdefault:true,
        modifiedby:'',
        modifieddate:getCurrentDate(),
        name:'',
        storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
    },
    errors:{},
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
        btnText: 'Add Daypart'
    }

}
  this.close = this.close.bind(this);
  this.open = this.open.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
  this.onUpdate = this.onUpdate.bind(this);
  this.onChange = this.onChange.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.StartTimePicker = this.StartTimePicker.bind(this);
  this.EndTimePicker = this.EndTimePicker.bind(this);
  this.RemoveDayPart = this.RemoveDayPart.bind(this);
  this.EditDayPart = this.EditDayPart.bind(this);

}

  componentDidMount() {
    this.getDayParts();
}


onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
  });
}

EditDayPart(daypartId)
{

 var index = -1;
 var _totaldayparts = this.state.tableConfig.data.length;
 var sliced = {};
 for( var i = 0; i < _totaldayparts; i++ ) {
  if(this.state.tableConfig.data[i].id == daypartId){
      sliced = this.state.tableConfig.data[i];
      console.log(sliced);
      var st =  moment("10/10/2017 " +sliced.starttime);
      var et = moment("10/10/2017 " +sliced.endtime);
      this.state.Start_time = st;
      this.state.End_time = et;
      index = i;
      break;
  }
}
this.setState({
  singledaypart: sliced,
  showEditModal :true
});

}

RemoveDayPart(daypartId){
  var id;
  var DelDayPart = {};
  var that = this;
  id = daypartId;

  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
  var credentials = getUserDetails();
  credentials["storeuniquekey"] = storeuniquekey;
  credentials["domainuniquekey"] = domainuniquekey;

  var index = -1;
  var _totalDayparts = this.state.dayparts.length;
  for( var i = 0; i < _totalDayparts; i++ ) {
    if(this.state.dayparts[i].id == daypartId){
      index = i;
      break;
    }
}
  this.state.dayparts.splice( index, 1 );
  this.setState( {dayparts: this.state.dayparts});

  DelDayPart['dayPartID'] = daypartId;
  DelDayPart['userdetails'] = credentials;
  DelDayPart['isdeleted'] = true;

  const request = new Request(`${process.env.API_HOST}/ManageDayPart.svc/DeleteDayPart/json`, {
    method: 'POST',
    headers: new Headers({
        'Content-Type': 'application/json'
    }),
  body: JSON.stringify(DelDayPart)
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

  }
}).catch(function(error) {
  return error;
  })
}

getDayParts() {
    var that = this;
    var credentials = {};
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['index'] = 2147483647;
    credentials['recordcount'] = 2147483647;
    credentials["userdetails"] = getUserDetails();
    credentials["userdetails"]['storeuniquekey'] = storeuniquekey;
    const request = new Request(`${process.env.API_HOST}/ManageDayPart.svc/GetDayParts/json`, {
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
    console.log(data);
    var daypartsarr =[];
    for(var i = 0; i < data.DayPartList.length; i++) {
      console.log(data.DayPartList);
      var obj = data.DayPartList[i];
      var starttime =   moment("10/10/2017 " +obj.starttime).format('hh:mm a');
      var endtime   =   moment("10/10/2017 " +obj.endtime).format('hh:mm a');
      obj.starttime = starttime.toString();
      obj.endtime = endtime.toString();
      daypartsarr.push(obj);

  }

  var tableConfig = that.state.tableConfig;
  tableConfig['data'] = daypartsarr;
  that.setState({
      tableConfig: tableConfig,
      dayparts: daypartsarr
  });

});
}

close() {
 var EditModal = this.state.showEditModal;
 this.setState({ errors: {} });
   if(EditModal)
   {
    this.setState({
        showEditModal: false,
        singledaypart:
        {
          starttime:'',
          isdeleted: false,
          daypartordinal:'',
          endtime:'',
          id:'1227aea5-8e0a-4371-9022-9b504344e724',
          isdefault:true,
          name:'',
          storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
      }
  });
}
else
{
  this.setState({
      showModal: false,
      daypart:
      {
        starttime:'',
        isdeleted: false,
        daypartordinal:1,
        endtime:'',
        id:'1227aea5-8e0a-4371-9022-9b504344e724',
        isdefault:true,
        name:'',
        storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
      }
  });
}

}

open(event) {
  //alert('hai this is kiran kumar G');
  this.setState({
    showModal: true,
    Start_time : null,
    End_time   : null,
    daypart:
    {
        starttime:'',
        createdby:'',
        createddate: getCurrentDate(),
        isdeleted: false,
        daypartordinal:'',
        endtime:'',
        id:'1227aea5-8e0a-4371-9022-9b504344e724',
        isdefault:true,
        modifiedby:'',
        modifieddate:getCurrentDate(),
        name:'',
        storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
    }
});

console.log(this.state.daypart);
}


StartTimePicker(element){
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
  //const daypart = this.state.daypart;

}

  var EditModal = this.state.showEditModal;
  if(EditModal)
   {this.state.singledaypart["starttime"]=time;
  //this.setState({singledaypart.starttime:time})
  console.log(this.state.singledaypart);
  }
  else
  {
      this.state.daypart["starttime"]=time;
  }

  if(!!this.state.errors["starttime"]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors["starttime"];
      this.setState({errors});
  }
}
//console.log(this.state.daypart);

}


validatePMpmornot(value){
  var expr = /PM/;  // no quotes her
  return expr.test(value);
}


EndTimePicker(element){

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
    //const daypart = this.state.daypart;

}
var EditModal = this.state.showEditModal;
if(EditModal)
 {  this.state.singledaypart["endtime"]=time;

    //this.setState({singledaypart.endtime:time})
    console.log(this.state.singledaypart);
}
else
{
    this.state.daypart["endtime"]=time;
}

console.log(time);

if(!!this.state.errors["endtime"]) {
    let errors = Object.assign({}, this.state.errors);
    delete errors["endtime"];
    this.setState({errors});
}
}
   //console.log(this.state.daypart);

}

onChange(event) {
  this.setState({isEditable: true});
  const field = event.target.name;

  var EditModal = this.state.showEditModal;
  if(EditModal ==true)
  {
    const singledaypart = this.state.singledaypart;
    singledaypart[field] = event.target.value;
    console.log(singledaypart);
}
else
{
    const daypart = this.state.daypart;
    daypart[field] = event.target.value;

}

if(!!this.state.errors[event.target.name]) {
    let errors = Object.assign({}, this.state.errors);
    delete errors[event.target.name];
    this.setState({errors});
}
  //alert(event.target.value);
 // console.log(daypart);
}


handleChange(event){
  let field = event.target.name;
  if(event.target.type =='checkbox'){
      var EditModal = this.state.showEditModal;
      if(EditModal)
      {
        this.state.singledaypart["isdefault"]=event.target.checked;
        var daypart = this.state.singledaypart;
        return  this.setState({
           singledaypart :daypart
       })
    }
    else
    {
        this.state.daypart[field]=event.target.checked;
        var daypart = this.state.daypart;
        return  this.setState({
           singledaypart :daypart
       })
    }
  }
}


onUpdate(event)
{
  event.preventDefault();
  var that = this;
  var isValid = this.handleValidation();
  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  var credentials = getUserDetails();
  credentials["domainuniquekey"] = domainuniquekey;
  credentials["storeuniquekey"] = storeuniquekey;

  if(isValid){
      const addDayPart = {};

      addDayPart["Daypart"] = that.state.singledaypart;
      addDayPart["userdetails"] = credentials;

      var oldDayPartsState = that.state.dayparts;

      var newDayPartState = addDayPart.Daypart;
      var _totalDayparts = that.state.dayparts.length;
      for( var i = 0; i < _totalDayparts; i++ ) {
          if(that.state.dayparts[i].id == addDayPart.Daypart.id){
           that.state.dayparts[i]= addDayPart.Daypart;
           break;
       }
   }
   console.log(JSON.stringify(addDayPart));
   const request = new Request(`${process.env.API_HOST}/ManageDayPart.svc/UpdateDayPart/json`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type':'application/json'
  }),
    body: JSON.stringify(addDayPart)
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
          singledaypart:
          {
            starttime:'',
            createdby:'',
            createddate: getCurrentDate(),
            isdeleted: false,
            daypartordinal:1,
            endtime:'',
            id:'',
            isdefault:true,
            modifiedby:'',
            modifieddate:getCurrentDate(),
            name:'new daypart',
            storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
        }

    })
      setTimeout(function () {
          that.setState({
            msgSuccess:''
        })

      }, 2000);
  }
}).catch(error => {
  return error;
});

}
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
      const addDayPart = {};

      addDayPart["Daypart"] = this.state.daypart;
      addDayPart["userdetails"] = credentials;

      var oldDayPartsState = this.state.dayparts;

      console.log(JSON.stringify(addDayPart));
      const request = new Request(`${process.env.API_HOST}/ManageDayPart.svc/CreateDayPart/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type':'application/json'
      }),
        body: JSON.stringify(addDayPart)
    });

      return fetch(request).then(response => {
        if (response.status >= 400) throw new Error("Bad response from server");
        return response.json();
    }).then(function(data) {
        if (data.statusCode !== 200) {
          that.setState({
            msgFailure: data.statusMessage,
            showModal: false
        })
      }else{
         var newDayPartState = addDayPart.Daypart;
         newDayPartState.id = data.DayPartID;
         oldDayPartsState.push(newDayPartState);

         that.setState({
//statusSucessMessage: data.statusMessage,
msgSuccess: data.statusMessage,
showModal: false,
dayparts : oldDayPartsState,
daypart:
{
    starttime:'',
    createdby:'',
    createddate: getCurrentDate(),
    isdeleted: false,
    daypartordinal:1,
    endtime:'',
    id:'1227aea5-8e0a-4371-9022-9b504344e724',
    isdefault:true,
    modifiedby:'',
    modifieddate:getCurrentDate(),
    name:'new daypart',
    storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
}

})

         setTimeout(function () {
          that.setState({
            msgSuccess:''
        })

      }, 2000);
     }
 }).catch(error => {
  return error;
});
}

}

validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }

handleValidation(){
  let errors = {};
  var EditModal = this.state.showEditModal;
  var daypart = {};
  if(EditModal)
  {
    console.log('edit');
    daypart = this.state.singledaypart;

}
else
{
    daypart = this.state.daypart;

}
if (daypart.name.trim() === '') {
    document.getElementById("name").focus();
    errors.name = "DayPart name can't be empty"
}


if (daypart.starttime === '') {
    errors.starttime = "Start Time can't be empty"
}

if (daypart.endtime === '') {
    errors.endtime = "End Time can't be empty"
}



if (daypart.daypartordinal === '') {
    errors.daypartordinal = "DayPart Ordinal can't be empty"
}else if(!this.validateDayPartordinal(daypart.daypartordinal)){
    errors.daypartordinal = "Invalid DayPart Ordinal"
}
else
{
    var dayparts = this.state.dayparts;
    var _totalDayparts = this.state.dayparts.length;
    for( var i = 0; i < _totalDayparts; i++ ) {
      if(this.state.dayparts[i].daypartordinal == daypart.daypartordinal && this.state.dayparts[i].id != daypart.id){
       errors.daypartordinal ="Already number exists";
       break;
   }
}

}
  this.setState({ errors }); //Set Errors state

  return Object.keys(errors).length == 0;
}



validateDayPartordinal(value){
  var daypartordinal = /^\d+$/;
  return daypartordinal.test(value);
}

render(){
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    const format = 'h:mm a';
    const {msgSuccess, msgFailure, dayparts,pageHead} = this.state;
    return (
      <DefaultLayout>
        <div className="page-head inner__pageHead">
            <div className="domain-icon"> <img src={require('./dayparts.svg')}/> <h2>{pageHead.pagehead}</h2></div>
            <ol className="breadcrumb">
                <li><Link to={`/domains`}>{currentDomain}</Link></li>
                <li><Link to={`/stores`}>{currentStore}</Link></li>
                <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                <li className="active">{pageHead.pagehead}</li>
            </ol>
        </div>

      <main>
      <div className="master-table">
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msgSuccess}  </div>}
      <div className="row">
      <div className="col-sm-12">
      <div className="" id="dayparts">

      <div className="dashbord-table">
        <Tabelify
        style={{margin:'30px'}} {...this.state.tableConfig}
        modalHandler={this.open}
        editHandler={this.EditDayPart}
        deleteHandler={this.RemoveDayPart}
        />

        </div>
  </div>
  </div>
  </div>

  <Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>
  <form>
  <Modal.Header closeButton>
  <Modal.Title>Add Daypart</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div className={classnames('form-group', { error: !!this.state.errors.name})}>
       <TextInput
       type="text"
       name="name"
       required="*"
       label="Daypart Name (i.e. Breakfast, Lunch, Dinner)"
       value={this.state.daypart.name}
       defaultValue={this.state.daypart.name}
       placeholder=""
       onChange={this.onChange}
       className={classnames('form-control', { error: !!this.state.errors.name})}
       />
       <span>{this.state.errors.name}</span>
       </div>

       <div className={classnames('form-group', { error: !!this.state.errors.starttime})}>
       <label className="control-label">Daypart Start Time <span className="required"> *</span></label>

       <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
       <TimePicker
       showSecond={false}
       defaultValue={this.state.Start_time}
       name   ="starttime"
       format = {format}
       onChange={this.StartTimePicker}
       className="form-control bordernull"
       use12Hours

       />
       <span className="input-group-addon btn btn-primary">
       <i className="icon icon-213"></i></span>
       </div>
       <span>{this.state.errors.starttime}</span>
       </div>
       <div className={classnames('form-group', { error: !!this.state.errors.endtime})}>
       <label className="control-label">Daypart End Time <span className="required"> *</span></label>

       <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
       <TimePicker
       showSecond={false}
       name   ="endtime"
       onChange={this.EndTimePicker}
       defaultValue={this.state.End_time}
       format = {format}
       className="form-control bordernull"
       use12Hours
       />
       <span className="input-group-addon btn btn-primary">
       <i className="icon icon-213"></i></span>
       </div>
       <span>{this.state.errors.endtime}</span>
       </div>
       <div className={classnames('form-group', { error: !!this.state.errors.daypartordinal})}>


       <TextInput
       type="text"
       name="daypartordinal"
       required="*"
       label="Daypart Order # (i.e. Breakfast 1, Lunch 2, Dinner 3)"
       value={this.state.daypart.daypartordinal}
       defaultValue={this.state.daypart.daypartordinal}
       placeholder=""
       onChange={this.onChange}
       className={classnames('form-control', { error: !!this.state.errors.daypartordinal})}

       />
       <span>{this.state.errors.daypartordinal}</span>
       </div>

       <div className="form-group">


       <Checkbox
       onChange={this.handleChange}
       checked={this.state.daypart.isdefault===true}
       name="isdefault"
       id="isdefault"
       label="Is Default Daypart"
       />
       </div>

       </Modal.Body>
       <Modal.Footer>
        <Button className="btn-primary" onClick={this.onSubmit}>Submit</Button>
        <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
       </Modal.Footer>
       </form>
       </Modal>


       <Modal show={this.state.showEditModal} onHide={this.close} backdrop={false} keyboard={false}>
       <form>
       <Modal.Header closeButton>
       <Modal.Title>Edit Day Part</Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <div className={classnames('form-group', { error: !!this.state.errors.name})}>
       {/* <label className="control-label">Daypart Name (i.e. Breakfast, Lunch, Dinner)<span className="required">*</span></label>
   <input type="text" placeholder="" className="form-control"/>*/}
   <TextInput
   type="text"
   name="name"
   required="*"
   label="Daypart Name (i.e. Breakfast, Lunch, Dinner)"
   value={this.state.singledaypart.name}
   defaultValue={this.state.singledaypart.name}
   placeholder=""
   onChange={this.onChange}
   className={classnames('form-control', { error: !!this.state.errors.name})}
   />
   <span>{this.state.errors.name}</span>
   </div>

   <div className={classnames('form-group', { error: !!this.state.errors.starttime})}>
   <label className="control-label">Daypart Start Time <span className="required"> *</span></label>

   <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
   <TimePicker
   showSecond={false}
   defaultValue={this.state.Start_time}
   name   ="starttime"
   format = {format}
   onChange={this.StartTimePicker}
   className="form-control bordernull"
   use12Hours

   />
   <span className="input-group-addon btn btn-primary">
   <i className="icon icon-213"></i></span>
   </div>
   <span>{this.state.errors.starttime}</span>
   </div>
   <div className={classnames('form-group', { error: !!this.state.errors.endtime})}>
   <label className="control-label">Daypart End Time <span className="required"> *</span></label>

   <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
   <TimePicker
   showSecond={false}
   name   ="endtime"
   onChange={this.EndTimePicker}
   defaultValue={this.state.End_time}
   format = {format}
   className="form-control bordernull"
   use12Hours
   />
   <span className="input-group-addon btn btn-primary">
   <i className="icon icon-213"></i></span>
   </div>
   <span>{this.state.errors.endtime}</span>
   </div>
   <div className={classnames('form-group', { error: !!this.state.errors.daypartordinal})}>


   <TextInput
   type="text"
   name="daypartordinal"
   required="*"
   label="Daypart Order # (i.e. Breakfast 1, Lunch 2, Dinner 3)"
   value={this.state.singledaypart.daypartordinal}
   defaultValue={this.state.singledaypart.daypartordinal}
   placeholder=""
   onChange={this.onChange}
   className={classnames('form-control', { error: !!this.state.errors.daypartordinal})}

   />
   <span>{this.state.errors.daypartordinal}</span>
   </div>

   <div className="form-group">


   <Checkbox
   onChange={this.handleChange}
   checked={this.state.singledaypart.isdefault}
   name="isdefault"
   id="isdefault"
   label="Is Default Daypart"
   />
   </div>

   </Modal.Body>
   <Modal.Footer>
   <Button className="btn-primary" onClick={this.onUpdate}>Submit</Button>
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
export default DayPart;

