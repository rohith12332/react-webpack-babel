import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import TextInput from '../common/TextInput';

var modifiedRowValue = [];
class PurchaseTable extends React.Component {

    constructor(props) {
    super(props)
    this.state = {
        requestqty:"",
        disableSave: true
    }
  }

  changeQTY = (event) => {
    this.setState({disableSave: false})
    var field = event.target.value;
    //$('#'+event.target.id).css('background','red');
    var id = $('#'+event.target.id);
    $(id).parent().attr('data-title', field)
  }


  render(){
    console.log(this.state)
    var items = this.props.purchaseorderlist.map((item, i) => (
        <tr key={i}>
            <td data-name="id" style={{display:'none'}} data-title={item.id}>{item.id}</td>
            <td data-name="productid" style={{display:'none'}} data-title={item.productid}>{item.productid}</td>
            <td data-name="productupc" data-title={i++}>{i}</td>
            <td data-name="productname" data-title={item.productname}>{item.productname}</td>
            <td data-name="maxfloorqty" data-title={item.maxfloorqty}>{item.maxfloorqty}</td>
            <td data-name="avalialableqty" data-title={item.avalialableqty}>{item.avalialableqty}</td>
            <td data-name="requestqty" data-title={item.requestqty}>
                <input
                    type="text"
                    name="requestqty"
                    id={item.id}
                    label=""
                    className="form-control"
                    defaultValue={item.requestqty}
                    onChange={this.changeQTY}
                    style={{padding: 5,height: 30, marginTop: 3, marginBottom: 3, marginRight: 0}}
                />
            </td>
        </tr>
    ))
    return(
        <div className="col-md-12" style={{marginTop: 30}}>
        {!this.props.purchaseorderlist.length == 0 &&
        <table className="display nowrap table table-productgroup-items" id="poTable">
            <thead>
                <tr>
                    <th style={{color:'white', backgroundColor:'#4ecdc4',display:'none'}}></th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4',display:'none'}}></th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>SN.</th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>Product Name </th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4'}}>MaxFloor Qty </th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4', 'width':150}}>On Hand Qty </th>
                    <th style={{color:'white', backgroundColor:'#4ecdc4', 'width':150}}>Request Qty </th>
                </tr>
            </thead>
            <tbody>
                {items}
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{textAlign:'right'}}>
                        {/* <button type="reset" className="btn btn-default md-trigger" data-modal="full-danger" onClick={this.props.onReset} style={{textAlign:'right', marginTop: 30}}>Cancel</button> */}
                    </td>
                    <td>
                        <button
                            disabled={this.state.disableSave}
                            type="submit"
                            className="btn btn-primary md-trigger"
                            data-modal="full-success"
                            onClick={this.props.generatePO}
                            style={{textAlign:'right', marginTop: 30}}>Create Now
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>}
        </div>
    )
  }
}
export default PurchaseTable;
