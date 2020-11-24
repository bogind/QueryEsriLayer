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
            if(layerMetadata.geometryType == "esriGeometryPoint"){
                console.log(1)
                if(layerMetadata.drawingInfo.renderer.type == "uniqueValue"){
                    console.log(2)
                    if(layerMetadata.drawingInfo.renderer.uniqueValueInfos[0].symbol.contentType == "image/png" &&
                    "imageData" in layerMetadata.drawingInfo.renderer.uniqueValueInfos[0].symbol){
                        console.log(3)
                        symbolField = layerMetadata.drawingInfo.renderer.field1
                        gjLayer = L.layerGroup()
                        for(var j=0;j<layerMetadata.drawingInfo.renderer.uniqueValueInfos.length;j++){
                            layer = L.geoJson(gj,{
                                pointToLayer: function(geoJsonPoint, latlng) {
                                    return L.marker(latlng,{
                                        icon: L.icon({
                                            iconUrl: `${url}/images/${layerMetadata.drawingInfo.renderer.uniqueValueInfos[j].symbol.url}`,
                                        
                                            iconSize:     [layerMetadata.drawingInfo.renderer.uniqueValueInfos[j].symbol.width, layerMetadata.drawingInfo.renderer.uniqueValueInfos[j].symbol.height], // size of the icon
                                            iconAnchor:   [layerMetadata.drawingInfo.renderer.uniqueValueInfos[j].symbol.width/2, layerMetadata.drawingInfo.renderer.uniqueValueInfos[j].symbol.height-1], // point of the icon which will correspond to marker's location
                                            popupAnchor:  [-3, -layerMetadata.drawingInfo.renderer.uniqueValueInfos[j].symbol.height] // point from which the popup should open relative to the iconAnchor
                                        })
                                    });
                                },
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
                                },
                                filter : function(feature){
                                    if(feature.properties[symbolField] == layerMetadata.drawingInfo.renderer.uniqueValueInfos[j].value){
                                        return true
                                    }
                                }
                            })
                            gjLayer.addLayer(layer)
                        }
                        gjLayer.addTo(map)
                        map.flyToBounds(gjLayer.getBounds())
                    }
                    
        
                }
            }else{
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

            }
            
            
            //return JSON.parse(xhttp.responseText);
        }
    };
    xhttp.open("GET", queryUrl, true);
    xhttp.send();

}
function getUrlVar() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var layer = urlParams.get('layer')
    return layer;
}
function buildIcons(layerMetadata, feature){
    
}

/*
symbology by geometry type:

//################
// points
//################

https://stackoverflow.com/questions/21227078/convert-base64-to-image-in-javascript-jquery
use that to create custom markers if:
1. layerMetadata.drawingInfo.type == "uniqueValue"
2. layerMetadata.drawingInfo.uniqueValueInfos[n].symbol.contentType == "image/png"
3. layerMetadata.drawingInfo.uniqueValueInfos[n].symbol.contains("imageData")

Possible to add legend?

if layerMetadata.drawingInfo.renderer.type == "simple"
and layerMetadata.drawingInfo.renderer.symbol.type == "esriSMS" && layerMetadata.drawingInfo.renderer.symbol.style == "esriSMSCircle"
use layerMetadata.drawingInfo.renderer.symbol.color (rgba) and layerMetadata.drawingInfo.renderer.symbol.size

//################
// lines
//################
*/