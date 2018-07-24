import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';


class Reports extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        pageHead:{
            pagehead:'Reports',
            dashboard: 'Dashboard',
            setup: 'reports'
        }
    }
  }

  render(){
    const {pageHead} = this.state;
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
    var currentStore = window.sessionStorage.getItem("currentstorename");

    var userdata = JSON.parse(window.sessionStorage.getItem("userdata"));
    var accesslevelinfo = {};
    if(userdata.accesslevelinfo === undefined){
        accesslevelinfo = {
            master: true,
            sales: true
        }
    }else{
        accesslevelinfo = userdata.accesslevelinfo;
    }

    //accesslevelinfo = JSON.parse(window.sessionStorage.getItem("accesslevelinfo"));

  	return (
      <DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"><img src={require( './reports.svg')}/> <h2>{pageHead.pagehead}</h2> </div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
            </div>
           <main className="container-fluid">
           {accesslevelinfo.sales == true  && <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`reports/SalesReportWrap`}>
                    <img src={require( './Sales.png')} alt=""/>
                    <h3>Sales</h3>
                </Link>
            </div>}
            {accesslevelinfo.master == true  && <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`reports/masterReport`}>
                    <img src={require('./Sales.png')} alt=""/>
                    <h3>Master</h3>
                </Link>
            </div>}
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`reports/InventoryStockReport`}>
                    <img src={require('./Sales.png')} alt=""/>
                    <h3>Inventory Stock Report</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`reports/deletedItemsListReport`}>
                    <img src={require('./Sales.png')} alt=""/>
                    <h3>EXCEPTIONAL REPORTS</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`reports/InventoryReport`}>
                    <img src={require('./Sales.png')} alt=""/>
                    <h3>Inventory Report</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`reports/ExpenseReport`}>
                    <img src={require('./Sales.png')} alt=""/>
                    <h3>Expense Report</h3>
                </Link>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 setup__Item">
                <Link to={`reports/ProfitAndLoss`}>
                    <img src={require('./Sales.png')} alt=""/>
                    <h3>Profit And Loss</h3>
                </Link>
            </div>
        </main>


{/*            <div className="row">
        <div className="col-sm-12">
          <div className="product-elements">
            <ul>
              <li> <Link to={`SalesReport`}> <img src={require( './Sales.png')} alt=""/> <span>Master</span> </Link> </li>
              <li> <Link to={`SalesReportWrap`}> <img src={require( './Sales.png')} alt=""/> <span>Sales</span> </Link> </li>
              <li> <Link to={`/users`}> <img src={require( './Discounts.png')} alt=""/> <span>Discounts</span> </Link> </li>
              <li> <Link to={`/users`}> <img src={require( './Payroll.png')} alt=""/> <span>Payroll</span> </Link> </li>
              <li> <Link to={`/users`}> <img src={require( './Checkouts.png')} alt=""/> <span>Checkouts</span> </Link> </li>
              <li> <Link to={`/users`}> <img src={require( './One-Touch.png')} alt=""/> <span>One Touch</span> </Link> </li>
              <li> <Link to={`/users`}> <img src={require( './Employees.png')} alt=""/> <span>Employees</span> </Link> </li>
              <li> <Link to={`/users`}> <img src={require( './Find-Order.png')} alt=""/> <span>Find Order</span> </Link> </li>
              <li> <Link to={`/users`}> <img src={require( './view-Order.png')} alt=""/> <span>View Order</span> </Link> </li>
              </ul>
            </div>
          </div>
        </div>*/}
      </DefaultLayout>

  )
 }
}

export default Reports;
