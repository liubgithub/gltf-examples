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
  shader: 'wireframe',
  animation: true,
  loop: true,
  rotation: [90, 0, 0],
  uniforms: {
    stroke: [1.0, 0, 0, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

