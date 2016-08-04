// These are for our charts
var datasetTitles = []
var dataset1 = []
var dataset2 = []
var dataset3 = []
var monthData = {}

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
  var bigList3 = {}
  var bigList4 = {}

  // Make key/value pair
  sortData.forEach(function(item) {
    bigList[item.isp] === undefined ? bigList[item.isp] = [] : false
    bigList[item.isp].push(item.actual_download) 
    bigList2[item.isp] === undefined ? bigList2[item.isp] = [] : false
    bigList2[item.isp].push(item.advertised_download) 
    bigList3[item.isp] === undefined ? bigList3[item.isp] = [] : false
    bigList3[item.isp].push({
      "time": item.timestamp,
      "actual_download": item.actual_download,
      "advertised_download": item.advertised_download
    })
    tinyList3 = {}

  })

  // console.log(bigList3);

  // Convert bigList3 items (times in unix time) to months


  // construct all 3 dataset arrays
  // PS: they all line up. We just assume this
  for (item in bigList) {
    datasetTitles.push(item)
    var avgAct = bigList[item].reduce(function(a,b) {return a+b}, 0) / bigList[item].length;
    var avgAd = bigList2[item].reduce(function(a,b) {return a+b}, 0) / bigList2[item].length;
    for (i in bigList3) {
      // We have to drill down and average speeds based on month
      bigList3[i].forEach(function(each, idx) {
        // Get the lookup key. The lookup ke will be 0-11 (month).
        var theKey = new Date(bigList3[i][idx].time * 1000).getMonth();
        // 3 keys in this array. running total actual, running total ads, count
        if (monthData[theKey] === undefined) {
          monthData[theKey] = {};
          monthData[theKey][i] = [0,0,0]
        }
        if (monthData[theKey][i] === undefined) {
          monthData[theKey][i] = [0,0,0]
        }
        // monthData[theKey] === undefined ? monthData[theKey] = {} : false
        // console.log(monthData[theKey]);
        monthData[theKey][i][0] += bigList3[i][idx].actual_download
        monthData[theKey][i][1] += bigList3[i][idx].advertised_download
        monthData[theKey][i][2] += 1
      })
      // bigList3[i].reduce(function(a,b) {return a+b}, 0)
      // tinyList3[item] = [bigList3[item].reduce(function(a,b) {return a+b.actual_download}, 0) / bigList3[item].length ]
      // tinyList3[item].push(bigList3[item].reduce(function(a,b) {return a+b.advertised_download}, 0) / bigList3[item].length)
    }
    
    dataset1.push(avgAct.toFixed(2))
    dataset2.push(avgAd.toFixed(2))
  }
  console.log(monthData);



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
          backgroundColor: "rgba(220,220,220,0.5)",
          data: dataset1
      }, {
          label: 'Advertised Speeds',
          backgroundColor: "rgba(151,187,205,0.5)",
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

  function validData(month, name) {
    if (monthData[month].hasOwnProperty(name)) {
      if (monthData[month][name].length == 3) {
        return monthData[month][name][0] / monthData[month][name][2] 
      }
    }
    else {
      return 0
    }
  }

  var config = {
      type: 'line',
      data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{
              label: datasetTitles[0],
              // data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
              data: [ validData(1,'centurylink'),
                      validData(2,'centurylink'),
                      validData(3,'centurylink'),
                      validData(4,'centurylink'),
                      validData(5,'centurylink'),
                      validData(6,'centurylink')
                     ],
              fill: false,
              // borderDash: [5, 5],
          }, {
              label: datasetTitles[1],
              // data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
              data: [ validData(1,'comcast'),
                      validData(2,'comcast'),
                      validData(3,'comcast'),
                      validData(4,'comcast'),
                      validData(5,'comcast'),
                      validData(6,'comcast')
                     ],
              fill: false,
          }, {
              hidden: true,
              label: datasetTitles[2],
              // data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
              data: [ validData(1,'verizon'),
                      validData(2,'verizon'),
                      validData(3,'verizon'),
                      validData(4,'verizon'),
                      validData(5,'verizon'),
                      validData(6,'verizon')
                     ],
              fill: false,
          }, {
              hidden: true,
              label: datasetTitles[3],
              // data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
              data: [ validData(1,'frontier'),
                      validData(2,'frontier'),
                      validData(3,'frontier'),
                      validData(4,'frontier'),
                      validData(5,'frontier'),
                      validData(6,'frontier')
                     ],
              fill: false,
          }, {
              hidden: true,
              label: datasetTitles[4],
              // data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
              data: [ validData(1,'twc'),
                      validData(2,'twc'),
                      validData(3,'twc'),
                      validData(4,'twc'),
                      validData(5,'twc'),
                      validData(6,'twc')
                     ],
              fill: false,
          }, {
              hidden: true,
              label: datasetTitles[5],
              // data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
              data: [ validData(1,'wave'),
                      validData(2,'wave'),
                      validData(3,'wave'),
                      validData(4,'wave'),
                      validData(5,'wave'),
                      validData(6,'wave')
                     ],
              fill: false,
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