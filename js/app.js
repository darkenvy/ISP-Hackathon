// These are for our charts
var datasetTitles = []
var dataset1 = []
var dataset2 = []

function crunchData() {
  // labels: netData.sort().splice(0,5).map(function(item, idx) {return item.isp}),
  function sortActualDl(a,b) {
    if (a.actual_download < b.actual_download ) {
      return 1;
    } else {return -1;}
  }

  function cutCrap(array) {
    var newArray = []
    for (var i=array.length-1; i>0; i--) {
      if (array[i].cost_of_service != '100_or_above') continue; // Skip if not $100+
      if (array[i].isp == null) continue; // Skip this cycle if null
      if (!/AS/.test(array[i].isp)) {
        newArray.push(array[i])
      }
    }

    return newArray
  }

  // Sort data – Used for calculations
  var regexData = cutCrap(netData)
  var sortData = regexData.sort(sortActualDl)
  var bigList = {}
  var bigList2 = {}

  // Make key/value pair
  sortData.forEach(function(item) {
    bigList[item.isp] === undefined ? bigList[item.isp] = [] : false
    bigList[item.isp].push(item.actual_download) 
    bigList2[item.isp] === undefined ? bigList2[item.isp] = [] : false
    bigList2[item.isp].push(item.advertised_download) 
  })

  // construct all 3 dataset arrays
  // PS: they all line up. We just assume this
  for (item in bigList) {
    datasetTitles.push(item)
    var avgAct = bigList[item].reduce(function(a,b) {return a+b}, 0) / bigList[item].length;
    var avgAd = bigList2[item].reduce(function(a,b) {return a+b}, 0) / bigList2[item].length;
    dataset1.push(avgAct.toFixed(2))
    dataset2.push(avgAd.toFixed(2))
  }

  // Thin out the data to only have 7 elements
  datasetTitles = datasetTitles.splice(0,7)
  dataset1 = dataset1.splice(0,7)
  dataset2 = dataset2.splice(0,7)
}

// ====================== Graph.js Main =================== //

$(document).ready(function() {
  crunchData()
  
  
  // --------------- Chart 1 ------------- //
  var randomScalingFactor = function() {
      return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
  };
  var randomColorFactor = function() {
      return Math.round(Math.random() * 255);
  };

  var barChartData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      labels: datasetTitles,
      datasets: [{
          label: 'Actual Speeds',
          backgroundColor: "rgba(220,220,220,0.7)",
          data: dataset1
      }, {
          label: 'Advertised Speeds',
          backgroundColor: "rgba(151,187,205,0.9)",
          data: dataset2
      }]

  };

  // ---------------- Chart 2 ----------------- //

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  var randomScalingFactor = function() {
      return Math.round(Math.random() * 100);
      //return 0;
  };
  var randomColorFactor = function() {
      return Math.round(Math.random() * 255);
  };
  var randomColor = function(opacity) {
      return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
  };

  var config = {
      type: 'line',
      data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
              label: "My First dataset",
              data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
              fill: false,
              borderDash: [5, 5],
          }, {
              hidden: true,
              label: 'hidden dataset',
              data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
          }, {
              label: "My Second dataset",
              data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
          }, {
              label: "My Second dataset",
              data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
          }, {
              label: "My Second dataset",
              data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
          }, {
              label: "My Second dataset",
              data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
          }]
      },
      options: {
          responsive: true,
          title:{
              display:true,
              text:'Chart.js Line Chart'
          },
          tooltips: {
              mode: 'label',
          },
          hover: {
              mode: 'dataset'
          },
          scales: {
              xAxes: [{
                  display: true,
                  scaleLabel: {
                      display: true,
                      labelString: 'Month'
                  }
              }],
              yAxes: [{
                  display: true,
                  scaleLabel: {
                      display: true,
                      labelString: 'Value'
                  },
                  ticks: {
                      suggestedMin: -10,
                      suggestedMax: 250,
                  }
              }]
          }
      }
  };

  $.each(config.data.datasets, function(i, dataset) {
      dataset.borderColor = randomColor(0.4);
      dataset.backgroundColor = randomColor(0.5);
      dataset.pointBorderColor = randomColor(0.7);
      dataset.pointBackgroundColor = randomColor(0.5);
      dataset.pointBorderWidth = 1;
  });

  // ------------- Load All Charts ---------------- //

  window.onload = function() {
      // Load Graph 1
      var ctx = document.getElementById("canvas").getContext("2d");
      window.myBar = new Chart(ctx, {
          type: 'bar',
          data: barChartData,
          options: {
              title:{
                  display:true,
                  text:"Seattle ISP Download Speeds – In Mbps"
              },
              tooltips: {
                  mode: 'label'
              },
              responsive: true,
              scales: {
                  xAxes: [{
                      stacked: true,
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              }
          }
      });

      // Load Graph 2
      var ctx2 = document.getElementById("canvas2").getContext("2d");
      window.myLine = new Chart(ctx2, config);
  };

})