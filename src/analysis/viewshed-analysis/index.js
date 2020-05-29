var map = new maptalks.Map('map', {
  center : [119.99685208964343, 30.002385656037262],
  zoom: 15,
  pitch: 61,
  bearing: -167.40000000000032,
  lights: {
    ambient: {
        color: [0.1, 0.1, 0.1]
    },
    directional: {
        color: [1, 1, 1],
        direction: [0, 1, -1],
    }
  },
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
var url = '../../../../resource/gltf/city_model/scene.gltf';
var symbol = {
  url: url,
  visible : options.visible,
  rotation: [90, 0, 0],
  scale: [0.01, 0.01, 0.01],
  uniforms:{
    lightAmbient: [0.4, 0.4, 0.4]
  }
};
const sceneConfig = {
};
var gltflayer = new maptalks.GLTFLayer('gltf');
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  outline: true,
  symbol: symbol
}).addTo(gltflayer);
let eyePos = [120.0009522573404865398, 30.00935295484572407, 0];
let lookPoint = [120, 30, 0];
let verticalAngle = 60;
let horizonAngle = 30;
const gllayer = new maptalks.GroupGLLayer('group', [gltflayer],  { sceneConfig }).addTo(map);
const analysisOptions = {
  eyePos,
  lookPoint,
  verticalAngle,
  horizonAngle
};
const analysis = new maptalks.ViewshedAnalysis(analysisOptions).addTo(gllayer);

AddGUI();

function AddGUI() {
  var gui = new dat.GUI( { width: 350 } );
  const config = {
      enableAnalysis: true,
      lookPointX: lookPoint[0],
      lookPointY: lookPoint[1],
      lookPointZ: lookPoint[2],
      eyePosX: eyePos[0],
      eyePosY: eyePos[1],
      eyePosZ: eyePos[2],
      verticalAngle: verticalAngle,
      horizonAngle: horizonAngle
  };

  var AnalysisController = gui.add(config, "enableAnalysis");
  AnalysisController.onChange(function (value) {
    if (value) {
      analysis.addTo(gllayer);
    } else {
      analysis.remove();
    }
  });

  var verticalController = gui.add(config, "verticalAngle", 0, 180);
  verticalController.onChange(function (value) {
    analysisOptions.verticalAngle = value;
    analysis.update('verticalAngle', value);
  });

  var horizonController = gui.add(config, "horizonAngle", 0, 180);
  horizonController.onChange(function (value) {
    analysisOptions.horizonAngle = value;
    analysis.update('horizonAngle', value);
  });

  var lookPos = gui.addFolder('lookPoint');
  var lookPosX = lookPos.add(config, 'lookPointX');
  lookPosX.onFinishChange(function (value) {
    analysisOptions.lookPoint[0] = value;
    analysis.update('lookPoint', analysisOptions.lookPoint);
  });
  var lookPosY = lookPos.add(config, 'lookPointY');
  lookPosY.onFinishChange(function (value) {
    analysisOptions.lookPoint[1] = value;
    analysis.update('lookPoint', analysisOptions.lookPoint);
  });
  var lookPosZ = lookPos.add(config, 'lookPointZ');
  lookPosZ.onFinishChange(function (value) {
    analysisOptions.lookPoint[2] = value;
    analysis.update('lookPoint', analysisOptions.lookPoint);
  });
  ////
  var eyePosition = gui.addFolder('eyePosition');
  var eyePosX = eyePosition.add(config, 'eyePosX');
  eyePosX.onFinishChange(function (value) {
    analysisOptions.eyePos[0] = value;
    analysis.update('eyePos', analysisOptions.eyePos);
  });
  var eyePosY = eyePosition.add(config, 'eyePosX');
  eyePosY.onFinishChange(function (value) {
    analysisOptions.eyePos[1] = value;
    analysis.update('eyePos', analysisOptions.eyePos);
  });
  var eyePosZ = eyePosition.add(config, 'eyePosZ');
  eyePosZ.onFinishChange(function (value) {
    analysisOptions.eyePos[2] = value;
    analysis.update('eyePos', analysisOptions.eyePos);
  });
}
