var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LitElement, html, customElement, property, css, query } from 'lit-element';
import { get, set, del } from 'idb-keyval';
import PointerTracker from 'pointer-tracker';
// acknowledge mouse input baseline to establish pressure-controlled pen stroke size
const defaultMousePressure = 0.5;
let InkingCanvas = class InkingCanvas extends LitElement {
    constructor() {
        super();
        // all properties immediately customizable by developer
        this.canvasHeight = -1;
        this.canvasWidth = -1;
        this.name = "";
        // all properties used to manage canvas resizing
        this.isWaitingToResize = false;
        this.scale = 1;
        // record most recent stroke size signalled by inking toolbar
        this.strokeSize = -1;
        // default toolbar inking utensil selection
        this.toolStyle = "pen";
        this.strokeColor = "black";
    }
    render() {
        return html `
            <canvas></canvas>
        `;
    }
    firstUpdated() {
        // put this somewhere else later
        this.deleteCanvasContents();
        // establish canvas w & h, low-latency, stroke shape, starting image, etc
        window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
            this.setUpCanvas();
        }));
        // equip canvas to handle & adapt to external resizing
        window.addEventListener('resize', () => this.requestCanvasResize(), false);
        // set up input capture events
        window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
            this.setUpPointerTrackerEvents();
        }));
    }
    setUpCanvas() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: fix canvas filling parent edge cases
            if (this.canvasWidth !== -1) {
                this.canvas.width = this.canvasWidth;
            }
            else {
                this.canvas.style.width = '100%';
                this.canvas.width = this.canvas.offsetWidth;
            }
            if (this.canvasHeight !== -1) {
                this.canvas.height = this.canvasHeight;
            }
            else {
                this.canvas.style.height = '100%';
                this.canvas.height = this.canvas.offsetHeight;
            }
            // record original canvas aspect ratio for resizing
            this.currentAspectRatio = { width: this.canvas.width, height: this.canvas.height };
            // enable low-latency if possible
            this.context = this.canvas.getContext('2d', {
                desynchronized: true
            });
            // check for low-latency
            if ("getContextAttributes" in this.context && this.context.getContextAttributes().desynchronized) {
                console.log('Low latency is supported for inking canvas.');
            }
            else {
                console.log('Low latency is NOT supported for inking canvas.');
            }
            this.requestCanvasResize();
            window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
                this.resizeCanvas();
            }));
        });
    }
    // expose change pen color API for toolbar and presenter
    changeUtensilColor(color) {
        if (this.context)
            this.strokeColor = color;
    }
    // expose change stroke size API for toolbar and presenter
    changeStrokeSize(strokeSize) {
        if (this.context)
            this.strokeSize = strokeSize;
    }
    // expose ability to change stroke layering depending on selected utensil
    changeToolStyle(toolStyle) {
        if (this.context) {
            this.toolStyle = toolStyle;
            switch (toolStyle) {
                case ("pen"):
                    this.context.globalCompositeOperation = "source-over";
                    break;
                case ("pencil"):
                    this.context.globalCompositeOperation = "darken";
                    break;
                case ("highlighter"):
                    this.context.globalCompositeOperation = "darken";
                    break;
                case ("eraser"):
                    this.context.globalCompositeOperation = "source-over";
                    break;
                default:
                    console.log("unknown pen style captured");
                    break;
            }
        }
    }
    getScale() {
        return this.scale;
    }
    requestCanvasResize() {
        if (!this.isWaitingToResize) {
            this.isWaitingToResize = true;
        }
    }
    // TODO: find better way to limit calls
    resizeCanvas() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.context && this.isWaitingToResize) {
                // toggle semaphore
                this.isWaitingToResize = false;
                window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
                    this.clearCanvas();
                }));
                // reload canvas with previous canvas state
                window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
                    const outerThis = this;
                    const canvasContents = yield get('canvasContents');
                    if (canvasContents) {
                        console.log("loading canvas contents");
                        const tempImage = new Image();
                        tempImage.onload = () => {
                            outerThis.context.drawImage(tempImage, 0, 0);
                        };
                        tempImage.src = canvasContents;
                    }
                }));
                console.log("canvas was resized");
            }
            // start & continue canvas resize loop
            window.requestIdleCallback(() => {
                requestAnimationFrame(() => __awaiter(this, void 0, void 0, function* () { return this.resizeCanvas(); }));
            });
        });
    }
    clearCanvas() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.canvasHeight == -1) {
                this.canvas.height = this.canvas.offsetHeight;
            }
            if (this.canvasWidth == -1) {
                this.canvas.width = this.canvas.offsetWidth;
            }
            // determine scale of contents to fit canvas
            this.scale = Math.min(this.canvas.width / this.currentAspectRatio.width, this.canvas.height / this.currentAspectRatio.height);
            // set the origin so that the scaled content is centered on the canvas
            this.origin = {
                x: (this.canvas.width - (this.currentAspectRatio.width * this.scale)) / 2,
                y: (this.canvas.height - (this.currentAspectRatio.height * this.scale)) / 2
            };
            // ensure canvas is fresh
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = 'white';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // scale and center canvas
            this.context.setTransform(this.scale, 0, 0, this.scale, this.origin.x, this.origin.y);
            // make the stroke points round
            this.context.lineCap = 'round';
            this.context.lineJoin = 'round';
        });
    }
    eraseAll() {
        window.requestIdleCallback(() => {
            this.clearCanvas();
            this.deleteCanvasContents();
        });
    }
    setUpPointerTrackerEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            this.strokes = new Map();
            const outerThis = this;
            this.tracker = new PointerTracker(this.canvas, {
                start(pointer, event) {
                    // console.log("current start event pressure: " + (pointer.nativePointer as PointerEvent).pressure);
                    event.preventDefault();
                    outerThis.strokes.set(pointer.id, pointer.nativePointer.width);
                    // console.log("pointer added");
                    return true;
                },
                end(pointer, event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        outerThis.strokes.delete(pointer.id);
                        // console.log("pointer deleted");
                        // save snapshot of canvas to redraw if window resizes/refreshes
                        outerThis.saveCanvasContents(event);
                    });
                },
                move(previousPointers, changedPointers, event) {
                    for (const pointer of changedPointers) {
                        // find last pointer event of same stroke to connect the new pointer event to it
                        const previous = previousPointers.find(p => p.id === pointer.id);
                        // identify input type
                        let pointerType = pointer.nativePointer.pointerType;
                        // console.log("pointer type: " + pointerType);
                        // collect width for touch and mouse strokes
                        let width = pointer.nativePointer.width;
                        outerThis.strokes.set(pointer.id, width);
                        // if (pointerType !== "pen") console.log("width: " + width);
                        // collect pressure for pen strokes
                        let pressure = pointer.nativePointer.pressure;
                        // if (pointerType === "pen") console.log("pressure: " + pressure);
                        // adjust stroke thickness for each input type if toolbar size slider isn't active
                        if (outerThis.strokeSize === -1) {
                            if (pointerType === 'pen') {
                                if (defaultMousePressure > pressure) {
                                    outerThis.context.lineWidth = 1.5 - (defaultMousePressure - pressure);
                                }
                                else if (defaultMousePressure === pressure) {
                                    outerThis.context.lineWidth = 1.5;
                                }
                                else {
                                    let scaledMultiplier = 50 * (pressure - defaultMousePressure);
                                    let adjustedPressure = 1.5 + (scaledMultiplier * (pressure - defaultMousePressure));
                                    // console.log("adjustedPressure: " + adjustedPressure);
                                    outerThis.context.lineWidth = adjustedPressure;
                                }
                                // console.log("lineWidth for pen: " + outerThis.context.lineWidth);
                            }
                            else {
                                // adjust stroke width for mouse & touch
                                outerThis.context.lineWidth = outerThis.strokes.get(pointer.id);
                                // console.log("lineWidth for " + pointerType + ": " + outerThis.context.lineWidth);
                            }
                        }
                        else {
                            outerThis.context.lineWidth = outerThis.strokeSize;
                            // console.log("current stroke width defined by slider is: " + outerThis.context.lineWidth);
                        }
                        let previousX, previousY, currentX, currentY;
                        // translate pointer position if canvas has been resized/scaled & then draw the stroke
                        if (outerThis.origin) {
                            // canvas has been resized so adjust the pointer coordinates
                            let rect = outerThis.canvas.getBoundingClientRect();
                            previousX = (previous.clientX - rect.left - outerThis.origin.x) / outerThis.scale;
                            previousY = (previous.clientY - rect.top - outerThis.origin.y) / outerThis.scale;
                            outerThis.context.beginPath();
                            outerThis.context.moveTo(previousX, previousY);
                            for (const point of pointer.getCoalesced()) {
                                currentX = (point.clientX - rect.left - outerThis.origin.x) / outerThis.scale;
                                currentY = (point.clientY - rect.top - outerThis.origin.y) / outerThis.scale;
                                outerThis.context.lineTo(currentX, currentY);
                            }
                        }
                        else {
                            // draw the points as-is since the canvas has not been resized yet
                            outerThis.context.beginPath();
                            previousX = previous.clientX;
                            previousY = previous.clientY;
                            outerThis.context.moveTo(previousX, previousY);
                            for (const point of pointer.getCoalesced()) {
                                currentX = point.clientX;
                                currentY = point.clientY;
                                outerThis.context.lineTo(currentX, currentY);
                            }
                        }
                        // confirm the stroke color is correct
                        outerThis.context.strokeStyle = outerThis.strokeColor;
                        // TODO: figure out why stroke starts as previous color and then corrects itself
                        if (outerThis.toolStyle === "pencil") {
                            // change up the stroke texture
                            outerThis.drawPencilStroke(outerThis.context, previousX, currentX, previousY, currentY);
                        }
                        else {
                            // apply ink as-is to canvas
                            outerThis.context.stroke();
                        }
                    }
                }
            });
        });
    }
    // TODO: put in helper class/file
    drawPencilStroke(context, previousX, currentX, previousY, currentY) {
        // record context properties before modifying
        let strokeColor = context.strokeStyle;
        let strokeLayer = context.globalCompositeOperation;
        let strokeWidth = context.lineWidth;
        let opacity = context.globalAlpha;
        // use the distance formula to calcuate the line length between the two points on the canvas
        let distance = Math.round(Math.sqrt(Math.pow(currentX - previousX, 2) + Math.pow(currentY - previousY, 2)));
        // console.log("distance: "+ distance);
        // split length into incremental pieces
        let stepX = (currentX - previousX) / distance;
        let stepY = (currentY - previousY) / distance;
        for (let i = 0; i < distance; i++) {
            let currentX = previousX + (i * stepX);
            let currentY = previousY + (i * stepY);
            // create light base for whole stroke width as a first layer
            context.globalAlpha = 0.7;
            let randomX = currentX + ((Math.random() - 0.5) * strokeWidth * 1);
            let randomY = currentY + ((Math.random() - 0.5) * strokeWidth * 1);
            context.fillRect(randomX, randomY, Math.random() + 2, Math.random() + 1);
            // thicken center of stroke with a second more opaque layer
            context.globalAlpha = 1;
            randomX = currentX + ((Math.random() - 0.5) * strokeWidth * 0.8);
            randomY = currentY + ((Math.random() - 0.5) * strokeWidth * 0.8);
            context.fillRect(randomX, randomY, Math.random() + 2, Math.random() + 1);
        }
        // restore context properties
        context.fillStyle = strokeColor;
        context.globalCompositeOperation = strokeLayer;
        context.lineWidth = strokeWidth;
        context.globalAlpha = opacity;
    }
    // async copyCanvasContents() {
    //     this.canvas.toBlob(
    //         async blob => (navigator.clipboard as any).write([
    //             new ClipboardItem({
    //                 [blob.type] : blob
    //             })
    //         ]).then( function() {
    //             console.log("canvas contents copied successfully!");
    //         }, function (err) {
    //             console.error("could not copy " + this.name + " canvas contents, " + err);
    //         })
    //     );
    // }
    saveCanvasContents(event) {
        event.preventDefault();
        // update the recorded canvas aspect ratio for future resizing
        this.currentAspectRatio.width = this.canvas.width;
        this.currentAspectRatio.height = this.canvas.height;
        window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
            let canvasContents = this.canvas.toDataURL();
            yield set('canvasContents', canvasContents);
        }));
    }
    deleteCanvasContents() {
        window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
            yield del('canvasContents');
        }));
    }
    static get styles() {
        return css `
            canvas {
                box-sizing: border-box;
                border: 2px solid black;
                position: absolute;
                min-height: 300px;
                min-width: 300px;
                touch-action: none;
                display: block;
            }
        `;
    }
};
__decorate([
    query('canvas')
], InkingCanvas.prototype, "canvas", void 0);
__decorate([
    property({ type: CanvasRenderingContext2D })
], InkingCanvas.prototype, "context", void 0);
__decorate([
    property({ type: Number, attribute: "height" })
], InkingCanvas.prototype, "canvasHeight", void 0);
__decorate([
    property({ type: Number, attribute: "width" })
], InkingCanvas.prototype, "canvasWidth", void 0);
__decorate([
    property({ type: String, attribute: "name" })
], InkingCanvas.prototype, "name", void 0);
__decorate([
    property({ type: Object })
], InkingCanvas.prototype, "isWaitingToResize", void 0);
__decorate([
    property({ type: Object })
], InkingCanvas.prototype, "currentAspectRatio", void 0);
__decorate([
    property({ type: Number })
], InkingCanvas.prototype, "scale", void 0);
__decorate([
    property({ type: Object })
], InkingCanvas.prototype, "origin", void 0);
__decorate([
    property({ type: Map })
], InkingCanvas.prototype, "strokes", void 0);
__decorate([
    property({ type: PointerTracker })
], InkingCanvas.prototype, "tracker", void 0);
__decorate([
    property({ type: Number })
], InkingCanvas.prototype, "strokeSize", void 0);
__decorate([
    property({ type: String })
], InkingCanvas.prototype, "toolStyle", void 0);
__decorate([
    property({ type: String })
], InkingCanvas.prototype, "strokeColor", void 0);
InkingCanvas = __decorate([
    customElement('inking-canvas')
], InkingCanvas);
export { InkingCanvas };
