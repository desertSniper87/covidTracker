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

let pieColors = ({
  "Active Cases": "#F38A32",
  "Deaths": "#909090",
  "Recovered": "#59B215",
})

let pieHoverColors = ({
  "Active Cases": "#DC6705",
  "Deaths": "#4F4F4F",
  "Recovered": "#418210",
})
var tooltipDiv = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

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

var svgPieChartDiv= d3.select('#svgPieChartDiv');
var svgCompareGraph= d3.select('#svgCompareGraph')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


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

var cleanDataForComparison = function(data){
  let newData = []
  Object.keys(data).forEach(function(k) {
    let d = {}

    d.date = parseTime(k);
    d.confirmed = +data[k].confirmed;
    d.deaths= +data[k].deaths;
    d.recovered= +data[k].recovered;

    newData.push(d);
  });

  data = newData
  var daysWithoutIncident = data.filter(function (el) {
    return el.confirmed == 0;
  });

  data.splice(0, daysWithoutIncident.length-1);
  data.forEach(function(d, i){
    d.daysPassed = i;
  })
  return data;
}

var populateDropdown = function(data){
  let dropDown = d3.selectAll(".countryDropdown");
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

populateDropdown(countriesData);

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

    let legendScale = d3.scaleOrdinal()
      .domain(Object.keys(colors))
      .range(Object.values(colors));

    appendLegend('#svgLineChart', legendScale);
  })
    .catch(function(error){
      console.log(error);})

  d3.json(apiRoot + "/latest?onlyCountries=true&iso3=" + countryISO3).then(function(data){
    populatePieChart(data[0], svgPieChartDiv);
  }).catch(function(error){
    console.log(error);
  })
};

