var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var url = '../../../../resource/gltf/Duck/Duck.glb';
var vert = `
  attribute vec3 aPosition;
  uniform mat4 projViewMatrix;
  uniform mat4 modelMatrix;
  uniform vec3 color;
  varying vec3 vColor;
  void main()
  {
    gl_Position = projViewMatrix * modelMatrix * vec4(aPosition, 1.0);
    vColor = color;
  }
`;

const frag = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;
maptalks.GLTFLayer.registerShader('myShader', 'MeshShader', ['color']);
var symbol = {
  url: url,
  animation: true,
  loop: true,
  shader: 'myShader',
  rotation: [90, 0, 0],
  uniforms: {
    'color': [0.0, 1.0, 0.3]
  }
};

var gltflayer = new maptalks.GLTFLayer('gltf').addTo(map);
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
});

gltflayer.addMarker(gltfmarker);
