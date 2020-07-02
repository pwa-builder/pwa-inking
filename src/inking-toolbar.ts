import {
    LitElement, html, customElement, property, css, query, CSSResult
} from 'lit-element';
import { InkingCanvas } from './inking-canvas';
import { InkingToolbarButtonStyles } from './inking-toolbar-button-styles';
import * as Colors from './colors';
import * as Utils from './utils';

@customElement('inking-toolbar')
export class InkingToolbar extends LitElement {

    // properties for toolbar and its dropdowns
    @property({type: String}) orientation: string = "";
    @property({type: String, attribute: "vertical"}) verticalAlignment: string = "";
    @property({type: String, attribute: "horizontal"}) horizontalAlignment: string = "";
    @query('#toolbar-container') private toolbarContainer: HTMLElement;
    @query('#tool-container') private toolContainer: HTMLElement;
    @property({type: NodeList}) private tools: Array<HTMLButtonElement>;
    @query("#default-toolbar-selection") private defaultToolbarSelection: HTMLDivElement;
    @property({type: HTMLButtonElement}) private selectedTool: Element;
    @query('#dropdown-container') private dropdownContainer: HTMLElement;
    @property({type: HTMLDivElement}) private selectedDropdown: HTMLDivElement;
    @query('.ink-dropdown') private inkDropdown: HTMLDivElement;
    @query('.ink-dropdown .title') private inkDropdownTitle: HTMLElement;
    @property({type: HTMLDivElement}) private selectedCircle: HTMLDivElement;
    @query('#erase-all') private eraseAllBtn: HTMLButtonElement;
    @query('.pen-pencil.palette') private penPencilPalette: HTMLElement;
    @query('.highlighter.palette') private highlighterPalette: HTMLElement;
    @query('#use-slider-size') private sliderCheckbox: HTMLInputElement;
    @query('.checkbox-track') private sliderCheckboxTrack: HTMLInputElement;
    @query('.on-text') private onText: HTMLElement;
    @query('.off-text') private offText: HTMLElement;
    @query('.slider') private slider: HTMLInputElement;
    private readonly defaultSliderSize = 24; 
    @query('.sineCanvas') private sineCanvas: HTMLCanvasElement;
    @property({ type: CanvasRenderingContext2D }) private sineContext: CanvasRenderingContext2D;
    @property({type: Boolean}) private isWaitingToDrawSineCanvas: boolean = false;
    @query("#snackbar") private snackbar: HTMLDivElement;

    // access colors used in toolbar
    private static colors: Map<string, CSSResult> = Colors.getColors();

    // properties to influence connected inking canvas
    @property({type: CSSResult}) private selectedPenColor: CSSResult = Colors.black;
    @property({type: CSSResult}) private selectedPenColorName: string = 'black';
    @property({type: Number}) private selectedPenSize: number = this.defaultSliderSize;
    @property({type: CSSResult}) private selectedPencilColor: CSSResult = Colors.black;
    @property({type: CSSResult}) private selectedPencilColorName: string = 'black';
    @property({type: Number}) private selectedPencilSize: number = this.defaultSliderSize;
    @property({type: CSSResult}) private selectedHighlighterColor: CSSResult = Colors.yellow;
    @property({type: CSSResult}) private selectedHighlighterColorName: string = 'yellow';
    @property({type: Number}) private selectedHighlighterSize: number = this.defaultSliderSize;
    @property({type: Number}) private eraserSize: number = this.defaultSliderSize;
    @property({type: String, attribute: "canvas"}) targetInkingCanvas: string = "";
    @property({type: InkingCanvas}) private inkingCanvas: InkingCanvas;

    constructor() {
        super();
    }

