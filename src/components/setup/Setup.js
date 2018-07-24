import React from 'react';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import DefaultLayout from '../common/DefaultLayout'
import './setup.css';

class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
}

render(){
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    var storeuser = window.sessionStorage.getItem("storeuser");

    return (
    <DefaultLayout>
        <div className="page-head inner__pageHead">
            <div className="domain-icon"> <img src={require( './setup-main.svg')}/> <h2>Setup</h2></div>
            <ol className="breadcrumb">
            <li><Link to={`/domains`}>{currentDomain}</Link></li>
            <li><Link to={`/stores`}>{currentStore}</Link></li>
            <li className="active">Setup</li>
            </ol>
        </div>

        <main className="container-fluid boxed-container">
        {storeuser == 'false' && <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/users`}>
                    <img src={require( './Users.png')} alt=""/>
                    <h3>Users</h3>
                </Link>
            </div>}
            {storeuser == 'false' && <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/addrole`}>
                    <img src={require( './UserRoles.png')} alt=""/>
                    <h3>User Roles</h3>
                </Link>
            </div>}
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/printers`}>
                    <img src={require( './Printers.png')} alt=""/>
                    <h3>Printers</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/taxes`}>
                    <img src={require( './Taxes.png')} alt=""/>
                    <h3>Taxes</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/products`}>
                    <img src={require( './Products.png')} alt=""/>
                    <h3>Products</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/discounts`}>
                    <img src={require( './Discounts.png')} alt=""/>
                    <h3>Discounts</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/menus`}>
                    <img src={require('./Menus.png')} alt=""/>
                    <h3>Menus</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/dayparts`}>
                    <img src={require('./Day-Parts.png')}  alt=""/>
                    <h3>Day Parts</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/electronicpayments`}>
                    <img src={require('./Electronic-payments.png')}  alt=""/>
                    <h3>Electronic Payments</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/system`}>
                    <img src={require('./System.png')} alt=""/>
                    <h3>System</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/vendors`}>
                    <img src={require( './Vendor-Details.png')} alt=""/>
                    <h3>Vendor Details</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/terminal`}>
                    <img src={require('./Terminal.png')} alt=""/>
                    <h3>Terminal</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/tendertypes`}>
                    <img src={require('./Tender-Types.png')} alt=""/>
                    <h3>Tender Types</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/pricingintervals`}>
                    <img src={require( './pricing-intervals.png')}  alt=""/>
                    <h3>Pricing Intervals</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/profitcenters`}>
                    <img src={require('./Profit-Centers.png')}  alt=""/>
                    <h3>Profit Centers</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/syslog`}>
                    <img src={require('./Syslog-Viewer.png')} alt=""/>
                    <h3>Syslog Viewer</h3>
                </Link>
            </div>
        </main>
    </DefaultLayout>
     )

 }
}
export default Setup;
