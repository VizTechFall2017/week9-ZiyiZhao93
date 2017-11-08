var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up the projection for the map
var albersProjection = d3.geoAlbersUsa()  //tell it which projection to use
    .scale(700)                           //tell it how big the map should be
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels


var symbolPoints = [
    {angle: 0, r0: 30, r1: 80},
    {angle: Math.PI * 0.25, r0: 30, r1: 70},
    {angle: Math.PI * 0.5, r0: 30, r1: 80},
    {angle: Math.PI * 0.75, r0: 30, r1: 70},
    {angle: Math.PI, r0: 30, r1: 80},
    {angle: Math.PI * 1.25, r0: 30, r1: 70},
    {angle: Math.PI * 1.5, r0: 30, r1: 80},
    {angle: Math.PI * 1.75, r0: 30, r1: 70},
    {angle: Math.PI * 2, r0: 30, r1: 80}
];

var makeSymbol = d3.radialArea()
    .angle(function(d) {
        return d.angle;
    })
    .innerRadius(function(d) {
        return d.r0;
    })
    .outerRadius(function(d) {
        return d.r1;
    });

var symbolData = makeSymbol(symbolPoints);


queue()
    .defer(d3.json, "./cb_2016_us_state_20m.json")
    .defer(d3.csv, "./dataPoints.csv")
    .await(function(err, mapData, dataPoints){

    svg.selectAll("path")               //make empty selection
        .data(mapData.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "feature")
        .attr('fill','gainsboro')
        .attr('stroke','white')
        .attr('stroke-width',.2);



    symbol = svg.selectAll('.symbolGroups')
        .data(dataPoints)       //bind a single data point, with the long lat of Boston
                                                    //note that long is negative because it is a W long point!
        .enter()
        .append('g')
        .attr('class','symbolGroups')
        .attr('transform', function(d){
            return 'translate('+ albersProjection([d.long, d.lat])[0] +','+ albersProjection([d.long, d.lat])[1] +')'
        });

    symbol.append('path')
        .attr('d',symbolData)
        .attr('fill','purple')
        .attr('transform','scale(.1)');


  });



