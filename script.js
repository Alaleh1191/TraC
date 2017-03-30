//iCheck radio button
$(document).ready(function(){
  	$('input').iCheck({
	    checkboxClass: 'icheckbox_flat-blue',
	    radioClass: 'iradio_flat-blue'
  	});
});

numberOfSV = 3;

//Draw tracks 
function displayTranscripts(){
	$("#title").css("display","block");
	$("#probeLoc").empty();

	var spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var longestSeq = spliceVariants.sort(function (a, b) { return b.length - a.length; })[0];

	spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var xScale = d3.scaleLinear()//scaleLinear v4
        .domain(
         	[0,longestSeq.length]
        )
        .range([0,580]);

	var height = spliceVariants.length * 30 + 20;

    var svg = d3.select("#probeLoc")
			.append("svg")
			.attr("id", "svgT")
			.attr("width", "700px")
			.attr("class" , "svg")
			.attr("height", height)
			.append("g")
		  	.append("g")
		  	.attr("class", "g");


	//Color for the unique transcripts
	var transcripts = [$( "input[name='name"+1+"']" ).val(), $( "input[name='name"+2+"']" ).val(), $( "input[name='name"+3+"']" ).val(), $( "input[name='name"+4+"']" ).val(),  $( "input[name='name"+5+"']" ).val(), $( "input[name='name"+6+"']" ).val(), $( "input[name='name"+7+"']" ).val(), $( "input[name='name"+8+"']" ).val(),  $( "input[name='name"+9+"']" ).val(), $( "input[name='name"+10+"']" ).val(), $( "input[name='name"+11+"']" ).val(), $( "input[name='name"+12+"']" ).val(), $( "input[name='name"+13+"']" ).val(), $( "input[name='name"+14+"']" ).val(), $( "input[name='name"+15+"']" ).val(), $( "input[name='name"+16+"']" ).val(), $( "input[name='name"+17+"']" ).val()];
	var colors = [ "#1395B5", "#FE7351","rgb(130, 195, 53)",  "#EA706F" ,  "#F1E64E", "#B3AEB2", "#14D9C8" , "rgb(154, 4, 4)", "rgb(49, 152, 206)", "rgb(62, 165, 5)", "#D7E643", "#7486c3", "rgb(64, 135, 24)","#FE6C5F", "#F1E64E", "#98B914",];
	var color = d3.scaleOrdinal()
    	.domain(transcripts)
    	.range(colors);

	svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", "700px")
	    .attr("height", height);

	var text = svg.append("g").attr("class", "text");
	var yloc = 10;

	for(var i = 0; i < spliceVariants.length; i++){
		var name = $( "input[name='name"+(i+1)+"']" ).val();
		svg.append("rect")
            .attr("x", 0)
            .attr("y", yloc)
            .attr("width", xScale(spliceVariants[i].length))
            .attr("height", 20)
            .style("opacity", 0.85)
			.attr("fill", color(name));

		// The name of the transcript
		d3.select(".svg").append("text")
			.attr("class", "vals")
			.attr("x", xScale(spliceVariants[i].length)+10)
            .attr("y", yloc+15)
            .text(name)
            .style("font-size", "17px")
            .style('pointer-events', 'none');

        yloc += 30;
    }
}

// Add a new splice variants with the given name and sequence
function addSV(name, sequence){
    if(name == null && sequence == null)
    {
        name = numberOfSV;
        sequence = '';
    }
    $("#SVs").append("<span class='"+numberOfSV+"'> Name: </span> <input type='text' name='name"+numberOfSV+"' class='"+numberOfSV+"' value='"+name+"' onfocus='onFocus(this)' onblur='onBlur(this)'> <span class='"+numberOfSV+"'> Sequence: </span><textarea class='SV "+numberOfSV+"' style='width: 525px;  height: 13px; margin-bottom: -5px'>"+sequence+"</textarea><span class="+numberOfSV+" style='margin-right: 4px;'></span><img class='del "+numberOfSV+"' onclick='removeSV(this)' src='x-button.png' alt='delete' height='19px' style='margin-bottom: -5px'> <br class='"+numberOfSV+"'/>")
    numberOfSV++;
}

// Default name of transcript
function onFocus(sv){
	if($( "input[name='name"+sv.className+"']" ).val()==sv.className) 
		$( "input[name='name"+sv.className+"']" ).val("");
}

// Default name of transcript
function onBlur(sv) {
	if($( "input[name='name"+sv.className+"']" ).val()=='')
		{$( "input[name='name"+sv.className+"']" ).val(sv.className);}
}

