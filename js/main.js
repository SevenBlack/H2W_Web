+ function(t) {
	"use strict";

	function e(t, e) {
		var i = document.createElement("div").style;
		for(var s in t)
			if(void 0 !== i[t[s]]) return "pfx" != e || t[s];
		return !1
	}

	function i() {
		var t = document.createElement("bootstrap"),
			e = {
				WebkitTransition: "webkitTransitionEnd",
				MozTransition: "transitionend",
				OTransition: "oTransitionEnd otransitionend",
				transition: "transitionend"
			};
		for(var i in e)
			if(void 0 !== t.style[i]) return {
				end: e[i]
			}
	}

	function s() {
		var t = ["transformProperty", "WebkitTransform", "MozTransform", "msTransform"];
		return !!e(t)
	}

	function o() {
		return "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix
	}
	if(!("ontouchstart" in window || navigator.msMaxTouchPoints)) return !1;
	t.fn.emulateTransitionEnd = function(e) {
		var i = !1,
			s = this;
		t(this).one(t.support.transition.end, function() {
			i = !0
		});
		var o = function() {
			i || t(s).trigger(t.support.transition.end)
		};
		return setTimeout(o, e), this
	}, t(function() {
		t.support.transition = i(), t.support.csstransforms = s(), t.support.csstransforms3d = o()
	});
	var n = "touch-carousel",
		a = function(e, i) {
			return this.$element = t(e), this.$itemsWrapper = this.$element.find(".carousel-inner"), this.$items = this.$element.find(".item"), this.$indicators = this.$element.find(".carousel-indicators"), this.pane_width = this.pane_count = this.current_pane = 0, this.onGesture = !1, this.options = i, this._setPaneDimensions(), this.$items.length <= 1 ? this.disable() : (this._regTouchGestures(), void t(window).on("orientationchange resize", t.proxy(this._setPaneDimensions, this)))
		};
	a.DEFAULTS = {
		interval: !1,
		toughness: .25
	}, a.prototype.cycle = function(e) {
		return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(t.proxy(this.next, this), this.options.interval)), this
	}, a.prototype.to = function(t) {
		return t > this.$items.length - 1 || 0 > t ? void 0 : this._showPane(t)
	}, a.prototype.pause = function(t) {
		return t || (this.paused = !0), clearInterval(this.interval), this.interval = null, this
	}, a.prototype._regTouchGestures = function() {
		this.$itemsWrapper.add(this.$indicators).hammer({
			drag_lock_to_axis: !0
		}).on("release dragleft dragright swipeleft swiperight", t.proxy(this._handleGestures, this))
	}, a.prototype._setPaneDimensions = function() {
		this.pane_width = this.$element.width(), this.pane_count = this.$items.length, this.$itemsWrapper.width(this.pane_width * this.pane_count), this.$items.width(this.pane_width)
	}, a.prototype._showPane = function(t) {
		this.$items.eq(this.current_pane).toggleClass("active"), t >= this.pane_count && this.pause(), t = Math.max(0, Math.min(t, this.pane_count - 1)), this.$items.eq(t).toggleClass("active"), this.current_pane = t;
		var e = -(100 / this.pane_count * this.current_pane);
		return this._setContainerOffset(e, !0, t), this
	}, a.prototype._setContainerOffset = function(e, i, s) {
		var o = this;
		if(this.$itemsWrapper.removeClass("animate"), i && this.$itemsWrapper.addClass("animate"), t.support.csstransforms3d) this.onGesture = !0, this.$itemsWrapper.css("transform", "translate3d(" + e + "%,0,0) scale3d(1,1,1)");
		else if(t.support.csstransforms) this.onGesture = !0, this.$itemsWrapper.css("transform", "translate(" + e + "%,0)");
		else {
			var n = this.pane_width * this.pane_count / 100 * e;
			this.$itemsWrapper.css("left", n + "px")
		}
		t.support.transition ? this.$itemsWrapper.one(t.support.transition.end, function() {
			o.$itemsWrapper.removeClass("animate"), o.onGesture = !1, o._updateIndicators(s)
		}) : (this.$itemsWrapper.removeClass("animate"), this.onGesture = !1, this._updateIndicators(s))
	}, a.prototype.next = function() {
		return this._showPane(this.current_pane + 1)
	}, a.prototype.prev = function() {
		return this._showPane(this.current_pane - 1)
	}, a.prototype._handleGestures = function(t) {
		if(t.gesture.preventDefault(), !this.sliding) switch(this.pause(), t.type) {
			case "dragright":
			case "dragleft":
				var e = -(100 / this.pane_count) * this.current_pane,
					i = 100 / this.pane_width * t.gesture.deltaX / this.pane_count;
				(0 === this.current_pane && t.gesture.direction == Hammer.DIRECTION_RIGHT || this.current_pane == this.pane_count - 1 && t.gesture.direction == Hammer.DIRECTION_LEFT) && (i *= this.options.toughness), this._setContainerOffset(i + e);
				break;
			case "swipeleft":
				this.next(), t.gesture.stopDetect();
				break;
			case "swiperight":
				this.prev(), t.gesture.stopDetect();
				break;
			case "release":
				Math.abs(t.gesture.deltaX) > this.pane_width / 2 ? "right" == t.gesture.direction ? this.prev() : this.next() : this._showPane(this.current_pane, !0)
		}
	}, a.prototype.disable = function() {
		return this.$indicators.hide(), this.$element.removeData(n), !1
	}, a.prototype._updateIndicators = function(t) {
		return this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$indicators.children().eq(t).addClass("active")), this
	};
	var r = t.fn.carousel;
	t.fn.carousel = function(e) {
		return this.each(function() {
			var i = t(this),
				s = i.data(n),
				o = t.extend({}, a.DEFAULTS, i.data(), "object" == typeof e && e),
				r = "string" == typeof e ? e : o.slide;
			s || i.data(n, s = new a(this, o)).addClass(n), "number" == typeof e ? s.to(e) : r ? s[r]() : o.interval && s.pause().cycle()
		})
	}, t.fn.carousel.Constructor = a, t.fn.carousel.noConflict = function() {
		return t.fn.carousel = r, this
	}, t(document).off("click.bs.carousel").on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(e) {
		var i, s = t(this),
			o = t(s.attr("data-target") || (i = s.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "")),
			a = t.extend({}, o.data(), s.data()),
			r = s.attr("data-slide-to");
		r && (a.interval = !1), o.carousel(a), (r = s.attr("data-slide-to")) && o.data(n).to(r), e.preventDefault()
	})
}(window.jQuery),
function(t, e) {
	"use strict";

	function i() {
		if(!s.READY) {
			s.event.determineEventTypes();
			for(var t in s.gestures) s.gestures.hasOwnProperty(t) && s.detection.register(s.gestures[t]);
			s.event.onTouch(s.DOCUMENT, s.EVENT_MOVE, s.detection.detect), s.event.onTouch(s.DOCUMENT, s.EVENT_END, s.detection.detect), s.READY = !0
		}
	}
	var s = function(t, e) {
		return new s.Instance(t, e || {})
	};
	s.defaults = {
		stop_browser_behavior: {
			userSelect: "none",
			touchAction: "none",
			touchCallout: "none",
			contentZooming: "none",
			userDrag: "none",
			tapHighlightColor: "rgba(0,0,0,0)"
		}
	}, s.HAS_POINTEREVENTS = t.navigator.pointerEnabled || t.navigator.msPointerEnabled, s.HAS_TOUCHEVENTS = "ontouchstart" in t, s.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i, s.NO_MOUSEEVENTS = s.HAS_TOUCHEVENTS && t.navigator.userAgent.match(s.MOBILE_REGEX), s.EVENT_TYPES = {}, s.DIRECTION_DOWN = "down", s.DIRECTION_LEFT = "left", s.DIRECTION_UP = "up", s.DIRECTION_RIGHT = "right", s.POINTER_MOUSE = "mouse", s.POINTER_TOUCH = "touch", s.POINTER_PEN = "pen", s.EVENT_START = "start", s.EVENT_MOVE = "move", s.EVENT_END = "end", s.DOCUMENT = t.document, s.plugins = {}, s.READY = !1, s.Instance = function(t, e) {
		var o = this;
		return i(), this.element = t, this.enabled = !0, this.options = s.utils.extend(s.utils.extend({}, s.defaults), e || {}), this.options.stop_browser_behavior && s.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), s.event.onTouch(t, s.EVENT_START, function(t) {
			o.enabled && s.detection.startDetect(o, t)
		}), this
	}, s.Instance.prototype = {
		on: function(t, e) {
			for(var i = t.split(" "), s = 0; s < i.length; s++) this.element.addEventListener(i[s], e, !1);
			return this
		},
		off: function(t, e) {
			for(var i = t.split(" "), s = 0; s < i.length; s++) this.element.removeEventListener(i[s], e, !1);
			return this
		},
		trigger: function(t, e) {
			e || (e = {});
			var i = s.DOCUMENT.createEvent("Event");
			i.initEvent(t, !0, !0), i.gesture = e;
			var o = this.element;
			return s.utils.hasParent(e.target, o) && (o = e.target), o.dispatchEvent(i), this
		},
		enable: function(t) {
			return this.enabled = t, this
		}
	};
	var o = null,
		n = !1,
		a = !1;
	s.event = {
		bindDom: function(t, e, i) {
			for(var s = e.split(" "), o = 0; o < s.length; o++) t.addEventListener(s[o], i, !1)
		},
		onTouch: function(t, e, i) {
			var r = this;
			this.bindDom(t, s.EVENT_TYPES[e], function(l) {
				var h = l.type.toLowerCase();
				if(!h.match(/mouse/) || !a) {
					h.match(/touch/) || h.match(/pointerdown/) || h.match(/mouse/) && 1 === l.which ? n = !0 : h.match(/mouse/) && 1 !== l.which && (n = !1), h.match(/touch|pointer/) && (a = !0);
					var d = 0;
					n && (s.HAS_POINTEREVENTS && e != s.EVENT_END ? d = s.PointerEvent.updatePointer(e, l) : h.match(/touch/) ? d = l.touches.length : a || (d = h.match(/up/) ? 0 : 1), d > 0 && e == s.EVENT_END ? e = s.EVENT_MOVE : d || (e = s.EVENT_END), (d || null === o) && (o = l), i.call(s.detection, r.collectEventData(t, e, r.getTouchList(o, e), l)), s.HAS_POINTEREVENTS && e == s.EVENT_END && (d = s.PointerEvent.updatePointer(e, l))), d || (o = null, n = !1, a = !1, s.PointerEvent.reset())
				}
			})
		},
		determineEventTypes: function() {
			var t;
			t = s.HAS_POINTEREVENTS ? s.PointerEvent.getEvents() : s.NO_MOUSEEVENTS ? ["touchstart", "touchmove", "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], s.EVENT_TYPES[s.EVENT_START] = t[0], s.EVENT_TYPES[s.EVENT_MOVE] = t[1], s.EVENT_TYPES[s.EVENT_END] = t[2]
		},
		getTouchList: function(t) {
			return s.HAS_POINTEREVENTS ? s.PointerEvent.getTouchList() : t.touches ? t.touches : (t.indentifier = 1, [t])
		},
		collectEventData: function(t, e, i, o) {
			var n = s.POINTER_TOUCH;
			return(o.type.match(/mouse/) || s.PointerEvent.matchType(s.POINTER_MOUSE, o)) && (n = s.POINTER_MOUSE), {
				center: s.utils.getCenter(i),
				timeStamp: (new Date).getTime(),
				target: o.target,
				touches: i,
				eventType: e,
				pointerType: n,
				srcEvent: o,
				preventDefault: function() {
					this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
				},
				stopPropagation: function() {
					this.srcEvent.stopPropagation()
				},
				stopDetect: function() {
					return s.detection.stopDetect()
				}
			}
		}
	}, s.PointerEvent = {
		pointers: {},
		getTouchList: function() {
			var t = this,
				e = [];
			return Object.keys(t.pointers).sort().forEach(function(i) {
				e.push(t.pointers[i])
			}), e
		},
		updatePointer: function(t, e) {
			return t == s.EVENT_END ? this.pointers = {} : (e.identifier = e.pointerId, this.pointers[e.pointerId] = e), Object.keys(this.pointers).length
		},
		matchType: function(t, e) {
			if(!e.pointerType) return !1;
			var i = {};
			return i[s.POINTER_MOUSE] = e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == s.POINTER_MOUSE, i[s.POINTER_TOUCH] = e.pointerType == e.MSPOINTER_TYPE_TOUCH || e.pointerType == s.POINTER_TOUCH, i[s.POINTER_PEN] = e.pointerType == e.MSPOINTER_TYPE_PEN || e.pointerType == s.POINTER_PEN, i[t]
		},
		getEvents: function() {
			return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
		},
		reset: function() {
			this.pointers = {}
		}
	}, s.utils = {
		extend: function(t, i, s) {
			for(var o in i) t[o] !== e && s || (t[o] = i[o]);
			return t
		},
		hasParent: function(t, e) {
			for(; t;) {
				if(t == e) return !0;
				t = t.parentNode
			}
			return !1
		},
		getCenter: function(t) {
			for(var e = [], i = [], s = 0, o = t.length; o > s; s++) e.push(t[s].pageX), i.push(t[s].pageY);
			return {
				pageX: (Math.min.apply(Math, e) + Math.max.apply(Math, e)) / 2,
				pageY: (Math.min.apply(Math, i) + Math.max.apply(Math, i)) / 2
			}
		},
		getVelocity: function(t, e, i) {
			return {
				x: Math.abs(e / t) || 0,
				y: Math.abs(i / t) || 0
			}
		},
		getAngle: function(t, e) {
			var i = e.pageY - t.pageY,
				s = e.pageX - t.pageX;
			return 180 * Math.atan2(i, s) / Math.PI
		},
		getDirection: function(t, e) {
			var i = Math.abs(t.pageX - e.pageX),
				o = Math.abs(t.pageY - e.pageY);
			return i >= o ? t.pageX - e.pageX > 0 ? s.DIRECTION_LEFT : s.DIRECTION_RIGHT : t.pageY - e.pageY > 0 ? s.DIRECTION_UP : s.DIRECTION_DOWN
		},
		getDistance: function(t, e) {
			var i = e.pageX - t.pageX,
				s = e.pageY - t.pageY;
			return Math.sqrt(i * i + s * s)
		},
		getScale: function(t, e) {
			return t.length >= 2 && e.length >= 2 ? this.getDistance(e[0], e[1]) / this.getDistance(t[0], t[1]) : 1
		},
		getRotation: function(t, e) {
			return t.length >= 2 && e.length >= 2 ? this.getAngle(e[1], e[0]) - this.getAngle(t[1], t[0]) : 0
		},
		isVertical: function(t) {
			return t == s.DIRECTION_UP || t == s.DIRECTION_DOWN
		},
		stopDefaultBrowserBehavior: function(t, e) {
			var i, s = ["webkit", "khtml", "moz", "Moz", "ms", "o", ""];
			if(e && t.style) {
				for(var o = 0; o < s.length; o++)
					for(var n in e) e.hasOwnProperty(n) && (i = n, s[o] && (i = s[o] + i.substring(0, 1).toUpperCase() + i.substring(1)), t.style[i] = e[n]);
				"none" == e.userSelect && (t.onselectstart = function() {
					return !1
				}), "none" == e.userDrag && (t.ondragstart = function() {
					return !1
				})
			}
		}
	}, s.detection = {
		gestures: [],
		current: null,
		previous: null,
		stopped: !1,
		startDetect: function(t, e) {
			this.current || (this.stopped = !1, this.current = {
				inst: t,
				startEvent: s.utils.extend({}, e),
				lastEvent: !1,
				name: ""
			}, this.detect(e))
		},
		detect: function(t) {
			if(this.current && !this.stopped) {
				t = this.extendEventData(t);
				for(var e = this.current.inst.options, i = 0, o = this.gestures.length; o > i; i++) {
					var n = this.gestures[i];
					if(!this.stopped && e[n.name] !== !1 && n.handler.call(n, t, this.current.inst) === !1) {
						this.stopDetect();
						break
					}
				}
				return this.current && (this.current.lastEvent = t), t.eventType == s.EVENT_END && !t.touches.length - 1 && this.stopDetect(), t
			}
		},
		stopDetect: function() {
			this.previous = s.utils.extend({}, this.current), this.current = null, this.stopped = !0
		},
		extendEventData: function(t) {
			var e = this.current.startEvent;
			if(e && (t.touches.length != e.touches.length || t.touches === e.touches)) {
				e.touches = [];
				for(var i = 0, o = t.touches.length; o > i; i++) e.touches.push(s.utils.extend({}, t.touches[i]))
			}
			var n = t.timeStamp - e.timeStamp,
				a = t.center.pageX - e.center.pageX,
				r = t.center.pageY - e.center.pageY,
				l = s.utils.getVelocity(n, a, r);
			return s.utils.extend(t, {
				deltaTime: n,
				deltaX: a,
				deltaY: r,
				velocityX: l.x,
				velocityY: l.y,
				distance: s.utils.getDistance(e.center, t.center),
				angle: s.utils.getAngle(e.center, t.center),
				interimAngle: this.current.lastEvent && s.utils.getAngle(this.current.lastEvent.center, t.center),
				direction: s.utils.getDirection(e.center, t.center),
				interimDirection: this.current.lastEvent && s.utils.getDirection(this.current.lastEvent.center, t.center),
				scale: s.utils.getScale(e.touches, t.touches),
				rotation: s.utils.getRotation(e.touches, t.touches),
				startEvent: e
			}), t
		},
		register: function(t) {
			var i = t.defaults || {};
			return i[t.name] === e && (i[t.name] = !0), s.utils.extend(s.defaults, i, !0), t.index = t.index || 1e3, this.gestures.push(t), this.gestures.sort(function(t, e) {
				return t.index < e.index ? -1 : t.index > e.index ? 1 : 0
			}), this.gestures
		}
	}, s.gestures = s.gestures || {}, s.gestures.Hold = {
		name: "hold",
		index: 10,
		defaults: {
			hold_timeout: 500,
			hold_threshold: 1
		},
		timer: null,
		handler: function(t, e) {
			switch(t.eventType) {
				case s.EVENT_START:
					clearTimeout(this.timer), s.detection.current.name = this.name, this.timer = setTimeout(function() {
						"hold" == s.detection.current.name && e.trigger("hold", t)
					}, e.options.hold_timeout);
					break;
				case s.EVENT_MOVE:
					t.distance > e.options.hold_threshold && clearTimeout(this.timer);
					break;
				case s.EVENT_END:
					clearTimeout(this.timer)
			}
		}
	}, s.gestures.Tap = {
		name: "tap",
		index: 100,
		defaults: {
			tap_max_touchtime: 250,
			tap_max_distance: 10,
			tap_always: !0,
			doubletap_distance: 20,
			doubletap_interval: 300
		},
		handler: function(t, e) {
			if(t.eventType == s.EVENT_END && "touchcancel" != t.srcEvent.type) {
				var i = s.detection.previous,
					o = !1;
				if(t.deltaTime > e.options.tap_max_touchtime || t.distance > e.options.tap_max_distance) return;
				i && "tap" == i.name && t.timeStamp - i.lastEvent.timeStamp < e.options.doubletap_interval && t.distance < e.options.doubletap_distance && (e.trigger("doubletap", t), o = !0), (!o || e.options.tap_always) && (s.detection.current.name = "tap", e.trigger(s.detection.current.name, t))
			}
		}
	}, s.gestures.Swipe = {
		name: "swipe",
		index: 40,
		defaults: {
			swipe_max_touches: 1,
			swipe_velocity: .7
		},
		handler: function(t, e) {
			if(t.eventType == s.EVENT_END) {
				if(e.options.swipe_max_touches > 0 && t.touches.length > e.options.swipe_max_touches) return;
				(t.velocityX > e.options.swipe_velocity || t.velocityY > e.options.swipe_velocity) && (e.trigger(this.name, t), e.trigger(this.name + t.direction, t))
			}
		}
	}, s.gestures.Drag = {
		name: "drag",
		index: 50,
		defaults: {
			drag_min_distance: 10,
			correct_for_drag_min_distance: !0,
			drag_max_touches: 1,
			drag_block_horizontal: !1,
			drag_block_vertical: !1,
			drag_lock_to_axis: !1,
			drag_lock_min_distance: 25
		},
		triggered: !1,
		handler: function(t, e) {
			if(s.detection.current.name != this.name && this.triggered) return e.trigger(this.name + "end", t), void(this.triggered = !1);
			if(!(e.options.drag_max_touches > 0 && t.touches.length > e.options.drag_max_touches)) switch(t.eventType) {
				case s.EVENT_START:
					this.triggered = !1;
					break;
				case s.EVENT_MOVE:
					if(t.distance < e.options.drag_min_distance && s.detection.current.name != this.name) return;
					if(s.detection.current.name != this.name && (s.detection.current.name = this.name, e.options.correct_for_drag_min_distance)) {
						var i = Math.abs(e.options.drag_min_distance / t.distance);
						s.detection.current.startEvent.center.pageX += t.deltaX * i, s.detection.current.startEvent.center.pageY += t.deltaY * i, t = s.detection.extendEventData(t)
					}(s.detection.current.lastEvent.drag_locked_to_axis || e.options.drag_lock_to_axis && e.options.drag_lock_min_distance <= t.distance) && (t.drag_locked_to_axis = !0);
					var o = s.detection.current.lastEvent.direction;
					t.drag_locked_to_axis && o !== t.direction && (t.direction = s.utils.isVertical(o) ? t.deltaY < 0 ? s.DIRECTION_UP : s.DIRECTION_DOWN : t.deltaX < 0 ? s.DIRECTION_LEFT : s.DIRECTION_RIGHT), this.triggered || (e.trigger(this.name + "start", t), this.triggered = !0), e.trigger(this.name, t), e.trigger(this.name + t.direction, t), (e.options.drag_block_vertical && s.utils.isVertical(t.direction) || e.options.drag_block_horizontal && !s.utils.isVertical(t.direction)) && t.preventDefault();
					break;
				case s.EVENT_END:
					this.triggered && e.trigger(this.name + "end", t), this.triggered = !1
			}
		}
	}, s.gestures.Transform = {
		name: "transform",
		index: 45,
		defaults: {
			transform_min_scale: .01,
			transform_min_rotation: 1,
			transform_always_block: !1
		},
		triggered: !1,
		handler: function(t, e) {
			if(s.detection.current.name != this.name && this.triggered) return e.trigger(this.name + "end", t), void(this.triggered = !1);
			if(!(t.touches.length < 2)) switch(e.options.transform_always_block && t.preventDefault(), t.eventType) {
				case s.EVENT_START:
					this.triggered = !1;
					break;
				case s.EVENT_MOVE:
					var i = Math.abs(1 - t.scale),
						o = Math.abs(t.rotation);
					if(i < e.options.transform_min_scale && o < e.options.transform_min_rotation) return;
					s.detection.current.name = this.name, this.triggered || (e.trigger(this.name + "start", t), this.triggered = !0), e.trigger(this.name, t), o > e.options.transform_min_rotation && e.trigger("rotate", t), i > e.options.transform_min_scale && (e.trigger("pinch", t), e.trigger("pinch" + (t.scale < 1 ? "in" : "out"), t));
					break;
				case s.EVENT_END:
					this.triggered && e.trigger(this.name + "end", t), this.triggered = !1
			}
		}
	}, s.gestures.Touch = {
		name: "touch",
		index: -1 / 0,
		defaults: {
			prevent_default: !1,
			prevent_mouseevents: !1
		},
		handler: function(t, e) {
			return e.options.prevent_mouseevents && t.pointerType == s.POINTER_MOUSE ? void t.stopDetect() : (e.options.prevent_default && t.preventDefault(), void(t.eventType == s.EVENT_START && e.trigger(this.name, t)))
		}
	}, s.gestures.Release = {
		name: "release",
		index: 1 / 0,
		handler: function(t, e) {
			t.eventType == s.EVENT_END && e.trigger(this.name, t)
		}
	}, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
		return s
	}) : "object" == typeof module && "object" == typeof module.exports ? module.exports = s : t.Hammer = s
}(this),
function(t) {
	"use strict";
	var e = function(e, i) {
		return i === t ? e : (e.event.bindDom = function(e, s, o) {
			i(e).on(s, function(e) {
				var i = e.originalEvent || e;
				i.pageX === t && (i.pageX = e.pageX, i.pageY = e.pageY), i.target || (i.target = e.target), i.which === t && (i.which = i.button), i.preventDefault || (i.preventDefault = e.preventDefault), i.stopPropagation || (i.stopPropagation = e.stopPropagation), o.call(this, i)
			})
		}, e.Instance.prototype.on = function(t, e) {
			return i(this.element).on(t, e)
		}, e.Instance.prototype.off = function(t, e) {
			return i(this.element).off(t, e)
		}, e.Instance.prototype.trigger = function(t, e) {
			var s = i(this.element);
			return s.has(e.target).length && (s = i(e.target)), s.trigger({
				type: t,
				gesture: e
			})
		}, i.fn.hammer = function(t) {
			return this.each(function() {
				var s = i(this),
					o = s.data("hammer");
				o ? o && t && e.utils.extend(o.options, t) : s.data("hammer", new e(this, t || {}))
			})
		}, e)
	};
	"function" == typeof define && "object" == typeof define.amd && define.amd ? define("hammer-jquery", ["hammer", "jquery"], e) : e(window.Hammer, window.jQuery || window.Zepto)
}(),
function(t) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery"], t) : "undefined" != typeof exports ? module.exports = t(require("jquery")) : t(jQuery)
}(function(t) {
	"use strict";
	var e = window.Slick || {};
	e = function() {
		function e(e, s) {
			var o, n = this;
			n.defaults = {
				accessibility: !0,
				adaptiveHeight: !1,
				appendArrows: t(e),
				appendDots: t(e),
				arrows: !0,
				asNavFor: null,
				prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
				nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
				autoplay: !1,
				autoplaySpeed: 3e3,
				centerMode: !1,
				centerPadding: "50px",
				cssEase: "ease",
				customPaging: function(e, i) {
					return t('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1)
				},
				dots: !1,
				dotsClass: "slick-dots",
				draggable: !0,
				easing: "linear",
				edgeFriction: .35,
				fade: !1,
				focusOnSelect: !1,
				infinite: !0,
				initialSlide: 0,
				lazyLoad: "ondemand",
				mobileFirst: !1,
				pauseOnHover: !0,
				pauseOnFocus: !0,
				pauseOnDotsHover: !1,
				respondTo: "window",
				responsive: null,
				rows: 1,
				rtl: !1,
				slide: "",
				slidesPerRow: 1,
				slidesToShow: 1,
				slidesToScroll: 1,
				speed: 500,
				swipe: !0,
				swipeToSlide: !1,
				touchMove: !0,
				touchThreshold: 5,
				useCSS: !0,
				useTransform: !0,
				variableWidth: !1,
				vertical: !1,
				verticalSwiping: !1,
				waitForAnimate: !0,
				zIndex: 1e3
			}, n.initials = {
				animating: !1,
				dragging: !1,
				autoPlayTimer: null,
				currentDirection: 0,
				currentLeft: null,
				currentSlide: 0,
				direction: 1,
				$dots: null,
				listWidth: null,
				listHeight: null,
				loadIndex: 0,
				$nextArrow: null,
				$prevArrow: null,
				slideCount: null,
				slideWidth: null,
				$slideTrack: null,
				$slides: null,
				sliding: !1,
				slideOffset: 0,
				swipeLeft: null,
				$list: null,
				touchObject: {},
				transformsEnabled: !1,
				unslicked: !1
			}, t.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = t(e), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, o = t(e).data("slick") || {}, n.options = t.extend({}, n.defaults, s, o), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, "undefined" != typeof document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = t.proxy(n.autoPlay, n), n.autoPlayClear = t.proxy(n.autoPlayClear, n), n.autoPlayIterator = t.proxy(n.autoPlayIterator, n), n.changeSlide = t.proxy(n.changeSlide, n), n.clickHandler = t.proxy(n.clickHandler, n), n.selectHandler = t.proxy(n.selectHandler, n), n.setPosition = t.proxy(n.setPosition, n), n.swipeHandler = t.proxy(n.swipeHandler, n), n.dragHandler = t.proxy(n.dragHandler, n), n.keyHandler = t.proxy(n.keyHandler, n), n.instanceUid = i++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0)
		}
		var i = 0;
		return e
	}(), e.prototype.activateADA = function() {
		var t = this;
		t.$slideTrack.find(".slick-active").attr({
			"aria-hidden": "false"
		}).find("a, input, button, select").attr({
			tabindex: "0"
		})
	}, e.prototype.addSlide = e.prototype.slickAdd = function(e, i, s) {
		var o = this;
		if("boolean" == typeof i) s = i, i = null;
		else if(i < 0 || i >= o.slideCount) return !1;
		o.unload(), "number" == typeof i ? 0 === i && 0 === o.$slides.length ? t(e).appendTo(o.$slideTrack) : s ? t(e).insertBefore(o.$slides.eq(i)) : t(e).insertAfter(o.$slides.eq(i)) : s === !0 ? t(e).prependTo(o.$slideTrack) : t(e).appendTo(o.$slideTrack), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slides.each(function(e, i) {
			t(i).attr("data-slick-index", e)
		}), o.$slidesCache = o.$slides, o.reinit()
	}, e.prototype.animateHeight = function() {
		var t = this;
		if(1 === t.options.slidesToShow && t.options.adaptiveHeight === !0 && t.options.vertical === !1) {
			var e = t.$slides.eq(t.currentSlide).outerHeight(!0);
			t.$list.animate({
				height: e
			}, t.options.speed)
		}
	}, e.prototype.animateSlide = function(e, i) {
		var s = {},
			o = this;
		o.animateHeight(), o.options.rtl === !0 && o.options.vertical === !1 && (e = -e), o.transformsEnabled === !1 ? o.options.vertical === !1 ? o.$slideTrack.animate({
			left: e
		}, o.options.speed, o.options.easing, i) : o.$slideTrack.animate({
			top: e
		}, o.options.speed, o.options.easing, i) : o.cssTransitions === !1 ? (o.options.rtl === !0 && (o.currentLeft = -o.currentLeft), t({
			animStart: o.currentLeft
		}).animate({
			animStart: e
		}, {
			duration: o.options.speed,
			easing: o.options.easing,
			step: function(t) {
				t = Math.ceil(t), o.options.vertical === !1 ? (s[o.animType] = "translate(" + t + "px, 0px)", o.$slideTrack.css(s)) : (s[o.animType] = "translate(0px," + t + "px)", o.$slideTrack.css(s))
			},
			complete: function() {
				i && i.call()
			}
		})) : (o.applyTransition(), e = Math.ceil(e), o.options.vertical === !1 ? s[o.animType] = "translate3d(" + e + "px, 0px, 0px)" : s[o.animType] = "translate3d(0px," + e + "px, 0px)", o.$slideTrack.css(s), i && setTimeout(function() {
			o.disableTransition(), i.call()
		}, o.options.speed))
	}, e.prototype.getNavTarget = function() {
		var e = this,
			i = e.options.asNavFor;
		return i && null !== i && (i = t(i).not(e.$slider)), i
	}, e.prototype.asNavFor = function(e) {
		var i = this,
			s = i.getNavTarget();
		null !== s && "object" == typeof s && s.each(function() {
			var i = t(this).slick("getSlick");
			i.unslicked || i.slideHandler(e, !0)
		})
	}, e.prototype.applyTransition = function(t) {
		var e = this,
			i = {};
		e.options.fade === !1 ? i[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : i[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, e.options.fade === !1 ? e.$slideTrack.css(i) : e.$slides.eq(t).css(i)
	}, e.prototype.autoPlay = function() {
		var t = this;
		t.autoPlayClear(), t.slideCount > t.options.slidesToShow && (t.autoPlayTimer = setInterval(t.autoPlayIterator, t.options.autoplaySpeed))
	}, e.prototype.autoPlayClear = function() {
		var t = this;
		t.autoPlayTimer && clearInterval(t.autoPlayTimer)
	}, e.prototype.autoPlayIterator = function() {
		var t = this,
			e = t.currentSlide + t.options.slidesToScroll;
		t.paused || t.interrupted || t.focussed || (t.options.infinite === !1 && (1 === t.direction && t.currentSlide + 1 === t.slideCount - 1 ? t.direction = 0 : 0 === t.direction && (e = t.currentSlide - t.options.slidesToScroll, t.currentSlide - 1 === 0 && (t.direction = 1))), t.slideHandler(e))
	}, e.prototype.buildArrows = function() {
		var e = this;
		e.options.arrows === !0 && (e.$prevArrow = t(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = t(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), e.options.infinite !== !0 && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
			"aria-disabled": "true",
			tabindex: "-1"
		}))
	}, e.prototype.buildDots = function() {
		var e, i, s = this;
		if(s.options.dots === !0 && s.slideCount > s.options.slidesToShow) {
			for(s.$slider.addClass("slick-dotted"), i = t("<ul />").addClass(s.options.dotsClass), e = 0; e <= s.getDotCount(); e += 1) i.append(t("<li />").append(s.options.customPaging.call(this, s, e)));
			s.$dots = i.appendTo(s.options.appendDots), s.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
		}
	}, e.prototype.buildOut = function() {
		var e = this;
		e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function(e, i) {
			t(i).attr("data-slick-index", e).data("originalStyling", t(i).attr("style") || "")
		}), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? t('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), e.options.centerMode !== !0 && e.options.swipeToSlide !== !0 || (e.options.slidesToScroll = 1), t("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.options.draggable === !0 && e.$list.addClass("draggable")
	}, e.prototype.buildRows = function() {
		var t, e, i, s, o, n, a, r = this;
		if(s = document.createDocumentFragment(), n = r.$slider.children(), r.options.rows > 1) {
			for(a = r.options.slidesPerRow * r.options.rows, o = Math.ceil(n.length / a), t = 0; t < o; t++) {
				var l = document.createElement("div");
				for(e = 0; e < r.options.rows; e++) {
					var h = document.createElement("div");
					for(i = 0; i < r.options.slidesPerRow; i++) {
						var d = t * a + (e * r.options.slidesPerRow + i);
						n.get(d) && h.appendChild(n.get(d))
					}
					l.appendChild(h)
				}
				s.appendChild(l)
			}
			r.$slider.empty().append(s), r.$slider.children().children().children().css({
				width: 100 / r.options.slidesPerRow + "%",
				display: "inline-block"
			})
		}
	}, e.prototype.checkResponsive = function(e, i) {
		var s, o, n, a = this,
			r = !1,
			l = a.$slider.width(),
			h = window.innerWidth || t(window).width();
		if("window" === a.respondTo ? n = h : "slider" === a.respondTo ? n = l : "min" === a.respondTo && (n = Math.min(h, l)), a.options.responsive && a.options.responsive.length && null !== a.options.responsive) {
			o = null;
			for(s in a.breakpoints) a.breakpoints.hasOwnProperty(s) && (a.originalSettings.mobileFirst === !1 ? n < a.breakpoints[s] && (o = a.breakpoints[s]) : n > a.breakpoints[s] && (o = a.breakpoints[s]));
			null !== o ? null !== a.activeBreakpoint ? (o !== a.activeBreakpoint || i) && (a.activeBreakpoint = o, "unslick" === a.breakpointSettings[o] ? a.unslick(o) : (a.options = t.extend({}, a.originalSettings, a.breakpointSettings[o]), e === !0 && (a.currentSlide = a.options.initialSlide), a.refresh(e)), r = o) : (a.activeBreakpoint = o, "unslick" === a.breakpointSettings[o] ? a.unslick(o) : (a.options = t.extend({}, a.originalSettings, a.breakpointSettings[o]), e === !0 && (a.currentSlide = a.options.initialSlide), a.refresh(e)), r = o) : null !== a.activeBreakpoint && (a.activeBreakpoint = null, a.options = a.originalSettings, e === !0 && (a.currentSlide = a.options.initialSlide), a.refresh(e), r = o), e || r === !1 || a.$slider.trigger("breakpoint", [a, r])
		}
	}, e.prototype.changeSlide = function(e, i) {
		var s, o, n, a = this,
			r = t(e.currentTarget);
		switch(r.is("a") && e.preventDefault(), r.is("li") || (r = r.closest("li")), n = a.slideCount % a.options.slidesToScroll !== 0, s = n ? 0 : (a.slideCount - a.currentSlide) % a.options.slidesToScroll, e.data.message) {
			case "previous":
				o = 0 === s ? a.options.slidesToScroll : a.options.slidesToShow - s, a.slideCount > a.options.slidesToShow && a.slideHandler(a.currentSlide - o, !1, i);
				break;
			case "next":
				o = 0 === s ? a.options.slidesToScroll : s, a.slideCount > a.options.slidesToShow && a.slideHandler(a.currentSlide + o, !1, i);
				break;
			case "index":
				var l = 0 === e.data.index ? 0 : e.data.index || r.index() * a.options.slidesToScroll;
				a.slideHandler(a.checkNavigable(l), !1, i), r.children().trigger("focus");
				break;
			default:
				return
		}
	}, e.prototype.checkNavigable = function(t) {
		var e, i, s = this;
		if(e = s.getNavigableIndexes(), i = 0, t > e[e.length - 1]) t = e[e.length - 1];
		else
			for(var o in e) {
				if(t < e[o]) {
					t = i;
					break
				}
				i = e[o]
			}
		return t
	}, e.prototype.cleanUpEvents = function() {
		var e = this;
		e.options.dots && null !== e.$dots && t("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", t.proxy(e.interrupt, e, !0)).off("mouseleave.slick", t.proxy(e.interrupt, e, !1)), e.$slider.off("focus.slick blur.slick"), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide)), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), t(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), e.options.accessibility === !0 && e.$list.off("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && t(e.$slideTrack).children().off("click.slick", e.selectHandler), t(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), t(window).off("resize.slick.slick-" + e.instanceUid, e.resize), t("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), t(window).off("load.slick.slick-" + e.instanceUid, e.setPosition), t(document).off("ready.slick.slick-" + e.instanceUid, e.setPosition)
	}, e.prototype.cleanUpSlideEvents = function() {
		var e = this;
		e.$list.off("mouseenter.slick", t.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", t.proxy(e.interrupt, e, !1))
	}, e.prototype.cleanUpRows = function() {
		var t, e = this;
		e.options.rows > 1 && (t = e.$slides.children().children(), t.removeAttr("style"), e.$slider.empty().append(t))
	}, e.prototype.clickHandler = function(t) {
		var e = this;
		e.shouldClick === !1 && (t.stopImmediatePropagation(), t.stopPropagation(), t.preventDefault())
	}, e.prototype.destroy = function(e) {
		var i = this;
		i.autoPlayClear(), i.touchObject = {}, i.cleanUpEvents(), t(".slick-cloned", i.$slider).detach(), i.$dots && i.$dots.remove(), i.$prevArrow && i.$prevArrow.length && (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()), i.$nextArrow && i.$nextArrow.length && (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
			i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()), i.$slides && (i.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
			t(this).attr("style", t(this).data("originalStyling"))
		}), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.detach(), i.$list.detach(), i.$slider.append(i.$slides)), i.cleanUpRows(), i.$slider.removeClass("slick-slider"), i.$slider.removeClass("slick-initialized"), i.$slider.removeClass("slick-dotted"), i.unslicked = !0, e || i.$slider.trigger("destroy", [i])
	}, e.prototype.disableTransition = function(t) {
		var e = this,
			i = {};
		i[e.transitionType] = "", e.options.fade === !1 ? e.$slideTrack.css(i) : e.$slides.eq(t).css(i)
	}, e.prototype.fadeSlide = function(t, e) {
		var i = this;
		i.cssTransitions === !1 ? (i.$slides.eq(t).css({
			zIndex: i.options.zIndex
		}), i.$slides.eq(t).animate({
			opacity: 1
		}, i.options.speed, i.options.easing, e)) : (i.applyTransition(t), i.$slides.eq(t).css({
			opacity: 1,
			zIndex: i.options.zIndex
		}), e && setTimeout(function() {
			i.disableTransition(t), e.call()
		}, i.options.speed))
	}, e.prototype.fadeSlideOut = function(t) {
		var e = this;
		e.cssTransitions === !1 ? e.$slides.eq(t).animate({
			opacity: 0,
			zIndex: e.options.zIndex - 2
		}, e.options.speed, e.options.easing) : (e.applyTransition(t), e.$slides.eq(t).css({
			opacity: 0,
			zIndex: e.options.zIndex - 2
		}))
	}, e.prototype.filterSlides = e.prototype.slickFilter = function(t) {
		var e = this;
		null !== t && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(t).appendTo(e.$slideTrack), e.reinit())
	}, e.prototype.focusHandler = function() {
		var e = this;
		e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function(i) {
			i.stopImmediatePropagation();
			var s = t(this);
			setTimeout(function() {
				e.options.pauseOnFocus && (e.focussed = s.is(":focus"), e.autoPlay())
			}, 0)
		})
	}, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function() {
		var t = this;
		return t.currentSlide
	}, e.prototype.getDotCount = function() {
		var t = this,
			e = 0,
			i = 0,
			s = 0;
		if(t.options.infinite === !0)
			for(; e < t.slideCount;) ++s, e = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
		else if(t.options.centerMode === !0) s = t.slideCount;
		else if(t.options.asNavFor)
			for(; e < t.slideCount;) ++s, e = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
		else s = 1 + Math.ceil((t.slideCount - t.options.slidesToShow) / t.options.slidesToScroll);
		return s - 1
	}, e.prototype.getLeft = function(t) {
		var e, i, s, o = this,
			n = 0;
		return o.slideOffset = 0, i = o.$slides.first().outerHeight(!0), o.options.infinite === !0 ? (o.slideCount > o.options.slidesToShow && (o.slideOffset = o.slideWidth * o.options.slidesToShow * -1, n = i * o.options.slidesToShow * -1), o.slideCount % o.options.slidesToScroll !== 0 && t + o.options.slidesToScroll > o.slideCount && o.slideCount > o.options.slidesToShow && (t > o.slideCount ? (o.slideOffset = (o.options.slidesToShow - (t - o.slideCount)) * o.slideWidth * -1, n = (o.options.slidesToShow - (t - o.slideCount)) * i * -1) : (o.slideOffset = o.slideCount % o.options.slidesToScroll * o.slideWidth * -1, n = o.slideCount % o.options.slidesToScroll * i * -1))) : t + o.options.slidesToShow > o.slideCount && (o.slideOffset = (t + o.options.slidesToShow - o.slideCount) * o.slideWidth, n = (t + o.options.slidesToShow - o.slideCount) * i), o.slideCount <= o.options.slidesToShow && (o.slideOffset = 0, n = 0), o.options.centerMode === !0 && o.options.infinite === !0 ? o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2) - o.slideWidth : o.options.centerMode === !0 && (o.slideOffset = 0, o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2)), e = o.options.vertical === !1 ? t * o.slideWidth * -1 + o.slideOffset : t * i * -1 + n, o.options.variableWidth === !0 && (s = o.slideCount <= o.options.slidesToShow || o.options.infinite === !1 ? o.$slideTrack.children(".slick-slide").eq(t) : o.$slideTrack.children(".slick-slide").eq(t + o.options.slidesToShow), e = o.options.rtl === !0 ? s[0] ? (o.$slideTrack.width() - s[0].offsetLeft - s.width()) * -1 : 0 : s[0] ? s[0].offsetLeft * -1 : 0, o.options.centerMode === !0 && (s = o.slideCount <= o.options.slidesToShow || o.options.infinite === !1 ? o.$slideTrack.children(".slick-slide").eq(t) : o.$slideTrack.children(".slick-slide").eq(t + o.options.slidesToShow + 1), e = o.options.rtl === !0 ? s[0] ? (o.$slideTrack.width() - s[0].offsetLeft - s.width()) * -1 : 0 : s[0] ? s[0].offsetLeft * -1 : 0, e += (o.$list.width() - s.outerWidth()) / 2)), e
	}, e.prototype.getOption = e.prototype.slickGetOption = function(t) {
		var e = this;
		return e.options[t]
	}, e.prototype.getNavigableIndexes = function() {
		var t, e = this,
			i = 0,
			s = 0,
			o = [];
		for(e.options.infinite === !1 ? t = e.slideCount : (i = e.options.slidesToScroll * -1, s = e.options.slidesToScroll * -1, t = 2 * e.slideCount); i < t;) o.push(i), i = s + e.options.slidesToScroll, s += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
		return o
	}, e.prototype.getSlick = function() {
		return this
	}, e.prototype.getSlideCount = function() {
		var e, i, s, o = this;
		return s = o.options.centerMode === !0 ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, o.options.swipeToSlide === !0 ? (o.$slideTrack.find(".slick-slide").each(function(e, n) {
			if(n.offsetLeft - s + t(n).outerWidth() / 2 > o.swipeLeft * -1) return i = n, !1
		}), e = Math.abs(t(i).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
	}, e.prototype.goTo = e.prototype.slickGoTo = function(t, e) {
		var i = this;
		i.changeSlide({
			data: {
				message: "index",
				index: parseInt(t)
			}
		}, e)
	}, e.prototype.init = function(e) {
		var i = this;
		t(i.$slider).hasClass("slick-initialized") || (t(i.$slider).addClass("slick-initialized"), i.buildRows(), i.buildOut(), i.setProps(), i.startLoad(), i.loadSlider(), i.initializeEvents(), i.updateArrows(), i.updateDots(), i.checkResponsive(!0), i.focusHandler()), e && i.$slider.trigger("init", [i]), i.options.accessibility === !0 && i.initADA(), i.options.autoplay && (i.paused = !1, i.autoPlay())
	}, e.prototype.initADA = function() {
		var e = this;
		e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
			"aria-hidden": "true",
			tabindex: "-1"
		}).find("a, input, button, select").attr({
			tabindex: "-1"
		}), e.$slideTrack.attr("role", "listbox"), e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(i) {
			t(this).attr({
				role: "option",
				"aria-describedby": "slick-slide" + e.instanceUid + i
			})
		}), null !== e.$dots && e.$dots.attr("role", "tablist").find("li").each(function(i) {
			t(this).attr({
				role: "presentation",
				"aria-selected": "false",
				"aria-controls": "navigation" + e.instanceUid + i,
				id: "slick-slide" + e.instanceUid + i
			})
		}).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), e.activateADA()
	}, e.prototype.initArrowEvents = function() {
		var t = this;
		t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow.off("click.slick").on("click.slick", {
			message: "previous"
		}, t.changeSlide), t.$nextArrow.off("click.slick").on("click.slick", {
			message: "next"
		}, t.changeSlide))
	}, e.prototype.initDotEvents = function() {
		var e = this;
		e.options.dots === !0 && e.slideCount > e.options.slidesToShow && t("li", e.$dots).on("click.slick", {
			message: "index"
		}, e.changeSlide), e.options.dots === !0 && e.options.pauseOnDotsHover === !0 && t("li", e.$dots).on("mouseenter.slick", t.proxy(e.interrupt, e, !0)).on("mouseleave.slick", t.proxy(e.interrupt, e, !1))
	}, e.prototype.initSlideEvents = function() {
		var e = this;
		e.options.pauseOnHover && (e.$list.on("mouseenter.slick", t.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", t.proxy(e.interrupt, e, !1)))
	}, e.prototype.initializeEvents = function() {
		var e = this;
		e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
			action: "start"
		}, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
			action: "move"
		}, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
			action: "end"
		}, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
			action: "end"
		}, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), t(document).on(e.visibilityChange, t.proxy(e.visibility, e)), e.options.accessibility === !0 && e.$list.on("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && t(e.$slideTrack).children().on("click.slick", e.selectHandler), t(window).on("orientationchange.slick.slick-" + e.instanceUid, t.proxy(e.orientationChange, e)), t(window).on("resize.slick.slick-" + e.instanceUid, t.proxy(e.resize, e)), t("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), t(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), t(document).on("ready.slick.slick-" + e.instanceUid, e.setPosition)
	}, e.prototype.initUI = function() {
		var t = this;
		t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow.show(), t.$nextArrow.show()), t.options.dots === !0 && t.slideCount > t.options.slidesToShow && t.$dots.show()
	}, e.prototype.keyHandler = function(t) {
		var e = this;
		t.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === t.keyCode && e.options.accessibility === !0 ? e.changeSlide({
			data: {
				message: e.options.rtl === !0 ? "next" : "previous"
			}
		}) : 39 === t.keyCode && e.options.accessibility === !0 && e.changeSlide({
			data: {
				message: e.options.rtl === !0 ? "previous" : "next"
			}
		}))
	}, e.prototype.lazyLoad = function() {
		function e(e) {
			t("img[data-lazy]", e).each(function() {
				var e = t(this),
					i = t(this).attr("data-lazy"),
					s = document.createElement("img");
				s.onload = function() {
					e.animate({
						opacity: 0
					}, 100, function() {
						e.attr("src", i).animate({
							opacity: 1
						}, 200, function() {
							e.removeAttr("data-lazy").removeClass("slick-loading")
						}), a.$slider.trigger("lazyLoaded", [a, e, i])
					})
				}, s.onerror = function() {
					e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), a.$slider.trigger("lazyLoadError", [a, e, i])
				}, s.src = i
			})
		}
		var i, s, o, n, a = this;
		a.options.centerMode === !0 ? a.options.infinite === !0 ? (o = a.currentSlide + (a.options.slidesToShow / 2 + 1), n = o + a.options.slidesToShow + 2) : (o = Math.max(0, a.currentSlide - (a.options.slidesToShow / 2 + 1)), n = 2 + (a.options.slidesToShow / 2 + 1) + a.currentSlide) : (o = a.options.infinite ? a.options.slidesToShow + a.currentSlide : a.currentSlide, n = Math.ceil(o + a.options.slidesToShow), a.options.fade === !0 && (o > 0 && o--, n <= a.slideCount && n++)), i = a.$slider.find(".slick-slide").slice(o, n), e(i), a.slideCount <= a.options.slidesToShow ? (s = a.$slider.find(".slick-slide"), e(s)) : a.currentSlide >= a.slideCount - a.options.slidesToShow ? (s = a.$slider.find(".slick-cloned").slice(0, a.options.slidesToShow), e(s)) : 0 === a.currentSlide && (s = a.$slider.find(".slick-cloned").slice(a.options.slidesToShow * -1), e(s))
	}, e.prototype.loadSlider = function() {
		var t = this;
		t.setPosition(), t.$slideTrack.css({
			opacity: 1
		}), t.$slider.removeClass("slick-loading"), t.initUI(), "progressive" === t.options.lazyLoad && t.progressiveLazyLoad()
	}, e.prototype.next = e.prototype.slickNext = function() {
		var t = this;
		t.changeSlide({
			data: {
				message: "next"
			}
		})
	}, e.prototype.orientationChange = function() {
		var t = this;
		t.checkResponsive(), t.setPosition()
	}, e.prototype.pause = e.prototype.slickPause = function() {
		var t = this;
		t.autoPlayClear(), t.paused = !0
	}, e.prototype.play = e.prototype.slickPlay = function() {
		var t = this;
		t.autoPlay(), t.options.autoplay = !0, t.paused = !1, t.focussed = !1, t.interrupted = !1
	}, e.prototype.postSlide = function(t) {
		var e = this;
		e.unslicked || (e.$slider.trigger("afterChange", [e, t]), e.animating = !1, e.setPosition(), e.swipeLeft = null, e.options.autoplay && e.autoPlay(), e.options.accessibility === !0 && e.initADA())
	}, e.prototype.prev = e.prototype.slickPrev = function() {
		var t = this;
		t.changeSlide({
			data: {
				message: "previous"
			}
		})
	}, e.prototype.preventDefault = function(t) {
		t.preventDefault()
	}, e.prototype.progressiveLazyLoad = function(e) {
		e = e || 1;
		var i, s, o, n = this,
			a = t("img[data-lazy]", n.$slider);
		a.length ? (i = a.first(), s = i.attr("data-lazy"), o = document.createElement("img"), o.onload = function() {
			i.attr("src", s).removeAttr("data-lazy").removeClass("slick-loading"), n.options.adaptiveHeight === !0 && n.setPosition(), n.$slider.trigger("lazyLoaded", [n, i, s]), n.progressiveLazyLoad()
		}, o.onerror = function() {
			e < 3 ? setTimeout(function() {
				n.progressiveLazyLoad(e + 1)
			}, 500) : (i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), n.$slider.trigger("lazyLoadError", [n, i, s]), n.progressiveLazyLoad())
		}, o.src = s) : n.$slider.trigger("allImagesLoaded", [n])
	}, e.prototype.refresh = function(e) {
		var i, s, o = this;
		s = o.slideCount - o.options.slidesToShow, !o.options.infinite && o.currentSlide > s && (o.currentSlide = s), o.slideCount <= o.options.slidesToShow && (o.currentSlide = 0), i = o.currentSlide, o.destroy(!0), t.extend(o, o.initials, {
			currentSlide: i
		}), o.init(), e || o.changeSlide({
			data: {
				message: "index",
				index: i
			}
		}, !1)
	}, e.prototype.registerBreakpoints = function() {
		var e, i, s, o = this,
			n = o.options.responsive || null;
		if("array" === t.type(n) && n.length) {
			o.respondTo = o.options.respondTo || "window";
			for(e in n)
				if(s = o.breakpoints.length - 1, i = n[e].breakpoint, n.hasOwnProperty(e)) {
					for(; s >= 0;) o.breakpoints[s] && o.breakpoints[s] === i && o.breakpoints.splice(s, 1), s--;
					o.breakpoints.push(i), o.breakpointSettings[i] = n[e].settings
				}
			o.breakpoints.sort(function(t, e) {
				return o.options.mobileFirst ? t - e : e - t
			})
		}
	}, e.prototype.reinit = function() {
		var e = this;
		e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), e.options.focusOnSelect === !0 && t(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
	}, e.prototype.resize = function() {
		var e = this;
		t(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function() {
			e.windowWidth = t(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
		}, 50))
	}, e.prototype.removeSlide = e.prototype.slickRemove = function(t, e, i) {
		var s = this;
		return "boolean" == typeof t ? (e = t, t = e === !0 ? 0 : s.slideCount - 1) : t = e === !0 ? --t : t, !(s.slideCount < 1 || t < 0 || t > s.slideCount - 1) && (s.unload(), i === !0 ? s.$slideTrack.children().remove() : s.$slideTrack.children(this.options.slide).eq(t).remove(), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slidesCache = s.$slides, void s.reinit())
	}, e.prototype.setCSS = function(t) {
		var e, i, s = this,
			o = {};
		s.options.rtl === !0 && (t = -t), e = "left" == s.positionProp ? Math.ceil(t) + "px" : "0px", i = "top" == s.positionProp ? Math.ceil(t) + "px" : "0px", o[s.positionProp] = t, s.transformsEnabled === !1 ? s.$slideTrack.css(o) : (o = {}, s.cssTransitions === !1 ? (o[s.animType] = "translate(" + e + ", " + i + ")", s.$slideTrack.css(o)) : (o[s.animType] = "translate3d(" + e + ", " + i + ", 0px)", s.$slideTrack.css(o)))
	}, e.prototype.setDimensions = function() {
		var t = this;
		t.options.vertical === !1 ? t.options.centerMode === !0 && t.$list.css({
			padding: "0px " + t.options.centerPadding
		}) : (t.$list.height(t.$slides.first().outerHeight(!0) * t.options.slidesToShow), t.options.centerMode === !0 && t.$list.css({
			padding: t.options.centerPadding + " 0px"
		})), t.listWidth = t.$list.width(), t.listHeight = t.$list.height(), t.options.vertical === !1 && t.options.variableWidth === !1 ? (t.slideWidth = Math.ceil(t.listWidth / t.options.slidesToShow), t.$slideTrack.width(Math.ceil(t.slideWidth * t.$slideTrack.children(".slick-slide").length))) : t.options.variableWidth === !0 ? t.$slideTrack.width(5e3 * t.slideCount) : (t.slideWidth = Math.ceil(t.listWidth), t.$slideTrack.height(Math.ceil(t.$slides.first().outerHeight(!0) * t.$slideTrack.children(".slick-slide").length)));
		var e = t.$slides.first().outerWidth(!0) - t.$slides.first().width();
		t.options.variableWidth === !1 && t.$slideTrack.children(".slick-slide").width(t.slideWidth - e)
	}, e.prototype.setFade = function() {
		var e, i = this;
		i.$slides.each(function(s, o) {
			e = i.slideWidth * s * -1, i.options.rtl === !0 ? t(o).css({
				position: "relative",
				right: e,
				top: 0,
				zIndex: i.options.zIndex - 2,
				opacity: 0
			}) : t(o).css({
				position: "relative",
				left: e,
				top: 0,
				zIndex: i.options.zIndex - 2,
				opacity: 0
			})
		}), i.$slides.eq(i.currentSlide).css({
			zIndex: i.options.zIndex - 1,
			opacity: 1
		})
	}, e.prototype.setHeight = function() {
		var t = this;
		if(1 === t.options.slidesToShow && t.options.adaptiveHeight === !0 && t.options.vertical === !1) {
			var e = t.$slides.eq(t.currentSlide).outerHeight(!0);
			t.$list.css("height", e)
		}
	}, e.prototype.setOption = e.prototype.slickSetOption = function() {
		var e, i, s, o, n, a = this,
			r = !1;
		if("object" === t.type(arguments[0]) ? (s = arguments[0], r = arguments[1], n = "multiple") : "string" === t.type(arguments[0]) && (s = arguments[0], o = arguments[1], r = arguments[2], "responsive" === arguments[0] && "array" === t.type(arguments[1]) ? n = "responsive" : "undefined" != typeof arguments[1] && (n = "single")), "single" === n) a.options[s] = o;
		else if("multiple" === n) t.each(s, function(t, e) {
			a.options[t] = e
		});
		else if("responsive" === n)
			for(i in o)
				if("array" !== t.type(a.options.responsive)) a.options.responsive = [o[i]];
				else {
					for(e = a.options.responsive.length - 1; e >= 0;) a.options.responsive[e].breakpoint === o[i].breakpoint && a.options.responsive.splice(e, 1), e--;
					a.options.responsive.push(o[i])
				}
		r && (a.unload(), a.reinit())
	}, e.prototype.setPosition = function() {
		var t = this;
		t.setDimensions(), t.setHeight(), t.options.fade === !1 ? t.setCSS(t.getLeft(t.currentSlide)) : t.setFade(), t.$slider.trigger("setPosition", [t])
	}, e.prototype.setProps = function() {
		var t = this,
			e = document.body.style;
		t.positionProp = t.options.vertical === !0 ? "top" : "left", "top" === t.positionProp ? t.$slider.addClass("slick-vertical") : t.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || t.options.useCSS === !0 && (t.cssTransitions = !0), t.options.fade && ("number" == typeof t.options.zIndex ? t.options.zIndex < 3 && (t.options.zIndex = 3) : t.options.zIndex = t.defaults.zIndex), void 0 !== e.OTransform && (t.animType = "OTransform", t.transformType = "-o-transform", t.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (t.animType = !1)), void 0 !== e.MozTransform && (t.animType = "MozTransform", t.transformType = "-moz-transform", t.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (t.animType = !1)), void 0 !== e.webkitTransform && (t.animType = "webkitTransform", t.transformType = "-webkit-transform", t.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (t.animType = !1)), void 0 !== e.msTransform && (t.animType = "msTransform", t.transformType = "-ms-transform", t.transitionType = "msTransition", void 0 === e.msTransform && (t.animType = !1)), void 0 !== e.transform && t.animType !== !1 && (t.animType = "transform", t.transformType = "transform", t.transitionType = "transition"), t.transformsEnabled = t.options.useTransform && null !== t.animType && t.animType !== !1
	}, e.prototype.setSlideClasses = function(t) {
		var e, i, s, o, n = this;
		i = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(t).addClass("slick-current"), n.options.centerMode === !0 ? (e = Math.floor(n.options.slidesToShow / 2), n.options.infinite === !0 && (t >= e && t <= n.slideCount - 1 - e ? n.$slides.slice(t - e, t + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (s = n.options.slidesToShow + t, i.slice(s - e + 1, s + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === t ? i.eq(i.length - 1 - n.options.slidesToShow).addClass("slick-center") : t === n.slideCount - 1 && i.eq(n.options.slidesToShow).addClass("slick-center")), n.$slides.eq(t).addClass("slick-center")) : t >= 0 && t <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(t, t + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= n.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (o = n.slideCount % n.options.slidesToShow, s = n.options.infinite === !0 ? n.options.slidesToShow + t : t, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - t < n.options.slidesToShow ? i.slice(s - (n.options.slidesToShow - o), s + o).addClass("slick-active").attr("aria-hidden", "false") : i.slice(s, s + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === n.options.lazyLoad && n.lazyLoad()
	}, e.prototype.setupInfinite = function() {
		var e, i, s, o = this;
		if(o.options.fade === !0 && (o.options.centerMode = !1), o.options.infinite === !0 && o.options.fade === !1 && (i = null, o.slideCount > o.options.slidesToShow)) {
			for(s = o.options.centerMode === !0 ? o.options.slidesToShow + 1 : o.options.slidesToShow, e = o.slideCount; e > o.slideCount - s; e -= 1) i = e - 1, t(o.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i - o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");
			for(e = 0; e < s; e += 1) i = e, t(o.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i + o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");
			o.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
				t(this).attr("id", "")
			})
		}
	}, e.prototype.interrupt = function(t) {
		var e = this;
		t || e.autoPlay(), e.interrupted = t
	}, e.prototype.selectHandler = function(e) {
		var i = this,
			s = t(e.target).is(".slick-slide") ? t(e.target) : t(e.target).parents(".slick-slide"),
			o = parseInt(s.attr("data-slick-index"));
		return o || (o = 0), i.slideCount <= i.options.slidesToShow ? (i.setSlideClasses(o), void i.asNavFor(o)) : void i.slideHandler(o)
	}, e.prototype.slideHandler = function(t, e, i) {
		var s, o, n, a, r, l = null,
			h = this;
		if(e = e || !1, (h.animating !== !0 || h.options.waitForAnimate !== !0) && !(h.options.fade === !0 && h.currentSlide === t || h.slideCount <= h.options.slidesToShow)) return e === !1 && h.asNavFor(t), s = t, l = h.getLeft(s), a = h.getLeft(h.currentSlide), h.currentLeft = null === h.swipeLeft ? a : h.swipeLeft, h.options.infinite === !1 && h.options.centerMode === !1 && (t < 0 || t > h.getDotCount() * h.options.slidesToScroll) ? void(h.options.fade === !1 && (s = h.currentSlide, i !== !0 ? h.animateSlide(a, function() {
			h.postSlide(s)
		}) : h.postSlide(s))) : h.options.infinite === !1 && h.options.centerMode === !0 && (t < 0 || t > h.slideCount - h.options.slidesToScroll) ? void(h.options.fade === !1 && (s = h.currentSlide, i !== !0 ? h.animateSlide(a, function() {
			h.postSlide(s)
		}) : h.postSlide(s))) : (h.options.autoplay && clearInterval(h.autoPlayTimer), o = s < 0 ? h.slideCount % h.options.slidesToScroll !== 0 ? h.slideCount - h.slideCount % h.options.slidesToScroll : h.slideCount + s : s >= h.slideCount ? h.slideCount % h.options.slidesToScroll !== 0 ? 0 : s - h.slideCount : s, h.animating = !0, h.$slider.trigger("beforeChange", [h, h.currentSlide, o]), n = h.currentSlide, h.currentSlide = o, h.setSlideClasses(h.currentSlide), h.options.asNavFor && (r = h.getNavTarget(), r = r.slick("getSlick"), r.slideCount <= r.options.slidesToShow && r.setSlideClasses(h.currentSlide)), h.updateDots(), h.updateArrows(), h.options.fade === !0 ? (i !== !0 ? (h.fadeSlideOut(n), h.fadeSlide(o, function() {
			h.postSlide(o)
		})) : h.postSlide(o), void h.animateHeight()) : void(i !== !0 ? h.animateSlide(l, function() {
			h.postSlide(o)
		}) : h.postSlide(o)))
	}, e.prototype.startLoad = function() {
		var t = this;
		t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow.hide(), t.$nextArrow.hide()), t.options.dots === !0 && t.slideCount > t.options.slidesToShow && t.$dots.hide(), t.$slider.addClass("slick-loading")
	}, e.prototype.swipeDirection = function() {
		var t, e, i, s, o = this;
		return t = o.touchObject.startX - o.touchObject.curX, e = o.touchObject.startY - o.touchObject.curY, i = Math.atan2(e, t), s = Math.round(180 * i / Math.PI), s < 0 && (s = 360 - Math.abs(s)), s <= 45 && s >= 0 ? o.options.rtl === !1 ? "left" : "right" : s <= 360 && s >= 315 ? o.options.rtl === !1 ? "left" : "right" : s >= 135 && s <= 225 ? o.options.rtl === !1 ? "right" : "left" : o.options.verticalSwiping === !0 ? s >= 35 && s <= 135 ? "down" : "up" : "vertical"
	}, e.prototype.swipeEnd = function(t) {
		var e, i, s = this;
		if(s.dragging = !1, s.interrupted = !1, s.shouldClick = !(s.touchObject.swipeLength > 10), void 0 === s.touchObject.curX) return !1;
		if(s.touchObject.edgeHit === !0 && s.$slider.trigger("edge", [s, s.swipeDirection()]), s.touchObject.swipeLength >= s.touchObject.minSwipe) {
			switch(i = s.swipeDirection()) {
				case "left":
				case "down":
					e = s.options.swipeToSlide ? s.checkNavigable(s.currentSlide + s.getSlideCount()) : s.currentSlide + s.getSlideCount(), s.currentDirection = 0;
					break;
				case "right":
				case "up":
					e = s.options.swipeToSlide ? s.checkNavigable(s.currentSlide - s.getSlideCount()) : s.currentSlide - s.getSlideCount(), s.currentDirection = 1
			}
			"vertical" != i && (s.slideHandler(e), s.touchObject = {}, s.$slider.trigger("swipe", [s, i]))
		} else s.touchObject.startX !== s.touchObject.curX && (s.slideHandler(s.currentSlide), s.touchObject = {})
	}, e.prototype.swipeHandler = function(t) {
		var e = this;
		if(!(e.options.swipe === !1 || "ontouchend" in document && e.options.swipe === !1 || e.options.draggable === !1 && t.type.indexOf("mouse") !== -1)) switch(e.touchObject.fingerCount = t.originalEvent && void 0 !== t.originalEvent.touches ? t.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, e.options.verticalSwiping === !0 && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), t.data.action) {
			case "start":
				e.swipeStart(t);
				break;
			case "move":
				e.swipeMove(t);
				break;
			case "end":
				e.swipeEnd(t)
		}
	}, e.prototype.swipeMove = function(t) {
		var e, i, s, o, n, a = this;
		return n = void 0 !== t.originalEvent ? t.originalEvent.touches : null, !(!a.dragging || n && 1 !== n.length) && (e = a.getLeft(a.currentSlide), a.touchObject.curX = void 0 !== n ? n[0].pageX : t.clientX, a.touchObject.curY = void 0 !== n ? n[0].pageY : t.clientY, a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2))), a.options.verticalSwiping === !0 && (a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2)))), i = a.swipeDirection(), "vertical" !== i ? (void 0 !== t.originalEvent && a.touchObject.swipeLength > 4 && t.preventDefault(), o = (a.options.rtl === !1 ? 1 : -1) * (a.touchObject.curX > a.touchObject.startX ? 1 : -1), a.options.verticalSwiping === !0 && (o = a.touchObject.curY > a.touchObject.startY ? 1 : -1), s = a.touchObject.swipeLength, a.touchObject.edgeHit = !1, a.options.infinite === !1 && (0 === a.currentSlide && "right" === i || a.currentSlide >= a.getDotCount() && "left" === i) && (s = a.touchObject.swipeLength * a.options.edgeFriction, a.touchObject.edgeHit = !0), a.options.vertical === !1 ? a.swipeLeft = e + s * o : a.swipeLeft = e + s * (a.$list.height() / a.listWidth) * o, a.options.verticalSwiping === !0 && (a.swipeLeft = e + s * o), a.options.fade !== !0 && a.options.touchMove !== !1 && (a.animating === !0 ? (a.swipeLeft = null, !1) : void a.setCSS(a.swipeLeft))) : void 0)
	}, e.prototype.swipeStart = function(t) {
		var e, i = this;
		return i.interrupted = !0, 1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow ? (i.touchObject = {}, !1) : (void 0 !== t.originalEvent && void 0 !== t.originalEvent.touches && (e = t.originalEvent.touches[0]), i.touchObject.startX = i.touchObject.curX = void 0 !== e ? e.pageX : t.clientX, i.touchObject.startY = i.touchObject.curY = void 0 !== e ? e.pageY : t.clientY, void(i.dragging = !0))
	}, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function() {
		var t = this;
		null !== t.$slidesCache && (t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.appendTo(t.$slideTrack), t.reinit())
	}, e.prototype.unload = function() {
		var e = this;
		t(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
	}, e.prototype.unslick = function(t) {
		var e = this;
		e.$slider.trigger("unslick", [e, t]), e.destroy()
	}, e.prototype.updateArrows = function() {
		var t, e = this;
		t = Math.floor(e.options.slidesToShow / 2), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && e.options.centerMode === !1 ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && e.options.centerMode === !0 && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
	}, e.prototype.updateDots = function() {
		var t = this;
		null !== t.$dots && (t.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), t.$dots.find("li").eq(Math.floor(t.currentSlide / t.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
	}, e.prototype.visibility = function() {
		var t = this;
		t.options.autoplay && (document[t.hidden] ? t.interrupted = !0 : t.interrupted = !1)
	}, t.fn.slick = function() {
		var t, i, s = this,
			o = arguments[0],
			n = Array.prototype.slice.call(arguments, 1),
			a = s.length;
		for(t = 0; t < a; t++)
			if("object" == typeof o || "undefined" == typeof o ? s[t].slick = new e(s[t], o) : i = s[t].slick[o].apply(s[t].slick, n), "undefined" != typeof i) return i;
		return s
	}
});
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
		return typeof t
	} : function(t) {
		return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
	},
	windowIsDefined = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window));
