import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from '../common/Checkbox';
import Checkbox1 from '../common/Checkbox1';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import 'react-datepicker/dist/react-datepicker';
import TextInput from '../common/TextInput';
import classnames from 'classnames';
import Tabelify from '../react-tabelify/Tabelify';
import getUserDetails from '../common/CredentialDomain';
import './Menus.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
global.jQuery = require('jquery');
var _ = require('underscore');

//Table Column Defination
var columnMetadata = [
{
"columnName": "name",
"displayName": "Name"
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
class MenusTab extends React.Component {
constructor(props) {
super(props);
this.onChangeGrid = this.onChangeGrid.bind(this);
this.state = {
showModal: false,
msgFailure:"",
msgSuccess:"",
daystorunflags:119,
showEditModal:false,
Menus:[],
ProductGroups:[],
productGroupsId:[],
selectedOption:'1',
Start_Time:[],
End_Time :[],
errors:{},
pageHead:{
pagehead:'Menus',
dashboard: 'Dashboard',
setup: 'Setup'
},
singlemenu:{},
"menu":{
		"createdby":"",
		"createddate":"",
		"daystorunflags":0,
		"defaultselectedproductgroupid":"1627aea5-8e0a-4371-9022-9b504344e724",
		"endtime":"",
		"id":"1627aea5-8e0a-4371-9022-9b504344e724",
		"isdeleted":false,
		"modifiedby":"",
		"modifieddate":"",
		"name":"",
		"ordermenuitemsbyweight":true,
		"productgroups":[],
		"starttime":"",
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
btnText: 'Add Menu'
}
}
 this.EditMenu = this.EditMenu.bind(this);
 this.RemoveMenu = this.RemoveMenu.bind(this);
 this.StartTimePicker = this.StartTimePicker.bind(this);
 this.EndTimePicker = this.EndTimePicker.bind(this);
 this.dayofweek = this.dayofweek.bind(this);
 this.onChange = this.onChange.bind(this);
 this.handleChange = this.handleChange.bind(this);
 this.onUpdate = this.onUpdate.bind(this);
 this.onSubmit = this.onSubmit.bind(this);
 this.close = this.close.bind(this);
 this.open  = this.open.bind(this);
}



open(event)
{
 this.setState({
 	daystorunflags:127,
	showModal: true,
	productGroupsId:[],
	Start_Time:moment('10/10/2016 9:00:00'),
	End_Time : moment('10/10/2016 18:00:00'),
  	"menu":{
		"createdby":"",
		"createddate":"",
		"daystorunflags":0,
		"defaultselectedproductgroupid":"1627aea5-8e0a-4371-9022-9b504344e724",
		"endtime":"6:00 pm",
		"id":"1627aea5-8e0a-4371-9022-9b504344e724",
		"isdeleted":false,
		"modifiedby":"",
		"modifieddate":"",
		"name":"",
		"ordermenuitemsbyweight":true,
		"productgroups":[],
		"starttime":"9:00 am",
		"store_id":"1627aea5-8e0a-4371-9022-9b504344e724"

	},
 });
}

close(event)
{
var EditModal = this.state.showEditModal;
if(EditModal)
{
this.setState({
showEditModal: false,
Start_Time:[],
End_Time :[]
});
}
else
{
this.setState({
showModal: false,
Start_Time:[],
End_Time :[]
});
}
}

dayofweek(event)
  {
    var EditModal = this.state.showEditModal;
    var menuedit ={};

      menuedit = this.state.daystorunflags;
      var value = parseInt(event.target.name);

      if((value&menuedit)===value)
		{
          menuedit = menuedit - value;
		}
	  else
	   {
         menuedit = menuedit + value;
	   }

      this.setState({
        daystorunflags: menuedit
      });

    console.log(menuedit);

  }


   onChange(event) {
    this.setState({isEditable: true});
    const field = event.target.name;
    var EditModal = this.state.showEditModal;
    var menu ={};
    if(EditModal)
    menu = this.state.singlemenu;
    else
   	menu = this.state.menu;

    menu[field] = event.target.value;
    if(!!this.state.errors[event.target.name]) {
    let errors = Object.assign({}, this.state.errors);
     delete errors[event.target.name];
     this.setState({errors});
  }

}




handleChange(event){

let field = event.target.name;
var EditModal = this.state.showEditModal;
var menu ={};
if(field ==='ordermenuitemsbyweight')
{
if(EditModal)
{
menu = this.state.singlemenu;
menu[field]=event.target.checked;
return this.setState({
singlemenu : menu
})
}
else
{
menu = this.state.menu;
menu[field]=event.target.checked;
return this.setState({
menu : menu
})
}
}

if(event.target.type =='checkbox'){
var arrayProductgroupIds = [];
arrayProductgroupIds=this.state.productGroupsId;
console.log(event.target.checked);
var found = jQuery.inArray(field, arrayProductgroupIds);
if (found >= 0) {
    // Element was found, remove it.
    if(event.target.checked == false)
      arrayProductgroupIds.splice(found, 1);
} else {
    // Element was not found, add it.
    if(event.target.checked == true)
      arrayProductgroupIds.push(field);
}
this.setState({
productGroupsId : arrayProductgroupIds
})
console.log(arrayProductgroupIds);
}
}

 EditMenu(id)
 {

   this.setState({showEditModal:true});
   this.getSingleMenu(id);

 }

 RemoveMenu(id)
 {

	var DelMenu = {};
	var that = this;
	var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
	var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
	var credentials = getUserDetails();
	credentials["storeuniquekey"] = storeuniquekey;
	credentials["domainuniquekey"] = domainuniquekey;
	var index = -1;
	var _totalMenus = this.state.Menus.length;
	for( var i = 0; i < _totalMenus; i++ ) {
	if(this.state.Menus[i].id == id){
	index = i;
	break;
	}
	}
	this.state.Menus.splice( index, 1 );
	this.setState( {Menus: this.state.Menus});
	DelMenu['MenuID'] =  id;
	DelMenu['userdetails']  =  getUserDetails();
	DelMenu['isdeleted']    =  true;
	console.log(JSON.stringify(DelMenu));
	const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/DeleteMenu/json`, {
	method: 'POST',
	headers: new Headers({
	'Content-Type': 'application/json'
	}),
	body: JSON.stringify(DelMenu)
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
	/* setTimeout(function() {
	browserHistory.push('/users')
	}, 5000)*/
	}
	}).catch(function(error) {
	return error;
	})
 }

onChangeGrid(event, data) {

  var tableConfig = this.state.tableConfig;
  _.extend(tableConfig, data);
  this.setState({
  tableConfig: tableConfig
  });
}

componentDidMount() {
  this.getMenus();
  this.getAllProductGroups();

}

getSingleMenu(Id) {
      var that = this;
      var reqQuery = {};

      reqQuery['userdetails'] = getUserDetails();
      reqQuery['menuID'] = Id;
      const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/GetSingleMenu/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(reqQuery)
      });
      fetch(request).then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      }).then(function(data) {
      	console.log(data.Menu);
      	var st = moment(data.Menu.starttime);
        var et = moment(data.Menu.endtime);
        console.log(st);
        console.log(et);
        let selectedproductgroups = [];
        for (var j = 0; j < data.Menu.productgroups.length; j++) {
          selectedproductgroups.push(data.Menu.productgroups[j].id);
        }
       return  that.setState({
           singlemenu: data.Menu,
           daystorunflags: data.Menu.daystorunflags,
           productGroupsId: selectedproductgroups,
           Start_Time :st,
           End_Time : et
        });
      });
    }



getAllProductGroups(){
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
        if(data.productsList == null) data.productsList = [];
        var totalProducts = data.productsList.length;
        var productsdata =[];
         for (var i = 0; i < totalProducts; i++) {
         productsdata.push(data.productsList[i].name,data.productsList[i].id);
        }
        console.log(data.productsList);
        console.log(productsdata);

        that.setState({
          ProductGroups: data.productsList
      });

   });
}


validatePMpmornot(value){
  var expr = /PM/;  // no quotes her
  return expr.test(value);
}




StartTimePicker(element) {
    if (element._d != null) {
      var time = element._d.toLocaleTimeString();
      var hh = time.split(":")[0];
      var mm = time.split(":")[1];
    if(this.validatePMpmornot(time))
     {
     hh = parseInt(hh)+12;
     console.log(hh);
     console.log('inside-start');
     }
      if (hh > 12) {
         hh = parseInt(hh) - 12;
        time = hh + ":" + mm + " pm";
      } else {
        if (hh == 0) {
          hh = 12;
        }
        time = hh + ":" + mm + " am";
      }
      var menu ={};
      var EditModal = this.state.showEditModal;
      if(EditModal)
		{
    		menu = this.state.singlemenu;
    		menu["starttime"]=time;
    		return this.setState({
    		singlemenu : menu
		  })
		}
		else
		{
    		menu = this.state.menu;
    		menu["starttime"]=time;
    		return this.setState({
    		menu : menu
  		})
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

  EndTimePicker(element) {
    if (element._d != null) {
      var time = element._d.toLocaleTimeString();
      var hh = time.split(":")[0];
      var mm = time.split(":")[1];
    if(this.validatePMpmornot(time))
     {
     hh = parseInt(hh)+12;
     console.log(hh);
     console.log('inside-start');
     }
      if (hh > 12) {
        hh = parseInt(hh)-12;
        time = hh + ":" + mm + " pm";
      } else {
        if (hh == 0) {
          hh = 12;
        }
        time = hh + ":" + mm + " am";
      }
      var EditModal = this.state.showEditModal;
      var menu ={};
       if(EditModal)
		{
    		menu = this.state.singlemenu;
    		menu["endtime"]=time;
    		return this.setState({
    		singlemenu : menu
  		})
		}
		else
		{
    		menu = this.state.menu;
    		menu["endtime"]=time;
    		return this.setState({
    		menu : menu
  		})
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


ComparetwoTimes(starttime, endtime) {
  	console.log(starttime);
  	console.log(endtime);
    var startHours;
    var startMinutes;
    var endHours;
    var endMinutes;

    if(starttime.indexOf('m') == -1)
    {
      startHours = parseInt(starttime.substring(11,13));
    }
    if(endtime.indexOf('m')== -1)
    {
       endHours = parseInt(endtime.substring(11,13));
    }

    if(starttime.indexOf('m') > -1)
   {

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
}
    console.log('endhours' + endHours);
    console.log('startHours' + startHours);
    if (endHours > startHours) {
      return true;
    } else {
      return false;
    }

  }

  validatepmornot(value) {
    var expr = /pm/; // no quotes her
    return expr.test(value);
  }


onSubmit(event)
{
  event.preventDefault();
  var that = this;
  var isValid =  that.handleValidation();
  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  var credentials = getUserDetails();
  credentials["domainuniquekey"] = domainuniquekey;
  credentials["storeuniquekey"] = storeuniquekey;
  if(isValid){
  const addmenu = {};
  var updatemenu = this.state.menu;
  updatemenu.daystorunflags = this.state.daystorunflags;
  /* adding Product Groups */
  var prdgrplen = this.state.productGroupsId.length;
          var prodtgroups = [];
          for (var i = 0; i < prdgrplen; i++) {
            prodtgroups.push({
              "id": this.state.productGroupsId[i]
            });
          }
          updatemenu.productgroups = prodtgroups;


/* end of adding Product Group */

addmenu["Menu"] = updatemenu;
addmenu["userdetails"] = getUserDetails();
var oldmenusState = this.state.tableConfig.data;


console.log(JSON.stringify(addmenu));
const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/CreateMenu/json`, {
method: 'POST',
headers: new Headers({
'Content-Type':'application/json'
}),
body: JSON.stringify(addmenu)
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
updatemenu.id = data.MenuId;
oldmenusState.push(updatemenu);
 var tableConfig = that.state.tableConfig;
         tableConfig['data'] = oldmenusState;
that.setState({
msgSuccess: data.statusMessage,
showModal: false,
Start_Time:[],
End_Time :[],
Menus : oldmenusState,
tableConfig:tableConfig
})


setTimeout(function () {
  that.setState({
    msgSuccess:''
  })

}, 2000)
}
}).catch(error => {
return error;
});
}
}




