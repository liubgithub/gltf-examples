var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 12,
  pitch: 75,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var effectlayer = new maptalks.EffectLayer('effectlayer').addTo(map);
var image = new Image();
image.src = '../../../../resource/image/guangshu.png';
image.onload = function () {
  var texture =  new maptalksgl.reshader.Texture2D({
    data : image,
    mag: 'linear'
  });
  new maptalks.EffectMarker(map.getCenter(), {
    symbol : {
      animation : true,
      loop : true,
      effect : 'uv',
      url : '../../../../resource/gltf/guangshu/scene.glb',
      speed : 0.05,
      rotation : [90, 0, 90],
      translation : [0, 0, 0],
      transparent : true,
      scale : [1, 1, 1],
      uniforms : {
        texture: texture,
        width : 1,
        height : 1
      }
    }
  }).addTo(effectlayer);
};
