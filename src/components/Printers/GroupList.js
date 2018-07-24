import React, {PropTypes} from 'react';
import { browserHistory, Link } from 'react-router';

class GroupList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  
  handleUpdatePrinterGroup(item){
    this.props.openEdit(item);
  }

  handleDeletePrinterGroup(item){
    this.props.deletePrinterGroup(item.id);
  }

  getGroupPrinters(item){
    this.props.GetSinglePrinterGroup(item.id);
  }

  render(title){
    const PrinterGroups = this.props.PrinterGroups;
    var totalPrinterGroup = PrinterGroups.length;

    var items = PrinterGroups.map((item, i) => (  
      <li key={item.id}>
        <div className="product-grp-title" onClick={this.getGroupPrinters.bind(this, item)}>{item.name}</div>
        <div className="product-grp-count">{item.printerscount}</div>
        <div className="product-grp-action-links trans-bg"> 
          <Link onClick={this.handleUpdatePrinterGroup.bind(this, item)}><i className="icon icon-516 "></i></Link> 
          <a href="#" onClick={this.handleDeletePrinterGroup.bind(this, item)}><i className="icon icon-1089"></i></a> 
        </div>
      </li>
    ))
    return(
      <div className="products-left-list">
        <div className="prodcut-cateory-wrap">
          <div className="allproducts-wrap clearfix">
            <p>All Printer Groups</p>
              <span>{totalPrinterGroup}</span>
          </div>

          <div className="product-group-listing">
            <ul>
              {items}
            </ul>
          </div>

        </div>
      </div>
    )
  }
}

GroupList.PropTypes = {
  PrinterGroups: PropTypes.arrayOf(React.PropTypes.object).isRequired
}
export default GroupList;
