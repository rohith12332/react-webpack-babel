import React, { Component } from 'react'
import Select from 'react-select'

import GetWareHouseStores from './GetWareHouseStores'
import GetStorePoList from './GetStorePoList'
import ListTable from './ListTable/ListTable'
import TableFooter from './ListTable/TableFooter'

class InvoiceFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '500',
      selectedStore: "",
      selectedPO: "",
      disablePo: true,
      disablePDF: false,
      disableButton:true
    }
  }
  dataChanged = (data) => {
    this.setState({ ...data })
  }
  customValidateText = (text) => {
    return (text.length > 0 && text.length < 64);
  }

  selectStore = (element) => {
    //console.log(element)
    this.props.getselectStore(element)

    this.setState({
      selectedStore: element.value,
      disablePo: false,
      disablePDF: true
    })

  }

  selectPo = (element) => {
    this.props.getselectPo(element)


    this.setState({
      selectedPO: element.value,
      disableButton:false
    })

    console.log(this.state.disableButton)
  }

  getMasterData = (data) => {
    this.props.getMasterData(data)
  }

  handleSubmit = (data) =>{
   this.props.handleSubmit(data)
   
  }
  
  render() {
    console.log(this.props)
    return (
      <div>
        <div className="row">
          <GetWareHouseStores storeList={this.props.storeList} selectStore={this.selectStore} />

          <div className="col-md-4">
            <div className="form-group text-center">
              <div className="podate" style={{ 'marginTop': 30 }}>
              </div>
            </div>
          </div>

          <GetStorePoList poList={this.props.poMapList} selectPo={this.selectPo} disablePo={this.state.disablePo} />
        </div>
        {/* <div className="row text-center" style={{'marginBottom': 20}}>
          {this.state.disablePDF && <button onClick={this.makePDF} className="btn btn-pdf" style={{'fontSize':12}}>
            <i className="fa fa-file-pdf-o" style={{'color':'#f95c04'}}></i><br />DOWNLOAD PDF
          </button>}
        </div> */}
        {/* <div className="col-md-6">
          <label>Company</label>
          <label>Address</label>
          <label>Date</label>
        </div>
        <div className="col-md-6">
        </div> */}
        <div className="row">
          <div className="col-md-12">
            <ListTable
              selectedStore={this.state.selectedStore}
              wareHouseList={this.props.wareHouseList}
              handleSubmit={this.handleSubmit}
              fromWareHouse={this.props.fromWareHouse}
              toStore={this.props.toStore}
              invoicenum={this.props.invoicenum}
              disableButton={this.state.disableButton}
            />
          </div>
        </div>
        {/*<TableFooter disableButton={this.state.disableButton}/>*/}
      </div>

    )
  }
}
export default InvoiceFilter;
