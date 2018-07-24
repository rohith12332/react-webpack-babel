import React, {Component} from 'react';

global.$ = require('jquery');

// Kendo UI Import 

/*import './kendo/jszip.min.js'
import './kendo/kendo.all.min.js'*/
/*import './kendo/kendo.common.min.css'
import './kendo/kendo.default.min.css'
import './kendo/kendo.default.mobile.min.css'*/
import getUserDetails from '../../common/CredentialDomain';

import axios from 'axios';

class KendoUI extends Component{
	constructor(props) {
		super(props);
		this.state = {
			OrderHistoryReport:[]
		}
	}
componentDidMount() {
		var that = this;
		var reqQuery = {};
		var data = [];
		reqQuery['userdetails'] = getUserDetails();
		reqQuery['typeoffiltersearch'] = '0';
		reqQuery["fromdate"] = "";
		reqQuery["todate"] = "";
		reqQuery["businessdayids"] = [];

		//console.log(JSON.stringify(reqQuery));
		axios.post(`${process.env.API_HOST}/ReportServices/GetOrderHistoryReport.svc/OrdersHistoryReportBasedOnBD/json`, reqQuery)
		.then(function(response){
			console.log(response);
			if (response.status >= 400) {
				console.log('response.status.400')
			}else{
				data = response.data.orderhistoryreportlist;
            $("#grid").kendoGrid({
                toolbar: ["pdf","excel"],
                pdf: {
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
	            excel: {
	                fileName: "Kendo UI Grid Export.xlsx",
	                proxyURL: "https://demos.telerik.com/kendo-ui/service/export",
	                filterable: true
	            },             
                dataSource: {
                    type: "json",
                    data: data,
                    pageSize: 7
                },
				schema:{
                    model: {
                        fields: {
                            dateandtime: { type: "date" },
                            orderno: { type: "string" },
                            noofitems: { type: "number" },
                            total: { type: "number" },
                            paymenttype: { type: "string" },
                            timestamp: { type: "string" },
                            type: { type: "number" }
                        }
                    }
                },
				                         
                height: 550,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "dateandtime",
                    title: "Transaction Date",
                    width: 240
                }, {
                    field: "orderno",
                    title: "Order No"
                }, {
                    field: "noofitems",
                    title: "Total Items"
                }, {
                    field: "total",
                    title: "Total Amount"
                }, {
                    field: "paymenttype",
                    title: "Payment Type"
                }, {
                    field: "timestamp",
                    title: "Transaction Time"
                }, {
                    field: "type",
                    title: "Status"
                }]
            });				
			}
		}).catch(function (error) {
	   		console.log("Bad Response");
		});	
		



/*        kendo.pdf.defineFont({
            "DejaVu Sans"             : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf",
            "DejaVu Sans|Bold"        : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
            "DejaVu Sans|Bold|Italic" : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
            "DejaVu Sans|Italic"      : "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
            "WebComponentsIcons"      : "https://kendo.cdn.telerik.com/2017.1.223/styles/fonts/glyphs/WebComponentsIcons.ttf"
        });	*/    
}	

	OrdersHistoryReportBasedOnBD = () => {
		var that = this;
		var reqQuery = {};	
		reqQuery['userdetails'] = getUserDetails();
		reqQuery['typeoffiltersearch'] = '0';
		reqQuery["fromdate"] = "";
		reqQuery["todate"] = "";
		reqQuery["businessdayids"] = [];

		//console.log(JSON.stringify(reqQuery));
		axios.post(`${process.env.API_HOST}/ReportServices/GetOrderHistoryReport.svc/OrdersHistoryReportBasedOnBD/json`, reqQuery)
		.then(function(response){
			
			//console.log(response);
			if (response.status >= 400) {
				console.log('response.status.400')
			}else{
				that.setState({
					OrderHistoryReport:response.data.orderhistoryreportlist
				})
			}
		}).catch(function (error) {
	   		console.log("Bad Response");
		});		
	}


	render(){
		return (
<div id="example">

{/*    <div className="box wide">
        <p style={{"margin-bottom": "1em"}}><b>Important:</b></p>

        <p style={{"margin-bottom": "1em"}}>
            This page loads
            <a href="https://github.com/nodeca/pako">pako zlib library</a> (pako_deflate.min.js)
            to enable compression in the PDF. This is highly recommended as it improves
            performance and rises the limit on the size of the content that can be exported.
        </p>

        <p>
            The Standard PDF fonts do not include Unicode support.

            In order for the output to match what you see in the browser
            you must provide source files for TrueType fonts for embedding.

            Please read the documentation about
            <a href="http://docs.telerik.com/kendo-ui/framework/drawing/drawing-dom#custom-fonts-and-pdf">custom fonts</a>
            and
            <a href="http://docs.telerik.com/kendo-ui/framework/drawing/pdf-output#using-custom-fonts">drawing</a>.
        </p>
    </div>
*/}
    <div id="grid"></div>


    

    <script type="x/kendo-template" id="page-template">
      <div className="page-template">
        <div className="header">
          <div style={{'float': 'right'}}>Page #: pageNum # of #: totalPages #</div>
          Multi-page grid with automatic page breaking
        </div>
        <div className="watermark">KENDO UI</div>
        <div className="footer">
          Page #: pageNum # of #: totalPages #
        </div>
      </div>
    </script>
</div>
			
		)
	}
}
export default KendoUI;