var color = d3.scaleOrdinal(d3.schemeCategory20c);
var tooltip = d3.select("div.tooltip");

// load the data, find the svg container in the dom,
// and call createMap  initData()
initData();
function initData(){
  d3.json("100000_full.json", function(error, data) {
      if (error) throw error;
      var svg = d3.select('svg')
      createMap(svg, data);
  });
}

// put all logic in a nice reusable function
function createMap(svg, data) {
    // use viewBox attributes instead of width + height
    var params = svg.attr('viewBox').split(' ').map(function(n) {
        return parseInt(n, 10);
    })
    var width = params[2];
    var height = params[3];
    var mapContainer = svg.append('g')

    var projection = d3.geoMercator()
        // d3's 'fitSize' magically sizes and positions the map for you
        .fitSize([width, height], data);

    // this is the function that generates position data from the projection
    var path = d3.geoPath()
        .projection(projection);

    // append country outlines
    var countries = mapContainer.selectAll('.country')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)

countries.on("mousemove", function(d) {
    for ( var i = 0; i < provinceData.length; i++) {
      if (this.__data__.properties.brief == provinceData[i][0]) {
        if (provinceData[i][4].length != 0) {
          tooltip.style("display", "inline-block")
              .style("top", (d3.event.pageY) + "px")
              .style("left", (d3.event.pageX - 60) + "px")
              .html("<p class='province'>" + provinceData[i][0] + "</p> <p class='intro'>生育假 " + provinceData[i][1] + "天</p> <p class='intro'>陪产假 " + provinceData[i][2] + "天</p> <p class='intro'>育儿假 " + provinceData[i][3] + "</p> <p class='intro'>" + provinceData[i][4] + "</p>");
        } else {
          tooltip.style("display", "inline-block")
              .style("top", (d3.event.pageY) + "px")
              .style("left", (d3.event.pageX - 60) + "px")
              .html("<p class='province'>" + provinceData[i][0] + "</p> <p class='intro'>生育假 " + provinceData[i][1] + "天</p> <p class='intro'>陪产假 " + provinceData[i][2] + "天</p> <p class='intro'>育儿假 " + provinceData[i][3] + "</p>");
        }
      }
    }
  })
  .on("mouseout", function(d) {
      d3.select(this).attr("fill", "rgba(227,154,140,0.4)").attr("stroke-width", 2);
      tooltip.style("display", "none");
  });

function getProvinceCoors(name){
    for(var i=0; i<data.features.length; i++){
      if(data.features[i].properties.brief==name) return data.features[i].properties.centroid
    }
    return [0,0]
}
var totalMax = d3.max(provinceData, function(d){return d[1]});
var ratioR = d3.scaleLinear()
            .domain([0, totalMax])
            .range([0,1000]);

function getNumByName(name){
  for(var i=0; i<provinceData.length; i++){
    if(provinceData[i][0]==name) return provinceData[i][1]+provinceData[i][2]
  }
  return 0
}

//省级文字
svg.selectAll("text")
  .data(data.features)
  .enter()
  .append("text")
  .attr("fill",function(d){
    return "#333"
  })
  .text(function(d){
    if(d.properties.brief=="香港"||d.properties.brief=="澳门"||d.properties.brief=="台湾"||d.properties.brief==null) {
      return "";
    } else {
      return d.properties.brief;
    }})
  .attr("x",function(d){
    var coors = projection(d.properties.centroid)
    return coors[0];
  })
  .attr("y",function(d){
    var coors = projection(d.properties.centroid)
    return coors[1];
  })
  .attr("font-size",12)
  .attr("text-anchor",function(d){
    return "middle"
  })
  .attr("dy",5)
  .attr("dx",0)
  .attr("font-weight",900)

//省的确诊-圆圈
svg.selectAll("circle")
      .data(provinceData)
      .enter()
      .append("circle")
      .attr("stroke",function(d){
        return "#d4644e"
      })
      .attr("stroke-width",2)
      .attr("fill",function(d){
        return "rgba(227,154,140,0.4)"
      })
      .attr("r",function(d){
        return ratioR(Math.sqrt(d[1]/8))
      })
      .attr("cx",function(d){
        var coors = projection(getProvinceCoors(d[0]))
        return coors[0]
      })
      .attr("cy",function(d){
        var coors = projection(getProvinceCoors(d[0]))
        return coors[1]
      })
      .on("mousemove", function(d) {
        // console.log(d[4])
        if (d[4].length != 0) {
          tooltip.style("display", "inline-block")
              .style("top", (d3.event.pageY) + "px")
              .style("left", (d3.event.pageX - 60) + "px")
              .html("<p class='province'>" + d[0] + "</p> <p class='intro'>生育假 " + d[1] + "天</p> <p class='intro'>陪产假 " + d[2] + "天</p> <p class='intro'>育儿假 " + d[3] + "</p> <p class='intro'>" + d[4] + "</p>");
        } else {
          tooltip.style("display", "inline-block")
              .style("top", (d3.event.pageY) + "px")
              .style("left", (d3.event.pageX - 60) + "px")
              .html("<p class='province'>" + d[0] + "</p> <p class='intro'>生育假 " + d[1] + "天</p> <p class='intro'>陪产假 " + d[2] + "天</p> <p class='intro'>育儿假 " + d[3] + "</p>");
        }
      })
      .on("mouseout", function(d) {
          d3.select(this).attr("fill", "rgba(227,154,140,0.4)").attr("stroke-width", 2);
          tooltip.style("display", "none");
      });

// title
svg.append("text")
  .attr("fill", "#000")
  .text("中国最新生育政策一览")
  .attr("x",function(d){ return width/2 })
  .attr("y",function(d){ return 20 })
  .attr("font-size",28)
  .attr("dy",30)
  .attr("text-anchor","middle")
  .attr("font-weight",900)

//图例
var legend = svg.append("g")
    .attr("transform","translate("+(width-480)/2+","+(height-200)+")");

legend.append("text")
      .attr("fill", "#333")
      .text("女性生育假")
      .attr("x",110)
      .attr("y",90)
      .attr("font-size",12)
      .attr("dy",5)
      .attr("font-weight",900)

legend.append("circle")
      .attr("stroke", "#d4644e")
      .attr("stroke-width",2)
      .attr("fill", "rgba(227,154,140,0.4)")
      .attr("r", ratioR(Math.sqrt(300/8)))
      .attr("cx",200)
      .attr("cy",90)

legend.append("text")
      .attr("fill", "#333")
      .text("300天")
      .attr("x",200)
      .attr("y",90)
      .attr("font-size",12)
      .attr("dy",5)
      .attr("text-anchor", "middle")

svg.append("g").append("image")
    .attr("xlink:href", "hand.png")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", ((width>500?500:width)-180)/2)
    .attr("y",70);

svg.append("g").append("text")
    .text("点击地图了解具体政策")
    .attr("x",((width>500?500:width)-180)/2 + 25)
    .attr("y",75)
    .attr("dy",12)
    .style("font-size",10)

}
