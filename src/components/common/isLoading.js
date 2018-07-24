import React, {Component} from 'react';
class SplashScreen extends Component{
	render(){
		return(
	        <div className="c-loaderWrapper">
	            <div className="c-loader"></div>
	            <div className="loader-section section-left"></div>
	            <div className="loader-section section-right"></div>
	        </div>
		)
	}
}
export default SplashScreen;