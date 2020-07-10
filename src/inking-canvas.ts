import {
    LitElement, html, customElement, property, css, query
} from 'lit-element';
import { get, set , del } from 'idb-keyval';
// import PointerTracker from 'pointer-tracker';
import PointerTracker from "./PointerTracker.js";
// import { fileSave } from 'browser-nativefs';

// @ts-ignore
import { fileSave } from 'https://cdn.jsdelivr.net/npm/browser-nativefs@0.8.2/dist/index.min.js';
import * as Utils from './utils';

declare let ClipboardItem;

@customElement('inking-canvas')
export class InkingCanvas extends LitElement {

    // all properties used to manage the canvas object
    @query('canvas') private canvas: HTMLCanvasElement;
    @property({ type: CanvasRenderingContext2D }) private context: CanvasRenderingContext2D;
    private static readonly minCanvasHeight = 300;
    private static readonly minCanvasWidth = 300;
    private static readonly minCanvasHeightCSS = css`${InkingCanvas.minCanvasHeight}px`;
    private static readonly minCanvasWidthCSS = css`${InkingCanvas.minCanvasWidth}px`;

    // all properties immediately customizable by developer
    @property({type: Number, attribute: "height"}) canvasHeight: number = -1;
    @property({type: Number, attribute: "width"}) canvasWidth: number = -1;
    @property({type: String, attribute: "name"}) name: string = "";

    // all properties used to manage canvas resizing
    @property({type: Object}) private isWaitingToDraw: boolean = false;
    @property({type: Object}) private currentAspectRatio: {width: number, height: number};
    @property({type: Number}) private scale: number = 1;
    @property({type: Object}) private origin: {x: number, y: number};
    @property({type: CustomEvent}) private inkingCanvasDrawnEvent: CustomEvent = new CustomEvent('inking-canvas-drawn');

    // all properties used by PointerTracker implementation
    @property({type: Map}) private strokes: Map<number, number>;
    @property({type: PointerTracker}) private tracker: PointerTracker;

    // acknowledge mouse input baseline to establish pressure-controlled pen stroke size
    private readonly defaultMousePressure: number = 0.5;

    // establish the default stroke widths that should match the default inking-toolbar tool slider values
    private readonly nonHighlighterStrokeSize: number = 24;
    private readonly highlighterStrokeSize: number = 50;
    private defaultStrokeSize = this.nonHighlighterStrokeSize;

    // record properties set by external influencers (like toolbar)
    @property({type: Number}) private strokeSize: number = -1;
    @property({type: String}) private toolStyle: string = "pen";
    @property({type: String}) private strokeColor: string = "black";

    // notify external influencers (like toolbar) when inking is happening
    @property({type: CustomEvent}) private inkingStartedEvent: CustomEvent = new CustomEvent('inking-started');

    render() {
        return html`
            <canvas part="canvas"></canvas>
            <slot></slot>
        `;
    }

    constructor() {
        super();
    }

    firstUpdated() {

        // TODO: put this somewhere else later
        this.deleteCanvasContents();      

        // establish canvas w & h, low-latency, stroke shape, starting image, etc
        Utils.runAsynchronously( () => { 
            this.setUpCanvas();
        });

        // equip canvas to handle & adapt to external resizing
        window.addEventListener('resize', () => this.requestDrawCanvas(), false);

        // refresh canvas when browser tab was switched and is re-engaged
        window.addEventListener('focus', () => this.requestDrawCanvas(), false);

        // set up input capture events
        Utils.runAsynchronously( () => { 
            this.setUpPointerTrackerEvents();
        });
    }

    // expose ability to get/set stroke color, size, & style

    setStrokeColor(color: string) {
        if (this.context) this.strokeColor = color;
    }

    getStrokeColor() {
        return this.strokeColor;
    }

    setStrokeSize(strokeSize: number) {
        if (this.context) this.strokeSize = strokeSize;
    }

    getStrokeSize() {
        return this.strokeSize;
    }

    setStrokeStyle(toolName: string) {
        if (this.context) {
            this.toolStyle = toolName;
            switch (toolName) {
                case ("pen") :
                    this.context.globalCompositeOperation = "source-over";
                    break;
                case ("pencil") :
                    this.context.globalCompositeOperation = "darken";
                    break;
                case ("highlighter") :
                    this.context.globalCompositeOperation = "darken";
                    break;
                case ("eraser") :
                    this.context.globalCompositeOperation = "source-over";
                    break;
                default : 
                    console.log("unknown pen style captured");
                    break;
            }
        }
    }

