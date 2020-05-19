import {
    LitElement, html, customElement, property, css, query
} from 'lit-element';
import { get, set , del } from 'idb-keyval';
import PointerTracker from 'pointer-tracker';

// acknowledge mouse input baseline to establish pressure-controlled pen stroke size
const defaultMousePressure: number = 0.5;

declare let ClipboardItem;

@customElement('inking-canvas')
export class InkingCanvas extends LitElement {

    // all properties used to manage the canvas object
    @query('canvas') private canvas: HTMLCanvasElement;
    @property({ type: CanvasRenderingContext2D }) private context: CanvasRenderingContext2D;

    // all properties immediately customizable by developer
    @property({type: Number, attribute: "height"}) canvasHeight: number = -1;
    @property({type: Number, attribute: "width"}) canvasWidth: number = -1;
    @property({type: String, attribute: "name"}) name: string = "";

    // all properties used to manage canvas resizing
    @property({type: Object}) private isWaitingToResize: boolean = false;
    @property({type: Object}) private currentAspectRatio: {width: number, height: number};
    @property({type: Number}) private scale: number = 1;
    @property({type: Object}) private origin: {x: number, y: number};

    // all properties used by PointerTracker implementation
    @property({type: Map}) private strokes: Map<number, number>;
    @property({type: PointerTracker}) private tracker: PointerTracker;

    // record most recent stroke size signalled by inking toolbar
    @property({type: Number}) private strokeSize: number = -1;

    // default toolbar inking utensil selection
    @property({type: String}) private toolStyle: string = "pen";
    @property({type: String}) private strokeColor: string = "black";

    render() {
        return html`
            <canvas></canvas>
        `;
    }
    constructor() {
        super();
    }

    firstUpdated() {

        // TODO: put this somewhere else later
        this.deleteCanvasContents();

        // establish canvas w & h, low-latency, stroke shape, starting image, etc
        (window as any).requestIdleCallback(async () => {
            this.setUpCanvas();
        });

        // equip canvas to handle & adapt to external resizing
        window.addEventListener('resize', () => this.requestCanvasResize(), false);

        // refresh canvas when browser tab was switched and is re-engaged
        window.addEventListener('focus', () => this.requestCanvasResize(), false);

        // set up input capture events
        (window as any).requestIdleCallback(async () => {
            this.setUpPointerTrackerEvents();
        });

    }
    
