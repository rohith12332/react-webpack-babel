import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import { Link, IndexLink } from 'react-router';
import HeaderNoSidebar from '../common/HeaderNoSidebar';
import {bindActionCreators} from 'redux';
import './store.scss';
class Stores extends React.Component {
render() {
var domains = JSON.parse(window.sessionStorage.getItem("domains"));
return(
<div id="addstore" className="modal-container modal-effect-1 store-model">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <button type="button" data-dismiss="modal" aria-hidden="true" className="close modal-close"><i className="icon icon-1191"> </i> </button>
                <h3 className="modal-title">Add Store</h3>
            </div>
            <div className="modal-body form ">
                <form action="#" className="">
                    <div className="form-group">
                        <label>Store Name</label>
                        <input type="name" placeholder="Wine Store" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Email address</label>
                        <input type="email" placeholder="username@example.com" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Store Phone</label>
                        <input type="tel" placeholder="" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <select className="select2">
                            <option value="AL">Alabama</option>
                            <option value="AR">Arkansas</option>
                            <option value="IL">Illinois</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="OK">Oklahoma</option>
                            <option value="SD">South Dakota</option>
                            <option value="TX">Texas</option>
                            <option value="TN">Tennessee</option>
                            <option value="WI">Wisconsin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <select className="select2">
                            <option value="AL">Alabama</option>
                            <option value="AR">Arkansas</option>
                            <option value="IL">Illinois</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="OK">Oklahoma</option>
                            <option value="SD">South Dakota</option>
                            <option value="TX">Texas</option>
                            <option value="TN">Tennessee</option>
                            <option value="WI">Wisconsin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea className="form-control vresize" rows="2"></textarea>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary modal-close">SAVE</button>
                <button type="button" data-dismiss="modal" className="btn btn-default md-close">CANCEL</button>
            </div>
        </div>
    </div>
    <div className="modal-overlay">
    </div>
</div>
)
}
}

