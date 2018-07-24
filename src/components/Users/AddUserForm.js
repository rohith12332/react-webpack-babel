import React from 'react';
import {
    browserHistory
} from 'react-router';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DatePicker from "material-ui/DatePicker";
import Select from 'react-select';
import classnames from 'classnames';
import TextInput from '../common/TextInput';
import 'react-datepicker/dist/react-datepicker.css';
import getUserDetails from '../common/CredentialDomain';
import axios from 'axios';
import './users.css'
import moment from 'moment';
import customDatePicker from './customDatePicker';
//import uiDatePicker from './DatePicker';
// JQUERY
global.$p = require('jquery');


class AddUserForm extends React.Component {
  constructor(props) {
      //get current date
      let today, dd, m, yyyy, HH, mm, ss;
      today = new Date();
      dd = today.getDate();
      m = today.getMonth() + 1;
      yyyy = today.getFullYear();
      //get current time
      HH = today.getHours();
      mm = today.getMinutes();
      ss = today.getSeconds();

      if (dd < 10) dd = '0' + dd;
      if (m < 10) mm = '0' + m;
      today = dd + '-' + m + '-' + yyyy +" "+ HH + ':' + mm + ':' + ss ;
              

      super(props);
      this.state = {
          country_value: {
              label: '',
              value: ''
          },
          role_value: {
              label: null,
              value: null
          },
          "User": {
              "address1": "",
              "address2": "",
              "altphone": "954221456",
              "birthdate":"",
              "bohlockoutdate": today,
              "bohpasswordattempts": '2147483647',
              "bohpassworddate": today,
              "bohsecretanswer": "static answer",
              "bohsecretquestion": "static question",
              "city": "",
              "country": "",
              "createdby": "Hussain",
              "createddate": today,
              "emailaddress": "",
              "employeenumber": "9223372036854775807",
              //"externalpayrollid":"",
              "fingerpasswordid": "1627aea5-8e0a-4371-9022-9b504344e724",
              "firstname": "",
              "gender": "1",
              "hireddate":"",
              "homephone": "",
              "isdeleted": false,
              "isterminated": false,
              "istraining": false,
              "lastname": "",
              "loginbohpassword": "",
              "loginkeypassword": "",
              "loginmagpassword": "123456",
              "middlename": "",
              "mobilephone": "",
              "modifiedby": "Hussain",
              "modifieddate": today,
              "oldbohpassword1": "",
              "oldbohpassword2": "",
              "oldbohpassword3": "",
              "oldbohpassword4": "",
              "roleid": "",
              "screenname": "",
              "ssn": "",
              "state": "",
              "store_id": "",
              "terminationdate": "",
              "username": "",
              "zipcode": ""
          },
          "userdetails": {
              "domainadmin": true,
              "domainuniquekey": "",
              "password": "",
              "storeuniquekey": "",
              "storeuser": true,
              "superadmin": true,
              "username": ""
          },
          showSuperUser: false,
          showGeneralUser: true,
          selectedOption: '',
          getHiredDate: '',
          getBirthDate: '',
          hireddate:'',
          birthdate:'',
          errors: {},
          isLoading: true,
          BOHpassword: false,
          FOHpassword: true,
          roles: [],
          msgSuccess: "",
          msgFailure: "",
          selectValue: "",
          label: 'States:',
          searchable: true,
          disabled: false,
          clearable: true,
          rtl: false,
      }
      this.showSuperUser = this.showSuperUser.bind(this);
      this.showGeneralUser = this.showGeneralUser.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onReset = this.onReset.bind(this);
      this.getBirthDate = this.getBirthDate.bind(this);
      this.getHiredDate = this.getHiredDate.bind(this);
      this.handleRadioCheck = this.handleRadioCheck.bind(this);
      this.updateCountry = this.updateCountry.bind(this);
      this.updateRole = this.updateRole.bind(this);
      this.getCountry = this.getCountry.bind(this);
      this.updateValue = this.updateValue.bind(this);
  }
  componentDidMount() {
      this.getUserRole();
      this.getCountry();
      $("html, body").stop().animate({scrollTop:0}, 500, 'swing', function() {});

  }
  getCountry(){
    axios.get("https://ipinfo.io")
      .then(function(response){
        console.log(response)
      }).catch(function (error) {
          console.log("Bad Response");
      });
  }
  getUserRole() {
      var that = this;
      var reqQuery = {};
      reqQuery['userdetails'] = getUserDetails();
      const request = new Request(`${process.env.API_HOST}/ManageRoles.svc/GetAllRoles/json`, {
          method: 'POST',
          headers: new Headers({
              'Content-Type': 'application/json'
          }),
          body: JSON.stringify(reqQuery)
      });
      fetch(request)
          .then(function(response) {
              if (response.status >= 400) {
                  throw new Error("Bad response from server");
              }
              return response.json();
          })
          .then(function(data) {
       // var tableConfig = that.state.tableConfig;
       // tableConfig['isLoading'] = false;
              //console.log(data);
              that.setState({
                  roles: data.rolelist
              });
          });
  }