    render() {
        return html `
            <div id="toolbar-container">
                <div id="tool-container">
                    <slot @click="${this.clickedUtensil}"></slot>
                    <slot @click="${this.clickedUtensil}"></slot>
                    <slot @click="${this.clickedUtensil}"></slot>
                    <slot @click="${this.clickedUtensil}"></slot>
                    <slot @click="${this.clickedUtensil}"></slot>
                    <slot @click="${this.clickedUtensil}"></slot>
                    <div id="default-toolbar-selection">
                        <button id="pen" name="pen" class="toolbar-icon pen-icon tooltip" @click="${this.clickedUtensil}">
                            <span class="tooltip-text">Pen</span>
                        </button>
                        <button id="pencil" name="pencil" class="toolbar-icon pencil-icon tooltip" @click="${this.clickedUtensil}">
                            <span class="tooltip-text">Pencil</span>
                        </button>
                        <button id="highlighter" name="highlighter" class="toolbar-icon highlighter-icon tooltip" @click="${this.clickedUtensil}">
                            <span class="tooltip-text">Highlighter</span>
                        </button>
                        <button id="eraser" name="eraser" class="toolbar-icon eraser-icon tooltip" @click="${this.clickedUtensil}">
                            <span class="tooltip-text">Eraser</span>
                        </button>
                        <button id="copy" name="copy" class="toolbar-icon copy-icon tooltip" @click="${this.clickedCopy}">
                            <span class="tooltip-text">Copy</span>
                        </button>
                        <button id="save" name="save" class="toolbar-icon save-icon tooltip" @click="${this.clickedSave}">
                            <span class="tooltip-text">Save</span>
                        </button>
                    </div>
                </div>
                <div id="dropdown-container">
                    <div class="ink-dropdown">
                        <div class="title">Colors</div>
                        <div class="pen-pencil palette">
                            <button name="black" class="black circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Black</span>
                            </button>
                            <button name="white" class="white circle tooltip" tabindex="0" @click="${this.clickedColor}">
                                <span class="tooltip-text">White</span>
                            </button>
                            <button name="silver" class="silver circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Silver</span> 
                            </button>
                            <button name="gray" class="gray circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Gray</span> 
                            </button>
                            <button name="dark-gray" class="dark-gray circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Dark gray</span> 
                            </button>
                            <button name="charcoal" class="charcoal circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Charcoal</span> 
                            </button>
                            <button name="magenta" class="magenta circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Magenta</span> 
                            </button>
                            <button name="red" class="red circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Red</span> 
                            </button>
                            <button name="red-orange" class="red-orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Red-orange</span> 
                            </button>
                            <button name="orange" class="orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Orange</span> 
                            </button>
                            <button name="gold" class="gold circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Gold</span> 
                            </button>
                            <button name="yellow" class="yellow circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Yellow</span> 
                            </button>
                            <button name="grass-green" class="grass-green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Grass green</span> 
                            </button>
                            <button name="green" class="green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Green</span> 
                            </button>
                            <button name="dark-green" class="dark-green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Dark green</span> 
                            </button>
                            <button name="teal" class="teal circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Teal</span> 
                            </button>
                            <button name="blue" class="blue circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Blue</span> 
                            </button>
                            <button name="indigo" class="indigo circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Indigo</span> 
                            </button>
                            <button name="violet" class="violet circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Violet</span> 
                            </button>
                            <button name="purple" class="purple circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Purple</span> 
                            </button>
                            <button name="beige" class="beige circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Beige</span> 
                            </button>
                            <button name="light-brown" class="light-brown circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Light brown</span> 
                            </button>
                            <button name="brown" class="brown circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Brown</span> 
                            </button>
                            <button name="dark-brown" class="dark-brown circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Dark brown</span>
                            </button>
                            <button name="pastel-pink" class="pastel-pink circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel pink</span> 
                            </button>
                            <button name="pastel-orange" class="pastel-orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel orange</span> 
                            </button>
                            <button name="pastel-yellow" class="pastel-yellow circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel yellow</span> 
                            </button>
                            <button name="pastel-green" class="pastel-green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel green</span> 
                            </button>
                            <button name="pastel-blue" class="pastel-blue circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel blue</span> 
                            </button>
                            <button name="pastel-purple" class="pastel-purple circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel purple</span> 
                            </button>
                        </div>
                        <div class="highlighter palette">
                            <button name="yellow" class="yellow circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Yellow</span> 
                            </button>
                            <button name="green" class="green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Green</span> 
                            </button>
                            <button name="light-blue" class="light-blue circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Light blue</span> 
                            </button>
                            <button name="pink" class="pink circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pink</span> 
                            </button>
                            <button name="red-orange" class="red-orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Red-orange</span> 
                            </button>
                            <button name="violet" class="violet circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Violet</span> 
                            </button>
                        </div>
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="use-slider-size"></input>
                            <div class="checkbox-track"><span class="on-text">ON</span><span class="off-text show">OFF</span></div>
                            <label class="checkbox-wrapper" for="use-slider-size" name="use-slider-size"><p class="checkbox-text">Use slider size</p></label>
                        </div>
                        <canvas class="sineCanvas"></canvas>
                        <div class="slider-container">
                            <input type="range" min="1" max="48" @value="${this.defaultSliderSize}" class="slider" @input="${this.changeStrokeSize}">
                        </div>
                        <button id="erase-all" name="erase-all" @click="${this.clickedEraseAll}">Erase all ink</button>
                    </div>
                </div>
                <div id="snackbar"></div>
            </div>
        `;
    }

    firstUpdated() {
        
        // add any (last) detected inking canvas with matching name (TODO: handle multiple)
        this.connectCanvas();

        // set toolbar layout to developer's choice
        this.setOrientation();
        this.setVerticalAlignment();
        this.setHorizontalAlignment();

        // enable low-latency if possible
        this.sineContext = Utils.getLowLatencyContext(this.sineCanvas, "sine")

        // set canvas to use pointer event sizing by default
        this.slider.disabled = true;
        this.sliderCheckbox.checked = false;
        this.sliderCheckbox.addEventListener('change', () => this.toggleSliderCheckbox(), false);

        // support keyboard navigation for slider checkbox and handle
        this.sliderCheckbox.addEventListener("keydown", function(e: KeyboardEvent) {
            if (e.keyCode === 13) { // enter/return key
                this.click();
            }
        }, false);
        this.slider.addEventListener("keydown", () => function(e: KeyboardEvent) {
            if (e.keyCode === 37) { // left arrow key
                this.value -= 1;
            }
            else if (e.keyCode === 39) { // right arrow key
                this.value += 1;
            }
        }), false;

        // draw example stroke for ink dropdowns
        this.isWaitingToDrawSineCanvas = true;
        Utils.runAsynchronously( () => { 
            this.drawSineCanvas();
            console.log("Sine canvas drawn for first time");
        });
    }

    // expose ability to check active tool name
    getCurrentToolName() {
        return this.selectedTool.id;
    }

    // expose ability to get stroke color, size, & style

    getCurrentStrokeColor() {
        switch (this.selectedTool.id) {
            case "pen" :
                return this.selectedPenColor.toString();
                break;
            case "pencil" :
                return this.selectedPencilColor.toString();
                break;
            case "highlighter" :
                return this.selectedHighlighterColor.toString();
                break;
            case "eraser" :
                return Colors.white.toString();
                break;
            default:
                console.log("Could not find color value for selected utensil");
                break;
        }
    }

    getCurrentStrokeColorName() {
        switch (this.selectedTool.id) {
            case "pen" :
                return this.selectedPenColorName;
                break;
            case "pencil" :
                return this.selectedPencilColorName;
                break;
            case "highlighter" :
                return this.selectedHighlighterColorName;
                break;
            case "eraser" :
                return "white";
                break;
            default:
                console.log("Could not find color name for selected utensil");
                break;
        }
    }

    getCurrentStrokeSize() {
        switch (this.selectedTool.id) {
            case "pen" :
                return this.selectedPenSize;
                break;
            case "pencil" :
                return this.selectedPencilSize;
                break;
            case "highlighter" :
                return this.selectedHighlighterSize;
                break;
            case "eraser" :
                return this.eraserSize;
                break;
            default:
                console.log("Could not find stroke size for selected utensil");
                break;
        }
    }

    private setCurrentStrokeColor(color: CSSResult) {
        switch (this.selectedTool.id) {
            case "pen" :
                this.selectedPenColor = color;
                break;
            case "pencil" :
                this.selectedPencilColor = color;
                break;
            case "highlighter" :
                this.selectedHighlighterColor = color;
                break;
            case "eraser" :
                return Colors.white;
                break;
            default:
                console.log("Could not set color value for selected utensil");
                break;
        }
    }

    private setCurrentStrokeColorName(colorName: string) {
        switch (this.selectedTool.id) {
            case "pen" :
                this.selectedPenColorName = colorName;
                break;
            case "pencil" :
                this.selectedPencilColorName = colorName;
                break;
            case "highlighter" :
                this.selectedHighlighterColorName = colorName;
                break;
            case "eraser" :
                break;
            default:
                console.log("Could not set color name for selected utensil");
                break;
        }
    }

