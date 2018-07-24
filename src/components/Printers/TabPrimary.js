import React from 'react';
import GroupList from './GroupList';
import ListFromGroup from './ListFromGroup';
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
import '../Menus/Menus.css';

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
]

class TabPrimary extends React.Component {
    constructor(props){
      super(props);
    this.onChangeGrid = this.onChangeGrid.bind(this);
      this.state = {

  "printerGroup":{
      "Printers":[],
      "createdby":"",
      "createddate":"",
      "id":"1627aea5-8e0a-4371-9022-9b504344e724",
      "isdeleted":false,
      "modifiedby":"",
      "modifieddate":"",
      "name":"",
      "printerscount":2147483647,
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
      btnText : 'Add Printer Group'
   },
    showModal: false,
    msgFailure:"",
    msgSuccess:"",
    showEditModal:false,
    PrinterGroups:[],
    PrinterId:[],
    Printers:[],
    errors:{},
    singleprintergroup:{}

      }

      this.open  = this.open.bind(this);
      this.close = this.close.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onUpdate = this.onUpdate.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.RemovePrinterGroup = this.RemovePrinterGroup.bind(this);
      this.EditPrinterGroup = this.EditPrinterGroup.bind(this);

  }

componentDidMount() {
  this.getAllPrinters();
  this.getAllPrinterGroups();
}

open(event)
  {
     this.setState({
      showModal: true,
      PrinterId:[]
   });
}

close(event)
    {
      var EditModal = this.state.showEditModal;
      if(EditModal)
    {
      this.setState({
      showEditModal: false,
      PrinterId:[]
      });
    }
    else
    {
      this.setState({
      showModal: false,
      PrinterId:[]

      });
    }
 }

onChange(event) {
    this.setState({isEditable: true});
    const field = event.target.name;
    var EditModal = this.state.showEditModal;
    var printerGroup ={};

    if(EditModal)
      printerGroup = this.state.singleprintergroup;
    else
      printerGroup = this.state.printerGroup;

      printerGroup[field] = event.target.value;
    if(!!this.state.errors[event.target.name]) {
    let errors = Object.assign({}, this.state.errors);
     delete errors[event.target.name];
     this.setState({errors});
   }

}

onChangeGrid(event, data) {

  var tableConfig = this.state.tableConfig;
  _.extend(tableConfig, data);
  this.setState({
  tableConfig: tableConfig
  });
}

handleChange(event){

      let field = event.target.name;
      if(event.target.type =='checkbox'){
      var arrayPrinterIds = [];
      arrayPrinterIds=this.state.PrinterId;
      var found = jQuery.inArray(field, arrayPrinterIds);
      if (found >= 0) {
          // Element was found, remove it.
          if(event.target.checked == false)
            arrayPrinterIds.splice(found, 1);
      } else {
          // Element was not found, add it.
          if(event.target.checked == true)
            arrayPrinterIds.push(field);
      }
      this.setState({
      PrinterId : arrayPrinterIds
      })
      console.log(arrayPrinterIds);
    }
  }

validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }

handleValidation(){
    let errors = {};

    var printerGroup = {};

    var EditModal = this.state.showEditModal;
    if(EditModal)
    {
      printerGroup = this.state.singleprintergroup;
    }
    else
    {
      printerGroup = this.state.printerGroup;
    }

    //console.log(printerGroup);
    if (printerGroup.name.trim() === '') {
        document.getElementById("name").focus();
        errors.name = "Printer Group Name can't be empty"
      }

      this.setState({ errors }); //Set Errors state
      return Object.keys(errors).length == 0;
  }


