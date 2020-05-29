var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  pitch: 75,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var url = '../../../../resource/gltf/cube-animation/cube.gltf';
var symbol = {
  url: url,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.8, 0.0, 0.0, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfMarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

gltfMarker.setInfoWindow({
  'title'     : 'GLTFMarker\'s InfoWindow',
  'content'   : 'Click on marker to open.',
  'dy': -20,
  'dx': 15
});

gltfMarker.openInfoWindow();
