

function init() {
d3.json("/api/postcode").then((d)=> { 

    console.log('data',d);
   
    // var regionstry = d3.nest()
    //   .key(function(d) { return d.Region; })
    //   .rollup(function(v) { return {
    //     count: v.length,
    //     totalcapReg: d3.sum(v, function(d) { return d.Capacity; }),
    //     totaldwelReg: d3.sum(v, function(d) { return d.Est_Dwellings; }),
    //     totalcount10_100Reg: d3.sum(v, function(d) { return d.Count_10_to_100kw; }),
    //     totalcount1_10Reg: d3.sum(v, function(d) { return d.Count_under_10kw; }),
    //     totalcount1_10Reg: d3.sum(v, function(d) { return d.Count_overe_100kw; }),
    //     totalcapt10_100Reg: d3.sum(v, function(d) { return d.Capacity_10_to_100kw; }),
    //     totalcap1_10Reg: d3.sum(v, function(d) { return d.Capacity_under_10kw; }),
    //     totalcap1_10Reg: d3.sum(v, function(d) { return d.Capacity_overe_100kw; }),
    //     avg: d3.mean(v, function(d) { return d.amount; })
    //   }; })
    //   .entries(d);
      
    //   console.log(JSON.stringify(regionstry));

    //   d3.json(JSON.stringify(regionstry)).then((d)=> { 

    //     console.log('json',d);
    //   });

    // console.log(grouped_data)
    postcodes =[]
    for (let i = 0; i < d.length; i++) { 
      postcodes.push(d[i].postcode)
    };
    console.log('postcodes', postcodes)
    let dropdown = d3.select("#selPostcode");
    console.log(dropdown)
    
    postcodes.map((x) => {
      dropdown.append("option").text(x).property("value", x);
    });
    let firstpostcode = postcodes[0];
    console.log(firstpostcode);
    postcodeChanged(firstpostcode);

  });
}

init();

  function postcodeChanged(activePostcode) {
    d3.json("/api/postcode").then((d)=> {
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
    
      //get the data for the filtered or active region
      // let region = d.Region;
      filteredactive = d.filter(x => x.postcode == activePostcode);
      console.log('filtered',filteredactive);
     
    

      // let capacity_pc = filteredactive[0].Capacity
      // let totalcap0_100active_pc = filteredactive[0].Capacity_under_10kw;
      let suburb = filteredactive[0].Suburb;
      let totalcap0_100active_pc = filteredactive[0].Capacity_10_to_100kw + filteredactive[0].Capacity_under_10kw;
      let totaldwelactive_pc = filteredactive[0].Est_Dwellings;
      let totalcount0_100active_pc = filteredactive[0].Count_10_to_100kw + filteredactive.Capacity_under_10kw;
      let totalpotentiallactive_pc =  filteredactive[0].Potential_kilowatts;
      console.log('totalcap0_100active_pc',totalcap0_100active_pc)
      let installations = filteredactive[0].Installations - filteredactive[0].Count_over_100kw
      ;
      let avaeragecap = (totalcap0_100active_pc/installations).toFixed(2);
      let activepostcoderegion = filteredactive[0].Region;
      let activepostcodesate = filteredactive[0].State;
      let activepostcodedwellings = filteredactive[0].Est_Dwellings;
      let pot_per_dwel_pc = (filteredactive[0].Potential_kilowatts/filteredactive[0].Est_Dwellings).toFixed(2);
      let cap_per_dwel_pc = (totalcap0_100active_pc/activepostcodedwellings).toFixed(2);
      let cap_per_inst_pc = (totalcap0_100active_pc/installations).toFixed(2);
      d3.select("#region_details").html("");
      d3.select("#region_details").append("h6").text(`The number of current installations for postcode 
                ${activePostcode} in suburb ${suburb} is ${installations} with a capcity of ${totalcap0_100active_pc} kw and an average 
                available capacity of ${avaeragecap} kw. cap per psotced is ${cap_per_dwel_pc} 
                regions is ${activepostcoderegion} state is ${activepostcodesate}
                cap per dwelling is ${cap_per_dwel_pc} kw and cap per installation is ${cap_per_inst_pc} kw. and the pot per dwel is ${pot_per_dwel_pc} kw. `);

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
