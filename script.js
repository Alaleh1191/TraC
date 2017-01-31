var margin = {left:20, top:20, right:20, bottom:20},
	width = Math.max( Math.min(window.innerWidth, 1100) - margin.left - margin.right - 20, 600),
    height = Math.max( Math.min(window.innerHeight - 250, 900) - margin.top - margin.bottom - 20, 600),
    innerRadius = Math.min(width * 0.50, height * .50),
    outerRadius = innerRadius * 1.05;
	
//Recalculate the width and height now that we know the radius
width = outerRadius * 2 + margin.right + margin.left;
height = outerRadius * 2 + margin.top + margin.bottom;
	
//Reset the overall font size
var newFontSize = Math.min(70, Math.max(40, innerRadius * 62.5 / 250));
d3.select("html").style("font-size", newFontSize + "%");

////////////////////////////////////////////////////////////
////////////////// Set-up Chord parameters /////////////////
////////////////////////////////////////////////////////////
	
var pullOutSize = 20 + 30/135 * innerRadius;
var numFormat = d3.format(",.0f");
var defaultOpacity = 0.85,
	fadeOpacity = 0.075;
						
var loom = loom()
    .padAngle(0.05)
	.emptyPerc(0)//0.2 alaleh
	.widthOffsetInner(0)
	.value(function(d) { return d.size; })
	.inner(function(d) { return d.probe; })
	.outer(function(d) { return d.SpliceVariant; });

var arc = d3.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

var string = string()
    .radius(innerRadius)
	.pullout(0);//pulloutsize alaleh



////////////////////////////////////////////////////////////
///////////////////// Read in data /////////////////////////
////////////////////////////////////////////////////////////

