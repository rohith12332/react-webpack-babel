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


global.jQuery = require('jquery');
var _ = require('underscore');

//Table Column Defination
var columnMetadata = [
{
    "columnName": "name",
    "displayName": "Name"
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
class MenuGroupsTab extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeGrid = this.onChangeGrid.bind(this);
        this.state = {
            showModal: false,
            msgFailure:"",
            msgSuccess:"",
            daystorunflags:119,
            showEditModal:false,
            MenuGroups:[],
            Menus:[],
            MenusId:[],
            errors:{},
            pageHead:{
                pagehead:'MenuGroups',
                dashboard: 'Dashboard',
                setup: 'Setup'
            },
            singlemenugroup:{},

            "menugroup":{
                "createdby":"",
                "createddate":"",
                "menucount":0,
                "id":"1627aea5-8e0a-4371-9022-9b504344e724",
                "isdeleted":false,
                "modifiedby":"",
                "modifieddate":"",
                "name":"",
                "menus":[],
                "store_id":"1627aea5-8e0a-4371-9022-9b504344e724"
            },

            tableConfig: {
                data:[],
                columnMetadata: columnMetadata,
                currentPage : 1,
                showCheckbox: false,
                onChangeGrid: this.onChangeGrid,
                selectedRows: {},
                onRowClick  :   this.onRowClick,
                resultsPerPage: 10,
                localSearch: true,
                btnText : 'Add Menu Group'
            }
        }
        this.EditMenuGroup = this.EditMenuGroup.bind(this);
        this.RemoveMenuGroup = this.RemoveMenuGroup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.close = this.close.bind(this);
        this.open  = this.open.bind(this);
    }


    open(event)
    {
     this.setState({
        showModal: true,
        MenusId:[]
    });
     this.getMenus();
 }

 close(event)
 {
  var EditModal = this.state.showEditModal;
  if(EditModal)
  {
      this.setState({
          showEditModal: false,
          MenusId:[]
      });
  }
  else
  {
    this.setState({
        showModal: false,
        MenusId:[]

    });
}
}

onChange(event) {
    this.setState({isEditable: true});
    const field = event.target.name;
    var EditModal = this.state.showEditModal;
    var menugroup ={};
    if(EditModal)
        menugroup = this.state.singlemenugroup;
    else
        menugroup = this.state.menugroup;

    menugroup[field] = event.target.value;
    if(!!this.state.errors[event.target.name]) {
        let errors = Object.assign({}, this.state.errors);
        delete errors[event.target.name];
        this.setState({errors});
    }

}


EditMenuGroup(id)
{
 this.getMenus();
 this.setState({showEditModal:true});
 this.getsinglemenugroup(id);

}

RemoveMenuGroup(id)
{
  var DelMenu = {};
  var that = this;
  var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
  var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
  var credentials = getUserDetails();
  credentials["storeuniquekey"] = storeuniquekey;
  credentials["domainuniquekey"] = domainuniquekey;
  var index = -1;
  var _totalMenuGroups = this.state.MenuGroups.length;
  for( var i = 0; i < _totalMenuGroups; i++ ) {
    if(this.state.MenuGroups[i].id == id){
        index = i;
        break;
    }
}
this.state.MenuGroups.splice( index, 1 );
this.setState( {MenuGroups: this.state.MenuGroups});
DelMenu['MenuGroupID'] =  id;
DelMenu['userdetails']  = getUserDetails();
DelMenu['isdeleted']    =  true;

const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/DeleteMenuGroup/json`, {
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
    this.getMenuGroups();
    this.getMenus();

}

getsinglemenugroup(Id) {
    var that = this;
    var reqQuery = {};

    reqQuery['userdetails'] = getUserDetails();
    reqQuery['MenuGroupID'] = Id;
    const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/GetSingleMenugroup/json`, {
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
        let selectedmenus = [];
        for (var j = 0; j < data.MenuGroup.menus.length; j++) {
            selectedmenus.push(data.MenuGroup.menus[j].id);
        }
        return  that.setState({
            singlemenugroup: data.MenuGroup,
            MenusId: selectedmenus
        });
    });
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
        var updatemenu = this.state.menugroup;

        /* adding menus */
        var menuslen = this.state.MenusId.length;
        var MenusList = [];
        for (var i = 0; i < menuslen; i++) {
          MenusList.push({
            "id": this.state.MenusId[i]
        });
      }
      updatemenu.menus = MenusList;


      /* end of adding menu */

      addmenu["MenuGroup"] = updatemenu;
      addmenu["userdetails"] = getUserDetails();
      var oldmenusState = this.state.tableConfig.data;


      console.log(JSON.stringify(addmenu));
      const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/CreateMenuGroup/json`, {
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
            updatemenu.id = data.MenuGroupId;
            oldmenusState.push(updatemenu);
            var tableConfig = that.state.tableConfig;
            tableConfig['data'] = oldmenusState;
            that.setState({
                msgSuccess: data.statusMessage,
                showModal: false,
                MenuGroups : oldmenusState,
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
        var updatemenu = this.state.singlemenugroup;

        /* adding menus */
        var menuslen = this.state.MenusId.length;
        var MenusList = [];
        for (var i = 0; i < menuslen; i++) {
          MenusList.push({
            "id": this.state.MenusId[i]
        });
      }
      updatemenu.menus = MenusList;


      /* end of adding menu */

      addmenu["MenuGroup"] = updatemenu;
      addmenu["userdetails"] = getUserDetails();
      var oldmenusState = this.state.tableConfig.data;
      var _totalmenus = that.state.tableConfig.data.length;
      for( var i = 0; i < _totalmenus; i++ ) {
        var menugroup = that.state.MenuGroups;
        var menugroupId = updatemenu.id;
        if(menugroup[i].id == menugroupId){
         menugroup[i] = updatemenu;
     }
 }
 console.log(JSON.stringify(addmenu));
 const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/UpdateMenuGroup/json`, {
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
            MenuGroups : oldmenusState,
            MenusId :[]
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

getMenuGroups() {
    var that = this;
    var credentials = {};
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['index'] = 2147483647;
    credentials['recordcount'] = 2147483647;
    credentials["userdetails"] = getUserDetails();
    credentials["userdetails"]['storeuniquekey'] = storeuniquekey;
    const request = new Request(`${process.env.API_HOST}/ManageMenus.svc/GetMenuGroups/json`, {
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
      var tableConfig = that.state.tableConfig;
      tableConfig['data'] = data.menusList;
      that.setState({
        tableConfig: tableConfig,
        MenuGroups: data.menusList
    });
  });
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

        that.setState({
            Menus: data.menusList
        });
    });
}


