import React from 'react';

const RevenueType = (props) => (
	<tr className="paymentSalesCell">
		<td>{props.revenueType.revenueType}</td>
		<td>{props.revenueType.grosssalesforrevtype}</td>
		<td>{props.revenueType.comps}</td>
		<td>{props.revenueType.promos}</td>
		<td>{props.revenueType.voids}</td>
		<td>{props.revenueType.netsalesforrevenuetype}</td>
	</tr>
)
export default RevenueType;

