var map1 = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map1);

L.marker([51.5, -0.09]).addTo(map1)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

var map2 = L.map('map2').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map2);

L.marker([51.5, -0.09]).addTo(map2)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();