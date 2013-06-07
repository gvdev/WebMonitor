/*!
 * Bootstrap Context Menu
 * Version: 2.1
 * A small variation of the dropdown plugin by @sydcanem
 * https://github.com/sydcanem/bootstrap-contextmenu
 *
 * New options added by @jeremyhubble for javascript launching
 *  $('#elem').contextmenu({target:'#menu',before:function(e) { return true; } });
 *   
 *
 * Twitter Bootstrap (http://twitter.github.com/bootstrap).
 */
!(function(a){var b=function(d,c){this.$element=a(d);this.options=c;this.before=this.options.before||this.before;this.onItem=this.options.onItem||this.onItem;if(this.options.target){this.$element.attr("data-target",this.options.target)}this.listen()};b.prototype={constructor:b,show:function(h){var g=a(this),f,d,c;if(g.is(".disabled, :disabled")){return}c=a.Event("context");if(!this.before.call(this,h,this.$element)){return}this.$element.trigger(c);f=this.getMenu();var i=this.getPosition(h,f);f.attr("style","").css(i).addClass("open");return false},closemenu:function(c){this.getMenu().removeClass("open")},before:function(c){return true},onItem:function(d,c){return true},listen:function(){var d=this;this.$element.on("contextmenu.context.data-api",a.proxy(this.show,this));a("html").on("click.context.data-api",a.proxy(this.closemenu,this));var c=a(this.$element.attr("data-target"));c.on("click.context.data-api",function(f){d.onItem.call(this,f,a(f.target))});a("html").on("click.context.data-api",function(f){if(!f.ctrlKey){c.removeClass("open")}})},getMenu:function(){var c=this.$element.attr("data-target"),d;if(!c){c=this.$element.attr("href");c=c&&c.replace(/.*(?=#[^\s]*$)/,"")}d=a(c);return d},getPosition:function(m,c){var i=m.clientX,h=m.clientY,k=a(window).width(),j=a(window).height(),l=c.find(".dropdown-menu").outerWidth(),g=c.find(".dropdown-menu").outerHeight(),n={position:"fixed"},d,f;if(h+g>j){d={top:h-g}}else{d={top:h}}if((i+l>k)&&((i-l)>0)){f={left:i-l}}else{f={left:i}}return a.extend(n,d,f)},clearMenus:function(c){if(!c.ctrlKey){a("[data-toggle=context]").each(function(){this.getMenu().removeClass("open")})}}};a.fn.contextmenu=function(c,d){return this.each(function(){var g=a(this),f=g.data("context"),e=typeof c=="object"&&c;if(!f){g.data("context",(f=new b(this,e)))}if(typeof c=="string"){f[c].call(f,d)}})};a.fn.contextmenu.Constructor=b;a(document).on("contextmenu.context.data-api","[data-toggle=context]",function(c){a(this).contextmenu("show",c);c.preventDefault()})}(window.jQuery));
