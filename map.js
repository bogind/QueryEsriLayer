let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


let map = L.map('map',{
	layers: OpenStreetMap_Mapnik,
	center: [32.69486, 12.6123],
	zoom: 4,
	maxZoom: 18,
    minZoom: 0,
})


let menu =  L.control.menu({ position: 'topleft' })



let openInputButton =  L.control.openInput({ position: 'topleft' }).addTo(map);


var inputLayer = getUrlVar()
if(inputLayer.length > 0){
	lastPart = inputLayer.slice(inputLayer.lastIndexOf("/")+1)
			if(!Number.isNaN(parseInt(lastPart)) && Number.isInteger(parseInt(lastPart))){
				getLayerDetails(inputLayer+"?f=json")
					.then(data =>
						layerMetadata = data
						)
					.then(
						layerMetadata =>
						chooseDownload(layerMetadata,inputLayer)
					)
					
			}
}

