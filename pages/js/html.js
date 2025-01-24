this.LeaferIN = this.LeaferIN || {};
this.LeaferIN.html = (function (exports, draw) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    class HTMLTextData extends draw.ImageData {
        setText(value) {
            this._text = value;
            this.__htmlChanged = true;
        }
    }

    exports.HTMLText = class HTMLText extends draw.Image {
        get __tag() { return 'HTMLText'; }
        get editInner() { return 'TextEditor'; }
        constructor(data) {
            super(data);
        }
        __updateBoxBounds() {
            const data = this.__;
            if (data.__htmlChanged) {
                const div = document.createElement('div');
                const { style } = div;
                style.all = 'initial';
                style.position = 'absolute';
                style.visibility = 'hidden';
                div.innerHTML = this.text;
                document.body.appendChild(div);
                const { width, height } = div.getBoundingClientRect();
                const realWidth = width + 10;
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${realWidth}" height="${height}">
                        <foreignObject width="${realWidth}" height="${height}">
                            <style>
                                * {
                                    margin: 0;
                                    padding: 0;
                                    box-sizing: border-box;
                                }
                            </style>
                            <body xmlns="http://www.w3.org/1999/xhtml">
                                ${this.text}
                            </body>
                        </foreignObject>
                    </svg>`;
                data.__setImageFill('data:image/svg+xml,' + encodeURIComponent(svg));
                data.__naturalWidth = realWidth / data.pixelRatio;
                data.__naturalHeight = height / data.pixelRatio;
                data.__htmlChanged = false;
                div.remove();
            }
            super.__updateBoxBounds();
        }
    };
    __decorate([
        draw.dataProcessor(HTMLTextData)
    ], exports.HTMLText.prototype, "__", void 0);
    __decorate([
        draw.boundsType('')
    ], exports.HTMLText.prototype, "text", void 0);
    exports.HTMLText = __decorate([
        draw.registerUI()
    ], exports.HTMLText);

    draw.Plugin.add('html');

    exports.HTMLTextData = HTMLTextData;

    return exports;

})({}, LeaferUI);
