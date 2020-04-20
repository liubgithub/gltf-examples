var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 10,
  pitch: 75,
  lights: {
    ambient: {
        color: [0.1, 0.1, 0.1]
    },
    directional: {
        color: [1, 1, 1],
        direction: [1, 0, -1],
    }
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

//需要在GroupGLLayer中开启阴影效果
var sceneConfig = {
  shadow: {
    type: 'esm',
    enable: true,
    quality: 'high',
    opacity: 1.0,
    color: [0, 0, 0],
    blurOffset: 1
  }
};
var url = '../../../../resource/gltf/aatrox/scene.gltf';
var symbol = {
  url: url,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.8, 0.0, 0.0, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf');
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

gltfmarker.setCastShadow(true);

new maptalks.GroupGLLayer('group', [gltflayer],  { sceneConfig }).addTo(map);
