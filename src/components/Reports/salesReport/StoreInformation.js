import React from 'react';

class StoreInformation extends React.Component {
 constructor(props) {
  super(props);
  this.state = {
  }
}	
render(){
	var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
	var storename = window.sessionStorage.getItem("storename");

	return (
		<div>
		    {!credentials.storeuser && <div className="storeInformation">
		        <h1>Sales Report</h1>
		        <h2>Welcome to the <strong>{this.props.currentStore}</strong></h2>
		    </div>}
		    {credentials.storeuser && <div className="storeInformation">
		        <h1>Sales Report</h1>
		        <h2>Welcome to the <strong>{storename}</strong></h2>
		    </div>}		    
		</div>
		)
	}
}
export default StoreInformation;