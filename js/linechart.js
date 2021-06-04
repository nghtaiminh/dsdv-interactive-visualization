var rowConverter = function (d) {
  return {
    Emission: parseInt(d.Emission),
    Country: d["Country"],
    Year: parseInt(d.Year),
  };
};

d3.csv(
  "https://raw.githubusercontent.com/quynhhuong2401/INTERACTIVE-VISUALIZATION/master/data/datalinechart.csv",
  rowConverter,
  function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);

      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } 

      // Set the margins
      var margin = {
        top: 60,
        right: 60,
        bottom: 50,
        left: 100,
      };
      (width = 920 - margin.left - margin.right),
        (height = 320 - margin.top - margin.bottom);

      var linechart1Selector = d3.select("#linechart");

      // Create the svg canvas
      var svg = linechart1Selector
        .append("svg")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg");

      //NEST : group data by country
      var nest = d3
        .nest()
        .key(function (d) {
          return d.Country;
        })
        .entries(data);
      console.log(nest);

      // Set the ranges
      var x = d3
        .scaleLinear()
        .domain([
          d3.min(data, function (d) {
            return d.Year;
          }),
          d3.max(data, function (d) {
            return d.Year;
          }),
        ])
        .range([0, width]);
      var y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return d.Emission;
          }),
        ])
        .range([height, 0]);
      // color
      var res = nest.map(function (d) {
        return d.key;
      });
      console.log(nest);
      var color = d3
        .scaleOrdinal()
        .domain(res)
        .range(["#CF33FF", "#33FFBB", "#FFC933", "#FF3355", "#337eff"]);

      //  Add the X Axis
      var xaxis = svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(
          d3.axisBottom(x).ticks(10).tickFormat(d3.formatPrefix(".0", 1e1))
        );

      // Add the Y Axis
      var yaxis = svg
        .append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.formatPrefix(".0", 1e6)));

      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 360)
        .attr("y", height + 40)
        .text(" Year ")
        .attr("class", "x axis label")
        .attr("fill", "grey");

      // Add a label to the y axis
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 80)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(" Emission ")
        .attr("class", "y axis label")
        .style("fill", "grey");

      // Add line into SVG
      var line = d3
        .line()
        .x((d) => x(d.Year))
        .y((d) => y(d.Emission));

      let glines = svg.append("g");

      glines
        .selectAll(".line-group")
        .data(nest)
        .enter()
        .append("g")
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return color(d.key);
        })
        .attr("class", function (d) {
          return "line " + "line-" + d.key;
        })
        .attr("d", (d) => line(d.values))
        .style("stroke-width", "2");

      // LEGEND

      //Hightlight the country which is hovered
      var highlight = function (d) {
        d3.selectAll(".line").transition().duration(300).style("opacity", 0.05);

        d3.select(".line-" + d.key)

          .transition()
          .duration(300)
          .style("opacity", "1")
          .style("stroke-width", "3");
      };

      // when it is not hovered anymore
      var noHighlight = function (d) {
        d3.selectAll(".line")
          .transition()
          .duration("100")
          .style("opacity", "1")
          .style("stroke-width", "2");
      };

      // Add one dot in the legend for each name.
      var size = 10;
      svg
        .selectAll("myRect")
        .data(nest)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return 100 + i * (size + 100);
        })
        .attr("y", -30)
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (d) {
          return color(d.key);
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

      // Add one dot in the legend for each name.
      svg
        .selectAll("mylabels")
        .data(nest)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
          return 115 + i * (size + 100);
        })
        .attr("y", -25)
        .style("fill", "white")
        .text(function (d) {
          return d.key;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .attr("font-size", "12px")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

      /*
                        // Add the CIRCLE on the lines
                        svg
                            .selectAll("myDots")
                            .data(nest)
                            .enter()
                            .append('g')
                            .style("fill", "white")
                            .attr("stroke", function (d) {
                                return color(d.key)
                            })
                            .style("stroke-width", "0.5")
                            .selectAll("myPoints")
                            .data(function (d) {
                                return d.values
                            })
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) {
                                return x(d.Year)
                            })
                            .attr("cy", function (d) {
                                return y(d.Emission)
                            })
                            .attr("r", 2)
                            .attr('class', function (d) {
                                return "circle " + d.key
                            }) */

      period1 = svg
        .append("line")
        .style("stroke", "grey")
        .attr("x1", 339)
        .attr("y1", 0)
        .attr("x2", 339)
        .attr("y2", 210);

      period2 = svg
        .append("line")
        .style("stroke", "grey")
        .attr("x1", 623)
        .attr("y1", 0)
        .attr("x2", 623)
        .attr("y2", 210);

      text_period1 = svg
        .append("text")
        .attr("y", 10)
        .attr("x", 150)
        .attr("text-anchor", "middle")
        .attr("class", "myLabel1")
        .text("First industrial revolution")
        .attr("font-size", "13px")
        .attr("font-family", '"Titillium Web", sans-serif')
        .attr("fill", "lightgray")
        .attr("opacity", 0.5)

      text_period2 = svg
        .append("text")
        .attr("y", 10)
        .attr("x", 470)
        .attr("text-anchor", "middle")
        .attr("class", "myLabel2")
        .text("Second industrial revolution")
        .attr("font-size", "13px")
        .attr("fill", "lightgray")
        .attr("opacity", 0.5)

      text_period3 = svg
        .append("text")
        .attr("y", 10)
        .attr("x", 695)
        .attr("text-anchor", "middle")
        .attr("class", "myLabel3")
        .text("Third industrial revolution")
        .attr("font-size", "13px")
        .attr("fill", "lightgray")
        .attr("opacity", 0.5)

      // this the black vertical line to folow mouse
      var mouseG = svg.append("g").attr("class", "mouse-over-effects");

      mouseG
        .append("path")
        .attr("class", "mouse-line")
        .style("stroke", "gray")
        .style("stroke-dasharray", "3, 3")
        .style("stroke-width", "1.5px")
        .style("opacity", "0");

      var mousePerLine = mouseG
        .selectAll(".mouse-per-line")
        .data(nest)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

      mousePerLine
        .append("circle")
        .attr("r", 7)
        .style("stroke", function (d) {
          return color(d.key);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

      mousePerLine.append("text").attr("transform", "translate(10,-5)");

      var tooltip = d3.select("#linechart")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "fixed")
        .style("background-color", "whitesmoke")
        .style("padding", 1 + "px")
        .style("display", "none");

      mouseG
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseout", function () {
          linechart1Selector.select(".mouse-line").style("opacity", "0");
          linechart1Selector
            .selectAll(".mouse-per-line circle")
            .style("opacity", "0");
          linechart1Selector
            .selectAll(".mouse-per-line text")
            .style("opacity", "0");
          linechart1Selector.selectAll("#tooltip").style("display", "none");
        })
        .on("mouseover", function () {
          linechart1Selector.select(".mouse-line").style("opacity", "1");
          linechart1Selector
            .selectAll(".mouse-per-line circle")
            .style("opacity", "1");
          linechart1Selector
            .selectAll(".mouse-per-line text")
            .style("opacity", "1");
          linechart1Selector.selectAll("#tooltip").style("display", "block");
        })
        .on("mousemove", function () {
          let mouse = d3.mouse(this);

          if (mouse[0] >= width) {
            mouseG.select("rect").attr("width", width + 30);
            return;
          }

          linechart1Selector
            .selectAll(".mouse-per-line")
            .attr("transform", function (d) {
              let xDate = x.invert(mouse[0] - 5);
              let bisect = d3.bisector(function (d) {
                return d.Year;
              }).right;
              let idx = bisect(d.values, xDate);

              let xCoordinate = x(d.values[idx].Year).toString();
              let yCoordinate = y(d.values[idx].Emission).toString();

              linechart1Selector.select(".mouse-line").attr("d", function () {
                let data = "M" + xCoordinate + "," + height;
                data += " " + xCoordinate + "," + 0;
                return data;
              });

              d3.select(this)
                .select("text")
                //  .text(y.invert(yCoordinate).toFixed(0))
                .attr("fill", function (d) {
                  return color(d.key);
                });

              return "translate(" + xCoordinate + "," + yCoordinate + ")";
            });

          updateTooltipContent(mouse, nest);
        });

      function updateTooltipContent(mouse, nest) {
        var sortingObj = [];

        nest.map((d) => {
          var xDate = x.invert(mouse[0] - 5);
          var bisect = d3.bisector(function (d) {
            return d.Year;
          }).right;
          var idx = bisect(d.values, xDate);

          sortingObj.push({
            country: d.values[idx].Country,
            Emission: d.values[idx].Emission,
            Year: d.values[idx].Year,
          });
        });

        if (sortingObj[0] == null) return;

        sortingObj.sort((x, y) => y.Emission - x.Emission);

        tooltip
          .html((d) => {
            return (
              '<div style="font-weight: bold;font-size: 17px; text-decoration: underline;">' +
              "Year" +
              ":" +
              sortingObj[0].Year +
              "</div>"
            );
          })
          .style("left", d3.event.pageX + 30 + "px")
          .style("top", d3.event.pageY - 200 + "px")
          .style("display", "block")
          .style("font-size", 12)
          .selectAll()
          .data(sortingObj)
          .enter()
          .append("div")
          .style("color", "black")
          .style("font-size", 10)
          .html((d) => {
            return d.country + " : " + numberWithCommas(d.Emission);
          });
      }
    }
  }
);
