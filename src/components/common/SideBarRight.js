import React from 'react';

class SideBarRight extends React.Component {
	render(){
		return(
		  <nav className="am-right-sidebar">
		    <div className="sb-content">
		      <div className="sidebar-header">Support</div>
		      <div className="sidebar-container-wrap">
		        <div className="support-link">Online: <a href="">https://help.onepos.com</a></div>
		      </div>
		      <div className="sidebar-header">Notifications</div>
		    </div>
		  </nav>			
		)
	}
}
export default SideBarRight;