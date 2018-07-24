import React from 'react';
import axios from 'axios';
var StoreImage = require('./store.svg');
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Checkbox from '../common/Checkbox';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
import classnames from 'classnames';
import {browserHistory,Link} from 'react-router';
import './Warning.css';
import StoreList from './StoreList';
import TextInput from '../common/TextInput';
import getCurrentDate from '../common/Date';
import getUserDetails from '../common/CredentialDomain';
import SplashScreen from '../common/isLoading';
import { QRCode } from 'react-qr-svg';

class storeCore extends React.Component {
 constructor(props) {
  super(props);
  this.state = {
      stores:[],
      store:[],
      singleStore:[],
      warehouse:[],
      editwarehouse:[],
      showModal: false,
      editModal:false,
      viewModal :false,
      warehouse_value:{
        label:"",
        value: ""
      },
      country_value:{
        label:"",
        value: ""
      },
      storeinformation:{},
      userdetails:{},
      addStore:{},
      statusMessage:'',
      statusSucessMessage: '',
      isEditable: false,
      canCancel: true,
      canSubmit: false,
      errors:{},
      failError:"",
      isLoading: true,
      msgSuccess: "",
      msgFailure: "",
      domainuniquekey:"",
      storeuniquekey:"",
      origin        :"",
      enablewarehouse: false
  }
  this.viewClose  = this.viewClose.bind(this);
  this.updateCountry = this.updateCountry.bind(this);
  this.close = this.close.bind(this);
  this.editClose = this.editClose.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
  this.onChange = this.onChange.bind(this);
  this.handleEditChanges = this.handleEditChanges.bind(this);
  this.deleteStore = this.deleteStore.bind(this);
  this.getSingleStore = this.getSingleStore.bind(this);
  this.updateStore = this.updateStore.bind(this);
  this.print = this.print.bind(this);
  this.QR = this.QR.bind(this);
  this.updateWarehouse = this.updateWarehouse.bind(this);
}
componentWillMount() {
  // get domain unique key based on select domain
  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  var userdetails = JSON.parse(window.sessionStorage.getItem("userDetails"));
  userdetails["domainuniquekey"] = domainuniquekey;

  this.setState({
    domainuniquekey: domainuniquekey,
    userdetails: userdetails
  })
}
componentDidMount() {
   this.getAllStores();
}

/*shouldComponentUpdate(nextProps, nextState) {
  return shallowCompare(this, nextProps, nextState);
}*/


updateStore(){
    var that = this;
    var storeinformation = this.state.storeinformation;
    var isValid = this.handleValidation();

    if(isValid){
    const addStore = {};
    var country = this.state.country_value.label;
    addStore['storeinformation'] = storeinformation;
    addStore['storeinformation']['country'] = country;
    addStore['userdetails'] = getUserDetails();
    console.log(addStore)
    //return false;
    const request = new Request(`${process.env.API_HOST}/ManageStores.svc/UpdateStore/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type':'application/json'
      }),
      body: JSON.stringify(addStore)
    });
    return fetch(request).then(response => {
      return response.json();
    }).then(function(data) {
      console.log(data)
      that.setState({
        editModal: false,
        msgSuccess:data.statusMessage
      });
      setTimeout(function() {
        that.setState({
          msgSuccess:''
        })
      }, 4000);
      that.getAllStores();
    }).catch(error => {
      return error;
    });
  }
}


getSingleStore(item,type){
  //console.log("---------- GETTING SINGLE STORE -----------")
  var that = this;
  var reqQuery = {};
  reqQuery['storeid'] = item.storeid;
  reqQuery['userdetails'] = getUserDetails();
  reqQuery['userdetails']['storeuniquekey'] = item.storeuniquekey;

  axios.post(`${process.env.API_HOST}/ManageStores.svc/GetSingleStore/json`, reqQuery)
   .then(function (response) {

      var data = response.data.singlestore;
      console.log(data)
      if(data == null) data = [];
      if(type==='Edit'){
      that.setState({
        storeinformation: data,
        ModalTitle:'Edit Store',
        editModal: true,
        canCancel: false,
        country_value:{
          label:data.country,
          value: data.country
        }
      });
      // check if it is warehouse
      var storeinformation = that.state.storeinformation;
      if(storeinformation.iswarehouse === true || storeinformation.warehouseid !== ''){
        that.setState({
          enablewarehouse: true,
           warehouse_value:{
             label:data.name,
             value: data.name
           }
        })
      }else{
        that.setState({
          enablewarehouse: false
        })
      }
      var warehouseList = that.state.warehouse;
      var editwarehouse = [];

      warehouseList.map((o, i) => {
      if(o[0] == item.storeid){
        console.log('skipping...')
      }else{
        editwarehouse.push(o)
      }
      that.setState({
        editwarehouse: editwarehouse,
        
      })  

      })
      //console.log(that.state.warehouse)

      // remove existing warehouse
    }
    else{
      that.setState({
        storeinformation:data,
        viewModal : true,
        domainuniquekey : reqQuery['userdetails'].domainuniquekey,
        storeuniquekey :item.storeuniquekey,
        origin  : window.location.origin
      });
    }
   })
  .catch(function (error) {
    that.setState({
      failError: "Couldn't connect to the server"
    })
  });
}

openAdd = () => {
  this.setState({
    showModal: true,
    errors:{},
  })
}

closeAdd = () => {
  this.setState({
    showModal: false,
    errors:{}
  })
}

close() {
  this.setState({ showModal: false });
  this.setState({ errors: {} });
  this.setState({
    storeinformation:{
        address1:'',
        address2:'',
        createdby:'Hussain',
        createddate: getCurrentDate(),
        emailid:'',
        isdeleted: false,
        modifiedby:'',
        modifieddate:getCurrentDate(),
        name:'',
        phonenumber:'',
        city:'',
        state:'',
        storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
        storeuniquekey:'',
        zipcode:''
    }
  })

}

viewClose()
{
  this.setState({
    viewModal: false,
    errors: {},
    storeinformation:{
      address1:'',
      address2:'',
      createdby:'Hussain',
      createddate: getCurrentDate(),
      emailid:'',
      isdeleted: false,
      modifiedby:'',
      modifieddate:getCurrentDate(),
      name:'',
      phonenumber:'',
      city:'',
      state:'',
      storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
      storeuniquekey:'',
      zipcode:''
    }
  });
}

editClose(){
  this.setState({
    editModal: false,
    errors: {},
    iswarehouse: false,
    enablewarehouse: false,
    storeinformation:{
      address1:'',
      address2:'',
      createdby:'Hussain',
      createddate: getCurrentDate(),
      emailid:'',
      isdeleted: false,
      modifiedby:'',
      modifieddate:getCurrentDate(),
      name:'',
      phonenumber:'',
      city:'',
      state:'',
      storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
      storeuniquekey:'',
      zipcode:''
    }
  });

}
updateCountry(element) {
  this.setState({
    country_value: element,
    canSubmit: true
  });
}

updateWarehouse(element) {
  var storeinformation = this.state.storeinformation;

  storeinformation["warehouseid"] = element.value;
  storeinformation["warehouseid"] = element.value;

  console.log(storeinformation);
  console.log(element.value)

  this.setState({
    storeinformation: storeinformation,
    warehouse_value: element,
    canSubmit:true
  });
}

//Getting All Stores

getAllStores(){
  var that = this;
  var credentials = this.state.userdetails;
  axios.post(`${process.env.API_HOST}/ManageStores.svc/GetStores/json`, credentials)
   .then(function (response) {
      console.log(response.data.storeslist)

      if(response.data.storeslist == null) response.data.storeslist = [];

      // get warehourse
      var warehouse = [];
      response.data.storeslist.map(function(item, i){
        if(item.iswarehouse == true) {
          warehouse.push([item.storeid, item.name])
        }
      })

      console.log(warehouse)

      console.log(stores)
      //console.log(warehouse)
      that.setState({
        stores: response.data.storeslist,
        isLoading: false,
        warehouse: warehouse
      });
   })
  .catch(function (error) {
     console.log(error);
  });
}

/*=========================================================================
********************** FORM VALIDATION BEGIN ******************************
==========================================================================*/

//email validation function
validateEmail(value) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}
// phone number validation
validatePhone(value){
  var phoneno = /^\d{10}$/;
  return phoneno.test(value);
}
// Only numbers allowed
validateNumber(value) {
  var onlynumber = /^\d*$/;
  return onlynumber.test(value);
}

// function to validata form
handleValidation(){
  let errors = {};

  if (this.state.storeinformation.name.trim() === '') {
    document.getElementById("name").focus();
    errors.name = "Store name can't be empty"
  }
  if (this.state.storeinformation.emailid.trim() === '') {
    document.getElementById("emailid").focus();
    errors.emailid = "Store email can't be empty"
  }else if(!this.validateEmail(this.state.storeinformation.emailid)) {
      errors.emailid = "Invalid email"
  }
  if (this.state.storeinformation.phonenumber.trim() === '') {
    errors.phonenumber = "Store phone can't be empty"
  }
  if (this.state.storeinformation.address1.trim() === '') {
    errors.address1 = "Address can't be empty"
  }
  if (this.state.storeinformation.city.trim() === '') {
    errors.city = "City can't be empty"
  }
  if (this.state.storeinformation.state.trim() === '') {
    errors.state = "State can't be empty"
  }
  if (this.state.storeinformation.zipcode.trim() === '') {
    errors.zipcode = "ZipCode can't be empty"
  }else if(!this.validateNumber(this.state.storeinformation.zipcode)){
    errors.zipcode = "Zipcode must be numbers"
  }

  this.setState({ errors }); //Set Errors state
  return Object.keys(errors).length == 0;
}

/*=========================================================================
********************** FORM VALIDATION END ******************************
==========================================================================*/

handleEditChanges(event){
  this.setState({canSubmit: true});
  const field = event.target.name;
  const storeinformation = this.state.storeinformation;
  storeinformation[field] = event.target.value;

  if(!!this.state.errors[event.target.name]) {
    let errors = Object.assign({}, this.state.errors);
     delete errors[event.target.name];
     this.setState({errors});
  }
  var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
  storeinformation["domainuniquekey"] = domainuniquekey;
  //console.log(storeinformation);

  window.sessionStorage.setItem('storeinformation', JSON.stringify(storeinformation));
}

  print(){


   /* var headstr = "<html><head><title></title></head><body>";
    var footstr = "</body>";
    var newstr = jQuery('#printQRCode').html();
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr+newstr+footstr;*/
    window.print();
    //document.body.innerHTML = oldstr;
   /* setTimeout(function() {
              browserHistory.push('/stores')
            }, 5000)*/
    //return false;
    //console.log(jQuery('#printQRCode').html());
    //window.print();
  }

  QR(element){
     console.log(element);

  }

onChange(event) {
  this.setState({isEditable: true, canSubmit:true});
  const field = event.target.name;
  const storeinformation = this.state.storeinformation;
  storeinformation[field] = event.target.value;
   if (!!this.state.errors[event.target.name]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors[event.target.name];

      this.setState({
          errors
      });
  }

  this.setState({
      storeinformation: storeinformation,
      canCancel: true
  });
}

onSubmit(event) {
  event.preventDefault();
  var that = this;
  var isValid = this.handleValidation();

  if(isValid){
  const addStore = {};
  var country = this.state.country_value.label;
  addStore["storeinformation"] = this.state.storeinformation;
  addStore["storeinformation"]["country"] = country;
  addStore["userdetails"] = this.state.userdetails;
  var oldStoresState = this.state.stores;
  var newStoreState = addStore.storeinformation;
  oldStoresState.push(newStoreState);

  const request = new Request(`${process.env.API_HOST}/ManageStores.svc/CreateStore/json`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type':'application/json'
    }),
    body: JSON.stringify(addStore)
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
      that.setState({
        msgSuccess: data.statusMessage,
        showModal: false,
        storeinformation:{
          address1:'',
          address2:'',
          createdby:'Hussain',
          createddate: getCurrentDate(),
          emailid:'',
          isdeleted: false,
          modifiedby:'',
          modifieddate:getCurrentDate(),
          name:'',
          phonenumber:'',
          city:'',
          state:'',
          storeid:'1227aea5-8e0a-4371-9022-9b504344e724',
          storeuniquekey:'',
          zipcode:''
        },
        stores: oldStoresState
      })
      setTimeout(function() {

        that.setState({
          msgSuccess:''
        })
      }, 4000);
      window.location.reload();
    }
  }).catch(error => {
      return error;
    });
  }
}


deleteStore(item){
  var that = this;
  const newState = this.state.stores;
  if (newState.indexOf(item) > -1) {
      newState.splice(newState.indexOf(item), 1);
      this.setState({stores: newState});

      const deleteStore = {
        "isdeleted":true,
        "storeid":item.storeid,
        "userdetails":this.state.userdetails
      }

  const request = new Request(`${process.env.API_HOST}/ManageStores.svc/DeleteStore/json`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type':'application/json'
    }),
    body:JSON.stringify(deleteStore)
  });
  fetch(request)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
       that.setState({msgSuccess: data.statusMessage});
    });
    setTimeout(function() {
      that.setState({
        msgSuccess:''
      })
    }, 4000);
    }
  }

/*setTimeout(() => {
  this.setState({
    showingAlert: false
  });
}, 2000);*/


iswarehouse = (event) => {
  var storeinformation = this.state.storeinformation;
  storeinformation['iswarehouse'] = event.target.checked

  this.setState({
    storeinformation: storeinformation,
    canSubmit:true
  })
}

enablewarehouse = (event) => {
  if(event.target.checked === false){
    var storeinformation = this.state.storeinformation;
    storeinformation['iswarehouse'] = false
  }
  this.setState({
    enablewarehouse: event.target.checked,
    isEditable: true,
    canSubmit:true
  })
}

   render(){
    console.log(this.state)

    const {
      isLoading,
      storeinformation,
      msgFailure,
      msgSuccess,
      statusSucessMessage,
      statusMessage,
      showModal,
      singleStore,
      warehouse,
      editwarehouse
    } = this.state;
    var countryOptions=[{label:"India",value:"IN"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}],cityOptions=[{label:"Hyderabad",value:"HYD"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}];

    var warehouselist = warehouse.map(function(o){
      return{
        label: o[1],
        value: o[0],
      }
    });

    var editwarehouselist = editwarehouse.map(function(o){
      return{
        label: o[1],
        value: o[0],
      }
    });

    return(
      <div className="listcontainer">
      <div className="mainScreen">
      {isLoading && <SplashScreen />}
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
          {msgSuccess}
        </div>}
        <StoreList stores={this.state.stores} deleteStore={this.deleteStore} getSingleStore={this.getSingleStore}/>

        <Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Add Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                <TextInput
                  type="text"
                  name="name"
                  id="name"
                  required="*"
                  label="Store Name"
                  value={this.state.name}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.name})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.name}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.emailid})}>
                <TextInput
                  type="email"
                  name="emailid"
                  id="emailid"
                  required="*"
                  label="Email Address"
                  value={this.state.emailid}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.emailid})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.emailid}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.phonenumber})}>
                <TextInput
                  type="tel"
                  name="phonenumber"
                  id="phonenumber"
                  label="Phone Number"
                  required="*"
                  value={this.state.phonenumber}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.phonenumber})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.phonenumber}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.address1})}>
                <TextInput
                  type="text"
                  name="address1"
                  id="address1"
                  label="Address"
                  required="*"
                  value={this.state.address1}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.address1})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.address1}</span>
            </div>
            <div className="form-group">
                <TextInput
                  type="text"
                  name="address2"
                  label="Address Line 2"
                  value={this.state.address2}
                  placeholder=""
                  className="form-control"
                  onChange={this.onChange}
                />
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.city})}>
                <TextInput
                  type="text"
                  name="city"
                  label="City"
                  id="city"
                  required="*"
                  value={this.state.city}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.city})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.city}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.state})}>
                <TextInput
                  type="text"
                  name="state"
                  id="state"
                  label="State"
                  required="*"
                  value={this.state.state}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.state})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.state}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.country})}>
              <label>Country</label>
              <Select
              name="country"
              value={this.state.country_value}
              options={countryOptions}
              onChange={this.updateCountry}
              />
              <span>{this.state.errors.country}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.zipcode})}>
                <TextInput
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  label="Zipcode"
                  required="*"
                  value={this.state.zipcode}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.zipcode})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.zipcode}</span>
            </div>

            {/********* WAREHOUSE *********/}
{/*            <Checkbox
              onChange={this.enablewarehouse}
              checked={this.state.enablewarehouse}
              name="enablewarehouse"
              id="enablewarehouse"
              label="Enable Warehouse"
            />*/}
            
            <div className="warehouse-container">
              <Checkbox
                onChange={this.iswarehouse}
                checked={storeinformation.iswarehouse}
                name="iswarehouse"
                id="iswarehouse"
                label="Is Warehouse"
              />
              <div className={classnames('form-group', { error: !!this.state.errors.country})}>
                <label>Warehouse</label>
                <Select
                  name="country"
                  value={this.state.warehouse_value}
                  options={warehouselist}
                  onChange={this.updateWarehouse}
                />
                <span>{this.state.errors.country}</span>
              </div>
            </div>
            {/********* / WAREHOUSE *********/}


          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-submit" onClick={this.onSubmit}>Submit</Button>
            <Button className="btn-cancel" onClick={this.closeAdd}>Cancel</Button>
          </Modal.Footer>
        </form>
        </Modal>

        <Modal show={this.state.editModal} onHide={this.editClose} backdrop={false} keyboard={false}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Edit Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                <TextInput
                  type="text"
                  name="name"
                  id="name"
                  label="Store Name"
                  required="*"
                  value={this.state.name}
                  defaultValue={storeinformation.name}
                  placeholder="Wine Store"
                  className={classnames('form-control', { error: !!this.state.errors.name})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.name}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.emailid})}>
                <TextInput
                  type="email"
                  name="emailid"
                  id="emailid"
                  label="Email Address"
                  required="*"
                  value={this.state.name}
                  defaultValue={storeinformation.emailid}
                  placeholder="username@example.com"
                  className={classnames('form-control', { error: !!this.state.errors.emailid})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.emailid}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.phonenumber})}>
                <TextInput
                  type="tel"
                  name="phonenumber"
                  label="Phone Number"
                  required="*"
                  value={this.state.phonenumber}
                  defaultValue={storeinformation.phonenumber}
                  placeholder="111-111-1111"
                  className={classnames('form-control', { error: !!this.state.errors.phonenumber})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.phonenumber}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.address1})}>
                <TextInput
                  type="text"
                  name="address1"
                  id="address1"
                  label="Address"
                  required="*"
                  value={this.state.address1}
                  defaultValue={storeinformation.address1}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.address1})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.address1}</span>
            </div>
            <div className="form-group">
                <TextInput
                  type="text"
                  name="address2"
                  id="address2"
                  label="Address Line 2"
                  value={this.state.address2}
                  defaultValue={storeinformation.address2}
                  placeholder="(Optional)"
                  className="form-control"
                  onChange={this.onChange}
                />
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.city})}>
                <TextInput
                  type="text"
                  name="city"
                  id="city"
                  label="City"
                  required="*"
                  value={this.state.city}
                  defaultValue={storeinformation.city}
                  placeholder="City/Town"
                  className={classnames('form-control', { error: !!this.state.errors.city})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.city}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.state})}>
                <TextInput
                  type="text"
                  name="state"
                  id="state"
                  label="State"
                  required="*"
                  value={this.state.state}
                  defaultValue={storeinformation.state}
                  placeholder="E.g. WA,CA"
                  className={classnames('form-control', { error: !!this.state.errors.state})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.state}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.country})}>
              <label>Country</label>
              <Select
              name="country"
              value={this.state.country_value}
              options={countryOptions}
              onChange={this.updateCountry.bind(this)}
              />
              <span>{this.state.errors.country}</span>
            </div>
            <div className={classnames('form-group', { error: !!this.state.errors.zipcode})}>
                <TextInput
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  label="Zipcode"
                  required="*"
                  value={this.state.zipcode}
                  defaultValue={storeinformation.zipcode}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.zipcode})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.zipcode}</span>
            </div>

            {/********* WAREHOUSE *********/}
{/*            <Checkbox
              onChange={this.enablewarehouse}
              checked={this.state.enablewarehouse}
              name="enablewarehouse"
              id="enablewarehouse"
              label="Enable Warehouse"
            />*/}

            <div className="warehouse-container">
              <Checkbox
                onChange={this.iswarehouse}
                checked={storeinformation.iswarehouse}
                name="iswarehouse"
                id="iswarehouse"
                label="Is Warehouse"
              />
              <div className={classnames('form-group', { error: !!this.state.errors.country})}>
                <label>Warehouse</label>
                <Select
                  name="country"
                  value={this.state.storeinformation.warehouseid}
                  options={editwarehouselist}
                  onChange={this.updateWarehouse}
                />
                <span>{this.state.errors.country}</span>
              </div>
            </div>
            {/********* / WAREHOUSE *********/}

          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-submit" disabled={!this.state.canSubmit} onClick={this.updateStore}>Submit</Button>
            <Button className="btn-cancel" onClick={this.editClose}>Cancel</Button>
          </Modal.Footer>
        </form>
        </Modal>

        <Modal show={this.state.viewModal} onHide={this.viewClose} backdrop={false} keyboard={false}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>View Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="mainScreen">
              <div className="row">
                    <div className="col-sm-3"> <label className="control-label"> Name </label> </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{storeinformation.name}</label>  </div>
                    <div className="col-sm-1">  </div>
              </div>
              <div className="row">
                    <div className="col-sm-3"> <label className="control-label">Email</label> </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"> <label className="control-label">{storeinformation.emailid}</label></div>
                    <div className="col-sm-1">  </div>
              </div>
              <div className="row">
                    <div className="col-sm-3"> <label className="control-label">Phone Number</label>  </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{storeinformation.phonenumber}</label> </div>
                    <div className="col-sm-1">  </div>
              </div>
               <div className="row">
                    <div className="col-sm-3"> <label className="control-label">Address</label>  </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{storeinformation.address1}</label></div>
                     <div className="col-sm-1">  </div>
              </div>
              <div className="row">
                    <div className="col-sm-3"> <label className="control-label">City</label> </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{storeinformation.city}</label></div>
                    <div className="col-sm-1">  </div>
              </div>
              <div className="row">
                    <div className="col-sm-3"> <label className="control-label">State</label> </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{storeinformation.state}</label></div>
                    <div className="col-sm-1">  </div>
              </div>
              <div className="row">
                    <div className="col-sm-3"><label className="control-label">Country</label>  </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-8"><label className="control-label">{storeinformation.country}</label></div>
              </div>
               <div className="row">
                    <div className="col-sm-3"><label className="control-label">zipcode</label>   </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{storeinformation.zipcode}</label></div>
                    <div className="col-sm-1">  </div>
              </div>

               <div className="row">
                    <div className="col-sm-3"><label className="control-label">Store Unique key</label>   </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{this.state.storeuniquekey}</label></div>
                     <div className="col-sm-1">  </div>
              </div>
               <div className="row">
                    <div className="col-sm-3"><label className="control-label">Domain Unique key</label>   </div>
                    <div className="col-sm-1"> : </div>
                    <div className="col-sm-7"><label className="control-label">{this.state.domainuniquekey}</label></div>
                    <div className="col-sm-1">  </div>
              </div>
               <div className="row">
              <div className="col-sm-3"><label className="control-label">Store Users URL</label>  </div>
              <div className="col-sm-1"> : </div>
              <div className="col-sm-7"><label className="control-label">{this.state.origin+"/login?domainuniquekey="+this.state.domainuniquekey+"&storeuniquekey="+ this.state.storeuniquekey}</label> </div>
              <div className="col-sm-1">  </div>
              </div>

              <div className="row">
              <div className="col-sm-3"> </div>
              <div className="col-sm-1">  </div>
              <div className="col-sm-7"></div>
              <div className="col-sm-1">  </div>
              </div>
              <div id='printQRCode'>
              <div className="row">
              <div className="col-sm-3"> <label className="control-label">QRCode</label>  </div>
              <div className="col-sm-1"> : </div>
             {/* <QRCode
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="Q"
                    style={{ width: 256 }}
                    value="some text"
                />*/}
              <div className="col-sm-7"><QRCode value={this.state.origin+"/login?domainuniquekey="+this.state.domainuniquekey+"&storeuniquekey="+ this.state.storeuniquekey} style={{ width: 150}}/></div>
               <div className="col-sm-1"> </div>
              </div>
              </div>
              </div>
          </Modal.Body>
          <Modal.Footer>

            <Button className="btn-submit" onClick={this.print}><span>print</span></Button>
            <Button className="btn-cancel" onClick={this.viewClose}><span>Cancel</span></Button>
          </Modal.Footer>
        </form>
        </Modal>
        </div>
         <div className="printQRcode" name="bar">
        <QRCode value={this.state.domainuniquekey +"/"+ this.state.storeuniquekey} style={{ width: 256}}/>
      </div>
      </div>
      )
  }
}
export default storeCore;