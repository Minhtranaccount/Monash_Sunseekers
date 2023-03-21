// Read the url
let url = "/api/postcode";
d3.json(url).then(function(data) 
{
    console.log(data);
    // Create variables to hold the arrays of data
    let Vics = data.filter(result => result.State == "VIC");
    let NSWs = data.filter(result => result.State == "NSW");
    let WAs = data.filter(result => result.State == "WA");
    let TASs = data.filter(result => result.State == "TAS");
    let SAs = data.filter(result => result.State == "SA");
    let NTs = data.filter(result => result.State == "NT");

    console.log(Vics);
    // Sort the data in the descending order of Potential Capacity
    Vics.sort((a,b)=>b.Potential_kilowatts- a.Potential_kilowatts);
    NSWs.sort((a,b)=>b.Potential_kilowatts- a.Potential_kilowatts);
    WAs.sort((a,b)=>b.Potential_kilowatts- a.Potential_kilowatts);
    SAs.sort((a,b)=>b.Potential_kilowatts- a.Potential_kilowatts);
    TASs.sort((a,b)=>b.Potential_kilowatts- a.Potential_kilowatts);
    NTs.sort((a,b)=>b.Potential_kilowatts- a.Potential_kilowatts);

    // Create the initial page with default graphs
    function init() {
        let  top_ten_values = [];
        let  top_ten_id  = [];
        for (let i = 0; i < 10; i++) {

        // Select top 10 potential capacity  in the correct order to plot bar chart
        top_ten_values.push(Vics[i].Potential_kilowatts);
        top_ten_id.push(Vics[i].postcode);
        };
        top_ten_values.reverse();
        top_ten_id.reverse();

        //Plot a bar chart of the top ten
        bardata = [{
        y: top_ten_id.map(item =>`PC: ${item}`),
        x: top_ten_values,
        // text: top_ten_labels,
        type: "bar",
        orientation: "h"}];
            
        barlayout = {
        title: `<b>Top 10 Potential Capacity <b>`,
        xaxis: { title: "Capacity (kwh)"},
        width: 500,
        height: 550};

        Plotly.newPlot("bar", bardata, barlayout);

        
        // Bubble Chart
        postcode = [];
        dwellings = [];
        for (let i = 0; i < Vics.length; i++) {
        postcode.push(Vics[i].postcode);
        dwellings.push(Vics[i].Est_Dwellings);}

        let bubbledata =[{
        x: postcode,
        y: dwellings,
        mode: 'markers',
        marker: {color: postcode,
                size: dwellings/2,
                colorscale:"Earth"}}];

        let bubblelayout = {
        title: '<b>Estimated Dwellings by Postcode<b>',
        xaxis: { title: "Postcode"},
        yaxis: { title: "Estimated Dwellings"}, 
        showlegend: false};

        Plotly.newPlot("bubble", bubbledata, bubblelayout);


    //     // Demographic Info
    // d3.select("#sample-metadata").append("p");
    };
    init();

    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);

    function updatePlotly(){

        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");

        // Assign the value of the dropdown menu option to a variable
        let dataset = dropdownMenu.property("value");

          // Initialise x and y arrays
        let x = [];
        let y = [];

        let x1  = [];
        let y1 = [];

        if (dataset === 'dataset1') {
                x = top_ten_values1.reverse();
                y = top_ten_id1.reverse().map(item =>`PC: ${item}`);
                let  top_ten_values1 = [];
                let  top_ten_id1  = [];
                for (let i = 0; i < 10; i++) {
                // Select top 10 potential capacity  in the correct order to plot bar chart
                top_ten_values1.push(Vics[i].Potential_kilowatts);
                top_ten_id1.push(Vics[i].postcode);
                };
                // Bubble charts
                for (let i = 0; i < NSWs.length; i++) {
                    x1.push(NSWs[i].postcode);
                    y1.push(NSWs[i].Est_Dwellings);}

          }
        
          else if (dataset === 'dataset2') {
            let  top_ten_values2 = [];
            let  top_ten_id2  = [];
            for (let i = 0; i < 10; i++) {
            // Select top 10 potential capacity  in the correct order to plot bar chart
            top_ten_values2.push(NSWs[i].Potential_kilowatts);
            top_ten_id2.push(NSWs[i].postcode);
            };
            x = top_ten_values2.reverse();
            y = top_ten_id2.reverse().map(item =>`PC: ${item}`);
            // Bubble charts
            for (let i = 0; i < NSWs.length; i++) {
            x1.push(NSWs[i].postcode);
            y1.push(NSWs[i].Est_Dwellings);}
          }

          else if (dataset === 'dataset3') {
            let  top_ten_values3 = [];
            let  top_ten_id3  = [];
            for (let i = 0; i < 10; i++) {
            // Select top 10 potential capacity  in the correct order to plot bar chart
            top_ten_values3.push(WAs[i].Potential_kilowatts);
            top_ten_id3.push(WAs[i].postcode);
            };
            x = top_ten_values3.reverse();
            y = top_ten_id3.reverse().map(item =>`PC: ${item}`);
                        // Bubble charts
            for (let i = 0; i < WAs.length; i++) {
            x1.push(WAs[i].postcode);
            y1.push(WAs[i].Est_Dwellings);}
            // Bubble charts
          }
          else if (dataset === 'dataset4') {
            let  top_ten_values4 = [];
            let  top_ten_id4  = [];
            for (let i = 0; i < 10; i++) {
            // Select top 10 potential capacity  in the correct order to plot bar chart
            top_ten_values4.push(TASs[i].Potential_kilowatts);
            top_ten_id4.push(TASs[i].postcode);
            };
            x = top_ten_values4.reverse();
            y = top_ten_id4.reverse().map(item =>`PC: ${item}`);
            // Bubble charts
            for (let i = 0; i < TASs.length; i++) {
                x1.push(TASs[i].postcode);
                y1.push(TASs[i].Est_Dwellings);}
          }
          else if (dataset === 'dataset5') {
            let  top_ten_values5 = [];
            let  top_ten_id5  = [];
            for (let i = 0; i < 10; i++) {
            // Select top 10 potential capacity  in the correct order to plot bar chart
            top_ten_values5.push(SAs[i].Potential_kilowatts);
            top_ten_id5.push(SAs[i].postcode);
            };
            x = top_ten_values5.reverse();
            y = top_ten_id5.reverse().map(item =>`PC: ${item}`);
            // Bubble charts
            for (let i = 0; i < SAs.length; i++) {
                x1.push(SAs[i].postcode);
                y1.push(SAs[i].Est_Dwellings);}
          }
        
          else if (dataset === 'dataset6') {
            let  top_ten_values6 = [];
            let  top_ten_id6  = [];
            for (let i = 0; i < 10; i++) {
            // Select top 10 potential capacity  in the correct order to plot bar chart
            top_ten_values6.push(NTs[i].Potential_kilowatts);
            top_ten_id6.push(NTs[i].postcode);
            };
            x = top_ten_values6.reverse();
            y = top_ten_id6.reverse().map(item =>`PC: ${item}`);
            // Bubble charts
            for (let i = 0; i < NTs.length; i++) {
                x1.push(NTs[i].postcode);
                y1.push(NTs[i].Est_Dwellings);}
          }

        // Bar Chart
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);

        // Bubble Chart
        Plotly.restyle('bubble', "x", [x1]);
        Plotly.restyle('bubble', "y", [y1]);
        Plotly.restyle('bubble', "text", [labels]);
        Plotly.restyle('bubble', "marker.color", [x1]);
        Plotly.restyle('bubble', "marker.size", [y1])
        
    };


})