    getStrokeStyle() {
        return this.toolStyle;
    }

    // expose canvas object for advanced use cases
    getCanvas() {
        return this.canvas;
    }

    // expose how canvas has resized since its initialization
    getScale() {
        return this.scale;
    }
    
    // expose ability to delete canvas contents
    eraseAll() {
        Utils.runAsynchronously( () => { 
            this.clearCanvas()
            this.deleteCanvasContents();
        });
    }

    // expose ability to trigger additional inking canvas redraws
    requestDrawCanvas() {
        if (!this.isWaitingToDraw) {
            this.isWaitingToDraw = true;
        }
    }

    private async setUpCanvas() {

        // set css canvas dimensions prior to setting logical canvas dimensions (including calling getBoundingClientRect())
        if (this.isCanvasHeightSet()) {
            this.canvas.style.height = this.canvasHeight + "px";
            this.canvas.height = this.canvasHeight * devicePixelRatio;
        } else {
            this.canvas.style.height = '100%';
        }
        if (this.isCanvasWidthSet()) {
            this.canvas.style.width = this.canvasWidth + "px";
            this.canvas.width = this.canvasWidth * devicePixelRatio;
        } else {
            this.canvas.style.width = '100%';
        }

        if (!this.isCanvasHeightSet || !this.isCanvasWidthSet()) {
            let rect = this.canvas.getBoundingClientRect();
            if (!this.isCanvasHeightSet()) this.canvas.height = rect.height * devicePixelRatio;
            if (!this.isCanvasWidthSet()) this.canvas.width = rect.width * devicePixelRatio;
        }

        // record original canvas aspect ratio for resizing
        this.currentAspectRatio = {width: this.canvas.width, height: this.canvas.height}; 

        // enable low-latency if possible
        this.context = Utils.getLowLatencyContext(this.canvas, "inking");
    
        this.requestDrawCanvas();
        Utils.runAsynchronously( () => { 
            this.drawCanvas();
        });
    }

    private isCanvasHeightSet() {
        return this.canvasHeight > 0;
    }

    private isCanvasWidthSet() {
        return this.canvasWidth > 0;
    }

    private async drawCanvas() {

        if (this.context && this.isWaitingToDraw) {

            // toggle semaphore
            this.isWaitingToDraw = false;

            Utils.runAsynchronously( async() => { 

                this.clearCanvas();

                // reload canvas with previous contents
                const outerThis = this;
                const canvasContents = await (get('canvasContents') as any);
                if (canvasContents) {
                    const tempImage = new Image();
                    tempImage.onload = () => {
                        outerThis.context.drawImage(tempImage, 0, 0);
                    }
                    tempImage.src = canvasContents;
                }
            });

            // notify external influencers that drawing happened
            this.dispatchEvent(this.inkingCanvasDrawnEvent);

            // console.log("canvas was resized");
        }

        // start & continue canvas redraw loop
        Utils.runAsynchronously( () => { 
            requestAnimationFrame( async () => this.drawCanvas());
        });
    }

    private async clearCanvas() {

        // record new height and width
        let rect = this.canvas.getBoundingClientRect();
        this.canvas.height = rect.height * devicePixelRatio;
        this.canvas.width = rect.width * devicePixelRatio;

        // determine scale of contents to fit canvas
        this.scale = Math.min(this.canvas.width / this.currentAspectRatio.width,
            this.canvas.height / this.currentAspectRatio.height);

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
    }

    private getPosX(pointer: any, rect: DOMRect) {
        return ((pointer.clientX * devicePixelRatio) - (rect.left * devicePixelRatio) - this.origin.x) / this.scale;
    }

    private getPosY(pointer: any, rect: DOMRect) {
        return ((pointer.clientY * devicePixelRatio) - (rect.top * devicePixelRatio) - this.origin.y) / this.scale;
    }

    private isStylusEraserActive(pointer: any) {
        return ((pointer.nativePointer as PointerEvent).buttons === 32 || (pointer.nativePointer as PointerEvent).button === 5);
    }

