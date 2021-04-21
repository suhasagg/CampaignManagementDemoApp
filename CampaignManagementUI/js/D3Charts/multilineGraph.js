function multilineGraph(obj) {

    var
        datearray = [],
    //core variables for chart
        data = obj.dataObj.data,
        dataObj = obj.dataObj,
        dimensions = obj.dimensions,
        axis = obj.axis,
        axisXkey = axis.axisXkey,
        axisYkey = axis.axisYkey,
        nestKey = obj.nestKey,
        scaleDetails = obj.axis.scaleDetails || {},
        division = scaleDetails.division,
        strokecolor = "#000",
        commonService = obj.commonService,
        minWidth = dimensions.minWidth,
        processedData = dataObj.improveData({
            data: dataObj.data,
            axisXkey: axisXkey,
            axisYkey: axisYkey,
            nestKey: nestKey,
            division: division
        }),
        format = d3.time.format("%m/%d/%y"),
        margin = {top: 10, right: 10, bottom: 45, left: 45}
        ;

    if (!!obj.margin) {
        margin = obj.margin;
		margin.left += 25;
    }
    var
        formatDate = commonService.formatDate,
        chartPlaceHolder = d3.select("#" + obj.targetID + " .svgBlock"),
        width = parseInt(chartPlaceHolder[0][0].offsetWidth * parseInt(dimensions.width) / 100) - margin.left - margin.right,
        outerHeight,
        minHeight
    ;

    width = (width > minWidth) ? width : minWidth;
    outerHeight = width * parseInt(dimensions.height) / 100;
    if (commonService.isHandHeldDevice()) {
        minHeight = width * parseInt(dimensions.minHeight) / 100;
        outerHeight = (outerHeight > minHeight) ? outerHeight : minHeight;
    }

    var
        legendH = 0,
        height = legendH + outerHeight - margin.top - margin.bottom,
        formattedData = (function (data) {
            var formattedData = [];
            for (var i = 0, len = data.length; i < len; i++) {
                formattedData[i] = data[i].values;
            }
            return formattedData;
        }(processedData))
        ;

    chartPlaceHolder.html("");

//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
    var
        x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        z = d3.scale.category10(),

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(function (d) {
                return d3.time.format('%b %d')(new Date(d));
            })
        ,

        yAxis = d3.svg.axis()
            .scale(y)
            .ticks(7)
            .orient('left')
        ;

    if (data.length < 15) {
        xAxis.ticks(d3.time.days)
    }

    var
        tooltip = commonService.tooltip(),
        dateExtent = d3.extent(data, function (d) {
            return d[axisXkey];
        })
        ;

    x.domain([dateExtent[0], dateExtent[1]])//.nice();
    y.domain([0, d3.max(data, function (d) {
        return d[axisYkey];
    })]).nice();


//************************************************************
// Generate our SVG object
//************************************************************
    var svg = chartPlaceHolder
        .append("svg")
        /* .call(zoom)*/
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (axis.x == true) {

        var x_axis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height ) + ")")
                .call(xAxis)
            ;

        var tickXPos = (!commonService.isHandHeldDevice()) ? 22 : 10;

        x_axis
            .selectAll("text")
            .attr("y", tickXPos)
            .attr("x", 25 * -1)
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
        ;
        x_axis
            .selectAll('line')
            .attr({'x1': tickXPos, 'x2': tickXPos})
        ;

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text(axis.xLabel);

    }

    if (axis.y == true) {
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis.orient("left"))
        ;

        if (!!axis.yLabel) {
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - (margin.left - 10))
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(axis.yLabel)
            ;
        }

        if (!!scaleDetails.numberScale) {
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - (margin.left - 30))
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style({"text-anchor": "middle", 'font-size': '11px'})
                .text("(in " + scaleDetails.numberScale + ")")
            ;
        }

    }

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

