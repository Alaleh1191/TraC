onmessage = function(e) {
    self.importScripts('chordComputation.js');

    [sequences, minLength] = e.data;
    [arrComb, arrSharedSeqs] = chordComputation(sequences, minLength);

    postMessage([arrComb, arrSharedSeqs]);
};