onUpdate(event) {
event.preventDefault();
var that = this;
var isValid =  that.handleValidation();
var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
var credentials = getUserDetails();
credentials["domainuniquekey"] = domainuniquekey;
credentials["storeuniquekey"] = storeuniquekey;
if(isValid){
const addmenu = {};
var updatemenu = this.state.singlemenu;
updatemenu.daystorunflags = this.state.daystorunflags;
/* adding Product Groups */
var prdgrplen = this.state.productGroupsId.length;
        var prodtgroups = [];
        for (var i = 0; i < prdgrplen; i++) {
          prodtgroups.push({
            "id": this.state.productGroupsId[i]
          });
        }
        console.log(prodtgroups);
        updatemenu.productgroups = prodtgroups;


/* end of adding Product Group */

addmenu["Menu"] = updatemenu;
addmenu["userdetails"] = getUserDetails();
var oldmenusState = this.state.tableConfig.data;
var _totalmenus = that.state.tableConfig.data.length;
for( var i = 0; i < _totalmenus; i++ ) {
var menu = that.state.tableConfig.data;
var menuId = this.state.singlemenu.id;
if(menu[i].id == menuId){
     menu[i] = addmenu.Menu;
   if(menu[i].starttime.indexOf('m') == -1)
      menu[i].starttime =moment( menu[i].starttime).format('hh:mm a');
   if(menu[i].endtime.indexOf('m')== -1)
      menu[i].endtime =moment( menu[i].endtime).format('hh:mm a');
}
}

console.log(JSON.stringify(addmenu));
const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/UpdateMenu/json`, {
method: 'POST',
headers: new Headers({
'Content-Type':'application/json'
}),
body: JSON.stringify(addmenu)
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
Menus : oldmenusState
})
setTimeout(function () {
  that.setState({
    msgSuccess:''
  })

}, 2000)
}
}).catch(error => {
return error;
});
}
// }
}

getMenus() {
var that = this;
var credentials = {};
var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
credentials['index'] = 2147483647;
credentials['recordcount'] = 2147483647;
credentials["userdetails"] = getUserDetails();
credentials["userdetails"]['storeuniquekey'] = storeuniquekey;
const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/GetMenus/json`, {
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

	console.log(data.menusList);

       var menusarr = [];
      for (var i = 0; i < data.menusList.length; i++) {
        var obj = data.menusList[i];
        var starttime = moment( obj.starttime).format('hh:mm a');
        var endtime = moment(obj.endtime).format('hh:mm a');
        obj.starttime = starttime.toString();
        obj.endtime = endtime.toString();
        menusarr.push(obj);
      }
      var tableConfig = that.state.tableConfig;
      tableConfig['data'] = menusarr;
      that.setState({
        tableConfig: tableConfig,
        Menus: menusarr,
        Start_Time:[],
        End_Time :[]
      });
    });
}

validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }


handleValidation(){
let errors = {};

var menu = {};
var EditModal = this.state.showEditModal;
if(EditModal)
{
menu = this.state.singlemenu;
}
else
{
menu = this.state.menu;
}

console.log(menu);
if (menu.name.trim() === '') {
  document.getElementById("name").focus();
  errors.name = "Menu name can't be empty"
}


if (menu.starttime === '') {
    errors.starttime = "Start Time can't be empty"
}
if (menu.endtime === '') {
    errors.endtime = "End Time can't be empty"
}
/*if (menu.endtime != '' && menu.starttime != '') {
      if (this.ComparetwoTimes(menu.starttime, menu.endtime) != true) {
        errors.endtime = "End Time Should be greater than Start Time";
      }
    }*/


this.setState({ errors }); //Set Errors state
return Object.keys(errors).length == 0;
}




render()
{
const {pageHead,Menus,msgFailure,msgSuccess,ProductGroups,productGroupsId,daystorunflags,Start_Time,End_Time} = this.state;
const format = 'h:mm a';
const active = "day-active";
const inactive = "";
var that = this;

var prdtGroup = ProductGroups.map(function(o){
var found = jQuery.inArray(o.id, productGroupsId);
               return{
                     label:
                                  <li>
                                  <Checkbox1
                                  onChange={that.handleChange}
                                  checked={found >=0?true:false ===true}
                                  name={o.id}
                                  id={o.id}
                                  label={o.name}
                                  />
                                 </li>

                     }

    })

return(
      <div className="tab-pane active" id="menus">
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msgSuccess}  </div>}
        <div className="row">
          <div className="col-sm-12">
            <Tabelify
            style={{margin:'30px'}} {...this.state.tableConfig}
            modalHandler={this.open}
            editHandler={this.EditMenu}
            deleteHandler={this.RemoveMenu}
            />
          </div>
        </div>



     <Modal show={this.state.showModal}  onHide={this.close} backdrop={false} keyboard={false}>
      <form>
        <Modal.Header closeButton>
        <Modal.Title>Add Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="row">



        <div className="col-sm-12">
          <div className="addproduct-wrap menuproduct-wrap">

            <div>
              <form action="#" className="">

                <div className={classnames('form-group', { error: !!this.state.errors.name})}>
			          <TextInput
			          type="text"
			          name="name"
			          label="Menu Name"
			          value={this.state.menu.name}
			          defaultValue={this.state.menu.name}
			          placeholder=""
			          required="*"
			          onChange={this.onChange}
			          className={classnames('form-control', { error: !!this.state.errors.name})}
			          />
          			<span>{this.state.errors.name}</span>
       			</div>

                <div className="row">
                  <div className="col-sm-12">
                    <div className="disc-pers-amont discount-radio-wrap">
                      <div className="form-group">
                        <label className="control-label bottom20">Days To Run<span className="required">*</span></label>
                      </div>
                      <div className="days-select-wrap">
                        <ul>
               			<li><a name="1"  className={(daystorunflags&1)===1?active:inactive}   href="javascript:void(0)" onClick={this.dayofweek}>M</a></li>
                		<li><a name="2"  className={(daystorunflags&2)===2?active:inactive}   href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                        <li><a name="4"  className={(daystorunflags&4)===4?active:inactive}   href="javascript:void(0)" onClick={this.dayofweek}>W</a></li>
                        <li><a name="8"  className={(daystorunflags&8)===8?active:inactive}   href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
		                <li><a name="16" className={(daystorunflags&16)===16?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>F</a></li>
		                <li><a name="32" className={(daystorunflags&32)===32?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
		                <li><a name="64" className={(daystorunflags&64)===64?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
		              </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
			        <div className={classnames('form-group', { error: !!this.state.errors.starttime})}>
			            <label className="control-label">Start Time<span className="required">*</span></label>
			            <div data-start-view="0" data-date="2017-04-16T05:25:00Z" data-date-format="yyyy-mm-dd - HH:ii P" data-link-field="dtp_input1" className="input-group date datetimepicker">
			               <TimePicker
			               showSecond={false}
			              defaultValue={Start_Time}
			              name="starttime"
			              format = {format}
			              onChange={this.StartTimePicker}
			              className="form-control bordernull"
			              use12Hours
			              />
			              <span className="input-group-addon btn btn-primary">
                    <i className="fa fa-clock-o" aria-hidden="true"></i></span>
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
			              defaultValue={End_Time}
			              onChange={this.EndTimePicker}
			              className="form-control bordernull"
			              use12Hours
			              />
			              <span className="input-group-addon btn btn-primary">
                    <i className="fa fa-clock-o" aria-hidden="true"></i></span>
			            </div>
		                <span>{this.state.errors.endtime}</span>
		              </div>
                </div>
                </div>

                <Checkbox
		          onChange={this.handleChange}
		          checked={this.state.handleChange}
		          name="ordermenuitemsbyweight"
		          id="ordermenuitemsbyweight"
		          label="Order Product Groups by Numerical Weighting"
                />
                <div className="row">
                  <div className="col-sm-12">
                    <div className="product-box">
                      <div className="product-box-head">Select Available Product Groups</div>
                      <div className="product-box-wrap">
                        <div className="am-scroller nano">
                          <div className="content nano-content">
                            <div className="product-box-list">
                              <ul>

                                {prdtGroup.map((prdtGroup) =>
                                  prdtGroup.label
                                )}

                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      </Modal.Body>
      <Modal.Footer>
      <Button className="btn-submit"  onClick={this.onSubmit}>Submit</Button>
      <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
      </Modal.Footer>
    </form>
    </Modal>


      <Modal show={this.state.showEditModal}  onHide={this.close} backdrop={false} keyboard={false}>
      <form>
        <Modal.Header closeButton>
        <Modal.Title>Edit Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="row">
        <div className="col-sm-12 ">
          <div className="addproduct-wrap menuproduct-wrap">
            <div>
              <form action="#" className="">

                <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                <TextInput
                type="text"
                name="name"
                label="Menu Name"
                value={this.state.singlemenu.name}
                defaultValue={this.state.singlemenu.name}
                placeholder=""
                required="*"
                onChange={this.onChange}
                className={classnames('form-control', { error: !!this.state.errors.name})}
                />
                <span>{this.state.errors.name}</span>
            </div>

                <div className="row">
                  <div className="col-sm-12">
                    <div className="disc-pers-amont discount-radio-wrap">
                      <div className="form-group">
                        <label className="control-label bottom20">Days To Run<span className="required">*</span></label>
                      </div>
                      <div className="days-select-wrap">
                        <ul>
                    <li><a name="1"   className={(daystorunflags&1)===1?active:inactive}  href="javascript:void(0)" onClick={this.dayofweek}>M</a></li>
                    <li><a name="2"  className={(daystorunflags&2)==2?active:inactive}   href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                        <li><a name="4"className={(daystorunflags&4)==4?active:inactive}   href="javascript:void(0)" onClick={this.dayofweek}>W</a></li>
                        <li><a name="8" className={(daystorunflags&8)==8?active:inactive}   href="javascript:void(0)" onClick={this.dayofweek}>T</a></li>
                    <li><a name="16"   className={(daystorunflags&16)==16?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>F</a></li>
                    <li><a name="32" className={(daystorunflags&32)==32?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                    <li><a name="64"   className={(daystorunflags&64)==64?active:inactive} href="javascript:void(0)" onClick={this.dayofweek}>S</a></li>
                  </ul>
                      </div>
                    </div>
                  </div>
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
                    <i className="fa fa-clock-o" aria-hidden="true"></i></span>
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
                    <i className="fa fa-clock-o" aria-hidden="true"></i></span>
                  </div>
                    <span>{this.state.errors.endtime}</span>
                  </div>
                </div>
                </div>

                <Checkbox
              onChange={this.handleChange}
              checked={this.state.singlemenu.ordermenuitemsbyweight}
              name="ordermenuitemsbyweight"
              id="ordermenuitemsbyweight"
              label="Order Product Groups by Numerical Weighting"
                />
                <div className="row">
                  <div className="col-sm-12">
                    <div className="product-box">
                      <div className="product-box-head">Select Available Product Groups</div>
                      <div className="product-box-wrap">
                        <div className="am-scroller nano">
                          <div className="content nano-content">
                            <div className="product-box-list">
                              <ul>

                                {prdtGroup.map((prdtGroup) =>
                                  prdtGroup.label
                                )}

                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      </Modal.Body>
      <Modal.Footer>
      <Button className="btn-submit"  onClick={this.onUpdate}>Submit</Button>
      <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
      </Modal.Footer>
    </form>
    </Modal>

</div>
)
}
}

export default MenusTab;
