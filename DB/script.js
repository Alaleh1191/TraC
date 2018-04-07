var databases = ['Ensembl', 'NCBI'];

window.onload = (function() {
    $('select').select2();
    $(".select2").removeAttr("style");

    $('input[name=db]').on('ifClicked', function() {
       DBDisplayChange($(this).val());
    });
});

function DBDisplayChange(showDiv)
{
    console.log(showDiv);

    for(var i = 0; i < databases.length; i++)
    {
        $('#' + databases[i]).css('display', 'none');
    }

    $('#' + showDiv).css('display', 'block');
}

/**
 * Returns -1 if needs a new placement
 * Returns i for the first available placement
 */
function firstAvailablePlacement()
{
    var placed = -1; // -1 if needed to create a new row

    // check for unfilled sequences
    for(var i=1; i < numberOfSV; i++){
        if($(".SV."+i).val() == ""){
            placed = i;
            break;
        }
    }

    return placed;
}

/**
 * Removes all unfilled sequences
 */
function removeAllUnfilledSequences()
{
    // remove all unfilled sequences
    for(var i=1; i < numberOfSV; i++){
        if($(".SV."+i).val() == "") {
            removeSV(document.getElementsByClassName(i)[4]);
            i--; //decrement i because removeSV moves everything up
        }
    }
}