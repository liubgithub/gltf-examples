var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var url1 = '../../../../resource/gltf/cube-animation/cube.gltf';
var url2 = '../../../../resource/gltf/Duck/Duck.glb';

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var markers = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    var gltfmarker = new maptalks.GLTFMarker(position.add(i * 0.01 - 0.015, j * 0.01 - 0.015), {
      properties: {
        'num': (i + j) * 0.1
      }
    });
    markers.push(gltfmarker);
  }
}

gltflayer.addMarker(markers);

const style = [{
  "filter": ["<", "num", 0.2],
  "symbol": {
      "url": url1,
      "animation": true,
      "loop": true,
      "scale": [2, 2, 2],
      "rotation": [90, 0, 0],
      "shader": "phong",
      "uniforms": {
          'baseColorFactor': [0.8, 0.2, 0.0, 1.0]
      }
    },
    "uniqueName": "棱锥体"
  },
  {
    "filter": [">=", "num", 0.2],
    "symbol": {
        "url": url2,
        "shader": "phong",
        "rotation": [90, 0, 0],
        "uniforms": {
            'baseColorFactor': [0.2, 0.8, 0.0, 1.0]
        }
    },
    "uniqueName": "鸭子"
  }
];
setTimeout(function() {
  gltflayer.setStyle(style);
}, 3*1000);
