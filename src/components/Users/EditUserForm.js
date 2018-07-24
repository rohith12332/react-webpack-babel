import React from 'react';
import {browserHistory} from 'react-router';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DatePicker from "material-ui/DatePicker";
import moment from "moment";
import Select from 'react-select';
import classnames from 'classnames';
import TextInput from '../common/TextInput';
import 'react-datepicker/dist/react-datepicker.css';
import getCurrentDate from '../common/Date';
import getUserDetails from '../common/CredentialDomain';
import './users.css'
// JQUERY
global.jQuery = require('jquery');

class EditUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country_value: {
        label: null,
        value: null
      },
      role_value: {
        label: null,
        value: null
      },
      "User": {
        "address1": "",
        "address2": "",
        "altphone": "954221456",
        "birthdate": new Date(),
        "bohlockoutdate": getCurrentDate(),
        "bohpasswordattempts": '2147483647',
        "bohpassworddate": getCurrentDate(),
        "bohsecretanswer": "static answer",
        "bohsecretquestion": "static question",
        "city": "",
        "country": "",
        "createdby": "Hussain",
        "createddate": getCurrentDate(),
        "emailaddress": "",
        "employeenumber": "9223372036854775807",
        "fingerpasswordid": "1627aea5-8e0a-4371-9022-9b504344e724",
        "firstname": "",
        "gender": "1",
        "hireddate": new Date(),
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
        "modifieddate": getCurrentDate(),
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
      //getHiredDate: new Date(),
      //getBirthDate: new Date(),
      getHireDateDefault:"",
      getBirthDateDefault:"",
      errors: {},
      BOHpassword: false,
      FOHpassword: true,
      roles: [],
      singleUser: [],
      msgSuccess: "",
      msgFailure: "",
      genderSelected: "checked",
      checked:1
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
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    var that = this;
    var reqQuery = {};
    var userId = this.props.location.split('/')[2];
    reqQuery['userdetails'] = getUserDetails();
    reqQuery['UserID'] = userId;

    console.log(JSON.stringify(reqQuery));

    const request = new Request(`${process.env.API_HOST}/ManageUsers.svc/GetSingleUser/json`, {
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
      console.log(data)
      if(data.User == null) data.User = [];
      that.setState({
        User: data.User,
        checked:data.User.gender,
        country_value: {
          label: data.User.country,
          value: data.User.country
        }
      });
      var roleQuery = {};
      roleQuery['userdetails'] = getUserDetails();
      const request = new Request(`${process.env.API_HOST}/ManageRoles.svc/GetAllRoles/json`, {
        method: 'POST',
        headers: new Headers({
        'Content-Type': 'application/json'
        }),
        body: JSON.stringify(roleQuery)
      });
      fetch(request).then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      }).then(function(data) {
        that.setState({
          roles: data.rolelist
        });
        that.getUserRole();
      });
    });
  }

  //Get Single Role based on RoleID
  getUserRole() {
    var that = this;
    var reqQuery = {};
    var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
    let storeuniquekey = window.sessionStorage.getItem('storeuniquekey');


    reqQuery['userdetails'] = getUserDetails();
    reqQuery['roleid'] = this.state.User.roleid;

    console.log(reqQuery)

    credentials['storeuniquekey'] = storeuniquekey;
    reqQuery['userdetails'] = getUserDetails();
    reqQuery['roleid'] = this.state.User.roleid;

    const request = new Request(`${process.env.API_HOST}/ManageRoles.svc/GetSingleRole/json`, {
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
      console.log(data)
      that.setState({
        role_value: {
          label: data.singlerole.name,
          value: data.singlerole.name
        }
        //roles: data.singlerole.name
      });
    });
  }

  updateCountry(element) {
    this.setState({country_value: element});
  }

  updateRole(element) {
    this.state.User.roleid = element.value;
    this.setState({
      role_value: element
    });
  }

  getHiredDate(event, date){
    let User = this.state.User;
    User["hireddate"] = date;
    console.log(date)
    this.setState({
      User: User
    });
  }

  getBirthDate(event, date){
    let User = this.state.User;
    User["birthdate"] = date;
    console.log(date)
    this.setState({
      User: User
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

  validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
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

    Comparebetweendates() {
    var hireddate = this.state.User.hireddate;
    var birthdate = this.state.User.birthdate;
    console.log(hireddate);
    console.log(birthdate);
    var isbefore = moment(hireddate).isBefore( moment(birthdate));
    return isbefore;
    }

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

      if (this.state.User.state === '') {
      }else{
      if (!this.validateText(this.state.User.state)) {
          document.getElementById("state").focus();
          errors.state = "Invalid State"
      }
    }

      if (this.state.User.city === '') {
      }else{
      if (!this.validateText(this.state.User.city)) {
          document.getElementById("city").focus();
          errors.city = "Invalid City Name"
      }
    }

      if (this.state.User.screenname.trim() === '') {
          document.getElementById("screenname").focus();
          errors.screenname = "Screenname can't be empty"
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

      if(this.state.User.birthdate !='' && this.state.User.hireddate !='')
      {
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
    this.setState({isEditable: true});
    let User = {};
    let field = event.target.name;
    let credentials = {};
    let country = this.state.country_value.label;
/*    let hireddate =  moment(this.state.User.hireddate).format('DD-MM-YYYY HH:mm:ss');
    console.log(hireddate)
    let birthdate =  moment(this.state.User.birthdate).format('DD-MM-YYYY HH:mm:ss');
    console.log(birthdate)*/

    let storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    let domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    let storeid = window.sessionStorage.getItem('storeid');

    if(!!this.state.errors[event.target.name]) {
      let errors = Object.assign({}, this.state.errors);
       delete errors[event.target.name];

       this.setState({errors});
     }

    User = this.state.User;
    User[field] = event.target.value;

    User['country'] = country;
   // User['hireddate'] = hireddate;
   // User['birthdate'] = birthdate;

    console.log(User)
    credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));

    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;

    return this.setState({
        User: User,
        userdetails: credentials
    } );
  }

  onSubmit(event) {
    event.preventDefault();
    const that = this;
    var AddUser = {};
    var isValid = this.handleValidation();

    let country = this.state.country_value.label;

    if(isValid){
    const AddUser = {};
    AddUser['User'] = this.state.User;

    console.log(this.state.User)

    var bday = this.state.User.birthdate;
    if(typeof(bday) == 'object'){
      console.log(bday)
      console.log(typeof(bday))
      const parseBirthDate = moment(bday).format('DD-MM-YYYY HH:mm:ss');
      console.log(parseBirthDate)
      AddUser['User']['birthdate'] = parseBirthDate;
    } 

        AddUser['User']['birthdate'] =  this.state.User.birthdate;
      
      
      var hday = this.state.User.hireddate;
    if(typeof(hday) == 'object'){
      console.log(hday)
      console.log(typeof(hday))
      const parseHiredDate = moment(hday).format('DD-MM-YYYY HH:mm:ss');
      console.log(parseHiredDate)
      AddUser['User']['hireddate'] = parseHiredDate;
    }

        AddUser['User']['hireddate'] =  this.state.User.hireddate;
//return false;
    
    AddUser['User']['country'] = country;
    
    AddUser['userdetails'] = getUserDetails();

    console.log(AddUser)

    console.log(JSON.stringify(AddUser));

    const request = new Request(`${process.env.API_HOST}/ManageUsers.svc/UpdateUser/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type':'application/json'
      }),
      body: JSON.stringify(AddUser)
    });
    return fetch(request).then(function(response){
      return response.json();
    }).then(function(data){

    if (data.statusCode >= 400) {
        that.setState({
            msgFailure: data.statusMessage
        })
        setTimeout(function() {
        that.setState({
          msgFailure:''
        })
      }, 4000);
    } else {
        that.setState({
            msgSuccess: data.statusMessage
        });
        setTimeout(function() {
        browserHistory.push('/users')
      }, 4000);
    }
    }).catch(function(error){
      return error;
    })
  }
}

  onReset(event){
    browserHistory.push('/users')
  }

  handleRadioCheck(event){
    this.setState({
      selectedOption: event.target.parentNode.children[0].value
    });
  }

  handlePromotionCheck(id){
    var User = this.state.User;
    User['gender'] = id;
    this.setState({
        checked: id,
        User: User
    });
  }

  showSuperUser(event){
    this.setState({
      showSuperUser: event.target.checked,
      BOHpassword: event.target.checked
    });

  }
  showGeneralUser(event){
    this.setState({
      showGeneralUser: event.target.checked,
      FOHpassword: event.target.checked
    });
  }

  render(){

    console.log(this.state)
    var roleOptions = this.state.roles;
    roleOptions = roleOptions.map(function(o) {
      return {
        label:o.name,
        value:o.id
      }
    });

    var countryOptions=[{label:"India",value:"IN"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}],cityOptions=[{label:"Hyderabad",value:"HYD"},{label:"Afghanistan",value:"AF"},{label:"Albania",value:"AL"},{label:"Algeria",value:"DZ"},{label:"American Samoa",value:"AS"},{label:"AndorrA",value:"AD"},{label:"Angola",value:"AO"},{label:"Anguilla",value:"AI"},{label:"Antarctica",value:"AQ"},{label:"Antigua and Barbuda",value:"AG"},{label:"Argentina",value:"AR"},{label:"Armenia",value:"AM"},{label:"Aruba",value:"AW"},{label:"Australia",value:"AU"},{label:"Austria",value:"AT"},{label:"Azerbaijan",value:"AZ"},{label:"Bahamas",value:"BS"},{label:"Bahrain",value:"BH"},{label:"Bangladesh",value:"BD"},{label:"Barbados",value:"BB"},{label:"Belarus",value:"BY"},{label:"Belgium",value:"BE"},{label:"Belize",value:"BZ"},{label:"Benin",value:"BJ"},{label:"Bermuda",value:"BM"},{label:"Bhutan",value:"BT"},{label:"Bolivia",value:"BO"},{label:"Bosnia and Herzegovina",value:"BA"},{label:"Botswana",value:"BW"},{label:"Bouvet Island",value:"BV"},{label:"Brazil",value:"BR"},{label:"British Indian Ocean Territory",value:"IO"},{label:"Brunei Darussalam",value:"BN"},{label:"Bulgaria",value:"BG"},{label:"Burkina Faso",value:"BF"},{label:"Burundi",value:"BI"},{label:"Cambodia",value:"KH"},{label:"Cameroon",value:"CM"},{label:"Canada",value:"CA"},{label:"Cape Verde",value:"CV"},{label:"Cayman Islands",value:"KY"},{label:"Central African Republic",value:"CF"},{label:"Chad",value:"TD"},{label:"Chile",value:"CL"},{label:"China",value:"CN"},{label:"Christmas Island",value:"CX"},{label:"Cocos (Keeling) Islands",value:"CC"},{label:"Colombia",value:"CO"},{label:"Comoros",value:"KM"},{label:"Congo",value:"CG"},{label:"Congo, The Democratic Republic of the",value:"CD"},{label:"Cook Islands",value:"CK"},{label:"Costa Rica",value:"CR"},{label:"Cote D'Ivoire",value:"CI"},{label:"Croatia",value:"HR"},{label:"Cuba",value:"CU"},{label:"Cyprus",value:"CY"},{label:"Czech Republic",value:"CZ"},{label:"Denmark",value:"DK"},{label:"Djibouti",value:"DJ"},{label:"Dominica",value:"DM"},{label:"Dominican Republic",value:"DO"},{label:"Ecuador",value:"EC"},{label:"Egypt",value:"EG"},{label:"El Salvador",value:"SV"},{label:"Equatorial Guinea",value:"GQ"},{label:"Eritrea",value:"ER"},{label:"Estonia",value:"EE"},{label:"Ethiopia",value:"ET"},{label:"Falkland Islands (Malvinas)",value:"FK"},{label:"Faroe Islands",value:"FO"},{label:"Fiji",value:"FJ"},{label:"Finland",value:"FI"},{label:"France",value:"FR"},{label:"French Guiana",value:"GF"},{label:"French Polynesia",value:"PF"},{label:"French Southern Territories",value:"TF"},{label:"Gabon",value:"GA"},{label:"Gambia",value:"GM"},{label:"Georgia",value:"GE"},{label:"Germany",value:"DE"},{label:"Ghana",value:"GH"},{label:"Gibraltar",value:"GI"},{label:"Greece",value:"GR"},{label:"Greenland",value:"GL"},{label:"Grenada",value:"GD"},{label:"Guadeloupe",value:"GP"},{label:"Guam",value:"GU"},{label:"Guatemala",value:"GT"},{label:"Guernsey",value:"GG"},{label:"Guinea",value:"GN"},{label:"Guinea-Bissau",value:"GW"},{label:"Guyana",value:"GY"},{label:"Haiti",value:"HT"},{label:"Heard Island and Mcdonald Islands",value:"HM"},{label:"Holy See (Vatican City State)",value:"VA"},{label:"Honduras",value:"HN"},{label:"Hong Kong",value:"HK"},{label:"Hungary",value:"HU"},{label:"Iceland",value:"IS"},{label:"Indonesia",value:"ID"},{label:"Iran, Islamic Republic Of",value:"IR"},{label:"Iraq",value:"IQ"},{label:"Ireland",value:"IE"},{label:"Isle of Man",value:"IM"},{label:"Israel",value:"IL"},{label:"Italy",value:"IT"},{label:"Jamaica",value:"JM"},{label:"Japan",value:"JP"},{label:"Jersey",value:"JE"},{label:"Jordan",value:"JO"},{label:"Kazakhstan",value:"KZ"},{label:"Kenya",value:"KE"},{label:"Kiribati",value:"KI"},{label:"Korea, Democratic People'S Republic of",value:"KP"},{label:"Korea, Republic of",value:"KR"},{label:"Kuwait",value:"KW"},{label:"Kyrgyzstan",value:"KG"},{label:"Lao People'S Democratic Republic",value:"LA"},{label:"Latvia",value:"LV"},{label:"Lebanon",value:"LB"},{label:"Lesotho",value:"LS"},{label:"Liberia",value:"LR"},{label:"Libyan Arab Jamahiriya",value:"LY"},{label:"Liechtenstein",value:"LI"},{label:"Lithuania",value:"LT"},{label:"Luxembourg",value:"LU"},{label:"Macao",value:"MO"},{label:"Macedonia, The Former Yugoslav Republic of",value:"MK"},{label:"Madagascar",value:"MG"},{label:"Malawi",value:"MW"},{label:"Malaysia",value:"MY"},{label:"Maldives",value:"MV"},{label:"Mali",value:"ML"},{label:"Malta",value:"MT"},{label:"Marshall Islands",value:"MH"},{label:"Martinique",value:"MQ"},{label:"Mauritania",value:"MR"},{label:"Mauritius",value:"MU"},{label:"Mayotte",value:"YT"},{label:"Mexico",value:"MX"},{label:"Micronesia, Federated States of",value:"FM"},{label:"Moldova, Republic of",value:"MD"},{label:"Monaco",value:"MC"},{label:"Mongolia",value:"MN"},{label:"Montenegro",value:"ME"},{label:"Montserrat",value:"MS"},{label:"Morocco",value:"MA"},{label:"Mozambique",value:"MZ"},{label:"Myanmar",value:"MM"},{label:"Namibia",value:"NA"},{label:"Nauru",value:"NR"},{label:"Nepal",value:"NP"},{label:"Netherlands",value:"NL"},{label:"Netherlands Antilles",value:"AN"},{label:"New Caledonia",value:"NC"},{label:"New Zealand",value:"NZ"},{label:"Nicaragua",value:"NI"},{label:"Niger",value:"NE"},{label:"Nigeria",value:"NG"},{label:"Niue",value:"NU"},{label:"Norfolk Island",value:"NF"},{label:"Northern Mariana Islands",value:"MP"},{label:"Norway",value:"NO"},{label:"Oman",value:"OM"},{label:"Pakistan",value:"PK"},{label:"Palau",value:"PW"},{label:"Palestinian Territory, Occupied",value:"PS"},{label:"Panama",value:"PA"},{label:"Papua New Guinea",value:"PG"},{label:"Paraguay",value:"PY"},{label:"Peru",value:"PE"},{label:"Philippines",value:"PH"},{label:"Pitcairn",value:"PN"},{label:"Poland",value:"PL"},{label:"Portugal",value:"PT"},{label:"Puerto Rico",value:"PR"},{label:"Qatar",value:"QA"},{label:"Reunion",value:"RE"},{label:"Romania",value:"RO"},{label:"Russian Federation",value:"RU"},{label:"RWANDA",value:"RW"},{label:"Saint Helena",value:"SH"},{label:"Saint Kitts and Nevis",value:"KN"},{label:"Saint Lucia",value:"LC"},{label:"Saint Pierre and Miquelon",value:"PM"},{label:"Saint Vincent and the Grenadines",value:"VC"},{label:"Samoa",value:"WS"},{label:"San Marino",value:"SM"},{label:"Sao Tome and Principe",value:"ST"},{label:"Saudi Arabia",value:"SA"},{label:"Senegal",value:"SN"},{label:"Serbia",value:"RS"},{label:"Seychelles",value:"SC"},{label:"Sierra Leone",value:"SL"},{label:"Singapore",value:"SG"},{label:"Slovakia",value:"SK"},{label:"Slovenia",value:"SI"},{label:"Solomon Islands",value:"SB"},{label:"Somalia",value:"SO"},{label:"South Africa",value:"ZA"},{label:"South Georgia and the South Sandwich Islands",value:"GS"},{label:"Spain",value:"ES"},{label:"Sri Lanka",value:"LK"},{label:"Sudan",value:"SD"},{label:"Suriname",value:"SR"},{label:"Svalbard and Jan Mayen",value:"SJ"},{label:"Swaziland",value:"SZ"},{label:"Sweden",value:"SE"},{label:"Switzerland",value:"CH"},{label:"Syrian Arab Republic",value:"SY"},{label:"Taiwan, Province of China",value:"TW"},{label:"Tajikistan",value:"TJ"},{label:"Tanzania, United Republic of",value:"TZ"},{label:"Thailand",value:"TH"},{label:"Timor-Leste",value:"TL"},{label:"Togo",value:"TG"},{label:"Tokelau",value:"TK"},{label:"Tonga",value:"TO"},{label:"Trinidad and Tobago",value:"TT"},{label:"Tunisia",value:"TN"},{label:"Turkey",value:"TR"},{label:"Turkmenistan",value:"TM"},{label:"Turks and Caicos Islands",value:"TC"},{label:"Tuvalu",value:"TV"},{label:"Uganda",value:"UG"},{label:"Ukraine",value:"UA"},{label:"United Arab Emirates",value:"AE"},{label:"United Kingdom",value:"GB"},{label:"United States",value:"US"},{label:"United States Minor Outlying Islands",value:"UM"},{label:"Uruguay",value:"UY"},{label:"Uzbekistan",value:"UZ"},{label:"Vanuatu",value:"VU"},{label:"Venezuela",value:"VE"},{label:"Viet Nam",value:"VN"},{label:"Virgin Islands, British",value:"VG"},{label:"Virgin Islands, U.S.",value:"VI"},{label:"Wallis and Futuna",value:"WF"},{label:"Western Sahara",value:"EH"},{label:"Yemen",value:"YE"},{label:"Zambia",value:"ZM"},{label:"Zimbabwe",value:"ZW"}];
    const {msgSuccess, msgFailure, singleUser, BOHpassword, FOHpassword} = this.state;

/*    if( (this.state.User.birthdate == null || this.state.User.hireddate == null ) && 
        (this.state.User.birthdate == "" ||this.state.User.hireddate )) this.state.User.birthdate  = "20-03-2018";

     else{ */
    const parseBirthDate = moment(this.state.User.birthdate, 'DD-MM-YYYY,hh:mm:ss a')
    const parseBDate = new Date(parseBirthDate)

    const parseHiredDate = moment(this.state.User.hireddate, 'DD-MM-YYYY,hh:mm:ss a')
    const parseHDate = new Date(parseHiredDate)
    

    console.log(parseBDate)
    console.log(parseHDate)
    return(
      <form key={singleUser.id}>
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
          {msgSuccess}
        </div>}
        <div className="widget widget-small">
        <div className="row form-group">
        <div className="col-sm-6">
          <div className={classnames('form-group', { error: !!this.state.errors.firstname})}>
              <TextInput
                type="text"
                name="firstname"
                label="First Name"
                required="*"
                value={this.state.User.firstname}
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
                label="Last Name"
                required="*"
                value={this.state.User.lastname}
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
              label="Username"
              required="*"
              value={this.state.User.username}
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
              label="BOH Password"
              value={this.state.User.loginbohpassword}
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
              label="FOH Password"
              required="*"
              value={this.state.User.loginkeypassword}
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
              label="Screen Name"
              required="*"
              value={this.state.User.screenname}
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
                    value={parseHDate}
                    formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                    onChange={this.getHiredDate}
                    maxDate={new Date()}
                    onClick={this.openStartDatePicker}
                        className="m-datePicker"
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
                    value={parseBDate}
                    maxDate={new Date()}
                    ref='datePickerEndDate'
                    id="datePickerEndDate"
                    formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                    className="m-datePicker"
                    textFieldStyle={{'height':'40px'}}
                  />
                </div>
                <div className="input-group-addon btn btn-secondary" onClick={this.openEndDatePicker}><i className="icon icon-799"></i></div>
                <span>{this.state.errors.birthdate}</span>
            </div>
          </div>
        </MuiThemeProvider>





        <div className="row form-group">
        <div className="col-sm-6">
            <div className={classnames('form-group', { error: !!this.state.errors.city})}>
                <TextInput
                  type="text"
                  name="city"
                  label="City"
                  required="*"
                  value={this.state.User.city}
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
                  value={this.state.User.state}
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
        <label>Country <span className="required">*</span></label>
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
                  value={this.state.User.zipcode}
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
              label="Address"
              required="*"
              value={this.state.User.address1}
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
              value={this.state.User.address2}
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
                label="Mobile Number"
                required="*"
                value={this.state.User.mobilephone}
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
                label="Home Phone"
                value={this.state.User.homephone}
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
              label="SSN"
              value={this.state.User.ssn}
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
                  label="Email Address"
                  required="*"
                  value={this.state.User.emailaddress}
                  placeholder="username@example.com"
                  className={classnames('form-control', { error: !!this.state.errors.emailaddress})}
                  onChange={this.onChange}
                />
                <span>{this.state.errors.emailaddress}</span>
            </div>
        </div>
        </div>
        <div className="row form-group">
        <div className="col-sm-6">
        <label className="row col-sm-12 control-label">Gender</label>
            <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 1)}>
              <input
                type='radio'
                name='gender'
                id='one'
                checked={this.state.checked === 1}
              />
              <label htmlFor="typeofdiscount"><span>Male</span></label>
            </div>

            <div className="am-radio inline" onClick={this.handlePromotionCheck.bind(this, 2)}>
              <input
                type='radio'
                name='gender'
                id='two'
                checked={this.state.checked === 2}
              />
              <label htmlFor="typeofdiscount"><span>Female</span></label>
            </div>
          </div>


          <div className="col-sm-6">
          <div className={classnames('form-group', { error: !!this.state.errors.role_value})}>
            <label>Role<span className="required">*</span></label>
            <Select
              name="rolevalue"
              value={this.state.role_value}
              options={roleOptions}
              onChange={this.updateRole}
              />
              <span>{this.state.errors.role_value}</span>
          </div>
          </div>
        </div>


        <div className="row form-group">

{/*       <div className="col-sm-6">
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
export default EditUserForm;
