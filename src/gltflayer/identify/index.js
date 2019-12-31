var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var url = '../../../../resource/gltf/Duck/Duck.glb';

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var markers = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    var symbol = {
      url: url,
      rotation: [90, 0, 0],
      uniforms: {
        'lightAmbient': [0.7, 0.0, 0.2]
      }
    };
    var gltfmarker = new maptalks.GLTFMarker(position.add(i * 0.01 - 0.015, j * 0.01 - 0.015), {
      symbol: symbol
    });
    markers.push(gltfmarker);
  }
}

gltflayer.addMarker(markers);

map.on('click', e => {
  var pickOne = gltflayer.identify(e.coordinate).target;
  if (pickOne) {
    pickOne.setUniform('lightAmbient', [0.2, 0.2, 0.8]);
  }
});
