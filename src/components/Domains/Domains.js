import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import { browserHistory, Link, IndexLink } from 'react-router';
import Header from '../common/Header';
import {bindActionCreators} from 'redux';
import './Domains.scss';

var DuckImage = require('./Liquor.png');

class Domains extends React.Component {
	constructor(props){
  super()
  this.state = {
     domains:[]
 }
 this.getDomainStores = this.getDomainStores.bind(this);
}
componentDidMount() {
  this.getDomains();
  document.body.classList.add('has-no-nav');
}
componentWillUnmount() {
  document.body.classList.remove('has-no-nav');
}
getDomains(){
  var domains = JSON.parse(window.sessionStorage.getItem("domains"));
  this.setState({
     domains: domains
 });
}

getDomainStores(item, event){
  event.preventDefault();
  window.sessionStorage.setItem('domainuniquekey', item.domainuniquekey);
  window.sessionStorage.setItem('currentdomainname', item.domainname);
  browserHistory.push('/stores');
}

  render(){
    const {domains} = this.state;
    console.log(this.state)
    var items = domains.map((item, index) => (
     <article key={index} className="col-sm-6 col-md-6 col-lg-3 tile-pos-product col-center ember-view">
       <Link to="#" onClick={this.getDomainStores.bind(this, item)} className={`${item.domainname} link-wrap`}>
         <div className="media"></div>{/*<img src={DuckImage} alt="" className="product-tile-image" />*/}
         <div className="tileName">{item.domainname}</div>
       </Link>
     </article>
    ))
    return(
      <div>
      <Header />
      <div className="am-wrapper am-nosidebar-left">
      <div className="am-content">
           <div className="main-content">
             <div className="contentful">
               <section className="section-grid-item-display">
                 <div className="container">
                   <div className="row">
                    {items}
                   </div>
                 </div>
               </section>
             </div>
           </div>
        </div>
      </div>
      </div>
    )
  }
}
export default Domains;