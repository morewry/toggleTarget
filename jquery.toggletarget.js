/*
 *
 * jQuery toggleTarget
 * Rachael L Moore @morewry
 *
 * via jQuery Plugin Boilerplate http://jqueryboilerplate.com/
 * via UMD (Universal Module Definition) https://github.com/umdjs/umd
 *
 * Optional dependency on jquery.stateClasses (can override)
 *
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {
	var pluginName = "toggleTarget",
	defaults = {
		alwaysOne: false,
		toggleSelector: "[data-tog]",
		groupSelector: "[data-toggles]",
		// use {{target}} token to represent a dynamic selector
		targetSelector: '[data-id="{{target}}"]',
		// optional, pass in dom object for group
		groupEl: false,
		// assumes css animations - class to add when showing target
		targetShowClass: '',
		// assumes css animations - class to add when removing content
		targetHideClass: 'hidden',
		// default callbacks
		targetShowCallback: function ( event, each ) {
			// Trigger active state for toggle assumes plugin jquery.stateClasses.
			// You can pass a custom targetShowCallback -- or set up your own event handler.
			each.$this.trigger("active");
			// Toggle for target assumes css animation, only changes class to show/hide
			// You can pass a custom targetShowCallback
			each.$target.removeClass(each.data.settings.targetHideClass);
			each.$target.addClass(each.data.settings.targetShowClass);
		},
		targetHideCallback: function( event, each ) {
			// Trigger normal state for toggle assumes plugin jquery.stateClasses.
			// You can pass a custom targetHideCallback -- or set up your own event handler.
			each.$this.trigger("normal");
			// Toggle for target assumes css animation, only changes class to show/hide
			// You can pass a custom targetHideCallback
			each.$target.addClass(each.data.settings.targetHideClass);
			each.$target.removeClass(each.data.settings.targetShowClass);
		}
	};
	function Plugin ( el, options ) {
		// extend instance settings with passed-in options
		this.settings = $.extend( {}, defaults, options );
		// mostly for neatness, set groupSelector to selector (if any)
		if ( options.selector ) { this.settings.groupSelector = options.selector }
		// several options for el, figure out which should be used for this instance
		if ( this.settings.groupEl ) {
			// el passed in as optional groupEl
			this.el = this.settings.groupEl;
			this.$el = $(this.settings.groupEl);
			this.$togs = this.$el.find(this.settings.toggleSelector);
		}
		else if ( el.nodeType == 1 ) {
			// el passed in jquery plugin style
			this.el = el;
			this.$el = $(el);
			this.$togs = this.$el.find(this.settings.toggleSelector);
			if ( !this.$togs.length ) {
				this.$togs = this.$el;
				// there is no group, set toggleSelector to selector (if any)
				if ( options.selector ) { this.settings.toggleSelector = options.selector }
			}
		}
		else if ( this.settings.groupSelector ) {
			// no el passed in, use groupSelector
			this.$el = $(this.settings.groupSelector);
			this.el = this.$el[0];
			this.$togs = this.$el.find(this.settings.toggleSelector);
		}
		else {
			$.error("jquery.toggletarget.js - unable to determine el, so unable to determine toggles");
		}
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}
	Plugin.prototype = {

		init: function () {
			var eventName = 'click' + '.' + this._name + '.' + this.settings.groupSelector.replace(/[^a-z0-9-]/gi,'') + '.' + this.settings.toggleSelector.replace(/[^a-z0-9-]/gi,'');
			$(document).off(eventName).on(
				eventName,
				this.settings.toggleSelector,
				this,
				this.toggleTarget
			);
		}, // init

		toggleTarget: function ( event ) {
			// Refs to clicked el, its siblings
			event.data.$this = $(event.currentTarget);
			event.data.$sibs = event.data.$togs.not(event.data.$this);
			// Toggle state
			event.data.state = ( event.data.settings.alwaysOne ) ? true : !(event.data.$this.data("tog"));
			// Set event origin toggler to true / active
			event.data.$this.data("tog", event.data.state);
			// Set sibling toggles to false / inactive
			event.data.$sibs.data("tog", false);
			// For each possible toggle
			$.each(event.data.$togs, function ( i ) {
				// Refs to current toggle, its target
				var each = { data: event.data };
				each.$this = $(this),
				each.$target = $(event.data.settings.targetSelector.replace("{{target}}", each.$this.data("target")));
				// If this toggle is currently active
				if( !!each.$this.data("tog") ) {
					// Call active callback
					event.data.settings.targetShowCallback( event, each );
				}
				// If this toggle IS NOT ACTIVE
				else {
					// Call normal callback
					event.data.settings.targetHideCallback( event, each );
				}
			}); // each event.data.$togs
		} // toggleTarget

	}; // prototype
	$.fn[ pluginName ] = function ( options ) {
		var _this = this, instance, instantiate, returns, options = options || {};
		instantiate = function () {
			instance = $.data( this, pluginName );
			if ( typeof options === 'object' && ( !instance || this.self == window ) ) {
				if ( _this.selector && _this.selector.length ) { options.selector = _this.selector; }
				// Instantiate plugin
				$.data( this, pluginName, new Plugin( this, options ) );
			}
			if ( instance instanceof Plugin && typeof instance[options] === 'function' ) {
				// Directly call method
				returns = instance[options].apply( instance, Array.prototype.slice.call( arguments, 1 ) );
			}
		};
		if ( this instanceof jQuery ) { returns = this.each(instantiate); }
		else { returns = instantiate(); }
		return returns;
	}; // $.fn
}));
