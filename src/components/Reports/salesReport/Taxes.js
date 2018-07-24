import React, {Component} from 'react';
import NumberFormat from 'react-number-format';
import { Currency }  from '../../utils';

class Taxes extends Component{
	render(ReactElement, DOMElement, callback){
    const Taxes = this.props.data;
		return(
    <div className="col-sm-12 col-md-6 col-lg-2">
          <div className="widget widget-pie colorYellow">
             <div className="widget-head-wrap">
                <span className="title blue">Taxes</span>
                <h2 className="title">
                  <NumberFormat value={Taxes} displayType={'text'} thousandSeparator={true} decimalPrecision={2} prefix={Currency()} />
                </h2>
             </div>
            <svg className="peity" height="50px" width="100%"><rect fill="rgba(255, 255, 255, 0.3)" x="2.27328125" y="15" width="18.18625" height="35"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="25.00609375" y="35" width="18.186249999999998" height="15"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="47.73890625" y="10" width="18.18625" height="40"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="70.47171875000001" y="30" width="18.186249999999987" height="20"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="93.20453124999999" y="30" width="18.186250000000015" height="20"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="115.93734375" y="10" width="18.18625" height="40"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="138.67015625" y="0" width="18.18625000000003" height="50"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="161.40296874999999" y="35" width="18.18625000000003" height="15"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="184.13578124999998" y="30" width="18.18625000000003" height="20"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="206.86859375" y="25" width="18.18625" height="25"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="229.60140625" y="5" width="18.18625" height="45"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="252.33421875" y="40" width="18.18625000000003" height="10"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="275.06703125" y="25" width="18.186249999999973" height="25"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="297.79984375" y="45" width="18.18625000000003" height="5"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="320.53265625" y="30" width="18.18625000000003" height="20"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="343.26546874999997" y="40" width="18.18625000000003" height="10"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="365.99828125000005" y="5" width="18.186249999999916" height="45"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="388.73109375" y="10" width="18.186249999999973" height="40"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="411.46390625000004" y="25" width="18.186249999999916" height="25"></rect><rect fill="rgba(255, 255, 255, 0.3)" x="434.19671875000006" y="5" width="18.186249999999916" height="45"></rect></svg>
          </div>
    </div>
		)
	}
}
export default Taxes;