//https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
// Uses CommonJS, AMD or browser globals to create a jQuery plugin.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var OPTIONS = {
        initState: null,
        defaultMode: "landscape",
        swapModeOnOrientationChange: false,
        animationDuration: 360,
        animationEasing: "swing",
    };

    var CurtainJs = function CurtainJs(_options) {
        var parentElQ = this;
        var options = $.extend( {}, OPTIONS, _options);
        var positioning = utils.getCurtainPositioning(parentElQ, options);
        var parentDimensions = utils.getElementsDims(parentElQ);
        var isPortrait =  utils.getCurrentMode(options) === "portrait";

        var alphaCurtainElQ = utils.renderAlphaCurtain(isPortrait, positioning, parentDimensions);
        var betaCurtainElQ =  utils.renderBetaCurtain(isPortrait, positioning, parentDimensions);

        parentElQ
                .append([alphaCurtainElQ, betaCurtainElQ])
                .attr({id: options.id})
                .css({overflow: "hidden"});

        var controls = {
            close: function close(_options) {
                var positioning =  utils.getCurtainPositioning(parentElQ, options);
                var animationDuration = _options && _options.withoutAnimation ? 0 : options.animationDuration;

                alphaCurtainElQ.removeClass("curtain-A-opened").addClass("curtain-A-closed");
                betaCurtainElQ.removeClass("curtain-B-opened").addClass("curtain-B-closed");

                var alphaCurtainPositioning = isPortrait
                                    ? {top :"-" + positioning.top + "px"}
                                    : {left : '-' + positioning.left + 'px'};
                alphaCurtainElQ.animate(alphaCurtainPositioning, animationDuration, options.animationEasing, function(){alphaCurtainElQ.css({display: "none"});});

                var betaCurtainPositioning = isPortrait
                                    ? {bottom : "-" + positioning.bottom + "px"}
                                    : {right : '-' + positioning.right + 'px'};
                betaCurtainElQ.animate(betaCurtainPositioning, animationDuration, options.animationEasing, function(){betaCurtainElQ.css({display: "none"});});
            },
            open: function open(_options) {
                var positioning = utils.getCurtainPositioning(parentElQ, options);
                var parentDimensions = utils.getElementsDims(parentElQ);
                var animationDuration = _options && _options.withoutAnimation ? 0 : options.animationDuration;

                alphaCurtainElQ =  utils.renderAlphaCurtain(isPortrait, positioning, parentDimensions, alphaCurtainElQ);
                betaCurtainElQ =  utils.renderBetaCurtain(isPortrait, positioning, parentDimensions, betaCurtainElQ);
                parentElQ.append([alphaCurtainElQ, betaCurtainElQ]);

                alphaCurtainElQ.removeClass("curtain-A-closed")
                                .addClass("curtain-A-opened")
                                .css({display: ""});

                betaCurtainElQ.removeClass("curtain-B-closed")
                                .addClass("curtain-B-opened")
                                .css({display: ""});

                var alphaCurtainPositioning = isPortrait ? {top: "0"} : {left: "0"};
                alphaCurtainElQ.animate(alphaCurtainPositioning, animationDuration, options.animationEasing);

                var betaCurtainPositioning = isPortrait ? {bottom: "0"} : {right: "0",};
                betaCurtainElQ.animate(betaCurtainPositioning, animationDuration, options.animationEasing);
            },
            curtainA: alphaCurtainElQ,
            curtainB: betaCurtainElQ
        };

        var isInFullscreenMode = parentElQ.width() >= $(window).width() || parentElQ.height() >= $(window).height();
        if(isInFullscreenMode){
            $(window).on("resize", function () {
                controls.close({withoutAnimation: true});
                isPortrait =  utils.getCurrentMode(options) === "portrait";
            });
        }

        if(options.initState === "active"){
            controls.open({withoutAnimation: true});
        }

        return $.extend({},parentElQ, controls);
    };

    var utils = {
        getCurrentMode : function getCurrentMode(options){
            var self = this;
            var mode = options.defaultMode;
            if( options.portrait && options.landscape && options.swapModeOnOrientationChange){
                var isInPortraitMode =  utils.isOrientationPortrait();
                switch(options.defaultMode){
                    case "landscape":
                            mode = isInPortraitMode ? "portrait" : options.defaultMode;
                            break;
                    case "portrait":
                        mode = isInPortraitMode ? "landscape" : options.defaultMode;
                        break;
                    default:
                        console.log("Unkonwn orientation mode" + defaultMode);
                    break;
                }
            } else if(options.portrait && !options.landscape){
                mode = "portrait";
            }
            return mode;
        },
        renderAlphaCurtain : function renderAlphaCurtain(isPortrait, positioning, parentDimensions, existingElQ) {
            var self = this;
            alphaCurtainElQ = existingElQ || $("<div class='curtain-A'></div>");
            var alphaCurtainBorderSize = self.getBorderSize(alphaCurtainElQ);

            var cssAttrs = isPortrait
                                    ? {top: "-" + positioning.top + "px",  left: "0", height:positioning.top, width: parentDimensions.innerWidth + "px"}
                                    : {left: "-" + positioning.left + "px", top: "0", width: positioning.left, height: parentDimensions.height +"px"};
            cssAttrs.border = alphaCurtainBorderSize + "px solid black";

            alphaCurtainElQ.addClass("curtain-A-closed").css(cssAttrs);

            return alphaCurtainElQ;
        },
        renderBetaCurtain : function renderBetaCurtain(isPortrait, positioning, parentDimensions, existingElQ) {
            var self = this;
            betaCurtainElQ = existingElQ || $("<div class='curtain-B'></div>");
            var betaCurtainBorderSize = self.getBorderSize(betaCurtainElQ);

            var cssAttrs = isPortrait
                                    ? {bottom: "-" + 2 * positioning.bottom + "px",  right: "0", height: positioning.bottom,  width: parentDimensions.innerWidth + "px"}
                                    :{right: "-" + 2 * positioning.right + "px", bottom: "0", width: positioning.right, height: parentDimensions.height + "px"};
            cssAttrs.border = betaCurtainBorderSize + "px solid black";
            betaCurtainElQ.addClass("curtain-B-closed").css(cssAttrs);

            return betaCurtainElQ;
        },
        getBorderSize : function getBorderSize(elQ){
            var self = this;
            var sreenWidths = self.getElementsDims(elQ);
            var borderSize = (sreenWidths.outerWidth - sreenWidths.innerWidth) / 2;

            return borderSize;
        },
        getElementsDims : function getElementsDims(elQ){
            var screenWidths = {
                outerWidth : elQ.outerWidth() || elQ.width(),
                innerWidth :  elQ.innerWidth() || elQ.width(),
                height : elQ.is("body") ? $(window).height() : elQ.height(),
            };

            return screenWidths;
        },
        getCurtainPositioning : function getCurtainPositioning(parentElQ, options) {
            var self = this;
            var parentDimensions = self.getElementsDims(parentElQ);
            var innerWidth = parentDimensions.innerWidth;
            var height = parentDimensions.height;

            var currentMode = self.getCurrentMode(options);
            var alphaCurtainScreenRatio = options[currentMode] && options[currentMode].screenRatioCurtainA || 0;
            var betaCurtainScreenRatio =  options[currentMode] && options[currentMode].screenRatioCurtainB || 0;

            var alphaCurtainBorderSize = self.getBorderSize(parentElQ.find(".curtain-A"));
            var betaCurtainBorderSize = self.getBorderSize(parentElQ.find(".curtain-B"));

            var curtainPositioning = {
                left : innerWidth * alphaCurtainScreenRatio - alphaCurtainBorderSize * 2,
                right : innerWidth * betaCurtainScreenRatio - betaCurtainBorderSize * 2,
                top : height * alphaCurtainScreenRatio - alphaCurtainBorderSize * 2,
                bottom : height * betaCurtainScreenRatio - betaCurtainBorderSize * 2
            };

            return curtainPositioning;
        },
        isOrientationPortrait : function isOrientationPortrait(){
            return $(window).innerWidth() < $(window).innerHeight();
        }
    };

    $.fn.curtain = CurtainJs;
}));
