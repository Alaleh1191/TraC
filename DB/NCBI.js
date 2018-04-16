'use strict';

var submission = false;

// XMLHttpRequests
var xhr = [];

// Terms given in the textarea field
var terms = [];

// IDs given from the NCBI database
var NCBIIds = [];

// Error Management
var errors = [];

/**
 * Important Information about the NCBI Database
 * - Only allowed 3 requests per second
 */

function submitNCBI()
{
    if(submission === false)
    {
        // Reset
        xhr             = [];
        terms           = [];
        NCBIIds         = [];
        errors          = [];

        submission = true;
    }
    else
    {
        console.warn('Already submitted. Please wait...');
        return;
    }

    // Get the contents of the textarea
    terms = document.getElementById('NCBI_Numbers').value;

    // Remove any whitespace
    terms = terms.replace(' ', '');

    // Split the numbers into an array
    terms = terms.split(",");

    console.log('Read the following from the textarea box:');
    console.log(terms);

    getNCBIIds(terms);
}

function getNCBIIds(terms)
{
    // NCBI Timeout
    var timeout = 0;


    for(var i = 0; i < terms.length; i++)
    {
        setTimeout(function(i, term) { getNCBIId(i, term) }, timeout, i, terms[i]);

        timeout += 350; // 3 requests per second maximum
    }
}

function getNCBIId(i, term)
{
    xhr[i] = new XMLHttpRequest();
    xhr[i].open('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=' + term + '+AND+srcdb_refseq%5BPROP%5D&retmode=json');

    xhr[i].onreadystatechange = (function() {
        if(xhr[i].status === 200 && xhr[i].readyState === 4)
        {
            var response = JSON.parse(xhr[i].responseText);

            console.log('Response ' + i + ' from NCBI:');
            console.log(response);

            if(response['error'] === 'API rate limit exceeded')
            {
                setTimeout(function(i, term) { getNCBIId(i, term) }, 1000, i, term);
            }

            if(response['esearchresult']['idlist'].length > 1)
            {
                errors.push('NCBI Parse Error: There is more than one result for the given accession number: ' + term);
                console.error('NCBI Parse Error: There is more than one result for the given accession number: ' + term);
                return;
            }

            NCBIIds[i] = response['esearchresult']['idlist'][0];

            console.log(NCBIIds.length + ":" + terms.length);

            if(NCBIIds.length === terms.length)
            {
                getNCBISequences();
            }
        }
    });

    xhr[i].send(null);
}

function getNCBISequences()
{
    var sequenceXHR = new XMLHttpRequest();
    sequenceXHR.open('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=' + NCBIIds.join(',') + '&retmode=xml');

    sequenceXHR.onreadystatechange = (function() {
        if(sequenceXHR.status === 200 && sequenceXHR.readyState === 4)
        {
            var response = sequenceXHR.responseXML;

            parseNCBIXML(response);

            submission = false;
        }
    });

    sequenceXHR.send(null);
}

function parseNCBIXML(data)
{
    console.log(data);
    removeAllUnfilledSequences();


    for(var i = 0; i < data.children[0].children.length; i++)
    {
        console.log("Loading sequence: " + i);

        // Sequence Details
        var gbSeq = data.children[0].children[i];

        // Sequence Name
        var name  = gbSeq.getElementsByTagName('GBSeq_locus')[0].textContent;

        // Sequence
        var sequence = gbSeq.getElementsByTagName('GBSeq_sequence')[0].textContent.toUpperCase();

        // Features
        var gbFeaturesXML = gbSeq.getElementsByTagName('GBSeq_feature-table')[0];

        var exonLengths = [];

        var a, gbFeature, intervals, interval, interval_from, interval_to, accession, sequenceActual = '';
        for(a = 0; a < gbFeaturesXML.childElementCount; a++)
        {
            gbFeature = gbFeaturesXML.children[a];

            if(gbFeature.getElementsByTagName('GBFeature_key')[0].textContent !== 'exon')
            {
                continue;
            }

            intervals       = gbFeature.getElementsByTagName('GBFeature_intervals')[0];
            interval        = intervals.getElementsByTagName('GBInterval')[0];
            interval_from   = interval.getElementsByTagName('GBInterval_from')[0].textContent;
            interval_to     = interval.getElementsByTagName('GBInterval_to')[0].textContent;
            accession       = interval.getElementsByTagName('GBInterval_accession')[0].textContent;

            interval_from   = parseInt(interval_from);
            interval_to     = parseInt(interval_to);

            sequenceActual += sequence.substring(interval_from - 1, interval_to);

            exonLengths.push({ 'key' : accession, 'value' : (interval_to - interval_from + 1) });
        }

        if(exonLengths.length === 0)
        {
            //Find the gene value instead
            for(a = 0; a < gbFeaturesXML.childElementCount; a++)
            {
                gbFeature = gbFeaturesXML.children[a];

                if(gbFeature.getElementsByTagName('GBFeature_key')[0].textContent === 'gene')
                {
                    intervals       = gbFeature.getElementsByTagName('GBFeature_intervals')[0];
                    interval        = intervals.getElementsByTagName('GBInterval')[0];
                    interval_from   = interval.getElementsByTagName('GBInterval_from')[0].textContent;
                    interval_to     = interval.getElementsByTagName('GBInterval_to')[0].textContent;
                    accession       = interval.getElementsByTagName('GBInterval_accession')[0].textContent;

                    exonLengths.push({ 'key' : accession, 'value' : (interval_to - interval_from + 1) });
                    break;
                }
            }

            sequenceActual = sequence;
        }

        addSV(name, sequenceActual, exonLengths);
    }



}