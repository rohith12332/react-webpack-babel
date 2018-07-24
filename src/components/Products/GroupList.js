import React, {PropTypes} from 'react';
import { browserHistory, Link } from 'react-router';
import Confirm from 'react-confirm-bootstrap';
class GroupList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  
  handleUpdateProductGroup(item){
    this.props.openEdit(item);
  }

  onConfirm(item) {
    this.props.deletePrinterGroup(item.id);
  }

  getGroupProducts(item){
    this.props.GetSingleProductGroup(item.id);
  }

  render(title){

    const ProductGroups = this.props.ProductGroups;
    var totalProductGroup = ProductGroups.length;

    var items = ProductGroups.map((item, i) => (  
      <li key={item.id}>
        <div className="product-grp-title" onClick={this.getGroupProducts.bind(this, item)}>{item.name}</div>
        <div className="product-grp-count">{item.productcount}</div>
        <div className="product-grp-action-links trans-bg"> 
          <Link onClick={this.handleUpdateProductGroup.bind(this, item)}><i className="icon icon-516 "></i></Link> 
          <Confirm 
                  onConfirm={this.onConfirm.bind(this, item)} body="Are you sure you want to delete this?"
                  confirmText="Confirm Delete"
                  className="btn-store-bin"
                  title="Deleting...">
                  <a className="icon-delete"><i className="icon icon-1089"></i></a>
                </Confirm>

          
        </div>
      </li>
    ))
    return(
      <div className="products-left-list">
        <div className="prodcut-cateory-wrap">
          <div className="allproducts-wrap clearfix">
            <p>All Product Groups</p>
              <span>{totalProductGroup}</span>
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
