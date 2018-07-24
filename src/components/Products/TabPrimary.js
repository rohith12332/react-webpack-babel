import React from 'react';
import axios from 'axios';
import GroupList from './GroupList';
import ListFromGroup from './ListFromGroup';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormControl from 'react-bootstrap/lib/FormControl';
import TextInput from '../common/TextInput';
import classnames from 'classnames';
import getUserDetails from '../common/CredentialDomain';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
global.jQuery = require('jquery');

class TabPrimary extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
      ProductGroups: [],
      productsList: [],
      showModal: false,
      errors: {},
      "msgSuccess": "",
      "msgFailure": "",
      "productGroup":{
        "applygroupprice": true,
        "candiscountgroup": true,
        "groupprice": 0,
        "id":"1627aea5-8e0a-4371-9022-9b504344e724",
        "isdeleted":false,
        "menuposition": 0,
        "name":"",
        "ordermenuitemsbyweight":true,
        "productcount": 0,
        "productgroupcolor":"",
        "products":[],
        "usedriversageverification":true
      },
      "updateMode": false,
    }
    this.open = this.open.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.close = this.close.bind(this);
    this.addProductGroup = this.addProductGroup.bind(this);
    this.updateProductGroup = this.updateProductGroup.bind(this);
    this.deletePrinterGroup = this.deletePrinterGroup.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateOnMove = this.updateOnMove.bind(this);
    this.GetSingleProductGroup = this.GetSingleProductGroup.bind(this);
    this.handlechange = this.handlechange.bind(this);
    this.handleUngroup = this.handleUngroup.bind(this);
    this.resetHandler = this.resetHandler.bind(this);

    }

  componentDidMount() {
    this.GetProductgroups();
    this.getAllProducts();
  }

  GetProductgroups(){
      var that = this;
      var reqQuery = {};
      reqQuery['userdetails'] = getUserDetails();

      axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetProductGroups/json`, reqQuery)
       .then(function (response) {
        //console.log(response)
        if (response.data.status >= 400) {
          that.setState({
            msgFailure: response.data.statusMessage
          })
        } else {
          that.setState({
            ProductGroups: response.data.productsList
          });
        }
       })
      .catch(function (error) {
         console.log(error);
      });
  }

  getAllProducts(){
    var that = this;
    var reqQuery = {};
    reqQuery['userdetails'] = getUserDetails();
    reqQuery['isall'] = false;
    reqQuery["isdisplaymetaproducts"] = true;
    reqQuery["ismobileaccess"] = false;
    //console.log(JSON.stringify(reqQuery))
    axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetProducts/json`, reqQuery)
     .then(function (response) {
      if (response.data.status >= 400) {
        that.setState({
          msgFailure: response.data.statusMessage
        })
      } else {
        if(response.data.productsList == null) response.data.productsList = [];
        that.setState({
          productsList: response.data.productsList
        });
      }

     })
    .catch(function (error) {
       console.log(error);
    });
  }


  open(){
    this.setState({
      showModal: true,
      errors: {},
      "msgSuccess": "",
      "msgFailure": "",
      "productGroup":{
        "applygroupprice": true,
        "candiscountgroup": true,
        "groupprice": 0,
        "id":"1627aea5-8e0a-4371-9022-9b504344e724",
        "isdeleted":false,
        "menuposition": 0,
        "name":"",
        "ordermenuitemsbyweight":true,
        "productcount": 0,
        "productgroupcolor":"",
        "products":[],
        "usedriversageverification":true
      }
    });
  }
  openEdit(item){
    console.log(item)
    this.setState({
      showModal: true,
      updateMode: true,
      productGroup: item
    });
  }

  close(event){
    this.setState({
      showModal: false,
      errors: {},
      "msgSuccess": "",
      "msgFailure": "",
      "productGroup":{
        "applygroupprice": true,
        "candiscountgroup": true,
        "groupprice": 0,
        "id":"1627aea5-8e0a-4371-9022-9b504344e724",
        "isdeleted":true,
        "menuposition": 0,
        "name":"",
        "ordermenuitemsbyweight":true,
        "productcount": 0,
        "productgroupcolor":"",
        "products":[],
        "usedriversageverification":true
      },
      "updateMode": false,
    });
  }

  onChange(e){
    const field = e.target.name;
    let productGroup = this.state.productGroup;
    productGroup[field] = e.target.value;
    console.log(productGroup)
    if (!!this.state.errors[e.target.name]) {
          let errors = Object.assign({}, this.state.errors);
          delete errors[e.target.name];
          this.setState({
              errors
          });
        }
    this.setState({
      productGroup:productGroup
    })
  }