    private async setUpPointerTrackerEvents() {
        this.strokes = new Map();
        const outerThis = this;     
        this.tracker = new PointerTracker(this.canvas, {
            start(pointer, event) {
                // console.log("current start event pressure: " + (pointer.nativePointer as PointerEvent).pressure);
                event.preventDefault();

                // notify any connected toolbar to close any open dropdown
                outerThis.dispatchEvent(outerThis.inkingStartedEvent);

                outerThis.strokes.set(pointer.id, (pointer.nativePointer as PointerEvent).width);
                // console.log("pointer added");
                return true;          
            },
            async end(pointer, event) {
                outerThis.strokes.delete(pointer.id);
                // console.log("pointer deleted");

                // save snapshot of canvas to redraw if window resizes/refreshes
                outerThis.cacheCanvasContents(event);
            },
            move(previousPointers, changedPointers, event) {
                for (const pointer of changedPointers) {

                    // find last pointer event of same stroke to connect the new pointer event to it
                    const previous = previousPointers.find(p => p.id === pointer.id);

                    // identify input type
                    let pointerType = (pointer.nativePointer as PointerEvent).pointerType;
                    // console.log("pointer type: " + pointerType);

                    // collect width for touch and mouse strokes
                    let width = (pointer.nativePointer as PointerEvent).width;
                    outerThis.strokes.set(pointer.id, width);
                    // if (pointerType !== "pen") console.log("width: " + width);

                    // collect info for pen/stylus strokes
                    let pressure = (pointer.nativePointer as PointerEvent).pressure;
                    // if (pointerType === "pen") console.log("pressure: " + pressure);
                    let tiltX = (pointer.nativePointer as PointerEvent).tiltX;
                    // if (pointerType === "pen") console.log("tiltX: " + tiltX);
                    let tiltY = (pointer.nativePointer as PointerEvent).tiltY;
                    // if (pointerType === "pen") console.log("tiltY: " + tiltY);
                    let twist = (pointer.nativePointer as PointerEvent).twist;
                    // if (pointerType === "pen") console.log("twist: " + twist);
                    let tangentialPressue = (pointer.nativePointer as PointerEvent).tangentialPressure;
                    // if (pointerType === "pen") console.log("tangentialPressure: " + tangentialPressue);

                    // adjust stroke thickness for each input type if toolbar size slider isn't active
                    if (outerThis.strokeSize === -1) {
                        if (outerThis.toolStyle === "highlighter") {
                            outerThis.defaultStrokeSize = outerThis.highlighterStrokeSize;
                        } else {
                            outerThis.defaultStrokeSize = outerThis.nonHighlighterStrokeSize;
                        }
                        if (pointerType === 'pen') {
                            if (outerThis.defaultMousePressure > pressure) {
                                outerThis.context.lineWidth = outerThis.defaultStrokeSize - (2 * outerThis.defaultStrokeSize * (outerThis.defaultMousePressure - pressure));
                            } else if (outerThis.defaultMousePressure === pressure) {
                                outerThis.context.lineWidth = outerThis.defaultStrokeSize;
                            } else {
                                outerThis.context.lineWidth = outerThis.defaultStrokeSize + (2 * outerThis.defaultStrokeSize * (pressure - outerThis.defaultMousePressure));
                            }
                        } else if (pointerType === "touch") {
                            outerThis.context.lineWidth = outerThis.strokes.get(pointer.id);
                        } else {
                            // set mouse stroke width to default inking-canvas value
                            outerThis.context.lineWidth = outerThis.defaultStrokeSize;
                        }
                    } else {
                        // take stroke size defined by external influencer
                        outerThis.context.lineWidth = outerThis.strokeSize;
                    }

                    let previousX: number, previousY: number, currentX: number, currentY: number;

                    // translate pointer position if canvas has been resized/scaled & then draw the stroke
                    if (outerThis.origin) {

                        // TODO: find better way to handle pen/pointer events for Firefox
                        // make pen events in Firefox appear like mouse events since pressure appears 0 and width is super large
                        if (width > window.innerWidth) {
                            // console.log(width, pressure);
                            if (outerThis.strokeSize !== -1) {
                                outerThis.context.lineWidth = outerThis.strokeSize;
                            } else {
                                outerThis.context.lineWidth = outerThis.defaultStrokeSize;
                            }
                        }

                        let rect = outerThis.canvas.getBoundingClientRect();

                        // ensure stroke does not retrace any past data
                        outerThis.context.beginPath();

                        // determine location of the stroke's start
                        previousX = outerThis.getPosX(previous, rect);
                        previousY = outerThis.getPosY(previous, rect);
                        outerThis.context.moveTo(previousX, previousY);

                        // determine location of the stroke's end
                        if ('getCoalesced' in pointer.nativePointer) {
                            for (const point of pointer.getCoalesced()) {
                                currentX = outerThis.getPosX(point, rect);
                                currentY = outerThis.getPosY(point, rect);
                                outerThis.context.lineTo(currentX, currentY);
                            }
                        } else {
                            currentX = outerThis.getPosX(pointer, rect);
                            currentY = outerThis.getPosY(pointer, rect);
                            outerThis.context.lineTo(currentX, currentY);
                        }
                    }

                    if (outerThis.toolStyle === "pencil" && !outerThis.isStylusEraserActive(pointer)) {

                        // update the inking texture with the correct color
                        outerThis.context.fillStyle = outerThis.strokeColor;

                        // change up the stroke texture
                        Utils.drawPencilStroke(outerThis.context, previousX, currentX, previousY, currentY);

                    } else {

                        // update the stroke color (for no added texture)
                        outerThis.context.strokeStyle = outerThis.strokeColor;

                        // TODO: make stylus erase work in Firefox (which does not seem to detect the below button states for stylus input)
                        // handle pen/stylus erasing
                        if (outerThis.isStylusEraserActive(pointer)) {
                            console.log("eraser detected");
                            outerThis.context.strokeStyle = "white";
                            outerThis.context.globalCompositeOperation = "source-over";
                        }

                       // apply ink to canvas
                       outerThis.context.stroke();

                    }
                }
            }
        });
    }

