import React, { Component } from 'react';
import Select from 'react-select';

class IncorporationForm extends React.Component {
  constructor() {
    super();
    this.state = {
      quantity: '',
      id: '',
      mid:'',
      selectMeasurementType:{
        label:'',
        value:''
      },
      selectAllProducts: {
        label:"",
        value:""
      },
      metaproductlist: [{ quantity: '', id:'', mid:''}]
    };
    this.handleProductSelect = this.handleProductSelect.bind(this);
    this.handleMeasurementTypeSelect = this.handleMeasurementTypeSelect.bind(this);
  }

  handleNameChange = (evt) => {
    this.setState({ quantity: evt.target.value });
  }

  handleProductSelect = (idx) => (evt) => {
    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, id: evt.value, name: evt.label};
    });
    this.setState({
      metaproductlist: newShareholders
      //,selectAllProducts: evt
    });
  }

  handleMeasurementTypeSelect = (idx) => (evt) => {
    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, mid: evt.value};
    });
    this.setState({
      metaproductlist: newShareholders
      //,selectMeasurementType: evt
    });
  }

  //Handle Select boxes - Get Select Name and Value(value and label)
  handleSelectItems(quantity, value){
    if(quantity == 'allproducts'){
        this.setState({
            selectAllProducts: value
        })
    }
     if(quantity == 'measurementtype'){
        this.setState({
            selectMeasurementType: value
        })
    }
  }
  handleShareholderNameChange = (idx) => (evt) => {
    const newShareholders = this.state.metaproductlist.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, quantity: evt.target.value};
    });
    this.setState({ metaproductlist: newShareholders });
  }

  handleSubmit = (evt) => {
    const { quantity, metaproductlist } = this.state;
    alert(`Incorporated: ${quantity} with ${metaproductlist} metaproductlist`);
  }

  handleAddShareholder = () => {
    this.setState({ metaproductlist: this.state.metaproductlist.concat([{ quantity: ''}]) });
  }

  handleRemoveShareholder = (idx) => () => {
    this.setState({ metaproductlist: this.state.metaproductlist.filter((s, sidx) => idx !== sidx) });
  }

  render() {

    //MeasuringUnitsList
    var optionMeasuringUnitsList = this.props.Measurement.map(function(o){
      return{
        label:o.measurement,
        value:o.id
      }
    })
    //ProductList
    var AllProducts = this.props.ProductList.map(function(o){
      return{
        label:o.name,
        value:o.id
      }
    })

    return (
      <form onSubmit={this.handleSubmit}>

       {/* <input
          type="text"
          placeholder="Company name, e.g. Magic Everywhere LLC"
          value={this.state.name}
          onChange={this.handleNameChange}
        />*/}

        {/*<h4>Shareholders</h4>*/}

        {this.state.metaproductlist.map((shareholder, idx) => (
          <div className="shareholder" key={idx}>
            <Select
              name="allproducts"
              value={this.state.selectAllProducts.value}
              options={AllProducts}
              onChange={this.handleProductSelect(idx)}
            />
            <Select
              name="measurementtype"
              value={this.state.selectMeasurementType.value}
              options={optionMeasuringUnitsList}
              onChange={this.handleMeasurementTypeSelect(idx)}
            />
            <input
              type="text"
              placeholder="Quantity"
              value={shareholder.quantity}
              onChange={this.handleShareholderNameChange(idx)}
            />
            <button type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</button>
          </div>
        ))}
        <button type="button" onClick={this.handleAddShareholder} className="small">Add Shareholder</button>
        <button>Incorporate</button>
      </form>
    )
  }
}

export default IncorporationForm;