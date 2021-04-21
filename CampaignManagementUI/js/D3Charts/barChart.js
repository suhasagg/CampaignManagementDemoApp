function barChart(obj) {

    var
        dimensions = obj.dimensions,
        commonService = obj.commonService,
        data = obj.data,
        chartPlaceHolder = d3.select("#"+obj.targetID+" .svgBlock"),
        margin = {top: 20, right: 20, bottom: 20, left: 20},
        axis = obj.axis,
        axisXkey=axis.axisXkey,
        axisYkey=axis.axisYkey,
        axisXType = axis.axisXType,
        scaleDetails = obj.axis.scaleDetails || {},
        division = scaleDetails.division,
        dateTimeFormat = '%d %b, %I:%M %p',
        dateFormat = '%d %b '
    ;

    data = commonService.setDivision({
        data : data,
        divKey : axisYkey,
        division : division
    });

    if(!!obj.margin){
        margin = obj.margin;
    }

    var
        width = parseInt(chartPlaceHolder[0][0].offsetWidth * parseInt(dimensions.width)/100) - margin.left - margin.right,
        height = width * parseInt(dimensions.height)/100 - margin.top - margin.bottom,
        tooltip = commonService.tooltip(),
        minWidth = dimensions.minWidth,
        minHeight
    ;

    width = (width > minWidth) ? width : minWidth;
    if(commonService.isHandHeldDevice()) {
        minHeight = width * parseInt(dimensions.minHeight) / 100;
        height = (height > minHeight) ? height : minHeight;
    }

// Parse the date / time
    var parseDate = d3.time.format("%Y-%m").parse;
    var y = d3.scale.linear().range([height, 0]);
    var x, xAxis, x_axis, dateExtent;

    chartPlaceHolder.selectAll('svg').style({'display':'none'});

    var svg = chartPlaceHolder
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    /*if(axisXkey === 'date') {
        x = d3.time.scale().range([0, width]);
        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            //.ticks(d3.time.days)
            .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); });

        dateExtent = d3.extent(data, function(d) { return d[axisXkey]; })

        x.domain([dateExtent[0], dateExtent[1]])//.nice();


        x_axis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - margin.top) + ")")
                .call(xAxis)
            ;

        var tickXPos = (!commonService.isHandHeldDevice())?22:10;

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
            .attr({'x1':tickXPos,'x2':tickXPos})
        ;

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text(axis.xLabel);
    } else */
    //{
        x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")

        ;

        if( axisXkey==='date' ){
            xAxis.tickFormat(function(d) { return d3.time.format(dateFormat)(new Date(d)); });
        }

        if( axisXType === 'dateTime' ){
            xAxis.tickFormat(function(d) { return d3.time.format(dateTimeFormat)(new Date(d)); });
        }

        x.domain(data.map(function (d) {
            return d[axisXkey];
        }));

        var x_Axis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
            ;

        x_Axis.call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr('opacity','1')
            .attr("dx", "-0.5em")
            .attr("dy", "-.55em")
            .attr("y", 20);

        if(!!axis.xTiltDeg)
            x_Axis.call(xAxis)
                .selectAll("text")
                .attr({"transform": "rotate("+(axis.xTiltDeg)+")", y:-2,x:-5})
                .style({'text-anchor':'end','text-transform':'capitalize'})
            ;
    //}

    var z = d3.scale.category20();
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)
    ;

/*    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(0, 1000)
    ;*/
//debugger;

  /*  d3.json(jsonpath, function (error, data) {*/



        y.domain([0.5, d3.max(data, function (d) {
            return d[axisYkey];
        })]);



    if(!!scaleDetails.numberScale) {
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (margin.left - 30))
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style({"text-anchor": "middle", 'font-size': '11px'})
            .text("(in " + scaleDetails.numberScale + ")")
        ;
    }
        //debugger;
/*        x_Axis.append("text")
            .text(axis.xLabel)
            .style("text-anchor", "middle")
            .attr({"x":(width / 2)})
            .attr({'y':20})
        ;*/


    /*        svg
     .append('path')
     .attr({
     "transform": "translate(0," + height + ")",
     "width":width
     })
     .append("text")
     .attr('y',-20)
     .style("text-anchor", "end")
     .text(axis.xLabel)*/

        ;

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            //.attr("transform", "rotate(-90)")
            .attr("y", -20)
            .attr("dy", ".71em")
/*            .style("text-anchor", "end")
            .text(axis.yLabel);*/

        if(!!axis.yLabel) {
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - (margin.left - 10))
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(axis.yLabel)
            ;
        }

        var rects = svg.selectAll(".bars")
            .data(data)
            .enter().append("rect")
            .on("mousemove",function(d) {
                var
                    xAxisVal = (axisXType === 'dateTime' ) ? d3.time.format(dateTimeFormat)(new Date(d[axisXkey])) : d[axisXkey]
                ;

                xAxisVal = (axisXType === 'date' ) ? d3.time.format(dateFormat)(new Date(d[axisXkey])) : d[axisXkey];

                tooltip.html(function () {
                    var scaleTxt = (!!scaleDetails.numberScale) ? "( In "+scaleDetails.numberScale+" )" : "";
                    return "<span>"+axis.xLabel+": </span><strong>" +  xAxisVal  + "</strong></br>" +
                        "<span>"+axis.yLabel+": </span><strong>" + d[axisYkey]  + scaleTxt +"</strong></br>"
                    ;
                });
                commonService.positionTooltip();
            });


        rects.style("fill", function(d, i) {return z(i); })
            .attr({
                "x": function (d) {
                    return x(d[axisXkey]);
                },
                "width": x.rangeBand(),

                "y": function (d) {
                    return y(d[axisYkey]);
                },
                "height": function (d) {
                    return height - y(d[axisYkey]);
                },
                "class":"bars"
            })

            .on("mouseover", function(d, i) {
                svg.selectAll(".bars")
                .transition()
                .duration(250)
                .attr("opacity", function(d, j) {
                    return j != i ? 0.6 : 1;
                })
            })

            .on("mouseout", function(d, i) {
                svg.selectAll(".bars")
                    .transition()
                    .duration(250)
                    .attr("opacity", "1");
                d3.select(this)
                    .classed("hover", false)
                    /*.attr("stroke-width", "0px");*/
              //  tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
                tooltip.style({'display':'none'});
            })
            ;

/*        d3.selectAll('.bars').on("click",function(){
            angular.element(document.getElementById('charts')).scope().loadChart('subPieChart');
        });*/



   /* });*/

}