    private setCurrentStrokeSize() {
        switch (this.selectedTool.id) {
            case "pen" :
                this.selectedPenSize = parseInt(this.slider.value);
                break;
            case "pencil" :
                this.selectedPencilSize = parseInt(this.slider.value);
                break;
            case "highlighter" :
                this.selectedHighlighterSize = parseInt(this.slider.value);
                break;
            case "eraser" :
                this.eraserSize = parseInt(this.slider.value);
                break;
            default:
                console.log("Could not set stroke size for selected utensil");
                break;
        }
    }

    // expose ability to trigger additional sine canvas redraws
    requestDrawSineCanvas() {
        if (!this.isWaitingToDrawSineCanvas) {
            this.isWaitingToDrawSineCanvas = true;
        }
    }

    private connectCanvas() {

        // find matching inking canvas
        const possibleCanvas = this.shadowRoot.host.parentElement;
        if ((<InkingCanvas>possibleCanvas).name === this.targetInkingCanvas) {
            this.inkingCanvas = <InkingCanvas>possibleCanvas;
        }

        // attach events to matching inking canvas
        if (this.inkingCanvas) {

            // make toolbar appear when connected to an inking canvas
            this.toolbarContainer.classList.add("show");

            // hide dropdown once inking starts
            this.inkingCanvas.addEventListener('inking-started', () => {
                Utils.hideElementIfVisible(this.inkDropdown);
            }, false);

            // redraw example stroke with new size when inking canvas resizes
            this.inkingCanvas.addEventListener('inking-canvas-drawn', () => {
                this.requestDrawSineCanvas();
            }, false);

            // provide visual status of copy clicks
            this.inkingCanvas.addEventListener('inking-canvas-copied', ( e: CustomEvent ) => {
                this.flashSnackbar(e.detail.message);
            }, false);

            // set up default toolbar if no tool selection was specified
            if (!this.tools && this.children.length === 0) {
                this.tools = Array.from(this.toolContainer.querySelectorAll("button"));
                this.defaultToolbarSelection.classList.add("show");
            }
        }
    }

    // expose method to children tools so they can add themselves to the toolbar once they load
    addToolbarButton(inkingToolbarButton: any, customElementName: string) {
        inkingToolbarButton = this.querySelector(customElementName);
        if (inkingToolbarButton) {
            let tool = inkingToolbarButton.shadowRoot.querySelector("button");
            if (tool) {
                if (!this.tools) this.tools = new Array<HTMLButtonElement>();
                this.tools.push(tool);
                if (this.children.length === this.tools.length) {
                    // done welcoming last tool, so set toolbar layout to developer's choice
                    this.setOrientation();
                    this.setVerticalAlignment();
                    this.setHorizontalAlignment();  
                }
            }
        }
    }

    private setOrientation() {

        // default choice is "horizontal"

        if (this.orientation === "vertical") {
            
            if (this.toolbarContainer) this.toolbarContainer.classList.add("vertical-orientation");
            if (this.toolContainer) this.toolContainer.classList.add("vertical-orientation");
            if (this.dropdownContainer) this.dropdownContainer.classList.add("vertical-orientation");
 
            if (this.tools) {
                this.tools.forEach(tool => {
                    tool.classList.add('vertical-orientation');
                });
            }
        }
        else {
            if (this.tools) {
                this.tools.forEach(tool => {
                    tool.classList.add('horizontal-orientation');
                });
            }
        }
    }

    private setVerticalAlignment() {

        // default choice/setting is "top"

        switch (this.verticalAlignment) {
            case "":
                break;
            case "top":
                break;
            case "center":
                if (this.toolbarContainer) this.toolbarContainer.classList.add("vertical-center");
                if (this.dropdownContainer) this.dropdownContainer.classList.add("vertical-center");
                break;
            case "bottom":
                if (this.toolbarContainer) this.toolbarContainer.classList.add("bottom");
                if (this.dropdownContainer) this.dropdownContainer.classList.add("bottom");
                break;
            default:
                console.log("Could not set vertical toolbar alignment");
        }
    }

    private setHorizontalAlignment() {

        // default choice/setting is "left"

        switch (this.horizontalAlignment) {
            case "":
                if (this.tools) {
                    this.tools.forEach(tool => {
                        tool.classList.add("left");
                    });
                }
                break;
            case "left":
                this.tools.forEach(tool => {
                    tool.classList.add("left");
                });
                break;
            case "center":
                if (this.toolbarContainer) this.toolbarContainer.classList.add("horizontal-center");
                if (this.dropdownContainer) this.dropdownContainer.classList.add("horizontal-center");
                if (this.tools) {
                    this.tools.forEach(tool => {
                        tool.classList.add("center");
                    });
                }
                break;
            case "right":
                if (this.toolbarContainer) this.toolbarContainer.classList.add("right");
                if (this.dropdownContainer)this.dropdownContainer.classList.add("right");
                if (this.tools) {
                    this.tools.forEach(tool => {
                        tool.classList.add("right");
                    });
                }
                break;
            default:
                console.log("Could not set horizontal toolbar alignment");
        }
    }

