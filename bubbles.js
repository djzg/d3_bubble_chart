(function() {
  var width = 1000,
     height = 500;

  var svg = d3.select("#chart")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(0,0)");

  var radiusScale = d3.scaleSqrt().domain([1, 300]).range([10, 80]);

  // the simulation is a collection of forces about where we want our circles to go and how we want our circles to interact

  // STEP ONE: Get them to the middle
  // STEP TWO: Don't have them collide

  var forceXSeparate = d3.forceX(function (d) {
    if (d.decade === "pre-2000") {
      return 250;
    } else {
      return 700;
    }
  }).strength(0.05);

  var forceXCombine = d3.forceX(width / 2).strength(0.05);

  var forceCollide = d3.forceCollide(function(d) {
    return radiusScale(d.sales) + 1;
  });

  var simulation = d3.forceSimulation()
  //force along the x axis
  .force("x",  forceXCombine)
  //force along the y axis
  .force("y", d3.forceY(height / 2).strength(0.05))
  //colliding force
  .force("collide", forceCollide);

  d3.queue()
  .defer(d3.csv, "sales.csv")
  .await(ready);

  function ready(error, datapoints) {
    //create circles
    var circles = svg.selectAll(".artist")
    .data(datapoints)
    .enter()
    .append("circle")
    .attr("class", "artist")
    .attr("r", function(d){
      return radiusScale(d.sales);
    })
    .attr("fill", "lightblue")
    .attr("text", function (d) {
      return d.name;
    })
    .on("click", function(d){
        console.log(d);
    });

    //create buttons
    d3.select("#decade").on("click", function(){
      simulation.force("x",  forceXSeparate)
      .alphaTarget(0.35)
      .restart()
    });

    d3.select("#combine").on("click", function() {
      simulation.force("x", forceXCombine)
      .alphaTarget(0.35)
      .restart()
    });
    //simulation start on tick
    simulation.nodes(datapoints)
    .on("tick", ticked);

    //create circles
    function ticked() {
      circles
      .attr("cx", function(d){
        return d.x;
      })
      .attr("cy", function(d){
        return d.y;
      });
    };
  };


})();