//Once pressed on x button, delete the corresponding transcript
function removeSV(sv){
	sv = sv.className;
	sv = sv.match(/\d+/)[0]; //get the number
	var remove = "."+sv
	$(remove).remove();
	while(sv < numberOfSV){
		sv++;
		var toggleClass = "."+ sv;
		var newClass = sv-1;
		if($( "input[name='name"+sv+"']" ).val() == sv){
			$( "input[name='name"+sv+"']" ).val(newClass);
		}
		$( "input[name='name"+sv+"']" ).attr("name", "name"+newClass)
		$(toggleClass).addClass(newClass.toString()).removeClass(sv.toString());
	}
	numberOfSV--;
}

/* Given an array of transcripts returns the probes shared among all the transcripts in 
given array */
function findProbes(sv){

	var spliceVariants = sv;
	var minLength = Number($("#minLength").val());

	var numVariants = spliceVariants.length;
	var sharePartnersPerSV = new Array(numVariants);
	var convergencehx = [1, 0]
	var numericSpliceVariants= new Array(numVariants);

	for(var i = 0; i < numVariants ; i++){
		numericSpliceVariants[i] = nucleotidesStrToVector(spliceVariants[i]);
	}
	
	var sharez = [];
	var sharedSequences = [];
	var sharedHolder = [];
	var merged = [];

	while(sharedSequences.length != 1){
		
		if(sharedSequences.length == 0){

			for(var i = 0; i < numericSpliceVariants.length - 1; i+=2) {

				sharez =  nucleotideSequenceCompare(numericSpliceVariants[i], numericSpliceVariants[i+1], minLength);
				merged = [].concat.apply([], sharez);
				
				if(sharez.length == 0) {
					return;

				} else {
					sharedSequences.push(merged);
				}
				
			}

			if((numericSpliceVariants.length%2) != 0){
				sharedSequences.push(numericSpliceVariants[numericSpliceVariants.length-1]);
			}

		} else {
			sharedHolder = sharedSequences;
			sharedSequences = [];
			for(var i = 0; i < sharedHolder.length - 1; i+=2){
				sharez = nucleotideSequenceCompare(sharedHolder[i], sharedHolder[i+1], minLength);
				merged = [].concat.apply([], sharez);
				if(sharez.length == 0) {
					return;

				}
				sharedSequences.push(merged);
			}

			if((sharedHolder.length%2) != 0){
				sharedSequences.push(sharedHolder[sharedHolder.length-1]);
			}
		}
	
	}
	var probe = [];
	var possProbe = [];
	sharedSequences = [].concat.apply([], sharedSequences);

	for(var i = 0; i<sharedSequences.length; i++) {
		if(sharedSequences[i] != 0){
			possProbe.push(sharedSequences[i]);
		} else {
			if(possProbe.length >= minLength){//not the largerst possProbe.length > probe.length
				probe.push(possProbe);
			}
			possProbe = [];
		}
	}
	

	var finalProbe = ""
	var finalProbes = [];
	for(var i = 0; i< probe.length; i++) {
		finalProbe = "";
		for(var j = 0; j<probe[i].length; j++){
			if(probe[i][j] == 1){
				finalProbe = finalProbe.concat("A");
			} else if(probe[i][j] == 2) {
				finalProbe = finalProbe.concat("C");
			} else if(probe[i][j] == 3) {
				finalProbe = finalProbe.concat("G");
			} else {
				finalProbe = finalProbe.concat("T");
			}
		}
		
		finalProbes.push(finalProbe);
	}
	finalProbes = finalProbes.filter( function( item, index, inputArray ) {
		           		return inputArray.indexOf(item) == index;
		    		});
	return finalProbes;
}

// Convert sequence to numbers
function nucleotidesStrToVector(inputStr){
	inputStr = inputStr.replace(/[a-z]/g, '');
	inputStr = inputStr.replace(/A/g, "1 ");
	inputStr = inputStr.replace(/C/g, "2 ");
	inputStr = inputStr.replace(/G/g, "3 ");
	inputStr = inputStr.replace(/T/g, "4 ");
	var output = inputStr.split(" ").map(Number);;
	output.pop();
	return output;
}

