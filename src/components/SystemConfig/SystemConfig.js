import React from "react";
import DefaultLayout from "../common/DefaultLayout";
import Button from "react-bootstrap/lib/Button";
import Checkbox from "../common/Checkbox";
import Select from "react-select";
import ImageUpload from "./ReactImageUpload";
import "./ReactImageUpload.css";
import { browserHistory, Router, Route, Link, withRouter } from "react-router";
import TextInput from "../common/TextInput";
import classnames from "classnames";
import moment from "moment";
import TimePicker from "rc-time-picker";
import getCurrentDate from "../common/Date";

class SystemConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgFailure: "",
      msgSuccess: "",
      errors: {},
      isLoading: true,
      Start_time: moment(),
      SelectedTimeOut: 30,
      PrintTimeOut: [],
      pageHead: {
        pagehead: "System",
        dashboard: "Dashboard",
        setup: "Setup"
      },

      SysConfig: {
        ProductDefaultImage: null,
        allowcardonfile: true,
        allowduplicatetables: true,
        autoclosebusinessday: true,
        bottomreceiptmessage: "",
        businessdayofweekstartday: "Monday",
        businessdaystarttime: moment(),
        canaccepttips: true,
        createdby: "",
        createddate: "",
        dailyhighwatermark: 1,
        emailmanagersathighwater: true,
        forceorderonscreentimeout: true,
        id: "1627aea5-8e0a-4371-9022-9b504344e724",
        isdeleted: true,
        modifiedby: "",
        modifieddate: "",
        name: "",
        ordertimeoutinminutes: 2,
        printemployeecheckwithzerosales: true,
        printqueuetimeout: 2,
        receiptline1: "",
        receiptline2: "",
        receiptline3: "",
        receiptline4: "",
        roundexclusivetaxdown: true,
        roundinclusivetaxdown: true,
        store_id: "1627aea5-8e0a-4371-9022-9b504344e724",
        storecode: "",
        tablerecheckminutes: 2,
        tinno: "",
        topreceiptmessage: ""
      }
    };
    this.dayofweek = this.dayofweek.bind(this);
    this.StartTimePicker = this.StartTimePicker.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.Close = this.Close.bind(this);
    this.getPreview = this.getPreview.bind(this);
    this.convertDataURIToBinary = this.convertDataURIToBinary.bind(this);
  }

  componentDidMount() {
    this.getSysConfig();
  }

  Close(event) {
    browserHistory.push("Setup");
  }

  onChange(event) {
    const field = event.target.name;

    var Sysconfig = {};

    Sysconfig = this.state.SysConfig;

    Sysconfig[field] = event.target.value;
    this.setState({ SysConfig: Sysconfig });
    if (!!this.state.errors[event.target.name]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors[event.target.name];
      this.setState({ errors });
    }
  }
  convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ";base64,";
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  getPreview(file) {
    var sysconfig = this.state.SysConfig;
    console.log(sysconfig);

    sysconfig["ProductDefaultImage"] = this.convertDataURIToBinary(file);

    this.setState({
      SysConfig: sysconfig
    });

    /*
      var SysConfig = this.state.SysConfig;
      SysConfig['ProductDefaultImage'] = this.convertDataURIToBinary(file);
     // console.log(SysConfig['ProductDefaultImage']);
      this.setState({
        SysConfig: SysConfig
    })*/
  }

  updateCountry(element) {
    this.setState({
      SelectedTimeOut: element.value
    });
  }
  close(event) {
    browserHistory.push("/setup");
  }

  getSysConfig() {
    var that = this;
    var credentials = {};
    var sysid = "1627aea5-8e0a-4371-9022-9b504344e724";
    var storeuniquekey = window.sessionStorage.getItem("storeuniquekey");
    var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");

    if (
      credentials["ProductDefaultImage"] == null ||
      credentials["ProductDefaultImage"] == ""
    ) {
      credentials["ProductDefaultImage"] = null;
    } else {
      if (typeof credentials["ProductDefaultImage"] == "string") {
        credentials["ProductDefaultImage"] = this.convertDataURIToBinary(
          credentials["ProductDefaultImage"]
        );
      }
    }

    credentials["SysConfigID"] = sysid;
    credentials["userdetails"] = JSON.parse(
      window.sessionStorage.getItem("userDetails")
    );
    credentials["userdetails"]["storeuniquekey"] = storeuniquekey;
    credentials["userdetails"]["domainuniquekey"] = domainuniquekey;

    const request = new Request(
      `${process.env.API_HOST}/ManageSysConfig.svc/GetSysConfig//json`,
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(credentials)
      }
    );
    fetch(request)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var sysconfigdata = data.SysConfig;
        console.log(data.SysConfig)
        let st = moment(sysconfigdata.businessdaystarttime,'YYYY-MM-DD h:mm:ss a');
        var selectedtimeout = sysconfigdata.printqueuetimeout;
        var timeout = [];
        timeout.push({ label: 30, value: 30 });
        timeout.push({ label: 60, value: 60 });
        timeout.push({ label: 90, value: 90 });
        timeout.push({ label: 120, value: 120 });
        timeout.push({ label: 150, value: 150 });
        timeout.push({ label: 180, Value: 180 });
        timeout.push({ label: 210, value: 210 });
        timeout.push({ label: 240, value: 240 });
        timeout.push({ label: 270, value: 270 });
        timeout.push({ label: 300, value: 300 });
        timeout.push({ label: 330, value: 330 });

        that.setState({
          SysConfig: sysconfigdata,
          PrintTimeOut: timeout,
          Start_time: st,
          SelectedTimeOut: selectedtimeout
        });
      });
  }

  dayofweek(event) {
    //alert(event.target.name);
    var Sysconfigedit = this.state.SysConfig;
    Sysconfigedit.businessdayofweekstartday = event.target.name;
    return this.setState({
      SysConfig: Sysconfigedit
    });
  }

  validatePMpmornot(value) {
    var expr = /PM/; // no quotes her
    return expr.test(value);
  }

  StartTimePicker(value) {

    var newVal = value && value.format('YYYY-MM-DD h:mm:ss a');
    let timeBusiness = moment(newVal, 'YYYY-MM-DD h:mm:ss a');
    console.log(timeBusiness)

    this.setState(
      {
        Start_time: timeBusiness
      }
    );

    if (!!this.state.errors["businessdaystarttime"]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors["businessdaystarttime"];
      this.setState({ errors });
    }
  }

  handleChange(event) {
    let field = event.target.name;
    var sysconfig = this.state.SysConfig;
    if (event.target.type == "checkbox") {
      sysconfig[field] = event.target.checked;
      return this.setState({ SysConfig: sysconfig });
    }
  }

  handleValidation() {
    let errors = {};
    //Form validation error message

    var sysconfig = this.state.SysConfig;

    /*if (sysconfig.name === '') {
        errors.name = "System name can't be empty";
      }*/

    /*if (sysconfig.printqueuetimeout === '') {
        errors.printqueuetimeout = "This should not be null";
      }*/

    if (sysconfig.businessdaystarttime === "") {
      errors.businessdaystarttime = "start Time can't be empty";
    }

    if (sysconfig.receiptline1 === "") {
      errors.receiptline1 = "Business name can't be empty";
    }

    if (sysconfig.receiptline2 === "") {
      errors.receiptline2 = "Address Should not be empty";
    }

    this.setState({ errors }); //Set Errors state

    return Object.keys(errors).length == 0;
  }

  onSubmit(event) {
    var that = this;
    var reqQuery = {};
    var isValid = this.handleValidation();
    var domainuniquekey = window.sessionStorage.getItem("domainuniquekey");
    var storeuniquekey = window.sessionStorage.getItem("storeuniquekey");
    var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
    credentials["domainuniquekey"] = domainuniquekey;
    credentials["storeuniquekey"] = storeuniquekey;
    if (isValid) {
      const updateSysConfig = {};

      if (
        updateSysConfig["ProductDefaultImage"] == null ||
        updateSysConfig["ProductDefaultImage"] == ""
      ) {
        updateSysConfig["ProductDefaultImage"] = null;
      } else {
        if (typeof updateSysConfig["ProductDefaultImage"] == "string") {
          updateSysConfig["ProductDefaultImage"] = this.convertDataURIToBinary(
            updateSysConfig["ProductDefaultImage"]
          );
        }
      }

      var SysConfigdata = this.state.SysConfig;

      let st = moment(this.state.Start_time).format('YYYY-MM-DD HH:mm:ss');
      SysConfigdata["businessdaystarttime"] = st;
      SysConfigdata["printqueuetimeout"] = this.state.SelectedTimeOut;
      reqQuery["SysConfig"] = SysConfigdata;
      reqQuery["userdetails"] = credentials;
      console.log(reqQuery)

      const request = new Request(
        `${process.env.API_HOST}/ManageSysConfig.svc/UpdateSysConfig/json`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(reqQuery)
        }
      );

      return fetch(request)
        .then(response => {
          if (response.status == 400)
            throw new Error("Bad response from server");

          return response.json();
        })
        .then(function(data) {
          if (data.statusCode !== 200) {
            that.setState({
              msgFailure: data.statusMessage
            });
          } else {
            that.setState({
              msgSuccess: data.statusMessage
            });
            window.scrollTo(0, 0);
            setTimeout(function() {
              browserHistory.push("/setup");
            }, 2000);
          }
        })
        .catch(error => {
          return error;
        });
    }
    // }
  }

  render() {
    console.log(this.state)
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    const format = "h:mm a";
    const active = "day-active";
    const inactive = "";
    const {
      pageHead,
      SysConfig,
      Start_time,
      PrintTimeOut,
      msgFailure,
      msgSuccess,
    } = this.state;


    //let Start_time = moment(this.state.Start_time,'YYYY-MM-DD');
    console.log(this.state.SysConfig.ProductDefaultImage)


    return (
      <DefaultLayout>
        <div className="page-head inner__pageHead">
          <div className="domain-icon">
            {" "}
            <img src={require("./SETUP.svg")} /> <h2>{pageHead.pagehead}</h2>
          </div>
          <ol className="breadcrumb">
            <li>
              <Link to={`/domains`}>{currentDomain}</Link>
            </li>
            <li>
              <Link to={`/stores`}>{currentStore}</Link>
            </li>
            <li>
              <Link to={`/dashboard`}>{pageHead.dashboard}</Link>
            </li>
            <li>
              <Link to={`/setup`}>{pageHead.setup}</Link>
            </li>
            <li className="active">{pageHead.pagehead}</li>
          </ol>
        </div>
        <main>
          {msgFailure && (
            <div className="alert alert-warning alert-dismissible" role="alert">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              {msgFailure}
            </div>
          )}
          {msgSuccess && (
            <div className="alert alert-success alert-dismissible" role="alert">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              {msgSuccess}{" "}
            </div>
          )}
          <div className="row">
            <div className="col-sm-12 ">
              <div className="addproduct-wrap">
                <div className="widget widget-small">
                  <form action="#" className="">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="product-widget-head bottom20">
                          System Configuration
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Business Start Day of Week<span className="required">
                          *
                        </span>
                      </label>
                    </div>
                    <div className="days-select-wrap">
                      <ul>
                        <li>
                          <a
                            name="Monday"
                            className={
                              this.state.SysConfig.businessdayofweekstartday ==
                              "Monday"
                                ? active
                                : inactive
                            }
                            href="javascript:void(0)"
                            onClick={this.dayofweek}
                          >
                            M
                          </a>
                        </li>
                        <li>
                          <a
                            name="Tuesday"
                            className={
                              this.state.SysConfig.businessdayofweekstartday ==
                              "Tuesday"
                                ? active
                                : inactive
                            }
                            href="javascript:void(0)"
                            onClick={this.dayofweek}
                          >
                            T
                          </a>
                        </li>
                        <li>
                          <a
                            name="Wednesday"
                            className={
                              this.state.SysConfig.businessdayofweekstartday ==
                              "Wednesday"
                                ? active
                                : inactive
                            }
                            href="javascript:void(0)"
                            onClick={this.dayofweek}
                          >
                            W
                          </a>
                        </li>
                        <li>
                          <a
                            name="Thursday"
                            className={
                              this.state.SysConfig.businessdayofweekstartday ==
                              "Thursday"
                                ? active
                                : inactive
                            }
                            href="javascript:void(0)"
                            onClick={this.dayofweek}
                          >
                            T
                          </a>
                        </li>
                        <li>
                          <a
                            name="Friday"
                            className={
                              this.state.SysConfig.businessdayofweekstartday ==
                              "Friday"
                                ? active
                                : inactive
                            }
                            href="javascript:void(0)"
                            onClick={this.dayofweek}
                          >
                            F
                          </a>
                        </li>
                        <li>
                          <a
                            name="Saturday"
                            className={
                              this.state.SysConfig.businessdayofweekstartday ==
                              "Saturday"
                                ? active
                                : inactive
                            }
                            href="javascript:void(0)"
                            onClick={this.dayofweek}
                          >
                            S
                          </a>
                        </li>
                        <li>
                          <a
                            name="Sunday"
                            className={
                              this.state.SysConfig.businessdayofweekstartday ==
                              "Sunday"
                                ? active
                                : inactive
                            }
                            href="javascript:void(0)"
                            onClick={this.dayofweek}
                          >
                            S
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div
                      className={classnames("form-group", {
                        error: !!this.state.errors.businessdaystarttime
                      })}
                    >
                      <label className="control-label">
                        Business Start Time of The Day
                      </label>

                      <div className="input-group date datetimepicker">
                        <TimePicker
                          showSecond={false}
                          name="starttime"
                          //defaultValue={Start_time}
                          value={Start_time}
                          onChange={this.StartTimePicker}
                          className="form-control bordernull"
                          use12Hours
                        />
                        <span className="input-group-addon btn btn-primary">
                          <i className="icon icon-213" />
                        </span>
                      </div>
                      <span>{this.state.errors.businessdaystarttime}</span>
                    </div>

                    <div className="form-group">
                      <label>
                        Print Job Timeout (seconds)<span className="required">
                          *
                        </span>
                      </label>
                      <Select
                        name="printqueuetimeout"
                        value={this.state.SelectedTimeOut}
                        options={PrintTimeOut}
                        onChange={this.updateCountry}
                      />
                    </div>

                    <Checkbox
                      onChange={this.handleChange}
                      checked={
                        this.state.SysConfig.printemployeecheckwithzerosales ===
                        true
                      }
                      name="printemployeecheckwithzerosales"
                      id="printemployeecheckwithzerosales"
                      label="Print Employee Checkout with $0 sales"
                    />

                    <Checkbox
                      onChange={this.handleChange}
                      checked={
                        this.state.SysConfig.forceorderonscreentimeout === true
                      }
                      name="forceorderonscreentimeout"
                      id="forceorderonscreentimeout"
                      label="Send Order on Screen Saver Timeout"
                    />

                    <Checkbox
                      onChange={this.handleChange}
                      checked={this.state.SysConfig.canaccepttips === true}
                      name="canaccepttips"
                      id="canaccepttips"
                      label="Can Accept Tips"
                    />
                  </form>
                </div>

                <ImageUpload
                  getPreview={this.getPreview}
                  getImage={this.state.SysConfig.ProductDefaultImage}
                  title="Product Default Image"
                />

                <div className="widget widget-small">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="product-widget-head bottom20">
                        Address Configuration
                      </div>
                    </div>
                  </div>
                  <form action="#" className="">
                    <div
                      className={classnames("form-group", {
                        error: !!this.state.errors.receiptline1
                      })}
                    >
                      <TextInput
                        type="text"
                        name="receiptline1"
                        label="Business Name"
                        value={this.state.SysConfig.receiptline1}
                        defaultValue={this.state.SysConfig.receiptline1}
                        placeholder=""
                        onChange={this.onChange}
                        className={classnames("form-control", {
                          error: !!this.state.errors.receiptline1
                        })}
                      />
                      <span>{this.state.errors.receiptline1}</span>
                    </div>

                    <div
                      className={classnames("form-group", {
                        error: !!this.state.errors.receiptline2
                      })}
                    >
                      <TextInput
                        type="text"
                        name="receiptline2"
                        label="Address Line 1"
                        value={this.state.SysConfig.receiptline2}
                        defaultValue={this.state.SysConfig.receiptline2}
                        placeholder=""
                        onChange={this.onChange}
                        className={classnames("form-control", {
                          error: !!this.state.errors.receiptline2
                        })}
                      />
                      <span>{this.state.errors.receiptline2}</span>
                    </div>

                    <div
                      className={classnames("form-group", {
                        error: !!this.state.errors.receiptline3
                      })}
                    >
                      <TextInput
                        type="text"
                        name="receiptline3"
                        label="Address Line 2"
                        value={this.state.SysConfig.receiptline3}
                        defaultValue={this.state.SysConfig.receiptline3}
                        placeholder=""
                        onChange={this.onChange}
                        className={classnames("form-control", {
                          error: !!this.state.errors.receiptline3
                        })}
                      />
                      <span>{this.state.errors.receiptline3}</span>
                    </div>

                    <div
                      className={classnames("form-group", {
                        error: !!this.state.errors.receiptline4
                      })}
                    >
                      <TextInput
                        type="text"
                        name="receiptline4"
                        label="Business Phone"
                        value={this.state.SysConfig.receiptline4}
                        defaultValue={this.state.SysConfig.receiptline4}
                        placeholder=""
                        onChange={this.onChange}
                        className={classnames("form-control", {
                          error: !!this.state.errors.receiptline4
                        })}
                      />
                      <span>{this.state.errors.receiptline4}</span>
                    </div>

                    <div className="form-group">
                      <TextInput
                        type="text"
                        name="topreceiptmessage"
                        label="top receipt message"
                        value={this.state.SysConfig.topreceiptmessage}
                        defaultValue={this.state.SysConfig.topreceiptmessage}
                        placeholder=""
                        onChange={this.onChange}
                        className="form-group"
                      />
                    </div>

                    <div className="form-group">
                      <TextInput
                        type="text"
                        name="bottomreceiptmessage"
                        label="Receipt Bottom Message"
                        value={this.state.SysConfig.bottomreceiptmessage}
                        defaultValue={this.state.SysConfig.bottomreceiptmessage}
                        placeholder=""
                        onChange={this.onChange}
                        className="form-group"
                      />
                    </div>
                    <div className="form-group">
                      <TextInput
                        type="text"
                        name="storecode"
                        label="Store Code"
                        value={this.state.SysConfig.storecode}
                        defaultValue={this.state.SysConfig.storecode}
                        placeholder=""
                        onChange={this.onChange}
                        className="form-group"
                      />
                    </div>

                    <div className="form-group">
                      <TextInput
                        type="text"
                        name="tinno"
                        label="Tin No"
                        value={this.state.SysConfig.tinno}
                        defaultValue={this.state.SysConfig.tinno}
                        placeholder=""
                        onChange={this.onChange}
                        className="form-group"
                      />
                    </div>
                  </form>
                </div>
                <div className="col-sm-12 form-bot-butn-wrap">
                  <div className="form-bot-butns round-btns">
                    <button
                      type="submit"
                      onClick={this.onSubmit}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                    <button
                      type="Cancel"
                      onClick={this.Close}
                      className="btn btn-default"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </DefaultLayout>
    );
  }
}
export default SystemConfig;
