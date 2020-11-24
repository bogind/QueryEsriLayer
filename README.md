### View esri Service Layers

Don't you just hate it when you have to an entire service to arcgis online\arcgis js api\QGIS jsut to view one layer.

#### NO MORE!

Just open the URL input by click on the green plus <b style="line-height: 30px;font-size: 28px;color:green;">+</b>,  
insert the layer URL for example <i style="background-color:gray;color: white;">https://gisviewer.jerusalem.muni.il/arcgis/rest/services/BaseLayers/MapServer/177</i> (note that it should end with a number), and click **Add**, that's it.
    
#### Current Support

* Load an arcgis online\arcgis server individual layer (if available as esri JSON or GeoJSON)
* View the features data in popup
* Use the **layer** url parameter to share a specific layer


#### Symbology Support

* points
    * unique values
        * Picture Marker Symbol (esriPMS)
        * Simple Marker Symbol (esriSMS) (only circles)
* polylines - not supported (leaflet default)
* polygons - not supported (leaflet default)