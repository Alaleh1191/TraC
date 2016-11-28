var svg = d3.select("svg"),
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(2,2)");
//    format = d3.format(",d");

var pack = d3.pack()
    .size([diameter-4, diameter-4]);


function test(chord){
  console.log("chord");
  console.log(chord);
    root = d3.hierarchy(chord)
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });

    var node = g.selectAll(".node")
      .data(pack(root).descendants())
      .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

   // node.append("title")
     //   .text(function(d) { return d.data.name + "\n" + format(d.value); });

    node.append("circle")
        .attr("r", function(d) {console.log(d); return d.r; });

}

  //node.filter(function(d) { return !d.children; }).append("text")
    //  .attr("dy", "0.3em")
      //.text(function(d) { return d.data.name.substring(0, d.r / 3); });
//});