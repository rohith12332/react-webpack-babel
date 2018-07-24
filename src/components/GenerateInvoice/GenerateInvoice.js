import React, { Component } from 'react';
import DefaultLayout from '../common/DefaultLayout'
import axios from 'axios';
import { Link } from 'react-router';
import getUserDetails from '../common/CredentialDomain';
import InvoiceFilter from './InvoiceFilter';


class GenerateInvoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      invoicenum:"",
      stores: [],
      poList: [],
      wareHouseList: [],
      masterData: [],
      fromWareHouse:[],
      toStore:[],
      storeId: "",
      selectedPo: "",
      canSubmit: false,
      pageHead: {
        pagehead: 'Invoice Generation',
        dashboard: 'Dashboard',
        setup: 'Setup'
      }
    }
  }
  componentDidMount = () => {
    this.GetWareHouseStores();
    this.GetinvNum();
   
  }
  

  GetinvNum = () => {
     let that = this;
    let reqQuery = {};
    reqQuery["userdetails"] = getUserDetails();
    //console.log(JSON.stringify(reqQuery))
    
    axios.post(`${process.env.API_HOST}/ManageCreatePoNumber.svc/GetPurchasenumber/json`, reqQuery)
      .then(function (response) {
        that.setState({
            invoicenum : response.data.Invnum
                     
          });
      })
  }
  
  GetWareHouseStores = () => {
    let that = this;
    let reqQuery = {};
    reqQuery["warehouse_id"] = window.sessionStorage.getItem("storeid");
    reqQuery["userdetails"] = getUserDetails();
    //console.log(JSON.stringify(reqQuery))
    axios.post(`${process.env.API_HOST}/ManageWareHouse.svc/GetWareHouseStores/json`, reqQuery)
      .then(function (response) {
        if (response.data.StoresList == null) response.data.StoresList = [];
        that.setState({
          stores: response.data.StoresList
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getselectStore = (element) => {
    this.setState({
      storeId: element
    })
    this.GetStorePoList(element)
  }
  getselectPo = (element) => {
    this.setState({
      selectedPo: element,
      canSubmit:true
    })
    this.GetinvNum();
    this.GetWareHousePODetails(element)
  }

  GetStorePoList = (element) => {
    let that = this;
    let reqQuery = {};
    reqQuery["store_id"] = element.value;
    reqQuery["userdetails"] = getUserDetails();
    console.log(JSON.stringify(reqQuery))
    axios.post(`${process.env.API_HOST}/ManageWareHouse.svc/GetStorePoList/json`, reqQuery)
      .then(function (response) {
        //console.log(response)
        if (response.data.poList == null) response.data.poList = [];

        that.setState({
          poList: response.data.poList
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  GetWareHousePODetails = (element) => {
    let that = this;
    let reqQuery = {};
    reqQuery["store_id"] = this.state.storeId.value;
    reqQuery["po_id"] = element;
    reqQuery["userdetails"] = getUserDetails();
    console.log(JSON.stringify(reqQuery))

    axios.post(`${process.env.API_HOST}/ManageWareHouse.svc/GetStorePODetails/json`, reqQuery)
      .then(function (response) {
        console.log(response)
        if (response.data.wareHouseList == null) response.data.wareHouseList = [];
        that.setState({
          wareHouseList: response.data.wareHouseList,
          fromWareHouse: response.data.fromWareHouse,
          toStore: response.data.toStore
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getMasterData = (data) => {
    this.setState({
      masterData: data
    })
  }

  handleSubmit = (data) => {
    var that = this;
    let reqQuery = {};

    var grdtot = $('.grdtot').val();

    var podate = $('.podate').text();
    //console.log(poDate)

      return false;

    reqQuery["store_id"] = this.state.storeId.value;
    reqQuery["po_id"] = this.state.selectedPo;
    reqQuery["userdetails"] = getUserDetails();
    reqQuery["wareHouseList"] = data;
    reqQuery["grandtotal"] = grdtot;
    //reqQuery["wareHouseList"]["ponumber"] = poDate;
    reqQuery["invoicebarcode"] = this.state.invoicenum;

    console.log(JSON.stringify(reqQuery))
    axios.post(`${process.env.API_HOST}/ManageWareHouse.svc/UpdateWareHouseDetails/json`, reqQuery)
    .then(function (response) {
      console.log(response)
      // if (response.data.wareHouseList == null) response.data.wareHouseList = [];
      // that.setState({
      //   wareHouseList: response.data.wareHouseList
      // });
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    console.log(this.state)
    let currentDomain = window.sessionStorage.getItem("currentdomainname");
    let currentStore = window.sessionStorage.getItem("currentstorename");
    const { pageHead, stores, poList} = this.state;

    // get store name and id
    let storeList = stores.map(function (o) {
      return {
        label: o.name,
        value: o.id
      }
    })
    let poMapList = poList.map(function (o) {
      return {
        label: o.name,
        value: o.id
      }
    })    
    return (
      <DefaultLayout>
        <div className="page-head inner__pageHead">
          <div className="domain-icon"><img src={require('./invoice.svg')} /><h2>{pageHead.pagehead}</h2></div>
          <ol className="breadcrumb">
            <li><Link to={`/domains`}>{currentDomain}</Link></li>
            <li><Link to={`/stores`}>{currentStore}</Link></li>
            <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
            <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
            <li><Link to={`/InventoryLanding`}>Inventory</Link></li>
            <li className="active">{pageHead.pagehead}</li>
          </ol>
        </div>
        <main>
          <div className="master-table">
            <InvoiceFilter
              storeList={storeList}
              poMapList={poMapList}
              getselectStore={this.getselectStore}
              getselectPo={this.getselectPo}
              wareHouseList={this.state.wareHouseList}
              handleSubmit={this.handleSubmit}
              fromWareHouse={this.state.fromWareHouse}
              invoicenum={this.state.invoicenum}
              toStore={this.state.toStore}
            />
          </div>
        </main>
      </DefaultLayout>
    )
  }
}
export default GenerateInvoice;