    async copyCanvasContents() {
        try {
            if (!navigator.clipboard) {
                console.error("This browser does not yet support copying an image to the clipboard (cannot find navigator.clipboard)");
                this.dispatchEvent(this.getCanvasCopiedFailedEvent());
                return;
            }
            if ("ClipboardItem" in window) {
                const outerThis = this;
                this.canvas.toBlob(
                    async blob => { await (navigator.clipboard as any).write([
                        new (ClipboardItem as any)({
                            "image/png": blob
                        })
                    ]).then(function() {
                        console.log("Canvas contents copied successfully!");
                        let inkingCanvasCopied = new CustomEvent("inking-canvas-copied", { 
                            detail: { message: "Copied canvas to clipboard!" },
                            bubbles: true, 
                            composed: true });
                            outerThis.dispatchEvent(inkingCanvasCopied);
                    }, function (err) {
                        console.error("Could not copy " + outerThis.name + " canvas contents, " + err);
                        outerThis.dispatchEvent(outerThis.getCanvasCopiedFailedEvent());
                    })
                });
            } else {
                console.error("This browser does not yet support copying an image to the clipboard (using ClipboardItem in the Clipboard API)");
                this.dispatchEvent(this.getCanvasCopiedFailedEvent());
            }
        } catch (err) {
            console.error("This browser does not yet support copying an image to the clipboard. Error: " + err);
            this.dispatchEvent(this.getCanvasCopiedFailedEvent());
        }
    }

    async saveCanvasContents() {

        const options = {
            fileName: "InkingCanvasDrawing.png",
             // List of allowed MIME types, defaults to `*/*`.
            mimeTypes: ['image/*'],
            // List of allowed file extensions, defaults to `''`.
            extensions: ['png', 'jpg', 'jpeg'],
            // Set to `true` for allowing multiple files, defaults to `false`.
            multiple: true,
            description: 'Inking canvas image files',
        };

        const outerThis = this;
        this.canvas.toBlob(
            async blob => { 
                await fileSave(blob, options
            ).then( function() {
                console.log("Canvas contents downloaded successfully!");
            }, function (err) {
                console.error("Could not download " + outerThis.name + " canvas contents, " + err);
            })}
        );

    }

    private getCanvasCopiedFailedEvent() {
        return new CustomEvent("inking-canvas-copied", { 
            detail: { message: "Could not copy canvas to clipboard :(" },
            bubbles: true, 
            composed: true });
    }

    private cacheCanvasContents(event) {
        event.preventDefault();

        // update the recorded canvas aspect ratio for future resizing
        this.currentAspectRatio.width = this.canvas.width;
        this.currentAspectRatio.height = this.canvas.height;

        Utils.runAsynchronously( async () => { 
            let canvasContents = this.canvas.toDataURL();
            await set('canvasContents', canvasContents);
        });
    }

    private deleteCanvasContents() {
        Utils.runAsynchronously( async () => { 
            await del('canvasContents');
        });
    }

    static get styles() {
        return css`
            canvas {
                box-sizing: border-box;
                border: 4px solid black;
                position: absolute;
                min-height: ${this.minCanvasHeightCSS};
                min-width: ${this.minCanvasWidthCSS};
                touch-action: none;
                display: block;
            }
        `;
    }
}