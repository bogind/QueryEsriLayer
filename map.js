var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var map = L.map('map',{
	layers: OpenStreetMap_Mapnik,
	center: [0.0, 0.0],
	zoom: 4,
	maxZoom: 18,
    minZoom: 0,
})