//Find different combinations and different shared sequences among each combination
function chordData(){

	$("#results").empty();
	$("#sv-chart").empty();

	var sequences = $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var arrComb = [];
	var arrSharedSeqs = [];

	

	//create an array of combinations (so far combinations of just 1 element)
	for (var i = 0; i < sequences.length - 1; i++) {
		arrComb.push([i]);
	}

	// create an array of shared sequences, so far just sequences
	for (var i = 0; i < sequences.length - 1; i++) {
		arrSharedSeqs.push([sequences[i]])
	}

	var newComb = [];
	var indexSeq = 0;
	var indexComb = 0;
	var minLength = Number($("#minLength").val());
	var probes, uniqueProbes = [], temp;
	while (indexComb < arrComb.length){
		var comb = arrComb[indexComb];
		var last = comb[comb.length - 1];
			for(var j = last+1; j < sequences.length; j++){
				probes = [];
				uniqueProbes = [];
				indexSeq = 0;
				while(indexSeq < arrSharedSeqs[indexComb].length){
					temp = findProbes([sequences[j], arrSharedSeqs[indexComb][indexSeq]]);
					
					if(temp == null){
						indexSeq++;
						continue;
					}
					probes = probes.concat(temp);
				
					if(temp.indexOf(arrSharedSeqs[indexComb][indexSeq]) != -1){
						arrSharedSeqs[indexComb].splice(indexSeq, 1);
					} else{
						indexSeq++;
					}
					
				}

				if(probes.length == 0){
					continue;
				}
				
				$.each(probes, function(i, el){
				    if($.inArray(el, uniqueProbes) === -1) uniqueProbes.push(el);
				});

				if(uniqueProbes.length != 0){
					arrSharedSeqs.push(uniqueProbes);
					newComb = comb.concat([j]);
					arrComb.push(newComb);
				}
			}
		if (arrSharedSeqs[indexComb].length == 0 || comb.length == 1) {
			arrComb.splice(indexComb, 1);
			arrSharedSeqs.splice(indexComb, 1);
		} else{
			indexComb++;
		}
				
	}

	makeJsonData(arrComb, arrSharedSeqs);
}

//Convert the shared probes among different splice variants into JSON format
function makeJsonData(combs, sharedSeqs){
	var length = true; 

	if($('input[name=weight]:checked').val() == "shared"){
		length = false;
		var weights = [];
	}

	var arrayOfProbes = [];
	var chordData = [];

	for(var i = combs.length - 1; i > -1; i--){
		for( var j = 0; j < sharedSeqs[i].length; j++){
			if(arrayOfProbes.indexOf(sharedSeqs[i][j]) == -1){
				arrayOfProbes.push(sharedSeqs[i][j]);
				if(!length){
					weights.push(combs[i].length);
				}
				for(var k = 0; k < combs[i].length; k++){
					chordData.push({
						"SpliceVariant": $( "input[name='name"+(combs[i][k]+1)+"']" ).val(),
						"probe": sharedSeqs[i][j],
						"size": sharedSeqs[i][j].length
					});
				}
			}
		}
	}

	var temp = [];

	for(var i = 0; i < arrayOfProbes.length; i++){
		if(!length){
			temp.push({
				"name" : arrayOfProbes[i],
				"size" : weights[i]*10
			})
		} else {
			temp.push({
				"name" : arrayOfProbes[i],
				"size" : arrayOfProbes[i].length 
			})
		}
		
	}
	var temp2 = [];
	temp2.push({
		"children": temp
	})
	weightedByLength = {"children": temp2};
	if(chordData.length != 0){
		drawChord(chordData, weightedByLength);
		displayTranscripts();
	} else {
		$("#results").html("no SVs of desired min length was found");
	}

}

//Compare two sequences and return the shared sequences longer than minimum length
function nucleotideSequenceCompare(sequence1, sequence2, minLengthShared) {
	var sharez = [];

	var i = 1;

	var start1O = sequence1.length-1;
	var start2O = 0;
	var diff = [];
	while(i < (sequence2.length+sequence1.length)){
		diff = [];
		var possible = [];
		var start1 = start1O;
		var start2 = start2O;
		var k = 0;
		while(start1 < sequence1.length && start2 < sequence2.length){
			diff[k] = sequence1[start1] - sequence2[start2];
			if(diff[k] == 0) {
				possible.push(sequence1[start1]);
			} else {
				if(possible.length >= minLengthShared && possible.length > 0){
					sharez.push(possible);
					sharez.push([0]); // separator
				}
				possible = [];
			}
			start1++;
			start2++;
			k++;
		}
		if(possible.length >= minLengthShared && possible.length > 0){
			sharez.push(possible);
			sharez.push([0]); // separator
		}

		i++;
		if (start1O != 0) {
			start1O--;
			start2O = 0;
		} else {
			start2O++;
		}
	}

	return sharez;
	
}