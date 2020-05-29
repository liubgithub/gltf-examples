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
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

gltfmarker.on('click', e => {
  alert('click event');
});

gltfmarker.on('mousemove', e => {
  map.setCursor('url(images/cursor.png) 9 0, auto');
  gltfmarker.setUniform('baseColorFactor', [0.0, 0.8, 0.0, 1.0]);
});
gltfmarker.on('mouseleave', e => {
  gltfmarker.setUniform('baseColorFactor', [0.8, 0.0, 0.0, 1.0]);
});