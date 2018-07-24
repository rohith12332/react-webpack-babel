import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

const Inventory = (props) => {
    //var data = props.inventorystockreport;
    var items = props.inventorystockreport.map((item, i) => (
        <tr key={i}>
            <td>{item.productname}</td>
            {<td>{item.sku}</td>}
            <td>{item.measuringunit}</td>
            <td><NumberFormat
              value={item.onhandqty}
              displayType={'text'}
              thousandSeparator={true}
              decimalPrecision={2}
            /></td>

            <td>{item.sellingprice}</td>

            <td><NumberFormat
              value={item.unitprice}
              displayType={'text'}
              thousandSeparator={true}
              decimalPrecision={2}
            /></td>
        </tr>
    ))
    return(
        <table className="display nowrap table table-productgroup-items" id="paymentSales">
            <thead>
                <tr>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>Product Name</th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>SKU</th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>Measuring Unit</th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>Onhand Qty</th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>Selling Price</th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>Unit Price</th>
                </tr>
            </thead>
        {items}
        </table>
    )
}
export default Inventory;