import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

const ExpenseReport = (props) => {
	//var data = props.inventorystockreport;
	var j = 1;
	var items = props.ExpenseReports.map((item, i) => (
		<tr key={i}>
			<td style={{backgroundColor:'#f2f2f2',borderBottom:'2px solid white'}}>{j++}</td>
			<td style={{backgroundColor:'#e6ffff',borderBottom:'2px solid white'}}>{item.CreatedDate}</td>
			{<td style={{backgroundColor:'#f2f2f2',borderBottom:'2px solid white'}}>{item.Name}</td>}
			<td style={{backgroundColor:'#e6ffff',borderBottom:'2px solid white'}}><NumberFormat
				value={item.Amount}
				displayType={'text'}
				thousandSeparator={true}
				decimalPrecision={2}
			/></td>
		</tr>
	))
	console.log(items.productname)
	return (
		<table className="display nowrap table table-productgroup-items" id="paymentSales">
			<thead>
				<tr>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>SLNo</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Time & Date</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4', }}>Description</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4',}}>Amount</th>
				</tr>
			</thead>
			{items}
		</table>
	)
}
export default ExpenseReport;
