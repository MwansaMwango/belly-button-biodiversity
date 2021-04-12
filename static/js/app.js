// Declare globla variables to store sample data
var sample_data;
var samples;

// Read in Sample data from json file
d3.json("samples.json").then((data) => {
  sample_data = data;
  // console.log("Samples Data:", sample_data);
  samples = sample_data.samples;
  // console.log("Samples:", samples);

  // Display the default plot

  // Read in test subject id options for drop down list
  var optionsTestSubjectID = sample_data.names;
  console.log("Options", optionsTestSubjectID);
  optionsTestSubjectID.forEach((id) => {
    d3.select("#selDataset").append("option").text(id);
  });

  init();
});

function init() {
  // Function to update h. bar chart
  function updatePlotly(top10ByOtu) {
    console.log("top10ByOtu", top10ByOtu)
  // Reverse the array to accommodate Plotly's defaults
    reversedData = top10ByOtu.reverse()
    // Create your Bar plot trace.
    var trace1 = {
      x: reversedData.map(sample => sample.sample_value),
      y:reversedData.map(sample =>  String(`OTU ${sample.otu_id}`)),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'rgba(55,128,191,0.6)',
        line: { width: 2 }
      },
    };
    //Create the data array for our plot
    var data = [trace1];
    //Define our plot layout
    var layout = {
      title: "Top 10 OTUs - Bar Chart",
      width: 600,
      height: 800
     };
    //Plot the chart to a div tag with id "bar"
    Plotly.newPlot("bar", data, layout);

    // Create your bubble chart plot
    var trace2 = {
      x: reversedData.map(sample => sample.otu_id),
      y: reversedData.map(sample => sample.sample_value),
      mode: 'markers',
      marker: {
        size: reversedData.map(sample => sample.sample_value),
        color: reversedData.map(sample => sample.otu_id),
        colorscale:[[0, 'blue'],[0.25, 'green'],[0.5, 'yellow'], [0.75, 'rgb(87,47,19)'],[1, 'white']],
        sizeref: 0.02,
        cmin: 0,
        cmax: 3600,
        sizemode: 'area'
      },
      type: 'scatter'
    };
    
    var data = [trace2];
    
    var layout = {
      title: 'Top 10 OTUs - Bubble Chart',
      showlegend: false,
      height: 600,
      width: 800,
      xaxis: {title: "OTU ID"},

    };
    
    Plotly.newPlot('bubble', data, layout);

    
  }

  function updateMetadata(selectedMetadata) {
    d3.select("#sample-metadata").html(`
      <p><strong>Id</strong>: ${selectedMetadata.id}</p>  
      <p><strong>Ethnicity</strong>: ${selectedMetadata.ethnicity}</p>
      <p><strong>Gender</strong>: ${selectedMetadata.gender}</p>
      <p><strong>Age</strong>: ${selectedMetadata.age}</p>
      <p><strong>Location</strong>: ${selectedMetadata.location}</p>
      <p><strong>Belly Button Type</strong>: ${selectedMetadata.bbtype}</p>
      <p><strong>Wash Frequency</strong>: ${selectedMetadata.wfreq}</p> 
    `);
    // TODO: Plot gauge
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: selectedMetadata.wfreq,
        title: { text: "Frequency of Washes", font: { size: 24 } },
        delta: { reference: 0, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "darkred" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 250], color: "cyan" },
            { range: [250, 400], color: "royalblue" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 7
          }
        }
      }
    ];
    
    var layout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "darkblue", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', gaugeData, layout);
    
  }
  // Function find the top 10 OTU in individual sample
  function filterTop10ById(testSubjectId) {
    console.log("All samples", samples);
    subjectSample = samples.filter(function (sample) {
      return sample.id === testSubjectId;
    });

    // Create new object pairing 'otu_ids:sample_values'
    var otu_ids = subjectSample[0].otu_ids;
    console.log("subjectSample", otu_ids);
    console.log("otu_ids", otu_ids);
    subjectSampleArr = [];
    otu_ids.map(function (id, index) {
      subjectSampleArr.push({ 'otu_id': id, 'sample_value': subjectSample[0].sample_values[index] }); // to assign key must use square brackets around key variable
    });
    console.log("Selected Sample Arr", subjectSampleArr);
    // Sort by number of sample values in descending order
    var sortedByOtuDesc = subjectSampleArr.sort(
      (a, b) => b.sample_values - a.sample_values
    ); // Descending order

    // Slice first 10 values i.e. top 10
    var top10ByOtu = sortedByOtuDesc.slice(0, 10);

    // Check sorted result
    console.log("Top 10 OTU Samples", top10ByOtu);
    //Return top10ByUTU
    return top10ByOtu
  }

  // On change to the DOM, call getData()
  d3.selectAll("#selDataset").on("change", optionChanged);

  // Function called by DOM changes
  function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var testSubjectIDVal = dropdownMenu.property("value");
    console.log("testSubjectIDVal", testSubjectIDVal);
    //Get new metadata
    console.log("Metadata list", sample_data.metadata);
    var selectedMetadata = sample_data.metadata.filter((selectedMetadata) => {
      return selectedMetadata.id === +testSubjectIDVal; // must return something, must parseint from DOM string
    })[0]; // select first and only results from returned filtered array
    // console.log("Selected test subject metadata:", selectedMetadata);

    // Call function to filter data by testSubjectID
    var top10ByOtu = filterTop10ById(testSubjectIDVal);
    // Call function to update the meta data
    updateMetadata(selectedMetadata);
    // Call function to update the charts
    updatePlotly(top10ByOtu);
  }

  // Initialise default values on load
  var defaultID = "940"; //must be string
  var defaultMetadata = sample_data.metadata.filter((selectedMetadata) => {
    return selectedMetadata.id === +defaultID; // must return something, must parseint from hard coded string
  })[0]; // select first and only results from returned filtered array
  var defaultTop10ByOtu = filterTop10ById(defaultID);
  // Update Demographic info / metadata
  updateMetadata(defaultMetadata);
  // Update  Charts
  updatePlotly(defaultTop10ByOtu);
}
