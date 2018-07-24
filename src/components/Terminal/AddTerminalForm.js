import React from 'react';
import TextInput from '../common/TextInput';
import Checkbox from '../common/Checkbox';
import Checkbox1 from '../common/Checkbox1';
import Select from 'react-select';
import ImageUpload1 from './ReactImageUpload';
import ImageUpload2 from './ReactImageUpload_1';
import ImageUpload3 from './ReactImageUpload_2';
import './ReactImageUpload.css';
import classnames from 'classnames';
import axios from 'axios';
import {browserHistory, Link} from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import getUserDetails from '../common/CredentialDomain';

let currentDomain = window.sessionStorage.getItem("currentdomainname");
let currentStore = window.sessionStorage.getItem("currentstorename");
class AddTerminalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    "terminalinformation":{
          "ProcessorConfigurations_id":"1627aea5-8e0a-4371-9022-9b504344e724",
          "electronicpaymentname":"",
          "createautoseats":false,
          "createdby":"",
          "createddate":"",
          "customerdisplaycomport":"",
          "customerdisplaylineone":"",
          "customerdisplaylinetwo":"",
          "customlogoimagepath":null,
          "customprintimagepath":null,
          "customscreenimagepath":null,
          "enablecardlogin":false,
          "enablecustomerdisplay":false,
          "firstcashdrawernumber":"0",
          "forcecashdrop":false,
          "forcecashdropamount":0,
          "forceorderprodgroupid":"1627aea5-8e0a-4371-9022-9b504344e724",
          "forceorderprodid":"1627aea5-8e0a-4371-9022-9b504344e724",
          "haspaymentgateway":false,
          "id":"1627aea5-8e0a-4371-9022-9b504344e724",
          "isdeleted":false,
          "isquickservicemode":false,
          "localprinterid":"",
          "localprintername":"",
          "menugroupid":"",
          "menugroupname":"",
          "modifiedby":"",
          "modifieddate":"",
          "name":"NOT SET",
          "numbercashreceipts":"0",
          "numbercreditreceipts":"0",
          "numbergiftreceipts":0,
          "numberofcashdrawers":"0",
          "opendraweronpay":false,
          "printcashreceiptonpay":false,
          "printcreditreceiptonpay":false,
          "printgiftreceiptonpay":false,
          "printitemizedreceiptonpay":true,
          "profitcenterid":"",
          "profitcentername":"",
          "rebootonhouseclose":false,
          "scalecomport":"",
          "screensavertimeoutseconds":"0",
          "showmousecursor":false,
          "showterminallockedoncfd":false,
          "store_id":"1627aea5-8e0a-4371-9022-9b504344e724",
          "systemcomflags":0,
          "timestamp":"",
          "useorderlabel":false,
          "useproductgroupprintermapping":false,
          "printerexclusions":[],
          },

          ProfitCenterList:[],
          menusList:[],
          processorconfigrationlist:[],
          LocalPrinterList:[],
          SelectedProductGroupId:[],


          selectProfitCenterList:{
                  label:"",
                  value:""
        },
          selectmenusList:{
                    label:"",
                    value:""
          },
          selectprocessorconfigrationlist:{
                    label:"",
                    value:null
          },
          selectLocalPrinterList:{
                    label:"",
                    value:null
          },
          scaleport_value: {
                      label: '',
                      value: null
          },
          displayport_value: {
              label: '',
              value: null
          },

           msgSuccess: "",
           msgFailure: "",
           errors:{},
           productGroupsId:[],
           ProductGroups:[],
           customlogoimagepath:null,
           customprintimagepath :null,
           customscreenimagepath :null

        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this. onReset.bind(this);
        this.getPreview1 = this.getPreview1.bind(this);
        this.getPreview2 = this.getPreview2.bind(this);
        this.getPreview3 = this.getPreview3.bind(this);
        this.handlechange = this.handlechange.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.updateScaleComPort = this.updateScaleComPort.bind(this);
        this.handleSelectItems = this.handleSelectItems.bind(this);
        this.convertDataURIToBinary = this.convertDataURIToBinary.bind(this);
        this.updateDisplayComPort = this.updateDisplayComPort.bind(this);
  }

