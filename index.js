
var map = L.map('map').setView([3.42335, -76.52086], 13);

//Definición de la variable mapa base, e inserción de código extraido de https://leaflet-extras.github.io/
var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
basemap.addTo(map);

//CAPA BASE WFS
var vias = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS&version=1.1.0',
    {
        layers: 'pot_2014:mov_jerarquizacion_vial',
        format: 'image/png',
        transparent: true,
    });

//GeoJSON
var comuna = L.geoJSON(comuna).addTo(map);
var puntos = L.geoJSON(puntos, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<b>ID: </b>' + feature.properties.id + '<br>' + '<b>Nombre: </b>' + feature.properties.nombre)
    }
}).addTo(map);

//CONFIGURACIÓN ZOOM LIMITADA A LA COMUNA
map.fitBounds(comuna.getBounds());

//FUNCIÓN PARA CAMBIAR ÍCONOS
var iconChanged = true;
function cambiarIconos(puntos, iconUrl) {
    var iconUrl = iconChanged ? './img/pan.png' : './img/pan2.png';
    puntos.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            layer.setIcon(L.icon({
                iconUrl: iconUrl,
                iconSize: [30, 30],
                iconAnchor: [16, 32]
            }));
        }
    });
    iconChanged = !iconChanged;
}

// BOTÓN PARA CAMBIAR ÍCONOS
var button = L.easyButton('<img src="img/icono.png"  align="absmiddle" height="16px" >', function () {
    cambiarIconos(puntos, './img/pan.png');
}, 'Cambiar Iconos').addTo(map);

//Scale control that shows the scale of the current center of screen in metric (m/km) system. 
L.control.scale({
    position: 'bottomleft',
    imperial: false
}).addTo(map);

//Escala del mapa absoluta (1:25.000)
L.control.scalefactor().addTo(map);

//LAYER CONTROL
var baseLayer = {
    "Mapa Base": basemap
};
var overlays = {
    "Panaderías": puntos,
    "Comuna 17": comuna,
    "Vías": vias
};
L.control.layers(baseLayer, overlays).addTo(map);
