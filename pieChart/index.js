var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

var marginLeft = 100;
var marginTop = 100;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var pieX = width/2 - marginLeft;
var pieY = height/2 - marginTop;

var pieGroup = svg.append('g')
    .attr('transform', 'translate(' + pieX + ',' + pieY + ')');


//set up scales to position circles using the data
var scaleColor = d3.scaleOrdinal().domain(["16-19", "20-24", "25-34", "35-44", "45-54", "55-64","65+"])
    .range(['red','yellow','orange','green','blue','purple','pink']);

var nestedData = [];

var pieRadius = 200;

var makeArc = d3.arc()
    .innerRadius(50)
    .outerRadius(pieRadius);

var labelArc = d3.arc()
    .outerRadius(pieRadius - 100)
    .innerRadius(pieRadius - 50);

var makePie = d3.pie()
    .sort(null)
    .value(function(d){return d.total});


d3.csv('./incomeData.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = dataIn;

    svg.append('text')
        .text('Total income by age')
        .attr('transform','translate(300, -20)')
        .style('text-anchor','middle');


    // make a group for each arc, which will contain the path for the arc
    var g = pieGroup.selectAll('.arc')
        .data(makePie(loadData))   //makePie makes sure that one arc gets added for each data object in the array
        .enter()
        .append('g')
        .attr('class','arc');

    g.append('path')              //grab each group in the variable above, and add a path to it (this will be the pie wedge)
        .attr('d',makeArc)        //call the makeArc generator function to draw the actual wedges
        .attr('fill', function(d){ return scaleColor(d.data.age)});   //give the wedges a color, based on their d.age values


    g.append("text")
        .attr("transform", function(d) {return "translate(" + labelArc.centroid(d) + ")"})
        .attr("dy", ".35em")
        .attr('text-anchor','middle')
        .text(function(d) { return d.data.age});
});



