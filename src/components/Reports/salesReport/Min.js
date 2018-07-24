import React, {Component} from 'react';
//import { Chart } from 'react-google-charts';
//import Chart from 'chart.js'

class Min extends React.Component {
  render() {

      console.log(this.props.Bottom5sellingreportlist)
  var data= this.props.Bottom5sellingreportlist;
  $(function(){
    var label = [];
    var bardata = [];
    var ctx = document.getElementById('min').getContext('2d');
    for(var d in data){
      if(data.hasOwnProperty(d)){
        bardata.push(data[d][1]);
      }
    }
    console.log(data);
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
      datasets: [{
        backgroundColor: 'red',
        fill:false,
        borderColor: 'pink',
        label: 'Bot',
        data: bardata,
      },
      ], labels: [data[0][0],data[1][0],data[2][0],data[3][0],data[4][0]]
},
        // Configuration options go here
        options: {
            responsive: true,
            legend: {
                display: false,
                position: 'bottom',
            },
            scales: {
                yAxes: [{
                    barPercentage: 2.0,
                    ticks: {
                        beginAtZero: false,
                        suggestedMax: 10,
                    }
                }]
            }
        }
    });
  })
    return (
        <div style={{width: '100%',}}>
            <canvas id="min"></canvas>
        </div>
    );
  }
}
export default Min;
