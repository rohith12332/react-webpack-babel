import React, { Component } from 'react'

export default class TableHeader extends Component {
  render() {
    return (
        <thead>
            <tr style={{backgroundColor: '#202e47', color: 'white'}}>
                <th>Product</th>
                <th>Requested Qty</th>
                <th>Current Stock</th>
                <th>Approved Qty</th>
                <th>Unit Price</th>
                <th style={{width:180}}>Total Price</th>
                <th style={{textAlign:'center'}}>Action</th>
            </tr>
        </thead>
    )
  }
}