var appendLegend = function(svgID, legendScale){
  d3.select('.legend-group').remove();
  let group = d3.select(svgID).append("g").attr("class","legend-group");

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
}

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
  //svg.append('text')                                     
  //.attr('x', 10)              
  //.attr('y', -5)             
  //.text('Data taken from Johns Hopkins CSSE'); 

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
    .on("mousemove", function(d) {		
      d3.select(this)
        .transition()		
        .duration(200)
        .style("opacity", .9);		
      tooltipDiv.transition()		
        .duration(200)		
        .style("opacity", .9);		
      tooltipDiv	.html(formatDateToString (d.date) + "<br/>"  + d.confirmed + " Confirmed")	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })					
    .on("mouseout", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("opacity", 0);		
      tooltipDiv.transition()		
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
    .on("mousemove", function(d) {		
      d3.select(this)
        .transition()		
        .duration(200)
        .style("opacity", .9);		
      tooltipDiv.transition()		
        .duration(200)		
        .style("opacity", .9);		
      tooltipDiv	.html(formatDateToString (d.date) + "<br/>"  + d.deaths + " Deaths")	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })					
    .on("mouseout", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("opacity", 0);		
      tooltipDiv.transition()		
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
    .on("mousemove", function(d) {		
      d3.select(this)
        .transition()		
        .duration(200)
        .style("opacity", .9);		
      tooltipDiv.transition()		
        .duration(200)		
        .style("opacity", .9);		
      tooltipDiv	.html(formatDateToString (d.date) + "<br/>"  + d.recovered + " Recovered")	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })					
    .on("mouseout", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("opacity", 0);		
      tooltipDiv.transition()		
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
    .on("mousemove", function(d) {		
      d3.select(this)
        .transition()
        .duration(500)		
        .style("fill", "blue");		
      tooltipDiv.transition()		
        .duration(200)		
        .style("opacity", .9);		
      tooltipDiv.html(formatDateToString (d.date) +
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
      tooltipDiv.transition()		
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
  let legendRectSize = 18;                                  
  let legendSpacing = 4;  
  let hoverExtraRadius = 10;

  let color = d3.scaleOrdinal()
    .domain(Object.keys(pieColors))
    .range(Object.values(pieColors));

  let newData = []
  //newData.push({label: 'Confirmed', value: data.confirmed});
  newData.push({label: 'Active Cases', value: data.confirmed - data.deaths - data.recovered});
  newData.push({label: 'Deaths', value: data.deaths});
  newData.push({label: 'Recovered', value: data.recovered});

  let confirmed = data.confirmed;

  data = newData

  let svg = svgDiv.append('svg')
    .attr('width', width + hoverExtraRadius * 2)
    .attr('height', height + 100 + hoverExtraRadius * 2)
    .append('g')
    .attr('transform', 'translate(' + (width / 2 + hoverExtraRadius) + 
      ',' + (height / 2 + hoverExtraRadius) + ')');

  let pie = d3.pie()
    .sort(null)
    .padAngle(.02)
    .startAngle(1.1*Math.PI)
    .endAngle(3.1*Math.PI)
    .value(function(d) { return d.value; });

  let arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);
  let arcHover = d3.arc()
    .innerRadius(radius - donutWidth + hoverExtraRadius)
    .outerRadius(radius + hoverExtraRadius);

  let g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

  svg.append("text")             
    .attr("transform",
      "translate(" + (width/2 - 170) + " ," + 
      (height + margin.top - 150) + ")")
    .style("text-anchor", "middle")
    .text("Total Confirmed Cases: " + confirmed);

  let transitioning = true;
  let delay = 500;

  g.append("path")
    .style("fill", function(d) { return color(d.data.label); })
    .transition("piePopulate").delay(function(d,i) {
      return i * delay; }).duration(delay)
    .attrTween('d', function(d) {
      var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
      return function(t) {
        d.endAngle = i(t); 
        return arc(d)
      }
    }); 

    timerid = setTimeout(() => {
      transitioning = false;
    }, data.length * delay);


  let path = svg.selectAll('path');

  path
    .on('mouseover', function(d){
      if (!transitioning){
        d3.select(this).style("fill", function(d) { return pieHoverColors[d.data.label]; })
        .attr("stroke","white")
        .transition("pieHoverOver")
        .duration(250)
        .attr("d", arcHover)             
        .attr("stroke-width",6);
      }
    })
    .on("mouseleave", function(d) {
        d3.select(this)
           .transition("pieHoverLeave")            
           .duration(250)
           .attr("d", arc)
           .attr("stroke","none");
    })
    .on('mousemove', function(d) {
      let percent = Math.round(1000 * d.data.value / confirmed) / 10;

      tooltipDiv.transition()		
        .duration(200)		
        .style("opacity", .9);		
      tooltipDiv.html(d.data.value + " " + d.data.label + "<br/>" +  percent + '%')	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })
    .on("mouseout", function(d) {		
      d3.select(this).style("fill", function(d) { return color(d.data.label); })
      tooltipDiv.transition()		
        .duration(500)		
        .style("opacity", 0);	
    });


  let legend = svg.selectAll('.legend')                     
    .data(color.domain())                                   
    .enter()                                                
    .append('g')                                            
    .attr('class', 'legend')                                
    .attr('transform', function(d, i) {                     
      let height = legendRectSize + legendSpacing;          
      let offset =  height * color.domain().length / 2;     
      let horz = -2 * legendRectSize;                       
      let vert = i * height - offset;                       
      return 'translate(' + horz + ',' + vert + ')';        
    });                                                     

  legend.append('rect')                                     
    .attr('width', legendRectSize)                          
    .attr('height', legendRectSize)                         
    .style('fill', color)                                   
    .style('stroke', color);                                

  legend.append('text')                                     
    .attr('x', legendRectSize + legendSpacing)              
    .attr('y', legendRectSize - legendSpacing)              
    .text(function(d) { return d; });                     
}

var compareCountries = function(){
  country1iso3 = d3.select('#country1').node().value; 
  country2iso3 = d3.select('#country2').node().value; 
  measure = d3.select('#compareDropdown').node().value; 

  svgCompareGraph.selectAll("*").remove();

  Promise.all([
    d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + country1iso3),
    d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + country2iso3)
  ]).then(function(data) {

    dataCountry1 = cleanDataForComparison(data[0][0].timeseries)
    dataCountry2 = cleanDataForComparison(data[1][0].timeseries)

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let valueline = d3.line()
      .x(function(d) { return x(d.daysPassed); })
      .y(function(d) { return y(d[measure]); });


    const color10C = d3.scaleOrdinal(d3.schemeCategory10)

    x.domain([0, Math.max(d3.max(dataCountry1, function(d) { return d.daysPassed; }),
      d3.max(dataCountry2, function(d) { return d.daysPassed; }))]);

    y.domain([0, Math.max(d3.max(dataCountry1, function(d) { return Math.max(d[measure]); }),
      d3.max(dataCountry2, function(d) { return Math.max(d[measure]); }))]);


    // Add the valueline path.
    pathC1 = svgCompareGraph.append("path")
      .data([dataCountry1])
      .attr("class", "line lineC1")
      .attr("d", valueline)

    pathC2 = svgCompareGraph.append("path")
      .data([dataCountry2])
      .attr("class", "line lineC2")
      .attr("d", valueline)


    svgCompareGraph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6));

    svgCompareGraph.append("g")
      .call(d3.axisLeft(y));
    //svg.append('text')                                     
    //.attr('x', 10)              
    //.attr('y', -5)             
    //.text('Data taken from Johns Hopkins CSSE'); 

    d3.select(".lineC1")
      .attr("stroke-dasharray", pathC1.node().getTotalLength() + " " + pathC1.node().getTotalLength() ) 
      .attr("stroke-dashoffset", pathC1.node().getTotalLength())
      .transition(t)
      .attr("stroke-dashoffset", 0)
      .style("stroke", color10C(country1iso3));

    d3.select(".lineC2")
      .attr("stroke-dasharray", pathC2.node().getTotalLength() + " " + pathC2.node().getTotalLength() ) 
      .attr("stroke-dashoffset", pathC2.node().getTotalLength())
      .transition(t)
      .attr("stroke-dashoffset", 0)
      .style("stroke", color10C(country2iso3));

    svgCompareGraph.append("text")             
      .attr("transform",
        "translate(" + (width/2) + " ," + 
        (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Days since first case");

    svgCompareGraph.selectAll("dot")	
      .data(dataCountry1)			
      .enter().append("circle")								
      .attr("r", 7)		
      .attr("cx", function(d) { return x(d.daysPassed ); })		 
      .attr("cy", function(d) { return y(d[measure]); })		
      .style("fill", color10C(country1iso3))
      .style("opacity", 0)
      .on("mousemove", function(d) {		
        d3.select(this)
          .transition()		
          .duration(200)
          .style("opacity", .9);		
        tooltipDiv.transition()		
          .duration(200)		
          .style("opacity", .9);		
        tooltipDiv.html(country1iso3 + " " + formatDateToString (d.date) + "<br/>"  + d[measure] + " " + measure)	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
      .on("mouseout", function(d) {		
        d3.select(this)
          .transition()
          .duration(500)		
          .style("opacity", 0);		
        tooltipDiv.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });

    svgCompareGraph.selectAll("dot")	
      .data(dataCountry2)			
      .enter().append("circle")								
      .attr("r", 7)		
      .attr("cx", function(d) { return x(d.daysPassed ); })		 
      .attr("cy", function(d) { return y(d[measure]); })		
      .style("fill", color10C(country2iso3))
      .style("opacity", 0)
      .on("mousemove", function(d) {		
        d3.select(this)
          .transition()		
          .duration(200)
          .style("opacity", .9);		
        tooltipDiv.transition()		
          .duration(200)		
          .style("opacity", .9);		
        tooltipDiv.html(country2iso3 + " " + formatDateToString (d.date) + "<br/>"  + d[measure] + " " + measure)	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
      .on("mouseout", function(d) {		
        d3.select(this)
          .transition()
          .duration(500)		
          .style("opacity", 0);		
        tooltipDiv.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });
    appendLegend('#svgCompareGraph', color10C )

  }).catch(function(error){
    alert("No data available for Bahamas" );
  });
}