    private async drawSineCanvas() {
        if (this.isWaitingToDrawSineCanvas && this.sineCanvas.classList.contains("show")) {

            // toggle semaphore to prevent unnecessary redraws
            this.isWaitingToDrawSineCanvas = false;

            // resize sine canvas with high resolution
            let rect = this.sineCanvas.getBoundingClientRect();
            if (rect.height !== 0 && rect.width !== 0 ) {
                this.sineCanvas.height = rect.height * devicePixelRatio;
                this.sineCanvas.width = rect.width * devicePixelRatio;
            }

            // define stroke size and pen color for new sine wave

            // TODO: find better way to scale strokeWidth based on different inking canvas and sine canvas aspect ratios
            let aspectRatioCorrection = 1.15;

            let strokeWidth = parseInt(this.slider.value) * this.inkingCanvas.getScale() * aspectRatioCorrection;
            this.sineContext.lineWidth = strokeWidth;
            this.sineContext.strokeStyle = this.getCurrentStrokeColor();

            // clear canvas for new sine wave
            this.sineContext.clearRect(0, 0, this.sineCanvas.width, this.sineCanvas.height);
            this.sineContext.fillStyle = Colors.colorPaletteBackground.toString();
            this.sineContext.fillRect(0, 0, this.sineCanvas.width, this.sineCanvas.height);

            // make the stroke points round
            this.sineContext.lineCap = 'round';
            this.sineContext.lineJoin = 'round';

            let w = this.sineCanvas.width;

            // determine vertical center of sine wave in canvas
            let h = this.sineCanvas.height/2;

            let a = h/2; // amplitude (height of wave)
            let f = 1; // frequency (1 wave)

            // formula for sine wave is:
                    // y = a * sin( ( 2 * pi * (frequency/timePeriod) * x ) + offsetFromOrigin)
                // where timePeriod is width of canvas & offsetFromOrigin is 0
                     // and x & y are the coordinates we want to draw on

            // start drawing the sine wave at an horizontal offset so it doesn't appear clipped off
            let x = strokeWidth;

            // vertically center start of the output by subtracting
                // the sine wave y calcualation from h (half the canvas height)
            let previousY = h - (a * Math.sin(2 * Math.PI * f/w * x));
            let currentY: number;

            // calibrate sine wave rotation calcuations to center results in canvas
            let rotationDegrees = 354;
            let offsetY = a/2 + (360 - rotationDegrees);
            let offsetX = -5 * devicePixelRatio;

            let strokesDrawn = 0;

            // draw the sine wave until just before the canvas ends to avoid clipping off end
            for (let i = strokeWidth/2 + 1; i < w - strokeWidth/2 - 1; i++) {

                this.sineContext.beginPath(); 
            
                let rotatedX1 = (x * Math.cos(rotationDegrees * Math.PI/180)) - (previousY * Math.sin(rotationDegrees * Math.PI/180));
                let rotatedY1 = (previousY * Math.cos(rotationDegrees * Math.PI/180)) + (x * Math.sin(rotationDegrees * Math.PI/180));

                // this.sineContext.moveTo(x,previousY);
                this.sineContext.moveTo(rotatedX1 + offsetX, rotatedY1 + offsetY);

                x = i;
                currentY = h - (a * Math.sin(2 * Math.PI * f/w * x));
                
                let rotatedX2 = (x * Math.cos(rotationDegrees * Math.PI/180)) - (currentY * Math.sin(rotationDegrees * Math.PI/180));
                let rotatedY2 = (currentY * Math.cos(rotationDegrees * Math.PI/180)) + (x * Math.sin(rotationDegrees * Math.PI/180));

                // this.sineContext.lineTo(x, currentY);
                this.sineContext.lineTo(rotatedX2 + offsetX, rotatedY2 + offsetY);

                previousY = currentY;

                if (this.selectedTool.id === "pencil") {
                    this.sineContext.fillStyle = this.sineContext.strokeStyle;
                    // Utils.drawPencilStroke(this.sineContext, x-1, x, previousY, currentY);
                    Utils.drawPencilStroke(this.sineContext, rotatedX1 + offsetX, rotatedX2 + offsetX, rotatedY1 + offsetY, rotatedY2 + offsetY);
                } else {
                    this.sineContext.stroke();
                }
                strokesDrawn++;
            }
            // console.log("sineCanvas strokes drawn: " + strokesDrawn);
        }

        // start & continue sine wave drawing loop
        Utils.runAsynchronously( () => { 
            requestAnimationFrame(async () => this.drawSineCanvas());
        });
    }

    private clickedUtensil(e: Event) {
        let utensil = <Element>e.target;
        if (utensil.id === "") {
            utensil = utensil.shadowRoot.firstElementChild;
            if (utensil.classList.contains("copy-icon")) {
                this.clickedCopy();
                return;
            } else if (utensil.classList.contains("save-icon")) {
                this.clickedSave();
                return;
            }
        }
        console.log(utensil.id + " button clicked!");
        this.updateSelectedTool(utensil);
    }

    private clickedEraseAll(e: Event) {
        let eraser = (<HTMLButtonElement>e.target);
        console.log(eraser.id + " has been clicked!");
        Utils.runAsynchronously( () => {
            this.inkingCanvas.eraseAll();
        });
        this.selectedTool = eraser;
    }

    private clickedColor(event: Event) {

        // find clicked color grid element through its class
        let selectedCircle = (<HTMLDivElement>event.target);
        let colorClass = selectedCircle.className.replace("clicked", "").replace("circle", "").replace("tooltip", "").trim();

        // get color string from css color
        let colorName = Utils.toCamelCase(colorClass);
        let backgroundColor = InkingToolbar.colors.get(colorName);

        this.changeInkingColor(backgroundColor, colorName);

        this.updateSliderColor(colorClass);

        this.updateCheckboxColor();

        if (this.sineCanvas) {
            this.requestDrawSineCanvas();
        }

        this.updateSelectedColor(selectedCircle);
    }

    private clickedCopy() {
        try {
            if (this.inkingCanvas) {
                this.inkingCanvas.copyCanvasContents();
            } else {
                console.error("Cannot copy - inking canvas not connected");
                this.flashSnackbar("Could not copy canvas to clipboard :(");
            }
        } catch (err) {
            console.error(err);
        }
    }

    private clickedSave() {
        try {
            if (this.inkingCanvas) {
                this.inkingCanvas.saveCanvasContents();
            } else {
                console.error("Cannot save - inking canvas not connected");
            }
        } catch (err) {
            console.error(err);
        }
    }

    private flashSnackbar(message: string) {
        this.snackbar.textContent = message;
        this.snackbar.classList.add("show");
        setTimeout(() => { 
            this.snackbar.classList.remove("show");
        }, 3000);
    }

    private isUtensil(tool: string) {
        return (tool === "pen" || tool === "pencil" 
        || tool === "highlighter" || tool === "eraser");
    }

    private updateSelectedTool(selectedTool: Element) {
        if (selectedTool !== this.selectedTool) {
            if (this.isUtensil(selectedTool.id)) {
                this.switchUtensil(selectedTool);
                this.changeInkingColor();
            }
            this.inkingCanvas.setStrokeStyle(this.selectedTool.id);
        } else {
            this.selectedDropdown.classList.toggle("show");
        }
    }

