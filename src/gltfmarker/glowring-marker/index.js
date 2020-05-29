var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 16,
  pitch: 45,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    subdomains: $(subdomains),
    attribution: ['a','b','c','d']
  })
});
var glowlayer = new maptalks.GlowMarkerLayer('glow').addTo(map);
var position = map.getCenter();
new maptalks.GlowMarker(position, {
  symbol : {
    animation: true,
    bloom: false,
    rotation: [90, 0, 0],
    uniforms: {
      'radius' : 1.0,
      'color' : [1.0, 0.0, 0.0],
      'speed' : 5.0
    }
  }
}).addTo(glowlayer);
