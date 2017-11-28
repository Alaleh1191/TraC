var transcriptsGlobal = [];
var topOfSpeciesList = ['Human', 'Mouse'];

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
			    var option = '<option value="' + species[i].name + '">' + species[i].display_name + '</option>';

			    //By default, Human and Mouse should be on the top of the list
			    if(topOfSpeciesList.includes(species[i].display_name))
                {
                    speciesOptions = option + speciesOptions;
                }

				speciesOptions += option;
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

			transcriptsOptions = '<option value="All" >All Transcripts</option>';
			for(var i = 0; i < transcripts.length; i++)
			{
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

/* Return the exons in sorted order */
function sortExons(exons)
{
    return exons.sort(function(exon1, exon2) {
        if(exon1.start < exon2.start)
        {
            return -1;
        }
        if(exon1.start > exon2.start)
        {
            return 1;
        }

        return 0;
    });
}

function getInfoOfEachExon(exons)
{
    var exonLengths = {};
    exons = sortExons(exons);

    exons.forEach(function(exon) {
        exonLengths[exon.id] = (exon.end - exon.start + 1);
    });

    return exonLengths;
}


/* Add the selected transcripts to the list*/
function searchForTranscript()
{

    //Retrieve the sequence of the chosen transcript
    var transcript = document.getElementById('transcripts');
    transcript = transcript.options[transcript.selectedIndex].value;

    if(transcript == 'All')
    {
        allTranscriptsInSelectedGene();
        return;
    }

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

    transcript = transcriptsGlobal[transcript];


    var exons = sortExons(transcript['Exon']);
    var exonIds = {};
    exonIds['ids'] = [];
    exonIds['format'] = 'JSON';

    for (i = 0; i < exons.length; i++)
    {
        exonIds['ids'].push(exons[i]['id']);
    }

    exonIds = JSON.stringify(exonIds);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '//rest.ensembl.org/sequence/id');
    xhr.setRequestHeader("Content-Type", "text/plain");

    xhr.onreadystatechange = (function() {
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            var sequence = xhr.responseText;
            sequence = sequence.split("\n");
            sequence = sequence.join('');
            var exonLengths = getInfoOfEachExon(transcript['Exon']);


            $("#loading").remove();
            if(placed == -1){
                addSV(transcript['display_name'], sequence, exonLengths);
            } else {
                $(".SV."+placed).val(sequence);
                $( "input[name='name"+placed+"']" ).val(transcript['display_name']);
                $('.exon-length.'+placed).val(exonLengthsHumanFormat(exonLengths));
            }
        }
    });

    $("#loading").remove();
    xhr.send(exonIds);
}

var xhr = [];
var xhr_number = 0;

function sendRequest(i, exonIds)
{
    xhr[i] = new XMLHttpRequest();
    xhr[i].open('POST', '//rest.ensembl.org/sequence/id');
    xhr[i].setRequestHeader("Content-Type", "text/plain");

    xhr[i].onreadystatechange = (function () {
        if (xhr[i].readyState == 4 && xhr[i].status == 200) {
            var sequence = xhr[i].responseText;
            sequence = sequence.split("\n");
            sequence = sequence.join('');
            var exonLengths = getInfoOfEachExon(transcriptsGlobal[i]['Exon']);

            addSV(transcriptsGlobal[i]['display_name'], sequence, exonLengths);
        }
    });

    $("#loading").remove();
    xhr[i].send(exonIds);
}

function allTranscriptsInSelectedGene()
{
    // remove all unfilled sequences
    for(var i=1; i < numberOfSV; i++){
        if($(".SV."+i).val() == "") {
            removeSV(document.getElementsByClassName(i)[4]);
            i--; //decrement i because removeSV moves everything up
        }
    }

    var timeout = 0;

    for (i = xhr_number; i < transcriptsGlobal.length; i++)
    {
        var exons = sortExons(transcriptsGlobal[i]['Exon']);

        var exonIds = {};
        exonIds['ids'] = [];
        exonIds['format'] = 'JSON';

        for (var a = 0; a < exons.length; a++)
        {
            exonIds['ids'].push(exons[a]['id']);
        }

        exonIds = JSON.stringify(exonIds);

        console.log(timeout);

        setTimeout(function(i, exonIds) { sendRequest(i, exonIds) }, timeout, i, exonIds);

        timeout += 100;
    }
}

