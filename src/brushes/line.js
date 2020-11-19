/* globals AFRAME THREE */
var sharedBufferGeometryManager = require('../sharedbuffergeometrymanager.js');
var onLoaded = require('../onloaded.js');

(function () {

  var geometryManager = null;

  // var symmetries = [
  //   new THREE.Matrix4().compose(new THREE.Vector3(0,0,0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0*2*Math.PI/3), new THREE.Vector3(1,1,1)),
  //   new THREE.Matrix4().compose(new THREE.Vector3(0,0,0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 1*2*Math.PI/3), new THREE.Vector3(1,1,1)),
  //   new THREE.Matrix4().compose(new THREE.Vector3(0,0,0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 2*2*Math.PI/3), new THREE.Vector3(1,1,1)),
  //   new THREE.Matrix4().compose(new THREE.Vector3(0,1,0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.5*2*Math.PI/3), new THREE.Vector3(1,-1,1)),
  //   new THREE.Matrix4().compose(new THREE.Vector3(0,1,0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 1.5*2*Math.PI/3), new THREE.Vector3(1,-1,1)),
  //   new THREE.Matrix4().compose(new THREE.Vector3(0,1,0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 2.5*2*Math.PI/3), new THREE.Vector3(1,-1,1)),
  // ];
  var symmetries = [
    new THREE.Matrix3().set(
      0.9259428461995696, 0.2149776895326064, 0.3105067448141228,
      0.3756218206548338, -0.4388461146315772, -0.8162856947911782,
      -0.03921853413614937, 0.8724670083596234, -0.4870967315679924),
       new THREE.Matrix3().set(
      -0.07193798232053036, -0.941832207152877, 0.3282941063576866,
      -0.25430098340885227, 0.3355883905090533, 0.9070344216141051,
      -0.9644459220386293, -0.018235287907901992, -0.26365040818852203),
       new THREE.Matrix3().set(
      -0.1671458376140611, 0.11831614614641599, -0.9788072121359517,
      0.11831614614641617, -0.9831918827194945, -0.139050391281563,
      -0.9788072121359518, -0.13905039128156305, 0.15033772033355544),
       new THREE.Matrix3().set(
      -0.42074646176030184, -0.805600957596985, 0.4171085135009922,
      0.8718409321823114, -0.4861591850328685, -0.05952004519197778,
      0.2507305403967867, 0.33860942681354533, 0.9069056467931695),
       new THREE.Matrix3().set(
      0.9259428461995691, 0.37562182065483435, -0.03921853413615024,
      0.21497768953260737, -0.43884611463157686, 0.8724670083596233,
      0.3105067448141228, -0.8162856947911781, -0.4870967315679923),
       new THREE.Matrix3().set(
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0),
       new THREE.Matrix3().set(
      -0.07193798232053182, -0.25430098340885277, -0.9644459220386292,
      -0.9418322071528762, 0.33558839050905526, -0.018235287907901406,
      0.32829410635768824, 0.9070344216141044, -0.26365040818852264),
       new THREE.Matrix3().set(
      -0.4332584021187363, 0.684280120351005, 0.5865559426737865,
      -0.14498641456204162, 0.5894169091553918, -0.7947116752597445,
      -0.8895313915685971, -0.4293581536364715, -0.15615850703665476),
       new THREE.Matrix3().set(
      -0.7085468592198082, 0.6269971648922046, 0.3237837295277253,
      0.626997164892205, 0.3488461429185622, 0.6965492974570998,
      0.3237837295277244, 0.6965492974571003, -0.6402992836987543),
       new THREE.Matrix3().set(
      -0.43325840211873734, -0.14498641456204128, -0.8895313915685956,
      0.6842801203510042, 0.589416909155391, -0.42935815363647223,
      0.5865559426737859, -0.7947116752597441, -0.15615850703665543),
       new THREE.Matrix3().set(
      -0.12430730316613264, -0.7453133110386223, 0.6550234826082263,
      -0.7453133110386222, -0.3656542601990667, -0.5574989061755363,
      0.6550234826082263, -0.5574989061755361, -0.5100384366348008),
       new THREE.Matrix3().set(
      -0.4207464617603007, 0.8718409321823125, 0.25073054039678594,
      -0.8056009575969859, -0.48615918503286715, 0.33860942681354594,
      0.417108513500992, -0.05952004519197761, 0.90690564679317)
          ];
  for (var i in symmetries) {
    var m4 = new THREE.Matrix4();
    var s = 0;
    var t = 0;
    symmetries[i] = symmetries[i].transpose();
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        m4.elements[t+k] = symmetries[i].elements[s+k];
      }
      s+=3;
      t+=4;
    }
    var dy = 1;
    symmetries[i] = new THREE.Matrix4().makeTranslation(0,dy,0).multiply(m4).multiply(new THREE.Matrix4().makeTranslation(0,-dy,0));
  }

  onLoaded(function () {
    var optionsBasic = {
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide
    };

    var optionsStandard = {
      roughness: 0.75,
      metalness: 0.25,
      vertexColors: THREE.VertexColors,
      map: window.atlas.map,
      side: THREE.DoubleSide
    };

    var optionTextured = {
      roughness: 0.75,
      metalness: 0.25,
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      map: window.atlas.map,
      transparent: true,
      alphaTest: 0.5
    };

    for (var i in symmetries) {
      sharedBufferGeometryManager.addSharedBuffer('strip-flat-'+i, new THREE.MeshBasicMaterial(optionsBasic), THREE.TriangleStripDrawMode);
      sharedBufferGeometryManager.addSharedBuffer('strip-shaded-'+i, new THREE.MeshStandardMaterial(optionsStandard), THREE.TriangleStripDrawMode);
      sharedBufferGeometryManager.addSharedBuffer('strip-textured-'+i, new THREE.MeshStandardMaterial(optionTextured), THREE.TriangleStripDrawMode);
    }
  });

  var line = {

    init: function (color, brushSize) {
      this.buffers = [];
      this.idxs = [];
      this.prevIdxs = [];
      for (var i in symmetries) {
        var buffer = sharedBufferGeometryManager.getSharedBuffer('strip-' + this.materialOptions.type + "-" + i);
        buffer.restartPrimitive();
        this.buffers.push(buffer);

        this.prevIdxs.push(Object.assign({}, this.buffers[i].idx));
        this.idxs.push(Object.assign({}, this.buffers[i].idx));
        }

      this.first = true;
    },
    remove: function () {
      for (var i in this.buffers) {
        console.log("remove " + this.prevIdxs[i] + " - " + this.idxs[i]);
        this.buffers[i].remove(this.prevIdxs[i], this.idxs[i]);
      }
    },
    undo: function () {
      for (var i in this.buffers) {
        console.log("undo " + this.prevIdxs[i]);
        this.buffers[i].undo(this.prevIdxs[i]);
      }
    },
    addPoint: (function () {
      var direction = new THREE.Vector3();

      return function (position, orientation, pointerPosition, pressure, timestamp) {
        console.log("AddPoint line");
        var converter = this.materialOptions.converter;

        direction.set(1, 0, 0);
        direction.applyQuaternion(orientation);
        direction.normalize();

        var posA = pointerPosition.clone();
        var posB = pointerPosition.clone();
        var brushSize = this.data.size * pressure;
        posA.add(direction.clone().multiplyScalar(brushSize / 2));
        posB.add(direction.clone().multiplyScalar(-brushSize / 2));

        var first = this.first;

        for (var i in symmetries) {
          var symmetry = symmetries[i];
          var buffer = this.buffers[i];
          var transA = posA.clone().applyMatrix4(symmetry);
          var transB = posB.clone().applyMatrix4(symmetry);
          if (this.first && this.prevIdxs[i].position > 0) {
            // Degenerated triangle
            first = false;
            buffer.addVertex(transA.x, transA.y, transA.z);
            buffer.idx.normal++;
            buffer.idx.color++;
            buffer.idx.uv++;

            this.idxs[i] = Object.assign({}, buffer.idx);
          }

          /*
            2---3
            | \ |
            0---1
          */
          buffer.addVertex(transA.x, transA.y, transA.z);
          buffer.addVertex(transB.x, transB.y, transB.z);
          buffer.idx.normal += 2;

          buffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);
          buffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);

          if (this.materialOptions.type === 'textured') {
            buffer.idx.uv += 2;
            var uvs = buffer.current.attributes.uv.array;
            var u, offset;
            for (var i = 0; i < this.data.numPoints + 1; i++) {
              u = i / this.data.numPoints;
              offset = 4 * i;
              if (this.prevIdxs[i].uv !== 0) { //TODO is this correct idx?
                offset += (this.prevIdxs[i].uv + 1) * 2;
              }

              uvs[offset] = converter.convertU(u);
              uvs[offset + 1] = converter.convertV(0);

              uvs[offset + 2] = converter.convertU(u);
              uvs[offset + 3] = converter.convertV(1);
            }
          }

          this.idxs[i] = Object.assign({}, buffer.idx); //TODO Might be problematic

          buffer.update();
        }
        this.first = first;

        this.computeStripVertexNormals();
        return true;
      };
    })(),

    computeStripVertexNormals: (function () {
      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();
      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();

      return function () {
        for (var i in symmetries) {
          var buffer = this.buffers[i];
          var start = this.prevIdxs[i].position === 0 ? 0 : (this.prevIdxs[i].position + 1) * 3;
          var end = (this.idxs[i].position) * 3;
          var vertices = buffer.current.attributes.position.array;
          var normals = buffer.current.attributes.normal.array;

          for (var i = start; i <= end; i++) {
            normals[i] = 0;
          }
  
          var pair = true;
          for (i = start; i < end - 6; i += 3) {
            if (pair) {
              pA.fromArray(vertices, i);
              pB.fromArray(vertices, i + 3);
              pC.fromArray(vertices, i + 6);
            } else {
              pB.fromArray(vertices, i);
              pC.fromArray(vertices, i + 6);
              pA.fromArray(vertices, i + 3);
            }
            pair = !pair;
  
            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);
            cb.normalize();
  
            normals[i] += cb.x;
            normals[i + 1] += cb.y;
            normals[i + 2] += cb.z;
  
            normals[i + 3] += cb.x;
            normals[i + 4] += cb.y;
            normals[i + 5] += cb.z;
  
            normals[i + 6] += cb.x;
            normals[i + 7] += cb.y;
            normals[i + 8] += cb.z;
          }
  
          /*
          first and last vertice (0 and 8) belongs just to one triangle
          second and penultimate (1 and 7) belongs to two triangles
          the rest of the vertices belongs to three triangles
  
            1_____3_____5_____7
            /\    /\    /\    /\
           /  \  /  \  /  \  /  \
          /____\/____\/____\/____\
          0    2     4     6     8
          */
  
          // Vertices that are shared across three triangles
          for (i = start + 2 * 3; i < end - 2 * 3; i++) {
            normals[i] = normals[i] / 3;
          }
  
          // Second and penultimate triangle, that shares just two triangles
          normals[start + 3] = normals[start + 3] / 2;
          normals[start + 3 + 1] = normals[start + 3 + 1] / 2;
          normals[start + 3 + 2] = normals[start + 3 * 1 + 2] / 2;
  
          normals[end - 2 * 3] = normals[end - 2 * 3] / 2;
          normals[end - 2 * 3 + 1] = normals[end - 2 * 3 + 1] / 2;
          normals[end - 2 * 3 + 2] = normals[end - 2 * 3 + 2] / 2;
        }
      };
    })()
  };

  var lines = [
    {
      name: 'flat',
      materialOptions: {
        type: 'flat'
      },
      thumbnail: 'brushes/thumb_flat.gif'
    },
    {
      name: 'smooth',
      materialOptions: {
        type: 'shaded'
      },
      thumbnail: 'brushes/thumb_smooth.gif'
    },
    {
      name: 'squared-textured',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/squared_textured.png'
      },
      thumbnail: 'brushes/thumb_squared_textured.gif'
    },
    {
      name: 'line-gradient',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_gradient.png'
      },
      thumbnail: 'brushes/thumb_line_gradient.gif'
    },
    {
      name: 'silky-flat',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/silky_flat.png'
      },
      thumbnail: 'brushes/thumb_silky_flat.gif'
    },
    {
      name: 'silky-textured',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/silky_textured.png'
      },
      thumbnail: 'brushes/thumb_silky_textured.gif'
    },
    {
      name: 'lines1',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines1.png'
      },
      thumbnail: 'brushes/thumb_lines1.gif'
    },
    {
      name: 'lines2',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines2.png'
      },
      thumbnail: 'brushes/thumb_lines2.gif'
    },
    {
      name: 'lines3',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines3.png'
      },
      thumbnail: 'brushes/thumb_lines3.gif'
    },
    {
      name: 'lines4',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines4.png'
      },
      thumbnail: 'brushes/thumb_lines4.gif'
    },
    {
      name: 'lines5',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines5.png'
      },
      thumbnail: 'brushes/thumb_lines5.gif'
    },
    {
      name: 'line-grunge1',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_grunge1.png'
      },
      thumbnail: 'brushes/thumb_line_grunge1.gif'
    },
    {
      name: 'line-grunge2',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_grunge2.png'
      },
      thumbnail: 'brushes/thumb_line_grunge2.gif'
    },
    {
      name: 'line-grunge3',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_grunge3.png'
      },
      thumbnail: 'brushes/thumb_line_grunge3.gif'
    }
  ];

  for (var i = 0; i < lines.length; i++) {
    var definition = lines[i];
    if (definition.materialOptions.textureSrc) {
      definition.materialOptions.converter = window.atlas.getUVConverters(definition.materialOptions.textureSrc);
    } else {
      definition.materialOptions.converter = window.atlas.getUVConverters(null);
    }

    AFRAME.registerBrush(definition.name, Object.assign({}, line, {materialOptions: definition.materialOptions}), {thumbnail: definition.thumbnail, maxPoints: 3000});
  }
})();
