/* globals AFRAME THREE */
AFRAME.registerComponent('brush', {
  schema: {
    color: {type: 'color', default: '#ef2d5e'},
    size: {default: 0.01, min: 0.001, max: 0.3},
    brush: {default: 'smooth'},
    enabled: { default: true }
  },
  init: function () {
    var data = this.data;
    this.color = new THREE.Color(data.color);

    this.el.emit('brushcolor-changed', {color: this.color});
    this.el.emit('brushsize-changed', {brushSize: data.size});

    this.active = false;
    this.obj = this.el.object3D;

    this.currentStroke = null;
    this.strokeEntities = [];

    this.sizeModifier = 0.0;
    this.textures = {};
    this.currentMap = 0;

    this.model = this.el.getObject3D('mesh');
    this.drawing = false;

    var self = this;

    this.previousAxis = 0;
/*
    this.el.addEventListener('axismove', function (evt) {
      if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0 || this.previousAxis === evt.detail.axis[1]) {
        return;
      }

      this.previousAxis = evt.detail.axis[1];
      var size = (evt.detail.axis[1] + 1) / 2 * self.schema.size.max;

      self.el.setAttribute('brush', 'size', size);
    });
*/
    this.el.addEventListener('undo', function(evt) {
      if (!self.data.enabled) { return; }
      self.system.undo();
      document.getElementById('ui_undo').play();
    });

    this.el.addEventListener('paint', function (evt) {
      console.log("brush paint");

      if (!self.data.enabled) { return; }
      // Trigger
      var value = evt.detail.value;
      self.sizeModifier = value;
      if (value > 0.1) {
        if (!self.active) {
          self.startNewStroke();
          self.active = true;
        }
      } else {
        if (self.active) {
          self.previousEntity = self.currentEntity;
          self.currentStroke = null;
        }
        self.active = false;
      }
    });
  },
  update: function (oldData) {
    console.log("brush update");

    var data = this.data;
    if (oldData.color !== data.color) {
      this.color.set(data.color);
      this.el.emit('brushcolor-changed', {color: this.color});
    }
    if (oldData.size !== data.size) {
      this.el.emit('brushsize-changed', {size: data.size});
    }
  },
  tick: (function () {
    console.log("brush tick 1");

    var position = new THREE.Vector3();
    var rotation = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    var mirror = new THREE.Vector3();
    mirror.x = 1;
    mirror.y = 1;
    mirror.z = 1;

    return function tick (time, delta) {
      if (this.currentStroke && this.active) {
        console.log("brush tick 2");

        this.obj.matrixWorld.decompose(position, rotation, scale);
        var pointerPosition = this.system.getPointerPosition(position, rotation);
        // position = Utils.mirrorVector(position, mirror); //TODO Check correctness
        // rotation = Utils.mirrorQuaternion(rotation, mirror); //TODO Check correctness
        // pointerPosition = Utils.mirrorVector(pointerPosition, mirror); //TODO Check correctness
        //TODO Does scale need to be mirrored?
        //scale = Utils.mirrorVector(scale, mirror); //TODO Check correctness
        this.currentStroke.addPoint(position, rotation, pointerPosition, this.sizeModifier, time);
      }
    };
  })(),
  startNewStroke: function () {
    console.log("brush startNewStroke");

    document.getElementById('ui_paint').play();
    this.currentStroke = this.system.addNewStroke(this.data.brush, this.color, this.data.size);
    this.el.emit('stroke-started', {entity: this.el, stroke: this.currentStroke});
  }
});