import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import TextInput from '../common/TextInput';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import getUserDetails from '../common/CredentialDomain';
import axios from 'axios';
import jsPDF from 'jspdf';

class PurchaseSearchTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        showModal:false,
        purchasechildorderList: [],
        pochildList:{
          name:"",
          enteredon:""
        }
    }
  }


  makePDF () {
    var quotes = document.getElementById('invoiceGeneration');
    html2canvas(quotes, {
      onrendered:function(canvas) {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;

        //The height of the canvas which one pdf page can show;
        var pageHeight = contentWidth / 592.28 * 841.89;
        console.log(pageHeight);
        //return false;
        //the height of canvas that haven't render to pdf
        var leftHeight = contentHeight;
        //addImage y-axial offset
        var position = 0;
        //a4 format [595.28,841.89]
        var imgWidth = 595.28;
        var imgHeight = 592.28/contentWidth * contentHeight;

        var pageData = canvas.toDataURL('image/png', 1.0);

        var pdf = new jsPDF('', 'pt', 'a4');
        pdf.page = 1;
        function footer(){
          pdf.text(150,285, 'page ' + pdf.page);
          pdf.page ++;
        };

         if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight );
        } else {
          while(leftHeight > 0) {
            pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 841.89;
            //avoid blank page
            if(leftHeight > 0) {
              pdf.addPage();
              //footer()
            }
          }
        }
        pdf.save('PurchaseOrder.pdf');
      }
    })
}

getSinglePurchaseOrder = (id) => {
    var that = this;
    var reqQuery = {};
    var purchaseorderid = id;
      reqQuery['userdetails'] = getUserDetails();
      reqQuery['purchaseorderid'] = purchaseorderid;
      console.log(JSON.stringify(reqQuery))

    axios.post(`${process.env.API_HOST}/ManagePurchaseOrder.svc/GetSinglePurchaseOrder/json`, reqQuery)
    .then(function(response){

        console.log(response);
        that.setState({
            pochildList:response.data.purchaseorderinfo,
            showModal:true
        })

        axios.post(`${process.env.API_HOST}/ManagePurchaseChildOrder.svc/GetAllPurchaseChildOrder/json`, reqQuery)
        .then(function(response){
            console.log(response);
        if(response.data.purchasechildorderList == null) response.data.purchasechildorderList = [];
        that.setState({
            purchasechildorderList: response.data.purchasechildorderList
        })
      }).catch(function (error) {
          console.log("Bad Response");
      });



    }).catch(function (error) {
        console.log("Bad Response");
    });
  }

    // call get single
    // set that response to new state as well show Modal true
    // pass that state to modal