componentDidMount(){
  var that = this;
  this.getProfitCenters();
  this.getMenuGroups();
  this.getAllProductGroups();
  this.getAllProcessorconfiguration();
  this.getAllLocalPrinters();

  setTimeout(function(){
    that.getSingles();
  }, 2000)
}


   updateScaleComPort(element) {
      this.setState({
          scaleport_value: element
      });
  }


  updateDisplayComPort(element) {
      this.setState({
          displayport_value: element
      });
  }


  validateNumber(value) {
    var onlynumber = /^\d*$/;
    return onlynumber.test(value);
  }

  handleValidation() {
      let errors = {};
       console.log(this.state)
      //Form validation error message
      if (this.state.selectmenusList.value === "") {
          errors.selectmenusList = "Select the Menu List"
      }
      if (this.state.selectProfitCenterList.value === "") {
          errors.selectProfitCenterList = "Select the ProfitCenter List"

      }

      if (!this.validateNumber(this.state.terminalinformation.numbercashreceipts)) {
          document.getElementById("numbercashreceipts").focus();
          errors.numbercashreceipts = "Invalid Cash Receipt count"
      }

      if (this.state.terminalinformation.numberofcashdrawers === '0') {
        document.getElementById("numberofcashdrawers").focus();
        errors.numberofcashdrawers = "Cash Drawers can't be empty"
      }else if (!this.validateNumber(this.state.terminalinformation.numberofcashdrawers)) {
          document.getElementById("numberofcashdrawers").focus();
          errors.numberofcashdrawers = "Invalid Entry"
      }

      if (this.state.terminalinformation.firstcashdrawernumber === '0') {
        document.getElementById("firstcashdrawernumber").focus();
        errors.firstcashdrawernumber = "Cash Drawer Pin can't be empty"
      }else if (!this.validateNumber(this.state.terminalinformation.firstcashdrawernumber)) {
          document.getElementById("firstcashdrawernumber").focus();
          errors.firstcashdrawernumber = "Invalid PIN"
      }

      this.setState({
          errors
      }); //Set Errors state

      return Object.keys(errors).length == 0;
  }


  onChange(e){
   // console.log(e.target.value)
    const field = e.target.name;
    let terminalinformation = this.state.terminalinformation;
    terminalinformation[field] = e.target.value;
    this.setState({
        terminalinformation: terminalinformation
      })
  }

convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Array(new ArrayBuffer(rawLength));

    for(var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
}


  getPreview1(file){
      var terminalinformation = this.state.terminalinformation;
      terminalinformation['customscreenimagepath'] = this.convertDataURIToBinary(file);
     // console.log(terminalinformation['customscreenimagepath']);
      this.setState({
        terminalinformation: terminalinformation
    })
  }

  getPreview2(file){
      var terminalinformation = this.state.terminalinformation;
      terminalinformation['customlogoimagepath'] = this.convertDataURIToBinary(file);
      this.setState({
        terminalinformation: terminalinformation
    })
  }

  getPreview3(file){
      var terminalinformation = this.state.terminalinformation;
      terminalinformation['customprintimagepath'] = this.convertDataURIToBinary(file);
      this.setState({
        terminalinformation: terminalinformation
    })
  }




getSingles(){
  //Get Single local Printer
    var localprinterid = this.state.terminalinformation.localprinterid;
    var LocalPrinterList = this.state.LocalPrinterList;

    var obj = LocalPrinterList.filter(function ( obj ) {
        return obj.id === localprinterid;
    })[0];

    //console.log(obj);

    if(obj !== undefined){
      this.setState({
        selectLocalPrinterList: {
        label:obj.name,
        value:obj.id
        }
      })
    }


    //get single profit center
    var profitcenterid = this.state.terminalinformation.profitcenterid;
    var ProfitCenterList = this.state.ProfitCenterList;

    var obj2 = ProfitCenterList.filter(function ( obj2 ) {
        return obj2.id === profitcenterid;
    })[0];

    //console.log(obj2)

    if(obj2 !== undefined){
      this.setState({
        selectProfitCenterList: {
        label:obj2.name,
        value:obj2.id
        }
      })
    }

   //Get Single Menu Group
    var menugroupid = this.state.terminalinformation.menugroupid;
    var menusList = this.state.menusList;

    var obj3 = menusList.filter(function ( obj3 ) {
        return obj3.id === menugroupid;
    })[0];

   // console.log(obj3)

    if(obj3 !== undefined){
      this.setState({
        selectmenusList: {
        label:obj3.name,
        value:obj3.id
        }
      })
    }


    //Get Single Electronic config
    var ProcessorConfigurations_id = this.state.terminalinformation.ProcessorConfigurations_id;
    var processorconfigrationlist = this.state.processorconfigrationlist;

    var obj4 = processorconfigrationlist.filter(function ( obj4 ) {
        return obj4.id === ProcessorConfigurations_id;
    })[0];
    //console.log(obj4)
    if(obj4 !== undefined){
      this.setState({
        selectprocessorconfigrationlist: {
        label:obj4.name,
        value:obj4.id
        }
      })
    }

}


