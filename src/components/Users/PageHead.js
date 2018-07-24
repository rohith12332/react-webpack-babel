import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';
import Breadcrumbs from '../common/Breadcrumbs';
class PageHead extends Component{
	render(){
		return(
      <div className="page-head">
          <div className="domain-icon"> <img src={require( './user-list.svg')}/> </div>
          <h2>Users</h2>
          <Breadcrumbs />
        </div>	
		)
	}
}
export default PageHead;