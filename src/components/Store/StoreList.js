import React, {PropTypes} from 'react';
import { browserHistory, Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';
var StoreImage = require('./shop.svg');
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Select from 'react-select';
import FormControl from 'react-bootstrap/lib/FormControl';
import storeCore from './storeCore';
import Confirm from 'react-confirm-bootstrap';

class StoreList extends React.Component {
 constructor(props) {
  super(props);
  this.state = {
  }
  this.onConfirm = this.onConfirm.bind(this);
}

onConfirm(item) {
  this.props.deleteStore(item);
}

/*removeRecord (item){
  this.props.deleteStore(item);
}*/

getStore(item,type){
  this.props.getSingleStore(item,type);
}
// editStore(item, type){
//   this.props.getSingleStoreEdit(item,type);
// }
getStoreId(item){
  console.log(item);
  window.sessionStorage.setItem('iswarehouse', item.iswarehouse);
  window.sessionStorage.setItem('storeuniquekey', item.storeuniquekey);
  window.sessionStorage.setItem('storeid', item.storeid);
  window.sessionStorage.setItem('currentstorename', item.name);
  window.sessionStorage.setItem('currentstoreaddress', item.address1 + ' ' + item.city + ' ' +item.country);
  if(item.iswarehouse == false){
    browserHistory.push('/dashboard');
  }else{
    browserHistory.push('/geninvoice');
  }
  window.sessionStorage.setItem('storecountry', item.country);

  browserHistory.push('/dashboard');
}

  render(){
    var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));

     var items = this.props.stores.map((item, i) => (
      <div key={i} className="col-sm-4 col-md-4 col-lg-3 tile-pos-store col-center mainScreen">
       <span className="store-wrap">
         <Link className="center-block" onClick={this.getStoreId.bind(this, item)}>
           <img src={StoreImage} alt={item.name} className="store-tile-image svg-image" />
           <h3 className="store-name">{item.name}</h3>
           <p className="store-description">{item.city}</p>
         </Link>
         {!credentials.storeuser && <div className="store-link store-editwrap">
         <div className="stre-hoverlinks">
           <ul>
              <li>
                <Confirm
                  onConfirm={this.onConfirm.bind(this, item)}
                  body="Are you sure you want to delete this?"
                  confirmText="Confirm Delete"
                  className="btn-store-bin"
                  title="Deleting Store">
                  <a className="btn-store-bin"><i className="icon icon-014"></i></a>
                </Confirm>
              </li>
             <li><a data-modal="addstore" className="btn-store-edit md-trigger" onClick={this.getStore.bind(this, item,'Edit')}><i className="icon icon-516"></i></a></li>
             <li><a data-modal="addstore" className="btn-store-edit md-trigger" onClick={this.getStore.bind(this, item,'View')}><i className="fa fa-eye"></i></a></li>
           </ul>
         </div>
         </div>}


       </span>
       </div>
    ))
    return(
      <div className="clearfix">{items}</div>
    )
  }
}
export default StoreList;
