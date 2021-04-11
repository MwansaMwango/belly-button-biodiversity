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
  // Function to update chart
  function updatePlotly(id, data) {
    // Create your trace.
    // var trace = {
    //     x: titles,
    //     y: ratings,
    //     type: "bar",
    //     orientation: 'h',
    //     marker: {
    //         color: 'rgba(255,153,51,0.6)',
    //         width: 1
    //       }
    //   };
    //   //Create the data array for our plot
    //   var data = [trace];
    //   //Define our plot layout
    //   var layout = {
    //     title: "The highest critically acclaimed movies",
    //     xaxis: { title: "Title" },
    //     yaxis: { title: "Metascore (Critic) Rating"}
    //   };
    //   //Plot the chart to a div tag with id "bar-plot"
    //   Plotly.newPlot("bar-plot", data, layout);
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
      subjectSampleArr.push({ [id]: subjectSample[0].sample_values[index] }); // to assign key must use square brackets around key variable
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
    filterTop10ById(testSubjectIDVal);
    // Call function to update the meta data
    updateMetadata(selectedMetadata);
    // Call function to update the chart
    // updatePlotly(testSubjectIDVal, top10ByOtu);
  }

  // Initialise default values on load
  var defaultID = "940"; //must be string
  filterTop10ById(defaultID);
  var selectedMetadata = sample_data.metadata.filter((selectedMetadata) => {
    return selectedMetadata.id === +defaultID; // must return something, must parseint from hard coded string
  })[0]; // select first and only results from returned filtered array
  // Update Demographic info / metadata
  updateMetadata(selectedMetadata);
  // Update Horizontal Bar Chart 
  // updateMetadata(selectedMetadata);
  // Update Bubble Chart 
  // updateMetadata(selectedMetadata);
}
