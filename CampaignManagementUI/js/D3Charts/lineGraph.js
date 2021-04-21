function lineGraph(obj) {
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
/*        processedData = dataObj.improveData({
            data: dataObj.data,
            axisXkey: axisXkey,
            axisYkey: axisYkey,
            nestKey: nestKey,
            division: division
        }),*/
        formatDate = d3.time.format("%d-%b-%y");
        margin = {top: 10, right: 10, bottom: 45, left: 45}
        ;

    if (!!obj.margin) {
        margin = obj.margin;
    }
    var
        chartPlaceHolder = d3.select("#" + obj.targetID + " .svgBlock"),
        width = parseInt(chartPlaceHolder[0][0].offsetWidth * parseInt(dimensions.width) / 100) - margin.left - margin.right,
        outerHeight,
        minHeight,
        height,
        legendH=0
    ;
/*
    data.forEach(function (d){
        d.date = new Date(d.date);
    });*/ 


    width = (width > minWidth) ? width : minWidth;
    outerHeight = width * parseInt(dimensions.height) / 100;
    if (commonService.isHandHeldDevice()) {
        minHeight = width * parseInt(dimensions.minHeight) / 100;
        outerHeight = (outerHeight > minHeight) ? outerHeight : minHeight;
    }
    height = legendH + outerHeight - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function (d) {
            return d3.time.format('%b %d')(new Date(d));
        });

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d[axisXkey]);
        })
        .y(function (d) {
            return y(d[axisYkey]);
        });

    var svg = chartPlaceHolder.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /*d3.tsv("data.tsv", type, function (error, data) {*/

        x.domain(d3.extent(data, function (d) {
            return d[axisXkey];
        }));
        y.domain(d3.extent(data, function (d) {
            return d[axisYkey];
        }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    //});
}