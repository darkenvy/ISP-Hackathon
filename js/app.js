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

// These are for our charts

var datasetTitles = []
var dataset1 = []
var dataset2 = []

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

// ====================== Graph.js Main =================== //

$(document).ready(function() {
  
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
  window.onload = function() {
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
  };

  // $('#randomizeData').click(function() {
  //     $.each(barChartData.datasets, function(i, dataset) {
  //         dataset.backgroundColor = 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
  //         dataset.data = [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()];

  //     });
  //     window.myBar.update();
  // });

})