close = () => {
    this.setState({showModal: false})
}
render(){
    console.log(this.props)
    console.log(this.state)
    var viewItems = this.state.purchasechildorderList.map((item, i) => (
        <tr key={i}>
            <td data-title={i++}>{i}</td>
            <td>{item.name}</td>
            <td>{item.qty}</td>
        </tr>
    ))

      var items = this.props.purchaseorderlist.map((item, i) => (
          <tr key={i}>
              <td>{item.name}</td>
              <td>{item.enteredon}</td>
              <td>
                   <button onClick={(e) => this.getSinglePurchaseOrder(item.id)}> view </button>
              </td>
          </tr>
      ))
    return(
        <div className="col-md-12" style={{marginTop: 30}}>
            {this.props.showSearchTable &&
            <table className="display nowrap table table-productgroup-items" id="paymentSales">
                <thead>
                    <tr>
                        <th style={{color:'white', backgroundColor:'#4ecdc4'}}> Purchase Order </th>
                        <th style={{color:'white', backgroundColor:'#4ecdc4'}}> Date  </th>
                        <th style={{color:'white', backgroundColor:'#4ecdc4'}}> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>}

            {this.props.showSearchTable &&
             <Modal show={this.state.showModal}  onHide={this.close} backdrop={false} keyboard={false} id="purchaseOrderTable">
                  <Modal.Body>
                  <div className="row">
                      <div className="col-md-12" style={{marginTop:40}}>
                      <div style={{textAlign: 'center'}}>
                            <a id="btnExportPdf" style={{textAlign: 'center'}} onClick={this.makePDF}>
                              <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                              <br />PDF</a>
                          </div>
                        <div id="invoiceGeneration" style={{'width':768, 'marginLeft':'auto','marginRight':'auto','padding':20}}>
                        <table className="table" cellPadding="20">

                        <tr>
                          <td colSpan="2" style={{'textAlign':'center'}}>
                            <h2>PURCHASE ORDER</h2>
                          </td>
                        </tr>

                        <tr>
                        <td style={{verticalAlign:'top'}}>
                        <strong>Store Address:</strong> {this.props.poaddress.FromStore.address1}
                        {this.props.poaddress.FromStore.city},<br />
                        {this.props.poaddress.FromStore.state},
                        {this.props.poaddress.FromStore.country}
                        {this.props.poaddress.FromStore.zipcode}<br />
                        <strong>Phone</strong>: {this.props.poaddress.FromStore.phonenumber}
                        </td>
                          <td style={{textAlign:'right', verticalAlign:'top'}}>
                            <strong>PO Number :</strong>{this.state.pochildList.name}<br />
                            <strong>PO Date :</strong>{this.state.pochildList.enteredon}<br />
                          </td>
                        </tr>
                        <tr>
                          <td style={{height: 40, textAlign:'right'}}></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td style={{textAlign:'right', verticalAlign:'top'}}>

                          {/* <img src={require('./barcode.gif')} width="260"/> */}
                          </td>
                        </tr>
                        <tr>
                          <td style={{height: 40, textAlign:'right'}}></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                          &nbsp;
                          </td>
                        </tr>
                          <tr>
                            <td style={{verticalAlign:'top'}}>
                            <table width="90%">
                              <tr>
                                <td>
                                  <h2 style={{backgroundColor:'rgb(78, 205, 196)', color:'white', fontSize:16, padding: 10}}>Vendor Details:</h2>
                                  {this.props.poaddress.ToVendor.address1}
                                  {this.props.poaddress.ToVendor.city},<br />
                                  {this.props.poaddress.ToVendor.state},
                                  {this.props.poaddress.ToVendor.country}
                                  {this.props.poaddress.ToVendor.zipcode}<br />
                                  <strong>Phone</strong>: {this.props.poaddress.ToVendor.phonenumber}
                                </td>
                              </tr>
                              </table>
                            </td>
                            <td style={{textAlign:'right'}}>
                              <table width="100%" style={{textAlign:'left'}} border="0">
                              <tr>
                                <td>
                                  <h2 style={{backgroundColor:'rgb(78, 205, 196)', color:'white', fontSize:16, padding: 10}}>Billing Address:</h2>
                                  {this.props.poaddress.FromStore.address1}
                                  {this.props.poaddress.FromStore.city},<br />
                                  {this.props.poaddress.FromStore.state},
                                  {this.props.poaddress.FromStore.country}
                                  {this.props.poaddress.FromStore.zipcode}<br />
                                  <strong>Phone</strong>: {this.props.poaddress.FromStore.phonenumber}
                                </td>
                              </tr>
                              </table>

                            </td>
                          </tr>
                          <tr>
                            <td style={{height: 30}}></td>
                            <td style={{height: 30}}></td>
                            </tr>

                          <tr>
                            <td colSpan="2">
                            <table className="table" border="0">
                            <tr style={{backgroundColor:'#556270'}}>
                              <th style={{padding:10, color:'white'}}>SN.</th>
                              <th style={{padding:10, color:'white'}}>Product Name</th>
                              <th style={{padding:10, color:'white'}}>Request Qty</th>
                            </tr>
                              {viewItems}
                            </table>
                            </td>
                          </tr>
                        </table>
                        <div style={{textAlign:'center', fontWeight:'bold'}}>This is computer generated purchase order and do not require any stamp or signature</div>
                        </div>
                      </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button className="btn-cancel" onClick={this.close}>Close</Button>
                </Modal.Footer>
              </Modal>}
        </div>
    )
  }
}
export default PurchaseSearchTable;
