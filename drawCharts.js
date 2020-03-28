const apiRoot = "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu";
const margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 500 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%m/%d/%y");
const formatDateToString = d3.timeFormat("%b %d")

const colors = {
  "Confirmed": "#FF0000",
  "Deaths": "#000000",
  "Recovered": "#00FF00",
}

var t = d3.transition()
  .duration(750)
  .ease(d3.easeLinear); 

var svgLineChart = d3.select("#svgLineChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svgBarGraph = d3.select("#svgBarGraph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var svgPieChartDiv= d3.select('#svgPieChartDiv')

var legendScale = d3.scaleOrdinal()
  .domain(Object.keys(colors))
  .range(Object.values(colors));


var filterDataByCountry = function(data, country){
  data = data.filter(function(d) {
    return d["Country"] ===  country;
  })

  return data;
}

var cleanData = function(data){
  let prevConfirmed, prevDeaths, prevRecovered = 0;

  let newData = []
  Object.keys(data).forEach(function(k) {
    let d = {}

    d.date = parseTime(k);
    d.confirmed = +data[k].confirmed;
    d.deaths= +data[k].deaths;
    d.recovered= +data[k].recovered;

    d.NewConfirmed = data[k].confirmed - prevConfirmed;
    prevConfirmed = +data[k].confirmed;

    d.NewDeaths = data[k].deaths - prevDeaths;
    prevDeaths = +data[k].deaths;
      
    d.NewRecovered = data[k].recovered - prevRecovered;
    prevRecovered = +data[k].recovered;

    newData.push(d);
  });

  data = newData
  var daysWithoutIncident = data.filter(function (el) {
    return el.confirmed == 0 &&
           el.deaths == 0 &&
           el.recovered == 0;
  });

  data.splice(0, daysWithoutIncident.length-1);
  return data;
}

var populateDropdown = function(data){
  let dropDown = d3.select("#country");
  let options = dropDown.selectAll("option")
    .data(data)
    .enter()
    .append("option");

  options.text(function(d) {
      return d.name;
    })
    .attr("value", function(d) {
      return d.iso3;
    });
}

d3.json("https://covid19.mathdro.id/api/countries").then(function(data) {
  populateDropdown(data.countries);
}).catch(function(error){
  console.log(error);
});

var populateData = function(countryISO3){
  d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + countryISO3).then(function(data) {
    try {
      data = cleanData(data[0].timeseries);
    } catch (e) {
      alert("No data available for iso3 code " + countryISO3);
    }

    v = d3.select('#dailyDropdown').node().value;

    populateLineChart(data, svgLineChart);
    populateBarGraph(data, svgBarGraph, v);

    d3.select('.legend-group').remove();
    let group = d3.select("svg").append("g").attr("class","legend-group");

    let legend = group.selectAll(".legend")
      .data(legendScale.domain().slice())
      .enter().append("g")
      .attr("class","legend")
      .attr("transform",function(d,i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append("rect")
      .attr("x",475)
      .attr("y",65)
      .attr("width",18)
      .attr("height",18)
      .style("fill", legendScale);

    legend.append("text")
      .attr("x",465)
      .attr("y",73)
      .attr("dy",".35em")
      .style("text-anchor","end")
      .text(function(d) { return d; });
  })
  .catch(function(error){
    console.log(error);})

  d3.json(apiRoot + "/latest?onlyCountries=true&iso3=" + countryISO3).then(function(data){
    populatePieChart(data[0], svgPieChartDiv);
  }).catch(function(error){
    console.log(error);
  })
};

var populateLineChart = function(data, svg){
  svg.selectAll("*").remove();

  let x = d3.scaleTime().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);

  let valueline_confirmed = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.confirmed); });

  let valueline_deaths = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.deaths); });

  let valueline_recovered = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.recovered); });

  // Define the div for the tooltip
  let div = d3.select("body").append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { 
    return Math.max(d.confirmed, d.recovered, d.deaths)})]);

  // Add the valueline path.
  path_c = svg.append("path")
    .data([data])
    .attr("class", "line line_c")
    .attr("d", valueline_confirmed)

  path_d = svg.append("path")
    .data([data])
    .attr("class", "line line_d")
    .attr("d", valueline_deaths);

  path_r = svg.append("path")
    .data([data])
    .attr("class", "line line_r")
    .attr("d", valueline_recovered);

  // Add the x Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(6));

  // Add the y Axis
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append('text')                                     
    .attr('x', 10)              
    .attr('y', -5)             
    .text('Data taken from Johns Hopkins CSSE'); 

  d3.select(".line_c")
        .attr("stroke-dasharray", path_c.node().getTotalLength() + " " + path_c.node().getTotalLength() ) 
        .attr("stroke-dashoffset", path_c.node().getTotalLength())
        .transition(t)
        .attr("stroke-dashoffset", 0)
        .style("stroke", colors["Confirmed"]);

  d3.select(".line_d")
        .attr("stroke-dasharray", path_d.node().getTotalLength() + " " + path_d.node().getTotalLength() ) 
        .attr("stroke-dashoffset", path_d.node().getTotalLength())
        .transition(t)
        .attr("stroke-dashoffset", 0)
        .style("stroke", colors["Deaths"]);

  d3.select(".line_r")
        .attr("stroke-dasharray", path_r.node().getTotalLength() + " " + path_r.node().getTotalLength() ) 
        .attr("stroke-dashoffset", path_r.node().getTotalLength())
        .transition(t)
        .attr("stroke-dashoffset", 0)
        .style("stroke", colors["Recovered"]);

  svg.selectAll("dot")	
    .data(data)			
    .enter().append("circle")								
    .attr("r", 7)		
    .attr("cx", function(d) { return x(d.date); })		 
    .attr("cy", function(d) { return y(d.confirmed); })		
    .style("fill", colors["Confirmed"])
    .style("opacity", 0)
    .on("mouseover", function(d) {		
      d3.select(this)
        .transition()		
        .duration(200)
        .style("opacity", .9);		
      div.transition()		
        .duration(200)		
        .style("opacity", .9);		
      div	.html(formatDateToString (d.date) + "<br/>"  + d.confirmed + " Confirmed")	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })					
    .on("mouseout", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("opacity", 0);		
      div.transition()		
        .duration(500)		
        .style("opacity", 0);	
    });

  svg.selectAll("dot")	
    .data(data)			
    .enter().append("circle")								
    .attr("r", 5)		
    .attr("cx", function(d) { return x(d.date); })		 
    .attr("cy", function(d) { return y(d.deaths); })		
    .style("fill", colors["Deaths"])
    .style("opacity", 0)
    .on("mouseover", function(d) {		
      d3.select(this)
        .transition()		
        .duration(200)
        .style("opacity", .9);		
      div.transition()		
        .duration(200)		
        .style("opacity", .9);		
      div	.html(formatDateToString (d.date) + "<br/>"  + d.deaths + " Deaths")	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })					
    .on("mouseout", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("opacity", 0);		
      div.transition()		
        .duration(500)		
        .style("opacity", 0);	
    });


  svg.selectAll("dot")	
    .data(data)			
    .enter().append("circle")								
    .attr("r", 5)		
    .attr("cx", function(d) { return x(d.date); })		 
    .attr("cy", function(d) { return y(d.recovered); })		
    .style("fill", colors["Recovered"])
    .style("opacity", 0)
    .on("mouseover", function(d) {		
      d3.select(this)
        .transition()		
        .duration(200)
        .style("opacity", .9);		
      div.transition()		
        .duration(200)		
        .style("opacity", .9);		
      div	.html(formatDateToString (d.date) + "<br/>"  + d.recovered + " Recovered")	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })					
    .on("mouseout", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("opacity", 0);		
      div.transition()		
        .duration(500)		
        .style("opacity", 0);	
    });

}

