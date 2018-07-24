import React, { Component } from 'react'
import { Link } from 'react-router'
import Select from 'react-select';

export default class TableRows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      masterData: [],
      selectedOption: 0,
      grtotal:"",
      action_value: {}
    };
  }

  handleOnChange = (e, item) => {
    var replaceUnderscore = e.target.name.replace(/_.*/, '');
    item[replaceUnderscore] = parseInt(e.target.value);

    var subtotal = item["approvedqty"] * item["unitprice"];
    item["totalamount"] =  subtotal.toFixed(2);
    var masterData = this.props.wareHouseList;

    this.props.getMasterData(masterData)

    this.setState({
      selectedOption: e.target.value
    });
  }


  handleAction = (element) => {
    console.log(element)
    this.setState({
      action_value: element
    });
  }
  handleonclick=(e,item)=>
  {
    var masterData = [];
    masterData=this.props.wareHouseList;
    var itemid=item.Id;
    console.log(itemid);
    console.log(masterData)
    var ind= masterData.findIndex(x => x.id === itemid);
    masterData.splice( ind,1 );
    console.log(masterData)
    this.setState({
      masterData:masterData
    });
    
    
  }

  render() {
    let total = 0;
    $(function(){
      $('.pnm, .subtot, .grdtot, .Id, .productname, .requestqty, .currentstock').prop('readonly', true);
      var $tblrows = $("#wareHouseOrderTable tbody tr");

      $tblrows.each(function (index) {
          var $tblrow = $(this);
          function calculation(){
            var qty = $tblrow.find("[name=approvedqty]").val();
            var price = $tblrow.find("[name=unitprice]").val();
            var subTotal = parseInt(qty, 10) * parseFloat(price);
            if (!isNaN(subTotal)) {

                $tblrow.find('.subtot').val(subTotal.toFixed(2));
                var grandTotal = 0;

                $(".subtot").each(function () {
                    var stval = parseFloat($(this).val());
                    grandTotal += isNaN(stval) ? 0 : stval;
                });

                $('.grdtot').val(grandTotal.toFixed(2));
            }
          }

          $tblrow.find('.approvedqty').on('change', function () {
            calculation();
          });
          $tblrow.find('.unitprice').on('change', function () {
            calculation();
          });
      });
    });


    var actionStatus=[{label:"Approve",value:"approve"},{label:"Reject",value:"reject"}]
    const items = this.props.wareHouseList.map((item, i) => {
    let totalPrice = item.approvedqty * item.unitprice;
    total = total + totalPrice;
          return(
            <tr key={i}>
              <td data-name="Id" style={{'display':'none'}}><input className="Id" name="Id" type="text" defaultValue={item.Id}/></td>
              <td data-name="productname"><input className="productname" name="productname" type="text" defaultValue={item.productname} /></td>
              <td data-name="requestqty"><input className="requestqty" name="requestqty" type="text" defaultValue={item.requestqty} /></td>
              <td data-name="currentstock"><input className="currentstock" name="currentstock" type="text" defaultValue={item.currentstock} /></td>
              <td data-name="approvedqty">
                <input
                  className="approvedqty"
                  name="approvedqty"
                  type="smarttext"
                  defaultValue={item.approvedqty}
                  onChange={ (e) => this.handleOnChange(e, item) }
                />
              </td>
              <td data-name="unitprice">
                <input
                  className="unitprice"
                  name="unitprice"
                  type="smarttext"
                  defaultValue={item.unitprice}
                  onChange={ (e) => this.handleOnChange(e, item) }
                />
              </td>
              <td data-name="totalamount"><input className="subtot" name="subtot" type="text" defaultValue={totalPrice} /></td>
              <td data-name="action" style={{textAlign:'center'}}>

                <div className="col-md-6">
                <div className="row">
                {/* <select name={"action_" + item.Id} onChange={this.handleAction}>
                  <option value="0">Approve</option>
                  <option value="1">Reject</option>
                </select> */}
                <label>
                    <input
                      type="radio"
                      name={"status_" + item.Id}
                      value="0"
                      checked={true}
                      onChange={ (e) => this.handleOnChange(e, item) }
                    />
                   &nbsp; Approve
                  </label>
                </div>
                </div>
                <div className="col-md-6">
                <div className="row">
                <label> 
                    <input
                      type="radio"
                      name={"status_" + item.Id}
                      value="1"
                      onClick={ (e) => this.handleonclick(e, item) }
                    />
                   &nbsp; Reject
                  </label>
                   
                </div>
                </div>
              </td>
            </tr>
          )
    })
    $('.grdtot').val(total.toFixed(2));
    return (
      <tbody>
        {items}
      </tbody>
    )
  }
}
