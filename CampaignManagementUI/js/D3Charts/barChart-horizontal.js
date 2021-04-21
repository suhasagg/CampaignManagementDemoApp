function barChartHorizontal(obj) {
    var
        dimensions = obj.dimensions,
        data = obj.data,
        chartPlaceHolder = d3.select("#"+obj.targetID+" .svgBlock"),
        margin = {top: 20, right: 20, bottom: 20, left: 20},
        axis = obj.axis,
        axisXkey=axis.axisXkey,
        axisYkey=axis.axisYkey,
        subChartDataField = obj.subChartDataField,
        commonService = obj.commonService,

        scaleDetails = obj.axis.scaleDetails || {},
        division = scaleDetails.division
    ;
        data = commonService.setDivision({
            data : data,
            divKey : axisXkey,
            division : division
        })
        ;


    if(!!obj.margin){
        margin = obj.margin;
    }

    var
        toTitleCase =   commonService.toTitleCase,
        width = parseInt(chartPlaceHolder[0][0].offsetWidth * parseInt(dimensions.width)/100) - margin.left - margin.right,
        height = width * parseInt(dimensions.height)/100 - margin.top - margin.bottom,
        minWidth = dimensions.minWidth,
        minHeight
    ;

    width = (width > minWidth) ? width : minWidth;
    if(commonService.isHandHeldDevice()) {
        minHeight = width * parseInt(dimensions.minHeight) / 100;
        height = (height > minHeight) ? height : minHeight;
    }

    var
        tooltip = commonService.tooltip(),
        z = d3.scale.category10(),
        chart = document.getElementById(obj.targetID),
        axisMargin = 20,
        valueMargin = 4,
        barHeight = (height - axisMargin*2 ) * 0.8 / data.length,
        barPadding = (height - axisMargin*2 ) * 0.2 / data.length,
        bar, svg, scale, xAxis, labelWidth = 0,
        max = d3.max(data.map(function (d) {
        return d[axisXkey];
    }));

    svg = chartPlaceHolder
        .append('div').classed('svgBlock',true)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
    ;
    var scaleTxt = (!!scaleDetails.numberScale) ? " (In "+scaleDetails.numberScale+")" : "";

    bar = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g");

    bar.attr("class", "bar")
        .attr("transform", function (d, i) {
            return "translate(" + (margin.left +5 ) + "," + (i * (barHeight + barPadding) ) + ")";
        })
        .style('fill',function(d,i){
            return z(i);
        })
        .on("mousemove",function(d) {
            commonService.positionTooltip();
            tooltip.html(function () {
                return "<span>"+axis.xLabel+": </span><strong>" + d[axisXkey] + scaleTxt + "</strong></br>" +
                    "<span>"+axis.yLabel+": </span><strong>" + d[axisYkey]  + "</strong></br>"
                    ;
            })
        })
        .on("mouseout",function(d) {
            tooltip.style('display','none');
        });


        bar.on("click",function(d){
            if(!!subChartDataField) {
                var pieData;
                if(d[subChartDataField].length === 0){
/*                    pieData =[{
                        audience_segment: d.audience_segment,
                        percent: '100%',
                        impressions: (d.impressions*division)
                    }];*/
                    pieData=[];
                    pieData[0]={};
                    pieData[0][axisXkey] = d[axisXkey];
                    pieData[0][axisYkey] = d[axisYkey];
                    pieData[0].percent = '100%';

                } else {

                    pieData = d[subChartDataField];
                    pieData.forEach(function(e) {
                        d[axisXkey] = +d[axisXkey];
                        e[axisXkey] = +e[axisXkey];
                        e.percent = (((e[axisXkey]/division) / d[axisXkey]) * 100).toFixed(2)+'%';
                    });
                }
                //pieData = commonService.sortData(pieData,axisXkey).reverse();

                angular.element(document.getElementById('charts')).scope()
                    .loadChart('subPieChart', {
                        data: pieData,
                        title : d[axisYkey]
                    });
            }
        });

    bar.append("text")
        .text(function (d) {
            return toTitleCase(d[axisYkey]);
        })
        .style({'font-size':'11px','fill':'#555'})
        .attr("text-anchor", "end")
        .each(function () {
            labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
        })
        .attr("class", "value")
        .attr("y", barHeight / 2)
        .attr("dx", (valueMargin * -2) + labelWidth) //margin right
        .attr("dy", ".35em") //vertical align middle
        .attr("x", 0);

    scale = d3.scale.linear()
        .domain([0, max])
        .range([0, width - margin.left  - labelWidth])
    ;


    xAxis = d3.svg.axis()
        .scale(scale)
        .orient('bottom')
    ;

    svg.append("text")
        .attr("transform", "translate(" + (width /2) + " ," + (height +25) + ")")
        .style("text-anchor", "middle")
        .text(axis.xLabel);

    if(!!scaleDetails.numberScale) {
        svg.append("text")
            .attr("transform", "translate(" + (width /2) + " ," + (height +20) + ")")
            .style({"text-anchor": "middle", "font-size":'11px'})
            .text(scaleTxt)
        ;
    }



    var y = d3.scale.linear().range([(height - margin.top), 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
    ;

    var YAxis = svg.append("g",":first-child")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(" + (labelWidth + margin.left) + ", 0)");

    YAxis.selectAll('text')
        .text("");


    bar.append("rect")
        .attr("transform", "translate(" + labelWidth + ", 0)")
        .attr("height", barHeight)
        .attr("width", function (d) {
            return scale(d[axisXkey]);
        });

    var x_Axis = svg.insert("g", ":first-child")
        .attr("class", "axis")
        .attr("transform", "translate(" + (margin.left + labelWidth) + "," + (height-margin.top) + ")")
        .call(xAxis)
    ;


    x_Axis.selectAll('text')
        .attr('transform','rotate(-45)')
        .attr('x',-10)
        .attr('y',0)
        .style('text-anchor','end')
    ;


}