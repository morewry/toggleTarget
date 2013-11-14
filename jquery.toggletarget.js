/*
 *
 * jQuery toggleTarget
 * Andrew Aponte, Rachael L Moore
 *
 * via jQuery Plugin Boilerplate http://jqueryboilerplate.com/
 * via UMD (Universal Module Definition) https://github.com/umdjs/umd
 *
 * Loose dependency on jquery.stateClasses
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
				multiOpen: false,
				multiTarget: false,
				toggleSelector: '[data-tog]',
				groupSelector: '[data-toggles]',
				// use {{target}} token to represent a dynamic selector
				targetAttribute: 'data-target',
				targetSelector: '[data-id="{{target}}"]',
				// optional, only for passing in pre-selected node for group
				groupEl: false,
				// assumes css animations - class to add when showing target
				targetShowClass: '',
				// assumes css animations - class to add when removing content
				targetHideClass: 'hide'
				// optional callbacks
				/**
				 *
				 * Target ____ Callback / Target After ____
				 * arguments: "event" is jquery event object
				 * 						"opts" are plugin instance options
				 * context: "this" is an individual toggle object
				 * { el, $el, $target }
				 *
				 * Use target____Callback to override default show/hide functionality
				 * Use targetAfter____ to add to default show/hide functionality
				 *
				**/
				// targetShowCallback: function ( event, opts ) { },
				// targetAfterShow: function ( event, opts ) { },
				// targetHideCallback: function( event, opts ) { },
				// targetAfterHide: function ( event, opts ) { }
			}, // defaults
			$document = $(document);
	function Plugin ( el, options ) {
		this._defaults = defaults;
		this._name = pluginName;
		this._stateref = this._name + '-state';
		this._instref = this._name + '-plugin';
		this.opts = $.extend( {}, defaults, options );
		// several options for el, figure out which should be used for this instance
		if ( this.opts.groupEl ) {
			// el passed in as optional groupEl
			this.el = this.opts.groupEl;
			this.$el = $(this.opts.groupEl);
			this.$togs = this.$el.find(this.opts.toggleSelector);
		} // groupEl
		else if ( el.nodeType == 1 ) {
			// el passed in jquery plugin style
			this.el = el;
			this.$el = $(el);
			this.$togs = this.$el.find(this.opts.toggleSelector);
			if ( !this.$togs.length ) { this.$togs = this.$el; }
		} // nodeType == 1
		else if ( this.opts.groupSelector ) {
			// no el passed in, use groupSelector
			this.$el = $(this.opts.groupSelector);
			this.el = this.$el[0];
			this.$togs = this.$el.find(this.opts.toggleSelector);
		} // groupSelector
		else {
			$.error("$.fn.toggleTarget - unable to determine el, so unable to determine toggles");
		}
		this.init();
	}
	Plugin.prototype = {

		/**
		 *
		 * init
		 *
		**/
		init: function () {
			// console.log( "$.fn.toggleTarget - init" );
			// console.log(this.opts);
			var eventName = 'click.' + this._name,
					eventHandler = function ( event ) {
						// console.log("$.fn.toggleTarget - eventHandler, instref: " + event.data.instref);
						// console.log(event);
						var isPlugin = function ( o, k ) {
									return ( o && typeof o == "object" && o._toggle );
								},
								el = event.currentTarget,
								pel = (el) ? $.data(el, event.data.instref) : event.delegateTarget,
								plugin = (pel && !isPlugin(pel)) ? $.data(pel, event.data.name) : pel;
						return (isPlugin(plugin)) ? plugin._toggle( el, event ) : false;
					}; // eventHandler
			// console.log("$.fn.toggleTarget - on " + eventName + " " + this.opts.toggleSelector);
			$document.on(eventName, this.opts.toggleSelector, {instref: this._instref, name: this._name}, eventHandler);
			this.$togs.data(this._instref, this.el);
		}, // init

		/**
		 *
		 * _toggle
		 *
		**/
		_toggle: function ( el, event ) {
			// console.log("$.fn.toggleTarget - _toggle");
			// console.log(el);
			var plugin = this, cur = {}, target, temp;
			// Refs to clicked el, its siblings
			cur.$el = $(el);
			cur.$sibs = plugin.$togs.not(cur.$el);
			// Toggle state
			cur.state = ( plugin.opts.alwaysOne ) ? true : !!!cur.$el.data(plugin._stateref);
			// Set event origin toggler to true / active
			cur.$el.data(plugin._stateref, cur.state);
			// Set sibling toggles to false / inactive
			cur.$sibs.data(plugin._stateref, false);
			// For each possible toggle
			$.each(plugin.$togs, function ( i ) {
				// Refs to current toggle, its target
				var each = {
					el: this,
					$el: $(this),
					$target: {}
				};
				target = plugin.opts.targetSelector.replace("{{target}}", each.el.getAttribute(plugin.opts.targetAttribute));
				each.$target = $(target);
				// console.log("$.fn.toggleTarget - _toggle: targets " + target);
				if ( !plugin.opts.multiTarget && each.$target.length > 1 ) {
					// console.log(i);
					each.$target = each.$target.eq(i);
				}
				// If this toggle is currently active
				if( !!each.$el.data(plugin._stateref) ) {
					// Call active callback
					plugin._show(each, event);
				} // active
				// If this toggle IS NOT ACTIVE
				else {
					// If more than one shouldn't be open at a time
					if ( !plugin.opts.multiOpen ) {
						// Call normal callback
						plugin._hide(each, event);
					} // !multiOpen
				} // inactive
			}); // each plugin.$togs
		}, // toggle

		/*
		 * _show
		 * tog = { el, $el, $target }
		 * Pass in a custom targetShowCallback to override
		 * Extend _show by passing in a custom targetAfterShow
		 * Or by adding an event listener for active.toggleTarget
		*/
		_show: function ( tog, event ) {
			var after = function ( t, e ) {
				t.$target.trigger('active.' + this._name);
				if ( this.targetAfterShow && typeof this.targetAfterShow == "function" ) { this.targetAfterShow.call(t, e, this.opts); }
			};
			if ( this.targetShowCallback && typeof this.targetShowCallback == "function" ) {
				this.targetShowCallback.call(tog, event, this.opts);
				after.call(this, tog, event);
				return;
			}
			// Trigger active state for toggle assumes plugin jquery.stateClasses
			tog.$el.trigger('active');
			// Toggle for target assumes css animation, only changes class to show/hide
			tog.$target.removeClass(this.opts.targetHideClass);
			tog.$target.addClass(this.opts.targetShowClass);
			// Extendable event, optional after callback
			after.call(this, tog, event);
		}, // _show

		/*
		 * _hide
		 * tog = { el, $el, $target }
		 * Pass in a custom targetHideCallback to override
		 * Extend _hide by passing in a custom targetAfterHide
		 * Or by adding an event listener for normal.toggleTarget
		*/
		_hide: function( tog, event ) {
			var after = function ( t, e ) {
				t.$target.trigger('normal.' + this._name);
				if ( this.targetAfterHide && typeof this.targetAfterHide == "function" ) { this.targetAfterHide.call(t, e, this.opts); }
			};
			if ( this.targetHideCallback && typeof this.targetHideCallback == "function" ) {
				this.targetHideCallback.call(tog, event, this.opts);
				after.call(this, tog, event);
				return;
			}
			// Trigger normal state for toggle assumes plugin jquery.stateClasses
			tog.$el.trigger('normal');
			// Toggle for target assumes css animation, only changes class to show/hide
			tog.$target.addClass(this.opts.targetHideClass);
			tog.$target.removeClass(this.opts.targetShowClass);
			// Extendable event, optional after callback
			after.call(this, tog, event);
		} // _hide

	}; // prototype
	$.fn[ pluginName ] = function ( options ) {
		// console.log("$.fn.toggleTarget");
		var instance, returns, options = options || {};
		if ( this.selector ) {
			options = $.extend( { groupSelector: this.selector, toggleSelector: this.selector }, options );
		} // selector
		returns = this.each(function () {
			instance = $.data( this, pluginName );
			if ( typeof options === 'object' && !instance ) {
				// Instantiate plugin
				$.data( this, pluginName, new Plugin( this, options ) );
			}
			if ( instance instanceof Plugin && typeof instance[options] === 'function' ) {
				// Directly call method
				returns = instance[options].apply( instance, Array.prototype.slice.call( arguments, 1 ) );
			}
		});
		return returns;
	}; // $.fn
}));

