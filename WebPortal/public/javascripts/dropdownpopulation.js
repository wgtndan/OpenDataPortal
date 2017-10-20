function fillAppDropDown(url, dropdown) {
    $.ajax({
        url: url,
        dataType: "json"
    }).done(function (data) {
        // Clear drop down list
        $(dropdown).empty(); // <<<<<< No more issue here
        // Fill drop down list with new data
        $("<option />", {
                val: null,
                text: ""
            }).appendTo(dropdown);
        $(data).each(function () {
            $("<option />", {
                val: this.qDocId,
                text: this.qDocName
            }).appendTo(dropdown);
        });
    });
}

function fillCascadedDropDown(url, dropdown) {
    $.ajax({
        url: url,
        dataType: "json"
    }).done(function (data) {
        // Clear drop down list
        $(dropdown).empty(); // <<<<<< No more issue here
        // Fill drop down list with new data
        // $("<option />", {
        //         val: null,
        //         text: ""
        //     }).appendTo(dropdown);
       $(data).each(function () {
            $("<option />", {
                val: this.qInfo.qId,
                text: this.qMeta.title
            }).appendTo(dropdown);
        });
    });
}
