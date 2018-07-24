import React from 'react';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
//import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
//import Layout from './Layout';
//import styleConfig from './TableStyle';
//import Filter from './Filter';
//import EditDeletePrinter from './EditDeletePrinter';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
import Checkbox from '../common/Checkbox';
import classnames from 'classnames';
import TextInput from '../common/TextInput';
import getCurrentDate from '../common/Date';
import getUserDetails from '../common/CredentialDomain';

import Tabelify from '../react-tabelify/Tabelify';
var _ = require('underscore');


//Table Column Defination
var columnMetadata = [
    {
        "columnName": "name",
        "displayName": "Name"
    },
    {
        "columnName": "path",
        "displayName": "Printer Path",
    },
    {
        "columnName": "isnetworkprinter",
        "displayName": "TCP/IP",
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
      printer_path:{
        label:'',
        value:''
      },
      printerPathList:[],
      "PrinterInformation":{
        "createdby":"OnePos",
        "createddate": getCurrentDate(),
        "id":"1627aea5-8e0a-4371-9022-9b504344e724",
        "isdeleted":false,
        "isnetworkprinter": false,
        "modifiedby":"OnePos",
        "modifieddate": getCurrentDate(),
        "name":"",
        "path":""
      },
      tcpip: false,
      showModal: false,
      showEditModal: false,
      errors:{},
      isLoading: true,
      printers:[],
      singlePrinter:[],
      "msgSuccess": "",
      "msgFailure": "",
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
        btnText: 'Add Printer'
      }
    }

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handlechange = this.handlechange.bind(this);
    this.handlePrinterPath = this.handlePrinterPath.bind(this);
    this.modifyPrinter = this.modifyPrinter.bind(this);
    this.deletePrinter = this.deletePrinter.bind(this);
    this.editClose = this.editClose.bind(this);
    this.updatePrinter = this.updatePrinter.bind(this);
	}

  componentDidMount() {
    this.printerPath();
    this.getAllPrinters();
  }

  open() {
    this.setState({
      showModal: true
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

validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }


handleValidation(){
    let errors = {};

    var PrinterInformation = {};

    var EditModal = this.state.showEditModal;
    if(EditModal)
    {
      PrinterInformation = this.state.singlePrinter;
    }
    else
    {
      PrinterInformation = this.state.PrinterInformation;
    }

    //console.log(PrinterInformation);
    if (PrinterInformation.name.trim() === '') {
        document.getElementById("name").focus();
        errors.name = "Printer Name can't be empty"
      }

      this.setState({ errors }); //Set Errors state
      return Object.keys(errors).length == 0;
}


  //Get single printer on modal
  modifyPrinter(printerId){
    console.log(this.state.tableConfig.data);
    var that = this;
    this.setState({showEditModal: true});
    var index = -1;
    var _totalprinters = this.state.tableConfig.data.length;

    for( var i = 0; i < _totalprinters; i++ ) {
      if(this.state.tableConfig.data[i].id == printerId){
        var sliced = this.state.tableConfig.data[i];
        index = i;
        break;
      }
    }
    if(sliced.isnetworkprinter =='Yes'){
      sliced.isnetworkprinter = true
    }else{
      sliced.isnetworkprinter = false
    }
    this.setState({
      singlePrinter: sliced,
      tcpip: sliced.isnetworkprinter,
      printer_path: {
        label: sliced.path,
        value:sliced.id
      }
    });
  }

  deletePrinter(printerId){
    var that = this;
    var delQuery = {};
    var index = -1;
    var _totalprinters = this.state.tableConfig.data.length;
    for( var i = 0; i < _totalprinters; i++ ) {
      if(this.state.tableConfig.data[i].id == printerId){
        index = i;
        break;
      }
    }
    this.state.tableConfig.data.splice( index, 1 );


    //this.setState({printers: this.state.printers});

    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var credentials = getUserDetails();
    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;

    delQuery['isdeleted'] = true;
    delQuery['printerID'] = printerId;
    delQuery['userdetails'] = getUserDetails();

    const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/DeletePrinter/json`, {
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
        });
        setTimeout(function() {
        that.setState({
          msgSuccess:''
        })
      }, 2000);
      }
    }).catch(function(error) {
      return error;
    })
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
  const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/GetPrinters/json`, {
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
      var totalPrinters = data.printers.length;
      tableConfig['isLoading'] = false;

      for(var i = 0; i < totalPrinters; i++){
        if(data.printers[i].isnetworkprinter === true){
            data.printers[i].isnetworkprinter = 'Yes'
        }else{
            data.printers[i].isnetworkprinter = 'No'
        }
      }

      //console.log(data.printers)
      //return false;

      tableConfig['data'] = data.printers;
      that.setState({
        tableConfig: tableConfig
      });
   });
}

printerPath(){
    var that = this;
    var reqQuery = {};

    var credentials = getUserDetails();
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');

    credentials["domainuniquekey"] = domainuniquekey;
    credentials['storeuniquekey'] = storeuniquekey;
    reqQuery['userdetails'] = getUserDetails();

    const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/GetAllLocalPrinters/json`, {
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
          printerPathList: data.LocalPrinterList
        });
     });
  }

handlePrinterPath(element){
    this.setState({
      printer_path:{
        label:element.label,
        value:element.value
      }
    })
  }

onChange(event){
    var Printer = {}
    var field = event.target.name;
    Printer = this.state.PrinterInformation;
    Printer[field] = event.target.value;
    this.setState({
      PrinterInformation:Printer
    })
  }

onSubmit(){
    var that = this;
    var isValid = this.handleValidation();
    if(isValid){
    var prpReq = {};
    var PrinterInformation = this.state.PrinterInformation;
    var credentials = getUserDetails();
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');

    credentials["domainuniquekey"] = domainuniquekey;
    credentials['storeuniquekey'] = storeuniquekey;
    prpReq['userdetails'] = getUserDetails();

    PrinterInformation['path'] = this.state.printer_path.label;
    PrinterInformation['isnetworkprinter'] = this.state.tcpip;
    prpReq['PrinterInformation'] = PrinterInformation;

    var PLoldState = this.state.tableConfig.data;
    var PLnewState = prpReq.PrinterInformation;
    PLoldState.push(PLnewState);

    console.log(JSON.stringify(prpReq));
    const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/CreatePrinter/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(prpReq)
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
              setTimeout(function() {
              that.setState({
                msgFailure:''
              })
            }, 2000);
          } else {
              that.setState({
                  printers: PLoldState,
                  showModal: false,
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

handlechange(event) {
    var isNetworkPrinter = {};
    var field = event.target.name;
    isNetworkPrinter = event.target.checked;
    return this.setState({
      tcpip: isNetworkPrinter
    })
  }

updatePrinter(){
    var that = this;
    var isValid = this.handleValidation();
    if(isValid){
    var updateQuery = {};
    var updatedPrinterInformation = this.state.PrinterInformation;
    updatedPrinterInformation['id'] = this.state.singlePrinter.id;
    updatedPrinterInformation['path'] = this.state.printer_path.label;
    updatedPrinterInformation['isnetworkprinter'] = this.state.tcpip;

    var credentials = getUserDetails();
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var storeid = window.sessionStorage.getItem('storeid');

    credentials["domainuniquekey"] = domainuniquekey;
    credentials['storeuniquekey'] = storeuniquekey;
    updateQuery["userdetails"] = getUserDetails();

    updateQuery["PrinterInformation"] = updatedPrinterInformation
    updateQuery["PrinterInformation"]['store_id'] = storeid

    if(this.state.PrinterInformation.name ==""){
      updateQuery["PrinterInformation"]["name"] = this.state.singlePrinter.name
    }


    console.log(JSON.stringify(updateQuery));

    const request = new Request(`${process.env.API_HOST}/ManagePrinters.svc/UpdatePrinter/json`, {
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
              setTimeout(function() {
              that.setState({
                msgFailure:''
              })
            }, 2000);

          } else {

          var _totalprinters = that.state.tableConfig.data.length;

          for( var i = 0; i < _totalprinters; i++ ) {
            var printer = that.state.tableConfig.data;
            var printerID = updateQuery.PrinterInformation.id;

            if(printer[i].id == printerID){
                printer[i] = updateQuery.PrinterInformation;
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
    var {printers, msgFailure, msgSuccess, singlePrinter} = this.state;
    var printerPathList = this.state.printerPathList;
    printerPathList = printerPathList.map(function(o) {
      return {
        label: o.printerpath,
        value: o.id
      }
    });
        return <div className="tab-pane active" id="printers">
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
          style={{margin:'30px'}} {...this.state.tableConfig}
          modalHandler={this.open}
          editHandler={this.modifyPrinter}
          deleteHandler={this.deletePrinter}
          />
        <Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Add Printer</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
                type="text"
                name="name"
                label="Printer Location Name"
                value={this.state.name}
                placeholder=""
                required="*"
                className={classnames('form-control', { error: !!this.state.errors.name})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.name}</span>
          </div>
          <div className="form-group">
            <label className="control-label">Printer Path <span className="required">*</span></label>
          <Select
            name="printerPath"
            value={this.state.printer_path.value}
            options={printerPathList}
            onChange={this.handlePrinterPath}
            />
          </div>
          <div className="form-group">
            <Checkbox
              onChange={this.handlechange}
              checked={this.state.tcpip}
              name="tcpip"
              id="tcpip"
              required="*"
              label="Is a Network Printer (Uses TCP/IP)"
            />
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-submit" onClick={this.onSubmit}>Submit</Button>
            <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
          </Modal.Footer>
        </form>
        </Modal>
        <Modal show={this.state.showEditModal} onHide={this.editClose} backdrop={false} keyboard={false}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Edit Printer</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
                type="text"
                name="name"
                label="Printer Location Name"
                value={this.state.name}
                defaultValue={singlePrinter.name}
                placeholder=""
                required="*"
                className={classnames('form-control', { error: !!this.state.errors.name})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.name}</span>
          </div>
          <div className="form-group">
            <label className="control-label">Printer Path <span className="required">*</span></label>
          <Select
            name="printerPath"
            value={this.state.printer_path}
            options={printerPathList}
            onChange={this.handlePrinterPath}
            />
          </div>
          <div className="form-group">
            <Checkbox
              onChange={this.handlechange}
              checked={this.state.tcpip}
              name="tcpip"
              id="tcpip"
              required="*"
              label="Is a Network Printer (Uses TCP/IP)"
            />
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-submit" onClick={this.updatePrinter}>Submit</Button>
            <Button className="btn-cancel" onClick={this.editClose}>Cancel</Button>
          </Modal.Footer>
        </form>
        </Modal>
    </div>
  }
}
export default TabSecondary;