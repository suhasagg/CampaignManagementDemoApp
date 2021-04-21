/*
* chart(targetID, dataObj, color, axisXkey, axisYkey, divRatio, nestKey, dimension, axis){
*
* */
function streamGraphChart(obj){

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
        commonService=obj.commonService,
        minWidth = dimensions.minWidth,
        processedData = dataObj.improveData({
            data : dataObj.data,
            axisXkey : axisXkey,
            axisYkey : axisYkey,
            nestKey : nestKey,
            division : division
        }),
        format = d3.time.format("%m/%d/%y"),
        margin = {top: 10, right: 10, bottom: 45, left: 45}
    ;
    
    if(!!obj.margin){
        margin = obj.margin;
		margin.left += 25;
    }

    var
        chartPlaceHolder = d3.select("#"+obj.targetID+" .svgBlock"),
        targetID = d3.select("#"+obj.targetID)
    ;

/*
    if(!chartPlaceHolder[0][0]){
        debugger;
        console.log('Chart rendering block missing.');
        return;
    }
*/

    var
        width = parseInt(chartPlaceHolder[0][0].offsetWidth * parseInt(dimensions.width)/100) - margin.left - margin.right,
        outerHeight,
        minHeight
    ;

        width = (width > minWidth) ? width : minWidth;
        outerHeight = width * parseInt(dimensions.height) / 100;
        if(commonService.isHandHeldDevice()) {
            minHeight = width * parseInt(dimensions.minHeight) / 100;
            outerHeight = (outerHeight > minHeight) ? outerHeight : minHeight;
        }
    var
        legendH = 0,
        height = legendH + outerHeight - margin.top - margin.bottom,

    //All axis  initialization >
        x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height-10, 0]),
        //z = d3.scale.category10(),
        z = function(index){
            var colors = ['#03a9f4','#29b6f6','#4fc3f7','#81d4fa','#b3e5fc','#e1f5fe'];
            return colors[index];
        };

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            //.ticks(d3.time.days)
            .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
       ,

        yAxis = d3.svg.axis()
            .scale(y)
            .ticks(7)
        ;

        var tooltip = commonService.tooltip(),

        dateExtent = d3.extent(data, function(d) { return d[axisXkey]; })
    ;

    x.domain([dateExtent[0], dateExtent[1]])//.nice();
    y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]).nice();

    var area = d3.svg.area()
        //.defined(function(d) { return !isNaN(d[axisYkey]); })
            //.interpolate("monotone")
            .x(function(d) { return x(d[axisXkey]); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); })
    ;




    chartPlaceHolder.selectAll('svg').remove();

    var chartIdStr =  axisYkey + '-' + axisXkey + 'Chart';
    var chartSVGBlock = d3.select('#'+chartIdStr);

        chartSVGBlock = chartPlaceHolder
            .append("svg")
            .attr({'id': axisYkey + '-' + axisXkey + 'Chart'});


    var svg =
            chartSVGBlock.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                /*.attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
                .attr('preserveAspectRatio','xMinYMin')*/
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;


    var formatDate = commonService.formatDate;
    /*var graph = d3.json(jsonPath, function(data) {*/
        svg.selectAll(".layer")
            .data(processedData)
            .enter()
            .append('g')
            .append("path")
            //.attr("y", 100)
            .attr({"class":function(d){
                return "layer lyr-"+d.key;
            }})
            .attr("d", function(d) {
                return area(d.values);
            })
            .style("fill", function(d, i) {return z(i); })
        ;

    var dataKeys = [];
        dataKeys.push(axisXkey);
        dataKeys.push(axisYkey);
        dataKeys.push("channel");
    var body = d3.select("body")[0][0];

    var showTooltip = function(d,i,mouse,dataKeys){
/*        mousex = mouse[0] + 5 + margin.left;
        mousey = mouse[1] + 5 + margin.top;*/

        //debugger
        var
            invertedx = x.invert(mouse[0]),
            selected = (d.values),
            currentDataSet,
            htmlStr = ""

            ;
        invertedx = invertedx.getMonth() + invertedx.getDate();


        for (var k = 0; k < selected.length; k++) {
            datearray[k] = selected[k][axisXkey];
            datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
        }

        mousedate = datearray.indexOf(invertedx);

        currentDataSet = d.values[mousedate];
        htmlStr = "";
        for(i in currentDataSet){
            if(
                (/*Math.ceil(currentDataSet[i])!==0 || */dataKeys.indexOf(i)!=-1)&&
                i.indexOf('hashKey')==-1 &&
                i!=='y' &&
                i!=='y0'
            ) {

                if(i==="date"){
                    htmlStr += "<span>"+i + ":</span> <strong>" + formatDate(currentDataSet[i])  + "</strong></br>";
                }
                else if(i===axisYkey){
                    htmlStr += "<span>"+i + ":</span> <strong>" + currentDataSet[i];
                    htmlStr += (!!scaleDetails.numberScale) ? " (in "+scaleDetails.numberScale+" )</strong></br>" : "</strong></br>";
                }
                else {
                    htmlStr += "<span>"+i + ":</span> <strong>"+ currentDataSet[i] + "</strong></br>";
                }
            }
        }
        commonService.positionTooltip();
        tooltip.html(htmlStr);

    };

    var
        legendBlock
    ;

    if(!chartPlaceHolder.select('.legends')[0][0]){
        legendBlock = chartPlaceHolder.insert('div',":first-child")
            .attr({'class':'legends'});
            /*.style({'height':outerHeight+'px'})*/
    } else {
        legendBlock = chartPlaceHolder.select('.legends');
        legendBlock.html("");
    }

    var nodes = legendBlock.selectAll('div')
        .data(processedData)
        .enter()
        .append('div')
        .attr({'class':'legend'})
        .on("mouseover",function(d,i){

            svg.selectAll(".layer")
                .transition()
                .duration(250)
                .attr({
                    "opacity": function(d, j) {
                        return j != i ? 0.4 : 1;
                    },
                    "stroke": strokecolor,
                    "stroke-width": function(d, j) {
                        return j === i ? 0.5 : 0;
                    }

                });
        })
        .on("mouseout", function(d, i) {
            svg.selectAll(".layer")
                .transition()
                .duration(250)
                .attr({"opacity": "1","stroke-width":0});
            d3.select(this)
                .classed("hover", false)
                .attr("stroke-width", "0px");
            /*tooltip.style({display: 'none'});*/
        });

    nodes
        .append('span')
        .classed('colorBlk',true)
        .style({'background': function(d,i) {
            return z(i);
        }});

    nodes
        .append('span')
        .attr('class', 'txt')
        .text(function(d){
            return d.key;
        })
;

        if(axis.x == true) {

            var x_axis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - margin.top) + ")")
                .call(xAxis)
            ;
/*            var
                tickArr = yAxis.ticks(4),
                tickSize = yAxis(tickArr[tickArr.length - 1]) - yAxis(tickArr[tickArr.length - 2])
            ;
            console.log(tickSize);*/

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
        }

        if(axis.y == true) {
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis.orient("left"))
            ;
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

        }
        svg.selectAll(".layer")
            .attr("opacity", 1)
            .on("mouseover", function(d, i) {
                svg.selectAll(".layer").transition()
                    .duration(250)
                    .attr("opacity", function(d, j) {
                        return j != i ? 0.4 : 1;
                    })})

            .on("mousemove", function(d, i) {

                d3.select(this)
                    .classed("hover", true)
                    .attr("stroke", strokecolor)
                    .attr("stroke-width", "0.5px");

                mouse = d3.mouse(this);
                showTooltip(d,i,mouse,dataKeys);

            })
            .on("mouseout", function(d, i) {
                svg.selectAll(".layer")
                    .transition()
                    .duration(250)
                    .attr("opacity", "1");
                d3.select(this)
                    .classed("hover", false)
                    .attr("stroke-width", "0px");
                tooltip.style({'display':'none'});
            });

    /*});*/
}