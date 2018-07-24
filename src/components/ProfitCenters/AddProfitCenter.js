import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox1 from '../common/Checkbox1';
import Checkbox from '../common/Checkbox';
import { browserHistory, Link } from 'react-router';
import Select from 'react-select';
import TextInput from '../common/TextInput';
import getUserDetails from '../common/CredentialDomain';
import classnames from 'classnames';
import './ProfitCenter.css';
var _ = require('underscore');


class AddProfitCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msgFailure: "",
            msgSuccess: "",
            errors: {},
            pageHead: {
            pagehead: 'Add Profit Center',
            dashboard: 'Dashboard',
            setup: 'Setup'
        },
        productGroupsId: [],
        taxGroupList: [],
        SelectedTaxGroupId: '',
        ProductGroups: [],
        profitcenter: {
            "createdby": "",
            "createddate": "",
            "id": "1627aea5-8e0a-4371-9022-9b504344e724",
            "isdeleted": false,
            "modifiedby": "",
            "modifieddate": "",
            "name": "",
            "store_id": "1627aea5-8e0a-4371-9022-9b504344e724",
            "surchargeableproductgroups": [],
            "surchargegroupid": null,
            "taxableproductgroups": [],
            "taxgroupid": null,
        }
        }
    this.updateCountry = this.updateCountry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
      event.preventDefault();
      var that = this;
      var isValid = this.handleValidation();


      if (isValid) {
        const addProfitCenter = {};
        var profitCenter = this.state.profitcenter;
        if (this.state.SelectedTaxGroupId != '') profitCenter.taxgroupid = this.state.SelectedTaxGroupId;
        var prdgrplen = this.state.productGroupsId.length;
        var prodtgroups = [];
        for (var i = 0; i < prdgrplen; i++) {
          prodtgroups.push({
            "id": this.state.productGroupsId[i]
          });
        }
        profitCenter.taxableproductgroups = prodtgroups;
        addProfitCenter["ProfitCenter"] = profitCenter;
        addProfitCenter["userdetails"] = getUserDetails();
        const request = new Request(`${process.env.API_HOST}/ManageProfitCenters.svc/CreateProfitCenter/json`, {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(addProfitCenter)
        });
        return fetch(request).then(response => {
          if (response.status >= 400) throw new Error("Bad response from server");
          return response.json();
        }).then(function(data) {
          if (data.statusCode !== 200) {
            that.setState({
              msgFailure: data.statusMessage,
            })
            setTimeout(function() {
                that.setState({
                    msgFailure:''
                })
            }, 5000)
          } else {
            that.setState({
              msgSuccess: data.statusMessage
            })
            setTimeout(function() {
                that.setState({
                    msgSuccess:''
                })
                browserHistory.push('/ProfitCenters')
            }, 5000)
          }
        }).catch(error => {
          return error;
        });
      }
    }
    onReset(event) {
      browserHistory.push('/ProfitCenters')
    }
    onChange(event) {
      const field = event.target.name;
      var profitcenter = {};
      profitcenter = this.state.profitcenter;
      profitcenter[field] = event.target.value;
      this.setState({
            profitcenter: profitcenter
        });
      if (!!this.state.errors[event.target.name]) {
        let errors = Object.assign({}, this.state.errors);
        delete errors[event.target.name];
        this.setState({
          errors
        });
      }
    }
    componentDidMount() {
      this.getAllProductGroups();
      this.getTaxGroups();
    }

    getTaxGroups() {
      var that = this;
      var reqQuery = {};
      reqQuery['userdetails'] = getUserDetails();
      const request = new Request(`${process.env.API_HOST}/ManageTaxes.svc/GetTaxGroups/json`, {
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
        if(data.taxGroupList == null) data.taxGroupList = [];
        that.setState({
          taxGroupList: data.taxGroupList
        });
      });
    }

    updateCountry(element) {
      this.setState({
        SelectedTaxGroupId: element.value
      });
    }

    handleChange(event) {
      let field = event.target.name;
      if (event.target.type == 'checkbox') {
        var arrayProductgroupIds = [];
        arrayProductgroupIds = this.state.productGroupsId;
        var found = jQuery.inArray(field, arrayProductgroupIds);
        if (found >= 0) {
          if (event.target.checked == false) arrayProductgroupIds.splice(found, 1);
        } else {
          if (event.target.checked == true) arrayProductgroupIds.push(field);
        }
        this.setState({
          poductGroupsId: arrayProductgroupIds
        })
      }
    }
    getAllProductGroups() {
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
      fetch(request).then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      }).then(function(data) {
        if (data.productsList == null) data.productsList = [];
        var totalProducts = data.productsList.length;
        var productsdata = [];
        for (var i = 0; i < totalProducts; i++) {
          productsdata.push(data.productsList[i].name, data.productsList[i].id);
        }
        that.setState({
          ProductGroups: data.productsList
        });
      });
    }

  validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }

handleValidation() {
    let errors = {};
    //Form validation error message
    var profitcenter = this.state.profitcenter;
    if (profitcenter.name === '') {
      document.getElementById("name").focus();
      errors.name = "ProfitCenter name can't be empty"
    }

    this.setState({
      errors
    }); //Set Errors state
    return Object.keys(errors).length == 0;
  }

render() {
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
        var that = this;
        const {
          pageHead,
          msgFailure,
          msgSuccess,
          taxGroupList,
          ProductGroups
        } = this.state;
        const format = 'h:mm a';
        const active = "day-active";
        const inactive = "";
        var taxGroup = taxGroupList.map(function(o) {
          return {
            label: o.name,
            value: o.id
          }
        })
        var prdtGroup = ProductGroups.map(function(o) {
          return {
            label: < li > < Checkbox1
            onChange = {
              that.handleChange
            }
            checked = {
              that.state.handleChange
            }
            name = {
              o.id
            }
            id = {
              o.id
            }
            label = {
              o.name
            }
            />  < /li>
          }
        })

return(

    <DefaultLayout>
        <div className="page-head inner__pageHead">
            <div className="domain-icon"> <img src={require( './profit-center-head.svg')}/> <h2>{pageHead.pagehead}</h2></div>
                <ol className="breadcrumb">
                  <li><Link to={`/domains`}>{currentDomain}</Link></li>
                  <li><Link to={`/stores`}>{currentStore}</Link></li>
                  <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                  <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                  <li className="active">{pageHead.pagehead}</li>
                </ol>
        </div>
        <main>
          {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
        {msgSuccess}  </div>}
      <div className="row">
        <div className="col-sm-12 ">
          <div className="addproduct-wrap">
            <div className="widget widget-small">
              <form action="#" className="">
                <div className={classnames('form-group', { error: !!this.state.errors.name})}>
                <TextInput
                type="text"
                name="name"
                label="Profit Center Name"
                value={this.state.profitcenter.name}
                defaultValue={this.state.profitcenter.name}
                placeholder=""
                required="*"
                onChange={this.onChange}
                className={classnames('form-control', { error: !!this.state.errors.name})}
                />
          <span>{this.state.errors.name}</span>
          </div>
              <div className="form-group">
              <label>Tax Group<span className="required"></span></label>
                        <Select
                    name="taxGroup"
                    value={this.state.SelectedTaxGroupId}
                    options={taxGroup}
                    onChange={this.updateCountry}
                  />
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <div className="tabbable-panel profit-center-tabbing">
              <div className="tabbable-line">
                <ul className="nav nav-tabs ">
                  <li className="active"> <a href="#taxconfiggroup" data-toggle="tab">Product Groups to  Tax</a> </li>

                </ul>
                <div className="tab-content">
                  <div className="tab-pane active" id="taxconfiggroup">
                    <div className="tabing-header">
                      <h2>Product Groups to  Tax</h2>
                      <p>Plese select form the list of available produt groups to assign profit centers tax group</p>
                    </div>
                    <div className="row">
                  <div className="col-sm-12">
                    <div  className="product-box">
                      <div className="product-box-head">Available Product Groups</div>
                      <div id="addProfitCenter"  className="product-box-wrap">
                        <div className="am-scroller nano">
                          <div className="content nano-content">
                            <div className="product-box-list">
                              <ul>

                                {prdtGroup.map((prdtGroup) =>
                                  prdtGroup.label
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </div>

                </div>
              </div>
            </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-sm-12 form-bot-butn-wrap">
              <div className="form-bot-butns round-btns">
                <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Save</button>
                <button type="reset"  className="btn btn-default" onClick={this.onReset}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    </DefaultLayout>
    )
  }
}
export default AddProfitCenter;