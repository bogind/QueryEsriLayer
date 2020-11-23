async function getLayerDetails(url){
    const response  = await fetch(url);

    return response.json();
}
let a2g = ArcgisToGeojsonUtils;
function chooseDownload(layerMetadata,url){
    formats = layerMetadata.supportedQueryFormats.split(", ")
    fields = layerMetadata.fields
    for(var i=0;i<fields.length;i++){
        field = fields[i]
        if(field.type == "esriFieldTypeOID"){
            var OBJECTID = field.name
        }
    }
    if(formats.includes("geoJSON")){
        layerType = "GeoJSON"
        /*
        TODO: use returnIdsOnly=true&f=pjson to query only IDS and get layer length, 
              creating multiple requests and streaming more data to layer after loading.
        */
        queryUrl = url+`/query?where=${OBJECTID} > 0&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&resultRecordCount=4000&geometryPrecision=6&outSR=4326&f=geojson`
    }else if(!formats.includes("geoJSON") && formats.includes("JSON")){
        layerType = "JSON"
        queryUrl = url+`/query?where=${OBJECTID} > 0&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&resultRecordCount=4000&geometryPrecision=6&outSR=4326&f=pjson`
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            if(layerType == "JSON"){
                gj = a2g.arcgisToGeoJSON(JSON.parse(xhttp.responseText))
            }else{
                gj = JSON.parse(xhttp.responseText)
            }
            gjLayer = L.geoJson(gj,{
                onEachFeature: function onEachFeature(feature, layer) {
                    if (feature.properties){
                    popupContent = "<table style='width:100%'>"
                    for(var i=0;i<fields.length;i++){
                        field = fields[i]
                        if(field.type != "esriFieldTypeOID" && field.type != "esriFieldTypeGeometry" ){
                            if(field.alias){
                                popupContent += `<tr><td><b>${field.alias}</b></td><td>${feature.properties[field.name]}</td></tr>`
                            }
                        }
                    }
                    popupContent += "</table>"
                    
                    layer.bindPopup(popupContent);
                    }
                }
            })
            .addTo(map)
            map.flyToBounds(gjLayer.getBounds())
            //return JSON.parse(xhttp.responseText);
        }
    };
    xhttp.open("GET", queryUrl, true);
    xhttp.send();

}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}
