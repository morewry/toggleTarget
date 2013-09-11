# toggleTarget

Plugin to toggle the display of a target el. Generic enough to use for tabs, accordions, dropdowns, and more.

toggleTarget requires a control and a target to show/hide. It will work for dropdown menus, accordions, tabs, and pretty much any scenario in which you want clicking one element to show/hide another.  For the plugin to work, jQuery must be loaded and available in the plugin's scope.  Then the plugin must be instantiated either on the window or on a jQuery object corresponding to a DOM element.

toggleTarget has a loose dependency on stateClasses (another plugin I wrote).  It borrows the same inline HTML configuration syntax and when used together manages all states for toggle controls (normal, hover/focus, active).

## Why to Use?

- Optionally integrates with stateClasses, which we can be used to unify state management site-wide.
- Reduces duplication of code related to these common interface behaviors.
- Reduces the number of potential failure points where the JavaScript is directly managing the style of elements rather than their behavior.
- Ensures design teams can manage appearance without needing to edit JavaScript by using CSS animations by default.
- Enables higher performance animations with CSS animations as default.
- Reducing the number of event bindings by using event delegation.
- Minimizes DOM traversal and expensive jQuery object generation.
- Loosens the coupling between HTML markup and JavaScript behavior.

## Example Use

When the plugin initiates it will automatically determine toggled state of controls and content based on any classes that are already set on the element(s) in question.

	// Example init 1. On window.
	$.fn.toggleTarget({
		groupSelector: '[data-tabsnav]',
		toggleSelector: '[data-tab]',
		alwaysOne: true
	});

	<ol class="tabs" data-tabsnav>
		<li>
			<button class="tabs--tab active" data-tab data-target="tab-name1">Tab Name 1</button>
		 </li>
		<li>
			<button class="tabs--tab" data-tab data-target="tab-name2">Tab Name 2</button>
		</li>
	 <li>
			<button class="tabs--tab" data-tab data-target="tab-name3">Tab Name 3</button>
		</li>
	</ol>
	<div data-id="tab-name1" class="tabs--content">
		Tab Name 1 Content
	</div>
	<div data-id="tab-name2" class="hide tabs--content">
		Tab Name 2 Content
	</div>
	<div data-id="tab-name3" class="hide tabs--content">
		Tab Name 3 Content
	</div>

The above will make all toggles in `data-tabsnav` exclusive.  Meaning only one can show at a time.  It will also ensure one piece of toggle-able content always shows.
This example also shows a scenario in which the plugin instance will be attached to the window object.  If several objects are using the same HTML, you should only have to invoke the plugin once.

	// Example init 3. On a jQuery object.
	$('[data-tog]').toggleTarget();

	<button class="menu--btn" data-tog data-target="dropdown">Dropdown Menu</button>
	<section class="hide menu--list" data-id="dropdown">
		<a class="menu--link" href="#1">Dropdown Menu Link 1</a>
		<a class="menu--link" href="#2">Dropdown Menu Link 2</a>
		<a class="menu--link" href="#3">Dropdown Menu Link 3</a>
		<a class="menu--link" href="#4">Dropdown Menu Link 4</a>
	</section>

- The above will use all the default options.
- However, because it was passed a jQuery object and there is no group wrapper, it will use the object returned by $('[data-tog]') as both the toggle.
- This toggle will be able to alternate between open and closed states on each click.

## Options

**alwaysOne**<br>
optional, boolean<br>
default: `false`

One of two behavior profiles for the plugin.  If false, all the toggle-able content in a group can be toggled off (everything can be closed).  If true, there will always be one piece of content visible.

- "false" is a good profile for menus.
- "true" is a good profile for tabs.

**toggleSelector**<br>
optional, selector string<br>
default: `[data-tog]`

Selector used to find the individual toggle controls in the DOM.

**groupSelector**<br>
optional, selector string<br>
default: `[data-toggles]`

Selector used to find if there is a group of related toggle controls in the DOM.

**targetSelector**<br>
optional, selector string with token<br>
default: `[data-id="{{target}}"]`

Selector used to find toggle-able content in DOM.  Use {{target}} to as a placeholder for the dynamic part of the selector coded into data-target.

**groupEl**<br>
optional, selector string or object<br>
default: none

DOM element node or jQuery object corresponding with a wrapper for the group if there is group of related toggle controls in the DOM.  If you already have a reference to the element, you can pass it in rather than requiring the plugin to re-select it.  Overrides toggleSelector.

**targetShowClass**<br>
optional, class string<br>
default: none

The plugin does not do any animation, rather it assumes css animations for convenience and performance reasons.  Class(es) to add when showing content.

**targetHideClass**<br>
optional, class string<br>
default: `hidden`

The plugin does not do any animation, rather it assumes css animations for convenience and performance reasons.  Class(es) to add when hiding content.

**targetShowCallback:**<br>
optional, callback function<br>
default: `function`

Callback when toggle-able content is being shown.  This is one of the places the loose dependency on stateClasses can be removed or JavaScript animation can be added.

- Instead of changing classes for toggle control state directly, the default callback function triggers the stateClasses event.
- Instead of animating the transition in JavaScript, the plugin swaps out the optional targetHideClass and targetShowClass, allowing use of CSS animations.

**targetHideCallback**<br>
optional, callback function<br>
default: `function`

Callback when toggle-above content is being hidden.  This is one of the places the loose dependency on stateClasses can be removed or JavaScript animation can be added.

- Instead of changing classes for toggle control state directly, the default callback function triggers the stateClasses event.
-Instead of animating the transition in JavaScript, the plugin swaps out the optional targetHideClass and targetShowClass, allowing use of CSS animations.

## Methods

There are no methods designed to be public, but any method could be accessed directly using the standard syntax for jQuery plugins.

	$(selector).toggleTarget(medthodName);