  updateCountry(element) {
      this.setState({
          country_value: element
      });
  }
  updateRole(element) {
      delete this.state.errors.role_value;
      this.setState({
          role_value: element
      });
  }

  Comparebetweendates() {
    var hireddate = this.state.User.hireddate;
    var birthdate = this.state.User.birthdate;
    console.log(hireddate);
    console.log(birthdate);
    var isbefore = moment(hireddate).isBefore( moment(birthdate));
    return isbefore;
    }


  getHiredDate(event,date) {
    //var User = this.state.User;
    var HiredDate = moment(date).format("DD-MM-YYYY");
    if (!!this.state.errors["hireddate"]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors["hireddate"];
      this.setState({
          errors
      });
  }
    //User['hireddate'] = HiredDate;
      this.setState({
          hireddate:date
      });
  }

  getBirthDate(event,date) {
   // var User = this.state.User;
    var BirthDate = moment(date).format("DD-MM-YYYY");
      if (!!this.state.errors["birthdate"]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors["birthdate"];
      this.setState({
          errors
      });
  }
    // User['birthdate'] = BirthDate;
      this.setState({
         birthdate :date
      });
  }

  //FOH password validation
  validateFOH(value) {
      var foh = /^([\w\-]{4,4})$/;
      return foh.test(value);
  }
  // phone number validation
  validatePhone(value) {
      var phoneno = /^\d{10}$/;
      return phoneno.test(value);
  }
  //email validation function
  validateEmail(value) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
  }

  validateNumber(value) {
    var onlynumber = /^\d*$/;
    return onlynumber.test(value);
  }


  openDatePickerDay = () => {
    this.refs.datePickerDay.focus();
  };

  openStartDatePicker = () => {
    this.refs.datePickerStartDate.focus();
  };

  openEndDatePicker = () => {
    this.refs.datePickerEndDate.focus();
  };


  handleValidation() {
      let errors = {};
      //Form validation error message

      if (this.state.role_value.value === null) {
          errors.role_value = "Please select user role"
      }

      if (this.state.User.emailaddress.trim() === '') {
          document.getElementById("emailaddress").focus();
          errors.emailaddress = "User email can't be empty"
      } else if (!this.validateEmail(this.state.User.emailaddress)) {
          document.getElementById("emailaddress").focus();
          errors.emailaddress = "Invalid email"
      }

      if (this.state.User.mobilephone.trim() === '') {
          document.getElementById("mobilephone").focus();
          errors.mobilephone = "Mobile Number can't be empty"
      } else if (!this.validatePhone(this.state.User.mobilephone)) {
          document.getElementById("mobilephone").focus();
          errors.mobilephone = "Invalid Mobile Number"
      }

      if (this.state.User.homephone === '') {
      }else{
      if (!this.validatePhone(this.state.User.homephone)) {
          document.getElementById("homephone").focus();
          errors.homephone = "Invalid Phone Number"
      }
    }

      if (this.state.User.zipcode === '') {
      }else{
      if (!this.validateNumber(this.state.User.zipcode)) {
          document.getElementById("zipcode").focus();
          errors.zipcode = "Invalid Zipcode"
      }
    }


      if (this.state.User.state.trim() === '') {
          document.getElementById("state").focus();
          errors.state = "state can't be empty"
      }

      if (this.state.User.city.trim() === '') {
          document.getElementById("city").focus();
          errors.city = "city can't be empty"
      }


      if (this.state.User.screenname.trim() === '') {
          document.getElementById("screenname").focus();
          errors.screenname = "Screenname can't be empty"
      }

      if (this.state.birthdate === '') {
          document.getElementById("birthdate");
          errors.birthdate = "birthdate can't be empty"
      }

      if (this.state.hireddate === '') {
          document.getElementById("hireddate");
          errors.hireddate = "hireddate can't be empty"
      }

      if (this.state.User.loginkeypassword.trim() === '') {
          document.getElementById("loginkeypassword").focus();
          errors.loginkeypassword = "FOH can't be empty"
      } else if (!this.validateFOH(this.state.User.loginkeypassword)) {
          errors.loginkeypassword = "Password length should be Four"
      }else if(!this.validateNumber(this.state.User.loginkeypassword)){
        errors.loginkeypassword = "FOH Password must be numbers"
      }

      if (this.state.User.username.trim() === '') {
          document.getElementById("username").focus();
          errors.username = "Username can't be empty"
      }

      if (this.state.User.lastname.trim() === '') {
          document.getElementById("lastname").focus();
          errors.lastname = "Last Name can't be empty"
      }

      if(this.state.User.birthdate !='' && this.state.User.hireddate !=''){
        
             if(this.Comparebetweendates())
             {
                errors.birthdate = " Birth date date should be less than Hired date";
             }
      }

      if (this.state.User.firstname.trim() === '') {
        document.getElementById("firstname").focus();
        errors.firstname = "First Name can't be empty"
      }

      this.setState({
          errors
      }); //Set Errors state

      return Object.keys(errors).length == 0;
  }

  onChange(event) {
      //alert('sdfdsf');
      this.setState({
          isEditable: true
      });
      var User = {};
      var field = event.target.name;
      var credentials = {};
      var country = this.state.country_value.label;
     // var hireddate = moment(this.state.hireddate).format("DD-MM-YYYY HH:mm:ss");
     // var birthdate = moment(this.state.birthdate).format("DD-MM-YYYY HH:mm:ss");

      if (!!this.state.errors[event.target.name]) {
          let errors = Object.assign({}, this.state.errors);
          delete errors[event.target.name];
          this.setState({
              errors
          });
      }

      User = this.state.User;
      User[field] = event.target.value;
      User['country'] = country;
     // User['hireddate'] = hireddate;
     // User['birthdate'] = birthdate;

      return this.setState({
          User: User
      });
  }

  onSubmit(event) {
    event.preventDefault();
    const that = this;
    var AddUser = {};
    var isValid = this.handleValidation();
    var storeid = window.sessionStorage.getItem('storeid');
    if(isValid) {
     $("html, body").stop().animate({scrollTop:0}, 500, 'swing', function() {});
      const AddUser = {};
      var CreateUser = this.state.User;
      AddUser['User'] = this.state.User;
      AddUser['User']['store_id'] = storeid;
      AddUser['User']['roleid'] = this.state.role_value.value;
      AddUser['User']['hireddate'] = moment(this.state.hireddate).format("DD-MM-YYYY HH:mm:ss")
      AddUser['User']['birthdate'] = moment(this.state.birthdate).format("DD-MM-YYYY HH:mm:ss");
      AddUser['userdetails'] = getUserDetails();

      
      console.log(JSON.stringify(AddUser))
      //return false;
      const request = new Request(`${process.env.API_HOST}/ManageUsers.svc/CreateUser/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(AddUser)
      });
      return fetch(request).then(function(response) {
        return response.json();
      }).then(function(data) {
        if(data.statusCode >= 400) {
          that.setState({
            msgFailure: data.statusMessage
          })
        } else {
          that.setState({
            msgSuccess: data.statusMessage
          });

          setTimeout(function() {
            browserHistory.push('/users')
          }, 2000)
        }
      }).catch(function(error) {
        return error;
      })
    }
  }

  onReset(event) {
      browserHistory.push('/users')
  }

  handleRadioCheck(event) {
      //var selectedOption = jQuery(this).next().val();
      console.log(event.target.parentNode.children[0].value);
      this.setState({
          selectedOption: event.target.parentNode.children[0].value
      });
  }
  showSuperUser(event) {
      this.setState({
          showSuperUser: event.target.checked,
          BOHpassword: event.target.checked
      });

  }
  showGeneralUser(event) {
      this.setState({
          showGeneralUser: event.target.checked,
          FOHpassword: event.target.checked
      });
  }

  updateValue (newValue) {
    this.setState({
      selectValue: newValue
    });
  }

  render() {
    console.log(this.state)
    var roleOptions = this.state.roles;
    roleOptions = roleOptions.map(function(o) {
        return {
            label: o.name,
            value: o.id
        }
    });
    var options = [
        { value: 'one1', label: 'One1' },
        { value: 'two1', label: 'Two1' },
        { value: 'three1', label: 'Three1' }
      ];
    //console.log(roleOptions);
    var countryOptions=[{label:"India",value:"IN"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}],cityOptions=[{label:"Hyderabad",value:"HYD"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}];
    const {msgSuccess, msgFailure, BOHpassword, FOHpassword} = this.state;
    return(
      <form>
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgSuccess}
        </div>}
        <div className="widget widget-small">
        <div className="row form-group">
        <div className="col-sm-6">
          <div className={classnames('form-group', { error: !!this.state.errors.firstname})}>
              <TextInput
                type="text"
                name="firstname"
                id="firstname"
                label="First Name"
                tabindex="1"
                required="*"
                value={this.state.firstname}
                placeholder=""
                className={classnames('form-control', { error: !!this.state.errors.firstname})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.firstname}</span>
          </div>
        </div>

        <div className="col-sm-6">
          <div className={classnames('form-group', { error: !!this.state.errors.lastname})}>
              <TextInput
                type="text"
                name="lastname"
                id="lastname"
                label="Last Name"
                required="*"
                value={this.state.lastname}
                placeholder=""
                className={classnames('form-control', { error: !!this.state.errors.lastname})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.lastname}</span>
          </div>
        </div>
        </div>

        <div className={classnames('form-group', { error: !!this.state.errors.username})}>
            <TextInput
              type="text"
              name="username"
              id="username"
              label="Username"
              required="*"
              value={this.state.username}
              placeholder=""
              className={classnames('form-control', { error: !!this.state.errors.username})}
              onChange={this.onChange}
            />
            <span>{this.state.errors.username}</span>
        </div>

        <div className="row form-group">
        <div className="col-sm-6">
        <div className="form-group">
        <label className="control-label">Show Super-User Password</label>
        <div className="">
            <div className="switch-button switch-button-info">
               <input type="checkbox" onChange={this.showSuperUser} checked={this.state.showSuperUser} name="s1" id="s1" />
               <span><label htmlFor="s1"></label></span>
            </div>
        </div>
        </div>
        </div>

        <div className="col-sm-6">
        <div className="form-group">
        <label className="control-label">Show General User Password</label>
        <div className="">
        <div className="switch-button switch-button-info">
         <input type="checkbox" onChange={this.showGeneralUser} checked={this.state.showGeneralUser} name="s2" id="s2" />
        <span>
        <label htmlFor="s2"></label>
        </span> </div>
        </div>
        </div>
        </div>
        </div>

        {BOHpassword && <div className={classnames('form-group', { error: !!this.state.errors.loginbohpassword})}>
            <TextInput
              type="password"
              name="loginbohpassword"
              id="loginbohpassword"
              label="BOH Password"
              value={this.state.loginbohpassword}
              placeholder=""
              className={classnames('form-control', { error: !!this.state.errors.loginbohpassword})}
              onChange={this.onChange}
            />
            <span>{this.state.errors.loginbohpassword}</span>
        </div>}

        {FOHpassword && <div className={classnames('form-group', { error: !!this.state.errors.loginkeypassword})}>
            <TextInput
              type="password"
              name="loginkeypassword"
              id="loginkeypassword"
              label="FOH Password"
              required="*"
              value={this.state.loginkeypassword}
              placeholder=""
              className={classnames('form-control', { error: !!this.state.errors.loginkeypassword})}
              onChange={this.onChange}
            />
            <span>{this.state.errors.loginkeypassword}</span>
        </div>}
        <div className={classnames('form-group', { error: !!this.state.errors.screenname})}>
            <TextInput
              type="text"
              name="screenname"
              id="screenname"
              label="Screen Name"
              required="*"
              value={this.state.screenname}
              placeholder=""
              className={classnames('form-control', { error: !!this.state.errors.screenname})}
              onChange={this.onChange}
            />
            <span>{this.state.errors.screenname}</span>
        </div>

          <MuiThemeProvider>
              <div className="row">
              <div className={classnames('form-group col-lg-6 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.hireddate})}>
              <label className="control-label">Hired Date</label>
                <div className="datepicker-wrapper">
                  <DatePicker
                    id="datePickerStartDate"
                    ref='datePickerStartDate'
                    formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                    onChange={this.getHiredDate}
                    required="*"
                    maxDate={new Date()}
                    value={this.state.hireddate}
                    className={classnames('m-datePicker', { error: !!this.state.errors.hireddate})}
                    textFieldStyle={{'height':'40px'}}
                  />
                </div>
                <div className="input-group-addon btn btn-secondary" onClick={this.openStartDatePicker}><i className="icon icon-799"></i></div>
              <span className="clearfix" style={{'display':'block'}}>{this.state.errors.hireddate}</span>
            </div>
              <div className={classnames('form-group col-lg-6 col-md-6 col-sm-6 reactDatepicker', { error: !!this.state.errors.birthdate})}>
              <label className="control-label">Birth Date</label>
                <div className="datepicker-wrapper">
                  <DatePicker
                    onChange={this.getBirthDate}
                    value={this.state.birthdate}
                    ref='datePickerEndDate'
                    id="datePickerEndDate"
                    maxDate={new Date()}
                    formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                    className={classnames('m-datePicker', { error: !!this.state.errors.birthdate})}
                    textFieldStyle={{'height':'40px'}}
                  />
                </div>
                <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
                <span>{this.state.errors.birthdate}</span>
            </div>
          </div>
        </MuiThemeProvider>

{/*        <div className="row">
        <div className="col-sm-6">
        <div className="form-group reactDatepicker">
        <label className="control-label"> Hired Date</label>
        <DatePicker className="react-datepicker-txt"
          selected={this.state.getHiredDate}
          value={this.state.getHiredDate}
          onChange={this.getHiredDate}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select" />
          <div className="input-group-addon btn btn-secondary"><i className="icon icon-799"></i></div>
        </div>
        </div>
        <div className="col-sm-6">
        <div className="form-group reactDatepicker">
        <label className="control-label"> Birth Date </label>
        <uiDatePicker />
        <DatePicker className="react-datepicker-txt"
          selected={this.state.getBirthDate}
          value={this.state.getBirthDate}
          onChange={this.getBirthDate}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          maxDate={moment()}
          excludeDates={[moment(), moment().subtract(0, "days")]}
          dropdownMode="select" />
          <div className="input-group-addon btn btn-secondary" onClick={this.props.onClick}><i className="icon icon-799"></i></div>
        </div>
        </div>
        </div>*/}

        <div className="row form-group">
        <div className="col-sm-6">
            <div className={classnames('form-group', { error: !!this.state.errors.city})}>
                <TextInput
                  type="text"
                  name="city"
                  id="city"
                  label="City"
                  value={this.state.city}
                  placeholder=""
                  required="*"
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
                  id="state"
                  required="*"
                  label="State"
                  value={this.state.state}
                  placeholder="E.g. WA,CA"
                  className={classnames('form-control', { error: !!this.state.errors.state})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.state}</span>
            </div>
        </div>
        </div>

        <div className="row form-group">
        <div className="col-sm-6">
        <div className="form-group">
        <label> Country</label>
        <Select
          name="country"
          value={this.state.country_value.value}
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
                  id="zipcode"
                  label="Zipcode"
                  value={this.state.zipcode}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.zipcode})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.zipcode}</span>
            </div>
        </div>
        </div>

        <div className={classnames('form-group', { error: !!this.state.errors.address1})}>
            <TextInput
              type="text"
              name="address1"
              id="address1"
              label="Address"
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
              id="address2"
              label="Address Line 2"
              value={this.state.address2}
              placeholder="(Optional)"
              className="form-control"
              onChange={this.onChange}
            />
        </div>

        <div className="row form-group">
        <div className="col-sm-6">
          <div className={classnames('form-group', { error: !!this.state.errors.mobilephone})}>
              <TextInput
                type="tel"
                name="mobilephone"
                id="mobilephone"
                label="Mobile Number"
                required="*"
                value={this.state.mobilephone}
                placeholder=""
                className={classnames('form-control', { error: !!this.state.errors.mobilephone})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.mobilephone}</span>
          </div>
        </div>

        <div className="col-sm-6">
          <div className={classnames('form-group', { error: !!this.state.errors.homephone})}>
              <TextInput
                type="tel"
                name="homephone"
                id="homephone"
                label="Home Phone"
                value={this.state.homephone}
                placeholder=""
                className={classnames('form-control', { error: !!this.state.errors.homephone})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.homephone}</span>
          </div>

        </div>
        </div>

        <div className="row form-group">
        <div className="col-sm-6">
        <div className={classnames('form-group', { error: !!this.state.errors.ssn})}>
          <TextInput
              type="tel"
              name="ssn"
              id="ssn"
              label="SSN"
              value={this.state.ssn}
              placeholder=""
              className={classnames('form-control', { error: !!this.state.errors.ssn})}
              onChange={this.onChange}
            />
            <span>{this.state.errors.ssn}</span>
        </div>

        </div>
        <div className="col-sm-6">
            <div className={classnames('form-group', { error: !!this.state.errors.emailaddress})}>
                <TextInput
                  type="email"
                  name="emailaddress"
                  id="emailaddress"
                  label="Email Address"
                  required="*"
                  value={this.state.emailaddress}
                  className={classnames('form-control', { error: !!this.state.errors.emailaddress})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.emailaddress}</span>
            </div>
        </div>
        </div>
        <div className="form-group ">
        <div className="row ">


        <div className="col-sm-6">
        <label className="row col-sm-12 control-label">Gender</label>
            <div className="am-radio inline" onClick={this.handleRadioCheck}>
              <input
                type="radio"
                value="1"
                checked={this.state.selectedOption === '1'}
                name="gender"
                onChange={this.onChange}
              />
              <label htmlFor="gender">Male</label>
            </div>
            <div className="am-radio inline" onClick={this.handleRadioCheck}>
              <input
                type="radio"
                value="2"
                name="gender"
                checked={this.state.selectedOption === '2'}
              />
              <label htmlFor="gender">Female</label>
            </div>
          </div>
          <div className="col-sm-6">
          <div className={classnames('form-group', { error: !!this.state.errors.role_value})}>
            <label>Role<span className="required">*</span></label>
            <Select
              name="rolevalue"
              value={this.state.role_value.value}
              options={roleOptions}
              onChange={this.updateRole}
              />
              <span>{this.state.errors.role_value}</span>
          </div>
          </div>
        </div>
        </div>
        <div className="row form-group">
      {/* <div className="col-sm-6">
            <div className={classnames('form-group', { error: !!this.state.errors.externalpayrollid})}>
                <TextInput
                  type="email"
                  name="externalpayrollid"
                  label="External Payroll ID"
                  required="*"
                  value={this.state.externalpayrollid}
                  placeholder=""
                  className={classnames('form-control', { error: !!this.state.errors.externalpayrollid})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.externalpayrollid}</span>
            </div>
        </div>*/}
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
export default AddUserForm;