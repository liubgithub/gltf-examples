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
  this.translationX = 0;
  this.translationY = 0;
  this.translationZ = 0;

  this.rotationX = 90;
  this.rotationY = 0;
  this.rotationZ = 0;

  this.scaleX = 1;
  this.scaleY = 1;
  this.scaleZ = 1;
};
var options = new Config();
var url = '../../../../resource/gltf/cube-animation/cube.gltf';
var symbol = {
  url: url,
  translation: [options.translationX, options.translationY, options.translationZ],
  rotation: [options.rotationX, options.rotationY, options.rotationZ],
  scale: [options.scaleX, options.scaleY, options.scaleZ],
  uniforms: {
    'baseColorFactor': [0.8, 0.0, 0.0, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

//control translation、rotation

var translation = gui.addFolder('translation');
var transControllerX = translation.add(options, 'translationX');
transControllerX.onFinishChange(function (value) {
  gltfmarker.setTranslation([value, transControllerY.getValue(), transControllerZ.getValue()]);
});
var transControllerY = translation.add(options, 'translationY');
transControllerY.onFinishChange(function (value) {
  gltfmarker.setTranslation([transControllerX.getValue(), value, transControllerZ.getValue()]);
});
var transControllerZ = translation.add(options, 'translationZ');
transControllerZ.onFinishChange(function (value) {
  gltfmarker.setTranslation([transControllerX.getValue(), transControllerY.getValue(), value]);
});

var rotation = gui.addFolder('rotation');
var rotationControllerAxisX = rotation.add(options, 'rotationX');
rotationControllerAxisX.onFinishChange(function (value) {
  gltfmarker.setRotation(rotationControllerAxisX.getValue(), rotationControllerAxisY.getValue(), rotationControllerAxisZ.getValue());
});
var rotationControllerAxisY = rotation.add(options, 'rotationY');
rotationControllerAxisY.onFinishChange(function (value) {
  gltfmarker.setRotation(rotationControllerAxisX.getValue(), rotationControllerAxisY.getValue(), rotationControllerAxisZ.getValue());
});
var rotationControllerAxisZ = rotation.add(options, 'rotationZ');
rotationControllerAxisZ.onFinishChange(function (value) {
  gltfmarker.setRotation(rotationControllerAxisX.getValue(), rotationControllerAxisY.getValue(), rotationControllerAxisZ.getValue());
});

var scale = gui.addFolder('scale');
var scaleControllerX = scale.add(options, 'scaleX', 0.1, 20);
scaleControllerX.onChange(function (value) {
  gltfmarker.setScale([value, scaleControllerY.getValue(), scaleControllerZ.getValue()]);
});
var scaleControllerY = scale.add(options, 'scaleY', 0.1, 20);
scaleControllerY.onChange(function (value) {
  gltfmarker.setScale([scaleControllerX.getValue(), value, scaleControllerZ.getValue()]);
});
var scaleControllerZ = scale.add(options, 'scaleZ', 0.1, 20);
scaleControllerZ.onChange(function (value) {
  gltfmarker.setScale([scaleControllerX.getValue(), scaleControllerY.getValue(), value]);
});