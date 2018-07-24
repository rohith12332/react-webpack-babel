import React, { Component } from 'react';
var repeater = require('jquery.repeater');
import Select from 'react-select';
import TextInput from '../common/TextInput';
import Confirm from 'react-confirm-bootstrap';
import getUserDetails from '../common/CredentialDomain';

class MetaRepeater extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options: [],
			metaproductlist:[]
		}

		this.handleMetadata = this.handleMetadata.bind(this);
		//this.getOptions = this.getOptions.bind(this);
	}

	componentDidMount() {
		this.getRepeater();	
		this.getOptions();	
	}

	getRepeater(){
		jQuery('.repeater').repeater({
		  show: function () {
		    jQuery(this).slideDown();
		  },
		  hide: function (remove) {
		    if(confirm('Are you sure you want to remove this item?')) {
		      jQuery(this).slideUp(remove);
		    }
		  }
		});
	}

	handleMetadata(selectedItems){
		console.log(selectedItems)
	}

	getOptions(input) {
		var that = this;
		var reqQuery = {};
	    reqQuery['userdetails'] = getUserDetails();

	    const request = new Request(`${process.env.API_HOST}/ManageProducts.svc/GetProducts/json`, {
	      method: 'POST',
	      headers: new Headers({
	        'Content-Type': 'application/json'
	      }),
	      body: JSON.stringify(reqQuery)
	    });

	    fetch(request)
	      .then(function(response) {
	        if(response.status >= 400) {
	          throw new Error("Bad response from server");
	        }
	        return response.json();
	      })
	      .then(function(data) {
	      	var products = data.productsList;
			var options = [];

			for (var key in products) {
			     if (products.hasOwnProperty(key)) {
			        options.push({value: products[key].id, label: products[key].name});
			      }
			 }

			that.setState({
	          options: options
	        });			
	     });

	}


/*	const getOptions = (input) => {
	  return fetch(`/users/${input}.json`)
	    .then((response) => {
	      return response.json();
	    }).then((json) => {
	      return { options: json };
	    });
	}*/

	render(){
		console.log(this.props)
		var options = this.state.options;
		var Measurement = this.state.Measurement;
		var metaQty;
		var selectedItems = [];

		function appendOption(){
			jQuery('.metaQty').prop('disabled', true);
			jQuery.each(options, function (i, item) {
			    jQuery('.metadata-form-devider select').append(jQuery('<option>', { 
			        value: item.value,
			        text : item.label 
			    }));
			})
		}

		jQuery(document).ready(appendOption);
		jQuery('#addMeta').on('click', appendOption)

		jQuery('.metaQty').on('change', function(){
			metaQty = jQuery(this).val();
		})
		var _ = this;
		jQuery('body').on('change', 'select', function () {
			jQuery('.metaQty').prop('disabled', false);
			var selectedId = jQuery(this).find(":selected").val();
			var selectedText = jQuery(this).find(":selected").text();
			
			//console.log(jQuery(this).find(":selected").text())
			selectedItems.push({id: selectedId, name: selectedText})
			_.handleMetadata(selectedItems);
		})


/*		var ProductList = this.state.options.map(function(o){
			return{
				label:o.name,
				value:o.id
			}
		})*/
		return (
			<div className="widget widget-small repeater">
			    <div className="row">
			        <div className="col-sm-6">
			            <div className="product-widget-head">Metadata</div>
			        </div>
			        <div className="col-sm-6">
			            <div className="metadata-wrap"><a data-repeater-create id="addMeta"><i className="icon icon-1189"></i> Add Metadata</a></div>
			        </div>
			    </div>

			    <div className="repeater">
			        <div data-repeater-list="group-a">
			            <div className="metadata-form-devider" data-repeater-item>
			                <div className="row row-light-padding">
			                    <div className="col-sm-4">
			                        <div className="form-group">
										<select></select>
			                        </div>
			                    </div>			                
			                    <div className="col-sm-4">
			                        <div className="form-group">
										<select></select>
			                        </div>
			                    </div>
			                    <div className="col-sm-2">
			                        <div className="form-group">
			                            <input 
			                            	type="text" 
			                            	name="text-input" 
			                            	placeholder="" 
			                            	className="metaQty form-control" 
			                            />
			                        </div>
			                    </div>

			                    <div className="col-sm-2">
			                        <div className="metadata-butn-wrap"> 
			                        	<a data-repeater-delete><i className="icon icon-1089"></i></a> 
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>
		) 
	}
}
export default MetaRepeater;
