import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';

class PageHead extends Component{
  constructor(props) {
    super(props);
    this.state = {}
  }

	render(){
    var currentDomain = window.sessionStorage.getItem("currentdomainname");
		return(
          <div className="page-head">
            <div className="domain-icon"><img src={require('./domains-icon.svg')} /><h2>Stores</h2></div>
            <ol className="breadcrumb">
              <li><Link to={`/domains`}>{currentDomain}</Link> </li>
              <li className="active">Stores</li>
            </ol>
          </div>
		)
	}
}
export default PageHead;