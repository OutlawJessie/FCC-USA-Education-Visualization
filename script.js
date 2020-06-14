// FCC Testing information.
const projectName = "choropleth";
localStorage.setItem('example_project', 'D3: Choropleth');


// URLs for education and county data.
const EDUCATION_URL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const COUNTY_URL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';


// Sequential 9-class PuBuGn color scheme from colorbrewer2.org
var colors = ['#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636'].reverse();

// Set global variables for visualization.
var width = 800;
var height = 400;
var marginLeft = 60;
var marginTop = 0;//-20; // pull y-axis up.

// Legend stuff.
var legendRectWidth = 40;
var legendRectHeight = 30;

// Add an h1 title.
var section = d3.select(".header-info")
	        .append("h1")
	        .attr("id","title")
	        .text("College Education in the USA");

// Tooltip for mouseover inside json function.
var tooltip = d3.select("body") // Doesn't work if you select d3-div
    .append("div")
    .attr("id","tooltip")
    .style("display","none"); // will set display of tooltip for each rect


// Declare svg d3 object.
var svgStuff = d3.select(".d3-div")
            .append("svg")             // will append svg to this!
            .attr("width", width*1.15)
            .attr("height", height*1.15);



// Start creating legend.
var legend = svgStuff.append("g")
    .attr("id", "legend");

// Add description.
svgStuff.append('text')
    .attr('x', width/20 )
    .attr('y', -50)//height + 120)
    .attr("id", "description")
    .text('Percentage of adults 25 years of age and older with a bachelors degree.')
    .attr('font-style', 'italic');

// Load datasets.
(async function loadAndVisualizeData() {
    try {
	
	// Load datasets.
	var eduData = await d3.json(EDUCATION_URL);
	var countyData = await d3.json(COUNTY_URL);

	// Map array of objects containing education level to
	// array, and get max/min.
	const bachelorsOrHigher = eduData.map( obj => obj["bachelorsOrHigher"]  );
	const minEdu = d3.min(bachelorsOrHigher);
	const maxEdu = d3.max(bachelorsOrHigher);

	// zScale for education levels.
	const zScale = d3.scaleQuantile()
	    .domain([minEdu, maxEdu])
	    .range(colors);


	// Create shape generator that that will take a GeoJSON object
	// and convert it into an SVG path string.
	const shape = d3.geoPath();

	
      
  } catch (error) {console.log(error.name, error.message);}

})(); // Call function in place.



