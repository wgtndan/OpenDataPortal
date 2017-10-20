var tbl;
console.log('registering Function goVisGo()');

function goVisGo(fromSelection) {
    fromSelection = (typeof fromSelection !== 'undefined') ?  fromSelection : false;

    if (typeof require == 'undefined')
        window.location = (config.isSecure ? "https://" : "http://") + config.host + config.prefix + "resources/returnUrl.html?returnUrl=" + encodeURIComponent(window.location.href);

    require.config({
        baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
        paths: {
            qlik: "js/qlik",
            bootstrap: (window.location.protocol === "https:" ? "https://" : "http://") + window.location.hostname + ":" + window.location.port + "/javascripts/bootstrap.min",
        },
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    });

    require(["js/qlik", "bootstrap"], function (qlik) {
        var control = false;
        qlik.setOnError(function (error) {
            $('#popupText').append(error.message + "<br>");
            if (!control) {
                control = true;
                $('#popup').delay(1000).fadeIn(1000).delay(11000).fadeOut(1000);
            }
        });
        // qlik.setOnError( function ( error ) {
        //     $( '#popupText' ).append( error.message + "<br>" );
        //     $( '#popup' ).fadeIn( 1000 );
        // } );
        // $( "#closePopup" ).click( function () {
        //     $( '#popup' ).hide();
        // } );

        function drawVis() {
            QlikUseActive = true;
            var qlikApp = qlik.openApp($(ddAppList).val(), config);
            console.log("Measure: " + $("#ddMeasListoption:selected").text());
            console.log("Dimension: " + $("#ddDimList option:selected").text());

            qlikApp.getObject('currsel', 'CurrentSelections');

            var hyperCube = getHyperCube(fromSelection);
            console.log(hyperCube);

            //Get Current Table Selection
            var displayOption = '';
            $('#left-buttons .active').each(function () {
                displayOption = $(this).attr('id');
            });

            tbl = qlikApp.visualization.create(displayOption, hyperCube, { "title": "Selected Data" });

            tbl.then(function(vis) {
                vis.show('resultDiv');
            });
            var qTable = qlikApp.createTable(isolateItemsOfqType(hyperCube, "dimension"), isolateItemsOfqType(hyperCube, "measure"));
            var $exportButton;
            if (!$("#btnGenerateSelectedCSV").length) {
                $exportButton = $(document.createElement('button'));
                $exportButton.html('Download CSV (Filtered)');
                $exportButton.addClass('pull-right btn btn-primary');
                $exportButton.attr('id', 'btnGenerateSelectedCSV');
            } else {
                $exportButton = $(btnGenerateSelectedCSV);
            }
            $exportButton.unbind('click');
            $exportButton.bind('click', function () {
                var newWindow = window.open('', '_blank');
                newWindow.document.write('Loading data...');
                qTable.exportData({ download: false }, function (downloadLink) {
                    var baseUrl = (config.isSecure ? "https://" : "http://") + config.host;// + config.prefix;
                    newWindow.location.href = baseUrl + downloadLink;
                    console.log(baseUrl + downloadLink);
                    setTimeout(function () { newWindow.close(); }, 1000);
                });
            });
            $(rightbuttons).append($exportButton);
            $(btnGenerateCSV).show();
            $(table).show();
            $("#pivot\\-table").show();
            $(barchart).show();
        }

        drawVis();
        var app;
    });



    function getData(dimensions, measures, appID) {
        var url = (config.isSecure ? "https://" : "http://") + + config.host + ":" + EnginePort + "/app/" + appID + "/getData?dimensions=" + dimensions + "&measures=" + measures;
        console.log("url: " + url);
        $.ajax({
            url: url,
            dataType: "json"
        }).done(function (data) {
            return data;
        });
    }
}

var dragSrcEl = null;
var innerContent = null;
var innerId = null;

function handleDragStart(e) {
    // Target (this) element is the source node.
    this.style.opacity = '0.4';
    dragSrcEl = this;
    innerContent = this.innerHTML;
    innerId = this.id;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    //   e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
}

function handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
}
function handleDrop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        var tempHTML = dragSrcEl.innerHTML;
        var tempId = dragSrcEl.id;
        dragSrcEl.innerHTML = this.innerHTML;
        dragSrcEl.id = this.id;
        this.innerHTML = tempHTML;//e.DataTransfer.getData('text/html');
        this.id = tempId
    }

    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    this.style.opacity = '1.0';
    var cols = document.querySelectorAll('.dragItem');
    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
    goVisGo();
}

function convertItemsToHypercube(ItemArray) {
    var hypercube = new Array(ItemArray.length);
    for (var i = 0; i < hypercube.length; i++) {
        hypercube[i] = { "qLibraryId": ItemArray[i].qLibraryId, "qType": ItemArray[i].qType };
    }
    return hypercube;

}

function createDragObjects() {
    $(resultOrder).empty();
    var fieldArray = getSelections();
    for (var i = 0; i < fieldArray.length; i++) {
        var newDiv = $(document.createElement('div'));
        newDiv.html(fieldArray[i].name);
        newDiv.attr('id', fieldArray[i].qLibraryId + ':' + fieldArray[i].qType);
        newDiv.attr('draggable', 'true');
        newDiv.addClass('dragItem btn btn-default');
        newDiv.bind('dragstart', handleDragStart);
        newDiv.bind('dragenter', handleDragEnter);
        newDiv.bind('dragover', handleDragOver);
        newDiv.bind('dragleave', handleDragLeave);
        newDiv.bind('drop', handleDrop);
        newDiv.bind('dragend', handleDragEnd);
        $(resultOrder).append(newDiv);
    }
}

function getHyperCube(fromSelection) {
    fromSelection = (typeof fromSelection !== 'undefined') ?  fromSelection : false;
    if (fromSelection) {
        createDragObjects();
    }
    var divObjects = $("#resultOrder")[0].children;
    var Values = new Array(divObjects.length);
    for (var i = 0; i < divObjects.length; i++) {
        var name = divObjects[i].innerHTML;
        var qLibraryId = divObjects[i].id.replace(/:(.*)/, "");
        var qType = divObjects[i].id.replace(/^(.+?):/, "");
        Values[i] = { "name": name, "qLibraryId": qLibraryId, "qType": qType };
        //place selection objects in array
    }
    //call convert selectionst o hypercube.
    return convertItemsToHypercube(Values);
}

function getSelections() {
    var measArray = $(ddMeasList).val();
    var measTextArray = $("#ddMeasList option:selected");
    if (measArray) {
        var measArrayLength = measArray.length;
        // var measures=new Array(measArrayLength);
        var measValues = new Array(measArrayLength);
        for (var i = 0; i < measArrayLength; i++) {
            // measures[i] = {"qLibraryId": measArray[i] ,"qType": "measure"};
            measValues[i] = { "name": measTextArray[i].innerHTML, "qLibraryId": measArray[i], "qType": "measure" };
        };
    } else {
        var measValues = [];
    }
    var dimArray = $(ddDimList).val();
    var dimTextArray = $("#ddDimList option:selected");
    if (dimArray) {
        var dimArrayLength = dimArray.length;
        // var dimensions = new Array(dimArrayLength);
        var dimValues = new Array(dimArrayLength);
        for (var i = 0; i < dimArrayLength; i++) {
            // dimensions[i] = {"qLibraryId": dimArray[i] ,"qType": "dimension"};
            dimValues[i] = { "name": dimTextArray[i].innerHTML, "qLibraryId": dimArray[i], "qType": "dimension" };
        };
    } else {
        var dimValues = [];
    }
    return dimValues.concat(measValues);
    // return convertItemsToHypercube(visItemSelections);
}

function isolateItemsOfqType(hyperCube, qType) {
    var resArray = new Array()
    for (i = 0; i < hyperCube.length; i++) {
        if (hyperCube[i].qType == qType) {
            resArray.push(hyperCube[i]);
        }
    }
    return resArray;
}
