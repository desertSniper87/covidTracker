const apiRoot = "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu";
const margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 70
  },
  width = 800 - margin.left - margin.right,
  height = 480 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%m/%d/%y");
const formatDateToString = d3.timeFormat("%b %d");
var countriesToBeCompared = 1;

const en2bnDict = {
  "confirmed": "আক্রান্ত",
  "deaths": "মৃত",
  "recovered": "সুস্থ",
  "NewConfirmed": "দৈনিক নতুন আক্রান্ত",
  "NewDeaths": "দৈনিক নতুন মৃত",
  "NewRecovered": "দৈনিক নতুন সুস্থ",
}

var lineChartMaxAttr = d3.local();

var en2bn = (d) => {
  if (!(d in en2bnDict)) {
    return iso3tobn[d];
  } else {
    return en2bnDict[d];
  }
}

const colors = {
  "confirmed": "#FF0000",
  "deaths": "#000000",
  "recovered": "#00FF00",
}

let pieColors = ({
  "সর্বমোট চিকিৎসাধীন": "#F38A32",
  "সর্বমোট মৃত": "#909090",
  "সর্বমোট সুস্থ": "#59B215",
})

let pieHoverColors = ({
  "সর্বমোট চিকিৎসাধীন": "#DC6705",
  "সর্বমোট মৃত": "#4F4F4F",
  "সর্বমোট সুস্থ": "#418210",
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
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.left + margin.right}`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var svgBarGraph = d3.select("#svgBarGraph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.left + margin.right}`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var svgPieChartDiv = d3.select('#svgPieChartDiv');
var svgComparePieChart1 = d3.select('#svgComparePieChartDiv1');
var svgComparePieChart2 = d3.select('#svgComparePieChartDiv2');

var svgCompareGraph = d3.select('#svgCompareGraph')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.left + margin.right}`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var svgMultiCountryCompare = d3.select('#svgMultiCompareGraph')
  .attr("width", width + margin.left + margin.right + 100)
  .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.left + margin.right}`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var svgMultiCountryGroup = d3.select('#svgMultiCountryGroupGraph')
  .attr("width", width + margin.left + margin.right + 100)
  .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.left + margin.right}`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



var filterDataByCountry = function (data, country) {
  data = data.filter(function (d) {
    return d["Country"] === country;
  })

  return data;
}



var cleanData = function (data) {
  let prevConfirmed, prevDeaths, prevRecovered = 0;

  let newData = []
  Object.keys(data).forEach(function (k) {
    let d = {}

    d.date = parseTime(k);
    d.confirmed = +data[k].confirmed;
    d.deaths = +data[k].deaths;
    d.recovered = +data[k].recovered;

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

  data.splice(0, daysWithoutIncident.length - 1);
  return data;
}

var cleanDataForComparison = function (data) {
  let newData = []
  Object.keys(data).forEach(function (k) {
    let d = {}

    d.date = parseTime(k);
    d.confirmed = +data[k].confirmed;
    d.deaths = +data[k].deaths;
    d.recovered = +data[k].recovered;

    newData.push(d);
  });

  data = newData
  var daysWithoutIncident = data.filter(function (el) {
    return el.confirmed == 0;
  });

  data.splice(0, daysWithoutIncident.length - 1);
  data.forEach(function (d, i) {
    d.daysPassed = i;
  })
  return data;
}

var populateDropdown = function (dropDown) {
  if (dropDown === undefined) {
    dropDown = d3.selectAll(".countryDropdown");
  }
  let options = dropDown.selectAll("option")
    .data(countriesData)
    .enter()
    .append("option");

  options.text(function (d) {
      return d.name;
    })
    .attr("value", function (d) {
      return d.iso3;
    });
}

populateDropdown();

var populateData = function (countryISO3) {
  d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + countryISO3).then(function (data) {
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
    .catch(function (error) {
      console.log(error);
    })

  d3.json(apiRoot + "/latest?onlyCountries=true&iso3=" + countryISO3).then(function (data) {
    populatePieChart(data[0], svgPieChartDiv);
  }).catch(function (error) {
    console.log(error);
  })
};

var appendLegend = function (svgID, legendScale, position='bottom') {
  svg = d3.select(svgID);
  svg.select('.legend-group').remove();
  let group = svg.append("g").attr("class", "legend-group");

  let legend = group.selectAll(".legend")
    .data(legendScale.domain().slice())
    .enter().append("g")
    .attr("class","legend")
    .attr("data-point-type", (d)  => d)
    .attr("transform",function(d,i) {
      console.log(d);
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - margin.right)
    .attr("y",65)
    .attr("width",18)
    .attr("height",18)
    .style("fill", legendScale);

  legend.append("text")
    .attr("x",width - margin.right -10)
    .attr("y",73)
    .attr("dy",".35em")
    .style("text-anchor","end")
    .text(function(d) { return en2bn(d); });

  legend.on("click", (d) => {
    let clickedLegend = svg.select('.legend[data-point-type=' + d + ']');
    clickedLegend.classed('legend-hidden', !clickedLegend.classed('legend-hidden'));
    svg.selectAll('.' + d)
      .transition().duration(900)
      .style("visibility", () => { 
        return clickedLegend.classed("legend-hidden") ? "hidden" : "visible";
      })
    // updateAxis(svg);
  })

  let updateAxis = (svg) => {
    let legendHidden = {};
    let legends = svg.selectAll('.legend');
    legends.nodes().forEach((l) => {
      legendHidden[l.getAttribute('data-point-type')] = l.classList.contains('legend-hidden');
    })

    let maxAttr = JSON.parse(JSON.stringify(lineChartMaxAttr.get(this)));
    Object.keys(legendHidden).forEach((k) => {
      if (legendHidden[k] === true) 
        delete maxAttr[k];
    });

    let yAxis = svg.selectAll('.y\\.axis');
    let yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, Math.max(Object.values(maxAttr))]);

    yAxis.transition()
      .duration(1000)
      .call(d3.axisLeft(yScale));

  }
}

var populateLineChart = function (data, svg) {
  svg.selectAll("*").remove();

  lineChartMaxAttr.set(
    this, {
    confirmed: d3.max(data, d => Math.max(d.confirmed)),
    deaths: d3.max(data, d => Math.max(d.deaths)),
    recovered: d3.max(data, d => Math.max(d.recovered))
  })

  let xScale = d3.scaleTime().range([0, width]);
  let yScale = d3.scaleLinear().range([height, 0]);

  xScale.domain(d3.extent(data, function (d) { return d.date; }));
  yScale.domain([0, d3.max(data, function (d) { return Math.max(d.confirmed, d.recovered, d.deaths); })]);


  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x.axis")
    .transition().duration(500)
    .call(d3.axisBottom(xScale).ticks(6));

  // Add the y Axis
  svg.append("g")
    .attr("class", "y.axis")
    .transition().duration(500)
    .call(d3.axisLeft(yScale));
  //svg.append('text')                                     
  //.attr('x', 10)              
  //.attr('y', -5)             
  //.text('Data taken from Johns Hopkins CSSE'); 

  [
    { lineClass: 'line_c', attrName: 'confirmed' },
    { lineClass: 'line_d', attrName: 'recovered' },
    { lineClass: 'line_r', attrName: 'deaths' }
  ].forEach((dataPointGroup) => {
    let valueline = d3.line()
      .x(function (d) { return xScale(d.date); })
      .y(function (d) { return yScale(d[dataPointGroup.attrName]); })
      .curve(d3.curveMonotoneX);

    // Add the valueline path.
    let path = svg.append("path")
      .data([data])
      .attr("class", "line " + dataPointGroup.attrName)
      .attr("d", valueline)

    svg.select(".line." + dataPointGroup.attrName)
      .attr("stroke-dasharray", path.node().getTotalLength() + " " + path.node().getTotalLength())
      .attr("stroke-dashoffset", path.node().getTotalLength())
      .transition(t)
      .attr("stroke-dashoffset", 0)
      .style("stroke", colors[dataPointGroup.attrName]);

    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function (d) {
        return xScale(d.date);
      })
      .attr("cy", function (d) {
        return yScale(d[dataPointGroup.attrName]);
      })
      .style("fill", colors[dataPointGroup.attrName])
      .attr("class", dataPointGroup.attrName);
  });


  let circleC = svg.append("circle").attr("cx", -10).attr("cy", -10).attr("r", 5).attr("class", "cPL"),
    circleR = svg.append("circle").attr("cx", -10).attr("cy", -10).attr("r", 5).attr("class", "cPL"),
    circleD = svg.append("circle").attr("cx", -10).attr("cy", -10).attr("r", 5).attr("class", "cPL");

  let getPointAtXaxis = function (xScale, yScale, d, line_type) {
    return [xScale(d.date), yScale(d[line_type])];
  }

  let mousemoved = function (data) {
    let m = d3.mouse(this),
      xDate = xScale.invert(m[0]),
      bisect = d3.bisector(function (d) { return d.date; }).right,
      idx = bisect(data, xDate);
    let d = data[idx];
    tooltipDiv.transition()
      .duration(200)
      .style("opacity", 1);
    tooltipDiv.html(`${formatDateToString(d.date)} <br/>
      <font color="${d3.rgb(colors.confirmed).darker(2).formatHex()}">${d.confirmed} জন আক্রান্ত</font><br/>
      <font color="${d3.rgb(colors.deaths).darker(2).formatHex()}">${d.deaths} জন মৃত</font><br/>
      <font color="${d3.rgb(colors.recovered).darker(2).formatHex()}">${d.recovered} জন সুস্থ</font><br/>`)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");


    d3.selectAll('.cPL').style("opacity", .8);


    let p = {};
    [
      ['.line_c', 'confirmed'],
      ['.line_d', 'recovered'],
      ['.line_r', 'deaths']
    ].forEach((l) => {
      p[l[1]] = getPointAtXaxis(xScale, yScale, d, l[1]);
    });

    d3.select(".mouse-line")
      .attr("d", function () {
        let vLineData = "M" + xScale(d.date) + "," + Math.min.apply(null, Object.values(p).map(a => a[1]));
        vLineData += " " + xScale(d.date) + "," + height;
        return vLineData;
      });

    Object.keys(p).forEach((k) => {
      if (k === 'confirmed') {
        circleC.attr("cx", p[k][0]).attr("cy", p[k][1])
          .style("fill", colors[k]);
      } else if (k === 'deaths') {
        circleD.attr("cx", p[k][0]).attr("cy", p[k][1])
          .style("fill", colors[k]);
      } else if (k === 'recovered') {
        circleR.attr("cx", p[k][0]).attr("cy", p[k][1])
          .style("fill", colors[k]);
      }
    });
  }


  let mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path")
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");


  mouseG.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .data([data])
    .on("mousemove", mousemoved)
    .on("mouseout", () => {
      tooltipDiv.transition()
        .duration(500)
        .style("opacity", 0);

      d3.selectAll('.cPL').transition()
        .duration(500).style("opacity", 0);
    })
    .on("mouseover", () => {
      d3.select('.mouse-line').style("opacity", "1");

    });

}

d3.select('#dailyDropdown').on("change", function () {
  countryISO3 = d3.select('#country').node().value;
  d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + countryISO3).then(function (data) {
    data = cleanData(data[0].timeseries);
    v = d3.select('#dailyDropdown').node().value;
    populateBarGraph(data, svgBarGraph, v);
  })
    .catch(function (error) {
      console.log(error);
    })
});

var populateBarGraph = function (data, svg, dailyValue = "NewConfirmed") {
  svg.selectAll("*").remove();

  let x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
  let y = d3.scaleLinear()
    .range([height, 0]);

  x.domain(data.map(function (d) {
    return d.date;
  }));
  y.domain([0, d3.max(data, function (d) {
    return d[dailyValue];
  })]);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.date);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d[dailyValue]);
    })
    .attr("height", 0)
    .on("mousemove", function (d) {
      d3.select(this)
        .transition()
        .duration(500)
        .style("fill", "blue");
      tooltipDiv.transition()
        .duration(200)
        .style("opacity", .9);
      tooltipDiv.html(formatDateToString(d.date) +
        "<br/>" +
        d[dailyValue] + "<br/>" +
        en2bn(dailyValue))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(500)
        .style("fill", colors[dailyValue.slice(3).toLowerCase()]);
      tooltipDiv.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .transition()
    .duration(250)
    .delay(function (d, i) {
      return i * 25;
    })
    .attr("height", function (d) {
      return height - y(d[dailyValue]);
    })
    .attr("fill", colors[dailyValue.slice(3).toLowerCase()]);

  let barX = d3.scaleTime().range([0, width]);
  barX.domain(d3.extent(data, function (d) {
    return d.date;
  }));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(barX)
      .ticks(5)
      .tickFormat(formatDateToString));

  svg.append("g")
    .call(d3.axisLeft(y));
}


var populatePieChart = function (data, svgDiv) {
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
  newData.push({
    label: 'সর্বমোট চিকিৎসাধীন',
    value: data.confirmed - data.deaths - data.recovered
  });
  newData.push({
    label: 'সর্বমোট মৃত',
    value: data.deaths
  });
  newData.push({
    label: 'সর্বমোট সুস্থ',
    value: data.recovered
  });

  let confirmed = data.confirmed;

  data = newData

  let svg = svgDiv.append('svg')
    .attr('width', width + hoverExtraRadius * 2)
    .attr('height', height + 100 + hoverExtraRadius * 2)
    .attr("viewBox", `0 0 ${width + hoverExtraRadius * 2} ${height + hoverExtraRadius * 2}`)
    .append('g')
    .attr('transform', 'translate(' + (width / 2 + hoverExtraRadius) +
      ',' + (height / 2 + hoverExtraRadius) + ')');

  let pie = d3.pie()
    .sort(null)
    .padAngle(.02)
    .startAngle(1.1 * Math.PI)
    .endAngle(3.1 * Math.PI)
    .value(function (d) {
      return d.value;
    });

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
      "translate(" + (width / 2 - 170) + " ," +
      (height + margin.top - 150) + ")")
    .style("text-anchor", "middle")
    .text("সর্বমোট আক্রান্তের সংখ্যা: " + confirmed);

  let transitioning = true;
  let delay = 500;

  g.append("path")
    .style("fill", function (d) {
      return color(d.data.label);
    })
    .transition("piePopulate").delay(function (d, i) {
      return i * delay;
    }).duration(delay)
    .attrTween('d', function (d) {
      var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arc(d)
      }
    });

  timerid = setTimeout(() => {
    transitioning = false;
  }, data.length * delay);


  let path = svg.selectAll('path');

  path
    .on('mouseover', function (d) {
      if (!transitioning) {
        d3.select(this).style("fill", function (d) {
          return pieHoverColors[d.data.label];
        })
          .attr("stroke", "white")
          .transition("pieHoverOver")
          .duration(250)
          .attr("d", arcHover)
          .attr("stroke-width", 6);
      }
    })
    .on("mouseleave", function (d) {
      d3.select(this)
        .transition("pieHoverLeave")
        .duration(250)
        .attr("d", arc)
        .attr("stroke", "none");
    })
    .on('mousemove', function (d) {
      let percent = Math.round(1000 * d.data.value / confirmed) / 10;

      tooltipDiv.transition()
        .duration(200)
        .style("opacity", .9);
      tooltipDiv.html(d.data.value + " " + d.data.label + "<br/>" + percent + '%')
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("fill", function (d) {
        return color(d.data.label);
      })
      tooltipDiv.transition()
        .duration(500)
        .style("opacity", 0);
    });


  let legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      let height = legendRectSize + legendSpacing;
      let offset = height * color.domain().length / 2;
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
    .text(function (d) {
      return d;
    });
}

//var populateComparisonChart = function() {
//compareCountries 
//} 
var populatePage3CompareData = function () {
  let countryTimeseriesUrlArray = [];
  let countryLatestUrlArray = [];
  let countryCodeArray = [];
  let measure = d3.select('#compareMultiDropdown').node().value;
  let c = document.getElementsByClassName('compareCountryDropdown');

  for (i = 0; i < c.length; i++) {
    countryTimeseriesUrlArray.push(d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + c[i].value));
    countryLatestUrlArray.push(d3.json(apiRoot + "/latest?onlyCountries=true&iso3=" + c[i].value));
    countryCodeArray.push(c[i].value);
  };

  compareMultiCountries(svgMultiCountryCompare, countryTimeseriesUrlArray, countryCodeArray, measure)
  compareMultiCountriesLatest(svgMultiCountryGroup, countryLatestUrlArray, countryCodeArray)
}

var compareMultiCountriesLatest = function (svg, countryURLarray, countryCodeArray) {
  svg.selectAll("*").remove();

  let domainNames = ['confirmed', 'deaths', 'recovered'];

  var getHighestY = (d) => {
    x0domainNames.map((i) => d.i)
  }

  var getMaxYValue = (data) => {
    d3.max(data.forEach(function (d) {
      getHighestY(d);
    }))
  }

  Promise.all(countryURLarray).then(function (data) {
    //console.log(data);

    //newData.push({label: 'Confirmed', value: data.confirmed});
    let newData = []
    for (var i = 0, len = data.length; i < len; i++) {
      let d = {};

      d.country = data[i][0].countryregion;
      d.nameBN = en2bn(data[i][0].countrycode.iso3);
      d.values = new Array();
      d.values.push({
        type: "confirmed",
        value: +data[i][0].confirmed
      });
      d.values.push({
        type: "deaths",
        value: +data[i][0].deaths
      });
      d.values.push({
        type: "recovered",
        value: +data[i][0].recovered
      });
      //d.cISO3 = data[i][0].countrycode.iso3;

      newData.push(d);
    }

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    data = newData

    let x0 = d3.scaleBand()
      .domain(data.map(function (d) {
        return d.nameBN;
      }))
      .range([0, width], .1);
    let x1 = d3.scaleBand()
      .domain(domainNames)
      .range([0, x0.bandwidth() - 10]);;
    let y = d3.scaleLinear().range([height, 0])
      .domain([0, d3.max(data, function (country) {
        return d3.max(country.values, function (d) {
          return d.value;
        });
      })]);

    let xAxis = d3.axisBottom()
      .scale(x0)
      .tickSize(0);

    var yAxis = d3.axisLeft().scale(y);

    svg.append("g")
      .attr("class", "x axis cnameaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .style('opacity', '0')
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight', 'bold')
      .text("Casualities");

    svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    let slice = svg.selectAll(".slice")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function (d) {
        return "translate(" + x0(d.nameBN) + ",0)";
      });

    slice.selectAll("rect")
      .data(function (d) {
        return d.values;
      })
      .enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function (v) {
        return x1(v.type);
      })
      .style("fill", function (v) {
        return color(v.type)
      })
      .attr("y", function (v) {
        return y(0);
      })
      .attr("height", function (v) {
        return height - y(0);
      })
      .on("mouseover", function (v) {
        d3.select(this).style("fill", d3.rgb(color(v.type)).darker(2));
        tooltipDiv.transition()
          .duration(200)
          .style("opacity", .9);
        tooltipDiv.html(v.value + ' ' + en2bn(v.type))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        d3.select(this).style("fill", color(d.type));
        tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
      });

    slice.selectAll("rect")
      .transition()
      .delay(function (d) {
        return Math.random() * 1000;
      })
      .duration(1000)
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("height", function (d) {
        return height - y(d.value);
      });

    let legend = svg.selectAll(".legend")
      .data(data[0].values.map(function (d) {
        return d.type;
      }).reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      })
      .style("opacity", "0");

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d) {
        return color(d);
      });

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        ;
        return en2bn(d);
      });

    legend.transition().duration(500).delay(function (d, i) {
      return 1300 + 100 * i;
    }).style("opacity", "1");

  }).catch(function (error) {
    console.log(error);
    alert("API error");
  });
}

var compareMultiCountries = function (svg, countryURLarray, countryCodeArray, measure) {
  svg.selectAll("*").remove();

  const colorScheme = d3.scaleOrdinal(d3.schemeSet1)
    .domain(countryCodeArray);

  Promise.all(countryURLarray).then(function (data) {
    data = data.map(x => cleanDataForComparison(x[0].timeseries))

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let valueline = d3.line()
      .x(function (d) { return x(d.daysPassed); })
      .y(function (d) { return y(d[measure]); })
      .curve(d3.curveMonotoneX);


    let getMaxDaysPassed = (data) => {
      return d3.max(data, (d) => d.daysPassed)
    }


    let getMaxYValue = (data) => {
      return d3.max(data, (d) => d[measure])
    }

    //let maxDaysPassed = 
    //Math.max(d3.max.apply()

    x.domain([0, Math.max(...data.map(getMaxDaysPassed))]);
    y.domain([0, Math.max(...data.map(getMaxYValue))]);

    // Add the valueline path.

    let path = []
    for (var i = 0, len = countryCodeArray.length; i < len; i++) {
      pathC = svg.append("path")
        .data([data[i]])
        .attr("class", "line lineMC" + i)
        .attr("d", valueline)

      path.push(pathC)
    }


    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6));

    svg.append("g")
      .call(d3.axisLeft(y));
    //svg.append('text')                                     
    //.attr('x', 10)              
    //.attr('y', -5)             
    //.text('Data taken from Johns Hopkins CSSE'); 

    for (var i = 0, len = countryCodeArray.length; i < len; i++) {
      d3.select(".lineMC" + i)
        .attr("stroke-dasharray", path[i].node().getTotalLength() + " " + path[i].node().getTotalLength())
        .attr("stroke-dashoffset", path[i].node().getTotalLength())
        .transition(t)
        .attr("stroke-dashoffset", 0)
        .style("stroke", colorScheme(countryCodeArray[i]));
    }


    xAxistext = svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("প্রথম নিশ্চিতির পর অতিবাহিত দিন")

    for (var i = 0, len = countryCodeArray.length; i < len; i++) {
      svg.selectAll("dot")
        .data(data[i])
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d) {
          return x(d.daysPassed);
        })
        .attr("cy", function (d) {
          return y(d[measure]);
        })
        .style("fill", colorScheme(countryCodeArray[i]))
        .on("mousemove", function (d) {
          tooltipDiv.transition()
            .duration(200)
            .style("opacity", .9);
          tooltipDiv.html(
            //countryCodeArray[i] + " " +
            formatDateToString(d.date) + "<br/>" + d[measure] + " " + en2bn(measure))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);
        });
    };

    let legend = svg.selectAll('.legend')
      .data(colorScheme.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append('rect')
      .attr("x", 475)
      .attr("y", 65)
      .attr("width", 18)
      .attr("height", 18)
      .style('fill', colorScheme)
      .style('stroke', colorScheme);

    legend.append('text')
      .attr("x", 465)
      .attr("y", 73)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        return en2bn(d);
      });

  }).catch(function (error) {
    console.log(error);
    alert("API error");
  });
}

var populatePage2CompareData = function () {
  c1iso = d3.select('#country1').node().value;
  c2iso = d3.select('#country2').node().value; //TODO: If these two are the same

  if (c1iso === c2iso) {
    alert('Please select two different countries');
    return;
  }

  let xAxisUnit = document.querySelector('input.xAxisInput:checked').value;

  Promise.all([
    d3.json(apiRoot + "/latest?onlyCountries=true&iso3=" + c1iso),
    d3.json(apiRoot + "/latest?onlyCountries=true&iso3=" + c2iso)
  ]).then(function (data) {
    populatePieChart(data[0][0], svgComparePieChart1);
    populatePieChart(data[1][0], svgComparePieChart2);
  })
    .catch(function (error) {
      console.log(error);
    })
  compareCountries(svgCompareGraph, c1iso, c2iso, xAxisUnit);

};

var compareCountries = function (svg, country1iso3, country2iso3, xAxisUnit) {
  measure = d3.select('#compareDropdown').node().value;

  svg.selectAll("*").remove();

  Promise.all([
    d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + country1iso3),
    d3.json(apiRoot + "/timeseries?onlyCountries=true&iso3=" + country2iso3)
  ]).then(function (data) {

    dataCountry1 = cleanDataForComparison(data[0][0].timeseries)
    dataCountry2 = cleanDataForComparison(data[1][0].timeseries)

    let x, xAxisUnitText;

    if (xAxisUnit === "date") {
      x = d3.scaleTime().range([0, width]);
      x.domain(d3.extent(dataCountry1.concat(dataCountry2), function (d) {
        return d.date;
      }));
      xAxisUnitText = "তারিখ";
    } else {
      x = d3.scaleLinear().range([0, width]);
      x.domain([0, Math.max(d3.max(dataCountry1, function (d) {
        return d[xAxisUnit];
      }), d3.max(dataCountry2, function (d) {
        return d[xAxisUnit];
      }))]);
      xAxisUnitText = "প্রথম নিশ্চিতির পর অতিবাহিত দিন";
    }

    let y = d3.scaleLinear().range([height, 0]);

    let valueline = d3.line()
      .x(function (d) {
        return x(d[xAxisUnit]);
      })
      .y(function (d) {
        return y(d[measure]);
      })
      .curve(d3.curveMonotoneX);


    const color10C = d3.scaleOrdinal(d3.schemeCategory10)


    y.domain([0, Math.max(d3.max(dataCountry1, function (d) {
      return Math.max(d[measure]);
    }),
      d3.max(dataCountry2, function (d) {
        return Math.max(d[measure]);
      }))]);


    // Add the valueline path.
    pathC1 = svg.append("path")
      .data([dataCountry1])
      .attr("class", "line lineC1")
      .attr("d", valueline)

    pathC2 = svg.append("path")
      .data([dataCountry2])
      .attr("class", "line lineC2")
      .attr("d", valueline)


    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6));

    svg.append("g")
      .call(d3.axisLeft(y));
    //svg.append('text')                                     
    //.attr('x', 10)              
    //.attr('y', -5)             
    //.text('Data taken from Johns Hopkins CSSE'); 

    d3.select(".lineC1")
      .attr("stroke-dasharray", pathC1.node().getTotalLength() + " " + pathC1.node().getTotalLength())
      .attr("stroke-dashoffset", pathC1.node().getTotalLength())
      .transition(t)
      .attr("stroke-dashoffset", 0)
      .style("stroke", color10C(country1iso3));

    d3.select(".lineC2")
      .attr("stroke-dasharray", pathC2.node().getTotalLength() + " " + pathC2.node().getTotalLength())
      .attr("stroke-dashoffset", pathC2.node().getTotalLength())
      .transition(t)
      .attr("stroke-dashoffset", 0)
      .style("stroke", color10C(country2iso3));

    xAxisText = svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text(xAxisUnitText);

    svg.selectAll("dot")
      .data(dataCountry1)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function (d) {
        return x(d[xAxisUnit]);
      })
      .attr("cy", function (d) {
        return y(d[measure]);
      })
      .style("fill", color10C(country1iso3))
      .on("mousemove", function (d) {
        tooltipDiv.transition()
          .duration(200)
          .style("opacity", .9);
        tooltipDiv.html(en2bn(country1iso3) + " " + formatDateToString(d.date) + "<br/>" + d[measure] + " " + en2bn(measure))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
      });

    svg.selectAll("dot")
      .data(dataCountry2)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function (d) {
        return x(d[xAxisUnit]);
      })
      .attr("cy", function (d) {
        return y(d[measure]);
      })
      .style("fill", color10C(country2iso3))
      .on("mousemove", function (d) {
        tooltipDiv.transition()
          .duration(200)
          .style("opacity", .9);
        tooltipDiv.html(en2bn(country2iso3) + " " + formatDateToString(d.date) + "<br/>" + d[measure] + " " + en2bn(measure))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
      });
    appendLegend('#svgCompareGraph', color10C)

  }).catch(function (error) {
    console.log(error);
    alert(error);
  });
}

var changeAxis = function () {
  console.log('Tesst');
}

var addNewCountryDropdown = function (el) {
  countriesToBeCompared++;

  d3.select(el.parentNode.parentNode).insert('div', '.btnDiv')
    .attr('class', 'col-md-4')
    .append('select')
    .attr('class', 'form-control compareCountryDropdown countryDropdown')
    .attr('id', 'addCountry' + countriesToBeCompared);
  populateDropdown(d3.select('#addCountry' + countriesToBeCompared));
}
