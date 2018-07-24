import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from '../common/Checkbox';
import { browserHistory, Link } from 'react-router';
import getUserDetails from '../common/CredentialDomain';
import 'react-datepicker/dist/react-datepicker';
import TextInput from '../common/TextInput';
import classnames from 'classnames';
import Tabelify from '../react-tabelify/Tabelify';
import './TenderType.css';
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
class TenderType extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeGrid = this.onChangeGrid.bind(this);
        this.state = {
            showModal: false,
            msgFailure:"",
            msgSuccess:"",
            showEditModal:false,
            TenderTypes:[],
            isLoading: true,
            selectedOption:'1',
            errors:{},
            pageHead:{
                pagehead:'Tender Types',
                dashboard: 'Dashboard',
                setup: 'Setup'
            },
            singletendertype:{},
            tendertype:{
                assumepaysinfull:false,
                closescheck:false,
                createdby:'',
                createddate:'',
                dinersclub:false,
                id:'1627aea5-8e0a-4371-9022-9b504344e724',
                isaccount:false,
                isamex:false,
                isbuiltin:false,
                ischeck:false,
                iscomp:false,
                iscreditother:false,
                isdeleted:false,
                isdiscover:false,
                isdomesticcurrency:false,
                isgift:false,
                isjcb:false,
                ismastercard:false,
                isother:true,
                isroom:false,
                isvisa:false,
                isvoid:false,
                modifiedby:'',
                modifieddate:'',
                name:'',
                openscashdrawer:false,
                printsreceipt:false,
                promptforcrossreference:false,
                receiptcount:0,
                store_id:'1627aea5-8e0a-4371-9022-9b504344e724'
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
                btnText: 'Add TenderType'
            }
        }

        this.EditTenderType = this.EditTenderType.bind(this);
        this.RemoveTenderType = this.RemoveTenderType.bind(this);
        this.onChange = this.onChange.bind(this);
        this.open = this.open.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRadioCheck = this.handleRadioCheck.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.close = this.close.bind(this);
        this.SetRadioButton = this.SetRadioButton.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }
    close(event)
    {
        var EditModal = this.state.showEditModal;
        if(EditModal)
        {
            this.setState({
                showEditModal: false
            });
        }
        else
        {
            this.setState({
                showModal: false
            });
        }
    }
    EditTenderType(id)
    {
//console.log(this.state.tableConfig.data);
//var that = this;
var index = -1;
var _totaltendertypes = this.state.tableConfig.data.length;
var sliced = {};
for( var i = 0; i < _totaltendertypes; i++ ) {
    if(this.state.tableConfig.data[i].id == id){
        sliced = this.state.tableConfig.data[i];
        index = i;
        break;
    }
}
this.setState({
    singletendertype: sliced
});
this.SetRadioButton(sliced);
this.setState({showEditModal: true});
}
SetRadioButton(sliced)
{
//alert(1);
var tendertype = sliced;
console.log(JSON.stringify(tendertype));
if(tendertype.isother ==true)
{
    this.setState({
        selectedOption: "1"
    });
}
if(tendertype.iscreditother ==true)
{
    this.setState({
        selectedOption: "2"
    });
}
if(tendertype.isaccount ==true)
{
    this.setState({
        selectedOption: "3"
    });
}
if(tendertype.isroom ==true)
{
    this.setState({
        selectedOption: "4"
    });
}
if(tendertype.iscomp ==true)
{
    this.setState({
        selectedOption: "5"
    });
}
if(tendertype.isdomesticcurrency ==true)
{
    this.setState({
        selectedOption: "6"
    });
}
if(tendertype.ischeck ==true)
{
    this.setState({
        selectedOption: "7"
    });
}
//console.log('radio button select');
//console.log(that);
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
    var tendertype ={};
    if(EditModal)
        tendertype = this.state.singletendertype;
    else
        tendertype = this.state.tendertype;
    this.setState({
        selectedOption: event.target.parentNode.children[0].value,
    });
    tendertype.isother =false;
    tendertype.iscreditother =false;
    tendertype.isaccount = false;
    tendertype.isroom = false;
    tendertype.iscomp =false;
    tendertype.isdomesticcurrency = false;
    tendertype.ischeck=false;
    if(Rvalue =="1")
    {
        tendertype.isother =true;
    }
    else if (Rvalue =="2")
    {
        tendertype.iscreditother =true;
    }
    else if (Rvalue =="3")
    {
        tendertype.isaccount = true;
    }
    else if (Rvalue =="4")
    {
        tendertype.isroom = true;
    }
    else if (Rvalue =="5")
    {
        tendertype.iscomp =true;
    }
    else if (Rvalue =="6")
    {
        tendertype.isdomesticcurrency =true;
    }
    else if (Rvalue =="7")
    {
        tendertype.ischeck =true;
    }
    console.log(tendertype);
}
componentDidMount() {
    this.getTenderTypes();
}
onChange(event) {
    this.setState({isEditable: true});
    const field = event.target.name;
    var EditModal = this.state.showEditModal;
    var tendertype ={};
    if(EditModal)
        tendertype = this.state.singletendertype;
    else
        tendertype = this.state.tendertype;
    tendertype[field] = event.target.value;
    if(!!this.state.errors[event.target.name]) {
        let errors = Object.assign({}, this.state.errors);
        delete errors[event.target.name];
        this.setState({errors});
    }
}

