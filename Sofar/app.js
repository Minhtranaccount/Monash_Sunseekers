// get the data from the specified location
let apvi = "APVI_coordinates.json";


function init() {
  d3.json(apvi).then((d) => {
 
    let postcodes = d.map( function(d) { return d["postcode"] });
 
    console.log(postcodes);
    
    let dropdown = d3.select("#selPostcode");
  
  //postcode dropdown
  postcodes.map((x) => {
    dropdown.append("option").text(x).property("value", x);
  });
  let firstpostcode = postcodes[0];
  console.log(firstpostcode);
  postcodeChanged(firstpostcode);

  });
}
init();

// //create the barchart
  function createbarchart(y, x, text) {
    
      let barChart = [
        {
          y: y,
          x: x,
          mode: "markers",
          text: text,
          type: "bar",
          // orientation: "h",
        },
      ];

      let layout = {
        title: "Top 10 Postcodes",
        xaxis: { title: "Postcode" },
        yaxis: { title: "Instals" },
      };

      Plotly.newPlot("bar", barChart, layout);
    
  }

// create the bubblechart
function createbubblechart(y_bubble,x_bubble, text_bubble, bubblesize) {
  

    let bubbleChart = [
      {
        y: y_bubble,
        x: x_bubble,
        type: "bubble",
        mode: "markers",
        text: text_bubble,
        marker: {
          size: bubblesize,
          color: x_bubble,
          colorscale: "Earth",
        },
      },
    ];

    let layout = {
      title: "Top 10 Installations per postcode",
      yaxis: { title: "Installations" },
      xaxis: { title: "Postcode" },
    };
Plotly.newPlot("bubble", bubbleChart, layout);
}

// optionChanged function as per line 25 index.html (<select id="selDataset" onchange="optionChanged(this.value)"></select>)
function postcodeChanged(activePostcode) {
  
  d3.json(apvi).then((d) => {
    console.log("data for postcode changed",d);

    //fill the postcode info
    let postcodedata = d.filter((d) => d.postcode == activePostcode);
    console.log('postcodedata',postcodedata);
    // empty box so appemd does not just append
  
    let instals = postcodedata[0].instals
    let suburb = postcodedata[0].SA4_NAME_2016
    let capacity = postcodedata[0].capacity
    let avaeragecap = (capacity/instals).toFixed(2);
    d3.select("#postcode_details").html("");
    d3.select("#postcode_details").append("h6").text(`The number of current installations for postcode 
              ${activePostcode} in ${suburb} is ${instals} with a capcity of ${capacity} kw and an average 
              available capacity of ${avaeragecap} kw.`);

  
    victoria=d.filter((d) => d.state == "VIC");
    console.log('filteredvic',victoria);

    let sorted = victoria.sort(function(a, b){ return d3.descending(a.instals, b.instals); });
    let top10 = sorted.slice(0,10);
    console.log('top10',top10);
    let y = top10.map(x => x.instals);
    let x = top10.map(x => x.postcode);
    // let x = top10.map(x => x.postcode);
    
    let text = x;
    console.log("yaxis",y);
    console.log("xaxis",x);

      let y_bubble = top10.map(x => x.instals);
      let x_bubble =top10.map(y => y.postcode.toString() );
      let text_bubble = x_bubble
      let bubblesize1 = top10.map(x => x.capacity);
      let divisor = 1000
      let bubblesize = bubblesize1.map(v =>(v/divisor));
        
      // let bubblesize = bubblesize1/10
      console.log('bubblesize',bubblesize);

      // populateDemographicsBox(activesample);
    // createbarchart(y, x, text);
    createbubblechart(y_bubble,x_bubble, text_bubble, bubblesize);
    // creategauge(activesample);

    createbarchart(y, x, text);

  });   
}

