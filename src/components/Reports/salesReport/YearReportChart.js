import React, {Component} from 'react';
//import { Chart } from 'react-google-charts';
import Chart from 'chart.js'

var year = '2017';

class YearReportChart extends React.Component {
  render() {
  var data = this.props.revenueyearsrpt;
  $(function(){
    var labels = [];
    var bardata = [];
    var ctx = document.getElementById('YearReportChart').getContext('2d');

    for(var d in data){
      if(data.hasOwnProperty(d)){
        labels.push(data[d][0])
        bardata.push(data[d][1])
      }
    }
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
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
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    barPercentage: 0.2,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                 xAxes: [{
                barPercentage: 0.1
            }]
            } 
        }
    });
  })
    return (
      <canvas id="YearReportChart"></canvas>
    );
  }
}
export default YearReportChart;