RemovePrinterGroup(id) {
    var DelPrinters = {};
    var that = this;
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var credentials = getUserDetails();
    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;

    var index = -1;
    var _totalPrinterGroups = this.state.PrinterGroups.length;
    for( var i = 0; i < _totalPrinterGroups; i++ ) {
    if(this.state.PrinterGroups[i].id == id){
    index = i;
    break;
    }
  }
    this.state.PrinterGroups.splice( index, 1 );
    this.setState( {PrinterGroups: this.state.PrinterGroups});
    DelPrinters['printergroupId'] =  id;
    DelPrinters['userdetails']  =  getUserDetails();
    DelPrinters['isdeleted']    =  true;

    console.log(JSON.stringify(DelPrinters));

    const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/DeletePrinterGroup/json`, {
    method: 'POST',
    headers: new Headers({
    'Content-Type': 'application/json'
  }),
    body: JSON.stringify(DelPrinters)
  });
    return fetch(request).then(function(response) {
      console.log(response)
    return response.json();
  }).then(function(data) {
    console.log(data)
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
  }, 2000)

  }
  }).catch(function(error) {
  return error;
  })
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
    const editPrinters = {};
    var updatePrinters = this.state.singleprintergroup;
    console.log(updatePrinters)

/* adding menus */
    var Printerlen = this.state.PrinterId.length;
            var PrinterList = [];
            for (var i = 0; i < Printerlen; i++) {
              PrinterList.push({
                "id": this.state.PrinterId[i]
              });
            }
            updatePrinters.Printers = PrinterList;
            console.log(PrinterList)


/* end of adding menu */

  editPrinters["printerGroup"] = updatePrinters;
  editPrinters["userdetails"] = getUserDetails();

    var oldmenusState = this.state.tableConfig.data;
    var _totalprinters = that.state.tableConfig.data.length;
    for( var i = 0; i < _totalprinters; i++ ) {
    var printerGroup = that.state.PrinterGroups;
    var PrinterGroupID = updatePrinters.id;
    if(printerGroup[i].id == PrinterGroupID){
       printerGroup[i] = updatePrinters;
    }
  }

  console.log(JSON.stringify(editPrinters));

  const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/UpdatePrinterGroup/json`, {
    method: 'POST',
    headers: new Headers({
    'Content-Type':'application/json'
    }),
    body: JSON.stringify(editPrinters)
    });
  return fetch(request).then(response => {
    console.log(response)
  if (response.status >= 400) throw new Error("Bad response from server");
  return response.json();
  }).then(function(data) {
    console.log(data)
    if (data.statusCode !== 200) {
    that.setState({
    msgFailure: data.statusMessage,
    showEditModal: false
    })
  } else{
    that.setState({
    msgSuccess: data.statusMessage,
    showEditModal: false,
    PrinterGroups : oldmenusState,
    PrinterId :[]
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

getAllPrinterGroups() {

      var that = this;
      var credentials = {};
      var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
      credentials['index'] = 2147483647;
      credentials['recordcount'] = 2147483647;
      credentials["userdetails"] = getUserDetails();
      credentials["userdetails"]['storeuniquekey'] = storeuniquekey;

      //console.log(JSON.stringify(credentials))

      const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/GetPrinterGroups/json`, {
      method: 'POST',
      headers: new Headers({
      'Content-Type': 'application/json'
      }),
      body: JSON.stringify(credentials)
      });
      fetch(request)
      .then(function(response) {

        //console.log(response)

      return response.json();
      }).then(function(data) {

        //console.log(data)

       if(data.printergroups == null || data.printergroups=="")
       {data.printergroups =[];}

      var tableConfig = that.state.tableConfig;
      tableConfig['data'] = data.printergroups;
      that.setState({
      tableConfig: tableConfig,
      PrinterGroups: data.printergroups
    });
  });
}


getAllPrinters(){
    var that = this;
    var reqQuery = {};
    var credentials = getUserDetails();
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['storeuniquekey'] = storeuniquekey;
    reqQuery['isall'] = true;
    reqQuery['isrequirednetworkprinters'] = true;
    reqQuery['userdetails'] = getUserDetails();

     console.log(JSON.stringify(reqQuery))

    const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/GetPrinters/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(reqQuery)
    });
    fetch(request)
      .then(function(response) {
        console.log(response)
        if(response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        that.setState({
          Printers: data.printers
        });
     });
  }


EditPrinterGroup(id)
   {
     this.getAllPrinters();
     this.setState({showEditModal:true});
     this.getSinglePrinterGroup(id);
   }


getSinglePrinterGroup(Id) {
      var that = this;
      var reqQuery = {};

      reqQuery['userdetails'] = getUserDetails();
      reqQuery['printergroupId'] = Id;

      console.log(JSON.stringify(reqQuery))

      const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/GetSinglePrinterGroup/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(reqQuery)
      });
      fetch(request).then(function(response) {
        console.log(response)
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      }).then(function(data) {

        console.log(data);

        let selectedprinters = [];
        console.log(data.printerGroup.Printers)
        for (var j = 0; j < data.printerGroup.Printers.length; j++) {
          selectedprinters.push(data.printerGroup.Printers[j].id);
        }
        console.log(selectedprinters);
       return  that.setState({
           singleprintergroup: data.printerGroup,
           PrinterId: selectedprinters
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
    const addPrinter = {};
    var updatePrinter = this.state.printerGroup;

    console.log(updatePrinter)

    /* adding Printer */

    var Printerlen = this.state.PrinterId.length;
            var PrinterList = [];
            for (var i = 0; i < Printerlen; i++) {
              PrinterList.push({
                "id": this.state.PrinterId[i]
              });
            }
            updatePrinter.Printers = PrinterList;

            console.log(PrinterList)

    /* end of adding menu */

    addPrinter["printerGroup"] = updatePrinter;
    addPrinter["userdetails"] = getUserDetails();
    var oldPrinterState = this.state.tableConfig.data;

    console.log(oldPrinterState)


  console.log(JSON.stringify(addPrinter));

  const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/CreatePrinterGroup/json`, {
  method: 'POST',
  headers: new Headers({
  'Content-Type':'application/json'
  }),
    body: JSON.stringify(addPrinter)
  });
    return fetch(request).then(response => {
      console.log(response)
  if (response.status >= 400) throw new Error("Bad response from server");
    return response.json();
    }).then(function(data) {
    console.log(data)
    if (data.statusCode !== 200) {
    that.setState({
    msgFailure: data.statusMessage,
    showModal: false
  })
  }else{
    updatePrinter.id = data.PrinterGroupID;
    oldPrinterState.push(updatePrinter);
    var tableConfig = that.state.tableConfig;
    tableConfig['data'] = oldPrinterState;
    that.setState({
    msgSuccess: data.statusMessage,
    showModal: false,
    PrinterGroups : oldPrinterState,
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


  render(){

    const {msgFailure,msgSuccess,PrinterId,Printers,singleprintergroup} = this.state;

    var that = this;
    var printerslist = Printers.map(function(o){
    var found = jQuery.inArray(o.id, PrinterId);
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
      <div className="tab-pane" id="printergroup">

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
            editHandler={this.EditPrinterGroup}
            deleteHandler={this.RemovePrinterGroup}
            />
          </div>
        </div>

     <Modal show={this.state.showModal}  onHide={this.close} backdrop={false} keyboard={false}>
      <form>
        <Modal.Header closeButton>
        <Modal.Title>Add Printer Group</Modal.Title>
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
                label="Printer Group"
                value={this.state.printerGroup.name}
                //defaultValue={this.state.printerGroup.name}
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
                      <div className="product-box-head">Select Available Printers </div>
                      <div className="product-box-wrap">
                        <div className="am-scroller nano">
                          <div className="content nano-content">
                            <div className="product-box-list">
                              <ul>

                                {printerslist.map((printerslist) =>
                                  printerslist.label
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
        <Modal.Title>Edit Printer Group</Modal.Title>
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
                label="Printer Group"
                value={this.state.singleprintergroup.name}
                defaultValue={this.state.singleprintergroup.name}
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
                      <div className="product-box-head">Select Available Printers</div>
                      <div className="product-box-wrap">
                        <div className="am-scroller nano">
                          <div className="content nano-content">
                            <div className="product-box-list">
                              <ul>

                                {printerslist.map((printerslist) =>
                                  printerslist.label
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
export default TabPrimary;