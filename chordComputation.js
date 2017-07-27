//Find different combinations and different shared sequences among each combination
function chordComputation(sequences, minLength)
{
    var arrComb = [];
    var arrSharedSeqs = [];

    //create an array of combinations (so far combinations of just 1 element)
    for (var i = 0; i < sequences.length - 1; i++) {
        arrComb.push([i]);
    }

    // create an array of shared sequences, so far just sequences
    for (i = 0; i < sequences.length - 1; i++) {
        arrSharedSeqs.push([sequences[i]])
    }

    var newComb = [];
    var indexSeq = 0;
    var indexComb = 0;
    var probes, uniqueProbes = [], temp;
    while (indexComb < arrComb.length){
        var comb = arrComb[indexComb];
        var last = comb[comb.length - 1];
        for(var j = last+1; j < sequences.length; j++){
            probes = [];
            uniqueProbes = [];
            indexSeq = 0;
            while(indexSeq < arrSharedSeqs[indexComb].length){
                temp = findProbes([sequences[j], arrSharedSeqs[indexComb][indexSeq]], minLength);

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

            for(var a = 0; a < probes.length; a++)
            {
                if(uniqueProbes.indexOf(probes[a]) === -1) {
                    uniqueProbes.push(probes[a]);
                }
            }

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

    return [arrComb, arrSharedSeqs];
}


/* Given an array of transcripts returns the probes shared among all the transcripts in
 given array */
function findProbes(sv, minLength){

    var spliceVariants = sv;

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