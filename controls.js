L.Control.OpenInput =  L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div','button leaflet-bar');

		container.style.color = 'green';
		container.innerText = '+';


		container.onclick = function(){
			if(menu._map){
				map.removeControl(menu)
			}else{
				menu.addTo(map)
			}
		}

        return container;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});
L.control.openInput = function(opts) {
    return new L.Control.OpenInput(opts);
}

L.Control.Menu =  L.Control.extend({
    onAdd: function(map) {
		var container = L.DomUtil.create('div','menu leaflet-bar');
		var span = L.DomUtil.create('span');
		var urlInput = L.DomUtil.create('input', 'url-input');
		var loadButton = L.DomUtil.create('input', 'load-button');

		urlInput.id = "urlInput";
		urlInput.type = "url";
		loadButton.id = "load";
		loadButton.type = "button"
		loadButton.value = "Add"
		loadButton.onclick = function(){
			var url = document.getElementById("urlInput").value
			lastPart = url.slice(url.lastIndexOf("/")+1)
			if(!Number.isNaN(parseInt(lastPart)) && Number.isInteger(parseInt(lastPart))){
				getLayerDetails(url+"?f=json")
					.then(data =>
						layerMetadata = data
						)
					.then(
						layerMetadata =>
						chooseDownload(layerMetadata,url)
					)
					.catch(er =>{
						alert("התרחשה שגיאה בקריאת נתוני השכבה")
					})
					
			}
			
		}
		

		span.append(urlInput, loadButton)
		container.append(span)

		return container
	},

	onRemove: function(map) {
        // Nothing to do here
	}
})
L.control.menu = function(opts) {
    return new L.Control.Menu(opts);
}
