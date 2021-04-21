function pieChart(obj) {
 //debugger;
    var
        dimensions = obj.dimensions,
        viewScope = obj.viewScope,
        commonService = obj.commonService,
        scaleDetails=obj.axis.scaleDetails,
        division = scaleDetails.division,
        axis = obj.axis,
        axisXkey=axis.axisXkey,
        axisYkey=axis.axisYkey,
        data = commonService.setDivision({
            data : commonService.sortData(obj.data, axisYkey).reverse(),
            divKey : axisYkey,
            division : division
        }),
        strokecolor = '#fff',
        chartPlaceHolder = d3.select("#"+obj.targetID+" .svgBlock"),
        margin = {top: 20, right: 20, bottom: 20, left: 20},

        subChartDataField = obj.subChartDataField,
        z = d3.scale.category10()
    ; 

    if(!!obj.margin){
        margin = obj.margin;
    }
    var
        width = parseInt(chartPlaceHolder[0][0].offsetWidth * parseInt(dimensions.width)/100) - margin.left - margin.right,
        height = width * parseInt(dimensions.height)/100 - margin.top - margin.bottom,
        tooltip = commonService.tooltip()
    ;

    var radius = Math.min(width, height) / 2;

    var color = d3.scale.category10();

    var pie = d3.layout.pie()
        .value(function (d) {
            return d[axisYkey];
        })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 10);

    var svg = chartPlaceHolder.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var chartTtl = data[0][axisXkey].split("/")[1];
    chartTtl = (!!chartTtl) ? chartTtl : data[0][axisXkey];

    chartPlaceHolder.insert('h3',':first-child').text(obj.title);
    /*d3.tsv("data.tsv", type, function (error, data) {*/

        var path = svg.datum(data)
            .selectAll("path")
            .data(pie)
            .enter().append("path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", arc)
            .attr("class", 'arc')
            .on("mousemove",function(d) {
                commonService.positionTooltip();

                tooltip.html(function () {
                    var scaleTxt = (!!scaleDetails.numberScale) ? "( In "+scaleDetails.numberScale+" )" : "";
                    return "<span>"+axis.xLabel+" :</span><strong>" + d.data[axisXkey]  + "</strong></br>" +
                        "<span>"+axis.yLabel+" :</span><strong>" + d.data[axisYkey]  +scaleTxt + "</strong></br>"+
                        "<span>Percentage :</span><strong>" + d.data['percent']  + "</strong></br>"
                        ;
                });
            })
            .on("mouseover",function(d,i){
                svg.selectAll(".arc")
                    .transition()
                    .duration(250)
                    .attr("opacity", function(d, j) {
                        return j != i ? 0.6 : 1;
                });
            })
            .on("mouseout",function(d,i){
                svg.selectAll(".arc")
                    .transition()
                    .duration(250)
                    .attr("opacity", "1");
                tooltip.style('display','none');
            })
            ;

        var
            legendBlock
        ;

        if(!chartPlaceHolder.select('.legends')[0][0]){
            legendBlock = chartPlaceHolder.insert('div')
                .attr({'class':'legends'});
            /*.style({'height':outerHeight+'px'})*/
        } else {
            legendBlock = chartPlaceHolder.select('.legends');
            legendBlock.html("");
        }

    var nodes = legendBlock.selectAll('div')
        .data(data)
        .enter()
        .append('div')
        .attr({'class':'legend'})
        .on("mouseover",function(d,i){

            svg.selectAll(".arc")
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
            svg.selectAll(".arc")
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
                var txt = d[axisXkey].split('/');
                return txt[txt.length-1]+' ('+d.percent+')';
            });


  /*  });*/

}