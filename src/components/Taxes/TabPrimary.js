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
  "taxgroup":{
    "createdby":"",
    "createddate":"",
    "id":"1627aea5-8e0a-4371-9022-9b504344e724",
    "isdeleted":false,
    "modifiedby":"",
    "modifieddate":"",
    "name":"",
    "store_id":"1627aea5-8e0a-4371-9022-9b504344e724",
    "taxcount":2147483647,
    "taxes":[]
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
    btnText : 'Add Tax Group'
   },
    showModal: false,
    msgFailure:"",
    msgSuccess:"",
    showEditModal:false,
    TaxId:[],
    TaxGroups:[],
    Taxes:[],
    errors:{},
    singletaxgroup:{}
}

 this.close = this.close.bind(this);
 this.open  = this.open.bind(this);
 this.onChange = this.onChange.bind(this);
 this.handleChange = this.handleChange.bind(this);
 this.onSubmit = this.onSubmit.bind(this);
 this.EditTaxGroup = this.EditTaxGroup.bind(this);
 this.RemoveTaxGroup = this.RemoveTaxGroup.bind(this);
 this.onUpdate = this.onUpdate.bind(this);

}

componentDidMount() {
  this.getAllTaxes();
  this.getTaxGroups();

}

open(event)
  {
     this.setState({
      showModal: true,
      TaxId:[]
   });
}

close(event)
    {
      var EditModal = this.state.showEditModal;
      if(EditModal)
    {
      this.setState({
      showEditModal: false,
      TaxId:[]
      });
    }
    else
    {
      this.setState({
      showModal: false,
      TaxId:[]

      });
    }
 }

onChange(event) {

    this.setState({isEditable: true});
    const field = event.target.name;
    var EditModal = this.state.showEditModal;
    var taxgroup ={};

    if(EditModal)
      taxgroup = this.state.singletaxgroup;
    else
      taxgroup = this.state.taxgroup;

      taxgroup[field] = event.target.value;
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
    var arrayTaxIds = [];
    arrayTaxIds=this.state.TaxId;
    console.log(event.target.checked);
    var found = jQuery.inArray(field, arrayTaxIds);
    if (found >= 0) {
        // Element was found, remove it.
        if(event.target.checked == false)
          arrayTaxIds.splice(found, 1);
    } else {
        // Element was not found, add it.
        if(event.target.checked == true)
          arrayTaxIds.push(field);
    }
    this.setState({
    TaxId : arrayTaxIds
    })
    console.log(arrayTaxIds);
  }
}

validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
}


handleValidation(){
  let errors = {};

  var taxgroup = {};

  var EditModal = this.state.showEditModal;
  if(EditModal)
  {
    taxgroup = this.state.singletaxgroup;
  }
  else
  {
    taxgroup = this.state.taxgroup;
  }

  console.log(taxgroup);

if (taxgroup.name.trim() === '') {
    errors.name = "Tax Group name can't be empty"
  }

    this.setState({ errors }); //Set Errors state
    return Object.keys(errors).length == 0;
}



