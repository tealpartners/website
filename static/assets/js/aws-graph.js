(function () {
    "use strict";

    function graph(graph_name, keys, labels) {

        const offsetWidth = document.getElementById(graph_name).parentElement.offsetWidth;

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 50, bottom: 50, left: 50 },
            width = offsetWidth - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#" + graph_name)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //Read the data
        d3.csv("/assets/data/aws-" + graph_name + ".csv", function (data) {

            // List of groups (here I have one group per column)
            var xAxis = keys[0];
            var allGroup = keys.slice(1)

            // A color scale: one color for each group
            var myColor = d3.scaleOrdinal()
                .domain(allGroup)
                .range(d3.schemeSet2);

            // Add X axis --> it is a date format
            var x = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d[keys[0]] + 10; })])
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // text label for the x axis
            svg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text(labels[0]);


            // Add Y axis
            const yAxis = [];
            var y0 = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d[keys[1]] * 1.1; })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y0));

            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(labels[1]);

            yAxis.push(y0);
            if (keys.length > 2) {
                var y1 = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return +d[keys[2]] * 1.1; })])
                    .range([height, 0]);
                svg.append("g")
                    .attr("transform", "translate(" + width + " ,0)")
                    .call(d3.axisRight(y1));

                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", width - margin.right)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(labels[2]);

                yAxis.push(y1);
            }

            // Reformat the data: we need an array of arrays of {x, y} tuples
            var dataReady = allGroup.map(function (grpName, index) { // .map allows to do something for each element of the list
                return {
                    name: grpName,
                    label: labels[index],
                    values: data.map(function (d) {
                        return {
                            xAxis: d[xAxis],
                            value: +d[grpName],
                            yScale: yAxis[index]
                        };
                    })
                };
            });

            // Add the lines
            var line = d3.line()
                .x(function (d) { return x(+d.xAxis) })
                .y(function (d) { return d.yScale(+d.value) });

            svg.selectAll("myLines")
                .data(dataReady)
                .enter()
                .append("path")
                .attr("class", function (d) { return graph_name + d.name })
                .attr("d", function (d) { return line(d.values) })
                .attr("stroke", function (d) { return myColor(d.name) })
                .style("stroke-width", 4)
                .style("fill", "none");

            // Add the points
            svg
                // First we need to enter in a group
                .selectAll("myDots")
                .data(dataReady)
                .enter()
                .append('g')
                .style("fill", function (d) { return myColor(d.name) })
                .attr("class", function (d) { return graph_name + d.name })
                // Second we need to enter in the 'values' part of this group
                .selectAll("myPoints")
                .data(function (d) { return d.values })
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.xAxis) })
                .attr("cy", function (d) { return d.yScale(d.value) })
                .attr("r", 5)
                .attr("stroke", "white")

            // Add a legend (interactive)
            svg
                .selectAll("myLegend")
                .data(dataReady)
                .enter()
                .append('g')
                .append("text")
                .attr('x', function (d, i) { return 30 + i * 60 })
                .attr('y', 10)
                .text(function (d) { return d.label; })
                .style("fill", function (d) { return myColor(d.name) })
                .style("font-size", 15)
                .on("click", function (d) {
                    // is the element currently visible ?
                    var currentOpacity = d3.selectAll("." + graph_name + d.name).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                    d3.selectAll("." + graph_name + d.name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

                })
        })
    }

    function create() {
        const graph1_keys = ['users', 'load-time'];
        const graph1_labels_en = ['Users', 'Load time (s)'];
        const graph1_labels_nl = ['Gebruikers', 'Laadtijd (s)'];

        const graph2_keys = ['time', 'users', 'load-time'];
        const graph2_labels_en = ['Time (s)', 'Users', 'Median load time (s)'];
        const graph2_labels_nl = ['Tijd (s)', 'Gebruikers', 'Mediane Laadtijd (s)'];

        if (document.URL.indexOf('/nl/') > 0) {
            graph('graph-1', graph1_keys, graph1_labels_nl);
            graph('graph-2', graph2_keys, graph2_labels_nl);
        } else {
            graph('graph-1', graph1_keys, graph1_labels_en);
            graph('graph-2', graph2_keys, graph2_labels_en);
        }
    }


    if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
        create();
    } else {
        window.addEventListener("DOMContentLoaded", create);
    }
})();