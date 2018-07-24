import React from 'react';
import { Route, IndexRoute } from 'react-router';
import auth from './auth/authenticator';

import App from './components/App';
import LogInPage from './components/Login/LogInPage';
import Domains from './components/Domains/Domains';
import Stores from './components/Store/Store';
import Dashboard from './components/dashboard/index';
import UserList from './components/Users/Users';
import AddUser from './components/Users/AddUser';
import EditUser from './components/Users/EditUser';
import AddUserRole from './components/Users/AddUserRole';
import DayParts from './components/DayParts/DayParts';
import TenderTypes from './components/TenderTypes/TenderTypes';

import ProfitCenters from './components/ProfitCenters/ProfitCenters';
import AddProfitCenter from './components/ProfitCenters/AddProfitCenter';
import EditProfitCenter from './components/ProfitCenters/EditProfitCenter';
import PricingIntervals from './components/PricingIntervals/PricingIntervals';
import system from './components/SystemConfig/SystemConfig';

import ElectronicPayments from './components/ElectronicPayments/ElectronicPayment';
import AddElectronicPayment from './components/ElectronicPayments/AddElectronicPayment';
import EditElectronicPayment from './components/ElectronicPayments/EditElectronicPayment';
import Setup from './components/setup/Setup';
import InventoryModule from './components/setup/InventoryModule';
import Inventory from './components/Inventory/Inventory';
import AddInventory from './components/Inventory/AddInventory';
import EditInventory from './components/Inventory/EditInventory';

import GenerateInvoice from './components/GenerateInvoice/GenerateInvoice';