    private switchUtensil(el: Element) {
        let utensilName = el.id;
        if (utensilName === "highlighter") {
            this.inkDropdownTitle.classList.add("show");            
            this.togglePalette(this.penPencilPalette, this.highlighterPalette);
            Utils.hideElementIfVisible(this.eraseAllBtn);
        } else if (utensilName === "eraser") {
            Utils.hideElementIfVisible(this.inkDropdownTitle);                
            Utils.hideElementIfVisible(this.penPencilPalette);
            Utils.hideElementIfVisible(this.highlighterPalette);
            if (!this.eraseAllBtn.classList.contains("show")) 
                this.eraseAllBtn.classList.add("show");
        } else  {  // must be pen or pencil
            this.inkDropdownTitle.classList.add("show");            
            this.togglePalette(this.highlighterPalette, this.penPencilPalette);
            Utils.hideElementIfVisible(this.eraseAllBtn);
        }
        this.toggleDropdown(this.inkDropdown, el === this.selectedTool);
        this.toggleActiveTool(el);
    }

    private toggleActiveTool(lastClickedTool: Element) {
        if (this.selectedTool !== lastClickedTool) {

            if (this.selectedTool && this.selectedTool.classList.contains('clicked')) {

                // remove the color class which should be the last and 6th class
                this.selectedTool.classList.remove(this.selectedTool.classList[5]);

                this.selectedTool.classList.remove('clicked');
            }

            this.selectedTool = lastClickedTool;           
            this.selectedTool.classList.add('clicked');
        
            if (this.isUtensil(this.selectedTool.id)) {

                // use the css friendly color class name with dashes
                let colorName = Utils.toDash(this.getCurrentStrokeColorName());

                this.selectedTool.classList.add(colorName);

                let selectedCircle: HTMLDivElement;
                if (this.selectedTool.id === "highlighter") {
                    selectedCircle = this.inkDropdown.querySelector('.ink-dropdown .highlighter .' + colorName);
                } else {
                    selectedCircle = this.inkDropdown.querySelector('.ink-dropdown .pen-pencil .' + colorName);
                }
                this.updateSelectedColor(selectedCircle);

                // update slider appearance to match saved utensil settings
                this.updateSliderColor(colorName);
                this.updateSliderSize();
                this.updateCheckboxColor();
            }
        }
    }

    private toggleSliderCheckbox() {
        this.updateCheckboxColor();
        this.slider.disabled = !this.slider.disabled;
        this.sineCanvas.classList.toggle("show");
        this.slider.classList.toggle("show");
        this.onText.classList.toggle("show");
        this.offText.classList.toggle("show");
        this.changeStrokeSize();
    }

    private togglePalette(old: HTMLElement, current?: HTMLElement) {
        Utils.hideElementIfVisible(old);
        if (current && !current.classList.contains("show")) {
            current.classList.add("show");
        }
    }

    private toggleDropdown(selectedDropdown: HTMLDivElement, isLastElementClicked: boolean) {
        if (this.selectedDropdown && this.selectedDropdown === selectedDropdown) {
            if (this.selectedDropdown.classList.contains("show") && isLastElementClicked) {
                this.selectedDropdown.classList.remove("show");
            } else {
                this.selectedDropdown.classList.add("show");
            }
        } else {
            this.selectedDropdown = selectedDropdown;
            this.selectedDropdown.classList.add("show");
        }
    }

    private changeInkingColor(color?: CSSResult, colorName?: string) {
        if (this.inkingCanvas) {        

            if (color) this.setCurrentStrokeColor(color);
            if (colorName) this.setCurrentStrokeColorName(colorName);

            if (this.selectedTool && this.selectedTool.classList.contains('clicked')) {

                // remove the color class
                if (this.selectedTool.classList[5] !== "clicked") {
                    this.selectedTool.classList.remove(this.selectedTool.classList[5]);
                } else {
                    this.selectedTool.classList.remove(this.selectedTool.classList[6]);
                }

                // use the css friendly color class name with dashes
                let modifiedColorName = Utils.toDash(this.getCurrentStrokeColorName());

                this.selectedTool.classList.add(modifiedColorName);
            }
            this.inkingCanvas.setStrokeColor(this.getCurrentStrokeColor());
        }
    }

    private changeStrokeSize() {
        if (this.inkingCanvas) {
            if (this.slider.disabled) {
                this.inkingCanvas.setStrokeSize(-1); 
            } else  {
                this.setCurrentStrokeSize();
                this.inkingCanvas.setStrokeSize(this.getCurrentStrokeSize());
                if (this.sineCanvas) {
                    this.requestDrawSineCanvas();
                }
            }
        }
    }

    private updateSelectedColor(selectedCircle: HTMLDivElement) {
        if (this.selectedCircle !== selectedCircle) {
            if (this.selectedCircle && this.selectedCircle.classList.contains("clicked")) {
                this.selectedCircle.classList.remove("clicked");
            }
            this.selectedCircle = selectedCircle;
            this.selectedCircle.classList.add("clicked");
        }
    }

    private updateCheckboxColor() {
        if (this.sliderCheckboxTrack) {
            let color = Utils.toDash(this.getCurrentStrokeColorName());
            if (this.sliderCheckboxTrack.classList.length > 1) {
                    this.sliderCheckboxTrack.classList.remove(this.sliderCheckboxTrack.classList[1]);
                    if (this.sliderCheckbox.checked) 
                        this.sliderCheckboxTrack.classList.add(color);
            } else if (this.sliderCheckbox.checked) {
                this.sliderCheckboxTrack.classList.add(color);
            }
        }
    }

    private updateSliderColor(colorClass: string) {
        if (this.slider) {
            if (this.slider.classList.length > 1) {
                if (this.slider.classList[1] === "show") {
                    this.slider.classList.remove(this.slider.classList[2]);
                } else {
                    this.slider.classList.remove(this.slider.classList[1]);
                }
            }
            this.slider.classList.add(colorClass);
        }
    }

    private updateSliderSize() {
        if (this.slider) {
            this.slider.value = this.getCurrentStrokeSize().toString();
            this.changeStrokeSize();
        }
    }

