
CurtainJs
-----------

A jQuery plugin for adding and controlling curtain-like animated panels in your projects. 

Check [projects page.](http://jahnestacado.github.io/curtainjs) 

## Install
---
 Install with [npm](npmjs.org):
```bash
    $ npm install curtainjs
```
 Install with [bower](http://bower.io/):
```bash
    $ bower install curtainjs
```

##CDN
---
```bash
   https://cdn.rawgit.com/jahnestacado/curtainjs/f114abd41648e3c2bf4f8b8c5f0a7b4c10f35ce7/js/jquery.curtain.js
   https://cdn.rawgit.com/jahnestacado/curtainjs/94a1069aaa4d4416ca9c37b19c9e1526f95e933c/css/jquery.curtain.min.css
```


## Use
---
In your web page, load the CurtainJS plugin after the script for jQuery:

```html
          <script src=js/jquery.curtain.min.js></script>
          <link rel=stylesheet type=text/css href=css/jquery.curtain.min.css>
```

All jQuery elements will now inherit the curtainify function. By "curtainifying" an jQuery element it automaticaly transforms it in a curtain container. 
```javascript
       var curtain =  $("body").curtainify(options);
```
Two curtain elements are created in the container element. We refer to them as curtainA and curtainB.

These elements are accessible from the curtain object
```javascript
       var curtain =  $("body").curtainify(options);
       
       /* 
       *  Reference to left curtain element when in landscape mode
       *  and to top curtain element when in portrait mode
       */
       var curtainA = curtain.curtainA;
       
      /* 
      * Reference to right curtain element when in landscape mode 
      * and to bottom curtain element when in portrait mode
      */
       var curtainB = curtain.curtainB;
       
       /*Check Options section for more info*/
```

We can now manipulate the state of the curtains by calling the open and close functions that are available in the curtain object.
```javascript
       // open curtains
       curtain.open();
       
       // close curtains
       curtain.close();
```
### Options
The curtainify function expects an options object which defines the functionality of the curtains. 

The curtains can operate in two modes. Portrait and landscape.

In portrait mode the curtains are placed at the top and the bottom of the "curtainified" element and perform a vertical transition. In landscape mode the curtains are placed at the left and the right side of the "curtainified" object and perform a horizontal transition. The default mode is set to landscape.

Curtains dimensions are specified relatively to their container element
```javascript
     var curtain =  $("body").curtainify({
        landscape : {
            widthRatioCurtainA : 0.5,
            widthRatioCurtainB : 0.5,
        }
     });
```
Above code will create two curtains of equal width (50% of their container element) and since these dimensions are specified for the landscape mode the curtains will be placed on the left and right side of that element accordingly.

In case the container element has the same size as the window (e.g  $("body") ), it can be orientation agnostic. In that case we can specify dimensions for both modes and be able to swap them when the screen orientation changes.

```javascript
     var curtain =  $("body").curtainify({
        swapModeOnOrientationChange: true,
        landscape : {
            widthRatioCurtainA : 0.5,
            widthRatioCurtainB : 0.5,
        },
         portrait : {
            heightRatioCurtainA : 0.2,
            heightRatioCurtainB : 0.8,
        }
     });
```
Above code will create curtains that operate in landscape mode when orientation of screen is landscape and they will operate in portrait mode when screens orientation is portrait.

Note that we have to set the "swapModeOnOrientationChange" to true in order to enable this feature. If we want this to work the other way around we can set the "defaultMode" property to portrait.

#### More options
```javascript
  var options {
    /*
     * Initial state of curtains. 
     * By default curtains are closed when we "curtainify" an element.
     * If we want to be opened we need to set the initState property to "open"
     */
    initState: "closed",
    // Curtains opening/closing animation duration
    animationDuration: 360,
    // Curtains opening/closing animation easing
    animationEasing: "swing",
  };
```

## License
Copyright (c) 2015 Ioannis Tzanellis<br>
[Released under the MIT license](https://github.com/jahnestacado/curtainjs/blob/master/LICENSE) 
