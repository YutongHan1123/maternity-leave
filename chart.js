initChart()
function initChart(){
  var width = 500
  var height = 200
  var margin = {top:30, bottom:40, left:40, right:30}
  var step = (width-margin.left-margin.right)/4
  var yMax = 0

  for(var i=0; i<dailyNewCaseData.length; i++){
    var thisMax = d3.max(dailyNewCaseData[i].data,function(d){return d[1]})
    if(thisMax>yMax) yMax = thisMax
  }

  yMax = (Math.floor(yMax/10)+1)*10

  for(var i=0; i<dailyNewCaseData.length; i++){
    var divWrap = $("<div class='line-chart-div' id='chart"+i+"'></div>")
    $(".increase").append(divWrap)

    var svg = d3.select("#chart"+i).append("svg")
        .attr("width", width)
        .attr("height", height)

    var y = d3.scaleLinear()
            .domain([0, yMax])
            .range([ height-margin.bottom-margin.top, 0 ]);

    svg.append("rect")
      .attr("width",width)
      .attr("height",height-margin.bottom-margin.top)
      .attr("fill","#feedd7")
      .attr("x",20)
      .attr("y",margin.top)

    svg.append("g")
     .attr("transform", "translate("+(width+20)+","+margin.top+")")
     .call(d3.axisLeft(y).tickSize(width).tickPadding(4).ticks(4))
     .attr("class","yaxis")
     .style("font-size",11).style("stroke","#cba87d").style("stroke-width",0.5).style("fill","none").style("font-weight",400);


     var firstDate = dailyNewCaseData[0].data[0][0];
     var lastDate = dailyNewCaseData[0].data[dailyNewCaseData[0].data.length-1][0]

    var x = d3.scaleBand()
    .domain([firstDate,lastDate])
      // .domain(data.map(dailyNewCaseData[i].data[0]))
      .range([0,width-margin.right-margin.left]);

    svg.append("g")
     .attr("transform", "translate("+margin.left+","+(height-margin.bottom)+")")
     .call(d3.axisBottom(x).tickSize(8).tickPadding(4).ticks(10))
     .attr("class","xaxis")
     .style("font-size",11).style("stroke","#cba87d").style("fill","none").style("font-weight",400);

    svg.selectAll("text").style("stroke","none").style("fill","#333")
    svg.select(".xaxis").selectAll("text").attr("transform","translate("+step*0.75+",10) rotate(45)").attr("font-weight",900)


    svg.append("g")
          .append("text")
          .attr("fill",function(d){
            return "#333"
          })
          .text(function(d){return dailyNewCaseData[i].location})
          .attr("x",function(d){
            return 24
          })
          .attr("y",function(d){
            return 0
          })
          .attr("font-size",16)
          .attr("dy",16)
          .attr("font-weight",900)

    if(i==0){
      svg.append("g")
          .append("text")
          .attr("fill",function(d){
            return "#333"
          })
          .text("单位: 例")
          .attr("x",function(d){
            return 24
          })
          .attr("y",function(d){
            return 30
          })
          .attr("font-size",12)
          .attr("dy",16)
          .attr("font-weight",400)
    }

    //console.log(dailyNewCaseData[i].data)
    svg.append("g").selectAll("rect")
      .data(dailyNewCaseData[i].data)
      .enter()
      .append("rect")
      .attr("x",function(d,i){
        return margin.left+x(new Date(d[0])) - step*0.1
      })
      .attr("y",function(d,i){
        return y(d[1]) + margin.top
      })
      .attr("width",step*0.2)
      .attr("height",function(d,i){
        return height - margin.bottom -margin.top - y(d[1])
      })
      .attr("stroke",function(d){
            return "#d4644e"
          })
          .attr("stroke-width",2)
          .attr("fill",function(d){
            return "#e8afa5"
          })

  }
}
