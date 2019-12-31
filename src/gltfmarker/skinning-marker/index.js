var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 10,
  pitch: 45,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var url = '../../../../resource/gltf/aatrox/scene.gltf';
var symbol = {
  animation: true,
  loop: true,
  url: url,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.8, 0.0, 0.0, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);
