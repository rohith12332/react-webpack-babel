import React, { Component } from 'react'
import Select from 'react-select';

export default class GetWareHouseStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStore:""
    }
  }
  selectWarehouse = (element) => {
    this.setState({
      selectedStore: element
    })
    this.props.selectStore(element)
  }

  render() {
    return (
      <div className="col-md-4">
          <div className="form-group">
              <label className="control-label">Stores</label>
              <Select
                  name="stores"
                  value={this.state.selectedStore}
                  options={this.props.storeList}
                  onChange={this.selectWarehouse}
              />
          </div>
      </div>
    )
  }
}