validateText(value) {
    var text = /^[a-zA-Z]+$/;
    return text.test(value);
}


handleValidation(){
    let errors = {};
//Form validation error message
var tendertype = {};
var EditModal = this.state.showEditModal;
if(EditModal)
{
  tendertype = this.state.singletendertype;
}
else
{
  tendertype = this.state.tendertype;
}

if (tendertype.name.trim() === '') {
    document.getElementById("state").focus();
    errors.name = "Tender name can't be empty"
}

if (tendertype.receiptcount != '') {
  if(tendertype.receiptcount > 0)
      if(tendertype.printsreceipt === false)
          errors.starttime = "Check printsreceipt checkbox"
  }
  this.setState({ errors }); //Set Errors state
  return Object.keys(errors).length == 0;
}


open(event)
{
    this.setState({
        showModal: true,
        tendertype:{
            assumepaysinfull:false,
            closescheck:false,
            createdby:'',
            createddate:'',
            dinersclub:false,
            id:'1627aea5-8e0a-4371-9022-9b504344e724',
            isaccount:false,
            isamex:false,
            isbuiltin:false,
            ischeck:false,
            iscomp:false,
            iscreditother:false,
            isdeleted:false,
            isdiscover:false,
            isdomesticcurrency:false,
            isgift:false,
            isjcb:false,
            ismastercard:false,
            isother:false,
            isroom:false,
            isvisa:false,
            isvoid:false,
            modifiedby:'',
            modifieddate:'',
            name:'',
            openscashdrawer:false,
            printsreceipt:false,
            promptforcrossreference:false,
            receiptcount:0,
            store_id:'1627aea5-8e0a-4371-9022-9b504344e724'
        }
    });
}
handleChange(event){
    let field = event.target.name;
    var EditModal = this.state.showEditModal;
    var tendertype ={};
    if(event.target.type =='checkbox'){
        if(EditModal)
        {
            tendertype = this.state.singletendertype;
            tendertype[field]=event.target.checked;
            return this.setState({
                singletendertype : tendertype
            })
        }
        else
        {
            tendertype = this.state.tendertype;
            tendertype[field]=event.target.checked;
/*return this.setState({
tendertype : tendertype
}) */
}
}
}
RemoveTenderType(TenderTypeID){
    var id;
    var DelTenderType = {};
    var that = this;
    id = TenderTypeID;
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var credentials = getUserDetails();
    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;
    var index = -1;
    var _totalTenderTypes = this.state.TenderTypes.length;
    for( var i = 0; i < _totalTenderTypes; i++ ) {
        if(this.state.TenderTypes[i].id == TenderTypeID){
            index = i;
            break;
        }
    }
    this.state.TenderTypes.splice( index, 1 );
    this.setState( {TenderTypes: this.state.TenderTypes});
    DelTenderType['tendertypeId'] =  TenderTypeID;
    DelTenderType['userdetails']  =  getUserDetails();
    DelTenderType['isdeleted']    =  true;
    console.log(JSON.stringify(DelTenderType));
    const request = new Request(`${process.env.API_HOST}/ManageTenderTypes.svc/DeleteTenderType/json`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(DelTenderType)
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
        const addtendertype = {};
        addtendertype["tendertype"] = this.state.singletendertype;
        addtendertype["userdetails"] = getUserDetails();
        var oldtendertypesState = this.state.tableConfig.data;
        var _totaltendertypes = that.state.tableConfig.data.length;
        for( var i = 0; i < _totaltendertypes; i++ ) {
            var tendertype = that.state.tableConfig.data;
            var tendertypeId = this.state.singletendertype.id;
            if(tendertype[i].id == tendertypeId){
                tendertype[i] = addtendertype.tendertype;
            }
        }
        console.log(JSON.stringify(addtendertype));
        const request = new Request(`${process.env.API_HOST}/ManageTenderTypes.svc/UpdateTendertype/json`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type':'application/json'
            }),
            body: JSON.stringify(addtendertype)
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
                setTimeout(function() {
                    that.setState({
                        msgFailure:''
                    })
                }, 5000)
            }else{
                that.setState({
                    msgSuccess: data.statusMessage,
                    showEditModal: false,
                    TenderTypes : oldtendertypesState
                })
                setTimeout(function() {
                    that.setState({
                        msgSuccess:''
                    })
                }, 5000)
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
        const addtendertype = {};
        addtendertype["tendertype"] = this.state.tendertype;
        addtendertype["userdetails"] = getUserDetails();
        var oldtendertypesState = this.state.tableConfig.data;
        console.log(JSON.stringify(addtendertype));
        const request = new Request(`${process.env.API_HOST}/ManageTenderTypes.svc/CreateTenderType/json`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type':'application/json'
            }),
            body: JSON.stringify(addtendertype)
        });
        return fetch(request).then(response => {
            if (response.status >= 400) throw new Error("Bad response from server");
            return response.json();
        }).then(function(data) {
            if (data.statusCode !== 200) {
                that.setState({
                    msgFailure: data.statusMessage,
                    showModal: false,
                    TenderTypes : oldtendertypesState
                })
                setTimeout(function() {
                    that.setState({
                        msgFailure:''
                    })
                }, 5000)
            }else{
                var newTenderTypeState = addtendertype.tendertype;
                newTenderTypeState.id = data.TenderTypeID;
                oldtendertypesState.push(newTenderTypeState);
                that.setState({
                    msgSuccess: data.statusMessage,
                    showModal: false,
                    TenderTypes : oldtendertypesState
                })
                setTimeout(function() {
                    that.setState({
                        msgSuccess:''
                    })
                }, 5000)
            }
        }).catch(error => {
            return error;
        });
    }
