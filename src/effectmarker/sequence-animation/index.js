var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 10,
  pitch: 75,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var effectlayer = new maptalks.EffectLayer('effectlayer').addTo(map);
var image = new Image();
image.src = '../../../../resource/image/storm_fire.png';
image.onload = function () {
  var texture =  new maptalksgl.reshader.Texture2D({
    data : image,
    mag: 'linear'
  });
  new maptalks.EffectMarker(map.getCenter(), {
    symbol : {
      animation : true,
      loop : true,
      url: '../../../../resource/gltf/plane/scene.glb',
      effect : 'sequence',
      speed : 2,
      scale : [3, 3, 3],
      rotation : [0, 0, 0],
      uniforms : {
        texture: texture,
        width : 8,
        height : 8
      }
    }
  }).addTo(effectlayer);
};
