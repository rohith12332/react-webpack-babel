import React, {Component} from 'react';
import NumberFormat from 'react-number-format';

class ReportBinChild extends Component{
	render(){
		//console.log(this.props)

/*		var items = this.props.data[this.props.count].map((item, i) => (
			<tr key={i}>
				<td>{item.count}</td>
				<td>{item.productname}</td>
				<td><NumberFormat value={item.percentofsales} displayType={'text'} thousandSeparator={true} decimalPrecision={2} /></td>
				<td><NumberFormat value={item.totalmenuprice} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
				<td><NumberFormat value={item.totaldiscount} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
				<td><NumberFormat value={item.totalrevenue} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
			</tr>
		))*/

		var sumpercentofsales = 0;
		var sumtotalmenuprice = 0;
		var sumtotaldiscount = 0;
		var sumtotalrevenue = 0;

		var items = this.props.data[this.props.count].map(function(item, i){

             sumpercentofsales = sumpercentofsales + item.percentofsales;
             sumtotalmenuprice = sumtotalmenuprice + item.totalmenuprice;
             sumtotaldiscount = sumtotaldiscount + parseInt(item.totaldiscount);
             sumtotalrevenue = sumtotalrevenue + parseInt(item.totalrevenue);

/*

             */

             //sum = sum + parseInt(item.totalmenuprice);
             //sum = sum + parseInt(item.totalmenuprice);
			return(
			<tr key={i}>
				<td>{item.count}</td>
				<td>{item.productname}</td>
				<td><NumberFormat value={item.percentofsales} displayType={'text'} thousandSeparator={true} decimalPrecision={2} /></td>
				<td><NumberFormat value={item.totalmenuprice} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
				<td><NumberFormat value={item.totaldiscount} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
				<td><NumberFormat value={item.totalrevenue} displayType={'text'} thousandSeparator={true} decimalPrecision={2}/></td>
			</tr>
			)
		})
			console.log(sumpercentofsales)
		//console.log(sum)

		return(
		<div>
		 <table className="display nowrap table table-productgroup-items">
		    <thead>
		       <tr>
		          <th>Count</th>
		          <th>Product Name</th>
		          <th>% of Sales</th>
		          <th>Gross Revenue</th>
		          <th>Total Discounts</th>
		          <th>Net Revenue</th>
		       </tr>
		    </thead>
		    <tbody>
		      {items}
		    </tbody>
		 </table>

		<table width="70%" style={{'float':'right'}}>
		<tr><td style={{'height':'40px'}}>&nbsp;</td></tr>

		</table>
		<div className="clearfix"></div>
   		<table width="70%" style={{'float':'right', 'padding': '6px'}} className="tableGroupSum">
			<thead>
   			<tr>
   				<th>% of Sales</th>
   				<th>Gross Revenue</th>
   				<th>Total Discounts</th>
   				<th>Net Revenue</th>
   			</tr>
   			</thead>
			<tbody>

   			<tr>
   				<td><NumberFormat value={sumpercentofsales} displayType={'text'} thousandSeparator={true} decimalPrecision={2} /></td>
   				<td><NumberFormat value={sumtotalmenuprice} displayType={'text'} thousandSeparator={true} decimalPrecision={2} /></td>
   				<td><NumberFormat value={sumtotaldiscount} displayType={'text'} thousandSeparator={true} decimalPrec
   				ision={2} /></td>
   				<td><NumberFormat value={sumtotalrevenue} displayType={'text'} thousandSeparator={true} decimalPrecision={2} /></td>
   			</tr>
			   <tr><td style={{'height':'40px'}}>&nbsp;</td></tr>
   			</tbody>
   		</table>
		</div>
		)
	}
}
export default ReportBinChild;