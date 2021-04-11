// Read in Sample data
var sample_data;
var samples;

d3.json("samples.json").then((data) => {
  sample_data = data;
  console.log("Sample Data:", sample_data);
  samples = sample_data.samples;

  // Read in test subject id from drop down list
  // d3.event("on", handleOnChange)
  // var selectedTestSubject = d3.select("selDataset")

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

  // Function called by DOM changes
  function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var testSubjectIDVal = dropdownMenu.property("value");
    // Call function to filter data by testSubjectID
    filterTop10ById(testSubjectIDVal);
    // Call function to update the chart
    updatePlotly(data);
  }

  // On change to the DOM, call getData()
  d3.selectAll("#selDataset").on("change", optionChanged);
});

// Function to update chart
function updatePlotly(data) {

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