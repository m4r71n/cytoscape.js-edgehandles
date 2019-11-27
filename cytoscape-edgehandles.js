(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash.memoize"), require("lodash.throttle"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash.memoize", "lodash.throttle"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeEdgehandles"] = factory(require("lodash.memoize"), require("lodash.throttle"));
	else
		root["cytoscapeEdgehandles"] = factory(root["_"]["memoize"], root["_"]["throttle"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.filter(function (src) {
    return src != null;
  }).forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Edgehandles = __webpack_require__(10);
var assign = __webpack_require__(0);

module.exports = function (options) {
  var cy = this;

  return new Edgehandles(assign({ cy: cy }, options));
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function disableGestures() {
  this.saveGestureState();

  this.cy.zoomingEnabled(false).panningEnabled(false).boxSelectionEnabled(false);

  if (this.options.disableBrowserGestures) {
    var wlOpts = this.windowListenerOptions;

    window.addEventListener('touchstart', this.preventDefault, wlOpts);
    window.addEventListener('touchmove', this.preventDefault, wlOpts);
    window.addEventListener('wheel', this.preventDefault, wlOpts);
  }

  return this;
}

function resetGestures() {
  this.cy.zoomingEnabled(this.lastZoomingEnabled).panningEnabled(this.lastPanningEnabled).boxSelectionEnabled(this.lastBoxSelectionEnabled);

  if (this.options.disableBrowserGestures) {
    var wlOpts = this.windowListenerOptions;

    window.removeEventListener('touchstart', this.preventDefault, wlOpts);
    window.removeEventListener('touchmove', this.preventDefault, wlOpts);
    window.removeEventListener('wheel', this.preventDefault, wlOpts);
  }

  return this;
}

function saveGestureState() {
  var cy = this.cy;


  this.lastPanningEnabled = cy.panningEnabled();
  this.lastZoomingEnabled = cy.zoomingEnabled();
  this.lastBoxSelectionEnabled = cy.boxSelectionEnabled();

  return this;
}

module.exports = { disableGestures: disableGestures, resetGestures: resetGestures, saveGestureState: saveGestureState };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function addCytoscapeListeners() {
  var _this = this;

  var cy = this.cy,
      options = this.options;

  // grabbing nodes

  this.addListener(cy, 'drag', function () {
    return _this.grabbingNode = true;
  });
  this.addListener(cy, 'free', function () {
    return _this.grabbingNode = false;
  });

  // show handle on hover
  this.addListener(cy, 'mouseover', 'node', function (e) {
    _this.show(e.target);
  });

  // hide handle on tap handle
  this.addListener(cy, 'tap', 'node', function (e) {
    var node = e.target;

    if (!node.same(_this.handleNode)) {
      _this.show(node);
    }
  });

  // hide handle when source node moved
  this.addListener(cy, 'position', 'node', function (e) {
    if (e.target.same(_this.sourceNode)) {
      _this.hide();
    }
  });

  // start on tapstart handle
  // start on tapstart node (draw mode)
  // toggle on source node
  this.addListener(cy, 'tapstart', 'node', function (e) {
    var node = e.target;

    if (node.same(_this.handleNode)) {
      _this.start(_this.sourceNode);
    } else if (_this.drawMode) {
      _this.start(node);
    } else if (node.same(_this.sourceNode)) {
      _this.hide();
    }
  });

  // update line on drag
  this.addListener(cy, 'tapdrag', function (e) {
    _this.update(e.position);
  });

  // hover over preview
  this.addListener(cy, 'tapdragover', 'node', function (e) {
    if (options.snap) {
      // then ignore events like mouseover
    } else {
      _this.preview(e.target);
    }
  });

  // hover out unpreview
  this.addListener(cy, 'tapdragout', 'node', function (e) {
    if (options.snap) {
      // then keep the preview
    } else {
      _this.unpreview(e.target);
    }
  });

  // stop gesture on tapend
  this.addListener(cy, 'tapend', function () {
    _this.stop();
  });

  // hide handle if source node is removed
  this.addListener(cy, 'remove', function (e) {
    if (e.target.same(_this.sourceNode)) {
      _this.hide();
    }
  });

  return this;
}

module.exports = { addCytoscapeListeners: addCytoscapeListeners };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-unused-vars */
var defaults = {
  preview: true, // whether to show added edges preview before releasing selection
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
  snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  handlePosition: function handlePosition(node) {
    return 'middle top'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
  },
  handleInDrawMode: false, // whether to show the handle in draw mode
  edgeType: function edgeType(sourceNode, targetNode) {
    // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
    // returning null/undefined means an edge can't be added between the two nodes
    return 'flat';
  },
  loopAllowed: function loopAllowed(node) {
    // for the specified node, return whether edges from itself to itself are allowed
    return true;
  },
  nodeLoopOffset: -50, // offset for edgeType: 'node' loops
  nodeParams: function nodeParams(sourceNode, targetNode) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for intermediary node
    return {};
  },
  edgeParams: function edgeParams(sourceNode, targetNode, i) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    // NB: i indicates edge index in case of edgeType: 'node'
    return {};
  },
  ghostEdgeParams: function ghostEdgeParams() {
    // return element object to be passed to cy.add() for the ghost edge
    // (default classes are always added for you)
    return {};
  },
  show: function show(sourceNode) {
    // fired when handle is shown
  },
  hide: function hide(sourceNode) {
    // fired when the handle is hidden
  },
  start: function start(sourceNode) {
    // fired when edgehandles interaction starts (drag on handle)
  },
  complete: function complete(sourceNode, targetNode, addedEles) {
    // fired when edgehandles is done and elements are added
  },
  stop: function stop(sourceNode) {
    // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
  },
  cancel: function cancel(sourceNode, cancelledTargets) {
    // fired when edgehandles are cancelled (incomplete gesture)
  },
  hoverover: function hoverover(sourceNode, targetNode) {
    // fired when a target is hovered
  },
  hoverout: function hoverout(sourceNode, targetNode) {
    // fired when a target isn't hovered anymore
  },
  previewon: function previewon(sourceNode, targetNode, previewEles) {
    // fired when preview is shown
  },
  previewoff: function previewoff(sourceNode, targetNode, previewEles) {
    // fired when preview is hidden
  },
  drawon: function drawon() {
    // fired when draw mode enabled
  },
  drawoff: function drawoff() {
    // fired when draw mode disabled
  }
};
/* eslint-enable */

module.exports = defaults;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function toggleDrawMode(bool) {
  var cy = this.cy,
      options = this.options;


  this.drawMode = bool != null ? bool : !this.drawMode;

  if (this.drawMode) {
    this.prevUngrabifyState = cy.autoungrabify();

    cy.autoungrabify(true);

    if (!options.handleInDrawMode && this.handleShown()) {
      this.hide();
    }

    this.emit('drawon');
  } else {
    cy.autoungrabify(this.prevUngrabifyState);

    this.emit('drawoff');
  }

  return this;
}

function enableDrawMode() {
  return this.toggleDrawMode(true);
}

function disableDrawMode() {
  return this.toggleDrawMode(false);
}

module.exports = { toggleDrawMode: toggleDrawMode, enableDrawMode: enableDrawMode, disableDrawMode: disableDrawMode };

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var assign = __webpack_require__(0);
var isString = function isString(x) {
  return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === _typeof('');
};
var isArray = function isArray(x) {
  return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === _typeof([]) && x.length != null;
};

function getEleJson(overrides, params, addedClasses) {
  var json = {};

  // basic values
  assign(json, params, overrides);

  // make sure params can specify data but that overrides take precedence
  assign(json.data, params.data, overrides.data);

  if (isString(params.classes)) {
    json.classes = params.classes + ' ' + addedClasses;
  } else if (isArray(params.classes)) {
    json.classes = params.classes.join(' ') + ' ' + addedClasses;
  } else {
    json.classes = addedClasses;
  }

  return json;
}

function makeEdges() {
  var preview = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var cy = this.cy,
      options = this.options,
      presumptiveTargets = this.presumptiveTargets,
      previewEles = this.previewEles,
      active = this.active;


  var source = this.sourceNode;
  var target = this.targetNode;
  var classes = preview ? 'eh-preview' : '';
  var added = cy.collection();
  var edgeType = options.edgeType(source, target);

  // can't make edges outside of regular gesture lifecycle
  if (!active) {
    return;
  }

  // must have a non-empty edge type
  if (!edgeType) {
    return;
  }

  // can't make preview if disabled
  if (preview && !options.preview) {
    return;
  }

  // detect cancel
  if (!target || target.size() === 0) {
    previewEles.remove();

    this.emit('cancel', this.mp(), source, presumptiveTargets);

    return;
  }

  // just remove preview class if we already have the edges
  if (!preview && options.preview) {
    previewEles.removeClass('eh-preview').style('events', '');

    this.emit('complete', this.mp(), source, target, previewEles);

    return;
  }

  var p1 = source.position();
  var p2 = target.position();

  var p = void 0;
  if (source.same(target)) {
    p = {
      x: p1.x + options.nodeLoopOffset,
      y: p1.y + options.nodeLoopOffset
    };
  } else {
    p = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }

  if (edgeType === 'node') {
    var interNode = cy.add(getEleJson({
      group: 'nodes',
      position: p
    }, options.nodeParams(source, target), classes));

    var source2inter = cy.add(getEleJson({
      group: 'edges',
      data: {
        source: source.id(),
        target: interNode.id()
      }
    }, options.edgeParams(source, target, 0), classes));

    var inter2target = cy.add(getEleJson({
      group: 'edges',
      data: {
        source: interNode.id(),
        target: target.id()
      }
    }, options.edgeParams(source, target, 1), classes));

    added = added.merge(interNode).merge(source2inter).merge(inter2target);
  } else {
    // flat
    var source2target = cy.add(getEleJson({
      group: 'edges',
      data: {
        source: source.id(),
        target: target.id()
      }
    }, options.edgeParams(source, target, 0), classes));

    added = added.merge(source2target);
  }

  if (preview) {
    this.previewEles = added;

    added.style('events', 'no');
  } else {
    added.style('events', '');

    this.emit('complete', this.mp(), source, target, added);
  }

  return this;
}

function makePreview() {
  this.makeEdges(true);

  return this;
}

function previewShown() {
  return this.previewEles.nonempty() && this.previewEles.inside();
}

function removePreview() {
  if (this.previewShown()) {
    this.previewEles.remove();
  }

  return this;
}

function handleShown() {
  return this.handleNode.nonempty() && this.handleNode.inside();
}

function removeHandle() {
  if (this.handleShown()) {
    this.handleNode.remove();
  }

  return this;
}

function setHandleFor(node) {
  var _this = this;

  var options = this.options,
      cy = this.cy;


  var handlePosition = _typeof(options.handlePosition) === _typeof('') ? function () {
    return options.handlePosition;
  } : options.handlePosition;

  var p = node.position();
  var h = node.outerHeight();
  var w = node.outerWidth();

  // store how much we should move the handle from origin(p.x, p.y)
  var moveX = 0;
  var moveY = 0;

  // grab axes
  var axes = handlePosition(node).toLowerCase().split(/\s+/);
  var axisX = axes[0];
  var axisY = axes[1];

  // based on handlePosition move left/right/top/bottom. Middle/middle will just be normal
  if (axisX === 'left') {
    moveX = -(w / 2);
  } else if (axisX === 'right') {
    moveX = w / 2;
  }if (axisY === 'top') {
    moveY = -(h / 2);
  } else if (axisY === 'bottom') {
    moveY = h / 2;
  }

  // set handle x and y based on adjusted positions
  var hx = this.hx = p.x + moveX;
  var hy = this.hy = p.y + moveY;
  var pos = { x: hx, y: hy };

  if (this.handleShown()) {
    this.handleNode.position(pos);
  } else {
    cy.batch(function () {
      _this.handleNode = cy.add({
        classes: 'eh-handle',
        position: pos,
        grabbable: false,
        selectable: false
      });

      _this.handleNode.style('z-index', 9007199254740991);
    });
  }

  return this;
}

function updateEdge() {
  var _this2 = this;

  var sourceNode = this.sourceNode,
      ghostNode = this.ghostNode,
      cy = this.cy,
      mx = this.mx,
      my = this.my,
      options = this.options;

  var x = mx;
  var y = my;
  var ghostEdge = void 0,
      ghostEles = void 0;

  // can't draw a line without having the starting node
  if (!sourceNode) {
    return;
  }

  if (!ghostNode || ghostNode.length === 0 || ghostNode.removed()) {
    ghostEles = this.ghostEles = cy.collection();

    cy.batch(function () {
      ghostNode = _this2.ghostNode = cy.add({
        group: 'nodes',
        classes: 'eh-ghost eh-ghost-node',
        position: {
          x: 0,
          y: 0
        }
      });

      ghostNode.style({
        'background-color': 'blue',
        'width': 0.0001,
        'height': 0.0001,
        'opacity': 0,
        'events': 'no'
      });

      var ghostEdgeParams = options.ghostEdgeParams();

      ghostEdge = cy.add(assign({}, ghostEdgeParams, {
        group: 'edges',
        data: assign({}, ghostEdgeParams.data, {
          source: sourceNode.id(),
          target: ghostNode.id()
        }),
        classes: 'eh-ghost eh-ghost-edge'
      }));

      ghostEdge.style({
        'events': 'no'
      });
    });

    ghostEles.merge(ghostNode).merge(ghostEdge);
  }

  ghostNode.position({ x: x, y: y });

  return this;
}

module.exports = {
  makeEdges: makeEdges, makePreview: makePreview, removePreview: removePreview, previewShown: previewShown,
  updateEdge: updateEdge,
  handleShown: handleShown, setHandleFor: setHandleFor, removeHandle: removeHandle
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function disableEdgeEvents() {
  if (this.options.noEdgeEventsInDraw) {
    this.cy.edges().style('events', 'no');
  }

  return this;
}

function enableEdgeEvents() {
  if (this.options.noEdgeEventsInDraw) {
    this.cy.edges().style('events', '');
  }

  return this;
}

module.exports = { disableEdgeEvents: disableEdgeEvents, enableEdgeEvents: enableEdgeEvents };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function enable() {
  this.enabled = true;

  this.emit('enable');

  return this;
}

function disable() {
  this.enabled = false;

  this.emit('disable');

  return this;
}

module.exports = { enable: enable, disable: disable };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var memoize = __webpack_require__(13);
var sqrt2 = Math.sqrt(2);

function canStartOn(node) {
  var options = this.options,
      previewEles = this.previewEles,
      ghostEles = this.ghostEles,
      handleNode = this.handleNode;

  var isPreview = function isPreview(el) {
    return previewEles.anySame(el);
  };
  var isGhost = function isGhost(el) {
    return ghostEles.anySame(el);
  };
  var userFilter = function userFilter(el) {
    return el.filter(options.handleNodes).length > 0;
  };
  var isHandle = function isHandle(el) {
    return handleNode.same(el);
  };
  var isTemp = function isTemp(el) {
    return isPreview(el) || isHandle(el) || isGhost(el);
  };

  var enabled = this.enabled,
      active = this.active,
      grabbingNode = this.grabbingNode;


  return enabled && !active && !grabbingNode && (node == null || !isTemp(node) && userFilter(node));
}

function canStartDrawModeOn(node) {
  return this.canStartOn(node) && this.drawMode;
}

function canStartNonDrawModeOn(node) {
  return this.canStartOn(node) && !this.drawMode;
}

function show(node) {
  var options = this.options,
      drawMode = this.drawMode;


  if (!this.canStartOn(node) || drawMode && !options.handleInDrawMode) {
    return;
  }

  this.sourceNode = node;

  this.setHandleFor(node);

  this.emit('show', this.hp(), this.sourceNode);

  return this;
}

function hide() {
  this.removeHandle();

  this.emit('hide', this.hp(), this.sourceNode);

  return this;
}

function start(node) {
  if (!this.canStartOn(node)) {
    return;
  }

  this.active = true;

  this.sourceNode = node;
  this.sourceNode.addClass('eh-source');

  this.disableGestures();
  this.disableEdgeEvents();

  this.emit('start', this.hp(), node);
}

function update(pos) {
  if (!this.active) {
    return;
  }

  var p = pos;

  this.mx = p.x;
  this.my = p.y;

  this.updateEdge();
  this.throttledSnap();

  return this;
}

function snap() {
  if (!this.active || !this.options.snap) {
    return false;
  }

  var cy = this.cy;
  var tgt = this.targetNode;
  var threshold = this.options.snapThreshold;
  var mousePos = this.mp();
  var handleNode = this.handleNode,
      previewEles = this.previewEles,
      ghostNode = this.ghostNode;


  var radius = function radius(n) {
    return sqrt2 * Math.max(n.outerWidth(), n.outerHeight()) / 2;
  }; // worst-case enclosure of bb by circle
  var sqDist = function sqDist(x1, y1, x2, y2) {
    var dx = x2 - x1;var dy = y2 - y1;return dx * dx + dy * dy;
  };
  var sqDistByPt = function sqDistByPt(p1, p2) {
    return sqDist(p1.x, p1.y, p2.x, p2.y);
  };
  var nodeSqDist = function nodeSqDist(n) {
    return sqDistByPt(n.position(), mousePos);
  };

  var sqThreshold = function sqThreshold(n) {
    var r = radius(n);var t = r + threshold;return t * t;
  };
  var isWithinTheshold = function isWithinTheshold(n) {
    return nodeSqDist(n) <= sqThreshold(n);
  };

  var bbSqDist = function bbSqDist(n) {
    var p = n.position();
    var halfW = n.outerWidth() / 2;
    var halfH = n.outerHeight() / 2;

    // node and mouse positions, line is formed from node to mouse
    var nx = p.x;
    var ny = p.y;
    var mx = mousePos.x;
    var my = mousePos.y;

    // bounding box
    var x1 = nx - halfW;
    var x2 = nx + halfW;
    var y1 = ny - halfH;
    var y2 = ny + halfH;

    var insideXBounds = x1 <= mx && mx <= x2;
    var insideYBounds = y1 <= my && my <= y2;

    if (insideXBounds && insideYBounds) {
      // inside box
      return 0;
    } else if (insideXBounds) {
      // perpendicular distance to box, top or bottom
      var dy1 = my - y1;
      var dy2 = my - y2;

      return Math.min(dy1 * dy1, dy2 * dy2);
    } else if (insideYBounds) {
      // perpendicular distance to box, left or right
      var dx1 = mx - x1;
      var dx2 = mx - x2;

      return Math.min(dx1 * dx1, dx2 * dx2);
    } else if (mx < x1 && my < y1) {
      // top-left corner distance
      return sqDist(mx, my, x1, y1);
    } else if (mx > x2 && my < y1) {
      // top-right corner distance
      return sqDist(mx, my, x2, y1);
    } else if (mx < x1 && my > y2) {
      // bottom-left corner distance
      return sqDist(mx, my, x1, y2);
    } else {
      // bottom-right corner distance
      return sqDist(mx, my, x2, y2);
    }
  };

  var cmpBbSqDist = function cmpBbSqDist(n1, n2) {
    return bbSqDist(n1) - bbSqDist(n2);
  };

  var cmp = cmpBbSqDist;

  var allowHoverDelay = false;

  var mouseIsInside = function mouseIsInside(n) {
    var mp = mousePos;
    var w = n.outerWidth();
    var halfW = w / 2;
    var h = n.outerHeight();
    var halfH = h / 2;
    var p = n.position();
    var x1 = p.x - halfW;
    var x2 = p.x + halfW;
    var y1 = p.y - halfH;
    var y2 = p.y + halfH;

    return x1 <= mp.x && mp.x <= x2 && y1 <= mp.y && mp.y <= y2;
  };

  var isEhEle = function isEhEle(n) {
    return n.same(handleNode) || n.same(previewEles) || n.same(ghostNode);
  };

  var nodesByDist = cy.nodes(function (n) {
    return !isEhEle(n) && isWithinTheshold(n);
  }).sort(cmp);
  var snapped = false;

  if (tgt.nonempty() && !isWithinTheshold(tgt)) {
    this.unpreview(tgt);
  }

  for (var i = 0; i < nodesByDist.length; i++) {
    var n = nodesByDist[i];

    // skip a parent node when the mouse is inside it
    if (n.isParent() && mouseIsInside(n)) {
      continue;
    }

    // skip a child node when the mouse is not inside the parent
    if (n.isChild() && !mouseIsInside(n.parent())) {
      continue;
    }

    if (n.same(tgt) || this.preview(n, allowHoverDelay)) {
      snapped = true;
      break;
    }
  }

  return snapped;
}

function preview(target) {
  var _this = this;

  var allowHoverDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var options = this.options,
      sourceNode = this.sourceNode,
      ghostNode = this.ghostNode,
      ghostEles = this.ghostEles,
      presumptiveTargets = this.presumptiveTargets,
      previewEles = this.previewEles,
      active = this.active;

  var source = sourceNode;
  var isLoop = target.same(source);
  var loopAllowed = options.loopAllowed(target);
  var isGhost = target.same(ghostNode);
  var noEdge = !options.edgeType(source, target);
  var isHandle = target.same(this.handleNode);
  var isExistingTgt = target.same(this.targetNode);

  if (!active || isHandle || isGhost || noEdge || isExistingTgt || isLoop && !loopAllowed
  // || (target.isParent())
  ) {
      return false;
    }

  if (this.targetNode.nonempty()) {
    this.unpreview(this.targetNode);
  }

  clearTimeout(this.previewTimeout);

  var applyPreview = function applyPreview() {
    _this.targetNode = target;

    presumptiveTargets.merge(target);

    target.addClass('eh-presumptive-target');
    target.addClass('eh-target');

    _this.emit('hoverover', _this.mp(), source, target);

    if (options.preview) {
      target.addClass('eh-preview');

      ghostEles.addClass('eh-preview-active');
      sourceNode.addClass('eh-preview-active');
      target.addClass('eh-preview-active');

      _this.makePreview();

      _this.emit('previewon', _this.mp(), source, target, previewEles);
    }
  };

  if (allowHoverDelay && options.hoverDelay > 0) {
    this.previewTimeout = setTimeout(applyPreview, options.hoverDelay);
  } else {
    applyPreview();
  }

  return true;
}

function unpreview(target) {
  if (!this.active || target.same(this.handleNode)) {
    return;
  }

  var previewTimeout = this.previewTimeout,
      sourceNode = this.sourceNode,
      previewEles = this.previewEles,
      ghostEles = this.ghostEles,
      cy = this.cy;

  clearTimeout(previewTimeout);
  this.previewTimeout = null;

  var source = sourceNode;

  target.removeClass('eh-preview eh-target eh-presumptive-target eh-preview-active');
  ghostEles.removeClass('eh-preview-active');
  sourceNode.removeClass('eh-preview-active');

  this.targetNode = cy.collection();

  this.removePreview(source, target);

  this.emit('hoverout', this.mp(), source, target);
  this.emit('previewoff', this.mp(), source, target, previewEles);

  return this;
}

function stop() {
  if (!this.active) {
    return;
  }

  var sourceNode = this.sourceNode,
      targetNode = this.targetNode,
      ghostEles = this.ghostEles,
      presumptiveTargets = this.presumptiveTargets;


  clearTimeout(this.previewTimeout);

  sourceNode.removeClass('eh-source');
  targetNode.removeClass('eh-target eh-preview eh-hover');
  presumptiveTargets.removeClass('eh-presumptive-target');

  this.makeEdges();

  this.removeHandle();

  ghostEles.remove();

  this.clearCollections();

  this.resetGestures();
  this.enableEdgeEvents();

  this.active = false;

  this.emit('stop', this.mp(), sourceNode);

  return this;
}

module.exports = {
  show: show, hide: hide, start: start, update: update, preview: preview, unpreview: unpreview, stop: stop, snap: snap,
  canStartOn: canStartOn, canStartDrawModeOn: canStartDrawModeOn, canStartNonDrawModeOn: canStartNonDrawModeOn
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(4);
var assign = __webpack_require__(0);
var throttle = __webpack_require__(14);

var cyGesturesToggle = __webpack_require__(2);
var cyListeners = __webpack_require__(3);
var drawMode = __webpack_require__(5);
var drawing = __webpack_require__(6);
var enabling = __webpack_require__(8);
var gestureLifecycle = __webpack_require__(9);
var listeners = __webpack_require__(11);
var edgeEvents = __webpack_require__(7);

function Edgehandles(options) {
  var cy = options.cy;

  this.cy = cy;
  this.listeners = [];

  // edgehandles gesture state
  this.enabled = true;
  this.drawMode = false;
  this.active = false;
  this.grabbingNode = false;

  // edgehandles elements
  this.handleNode = cy.collection();
  this.clearCollections();

  // handle
  this.hx = 0;
  this.hy = 0;
  this.hr = 0;

  // mouse position
  this.mx = 0;
  this.my = 0;

  this.options = assign({}, defaults, options);

  this.saveGestureState();
  this.addListeners();

  this.throttledSnap = throttle(this.snap.bind(this), 1000 / options.snapFrequency);

  this.preventDefault = function (e) {
    return e.preventDefault();
  };

  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
      }
    });

    window.addEventListener('test', null, opts);
  } catch (err) {}

  if (supportsPassive) {
    this.windowListenerOptions = { capture: true, passive: false };
  } else {
    this.windowListenerOptions = true;
  }
}

