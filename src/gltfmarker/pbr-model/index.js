var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 10,
  pitch: 60,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var url = '../../../../resource/gltf/running_tiger/scene.gltf';

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
//phong光照作为对比
new maptalks.GLTFMarker(position.add(0.1, 0), {
  symbol : {
    url : url,
    animation : true,
    loop : true,
    rotation: [90, 0, 0]
  }
}).addTo(gltflayer)

new maptalks.GLTFMarker(position, {
        symbol : {
          url : url,
          animation : true,
          loop : true,
          shader : 'pbr',
          rotation: [90, 0, 0],
          uniforms
        }
    }).addTo(gltflayer);

