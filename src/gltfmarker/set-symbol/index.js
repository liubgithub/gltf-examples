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
  this.setSymbol = false;
};
var options = new Config();
var url = '../../../../resource/gltf/cube-animation/cube.gltf';
var symbol = {
  url: url,
  animation: true,
  loop: true,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.8, 0.0, 0.0, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

var newSymbol = {
  url: '../../../../resource/gltf/chuyin/elf.gltf',
  scale: [2.0, 2.0, 2.0],
  rotation: [180, 0, 0],
  uniforms: {
    'baseColorFactor': [0.0, 0.8, 0.2, 1.0]
  }
};

var symbolController = gui.add(options, 'setSymbol');
symbolController.onChange(function (value) {
  if (value) {
    gltfmarker.setSymbol(newSymbol);
  } else {
    gltfmarker.setSymbol(symbol);
  }
});
