import React, { Component } from 'react'

export default class TableFooter extends Component {
  constructor(props){
    super(props);

    this.state= {

    }
  }

    onSubmit = () =>{
      this.props.handleSubmit(this.props.sendMasterData)
      var masterData = this.props.wareHouseList;
      this.props.getMasterData(masterData)
    }

  render() {
    console.log(this.props)
    return (
      <tfoot>
        {!this.props.disableButton && <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style={{ textAlign: 'right' }}><strong>Grand Total</strong></td>
          <td><input className="grdtot" type="text" defaultValue="0.00" /></td>
          <td></td>
        </tr>}
        <tr style={{ backgroundColor: '#f3f3f3' }}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>

          </td>
          <td style={{ textAlign: 'right' }}>
            {/* <button
              style={{ marginLeft: 0 }}
              type="submit"
              className="btn btn-primary md-trigger"
              data-modal="full-success"
              id="btnInvoiceGeneration"
            >
              <i className="fa fa-file-pdf-o"></i> Download PDF
            </button> */}
          </td>
          <td style={{ textAlign: 'right' }}>
            <button
              style={{ marginLeft: 0 }}
              type="submit"
              className="btn btn-primary md-trigger"
              data-modal="full-success"
              getselectButton={this.getselectButton}
              disabled={this.props.disableButton}
              onClick={this.onSubmit}>
              <i className="fa fa-floppy-o"></i> Create
            </button>
          </td>
        </tr>
      </tfoot>
    )
  }
}
