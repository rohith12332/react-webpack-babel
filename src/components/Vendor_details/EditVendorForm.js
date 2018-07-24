import React from 'react';
import {browserHistory} from 'react-router';
import moment from "moment";
import Select from 'react-select';
import classnames from 'classnames';
import TextInput from '../common/TextInput';
import getUserDetails from '../common/CredentialDomain'

global.jQuery = require('jquery');

class EditVendorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country_value: {
        label: null,
        value: null
      },
      vendor_type: {
        label: null,
        value: null
      },
      "vendordetails":{
  			"accountlimit": "0",
  			"accountnumber":"",
  			"active":true,
  			"address1":"",
  			"address2":"",
  			"bankname":"",
  			"branchname":"",
  			"city":"",
  			"country":"",
  			"createdby":"",
  			"emailaddress":"",
  			"fax":"",
  			"firstname":"",
  			"hasnohighlimit":true,
  			"ifsccode":"",
  			"isdeleted":false,
  			"lastname":"",
  			"modifiedby":"",
  			"name":"",
  			"notes":"",
  			"state":"",
  			"telephone":"",
  			"vendortype":"",
  			"zipcode":""
	},
		"userdetails":{
			"domainadmin":true,
			"domainuniquekey":"",
			"password":"",
			"storeuniquekey":"",
			"storeuser":true,
			"superadmin":true,
			"username":""
	},
		  hasNoHighLimit:"",
          isActive: "",
      	  msgSuccess: "",
          msgFailure: "",
          SingleVendor:{},

      errors:{}
    	}

      this.hasNoHighLimit = this.hasNoHighLimit.bind(this);
      this.isActive = this.isActive.bind(this);
      this.updateCountry = this.updateCountry.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
      this.updatevendortype = this.updatevendortype.bind(this);
    }
    componentDidMount() {
    this.getSingleVendors();
  }


  getSingleVendors() {
    var that = this;
    var reqQuery = {};
    var vendorid = this.props.location.split('/')[2];
    reqQuery['userdetails'] = getUserDetails();
    reqQuery['vendorid'] = vendorid;
    const request = new Request(`${process.env.API_HOST}/ManageVendorAccount.svc/GetSingleVendor/json`, {
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
      console.log(data);
      that.setState({
        vendordetails: data.singlevendordetails,
        country_value: {
          label: data.singlevendordetails.country,
          value: data.singlevendordetails.country
        },
        vendor_type: {
          label: data.singlevendordetails.vendortype,
          value: data.singlevendordetails.vendortype
        }
      });
    });
  }

updateCountry(element) {
  this.setState({
       country_value: element
  });
}