handleChange(event){

    let field = event.target.name;
    if(event.target.type =='checkbox'){
            var arrayMenuIds = [];
            arrayMenuIds=this.state.MenusId;
            var found = jQuery.inArray(field, arrayMenuIds);
        if (found >= 0) {
        // Element was found, remove it.
        if(event.target.checked == false)
          arrayMenuIds.splice(found, 1);
        } else {
            // Element was not found, add it.
            if(event.target.checked == true)
              arrayMenuIds.push(field);
        }

        this.setState({
            MenusId : arrayMenuIds
        })
    }
}

  validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }


handleValidation(){
    let errors = {};

    var menugroup = {};
    var EditModal = this.state.showEditModal;
    if(EditModal)
    {
        menugroup = this.state.singlemenugroup;
    }
    else
    {
        menugroup = this.state.menugroup;
    }

    if (menugroup.name.trim() === '') {
        document.getElementById("name").focus();
        errors.name = "Menu Group name can't be empty";
    }

    this.setState({ errors }); //Set Errors state
    return Object.keys(errors).length == 0;
}


render()
{
    const {pageHead,Menus,msgFailure,msgSuccess,MenusId} = this.state;
    const format = 'h:mm a';
    const active = "day-active";
    const inactive = "";
    var that = this;

    var menusList = Menus.map(function(o){
        var found = jQuery.inArray(o.id, MenusId);
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
        <div className="tab-pane" id="menugroups">
            {msgFailure &&
            <div className="alert alert-warning alert-dismissible" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                {msgFailure}
            </div>
            }
            {msgSuccess &&
            <div className="alert alert-success alert-dismissible" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                {msgSuccess}
            </div>
            }
            <div className="row">
                <div className="col-sm-12">
                    <Tabelify
                        style={{margin:'30px'}} {...this.state.tableConfig}
                        modalHandler={this.open}
                        editHandler={this.EditMenuGroup}
                        deleteHandler={this.RemoveMenuGroup}
                        />
                </div>
            </div>
            <Modal show={this.state.showModal}  onHide={this.close} backdrop={false} keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Menu Group</Modal.Title>
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
                label="Menu Group Name"
                value={this.state.menugroup.name}
                defaultValue={this.state.menugroup.name}
                placeholder=""
                required="*"
                onChange={this.onChange}
                className={classnames('form-control', { error: !!this.state.errors.name})}
                />
                <span>{this.state.errors.name}</span>
                </div>
                <div className="row">
                <div className="col-sm-12">
                <div className="product-box">
                <div className="product-box-head">Select Available Menus </div>
                <div className="product-box-wrap">
                <div className="am-scroller nano">
                <div className="content nano-content">
                <div className="product-box-list">
                <ul>
                {menusList.map((menusList) =>
                menusList.label
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
            label="MenuGroup Name"
            value={this.state.singlemenugroup.name}
            defaultValue={this.state.singlemenugroup.name}
            placeholder=""
            required="*"
            onChange={this.onChange}
            className={classnames('form-control', { error: !!this.state.errors.name})}
            />
            <span>{this.state.errors.name}</span>
            </div>
            <div className="row">
            <div className="col-sm-12">
            <div className="product-box">
            <div className="product-box-head">Select Available Menus</div>
            <div className="product-box-wrap">
            <div className="am-scroller nano">
            <div className="content nano-content">
            <div className="product-box-list">
            <ul>
                {menusList.map((menusList) =>
                menusList.label
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

export default MenuGroupsTab;