d3.select('#dailyDropdown').on("change", function () {
      countryISO3 = d3.select('#country').node().value;
      d3.json("https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries?onlyCountries=true&iso3=" + countryISO3).then(function(data) {
      data = cleanData(data[0].timeseries);
        v = d3.select('#dailyDropdown').node().value;
        populateBarGraph(data, svgBarGraph, v);
      })
      .catch(function(error){
        console.log(error);
      })
});

var populateBarGraph = function(data, svg, dailyValue="NewConfirmed"){
  svg.selectAll("*").remove();

  let x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
  let y = d3.scaleLinear()
    .range([height, 0]);

  let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {  return d[dailyValue]; })]);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.date); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d[dailyValue]); })
    .attr("height", 0)
    .on("mouseover", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("fill", "blue");		
      div.transition()		
        .duration(200)		
        .style("opacity", .9);		
      div.html(formatDateToString (d.date) +
        "<br/>"  +
        d[dailyValue] +
        " new " +
        dailyValue.slice(3).toLowerCase())
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");	
    })					
    .on("mouseout", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("fill", colors[dailyValue.slice(3)]);		
      div.transition()		
        .duration(500)		
        .style("opacity", 0);	
    })
    .transition()
    .duration(250)
    .delay(function (d, i) {
      return i * 25;
    })
    .attr("height", function(d) { 
      return height - y(d[dailyValue]); })
    .attr("fill", colors[dailyValue.slice(3)]);

  let barX = d3.scaleTime().range([0, width]);
  barX .domain(d3.extent(data, function(d) { return d.date; }));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(barX)
                          .ticks(5)
                          .tickFormat(formatDateToString));

  svg.append("g")
    .call(d3.axisLeft(y));
}


var populatePieChart = function(data, svgDiv){
  svgDiv.selectAll("*").remove();
  let width = 350;
  let height = 350;
  let radius = Math.min(width, height) / 2;
  let donutWidth = 75;
  let legendRectSize = 18;                                  // NEW
  let legendSpacing = 4;                                    // NEW

  let color = d3.scaleOrdinal()
    .domain(Object.keys(colors))
    .range(Object.values(colors));

  let newData = []
  newData.push({label: 'Confirmed', value: data.confirmed});
  newData.push({label: 'Deaths', value: data.deaths});
  newData.push({label: 'Recovered', value: data.recovered});

  data = newData

  let svg = svgDiv.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + 
      ',' + (height / 2) + ')');

  let arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  let pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);

  let path = svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) { 
      return color(d.data.label);
    });

  let legend = svg.selectAll('.legend')                     // NEW
    .data(color.domain())                                   // NEW
    .enter()                                                // NEW
    .append('g')                                            // NEW
    .attr('class', 'legend')                                // NEW
    .attr('transform', function(d, i) {                     // NEW
      let height = legendRectSize + legendSpacing;          // NEW
      let offset =  height * color.domain().length / 2;     // NEW
      let horz = -2 * legendRectSize;                       // NEW
      let vert = i * height - offset;                       // NEW
      return 'translate(' + horz + ',' + vert + ')';        // NEW
    });                                                     // NEW

  legend.append('rect')                                     // NEW
    .attr('width', legendRectSize)                          // NEW
    .attr('height', legendRectSize)                         // NEW
    .style('fill', color)                                   // NEW
    .style('stroke', color);                                // NEW

  legend.append('text')                                     // NEW
    .attr('x', legendRectSize + legendSpacing)              // NEW
    .attr('y', legendRectSize - legendSpacing)              // NEW
    .text(function(d) { return d; });                     

}


