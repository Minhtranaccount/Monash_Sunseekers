// Load url data
let url1 = "/api/states";

// Load data using D3
d3.json(url1).then(function(data) {

  // Parse data into chartData format
  var chartData = data.map(function(state) {
    return {
      Capacity: state.Capacity,
      Potential_kilowatts: state.Potential_kilowatts,
      installations: state.Installations,
      dwellings: state.Est_Dwellings,
      state: state.State
    };
  });

  console.log(chartData);

  // creat the bar chart using D3 and chart.js
  var ctx1 = d3.select("#myChart").node().getContext("2d");
  var chart1 = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: chartData.map(function(state) {
        return state.state;
      }),
      datasets: [
        {
          label: "Installations",
          data: chartData.map(function(state) {
            return state.installations;
          }),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1
        },
        {
          label: "Est. Dwellings",
          data: chartData.map(function(state) {
            return state.dwellings;
          }),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      plugins: {
        title: {
          align: "center",
          position: "top",
          display: true,
          text: "Installations vs Estimated Dwellings by State",
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
  });

  // Create the line graph using D3 and Chart.js
  var ctx2 = d3.select("#myChart2").node().getContext("2d");
  var chart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: chartData.map(function(state) {
        return state.state;
      }),
      datasets: [
        {
          label: "Current Capacity (KW)",
          data: chartData.map(function(state) {
            return state.Capacity;
          }),
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          fill: false
        },
        {
          label: "Potential Capacity (KW)",
          data: chartData.map(function(state) {
            return state.Potential_kilowatts;
          }),
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          fill: false
        }
      ]
    },
    options: {
      plugins: {
        title: {
          align: "center",
          position: "top",
          display: true,
          text: "Current KW Capacity vs Potential KW Capacity",
        },
        scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
  });
}).catch(function(error) {
  console.error(error);
});