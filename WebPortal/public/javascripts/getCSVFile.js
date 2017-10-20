function getCSV(AppId, DimIds, MeasIds){
//Hit API to get CSV Download URL
var url = (config.isSecure ? "https://" : "http://" ) +  + config.host + ":" + EnginePort + "/app/" + 
    AppId + '/getCSV?dimensions=' +
    DimIds +
    '&measures=' + 
    MeasIds;

$.ajax({
        url: url,
        dataType: "json",
        async: false,
        success: function(data){
            window.open( data);
        }
    // }).done(function (data) {
    //     window.open( data);
    });
}

// function getCSVCapabilities(){
//     var config = {
//         host: "nzwel-extadn1",
//         prefix: "",
//         port: 443,
//         isSecure: true
//     };

//     if (typeof require == 'undefined')
//         window.location=(config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources/returnUrl.html?returnUrl=" + encodeURIComponent(window.location.href);

//     require.config( {
//         baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "/resources",
//         paths: {
//             qlik :  "js/qlik",
//             bootstrap: (window.location.protocol === "https:" ? "https://" : "http://" ) +window.location.hostname+":"+window.location.port+"/javascripts/bootstrap.min",
//         },
//         text: {  
//             useXhr: function (url, protocol, hostname, port) {  
//               return true;  
//             }
//         }
//     });

//     require( ["js/qlik","bootstrap"], function ( qlik ) {
// 	var control = false;
// 	qlik.setOnError( function ( error ) {
// 		$( '#popupText' ).append( error.message + "<br>" );
// 		if ( !control ) {
// 			control = true;
// 			$( '#popup' ).delay( 1000 ).fadeIn( 1000 ).delay( 11000 ).fadeOut( 1000 );
// 		}
// 	} );
//         // qlik.setOnError( function ( error ) {
//         //     $( '#popupText' ).append( error.message + "<br>" );
//         //     $( '#popup' ).fadeIn( 1000 );
//         // } );
//         // $( "#closePopup" ).click( function () {
//         //     $( '#popup' ).hide();
//         // } );
//             // var qTable = qlik.table(this);
//             tbl.exportData({download: true});
//         })
// };