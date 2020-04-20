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
const urls = ['Duck', 'cube', 'chuyin'];
var Config = function () {
  this.url = urls[0];
};
var options = new Config();
var url1 = '../../../../resource/gltf/cube-animation/cube.gltf';
var url2 = '../../../../resource/gltf/Duck/Duck.glb';
var url3 = '../../../../resource/gltf/chuyin/elf.gltf';
const urlMap = {
  Duck: url2,
  cube: url1,
  chuyin: url3
};
var symbol = {
  url: options.url,
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
var urlController = gui.add(options, 'url', urls);
urlController.onChange(function (value) {
  gltfmarker.setUrl(urlMap[value]);
});
