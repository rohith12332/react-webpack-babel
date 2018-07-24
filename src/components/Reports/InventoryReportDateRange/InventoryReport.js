import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

const InventoryReport = (props) => {
	//var data = props.inventorystockreport;
	var j = 1;
	var items = props.salecuminvsummaryreport.map((item, i) => (
		<tr key={i}>
			<td>{j++}</td>
			<td>{item.upc}</td>
			<td>{item.productname}</td>
			<td>{item.measuringname}</td>
			{<td>{item.openingbalance}</td>}
			<td>{item.inventoryadd}</td>
			<td><NumberFormat
				value={item.total}
				displayType={'text'}
				thousandSeparator={true}
				decimalPrecision={2}
			/></td>
{/*			<td><NumberFormat
				value={item.countofsale}
				displayType={'text'}
				thousandSeparator={true}
				decimalPrecision={2}
			/></td>*/}
			<td>{item.countofsales}</td>
			<td>{item.invdamage}</td>
			<td>{item.shopdamage}</td>
			<td>{item.autoclosingbalance}</td>
			<td>{item.manualclosingbalance}</td>

		</tr>
	))
	return (
		<table className="display nowrap table table-productgroup-items" id="paymentSales">
			<thead>
				<tr>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>SLNo</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Barcode</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Product Name</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Measuring Type</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Opening Balance</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Invoice Count</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Total Count</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Sales</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Invoice Damage</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Shop Damage</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Auto Closing Balance</th>
					<th style={{ color: 'white', backgroundColor: '#4ecdc4' }}>Manual Closing Balance</th>
				</tr>
			</thead>
			{items}
		</table>
	)
}
export default InventoryReport;