validateText(value) {
      var text = /^[a-zA-Z]+$/;
      return text.test(value);
  }

handleValidation() {

    let errors = {};
    //Form validation error message
    if (this.state.productGroup.menuposition === '') {
      document.getElementById("menuposition").focus();
      errors.menuposition = "Please enter Menu Position"
    }

    if (this.state.productGroup.name === '') {
      document.getElementById("name").focus();
      errors.name = "Please enter Product Group name"
    }

   console.log(errors)
    this.setState({
      errors
    }); //Set Errors state

    return Object.keys(errors).length == 0;
  }


  // Checkboxes Change Handle
  handlechange(event){
    if(event.target.name == 'candiscountgroup'){
      var productGroup = this.state.productGroup;
      productGroup['candiscountgroup'] = event.target.checked;
      this.setState({
        productGroup: productGroup
      })
    }
    if(event.target.name == 'applygroupprice'){
      var productGroup = this.state.productGroup;
      productGroup['applygroupprice'] = event.target.checked;
      this.setState({
        productGroup: productGroup
      })
    }
  }


  addProductGroup(){
    var that = this;
    var apgReq = {};
    var productGroup = this.state.productGroup;

    var isValid = this.handleValidation();

    if(isValid){
    apgReq['userdetails'] = getUserDetails();
    apgReq['productGroup'] = productGroup;

    var oldState = this.state.ProductGroups;
    var newState = apgReq.productGroup;
    oldState.push(newState);


    console.log(JSON.stringify(apgReq));

    const request = new Request(`${process.env.API_HOST}/ManageProducts.svc/CreateProductGroup/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(apgReq)
    });
    fetch(request)
      .then(function(response) {
        if(response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        productGroup.id = data.ProductGroupID;
          if (data.statusCode >= 400) {
              that.setState({
                  msgFailure: data.statusMessage,
                  showModal: false
              })
          } else {
              that.setState({
                  ProductGroups:oldState,
                  showModal: false,
                  msgSuccess: data.statusMessage
              })
              setTimeout(function() {
                that.setState({
                  msgSuccess: ''
                })
                window.location.reload();
              }, 5000)
          }
     });
    }
  }


  updateOnMove(element, items){
    var that = this;
    var apgReq = {};
    var reqQuery = {};
    //console.log(element.value)
    var productGroup = this.state.productGroup;

    reqQuery['ProductGroupID'] = element.value;
    reqQuery["isRequredProducts"] = true;
    reqQuery['userdetails'] = getUserDetails();
    //console.log(JSON.stringify(reqQuery));

    axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetSingleProductGroup/json`, reqQuery)
    .then(function(response){

        //console.log(items.length)
        if(!items.length == 0){
        var response = response.data;
        var products = response.productGroup.products;
        products = products.concat(items);

        apgReq['productGroup'] = response.productGroup;
        apgReq['productGroup']['products'] = products;
        apgReq['userdetails'] = getUserDetails();

        axios.post(`${process.env.API_HOST}/ManageProducts.svc/UpdateProductGroup/json`, apgReq)
        .then(function(response){

            //Check Product Status
            if (response.status >= 400) {
                that.setState({
                    "msgFailure":response.data.statusMessage
                })
            }else{
                that.setState({
                    "msgSuccess":response.data.statusMessage,
                    showModal: false
                });

                setTimeout(function(){
                    that.setState({"msgSuccess":""})
                    window.location.reload();
                }, 5000)
            }

        }).catch(function (error) {
          console.log("Bad Response");
        });

    }else{
      that.setState({
          "msgFailure":"Please select at least one product"
      });
      setTimeout(function(){
          that.setState({"msgFailure":""})
      }, 5000)
    }

    }).catch(function (error) {
        console.log("Bad Response");
    });
  }


  updateProductGroup(){

    var that = this;
    var apgReq = {};
    var reqQuery = {};
    var isValid = this.handleValidation();
    if(isValid){
    var productGroup = this.state.productGroup;

    reqQuery['ProductGroupID'] = productGroup.id;
    reqQuery['userdetails'] = getUserDetails();
    //console.log(JSON.stringify(reqQuery));

    axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetSingleProductGroup/json`, reqQuery)
    .then(function(response){
      console.log(response)

        var response = response.data;
        var products = response.productGroup.products;

        apgReq['productGroup'] = productGroup;
        if(products == null) products = [];
        apgReq['productGroup']['products'] = products;
        apgReq['userdetails'] = getUserDetails();

        console.log(JSON.stringify(apgReq));
        axios.post(`${process.env.API_HOST}/ManageProducts.svc/UpdateProductGroup/json`, apgReq)
        .then(function(response){

            //Check Product Status
            if (response.status >= 400) {
                that.setState({
                    "msgFailure":response.data.statusMessage
                })
            }else{
                that.setState({
                    "msgSuccess":response.data.statusMessage,
                    showModal: false
                });
                setTimeout(function(){
                    that.setState({"msgSuccess":""})
                    window.location.reload();
                }, 5000)
            }

        }).catch(function (error) {
          console.log("Bad Response");
        });

    }).catch(function (error) {
        console.log("Bad Response");
    });
  }
  }

  GetSingleProductGroup(itemId){
    jQuery('.table-info-topwrap .moveto-wrap').css('display','none')
    var that = this;
    var reqQuery = {};
    reqQuery['ProductGroupID'] = itemId;
    reqQuery['userdetails'] = getUserDetails();
    reqQuery["isRequredProducts"] = true;

    console.log(JSON.stringify(reqQuery));

    axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetSingleProductGroup/json`, reqQuery)
    .then(function(response){
      console.log(response)
        //Check Product Status
        if (response.status >= 400) {
            that.setState({
                "msgFailure":response.data.statusMessage
            })
        }else{
            that.setState({
                productsList:response.data.productGroup.products
            });
        }

    }).catch(function (error) {
      console.log("Bad Response");
    });
  }


  deletePrinterGroup(itemId){
      var that = this;
      var delQuery = {};
      var index = -1;
      var _totalprinters = this.state.ProductGroups.length;

      for( var i = 0; i < _totalprinters; i++ ) {
        if(this.state.ProductGroups[i].id == itemId){
          index = i;
          break;
        }
      }
      this.state.ProductGroups.splice( index, 1 );
      this.setState({ProductGroups: this.state.ProductGroups});

      delQuery['isdeleted'] = true;
      delQuery['ProductGroupID'] = itemId;
      delQuery['userdetails'] = getUserDetails();

      const request = new Request(`${process.env.API_HOST}/ManageProducts.svc/DeleteProductGroup/json`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(delQuery)
      });

      return fetch(request).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.statusCode >= 400) {
          that.setState({
            msgFailure: data.statusMessage
          })
        } else {
          that.setState({
            msgSuccess: data.statusMessage
          })
          setTimeout(function() {
            that.setState({
              msgSuccess: ''
            })
          }, 5000)
        }
      }).catch(function(error) {
        return error;
      })
  }


    handleUngroup(id){

        var that = this;
        var reqQuery = {};

        //Request to get single product by id
        reqQuery['userdetails'] = getUserDetails();
        reqQuery['ismobileaccess'] = false;
        reqQuery['productid'] = id;

        axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetSingleProduct/json`, reqQuery)
        .then(function(response){

        let productResponse = response.data.Product;

        //Request to get product group id
        var prQuery = {};
        prQuery['ProductGroupID'] = productResponse.productgroupid;
        prQuery['userdetails'] = getUserDetails();
        prQuery['isRequredProducts'] = true;

        axios.post(`${process.env.API_HOST}/ManageProducts.svc/GetSingleProductGroup/json`, prQuery)
        .then(function(response){
/*          console.log(response)
            console.log(response.data.productGroup)
            console.log(productResponse)
            //debugger
            //var products = response.data.productGroup.products.concat(productResponse);
*/
            reqQuery['productGroup'] = response.data.productGroup;
            reqQuery['productGroup']['products'] = [productResponse];
            reqQuery['userdetails'] = getUserDetails();

            axios.post(`${process.env.API_HOST}/ManageProducts.svc/UpdateProductGroupDeAssignProducts/json`, reqQuery)
            .then(function(response){
                if (response.data.statusCode >= 400) {
                  that.setState({
                    msgFailure: response.data.statusMessage
                  })
                } else {
                  that.setState({
                    msgSuccess: response.data.statusMessage
                  })
                  setTimeout(function() {
                    that.setState({
                      msgSuccess: ''
                    })
                  }, 5000)
                  window.location.reload();
                }
            })
        })
      })

    }

    resetHandler(){
        jQuery('.table-info-topwrap .moveto-wrap').css('display','')
        this.getAllProducts()
    }

    render(){
        const { updateMode, ProductGroups, productsList, allproductsList, msgFailure, msgSuccess } = this.state;
        return(
        <div className="tab-pane" id="printergroup">
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          </button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          </button>
          {msgSuccess}
        </div>}
        <div className="products-container clearfix">
          <GroupList
            ProductGroups={ProductGroups}
            modalHandler={this.open}
            openEdit={this.openEdit}
            deletePrinterGroup={this.deletePrinterGroup}
            GetSingleProductGroup = {this.GetSingleProductGroup}
          />
          <ListFromGroup
            resetHandler = {this.resetHandler}
            productsList={productsList}
            modalHandler={this.open}
            handleUngroup = {this.handleUngroup}
            PrinterGroups={ProductGroups}
            updateOnMove = {this.updateOnMove}
          />

        </div>
        <Modal show={this.state.showModal} onHide={this.close} backdrop={false} keyboard={false}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Product Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={classnames('form-group', { error: !!this.state.errors.name})}>
              <TextInput
                type="text"
                name="name"
                id="name"
                label="Product Group Name"
                value={this.state.productGroup.name}
                placeholder=""
                required="*"
                className={classnames('form-control', { error: !!this.state.errors.name})}
                onChange={this.onChange}
              />
              <span>{this.state.errors.name}</span>
            </div>

          <div className={classnames('form-group', { error: !!this.state.errors.menuposition})}>
            <TextInput
              type="text"
              name="menuposition"
              id="menuposition"
              label="Product Menu Position"
              value={this.state.productGroup.menuposition}
              placeholder=""
              required="*"
              className={classnames('form-control', { error: !!this.state.errors.menuposition})}
              onChange={this.onChange}
            />
            <span>{this.state.errors.menuposition}</span>
        </div>

        <div className="form-group">
          <label className="control-label">Allow Group Discount</label>
          <div className="">
              <div className="switch-button switch-button-info">
                 <input type="checkbox" onChange={this.handlechange} checked={this.state.productGroup.candiscountgroup} name="candiscountgroup" id="candiscountgroup" />
                 <span><label htmlFor="candiscountgroup"></label></span>
              </div>
          </div>
        </div>

          <div className="form-group">
          <label className="control-label">Allow Group Price</label>
          <div className="">
              <div className="switch-button switch-button-info">
                 <input type="checkbox" onChange={this.handlechange} checked={this.state.productGroup.applygroupprice} name="applygroupprice" id="applygroupprice" />
                 <span><label htmlFor="applygroupprice"></label></span>
              </div>
          </div>
        </div>

          </Modal.Body>
          <Modal.Footer>
            {!this.state.updateMode ? <Button className="btn-submit" onClick={this.addProductGroup}>Submit</Button>: null}
             {this.state.updateMode ? <Button className="btn-submit" onClick={this.updateProductGroup}>Update</Button>: null}
            <Button className="btn-cancel" onClick={this.close}>Cancel</Button>
          </Modal.Footer>
        </form>
        </Modal>
      </div>
        )
    }
}
export default TabPrimary;