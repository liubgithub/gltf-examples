var map = new maptalks.Map('map', {
  center : [119.99770564181154, 30.00793074487919],
  zoom: 16,
  pitch: 80,
  bearing: -177.60000000000082,
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
const gllayer = new maptalks.GroupGLLayer('group', [gltflayer],  { sceneConfig }).addTo(map);
const analysisOptions = {
  lineColor: [0,0,1],
  lineWidth: 1.2
};
const analysis = new maptalks.SkylineAnalysis(analysisOptions);
analysis.addTo(gllayer);

AddGUI();

function AddGUI() {
  var gui = new dat.GUI( { width: 350 } );
  const config = {
    enableAnalysis: true,
    lineColor: [analysisOptions.lineColor[0] * 255, analysisOptions.lineColor[1] * 255, analysisOptions.lineColor[2] * 255],
    lineWidth: analysisOptions.lineWidth
  };

  //开启分析功能
  var AnalysisController = gui.add(config, "enableAnalysis");
  AnalysisController.onChange(function (value) {
    if (value) {
      analysis.addTo(gllayer);
    } else {
      analysis.remove();
    }
  });

  var lineColorController = gui.addColor(config, 'lineColor');
  lineColorController.onChange(function (value) {
    analysisOptions.lineColor = [value[0] / 255, value[1] / 255, value[2] / 255];
    analysis.update('lineColor', analysisOptions.lineColor);
  });

  var lineWidthController = gui.add(config, "lineWidth", 0.1, 3);
  lineWidthController.onChange(function (value) {
    analysisOptions.lineWidth = value;
    analysis.update('lineWidth', value);
  });
}