var proto = Edgehandles.prototype = {};
var extend = function extend(obj) {
  return assign(proto, obj);
};

proto.destroy = function () {
  this.removeListeners();
};

proto.setOptions = function (options) {
  assign(this.options, options);
};

proto.mp = function () {
  return { x: this.mx, y: this.my };
};

proto.hp = function () {
  return { x: this.hx, y: this.hy };
};

proto.clearCollections = function () {
  var cy = this.cy;


  this.previewEles = cy.collection();
  this.ghostEles = cy.collection();
  this.ghostNode = cy.collection();
  this.sourceNode = cy.collection();
  this.targetNode = cy.collection();
  this.presumptiveTargets = cy.collection();
};

[cyGesturesToggle, cyListeners, drawMode, drawing, enabling, gestureLifecycle, listeners, edgeEvents].forEach(extend);

module.exports = Edgehandles;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function addListeners() {
  var _this = this;

  this.addCytoscapeListeners();

  this.addListener(this.cy, 'destroy', function () {
    return _this.destroy();
  });

  return this;
}

function removeListeners() {
  for (var i = this.listeners.length - 1; i >= 0; i--) {
    var l = this.listeners[i];

    this.removeListener(l.target, l.event, l.selector, l.callback, l.options);
  }

  return this;
}

function getListener(target, event, selector, callback, options) {
  if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) !== _typeof('')) {
    callback = selector;
    options = callback;
    selector = null;
  }

  if (options == null) {
    options = false;
  }

  return { target: target, event: event, selector: selector, callback: callback, options: options };
}

function isDom(target) {
  return target instanceof Element;
}

function addListener(target, event, selector, callback, options) {
  var l = getListener(target, event, selector, callback, options);

  this.listeners.push(l);

  if (isDom(l.target)) {
    l.target.addEventListener(l.event, l.callback, l.options);
  } else {
    if (l.selector) {
      l.target.addListener(l.event, l.selector, l.callback, l.options);
    } else {
      l.target.addListener(l.event, l.callback, l.options);
    }
  }

  return this;
}

function removeListener(target, event, selector, callback, options) {
  var l = getListener(target, event, selector, callback, options);

  for (var i = this.listeners.length - 1; i >= 0; i--) {
    var l2 = this.listeners[i];

    if (l.target === l2.target && l.event === l2.event && (l.selector == null || l.selector === l2.selector) && (l.callback == null || l.callback === l2.callback)) {
      this.listeners.splice(i, 1);

      if (isDom(l.target)) {
        l.target.removeEventListener(l.event, l.callback, l.options);
      } else {
        if (l.selector) {
          l.target.removeListener(l.event, l.selector, l.callback, l.options);
        } else {
          l.target.removeListener(l.event, l.callback, l.options);
        }
      }

      break;
    }
  }

  return this;
}

function emit(type, position) {
  var options = this.options,
      cy = this.cy;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  cy.emit({ type: 'eh' + type, position: position }, args);

  var handler = options[type];

  if (handler != null) {
    handler.apply(undefined, args);
  }

  return this;
}

module.exports = { addListener: addListener, addListeners: addListeners, removeListener: removeListener, removeListeners: removeListeners, emit: emit };

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(1);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('core', 'edgehandles', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape); // eslint-disable-line no-undef
}

