import React from 'react';
import PropTypes from 'prop-types';

export default class customDatePicker extends React.Component {
  constructor(props) {
    super(props);
    
  }
  render () {
    return (
      <button
        className="example-custom-input"
        onClick={this.props.onClick}>
        {this.props.value}
      </button>
    )
  }
}

customDatePicker.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string
};