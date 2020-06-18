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
var height = 500;
var marginLeft = 60;
var marginTop = 0;//-20; // pull y-axis up.

// Legend stuff.
var legendRectWidth = 40;
var legendRectHeight = 30;
var legendXpos = 0.6*width;
var legendYpos = -height*1.05;//60; // relative to height

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
	const path = d3.geoPath();


	// Create choropleth.
	svgStuff.append("g")
	    .selectAll("path")// not rect or circle here
	    .data( topojson.feature(countyData, countyData.objects.counties).features ) 	// Converts topojson to geojson
	    .enter(  )
	    .append("path")
	    .attr("d", path)
	    .attr("class", "county")
	    .attr("data-fips", (d)=> d.id)
	    .attr("data-education", (d) => eduData.filter( obj => obj.fips == d.id)[0].bachelorsOrHigher) // match current county data 'd' id with current education data obj.fips; get zeroth result in array, and get bachelorsOrHigher key 
	    .attr("fill", (d) => zScale( eduData.filter( obj => obj.fips == d.id)[0].bachelorsOrHigher      ) ) // do the same as last line, but now apply z scale to get color for county d.
	    .on("mouseover", (d) => {
		tooltip.attr("data-education", eduData.filter( obj => obj.fips == d.id)[0].bachelorsOrHigher ) // tooltip test
		.style('display', 'inline-block')		
		    .style("left", d3.event.pageX - 120 + "px") // Position x coordinate of tooltip relative to current bar
	        .style("top", d3.event.pageY + 60 + "px") // Position y coordinate of tooltip relative to current bar
	            .style('transform', 'translateX(' + marginLeft + 'px)')
		    .html(eduData.filter( obj => obj.fips == d.id)[0].area_name + ', ' + eduData.filter( obj => obj.fips == d.id)[0].state + ': ' + eduData.filter( obj => obj.fips == d.id)[0].bachelorsOrHigher + '%');
	})
	.on("mouseout", (d) => {
	    tooltip.style("display","none");
	});

	
	

	// Add legend.
	legend.selectAll("rect")
	    .data(colors)
            .enter()
	    .append("rect")
	    .attr("height",  legendRectHeight)
	    .attr("width",  legendRectWidth)
	    .attr("y", height + legendYpos)
	    .attr("x", (d, i) => i*legendRectWidth + legendXpos)
	    .style("fill", (d) => d);

	// Add legend numbers.
	legend.selectAll("text")
	    .data(colors)
	    .enter()
	    .append("text")
	    .text( (d) =>{
		let someNumber = zScale.invertExtent(d)[0]; // color to value
		return someNumber.toFixed(1); // show one digit
	    })
	    .attr("text-anchor", "middle")
	    .attr("font-size", "12px")
	    .attr("x", (d, i) => legendRectWidth*(i+0.5 ) +legendXpos )
	    .attr("y", height + legendYpos + legendRectHeight + 15);

	// Legend text.
	/*legend.append("text")
	    .text("Percent")
            .attr("x", colors.length/2 + legendXpos)
	    .attr("y", height + legendYpos + legendRectHeight + 40);*/


      
  } catch (error) {console.log(error.name, error.message);}

})(); // Call function in place.



