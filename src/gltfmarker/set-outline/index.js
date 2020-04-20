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
  this.outline = false;
};
var options = new Config();
var url = '../../../../resource/gltf/cube-animation/cube.gltf';
var symbol = {
  url: url,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.0, 0.2, 0.8, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  outline: options.outline,
  symbol: symbol
}).addTo(gltflayer);

var animationController = gui.add(options, 'outline');
animationController.onChange(function (value) {
  gltfmarker.setOutline(value);
});