module.exports = register;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyNDc1Y2MwNDg1YTdmMzk2MzgxMSIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzaWduLmpzIiwid2VicGFjazovLy8uL3NyYy9jb3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9lZGdlaGFuZGxlcy9jeS1nZXN0dXJlcy10b2dnbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VkZ2VoYW5kbGVzL2N5LWxpc3RlbmVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRnZWhhbmRsZXMvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VkZ2VoYW5kbGVzL2RyYXctbW9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRnZWhhbmRsZXMvZHJhd2luZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRnZWhhbmRsZXMvZWRnZS1ldmVudHMtdG9nZ2xlLmpzIiwid2VicGFjazovLy8uL3NyYy9lZGdlaGFuZGxlcy9lbmFibGluZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRnZWhhbmRsZXMvZ2VzdHVyZS1saWZlY3ljbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VkZ2VoYW5kbGVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9lZGdlaGFuZGxlcy9saXN0ZW5lcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwibG9kYXNoLm1lbW9pemVcIixcImNvbW1vbmpzMlwiOlwibG9kYXNoLm1lbW9pemVcIixcImFtZFwiOlwibG9kYXNoLm1lbW9pemVcIixcInJvb3RcIjpbXCJfXCIsXCJtZW1vaXplXCJdfSIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImxvZGFzaC50aHJvdHRsZVwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2gudGhyb3R0bGVcIixcImFtZFwiOlwibG9kYXNoLnRocm90dGxlXCIsXCJyb290XCI6W1wiX1wiLFwidGhyb3R0bGVcIl19Il0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJPYmplY3QiLCJhc3NpZ24iLCJiaW5kIiwidGd0Iiwic3JjcyIsImZpbHRlciIsInNyYyIsImZvckVhY2giLCJrZXlzIiwiayIsIkVkZ2VoYW5kbGVzIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJjeSIsImRpc2FibGVHZXN0dXJlcyIsInNhdmVHZXN0dXJlU3RhdGUiLCJ6b29taW5nRW5hYmxlZCIsInBhbm5pbmdFbmFibGVkIiwiYm94U2VsZWN0aW9uRW5hYmxlZCIsImRpc2FibGVCcm93c2VyR2VzdHVyZXMiLCJ3bE9wdHMiLCJ3aW5kb3dMaXN0ZW5lck9wdGlvbnMiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicHJldmVudERlZmF1bHQiLCJyZXNldEdlc3R1cmVzIiwibGFzdFpvb21pbmdFbmFibGVkIiwibGFzdFBhbm5pbmdFbmFibGVkIiwibGFzdEJveFNlbGVjdGlvbkVuYWJsZWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkQ3l0b3NjYXBlTGlzdGVuZXJzIiwiYWRkTGlzdGVuZXIiLCJncmFiYmluZ05vZGUiLCJzaG93IiwiZSIsInRhcmdldCIsIm5vZGUiLCJzYW1lIiwiaGFuZGxlTm9kZSIsInNvdXJjZU5vZGUiLCJoaWRlIiwic3RhcnQiLCJkcmF3TW9kZSIsInVwZGF0ZSIsInBvc2l0aW9uIiwic25hcCIsInByZXZpZXciLCJ1bnByZXZpZXciLCJzdG9wIiwiZGVmYXVsdHMiLCJob3ZlckRlbGF5IiwiaGFuZGxlTm9kZXMiLCJzbmFwVGhyZXNob2xkIiwic25hcEZyZXF1ZW5jeSIsIm5vRWRnZUV2ZW50c0luRHJhdyIsImhhbmRsZVBvc2l0aW9uIiwiaGFuZGxlSW5EcmF3TW9kZSIsImVkZ2VUeXBlIiwidGFyZ2V0Tm9kZSIsImxvb3BBbGxvd2VkIiwibm9kZUxvb3BPZmZzZXQiLCJub2RlUGFyYW1zIiwiZWRnZVBhcmFtcyIsImkiLCJnaG9zdEVkZ2VQYXJhbXMiLCJjb21wbGV0ZSIsImFkZGVkRWxlcyIsImNhbmNlbCIsImNhbmNlbGxlZFRhcmdldHMiLCJob3Zlcm92ZXIiLCJob3Zlcm91dCIsInByZXZpZXdvbiIsInByZXZpZXdFbGVzIiwicHJldmlld29mZiIsImRyYXdvbiIsImRyYXdvZmYiLCJ0b2dnbGVEcmF3TW9kZSIsImJvb2wiLCJwcmV2VW5ncmFiaWZ5U3RhdGUiLCJhdXRvdW5ncmFiaWZ5IiwiaGFuZGxlU2hvd24iLCJlbWl0IiwiZW5hYmxlRHJhd01vZGUiLCJkaXNhYmxlRHJhd01vZGUiLCJpc1N0cmluZyIsIngiLCJpc0FycmF5IiwibGVuZ3RoIiwiZ2V0RWxlSnNvbiIsIm92ZXJyaWRlcyIsInBhcmFtcyIsImFkZGVkQ2xhc3NlcyIsImpzb24iLCJkYXRhIiwiY2xhc3NlcyIsImpvaW4iLCJtYWtlRWRnZXMiLCJwcmVzdW1wdGl2ZVRhcmdldHMiLCJhY3RpdmUiLCJzb3VyY2UiLCJhZGRlZCIsImNvbGxlY3Rpb24iLCJzaXplIiwicmVtb3ZlIiwibXAiLCJyZW1vdmVDbGFzcyIsInN0eWxlIiwicDEiLCJwMiIsInAiLCJ5IiwiaW50ZXJOb2RlIiwiYWRkIiwiZ3JvdXAiLCJzb3VyY2UyaW50ZXIiLCJpZCIsImludGVyMnRhcmdldCIsIm1lcmdlIiwic291cmNlMnRhcmdldCIsIm1ha2VQcmV2aWV3IiwicHJldmlld1Nob3duIiwibm9uZW1wdHkiLCJpbnNpZGUiLCJyZW1vdmVQcmV2aWV3IiwicmVtb3ZlSGFuZGxlIiwic2V0SGFuZGxlRm9yIiwiaCIsIm91dGVySGVpZ2h0IiwidyIsIm91dGVyV2lkdGgiLCJtb3ZlWCIsIm1vdmVZIiwiYXhlcyIsInRvTG93ZXJDYXNlIiwic3BsaXQiLCJheGlzWCIsImF4aXNZIiwiaHgiLCJoeSIsInBvcyIsImJhdGNoIiwiZ3JhYmJhYmxlIiwic2VsZWN0YWJsZSIsInVwZGF0ZUVkZ2UiLCJnaG9zdE5vZGUiLCJteCIsIm15IiwiZ2hvc3RFZGdlIiwiZ2hvc3RFbGVzIiwicmVtb3ZlZCIsImRpc2FibGVFZGdlRXZlbnRzIiwiZWRnZXMiLCJlbmFibGVFZGdlRXZlbnRzIiwiZW5hYmxlIiwiZW5hYmxlZCIsImRpc2FibGUiLCJtZW1vaXplIiwic3FydDIiLCJNYXRoIiwic3FydCIsImNhblN0YXJ0T24iLCJpc1ByZXZpZXciLCJhbnlTYW1lIiwiZWwiLCJpc0dob3N0IiwidXNlckZpbHRlciIsImlzSGFuZGxlIiwiaXNUZW1wIiwiY2FuU3RhcnREcmF3TW9kZU9uIiwiY2FuU3RhcnROb25EcmF3TW9kZU9uIiwiaHAiLCJhZGRDbGFzcyIsInRocm90dGxlZFNuYXAiLCJ0aHJlc2hvbGQiLCJtb3VzZVBvcyIsInJhZGl1cyIsIm1heCIsIm4iLCJzcURpc3QiLCJ4MSIsInkxIiwieDIiLCJ5MiIsImR4IiwiZHkiLCJzcURpc3RCeVB0Iiwibm9kZVNxRGlzdCIsInNxVGhyZXNob2xkIiwiciIsInQiLCJpc1dpdGhpblRoZXNob2xkIiwiYmJTcURpc3QiLCJoYWxmVyIsImhhbGZIIiwibngiLCJueSIsImluc2lkZVhCb3VuZHMiLCJpbnNpZGVZQm91bmRzIiwiZHkxIiwiZHkyIiwibWluIiwiZHgxIiwiZHgyIiwiY21wQmJTcURpc3QiLCJuMSIsIm4yIiwiY21wIiwiYWxsb3dIb3ZlckRlbGF5IiwibW91c2VJc0luc2lkZSIsImlzRWhFbGUiLCJub2Rlc0J5RGlzdCIsIm5vZGVzIiwic29ydCIsInNuYXBwZWQiLCJpc1BhcmVudCIsImlzQ2hpbGQiLCJwYXJlbnQiLCJpc0xvb3AiLCJub0VkZ2UiLCJpc0V4aXN0aW5nVGd0IiwiY2xlYXJUaW1lb3V0IiwicHJldmlld1RpbWVvdXQiLCJhcHBseVByZXZpZXciLCJzZXRUaW1lb3V0IiwiY2xlYXJDb2xsZWN0aW9ucyIsInRocm90dGxlIiwiY3lHZXN0dXJlc1RvZ2dsZSIsImN5TGlzdGVuZXJzIiwiZHJhd2luZyIsImVuYWJsaW5nIiwiZ2VzdHVyZUxpZmVjeWNsZSIsImxpc3RlbmVycyIsImVkZ2VFdmVudHMiLCJociIsImFkZExpc3RlbmVycyIsInN1cHBvcnRzUGFzc2l2ZSIsIm9wdHMiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImVyciIsImNhcHR1cmUiLCJwYXNzaXZlIiwicHJvdG8iLCJwcm90b3R5cGUiLCJleHRlbmQiLCJvYmoiLCJkZXN0cm95IiwicmVtb3ZlTGlzdGVuZXJzIiwic2V0T3B0aW9ucyIsImwiLCJyZW1vdmVMaXN0ZW5lciIsImV2ZW50Iiwic2VsZWN0b3IiLCJjYWxsYmFjayIsImdldExpc3RlbmVyIiwiaXNEb20iLCJFbGVtZW50IiwicHVzaCIsImwyIiwic3BsaWNlIiwidHlwZSIsImFyZ3MiLCJoYW5kbGVyIiwiaW1wbCIsInJlZ2lzdGVyIiwiY3l0b3NjYXBlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDaEVBOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCQyxPQUFPQyxNQUFQLElBQWlCLElBQWpCLEdBQXdCRCxPQUFPQyxNQUFQLENBQWNDLElBQWQsQ0FBb0JGLE1BQXBCLENBQXhCLEdBQXVELFVBQVVHLEdBQVYsRUFBd0I7QUFBQSxvQ0FBTkMsSUFBTTtBQUFOQSxRQUFN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QUFBTkEsUUFBTTtBQUFBOztBQUd0Q3hQLEtBQUdvRSxJQUFILENBQVMsRUFBRW1MLGFBQVdBLElBQWIsRUFBcUJ4TixrQkFBckIsRUFBVCxFQUEwQ3lOLElBQTFDOztBQUVBLE1BQUlDLFVBQVUxUCxRQUFTd1AsSUFBVCxDQUFkOztBQUVBLE1BQUlFLFdBQVcsSUFBZixFQUFxQjtBQUNuQkEsNkJBQVlELElBQVo7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDRDs7QUFFRHZRLE9BQU9DLE9BQVAsR0FBaUIsRUFBRWdDLHdCQUFGLEVBQWUyTSwwQkFBZixFQUE2QmdCLDhCQUE3QixFQUE2Q0gsZ0NBQTdDLEVBQThEdEssVUFBOUQsRUFBakIsQzs7Ozs7Ozs7O0FDbkdBLElBQU1zTCxPQUFPLG1CQUFBNVAsQ0FBUSxDQUFSLENBQWI7O0FBRUE7QUFDQSxJQUFJNlAsV0FBVyxTQUFYQSxRQUFXLENBQVVDLFNBQVYsRUFBcUI7QUFDbEMsTUFBSSxDQUFDQSxTQUFMLEVBQWdCO0FBQUU7QUFBUyxHQURPLENBQ047O0FBRTVCQSxZQUFXLE1BQVgsRUFBbUIsYUFBbkIsRUFBa0NGLElBQWxDLEVBSGtDLENBR1E7QUFDM0MsQ0FKRDs7QUFNQSxJQUFJLE9BQU9FLFNBQVAsS0FBcUIsV0FBekIsRUFBc0M7QUFBRTtBQUN0Q0QsV0FBVUMsU0FBVixFQURvQyxDQUNiO0FBQ3hCOztBQUVEM1EsT0FBT0MsT0FBUCxHQUFpQnlRLFFBQWpCLEM7Ozs7OztBQ2JBLGdEOzs7Ozs7QUNBQSxnRCIsImZpbGUiOiJjeXRvc2NhcGUtZWRnZWhhbmRsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJsb2Rhc2gubWVtb2l6ZVwiKSwgcmVxdWlyZShcImxvZGFzaC50aHJvdHRsZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJsb2Rhc2gubWVtb2l6ZVwiLCBcImxvZGFzaC50aHJvdHRsZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjeXRvc2NhcGVFZGdlaGFuZGxlc1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImxvZGFzaC5tZW1vaXplXCIpLCByZXF1aXJlKFwibG9kYXNoLnRocm90dGxlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjeXRvc2NhcGVFZGdlaGFuZGxlc1wiXSA9IGZhY3Rvcnkocm9vdFtcIl9cIl1bXCJtZW1vaXplXCJdLCByb290W1wiX1wiXVtcInRocm90dGxlXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMTNfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xNF9fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDI0NzVjYzA0ODVhN2YzOTYzODExIiwiLy8gU2ltcGxlLCBpbnRlcm5hbCBPYmplY3QuYXNzaWduKCkgcG9seWZpbGwgZm9yIG9wdGlvbnMgb2JqZWN0cyBldGMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gIT0gbnVsbCA/IE9iamVjdC5hc3NpZ24uYmluZCggT2JqZWN0ICkgOiBmdW5jdGlvbiggdGd0LCAuLi5zcmNzICl7XHJcbiAgc3Jjcy5maWx0ZXIoIHNyYyA9PiBzcmMgIT0gbnVsbCApLmZvckVhY2goIHNyYyA9PiB7XHJcbiAgICBPYmplY3Qua2V5cyggc3JjICkuZm9yRWFjaCggayA9PiB0Z3Rba10gPSBzcmNba10gKTtcclxuICB9ICk7XHJcblxyXG4gIHJldHVybiB0Z3Q7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hc3NpZ24uanMiLCJjb25zdCBFZGdlaGFuZGxlcyA9IHJlcXVpcmUoJy4vZWRnZWhhbmRsZXMnKTtcclxuY29uc3QgYXNzaWduID0gcmVxdWlyZSgnLi9hc3NpZ24nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG9wdGlvbnMgKXtcclxuICBsZXQgY3kgPSB0aGlzO1xyXG5cclxuICByZXR1cm4gbmV3IEVkZ2VoYW5kbGVzKCBhc3NpZ24oeyBjeSB9LCBvcHRpb25zKSApO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29yZS5qcyIsImZ1bmN0aW9uIGRpc2FibGVHZXN0dXJlcygpe1xyXG4gIHRoaXMuc2F2ZUdlc3R1cmVTdGF0ZSgpO1xyXG5cclxuICAoIHRoaXMuY3lcclxuICAgIC56b29taW5nRW5hYmxlZCggZmFsc2UgKVxyXG4gICAgLnBhbm5pbmdFbmFibGVkKCBmYWxzZSApXHJcbiAgICAuYm94U2VsZWN0aW9uRW5hYmxlZCggZmFsc2UgKVxyXG4gICk7XHJcblxyXG4gIGlmKCB0aGlzLm9wdGlvbnMuZGlzYWJsZUJyb3dzZXJHZXN0dXJlcyApe1xyXG4gICAgbGV0IHdsT3B0cyA9IHRoaXMud2luZG93TGlzdGVuZXJPcHRpb25zO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5wcmV2ZW50RGVmYXVsdCwgd2xPcHRzKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnByZXZlbnREZWZhdWx0LCB3bE9wdHMpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5wcmV2ZW50RGVmYXVsdCwgd2xPcHRzKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldEdlc3R1cmVzKCl7XHJcbiAgKCB0aGlzLmN5XHJcbiAgICAuem9vbWluZ0VuYWJsZWQoIHRoaXMubGFzdFpvb21pbmdFbmFibGVkIClcclxuICAgIC5wYW5uaW5nRW5hYmxlZCggdGhpcy5sYXN0UGFubmluZ0VuYWJsZWQgKVxyXG4gICAgLmJveFNlbGVjdGlvbkVuYWJsZWQoIHRoaXMubGFzdEJveFNlbGVjdGlvbkVuYWJsZWQgKVxyXG4gICk7XHJcblxyXG4gIGlmKCB0aGlzLm9wdGlvbnMuZGlzYWJsZUJyb3dzZXJHZXN0dXJlcyApe1xyXG4gICAgbGV0IHdsT3B0cyA9IHRoaXMud2luZG93TGlzdGVuZXJPcHRpb25zO1xyXG5cclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5wcmV2ZW50RGVmYXVsdCwgd2xPcHRzKTtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnByZXZlbnREZWZhdWx0LCB3bE9wdHMpO1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5wcmV2ZW50RGVmYXVsdCwgd2xPcHRzKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlR2VzdHVyZVN0YXRlKCl7XHJcbiAgbGV0IHsgY3kgfSA9IHRoaXM7XHJcblxyXG4gIHRoaXMubGFzdFBhbm5pbmdFbmFibGVkID0gY3kucGFubmluZ0VuYWJsZWQoKTtcclxuICB0aGlzLmxhc3Rab29taW5nRW5hYmxlZCA9IGN5Lnpvb21pbmdFbmFibGVkKCk7XHJcbiAgdGhpcy5sYXN0Qm94U2VsZWN0aW9uRW5hYmxlZCA9IGN5LmJveFNlbGVjdGlvbkVuYWJsZWQoKTtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyBkaXNhYmxlR2VzdHVyZXMsIHJlc2V0R2VzdHVyZXMsIHNhdmVHZXN0dXJlU3RhdGUgfTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkZ2VoYW5kbGVzL2N5LWdlc3R1cmVzLXRvZ2dsZS5qcyIsImZ1bmN0aW9uIGFkZEN5dG9zY2FwZUxpc3RlbmVycygpe1xyXG4gIGxldCB7IGN5LCBvcHRpb25zIH0gPSB0aGlzO1xyXG5cclxuICAvLyBncmFiYmluZyBub2Rlc1xyXG4gIHRoaXMuYWRkTGlzdGVuZXIoIGN5LCAnZHJhZycsICgpID0+IHRoaXMuZ3JhYmJpbmdOb2RlID0gdHJ1ZSApO1xyXG4gIHRoaXMuYWRkTGlzdGVuZXIoIGN5LCAnZnJlZScsICgpID0+IHRoaXMuZ3JhYmJpbmdOb2RlID0gZmFsc2UgKTtcclxuXHJcbiAgLy8gc2hvdyBoYW5kbGUgb24gaG92ZXJcclxuICB0aGlzLmFkZExpc3RlbmVyKCBjeSwgJ21vdXNlb3ZlcicsICdub2RlJywgZSA9PiB7XHJcbiAgICB0aGlzLnNob3coIGUudGFyZ2V0ICk7XHJcbiAgfSApO1xyXG5cclxuICAvLyBoaWRlIGhhbmRsZSBvbiB0YXAgaGFuZGxlXHJcbiAgdGhpcy5hZGRMaXN0ZW5lciggY3ksICd0YXAnLCAnbm9kZScsIGUgPT4ge1xyXG4gICAgbGV0IG5vZGUgPSBlLnRhcmdldDtcclxuXHJcbiAgICBpZiggIW5vZGUuc2FtZSggdGhpcy5oYW5kbGVOb2RlICkgKXtcclxuICAgICAgdGhpcy5zaG93KCBub2RlICk7XHJcbiAgICB9XHJcbiAgfSApO1xyXG5cclxuICAvLyBoaWRlIGhhbmRsZSB3aGVuIHNvdXJjZSBub2RlIG1vdmVkXHJcbiAgdGhpcy5hZGRMaXN0ZW5lciggY3ksICdwb3NpdGlvbicsICdub2RlJywgZSA9PiB7XHJcbiAgICBpZiggZS50YXJnZXQuc2FtZSggdGhpcy5zb3VyY2VOb2RlICkgKXtcclxuICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSApO1xyXG5cclxuICAvLyBzdGFydCBvbiB0YXBzdGFydCBoYW5kbGVcclxuICAvLyBzdGFydCBvbiB0YXBzdGFydCBub2RlIChkcmF3IG1vZGUpXHJcbiAgLy8gdG9nZ2xlIG9uIHNvdXJjZSBub2RlXHJcbiAgdGhpcy5hZGRMaXN0ZW5lciggY3ksICd0YXBzdGFydCcsICdub2RlJywgZSA9PiB7XHJcbiAgICBsZXQgbm9kZSA9IGUudGFyZ2V0O1xyXG5cclxuICAgIGlmKCBub2RlLnNhbWUoIHRoaXMuaGFuZGxlTm9kZSApICl7XHJcbiAgICAgIHRoaXMuc3RhcnQoIHRoaXMuc291cmNlTm9kZSApO1xyXG4gICAgfSBlbHNlIGlmKCB0aGlzLmRyYXdNb2RlICl7XHJcbiAgICAgIHRoaXMuc3RhcnQoIG5vZGUgKTtcclxuICAgIH0gZWxzZSBpZiggbm9kZS5zYW1lKCB0aGlzLnNvdXJjZU5vZGUgKSApe1xyXG4gICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuICB9ICk7XHJcblxyXG4gIC8vIHVwZGF0ZSBsaW5lIG9uIGRyYWdcclxuICB0aGlzLmFkZExpc3RlbmVyKCBjeSwgJ3RhcGRyYWcnLCBlID0+IHtcclxuICAgIHRoaXMudXBkYXRlKCBlLnBvc2l0aW9uICk7XHJcbiAgfSApO1xyXG5cclxuICAvLyBob3ZlciBvdmVyIHByZXZpZXdcclxuICB0aGlzLmFkZExpc3RlbmVyKCBjeSwgJ3RhcGRyYWdvdmVyJywgJ25vZGUnLCBlID0+IHtcclxuICAgIGlmKCBvcHRpb25zLnNuYXAgKXtcclxuICAgICAgLy8gdGhlbiBpZ25vcmUgZXZlbnRzIGxpa2UgbW91c2VvdmVyXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnByZXZpZXcoIGUudGFyZ2V0ICk7XHJcbiAgICB9XHJcbiAgfSApO1xyXG5cclxuICAvLyBob3ZlciBvdXQgdW5wcmV2aWV3XHJcbiAgdGhpcy5hZGRMaXN0ZW5lciggY3ksICd0YXBkcmFnb3V0JywgJ25vZGUnLCBlID0+IHtcclxuICAgIGlmKCBvcHRpb25zLnNuYXAgKXtcclxuICAgICAgLy8gdGhlbiBrZWVwIHRoZSBwcmV2aWV3XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVucHJldmlldyggZS50YXJnZXQgKTtcclxuICAgIH1cclxuICB9ICk7XHJcblxyXG4gIC8vIHN0b3AgZ2VzdHVyZSBvbiB0YXBlbmRcclxuICB0aGlzLmFkZExpc3RlbmVyKCBjeSwgJ3RhcGVuZCcsICgpID0+IHtcclxuICAgIHRoaXMuc3RvcCgpO1xyXG4gIH0gKTtcclxuXHJcbiAgLy8gaGlkZSBoYW5kbGUgaWYgc291cmNlIG5vZGUgaXMgcmVtb3ZlZFxyXG4gIHRoaXMuYWRkTGlzdGVuZXIoIGN5LCAncmVtb3ZlJywgZSA9PiB7XHJcbiAgICBpZiggZS50YXJnZXQuc2FtZSggdGhpcy5zb3VyY2VOb2RlICkgKXtcclxuICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSApO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGFkZEN5dG9zY2FwZUxpc3RlbmVycyB9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZWRnZWhhbmRsZXMvY3ktbGlzdGVuZXJzLmpzIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxubGV0IGRlZmF1bHRzID0ge1xyXG4gIHByZXZpZXc6IHRydWUsIC8vIHdoZXRoZXIgdG8gc2hvdyBhZGRlZCBlZGdlcyBwcmV2aWV3IGJlZm9yZSByZWxlYXNpbmcgc2VsZWN0aW9uXHJcbiAgaG92ZXJEZWxheTogMTUwLCAvLyB0aW1lIHNwZW50IGhvdmVyaW5nIG92ZXIgYSB0YXJnZXQgbm9kZSBiZWZvcmUgaXQgaXMgY29uc2lkZXJlZCBzZWxlY3RlZFxyXG4gIGhhbmRsZU5vZGVzOiAnbm9kZScsIC8vIHNlbGVjdG9yL2ZpbHRlciBmdW5jdGlvbiBmb3Igd2hldGhlciBlZGdlcyBjYW4gYmUgbWFkZSBmcm9tIGEgZ2l2ZW4gbm9kZVxyXG4gIHNuYXA6IGZhbHNlLCAvLyB3aGVuIGVuYWJsZWQsIHRoZSBlZGdlIGNhbiBiZSBkcmF3biBieSBqdXN0IG1vdmluZyBjbG9zZSB0byBhIHRhcmdldCBub2RlIChjYW4gYmUgY29uZnVzaW5nIG9uIGNvbXBvdW5kIGdyYXBocylcclxuICBzbmFwVGhyZXNob2xkOiA1MCwgLy8gdGhlIHRhcmdldCBub2RlIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoaXMgbWFueSBwaXhlbHMgYXdheSBmcm9tIHRoZSBjdXJzb3IvZmluZ2VyXHJcbiAgc25hcEZyZXF1ZW5jeTogMTUsIC8vIHRoZSBudW1iZXIgb2YgdGltZXMgcGVyIHNlY29uZCAoSHopIHRoYXQgc25hcCBjaGVja3MgZG9uZSAobG93ZXIgaXMgbGVzcyBleHBlbnNpdmUpXHJcbiAgbm9FZGdlRXZlbnRzSW5EcmF3OiBmYWxzZSwgLy8gc2V0IGV2ZW50czpubyB0byBlZGdlcyBkdXJpbmcgZHJhd3MsIHByZXZlbnRzIG1vdXNlb3V0cyBvbiBjb21wb3VuZHNcclxuICBkaXNhYmxlQnJvd3Nlckdlc3R1cmVzOiB0cnVlLCAvLyBkdXJpbmcgYW4gZWRnZSBkcmF3aW5nIGdlc3R1cmUsIGRpc2FibGUgYnJvd3NlciBnZXN0dXJlcyBzdWNoIGFzIHR3by1maW5nZXIgdHJhY2twYWQgc3dpcGUgYW5kIHBpbmNoLXRvLXpvb21cclxuICBoYW5kbGVQb3NpdGlvbjogZnVuY3Rpb24oIG5vZGUgKXtcclxuICAgIHJldHVybiAnbWlkZGxlIHRvcCc7IC8vIHNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBoYW5kbGUgaW4gdGhlIGZvcm1hdCBvZiBcIlgtQVhJUyBZLUFYSVNcIiBzdWNoIGFzIFwibGVmdCB0b3BcIiwgXCJtaWRkbGUgdG9wXCJcclxuICB9LFxyXG4gIGhhbmRsZUluRHJhd01vZGU6IGZhbHNlLCAvLyB3aGV0aGVyIHRvIHNob3cgdGhlIGhhbmRsZSBpbiBkcmF3IG1vZGVcclxuICBlZGdlVHlwZTogZnVuY3Rpb24oIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUgKXtcclxuICAgIC8vIGNhbiByZXR1cm4gJ2ZsYXQnIGZvciBmbGF0IGVkZ2VzIGJldHdlZW4gbm9kZXMgb3IgJ25vZGUnIGZvciBpbnRlcm1lZGlhdGUgbm9kZSBiZXR3ZWVuIHRoZW1cclxuICAgIC8vIHJldHVybmluZyBudWxsL3VuZGVmaW5lZCBtZWFucyBhbiBlZGdlIGNhbid0IGJlIGFkZGVkIGJldHdlZW4gdGhlIHR3byBub2Rlc1xyXG4gICAgcmV0dXJuICdmbGF0JztcclxuICB9LFxyXG4gIGxvb3BBbGxvd2VkOiBmdW5jdGlvbiggbm9kZSApe1xyXG4gICAgLy8gZm9yIHRoZSBzcGVjaWZpZWQgbm9kZSwgcmV0dXJuIHdoZXRoZXIgZWRnZXMgZnJvbSBpdHNlbGYgdG8gaXRzZWxmIGFyZSBhbGxvd2VkXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9LFxyXG4gIG5vZGVMb29wT2Zmc2V0OiAtNTAsIC8vIG9mZnNldCBmb3IgZWRnZVR5cGU6ICdub2RlJyBsb29wc1xyXG4gIG5vZGVQYXJhbXM6IGZ1bmN0aW9uKCBzb3VyY2VOb2RlLCB0YXJnZXROb2RlICl7XHJcbiAgICAvLyBmb3IgZWRnZXMgYmV0d2VlbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBhbmQgdGFyZ2V0XHJcbiAgICAvLyByZXR1cm4gZWxlbWVudCBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIGN5LmFkZCgpIGZvciBpbnRlcm1lZGlhcnkgbm9kZVxyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH0sXHJcbiAgZWRnZVBhcmFtczogZnVuY3Rpb24oIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUsIGkgKXtcclxuICAgIC8vIGZvciBlZGdlcyBiZXR3ZWVuIHRoZSBzcGVjaWZpZWQgc291cmNlIGFuZCB0YXJnZXRcclxuICAgIC8vIHJldHVybiBlbGVtZW50IG9iamVjdCB0byBiZSBwYXNzZWQgdG8gY3kuYWRkKCkgZm9yIGVkZ2VcclxuICAgIC8vIE5COiBpIGluZGljYXRlcyBlZGdlIGluZGV4IGluIGNhc2Ugb2YgZWRnZVR5cGU6ICdub2RlJ1xyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH0sXHJcbiAgZ2hvc3RFZGdlUGFyYW1zOiBmdW5jdGlvbigpe1xyXG4gICAgLy8gcmV0dXJuIGVsZW1lbnQgb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBjeS5hZGQoKSBmb3IgdGhlIGdob3N0IGVkZ2VcclxuICAgIC8vIChkZWZhdWx0IGNsYXNzZXMgYXJlIGFsd2F5cyBhZGRlZCBmb3IgeW91KVxyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH0sXHJcbiAgc2hvdzogZnVuY3Rpb24oIHNvdXJjZU5vZGUgKXtcclxuICAgIC8vIGZpcmVkIHdoZW4gaGFuZGxlIGlzIHNob3duXHJcbiAgfSxcclxuICBoaWRlOiBmdW5jdGlvbiggc291cmNlTm9kZSApe1xyXG4gICAgLy8gZmlyZWQgd2hlbiB0aGUgaGFuZGxlIGlzIGhpZGRlblxyXG4gIH0sXHJcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBzb3VyY2VOb2RlICl7XHJcbiAgICAvLyBmaXJlZCB3aGVuIGVkZ2VoYW5kbGVzIGludGVyYWN0aW9uIHN0YXJ0cyAoZHJhZyBvbiBoYW5kbGUpXHJcbiAgfSxcclxuICBjb21wbGV0ZTogZnVuY3Rpb24oIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUsIGFkZGVkRWxlcyApe1xyXG4gICAgLy8gZmlyZWQgd2hlbiBlZGdlaGFuZGxlcyBpcyBkb25lIGFuZCBlbGVtZW50cyBhcmUgYWRkZWRcclxuICB9LFxyXG4gIHN0b3A6IGZ1bmN0aW9uKCBzb3VyY2VOb2RlICl7XHJcbiAgICAvLyBmaXJlZCB3aGVuIGVkZ2VoYW5kbGVzIGludGVyYWN0aW9uIGlzIHN0b3BwZWQgKGVpdGhlciBjb21wbGV0ZSB3aXRoIGFkZGVkIGVkZ2VzIG9yIGluY29tcGxldGUpXHJcbiAgfSxcclxuICBjYW5jZWw6IGZ1bmN0aW9uKCBzb3VyY2VOb2RlLCBjYW5jZWxsZWRUYXJnZXRzICl7XHJcbiAgICAvLyBmaXJlZCB3aGVuIGVkZ2VoYW5kbGVzIGFyZSBjYW5jZWxsZWQgKGluY29tcGxldGUgZ2VzdHVyZSlcclxuICB9LFxyXG4gIGhvdmVyb3ZlcjogZnVuY3Rpb24oIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUgKXtcclxuICAgIC8vIGZpcmVkIHdoZW4gYSB0YXJnZXQgaXMgaG92ZXJlZFxyXG4gIH0sXHJcbiAgaG92ZXJvdXQ6IGZ1bmN0aW9uKCBzb3VyY2VOb2RlLCB0YXJnZXROb2RlICl7XHJcbiAgICAvLyBmaXJlZCB3aGVuIGEgdGFyZ2V0IGlzbid0IGhvdmVyZWQgYW55bW9yZVxyXG4gIH0sXHJcbiAgcHJldmlld29uOiBmdW5jdGlvbiggc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSwgcHJldmlld0VsZXMgKXtcclxuICAgIC8vIGZpcmVkIHdoZW4gcHJldmlldyBpcyBzaG93blxyXG4gIH0sXHJcbiAgcHJldmlld29mZjogZnVuY3Rpb24oIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUsIHByZXZpZXdFbGVzICl7XHJcbiAgICAvLyBmaXJlZCB3aGVuIHByZXZpZXcgaXMgaGlkZGVuXHJcbiAgfSxcclxuICBkcmF3b246IGZ1bmN0aW9uKCl7XHJcbiAgICAvLyBmaXJlZCB3aGVuIGRyYXcgbW9kZSBlbmFibGVkXHJcbiAgfSxcclxuICBkcmF3b2ZmOiBmdW5jdGlvbigpe1xyXG4gICAgLy8gZmlyZWQgd2hlbiBkcmF3IG1vZGUgZGlzYWJsZWRcclxuICB9XHJcbn07XHJcbi8qIGVzbGludC1lbmFibGUgKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lZGdlaGFuZGxlcy9kZWZhdWx0cy5qcyIsImZ1bmN0aW9uIHRvZ2dsZURyYXdNb2RlKCBib29sICl7XHJcbiAgbGV0IHsgY3ksIG9wdGlvbnMgfSA9IHRoaXM7XHJcblxyXG4gIHRoaXMuZHJhd01vZGUgPSBib29sICE9IG51bGwgPyBib29sIDogIXRoaXMuZHJhd01vZGU7XHJcblxyXG4gIGlmKCB0aGlzLmRyYXdNb2RlICl7XHJcbiAgICB0aGlzLnByZXZVbmdyYWJpZnlTdGF0ZSA9IGN5LmF1dG91bmdyYWJpZnkoKTtcclxuXHJcbiAgICBjeS5hdXRvdW5ncmFiaWZ5KCB0cnVlICk7XHJcblxyXG4gICAgaWYoICFvcHRpb25zLmhhbmRsZUluRHJhd01vZGUgJiYgdGhpcy5oYW5kbGVTaG93bigpICl7XHJcbiAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW1pdCgnZHJhd29uJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGN5LmF1dG91bmdyYWJpZnkoIHRoaXMucHJldlVuZ3JhYmlmeVN0YXRlICk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdkcmF3b2ZmJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gZW5hYmxlRHJhd01vZGUoKXtcclxuICByZXR1cm4gdGhpcy50b2dnbGVEcmF3TW9kZSggdHJ1ZSApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNhYmxlRHJhd01vZGUoKXtcclxuICByZXR1cm4gdGhpcy50b2dnbGVEcmF3TW9kZSggZmFsc2UgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IHRvZ2dsZURyYXdNb2RlLCBlbmFibGVEcmF3TW9kZSwgZGlzYWJsZURyYXdNb2RlIH07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lZGdlaGFuZGxlcy9kcmF3LW1vZGUuanMiLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCcuLi9hc3NpZ24nKTtcclxuY29uc3QgaXNTdHJpbmcgPSB4ID0+IHR5cGVvZiB4ID09PSB0eXBlb2YgJyc7XHJcbmNvbnN0IGlzQXJyYXkgPSB4ID0+IHR5cGVvZiB4ID09PSB0eXBlb2YgW10gJiYgeC5sZW5ndGggIT0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIGdldEVsZUpzb24oIG92ZXJyaWRlcywgcGFyYW1zLCBhZGRlZENsYXNzZXMgKXtcclxuICBsZXQganNvbiA9IHt9O1xyXG5cclxuICAvLyBiYXNpYyB2YWx1ZXNcclxuICBhc3NpZ24oIGpzb24sIHBhcmFtcywgb3ZlcnJpZGVzICk7XHJcblxyXG4gIC8vIG1ha2Ugc3VyZSBwYXJhbXMgY2FuIHNwZWNpZnkgZGF0YSBidXQgdGhhdCBvdmVycmlkZXMgdGFrZSBwcmVjZWRlbmNlXHJcbiAgYXNzaWduKCBqc29uLmRhdGEsIHBhcmFtcy5kYXRhLCBvdmVycmlkZXMuZGF0YSApO1xyXG5cclxuICBpZiggaXNTdHJpbmcocGFyYW1zLmNsYXNzZXMpICl7XHJcbiAgICBqc29uLmNsYXNzZXMgPSBwYXJhbXMuY2xhc3NlcyArICcgJyArIGFkZGVkQ2xhc3NlcztcclxuICB9IGVsc2UgaWYoIGlzQXJyYXkocGFyYW1zLmNsYXNzZXMpICl7XHJcbiAgICBqc29uLmNsYXNzZXMgPSBwYXJhbXMuY2xhc3Nlcy5qb2luKCcgJykgKyAnICcgKyBhZGRlZENsYXNzZXM7XHJcbiAgfSBlbHNlIHtcclxuICAgIGpzb24uY2xhc3NlcyA9IGFkZGVkQ2xhc3NlcztcclxuICB9XHJcblxyXG4gIHJldHVybiBqc29uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlRWRnZXMoIHByZXZpZXcgPSBmYWxzZSApIHtcclxuICBsZXQgeyBjeSwgb3B0aW9ucywgcHJlc3VtcHRpdmVUYXJnZXRzLCBwcmV2aWV3RWxlcywgYWN0aXZlIH0gPSB0aGlzO1xyXG5cclxuICBsZXQgc291cmNlID0gdGhpcy5zb3VyY2VOb2RlO1xyXG4gIGxldCB0YXJnZXQgPSB0aGlzLnRhcmdldE5vZGU7XHJcbiAgbGV0IGNsYXNzZXMgPSBwcmV2aWV3ID8gJ2VoLXByZXZpZXcnIDogJyc7XHJcbiAgbGV0IGFkZGVkID0gY3kuY29sbGVjdGlvbigpO1xyXG4gIGxldCBlZGdlVHlwZSA9IG9wdGlvbnMuZWRnZVR5cGUoIHNvdXJjZSwgdGFyZ2V0ICk7XHJcblxyXG4gIC8vIGNhbid0IG1ha2UgZWRnZXMgb3V0c2lkZSBvZiByZWd1bGFyIGdlc3R1cmUgbGlmZWN5Y2xlXHJcbiAgaWYoICFhY3RpdmUgKXsgcmV0dXJuOyB9XHJcblxyXG4gIC8vIG11c3QgaGF2ZSBhIG5vbi1lbXB0eSBlZGdlIHR5cGVcclxuICBpZiggIWVkZ2VUeXBlICl7IHJldHVybjsgfVxyXG5cclxuICAvLyBjYW4ndCBtYWtlIHByZXZpZXcgaWYgZGlzYWJsZWRcclxuICBpZiggcHJldmlldyAmJiAhb3B0aW9ucy5wcmV2aWV3ICl7IHJldHVybjsgfVxyXG5cclxuICAvLyBkZXRlY3QgY2FuY2VsXHJcbiAgaWYoICF0YXJnZXQgfHwgdGFyZ2V0LnNpemUoKSA9PT0gMCApe1xyXG4gICAgcHJldmlld0VsZXMucmVtb3ZlKCk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCAnY2FuY2VsJywgdGhpcy5tcCgpLCBzb3VyY2UsIHByZXN1bXB0aXZlVGFyZ2V0cyApO1xyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIGp1c3QgcmVtb3ZlIHByZXZpZXcgY2xhc3MgaWYgd2UgYWxyZWFkeSBoYXZlIHRoZSBlZGdlc1xyXG4gIGlmKCAhcHJldmlldyAmJiBvcHRpb25zLnByZXZpZXcgKSB7XHJcbiAgICBwcmV2aWV3RWxlcy5yZW1vdmVDbGFzcygnZWgtcHJldmlldycpLnN0eWxlKCdldmVudHMnLCAnJyk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCAnY29tcGxldGUnLCB0aGlzLm1wKCksIHNvdXJjZSwgdGFyZ2V0LCBwcmV2aWV3RWxlcyApO1xyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGxldCBwMSA9IHNvdXJjZS5wb3NpdGlvbigpO1xyXG4gIGxldCBwMiA9IHRhcmdldC5wb3NpdGlvbigpO1xyXG5cclxuICBsZXQgcDtcclxuICBpZiggc291cmNlLnNhbWUoIHRhcmdldCApICkge1xyXG4gICAgcCA9IHtcclxuICAgICAgeDogcDEueCArIG9wdGlvbnMubm9kZUxvb3BPZmZzZXQsXHJcbiAgICAgIHk6IHAxLnkgKyBvcHRpb25zLm5vZGVMb29wT2Zmc2V0XHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwID0ge1xyXG4gICAgICB4OiAoIHAxLnggKyBwMi54ICkgLyAyLFxyXG4gICAgICB5OiAoIHAxLnkgKyBwMi55ICkgLyAyXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaWYoIGVkZ2VUeXBlID09PSAnbm9kZScgKXtcclxuICAgIGxldCBpbnRlck5vZGUgPSBjeS5hZGQoXHJcbiAgICAgIGdldEVsZUpzb24oXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZ3JvdXA6ICdub2RlcycsXHJcbiAgICAgICAgICBwb3NpdGlvbjogcFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3B0aW9ucy5ub2RlUGFyYW1zKCBzb3VyY2UsIHRhcmdldCApLFxyXG4gICAgICAgIGNsYXNzZXNcclxuICAgICAgKVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgc291cmNlMmludGVyID0gY3kuYWRkKFxyXG4gICAgICBnZXRFbGVKc29uKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGdyb3VwOiAnZWRnZXMnLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZS5pZCgpLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IGludGVyTm9kZS5pZCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvcHRpb25zLmVkZ2VQYXJhbXMoIHNvdXJjZSwgdGFyZ2V0LCAwICksXHJcbiAgICAgICAgY2xhc3Nlc1xyXG4gICAgICApXHJcbiAgICApO1xyXG5cclxuICAgIGxldCBpbnRlcjJ0YXJnZXQgPSBjeS5hZGQoXHJcbiAgICAgIGdldEVsZUpzb24oXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZ3JvdXA6ICdlZGdlcycsXHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHNvdXJjZTogaW50ZXJOb2RlLmlkKCksXHJcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LmlkKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9wdGlvbnMuZWRnZVBhcmFtcyggc291cmNlLCB0YXJnZXQsIDEgKSxcclxuICAgICAgICBjbGFzc2VzXHJcbiAgICAgIClcclxuICAgICk7XHJcblxyXG4gICAgYWRkZWQgPSBhZGRlZC5tZXJnZSggaW50ZXJOb2RlICkubWVyZ2UoIHNvdXJjZTJpbnRlciApLm1lcmdlKCBpbnRlcjJ0YXJnZXQgKTtcclxuICB9IGVsc2UgeyAvLyBmbGF0XHJcbiAgICBsZXQgc291cmNlMnRhcmdldCA9IGN5LmFkZChcclxuICAgICAgZ2V0RWxlSnNvbihcclxuICAgICAgICB7XHJcbiAgICAgICAgICBncm91cDogJ2VkZ2VzJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2UuaWQoKSxcclxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQuaWQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3B0aW9ucy5lZGdlUGFyYW1zKCBzb3VyY2UsIHRhcmdldCwgMCApLFxyXG4gICAgICAgIGNsYXNzZXNcclxuICAgICAgKVxyXG4gICAgKTtcclxuXHJcbiAgICBhZGRlZCA9IGFkZGVkLm1lcmdlKCBzb3VyY2UydGFyZ2V0ICk7XHJcbiAgfVxyXG5cclxuICBpZiggcHJldmlldyApIHtcclxuICAgIHRoaXMucHJldmlld0VsZXMgPSBhZGRlZDtcclxuXHJcbiAgICBhZGRlZC5zdHlsZSgnZXZlbnRzJywgJ25vJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGFkZGVkLnN0eWxlKCdldmVudHMnLCAnJyk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCAnY29tcGxldGUnLCB0aGlzLm1wKCksIHNvdXJjZSwgdGFyZ2V0LCBhZGRlZCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VQcmV2aWV3KCkge1xyXG4gIHRoaXMubWFrZUVkZ2VzKCB0cnVlICk7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmV2aWV3U2hvd24oKXtcclxuICByZXR1cm4gdGhpcy5wcmV2aWV3RWxlcy5ub25lbXB0eSgpICYmIHRoaXMucHJldmlld0VsZXMuaW5zaWRlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVByZXZpZXcoKSB7XHJcbiAgaWYoIHRoaXMucHJldmlld1Nob3duKCkgKXtcclxuICAgIHRoaXMucHJldmlld0VsZXMucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlU2hvd24oKXtcclxuICByZXR1cm4gdGhpcy5oYW5kbGVOb2RlLm5vbmVtcHR5KCkgJiYgdGhpcy5oYW5kbGVOb2RlLmluc2lkZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVIYW5kbGUoKXtcclxuICBpZiggdGhpcy5oYW5kbGVTaG93bigpICl7XHJcbiAgICB0aGlzLmhhbmRsZU5vZGUucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0SGFuZGxlRm9yKCBub2RlICl7XHJcbiAgbGV0IHsgb3B0aW9ucywgY3kgfSA9IHRoaXM7XHJcblxyXG4gIGxldCBoYW5kbGVQb3NpdGlvbiA9IHR5cGVvZiBvcHRpb25zLmhhbmRsZVBvc2l0aW9uID09PSB0eXBlb2YgJycgPyAoKSA9PiBvcHRpb25zLmhhbmRsZVBvc2l0aW9uIDogb3B0aW9ucy5oYW5kbGVQb3NpdGlvbjtcclxuXHJcbiAgbGV0IHAgPSBub2RlLnBvc2l0aW9uKCk7XHJcbiAgbGV0IGggPSBub2RlLm91dGVySGVpZ2h0KCk7XHJcbiAgbGV0IHcgPSBub2RlLm91dGVyV2lkdGgoKTtcclxuXHJcbiAgLy8gc3RvcmUgaG93IG11Y2ggd2Ugc2hvdWxkIG1vdmUgdGhlIGhhbmRsZSBmcm9tIG9yaWdpbihwLngsIHAueSlcclxuICBsZXQgbW92ZVggPSAwO1xyXG4gIGxldCBtb3ZlWSA9IDA7XHJcblxyXG4gIC8vIGdyYWIgYXhlc1xyXG4gIGxldCBheGVzID0gaGFuZGxlUG9zaXRpb24oIG5vZGUgKS50b0xvd2VyQ2FzZSgpLnNwbGl0KC9cXHMrLyk7XHJcbiAgbGV0IGF4aXNYID0gYXhlc1swXTtcclxuICBsZXQgYXhpc1kgPSBheGVzWzFdO1xyXG5cclxuICAvLyBiYXNlZCBvbiBoYW5kbGVQb3NpdGlvbiBtb3ZlIGxlZnQvcmlnaHQvdG9wL2JvdHRvbS4gTWlkZGxlL21pZGRsZSB3aWxsIGp1c3QgYmUgbm9ybWFsXHJcbiAgaWYoIGF4aXNYID09PSAnbGVmdCcgKXtcclxuICAgIG1vdmVYID0gLSh3IC8gMik7XHJcbiAgfSBlbHNlIGlmKCBheGlzWCA9PT0gJ3JpZ2h0JyApe1xyXG4gICAgbW92ZVggPSB3IC8gMjtcclxuICB9IGlmKCBheGlzWSA9PT0gJ3RvcCcgKXtcclxuICAgIG1vdmVZID0gLShoIC8gMik7XHJcbiAgfSBlbHNlIGlmKCBheGlzWSA9PT0gJ2JvdHRvbScgKXtcclxuICAgIG1vdmVZID0gaCAvIDI7XHJcbiAgfVxyXG5cclxuICAvLyBzZXQgaGFuZGxlIHggYW5kIHkgYmFzZWQgb24gYWRqdXN0ZWQgcG9zaXRpb25zXHJcbiAgbGV0IGh4ID0gdGhpcy5oeCA9IHAueCArIG1vdmVYO1xyXG4gIGxldCBoeSA9IHRoaXMuaHkgPSBwLnkgKyBtb3ZlWTtcclxuICBsZXQgcG9zID0geyB4OiBoeCwgeTogaHkgfTtcclxuXHJcbiAgaWYoIHRoaXMuaGFuZGxlU2hvd24oKSApe1xyXG4gICAgdGhpcy5oYW5kbGVOb2RlLnBvc2l0aW9uKCBwb3MgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY3kuYmF0Y2goICgpID0+IHtcclxuICAgICAgdGhpcy5oYW5kbGVOb2RlID0gY3kuYWRkKHtcclxuICAgICAgICBjbGFzc2VzOiAnZWgtaGFuZGxlJyxcclxuICAgICAgICBwb3NpdGlvbjogcG9zLFxyXG4gICAgICAgIGdyYWJiYWJsZTogZmFsc2UsXHJcbiAgICAgICAgc2VsZWN0YWJsZTogZmFsc2VcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmhhbmRsZU5vZGUuc3R5bGUoJ3otaW5kZXgnLCA5MDA3MTk5MjU0NzQwOTkxKTtcclxuICAgIH0gKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFZGdlKCkge1xyXG4gIGxldCB7IHNvdXJjZU5vZGUsIGdob3N0Tm9kZSwgY3ksIG14LCBteSwgb3B0aW9ucyB9ID0gdGhpcztcclxuICBsZXQgeCA9IG14O1xyXG4gIGxldCB5ID0gbXk7XHJcbiAgbGV0IGdob3N0RWRnZSwgZ2hvc3RFbGVzO1xyXG5cclxuICAvLyBjYW4ndCBkcmF3IGEgbGluZSB3aXRob3V0IGhhdmluZyB0aGUgc3RhcnRpbmcgbm9kZVxyXG4gIGlmKCAhc291cmNlTm9kZSApeyByZXR1cm47IH1cclxuXHJcbiAgaWYoICFnaG9zdE5vZGUgfHwgZ2hvc3ROb2RlLmxlbmd0aCA9PT0gMCB8fCBnaG9zdE5vZGUucmVtb3ZlZCgpICkge1xyXG4gICAgZ2hvc3RFbGVzID0gdGhpcy5naG9zdEVsZXMgPSBjeS5jb2xsZWN0aW9uKCk7XHJcblxyXG4gICAgY3kuYmF0Y2goICgpID0+IHtcclxuICAgICAgZ2hvc3ROb2RlID0gdGhpcy5naG9zdE5vZGUgPSBjeS5hZGQoIHtcclxuICAgICAgICBncm91cDogJ25vZGVzJyxcclxuICAgICAgICBjbGFzc2VzOiAnZWgtZ2hvc3QgZWgtZ2hvc3Qtbm9kZScsXHJcbiAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9ICk7XHJcblxyXG4gICAgICBnaG9zdE5vZGUuc3R5bGUoe1xyXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJ2JsdWUnLFxyXG4gICAgICAgICd3aWR0aCc6IDAuMDAwMSxcclxuICAgICAgICAnaGVpZ2h0JzogMC4wMDAxLFxyXG4gICAgICAgICdvcGFjaXR5JzogMCxcclxuICAgICAgICAnZXZlbnRzJzogJ25vJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGxldCBnaG9zdEVkZ2VQYXJhbXMgPSBvcHRpb25zLmdob3N0RWRnZVBhcmFtcygpO1xyXG5cclxuICAgICAgZ2hvc3RFZGdlID0gY3kuYWRkKCBhc3NpZ24oe30sIGdob3N0RWRnZVBhcmFtcywge1xyXG4gICAgICAgIGdyb3VwOiAnZWRnZXMnLFxyXG4gICAgICAgIGRhdGE6IGFzc2lnbih7fSwgZ2hvc3RFZGdlUGFyYW1zLmRhdGEsIHtcclxuICAgICAgICAgIHNvdXJjZTogc291cmNlTm9kZS5pZCgpLFxyXG4gICAgICAgICAgdGFyZ2V0OiBnaG9zdE5vZGUuaWQoKVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNsYXNzZXM6ICdlaC1naG9zdCBlaC1naG9zdC1lZGdlJ1xyXG4gICAgICB9KSApO1xyXG5cclxuICAgICAgZ2hvc3RFZGdlLnN0eWxlKHtcclxuICAgICAgICAnZXZlbnRzJzogJ25vJ1xyXG4gICAgICB9KTtcclxuICAgIH0gKTtcclxuXHJcbiAgICBnaG9zdEVsZXMubWVyZ2UoIGdob3N0Tm9kZSApLm1lcmdlKCBnaG9zdEVkZ2UgKTtcclxuICB9XHJcblxyXG4gIGdob3N0Tm9kZS5wb3NpdGlvbih7IHgsIHkgfSk7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBtYWtlRWRnZXMsIG1ha2VQcmV2aWV3LCByZW1vdmVQcmV2aWV3LCBwcmV2aWV3U2hvd24sXHJcbiAgdXBkYXRlRWRnZSxcclxuICBoYW5kbGVTaG93biwgc2V0SGFuZGxlRm9yLCByZW1vdmVIYW5kbGVcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkZ2VoYW5kbGVzL2RyYXdpbmcuanMiLCJmdW5jdGlvbiBkaXNhYmxlRWRnZUV2ZW50cygpe1xyXG4gIGlmKCB0aGlzLm9wdGlvbnMubm9FZGdlRXZlbnRzSW5EcmF3ICl7XHJcbiAgICB0aGlzLmN5LmVkZ2VzKCkuc3R5bGUoJ2V2ZW50cycsICdubycpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuYWJsZUVkZ2VFdmVudHMoKXtcclxuICBpZiggdGhpcy5vcHRpb25zLm5vRWRnZUV2ZW50c0luRHJhdyApe1xyXG4gICAgdGhpcy5jeS5lZGdlcygpLnN0eWxlKCdldmVudHMnLCAnJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGRpc2FibGVFZGdlRXZlbnRzLCBlbmFibGVFZGdlRXZlbnRzIH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkZ2VoYW5kbGVzL2VkZ2UtZXZlbnRzLXRvZ2dsZS5qcyIsImZ1bmN0aW9uIGVuYWJsZSgpe1xyXG4gIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIHRoaXMuZW1pdCgnZW5hYmxlJyk7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNhYmxlKCl7XHJcbiAgdGhpcy5lbmFibGVkID0gZmFsc2U7XHJcblxyXG4gIHRoaXMuZW1pdCgnZGlzYWJsZScpO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGVuYWJsZSwgZGlzYWJsZSB9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZWRnZWhhbmRsZXMvZW5hYmxpbmcuanMiLCJjb25zdCBtZW1vaXplID0gcmVxdWlyZSgnbG9kYXNoLm1lbW9pemUnKTtcclxuY29uc3Qgc3FydDIgPSBNYXRoLnNxcnQoMik7XHJcblxyXG5mdW5jdGlvbiBjYW5TdGFydE9uKCBub2RlICl7XHJcbiAgY29uc3QgeyBvcHRpb25zLCBwcmV2aWV3RWxlcywgZ2hvc3RFbGVzLCBoYW5kbGVOb2RlIH0gPSB0aGlzO1xyXG4gIGNvbnN0IGlzUHJldmlldyA9IGVsID0+IHByZXZpZXdFbGVzLmFueVNhbWUoZWwpO1xyXG4gIGNvbnN0IGlzR2hvc3QgPSBlbCA9PiBnaG9zdEVsZXMuYW55U2FtZShlbCk7XHJcbiAgY29uc3QgdXNlckZpbHRlciA9IGVsID0+IGVsLmZpbHRlciggb3B0aW9ucy5oYW5kbGVOb2RlcyApLmxlbmd0aCA+IDA7XHJcbiAgY29uc3QgaXNIYW5kbGUgPSBlbCA9PiBoYW5kbGVOb2RlLnNhbWUoZWwpO1xyXG4gIGNvbnN0IGlzVGVtcCA9IGVsID0+IGlzUHJldmlldyhlbCkgfHwgaXNIYW5kbGUoZWwpIHx8IGlzR2hvc3QoZWwpO1xyXG5cclxuICBjb25zdCB7IGVuYWJsZWQsIGFjdGl2ZSwgZ3JhYmJpbmdOb2RlIH0gPSB0aGlzO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgZW5hYmxlZCAmJiAhYWN0aXZlICYmICFncmFiYmluZ05vZGVcclxuICAgICYmICggbm9kZSA9PSBudWxsIHx8ICghaXNUZW1wKG5vZGUpICYmIHVzZXJGaWx0ZXIobm9kZSkpIClcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYW5TdGFydERyYXdNb2RlT24oIG5vZGUgKXtcclxuICByZXR1cm4gdGhpcy5jYW5TdGFydE9uKCBub2RlICkgJiYgdGhpcy5kcmF3TW9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FuU3RhcnROb25EcmF3TW9kZU9uKCBub2RlICl7XHJcbiAgcmV0dXJuIHRoaXMuY2FuU3RhcnRPbiggbm9kZSApICYmICF0aGlzLmRyYXdNb2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93KCBub2RlICl7XHJcbiAgbGV0IHsgb3B0aW9ucywgZHJhd01vZGUgfSA9IHRoaXM7XHJcblxyXG4gIGlmKCAhdGhpcy5jYW5TdGFydE9uKG5vZGUpIHx8ICggZHJhd01vZGUgJiYgIW9wdGlvbnMuaGFuZGxlSW5EcmF3TW9kZSApICl7IHJldHVybjsgfVxyXG5cclxuICB0aGlzLnNvdXJjZU5vZGUgPSBub2RlO1xyXG5cclxuICB0aGlzLnNldEhhbmRsZUZvciggbm9kZSApO1xyXG5cclxuICB0aGlzLmVtaXQoICdzaG93JywgdGhpcy5ocCgpLCB0aGlzLnNvdXJjZU5vZGUgKTtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGUoKXtcclxuICB0aGlzLnJlbW92ZUhhbmRsZSgpO1xyXG5cclxuICB0aGlzLmVtaXQoICdoaWRlJywgdGhpcy5ocCgpLCB0aGlzLnNvdXJjZU5vZGUgKTtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCBub2RlICl7XHJcbiAgaWYoICF0aGlzLmNhblN0YXJ0T24obm9kZSkgKXsgcmV0dXJuOyB9XHJcblxyXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgdGhpcy5zb3VyY2VOb2RlID0gbm9kZTtcclxuICB0aGlzLnNvdXJjZU5vZGUuYWRkQ2xhc3MoJ2VoLXNvdXJjZScpO1xyXG5cclxuICB0aGlzLmRpc2FibGVHZXN0dXJlcygpO1xyXG4gIHRoaXMuZGlzYWJsZUVkZ2VFdmVudHMoKTtcclxuXHJcbiAgdGhpcy5lbWl0KCAnc3RhcnQnLCB0aGlzLmhwKCksIG5vZGUgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKCBwb3MgKXtcclxuICBpZiggIXRoaXMuYWN0aXZlICl7IHJldHVybjsgfVxyXG5cclxuICBsZXQgcCA9IHBvcztcclxuXHJcbiAgdGhpcy5teCA9IHAueDtcclxuICB0aGlzLm15ID0gcC55O1xyXG5cclxuICB0aGlzLnVwZGF0ZUVkZ2UoKTtcclxuICB0aGlzLnRocm90dGxlZFNuYXAoKTtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNuYXAoKXtcclxuICBpZiggIXRoaXMuYWN0aXZlIHx8ICF0aGlzLm9wdGlvbnMuc25hcCApeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcbiAgbGV0IGN5ID0gdGhpcy5jeTtcclxuICBsZXQgdGd0ID0gdGhpcy50YXJnZXROb2RlO1xyXG4gIGxldCB0aHJlc2hvbGQgPSB0aGlzLm9wdGlvbnMuc25hcFRocmVzaG9sZDtcclxuICBsZXQgbW91c2VQb3MgPSB0aGlzLm1wKCk7XHJcbiAgbGV0IHsgaGFuZGxlTm9kZSwgcHJldmlld0VsZXMsIGdob3N0Tm9kZSB9ID0gdGhpcztcclxuXHJcbiAgbGV0IHJhZGl1cyA9IG4gPT4gc3FydDIgKiBNYXRoLm1heChuLm91dGVyV2lkdGgoKSwgbi5vdXRlckhlaWdodCgpKS8yOyAvLyB3b3JzdC1jYXNlIGVuY2xvc3VyZSBvZiBiYiBieSBjaXJjbGVcclxuICBsZXQgc3FEaXN0ID0gKHgxLCB5MSwgeDIsIHkyKSA9PiB7IGxldCBkeCA9IHgyIC0geDE7IGxldCBkeSA9IHkyIC0geTE7IHJldHVybiBkeCpkeCArIGR5KmR5OyB9O1xyXG4gIGxldCBzcURpc3RCeVB0ID0gKHAxLCBwMikgPT4gc3FEaXN0KHAxLngsIHAxLnksIHAyLngsIHAyLnkpO1xyXG4gIGxldCBub2RlU3FEaXN0ID0gbiA9PiBzcURpc3RCeVB0KG4ucG9zaXRpb24oKSwgbW91c2VQb3MpO1xyXG5cclxuICBsZXQgc3FUaHJlc2hvbGQgPSBuID0+IHsgbGV0IHIgPSByYWRpdXMobik7IGxldCB0ID0gciArIHRocmVzaG9sZDsgcmV0dXJuIHQgKiB0OyB9O1xyXG4gIGxldCBpc1dpdGhpblRoZXNob2xkID0gbiA9PiBub2RlU3FEaXN0KG4pIDw9IHNxVGhyZXNob2xkKG4pO1xyXG5cclxuICBsZXQgYmJTcURpc3QgPSBuID0+IHtcclxuICAgIGxldCBwID0gbi5wb3NpdGlvbigpO1xyXG4gICAgbGV0IGhhbGZXID0gbi5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgbGV0IGhhbGZIID0gbi5vdXRlckhlaWdodCgpIC8gMjtcclxuXHJcbiAgICAvLyBub2RlIGFuZCBtb3VzZSBwb3NpdGlvbnMsIGxpbmUgaXMgZm9ybWVkIGZyb20gbm9kZSB0byBtb3VzZVxyXG4gICAgbGV0IG54ID0gcC54O1xyXG4gICAgbGV0IG55ID0gcC55O1xyXG4gICAgbGV0IG14ID0gbW91c2VQb3MueDtcclxuICAgIGxldCBteSA9IG1vdXNlUG9zLnk7XHJcblxyXG4gICAgLy8gYm91bmRpbmcgYm94XHJcbiAgICBsZXQgeDEgPSBueCAtIGhhbGZXO1xyXG4gICAgbGV0IHgyID0gbnggKyBoYWxmVztcclxuICAgIGxldCB5MSA9IG55IC0gaGFsZkg7XHJcbiAgICBsZXQgeTIgPSBueSArIGhhbGZIO1xyXG5cclxuICAgIGxldCBpbnNpZGVYQm91bmRzID0geDEgPD0gbXggJiYgbXggPD0geDI7XHJcbiAgICBsZXQgaW5zaWRlWUJvdW5kcyA9IHkxIDw9IG15ICYmIG15IDw9IHkyO1xyXG5cclxuICAgIGlmKCBpbnNpZGVYQm91bmRzICYmIGluc2lkZVlCb3VuZHMgKXsgLy8gaW5zaWRlIGJveFxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH0gZWxzZSBpZiggaW5zaWRlWEJvdW5kcyApeyAvLyBwZXJwZW5kaWN1bGFyIGRpc3RhbmNlIHRvIGJveCwgdG9wIG9yIGJvdHRvbVxyXG4gICAgICBsZXQgZHkxID0gbXkgLSB5MTtcclxuICAgICAgbGV0IGR5MiA9IG15IC0geTI7XHJcblxyXG4gICAgICByZXR1cm4gTWF0aC5taW4oZHkxICogZHkxLCBkeTIgKiBkeTIpO1xyXG4gICAgfSBlbHNlIGlmKCBpbnNpZGVZQm91bmRzICl7IC8vIHBlcnBlbmRpY3VsYXIgZGlzdGFuY2UgdG8gYm94LCBsZWZ0IG9yIHJpZ2h0XHJcbiAgICAgIGxldCBkeDEgPSBteCAtIHgxO1xyXG4gICAgICBsZXQgZHgyID0gbXggLSB4MjtcclxuXHJcbiAgICAgIHJldHVybiBNYXRoLm1pbihkeDEgKiBkeDEsIGR4MiAqIGR4Mik7XHJcbiAgICB9IGVsc2UgaWYoIG14IDwgeDEgJiYgbXkgPCB5MSApeyAvLyB0b3AtbGVmdCBjb3JuZXIgZGlzdGFuY2VcclxuICAgICAgcmV0dXJuIHNxRGlzdChteCwgbXksIHgxLCB5MSk7XHJcbiAgICB9IGVsc2UgaWYoIG14ID4geDIgJiYgbXkgPCB5MSApeyAvLyB0b3AtcmlnaHQgY29ybmVyIGRpc3RhbmNlXHJcbiAgICAgIHJldHVybiBzcURpc3QobXgsIG15LCB4MiwgeTEpO1xyXG4gICAgfSBlbHNlIGlmKCBteCA8IHgxICYmIG15ID4geTIgKXsgLy8gYm90dG9tLWxlZnQgY29ybmVyIGRpc3RhbmNlXHJcbiAgICAgIHJldHVybiBzcURpc3QobXgsIG15LCB4MSwgeTIpO1xyXG4gICAgfSBlbHNlIHsgLy8gYm90dG9tLXJpZ2h0IGNvcm5lciBkaXN0YW5jZVxyXG4gICAgICByZXR1cm4gc3FEaXN0KG14LCBteSwgeDIsIHkyKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBsZXQgY21wQmJTcURpc3QgPSAobjEsIG4yKSA9PiBiYlNxRGlzdChuMSkgLSBiYlNxRGlzdChuMik7XHJcblxyXG4gIGxldCBjbXAgPSBjbXBCYlNxRGlzdDtcclxuXHJcbiAgbGV0IGFsbG93SG92ZXJEZWxheSA9IGZhbHNlO1xyXG5cclxuICBsZXQgbW91c2VJc0luc2lkZSA9IG4gPT4ge1xyXG4gICAgbGV0IG1wID0gbW91c2VQb3M7XHJcbiAgICBsZXQgdyA9IG4ub3V0ZXJXaWR0aCgpO1xyXG4gICAgbGV0IGhhbGZXID0gdy8yO1xyXG4gICAgbGV0IGggPSBuLm91dGVySGVpZ2h0KCk7XHJcbiAgICBsZXQgaGFsZkggPSBoLzI7XHJcbiAgICBsZXQgcCA9IG4ucG9zaXRpb24oKTtcclxuICAgIGxldCB4MSA9IHAueCAtIGhhbGZXO1xyXG4gICAgbGV0IHgyID0gcC54ICsgaGFsZlc7XHJcbiAgICBsZXQgeTEgPSBwLnkgLSBoYWxmSDtcclxuICAgIGxldCB5MiA9IHAueSArIGhhbGZIO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgIHgxIDw9IG1wLnggJiYgbXAueCA8PSB4MlxyXG4gICAgICAmJiB5MSA8PSBtcC55ICYmIG1wLnkgPD0geTJcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IGlzRWhFbGUgPSBuID0+IG4uc2FtZShoYW5kbGVOb2RlKSB8fCBuLnNhbWUocHJldmlld0VsZXMpIHx8IG4uc2FtZShnaG9zdE5vZGUpO1xyXG5cclxuICBsZXQgbm9kZXNCeURpc3QgPSBjeS5ub2RlcyhuID0+ICFpc0VoRWxlKG4pICYmIGlzV2l0aGluVGhlc2hvbGQobikpLnNvcnQoY21wKTtcclxuICBsZXQgc25hcHBlZCA9IGZhbHNlO1xyXG5cclxuICBpZiggdGd0Lm5vbmVtcHR5KCkgJiYgIWlzV2l0aGluVGhlc2hvbGQodGd0KSApe1xyXG4gICAgdGhpcy51bnByZXZpZXcodGd0KTtcclxuICB9XHJcblxyXG4gIGZvcihsZXQgaSA9IDA7IGkgPCBub2Rlc0J5RGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICBsZXQgbiA9IG5vZGVzQnlEaXN0W2ldO1xyXG5cclxuICAgIC8vIHNraXAgYSBwYXJlbnQgbm9kZSB3aGVuIHRoZSBtb3VzZSBpcyBpbnNpZGUgaXRcclxuICAgIGlmKCBuLmlzUGFyZW50KCkgJiYgbW91c2VJc0luc2lkZShuKSApeyBjb250aW51ZTsgfVxyXG5cclxuICAgIC8vIHNraXAgYSBjaGlsZCBub2RlIHdoZW4gdGhlIG1vdXNlIGlzIG5vdCBpbnNpZGUgdGhlIHBhcmVudFxyXG4gICAgaWYoIG4uaXNDaGlsZCgpICYmICFtb3VzZUlzSW5zaWRlKG4ucGFyZW50KCkpICl7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgaWYoIG4uc2FtZSh0Z3QpIHx8IHRoaXMucHJldmlldyhuLCBhbGxvd0hvdmVyRGVsYXkpICl7XHJcbiAgICAgIHNuYXBwZWQgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBzbmFwcGVkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmV2aWV3KCB0YXJnZXQsIGFsbG93SG92ZXJEZWxheSA9IHRydWUgKXtcclxuICBsZXQgeyBvcHRpb25zLCBzb3VyY2VOb2RlLCBnaG9zdE5vZGUsIGdob3N0RWxlcywgcHJlc3VtcHRpdmVUYXJnZXRzLCBwcmV2aWV3RWxlcywgYWN0aXZlIH0gPSB0aGlzO1xyXG4gIGxldCBzb3VyY2UgPSBzb3VyY2VOb2RlO1xyXG4gIGxldCBpc0xvb3AgPSB0YXJnZXQuc2FtZSggc291cmNlICk7XHJcbiAgbGV0IGxvb3BBbGxvd2VkID0gb3B0aW9ucy5sb29wQWxsb3dlZCggdGFyZ2V0ICk7XHJcbiAgbGV0IGlzR2hvc3QgPSB0YXJnZXQuc2FtZSggZ2hvc3ROb2RlICk7XHJcbiAgbGV0IG5vRWRnZSA9ICFvcHRpb25zLmVkZ2VUeXBlKCBzb3VyY2UsIHRhcmdldCApO1xyXG4gIGxldCBpc0hhbmRsZSA9IHRhcmdldC5zYW1lKCB0aGlzLmhhbmRsZU5vZGUgKTtcclxuICBsZXQgaXNFeGlzdGluZ1RndCA9IHRhcmdldC5zYW1lKCB0aGlzLnRhcmdldE5vZGUgKTtcclxuXHJcbiAgaWYoXHJcbiAgICAhYWN0aXZlIHx8IGlzSGFuZGxlIHx8IGlzR2hvc3QgfHwgbm9FZGdlIHx8IGlzRXhpc3RpbmdUZ3RcclxuICAgIHx8IChpc0xvb3AgJiYgIWxvb3BBbGxvd2VkKVxyXG4gICAgLy8gfHwgKHRhcmdldC5pc1BhcmVudCgpKVxyXG4gICl7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgaWYoIHRoaXMudGFyZ2V0Tm9kZS5ub25lbXB0eSgpICl7XHJcbiAgICB0aGlzLnVucHJldmlldyggdGhpcy50YXJnZXROb2RlICk7XHJcbiAgfVxyXG5cclxuICBjbGVhclRpbWVvdXQoIHRoaXMucHJldmlld1RpbWVvdXQgKTtcclxuXHJcbiAgbGV0IGFwcGx5UHJldmlldyA9ICgpID0+IHtcclxuICAgIHRoaXMudGFyZ2V0Tm9kZSA9IHRhcmdldDtcclxuXHJcbiAgICBwcmVzdW1wdGl2ZVRhcmdldHMubWVyZ2UoIHRhcmdldCApO1xyXG5cclxuICAgIHRhcmdldC5hZGRDbGFzcygnZWgtcHJlc3VtcHRpdmUtdGFyZ2V0Jyk7XHJcbiAgICB0YXJnZXQuYWRkQ2xhc3MoJ2VoLXRhcmdldCcpO1xyXG5cclxuICAgIHRoaXMuZW1pdCggJ2hvdmVyb3ZlcicsIHRoaXMubXAoKSwgc291cmNlLCB0YXJnZXQgKTtcclxuXHJcbiAgICBpZiggb3B0aW9ucy5wcmV2aWV3ICl7XHJcbiAgICAgIHRhcmdldC5hZGRDbGFzcygnZWgtcHJldmlldycpO1xyXG5cclxuICAgICAgZ2hvc3RFbGVzLmFkZENsYXNzKCdlaC1wcmV2aWV3LWFjdGl2ZScpO1xyXG4gICAgICBzb3VyY2VOb2RlLmFkZENsYXNzKCdlaC1wcmV2aWV3LWFjdGl2ZScpO1xyXG4gICAgICB0YXJnZXQuYWRkQ2xhc3MoJ2VoLXByZXZpZXctYWN0aXZlJyk7XHJcblxyXG4gICAgICB0aGlzLm1ha2VQcmV2aWV3KCk7XHJcblxyXG4gICAgICB0aGlzLmVtaXQoICdwcmV2aWV3b24nLCB0aGlzLm1wKCksIHNvdXJjZSwgdGFyZ2V0LCBwcmV2aWV3RWxlcyApO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGlmKCBhbGxvd0hvdmVyRGVsYXkgJiYgb3B0aW9ucy5ob3ZlckRlbGF5ID4gMCApe1xyXG4gICAgdGhpcy5wcmV2aWV3VGltZW91dCA9IHNldFRpbWVvdXQoIGFwcGx5UHJldmlldywgb3B0aW9ucy5ob3ZlckRlbGF5ICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGFwcGx5UHJldmlldygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVucHJldmlldyggdGFyZ2V0ICkge1xyXG4gIGlmKCAhdGhpcy5hY3RpdmUgfHwgdGFyZ2V0LnNhbWUoIHRoaXMuaGFuZGxlTm9kZSApICl7IHJldHVybjsgfVxyXG5cclxuICBsZXQgeyBwcmV2aWV3VGltZW91dCwgc291cmNlTm9kZSwgcHJldmlld0VsZXMsIGdob3N0RWxlcywgY3kgfSA9IHRoaXM7XHJcbiAgY2xlYXJUaW1lb3V0KCBwcmV2aWV3VGltZW91dCApO1xyXG4gIHRoaXMucHJldmlld1RpbWVvdXQgPSBudWxsO1xyXG5cclxuICBsZXQgc291cmNlID0gc291cmNlTm9kZTtcclxuXHJcbiAgdGFyZ2V0LnJlbW92ZUNsYXNzKCdlaC1wcmV2aWV3IGVoLXRhcmdldCBlaC1wcmVzdW1wdGl2ZS10YXJnZXQgZWgtcHJldmlldy1hY3RpdmUnKTtcclxuICBnaG9zdEVsZXMucmVtb3ZlQ2xhc3MoJ2VoLXByZXZpZXctYWN0aXZlJyk7XHJcbiAgc291cmNlTm9kZS5yZW1vdmVDbGFzcygnZWgtcHJldmlldy1hY3RpdmUnKTtcclxuXHJcbiAgdGhpcy50YXJnZXROb2RlID0gY3kuY29sbGVjdGlvbigpO1xyXG5cclxuICB0aGlzLnJlbW92ZVByZXZpZXcoIHNvdXJjZSwgdGFyZ2V0ICk7XHJcblxyXG4gIHRoaXMuZW1pdCggJ2hvdmVyb3V0JywgdGhpcy5tcCgpLCBzb3VyY2UsIHRhcmdldCApO1xyXG4gIHRoaXMuZW1pdCggJ3ByZXZpZXdvZmYnLCB0aGlzLm1wKCksIHNvdXJjZSwgdGFyZ2V0LCBwcmV2aWV3RWxlcyApO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcCgpe1xyXG4gIGlmKCAhdGhpcy5hY3RpdmUgKXsgcmV0dXJuOyB9XHJcblxyXG4gIGxldCB7IHNvdXJjZU5vZGUsIHRhcmdldE5vZGUsIGdob3N0RWxlcywgcHJlc3VtcHRpdmVUYXJnZXRzIH0gPSB0aGlzO1xyXG5cclxuICBjbGVhclRpbWVvdXQoIHRoaXMucHJldmlld1RpbWVvdXQgKTtcclxuXHJcbiAgc291cmNlTm9kZS5yZW1vdmVDbGFzcygnZWgtc291cmNlJyk7XHJcbiAgdGFyZ2V0Tm9kZS5yZW1vdmVDbGFzcygnZWgtdGFyZ2V0IGVoLXByZXZpZXcgZWgtaG92ZXInKTtcclxuICBwcmVzdW1wdGl2ZVRhcmdldHMucmVtb3ZlQ2xhc3MoJ2VoLXByZXN1bXB0aXZlLXRhcmdldCcpO1xyXG5cclxuICB0aGlzLm1ha2VFZGdlcygpO1xyXG5cclxuICB0aGlzLnJlbW92ZUhhbmRsZSgpO1xyXG5cclxuICBnaG9zdEVsZXMucmVtb3ZlKCk7XHJcblxyXG4gIHRoaXMuY2xlYXJDb2xsZWN0aW9ucygpO1xyXG5cclxuICB0aGlzLnJlc2V0R2VzdHVyZXMoKTtcclxuICB0aGlzLmVuYWJsZUVkZ2VFdmVudHMoKTtcclxuXHJcbiAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgdGhpcy5lbWl0KCAnc3RvcCcsIHRoaXMubXAoKSwgc291cmNlTm9kZSApO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgc2hvdywgaGlkZSwgc3RhcnQsIHVwZGF0ZSwgcHJldmlldywgdW5wcmV2aWV3LCBzdG9wLCBzbmFwLFxyXG4gIGNhblN0YXJ0T24sIGNhblN0YXJ0RHJhd01vZGVPbiwgY2FuU3RhcnROb25EcmF3TW9kZU9uXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lZGdlaGFuZGxlcy9nZXN0dXJlLWxpZmVjeWNsZS5qcyIsImNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xyXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCcuLi9hc3NpZ24nKTtcclxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKTtcclxuXHJcbmNvbnN0IGN5R2VzdHVyZXNUb2dnbGUgPSByZXF1aXJlKCcuL2N5LWdlc3R1cmVzLXRvZ2dsZScpO1xyXG5jb25zdCBjeUxpc3RlbmVycyA9IHJlcXVpcmUoJy4vY3ktbGlzdGVuZXJzJyk7XHJcbmNvbnN0IGRyYXdNb2RlID0gcmVxdWlyZSgnLi9kcmF3LW1vZGUnKTtcclxuY29uc3QgZHJhd2luZyA9IHJlcXVpcmUoJy4vZHJhd2luZycpO1xyXG5jb25zdCBlbmFibGluZyA9IHJlcXVpcmUoJy4vZW5hYmxpbmcnKTtcclxuY29uc3QgZ2VzdHVyZUxpZmVjeWNsZSA9IHJlcXVpcmUoJy4vZ2VzdHVyZS1saWZlY3ljbGUnKTtcclxuY29uc3QgbGlzdGVuZXJzID0gcmVxdWlyZSgnLi9saXN0ZW5lcnMnKTtcclxuY29uc3QgZWRnZUV2ZW50cyA9IHJlcXVpcmUoJy4vZWRnZS1ldmVudHMtdG9nZ2xlJyk7XHJcblxyXG5mdW5jdGlvbiBFZGdlaGFuZGxlcyggb3B0aW9ucyApe1xyXG4gIGxldCBjeSA9IG9wdGlvbnMuY3k7XHJcblxyXG4gIHRoaXMuY3kgPSBjeTtcclxuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG5cclxuICAvLyBlZGdlaGFuZGxlcyBnZXN0dXJlIHN0YXRlXHJcbiAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICB0aGlzLmRyYXdNb2RlID0gZmFsc2U7XHJcbiAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICB0aGlzLmdyYWJiaW5nTm9kZSA9IGZhbHNlO1xyXG5cclxuICAvLyBlZGdlaGFuZGxlcyBlbGVtZW50c1xyXG4gIHRoaXMuaGFuZGxlTm9kZSA9IGN5LmNvbGxlY3Rpb24oKTtcclxuICB0aGlzLmNsZWFyQ29sbGVjdGlvbnMoKTtcclxuXHJcbiAgLy8gaGFuZGxlXHJcbiAgdGhpcy5oeCA9IDA7XHJcbiAgdGhpcy5oeSA9IDA7XHJcbiAgdGhpcy5ociA9IDA7XHJcblxyXG4gIC8vIG1vdXNlIHBvc2l0aW9uXHJcbiAgdGhpcy5teCA9IDA7XHJcbiAgdGhpcy5teSA9IDA7XHJcblxyXG4gIHRoaXMub3B0aW9ucyA9IGFzc2lnbigge30sIGRlZmF1bHRzLCBvcHRpb25zICk7XHJcblxyXG4gIHRoaXMuc2F2ZUdlc3R1cmVTdGF0ZSgpO1xyXG4gIHRoaXMuYWRkTGlzdGVuZXJzKCk7XHJcblxyXG4gIHRoaXMudGhyb3R0bGVkU25hcCA9IHRocm90dGxlKCB0aGlzLnNuYXAuYmluZCh0aGlzKSwgMTAwMC9vcHRpb25zLnNuYXBGcmVxdWVuY3kgKTtcclxuXHJcbiAgdGhpcy5wcmV2ZW50RGVmYXVsdCA9IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBsZXQgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XHJcbiAgdHJ5IHtcclxuICAgIGxldCBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KCB7fSwgJ3Bhc3NpdmUnLCB7XHJcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcclxuICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICd0ZXN0JywgbnVsbCwgb3B0cyApO1xyXG4gIH0gY2F0Y2goIGVyciApe31cclxuXHJcbiAgaWYoIHN1cHBvcnRzUGFzc2l2ZSApe1xyXG4gICAgdGhpcy53aW5kb3dMaXN0ZW5lck9wdGlvbnMgPSB7IGNhcHR1cmU6IHRydWUsIHBhc3NpdmU6IGZhbHNlIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMud2luZG93TGlzdGVuZXJPcHRpb25zID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmxldCBwcm90byA9IEVkZ2VoYW5kbGVzLnByb3RvdHlwZSA9IHt9O1xyXG5sZXQgZXh0ZW5kID0gb2JqID0+IGFzc2lnbiggcHJvdG8sIG9iaiApO1xyXG5cclxucHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMoKTtcclxufTtcclxuXHJcbnByb3RvLnNldE9wdGlvbnMgPSBmdW5jdGlvbiggb3B0aW9ucyApe1xyXG4gIGFzc2lnbiggdGhpcy5vcHRpb25zLCBvcHRpb25zICk7XHJcbn07XHJcblxyXG5wcm90by5tcCA9IGZ1bmN0aW9uKCl7XHJcbiAgcmV0dXJuIHsgeDogdGhpcy5teCwgeTogdGhpcy5teSB9O1xyXG59O1xyXG5cclxucHJvdG8uaHAgPSBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB7IHg6IHRoaXMuaHgsIHk6IHRoaXMuaHkgfTtcclxufTtcclxuXHJcbnByb3RvLmNsZWFyQ29sbGVjdGlvbnMgPSBmdW5jdGlvbigpe1xyXG4gIGxldCB7IGN5IH0gPSB0aGlzO1xyXG5cclxuICB0aGlzLnByZXZpZXdFbGVzID0gY3kuY29sbGVjdGlvbigpO1xyXG4gIHRoaXMuZ2hvc3RFbGVzID0gY3kuY29sbGVjdGlvbigpO1xyXG4gIHRoaXMuZ2hvc3ROb2RlID0gY3kuY29sbGVjdGlvbigpO1xyXG4gIHRoaXMuc291cmNlTm9kZSA9IGN5LmNvbGxlY3Rpb24oKTtcclxuICB0aGlzLnRhcmdldE5vZGUgPSBjeS5jb2xsZWN0aW9uKCk7XHJcbiAgdGhpcy5wcmVzdW1wdGl2ZVRhcmdldHMgPSBjeS5jb2xsZWN0aW9uKCk7XHJcbn07XHJcblxyXG5bXHJcbiAgY3lHZXN0dXJlc1RvZ2dsZSxcclxuICBjeUxpc3RlbmVycyxcclxuICBkcmF3TW9kZSxcclxuICBkcmF3aW5nLFxyXG4gIGVuYWJsaW5nLFxyXG4gIGdlc3R1cmVMaWZlY3ljbGUsXHJcbiAgbGlzdGVuZXJzLFxyXG4gIGVkZ2VFdmVudHNcclxuXS5mb3JFYWNoKCBleHRlbmQgKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWRnZWhhbmRsZXM7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lZGdlaGFuZGxlcy9pbmRleC5qcyIsImZ1bmN0aW9uIGFkZExpc3RlbmVycygpe1xyXG4gIHRoaXMuYWRkQ3l0b3NjYXBlTGlzdGVuZXJzKCk7XHJcblxyXG4gIHRoaXMuYWRkTGlzdGVuZXIoIHRoaXMuY3ksICdkZXN0cm95JywgKCkgPT4gdGhpcy5kZXN0cm95KCkgKTtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycygpe1xyXG4gIGZvciggbGV0IGkgPSB0aGlzLmxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSApe1xyXG4gICAgbGV0IGwgPSB0aGlzLmxpc3RlbmVyc1tpXTtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCBsLnRhcmdldCwgbC5ldmVudCwgbC5zZWxlY3RvciwgbC5jYWxsYmFjaywgbC5vcHRpb25zICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TGlzdGVuZXIoIHRhcmdldCwgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjaywgb3B0aW9ucyApe1xyXG4gIGlmKCB0eXBlb2Ygc2VsZWN0b3IgIT09IHR5cGVvZiAnJyApe1xyXG4gICAgY2FsbGJhY2sgPSBzZWxlY3RvcjtcclxuICAgIG9wdGlvbnMgPSBjYWxsYmFjaztcclxuICAgIHNlbGVjdG9yID0gbnVsbDtcclxuICB9XHJcblxyXG4gIGlmKCBvcHRpb25zID09IG51bGwgKXtcclxuICAgIG9wdGlvbnMgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7IHRhcmdldCwgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjaywgb3B0aW9ucyB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0RvbSggdGFyZ2V0ICl7XHJcbiAgcmV0dXJuIHRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZExpc3RlbmVyKCB0YXJnZXQsIGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2ssIG9wdGlvbnMgKXtcclxuICBsZXQgbCA9IGdldExpc3RlbmVyKCB0YXJnZXQsIGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2ssIG9wdGlvbnMgKTtcclxuXHJcbiAgdGhpcy5saXN0ZW5lcnMucHVzaCggbCApO1xyXG5cclxuICBpZiggaXNEb20oIGwudGFyZ2V0ICkgKXtcclxuICAgIGwudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoIGwuZXZlbnQsIGwuY2FsbGJhY2ssIGwub3B0aW9ucyApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiggbC5zZWxlY3RvciApe1xyXG4gICAgICBsLnRhcmdldC5hZGRMaXN0ZW5lciggbC5ldmVudCwgbC5zZWxlY3RvciwgbC5jYWxsYmFjaywgbC5vcHRpb25zICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsLnRhcmdldC5hZGRMaXN0ZW5lciggbC5ldmVudCwgbC5jYWxsYmFjaywgbC5vcHRpb25zICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoIHRhcmdldCwgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjaywgb3B0aW9ucyApe1xyXG4gIGxldCBsID0gZ2V0TGlzdGVuZXIoIHRhcmdldCwgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjaywgb3B0aW9ucyApO1xyXG5cclxuICBmb3IoIGxldCBpID0gdGhpcy5saXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0gKXtcclxuICAgIGxldCBsMiA9IHRoaXMubGlzdGVuZXJzW2ldO1xyXG5cclxuICAgIGlmKFxyXG4gICAgICBsLnRhcmdldCA9PT0gbDIudGFyZ2V0XHJcbiAgICAgICYmIGwuZXZlbnQgPT09IGwyLmV2ZW50XHJcbiAgICAgICYmICggbC5zZWxlY3RvciA9PSBudWxsIHx8IGwuc2VsZWN0b3IgPT09IGwyLnNlbGVjdG9yIClcclxuICAgICAgJiYgKCBsLmNhbGxiYWNrID09IG51bGwgfHwgbC5jYWxsYmFjayA9PT0gbDIuY2FsbGJhY2sgKVxyXG4gICAgKXtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKCBpLCAxICk7XHJcblxyXG4gICAgICBpZiggaXNEb20oIGwudGFyZ2V0ICkgKXtcclxuICAgICAgICBsLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCBsLmV2ZW50LCBsLmNhbGxiYWNrLCBsLm9wdGlvbnMgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiggbC5zZWxlY3RvciApe1xyXG4gICAgICAgICAgbC50YXJnZXQucmVtb3ZlTGlzdGVuZXIoIGwuZXZlbnQsIGwuc2VsZWN0b3IsIGwuY2FsbGJhY2ssIGwub3B0aW9ucyApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsLnRhcmdldC5yZW1vdmVMaXN0ZW5lciggbC5ldmVudCwgbC5jYWxsYmFjaywgbC5vcHRpb25zICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbWl0KCB0eXBlLCBwb3NpdGlvbiwgLi4uYXJncyApe1xyXG4gIGxldCB7IG9wdGlvbnMsIGN5IH0gPSB0aGlzO1xyXG5cclxuICBjeS5lbWl0KCB7IHR5cGU6IGBlaCR7dHlwZX1gLCBwb3NpdGlvbiB9LCBhcmdzICk7XHJcblxyXG4gIGxldCBoYW5kbGVyID0gb3B0aW9uc1sgdHlwZSBdO1xyXG5cclxuICBpZiggaGFuZGxlciAhPSBudWxsICl7XHJcbiAgICBoYW5kbGVyKCAuLi5hcmdzICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGFkZExpc3RlbmVyLCBhZGRMaXN0ZW5lcnMsIHJlbW92ZUxpc3RlbmVyLCByZW1vdmVMaXN0ZW5lcnMsIGVtaXQgfTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkZ2VoYW5kbGVzL2xpc3RlbmVycy5qcyIsImNvbnN0IGltcGwgPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHJcbi8vIHJlZ2lzdGVycyB0aGUgZXh0ZW5zaW9uIG9uIGEgY3l0b3NjYXBlIGxpYiByZWZcclxubGV0IHJlZ2lzdGVyID0gZnVuY3Rpb24oIGN5dG9zY2FwZSApe1xyXG4gIGlmKCAhY3l0b3NjYXBlICl7IHJldHVybjsgfSAvLyBjYW4ndCByZWdpc3RlciBpZiBjeXRvc2NhcGUgdW5zcGVjaWZpZWRcclxuXHJcbiAgY3l0b3NjYXBlKCAnY29yZScsICdlZGdlaGFuZGxlcycsIGltcGwgKTsgLy8gcmVnaXN0ZXIgd2l0aCBjeXRvc2NhcGUuanNcclxufTtcclxuXHJcbmlmKCB0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJyApeyAvLyBleHBvc2UgdG8gZ2xvYmFsIGN5dG9zY2FwZSAoaS5lLiB3aW5kb3cuY3l0b3NjYXBlKVxyXG4gIHJlZ2lzdGVyKCBjeXRvc2NhcGUgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMTNfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwibG9kYXNoLm1lbW9pemVcIixcImNvbW1vbmpzMlwiOlwibG9kYXNoLm1lbW9pemVcIixcImFtZFwiOlwibG9kYXNoLm1lbW9pemVcIixcInJvb3RcIjpbXCJfXCIsXCJtZW1vaXplXCJdfVxuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzE0X187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImxvZGFzaC50aHJvdHRsZVwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2gudGhyb3R0bGVcIixcImFtZFwiOlwibG9kYXNoLnRocm90dGxlXCIsXCJyb290XCI6W1wiX1wiLFwidGhyb3R0bGVcIl19XG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9