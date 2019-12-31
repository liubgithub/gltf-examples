var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 10,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

//需要在GroupGLLayer中开启后处理后才能设置泛光效果
var sceneConfig = {
  postProcess: {
    enable: true,
    bloom: {
      enable: true,
      threshold: 0,
      factor: 1,
      radius: 0.4,
    }
  }
};
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

var gltflayer = new maptalks.GLTFLayer('gltf');
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

gltfmarker.setBloom(true);

new maptalks.GroupGLLayer('group', [gltflayer],  { sceneConfig }).addTo(map);