function drawChord(chord, probe){
var svg = d3.select("#sv-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

////////////////////////////////////////////////////////////
//////////////////// Character notes ///////////////////////
////////////////////////////////////////////////////////////
	
/*var characterNotes = [];
characterNotes["Gandalf"] = "Speaking almost twice as many words as the second most abundant speaker, Gandalf is taking up a large portion of dialogue in almost every location he's in, but stays rather quiet in Mordor";
characterNotes["Sam"] = "An unexpected runner up to having spoken the most words, Sam flourishes after the battle at Amon Hen, taking up a considerable portion of the words said in both Mordor and Gondor";
characterNotes["Aragorn"] = "Although eventually being crowned in Minas Tirith, Gondor, Aragorn is by far most talkative in that other human region, Rohan, fighting a battle at Helm's Deep and convincing an army of dead";
characterNotes["Frodo"] = "Frodo seems most comfortable speaking in the Shire, (mostly) when still an innocent youth, but he feels the burden of the ring increasingly towards the end and leaves the talking to his best friend Sam";
characterNotes["Gimli"] = "Gimli is a quiet character at practically all locations until he reaches Rohan, where he speaks almost half of all his lines";
characterNotes["Pippin"] = "Like Merry, Pippin is also seen saying something at all locations, but his presence is mostly felt when he sings his song in Minas Tirith, serving the steward of Gondor, Denethor";
characterNotes["Merry"] = "Merry manages to say an average sentence worth of words at all locations, but is most active during his time with Treebeard in Fangorn forest and bonding with Eowyn in Rohan";
characterNotes["Boromir"] = "Boromir speaks his finest lines during the march up Caradhras in the Misty Mountains and right before the Uruk-hai battle at Amon Hen, Parth Galen, taking up a large portion of the total number of words spoken at those locations";
characterNotes["Legolas"] = "Although a very memorable presence throughout the movies, Legolas speaks even less in 3 movies than Boromir, who is alive in only the first movie";
*/
////////////////////////////////////////////////////////////
////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////

//testing


			


			
//d3.json('lotr_words_location.json', function (error, dataAgg) {

	////////// testing ////////////
	var svg2 = d3.select("svg"),
	    diameter = +svg2.attr("width") - 450;
	    




	////////////////////////////////////////////////////////////
	///////////////////// Prepare the data /////////////////////
	////////////////////////////////////////////////////////////
	
	//Sort the inner characters based on the total number of words spoken
	
	//Find the total number of words per character
	var dataChar = d3.nest()
		.key(function(d) { return d.probe; })
		.rollup(function(leaves) { return d3.sum(leaves, function(d) { return d.size; }); })
		.entries(chord)
		.sort(function(a, b){ return d3.descending(a.value, b.value); });	//no clue			
	//Unflatten the result
	var characterOrder = dataChar.map(function(d) { return d.key; });
	//Sort the characters on a specific order
	function sortCharacter(a, b) {
	  	return characterOrder.indexOf(a) - characterOrder.indexOf(b);
	}//sortCharacter
	
	//Set more loom functions
	loom
		.sortSubgroups(sortCharacter)
		.heightInner(innerRadius*0.75/characterOrder.length);
	
	////////////////////////////////////////////////////////////
	///////////////////////// Colors ///////////////////////////
	////////////////////////////////////////////////////////////"#5a3511", "#47635f",   "#223e15", "#C6CAC9", "#0d1e25",  "#53821a",    "#4387AA",         "#770000", "#373F41", "#602317",     "#8D9413",   "#c17924", "#3C7E16"
					
	//Color for the unique locations
	var locations = [$( "input[name='name"+1+"']" ).val(), $( "input[name='name"+2+"']" ).val(), $( "input[name='name"+3+"']" ).val(), $( "input[name='name"+4+"']" ).val(),  $( "input[name='name"+5+"']" ).val(), $( "input[name='name"+6+"']" ).val(), $( "input[name='name"+7+"']" ).val(), $( "input[name='name"+8+"']" ).val(),  $( "input[name='name"+9+"']" ).val(), $( "input[name='name"+10+"']" ).val(), $( "input[name='name"+11+"']" ).val(), $( "input[name='name"+12+"']" ).val(), $( "input[name='name"+13+"']" ).val(), $( "input[name='name"+14+"']" ).val(), $( "input[name='name"+15+"']" ).val(), $( "input[name='name"+16+"']" ).val(), $( "input[name='name"+17+"']" ).val()];
	//var colors = ["#FE7351", "#38BEB7","#FBA89A", "#DBE380", "#FE6C5F", "#EBF39E", "#ECE8DD", "#D8F5F0" , "#1395B5" , "#14D9C8" , "#D7E643" , "#CEEBFB" , "#E5726B", "#EA706F" , "#CFCA6F", "#F1E64E", "#FFD2C3"];
	var colors = [ "#1395B5", "#FE7351","rgb(130, 195, 53)",  "#EA706F" ,  "#F1E64E", "#B3AEB2", "#14D9C8" , "rgb(154, 4, 4)", "rgb(49, 152, 206)", "rgb(62, 165, 5)", "#D7E643", "#7486c3", "rgb(64, 135, 24)","#FE6C5F", "#F1E64E", "#98B914",];
	var color = d3.scaleOrdinal()
    	.domain(locations)
    	.range(colors);
	


	//Create a group that already holds the data
	var g = svg.append("g")
	    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
		.datum(loom(chord));	


		// creating packed circles
	//g2 = g.append("g").attr("transform", "translate(-129,-129)");

	var pack = d3.pack()
	    .size([diameter-4, diameter-4])
	    .padding(2);



	//d3.json("flare.json", function(error, root) {
		//if (error) throw error;
		 
	  	root = d3.hierarchy(probe)
		    .sum(function(d) { return d.size; })
		    .sort(function(a, b) { return b.value - a.value; });

		


	    var arr = [];
	    var circlePackData = pack(root).descendants();



	    for(var i = 0; i < circlePackData.length; i++){
	    	if(circlePackData[i].data.name != null){
	    	//	console.log(circlePackData[i].data.name)
	    	//	console.log(circlePackData[i].y)
	    		arr.push({
			        x: circlePackData[i].x - 129,
			        y: circlePackData[i].y - 129,
			        r: circlePackData[i].r,
			        name: circlePackData[i].data.name
			    });
	    	}
	    }

	//    console.log(arr);

////////////////////////////////////////////////////////////
	////////////////// Draw inner strings //////////////////////
	////////////////////////////////////////////////////////////
	var inner;
//	console.log(g);
	var strings = g.append("g")
	    .attr("class", "stringWrapper")
		.style("isolation", "isolate")
	  	.selectAll("path")
	    .data(function(strings) { 

	    //	console.log(strings);
	    	for(var i = 0; i<strings.length; i++){
	    		//console.log(strings[i].inner)
	    		inner = arr.find(x => x.name === strings[i].inner.name)
	    	//	console.log(arr.find(x => x.name === strings[i].inner.name))
	    		strings[i].inner = arr.find(x => x.name === strings[i].inner.name);

	    	}
	    	console.log(strings);
			return strings; 
		})
	  	.enter().append("path")
		.attr("class", "string")
		.style("mix-blend-mode", "multiply")
	    .attr("d", string)
	    .style("fill", function(d) { return d3.rgb( color(d.outer.outername) ).brighter(0.2) ; })
		.style("opacity", defaultOpacity);


		var node = g.selectAll(".node")
		    .data(pack(root).descendants())
		    .enter().append("g")
		    .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
		    .attr("transform", function(d) { return "translate(" + (d.x - 129) + "," + (d.y -129) + ")"; });


	//	node.append("circle")
	  //  	.attr("r", function(d) { return d.r; });


	    //////testttttinnnnggggg//////
	   	var innerLabels = g.append("g")
		//.attr("class","inner-labels")
	  	.selectAll("text")
	   // .data(function(s) { 
	    //	console.log(s.innergroups);
		//	return s.innergroups; 
		//})
		.data(arr)
		//.data(pack(root).descendants())
	  	.enter()
	  	//commented alaleh
	  	//.append("text")
		//.attr("class", "inner-label")
		//.attr("x", function(d,i) { return d.x; })
		//.attr("y", function(d,i) { return d.y; })
		//.style("text-anchor", "middle")
		//.attr("dy", ".35em")
	    //.text(function(d,i) { return d.name; })
	    .append("circle")
	  	.attr("class","inner-labels")
	    .attr("cx",function(d,i) { return d.x; })
	    .attr("cy", function(d,i) { return d.y; })
	    .attr("r",function(d,i) { return d.r; })
	    //.style("opacity","0")
 	 	.on("mouseover", function(d) {
			
			//Show all the strings of the highlighted character and hide all else
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) {
					return s.outer.innername !== d.name ? fadeOpacity : 1;
				});

			//d3.select("#title").html("Probe: "+ d.name);

			d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", function(s) {
		        	console.log(s.name)
		        	console.log(d.name)
					return s.name == d.name ? 1: fadeOpacity;// : 1;
				});
				
			//Update the word count of the outer labels
			var characterData = loom(chord).filter(function(s) { return s.outer.innername === d.name; });
			d3.selectAll(".outer-label-value")
				.text(function(s,i){
					//Find which characterData is the correct one based on location
					var loc = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					if(loc.length === 0) {
						var value = 0;
					} else {
						var value = loc[0].outer.value;
					}
					return numFormat(value) + (value === 1 ? " word" : " words"); 
					
				});
			
			//Hide the arc where the character hasn't said a thing
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", function(s) {
					//Find which characterData is the correct one based on location
					var loc = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					return loc.length === 0 ? 0.1 : 1;
				});


					
			//Update the title to show the total word count of the character
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 1);	
			d3.select(".name-title")
				.text(d.name);
			d3.select(".value-title")
				.text(function() {
					var words = dataChar.filter(function(s) { return s.key === d.name; });
					return numFormat(words[0].value);
				});
				
			//Show the character note
			/*d3.selectAll(".character-note")
				.text(characterNotes[d.name])
				.call(wrap, 2.25*pullOutSize);*/
				
		})
		.on("click", function(d) {
			d3.select("#title").html("Probe: "+ d.name);
			displayLocation(d.name);
		})
     	.on("mouseout", function(d) {
			
     		d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", 1);


		   // d3.select("#title").html(" ");


			//Put the string opacity back to normal
		    d3.selectAll(".string")
		      	.transition()
				.style("opacity", defaultOpacity);
				
			//Return the word count to what it was
			d3.selectAll(".outer-label-value")	
				.text(function(s,i){ return numFormat(s.value) + " words"; });
				
			//Show all arcs again
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", 1);
			
			//Hide the title
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 0);
			
		});


 		var arcs = g.append("g")
	    .attr("class", "arcs")
	  .selectAll("g")
	    .data(function(s) { 
			return s.groups; 
		})
	  .enter().append("g")
		.attr("class", "arc-wrapper")
	  //	.each(function(d) { 
		//	d.pullOutSize = (pullOutSize * ( d.startAngle > Math.PI + 1e-2 ? -1 : 1)) 
		//}) // alaleh
 	 	.on("mouseover", function(d) {

 	 		//Find the data for the strings of the hovered over location
			var locationData = loom(chord).filter(function(s) { return s.outer.outername === d.outername; });
 	 		d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", function(s) {
		        	console.log(s.name)
		        	console.log(d)
		        	console.log(s)
		        	console.log(d.outername)
					//return s.name == d.name ? 1: fadeOpacity;// : 1;

					var char = locationData.filter(function(c) { return c.outer.innername === s.name; });
					return char.length === 0 ? 0.1 : 1;


				});
			
			//Hide all other arcs	
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", function(s) {
					//console.log(s);
				 	return s.outername === d.outername ? 1 : 0.5; 
				 });
			
			//Hide all other strings
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) { return s.outer.outername === d.outername ? 1 : fadeOpacity; });
				
			
			//Hide the characters who haven't said a word
			d3.selectAll(".inner-label")
		      	.transition()
		        .style("opacity", function(s) {

					//Find out how many words the character said at the hovered over location
					var char = locationData.filter(function(c) { return c.outer.innername === s.name; });
					return char.length === 0 ? 0.1 : 1;
				});
 	 	})
     	.on("mouseout", function(d) {

     		d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", 1);


			
			//Sjow all arc labels
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", 1);
			
			//Show all strings again
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", defaultOpacity);
				
			//Show all characters again
			d3.selectAll(".inner-label")
		      	.transition()
		        .style("opacity", 1);
 	 	});


     	var outerArcs = arcs.append("path")
		.attr("class", "arc")
	    .style("fill", function(d) { return color(d.outername); })
	    .attr("d", arc)
		//.attr("transform", function(d, i) { //Pull the two slices apart
		//  	return "translate(" + d.pullOutSize + ',' + 0 + ")";
		 //}); alaleh


	//});


	

	
		 					
	////////////////////////////////////////////////////////////
	//////////////////// Draw outer labels /////////////////////
	////////////////////////////////////////////////////////////

	//The text needs to be rotated with the offset in the clockwise direction
	var outerLabels = arcs.append("g")
		.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2); })
		.attr("class", "outer-labels")
		.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		.attr("transform", function(d,i) { 
			console.log("angle"+ d.angle)
			var c = arc.centroid(d);
			console.log("c");
			var rotate, translate;
			console.log(c);
			if (d.angle * 180 / Math.PI  < 180){
				rotate = d.angle * 180 / Math.PI;  
				translate = -20;
			}
			else {
				rotate = d.angle * 180 / Math.PI -180;
				translate = 20;
			}
				
			d.pullOutSize = 0
			return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
			+ "rotate(" + rotate +")"// - 90
			+ "translate(0,"+translate+")"//26, 0
			+ (d.angle > Math.PI ? "rotate(180)" : "")
		})
		
	//The outer name
	outerLabels.append("text")
		.attr("class", "outer-label")
		.attr("dy", ".35em")
		.text(function(d,i){ return d.outername; });
		
	//The value below it
	/*outerLabels.append("text")
		.attr("class", "outer-label-value")
		.attr("dy", "1.5em")
		.text(function(d,i){ return numFormat(d.value); });*/

	
		
	
	  		