//get all profit centers
getProfitCenters() {
  //console.log('called')
    var that = this;
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();

    axios.post(`${process.env.API_HOST}/ManageProfitCenters.svc/GetProfitCenters/json`,reqQuery)
     .then(function (response) {
     // console.log(response)

        that.setState({
          ProfitCenterList: response.data.ProfitCenterList
        });
     })
    .catch(function (error) {
       //console.log(error);
    });
}


//get all Menu groups
getMenuGroups() {
    var that = this;
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();

    axios.post(`${process.env.API_HOST}/ManageMenus.svc/GetMenuGroups/json`,reqQuery)
     .then(function (response) {
      //console.log(response)
        that.setState({
          menusList: response.data.menusList
        });
     })
    .catch(function (error) {
      // console.log(error);
    });
}


getAllProcessorconfiguration(){
    var that = this;
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();

    axios.post(`${process.env.API_HOST}/ManageProcessorConfigurations.svc/GetAllProcessorconfiguration/json`,reqQuery)
     .then(function (response) {
      //console.log(response)
        that.setState({
          processorconfigrationlist: response.data.processorconfigrationlist
        });
     })
    .catch(function (error) {
       //console.log(error);
    });
}


getAllLocalPrinters(){
    var that = this;
    var reqQuery = {};
    reqQuery['isrequirednetworkprinters'] = false;
    reqQuery['isall'] = true;
    reqQuery['userdetails'] = getUserDetails();

    axios.post(`${process.env.API_HOST}/ManagePrinters.svc/GetPrinters/json`,reqQuery)
     .then(function (response) {
      console.log(response)
        that.setState({
          LocalPrinterList: response.data.printers
        });
     })
    .catch(function (error) {
       //console.log(error);
    });
}


//get all product groups
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


//product group list checkbox
handleChange1(event){

    let field = event.target.name;
    if(event.target.type =='checkbox'){
    var arrayProductgroupIds = [];
     arrayProductgroupIds=this.state.productGroupsId;
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
  //console.log(arrayProductgroupIds);
  }
}


  // Checkboxes Change Handle
