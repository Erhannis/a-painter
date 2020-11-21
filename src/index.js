require('./utils.js');

require('./systems/ui.js');
require('./systems/painter.js');

require('./components/json-model.js');
require('./components/paint-controls.js');
require('./components/ui.js');
require('./components/ui-raycaster.js');

require('./components/hand-menu.js');
var json = require('../examples/hand_ui.json');
console.log("loaded json");
console.log(json);