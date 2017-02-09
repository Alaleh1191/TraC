var transcriptsGlobal = [];

/* load the species drop down by retrieving it from ensemble. */
window.onload = (function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//rest.ensembl.org/info/species?content-type=application/json');
    xhr.onreadystatechange = (function() {
        if(xhr.status == 200 && xhr.readyState == 4)
		{
			var species = JSON.parse(xhr.responseText);
			species = species.species;

			var speciesOptions = '';
			for(var i = 0; i < species.length; i++)
			{
				speciesOptions += '<option value="' + species[i].name + '">' + species[i].display_name + '</option>';
			}

			document.getElementById('species').innerHTML = speciesOptions;

		}
	});
	xhr.send();
	$('select').select2();
	$(".select2").removeAttr("style");
});

/* after clicking select species and gene, retrieve the transcripts of the selected gene and specie */
function searchForGene()
{
	var specie = document.getElementById('species');
	specie = specie.options[specie.selectedIndex].value;

	var gene = document.getElementById('gene').value;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', '//rest.ensembl.org/lookup/symbol/'+specie+'/'+gene+'?content-type=application/json;expand=1');
	xhr.onreadystatechange = (function() {
	   if(xhr.status == 200 && xhr.readyState == 4)
	   {
           var transcripts = JSON.parse(xhr.responseText);
           transcripts = transcripts['Transcript'];
           transcriptsGlobal = transcripts;

			transcriptsOptions = '';
			for(var i = 0; i < transcripts.length; i++)
			{
				console.log("transcript info");
				console.log(transcripts[i])
                transcriptsOptions += '<option value="' + i + '">' + transcripts[i].display_name + ' (' + transcripts[i].biotype + ')</option>';
			}

			document.getElementById('transcripts').innerHTML = transcriptsOptions;
	   }
	   else if(xhr.readyState == 4)
	   {
	       alert('Supplied Specie and Gene was not found');
           transcriptsGlobal = [];
	   }
	});

	xhr.send(null);
}

/* Add the selected transcripts to the list*/
function searchForTranscript()
{
	var placed = -1; // -1 if needed to create a new row

    // check for unfilled sequences
	for(var i=1; i < numberOfSV; i++){
        if($(".SV."+i).val() == ""){
        	placed = i;
        	break;
        }
    }

    //if an unfilled sequence is found
    if (placed != -1) {
    	$(".del."+(placed-1)).css("position", "relative");
    	$("br."+placed).before("<img id='loading' src='Loading_icon.gif' alt='loading' style='height: 60px; margin-bottom: -25px; margin-left: -58px;margin-top: -37px;' /> ");
    } else {
    	$("br.addSV").before("<img id='loading' src='Loading_icon.gif' alt='loading' style='height: 60px; margin-bottom: -19px; margin-left: -25px;margin-top: -35px;' /> ")
    }
    
    //Retrieve the sequence of the chosen transcript
	var transcript = document.getElementById('transcripts');
    transcript = transcript.options[transcript.selectedIndex].value;
    transcript = transcriptsGlobal[transcript];

    console.log('Transcript ID' + transcript['id'] + ' - Transcript Name: ' + transcript['display_name']);

    var exons = transcript['Exon'];
    console.log(exons);
    var exonIds = {};
    exonIds['ids'] = [];
    exonIds['format'] = 'JSON';

    for (var i = 0; i < exons.length; i++)
    {
        exonIds['ids'].push(exons[i]['id']);
    }

    exonIds = JSON.stringify(exonIds);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '//rest.ensembl.org/sequence/id');
    xhr.setRequestHeader("Content-Type", "text/plain");

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            var sequence = xhr.responseText;
            sequence = sequence.split("\n");
            sequence = sequence.join('');
            console.log(sequence);
            console.log("number of sv is"+numberOfSV);
            
            $("#loading").remove();
            if(placed == -1){
            	addSV(transcript['display_name'], sequence);
            } else {
            	$(".SV."+placed).val(sequence);
        		$( "input[name='name"+placed+"']" ).val(transcript['display_name']);
        		
            }
            

        }
    }

    $("#loading").remove();
    xhr.send(exonIds);
}
