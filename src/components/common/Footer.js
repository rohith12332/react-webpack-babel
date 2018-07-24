import React from 'react';

class Footer extends React.Component {
	render(){
		return(
			<footer>
				<div className="login-copyright">©2017 OnePOS Retail Solutions. All Rights Reserved.</div>
				<div className="login-powered-wrap">
					<div className="login-powered-text">Powered By</div>
					<div className="login-powered-logo"> <img src={require( './powered-logo.png')} alt=""/> </div>
				</div>
			</footer>
		)
	}
}
export default Footer;