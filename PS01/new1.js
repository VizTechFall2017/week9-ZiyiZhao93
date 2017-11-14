var width = document.getElementById('svg1','svg2','svg3').clientWidth;
var height = document.getElementById('svg1','svg2','svg3').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var nestedData = [];

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg3 = d3.select('#svg3')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');


var albersProjection = d3.geoAlbers()
    .scale(90000)//tell it how big the map should be
    .rotate( [71.057,0] )
    .center( [0, 42.313] ) //FIND CENTER POINT LAT/LONG VALUE OF MASSACHUSETTS
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels

var cityLookup = d3.map();

var colorScale = d3.scaleLinear().range(['orange','orange']);

var scaleX = d3.scaleBand().rangeRound([0, width-2*marginLeft]).padding(0.5);
var scaleY = d3.scaleLinear().range([height-2*marginTop, 0]);


queue()
    .defer(d3.json, "./boston1.json")
    .defer(d3.csv, "./subway.csv")
    .await(function(err, mapData, populationData){


        populationData.forEach(function(d){
            cityLookup.set(d.name, d.population);
        });


        colorScale.domain([0, d3.max(populationData.map(function(d){return +d.population}))]);

        svg.selectAll("path")               //make empty selection
            .data(mapData.features)          //bind to the features array in the map data
            .enter()
            .append("path")                 //add the paths to the DOM
            .attr("d", path)                //actually draw them
            .attr("class", "feature")
            .attr('fill',function(d){
                return colorScale(cityLookup.get(d.properties.NAME));
            })
            .attr('stroke','white')
            .attr('stroke-width',.2)
            .on('mouseover',function (d) {
                d3.select(this).attr('fill','yellow');
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('fill', function (d) {
                    return colorScale(cityLookup.get(d.properties.NAME));
                })
            })

    });


queue()
    .defer(d3.json, "./subway.json")
    .defer(d3.csv, "./subway.csv")
    .await(function(err, mapData, populationData) {



        svg2.selectAll("path")               //make empty selection
            .data(mapData.features)          //bind to the features array in the map data
            .enter()
            .append("path")                 //add the paths to the DOM
            .attr("d", path)                //actually draw them
            .attr("class", "feature")
            .attr('stroke', 'black')
            .attr('stroke-width', .2);

    });






d3.csv('./subway.csv', function(dataIn) {

    nestedData = d3.nest()
        .key(function(d){return d.gender})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == 'total'})[0].values;

    svg.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,'+ (height-2*marginTop) +')')
        .call(d3.axisBottom(scaleX));

    svg.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY));

    drawPoints(loadData);

});

function drawPoints(pointData){


    scaleX.domain(pointData.map(function(d){return d.things;}));
    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.number}))]);


    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));


    var rects = svg.selectAll('.bars')
        .data(pointData, function(d){return d.things;});

    console.log(pointData);

    rects
        .transition()
        .duration(200)
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY(+d.number);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(+d.number);
        });

    rects
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill', "mediumslateblue")
        .attr('id',function (d) {return d.things})
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY(+d.number);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(+d.number);
        })

}

function updateData(selectedGender){
    return nestedData.filter(function(d){return d.key == 'total'})[0].values;
}


function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}

