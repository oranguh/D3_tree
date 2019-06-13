
d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)

var svg = d3.select("svg")

// var width = +svg.attr("width")
// var height = +svg.attr("height");
function autosize(svg) {
  document.body.appendChild(svg);
  const box = svg.getBBox();
  document.body.removeChild(svg);
  svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
  return svg;
}

function update(data) {
  const root = tree(data)

  const svg = d3.create("svg")
      .style("font", "10px sans-serif");

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));

  const node = svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants().reverse())
    .join("g")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
    .clone(true).lower()
      .attr("stroke", "white");

  return autosize(svg.node());

}

d3.json("graph.json").then(function(graph) {
  width = 932
  radius = 466

  tree = graph => d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
  (d3.hierarchy(tree))


  console.log(tree)
  update(tree)
  console.log(tree)
})