updatevendortype(element) {
  this.setState({
      vendor_type: element
  });
}

  hasNoHighLimit(event) {
    var vendordetails = this.state.vendordetails;
    vendordetails['hasnohighlimit'] = event.target.checked;
    this.setState({
        vendordetails: vendordetails
    });
  }
  isActive(event) {
    var vendordetails = this.state.vendordetails;
    vendordetails['active'] = event.target.checked;
    this.setState({
        vendordetails: vendordetails
    });
  }
  // phone number validation
  validatePhone(value) {
      var phoneno = /^\d{10}$/;
      return phoneno.test(value);
  }
  validateEmail(value) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
  }

  validateNumber(value) {
      var onlynumber = /^\d*$/;
      return onlynumber.test(value);
  }

  validateText(value) {
      var text = /^[a-zA-Z_ ]*$/;
      return text.test(value);
  }



  handleValidation() {

      let errors = {};
      //Form validation error message

      if (!this.validateNumber(this.state.vendordetails.accountlimit)) {
          document.getElementById("accountlimit").focus();
          errors.accountlimit = "Invalid Account Limit"
      }

      if (this.state.vendordetails.state === '') {
      }else{
      if (!this.validateText(this.state.vendordetails.bankname)) {
          document.getElementById("bankname").focus();
          errors.bankname = "Invalid Bank Name"
      }
    }

      if (this.state.vendordetails.state === '') {
      }else{
      if (!this.validateText(this.state.vendordetails.branchname)) {
          document.getElementById("branchname").focus();
          errors.branchname = "Invalid Branch Name"
      }
    }

      if (!this.validateNumber(this.state.vendordetails.accountnumber)) {
          document.getElementById("accountnumber").focus();
          errors.accountnumber = "Invalid Account Number"
      }

      if (!this.validateNumber(this.state.vendordetails.zipcode)) {
          document.getElementById("zipcode").focus();
          errors.zipcode = "Invalid zipcode"
      }

      if (this.state.vendordetails.state === '') {
      }else{
      if (!this.validateText(this.state.vendordetails.state)) {
          document.getElementById("state").focus();
          errors.state = "Invalid State Name"
      }
    }

      if (this.state.vendordetails.city === '') {
      }else{
      if (!this.validateText(this.state.vendordetails.city)) {
          document.getElementById("city").focus();
          errors.city = "Invalid City Name"
      }
    }

      if (this.state.vendordetails.name.trim() === '') {
        document.getElementById("name").focus();
        errors.name = "Vendor Company name can't be empty"
      }else if (!this.validateText(this.state.vendordetails.name)) {
          document.getElementById("name").focus();
          errors.name = "Invalid Vendor Company Name"
      }

      if (this.state.vendordetails.telephone.trim() === '') {
        document.getElementById("telephone").focus();
        errors.telephone = "Phone Number  can't be empty"
      }else if (!this.validatePhone(this.state.vendordetails.telephone)) {
          document.getElementById("telephone").focus();
          errors.telephone = "Invalid Phone Number"
      }


      if (this.state.vendordetails.emailaddress === '') {
      }else{
        if(!this.validateEmail(this.state.vendordetails.emailaddress)){
          document.getElementById("emailaddress").focus();
          errors.emailaddress = "Invalid Email Address";
        }
      }

      if(this.state.vendordetails.lastname === ''){
      }else{
      if (!this.validateText(this.state.vendordetails.lastname)) {
          document.getElementById("lastname").focus();
          errors.lastname = "Invalid Last Name"
      }
    }

      if (this.state.vendordetails.firstname.trim() === '') {
        document.getElementById("firstname").focus();
        errors.firstname = "First Name can't be empty"
      }else if (!this.validateText(this.state.vendordetails.firstname)) {
          document.getElementById("firstname").focus();
          errors.firstname = "Invalid First Name"
      }

      this.setState({
          errors
      }); //Set Errors state

      return Object.keys(errors).length == 0;
  }


  onChange(event) {
    this.setState({isEditable: true});
    let vendors = {};
    let field = event.target.name;
    let credentials = {};
    let country = this.state.country_value.label;
    let vendortype = this.state.vendor_type.label;


    if(!!this.state.errors[event.target.name]) {
      let errors = Object.assign({}, this.state.errors);
       delete errors[event.target.name];

       this.setState({errors});
     }

    var vendordetails = this.state.vendordetails;
    vendordetails[field] = event.target.value;

    vendors['country'] = country;
    //console.log(vendortype);
    vendors['vendortype'] = vendortype;

    return this.setState({
        vendordetails: vendordetails
    } );
  }


  onSubmit(event) {
    event.preventDefault();
    const that = this;
    var addVendor = {};
    var isValid = this.handleValidation();

    let country = this.state.country_value.label;
    let vendortype = this.state.vendor_type.label;
    let storeid = window.sessionStorage.getItem('storeid');

    if(isValid){
    const addVendor = {};
    addVendor["vendordetails"] = this.state.vendordetails;
    addVendor["vendordetails"]["country"] = country;
    addVendor["vendordetails"]["vendortype"] = vendortype;
    addVendor["vendordetails"]["store_id"] = storeid;

    addVendor['userdetails'] = getUserDetails();

    const request = new Request(`${process.env.API_HOST}/MangaeVendorAccount.svc/UpdateVendorAccount/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type':'application/json'
      }),
      body: JSON.stringify(addVendor)
    });
    return fetch(request).then(function(response){
      return response.json();
    }).then(function(data){
    	console.log(data);

    if (data.statusCode >= 400) {
        that.setState({
            msgFailure: data.statusMessage
        })
    } else {
        that.setState({
            msgSuccess: data.statusMessage
        });
        setTimeout(function() {
            browserHistory.push('/vendors')
        }, 5000)
    }
    }).catch(function(error){
      return error;
    })
  }
}

  onReset(event){
    browserHistory.push('/vendors')
  }

     render(){
    //console.log(this.state);
     var countryOptions=[{label:"India",value:"IN"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}],cityOptions=[{label:"Hyderabad",value:"HYD"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}];
     var vendorType=[{label:"Platinum",value:"PL"},{label:"Gold",value:"GD"},{label:"Silver",value:"SL"},{label:"Bronze",value:"BZ"}];
 	const {msgSuccess, msgFailure,vendordetails} = this.state;

 	   //console.log(vendordetails);
     //var strphone = vendordetails.telephone.toString();
     //console.log(strphone);
    //debugger;

 	return(
 		<form key={vendordetails.id}>
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgSuccess}
        </div>}
        <div className="widget widget-small">
               <div className="row">
                <div className="col-sm-12">
                  <div className="product-widget-head bottom20">Edit Vendor</div>
                </div>
              </div>


               <div className="row">
                <div className="col-sm-6">
                 <div className={classnames('form-group', { error: !!this.state.errors.firstname})}>
	              <TextInput
	                type="text"
	                name="firstname"
	                label="First Name"
	                required="*"
	                value={this.state.firstname}
                  defaultValue={this.state.vendordetails.firstname}
	                placeholder=""
	                className={classnames('form-control', { error: !!this.state.errors.firstname})}
	                onChange={this.onChange}
	              />
	              <span>{this.state.errors.firstname}</span>
	          </div>
				</div>
             <div className="col-sm-6">
              <div className="form-group">
            <TextInput
              type="text"
              name="lastname"
              label="Last Name"
              value={this.state.lastname}
              defaultValue={this.state.vendordetails.lastname}
              placeholder=" "
              className="form-control"
              onChange={this.onChange}
            />
        </div>
				</div>
              </div>

		      <div className="form-group">
		            <TextInput
		              type="email"
		              name="emailaddress"
		              label="Email Address"
		              value={this.state.emailaddress}
                  defaultValue={this.state.vendordetails.emailaddress}
		              placeholder="username@example.com"
		              className="form-control"
		              onChange={this.onChange}
		            />
		        </div>

                <div className={classnames('form-group', { error: !!this.state.errors.telephone})}>
              <TextInput
                type="text"
                name="telephone"
                label="Phone Number"
                required="*"
                value={this.state.telephone}
                defaultValue={this.state.vendordetails.telephone}
                placeholder=""
                className={classnames('form-control', { error: !!this.state.errors.telephone})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.telephone}</span>
          </div>

            </div>
            <div className="widget widget-small">
              <div className="row">
                <div className="col-sm-12">
                  <div className="product-widget-head bottom20">Address</div>
                </div>
              </div>

          <div className={classnames('form-group', { error: !!this.state.errors.name})}>
            <TextInput
              type="text"
              name="name"
              label="Company"
              required="*"
              value={this.state.name}
              defaultValue={this.state.vendordetails.name}
              placeholder=""
              className={classnames('form-control', { error: !!this.state.errors.name})}
              onChange={this.onChange}
            />
            <span>{this.state.errors.name}</span>
        </div>


        <div className={classnames('form-group', { error: !!this.state.errors.address1})}>
            <TextInput
              type="text"
              name="address1"
              label="Address"
              required="*"
              value={this.state.address1}
              defaultValue={this.state.vendordetails.address1}
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
              defaultValue={this.state.vendordetails.address2}
              placeholder="(Optional)"
              className="form-control"
              onChange={this.onChange}
            />
        </div>

                <div className="row">
                <div className="col-sm-6">
                <div className={classnames('form-group', { error: !!this.state.errors.city})}>
                <TextInput
                  type="text"
                  name="city"
                  label="City"
                  required="*"
                  value={this.state.city}
                  defaultValue={this.state.vendordetails.city}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.city})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.city}</span>
            </div>
				</div>
             <div className="col-sm-6">
               <div className={classnames('form-group', { error: !!this.state.errors.state})}>
                <TextInput
                  type="text"
                  name="state"
                  label="State"
                  required="*"
                  value={this.state.state}
                  defaultValue={this.state.vendordetails.state}
                  placeholder=" "
                  className={classnames('form-control', { error: !!this.state.errors.state})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.state}</span>
            </div>
				</div>
              </div>
               <div className="row">
                <div className="col-sm-6">
                <div className="form-group">
		        <label> Country</label>
		        <Select
		          name="country"
              value={this.state.country_value}
		          options={countryOptions}
		          onChange={this.updateCountry}
		          />
		        </div>
				</div>
             <div className="col-sm-6">
             <div className={classnames('form-group', { error: !!this.state.errors.zipcode})}>
                <TextInput
                  type="text"
                  name="zipcode"
                  label="Zipcode"
                  required="*"
                  value={this.state.zipcode}
                  defaultValue={this.state.vendordetails.zipcode}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.zipcode})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.zipcode}</span>
            </div>
				</div>
              </div>


            </div>

          	 <div className="widget widget-small">

                 <div className="form-group">
		        <label> vendor Type</label>
		        <Select
		          name="vendortype"
		          value={this.state.vendor_type}
		          options={vendorType}
		          onChange={this.updatevendortype}
		          />
		        </div>





		        <div className="form-group">
  			<label className="control-label">Has No High Limit</label>
  			<div className="">
      			<div className="switch-button switch-button-info">
      			   <input type="checkbox"
               onChange={this.hasNoHighLimit}
               checked={this.state.vendordetails.hasnohighlimit}
               name="s1"
               id="s1" />
      			   <span><label htmlFor="s1"></label></span>
            </div>
  			</div>
  			</div>

                    <div className="form-group">
  			<label className="control-label">Is Active</label>
  			<div className="">
      			<div className="switch-button switch-button-info">
      			   <input type="checkbox"
               onChange={this.isActive}
               checked={this.state.vendordetails.active}
               name="s2"
               id="s2" />
      			   <span><label htmlFor="s2"></label></span>
            </div>
  			</div>
  			</div>

            </div>

            <div className="widget widget-small">
              <div className="row">
                <div className="col-sm-12">
                  <div className="product-widget-head bottom20">Vendor Account Details</div>
                </div>
              </div>


               <div className="row">
               	<div className="col-sm-6">
                   <div className="form-group">
		            <TextInput
		              type="text"
		              name="accountnumber"
		              label="Account Number"
		              value={this.state.accountnumber}
                  defaultValue={this.state.vendordetails.accountnumber}
		              placeholder="(Optional)"
		              className="form-control"
		              onChange={this.onChange}
		            />
		        </div>

               	</div>

               	<div className="col-sm-6">
                 <div className="form-group">
			            <TextInput
			              type="text"
			              name="bankname"
			              label="Bank Name"
			              value={this.state.bankname}
                    defaultValue={this.state.vendordetails.bankname}
			              placeholder="(Optional)"
			              className="form-control"
			              onChange={this.onChange}
			            />
			        </div>
               	</div>
               </div>

               <div className="row">
               	<div className="col-sm-6">
               	<div className="form-group">
			            <TextInput
			              type="text"
			              name="branchname"
			              label="Branch Name"
			              value={this.state.branchname}
                    defaultValue={this.state.vendordetails.branchname}
			              placeholder="(Optional)"
			              className="form-control"
			              onChange={this.onChange}
			            />
			        </div>
               	</div>

               	<div className="col-sm-6">
               		<div className="form-group">
			            <TextInput
			              type="text"
			              name="ifsccode"
			              label="IFSC code"
			              value={this.state.ifsccode}
                    defaultValue={this.state.vendordetails.ifsccode}
			              placeholder="(Optional)"
			              className="form-control"
			              onChange={this.onChange}
			            />
			        </div>
               	</div>
               </div>

               <div className="row">
               	<div className="col-sm-6">
               	<div className="form-group">
			            <TextInput
			              type="text"
			              name="accountlimit"
			              label="Account Limit"
                    value={this.state.accountlimit}
			              defaultValue={this.state.vendordetails.accountlimit}
			              placeholder=""
			              className="form-control"
			              onChange={this.onChange}
			            />
			        </div>
               	</div>

               	<div className="col-sm-6">
               	<div className="form-group">
			            <TextInput
			              type="text"
			              name="notes"
			              label="Notes"
			              value={this.state.notes}
                    defaultValue={this.state.vendordetails.notes}
			              placeholder="(Optional)"
			              className="form-control"
			              onChange={this.onChange}
			            />
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

export default EditVendorForm;
