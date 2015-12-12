/**
* curtainjs <https://github.com/jahnestacado/curtainjs>
* Copyright (c) 2015 Ioannis Tzanellis
* Licensed under the MIT License (MIT).
*/

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
        initState: "closed",
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
        var initOrientation = utils.getCurrentMode(options);
        var isPortrait =  initOrientation === "portrait";

        var alphaCurtainElQ = utils.renderAlphaCurtain(isPortrait, positioning, parentDimensions);
        var betaCurtainElQ =  utils.renderBetaCurtain(isPortrait, positioning, parentDimensions);

        var interruptAnimation =function(){
            alphaCurtainElQ.stop();
            betaCurtainElQ.stop();
        };

        parentElQ
                .append([alphaCurtainElQ, betaCurtainElQ])
                .attr({id: options.id})
                .css({overflow: "hidden"});

        var controls = {
            close: function close(_options) {
                interruptAnimation();
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
                interruptAnimation();
                var positioning = utils.getCurtainPositioning(parentElQ, options);
                var parentDimensions = utils.getElementsDims(parentElQ);
                var isAlreadyOpen = alphaCurtainElQ.hasClass("curtain-A-opened") || betaCurtainElQ.hasClass("curtain-B-opened");
                var animationDuration = (_options && _options.withoutAnimation) || isAlreadyOpen ? 0 : options.animationDuration;

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
        $(window).on("resize", function () {
            if(isInFullscreenMode){
                controls.close({withoutAnimation: true});
                isPortrait =  utils.getCurrentMode(options) === "portrait";
            }else{
                // Handle state of curtains on element resize
                var newParentDimensions = utils.getElementsDims(parentElQ);
                var haveDimenionsChanged = Object.keys(parentDimensions).reduce(function(result, key){
                    return result || parentDimensions[key] !== newParentDimensions[key];
                }, false);

                if(haveDimenionsChanged){
                    if(options.initState === "open"){
                        controls.open({withoutAnimation: true});
                    } else{
                        controls.close({withoutAnimation: true});
                    }
                    parentDimensions = newParentDimensions;
                }
            }
        });

        if(options.initState === "open"){
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
                                    ? {top: "-" + positioning.top + "px",  left: "0", height:positioning.top, width: parentDimensions.innerWidth - 2 * alphaCurtainBorderSize + "px"}
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
                                    ? {bottom: "-" + 2 * positioning.bottom + "px",  right: "0", height: positioning.bottom,  width: parentDimensions.innerWidth - 2 * betaCurtainBorderSize  + "px"}
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
            var modeSettings = options[currentMode];
            var alphaCurtainRatio = modeSettings && (modeSettings.widthRatioCurtainA || modeSettings.heightRatioCurtainA ) || 0;
            var betaCurtainRatio =  modeSettings && (modeSettings.widthRatioCurtainB || modeSettings.heightRatioCurtainB ) || 0;

            var alphaCurtainBorderSize = self.getBorderSize(parentElQ.find(".curtain-A"));
            var betaCurtainBorderSize = self.getBorderSize(parentElQ.find(".curtain-B"));

            var curtainPositioning = {
                left : innerWidth * alphaCurtainRatio - alphaCurtainBorderSize * 2,
                right : innerWidth * betaCurtainRatio - betaCurtainBorderSize * 2,
                top : height * alphaCurtainRatio - alphaCurtainBorderSize * 2,
                bottom : height * betaCurtainRatio - betaCurtainBorderSize * 2
            };

            return curtainPositioning;
        },
        isOrientationPortrait : function isOrientationPortrait(){
            return $(window).innerWidth() < $(window).innerHeight();
        }
    };

    $.fn.curtainify = CurtainJs;
}));
