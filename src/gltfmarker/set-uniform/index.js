var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var gui = new dat.GUI({ width: 250 });
var Config = function () {
  this.baseColor = [200, 0, 0, 1.0]
};
var options = new Config();
var url = '../../../../resource/gltf/cube-animation/cube.gltf';
var symbol = {
  url: url,
  animation: options.animation,
  loop: options.loop,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': options.baseColor
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

var baseColorController = gui.addColor(options, 'baseColor');
baseColorController.onChange(function (value) {
  gltfmarker.setUniform('baseColorFactor', [value[0] / 255, value[1] / 255, value[2] / 255, 1]);
});