RemoveTaxGroup(id)
  {
    var Deltax = {};
    var that = this;
/*    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var credentials = getUserDetails();
    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;
*/

    var index = -1;
    var _totalTaxGroups = this.state.TaxGroups.length;
    for( var i = 0; i < _totalTaxGroups; i++ ) {
    if(this.state.TaxGroups[i].id == id){
    index = i;
    break;
    }
  }
    this.state.TaxGroups.splice( index, 1 );
    this.setState( {TaxGroups: this.state.TaxGroups});
    Deltax['taxgroupID'] =  id;
    Deltax['userdetails']  =  getUserDetails();
    Deltax['isdeleted']    =  true;

    console.log(JSON.stringify(Deltax));

    const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/DeleteTaxGroup/json`, {
    method: 'POST',
    headers: new Headers({
    'Content-Type': 'application/json'
  }),
    body: JSON.stringify(Deltax)
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
  window.location.reload();
}, 2000)

  }
  }).catch(function(error) {
  return error;
  })
 }


EditTaxGroup(id)
   {
     this.getAllTaxes();
     this.setState({showEditModal:true});
     this.getSingleTaxGroup(id);

   }


getSingleTaxGroup(Id) {
      var that = this;
      var reqQuery = {};

      reqQuery['userdetails'] = getUserDetails();
      reqQuery['TaxgroupID'] = Id;
      reqQuery['isrequredtaxes'] = true;

      console.log(JSON.stringify(reqQuery))

      const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/GetSingleTaxGroup/json`, {
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

        let selectedtax = [];
        console.log(data.taxGroup.taxes)
        for (var j = 0; j < data.taxGroup.taxes.length; j++) {
          selectedtax.push(data.taxGroup.taxes[j].id);
        }
        console.log(selectedtax);
       return  that.setState({
           singletaxgroup: data.taxGroup,
           TaxId: selectedtax
      });
    });
  }

  getTaxGroups() {
      var that = this;
      var credentials = {};
      var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
      credentials['index'] = 2147483647;
      credentials['recordcount'] = 2147483647;
      credentials['isall'] = true;
      credentials["userdetails"] = getUserDetails();
      credentials["userdetails"]['storeuniquekey'] = storeuniquekey;

      console.log(JSON.stringify(credentials))

      const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/GetTaxGroups/json`, {
      method: 'POST',
      headers: new Headers({
      'Content-Type': 'application/json'
      }),
      body: JSON.stringify(credentials)
      });
      fetch(request)
      .then(function(response) {
        console.log(response)
      return response.json();
      }).then(function(data) {

        console.log(data)
       if(data.taxGroupList == null || data.taxGroupList=="")
       {data.taxGroupList =[];}

      var tableConfig = that.state.tableConfig;
      tableConfig['data'] = data.taxGroupList;
      that.setState({
      tableConfig: tableConfig,
      TaxGroups: data.taxGroupList
    });
  });
}



getAllTaxes(){
    var that = this;
    var reqQuery = {};
    var credentials = getUserDetails();
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['storeuniquekey'] = storeuniquekey;
    reqQuery['userdetails'] = credentials;

    const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/GetTaxConfigurations/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(reqQuery)
    });
    fetch(request)
      .then(function(response) {
        //console.log(response)
        if(response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        //console.log(data);
        that.setState({
          Taxes: data.taxconfigurationList
        });
     });
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
    const editTax = {};
    var updateTax = this.state.singletaxgroup;
    console.log(updateTax)

/* adding menus */
    var Taxlen = this.state.TaxId.length;
            var TaxList = [];
            for (var i = 0; i < Taxlen; i++) {
              TaxList.push({
                "id": this.state.TaxId[i]
              });
            }
            updateTax.taxes = TaxList;
            console.log(TaxList)


/* end of adding menu */

  editTax["taxgroup"] = updateTax;
  editTax["userdetails"] = credentials;

    var oldmenusState = this.state.tableConfig.data;
    var _totalmenus = that.state.tableConfig.data.length;
    for( var i = 0; i < _totalmenus; i++ ) {
    var taxgroup = that.state.TaxGroups;
    var taxgroupid = updateTax.id;
    if(taxgroup[i].id == taxgroupid){
       taxgroup[i] = updateTax;
    }
  }

  console.log(JSON.stringify(editTax));

  const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/UpdateTaxGroup/json`, {
    method: 'POST',
    headers: new Headers({
    'Content-Type':'application/json'
    }),
    body: JSON.stringify(editTax)
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
    TaxGroups : oldmenusState,
    TaxId :[]
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
  }
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
    const addTax = {};
    var updateTax = this.state.taxgroup;
    console.log(updateTax)

    /* adding menus */

    var Taxlen = this.state.TaxId.length;
            var TaxList = [];
            for (var i = 0; i < Taxlen; i++) {
              TaxList.push({
                "id": this.state.TaxId[i]
              });
            }
            updateTax.taxes = TaxList;
            console.log(TaxList)

    /* end of adding menu */

    addTax["taxgroup"] = updateTax;
    addTax["userdetails"] = credentials;
    var oldTaxState = this.state.tableConfig.data;
    console.log(oldTaxState)


  console.log(JSON.stringify(addTax));
  const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/CreateTaxGroup/json`, {
  method: 'POST',
  headers: new Headers({
  'Content-Type':'application/json'
  }),
    body: JSON.stringify(addTax)
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
    updateTax.id = data.taxgroupid;
    oldTaxState.push(updateTax);
    var tableConfig = that.state.tableConfig;
    tableConfig['data'] = oldTaxState;
    that.setState({
    msgSuccess: data.statusMessage,
    showModal: false,
    TaxGroups : oldTaxState,
    tableConfig:tableConfig
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
  }
}


  render(){
    //console.log(this.state)
    const {msgFailure,msgSuccess,TaxId,Taxes,singletaxgroup} = this.state;

    var that = this;
    var taxconfigurationList = Taxes.map(function(o){
    var found = jQuery.inArray(o.id, TaxId);
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
      <div className="tab-pane" id="taxgroup">

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
            editHandler={this.EditTaxGroup}
            deleteHandler={this.RemoveTaxGroup}
            />
          </div>
        </div>

     <Modal show={this.state.showModal}  onHide={this.close} backdrop={false} keyboard={false}>
      <form>
        <Modal.Header closeButton>
        <Modal.Title>Add Tax Group</Modal.Title>
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
                label="Tax Group"
                value={this.state.taxgroup.name}
                //defaultValue={this.state.taxgroup.name}
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
                      <div className="product-box-head">Select Available Taxes </div>
                      <div className="product-box-wrap">
                        <div className="am-scroller nano">
                          <div className="content nano-content">
                            <div className="product-box-list">
                              <ul>

                                {taxconfigurationList.map((taxconfigurationList) =>
                                  taxconfigurationList.label
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
        <Modal.Title>Edit Tax Group</Modal.Title>
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
                label="Tax Group"
                value={this.state.singletaxgroup.name}
                defaultValue={this.state.singletaxgroup.name}
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
                      <div className="product-box-head">Select Available Taxes</div>
                      <div className="product-box-wrap">
                        <div className="am-scroller nano">
                          <div className="content nano-content">
                            <div className="product-box-list">
                              <ul>

                                {taxconfigurationList.map((taxconfigurationList) =>
                                  taxconfigurationList.label
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