! function(t) {
	if("function" == typeof define && define.amd) define(["jquery"], t);
	else if("object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports) {
		var e;
		try {
			e = require("jquery")
		} catch(i) {
			e = null
		}
		module.exports = t(e)
	} else window && (window.Slider = t(window.jQuery))
}(function(t) {
	var e = "slider",
		i = "bootstrapSlider";
	windowIsDefined && !window.console && (window.console = {}), windowIsDefined && !window.console.log && (window.console.log = function() {}), windowIsDefined && !window.console.warn && (window.console.warn = function() {});
	var s;
	return function(t) {
			"use strict";

			function e() {}

			function i(t) {
				function i(e) {
					e.prototype.option || (e.prototype.option = function(e) {
						t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
					})
				}

				function o(e, i) {
					t.fn[e] = function(o) {
						if("string" == typeof o) {
							for(var a = s.call(arguments, 1), r = 0, l = this.length; r < l; r++) {
								var h = this[r],
									d = t.data(h, e);
								if(d)
									if(t.isFunction(d[o]) && "_" !== o.charAt(0)) {
										var c = d[o].apply(d, a);
										if(void 0 !== c && c !== d) return c
									} else n("no such method '" + o + "' for " + e + " instance");
								else n("cannot call methods on " + e + " prior to initialization; attempted to call '" + o + "'")
							}
							return this
						}
						var p = this.map(function() {
							var s = t.data(this, e);
							return s ? (s.option(o), s._init()) : (s = new i(this, o), t.data(this, e, s)), t(this)
						});
						return !p || p.length > 1 ? p : p[0]
					}
				}
				if(t) {
					var n = "undefined" == typeof console ? e : function(t) {
						console.error(t)
					};
					return t.bridget = function(t, e) {
						i(e), o(t, e)
					}, t.bridget
				}
			}
			var s = Array.prototype.slice;
			i(t)
		}(t),
		function(t) {
			function o(e, i) {
				function s(t, e) {
					var i = "data-slider-" + e.replace(/_/g, "-"),
						s = t.getAttribute(i);
					try {
						return JSON.parse(s)
					} catch(o) {
						return s
					}
				}
				this._state = {
					value: null,
					enabled: null,
					offset: null,
					size: null,
					percentage: null,
					inDrag: !1,
					over: !1
				}, this.ticksCallbackMap = {}, this.handleCallbackMap = {}, "string" == typeof e ? this.element = document.querySelector(e) : e instanceof HTMLElement && (this.element = e), i = i ? i : {};
				for(var o = Object.keys(this.defaultOptions), n = 0; n < o.length; n++) {
					var r = o[n],
						l = i[r];
					l = "undefined" != typeof l ? l : s(this.element, r), l = null !== l ? l : this.defaultOptions[r], this.options || (this.options = {}), this.options[r] = l
				}
				"auto" === this.options.rtl && (this.options.rtl = "rtl" === window.getComputedStyle(this.element).direction), "vertical" !== this.options.orientation || "top" !== this.options.tooltip_position && "bottom" !== this.options.tooltip_position ? "horizontal" !== this.options.orientation || "left" !== this.options.tooltip_position && "right" !== this.options.tooltip_position || (this.options.tooltip_position = "top") : this.options.rtl ? this.options.tooltip_position = "left" : this.options.tooltip_position = "right";
				var h, d, c, p, u, f = this.element.style.width,
					g = !1,
					m = this.element.parentNode;
				if(this.sliderElem) g = !0;
				else {
					this.sliderElem = document.createElement("div"), this.sliderElem.className = "slider";
					var v = document.createElement("div");
					if(v.className = "slider-track", d = document.createElement("div"), d.className = "slider-track-low", h = document.createElement("div"), h.className = "slider-selection", c = document.createElement("div"), c.className = "slider-track-high", p = document.createElement("div"), p.className = "slider-handle min-slider-handle", p.setAttribute("role", "slider"), p.setAttribute("aria-valuemin", this.options.min), p.setAttribute("aria-valuemax", this.options.max), u = document.createElement("div"), u.className = "slider-handle max-slider-handle", u.setAttribute("role", "slider"), u.setAttribute("aria-valuemin", this.options.min), u.setAttribute("aria-valuemax", this.options.max),
						v.appendChild(d), v.appendChild(h), v.appendChild(c), this.rangeHighlightElements = [], Array.isArray(this.options.rangeHighlights) && this.options.rangeHighlights.length > 0)
						for(var y = 0; y < this.options.rangeHighlights.length; y++) {
							var b = document.createElement("div");
							b.className = "slider-rangeHighlight slider-selection", this.rangeHighlightElements.push(b), v.appendChild(b)
						}
					var w = Array.isArray(this.options.labelledby);
					if(w && this.options.labelledby[0] && p.setAttribute("aria-labelledby", this.options.labelledby[0]), w && this.options.labelledby[1] && u.setAttribute("aria-labelledby", this.options.labelledby[1]), !w && this.options.labelledby && (p.setAttribute("aria-labelledby", this.options.labelledby), u.setAttribute("aria-labelledby", this.options.labelledby)), this.ticks = [], Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
						for(this.ticksContainer = document.createElement("div"), this.ticksContainer.className = "slider-tick-container", n = 0; n < this.options.ticks.length; n++) {
							var T = document.createElement("div");
							if(T.className = "slider-tick", this.options.ticks_tooltip) {
								var k = this._addTickListener(),
									_ = k.addMouseEnter(this, T, n),
									C = k.addMouseLeave(this, T);
								this.ticksCallbackMap[n] = {
									mouseEnter: _,
									mouseLeave: C
								}
							}
							this.ticks.push(T), this.ticksContainer.appendChild(T)
						}
						h.className += " tick-slider-selection"
					}
					if(this.tickLabels = [], Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0)
						for(this.tickLabelContainer = document.createElement("div"), this.tickLabelContainer.className = "slider-tick-label-container", n = 0; n < this.options.ticks_labels.length; n++) {
							var x = document.createElement("div"),
								E = 0 === this.options.ticks_positions.length,
								D = this.options.reversed && E ? this.options.ticks_labels.length - (n + 1) : n;
							x.className = "slider-tick-label", x.innerHTML = this.options.ticks_labels[D], this.tickLabels.push(x), this.tickLabelContainer.appendChild(x)
						}
					var S = function(t) {
							var e = document.createElement("div");
							e.className = "tooltip-arrow";
							var i = document.createElement("div");
							i.className = "tooltip-inner", t.appendChild(e), t.appendChild(i)
						},
						$ = document.createElement("div");
					$.className = "tooltip tooltip-main", $.setAttribute("role", "presentation"), S($);
					var M = document.createElement("div");
					M.className = "tooltip tooltip-min", M.setAttribute("role", "presentation"), S(M);
					var A = document.createElement("div");
					A.className = "tooltip tooltip-max", A.setAttribute("role", "presentation"), S(A), this.sliderElem.appendChild(v), this.sliderElem.appendChild($), this.sliderElem.appendChild(M), this.sliderElem.appendChild(A), this.tickLabelContainer && this.sliderElem.appendChild(this.tickLabelContainer), this.ticksContainer && this.sliderElem.appendChild(this.ticksContainer), this.sliderElem.appendChild(p), this.sliderElem.appendChild(u), m.insertBefore(this.sliderElem, this.element), this.element.style.display = "none"
				}
				if(t && (this.$element = t(this.element), this.$sliderElem = t(this.sliderElem)), this.eventToCallbackMap = {}, this.sliderElem.id = this.options.id, this.touchCapable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, this.touchX = 0, this.touchY = 0, this.tooltip = this.sliderElem.querySelector(".tooltip-main"), this.tooltipInner = this.tooltip.querySelector(".tooltip-inner"), this.tooltip_min = this.sliderElem.querySelector(".tooltip-min"), this.tooltipInner_min = this.tooltip_min.querySelector(".tooltip-inner"), this.tooltip_max = this.sliderElem.querySelector(".tooltip-max"), this.tooltipInner_max = this.tooltip_max.querySelector(".tooltip-inner"), a[this.options.scale] && (this.options.scale = a[this.options.scale]), g === !0 && (this._removeClass(this.sliderElem, "slider-horizontal"), this._removeClass(this.sliderElem, "slider-vertical"), this._removeClass(this.sliderElem, "slider-rtl"), this._removeClass(this.tooltip, "hide"), this._removeClass(this.tooltip_min, "hide"), this._removeClass(this.tooltip_max, "hide"), ["left", "right", "top", "width", "height"].forEach(function(t) {
						this._removeProperty(this.trackLow, t), this._removeProperty(this.trackSelection, t), this._removeProperty(this.trackHigh, t)
					}, this), [this.handle1, this.handle2].forEach(function(t) {
						this._removeProperty(t, "left"), this._removeProperty(t, "right"), this._removeProperty(t, "top")
					}, this), [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function(t) {
						this._removeProperty(t, "left"), this._removeProperty(t, "right"), this._removeProperty(t, "top"), this._removeProperty(t, "margin-left"), this._removeProperty(t, "margin-right"), this._removeProperty(t, "margin-top"), this._removeClass(t, "right"), this._removeClass(t, "left"), this._removeClass(t, "top")
					}, this)), "vertical" === this.options.orientation ? (this._addClass(this.sliderElem, "slider-vertical"), this.stylePos = "top", this.mousePos = "pageY", this.sizePos = "offsetHeight") : (this._addClass(this.sliderElem, "slider-horizontal"), this.sliderElem.style.width = f, this.options.orientation = "horizontal", this.options.rtl ? this.stylePos = "right" : this.stylePos = "left", this.mousePos = "pageX", this.sizePos = "offsetWidth"), this.options.rtl && this._addClass(this.sliderElem, "slider-rtl"), this._setTooltipPosition(), Array.isArray(this.options.ticks) && this.options.ticks.length > 0 && (this.options.max = Math.max.apply(Math, this.options.ticks), this.options.min = Math.min.apply(Math, this.options.ticks)), Array.isArray(this.options.value) ? (this.options.range = !0, this._state.value = this.options.value) : this.options.range ? this._state.value = [this.options.value, this.options.max] : this._state.value = this.options.value, this.trackLow = d || this.trackLow, this.trackSelection = h || this.trackSelection, this.trackHigh = c || this.trackHigh, "none" === this.options.selection ? (this._addClass(this.trackLow, "hide"), this._addClass(this.trackSelection, "hide"), this._addClass(this.trackHigh, "hide")) : "after" !== this.options.selection && "before" !== this.options.selection || (this._removeClass(this.trackLow, "hide"), this._removeClass(this.trackSelection, "hide"), this._removeClass(this.trackHigh, "hide")), this.handle1 = p || this.handle1, this.handle2 = u || this.handle2, g === !0)
					for(this._removeClass(this.handle1, "round triangle"), this._removeClass(this.handle2, "round triangle hide"), n = 0; n < this.ticks.length; n++) this._removeClass(this.ticks[n], "round triangle hide");
				var N = ["round", "triangle", "custom"],
					O = N.indexOf(this.options.handle) !== -1;
				if(O)
					for(this._addClass(this.handle1, this.options.handle), this._addClass(this.handle2, this.options.handle), n = 0; n < this.ticks.length; n++) this._addClass(this.ticks[n], this.options.handle);
				if(this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this.setValue(this._state.value), this.handle1Keydown = this._keydown.bind(this, 0), this.handle1.addEventListener("keydown", this.handle1Keydown, !1), this.handle2Keydown = this._keydown.bind(this, 1), this.handle2.addEventListener("keydown", this.handle2Keydown, !1), this.mousedown = this._mousedown.bind(this), this.touchstart = this._touchstart.bind(this), this.touchmove = this._touchmove.bind(this), this.touchCapable) {
					var I = !1;
					try {
						var P = Object.defineProperty({}, "passive", {
							get: function() {
								I = !0
							}
						});
						window.addEventListener("test", null, P)
					} catch(L) {}
					var U = !!I && {
						passive: !0
					};
					this.sliderElem.addEventListener("touchstart", this.touchstart, U), this.sliderElem.addEventListener("touchmove", this.touchmove, U)
				}
				if(this.sliderElem.addEventListener("mousedown", this.mousedown, !1), this.resize = this._resize.bind(this), window.addEventListener("resize", this.resize, !1), "hide" === this.options.tooltip) this._addClass(this.tooltip, "hide"), this._addClass(this.tooltip_min, "hide"), this._addClass(this.tooltip_max, "hide");
				else if("always" === this.options.tooltip) this._showTooltip(), this._alwaysShowTooltip = !0;
				else {
					if(this.showTooltip = this._showTooltip.bind(this), this.hideTooltip = this._hideTooltip.bind(this), this.options.ticks_tooltip) {
						var H = this._addTickListener(),
							R = H.addMouseEnter(this, this.handle1),
							F = H.addMouseLeave(this, this.handle1);
						this.handleCallbackMap.handle1 = {
							mouseEnter: R,
							mouseLeave: F
						}, R = H.addMouseEnter(this, this.handle2), F = H.addMouseLeave(this, this.handle2), this.handleCallbackMap.handle2 = {
							mouseEnter: R,
							mouseLeave: F
						}
					} else this.sliderElem.addEventListener("mouseenter", this.showTooltip, !1), this.sliderElem.addEventListener("mouseleave", this.hideTooltip, !1);
					this.handle1.addEventListener("focus", this.showTooltip, !1), this.handle1.addEventListener("blur", this.hideTooltip, !1), this.handle2.addEventListener("focus", this.showTooltip, !1), this.handle2.addEventListener("blur", this.hideTooltip, !1)
				}
				this.options.enabled ? this.enable() : this.disable()
			}
			var n = {
					formatInvalidInputErrorMsg: function(t) {
						return "Invalid input value '" + t + "' passed in"
					},
					callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"
				},
				a = {
					linear: {
						toValue: function(t) {
							var e = t / 100 * (this.options.max - this.options.min),
								i = !0;
							if(this.options.ticks_positions.length > 0) {
								for(var s, o, n, a = 0, r = 1; r < this.options.ticks_positions.length; r++)
									if(t <= this.options.ticks_positions[r]) {
										s = this.options.ticks[r - 1], n = this.options.ticks_positions[r - 1], o = this.options.ticks[r], a = this.options.ticks_positions[r];
										break
									}
								var l = (t - n) / (a - n);
								e = s + l * (o - s), i = !1
							}
							var h = i ? this.options.min : 0,
								d = h + Math.round(e / this.options.step) * this.options.step;
							return d < this.options.min ? this.options.min : d > this.options.max ? this.options.max : d
						},
						toPercentage: function(t) {
							if(this.options.max === this.options.min) return 0;
							if(this.options.ticks_positions.length > 0) {
								for(var e, i, s, o = 0, n = 0; n < this.options.ticks.length; n++)
									if(t <= this.options.ticks[n]) {
										e = n > 0 ? this.options.ticks[n - 1] : 0, s = n > 0 ? this.options.ticks_positions[n - 1] : 0, i = this.options.ticks[n], o = this.options.ticks_positions[n];
										break
									}
								if(n > 0) {
									var a = (t - e) / (i - e);
									return s + a * (o - s)
								}
							}
							return 100 * (t - this.options.min) / (this.options.max - this.options.min)
						}
					},
					logarithmic: {
						toValue: function(t) {
							var e = 0 === this.options.min ? 0 : Math.log(this.options.min),
								i = Math.log(this.options.max),
								s = Math.exp(e + (i - e) * t / 100);
							return s = this.options.min + Math.round((s - this.options.min) / this.options.step) * this.options.step, s < this.options.min ? this.options.min : s > this.options.max ? this.options.max : s
						},
						toPercentage: function(t) {
							if(this.options.max === this.options.min) return 0;
							var e = Math.log(this.options.max),
								i = 0 === this.options.min ? 0 : Math.log(this.options.min),
								s = 0 === t ? 0 : Math.log(t);
							return 100 * (s - i) / (e - i)
						}
					}
				};
			s = function(t, e) {
				return o.call(this, t, e), this
			}, s.prototype = {
				_init: function() {},
				constructor: s,
				defaultOptions: {
					id: "",
					min: 0,
					max: 10,
					step: 1,
					precision: 0,
					orientation: "horizontal",
					value: 5,
					range: !1,
					selection: "before",
					tooltip: "show",
					tooltip_split: !1,
					handle: "round",
					reversed: !1,
					rtl: "auto",
					enabled: !0,
					formatter: function(t) {
						return Array.isArray(t) ? t[0] + " : " + t[1] : t
					},
					natural_arrow_keys: !1,
					ticks: [],
					ticks_positions: [],
					ticks_labels: [],
					ticks_snap_bounds: 0,
					ticks_tooltip: !1,
					scale: "linear",
					focus: !1,
					tooltip_position: null,
					labelledby: null,
					rangeHighlights: []
				},
				getElement: function() {
					return this.sliderElem
				},
				getValue: function() {
					return this.options.range ? this._state.value : this._state.value[0]
				},
				setValue: function(t, e, i) {
					t || (t = 0);
					var s = this.getValue();
					this._state.value = this._validateInputValue(t);
					var o = this._applyPrecision.bind(this);
					this.options.range ? (this._state.value[0] = o(this._state.value[0]), this._state.value[1] = o(this._state.value[1]), this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0])), this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]))) : (this._state.value = o(this._state.value), this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))], this._addClass(this.handle2, "hide"), "after" === this.options.selection ? this._state.value[1] = this.options.max : this._state.value[1] = this.options.min), this.options.max > this.options.min ? this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), 100 * this.options.step / (this.options.max - this.options.min)] : this._state.percentage = [0, 0, 100], this._layout();
					var n = this.options.range ? this._state.value : this._state.value[0];
					return this._setDataVal(n), e === !0 && this._trigger("slide", n), s !== n && i === !0 && this._trigger("change", {
						oldValue: s,
						newValue: n
					}), this
				},
				destroy: function() {
					this._removeSliderEventHandlers(), this.sliderElem.parentNode.removeChild(this.sliderElem), this.element.style.display = "", this._cleanUpEventCallbacksMap(), this.element.removeAttribute("data"), t && (this._unbindJQueryEventHandlers(), this.$element.removeData("slider"))
				},
				disable: function() {
					return this._state.enabled = !1, this.handle1.removeAttribute("tabindex"), this.handle2.removeAttribute("tabindex"), this._addClass(this.sliderElem, "slider-disabled"), this._trigger("slideDisabled"), this
				},
				enable: function() {
					return this._state.enabled = !0, this.handle1.setAttribute("tabindex", 0), this.handle2.setAttribute("tabindex", 0), this._removeClass(this.sliderElem, "slider-disabled"), this._trigger("slideEnabled"), this
				},
				toggle: function() {
					return this._state.enabled ? this.disable() : this.enable(), this
				},
				isEnabled: function() {
					return this._state.enabled
				},
				on: function(t, e) {
					return this._bindNonQueryEventHandler(t, e), this
				},
				off: function(e, i) {
					t ? (this.$element.off(e, i), this.$sliderElem.off(e, i)) : this._unbindNonQueryEventHandler(e, i)
				},
				getAttribute: function(t) {
					return t ? this.options[t] : this.options
				},
				setAttribute: function(t, e) {
					return this.options[t] = e, this
				},
				refresh: function() {
					return this._removeSliderEventHandlers(), o.call(this, this.element, this.options), t && t.data(this.element, "slider", this), this
				},
				relayout: function() {
					return this._resize(), this._layout(), this
				},
				_removeSliderEventHandlers: function() {
					if(this.handle1.removeEventListener("keydown", this.handle1Keydown, !1), this.handle2.removeEventListener("keydown", this.handle2Keydown, !1), this.options.ticks_tooltip) {
						for(var t = this.ticksContainer.getElementsByClassName("slider-tick"), e = 0; e < t.length; e++) t[e].removeEventListener("mouseenter", this.ticksCallbackMap[e].mouseEnter, !1), t[e].removeEventListener("mouseleave", this.ticksCallbackMap[e].mouseLeave, !1);
						this.handle1.removeEventListener("mouseenter", this.handleCallbackMap.handle1.mouseEnter, !1), this.handle2.removeEventListener("mouseenter", this.handleCallbackMap.handle2.mouseEnter, !1), this.handle1.removeEventListener("mouseleave", this.handleCallbackMap.handle1.mouseLeave, !1), this.handle2.removeEventListener("mouseleave", this.handleCallbackMap.handle2.mouseLeave, !1)
					}
					this.handleCallbackMap = null, this.ticksCallbackMap = null, this.showTooltip && (this.handle1.removeEventListener("focus", this.showTooltip, !1), this.handle2.removeEventListener("focus", this.showTooltip, !1)), this.hideTooltip && (this.handle1.removeEventListener("blur", this.hideTooltip, !1), this.handle2.removeEventListener("blur", this.hideTooltip, !1)), this.showTooltip && this.sliderElem.removeEventListener("mouseenter", this.showTooltip, !1), this.hideTooltip && this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, !1), this.sliderElem.removeEventListener("touchstart", this.touchstart, !1), this.sliderElem.removeEventListener("touchmove", this.touchmove, !1), this.sliderElem.removeEventListener("mousedown", this.mousedown, !1), window.removeEventListener("resize", this.resize, !1)
				},
				_bindNonQueryEventHandler: function(t, e) {
					void 0 === this.eventToCallbackMap[t] && (this.eventToCallbackMap[t] = []), this.eventToCallbackMap[t].push(e)
				},
				_unbindNonQueryEventHandler: function(t, e) {
					var i = this.eventToCallbackMap[t];
					if(void 0 !== i)
						for(var s = 0; s < i.length; s++)
							if(i[s] === e) {
								i.splice(s, 1);
								break
							}
				},
				_cleanUpEventCallbacksMap: function() {
					for(var t = Object.keys(this.eventToCallbackMap), e = 0; e < t.length; e++) {
						var i = t[e];
						delete this.eventToCallbackMap[i]
					}
				},
				_showTooltip: function() {
					this.options.tooltip_split === !1 ? (this._addClass(this.tooltip, "in"), this.tooltip_min.style.display = "none", this.tooltip_max.style.display = "none") : (this._addClass(this.tooltip_min, "in"), this._addClass(this.tooltip_max, "in"), this.tooltip.style.display = "none"), this._state.over = !0
				},
				_hideTooltip: function() {
					this._state.inDrag === !1 && this.alwaysShowTooltip !== !0 && (this._removeClass(this.tooltip, "in"), this._removeClass(this.tooltip_min, "in"), this._removeClass(this.tooltip_max, "in")), this._state.over = !1
				},
				_setToolTipOnMouseOver: function(t) {
					function e(t, e) {
						return e ? [100 - t.percentage[0], this.options.range ? 100 - t.percentage[1] : t.percentage[1]] : [t.percentage[0], t.percentage[1]]
					}
					var i = this.options.formatter(t ? t.value[0] : this._state.value[0]),
						s = t ? e(t, this.options.reversed) : e(this._state, this.options.reversed);
					this._setText(this.tooltipInner, i), this.tooltip.style[this.stylePos] = s[0] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-" + this.stylePos, -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-" + this.stylePos, -this.tooltip.offsetWidth / 2 + "px")
				},
				_addTickListener: function() {
					return {
						addMouseEnter: function(t, e, i) {
							var s = function() {
								var e = t._state,
									s = i >= 0 ? i : this.attributes["aria-valuenow"].value,
									o = parseInt(s, 10);
								e.value[0] = o, e.percentage[0] = t.options.ticks_positions[o], t._setToolTipOnMouseOver(e), t._showTooltip()
							};
							return e.addEventListener("mouseenter", s, !1), s
						},
						addMouseLeave: function(t, e) {
							var i = function() {
								t._hideTooltip()
							};
							return e.addEventListener("mouseleave", i, !1), i
						}
					}
				},
				_layout: function() {
					var t;
					if(t = this.options.reversed ? [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]] : [this._state.percentage[0], this._state.percentage[1]], this.handle1.style[this.stylePos] = t[0] + "%", this.handle1.setAttribute("aria-valuenow", this._state.value[0]), isNaN(this.options.formatter(this._state.value[0])) && this.handle1.setAttribute("aria-valuetext", this.options.formatter(this._state.value[0])), this.handle2.style[this.stylePos] = t[1] + "%", this.handle2.setAttribute("aria-valuenow", this._state.value[1]), isNaN(this.options.formatter(this._state.value[1])) && this.handle2.setAttribute("aria-valuetext", this.options.formatter(this._state.value[1])), this.rangeHighlightElements.length > 0 && Array.isArray(this.options.rangeHighlights) && this.options.rangeHighlights.length > 0)
						for(var e = 0; e < this.options.rangeHighlights.length; e++) {
							var i = this._toPercentage(this.options.rangeHighlights[e].start),
								s = this._toPercentage(this.options.rangeHighlights[e].end);
							if(this.options.reversed) {
								var o = 100 - s;
								s = 100 - i, i = o
							}
							var n = this._createHighlightRange(i, s);
							n ? "vertical" === this.options.orientation ? (this.rangeHighlightElements[e].style.top = n.start + "%", this.rangeHighlightElements[e].style.height = n.size + "%") : (this.options.rtl ? this.rangeHighlightElements[e].style.right = n.start + "%" : this.rangeHighlightElements[e].style.left = n.start + "%", this.rangeHighlightElements[e].style.width = n.size + "%") : this.rangeHighlightElements[e].style.display = "none"
						}
					if(Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
						var a, r = "vertical" === this.options.orientation ? "height" : "width";
						a = "vertical" === this.options.orientation ? "marginTop" : this.options.rtl ? "marginRight" : "marginLeft";
						var l = this._state.size / (this.options.ticks.length - 1);
						if(this.tickLabelContainer) {
							var h = 0;
							if(0 === this.options.ticks_positions.length) "vertical" !== this.options.orientation && (this.tickLabelContainer.style[a] = -l / 2 + "px"), h = this.tickLabelContainer.offsetHeight;
							else
								for(d = 0; d < this.tickLabelContainer.childNodes.length; d++) this.tickLabelContainer.childNodes[d].offsetHeight > h && (h = this.tickLabelContainer.childNodes[d].offsetHeight);
							"horizontal" === this.options.orientation && (this.sliderElem.style.marginBottom = h + "px")
						}
						for(var d = 0; d < this.options.ticks.length; d++) {
							var c = this.options.ticks_positions[d] || this._toPercentage(this.options.ticks[d]);
							this.options.reversed && (c = 100 - c), this.ticks[d].style[this.stylePos] = c + "%", this._removeClass(this.ticks[d], "in-selection"), this.options.range ? c >= t[0] && c <= t[1] && this._addClass(this.ticks[d], "in-selection") : "after" === this.options.selection && c >= t[0] ? this._addClass(this.ticks[d], "in-selection") : "before" === this.options.selection && c <= t[0] && this._addClass(this.ticks[d], "in-selection"), this.tickLabels[d] && (this.tickLabels[d].style[r] = l + "px", "vertical" !== this.options.orientation && void 0 !== this.options.ticks_positions[d] ? (this.tickLabels[d].style.position = "absolute", this.tickLabels[d].style[this.stylePos] = c + "%", this.tickLabels[d].style[a] = -l / 2 + "px") : "vertical" === this.options.orientation && (this.options.rtl ? this.tickLabels[d].style.marginRight = this.sliderElem.offsetWidth + "px" : this.tickLabels[d].style.marginLeft = this.sliderElem.offsetWidth + "px", this.tickLabelContainer.style[a] = this.sliderElem.offsetWidth / 2 * -1 + "px"))
						}
					}
					var p;
					if(this.options.range) {
						p = this.options.formatter(this._state.value), this._setText(this.tooltipInner, p), this.tooltip.style[this.stylePos] = (t[1] + t[0]) / 2 + "%", "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-" + this.stylePos, -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-" + this.stylePos, -this.tooltip.offsetWidth / 2 + "px");
						var u = this.options.formatter(this._state.value[0]);
						this._setText(this.tooltipInner_min, u);
						var f = this.options.formatter(this._state.value[1]);
						this._setText(this.tooltipInner_max, f), this.tooltip_min.style[this.stylePos] = t[0] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip_min, "margin-" + this.stylePos, -this.tooltip_min.offsetHeight / 2 + "px") : this._css(this.tooltip_min, "margin-" + this.stylePos, -this.tooltip_min.offsetWidth / 2 + "px"), this.tooltip_max.style[this.stylePos] = t[1] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip_max, "margin-" + this.stylePos, -this.tooltip_max.offsetHeight / 2 + "px") : this._css(this.tooltip_max, "margin-" + this.stylePos, -this.tooltip_max.offsetWidth / 2 + "px")
					} else p = this.options.formatter(this._state.value[0]), this._setText(this.tooltipInner, p), this.tooltip.style[this.stylePos] = t[0] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-" + this.stylePos, -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-" + this.stylePos, -this.tooltip.offsetWidth / 2 + "px");
					if("vertical" === this.options.orientation) this.trackLow.style.top = "0", this.trackLow.style.height = Math.min(t[0], t[1]) + "%", this.trackSelection.style.top = Math.min(t[0], t[1]) + "%", this.trackSelection.style.height = Math.abs(t[0] - t[1]) + "%", this.trackHigh.style.bottom = "0", this.trackHigh.style.height = 100 - Math.min(t[0], t[1]) - Math.abs(t[0] - t[1]) + "%";
					else {
						"right" === this.stylePos ? this.trackLow.style.right = "0" : this.trackLow.style.left = "0", this.trackLow.style.width = Math.min(t[0], t[1]) + "%", "right" === this.stylePos ? this.trackSelection.style.right = Math.min(t[0], t[1]) + "%" : this.trackSelection.style.left = Math.min(t[0], t[1]) + "%", this.trackSelection.style.width = Math.abs(t[0] - t[1]) + "%", "right" === this.stylePos ? this.trackHigh.style.left = "0" : this.trackHigh.style.right = "0", this.trackHigh.style.width = 100 - Math.min(t[0], t[1]) - Math.abs(t[0] - t[1]) + "%";
						var g = this.tooltip_min.getBoundingClientRect(),
							m = this.tooltip_max.getBoundingClientRect();
						"bottom" === this.options.tooltip_position ? g.right > m.left ? (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = "", this.tooltip_max.style.bottom = "22px") : (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = this.tooltip_min.style.top, this.tooltip_max.style.bottom = "") : g.right > m.left ? (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = "18px") : (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = this.tooltip_min.style.top)
					}
				},
				_createHighlightRange: function(t, e) {
					return this._isHighlightRange(t, e) ? t > e ? {
						start: e,
						size: t - e
					} : {
						start: t,
						size: e - t
					} : null
				},
				_isHighlightRange: function(t, e) {
					return 0 <= t && t <= 100 && 0 <= e && e <= 100
				},
				_resize: function(t) {
					this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this._layout()
				},
				_removeProperty: function(t, e) {
					t.style.removeProperty ? t.style.removeProperty(e) : t.style.removeAttribute(e)
				},
				_mousedown: function(t) {
					if(!this._state.enabled) return !1;
					this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos];
					var e = this._getPercentage(t);
					if(this.options.range) {
						var i = Math.abs(this._state.percentage[0] - e),
							s = Math.abs(this._state.percentage[1] - e);
						this._state.dragged = i < s ? 0 : 1, this._adjustPercentageForRangeSliders(e)
					} else this._state.dragged = 0;
					this._state.percentage[this._state.dragged] = e, this._layout(), this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), this.mousemove && document.removeEventListener("mousemove", this.mousemove, !1), this.mouseup && document.removeEventListener("mouseup", this.mouseup, !1), this.mousemove = this._mousemove.bind(this), this.mouseup = this._mouseup.bind(this), this.touchCapable && (document.addEventListener("touchmove", this.mousemove, !1), document.addEventListener("touchend", this.mouseup, !1)), document.addEventListener("mousemove", this.mousemove, !1), document.addEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !0;
					var o = this._calculateValue();
					return this._trigger("slideStart", o), this._setDataVal(o), this.setValue(o, !1, !0), t.returnValue = !1, this.options.focus && this._triggerFocusOnHandle(this._state.dragged), !0
				},
				_touchstart: function(t) {
					if(void 0 === t.changedTouches) return void this._mousedown(t);
					var e = t.changedTouches[0];
					this.touchX = e.pageX, this.touchY = e.pageY
				},
				_triggerFocusOnHandle: function(t) {
					0 === t && this.handle1.focus(), 1 === t && this.handle2.focus()
				},
				_keydown: function(t, e) {
					if(!this._state.enabled) return !1;
					var i;
					switch(e.keyCode) {
						case 37:
						case 40:
							i = -1;
							break;
						case 39:
						case 38:
							i = 1
					}
					if(i) {
						if(this.options.natural_arrow_keys) {
							var s = "vertical" === this.options.orientation && !this.options.reversed,
								o = "horizontal" === this.options.orientation && this.options.reversed;
							(s || o) && (i = -i)
						}
						var n = this._state.value[t] + i * this.options.step;
						return this.options.range && (n = [t ? this._state.value[0] : n, t ? n : this._state.value[1]]), this._trigger("slideStart", n), this._setDataVal(n), this.setValue(n, !0, !0), this._setDataVal(n), this._trigger("slideStop", n), this._layout(), this._pauseEvent(e), !1
					}
				},
				_pauseEvent: function(t) {
					t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault(), t.cancelBubble = !0, t.returnValue = !1
				},
				_mousemove: function(t) {
					if(!this._state.enabled) return !1;
					var e = this._getPercentage(t);
					this._adjustPercentageForRangeSliders(e), this._state.percentage[this._state.dragged] = e, this._layout();
					var i = this._calculateValue(!0);
					return this.setValue(i, !0, !0), !1
				},
				_touchmove: function(t) {
					if(void 0 !== t.changedTouches) {
						var e = t.changedTouches[0],
							i = e.pageX - this.touchX,
							s = e.pageY - this.touchY;
						this._state.inDrag || ("vertical" === this.options.orientation && i <= 5 && i >= -5 && (s >= 15 || s <= -15) ? this._mousedown(t) : s <= 5 && s >= -5 && (i >= 15 || i <= -15) && this._mousedown(t))
					}
				},
				_adjustPercentageForRangeSliders: function(t) {
					if(this.options.range) {
						var e = this._getNumDigitsAfterDecimalPlace(t);
						e = e ? e - 1 : 0;
						var i = this._applyToFixedAndParseFloat(t, e);
						0 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[1], e) < i ? (this._state.percentage[0] = this._state.percentage[1], this._state.dragged = 1) : 1 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[0], e) > i && (this._state.percentage[1] = this._state.percentage[0], this._state.dragged = 0)
					}
				},
				_mouseup: function() {
					if(!this._state.enabled) return !1;
					this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), document.removeEventListener("mousemove", this.mousemove, !1), document.removeEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !1, this._state.over === !1 && this._hideTooltip();
					var t = this._calculateValue(!0);
					return this._layout(), this._setDataVal(t), this._trigger("slideStop", t), !1
				},
				_calculateValue: function(t) {
					var e;
					if(this.options.range ? (e = [this.options.min, this.options.max], 0 !== this._state.percentage[0] && (e[0] = this._toValue(this._state.percentage[0]), e[0] = this._applyPrecision(e[0])), 100 !== this._state.percentage[1] && (e[1] = this._toValue(this._state.percentage[1]), e[1] = this._applyPrecision(e[1]))) : (e = this._toValue(this._state.percentage[0]), e = parseFloat(e), e = this._applyPrecision(e)), t) {
						for(var i = [e, 1 / 0], s = 0; s < this.options.ticks.length; s++) {
							var o = Math.abs(this.options.ticks[s] - e);
							o <= i[1] && (i = [this.options.ticks[s], o])
						}
						if(i[1] <= this.options.ticks_snap_bounds) return i[0]
					}
					return e
				},
				_applyPrecision: function(t) {
					var e = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
					return this._applyToFixedAndParseFloat(t, e)
				},
				_getNumDigitsAfterDecimalPlace: function(t) {
					var e = ("" + t).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
					return e ? Math.max(0, (e[1] ? e[1].length : 0) - (e[2] ? +e[2] : 0)) : 0
				},
				_applyToFixedAndParseFloat: function(t, e) {
					var i = t.toFixed(e);
					return parseFloat(i)
				},
				_getPercentage: function(t) {
					!this.touchCapable || "touchstart" !== t.type && "touchmove" !== t.type || (t = t.touches[0]);
					var e = t[this.mousePos],
						i = this._state.offset[this.stylePos],
						s = e - i;
					"right" === this.stylePos && (s = -s);
					var o = s / this._state.size * 100;
					return o = Math.round(o / this._state.percentage[2]) * this._state.percentage[2], this.options.reversed && (o = 100 - o), Math.max(0, Math.min(100, o))
				},
				_validateInputValue: function(t) {
					if(isNaN(+t)) {
						if(Array.isArray(t)) return this._validateArray(t), t;
						throw new Error(n.formatInvalidInputErrorMsg(t))
					}
					return +t
				},
				_validateArray: function(t) {
					for(var e = 0; e < t.length; e++) {
						var i = t[e];
						if("number" != typeof i) throw new Error(n.formatInvalidInputErrorMsg(i))
					}
				},
				_setDataVal: function(t) {
					this.element.setAttribute("data-value", t), this.element.setAttribute("value", t), this.element.value = t
				},
				_trigger: function(e, i) {
					i = i || 0 === i ? i : void 0;
					var s = this.eventToCallbackMap[e];
					if(s && s.length)
						for(var o = 0; o < s.length; o++) {
							var n = s[o];
							n(i)
						}
					t && this._triggerJQueryEvent(e, i)
				},
				_triggerJQueryEvent: function(t, e) {
					var i = {
						type: t,
						value: e
					};
					this.$element.trigger(i), this.$sliderElem.trigger(i)
				},
				_unbindJQueryEventHandlers: function() {
					this.$element.off(), this.$sliderElem.off()
				},
				_setText: function(t, e) {
					"undefined" != typeof t.textContent ? t.textContent = e : "undefined" != typeof t.innerText && (t.innerText = e)
				},
				_removeClass: function(t, e) {
					for(var i = e.split(" "), s = t.className, o = 0; o < i.length; o++) {
						var n = i[o],
							a = new RegExp("(?:\\s|^)" + n + "(?:\\s|$)");
						s = s.replace(a, " ")
					}
					t.className = s.trim()
				},
				_addClass: function(t, e) {
					for(var i = e.split(" "), s = t.className, o = 0; o < i.length; o++) {
						var n = i[o],
							a = new RegExp("(?:\\s|^)" + n + "(?:\\s|$)"),
							r = a.test(s);
						r || (s += " " + n)
					}
					t.className = s.trim()
				},
				_offsetLeft: function(t) {
					return t.getBoundingClientRect().left
				},
				_offsetRight: function(t) {
					return t.getBoundingClientRect().right
				},
				_offsetTop: function(t) {
					for(var e = t.offsetTop;
						(t = t.offsetParent) && !isNaN(t.offsetTop);) e += t.offsetTop, "BODY" !== t.tagName && (e -= t.scrollTop);
					return e
				},
				_offset: function(t) {
					return {
						left: this._offsetLeft(t),
						right: this._offsetRight(t),
						top: this._offsetTop(t)
					}
				},
				_css: function(e, i, s) {
					if(t) t.style(e, i, s);
					else {
						var o = i.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(t, e) {
							return e.toUpperCase()
						});
						e.style[o] = s
					}
				},
				_toValue: function(t) {
					return this.options.scale.toValue.apply(this, [t])
				},
				_toPercentage: function(t) {
					return this.options.scale.toPercentage.apply(this, [t])
				},
				_setTooltipPosition: function() {
					var t = [this.tooltip, this.tooltip_min, this.tooltip_max];
					if("vertical" === this.options.orientation) {
						var e;
						e = this.options.tooltip_position ? this.options.tooltip_position : this.options.rtl ? "left" : "right";
						var i = "left" === e ? "right" : "left";
						t.forEach(function(t) {
							this._addClass(t, e), t.style[i] = "100%"
						}.bind(this))
					} else "bottom" === this.options.tooltip_position ? t.forEach(function(t) {
						this._addClass(t, "bottom"), t.style.top = "22px"
					}.bind(this)) : t.forEach(function(t) {
						this._addClass(t, "top"), t.style.top = -this.tooltip.outerHeight - 14 + "px"
					}.bind(this))
				}
			}, t && ! function() {
				var o = void 0;
				t.fn.slider ? (windowIsDefined && window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead."), o = i) : (t.bridget(e, s), o = e), t.bridget(i, s), t(function() {
					t("input[data-provide=slider]")[o]()
				})
			}()
		}(t), s
}), ! function(t) {
	"function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : jQuery)
}(function(t, e) {
	function i() {
		return new Date(Date.UTC.apply(Date, arguments))
	}

	function s() {
		var t = new Date;
		return i(t.getFullYear(), t.getMonth(), t.getDate())
	}

	function o(t, e) {
		return t.getUTCFullYear() === e.getUTCFullYear() && t.getUTCMonth() === e.getUTCMonth() && t.getUTCDate() === e.getUTCDate()
	}

	function n(t) {
		return function() {
			return this[t].apply(this, arguments);
		}
	}

	function a(t) {
		return t && !isNaN(t.getTime())
	}

	function r(e, i) {
		function s(t, e) {
			return e.toLowerCase()
		}
		var o, n = t(e).data(),
			a = {},
			r = new RegExp("^" + i.toLowerCase() + "([A-Z])");
		i = new RegExp("^" + i.toLowerCase());
		for(var l in n) i.test(l) && (o = l.replace(r, s), a[o] = n[l]);
		return a
	}

	function l(e) {
		var i = {};
		if(m[e] || (e = e.split("-")[0], m[e])) {
			var s = m[e];
			return t.each(g, function(t, e) {
				e in s && (i[e] = s[e])
			}), i
		}
	}
	var h = function() {
			var e = {
				get: function(t) {
					return this.slice(t)[0]
				},
				contains: function(t) {
					for(var e = t && t.valueOf(), i = 0, s = this.length; s > i; i++)
						if(this[i].valueOf() === e) return i;
					return -1
				},
				remove: function(t) {
					this.splice(t, 1)
				},
				replace: function(e) {
					e && (t.isArray(e) || (e = [e]), this.clear(), this.push.apply(this, e))
				},
				clear: function() {
					this.length = 0
				},
				copy: function() {
					var t = new h;
					return t.replace(this), t
				}
			};
			return function() {
				var i = [];
				return i.push.apply(i, arguments), t.extend(i, e), i
			}
		}(),
		d = function(e, i) {
			t(e).data("datepicker", this), this._process_options(i), this.dates = new h, this.viewDate = this.o.defaultViewDate, this.focusDate = null, this.element = t(e), this.isInput = this.element.is("input"), this.inputField = this.isInput ? this.element : this.element.find("input"), this.component = !!this.element.hasClass("date") && this.element.find(".add-on, .input-group-addon, .btn"), this.hasInput = this.component && this.inputField.length, this.component && 0 === this.component.length && (this.component = !1), this.isInline = !this.component && this.element.is("div"), this.picker = t(v.template), this._check_template(this.o.templates.leftArrow) && this.picker.find(".prev").html(this.o.templates.leftArrow), this._check_template(this.o.templates.rightArrow) && this.picker.find(".next").html(this.o.templates.rightArrow), this._buildEvents(), this._attachEvents(), this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu"), this.o.rtl && this.picker.addClass("datepicker-rtl"), this.viewMode = this.o.startView, this.o.calendarWeeks && this.picker.find("thead .datepicker-title, tfoot .today, tfoot .clear").attr("colspan", function(t, e) {
				return parseInt(e) + 1
			}), this._allow_update = !1, this.setStartDate(this._o.startDate), this.setEndDate(this._o.endDate), this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled), this.setDaysOfWeekHighlighted(this.o.daysOfWeekHighlighted), this.setDatesDisabled(this.o.datesDisabled), this.fillDow(), this.fillMonths(), this._allow_update = !0, this.update(), this.showMode(), this.isInline && this.show()
		};
	d.prototype = {
		constructor: d,
		_resolveViewName: function(t, i) {
			return 0 === t || "days" === t || "month" === t ? 0 : 1 === t || "months" === t || "year" === t ? 1 : 2 === t || "years" === t || "decade" === t ? 2 : 3 === t || "decades" === t || "century" === t ? 3 : 4 === t || "centuries" === t || "millennium" === t ? 4 : i !== e && i
		},
		_check_template: function(i) {
			try {
				if(i === e || "" === i) return !1;
				if((i.match(/[<>]/g) || []).length <= 0) return !0;
				var s = t(i);
				return s.length > 0
			} catch(o) {
				return !1
			}
		},
		_process_options: function(e) {
			this._o = t.extend({}, this._o, e);
			var o = this.o = t.extend({}, this._o),
				n = o.language;
			m[n] || (n = n.split("-")[0], m[n] || (n = f.language)), o.language = n, o.startView = this._resolveViewName(o.startView, 0), o.minViewMode = this._resolveViewName(o.minViewMode, 0), o.maxViewMode = this._resolveViewName(o.maxViewMode, 4), o.startView = Math.min(o.startView, o.maxViewMode), o.startView = Math.max(o.startView, o.minViewMode), o.multidate !== !0 && (o.multidate = Number(o.multidate) || !1, o.multidate !== !1 && (o.multidate = Math.max(0, o.multidate))), o.multidateSeparator = String(o.multidateSeparator), o.weekStart %= 7, o.weekEnd = (o.weekStart + 6) % 7;
			var a = v.parseFormat(o.format);
			o.startDate !== -(1 / 0) && (o.startDate ? o.startDate instanceof Date ? o.startDate = this._local_to_utc(this._zero_time(o.startDate)) : o.startDate = v.parseDate(o.startDate, a, o.language, o.assumeNearbyYear) : o.startDate = -(1 / 0)), o.endDate !== 1 / 0 && (o.endDate ? o.endDate instanceof Date ? o.endDate = this._local_to_utc(this._zero_time(o.endDate)) : o.endDate = v.parseDate(o.endDate, a, o.language, o.assumeNearbyYear) : o.endDate = 1 / 0), o.daysOfWeekDisabled = o.daysOfWeekDisabled || [], t.isArray(o.daysOfWeekDisabled) || (o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/)), o.daysOfWeekDisabled = t.map(o.daysOfWeekDisabled, function(t) {
				return parseInt(t, 10)
			}), o.daysOfWeekHighlighted = o.daysOfWeekHighlighted || [], t.isArray(o.daysOfWeekHighlighted) || (o.daysOfWeekHighlighted = o.daysOfWeekHighlighted.split(/[,\s]*/)), o.daysOfWeekHighlighted = t.map(o.daysOfWeekHighlighted, function(t) {
				return parseInt(t, 10)
			}), o.datesDisabled = o.datesDisabled || [], t.isArray(o.datesDisabled) || (o.datesDisabled = [o.datesDisabled]), o.datesDisabled = t.map(o.datesDisabled, function(t) {
				return v.parseDate(t, a, o.language, o.assumeNearbyYear)
			});
			var r = String(o.orientation).toLowerCase().split(/\s+/g),
				l = o.orientation.toLowerCase();
			if(r = t.grep(r, function(t) {
					return /^auto|left|right|top|bottom$/.test(t)
				}), o.orientation = {
					x: "auto",
					y: "auto"
				}, l && "auto" !== l)
				if(1 === r.length) switch(r[0]) {
					case "top":
					case "bottom":
						o.orientation.y = r[0];
						break;
					case "left":
					case "right":
						o.orientation.x = r[0]
				} else l = t.grep(r, function(t) {
					return /^left|right$/.test(t)
				}), o.orientation.x = l[0] || "auto", l = t.grep(r, function(t) {
					return /^top|bottom$/.test(t)
				}), o.orientation.y = l[0] || "auto";
			if(o.defaultViewDate) {
				var h = o.defaultViewDate.year || (new Date).getFullYear(),
					d = o.defaultViewDate.month || 0,
					c = o.defaultViewDate.day || 1;
				o.defaultViewDate = i(h, d, c)
			} else o.defaultViewDate = s()
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(t) {
			for(var i, s, o, n = 0; n < t.length; n++) i = t[n][0], 2 === t[n].length ? (s = e, o = t[n][1]) : 3 === t[n].length && (s = t[n][1], o = t[n][2]), i.on(o, s)
		},
		_unapplyEvents: function(t) {
			for(var i, s, o, n = 0; n < t.length; n++) i = t[n][0], 2 === t[n].length ? (o = e, s = t[n][1]) : 3 === t[n].length && (o = t[n][1], s = t[n][2]), i.off(s, o)
		},
		_buildEvents: function() {
			var e = {
				keyup: t.proxy(function(e) {
					-1 === t.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) && this.update()
				}, this),
				keydown: t.proxy(this.keydown, this),
				paste: t.proxy(this.paste, this)
			};
			this.o.showOnFocus === !0 && (e.focus = t.proxy(this.show, this)), this.isInput ? this._events = [
				[this.element, e]
			] : this.component && this.hasInput ? this._events = [
				[this.inputField, e],
				[this.component, {
					click: t.proxy(this.show, this)
				}]
			] : this._events = [
				[this.element, {
					click: t.proxy(this.show, this),
					keydown: t.proxy(this.keydown, this)
				}]
			], this._events.push([this.element, "*", {
				blur: t.proxy(function(t) {
					this._focused_from = t.target
				}, this)
			}], [this.element, {
				blur: t.proxy(function(t) {
					this._focused_from = t.target
				}, this)
			}]), this.o.immediateUpdates && this._events.push([this.element, {
				"changeYear changeMonth": t.proxy(function(t) {
					this.update(t.date)
				}, this)
			}]), this._secondaryEvents = [
				[this.picker, {
					click: t.proxy(this.click, this)
				}],
				[t(window), {
					resize: t.proxy(this.place, this)
				}],
				[t(document), {
					mousedown: t.proxy(function(t) {
						this.element.is(t.target) || this.element.find(t.target).length || this.picker.is(t.target) || this.picker.find(t.target).length || this.isInline || this.hide()
					}, this)
				}]
			]
		},
		_attachEvents: function() {
			this._detachEvents(), this._applyEvents(this._events)
		},
		_detachEvents: function() {
			this._unapplyEvents(this._events)
		},
		_attachSecondaryEvents: function() {
			this._detachSecondaryEvents(), this._applyEvents(this._secondaryEvents)
		},
		_detachSecondaryEvents: function() {
			this._unapplyEvents(this._secondaryEvents)
		},
		_trigger: function(e, i) {
			var s = i || this.dates.get(-1),
				o = this._utc_to_local(s);
			this.element.trigger({
				type: e,
				date: o,
				dates: t.map(this.dates, this._utc_to_local),
				format: t.proxy(function(t, e) {
					0 === arguments.length ? (t = this.dates.length - 1, e = this.o.format) : "string" == typeof t && (e = t, t = this.dates.length - 1), e = e || this.o.format;
					var i = this.dates.get(t);
					return v.formatDate(i, e, this.o.language)
				}, this)
			})
		},
		show: function() {
			return this.inputField.prop("disabled") || this.inputField.prop("readonly") && this.o.enableOnReadonly === !1 ? void 0 : (this.isInline || this.picker.appendTo(this.o.container), this.place(), this.picker.show(), this._attachSecondaryEvents(), this._trigger("show"), (window.navigator.msMaxTouchPoints || "ontouchstart" in document) && this.o.disableTouchKeyboard && t(this.element).blur(), this)
		},
		hide: function() {
			return this.isInline || !this.picker.is(":visible") ? this : (this.focusDate = null, this.picker.hide().detach(), this._detachSecondaryEvents(), this.viewMode = this.o.startView, this.showMode(), this.o.forceParse && this.inputField.val() && this.setValue(), this._trigger("hide"), this)
		},
		destroy: function() {
			return this.hide(), this._detachEvents(), this._detachSecondaryEvents(), this.picker.remove(), delete this.element.data().datepicker, this.isInput || delete this.element.data().date, this
		},
		paste: function(e) {
			var i;
			if(e.originalEvent.clipboardData && e.originalEvent.clipboardData.types && -1 !== t.inArray("text/plain", e.originalEvent.clipboardData.types)) i = e.originalEvent.clipboardData.getData("text/plain");
			else {
				if(!window.clipboardData) return;
				i = window.clipboardData.getData("Text")
			}
			this.setDate(i), this.update(), e.preventDefault()
		},
		_utc_to_local: function(t) {
			return t && new Date(t.getTime() + 6e4 * t.getTimezoneOffset())
		},
		_local_to_utc: function(t) {
			return t && new Date(t.getTime() - 6e4 * t.getTimezoneOffset())
		},
		_zero_time: function(t) {
			return t && new Date(t.getFullYear(), t.getMonth(), t.getDate())
		},
		_zero_utc_time: function(t) {
			return t && new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()))
		},
		getDates: function() {
			return t.map(this.dates, this._utc_to_local)
		},
		getUTCDates: function() {
			return t.map(this.dates, function(t) {
				return new Date(t)
			})
		},
		getDate: function() {
			return this._utc_to_local(this.getUTCDate())
		},
		getUTCDate: function() {
			var t = this.dates.get(-1);
			return "undefined" != typeof t ? new Date(t) : null
		},
		clearDates: function() {
			this.inputField && this.inputField.val(""), this.update(), this._trigger("changeDate"), this.o.autoclose && this.hide()
		},
		setDates: function() {
			var e = t.isArray(arguments[0]) ? arguments[0] : arguments;
			return this.update.apply(this, e), this._trigger("changeDate"), this.setValue(), this
		},
		setUTCDates: function() {
			var e = t.isArray(arguments[0]) ? arguments[0] : arguments;
			return this.update.apply(this, t.map(e, this._utc_to_local)), this._trigger("changeDate"), this.setValue(), this
		},
		setDate: n("setDates"),
		setUTCDate: n("setUTCDates"),
		remove: n("destroy"),
		setValue: function() {
			var t = this.getFormattedDate();
			return this.inputField.val(t), this
		},
		getFormattedDate: function(i) {
			i === e && (i = this.o.format);
			var s = this.o.language;
			return t.map(this.dates, function(t) {
				return v.formatDate(t, i, s)
			}).join(this.o.multidateSeparator)
		},
		getStartDate: function() {
			return this.o.startDate
		},
		setStartDate: function(t) {
			return this._process_options({
				startDate: t
			}), this.update(), this.updateNavArrows(), this
		},
		getEndDate: function() {
			return this.o.endDate
		},
		setEndDate: function(t) {
			return this._process_options({
				endDate: t
			}), this.update(), this.updateNavArrows(), this
		},
		setDaysOfWeekDisabled: function(t) {
			return this._process_options({
				daysOfWeekDisabled: t
			}), this.update(), this.updateNavArrows(), this
		},
		setDaysOfWeekHighlighted: function(t) {
			return this._process_options({
				daysOfWeekHighlighted: t
			}), this.update(), this
		},
		setDatesDisabled: function(t) {
			this._process_options({
				datesDisabled: t
			}), this.update(), this.updateNavArrows()
		},
		place: function() {
			if(this.isInline) return this;
			var e = this.picker.outerWidth(),
				i = this.picker.outerHeight(),
				s = 10,
				o = t(this.o.container),
				n = o.width(),
				a = "body" === this.o.container ? t(document).scrollTop() : o.scrollTop(),
				r = o.offset(),
				l = [];
			this.element.parents().each(function() {
				var e = t(this).css("z-index");
				"auto" !== e && 0 !== e && l.push(parseInt(e))
			});
			var h = Math.max.apply(Math, l) + this.o.zIndexOffset,
				d = this.component ? this.component.parent().offset() : this.element.offset(),
				c = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1),
				p = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1),
				u = d.left - r.left,
				f = d.top - r.top;
			"body" !== this.o.container && (f += a), this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"), "auto" !== this.o.orientation.x ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x), "right" === this.o.orientation.x && (u -= e - p)) : d.left < 0 ? (this.picker.addClass("datepicker-orient-left"), u -= d.left - s) : u + e > n ? (this.picker.addClass("datepicker-orient-right"), u += p - e) : this.picker.addClass("datepicker-orient-left");
			var g, m = this.o.orientation.y;
			if("auto" === m && (g = -a + f - i, m = 0 > g ? "bottom" : "top"), this.picker.addClass("datepicker-orient-" + m), "top" === m ? f -= i + parseInt(this.picker.css("padding-top")) : f += c, this.o.rtl) {
				var v = n - (u + p);
				this.picker.css({
					top: f,
					right: v,
					zIndex: h
				})
			} else this.picker.css({
				top: f,
				left: u,
				zIndex: h
			});
			return this
		},
		_allow_update: !0,
		update: function() {
			if(!this._allow_update) return this;
			var e = this.dates.copy(),
				i = [],
				s = !1;
			return arguments.length ? (t.each(arguments, t.proxy(function(t, e) {
				e instanceof Date && (e = this._local_to_utc(e)), i.push(e)
			}, this)), s = !0) : (i = this.isInput ? this.element.val() : this.element.data("date") || this.inputField.val(), i = i && this.o.multidate ? i.split(this.o.multidateSeparator) : [i], delete this.element.data().date), i = t.map(i, t.proxy(function(t) {
				return v.parseDate(t, this.o.format, this.o.language, this.o.assumeNearbyYear)
			}, this)), i = t.grep(i, t.proxy(function(t) {
				return !this.dateWithinRange(t) || !t
			}, this), !0), this.dates.replace(i), this.dates.length ? this.viewDate = new Date(this.dates.get(-1)) : this.viewDate < this.o.startDate ? this.viewDate = new Date(this.o.startDate) : this.viewDate > this.o.endDate ? this.viewDate = new Date(this.o.endDate) : this.viewDate = this.o.defaultViewDate, s ? this.setValue() : i.length && String(e) !== String(this.dates) && this._trigger("changeDate"), !this.dates.length && e.length && this._trigger("clearDate"), this.fill(), this.element.change(), this
		},
		fillDow: function() {
			var e = this.o.weekStart,
				i = "<tr>";
			for(this.o.calendarWeeks && (this.picker.find(".datepicker-days .datepicker-switch").attr("colspan", function(t, e) {
					return parseInt(e) + 1
				}), i += '<th class="cw">&#160;</th>'); e < this.o.weekStart + 7;) i += '<th class="dow', t.inArray(e, this.o.daysOfWeekDisabled) > -1 && (i += " disabled"), i += '">' + m[this.o.language].daysMin[e++ % 7] + "</th>";
			i += "</tr>", this.picker.find(".datepicker-days thead").append(i)
		},
		fillMonths: function() {
			for(var t = this._utc_to_local(this.viewDate), e = "", i = 0; 12 > i;) {
				var s = t && t.getMonth() === i ? " focused" : "";
				e += '<span class="month' + s + '">' + m[this.o.language].monthsShort[i++] + "</span>"
			}
			this.picker.find(".datepicker-months td").html(e)
		},
		setRange: function(e) {
			e && e.length ? this.range = t.map(e, function(t) {
				return t.valueOf()
			}) : delete this.range, this.fill()
		},
		getClassNames: function(e) {
			var i = [],
				s = this.viewDate.getUTCFullYear(),
				o = this.viewDate.getUTCMonth(),
				n = new Date;
			return e.getUTCFullYear() < s || e.getUTCFullYear() === s && e.getUTCMonth() < o ? i.push("old") : (e.getUTCFullYear() > s || e.getUTCFullYear() === s && e.getUTCMonth() > o) && i.push("new"), this.focusDate && e.valueOf() === this.focusDate.valueOf() && i.push("focused"), this.o.todayHighlight && e.getUTCFullYear() === n.getFullYear() && e.getUTCMonth() === n.getMonth() && e.getUTCDate() === n.getDate() && i.push("today"), -1 !== this.dates.contains(e) && i.push("active"), this.dateWithinRange(e) || i.push("disabled"), this.dateIsDisabled(e) && i.push("disabled", "disabled-date"), -1 !== t.inArray(e.getUTCDay(), this.o.daysOfWeekHighlighted) && i.push("highlighted"), this.range && (e > this.range[0] && e < this.range[this.range.length - 1] && i.push("range"), -1 !== t.inArray(e.valueOf(), this.range) && i.push("selected"), e.valueOf() === this.range[0] && i.push("range-start"), e.valueOf() === this.range[this.range.length - 1] && i.push("range-end")), i
		},
		_fill_yearsView: function(i, s, o, n, a, r, l, h) {
			var d, c, p, u, f, g, m, v, y, b, w;
			for(d = "", c = this.picker.find(i), p = parseInt(a / o, 10) * o, f = parseInt(r / n, 10) * n, g = parseInt(l / n, 10) * n, u = t.map(this.dates, function(t) {
					return parseInt(t.getUTCFullYear() / n, 10) * n
				}), c.find(".datepicker-switch").text(p + "-" + (p + 9 * n)), m = p - n, v = -1; 11 > v; v += 1) y = [s], b = null, -1 === v ? y.push("old") : 10 === v && y.push("new"), -1 !== t.inArray(m, u) && y.push("active"), (f > m || m > g) && y.push("disabled"), m === this.viewDate.getFullYear() && y.push("focused"), h !== t.noop && (w = h(new Date(m, 0, 1)), w === e ? w = {} : "boolean" == typeof w ? w = {
				enabled: w
			} : "string" == typeof w && (w = {
				classes: w
			}), w.enabled === !1 && y.push("disabled"), w.classes && (y = y.concat(w.classes.split(/\s+/))), w.tooltip && (b = w.tooltip)), d += '<span class="' + y.join(" ") + '"' + (b ? ' title="' + b + '"' : "") + ">" + m + "</span>", m += n;
			c.find("td").html(d)
		},
		fill: function() {
			var s, o, n = new Date(this.viewDate),
				a = n.getUTCFullYear(),
				r = n.getUTCMonth(),
				l = this.o.startDate !== -(1 / 0) ? this.o.startDate.getUTCFullYear() : -(1 / 0),
				h = this.o.startDate !== -(1 / 0) ? this.o.startDate.getUTCMonth() : -(1 / 0),
				d = this.o.endDate !== 1 / 0 ? this.o.endDate.getUTCFullYear() : 1 / 0,
				c = this.o.endDate !== 1 / 0 ? this.o.endDate.getUTCMonth() : 1 / 0,
				p = m[this.o.language].today || m.en.today || "",
				u = m[this.o.language].clear || m.en.clear || "",
				f = m[this.o.language].titleFormat || m.en.titleFormat;
			if(!isNaN(a) && !isNaN(r)) {
				this.picker.find(".datepicker-days .datepicker-switch").text(v.formatDate(n, f, this.o.language)), this.picker.find("tfoot .today").text(p).toggle(this.o.todayBtn !== !1), this.picker.find("tfoot .clear").text(u).toggle(this.o.clearBtn !== !1), this.picker.find("thead .datepicker-title").text(this.o.title).toggle("" !== this.o.title), this.updateNavArrows(), this.fillMonths();
				var g = i(a, r - 1, 28),
					y = v.getDaysInMonth(g.getUTCFullYear(), g.getUTCMonth());
				g.setUTCDate(y), g.setUTCDate(y - (g.getUTCDay() - this.o.weekStart + 7) % 7);
				var b = new Date(g);
				g.getUTCFullYear() < 100 && b.setUTCFullYear(g.getUTCFullYear()), b.setUTCDate(b.getUTCDate() + 42), b = b.valueOf();
				for(var w, T = []; g.valueOf() < b;) {
					if(g.getUTCDay() === this.o.weekStart && (T.push("<tr>"), this.o.calendarWeeks)) {
						var k = new Date(+g + (this.o.weekStart - g.getUTCDay() - 7) % 7 * 864e5),
							_ = new Date(Number(k) + (11 - k.getUTCDay()) % 7 * 864e5),
							C = new Date(Number(C = i(_.getUTCFullYear(), 0, 1)) + (11 - C.getUTCDay()) % 7 * 864e5),
							x = (_ - C) / 864e5 / 7 + 1;
						T.push('<td class="cw">' + x + "</td>")
					}
					w = this.getClassNames(g), w.push("day"), this.o.beforeShowDay !== t.noop && (o = this.o.beforeShowDay(this._utc_to_local(g)), o === e ? o = {} : "boolean" == typeof o ? o = {
						enabled: o
					} : "string" == typeof o && (o = {
						classes: o
					}), o.enabled === !1 && w.push("disabled"), o.classes && (w = w.concat(o.classes.split(/\s+/))), o.tooltip && (s = o.tooltip)), w = t.isFunction(t.uniqueSort) ? t.uniqueSort(w) : t.unique(w), T.push('<td class="' + w.join(" ") + '"' + (s ? ' title="' + s + '"' : "") + ">" + g.getUTCDate() + "</td>"), s = null, g.getUTCDay() === this.o.weekEnd && T.push("</tr>"), g.setUTCDate(g.getUTCDate() + 1)
				}
				this.picker.find(".datepicker-days tbody").empty().append(T.join(""));
				var E = m[this.o.language].monthsTitle || m.en.monthsTitle || "Months",
					D = this.picker.find(".datepicker-months").find(".datepicker-switch").text(this.o.maxViewMode < 2 ? E : a).end().find("span").removeClass("active");
				if(t.each(this.dates, function(t, e) {
						e.getUTCFullYear() === a && D.eq(e.getUTCMonth()).addClass("active")
					}), (l > a || a > d) && D.addClass("disabled"), a === l && D.slice(0, h).addClass("disabled"), a === d && D.slice(c + 1).addClass("disabled"), this.o.beforeShowMonth !== t.noop) {
					var S = this;
					t.each(D, function(i, s) {
						var o = new Date(a, i, 1),
							n = S.o.beforeShowMonth(o);
						n === e ? n = {} : "boolean" == typeof n ? n = {
							enabled: n
						} : "string" == typeof n && (n = {
							classes: n
						}), n.enabled !== !1 || t(s).hasClass("disabled") || t(s).addClass("disabled"), n.classes && t(s).addClass(n.classes), n.tooltip && t(s).prop("title", n.tooltip)
					})
				}
				this._fill_yearsView(".datepicker-years", "year", 10, 1, a, l, d, this.o.beforeShowYear), this._fill_yearsView(".datepicker-decades", "decade", 100, 10, a, l, d, this.o.beforeShowDecade), this._fill_yearsView(".datepicker-centuries", "century", 1e3, 100, a, l, d, this.o.beforeShowCentury)
			}
		},
		updateNavArrows: function() {
			if(this._allow_update) {
				var t = new Date(this.viewDate),
					e = t.getUTCFullYear(),
					i = t.getUTCMonth();
				switch(this.viewMode) {
					case 0:
						this.o.startDate !== -(1 / 0) && e <= this.o.startDate.getUTCFullYear() && i <= this.o.startDate.getUTCMonth() ? this.picker.find(".prev").css({
							visibility: "hidden"
						}) : this.picker.find(".prev").css({
							visibility: "visible"
						}), this.o.endDate !== 1 / 0 && e >= this.o.endDate.getUTCFullYear() && i >= this.o.endDate.getUTCMonth() ? this.picker.find(".next").css({
							visibility: "hidden"
						}) : this.picker.find(".next").css({
							visibility: "visible"
						});
						break;
					case 1:
					case 2:
					case 3:
					case 4:
						this.o.startDate !== -(1 / 0) && e <= this.o.startDate.getUTCFullYear() || this.o.maxViewMode < 2 ? this.picker.find(".prev").css({
							visibility: "hidden"
						}) : this.picker.find(".prev").css({
							visibility: "visible"
						}), this.o.endDate !== 1 / 0 && e >= this.o.endDate.getUTCFullYear() || this.o.maxViewMode < 2 ? this.picker.find(".next").css({
							visibility: "hidden"
						}) : this.picker.find(".next").css({
							visibility: "visible"
						})
				}
			}
		},
		click: function(e) {
			e.preventDefault(), e.stopPropagation();
			var o, n, a, r, l, h, d;
			o = t(e.target), o.hasClass("datepicker-switch") && this.showMode(1);
			var c = o.closest(".prev, .next");
			c.length > 0 && (n = v.modes[this.viewMode].navStep * (c.hasClass("prev") ? -1 : 1), 0 === this.viewMode ? (this.viewDate = this.moveMonth(this.viewDate, n), this._trigger("changeMonth", this.viewDate)) : (this.viewDate = this.moveYear(this.viewDate, n), 1 === this.viewMode && this._trigger("changeYear", this.viewDate)), this.fill()), o.hasClass("today") && !o.hasClass("day") && (this.showMode(-2), this._setDate(s(), "linked" === this.o.todayBtn ? null : "view")), o.hasClass("clear") && this.clearDates(), o.hasClass("disabled") || (o.hasClass("day") && (a = parseInt(o.text(), 10) || 1, r = this.viewDate.getUTCFullYear(), l = this.viewDate.getUTCMonth(), o.hasClass("old") && (0 === l ? (l = 11, r -= 1, h = !0, d = !0) : (l -= 1, h = !0)), o.hasClass("new") && (11 === l ? (l = 0, r += 1, h = !0, d = !0) : (l += 1, h = !0)), this._setDate(i(r, l, a)), d && this._trigger("changeYear", this.viewDate), h && this._trigger("changeMonth", this.viewDate)), o.hasClass("month") && (this.viewDate.setUTCDate(1), a = 1, l = o.parent().find("span").index(o), r = this.viewDate.getUTCFullYear(), this.viewDate.setUTCMonth(l), this._trigger("changeMonth", this.viewDate), 1 === this.o.minViewMode ? (this._setDate(i(r, l, a)), this.showMode()) : this.showMode(-1), this.fill()), (o.hasClass("year") || o.hasClass("decade") || o.hasClass("century")) && (this.viewDate.setUTCDate(1), a = 1, l = 0, r = parseInt(o.text(), 10) || 0, this.viewDate.setUTCFullYear(r), o.hasClass("year") && (this._trigger("changeYear", this.viewDate), 2 === this.o.minViewMode && this._setDate(i(r, l, a))), o.hasClass("decade") && (this._trigger("changeDecade", this.viewDate), 3 === this.o.minViewMode && this._setDate(i(r, l, a))), o.hasClass("century") && (this._trigger("changeCentury", this.viewDate), 4 === this.o.minViewMode && this._setDate(i(r, l, a))), this.showMode(-1), this.fill())), this.picker.is(":visible") && this._focused_from && t(this._focused_from).focus(), delete this._focused_from
		},
		_toggle_multidate: function(t) {
			var e = this.dates.contains(t);
			if(t || this.dates.clear(), -1 !== e ? (this.o.multidate === !0 || this.o.multidate > 1 || this.o.toggleActive) && this.dates.remove(e) : this.o.multidate === !1 ? (this.dates.clear(), this.dates.push(t)) : this.dates.push(t), "number" == typeof this.o.multidate)
				for(; this.dates.length > this.o.multidate;) this.dates.remove(0)
		},
		_setDate: function(t, e) {
			e && "date" !== e || this._toggle_multidate(t && new Date(t)), e && "view" !== e || (this.viewDate = t && new Date(t)), this.fill(), this.setValue(), e && "view" === e || this._trigger("changeDate"), this.inputField && this.inputField.change(), !this.o.autoclose || e && "date" !== e || this.hide()
		},
		moveDay: function(t, e) {
			var i = new Date(t);
			return i.setUTCDate(t.getUTCDate() + e), i
		},
		moveWeek: function(t, e) {
			return this.moveDay(t, 7 * e)
		},
		moveMonth: function(t, e) {
			if(!a(t)) return this.o.defaultViewDate;
			if(!e) return t;
			var i, s, o = new Date(t.valueOf()),
				n = o.getUTCDate(),
				r = o.getUTCMonth(),
				l = Math.abs(e);
			if(e = e > 0 ? 1 : -1, 1 === l) s = -1 === e ? function() {
				return o.getUTCMonth() === r
			} : function() {
				return o.getUTCMonth() !== i
			}, i = r + e, o.setUTCMonth(i), (0 > i || i > 11) && (i = (i + 12) % 12);
			else {
				for(var h = 0; l > h; h++) o = this.moveMonth(o, e);
				i = o.getUTCMonth(), o.setUTCDate(n), s = function() {
					return i !== o.getUTCMonth()
				}
			}
			for(; s();) o.setUTCDate(--n), o.setUTCMonth(i);
			return o
		},
		moveYear: function(t, e) {
			return this.moveMonth(t, 12 * e)
		},
		moveAvailableDate: function(t, e, i) {
			do {
				if(t = this[i](t, e), !this.dateWithinRange(t)) return !1;
				i = "moveDay"
			} while (this.dateIsDisabled(t));
			return t
		},
		weekOfDateIsDisabled: function(e) {
			return -1 !== t.inArray(e.getUTCDay(), this.o.daysOfWeekDisabled)
		},
		dateIsDisabled: function(e) {
			return this.weekOfDateIsDisabled(e) || t.grep(this.o.datesDisabled, function(t) {
				return o(e, t)
			}).length > 0
		},
		dateWithinRange: function(t) {
			return t >= this.o.startDate && t <= this.o.endDate
		},
		keydown: function(t) {
			if(!this.picker.is(":visible")) return void((40 === t.keyCode || 27 === t.keyCode) && (this.show(), t.stopPropagation()));
			var e, i, s = !1,
				o = this.focusDate || this.viewDate;
			switch(t.keyCode) {
				case 27:
					this.focusDate ? (this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill()) : this.hide(), t.preventDefault(), t.stopPropagation();
					break;
				case 37:
				case 38:
				case 39:
				case 40:
					if(!this.o.keyboardNavigation || 7 === this.o.daysOfWeekDisabled.length) break;
					e = 37 === t.keyCode || 38 === t.keyCode ? -1 : 1, 0 === this.viewMode ? t.ctrlKey ? (i = this.moveAvailableDate(o, e, "moveYear"), i && this._trigger("changeYear", this.viewDate)) : t.shiftKey ? (i = this.moveAvailableDate(o, e, "moveMonth"), i && this._trigger("changeMonth", this.viewDate)) : 37 === t.keyCode || 39 === t.keyCode ? i = this.moveAvailableDate(o, e, "moveDay") : this.weekOfDateIsDisabled(o) || (i = this.moveAvailableDate(o, e, "moveWeek")) : 1 === this.viewMode ? ((38 === t.keyCode || 40 === t.keyCode) && (e = 4 * e), i = this.moveAvailableDate(o, e, "moveMonth")) : 2 === this.viewMode && ((38 === t.keyCode || 40 === t.keyCode) && (e = 4 * e), i = this.moveAvailableDate(o, e, "moveYear")), i && (this.focusDate = this.viewDate = i, this.setValue(), this.fill(), t.preventDefault());
					break;
				case 13:
					if(!this.o.forceParse) break;
					o = this.focusDate || this.dates.get(-1) || this.viewDate, this.o.keyboardNavigation && (this._toggle_multidate(o), s = !0), this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.setValue(), this.fill(), this.picker.is(":visible") && (t.preventDefault(), t.stopPropagation(), this.o.autoclose && this.hide());
					break;
				case 9:
					this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill(), this.hide()
			}
			s && (this.dates.length ? this._trigger("changeDate") : this._trigger("clearDate"), this.inputField && this.inputField.change())
		},
		showMode: function(t) {
			t && (this.viewMode = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, this.viewMode + t))), this.picker.children("div").hide().filter(".datepicker-" + v.modes[this.viewMode].clsName).show(), this.updateNavArrows()
		}
	};
	var c = function(e, i) {
		t(e).data("datepicker", this), this.element = t(e), this.inputs = t.map(i.inputs, function(t) {
			return t.jquery ? t[0] : t
		}), delete i.inputs, u.call(t(this.inputs), i).on("changeDate", t.proxy(this.dateUpdated, this)), this.pickers = t.map(this.inputs, function(e) {
			return t(e).data("datepicker")
		}), this.updateDates()
	};
	c.prototype = {
		updateDates: function() {
			this.dates = t.map(this.pickers, function(t) {
				return t.getUTCDate()
			}), this.updateRanges()
		},
		updateRanges: function() {
			var e = t.map(this.dates, function(t) {
				return t.valueOf()
			});
			t.each(this.pickers, function(t, i) {
				i.setRange(e)
			})
		},
		dateUpdated: function(e) {
			if(!this.updating) {
				this.updating = !0;
				var i = t(e.target).data("datepicker");
				if("undefined" != typeof i) {
					var s = i.getUTCDate(),
						o = t.inArray(e.target, this.inputs),
						n = o - 1,
						a = o + 1,
						r = this.inputs.length;
					if(-1 !== o) {
						if(t.each(this.pickers, function(t, e) {
								e.getUTCDate() || e.setUTCDate(s)
							}), s < this.dates[n])
							for(; n >= 0 && s < this.dates[n];) this.pickers[n--].setUTCDate(s);
						else if(s > this.dates[a])
							for(; r > a && s > this.dates[a];) this.pickers[a++].setUTCDate(s);
						this.updateDates(), delete this.updating
					}
				}
			}
		},
		remove: function() {
			t.map(this.pickers, function(t) {
				t.remove()
			}), delete this.element.data().datepicker
		}
	};
	var p = t.fn.datepicker,
		u = function(i) {
			var s = Array.apply(null, arguments);
			s.shift();
			var o;
			if(this.each(function() {
					var e = t(this),
						n = e.data("datepicker"),
						a = "object" == typeof i && i;
					if(!n) {
						var h = r(this, "date"),
							p = t.extend({}, f, h, a),
							u = l(p.language),
							g = t.extend({}, f, u, h, a);
						e.hasClass("input-daterange") || g.inputs ? (t.extend(g, {
							inputs: g.inputs || e.find("input").toArray()
						}), n = new c(this, g)) : n = new d(this, g), e.data("datepicker", n)
					}
					"string" == typeof i && "function" == typeof n[i] && (o = n[i].apply(n, s))
				}), o === e || o instanceof d || o instanceof c) return this;
			if(this.length > 1) throw new Error("Using only allowed for the collection of a single element (" + i + " function)");
			return o
		};
	t.fn.datepicker = u;
	var f = t.fn.datepicker.defaults = {
			assumeNearbyYear: !1,
			autoclose: !1,
			beforeShowDay: t.noop,
			beforeShowMonth: t.noop,
			beforeShowYear: t.noop,
			beforeShowDecade: t.noop,
			beforeShowCentury: t.noop,
			calendarWeeks: !1,
			clearBtn: !1,
			toggleActive: !1,
			daysOfWeekDisabled: [],
			daysOfWeekHighlighted: [],
			datesDisabled: [],
			endDate: 1 / 0,
			forceParse: !0,
			format: "mm/dd/yyyy",
			keyboardNavigation: !0,
			language: "en",
			minViewMode: 0,
			maxViewMode: 4,
			multidate: !1,
			multidateSeparator: ",",
			orientation: "auto",
			rtl: !1,
			startDate: -(1 / 0),
			startView: 0,
			todayBtn: !1,
			todayHighlight: !1,
			weekStart: 0,
			disableTouchKeyboard: !1,
			enableOnReadonly: !0,
			showOnFocus: !0,
			zIndexOffset: 10,
			container: "body",
			immediateUpdates: !1,
			title: "",
			templates: {
				leftArrow: "&laquo;",
				rightArrow: "&raquo;"
			}
		},
		g = t.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
	t.fn.datepicker.Constructor = d;
	var m = t.fn.datepicker.dates = {
			en: {
				days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				today: "Today",
				clear: "Clear",
				titleFormat: "MM yyyy"
			}
		},
		v = {
			modes: [{
				clsName: "days",
				navFnc: "Month",
				navStep: 1
			}, {
				clsName: "months",
				navFnc: "FullYear",
				navStep: 1
			}, {
				clsName: "years",
				navFnc: "FullYear",
				navStep: 10
			}, {
				clsName: "decades",
				navFnc: "FullDecade",
				navStep: 100
			}, {
				clsName: "centuries",
				navFnc: "FullCentury",
				navStep: 1e3
			}],
			isLeapYear: function(t) {
				return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0
			},
			getDaysInMonth: function(t, e) {
				return [31, v.isLeapYear(t) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][e]
			},
			validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
			nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
			parseFormat: function(t) {
				if("function" == typeof t.toValue && "function" == typeof t.toDisplay) return t;
				var e = t.replace(this.validParts, "\0").split("\0"),
					i = t.match(this.validParts);
				if(!e || !e.length || !i || 0 === i.length) throw new Error("Invalid date format.");
				return {
					separators: e,
					parts: i
				}
			},
			parseDate: function(o, n, a, r) {
				function l(t, e) {
					return e === !0 && (e = 10), 100 > t && (t += 2e3, t > (new Date).getFullYear() + e && (t -= 100)), t
				}

				function h() {
					var t = this.slice(0, y[u].length),
						e = y[u].slice(0, t.length);
					return t.toLowerCase() === e.toLowerCase()
				}
				if(!o) return e;
				if(o instanceof Date) return o;
				if("string" == typeof n && (n = v.parseFormat(n)), n.toValue) return n.toValue(o, n, a);
				var c, p, u, f, g = /([\-+]\d+)([dmwy])/,
					y = o.match(/([\-+]\d+)([dmwy])/g),
					b = {
						d: "moveDay",
						m: "moveMonth",
						w: "moveWeek",
						y: "moveYear"
					},
					w = {
						yesterday: "-1d",
						today: "+0d",
						tomorrow: "+1d"
					};
				if(/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(o)) {
					for(o = new Date, u = 0; u < y.length; u++) c = g.exec(y[u]), p = parseInt(c[1]), f = b[c[2]], o = d.prototype[f](o, p);
					return i(o.getUTCFullYear(), o.getUTCMonth(), o.getUTCDate())
				}
				if("undefined" != typeof w[o] && (o = w[o], y = o.match(/([\-+]\d+)([dmwy])/g), /^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(o))) {
					for(o = new Date, u = 0; u < y.length; u++) c = g.exec(y[u]), p = parseInt(c[1]), f = b[c[2]], o = d.prototype[f](o, p);
					return i(o.getUTCFullYear(), o.getUTCMonth(), o.getUTCDate())
				}
				y = o && o.match(this.nonpunctuation) || [], o = new Date;
				var T, k, _ = {},
					C = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
					x = {
						yyyy: function(t, e) {
							return t.setUTCFullYear(r ? l(e, r) : e)
						},
						yy: function(t, e) {
							return t.setUTCFullYear(r ? l(e, r) : e)
						},
						m: function(t, e) {
							if(isNaN(t)) return t;
							for(e -= 1; 0 > e;) e += 12;
							for(e %= 12, t.setUTCMonth(e); t.getUTCMonth() !== e;) t.setUTCDate(t.getUTCDate() - 1);
							return t
						},
						d: function(t, e) {
							return t.setUTCDate(e)
						}
					};
				x.M = x.MM = x.mm = x.m, x.dd = x.d, o = s();
				var E = n.parts.slice();
				if(y.length !== E.length && (E = t(E).filter(function(e, i) {
						return -1 !== t.inArray(i, C)
					}).toArray()), y.length === E.length) {
					var D;
					for(u = 0, D = E.length; D > u; u++) {
						if(T = parseInt(y[u], 10), c = E[u], isNaN(T)) switch(c) {
							case "MM":
								k = t(m[a].months).filter(h), T = t.inArray(k[0], m[a].months) + 1;
								break;
							case "M":
								k = t(m[a].monthsShort).filter(h), T = t.inArray(k[0], m[a].monthsShort) + 1
						}
						_[c] = T
					}
					var S, $;
					for(u = 0; u < C.length; u++) $ = C[u], $ in _ && !isNaN(_[$]) && (S = new Date(o), x[$](S, _[$]), isNaN(S) || (o = S))
				}
				return o
			},
			formatDate: function(e, i, s) {
				if(!e) return "";
				if("string" == typeof i && (i = v.parseFormat(i)), i.toDisplay) return i.toDisplay(e, i, s);
				var o = {
					d: e.getUTCDate(),
					D: m[s].daysShort[e.getUTCDay()],
					DD: m[s].days[e.getUTCDay()],
					m: e.getUTCMonth() + 1,
					M: m[s].monthsShort[e.getUTCMonth()],
					MM: m[s].months[e.getUTCMonth()],
					yy: e.getUTCFullYear().toString().substring(2),
					yyyy: e.getUTCFullYear()
				};
				o.dd = (o.d < 10 ? "0" : "") + o.d, o.mm = (o.m < 10 ? "0" : "") + o.m, e = [];
				for(var n = t.extend([], i.separators), a = 0, r = i.parts.length; r >= a; a++) n.length && e.push(n.shift()), e.push(o[i.parts[a]]);
				return e.join("");
			},
			headTemplate: '<thead><tr><th colspan="7" class="datepicker-title"></th></tr><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',
			contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
			footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
		};
	v.template = '<div class="datepicker"><div class="datepicker-days"><table class="table-condensed">' + v.headTemplate + "<tbody></tbody>" + v.footTemplate + '</table></div><div class="datepicker-months"><table class="table-condensed">' + v.headTemplate + v.contTemplate + v.footTemplate + '</table></div><div class="datepicker-years"><table class="table-condensed">' + v.headTemplate + v.contTemplate + v.footTemplate + '</table></div><div class="datepicker-decades"><table class="table-condensed">' + v.headTemplate + v.contTemplate + v.footTemplate + '</table></div><div class="datepicker-centuries"><table class="table-condensed">' + v.headTemplate + v.contTemplate + v.footTemplate + "</table></div></div>", t.fn.datepicker.DPGlobal = v, t.fn.datepicker.noConflict = function() {
		return t.fn.datepicker = p, this
	}, t.fn.datepicker.version = "1.6.4", t(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function(e) {
		var i = t(this);
		i.data("datepicker") || (e.preventDefault(), u.call(i, "show"))
	}), t(function() {
		u.call(t('[data-provide="datepicker-inline"]'))
	})
}),
function(t) {
	"function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : jQuery)
}(function(t) {
	function e(t, e) {
		return t.toFixed(e.decimals)
	}
	var i = function(e, s) {
		this.$element = t(e), this.options = t.extend({}, i.DEFAULTS, this.dataOptions(), s), this.init()
	};
	i.DEFAULTS = {
		from: 0,
		to: 0,
		speed: 1e3,
		refreshInterval: 100,
		decimals: 0,
		formatter: e,
		onUpdate: null,
		onComplete: null
	}, i.prototype.init = function() {
		this.value = this.options.from, this.loops = Math.ceil(this.options.speed / this.options.refreshInterval), this.loopCount = 0, this.increment = (this.options.to - this.options.from) / this.loops
	}, i.prototype.dataOptions = function() {
		var t = {
				from: this.$element.data("from"),
				to: this.$element.data("to"),
				speed: this.$element.data("speed"),
				refreshInterval: this.$element.data("refresh-interval"),
				decimals: this.$element.data("decimals")
			},
			e = Object.keys(t);
		for(var i in e) {
			var s = e[i];
			"undefined" == typeof t[s] && delete t[s]
		}
		return t
	}, i.prototype.update = function() {
		this.value += this.increment, this.loopCount++, this.render(), "function" == typeof this.options.onUpdate && this.options.onUpdate.call(this.$element, this.value), this.loopCount >= this.loops && (clearInterval(this.interval), this.value = this.options.to, "function" == typeof this.options.onComplete && this.options.onComplete.call(this.$element, this.value))
	}, i.prototype.render = function() {
		var t = this.options.formatter.call(this.$element, this.value, this.options);
		this.$element.text(t)
	}, i.prototype.restart = function() {
		this.stop(), this.init(), this.start()
	}, i.prototype.start = function() {
		this.stop(), this.render(), this.interval = setInterval(this.update.bind(this), this.options.refreshInterval)
	}, i.prototype.stop = function() {
		this.interval && clearInterval(this.interval)
	}, i.prototype.toggle = function() {
		this.interval ? this.stop() : this.start()
	}, t.fn.countTo = function(e) {
		return this.each(function() {
			var s = t(this),
				o = s.data("countTo"),
				n = !o || "object" == typeof e,
				a = "object" == typeof e ? e : {},
				r = "string" == typeof e ? e : "start";
			n && (o && o.stop(), s.data("countTo", o = new i(this, a))), o[r].call(o)
		})
	}
}), ! function(t, e, i, s) {
	function o(e, i) {
		var n = this;
		"object" == typeof i && (delete i.refresh, delete i.render, t.extend(this, i)), this.$element = t(e), !this.imageSrc && this.$element.is("img") && (this.imageSrc = this.$element.attr("src"));
		var a = (this.position + "").toLowerCase().match(/\S+/g) || [];
		if(a.length < 1 && a.push("center"), 1 == a.length && a.push(a[0]), ("top" == a[0] || "bottom" == a[0] || "left" == a[1] || "right" == a[1]) && (a = [a[1], a[0]]), this.positionX != s && (a[0] = this.positionX.toLowerCase()), this.positionY != s && (a[1] = this.positionY.toLowerCase()), n.positionX = a[0], n.positionY = a[1], "left" != this.positionX && "right" != this.positionX && (this.positionX = isNaN(parseInt(this.positionX)) ? "center" : parseInt(this.positionX)), "top" != this.positionY && "bottom" != this.positionY && (this.positionY = isNaN(parseInt(this.positionY)) ? "center" : parseInt(this.positionY)), this.position = this.positionX + (isNaN(this.positionX) ? "" : "px") + " " + this.positionY + (isNaN(this.positionY) ? "" : "px"), navigator.userAgent.match(/(iPod|iPhone|iPad)/)) return this.imageSrc && this.iosFix && !this.$element.is("img") && this.$element.css({
			backgroundImage: "url(" + this.imageSrc + ")",
			backgroundSize: "cover",
			backgroundPosition: this.position
		}), this;
		if(navigator.userAgent.match(/(Android)/)) return this.imageSrc && this.androidFix && !this.$element.is("img") && this.$element.css({
			backgroundImage: "url(" + this.imageSrc + ")",
			backgroundSize: "cover",
			backgroundPosition: this.position
		}), this;
		this.$mirror = t("<div />").prependTo("body");
		var r = this.$element.find(">.parallax-slider"),
			l = !1;
		0 == r.length ? this.$slider = t("<img />").prependTo(this.$mirror) : (this.$slider = r.prependTo(this.$mirror), l = !0), this.$mirror.addClass("parallax-mirror").css({
			visibility: "hidden",
			zIndex: this.zIndex,
			position: "fixed",
			top: 0,
			left: 0,
			overflow: "hidden"
		}), this.$slider.addClass("parallax-slider").one("load", function() {
			n.naturalHeight && n.naturalWidth || (n.naturalHeight = this.naturalHeight || this.height || 1, n.naturalWidth = this.naturalWidth || this.width || 1), n.aspectRatio = n.naturalWidth / n.naturalHeight, o.isSetup || o.setup(), o.sliders.push(n), o.isFresh = !1, o.requestRender()
		}), l || (this.$slider[0].src = this.imageSrc), (this.naturalHeight && this.naturalWidth || this.$slider[0].complete || r.length > 0) && this.$slider.trigger("load")
	}

	function n(s) {
		return this.each(function() {
			var n = t(this),
				a = "object" == typeof s && s;
			this == e || this == i || n.is("body") ? o.configure(a) : n.data("px.parallax") ? "object" == typeof s && t.extend(n.data("px.parallax"), a) : (a = t.extend({}, n.data(), a), n.data("px.parallax", new o(this, a))), "string" == typeof s && ("destroy" == s ? o.destroy(this) : o[s]())
		})
	}! function() {
		for(var t = 0, i = ["ms", "moz", "webkit", "o"], s = 0; s < i.length && !e.requestAnimationFrame; ++s) e.requestAnimationFrame = e[i[s] + "RequestAnimationFrame"], e.cancelAnimationFrame = e[i[s] + "CancelAnimationFrame"] || e[i[s] + "CancelRequestAnimationFrame"];
		e.requestAnimationFrame || (e.requestAnimationFrame = function(i) {
			var s = (new Date).getTime(),
				o = Math.max(0, 16 - (s - t)),
				n = e.setTimeout(function() {
					i(s + o)
				}, o);
			return t = s + o, n
		}), e.cancelAnimationFrame || (e.cancelAnimationFrame = function(t) {
			clearTimeout(t)
		})
	}(), t.extend(o.prototype, {
		speed: .2,
		bleed: 0,
		zIndex: -100,
		iosFix: !0,
		androidFix: !0,
		position: "center",
		overScrollFix: !1,
		refresh: function() {
			this.boxWidth = this.$element.outerWidth(), this.boxHeight = this.$element.outerHeight() + 2 * this.bleed, this.boxOffsetTop = this.$element.offset().top - this.bleed, this.boxOffsetLeft = this.$element.offset().left, this.boxOffsetBottom = this.boxOffsetTop + this.boxHeight;
			var t = o.winHeight,
				e = o.docHeight,
				i = Math.min(this.boxOffsetTop, e - t),
				s = Math.max(this.boxOffsetTop + this.boxHeight - t, 0),
				n = this.boxHeight + (i - s) * (1 - this.speed) | 0,
				a = (this.boxOffsetTop - i) * (1 - this.speed) | 0;
			if(n * this.aspectRatio >= this.boxWidth) {
				this.imageWidth = n * this.aspectRatio | 0, this.imageHeight = n, this.offsetBaseTop = a;
				var r = this.imageWidth - this.boxWidth;
				this.offsetLeft = "left" == this.positionX ? 0 : "right" == this.positionX ? -r : isNaN(this.positionX) ? -r / 2 | 0 : Math.max(this.positionX, -r)
			} else {
				this.imageWidth = this.boxWidth, this.imageHeight = this.boxWidth / this.aspectRatio | 0, this.offsetLeft = 0;
				var r = this.imageHeight - n;
				this.offsetBaseTop = "top" == this.positionY ? a : "bottom" == this.positionY ? a - r : isNaN(this.positionY) ? a - r / 2 | 0 : a + Math.max(this.positionY, -r)
			}
		},
		render: function() {
			var t = o.scrollTop,
				e = o.scrollLeft,
				i = this.overScrollFix ? o.overScroll : 0,
				s = t + o.winHeight;
			this.boxOffsetBottom > t && this.boxOffsetTop <= s ? (this.visibility = "visible", this.mirrorTop = this.boxOffsetTop - t, this.mirrorLeft = this.boxOffsetLeft - e, this.offsetTop = this.offsetBaseTop - this.mirrorTop * (1 - this.speed)) : this.visibility = "hidden", this.$mirror.css({
				transform: "translate3d(0px, 0px, 0px)",
				visibility: this.visibility,
				top: this.mirrorTop - i,
				left: this.mirrorLeft,
				height: this.boxHeight,
				width: this.boxWidth
			}), this.$slider.css({
				transform: "translate3d(0px, 0px, 0px)",
				position: "absolute",
				top: this.offsetTop,
				left: this.offsetLeft,
				height: this.imageHeight,
				width: this.imageWidth,
				maxWidth: "none"
			})
		}
	}), t.extend(o, {
		scrollTop: 0,
		scrollLeft: 0,
		winHeight: 0,
		winWidth: 0,
		docHeight: 1 << 30,
		docWidth: 1 << 30,
		sliders: [],
		isReady: !1,
		isFresh: !1,
		isBusy: !1,
		setup: function() {
			if(!this.isReady) {
				var s = t(i),
					n = t(e),
					a = function() {
						o.winHeight = n.height(), o.winWidth = n.width(), o.docHeight = s.height(), o.docWidth = s.width()
					},
					r = function() {
						var t = n.scrollTop(),
							e = o.docHeight - o.winHeight,
							i = o.docWidth - o.winWidth;
						o.scrollTop = Math.max(0, Math.min(e, t)), o.scrollLeft = Math.max(0, Math.min(i, n.scrollLeft())), o.overScroll = Math.max(t - e, Math.min(t, 0))
					};
				n.on("resize.px.parallax load.px.parallax", function() {
					a(), o.isFresh = !1, o.requestRender()
				}).on("scroll.px.parallax load.px.parallax", function() {
					r(), o.requestRender()
				}), a(), r(), this.isReady = !0
			}
		},
		configure: function(e) {
			"object" == typeof e && (delete e.refresh, delete e.render, t.extend(this.prototype, e))
		},
		refresh: function() {
			t.each(this.sliders, function() {
				this.refresh()
			}), this.isFresh = !0
		},
		render: function() {
			this.isFresh || this.refresh(), t.each(this.sliders, function() {
				this.render()
			})
		},
		requestRender: function() {
			var t = this;
			this.isBusy || (this.isBusy = !0, e.requestAnimationFrame(function() {
				t.render(), t.isBusy = !1
			}))
		},
		destroy: function(i) {
			var s, n = t(i).data("px.parallax");
			for(n.$mirror.remove(), s = 0; s < this.sliders.length; s += 1) this.sliders[s] == n && this.sliders.splice(s, 1);
			t(i).data("px.parallax", !1), 0 === this.sliders.length && (t(e).off("scroll.px.parallax resize.px.parallax load.px.parallax"), this.isReady = !1, o.isSetup = !1)
		}
	});
	var a = t.fn.parallax;
	t.fn.parallax = n, t.fn.parallax.Constructor = o, t.fn.parallax.noConflict = function() {
		return t.fn.parallax = a, this
	}, t(i).on("ready.px.parallax.data-api", function() {
		t('[data-parallax="scroll"]').parallax()
	})
}(jQuery, window, document), + function(t) {
	"use strict";

	function e() {
		var t = document.createElement("bootstrap"),
			e = {
				WebkitTransition: "webkitTransitionEnd",
				MozTransition: "transitionend",
				OTransition: "oTransitionEnd otransitionend",
				transition: "transitionend"
			};
		for(var i in e)
			if(void 0 !== t.style[i]) return {
				end: e[i]
			};
		return !1
	}
	t.fn.emulateTransitionEnd = function(e) {
		var i = !1,
			s = this;
		t(this).one("bsTransitionEnd", function() {
			i = !0
		});
		var o = function() {
			i || t(s).trigger(t.support.transition.end)
		};
		return setTimeout(o, e), this
	}, t(function() {
		t.support.transition = e(), t.support.transition && (t.event.special.bsTransitionEnd = {
			bindType: t.support.transition.end,
			delegateType: t.support.transition.end,
			handle: function(e) {
				if(t(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
			}
		})
	})
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		return this.each(function() {
			var i = t(this),
				o = i.data("bs.alert");
			o || i.data("bs.alert", o = new s(this)), "string" == typeof e && o[e].call(i)
		})
	}
	var i = '[data-dismiss="alert"]',
		s = function(e) {
			t(e).on("click", i, this.close)
		};
	s.VERSION = "3.3.6", s.TRANSITION_DURATION = 150, s.prototype.close = function(e) {
		function i() {
			a.detach().trigger("closed.bs.alert").remove()
		}
		var o = t(this),
			n = o.attr("data-target");
		n || (n = o.attr("href"), n = n && n.replace(/.*(?=#[^\s]*$)/, ""));
		var a = t(n);
		e && e.preventDefault(), a.length || (a = o.closest(".alert")), a.trigger(e = t.Event("close.bs.alert")), e.isDefaultPrevented() || (a.removeClass("in"), t.support.transition && a.hasClass("fade") ? a.one("bsTransitionEnd", i).emulateTransitionEnd(s.TRANSITION_DURATION) : i())
	};
	var o = t.fn.alert;
	t.fn.alert = e, t.fn.alert.Constructor = s, t.fn.alert.noConflict = function() {
		return t.fn.alert = o, this
	}, t(document).on("click.bs.alert.data-api", i, s.prototype.close)
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		return this.each(function() {
			var s = t(this),
				o = s.data("bs.button"),
				n = "object" == typeof e && e;
			o || s.data("bs.button", o = new i(this, n)), "toggle" == e ? o.toggle() : e && o.setState(e)
		})
	}
	var i = function(e, s) {
		this.$element = t(e), this.options = t.extend({}, i.DEFAULTS, s), this.isLoading = !1
	};
	i.VERSION = "3.3.6", i.DEFAULTS = {
		loadingText: "loading..."
	}, i.prototype.setState = function(e) {
		var i = "disabled",
			s = this.$element,
			o = s.is("input") ? "val" : "html",
			n = s.data();
		e += "Text", null == n.resetText && s.data("resetText", s[o]()), setTimeout(t.proxy(function() {
			s[o](null == n[e] ? this.options[e] : n[e]), "loadingText" == e ? (this.isLoading = !0, s.addClass(i).attr(i, i)) : this.isLoading && (this.isLoading = !1, s.removeClass(i).removeAttr(i))
		}, this), 0)
	}, i.prototype.toggle = function() {
		var t = !0,
			e = this.$element.closest('[data-toggle="buttons"]');
		if(e.length) {
			var i = this.$element.find("input");
			"radio" == i.prop("type") ? (i.prop("checked") && (t = !1), e.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == i.prop("type") && (i.prop("checked") !== this.$element.hasClass("active") && (t = !1), this.$element.toggleClass("active")), i.prop("checked", this.$element.hasClass("active")), t && i.trigger("change")
		} else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
	};
	var s = t.fn.button;
	t.fn.button = e, t.fn.button.Constructor = i, t.fn.button.noConflict = function() {
		return t.fn.button = s, this
	}, t(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(i) {
		var s = t(i.target);
		s.hasClass("btn") || (s = s.closest(".btn")), e.call(s, "toggle"), t(i.target).is('input[type="radio"]') || t(i.target).is('input[type="checkbox"]') || i.preventDefault()
	}).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(e) {
		t(e.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(e.type))
	})
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		return this.each(function() {
			var s = t(this),
				o = s.data("bs.carousel"),
				n = t.extend({}, i.DEFAULTS, s.data(), "object" == typeof e && e),
				a = "string" == typeof e ? e : n.slide;
			o || s.data("bs.carousel", o = new i(this, n)), "number" == typeof e ? o.to(e) : a ? o[a]() : n.interval && o.pause().cycle()
		})
	}
	var i = function(e, i) {
		this.$element = t(e), this.$indicators = this.$element.find(".carousel-indicators"), this.options = i, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", t.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", t.proxy(this.pause, this)).on("mouseleave.bs.carousel", t.proxy(this.cycle, this))
	};
	i.VERSION = "3.3.6", i.TRANSITION_DURATION = 600, i.DEFAULTS = {
		interval: 5e3,
		pause: "hover",
		wrap: !0,
		keyboard: !0
	}, i.prototype.keydown = function(t) {
		if(!/input|textarea/i.test(t.target.tagName)) {
			switch(t.which) {
				case 37:
					this.prev();
					break;
				case 39:
					this.next();
					break;
				default:
					return
			}
			t.preventDefault()
		}
	}, i.prototype.cycle = function(e) {
		return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(t.proxy(this.next, this), this.options.interval)), this
	}, i.prototype.getItemIndex = function(t) {
		return this.$items = t.parent().children(".item"), this.$items.index(t || this.$active)
	}, i.prototype.getItemForDirection = function(t, e) {
		var i = this.getItemIndex(e),
			s = "prev" == t && 0 === i || "next" == t && i == this.$items.length - 1;
		if(s && !this.options.wrap) return e;
		var o = "prev" == t ? -1 : 1,
			n = (i + o) % this.$items.length;
		return this.$items.eq(n)
	}, i.prototype.to = function(t) {
		var e = this,
			i = this.getItemIndex(this.$active = this.$element.find(".item.active"));
		if(!(t > this.$items.length - 1 || t < 0)) return this.sliding ? this.$element.one("slid.bs.carousel", function() {
			e.to(t)
		}) : i == t ? this.pause().cycle() : this.slide(t > i ? "next" : "prev", this.$items.eq(t))
	}, i.prototype.pause = function(e) {
		return e || (this.paused = !0), this.$element.find(".next, .prev").length && t.support.transition && (this.$element.trigger(t.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
	}, i.prototype.next = function() {
		if(!this.sliding) return this.slide("next")
	}, i.prototype.prev = function() {
		if(!this.sliding) return this.slide("prev")
	}, i.prototype.slide = function(e, s) {
		var o = this.$element.find(".item.active"),
			n = s || this.getItemForDirection(e, o),
			a = this.interval,
			r = "next" == e ? "left" : "right",
			l = this;
		if(n.hasClass("active")) return this.sliding = !1;
		var h = n[0],
			d = t.Event("slide.bs.carousel", {
				relatedTarget: h,
				direction: r
			});
		if(this.$element.trigger(d), !d.isDefaultPrevented()) {
			if(this.sliding = !0, a && this.pause(), this.$indicators.length) {
				this.$indicators.find(".active").removeClass("active");
				var c = t(this.$indicators.children()[this.getItemIndex(n)]);
				c && c.addClass("active")
			}
			var p = t.Event("slid.bs.carousel", {
				relatedTarget: h,
				direction: r
			});
			return t.support.transition && this.$element.hasClass("slide") ? (n.addClass(e), n[0].offsetWidth, o.addClass(r), n.addClass(r), o.one("bsTransitionEnd", function() {
				n.removeClass([e, r].join(" ")).addClass("active"), o.removeClass(["active", r].join(" ")), l.sliding = !1, setTimeout(function() {
					l.$element.trigger(p)
				}, 0)
			}).emulateTransitionEnd(i.TRANSITION_DURATION)) : (o.removeClass("active"), n.addClass("active"), this.sliding = !1, this.$element.trigger(p)), a && this.cycle(), this
		}
	};
	var s = t.fn.carousel;
	t.fn.carousel = e, t.fn.carousel.Constructor = i, t.fn.carousel.noConflict = function() {
		return t.fn.carousel = s, this
	};
	var o = function(i) {
		var s, o = t(this),
			n = t(o.attr("data-target") || (s = o.attr("href")) && s.replace(/.*(?=#[^\s]+$)/, ""));
		if(n.hasClass("carousel")) {
			var a = t.extend({}, n.data(), o.data()),
				r = o.attr("data-slide-to");
			r && (a.interval = !1), e.call(n, a), r && n.data("bs.carousel").to(r), i.preventDefault()
		}
	};
	t(document).on("click.bs.carousel.data-api", "[data-slide]", o).on("click.bs.carousel.data-api", "[data-slide-to]", o), t(window).on("load", function() {
		t('[data-ride="carousel"]').each(function() {
			var i = t(this);
			e.call(i, i.data())
		})
	})
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		var i, s = e.attr("data-target") || (i = e.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "");
		return t(s)
	}

	function i(e) {
		return this.each(function() {
			var i = t(this),
				o = i.data("bs.collapse"),
				n = t.extend({}, s.DEFAULTS, i.data(), "object" == typeof e && e);
			!o && n.toggle && /show|hide/.test(e) && (n.toggle = !1), o || i.data("bs.collapse", o = new s(this, n)), "string" == typeof e && o[e]()
		})
	}
	var s = function(e, i) {
		this.$element = t(e), this.options = t.extend({}, s.DEFAULTS, i), this.$trigger = t('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
	};
	s.VERSION = "3.3.6", s.TRANSITION_DURATION = 350, s.DEFAULTS = {
		toggle: !0
	}, s.prototype.dimension = function() {
		var t = this.$element.hasClass("width");
		return t ? "width" : "height"
	}, s.prototype.show = function() {
		if(!this.transitioning && !this.$element.hasClass("in")) {
			var e, o = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
			if(!(o && o.length && (e = o.data("bs.collapse"), e && e.transitioning))) {
				var n = t.Event("show.bs.collapse");
				if(this.$element.trigger(n), !n.isDefaultPrevented()) {
					o && o.length && (i.call(o, "hide"), e || o.data("bs.collapse", null));
					var a = this.dimension();
					this.$element.removeClass("collapse").addClass("collapsing")[a](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
					var r = function() {
						this.$element.removeClass("collapsing").addClass("collapse in")[a](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
					};
					if(!t.support.transition) return r.call(this);
					var l = t.camelCase(["scroll", a].join("-"));
					this.$element.one("bsTransitionEnd", t.proxy(r, this)).emulateTransitionEnd(s.TRANSITION_DURATION)[a](this.$element[0][l])
				}
			}
		}
	}, s.prototype.hide = function() {
		if(!this.transitioning && this.$element.hasClass("in")) {
			var e = t.Event("hide.bs.collapse");
			if(this.$element.trigger(e), !e.isDefaultPrevented()) {
				var i = this.dimension();
				this.$element[i](this.$element[i]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
				var o = function() {
					this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
				};
				return t.support.transition ? void this.$element[i](0).one("bsTransitionEnd", t.proxy(o, this)).emulateTransitionEnd(s.TRANSITION_DURATION) : o.call(this)
			}
		}
	}, s.prototype.toggle = function() {
		this[this.$element.hasClass("in") ? "hide" : "show"]()
	}, s.prototype.getParent = function() {
		return t(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(t.proxy(function(i, s) {
			var o = t(s);
			this.addAriaAndCollapsedClass(e(o), o)
		}, this)).end()
	}, s.prototype.addAriaAndCollapsedClass = function(t, e) {
		var i = t.hasClass("in");
		t.attr("aria-expanded", i), e.toggleClass("collapsed", !i).attr("aria-expanded", i)
	};
	var o = t.fn.collapse;
	t.fn.collapse = i, t.fn.collapse.Constructor = s, t.fn.collapse.noConflict = function() {
		return t.fn.collapse = o, this
	}, t(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(s) {
		var o = t(this);
		o.attr("data-target") || s.preventDefault();
		var n = e(o),
			a = n.data("bs.collapse"),
			r = a ? "toggle" : o.data();
		i.call(n, r)
	})
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		var i = e.attr("data-target");
		i || (i = e.attr("href"), i = i && /#[A-Za-z]/.test(i) && i.replace(/.*(?=#[^\s]*$)/, ""));
		var s = i && t(i);
		return s && s.length ? s : e.parent()
	}

	function i(i) {
		i && 3 === i.which || (t(o).remove(), t(n).each(function() {
			var s = t(this),
				o = e(s),
				n = {
					relatedTarget: this
				};
			o.hasClass("open") && (i && "click" == i.type && /input|textarea/i.test(i.target.tagName) && t.contains(o[0], i.target) || (o.trigger(i = t.Event("hide.bs.dropdown", n)), i.isDefaultPrevented() || (s.attr("aria-expanded", "false"), o.removeClass("open").trigger(t.Event("hidden.bs.dropdown", n)))))
		}))
	}

	function s(e) {
		return this.each(function() {
			var i = t(this),
				s = i.data("bs.dropdown");
			s || i.data("bs.dropdown", s = new a(this)), "string" == typeof e && s[e].call(i)
		})
	}
	var o = ".dropdown-backdrop",
		n = '[data-toggle="dropdown"]',
		a = function(e) {
			t(e).on("click.bs.dropdown", this.toggle)
		};
	a.VERSION = "3.3.6", a.prototype.toggle = function(s) {
		var o = t(this);
		if(!o.is(".disabled, :disabled")) {
			var n = e(o),
				a = n.hasClass("open");
			if(i(), !a) {
				"ontouchstart" in document.documentElement && !n.closest(".navbar-nav").length && t(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(t(this)).on("click", i);
				var r = {
					relatedTarget: this
				};
				if(n.trigger(s = t.Event("show.bs.dropdown", r)), s.isDefaultPrevented()) return;
				o.trigger("focus").attr("aria-expanded", "true"), n.toggleClass("open").trigger(t.Event("shown.bs.dropdown", r))
			}
			return !1
		}
	}, a.prototype.keydown = function(i) {
		if(/(38|40|27|32)/.test(i.which) && !/input|textarea/i.test(i.target.tagName)) {
			var s = t(this);
			if(i.preventDefault(), i.stopPropagation(), !s.is(".disabled, :disabled")) {
				var o = e(s),
					a = o.hasClass("open");
				if(!a && 27 != i.which || a && 27 == i.which) return 27 == i.which && o.find(n).trigger("focus"), s.trigger("click");
				var r = " li:not(.disabled):visible a",
					l = o.find(".dropdown-menu" + r);
				if(l.length) {
					var h = l.index(i.target);
					38 == i.which && h > 0 && h--, 40 == i.which && h < l.length - 1 && h++, ~h || (h = 0), l.eq(h).trigger("focus")
				}
			}
		}
	};
	var r = t.fn.dropdown;
	t.fn.dropdown = s, t.fn.dropdown.Constructor = a, t.fn.dropdown.noConflict = function() {
		return t.fn.dropdown = r, this
	}, t(document).on("click.bs.dropdown.data-api", i).on("click.bs.dropdown.data-api", ".dropdown form", function(t) {
		t.stopPropagation()
	}).on("click.bs.dropdown.data-api", n, a.prototype.toggle).on("keydown.bs.dropdown.data-api", n, a.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", a.prototype.keydown)
}(jQuery), + function(t) {
	"use strict";

	function e(e, s) {
		return this.each(function() {
			var o = t(this),
				n = o.data("bs.modal"),
				a = t.extend({}, i.DEFAULTS, o.data(), "object" == typeof e && e);
			n || o.data("bs.modal", n = new i(this, a)), "string" == typeof e ? n[e](s) : a.show && n.show(s)
		})
	}
	var i = function(e, i) {
		this.options = i, this.$body = t(document.body), this.$element = t(e), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
			this.$element.trigger("loaded.bs.modal")
		}, this))
	};
	i.VERSION = "3.3.6", i.TRANSITION_DURATION = 300, i.BACKDROP_TRANSITION_DURATION = 150, i.DEFAULTS = {
		backdrop: !0,
		keyboard: !0,
		show: !0
	}, i.prototype.toggle = function(t) {
		return this.isShown ? this.hide() : this.show(t)
	}, i.prototype.show = function(e) {
		var s = this,
			o = t.Event("show.bs.modal", {
				relatedTarget: e
			});
		this.$element.trigger(o), this.isShown || o.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
			s.$element.one("mouseup.dismiss.bs.modal", function(e) {
				t(e.target).is(s.$element) && (s.ignoreBackdropClick = !0)
			})
		}), this.backdrop(function() {
			var o = t.support.transition && s.$element.hasClass("fade");
			s.$element.parent().length || s.$element.appendTo(s.$body), s.$element.show().scrollTop(0), s.adjustDialog(), o && s.$element[0].offsetWidth, s.$element.addClass("in"), s.enforceFocus();
			var n = t.Event("shown.bs.modal", {
				relatedTarget: e
			});
			o ? s.$dialog.one("bsTransitionEnd", function() {
				s.$element.trigger("focus").trigger(n)
			}).emulateTransitionEnd(i.TRANSITION_DURATION) : s.$element.trigger("focus").trigger(n)
		}))
	}, i.prototype.hide = function(e) {
		e && e.preventDefault(), e = t.Event("hide.bs.modal"), this.$element.trigger(e), this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), t(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : this.hideModal())
	}, i.prototype.enforceFocus = function() {
		t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t) {
			this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")
		}, this))
	}, i.prototype.escape = function() {
		this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", t.proxy(function(t) {
			27 == t.which && this.hide()
		}, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
	}, i.prototype.resize = function() {
		this.isShown ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this)) : t(window).off("resize.bs.modal")
	}, i.prototype.hideModal = function() {
		var t = this;
		this.$element.hide(), this.backdrop(function() {
			t.$body.removeClass("modal-open"), t.resetAdjustments(), t.resetScrollbar(), t.$element.trigger("hidden.bs.modal")
		})
	}, i.prototype.removeBackdrop = function() {
		this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
	}, i.prototype.backdrop = function(e) {
		var s = this,
			o = this.$element.hasClass("fade") ? "fade" : "";
		if(this.isShown && this.options.backdrop) {
			var n = t.support.transition && o;
			if(this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + o).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", t.proxy(function(t) {
					return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
				}, this)), n && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e) return;
			n ? this.$backdrop.one("bsTransitionEnd", e).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : e()
		} else if(!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass("in");
			var a = function() {
				s.removeBackdrop(), e && e()
			};
			t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", a).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : a()
		} else e && e()
	}, i.prototype.handleUpdate = function() {
		this.adjustDialog()
	}, i.prototype.adjustDialog = function() {
		var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
		this.$element.css({
			paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
			paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
		})
	}, i.prototype.resetAdjustments = function() {
		this.$element.css({
			paddingLeft: "",
			paddingRight: ""
		})
	}, i.prototype.checkScrollbar = function() {
		var t = window.innerWidth;
		if(!t) {
			var e = document.documentElement.getBoundingClientRect();
			t = e.right - Math.abs(e.left)
		}
		this.bodyIsOverflowing = document.body.clientWidth < t, this.scrollbarWidth = this.measureScrollbar()
	}, i.prototype.setScrollbar = function() {
		var t = parseInt(this.$body.css("padding-right") || 0, 10);
		this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", t + this.scrollbarWidth)
	}, i.prototype.resetScrollbar = function() {
		this.$body.css("padding-right", this.originalBodyPad)
	}, i.prototype.measureScrollbar = function() {
		var t = document.createElement("div");
		t.className = "modal-scrollbar-measure", this.$body.append(t);
		var e = t.offsetWidth - t.clientWidth;
		return this.$body[0].removeChild(t), e
	};
	var s = t.fn.modal;
	t.fn.modal = e, t.fn.modal.Constructor = i, t.fn.modal.noConflict = function() {
		return t.fn.modal = s, this
	}, t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(i) {
		var s = t(this),
			o = s.attr("href"),
			n = t(s.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, "")),
			a = n.data("bs.modal") ? "toggle" : t.extend({
				remote: !/#/.test(o) && o
			}, n.data(), s.data());
		s.is("a") && i.preventDefault(), n.one("show.bs.modal", function(t) {
			t.isDefaultPrevented() || n.one("hidden.bs.modal", function() {
				s.is(":visible") && s.trigger("focus")
			})
		}), e.call(n, a, this)
	})
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		return this.each(function() {
			var s = t(this),
				o = s.data("bs.tooltip"),
				n = "object" == typeof e && e;
			!o && /destroy|hide/.test(e) || (o || s.data("bs.tooltip", o = new i(this, n)), "string" == typeof e && o[e]())
		})
	}
	var i = function(t, e) {
		this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", t, e)
	};
	i.VERSION = "3.3.6", i.TRANSITION_DURATION = 150, i.DEFAULTS = {
		animation: !0,
		placement: "top",
		selector: !1,
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		trigger: "hover focus",
		title: "",
		delay: 0,
		html: !1,
		container: !1,
		viewport: {
			selector: "body",
			padding: 0
		}
	}, i.prototype.init = function(e, i, s) {
		if(this.enabled = !0, this.type = e, this.$element = t(i), this.options = this.getOptions(s), this.$viewport = this.options.viewport && t(t.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
				click: !1,
				hover: !1,
				focus: !1
			}, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
		for(var o = this.options.trigger.split(" "), n = o.length; n--;) {
			var a = o[n];
			if("click" == a) this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this));
			else if("manual" != a) {
				var r = "hover" == a ? "mouseenter" : "focusin",
					l = "hover" == a ? "mouseleave" : "focusout";
				this.$element.on(r + "." + this.type, this.options.selector, t.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, t.proxy(this.leave, this))
			}
		}
		this.options.selector ? this._options = t.extend({}, this.options, {
			trigger: "manual",
			selector: ""
		}) : this.fixTitle()
	}, i.prototype.getDefaults = function() {
		return i.DEFAULTS
	}, i.prototype.getOptions = function(e) {
		return e = t.extend({}, this.getDefaults(), this.$element.data(), e), e.delay && "number" == typeof e.delay && (e.delay = {
			show: e.delay,
			hide: e.delay
		}), e
	}, i.prototype.getDelegateOptions = function() {
		var e = {},
			i = this.getDefaults();
		return this._options && t.each(this._options, function(t, s) {
			i[t] != s && (e[t] = s)
		}), e
	}, i.prototype.enter = function(e) {
		var i = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
		return i || (i = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, i)), e instanceof t.Event && (i.inState["focusin" == e.type ? "focus" : "hover"] = !0), i.tip().hasClass("in") || "in" == i.hoverState ? void(i.hoverState = "in") : (clearTimeout(i.timeout), i.hoverState = "in", i.options.delay && i.options.delay.show ? void(i.timeout = setTimeout(function() {
			"in" == i.hoverState && i.show()
		}, i.options.delay.show)) : i.show())
	}, i.prototype.isInStateTrue = function() {
		for(var t in this.inState)
			if(this.inState[t]) return !0;
		return !1
	}, i.prototype.leave = function(e) {
		var i = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
		if(i || (i = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, i)), e instanceof t.Event && (i.inState["focusout" == e.type ? "focus" : "hover"] = !1), !i.isInStateTrue()) return clearTimeout(i.timeout), i.hoverState = "out", i.options.delay && i.options.delay.hide ? void(i.timeout = setTimeout(function() {
			"out" == i.hoverState && i.hide()
		}, i.options.delay.hide)) : i.hide()
	}, i.prototype.show = function() {
		var e = t.Event("show.bs." + this.type);
		if(this.hasContent() && this.enabled) {
			this.$element.trigger(e);
			var s = t.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
			if(e.isDefaultPrevented() || !s) return;
			var o = this,
				n = this.tip(),
				a = this.getUID(this.type);
			this.setContent(), n.attr("id", a), this.$element.attr("aria-describedby", a), this.options.animation && n.addClass("fade");
			var r = "function" == typeof this.options.placement ? this.options.placement.call(this, n[0], this.$element[0]) : this.options.placement,
				l = /\s?auto?\s?/i,
				h = l.test(r);
			h && (r = r.replace(l, "") || "top"), n.detach().css({
				top: 0,
				left: 0,
				display: "block"
			}).addClass(r).data("bs." + this.type, this), this.options.container ? n.appendTo(this.options.container) : n.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
			var d = this.getPosition(),
				c = n[0].offsetWidth,
				p = n[0].offsetHeight;
			if(h) {
				var u = r,
					f = this.getPosition(this.$viewport);
				r = "bottom" == r && d.bottom + p > f.bottom ? "top" : "top" == r && d.top - p < f.top ? "bottom" : "right" == r && d.right + c > f.width ? "left" : "left" == r && d.left - c < f.left ? "right" : r, n.removeClass(u).addClass(r)
			}
			var g = this.getCalculatedOffset(r, d, c, p);
			this.applyPlacement(g, r);
			var m = function() {
				var t = o.hoverState;
				o.$element.trigger("shown.bs." + o.type), o.hoverState = null, "out" == t && o.leave(o)
			};
			t.support.transition && this.$tip.hasClass("fade") ? n.one("bsTransitionEnd", m).emulateTransitionEnd(i.TRANSITION_DURATION) : m()
		}
	}, i.prototype.applyPlacement = function(e, i) {
		var s = this.tip(),
			o = s[0].offsetWidth,
			n = s[0].offsetHeight,
			a = parseInt(s.css("margin-top"), 10),
			r = parseInt(s.css("margin-left"), 10);
		isNaN(a) && (a = 0), isNaN(r) && (r = 0), e.top += a, e.left += r, t.offset.setOffset(s[0], t.extend({
			using: function(t) {
				s.css({
					top: Math.round(t.top),
					left: Math.round(t.left)
				})
			}
		}, e), 0), s.addClass("in");
		var l = s[0].offsetWidth,
			h = s[0].offsetHeight;
		"top" == i && h != n && (e.top = e.top + n - h);
		var d = this.getViewportAdjustedDelta(i, e, l, h);
		d.left ? e.left += d.left : e.top += d.top;
		var c = /top|bottom/.test(i),
			p = c ? 2 * d.left - o + l : 2 * d.top - n + h,
			u = c ? "offsetWidth" : "offsetHeight";
		s.offset(e), this.replaceArrow(p, s[0][u], c)
	}, i.prototype.replaceArrow = function(t, e, i) {
		this.arrow().css(i ? "left" : "top", 50 * (1 - t / e) + "%").css(i ? "top" : "left", "")
	}, i.prototype.setContent = function() {
		var t = this.tip(),
			e = this.getTitle();
		t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e), t.removeClass("fade in top bottom left right")
	}, i.prototype.hide = function(e) {
		function s() {
			"in" != o.hoverState && n.detach(), o.$element.removeAttr("aria-describedby").trigger("hidden.bs." + o.type), e && e()
		}
		var o = this,
			n = t(this.$tip),
			a = t.Event("hide.bs." + this.type);
		if(this.$element.trigger(a), !a.isDefaultPrevented()) return n.removeClass("in"), t.support.transition && n.hasClass("fade") ? n.one("bsTransitionEnd", s).emulateTransitionEnd(i.TRANSITION_DURATION) : s(), this.hoverState = null, this
	}, i.prototype.fixTitle = function() {
		var t = this.$element;
		(t.attr("title") || "string" != typeof t.attr("data-original-title")) && t.attr("data-original-title", t.attr("title") || "").attr("title", "")
	}, i.prototype.hasContent = function() {
		return this.getTitle()
	}, i.prototype.getPosition = function(e) {
		e = e || this.$element;
		var i = e[0],
			s = "BODY" == i.tagName,
			o = i.getBoundingClientRect();
		null == o.width && (o = t.extend({}, o, {
			width: o.right - o.left,
			height: o.bottom - o.top
		}));
		var n = s ? {
				top: 0,
				left: 0
			} : e.offset(),
			a = {
				scroll: s ? document.documentElement.scrollTop || document.body.scrollTop : e.scrollTop()
			},
			r = s ? {
				width: t(window).width(),
				height: t(window).height()
			} : null;
		return t.extend({}, o, a, r, n)
	}, i.prototype.getCalculatedOffset = function(t, e, i, s) {
		return "bottom" == t ? {
			top: e.top + e.height,
			left: e.left + e.width / 2 - i / 2
		} : "top" == t ? {
			top: e.top - s,
			left: e.left + e.width / 2 - i / 2
		} : "left" == t ? {
			top: e.top + e.height / 2 - s / 2,
			left: e.left - i
		} : {
			top: e.top + e.height / 2 - s / 2,
			left: e.left + e.width
		}
	}, i.prototype.getViewportAdjustedDelta = function(t, e, i, s) {
		var o = {
			top: 0,
			left: 0
		};
		if(!this.$viewport) return o;
		var n = this.options.viewport && this.options.viewport.padding || 0,
			a = this.getPosition(this.$viewport);
		if(/right|left/.test(t)) {
			var r = e.top - n - a.scroll,
				l = e.top + n - a.scroll + s;
			r < a.top ? o.top = a.top - r : l > a.top + a.height && (o.top = a.top + a.height - l)
		} else {
			var h = e.left - n,
				d = e.left + n + i;
			h < a.left ? o.left = a.left - h : d > a.right && (o.left = a.left + a.width - d)
		}
		return o
	}, i.prototype.getTitle = function() {
		var t, e = this.$element,
			i = this.options;
		return t = e.attr("data-original-title") || ("function" == typeof i.title ? i.title.call(e[0]) : i.title)
	}, i.prototype.getUID = function(t) {
		do t += ~~(1e6 * Math.random()); while (document.getElementById(t));
		return t
	}, i.prototype.tip = function() {
		if(!this.$tip && (this.$tip = t(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
		return this.$tip
	}, i.prototype.arrow = function() {
		return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
	}, i.prototype.enable = function() {
		this.enabled = !0
	}, i.prototype.disable = function() {
		this.enabled = !1
	}, i.prototype.toggleEnabled = function() {
		this.enabled = !this.enabled
	}, i.prototype.toggle = function(e) {
		var i = this;
		e && (i = t(e.currentTarget).data("bs." + this.type), i || (i = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, i))), e ? (i.inState.click = !i.inState.click, i.isInStateTrue() ? i.enter(i) : i.leave(i)) : i.tip().hasClass("in") ? i.leave(i) : i.enter(i)
	}, i.prototype.destroy = function() {
		var t = this;
		clearTimeout(this.timeout), this.hide(function() {
			t.$element.off("." + t.type).removeData("bs." + t.type), t.$tip && t.$tip.detach(), t.$tip = null, t.$arrow = null, t.$viewport = null
		})
	};
	var s = t.fn.tooltip;
	t.fn.tooltip = e, t.fn.tooltip.Constructor = i, t.fn.tooltip.noConflict = function() {
		return t.fn.tooltip = s, this
	}
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		return this.each(function() {
			var s = t(this),
				o = s.data("bs.popover"),
				n = "object" == typeof e && e;
			!o && /destroy|hide/.test(e) || (o || s.data("bs.popover", o = new i(this, n)), "string" == typeof e && o[e]())
		})
	}
	var i = function(t, e) {
		this.init("popover", t, e)
	};
	if(!t.fn.tooltip) throw new Error("Popover requires tooltip.js");
	i.VERSION = "3.3.6", i.DEFAULTS = t.extend({}, t.fn.tooltip.Constructor.DEFAULTS, {
		placement: "right",
		trigger: "click",
		content: "",
		template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	}), i.prototype = t.extend({}, t.fn.tooltip.Constructor.prototype), i.prototype.constructor = i, i.prototype.getDefaults = function() {
		return i.DEFAULTS
	}, i.prototype.setContent = function() {
		var t = this.tip(),
			e = this.getTitle(),
			i = this.getContent();
		t.find(".popover-title")[this.options.html ? "html" : "text"](e), t.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof i ? "html" : "append" : "text"](i), t.removeClass("fade top bottom left right in"), t.find(".popover-title").html() || t.find(".popover-title").hide()
	}, i.prototype.hasContent = function() {
		return this.getTitle() || this.getContent()
	}, i.prototype.getContent = function() {
		var t = this.$element,
			e = this.options;
		return t.attr("data-content") || ("function" == typeof e.content ? e.content.call(t[0]) : e.content)
	}, i.prototype.arrow = function() {
		return this.$arrow = this.$arrow || this.tip().find(".arrow")
	};
	var s = t.fn.popover;
	t.fn.popover = e, t.fn.popover.Constructor = i, t.fn.popover.noConflict = function() {
		return t.fn.popover = s, this
	}
}(jQuery), + function(t) {
	"use strict";

	function e(i, s) {
		this.$body = t(document.body), this.$scrollElement = t(t(i).is(document.body) ? window : i), this.options = t.extend({}, e.DEFAULTS, s), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", t.proxy(this.process, this)), this.refresh(), this.process()
	}

	function i(i) {
		return this.each(function() {
			var s = t(this),
				o = s.data("bs.scrollspy"),
				n = "object" == typeof i && i;
			o || s.data("bs.scrollspy", o = new e(this, n)), "string" == typeof i && o[i]()
		})
	}
	e.VERSION = "3.3.6", e.DEFAULTS = {
		offset: 10
	}, e.prototype.getScrollHeight = function() {
		return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
	}, e.prototype.refresh = function() {
		var e = this,
			i = "offset",
			s = 0;
		this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), t.isWindow(this.$scrollElement[0]) || (i = "position", s = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function() {
			var e = t(this),
				o = e.data("target") || e.attr("href"),
				n = /^#./.test(o) && t(o);
			return n && n.length && n.is(":visible") && [
				[n[i]().top + s, o]
			] || null
		}).sort(function(t, e) {
			return t[0] - e[0]
		}).each(function() {
			e.offsets.push(this[0]), e.targets.push(this[1])
		})
	}, e.prototype.process = function() {
		var t, e = this.$scrollElement.scrollTop() + this.options.offset,
			i = this.getScrollHeight(),
			s = this.options.offset + i - this.$scrollElement.height(),
			o = this.offsets,
			n = this.targets,
			a = this.activeTarget;
		if(this.scrollHeight != i && this.refresh(), e >= s) return a != (t = n[n.length - 1]) && this.activate(t);
		if(a && e < o[0]) return this.activeTarget = null, this.clear();
		for(t = o.length; t--;) a != n[t] && e >= o[t] && (void 0 === o[t + 1] || e < o[t + 1]) && this.activate(n[t])
	}, e.prototype.activate = function(e) {
		this.activeTarget = e, this.clear();
		var i = this.selector + '[data-target="' + e + '"],' + this.selector + '[href="' + e + '"]',
			s = t(i).parents("li").addClass("active");
		s.parent(".dropdown-menu").length && (s = s.closest("li.dropdown").addClass("active")), s.trigger("activate.bs.scrollspy")
	}, e.prototype.clear = function() {
		t(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
	};
	var s = t.fn.scrollspy;
	t.fn.scrollspy = i, t.fn.scrollspy.Constructor = e, t.fn.scrollspy.noConflict = function() {
		return t.fn.scrollspy = s, this
	}, t(window).on("load.bs.scrollspy.data-api", function() {
		t('[data-spy="scroll"]').each(function() {
			var e = t(this);
			i.call(e, e.data())
		})
	})
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		return this.each(function() {
			var s = t(this),
				o = s.data("bs.tab");
			o || s.data("bs.tab", o = new i(this)), "string" == typeof e && o[e]()
		})
	}
	var i = function(e) {
		this.element = t(e)
	};
	i.VERSION = "3.3.6", i.TRANSITION_DURATION = 150, i.prototype.show = function() {
		var e = this.element,
			i = e.closest("ul:not(.dropdown-menu)"),
			s = e.data("target");
		if(s || (s = e.attr("href"), s = s && s.replace(/.*(?=#[^\s]*$)/, "")), !e.parent("li").hasClass("active")) {
			var o = i.find(".active:last a"),
				n = t.Event("hide.bs.tab", {
					relatedTarget: e[0]
				}),
				a = t.Event("show.bs.tab", {
					relatedTarget: o[0]
				});
			if(o.trigger(n), e.trigger(a), !a.isDefaultPrevented() && !n.isDefaultPrevented()) {
				var r = t(s);
				this.activate(e.closest("li"), i), this.activate(r, r.parent(), function() {
					o.trigger({
						type: "hidden.bs.tab",
						relatedTarget: e[0]
					}), e.trigger({
						type: "shown.bs.tab",
						relatedTarget: o[0]
					})
				})
			}
		}
	}, i.prototype.activate = function(e, s, o) {
		function n() {
			a.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), r ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"), e.parent(".dropdown-menu").length && e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), o && o()
		}
		var a = s.find("> .active"),
			r = o && t.support.transition && (a.length && a.hasClass("fade") || !!s.find("> .fade").length);
		a.length && r ? a.one("bsTransitionEnd", n).emulateTransitionEnd(i.TRANSITION_DURATION) : n(), a.removeClass("in")
	};
	var s = t.fn.tab;
	t.fn.tab = e, t.fn.tab.Constructor = i, t.fn.tab.noConflict = function() {
		return t.fn.tab = s, this
	};
	var o = function(i) {
		i.preventDefault(), e.call(t(this), "show")
	};
	t(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', o).on("click.bs.tab.data-api", '[data-toggle="pill"]', o)
}(jQuery), + function(t) {
	"use strict";

	function e(e) {
		return this.each(function() {
			var s = t(this),
				o = s.data("bs.affix"),
				n = "object" == typeof e && e;
			o || s.data("bs.affix", o = new i(this, n)), "string" == typeof e && o[e]()
		})
	}
	var i = function(e, s) {
		this.options = t.extend({}, i.DEFAULTS, s), this.$target = t(this.options.target).on("scroll.bs.affix.data-api", t.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", t.proxy(this.checkPositionWithEventLoop, this)), this.$element = t(e), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
	};
	i.VERSION = "3.3.6", i.RESET = "affix affix-top affix-bottom", i.DEFAULTS = {
		offset: 0,
		target: window
	}, i.prototype.getState = function(t, e, i, s) {
		var o = this.$target.scrollTop(),
			n = this.$element.offset(),
			a = this.$target.height();
		if(null != i && "top" == this.affixed) return o < i && "top";
		if("bottom" == this.affixed) return null != i ? !(o + this.unpin <= n.top) && "bottom" : !(o + a <= t - s) && "bottom";
		var r = null == this.affixed,
			l = r ? o : n.top,
			h = r ? a : e;
		return null != i && o <= i ? "top" : null != s && l + h >= t - s && "bottom"
	}, i.prototype.getPinnedOffset = function() {
		if(this.pinnedOffset) return this.pinnedOffset;
		this.$element.removeClass(i.RESET).addClass("affix");
		var t = this.$target.scrollTop(),
			e = this.$element.offset();
		return this.pinnedOffset = e.top - t
	}, i.prototype.checkPositionWithEventLoop = function() {
		setTimeout(t.proxy(this.checkPosition, this), 1)
	}, i.prototype.checkPosition = function() {
		if(this.$element.is(":visible")) {
			var e = this.$element.height(),
				s = this.options.offset,
				o = s.top,
				n = s.bottom,
				a = Math.max(t(document).height(), t(document.body).height());
			"object" != typeof s && (n = o = s), "function" == typeof o && (o = s.top(this.$element)), "function" == typeof n && (n = s.bottom(this.$element));
			var r = this.getState(a, e, o, n);
			if(this.affixed != r) {
				null != this.unpin && this.$element.css("top", "");
				var l = "affix" + (r ? "-" + r : ""),
					h = t.Event(l + ".bs.affix");
				if(this.$element.trigger(h), h.isDefaultPrevented()) return;
				this.affixed = r, this.unpin = "bottom" == r ? this.getPinnedOffset() : null, this.$element.removeClass(i.RESET).addClass(l).trigger(l.replace("affix", "affixed") + ".bs.affix")
			}
			"bottom" == r && this.$element.offset({
				top: a - e - n
			})
		}
	};
	var s = t.fn.affix;
	t.fn.affix = e, t.fn.affix.Constructor = i, t.fn.affix.noConflict = function() {
		return t.fn.affix = s, this
	}, t(window).on("load", function() {
		t('[data-spy="affix"]').each(function() {
			var i = t(this),
				s = i.data();
			s.offset = s.offset || {}, null != s.offsetBottom && (s.offset.bottom = s.offsetBottom), null != s.offsetTop && (s.offset.top = s.offsetTop), e.call(i, s)
		})
	})
}(jQuery),
function(t) {
	var e = {
			common: {
				init: function() {},
				finalize: function() {
					function e(e, i, s) {
						var o = document,
							n = (o.documentElement, o.getElementsByTagName("body")[0]),
							a = o.getElementsByTagName("html")[0],
							r = window,
							l = o.querySelectorAll(".parallaxImg"),
							h = (l.length, "ontouchstart" in r || navigator.msMaxTouchPoints);
						if(h) return !1;
						var d = .045,
							c = .045,
							p = n.scrollTop || a.scrollTop,
							u = n.scrollLeft,
							f = i ? e.touches[0].pageX : e.pageX,
							g = i ? e.touches[0].pageY : e.pageY,
							m = s.getBoundingClientRect(),
							v = s.clientWidth || s.offsetWidth || s.scrollWidth,
							y = s.clientHeight || s.offsetHeight || s.scrollHeight,
							b = 320 / v,
							w = .52 - (f - m.left - u) / v,
							T = .52 - (g - m.top - p) / y,
							k = g - m.top - p - y / 2,
							_ = f - m.left - u - v / 2,
							C = (w - _) * (d * b),
							x = (k - T) * (c * b),
							E = " perspective(" + 3 * v + "px) rotateX(" + x + "deg) rotateY(" + C + "deg)  translateY(" + T * -10 + "px) translateX(" + w * -10 + "px) scale(1.013)";
						t(s).css("transform", E)
					}
					t(".shifttobg").each(function() {
						var e = t(this).find("img").attr("src"),
							i = t(this).find("img").height();
						t(this).css("background-image", "url(" + e + ")"), t(this).height(i), t(this).find("img").hide(), t(this).parallax()
					}), t(".jobs-body").hide(), t("#aaccordion h5").click(function() {
						return t(".jobs-body").hide(), t(this).next(".jobs-body").slideToggle(), this.toggle = !this.toggle, !1
					}), t(".animatesliding").slick({
						dots: !1,
						arrows: !1,
						infinite: !0,
						speed: 0,
						autoplay: !0,
						slidesToShow: 1
					}), WebFontConfig = {
						google: {
							families: ["Lato:300,400,700"]
						}
					};
					var i = document.createElement("script");
					i.src = ("https:" == document.location.protocol ? "https" : "http") + "://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js", i.type = "text/javascript", i.async = "true";
					var s = document.getElementsByTagName("script")[0];
					s.parentNode.insertBefore(i, s), t(".item3d").on("mouseover", function(i) {
						t(".item3d").css("transform", "perspective(0px) rotateX(0deg) rotateY(0deg) translateZ(0)"), e(i, !1, this)
					}), t(".item3d").on("mouseleave", function(e) {
						t(this).css("transform", "perspective(0px) rotateX(0deg) rotateY(0deg) translateZ(0)")
					});
					100 * t(window).height();
					t(window).resize(function() {
						100 * t(window).height()
					}), t(".mobile-menu").html(t("#mainnavigation").html()), t(".navbar-toggle").on("click", function() {
						t(".navbar-toggle").toggleClass("active")
					}), t(".city_navigation").hover(function() {
						t(this).addClass("open")
					}, function() {
						t(this).removeClass("open")
					});
					var o = "<div class='scrolloptions'><a class='s1' datac='0'></a><a class='s2' datac='1'></a><a class='s3' datac='2'></a><a class='s4' datac='3'></a></div>";
					t(".scrolltosections").append(o);
					var n = 0;
					t(".scrolltosections").each(function() {
						t(this).find("a").eq(n).addClass("active"), n++
					}), t(".scrolltosections a").click(function() {
						var e = t(this).attr("datac"),
							i = t(".scrolltosections").eq(e).offset().top;
						return t("html, body").animate({
							scrollTop: i
						}, 1e3), !1
					}), t(".CarouselListing").slick({
						dots: !1,
						arrows: !1,
						infinite: !0,
						speed: 300,
						autoplay: !0,
						slidesToShow: 4,
						adaptiveHeight: !0,
						responsive: [{
							breakpoint: 1024,
							settings: {
								slidesToShow: 5,
								slidesToScroll: 2
							}
						}, {
							breakpoint: 790,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 1
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1
							}
						}]
					}), t(".featuredlistings .listingcol a").each(function() {
						t(this).height(t(this).parent(".listingcol").width())
					}), t(window).resize(function() {
						t(".featuredlistings .listingcol a").each(function() {
							t(this).height(t(this).parent(".listingcol").width())
						})
					}), t(window).scroll(function() {
						t(window).scrollTop() > 150 ? t(".fixedheader").addClass("fixed") : t(".fixedheader").removeClass("fixed")
					}), t("#pricerange").length > 0 && t("#pricerange").slider({}), t(".datefield").datepicker({}), t(".slide-icon, .featured-content-block .companyBtn a").click(function() {
						var e = t(".fullwidthwrap").offset().top - 92;
						return t("html, body").animate({
							scrollTop: e
						}, 1e3), !1
					}), t(function() {
						t("#accordion").accordion({
							collapsible: !0
						})
					})
				}
			},
			home: {
				init: function() {},
				finalize: function() {}
			},
			about_us: {
				init: function() {}
			}
		},
		i = {
			fire: function(t, i, s) {
				var o, n = e;
				i = void 0 === i ? "init" : i, o = "" !== t, o = o && n[t], o = o && "function" == typeof n[t][i], o && n[t][i](s)
			},
			loadEvents: function() {
				i.fire("common"), t.each(document.body.className.replace(/-/g, "_").split(/\s+/), function(t, e) {
					i.fire(e), i.fire(e, "finalize")
				}), i.fire("common", "finalize")
			}
		};
	t(document).ready(i.loadEvents)
}(jQuery);
//# sourceMappingURL=main.js.map