import Invoice from './components/Invoices/Invoices';
import AddVendor from './components/Vendor_details/AddVendor';
import Vendors from './components/Vendor_details/Vendors';
import EditVendor from './components/Vendor_details/EditVendor';
import TabContainer from './components/Printers/TabContainer';
import MainContainer from './components/Taxes/MainContainer';
import MenuTabContainer from './components/Menus/MenuTabContainer';
import SyslogViewer from './components/SyslogViewer/SyslogViewer';
import Discounts from './components/Discounts/Discounts';
import TabProducts from './components/Products/TabContainer';
import AddProduct from './components/Products/AddProduct';
import EditProduct from './components/Products/EditProduct';
import Terminals from './components/Terminal/Terminals';
import AddTerminal from './components/Terminal/AddTerminal';
import EditTerminal from './components/Terminal/EditTerminal';
import UserProfile from './components/UserProfile/UserProfile';
import CustomerFeedback from './components/Feedback/Feedback';
import Reports from './components/Reports/Reports';
import salesReport from './components/Reports/salesReport/salesReport';
import MasterReport from './components/Reports/MasterReport/MasterReport';
import SalesReportWrap from './components/Reports/SalesReportBy/salesReportWrap';
import InventoryReport from './components/Reports/InventoryReport/InventoryReport';
import ProfitAndLoss from './components/Reports/ProfitAndLossReport/ProfitAndLoss';
import InventoryReportDateRange from './components/Reports/InventoryReportDateRange/InventoryReportDateRange';
import ExpenseReportMain from './components/Reports/ExpenseReport/ExpenseReportMain';
import PurchaseOrder from './components/PO/PurchaseOrder';
import DeletedItemsListReport from './components/Reports/DeletedItemsListReport/DeletedItemsListReport';
import NotFound from './components/NotFound';
import FlexBox from './components/FlexBox';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={LogInPage} />
    <Route path="/login"   component={LogInPage} />
    <Route path="/receipt"   component={CustomerFeedback} onEnter={requireAuth} />
    <Route path="/domains" component={Domains} onEnter={requireAuth, accessAuth} />
    <Route path="/stores"  component={Stores} onEnter={requireAuth} />
    <Route path="/users"    component={UserList} onEnter={requireAuth} />
    <Route path="/users/new" component={AddUser} onEnter={requireAuth} />
    <Route path="/users/:id" component={EditUser} onEnter={requireAuth} />
    <Route path="/addrole"   component={AddUserRole} onEnter={requireAuth} />
    <Route path="/dayparts"  component={DayParts} onEnter={requireAuth} />
    <Route path="/profitcenters" component={ProfitCenters} onEnter={requireAuth} />
    <Route path="/tendertypes" component={TenderTypes} onEnter={requireAuth} />
    <Route path="/pricingintervals" component={PricingIntervals} onEnter={requireAuth} />
    <Route path="/system" component={system} onEnter={requireAuth} />
    <Route path="/electronicpayments" component={ElectronicPayments} onEnter={requireAuth} />
    <Route path="/electronicpayments/new" component={AddElectronicPayment} onEnter={requireAuth} />
    <Route path="/electronicpayments/:id" component={EditElectronicPayment} onEnter={requireAuth} />
    <Route path="/invoices" component={Invoice} onEnter={requireAuth} />
    <Route path="/inventory" component={Inventory} onEnter={requireAuth} />
    <Route path="/inventory/new" component={AddInventory} onEnter={requireAuth} />
    <Route path="/inventory/:id" component={EditInventory} onEnter={requireAuth} />
    <Route path="/geninvoice" component={GenerateInvoice} onEnter={requireAuth} />
    <Route path="/printers" component={TabContainer} onEnter={requireAuth} />
    <Route path="/menus" component={MenuTabContainer} onEnter={requireAuth} />
    <Route path="/dashboard" component={salesReport} onEnter={requireAuth} />
    <Route path="/setup" component={Setup} onEnter={requireAuth} />
    <Route path="/reports/salesReport" component={salesReport} onEnter={requireAuth} />
    <Route path="/InventoryLanding" component={InventoryModule} onEnter={requireAuth} />
    <Route path="/purchaseorder" component={PurchaseOrder} onEnter={requireAuth} />
    <Route path="/reports" component={Reports} onEnter={requireAuth} />
    <Route path="/vendors" component={Vendors} onEnter={requireAuth} />
    <Route path="/vendors/new" component={AddVendor} onEnter={requireAuth} />
    <Route path="/profitcenters/new" component={AddProfitCenter} onEnter={requireAuth} />
    <Route path="/profitcenters/:id" component={EditProfitCenter} onEnter={requireAuth} />
    <Route path="/vendors/:id" component={EditVendor} onEnter={requireAuth} />
    <Route path="/taxes" component={MainContainer} onEnter={requireAuth} />
    <Route path="/discounts" component={Discounts} onEnter={requireAuth} />
    <Route path="/syslog" component={SyslogViewer} onEnter={requireAuth} />
    <Route path="/products" component={TabProducts} onEnter={requireAuth} />
    <Route path="/products/new" component={AddProduct} onEnter={requireAuth} />
    <Route path="/products/:id" component={EditProduct} onEnter={requireAuth} />
    <Route path="/terminal" component={Terminals} onEnter={requireAuth} />
    <Route path="/terminal/new" component={AddTerminal} onEnter={requireAuth} />
    <Route path="/terminal/:id" component={EditTerminal} onEnter={requireAuth} />
    <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
    <Route path="/reports" component={Reports} onEnter={requireAuth} />
    <Route path="/reports/salesReportWrap" component={SalesReportWrap} onEnter={requireAuth} />
    <Route path="/reports/masterReport" component={MasterReport} onEnter={requireAuth} />
    <Route path="/reports/InventoryStockReport" component={InventoryReport} onEnter={requireAuth} />
    <Route path="/reports/InventoryReport" component={InventoryReportDateRange} onEnter={requireAuth} />
    <Route path="/reports/ProfitAndLoss" component={ProfitAndLoss} onEnter={requireAuth} />
    <Route path="/reports/ExpenseReport" component={ExpenseReportMain} onEnter={requireAuth} />
    <Route path="/reports/deletedItemsListReport" component={DeletedItemsListReport} onEnter={requireAuth} />
    <Route path="/flexbox" component={FlexBox} />
    <Route path="*" component={NotFound} />
    </Route>
);
function requireAuth(nextState, replace) {
  if(!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function accessAuth(nextState, replace){
var superadmin = window.sessionStorage.getItem("superadmin");
var domainadmin = window.sessionStorage.getItem("domainadmin");
var storeuser = window.sessionStorage.getItem("storeuser");

    var currentLocation = location.pathname;

    if(auth.loggedIn() && domainadmin == 'true' && currentLocation =='/domains'){
        replace({
            pathname: '/stores'
        })
    }
    if(auth.loggedIn() && storeuser == 'true' ){
        replace({
            pathname: '/dashboard'
        })
    }
}
