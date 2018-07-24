import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

const Transaction = (props) => {
	//var data = props.inventorystockreport;
	var j = 1;
	var items = props.deleteditemslist.map((item, i) => (
		<tr key={i}>
			<td>{j++}</td>
			<td>{item.salecreateddate}</td>
			{<td>{item.billnumber}</td>}
			<td>{item.ordernumber}</td>
			<td><NumberFormat
				value={item.totalitemsprice}
				displayType={'text'}
				thousandSeparator={true}
				decimalPrecision={2}
			/></td>

			<td>{item.totalitemscount}</td>
		</tr>
	))
	return (
		<table className="display nowrap table table-productgroup-items" id="paymentSales">
			<thead>
				<tr>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>SLNo</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Date</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Bill Number</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Order Number</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Transaction Amount</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Items deleted</th>
				</tr>
			</thead>
			{items}
		</table>
	)
}
export default Transaction;