handlechange(event){

        if(event.target.name == 'printcashreceiptonpay'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['printcashreceiptonpay'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'printcreditreceiptonpay'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['printcreditreceiptonpay'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'printitemizedreceiptonpay'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['printitemizedreceiptonpay'] = event.target.checked;
            console.log(event.target.checked)
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'opendraweronpay'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['opendraweronpay'] = event.target.checked;
            //console.log(event.target.checked)
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'createautoseats'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['createautoseats'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'enablecustomerdisplay'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['enablecustomerdisplay'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'showmousecursor'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['showmousecursor'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'enablecardlogin'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['enablecardlogin'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'showterminallockedoncfd'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['showterminallockedoncfd'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'isquickservicemode'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['isquickservicemode'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'haspaymentgateway'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['haspaymentgateway'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'useorderlabel'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['useorderlabel'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
        if(event.target.name == 'rebootonhouseclose'){
            var terminalinformation = this.state.terminalinformation;
            terminalinformation['rebootonhouseclose'] = event.target.checked;
            this.setState({
              terminalinformation: terminalinformation
          })
        }
  }



//Handle select boxes
handleSelectItems(name, value){
    //console.log(name)
    //console.log(value)

      if(name == 'profitcenters')
        this.setState({
              selectProfitCenterList:value
          })

      if(name == 'menusList')
        this.setState({
              selectmenusList:value
          })

      if(name == 'processorconfigrationlist')
          this.setState({
              selectprocessorconfigrationlist:value
          })

      if(name == 'LocalPrinterList')
        this.setState({
            selectLocalPrinterList:value
        })

}

onReset(event) {
      browserHistory.push('/terminal')
  }



onSubmit(e){
    e.preventDefault();
    let that = this;
    var isvalid = this.handleValidation();
    if(isvalid)
    {
    let getTerminalState = this.state.terminalinformation;
    let reqQuery = {};
     //console.log(this.state.terminalinformation)

      if(getTerminalState['customlogoimagepath'] ==null || getTerminalState['customlogoimagepath'] =='')
      {

        getTerminalState['customlogoimagepath'] =null ;
      }
      else
      {
        if(typeof(getTerminalState['customlogoimagepath']) == 'string')
      {

          getTerminalState['customlogoimagepath'] = this.convertDataURIToBinary(getTerminalState['customlogoimagepath']);

      }
      }

      if(getTerminalState['customprintimagepath'] ==null || getTerminalState['customprintimagepath'] =='')
      {
       //console.log(getTerminalState['customprintimagepath']);

        getTerminalState['customprintimagepath'] =null ;
      }
      else
      {
        if(typeof(getTerminalState['customprintimagepath']) == 'string')
      {
          getTerminalState['customprintimagepath'] = this.convertDataURIToBinary(getTerminalState['customprintimagepath']);
      }
      }

      if(getTerminalState['customscreenimagepath'] ==null || getTerminalState['customscreenimagepath'] =='')
      {
        // console.log(getTerminalState['customlogoimagepath']);
         getTerminalState['customscreenimagepath'] =null ;
      }
      else
      {
        if(typeof(getTerminalState['customscreenimagepath']) == 'string')
      {
          getTerminalState['customscreenimagepath'] = this.convertDataURIToBinary(getTerminalState['customscreenimagepath']);
      }
      }



      getTerminalState['profitcenterid'] = this.state.selectProfitCenterList.value;
      getTerminalState['menugroupid'] = this.state.selectmenusList.value;
      getTerminalState['ProcessorConfigurations_id'] = this.state.selectprocessorconfigrationlist.value;
      getTerminalState['localprinterid'] = this.state.selectLocalPrinterList.value;
      getTerminalState['scalecomport'] = this.state.scaleport_value.value;
      getTerminalState['customerdisplaycomport'] = this.state.displayport_value.value;

       // console.log(this.state.selectmenusList.value)
        //console.log(this.state.selectprocessorconfigrationlist.value)
     // console.log(getTerminalState)

       var terminalinformation = this.state.terminalinformation;
        var prdgrplen = this.state.productGroupsId.length;
        var prodtgroups = [];
        for(var i=0;i< prdgrplen;i++)
        {
          prodtgroups.push({"id":this.state.productGroupsId[i]});
        }

       // console.log(prodtgroups);
        getTerminalState['printerexclusions'] = prodtgroups;

      reqQuery['terminalinformation'] = getTerminalState;
      reqQuery['userdetails'] = getUserDetails();

      console.log(JSON.stringify(reqQuery))

      //return false

    axios.post(`${process.env.API_HOST}/ManageTerminals.svc/CreateTerminal/json`, reqQuery)
     .then(function (response) {

     //  console.log(response)
      //Check terminal Status
      if (response.status >= 400) {
        that.setState({
          "msgFailure":response.data.statusMessage
        })
      }else{
        that.setState({
          "msgSuccess":response.data.statusMessage
        });
        setTimeout(function(){
          browserHistory.push('/terminal');
        }, 2000)
      }
     })
    .catch(function (error) {
      // console.log(error);
    });
  }
 }


  render(){

     var that = this;
    //console.log(this.state.singleterminal)
    const {
      msgSuccess,
      msgFailure,
      ProfitCenterList,
      menusList,
      productGroupsId,
      ProductGroups,
      processorconfigrationlist,
      LocalPrinterList,
      terminalinformation,
       } = this.state;

    //console.log(this.state)

   var prdtGroup = ProductGroups.map(function(o){
     var found = jQuery.inArray(o.id, productGroupsId);
       return{
             label:
                <li>
                <Checkbox1
                  onChange={that.handleChange1}
                  checked={found >=0?true:false ===true}
                   name={o.id}
                   id={o.id}
                  label={o.name}
                   />
                  </li>
         }

})


//profit center
    var ProfitCenters = ProfitCenterList.map(function(o){
      return{
        label:o.name,
        value:o.id
      }
})
//Menu Groups
    var MenuGroups = menusList.map(function(o){
      return{
        label:o.name,
        value:o.id
      }
})

//Electronic config
    var ElectronicConfig = processorconfigrationlist.map(function(o){
      return{
        label:o.name,
        value:o.id
      }
})

//Local printers
    var LocalPrinters = LocalPrinterList.map(function(o){
      return{
        label:o.name,
        value:o.id
      }
})




   var scaleportOptions=[{label:"COM 1",value:"c1"},{label:"COM 2",value:"c2"},{label:"COM 3",value:"c3"},{label:"COM 4",value:"c4"},{label:"COM 5",value:"c5"},{label:"COM 6",value:"c6"},{label:"COM 7",value:"c7"},{label:"COM 8",value:"c8"},{label:"COM 9",value:"c9"},{label:"COM 10",value:"c10"},{label:"COM 11",value:"c12"},{label:"COM 13",value:"c13"},{label:"COM 14",value:"c14"},{label:"COM 15",value:"c15"},{label:"COM 16",value:"c16"},{label:"COM 17",value:"c17"},{label:"COM 18",value:"c18"},{label:"COM 19",value:"c19"},{label:"COM 20",value:"c20"}];
   var displayportOptions=[{label:"COM 1",value:"c1"},{label:"COM 2",value:"c2"},{label:"COM 3",value:"c3"},{label:"COM 4",value:"c4"},{label:"COM 5",value:"c5"},{label:"COM 6",value:"c6"},{label:"COM 7",value:"c7"},{label:"COM 8",value:"c8"},{label:"COM 9",value:"c9"},{label:"COM 10",value:"c10"},{label:"COM 11",value:"c12"},{label:"COM 13",value:"c13"},{label:"COM 14",value:"c14"},{label:"COM 15",value:"c15"},{label:"COM 16",value:"c16"},{label:"COM 17",value:"c17"},{label:"COM 18",value:"c18"},{label:"COM 19",value:"c19"},{label:"COM 20",value:"c20"}];


    return(
      <form>
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
          <div className="widget widget-small">
              <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
              type="text"
              name="name"
              label="Terminal Name"
              required="*"
              value="NOT SET"
              placeholder=""
              className={classnames('form-control', { error: !!this.state.errors.name})}

              />
              <span>{this.state.errors.name}</span>
          </div>
          <div className="row">
              <div className="col-sm-6">
                  <div className={classnames('form-group', { error: !!this.state.errors.selectProfitCenterList})}>
                      <label>Profit Center</label>
                      <Select
                          name="profitcenters"
                          value={this.state.selectProfitCenterList.value}
                          options={ProfitCenters}
                          onChange={this.handleSelectItems.bind(this,'profitcenters')}
                          />
                          <span>{this.state.errors.selectProfitCenterList}</span>
                  </div>
              </div>
              <div className="col-sm-6">
                 <div className={classnames('form-group', { error: !!this.state.errors.selectmenusList})}>
                      <label>Menu Group</label>
                      <Select
                          name="menugroups"
                          value={this.state.selectmenusList.value}
                          options={MenuGroups}
                          onChange={this.handleSelectItems.bind(this,'menusList')}
                          />
                      <span>{this.state.errors.selectmenusList}</span>
                  </div>
              </div>
          </div>
          <div className="row">
              <div className="col-sm-6">
                   <div className={classnames('form-group', { error: !!this.state.errors.selectprocessorconfigrationlist})}>
                      <label>Electronic Processing Config</label>
                      <Select
                          name="processingconfigration"
                          value={this.state.selectprocessorconfigrationlist.value}
                          options={ElectronicConfig}
                          onChange={this.handleSelectItems.bind(this,'processorconfigrationlist')}
                          />
                           <span>{this.state.errors.selectprocessorconfigrationlist}</span>
                  </div>
              </div>
              <div className="col-sm-6">
                  <div className="form-group">
                      <label>Local Printer</label>
                      <Select
                          name="localprinters"
                          value={this.state.selectLocalPrinterList.value}
                          options={LocalPrinters}
                          onChange={this.handleSelectItems.bind(this,'LocalPrinterList')}
                          />
                  </div>
              </div>
          </div>
          <div className="row">
              <div className="col-sm-6">
                  <div className="form-group">
                      <label> Scale COM Port</label>
                      <Select
                          name="country"
                          required="*"
                          value={this.state.scaleport_value.value}
                          options={scaleportOptions}
                          onChange={this.updateScaleComPort}
                          />
                  </div>
              </div>
              <div className="col-sm-6">
                  <div className="form-group">
                      <label> Display COM Port</label>
                      <Select
                          name="country"
                          required="*"
                          value={this.state.displayport_value.value}
                          options={displayportOptions}
                          onChange={this.updateDisplayComPort}
                          />
                  </div>
              </div>
          </div>
          <div className="form-group">
              <TextInput
                  type="text"
                  name="customerdisplaylineone"
                  label="Customer Display Default Message Line 1"
                  value={terminalinformation.customerdisplaylineone}
                  placeholder=" "
                  className="form-control"
                  onChange={this.onChange}
                  />
          </div>
          <div className="form-group">
              <TextInput
                  type="text"
                  name="customerdisplaylinetwo"
                  label="Customer Display Default Message Line 2"
                  value={terminalinformation.customerdisplaylinetwo}
                  placeholder=" "
                  className="form-control"
                  onChange={this.onChange}
                  />
          </div>
          </div>
         <div className="widget widget-small">
              <div className="row">
                  <div className="col-sm-12">
                      <div className="product-widget-head">Product Print Skip List</div>
                      <p>Please select from the list of available product groups to prevent them from Printing in Desktop name</p>
                  </div>
              </div>
              <div className="row">
                  <div className="col-sm-12">
                      <div className="product-box">
                          <div className="product-box-head">Select Available Product Groups</div>
                          <div className="product-box-wrap">
                              <div className="am-scroller nano">
                                  <div className="content nano-content">
                                      <div className="product-box-list">
                                          <ul>
                                              {
                                              prdtGroup.map((prdtGroup) => prdtGroup.label)
                                              }
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <ImageUpload1 getPreview1={this.getPreview1}  getImage={this.state.terminalinformation.customscreenimagepath} title = "Brand Image (125 * 125)"/>
          <ImageUpload2 getPreview2={this.getPreview2}  getImage={this.state.terminalinformation.customlogoimagepath}   title = "Logo Banner Image" />
          <ImageUpload3 getPreview3={this.getPreview3}  getImage={this.state.terminalinformation.customprintimagepath}  title = "Receipt Print Image"/>

          <div className="widget widget-small">
              <div className="row">
                  <div className="col-sm-6">
                      <div className="form-group">
                          <TextInput
                              type="text"
                              name="numbercashreceipts"
                              label="Cash Receipt Count"
                              value={this.state.numbercashreceipts}
                              placeholder=" "
                              className="form-control"
                              onChange={this.onChange}
                              />
                      </div>
                  </div>
                  <div className="col-sm-6">
                      <div className="form-group">
                          <TextInput
                              type="text"
                              name="numbercreditreceipts"
                              label="Credit Receipt Count"
                              value={this.state.numbercreditreceipts}
                              placeholder=" "
                              className="form-control"
                              onChange={this.onChange}
                              />
                      </div>
                  </div>
              </div>
              <div className="row">
                  <div className="col-sm-4">
                      <div className="form-group">
                          <TextInput
                              type="text"
                              name="screensavertimeoutseconds"
                              label="Screen Timeout (rec-1000)"
                              value={this.state.screensavertimeoutseconds}
                              placeholder=" "
                              className="form-control"
                              onChange={this.onChange}
                              />
                      </div>
                  </div>
                  <div className="col-sm-4">
                       <div className={classnames('form-group', { error: !!this.state.errors.numberofcashdrawers})}>
                          <TextInput
                              type="text"
                              name="numberofcashdrawers"
                              label="# Cash Drawers"
                              value={this.state.numberofcashdrawers}
                              placeholder=" "
                              className={classnames('form-control', { error: !!this.state.errors.numberofcashdrawers})}
                              onChange={this.onChange}
                              />
                            <span>{this.state.errors.numberofcashdrawers}</span>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className={classnames('form-group', { error: !!this.state.errors.firstcashdrawernumber})}>
                          <TextInput
                              type="text"
                              name="firstcashdrawernumber"
                              label="1st Cash Drawer PIN"
                              value={this.state.firstcashdrawernumber}
                              placeholder=" "
                              className={classnames('form-control', { error: !!this.state.errors.firstcashdrawernumber})}
                              onChange={this.onChange}
                              />
                            <span>{this.state.errors.firstcashdrawernumber}</span>
                      </div>
                  </div>
              </div>
              <div className="row">
                  <div className="col-sm-4">
                  <div className="form-group">
                     <label className="control-label">Auto Cash Receipt</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.printcashreceiptonpay}
                           name="printcashreceiptonpay"
                           id="printcashreceiptonpay" />
                           <span><label htmlFor="printcashreceiptonpay"></label></span>
                        </div>
                     </div>
                  </div>
                  </div>

                  <div className="col-sm-4">
                  <div className="form-group">
                     <label className="control-label">Auto Credit Receipt</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.printcreditreceiptonpay}
                           name="printcreditreceiptonpay"
                           id="printcreditreceiptonpay" />
                           <span><label htmlFor="printcreditreceiptonpay"></label></span>
                        </div>
                     </div>
                  </div>
                  </div>


                  <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Auto Itemized Receipt</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.terminalinformation.printitemizedreceiptonpay}
                           name="printitemizedreceiptonpay"
                           id="printitemizedreceiptonpay" />
                           <span><label htmlFor="printitemizedreceiptonpay"></label></span>
                        </div>
                     </div>
                  </div>
                  </div>

                 <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Auto Open Drawer</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.opendraweronpay}
                           name="opendraweronpay"
                           id="opendraweronpay" />
                           <span><label htmlFor="opendraweronpay"></label></span>
                        </div>
                     </div>
                  </div>
                  </div>

                 <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Require Party Count</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.createautoseats}
                           name="createautoseats"
                           id="createautoseats" />
                           <span><label htmlFor="createautoseats"></label></span>
                        </div>
                     </div>
                  </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Enable Customer Display</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.enablecustomerdisplay}
                           name="enablecustomerdisplay"
                           id="enablecustomerdisplay" />
                           <span><label htmlFor="enablecustomerdisplay"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>

                 <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Show Mouse Cursor</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.showmousecursor}
                           name="showmousecursor"
                           id="showmousecursor" />
                           <span><label htmlFor="showmousecursor"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>

              <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Enable Card Login</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.enablecardlogin}
                           name="enablecardlogin"
                           id="enablecardlogin" />
                           <span><label htmlFor="enablecardlogin"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>

               <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Display CFD Locked</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.showterminallockedoncfd}
                           name="showterminallockedoncfd"
                           id="showterminallockedoncfd" />
                           <span><label htmlFor="showterminallockedoncfd"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>

                <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Show Menu as QSR</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           disabled
                           onChange={this.handlechange}
                           checked={this.state.isquickservicemode}
                           name="isquickservicemode"
                           id="isquickservicemode" />
                           <span><label htmlFor="isquickservicemode"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>

                 <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Enable Credit Pay</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.haspaymentgateway}
                           name="haspaymentgateway"
                           id="haspaymentgateway" />
                           <span><label htmlFor="haspaymentgateway"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>

                <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">User Order Label</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           disabled
                           onChange={this.handlechange}
                           checked={this.state.useorderlabel}
                           name="useorderlabel"
                           id="useorderlabel" />
                           <span><label htmlFor="useorderlabel"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>

                <div className="col-sm-4">
                    <div className="form-group">
                     <label className="control-label">Reboot on Day Close</label>
                     <div className="">
                        <div className="switch-button switch-button-info">
                           <input type="checkbox"
                           onChange={this.handlechange}
                           checked={this.state.rebootonhouseclose}
                           name="rebootonhouseclose"
                           id="rebootonhouseclose" />
                           <span><label htmlFor="rebootonhouseclose"></label></span>
                        </div>
                     </div>
                  </div>
                 </div>
              </div>
          </div>
              <div className="col-sm-12 form-bot-butn-wrap">
                  <div className="form-bot-butns round-btns">
                      <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Save</button>
                      <button type="reset" onClick={this.onReset} className="btn btn-default">Cancel</button>
                  </div>
              </div>
      </form>
      )
  }
}

export default AddTerminalForm;