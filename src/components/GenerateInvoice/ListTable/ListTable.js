import React, { Component } from 'react'
import moment from 'moment'
import getCurrentDate from '../../common/Date'
import TableHeader from './TableHeader'
import TableFooter from './TableFooter'
import TableRows from './TableRows'
import TableAction from './TableAction'
import Barcode from '../Barcode'
import jsPDF from 'jspdf'

export default class ListTable extends Component {
  constructor(props){
    super(props);
    const date = moment(new Date()).format("DD-MM-YYYY");
    const poDate = moment(new Date()).format("DDMMYYYYHHmmss");

    this.state={
      masterData:[],
      showInvoice: false,
      date: date,
      poDate:poDate
    }

  }
  receiveMasterData = (data) =>{
    this.setState({
      masterData:data
    })
  }

  handleSubmit = (data) =>{
    this.props.handleSubmit(data);

    var vendorId = this.props.selectedStore;
    this.setState({
      masterData:data,
      showInvoice: true,

    })
    console.log(data)
    console.log(this.props.invoicenum)

  }


  makePDF = () => {
    var quotes = document.getElementById('invoiceGeneration');
    html2canvas(quotes, {
      onrendered: function(canvas) {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;

        //The height of the canvas which one pdf page can show;
        var pageHeight = contentWidth / 592.28 * 841.89;
        //return false;
        //the height of canvas that haven't render to pdf
        var leftHeight = contentHeight;
        //addImage y-axial offset
        var position = 0;
        //a4 format [595.28,841.89]
        var imgWidth = 595.28;
        var imgHeight = 592.28 / contentWidth * contentHeight;

        var pageData = canvas.toDataURL('image/png', 1.0);

        var pdf = new jsPDF('', 'pt', 'a4');
        pdf.page = 1;

        function footer() {
          pdf.text(150, 285, 'page ' + pdf.page);
          pdf.page++;
        };

        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 841.89;
            //avoid blank page
            if (leftHeight > 0) {
              pdf.addPage();
              //footer()
            }
          }
        }
        pdf.save('wareHouseOrderTable.pdf');
        $('#invoiceGeneration').css('display','none')
      }
    })
  }


  render() {
    const items = this.state.masterData.map((item, i) =>{
      return(
        <tr>
          <td style={{'padding':5}}>{item.productname}</td>
          <td style={{'padding':5}}>{item.requestqty}</td>
          <td style={{'padding':5}}>{item.approvedqty}</td>
          <td style={{'padding':5}}>{item.unitprice}</td>
          <td style={{'padding':5}}>{item.totalamount}</td>
        </tr>
      )
    })
    return (
      <div className="table-responsive1">
        <table className="reportTable display nowrap table table-striped table-hover" id="wareHouseOrderTable">
          <TableHeader />
          <TableRows
            wareHouseList={this.props.wareHouseList}
            getMasterData={this.receiveMasterData}
          />
          <TableFooter
            disableButton={this.props.disableButton}
            getMasterData={this.receiveMasterData}
            sendMasterData={this.state.masterData}
            handleSubmit={this.handleSubmit}
            wareHouseList={this.props.wareHouseList}
          />
        </table>
        {this.state.showInvoice && <div>
        <div className="row">
          <div className="col-md-12">
          <div style={{textAlign: 'center'}}>
                <a id="btnExportPdf" style={{textAlign: 'center'}} onClick={this.makePDF}>
                  <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                  <br />PDF</a>
              </div>
            <div id="invoiceGeneration" style={{'width':768, 'marginLeft':'auto','marginRight':'auto','padding':20}}>
            <table className="table" cellPadding="20">
            <tr>
              <td colSpan="2" style={{'textAlign':'center'}}>
                <h2>INVOICE GENERATION</h2>
              </td>
            </tr>

            <tr>
            <td style={{verticalAlign:'top'}}>
            <strong>Store Address:</strong> {this.props.toStore.address1} &nbsp;
            {this.props.toStore.city},<br />
            {this.props.toStore.state},
            {this.props.toStore.country} &nbsp;
            {this.props.toStore.zipcode}<br />
            <strong>Phone</strong>: {this.props.toStore.phonenumber}
            </td>
              <td style={{textAlign:'right', verticalAlign:'top'}}>
                <strong>Invoice Number :</strong>{this.props.invoicenum}<br/>
                <strong>Invoice Date :</strong>{this.state.date}
              </td>
            </tr>
            <tr>
              <td style={{height:0, textAlign:'right'}}></td>
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
                          {this.props.fromWareHouse.address1} &nbsp;
                          {this.props.fromWareHouse.city},<br />
                          {this.props.fromWareHouse.state},
                          {this.props.fromWareHouse.country} &nbsp;
                          {this.props.fromWareHouse.zipcode}<br />
                          <strong>Phone</strong>: {this.props.fromWareHouse.phonenumber}

                    </td>
                  </tr>
                  </table>
                </td>
                <td style={{textAlign:'right'}}>
                  <table width="100%" style={{textAlign:'left'}} border="0">
                  <tr>
                    <td>
                      <h2 style={{backgroundColor:'rgb(78, 205, 196)', color:'white', fontSize:16, padding: 10}}>Billing Address:</h2>
                      {this.props.toStore.address1} &nbsp;
                      {this.props.toStore.city},<br />
                      {this.props.toStore.state},
                      {this.props.toStore.country} &nbsp;
                      {this.props.toStore.zipcode}<br />
                      <strong>Phone</strong>: {this.props.toStore.phonenumber}
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
                  <th style={{padding:10, color:'white'}}>Product Name</th>
                  <th style={{padding:10, color:'white'}}>Requested Qty</th>
                  <th style={{padding:10, color:'white'}}>Approved Qty</th>
                  <th style={{padding:10, color:'white'}}>Unit Price</th>
                  <th style={{padding:10, color:'white'}}>Total Price</th>
                </tr>
                  {items}
                </table>
                </td>
              </tr>
            </table>
            <div style={{textAlign:'center', fontWeight:'bold'}}>This is computer generated purchase order and do not require any stamp or signature</div>
            </div>
          </div>
          </div>
        </div>}
      </div>
    )
  }
}
