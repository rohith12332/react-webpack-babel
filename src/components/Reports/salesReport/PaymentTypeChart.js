/*import React, {Component} from 'react';
import { Chart } from 'react-google-charts';
class PaymentTypeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        "title": "Cash and Credit Sales",
        "pieHole": 0.4,
        "is3D": true,
        "width": "100%",
      },
      rows: props.paymenttypereport,
      columns: [
        {
          type: 'string',
          label: 'Credit Card',
        },
        {
          type: 'number',
          label: 'Cash',
        }
      ],
    };
  }

  render() {
    return (
      <Chart
        chartType="PieChart"
        rows={this.state.rows}
        options={this.state.options}
        columns={this.state.columns}
        graph_id="donutchart"
        width={'100%'}
        height={'400px'}
        legend_toggle
      />
    );
  }
export default PaymentTypeChart;
}*/

import React, {Component} from 'react';
import Chart from 'chart.js'
var year = '2017';
class PaymentTypeChart extends React.Component {
  render() {
  var data = this.props.paymenttypereport;
  //console.log(data);

  $(function(){
    var labels = [];
    var bardata = [];
    var ctx = document.getElementById('PaymentTypeChart').getContext('2d');
    ctx.height = 300;
    var labels = [];
    for(var d in data){
      if(data.hasOwnProperty(d)){
        labels.push(data[d][0])
        bardata.push(data[d][1])
      }
    }
    var chart = new Chart(ctx, {
        responsive: false,
        width:400,
        height:300,
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: "Payment Type",
                backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1,
            data: bardata,
            }]
        },
        // Configuration options go here
        options: {legend: {
        display: true,
        position: 'bottom'
    }}
    });
  })
    return (
      <div className="PaymentTypeChart" style={{height:410}}>
        <canvas id="PaymentTypeChart"></canvas>
      </div>
    );
  }
}
export default PaymentTypeChart;
