import React, {Component} from 'react';
//import { Chart } from 'react-google-charts';
//import Chart from 'chart.js'

class Max extends React.Component {
  render() {

      console.log(this.props.top5sellingreportlist)
  var data = this.props.top5sellingreportlist;
  $(function(){
    var label = [];
    var bardata = [];
    var ctx = document.getElementById('max').getContext('2d');
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
        backgroundColor: 'lightblue',
        fill:false,
        borderColor: 'green',
        label: 'Top',
        data: [data[4][1],data[3][1],data[2][1],data[1][1],data[0][1]]
      },
    ], labels: [data[4][0],data[3][0],data[2][0],data[1][0],data[0][0],""]
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
                  barPercentage:1.0,
                    ticks: {
                        beginAtZero: false,
                        suggestedMax: 100,
                        suggestedMin: 0 ,
                    }
                }]
            }
        }
    });
  })
    return (
        <div style={{width: '100%',}}>
            <canvas id="max"></canvas>
        </div>
    );
  }
}
export default Max;
