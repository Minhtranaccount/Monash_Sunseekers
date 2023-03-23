

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
      let totalpot_aus = 0
      let totalinst_aus = 0
      for (let i = 0; i < d.length; i++) {
        totalcap_aus = totalcap_aus + d[i].Capacity_10_to_100kw + d[i].Capacity_under_10kw;
        totaldwel_aus = totaldwel_aus + d[i].Est_Dwellings;
        totalpot_aus =  totalpot_aus + d[i].Potential_kilowatts;
        totalinst_aus =  totalinst_aus + d[i].Installations - d[i].Count_over_100kw;
      };
    
      console.log('totalpot_aus', totalpot_aus)
      console.log('totaldwel_aus', totaldwel_aus)
      let a = totalpot_aus/totaldwel_aus
      console.log('a', a)
      //get the postcode data
      filteredactive = d.filter(x => x.postcode == activePostcode);
        console.log('filtered',filteredactive);
        let installations_pc = filteredactive[0].Installations - filteredactive[0].Count_over_100kw
        let totalcap0_100active_pc = filteredactive[0].Capacity_10_to_100kw + filteredactive[0].Capacity_under_10kw;
        let activepostcodesate = filteredactive[0].State;
        console.log('activepostcodesate',activepostcodesate);
        let activepostcoderegion = filteredactive[0].Region;
        let activepostcodesuburb = filteredactive[0].Suburb;
        let activepostcodedwellings = filteredactive[0].Est_Dwellings;
     
   


      for (let i = 0; i < d.length; i++) {
        totalcap_aus = totalcap_aus + d[i].Capacity_10_to_100kw + d[i].Capacity_under_10kw;
        totaldwel_aus = totaldwel_aus + d[i].Est_Dwellings;
        totalpot_aus =  totalpot_aus + d[i].Pot_10_to_100kw + d[i].Potential_kilowatts;
        totalinst_aus =  totalinst_aus + d[i].Installations - d[i].Count_over_100kw;
      };
       
      let x_ax1 = [];
      let y_ax1 = [];
      let x_ax2 = [];
      let y_ax2 = [];
      let x_ax3 = [];
      let y_ax3 = [];
      let x_ax4 = [];
      let y_ax4 = [];
      
      // Aus data to plot      
      let pot_per_dwel_aus = (totalpot_aus/totaldwel_aus).toFixed(2);
      let cap_per_dwel_aus = (totalcap_aus/totaldwel_aus).toFixed(2);
      let cap_per_inst_aus = (totalcap_aus/totalinst_aus).toFixed(2);

      console.log('pot_per_dwel_aus',pot_per_dwel_aus);



      // Postcode data to plot
      let pot_per_dwel_pc = (filteredactive[0].Potential_kilowatts/filteredactive[0].Est_Dwellings).toFixed(2);
      let cap_per_dwel_pc = (totalcap0_100active_pc/activepostcodedwellings).toFixed(2);
      let cap_per_inst_pc = (totalcap0_100active_pc/installations_pc).toFixed(2);

      y_ax1.push(cap_per_inst_aus);
      x_ax1.push("Aus");
      y_ax1.push(cap_per_inst_pc);
      x_ax1.push(`Postcode ${activePostcode}`);

      y_ax2.push(cap_per_dwel_aus);
      x_ax2.push("Aus");;
      y_ax2.push(cap_per_dwel_pc);
      x_ax2.push(`Postcode ${activePostcode}`);

      y_ax3.push(a);
      x_ax3.push("Aus");
      y_ax3.push(pot_per_dwel_pc);
      x_ax3.push(`Postcode ${activePostcode}`);


      
      d3.select("#region_details").html("");
      d3.select("#region_details").append("h5").text(`On this page you can select a postcode and compare a few key metrics with those of Australia.`)
      
      d3.select("#region_details2").html("");
      d3.select("#region_details2").append("h8").text(`The number of current installations for postcode ${activePostcode} in suburb ${activepostcodesuburb} and region ${activepostcoderegion} is ${installations_pc} with a capcity of ${totalcap0_100active_pc} kw, the average capacity per dwelling is ${cap_per_dwel_pc} 
       state is ${activepostcodesate} and the potential per dwelling is ${pot_per_dwel_pc} kw. `);

      createbarchart(y_ax1, x_ax1, x_ax1);
      createbarchart2(y_ax2, x_ax2, x_ax2);
      createbarchart3(y_ax3, x_ax3, x_ax3);

  });
}

function createbarchart(y_ax1, x_ax1, x_ax1) {
    
  let barChart = [
    {
      y: y_ax1,
      x: x_ax1,
      mode: "markers",
      marker:{
        color: ['rgba(61, 5, 230,1)', 'rgba(2, 115, 14,0.8),', 'rgba(242, 33, 10,0.8)'],
      },
      text: x_ax1,
      type: "bar",
    },
  ];

  let layout = {
    title: "Capacity per installation",
    yaxis: { title: "Capacity kw" },
    yaxis: {range: [0, 30]}
  };

  Plotly.newPlot("bar", barChart, layout);
}

function createbarchart2(y_ax2, x_ax2, x_ax2) {
    
  let barChart = [
    {
      y: y_ax2,
      x: x_ax2,
      mode: "markers",
      marker:{
        color: ['rgba(61, 5, 230,1)', 'rgba(2, 115, 14,0.8)','rgba(242, 33, 10,0.8)'],
      },
      text: x_ax2,
      type: "bar",
    },
  ];

  let layout = {
    title: "Capacity per dwelling",
    yaxis: { title: "Capacity kw" },
    yaxis: {range: [0, 15]}
  };

  Plotly.newPlot("bar2", barChart, layout);
}

function createbarchart3(y_ax3, x_ax3, x_ax3) {
    
  let barChart = [
    {
      y: y_ax3,
      x: x_ax3,
      mode: "markers",
      marker:{
        color: ['rgba(61, 5, 230,1)', 'rgba(2, 115, 14,0.8)','rgba(242, 33, 10,0.8)'],
      },
      text: x_ax3,
      type: "bar",
    },
  ];

  let layout = {
    title: "Potential per dwelling",
    yaxis: { title: "Capacity kw" },
    yaxis: {range: [0, 25]}
  };

  Plotly.newPlot("bar3", barChart, layout);
}