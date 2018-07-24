var React = require('react');
var DefaultRow = require('./DefaultRow.js');
import Confirm from 'react-confirm-bootstrap';

var GridRow = React.createClass({
    handleOnChange: function (event) {
        var selectedRows = this.props.selectedRows;
        if (selectedRows[this.props.rowId]) {
            delete selectedRows[this.props.rowId];
        }
        else {
            selectedRows[this.props.rowId] = {
                rowId: this.props.rowId,
                data: this.props.data,

            };
        }
        this.props.onChangeGrid(event, {
            selectedRows: selectedRows,
            selectedRowsId:''
        })
    },

    //Added Edit/Delete handler
    handleOnClick: function(event){
        event.preventDefault();
        var selectedRow = this.props.data.id;
        this.props.editHandler(this.props.data.id);
        this.props.onChangeGrid(event, {
            selectedRowsId: selectedRow
        })

    },
    handleUngroup: function(event){
      event.preventDefault();
      var selectedRow = this.props.data.id;
      this.props.ungroupHandler(this.props.data.id);

    },
    onConfirm() {
        var selectedRow = this.props.data.id;
        this.props.deleteHandler(this.props.data.id);
        this.props.onChangeGrid(event, {
            selectedRowsId: selectedRow
        })

    },
    render: function () {
        var checked = this.props.selectedRows[this.props.rowId] ? true : false;
        var Row = this.props.CustomRow ? this.props.CustomRow : DefaultRow;
        var imageArray = this.props.data.image;

        function arrayBufferToBase64( buffer ) {
              var binary = '';
              var bytes = new Uint8Array( buffer );
              var len = bytes.byteLength;
              for (var i = 0; i < len; i++) {
                  binary += String.fromCharCode( bytes[ i ] );
              }
              return window.btoa( binary );
          }

          var base64 = imageArray != null ? "data:image/jpg;base64,"+ arrayBufferToBase64(imageArray):"";
          //console.log(base64);
        return (
            <div className={'checkbox-wrapper ' + this.props.className + (checked ? ' checked' : '')}>
                 {this.props.showCheckbox &&
                 <div className="am-checkbox" onClick={this.handleOnChange}>
                    <input type='checkbox' id="check" className='checkboxContainer' checked={checked} />
                    <label></label>
                 </div>}

                 {/*{base64 && <div className="product-img-thumbnail"> <img src={base64} className="product-img-thumbnail"/></div>}*/}

                 <Row {...this.props}
                     className=''
                      style={{}}
                      checked={checked}
                 />

                <div className="tble-actionlinks">
              <ul>
                {this.props.ungroupHandler && <li><a className="icon-view" href="#" onClick={this.handleUngroup} data-toggle="tooltip" data-placement="top" title="" data-original-title="Ungroup"><i className="icon icon-956"></i></a></li>}
                {!this.props.ungroupHandler && <li><a className="icon-edit" to="#" onClick={this.handleOnClick}><i className="icon icon-516 "></i></a></li>}
                {!this.props.ungroupHandler && <li>
                <Confirm
                  onConfirm={this.onConfirm} body="Are you sure you want to delete this?"
                  confirmText="Confirm Delete"
                  className="btn-store-bin"
                  title="Deleting...">
                  <a className="icon-delete"><i className="icon icon-1089"></i></a>
                </Confirm>
                </li>}
              </ul>
              </div>
            </div>
        );
    }
});

module.exports = GridRow;
