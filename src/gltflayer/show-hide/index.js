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
  this.visible = true;
};
var options = new Config();
var url = '../../../../resource/gltf/Duck/Duck.glb';
var symbol = {
  url: url,
  visible : options.visible,
  rotation: [90, 0, 0],
  uniforms: {
    'baseColorFactor': [0.8, 0.8, 0.8, 1.0]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);

var animationController = gui.add(options, 'visible');
animationController.onChange(function (value) {
  if (!value) {
    gltflayer.hide();
  } else {
    gltflayer.show();
  }
});