// }
}
getTenderTypes() {
    var that = this;
    var credentials = {};
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['index'] = 2147483647;
    credentials['recordcount'] = 2147483647;
    credentials["userdetails"] = getUserDetails();
    credentials["userdetails"]['storeuniquekey'] = storeuniquekey;
    const request = new Request(`${process.env.API_HOST}/ManageTenderTypes.svc/GetTenderTypes/json`, {
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
        tableConfig['data'] = data.Tendertypes;
        tableConfig['isLoading'] = false;
        that.setState({
            tableConfig: tableConfig,
            TenderTypes: data.Tendertypes
        });
    });
}
render()
{
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    const {pageHead,TenderTypes,msgFailure,msgSuccess} = this.state;
    return(
    <DefaultLayout>
        <div className="page-head inner__pageHead">
            <div className="domain-icon"> <img src={require( './tender-types.svg')}/> <h2>{pageHead.pagehead}</h2></div>
                <ol className="breadcrumb">
                  <li><Link to={`/domains`}>{currentDomain}</Link></li>
                  <li><Link to={`/stores`}>{currentStore}</Link></li>
                  <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                  <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                  <li className="active">{pageHead.pagehead}</li>
                </ol>
        </div>
        <div className="widget-fulwidth" id="tenderTypes">
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {msgSuccess}  </div>}
        <div className="master-table">
        <div className="row">
        <div className="col-sm-12">
        <div className="">
        <div className="" id="tenderTypes">
        <Tabelify
        style={{margin:'30px'}} {...this.state.tableConfig}
        modalHandler={this.open}
        editHandler={this.EditTenderType}
        deleteHandler={this.RemoveTenderType}
        />
    {/*<TenderTypeList  TenderTypes ={TenderTypes} RemoveTenderType={this.RemoveTenderType}  NewTenderType ={this.open}  />*/}
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <Modal show={this.state.showModal} id="tendertype" onHide={this.close} backdrop={false} keyboard={false}>
    <form>
    <Modal.Header closeButton>
    <Modal.Title>Add Tender Type</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div className={classnames('form-group', { error: !!this.state.errors.name})}>
    <TextInput
    type="text"
    name="name"
    label="Tender Type Name"
    value={this.state.tendertype.name}
    defaultValue={this.state.tendertype.name}
    placeholder=""
    required="*"
    onChange={this.onChange}
    className={classnames('form-control', { error: !!this.state.errors.name})}
    />
    <span>{this.state.errors.name}</span>
    </div>
    <div className="row">
    <div className="col-sm-6 discount-radio-wrap">
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="1"
    checked={this.state.selectedOption === '1'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Other</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="2"
    checked={this.state.selectedOption === '2'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Credit Card</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="3"
    checked={this.state.selectedOption === '3'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Account</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="4"
    checked={this.state.selectedOption === '4'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Room</span></label>
    </div>
    </div>
    </div>
    <div className="col-sm-6 discount-radio-wrap">
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="5"
    checked={this.state.selectedOption === '5'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Comp</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="6"
    checked={this.state.selectedOption === '6'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Domestic Currency</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="7"
    checked={this.state.selectedOption === '7'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Check</span></label>
    </div>
    </div>
    </div>
    </div>
    <div className="row">
    <div className="col-sm-12">
    </div>

    <div className="form-horizontal">

    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="promptforcrossreference"
    id="promptforcrossreference"
    label="Prompt to Enter Cross Reference"
    />





    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="assumepaysinfull"
    id="assumepaysinfull"
    label="Pays Checkin Full"
    />




    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="openscashdrawer"
    id="openscashdrawer"
    label="Opens Cash Drawer"
    />




    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="closescheck"
    id="closescheck"
    label="Closes Check"
    />

    <div className="form-group">
    <div className="col-sm-5 control-label">
    <label className="control-label">Print Receipt</label>
    <div>
    <div className="switch-button switch-button-info">
    <input
    type="checkbox"
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="printsreceipt"
    id="printsreceipt"
    />
    <span><label htmlFor="printsreceipt"></label></span>
    </div>
    </div>
    </div>
    <div className="col-sm-2 xs-pt-5">
    <TextInput
    type="text"
    name="receiptcount"
    label="# Receipts"
    value={this.state.tendertype.receiptcount}
    defaultValue={this.state.tendertype.receiptcount}
    placeholder=""
    onChange={this.onChange}
    className='form-control'
    />
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


    <Modal show={this.state.showEditModal} id="tendertype" onHide={this.close} backdrop={false} keyboard={false}>
    <form>
    <Modal.Header closeButton>
    <Modal.Title>Add Tender Type</Modal.Title>
    </Modal.Header>
    <Modal.Body>

    <div className={classnames('form-group', { error: !!this.state.errors.name})}>
    </div>
    <div className="form-horizontal">
    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="promptforcrossreference"
    id="promptforcrossreference"
    label="Prompt to Enter Cross Reference"
    />
    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="assumepaysinfull"
    id="assumepaysinfull"
    label="Pays Checkin Full"
    />
    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="openscashdrawer"
    id="openscashdrawer"
    label="Opens Cash Drawer"
    />
    <Checkbox
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="closescheck"
    id="closescheck"
    label="Closes Check"
    />
    <div className="form-group">
    <div >
    <label className="control-label">Print Receipt</label>
    <div>
    <div className="switch-button switch-button-info col-sm-2 xs-pt-6">
    <input
    type="checkbox"
    onChange={this.handleChange}
    checked={this.state.handleChange}
    name="printsreceipt"
    id="printsreceipt"
    />
    <span><label htmlFor="printsreceipt"></label></span>
    </div>
    <div className="col-sm-2 xs-pt-5">
    <label htmlFor="receiptcount"># Receipts</label>
    </div>
    <div className="col-sm-2 xs-pt-3">
    <input

    type="text"
    name="receiptcount"
    className="form-control"
    placeholder="0"
    value={this.state.tendertype.receiptcount}
    defaultValue={this.state.tendertype.receiptcount}
    onChange={this.onChange} />
    </div>


    </div>
    </div>
    </div>

    </div>

        {/* <div className="form-group">
          <div className="col-sm-4 receipt-form-box">
            <TextInput
            type="text"
            name="receiptcount"
            label="# Receipts"
            value={this.state.tendertype.receiptcount}
            defaultValue={this.state.tendertype.receiptcount}
            placeholder=""
            onChange={this.onChange}
            className='form-control'
            />
          </div>
        </div>
    </div>*/}
    </Modal.Body>
    <Modal.Footer>
    <Button className="btn-submit"  onClick={this.onSubmit}>Submit</Button>
    <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
    </Modal.Footer>
    </form>
    </Modal>
    <Modal show={this.state.showEditModal} id="tendertype" onHide={this.close} backdrop={false} keyboard={false}>
    <form>
    <Modal.Header closeButton>
    <Modal.Title>Edit Tender Type</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div className={classnames('form-group', { error: !!this.state.errors.name})}>
    <TextInput
    type="text"
    name="name"
    label="Tender Type Name *"
    value={this.state.singletendertype.name}
    defaultValue={this.state.singletendertype.name}
    placeholder=""
    onChange={this.onChange}
    className={classnames('form-control', { error: !!this.state.errors.name})}
    />
    <span>{this.state.errors.name}</span>
    </div>
    <div className="row">
    <div className="col-sm-6 discount-radio-wrap">
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="1"
    checked={this.state.selectedOption === '1'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Other</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="2"
    checked={this.state.selectedOption === '2'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Credit Card</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="3"
    checked={this.state.selectedOption === '3'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Account</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="4"
    checked={this.state.selectedOption === '4'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Room</span></label>
    </div>
    </div>
    </div>
    <div className="col-sm-6 discount-radio-wrap">
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="5"
    checked={this.state.selectedOption === '5'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Comp</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="6"
    checked={this.state.selectedOption === '6'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Domestic Currency</span></label>
    </div>
    </div>
    <div className="form-group">
    <div className="am-radio inline" onClick={this.handleRadioCheck}>
    <input
    type="radio"
    value="7"
    checked={this.state.selectedOption === '7'}
    name="tendertype"
    onChange={this.onChange}
    />
    <label htmlFor="tendertype"><span>Is Check</span></label>
    </div>
    </div>
    </div>
    </div>
    <div className="row">
    <div className="col-sm-12">
    </div>
    </div>
    <div className="form-horizontal">

    <Checkbox
    onChange={this.handleChange}
    checked={this.state.singletendertype.promptforcrossreference}
    name="promptforcrossreference"
    id="promptforcrossreference"
    label="Prompt to Enter Cross Reference"
    />


    <Checkbox
    onChange={this.handleChange}
    checked={this.state.singletendertype.assumepaysinfull}
    name="assumepaysinfull"
    id="assumepaysinfull"
    label="Pays Checkin Full"
    />


    <Checkbox
    onChange={this.handleChange}
    checked={this.state.singletendertype.openscashdrawer}
    name="openscashdrawer"
    id="openscashdrawer"
    label="Opens Cash Drawer"
    />


    <Checkbox
    onChange={this.handleChange}
    checked={this.state.singletendertype.closescheck}
    name="closescheck"
    id="closescheck"
    label="Closes Check"
    />
    <div className="form-group">
    <div >
    <label className="control-label">Print Receipt</label>
    <div>
    <div className="switch-button switch-button-info col-sm-2 xs-pt-6">
    <input
    type="checkbox"
    onChange={this.handleChange}
    checked={this.state.singletendertype.printsreceipt}
    name="printsreceipt"
    id="printsreceipt"
    />
    <span><label htmlFor="printsreceipt"></label></span>
    </div>
    <div className="col-sm-2 xs-pt-5">
    <label htmlFor="receiptcount"># Receipts</label>
    </div>
    <div className="col-sm-2 xs-pt-3">
    <input
    type="text"
    name="receiptcount"
    className="form-control"
    placeholder="0"
    value={this.state.singletendertype.receiptcount}
    defaultValue={this.state.singletendertype.receiptcount}
    onChange={this.onChange} />
    </div>
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
     </DefaultLayout>

    )
}
}

export default TenderType;