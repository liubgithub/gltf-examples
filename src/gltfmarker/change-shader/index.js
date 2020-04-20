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
var gui = new dat.GUI({ width: 250 });
var Config = function () {
  this.shader = 'phong';
};
var options = new Config();
var url = '../../../../resource/gltf/cube-animation/cube.gltf';
var symbol = {
  url: url,
  shader: options.shader,
  animation: true,
  loop: true,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.2, 0.1, 0.8, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

const shaders = ['phong', 'wireframe'];
var shaderController = gui.add(options, 'shader', shaders);
shaderController.onChange(function (value) {
  gltfmarker.setShader(value);
});
