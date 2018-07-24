/*import React, {Component} from 'react';
import { Chart } from 'react-google-charts';
class ProductGroupChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        pieHole: 0,
        "width": "100%",
      },
    rows: [
          ['Credit Card',11],
          ['Cash',6],
          ['Master Group',6]
    ],
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
        graph_id="ProductGroupChart"
        width={'100%'}
        height={'400px'}
        legend_toggle
      />
    );
  }
}
export default ProductGroupChart;*/


import React, {Component} from 'react';
//import { Chart } from 'react-google-charts';
import Chart from 'chart.js'

var year = '2017';

class ProductGroupChart extends React.Component {
  render() {
  var data = this.props.productgroupreport;
  $(function(){
    var labels = [];
    var bardata = [];
    var ctx = document.getElementById('ProductGroupChart').getContext('2d');

    var labels = [];
    for(var d in data){
      if(data.hasOwnProperty(d)){
        labels.push(data[d][0])
        bardata.push(data[d][1])
      }
    }
    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
        labels:labels,
            datasets: [{
                backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)'
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
      <div className="ProductGroupChart" style={{height:410}}>
        <canvas id="ProductGroupChart"></canvas>
      </div>
    );
  }
}
export default ProductGroupChart;
