import React, {Component} from 'react';
//import { Chart } from 'react-google-charts';
class ProductsChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        pieHole: 0,
        "width": "100%",
      },
    rows: [
          ['Credit Card', 11],
          ['Cash', 6],
          ['Master Group', 6]
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
    (function() {

  // Fake JSON data
  var json = {"countries_msg_vol": {
    "CA": 70, "US": 193, "BB": 12, "CU": 9, "BR": 89, "MX": 192, "PY": 32, "UY": 9, "VE": 25, "BG": 42, "CZ": 12
  }};

  // D3 Bubble Chart

  var diameter = 600;

  var svg = d3.select('#graph').append('svg')
          .attr('width', diameter)
          .attr('height', diameter);

  var bubble = d3.layout.pack()
        .size([diameter, diameter])
        .value(function(d) {return d.size;})
         // .sort(function(a, b) {
        //  return -(a.value - b.value)
        // })
        .padding(3);

  // generate data with calculated layout values
  var nodes = bubble.nodes(processData(json))
            .filter(function(d) { return !d.children; }); // filter out the outer bubble

  var vis = svg.selectAll('circle')
          .data(nodes);

  vis.enter().append('circle')
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .attr('r', function(d) { return d.r; })
      .attr('class', function(d) { return d.className; });

  function processData(data) {
    var obj = data.countries_msg_vol;

    var newDataSet = [];

    for(var prop in obj) {
      newDataSet.push({name: prop, className: prop.toLowerCase(), size: obj[prop]});
    }
    return {children: newDataSet};
  }

})();
    //var data = JSON.stringify(this.props.revenuereport);
    //console.log(data)
    return (
      <section id="graph"></section>
    );
  }
}
export default ProductsChart;