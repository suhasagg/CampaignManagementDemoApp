function geoChart(obj) {

    var
        world= obj.topoJsonData,
        targetID = obj.targetID,
        dimensions = obj.dimensions,
        scaleDetails=obj.axis.scaleDetails,
        division = scaleDetails.division,
        axis = obj.axis,
        axisXkey=axis.axisXkey,
        axisYkey=axis.axisYkey,
        commonService=obj.commonService,
        data = commonService.setDivision({
            data : obj.data,
            divKey : axisYkey,
            division : division
        }),
        chartPlaceHolder = d3.select("#"+obj.targetID+" .svgBlock"),
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        strokecolor="#000"
    ;

    if(!!obj.margin){
        margin = obj.margin;
    }

    var
        width = parseInt(chartPlaceHolder[0][0].offsetWidth * parseInt(dimensions.width)/100) - margin.left - margin.right,
        height = width * parseInt(dimensions.height)/100 - margin.top - margin.bottom,
        tooltip = commonService.tooltip()
    ;
    height = (height>dimensions.minHeight) ? height : dimensions.minHeight;

    var projection = d3.geo.mercator()
        .translate([0, 0])
        .scale(width / 2 / Math.PI);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 50])
        .on("zoom", move);

    var path = d3.geo.path()
        .projection(projection);

    var svg = chartPlaceHolder
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .call(zoom);

    var g = svg.append("g");

    svg.insert("rect",":first-child")
        .attr("class", "overlay")
        .attr("x", -width / 2)
        .attr("y", -height / 2)
        .attr("width", width)
        .attr("height", height);

    /*d3.json("static/js/D3Charts/world-50m.json", function(error, world) {*/

        //debugger;
        g.append("path")
            .datum(topojson.feature(world, world.objects.countries))
            .attr("class", "land")
            .attr("d", path);

        g.append("path")
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "boundary")
            .attr("d", path);
    /*});*/

    function move() {
        var t = d3.event.translate,
            s = d3.event.scale;
        t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
        t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

        g.selectAll("circle")
            .attr("d", path.projection(projection))
            .attr("r", function(){
                var self = d3.select(this);
                var r = 3 / d3.event.scale;
                self.style("stroke-width", r < 4 ? (r < 2 ? 0.5 : 1) : 2);
                return r;
            });
    }

    try {
        g.selectAll("circle")
            .data(data)
            .enter()
/*            .append("a")
            .attr("xlink:href", function (d) {
                    return "https://www.google.com/search?q=" + d.city;
                }
            )*/
            .append("circle")
            .attr('class','circle')
            .attr("r", 2.5)
            .attr("transform", function (d) {
                /*var cityDetails = d.city.split(",");
                var projectionValues = projection([
                    cityDetails[2],
                    cityDetails[1]
                ]);*/

                var projectionValues = projection([d.lat, d.long]);

                if(isNaN(projectionValues[0]) || isNaN(projectionValues[1])) {
                    console.log(projectionValues);
                    console.log(cityDetails);
                }

                return "translate(" + projectionValues + ")";

            })
            .on("mousemove", function (d) {
                //debugger;
                pathData = d;

                mouse = d3.mouse(d3.select("#"+targetID)[0][0]);
                mousex = mouse[0] + 15 + margin.left;
                mousey = mouse[1] + 15 + margin.top;
                // console.log(mouse);

                //console.log(d3.event.pageX+", "+d3.event.pageY);



                tooltip.html(function () {
                    //debugger;
                    var scaleTxt = (!!scaleDetails.numberScale) ? "( In "+scaleDetails.numberScale+" )" : "";
                    return "<span>"+axis.xLabel+": </span><strong>" + d[axisXkey]  + "</strong></br>" +
                        "<span>"+axis.yLabel+": </span><strong>" + d[axisYkey]  + scaleTxt +"</strong></br>"
                    ;
                });
                commonService.positionTooltip();
            })
            .on("mouseout", function () {
                tooltip.style({display: 'none'});
            });
    } catch (e) {
        //console.log(e);
    }

}