//});//d3.csv

}


////////////////////////////////////////////////////////////
///////////////////// Extra functions //////////////////////
////////////////////////////////////////////////////////////

//Display where the probe is located relative to the transcript 
function displayLocation(name){
	$( ".probe" ).remove();

	var spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	//var orgSplice = spliceVariants
	console.log(spliceVariants);
	var longestSeq = spliceVariants.sort(function (a, b) { return b.length - a.length; })[0];
	console.log("longest" + longestSeq.length);

	spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var xScale = d3.scaleLinear()//scaleLinear v4
        .domain(
         	[0,longestSeq.length]
        )
        .range([0,580]);

	var yloc = 10;
	for(var i = 0; i < spliceVariants.length; i++){
		
		if(spliceVariants[i].indexOf(name) != -1){// if transcript contains the desired probe
			// for loop find all matches
			var indices = indexes(spliceVariants[i],name);
			for(j = 0; j < indices.length; j++){
				d3.select("#svgT").append("rect")
				            .attr("x", xScale(indices[j]))//spliceVariants[i].indexOf(name)
				            .attr("y", yloc)
				            .attr("width", xScale(name.length))
				            .attr("height", 20)
				            .attr("class", "probe")
							.attr("fill", "rgb(228, 75, 75)");
			}

			
		}
		yloc += 30;
	}
}

// find occurences of probe in a transcript
function indexes(str, find) {
  var regex = new RegExp(find, "g")
  ,   result
  ,   indices = [];
  while ((result = regex.exec(str))) {
    indices.push(result.index);
  }
  return indices;
}



//Sort alphabetically
function sortAlpha(a, b){
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
}//sortAlpha

//Sort on the number of words
function sortWords(a, b){
	    if(a.words < b.words) return -1;
	    if(a.words > b.words) return 1;
	    return 0;
}//sortWords

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrap(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.2, // ems
		y = parseFloat(text.attr("y")),
		x = parseFloat(text.attr("x")),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrap