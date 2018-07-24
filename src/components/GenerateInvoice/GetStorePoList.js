import React, { Component } from 'react'
import Select from 'react-select';

export default class GetStorePoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedPo: {}
    }
  }
  selectPo = (element) => {
    this.setState({
      selectedPo: element
    })
    this.props.selectPo(element.value)
  }

  render() {
    console.log(this.props)
    return (
        <div className="col-md-4">
            <div className="form-group">
                <label className="control-label">PO#</label>
                <Select
                    name="vendors"
                    value={this.state.selectedPo}
                    options={this.props.poList}
                    onChange={this.selectPo}
                    disabled={this.props.disablePo}
                />
            </div>
        </div>
    )
  }
}
