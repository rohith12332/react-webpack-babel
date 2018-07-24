import React, { Component } from 'react'

const Barcode = props => {
  return (
    <div className="disp-barcode">
      <img src={require('./barcode-invoice.gif')} width="200" />
    </div>
  );
};
export default Barcode;
