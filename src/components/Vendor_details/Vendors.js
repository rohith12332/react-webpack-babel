import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import SideBarRight from '../common/SideBarRight';
import VendorList from './VendorList';
import getUserDetails from '../common/CredentialDomain';
import { browserHistory, Link } from 'react-router';


class Vendors extends React.Component {
	constructor(props) {
      super(props);
      this.state = {
      pageHead:{
          pagehead:'Vendor Details',
          dashboard:'Dashboard',
          setup: 'Setup'
      },
        vendors: [],
      	msgFailure:"",
        msgSuccess:""
      },
      this.onRemoveVendor = this.onRemoveVendor.bind(this);
}


    componentDidMount() {
      this.getAllVendors();
    }

	onRemoveVendor(vendorid){
    var id;
    var DelVendor = {};
    var that = this;
    id = vendorid;

    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var credentials = getUserDetails();
    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;

    var index = -1;
    var _totalvendors = this.state.vendors.length;
    for( var i = 0; i < _totalvendors; i++ ) {
      if(this.state.vendors[i].id == vendorid){
        index = i;
        break;
      }
    }
    this.state.vendors.splice( index, 1 );
    this.setState( {vendors: this.state.vendors});

    DelVendor['vendorid'] = vendorid;
    DelVendor['userdetails'] = getUserDetails();
    DelVendor['isdeleted'] = true;

    console.log(JSON.stringify(DelVendor));

    const request = new Request(`${process.env.API_HOST}/MangaeVendorAccount.svc/DeleteVendorAccount/json`, {
      method: 'POST',
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify(DelVendor)
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
          browserHistory.push('/vendors')
        }, 5000)*/
      }
    }).catch(function(error) {
      return error;
    })
  }


  getAllVendors() {
    var that = this;
    var credentials = {};
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['index'] = 2147483647;
    credentials['recordcount'] = 2147483647;
    credentials["userdetails"] = getUserDetails();
    credentials["userdetails"]['storeuniquekey'] = storeuniquekey;

    const request = new Request(`${process.env.API_HOST}/ManageVendorAccount.svc/GetAllVendors/json`, {
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
        that.setState({
          vendors: data.VendorAccountsList
        });
      });
  }


    render(){
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    	const {msgSuccess, msgFailure,vendors,pageHead} = this.state;
    	return(
        <DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './domains-icon.svg')}/> <h2>{pageHead.pagehead}</h2> </div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                      <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
            </div>
        <main>
        <div className="master-table">
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgSuccess}
        </div>}
            <div className="row">
              <div className="col-sm-12">
                <div className="" id="VendorsDetails">
                  <div className="">
                    <VendorList vendors={vendors} onRemoveVendor={this.onRemoveVendor}/>
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
export default Vendors;
