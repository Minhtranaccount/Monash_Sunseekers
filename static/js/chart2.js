

function init() {
d3.json("/api/postcode").then((d)=> { 

    console.log('data',d);
   
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

      // Summarise AUS data
      let totalcap_aus = 0
      let totaldwel_aus = 0
      let totalcount_aus = 0
      let totalpot_aus = 0
      let totalinst_aus = 0
      for (let i = 0; i < d.length; i++) {
        totalcap_aus = totalcap_aus + d[i].Capacity_10_to_100kw + d[i].Capacity_under_10kw;
        totaldwel_aus = totaldwel_aus + d[i].Est_Dwellings;
        // totalcount_aus = totalcount_aus + d[i].Count_under_10kw + d[i].Count_10_to_100kw;
        totalpot_aus =  totalpot_aus + d[i].Pot_10_to_100kw + d[i].Potential_kilowatts;
        totalinst_aus =  totalinst_aus + d[i].Installations - d[i].Count_over_100kw;
      };
      // Installations - filteredactive[0].Count_over_100kw
      // data for comparechart
      let pot_per_dwel_aus = (totalpot_aus/totaldwel_aus).toFixed(2);
      let cap_per_dwel_aus = (totalcap_aus/totaldwel_aus).toFixed(2);
      let cap_per_inst_aus = (totalcap_aus/totalinst_aus).toFixed(2);

      //get the postcode data
      filteredactive = d.filter(x => x.postcode == activePostcode);
      console.log('filtered',filteredactive);
     

      let installations = filteredactive[0].Installations - filteredactive[0].Count_over_100kw
      let totalcap0_100active_pc = filteredactive[0].Capacity_10_to_100kw + filteredactive[0].Capacity_under_10kw;
      let activepostcodesate = filteredactive[0].State;
      let activepostcoderegion = filteredactive[0].Region;
      let activepostcodesuburb = filteredactive[0].Suburb;
      let activepostcodedwellings = filteredactive[0].Est_Dwellings;
      let pot_per_dwel_pc = (filteredactive[0].Potential_kilowatts/filteredactive[0].Est_Dwellings).toFixed(2);
      let cap_per_dwel_pc = (totalcap0_100active_pc/activepostcodedwellings).toFixed(2);
      let cap_per_inst_pc = (totalcap0_100active_pc/installations).toFixed(2);
      d3.select("#region_details").html("");
      d3.select("#region_details").append("h6").text(`The number of current installations for postcode 
                ${activePostcode} in suburb ${activepostcodesuburb} and region ${activepostcoderegion} is ${installations} with a capcity of ${totalcap0_100active_pc} kw, the average capacity per dwelling is ${cap_per_dwel_pc} 
                 state is ${activepostcodesate}
                cap per dwelling is ${cap_per_dwel_pc} kw and capacity per installation is ${cap_per_inst_pc} kw. and the potential per dwelling is ${pot_per_dwel_pc} kw. `);

      let sorted = d.sort(function(a, b){ return d3.descending(a.Capacity, b.Capacity); });
      let top10 = sorted.slice(0,10);
      console.log('top10',top10);
      let y = top10.map(x => x.Capacity);
      let x = top10.map(x => x.Region);
      let text = x
  
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