    static get styles() {
        return  [
            InkingToolbarButtonStyles,
            css `
                #toolbar-container {
                    position: absolute;
                    display: none;
                    margin: 6px;
                }
                #toolbar-container.show {
                    display: inline-block;
                }
                #toolbar-container.vertical-center {
                    bottom: 50%;
                }
                #toolbar-container.bottom {
                    bottom: 0;
                    margin-bottom: 8px; // TODO: update to fit dev specified canvas border width
                }
                #toolbar-container.horizontal-center {
                    right: 50%;
                }
                #toolbar-container.right {
                    right: 0;
                }
                #toolbar-container.vertical-orientation.right {
                    margin-right: 7px; // TODO: update to fit dev specified canvas border width
                }
                #tool-container {
                    background-color: ${Colors.white};
                    border: 2px solid ${Colors.white};
                    border-bottom: 0px solid ${Colors.white};
                    display: inline-block;
                }
                #tool-container.vertical-orientation {
                    vertical-align: top;
                    margin: 2px 0px 2px 2px; /* no gap between right of tool and dropdown */ 
                    border-bottom: 2px solid ${Colors.white};
                    border-right: 0px solid ${Colors.white};
                }
                #default-toolbar-selection {
                    display: none;
                }
                #default-toolbar-selection.show {
                    display: block;
                }
                #dropdown-container {
                    background-color: ${Colors.colorPaletteBackground};
                    width: 320px;
                    margin: 1px;
                    margin-top: 3px;
                    position: absolute;
                }
                #dropdown-container.vertical-orientation {
                    display: inline-block;
                    margin-left: 3px;
                }
                #dropdown-container.right {
                    right: 0;
                    margin-right: 2px; // TODO: update to fit dev specified canvas border width
                }
                #dropdown-container.vertical-orientation.right {
                    margin-right: 54px; // TODO: update to fit dev specified canvas border width
                }
                #dropdown-container.vertical-center {
                    top: 100%;
                }
                #dropdown-container.vertical-orientation.vertical-center {
                    top: 0;
                }
                #dropdown-container.bottom {
                    bottom: 0;
                    margin-top: 0;
                    margin-bottom: 56px; // TODO: update to fit dev specified canvas border width
                }
                #dropdown-container.vertical-orientation.bottom {
                    margin-bottom: 4px;
                }
                // @media screen and (max-width: 400px) {
                //     #dropdown-container {
                //         width: 270px;
                //     }
                //     #dropdown-container.vertical-orientation {
                //         width: 220px;
                //     }
                // }
                .ink-dropdown {
                    display: none;
                    padding: 10px;
                    padding-bottom: 15px;
                    font-family: sans-serif;
                    font-size: 16px;
                }
                .ink-dropdown.show {
                    display: block;
                }
                .palette {
                    display: none;
                    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
                    grid-auto-rows: minmax(25px, auto);
                    justify-items: center;
                    align-items: center;
                    justify-content: center;
                    align-content: center;
                    border: 5px solid transparent;
                }
                .palette.show {
                    display: grid;
                }
                .sineCanvas {
                    height: 100px;
                    width: 100%;
                    max-height: 150px;
                    background-color: transparent;
                    padding-left: 0;
                    padding-right: 0;
                    padding-bottom: 17px; /* TODO: find better to prevent slider cutoff */
                    margin-left: auto;
                    margin-right: auto;
                    display: none;
                }
                .sineCanvas.show {
                    display: block;
                }
                .checkbox-wrapper {
                    position: relative;
                    width: 65px;
                    height: 30px;
                }
                .checkbox-wrapper input {
                    width: 65px;
                    height: 30px;
                    margin: 0 auto;
                    position: absolute;
                    opacity: 0;
                }
                .checkbox-wrapper input:focus-visible {
                    opacity: 1;
                    outline: 2px solid currentColor;
                }
                .checkbox-text {
                    position: relative;
                    top: 7px;
                    margin-left: 75px;
                    white-space: nowrap;
                }
                .checkbox-track {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: ${Colors.darkGray};
                    border-radius: 20px;
                    transition: all 0.2s ease;
                    color: ${Colors.white};
                }
                .checkbox-track::after {
                    position: absolute;
                    content: "";
                    width: 20px;
                    height: 20px;
                    background-color: ${Colors.white};
                    border-radius: 50%;
                    border: 4px solid ${Colors.darkGray};
                    top: 1px;
                    left: 1px;
                    transition: all 0.2s ease;
                }
                input:checked + .checkbox-track.white::after {
                    background-color: ${Colors.silver};
                    border-color: ${Colors.white};
                }
                .checkbox-track.black::after {
                    border-color: ${Colors.black};
                }
                .checkbox-track.silver::after {
                    border-color: ${Colors.silver};
                }
                .checkbox-track.gray::after {
                    border-color: ${Colors.gray};
                }
                .checkbox-track.dark-gray::after {
                    border-color: ${Colors.darkGray};
                }
                .checkbox-track.charcoal::after {
                    border-color: ${Colors.charcoal};
                }
                .checkbox-track.magenta::after {
                    border-color: ${Colors.magenta};
                }
                .checkbox-track.red::after {
                    border-color: ${Colors.red};
                }
                .checkbox-track.red-orange::after {
                    border-color: ${Colors.redOrange};
                }
                .checkbox-track.orange::after {
                    border-color: ${Colors.orange};
                }
                .checkbox-track.gold::after {
                    border-color: ${Colors.gold};
                }
                .checkbox-track.yellow::after {
                    border-color: ${Colors.yellow};
                }
                .checkbox-track.grass-green::after {
                    border-color: ${Colors.grassGreen};
                }
                .checkbox-track.green::after {
                    border-color: ${Colors.green};
                }
                .checkbox-track.dark-green::after {
                    border-color: ${Colors.darkGreen};
                }
                .checkbox-track.teal::after {
                    border-color: ${Colors.teal};
                }
                .checkbox-track.blue::after {
                    border-color: ${Colors.blue};
                }
                .checkbox-track.indigo::after {
                    border-color: ${Colors.indigo};
                }
                .checkbox-track.purple::after {
                    border-color: ${Colors.purple};
                }
                .checkbox-track.violet::after {
                    border-color: ${Colors.violet};
                }
                .checkbox-track.beige::after {
                    border-color: ${Colors.beige};
                }
                .checkbox-track.light-brown::after {
                    border-color: ${Colors.lightBrown};
                }
                .checkbox-track.brown::after {
                    border-color: ${Colors.brown};
                }
                .checkbox-track.dark-brown::after {
                    border-color: ${Colors.darkBrown};
                }
                .checkbox-track.pastel-pink::after {
                    border-color: ${Colors.pastelPink};
                }
                .checkbox-track.pastel-orange::after {
                    border-color: ${Colors.pastelOrange};
                }
                .checkbox-track.pastel-yellow::after {
                    border-color: ${Colors.pastelYellow};
                }
                .checkbox-track.pastel-green::after {
                    border-color: ${Colors.pastelGreen};
                }
                .checkbox-track.pastel-blue::after {
                    border-color: ${Colors.pastelBlue};
                }
                .checkbox-track.pastel-purple::after {
                    border-color: ${Colors.pastelPurple};
                }
                .checkbox-track.light-blue::after {
                    border-color: ${Colors.lightBlue};
                }
                .checkbox-track.pink::after {
                    border-color: ${Colors.pink};
                }
                input:checked + .checkbox-track {
                    background-color: ${Colors.darkGreen};
                }
                input:checked + .checkbox-track.black {
                    background-color: ${Colors.black};
                    border-color: ${Colors.black};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.white {
                    background-color: ${Colors.white};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.silver {
                    background-color: ${Colors.silver};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.gray {
                    background-color: ${Colors.gray};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.dark-gray {
                    background-color: ${Colors.darkGray};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.charcoal {
                    background-color: ${Colors.charcoal};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.magenta {
                    background-color: ${Colors.magenta};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.red {
                    background-color: ${Colors.red};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.red-orange {
                    background-color: ${Colors.redOrange};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.orange {
                    background-color: ${Colors.orange};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.gold {
                    background-color: ${Colors.gold};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.yellow {
                    background-color: ${Colors.yellow};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.grass-green {
                    background-color: ${Colors.grassGreen};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.green {
                    background-color: ${Colors.green};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.dark-green {
                    background-color: ${Colors.darkGreen};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.teal {
                    background-color: ${Colors.teal};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.blue {
                    background-color: ${Colors.blue};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.indigo {
                    background-color: ${Colors.indigo};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.purple {
                    background-color: ${Colors.purple};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.violet {
                    background-color: ${Colors.violet};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.beige {
                    background-color: ${Colors.beige};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.light-brown {
                    background-color: ${Colors.lightBrown};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.brown {
                    background-color: ${Colors.brown};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.dark-brown {
                    background-color: ${Colors.darkBrown};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track.pastel-pink {
                    background-color: ${Colors.pastelPink};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.pastel-orange {
                    background-color: ${Colors.pastelOrange};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.pastel-yellow {
                    background-color: ${Colors.pastelYellow};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.pastel-green {
                    background-color: ${Colors.pastelGreen};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.pastel-blue {
                    background-color: ${Colors.pastelBlue};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.pastel-purple {
                    background-color: ${Colors.pastelPurple};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.light-blue {
                    background-color: ${Colors.lightBlue};
                    color: ${Colors.black};
                }
                input:checked + .checkbox-track.pink {
                    background-color: ${Colors.pink};
                    color: ${Colors.white};
                }
                input:checked + .checkbox-track:before {
                    top: 5px;
                }
                input:checked + .checkbox-track:after {
                    transform: translateX(35px);
                }
                .on-text {
                    position: absolute;
                    top: 9px;
                    left: 12px;
                    font-size: 12px;
                    display: none;
                }
                .on-text.show {
                    display: inline;
                }
                .off-text {
                    position: absolute;
                    top: 9px;
                    left: 30px;
                    font-size: 12px; 
                    display: none;
                }
                .off-text.show {
                    display: inline;
                }
                input[type="range"] {
                    margin: auto;
                }
                input[type="range"]:focus:not(:focus-visible) {
                    border: none;
                }
                input[type="range"]:focus-visible {
                    box-shadow: 0px 0px 0px 2px currentColor;
                }
                .slider-container {
                    width: 100%;
                    padding-bottom: 8px;
                }
                .slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 2px;
                    margin-bottom: 10px;
                    background-color: gray;
                    outline: none;
                    opacity: 0.7;
                    -webkit-transition: .2s;
                    transition: opacity .2s;
                    display: none;
                }
                .slider.show {
                    display: inline-block;
                }
                .slider:hover {
                    opacity: 1;
                }
                /* prevent Firefox from adding extra styling on focused slider */
                input[type=range]::-moz-focus-outer {
                    border: 0;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 10px;
                    height: 25px;
                    border-radius: 5px;
                    border: none;
                    cursor: pointer;
                }
                input[type="range"]:focus:not(:focus-visible)::-webkit-slider-thumb {
                    border: none;
                }
                input[type="range"]:focus-visible::-webkit-slider-thumb {
                    border: 2px solid currentColor;
                }
                input[type="range"]::-moz-range-thumb {
                    width: 10px;
                    height: 25px;
                    border: none;
                    cursor: pointer;
                }
                .slider.black::-webkit-slider-thumb {
                    background-color: ${Colors.black};
                }  
                .slider.black::-moz-range-thumb {
                    background-color: ${Colors.black};
                }
                .slider.white::-webkit-slider-thumb {
                    background-color: ${Colors.white};
                }        
                .slider.white::-moz-range-thumb {
                    background-color: ${Colors.white};
                }
                .slider.silver::-webkit-slider-thumb {
                    background-color: ${Colors.silver};
                }             
                .slider.silver::-moz-range-thumb {
                    background-color: ${Colors.silver};
                }
                .slider.gray::-webkit-slider-thumb {
                    background-color: ${Colors.gray};
                }               
                .slider.gray::-moz-range-thumb {
                    background-color: ${Colors.gray};
                }
                .slider.dark-gray::-webkit-slider-thumb {
                    background-color: ${Colors.darkGray};
                }              
                .slider.dark-gray::-moz-range-thumb {
                    background-color: ${Colors.darkGray};
                }
                .slider.charcoal::-webkit-slider-thumb {
                    background-color: ${Colors.charcoal};
                }      
                .slider.charcoal::-moz-range-thumb {
                    background-color: ${Colors.charcoal};
                }
                .slider.magenta::-webkit-slider-thumb {
                    background-color: ${Colors.magenta};
                }    
                .slider.magenta::-moz-range-thumb {
                    background-color: ${Colors.magenta};
                }
                .slider.red::-webkit-slider-thumb {
                    background-color: ${Colors.red};
                }    
                .slider.red::-moz-range-thumb {
                    background-color: ${Colors.red};
                }
                .slider.red-orange::-webkit-slider-thumb {
                    background-color: ${Colors.redOrange};
                }            
                .slider.red-orange::-moz-range-thumb {
                    background-color: ${Colors.redOrange};
                }
                .slider.orange::-webkit-slider-thumb {
                    background-color: ${Colors.orange};
                }      
                .slider.orange::-moz-range-thumb {
                    background-color: ${Colors.orange};
                }
                .slider.gold::-webkit-slider-thumb {
                    background-color: ${Colors.gold};
                }      
                .slider.gold::-moz-range-thumb {
                    background-color: ${Colors.gold};
                }
                .slider.yellow::-webkit-slider-thumb {
                    background-color: ${Colors.yellow};
                }      
                .slider.yellow::-moz-range-thumb {
                    background-color: ${Colors.yellow};
                }
                .slider.grass-green::-webkit-slider-thumb {
                    background-color: ${Colors.grassGreen};
                }      
                .slider.grass-green::-moz-range-thumb {
                    background-color: ${Colors.grassGreen};
                }            
                .slider.green::-webkit-slider-thumb {
                    background-color: ${Colors.green};
                }      
                .slider.green::-moz-range-thumb {
                    background-color: ${Colors.green};
                }            
                .slider.dark-green::-webkit-slider-thumb {
                    background-color: ${Colors.darkGreen};
                }      
                .slider.dark-green::-moz-range-thumb {
                    background-color: ${Colors.darkGreen};
                }            
                .slider.teal::-webkit-slider-thumb {
                    background-color: ${Colors.teal};
                }      
                .slider.teal::-moz-range-thumb {
                    background-color: ${Colors.teal};
                }            
                .slider.blue::-webkit-slider-thumb {
                    background-color: ${Colors.blue};
                }      
                .slider.blue::-moz-range-thumb {
                    background-color: ${Colors.blue};
                }            
                .slider.indigo::-webkit-slider-thumb {
                    background-color: ${Colors.indigo};
                }      
                .slider.indigo::-moz-range-thumb {
                    background-color: ${Colors.indigo};
                }
                .slider.violet::-webkit-slider-thumb {
                    background-color: ${Colors.violet};
                }      
                .slider.violet::-moz-range-thumb {
                    background-color: ${Colors.violet};
                }
                .slider.purple::-webkit-slider-thumb {
                    background-color: ${Colors.purple};
                }      
                .slider.purple::-moz-range-thumb {
                    background-color: ${Colors.purple};
                }
                .slider.beige::-webkit-slider-thumb {
                    background-color: ${Colors.beige};
                }      
                .slider.beige::-moz-range-thumb {
                    background-color: ${Colors.beige};
                }
                .slider.light-brown::-webkit-slider-thumb {
                    background-color: ${Colors.lightBrown};
                }      
                .slider.light-brown::-moz-range-thumb {
                    background-color: ${Colors.lightBrown};
                }
                .slider.brown::-webkit-slider-thumb {
                    background-color: ${Colors.brown};
                }      
                .slider.brown::-moz-range-thumb {
                    background-color: ${Colors.brown};
                }
                .slider.dark-brown::-webkit-slider-thumb {
                    background-color: ${Colors.darkBrown};
                }      
                .slider.dark-brown::-moz-range-thumb {
                    background-color: ${Colors.darkBrown};
                }
                .slider.pastel-pink::-webkit-slider-thumb {
                    background-color: ${Colors.pastelPink};
                }      
                .slider.pastel-pink::-moz-range-thumb {
                    background-color: ${Colors.pastelPink};
                }
                .slider.pastel-orange::-webkit-slider-thumb {
                    background-color: ${Colors.pastelOrange};
                }      
                .slider.pastel-orange::-moz-range-thumb {
                    background-color: ${Colors.pastelOrange};
                }
                .slider.pastel-yellow::-webkit-slider-thumb {
                    background-color: ${Colors.pastelYellow};
                }      
                .slider.pastel-yellow::-moz-range-thumb {
                    background-color: ${Colors.pastelYellow};
                }
                .slider.pastel-green::-webkit-slider-thumb {
                    background-color: ${Colors.pastelGreen};
                }      
                .slider.pastel-green::-moz-range-thumb {
                    background-color: ${Colors.pastelGreen};
                }
                .slider.pastel-blue::-webkit-slider-thumb {
                    background-color: ${Colors.pastelBlue};
                }      
                .slider.pastel-blue::-moz-range-thumb {
                    background-color: ${Colors.pastelBlue};
                }
                .slider.pastel-purple::-webkit-slider-thumb {
                    background-color: ${Colors.pastelPurple};
                }      
                .slider.pastel-purple::-moz-range-thumb {
                    background-color: ${Colors.pastelPurple};
                }
                .slider.light-blue::-webkit-slider-thumb {
                    background-color: ${Colors.lightBlue};
                }      
                .slider.light-blue::-moz-range-thumb {
                    background-color: ${Colors.lightBlue};
                }
                .slider.pink::-webkit-slider-thumb {
                    background-color: ${Colors.pink};
                }      
                .slider.pink::-moz-range-thumb {
                    background-color: ${Colors.pink};
                }

                #snackbar {
                    visibility: hidden;
                    min-width: 250px;
                    margin-left: -125px; /* Divide value of min-width by 2 */
                    background-color: ${Colors.colorPaletteBackground};
                    color: ${Colors.black};
                    font-size: 16px;
                    font-family: sans-serif;
                    text-align: center;
                    border-radius: 2px;
                    padding: 16px;
                    position: fixed;
                    z-index: 1;
                    left: 50%;
                    bottom: 30px;
                }          
                #snackbar.show {
                    visibility: visible;
                    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
                    animation: fadein 0.5s, fadeout 0.5s 2.5s;
                }
                @-webkit-keyframes fadein {
                    from {bottom: 0; opacity: 0;}
                    to {bottom: 30px; opacity: 1;}
                }
                @keyframes fadein {
                    from {bottom: 0; opacity: 0;}
                    to {bottom: 30px; opacity: 1;}
                }
                @-webkit-keyframes fadeout {
                    from {bottom: 30px; opacity: 1;}
                    to {bottom: 0; opacity: 0;}
                }
                @keyframes fadeout {
                    from {bottom: 30px; opacity: 1;}
                    to {bottom: 0; opacity: 0;}
                }
            `,
        ]
    }
}