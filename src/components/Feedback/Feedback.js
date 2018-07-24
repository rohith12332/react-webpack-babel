import React, { Component, StyleSheet } from 'react';
var StoreImage = require('./shop.svg');
var happy = require('./happy.svg');
var sad = require('./sad.svg');
import axios from 'axios';


function getParameterByName(name, url) {
    if (!url) url = window.location.search;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var domainuniquekey = getParameterByName('d');
var storeuniquekey = getParameterByName('su');
var orderid = getParameterByName('o');

class CustomerFeedback extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }
    }
    componentDidMount() {
        this.getOrderReport()
    }
    getOrderReport = () => {
        var that = this;
        var reqQuery = { 
            "orderid":orderid,    
            "domainuniquekey":domainuniquekey, 
            "storeuniquekey":storeuniquekey
        }
        console.log(reqQuery)
        axios.post(`${process.env.API_HOST}/ReportServices/ManageSalesReports.svc/GetOrderReportDetails/json`, reqQuery)
        .then(function (response) {
            console.log(response)
            that.setState({
                data: response.data.orderdetails
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    render(){
        //console.log(this.state)
        const orderdetails = this.state.data;
        var items = orderdetails.salesdetailsinfo.map((item, i) => (
            <tr key={i}>
                <td align="left" className="half-col-left">
                    <div className="p item-name">{item.productname}</div>
                    {item.productdesc && <div className="p item-description">{item.productdesc}</div>}
                </td>
                <td align="right" className="half-col-right" style={{textAlign:'right'}}>
                    {!item.adjustprice && <div className="p"><span>₹</span>{item.productprice}</div>}
                    {item.adjustprice && <div className="p"><strike><span>₹</span>{item.productprice}</strike> <strong><span>₹</span>{item.adjustprice}</strong></div>}
                </td>
            </tr>
        ))

        return(
            <div style={{'maxWidth':'375px', 'margin': '0 auto'}}>
                <div style={{'textAlign':'center', 'padding':'30px', 'backgroundColor':'#7277d5', 'color':'white'}}>
                    <div className="store__icon"><img src={StoreImage} alt="" width="50" /></div>
                    <h2 className="store__name">{orderdetails.storename}</h2>
                    <h4><strong>Phone.</strong> {orderdetails.storephone}</h4>
                    <h4><strong>Email.</strong> {orderdetails.storemaildetails}</h4>
                </div>
                <div style={{'textAlign':'center', 'padding':'30px', 'backgroundColor':'#3fc97b', 'color':'white'}}>
                    <a href=""><img src={happy} alt="" width="50" style={{'marginRight': '10px'}} /></a>
                    <a href=""><img src={sad} alt="" width="50" style={{'marginRight': '10px'}}/></a>
                </div>
                <div style={{'backgroundColor': '#FFF','padding':'10px 30px', 'textAlign':'center'}}>
                    <h2 className="currency"><span className="currency_symbol">₹</span>{orderdetails.grandtotal}</h2>
                </div>
                <div style={{'textAlign':'center'}}>
                    <table 
                    style={{'backgroundColor': '#FFF', 'textAlign':'left', 'width':'100%'}} 
                    className="table-container-section table-payment-info" 
                     cellSpacing="0" cellPadding="0">
                    {items}
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{'borderTop': '1px dashed #e0e1e2', 'textAlign':'center'}} height="1" className="spacer">
                            <img width="1" height="1" alt="" style={{'lineHeight': '0', 'fontSize': '0'}} 
                            src="https://d3g64w74of3jgu.cloudfront.net/receipts/assets/spacer-1fd26d3eecdcf15db516756a758048eb.png" />
                        </td>
                    </tr>

                    <tr>
                        <td align="left" className="half-col-left">
                            <div className="p total">Subtotal</div>
                        </td>
                        <td align="right" className="half-col-right" style={{textAlign:'right'}}>
                            <div className="p total"><span>₹</span> {orderdetails.grandtotal}</div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" className="half-col-left">
                            <div className="p strong">Discount</div>
                        </td>
                        <td align="right" className="half-col-right" style={{textAlign:'right'}}>
                            <div className="p strong"><span>₹</span> {orderdetails.discountamount}</div>
                        </td>
                    </tr>                    
                    <tr>
                        <td align="left" className="half-col-left">
                            <div className="p strong">Sales Tax</div>
                        </td>
                        <td align="right" className="half-col-right" style={{textAlign:'right'}}>
                            <div className="p strong"><span>₹</span> {orderdetails.taxamount}</div>
                        </td>
                    </tr>
                      <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{'borderTop': '1px dashed #e0e1e2'}} height="1" className="spacer">
                        <img width="1" height="1" alt="" style={{'lineHeight': '0', 'fontSize': '0'}} 
                        src="https://d3g64w74of3jgu.cloudfront.net/receipts/assets/spacer-1fd26d3eecdcf15db516756a758048eb.png" />
                    </td>
                    </tr>

                    <tr>
                        <td align="left" className="half-col-left">
                            <div className="p total">Total</div>
                        </td>
                        <td align="right" className="half-col-right" style={{textAlign:'right'}}>
                            <div className="p total">{orderdetails.grandtotal}</div>
                        </td>
                    </tr>
{/*                    <tr>
                        <td align="left" className="half-col-left">
                            <div className="p total">Paid Amount</div>
                        </td>
                        <td align="right" className="half-col-right">
                            <div className="p total">{orderdetails.payedamount}</div>
                        </td>
                    </tr>*/}                    
                    <tr>
                        <td align="left" className="half-col-left">
                            Payment Mode
                        </td>
                        <td align="right" className="half-col-right" style={{textAlign:'right'}}>
                            <div className="p total">{orderdetails.typeofpayment}</div>
                        </td>
                    </tr>
{/*                    <tr>
                        <td align="left" className="half-col-left">
                            <div className="p gift-card-balance-label strong">Gift Card Balance</div>
                        </td>
                        <td align="right" className="half-col-right">
                            <div className="p gift-card-balance-amount strong">$18.40</div>
                        </td>
                    </tr>*/}
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{'borderTop': '1px dashed #e0e1e2', 'textAlign':'center'}} height="1" className="spacer">
                            <img width="1" height="1" alt="" style={{'lineHeight': '0', 'fontSize': '0'}} 
                            src="https://d3g64w74of3jgu.cloudfront.net/receipts/assets/spacer-1fd26d3eecdcf15db516756a758048eb.png" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            Return Policy: No returns
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{'borderTop': '1px dashed #e0e1e2', 'textAlign':'center'}} height="1" className="spacer">
                            <img width="1" height="1" alt="" style={{'lineHeight': '0', 'fontSize': '0'}} 
                            src="https://d3g64w74of3jgu.cloudfront.net/receipts/assets/spacer-1fd26d3eecdcf15db516756a758048eb.png" />
                        </td>
                    </tr> 
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>   
                    <tr>
                        <td colSpan="2" className="total">
                            Bring this receipt when you visit within 24 hours and take $2 off any dish priced 7.99 or more while dining in.
                        </td>
                    </tr>     
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>                                   
                    </table>   

                    <table width="100%" align="center">
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>                    
                    <tr>
                        <td colSpan="2">&copy; {orderdetails.storename}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">{orderdetails.storeaddress}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2">Powered by: <br/><img src="http://oneposretail.com/img/logo-light.png" alt=""/></td>
                    </tr>                    
                    
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>
                    <tr>
                        <td width="100%" height="11" colSpan="2"> </td>
                    </tr>                     
                    </table>                 
                </div>                
            </div>
        )
    }
}
export default CustomerFeedback;