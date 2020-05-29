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
var url = '../../../../resource/gltf/Duck/Duck.glb';
var symbol = {
  url: url,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.8, 0.8, 0.8, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
});
gltflayer.addMarker(gltfmarker);

var json = gltflayer.toJSON();

var layer = maptalks.GLTFLayer.fromJSON(json);
layer.addTo(map);
gltflayer.hide();
