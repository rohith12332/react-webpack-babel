import React, {Component} from 'react';
//import { Chart } from 'react-google-charts';
import Chart from 'chart.js'

var year = '2017';

class WeeklyChart extends React.Component {
  render() {
  var data = this.props.weeklyreport;
  var sorter = {
  // "sunday": 0, // << if sunday is first day of week
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6,
  "sunday": 7
}
console.log(data)
/*data.sort(function sortByDay(a, b) {
  var day1 = a[0].toLowerCase();
  var day2 = b[0].toLowerCase();
  return sorter[day1] > sorter[day2];
});*/

  $(function(){
    var bardata = [];
    var ctx = document.getElementById('myWeeklyChart').getContext('2d');

    var labels = [];
    for(var d in data){
      if(data.hasOwnProperty(d)){
        var sortDate = data[d][0].substr(0, 3);
        //labels.push(sortDate +' ('+ data[d][1] +')')
        labels.push(sortDate)
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
                    //barPercentage: 0.5,
                    categoryPercentage: 0.5,
                    ticks: {
                        beginAtZero: true,
                        fontSize: 10
                    }
                }],
                xAxes: [{
                  ticks: {
                   fontSize: 10
                  }
                 }]
            }
        }
    });
  })
    return (
      <div className="myWeeklyChart">
        <canvas id="myWeeklyChart"></canvas>
      </div>
    );
  }
}
export default WeeklyChart;