    async setUpCanvas() {

        // TODO: fix canvas filling parent edge cases
        if (this.canvasWidth !== -1) {
            this.canvas.width = this.canvasWidth;
        } else {
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
        this.currentAspectRatio = {width: this.canvas.width, height: this.canvas.height}; 

        // enable low-latency if possible
        this.context = (this.canvas.getContext('2d', {
            desynchronized: true
          }) as CanvasRenderingContext2D);
    
        // check for low-latency
        if ("getContextAttributes" in this.context && (this.context as any).getContextAttributes().desynchronized) {
        console.log('Low latency is supported for inking canvas.');
        } else {
        console.log('Low latency is NOT supported for inking canvas.');
        }
    
        this.requestCanvasResize();
        (window as any).requestIdleCallback( async () => {
            this.resizeCanvas();
        });
    }

    // expose change pen color API for toolbar and presenter
    changeUtensilColor(color: string) {
        if (this.context) this.strokeColor = color;
    }

    // expose change stroke size API for toolbar and presenter
    changeStrokeSize(strokeSize: number) {
        if (this.context) this.strokeSize = strokeSize;
    }

    // expose ability to change stroke layering depending on selected utensil
    changeToolStyle(toolStyle: string) {
        if (this.context) {
            this.toolStyle = toolStyle;
            switch (toolStyle) {
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

    getScale() {
        return this.scale;
    }

    requestCanvasResize() {
        if (!this.isWaitingToResize) {
            this.isWaitingToResize = true;
        }
    }

    // TODO: find better way to limit calls
    async resizeCanvas() {

        if (this.context && this.isWaitingToResize) {

            // toggle semaphore
            this.isWaitingToResize = false;

            (window as any).requestIdleCallback(async () => {
                this.clearCanvas();
            });

            // reload canvas with previous canvas state
            (window as any).requestIdleCallback(async () => {
                const outerThis = this;
                const canvasContents = await (get('canvasContents') as any);
                if (canvasContents) {
                    console.log("loading canvas contents");
                    const tempImage = new Image();
                    tempImage.onload = () => {
                        outerThis.context.drawImage(tempImage, 0, 0);
                    }
                    tempImage.src = canvasContents;
                }
            });

            console.log("canvas was resized");
        }

        // start & continue canvas resize loop
        (window as any).requestIdleCallback( () => {
            requestAnimationFrame( async () => this.resizeCanvas());
        });
    }

    async clearCanvas() {

        if (this.canvasHeight == -1) {
            this.canvas.height = this.canvas.offsetHeight;
        }
        if (this.canvasWidth == -1) {
            this.canvas.width = this.canvas.offsetWidth;
        }

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

    eraseAll() {
        (window as any).requestIdleCallback( () => {
            this.clearCanvas()
            this.deleteCanvasContents();
        }); 
    }

    async setUpPointerTrackerEvents() {
        this.strokes = new Map();
        const outerThis = this;     
        this.tracker = new PointerTracker(this.canvas, {
            start(pointer, event) {
                // console.log("current start event pressure: " + (pointer.nativePointer as PointerEvent).pressure);
                event.preventDefault();
                outerThis.strokes.set(pointer.id, (pointer.nativePointer as PointerEvent).width);
                // console.log("pointer added");
                return true;          
            },
            async end(pointer, event) {
                outerThis.strokes.delete(pointer.id);
                // console.log("pointer deleted");

                // save snapshot of canvas to redraw if window resizes/refreshes
                outerThis.saveCanvasContents(event);
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

                    // collect pressure for pen strokes
                    let pressure = (pointer.nativePointer as PointerEvent).pressure;
                    // if (pointerType === "pen") console.log("pressure: " + pressure);

                    let tiltX = (pointer.nativePointer as PointerEvent).tiltX;
                    if (pointerType === "pen") console.log("tiltX: " + tiltX);

                    let tiltY = (pointer.nativePointer as PointerEvent).tiltY;
                    if (pointerType === "pen") console.log("tiltY: " + tiltY);

                    let twist = (pointer.nativePointer as PointerEvent).twist;
                    if (pointerType === "pen") console.log("twist: " + twist);

                    let tangentialPressue = (pointer.nativePointer as PointerEvent).tangentialPressure;
                    if (pointerType === "pen") console.log("tangentialPressure: " + tangentialPressue);

                    // adjust stroke thickness for each input type if toolbar size slider isn't active
                    if (outerThis.strokeSize === -1) {
                        if (pointerType === 'pen') {
                            if (defaultMousePressure > pressure) {
                                outerThis.context.lineWidth = 1.5 - (defaultMousePressure - pressure);
                            } else if (defaultMousePressure === pressure) {
                                outerThis.context.lineWidth = 1.5;
                            }else {
                                let scaledMultiplier = 50 * (pressure - defaultMousePressure);
                                let adjustedPressure = 1.5 + (scaledMultiplier * (pressure - defaultMousePressure));
                                // console.log("adjustedPressure: " + adjustedPressure);
                                outerThis.context.lineWidth = adjustedPressure;
                            }
                            // console.log("lineWidth for pen: " + outerThis.context.lineWidth);
                        } else {
                            // adjust stroke width for mouse & touch
                            outerThis.context.lineWidth = outerThis.strokes.get(pointer.id);
                            // console.log("lineWidth for " + pointerType + ": " + outerThis.context.lineWidth);
                        }
                    } else {
                        outerThis.context.lineWidth = outerThis.strokeSize;
                        // console.log("current stroke width defined by slider is: " + outerThis.context.lineWidth);
                    }

                    let previousX: number, previousY: number, currentX: number, currentY: number;

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
                    } else { 

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

                    } else {

                        // handle pen/stylus erasing
                        if ((pointer.nativePointer as PointerEvent).buttons === 32 || (pointer.nativePointer as PointerEvent).button === 5) {
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
    // TODO: put in helper class/file
    drawPencilStroke(context: CanvasRenderingContext2D, previousX: number, currentX: number, previousY: number, currentY: number) {
        
        // record context properties before modifying
        let strokeColor = context.strokeStyle;
        let strokeLayer = context.globalCompositeOperation;
        let strokeWidth = context.lineWidth;
        let opacity = context.globalAlpha;

        // use the distance formula to calcuate the line length between the two points on the canvas
        let distance  = Math.round(Math.sqrt(Math.pow(currentX - previousX, 2)+Math.pow(currentY - previousY, 2)));
        // console.log("distance: "+ distance);

        // split length into incremental pieces
        let stepX = (currentX - previousX)/distance;
        let stepY = (currentY - previousY)/distance;
        
        for (let i = 0; i < distance; i++ ) {

            let currentX = previousX + (i * stepX);	
            let currentY = previousY + (i * stepY);
            
            // create light base for whole stroke width as a first layer
            context.globalAlpha = 0.7;
            let randomX = currentX + ((Math.random()-0.5) * strokeWidth * 1);			
            let randomY = currentY + ((Math.random()-0.5) * strokeWidth * 1);
            context.fillRect(randomX, randomY, Math.random() + 2, Math.random() + 1);
            
            // thicken center of stroke with a second more opaque layer
            context.globalAlpha = 1;
            randomX = currentX + ((Math.random()-0.5) * strokeWidth * 0.8);			
            randomY = currentY + ((Math.random()-0.5) * strokeWidth * 0.8);
            context.fillRect(randomX, randomY, Math.random() + 2, Math.random() +1 );
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

        (window as any).requestIdleCallback(async () => {
            let canvasContents = this.canvas.toDataURL();
            await set('canvasContents', canvasContents);
        });
    }
    deleteCanvasContents() {
        (window as any).requestIdleCallback(async () => {
            await del('canvasContents');
        });  
    }
    static get styles() {
        return css`
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
}