//************************************************************
// Create D3 line object and draw data on our SVG object
//************************************************************
    var line = d3.svg.line()
        .interpolate("linear")
        .x(function (d) {
            return x(d[axisXkey]);
        })
        .y(function (d) {
            return y(d[axisYkey]);
        });

    svg.selectAll('.line')
        .data(formattedData)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr('stroke', function (d, i) {
            return z(i);
        })
        .attr("d", line);


//************************************************************
// Draw points on SVG object based on the data given
//************************************************************
    var points = svg.selectAll('.dots')
        .data(formattedData)
        .enter()
        .append("g")
        .attr("class", "dots")
        .attr("clip-path", "url(#clip)");

    points.selectAll('.dot')
        .data(function (d, index) {
            var a = [];
            d.forEach(function (point, i) {
                a.push({'index': index, 'point': point});
            });
            return a;
        })
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr("r", 2.5)
        .attr('fill', function (d, i) {
            return z(0);
        })
        .attr("transform", function (d) {
                return "translate(" + x(d.point[axisXkey]) + "," + y(d.point[axisYkey]) + ")";
            }
        )
        .on("mouseover", function (d, i) {
            var
                mousex = d3.event.pageX + 10,
                mousey = d3.event.pageY + 10
                ;
            commonService.positionTooltip();
            tooltip.style({display: 'block'});
            tooltip.html(function () {
                var htmlStr = "";
                for (var i = 0, len = dataKeys.length; i < len; i++) {
                    var valueTxt = "";
                    if (dataKeys[i] === "date") {
                        valueTxt = formatDate(d.point[dataKeys[i]]);
                    }
                    else if (dataKeys[i] === axisYkey) {
                        valueTxt = d.point[dataKeys[i]];
                        valueTxt += (!!scaleDetails.numberScale) ? " (in " + scaleDetails.numberScale + " )" : "";
                    } else valueTxt = d.point[dataKeys[i]];


                    htmlStr += "<span>" + dataKeys[i] + ":</span><strong>" + valueTxt + "</strong></br>"
                }
                return htmlStr;
            })
        })
        .on("mouseout", function (d) {
            tooltip.style('display', 'none');
        });

    /**Legends**/

    var
        legendBlock
        ;

    if (!chartPlaceHolder.select('.legends')[0][0]) {
        legendBlock = chartPlaceHolder.insert('div', ":first-child")
            .attr({'class': 'legends'});
        /*.style({'height':outerHeight+'px'})*/
    } else {
        legendBlock = chartPlaceHolder.select('.legends');
        legendBlock.html("");
    }

    if(processedData.length > 1){
    var nodes = legendBlock.selectAll('div')
        .data(processedData)
        .enter()
        .append('div')
        .attr({'class': 'legend'})
        .on("mouseover", function (d, i) {

            svg.selectAll(".line")
                .transition()
                .duration(250)
                .attr({
                    "opacity": function (d, j) {
                        return j != i ? 0.2 : 1;
                    }
                });
        })
        .on("mouseout", function (d, i) {
            svg.selectAll(".line")
                .transition()
                .duration(250)
                .attr({"opacity": "1"});
            d3.select(this)
                .classed("hover", false);
            /*tooltip.style({display: 'none'});*/
        });

    nodes
        .append('span')
        .classed('colorBlk', true)
        .style({
            'background': function (d, i) {
                return z(i);
            }
        });

    nodes
        .append('span')
        .attr('class', 'txt')
        .text(function (d) {
            return d.key;
        })
    ;
}
    var dataKeys = [];
    dataKeys.push(axisXkey);
    dataKeys.push(axisYkey);
    dataKeys.push("channelName");
    var body = d3.select("body")[0][0];


//************************************************************
// Zoom specific updates
//************************************************************
    function zoomed() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.selectAll('path.line').attr('d', line);

        points.selectAll('circle').attr("transform", function (d) {
                return "translate(" + x(d.point[axisXkey]) + "," + y(d.point[axisYkey]) + ")";
            }
        );
    }


}