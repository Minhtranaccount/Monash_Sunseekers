// Load D3 library
let url = "/api/states";

// Load data using Axios
d3.json(url).then(function(data) {

  // Parse data into chartData format
  var chartData = data.map(function(state) {
    return {
      installations: state.Installations,
      dwellings: state.Est_Dwellings,
      state: state.State
    };
  });

  console.log(chartData);

  // Create chart using D3 and Chart.js
  var ctx = d3.select("#myChart").node().getContext("2d");
  var chart = new Chart(ctx, {
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
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}).catch(function(error) {
  console.error(error);
});
