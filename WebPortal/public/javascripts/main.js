$(ddAppList).change(function () {
    fillCascadedDropDown((config.isSecure ? "https://" : "http://") + EngineHost + ":" + EnginePort + "/app/" + $(ddAppList).val() + "/getDimensions", ddDimList);
    fillCascadedDropDown((config.isSecure ? "https://" : "http://") + EngineHost + ":" + EnginePort + "/app/" + $(ddAppList).val() + "/getMeasures", ddMeasList);
    $(fieldSelectForm).show();
    $(appGUID).html("App GUID: " + $(ddAppList).val());
});
$(ddDimList).click(function () {
    $(resultsSelectForm).show();
    goVisGo(true);
});
$(ddMeasList).click(function () {
    $(resultsSelectForm).show();
    goVisGo(true);
});
$(table).click(function () {
    $(resultDiv).removeClass("col-md-12");
    $(resultDiv).addClass("col-md-10");
    $(resultOrder).show();
    goVisGo();
});
$(barchart).click(function () {
    $(resultDiv).removeClass("col-md-12");
    $(resultDiv).addClass("col-md-10");
    $(resultOrder).show();
    goVisGo();
});
$("#pivot\\-table").click(function () {
    $(resultDiv).removeClass("col-md-10");
    $(resultDiv).addClass("col-md-12");
    $(resultOrder).hide();
    goVisGo();
});
$(btnGenerateCSV).click(function () {
    getCSV($(ddAppList).val(), $(ddDimList).val(), $(ddMeasList).val());
});
fillAppDropDown((config.isSecure ? "https://" : "http://" ) + EngineHost + ":" + EnginePort + "/app",ddAppList);