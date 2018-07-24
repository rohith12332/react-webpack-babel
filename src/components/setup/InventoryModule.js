import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import Footer from '../common/Footer';
import { browserHistory, Link } from 'react-router';

class InventoryModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageHead:{
        pagehead:'Inventory Details',
        dashboard: 'Dashboard',
        setup: 'Setup'
      }
    }
  }

  render(){
    const {pageHead} = this.state;
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");
    return (
    <DefaultLayout>

            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './Inventory.svg')}/> <h2>{pageHead.pagehead}</h2> </div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
            </div>

          <main className="container-fluid">
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/invoices`}>
                    <img src={require( './Invoice Details.png')} alt=""/>
                    <h3>Invoice</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/inventory`}>
                    <img src={require( './Inventory-details.png')} alt=""/>
                    <h3>Inventory</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/geninvoice`}>
                    <img src={require( './Inventory-details.png')} alt=""/>
                    <h3>Invoice Generation</h3>
                    </Link>
              </div>

             <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`/purchaseorder`}>
                    <img src={require('./Purchase-orderdetails.png')} alt=""/>
                    <h3>Purchase Order</h3>
                </Link>
            </div>
        </main>

    </DefaultLayout>
  )

  }
}
export default InventoryModule;