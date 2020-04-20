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
  animation: true,
  loop: true,
  url: url,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.8, 0.0, 0.0, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('groupgltflayer').addTo(map);
var position = map.getCenter();

//准备groupgltfmarker的数据
var data = [];
var coordinate = position.add(0, 0);
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        data.push({
            coordinates : coordinate.add(i * 0.01, j * 0.01),
            translation : [0, 0, 0],
            rotation : [0, 0, 0],
            scale : [1, 1, 1],
            color : [i / 15 + 0.2, 0.1 + j / 12, 1.0 - (i + j) / 20, 0.9]
        });
    }
}

var gltfmarker = new maptalks.GroupGLTFMarker(data, {
  symbol: symbol
}).addTo(gltflayer);
