function init() {
d3.json("/api/regions").then((d)=> { 

    console.log('regions',d);
    regions =[]
    for (let i = 0; i < d.length; i++) { 
      regions.push(d[i].Region)
    };
    console.log('regions',regions)
    let dropdown = d3.select("#selRegion");
    // Vics.sort((a,b)=>b.Potential_kilowatts- a.Potential_kilowatts);
  //postcode dropdown
    regions.map((x) => {
      dropdown.append("option").text(x).property("value", x);
    });
    let firstregion = regions[0];
    console.log(firstregion);
    regionChanged(firstregion);

  });
}

init();

  function regionChanged(activeRegion) {
    d3.json("/api/regions").then((d)=> {
      
      let totalcap = 0
      let totaldwel = 0
      let totalcount = 0
      for (let i = 0; i < d.length; i++) {
        totalcap = totalcap + d[i].Capacity;
        totaldwel = totaldwel + d[i].Est_Dwellings;
        totalcount = totalcount + d[i].Count_under_10kw + d[i].Count_10_to_100kw;
      };
      console.log('totalcap',totalcap)
      console.log('totaldwel',totaldwel)
      console.log('totalcount',totalcount)
      
      let regiondata = d.filter((d) => d.Region == activeRegion);
      console.log('regiondata',regiondata);
    
      let installations = regiondata[0].Installations
      let capacity = regiondata[0].Capacity
      let avaeragecap = (capacity/installations).toFixed(2);
      d3.select("#region_details").html("");
      d3.select("#region_details").append("h6").text(`The number of current installations for postcode 
                ${activeRegion} is ${installations} with a capcity of ${capacity} kw and an average 
                available capacity of ${avaeragecap} kw.`);

      let sorted = d.sort(function(a, b){ return d3.descending(a.Capacity, b.Capacity); });
      let top10 = sorted.slice(0,10);
      console.log('top10',top10);
      let y = top10.map(x => x.Capacity);
      let x = top10.map(x => x.Region);
      let text = x
        // let x = top10.map(x => x.postcode);
  
      // createbubblechart(y_bubble,x_bubble, text_bubble, bubblesize);
      // // creategauge(activesample);
  
      createbarchart(y, x, text);
  });
}

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
    title: "Top 10 Regions",
    xaxis: { title: "Postcode" },
    yaxis: { title: "Instals" },
  };

  Plotly.newPlot("bar", barChart, layout);

}
