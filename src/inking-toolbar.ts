import {
    LitElement, html, customElement, property, css, query, CSSResult
} from 'lit-element';
import { InkingCanvas } from './inking-canvas';
import * as Colors from './colors';
import * as Utils from './utils';

@customElement('inking-toolbar')
export class InkingToolbar extends LitElement {

    // properties for toolbar and its dropdowns
    @property({type: String}) orientation: string = "";
    @query('#toolbar-container') private toolbarContainer: HTMLElement;
    @query('#tool-container') private toolContainer: HTMLElement;
    @property({type: HTMLButtonElement}) private selectedTool: HTMLButtonElement;
    @query('#dropdown-container') private dropdownContainer: HTMLElement;
    @property({type: HTMLDivElement}) private selectedDropdown: HTMLDivElement;
    @query('.ink-dropdown') private inkDropdown: HTMLDivElement;
    @query('.ink-dropdown .title') private inkDropdownTitle: HTMLElement;
    @property({type: HTMLDivElement}) private selectedCircle: HTMLDivElement;
    @query('#erase-all') private eraseAllBtn: HTMLButtonElement;
    @query('.pen-pencil.palette') private penPencilPalette: HTMLElement;
    @query('.highlighter.palette') private highlighterPalette: HTMLElement;
    @query('#checkbox') private sliderCheckbox: HTMLInputElement;
    @query('.checkbox-track') private sliderCheckboxTrack: HTMLInputElement;
    @query('.on-text') private onText: HTMLElement;
    @query('.off-text') private offText: HTMLElement;
    @query('.slider') private slider: HTMLInputElement;
    private readonly defaultSliderSize = 24; 
    @query('.sineCanvas') private sineCanvas: HTMLCanvasElement;
    @property({ type: CanvasRenderingContext2D }) private sineContext: CanvasRenderingContext2D;
    @property({type: Boolean}) private isWaitingToDrawSineCanvas: boolean = false;

    // access colors used in toolbar
    private static colors: Map<string, CSSResult> = Colors.getColors();

    // properties to influence connected inking canvas
    @property({type: CSSResult}) private selectedPenColor: CSSResult = Colors.black;
    @property({type: CSSResult}) private selectedPenColorName: string = 'black';
    @property({type: Number}) private selectedPenSize: number = this.defaultSliderSize;
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
                    <button id="pen" class="toolbar-icon pen-icon" @click="${this.clickedUtensil}"></button>
                    <button id="highlighter" class="toolbar-icon highlighter-icon" @click="${this.clickedUtensil}"></button>
                    <button id="eraser" class="toolbar-icon eraser-icon" @click="${this.clickedUtensil}"></button>
                </div>
                <div id="dropdown-container">
                    <div class="ink-dropdown">
                        <div class="title">Colors</div>
                        <div class="pen-pencil palette">
                            <div class="black circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Black</span>
                            </div>
                            <div class="white circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">White</span>
                            </div>
                            <div class="silver circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Silver</span> 
                            </div>
                            <div class="gray circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Gray</span> 
                            </div>
                            <div class="dark-gray circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Dark gray</span> 
                            </div>
                            <div class="charcoal circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Charcoal</span> 
                            </div>
                            <div class="magenta circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Magenta</span> 
                            </div>
                            <div class="red circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Red</span> 
                            </div>
                            <div class="red-orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Red-orange</span> 
                            </div>
                            <div class="orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Orange</span> 
                            </div>
                            <div class="gold circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Gold</span> 
                            </div>
                            <div class="yellow circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Yellow</span> 
                            </div>
                            <div class="grass-green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Grass green</span> 
                            </div>
                            <div class="green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Green</span> 
                            </div>
                            <div class="dark-green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Dark green</span> 
                            </div>
                            <div class="teal circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Teal</span> 
                            </div>
                            <div class="blue circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Blue</span> 
                            </div>
                            <div class="indigo circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Indigo</span> 
                            </div>
                            <div class="violet circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Violet</span> 
                            </div>
                            <div class="purple circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Purple</span> 
                            </div>
                            <div class="beige circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Beige</span> 
                            </div>
                            <div class="light-brown circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Light brown</span> 
                            </div>
                            <div class="brown circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Brown</span> 
                            </div>
                            <div class="dark-brown circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Dark brown</span>
                            </div>
                            <div class="pastel-pink circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel pink</span> 
                            </div>
                            <div class="pastel-orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel orange</span> 
                            </div>
                            <div class="pastel-yellow circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel yellow</span> 
                            </div>
                            <div class="pastel-green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel green</span> 
                            </div>
                            <div class="pastel-blue circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel blue</span> 
                            </div>
                            <div class="pastel-purple circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pastel purple</span> 
                            </div>
                        </div>
                        <div class="highlighter palette">
                            <div class="yellow circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Yellow</span> 
                            </div>
                            <div class="green circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Green</span> 
                            </div>
                            <div class="light-blue circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Light blue</span> 
                            </div>
                            <div class="pink circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Pink</span> 
                            </div>
                            <div class="red-orange circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Red-orange</span> 
                            </div>
                            <div class="violet circle tooltip" @click="${this.clickedColor}">
                                <span class="tooltip-text">Violet</span> 
                            </div>
                        </div>
                        <div class="checkbox-label">
                            <input type="checkbox" id="checkbox"></input>
                            <div class="checkbox-track"><span class="on-text">ON</span><span class="off-text show">OFF</span></div>
                            <label class="checkbox-label" for="checkbox" name="toggle"><p class="checkbox-label-text">Use slider size</p></label>
                        </div>
                        <canvas class="sineCanvas"></canvas>
                        <div class="slider-container">
                            <input type="range" min="1" max="48" @value="${this.defaultSliderSize}" class="slider" @input="${this.changeStrokeSize}">
                        </div>
                        <button id="erase-all" @click="${this.clickedEraseAll}">Erase all ink</button>
                    </div>
                </div>
            </div>
        `;
    }

    firstUpdated() {
        
        // add any (last) detected inking canvas with matching name (TODO: handle multiple)
        this.connectCanvas();

        // set toolbar orientation to developer's choice
        this.setOrientation();

        // enable low-latency if possible
        this.sineContext = Utils.getLowLatencyContext(this.sineCanvas, "sine canvas")

        // set canvas to use pointer event sizing by default
        this.slider.disabled = true;
        this.sliderCheckbox.checked = false;
        this.sliderCheckbox.addEventListener('change', () => this.toggleSliderCheckbox(), false);

        // draw example stroke for ink dropdowns
        this.isWaitingToDrawSineCanvas = true;
        Utils.runAsynchronously( () => { 
            this.drawSineCanvas();
            console.log("sine canvas drawn for first time");
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
            case "highlighter" :
                return this.selectedHighlighterColor.toString();
                break;
            case "eraser" :
                return Colors.white.toString();
                break;
            default:
                console.log("could not find color value for selected utensil");
                break;
        }
    }

    getCurrentStrokeColorName() {
        switch (this.selectedTool.id) {
            case "pen" :
                return this.selectedPenColorName;
                break;
            case "highlighter" :
                return this.selectedHighlighterColorName;
                break;
            case "eraser" :
                return "white";
                break;
            default:
                console.log("could not find color name for selected utensil");
                break;
        }
    }

    getCurrentStrokeSize() {
        switch (this.selectedTool.id) {
            case "pen" :
                return this.selectedPenSize;
                break;
            case "highlighter" :
                return this.selectedHighlighterSize;
                break;
            case "eraser" :
                return this.eraserSize;
                break;
            default:
                console.log("could not find stroke size for selected utensil");
                break;
        }
    }

    private setCurrentStrokeColor(color: CSSResult) {
        switch (this.selectedTool.id) {
            case "pen" :
                this.selectedPenColor = color;
                break;
            case "highlighter" :
                this.selectedHighlighterColor = color;
                break;
            case "eraser" :
                return Colors.white;
                break;
            default:
                console.log("could not set color value for selected utensil");
                break;
        }
    }

    private setCurrentStrokeColorName(colorName: string) {
        switch (this.selectedTool.id) {
            case "pen" :
                this.selectedPenColorName = colorName;
                break;
            case "highlighter" :
                this.selectedHighlighterColorName = colorName;
                break;
            case "eraser" :
                break;
            default:
                console.log("could not set color name for selected utensil");
                break;
        }
    }

    private setCurrentStrokeSize() {
        switch (this.selectedTool.id) {
            case "pen" :
                this.selectedPenSize = parseInt(this.slider.value);
                break;
            case "highlighter" :
                this.selectedHighlighterSize = parseInt(this.slider.value);
                break;
            case "eraser" :
                this.eraserSize = parseInt(this.slider.value);
                break;
            default:
                console.log("could not set stroke size for selected utensil");
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
            this.inkingCanvas.addEventListener('inking-canvas-resized', () => {
                this.requestDrawSineCanvas();
            }, false);

        }
    }

    private setOrientation() {

        // default choice is "horizontal"

        let tools = this.toolContainer.querySelectorAll('button');
        if (this.orientation === "vertical") {
            
            this.toolContainer.classList.add("vertical-orientation");
            this.dropdownContainer.classList.add("vertical-orientation");
 
            tools.forEach(tool => {
                tool.classList.add('vertical-orientation');
            });
            
            const lastTool = this.toolContainer.querySelector("button:last-child");
            lastTool.classList.add("vertical-orientation");
        }
        else {
            tools.forEach(tool => {
                tool.classList.add('horizontal-orientation');
            });
        }
    }

    private async drawSineCanvas() {
        if (this.isWaitingToDrawSineCanvas && this.sineCanvas.classList.contains("show")) {

            // toggle semaphore to prevent unnecessary redraws
            this.isWaitingToDrawSineCanvas = false;

            // define stroke size and pen color for new sine wave
            let strokeWidth = parseInt(this.slider.value) * this.inkingCanvas.getScale() / devicePixelRatio;
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

            let strokesDrawn = 0;

            // draw the sine wave until just before the canvas ends to avoid clipping off end
            for(let i = strokeWidth; i < w - strokeWidth; i++){
                this.sineContext.beginPath();    
                this.sineContext.moveTo(x,previousY);
                x = i;
                currentY = h - (a * Math.sin(2 * Math.PI * f/w * x));      
                this.sineContext.lineTo(x, currentY);
                previousY = currentY;

                if (this.selectedTool.id === "pencil") {
                    Utils.drawPencilStroke(this.sineContext, x-1, x, previousY, currentY);
                } else {
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
        let utensil = <HTMLButtonElement>e.target;
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

    // clickedCopy() {
    //     if (this.inkingCanvas) {
    //         this.inkingCanvas.copyCanvasContents();
    //     } else {
    //         console.log("cannot copy - inking canvas not connected");
    //     }
    // }

    private isUtensil(tool: string) {
        return (tool === "pen" || tool === "pencil" 
        || tool === "highlighter" || tool === "eraser");
    }

    private updateSelectedTool(selectedTool: HTMLButtonElement) {
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

    private switchUtensil(el: HTMLButtonElement) {
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

    private toggleActiveTool(lastClickedTool: HTMLButtonElement) {
        if (this.selectedTool !== lastClickedTool) {

            if (this.selectedTool && this.selectedTool.classList.contains('clicked')) {

                // remove the color class which should be the last and 5th class
                this.selectedTool.classList.remove(this.selectedTool.classList[4]);

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

                // remove the color class which should be the last and 5th class
                this.selectedTool.classList.remove(this.selectedTool.classList[4]);

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
        return css `
            #toolbar-container {
                position: relative;
                display: none;
                margin: 2px;
            }
            #toolbar-container.show {
                display: inline-block;
            }
            #tool-container {
                background-color: ${Colors.white};
                border: 2px solid ${Colors.white};
                border-bottom: 0px solid ${Colors.white};
                margin: 2px;
                display: inline-block;
            }
            #tool-container.vertical-orientation {
                vertical-align: top;
                margin: 2px 0px 2px 2px; /* no gap between right of tool and dropdown */ 
                border-bottom: 2px solid ${Colors.white};
                border-right: 0px solid ${Colors.white};
            }
            button {
                position: relative;
            }
            /* prevent Firefox from adding extra styling on focused button */
            button::-moz-focus-inner {
                border: 0;
            }
            button.toolbar-icon {
                background-color: ${Colors.white};
                outline: none;
                border: 2px solid ${Colors.white};
                border-radius: 0px;
            }
            button.vertical-orientation {
                display: block;
                margin-bottom: 4px;
            }
            button:last-child.vertical-orientation {
                display: block;
                margin-bottom: 0px;
            }
            button#erase-all {
                border: none;
                outline: none;
                display: none;
                width: 100%;
                min-width: 200px;
                background-color: ${Colors.lightGray};
                padding: 25px;
                margin-top: 25px;
                font-family: sans-serif;
                font-size: 16px;
            }
            button#erase-all.show {
                display: inline-block;
            }
            button:hover.toolbar-icon {
                border-color: ${Colors.gray};
                background-color: ${Colors.lightGray};
            }
            button:hover#erase-all {
                background-color: ${Colors.silver};
            }  
            .toolbar-icon {
                height: 53px;
                width: 53px;
                background-size: 50px 50px;
                background-repeat: no-repeat;
                background-position: 0px 0px;
            }
            .title {
                display: none;
                padding-bottom: 10px;
            }
            .title.show {
                display: block;
            }
            .pen-icon {
                background-image: url("https://raw.githubusercontent.com/pwa-builder/pwa-inking/master/assets/icons/toolbar_icons/v1/ic_pen.svg");
            }
            .pencil-icon {
                background-image: url("https://raw.githubusercontent.com/pwa-builder/pwa-inking/master/assets/icons/toolbar_icons/v1/ic_pencil.svg");
            }
            .highlighter-icon {
                background-image: url("https://raw.githubusercontent.com/pwa-builder/pwa-inking/master/assets/icons/toolbar_icons/v1/ic_highlighter.svg");
            }
            .eraser-icon {
                background-image: url("https://raw.githubusercontent.com/pwa-builder/pwa-inking/master/assets/icons/toolbar_icons/v1/ic_eraser.svg");
            }
            .ruler-icon {
                background-image: url("https://raw.githubusercontent.com/pwa-builder/pwa-inking/master/assets/icons/toolbar_icons/v1/ic_ruler.svg");
            }
            .copy-icon {
                background-image: url("https://raw.githubusercontent.com/pwa-builder/pwa-inking/master/assets/icons/toolbar_icons/v1/ic_copy.svg");
            }
            .save-icon {
                background-image: url("https://raw.githubusercontent.com/pwa-builder/pwa-inking/master/assets/icons/toolbar_icons/v1/ic_save.svg");
            }
            #dropdown-container {
                background-color: ${Colors.colorPaletteBackground};
                width: 320px;
                margin-left: 2px;
            }
            #dropdown-container.vertical-orientation {
                display: inline-block;
                margin-left: 0px;
                margin-top: 2px;
            }
            @media screen and (max-width: 400px) {
                #dropdown-container {
                    width: 270px;
                }
                #dropdown-container.vertical-orientation {
                    width: 220px;
                }
            }
            .ink-dropdown {
                display: none;
                padding: 10px;
                font-family: sans-serif;
                font-size: 16px;
            }
            .ink-dropdown.show {
                display: block;
            }
            .palette {
                display: none;
                grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
                grid-auto-rows: minmax(25px, auto);
                justify-items: center;
                align-items: center;
                justify-content: center;
                align-content: center;
                padding-bottom: 15px;
            }
            .palette.show {
                display: grid
            }
            .tooltip {
                position: relative;
                display: inline-block;
            }
            .tooltip-text {
                visibility: hidden;
                background-color: ${Colors.colorPaletteBackground};
                color: ${Colors.black};
                border: 1px solid ${Colors.silver};
                text-align: center;
                font-size: 14px;
                white-space: nowrap;
                padding: 5px;
                border-radius: 5px;
                position: absolute;
                z-index: 1;
                bottom: 125%;
                left: 50%;
                transform: translateX(-50%);
                transition: none;
            }
            .tooltip:hover .tooltip-text {
                visibility: visible;
                transition: visibility 0.3s ease-out 0.6s;
            }
            .circle {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                box-sizing: border-box;
                border: 2px solid ${Colors.colorPaletteBackground};
                margin: 7px;
                transition: all 0.1s ease;
            }
            .circle:hover {
                border: 2px solid ${Colors.red}; /* this color should be overridden by proper color class below */
                transition: all 0.1s ease;
            }
            .circle:hover.black {
                border-color: ${Colors.black};
            }
            .circle:hover.white {
                border-color: ${Colors.white};
            }
            .circle:hover.silver {
                border-color: ${Colors.silver};
            }
            .circle:hover.gray {
                border-color: ${Colors.gray};
            }
            .circle:hover.dark-gray {
                border-color: ${Colors.darkGray};
            }
            .circle:hover.charcoal {
                border-color: ${Colors.charcoal};
            }
            .circle:hover.magenta {
                border-color: ${Colors.magenta};
            }
            .circle:hover.red {
                border-color: ${Colors.red};
            }
            .circle:hover.red-orange {
                border-color: ${Colors.redOrange};
            }
            .circle:hover.orange {
                border-color: ${Colors.orange};
            }
            .circle:hover.gold {
                border-color: ${Colors.gold};
            }
            .circle:hover.yellow {
                border-color: ${Colors.yellow};
            }
            .circle:hover.grass-green {
                border-color: ${Colors.grassGreen};
            }
            .circle:hover.green {
                border-color: ${Colors.green};
            }
            .circle:hover.dark-green {
                border-color: ${Colors.darkGreen};
            }
            .circle:hover.teal {
                border-color: ${Colors.teal};
            }
            .circle:hover.blue {
                border-color: ${Colors.blue};
            }
            .circle:hover.indigo {
                border-color: ${Colors.indigo};
            }
            .circle:hover.violet {
                border-color: ${Colors.violet};
            }
            .circle:hover.purple {
                border-color: ${Colors.purple};
            }
            .circle:hover.beige {
                border-color: ${Colors.beige};
            }
            .circle:hover.light-brown {
                border-color: ${Colors.lightBrown};
            }
            .circle:hover.brown {
                border-color: ${Colors.brown};
            }
            .circle:hover.dark-brown {
                border-color: ${Colors.darkBrown};
            }
            .circle:hover.pastel-pink {
                border-color: ${Colors.pastelPink};
            }
            .circle:hover.pastel-orange {
                border-color: ${Colors.pastelOrange};
            }
            .circle:hover.pastel-yellow {
                border-color: ${Colors.pastelYellow};
            }
            .circle:hover.pastel-green {
                border-color: ${Colors.pastelGreen};
            }
            .circle:hover.pastel-blue {
                border-color: ${Colors.pastelBlue};
            }
            .circle:hover.pastel-purple {
                border-color: ${Colors.pastelPurple};
            }
            .circle:hover.light-blue {
                border-color: ${Colors.lightBlue};
            }
            .circle:hover.pink {
                border-color: ${Colors.pink};
            }
            .circle.clicked, .circle.clicked:hover {
                border: 2px solid ${Colors.colorPaletteBackground};
                box-shadow: 0px 0px 0px 2px black;
                transition: all 0.2s ease;
            }
            .circle.black {                
                background-color: ${Colors.black};
            }            
            .circle.white {              
                background-color: ${Colors.white};
            }
            .circle.silver {            
                background-color: ${Colors.silver};
            }
            .circle.gray {            
                background-color: ${Colors.gray};
            }
            .circle.dark-gray {               
                background-color: ${Colors.darkGray};
            }
            .circle.charcoal {               
                background-color: ${Colors.charcoal};
            }
            .circle.magenta {              
                background-color: ${Colors.magenta};
            }
            .circle.red {
                background-color: ${Colors.red};
            }
            .circle.red-orange {
                background-color: ${Colors.redOrange};
            }
            .circle.orange {
                background-color: ${Colors.orange};
            }
            .circle.gold {
                background-color: ${Colors.gold};
            }
            .circle.yellow {
                background-color: ${Colors.yellow};
            }
            .circle.grass-green {
                background-color: ${Colors.grassGreen};
            }
            .circle.green {
                background-color: ${Colors.green};
            }
            .circle.dark-green {
                background-color: ${Colors.darkGreen};
            }
            .circle.teal {
                background-color: ${Colors.teal};
            }
            .circle.blue {
                background-color: ${Colors.blue};
            }
            .circle.indigo {
                background-color: ${Colors.indigo};
            }
            .circle.violet {
                background-color: ${Colors.violet};
            }
            .circle.purple {
                background-color: ${Colors.purple};
            }
            .circle.beige {
                background-color: ${Colors.beige};
            }
            .circle.light-brown {
                background-color: ${Colors.lightBrown};
            }
            .circle.brown {
                background-color: ${Colors.brown};
            }
            .circle.dark-brown {
                background-color: ${Colors.darkBrown};
            }
            .circle.pastel-pink {
                background-color: ${Colors.pastelPink};
            }
            .circle.pastel-orange {
                background-color: ${Colors.pastelOrange};
            }
            .circle.pastel-yellow {
                background-color: ${Colors.pastelYellow};
            }
            .circle.pastel-green {
                background-color: ${Colors.pastelGreen};
            }
            .circle.pastel-blue {
                background-color: ${Colors.pastelBlue};
            }
            .circle.pastel-purple {
                background-color: ${Colors.pastelPurple};
            }
            .circle.light-blue {
                background-color: ${Colors.lightBlue};
            }
            .circle.pink {
                background-color: ${Colors.pink};
            }
            .sineCanvas {
                height: 50%;
                width: 100%;
                max-height: 150px;
                background-color: transparent;
                padding-left: 0;
                padding-right: 0;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: 10px;
                display: none;
            }
            .sineCanvas.show {
                display: block;
            }
            .checkbox-label {
                position: relative;
                display: block;
                width: 65px;
                height: 30px;
                margin-bottom: 15px;
            }
            .checkbox-label input {
                display: none;
            }
            .checkbox-label-text {
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
            .slider-checkbox-track.charcoal::after {
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
            .slider-container {
                width: 100%;
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
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 10px;
                height: 25px;
                border-radius: 5px;
                border: none;
                cursor: pointer;
            }
            .slider::-moz-range-thumb {
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

            /* change tool color on selection (horizontal orientation) */

            button.clicked.black.horizontal-orientation {
                border-bottom-color: ${Colors.black};
                box-shadow: 0 3px 0px 0px ${Colors.black};
            }  
            button.clicked.white.horizontal-orientation {
                border-bottom-color: ${Colors.white};
                box-shadow: 0 3px 0px 0px ${Colors.white};
            }        
            button.clicked.silver.horizontal-orientation {
                border-bottom-color: ${Colors.silver};
                box-shadow: 0 3px 0px 0px ${Colors.silver};
            }             
            button.clicked.gray.horizontal-orientation {
                border-bottom-color: ${Colors.gray};
                box-shadow: 0 3px 0px 0px ${Colors.gray};
            }               
            button.clicked.dark-gray.horizontal-orientation {
                border-bottom-color: ${Colors.darkGray};
                box-shadow: 0 3px 0px 0px ${Colors.darkGray};
            }              
            button.clicked.charcoal.horizontal-orientation {
                border-bottom-color: ${Colors.charcoal};
                box-shadow: 0 3px 0px 0px ${Colors.charcoal};
            }      
            button.clicked.magenta.horizontal-orientation {
                border-bottom-color: ${Colors.magenta};
                box-shadow: 0 3px 0px 0px ${Colors.magenta};
            }    
            button.clicked.red.horizontal-orientation {
                border-bottom-color: ${Colors.red};
                box-shadow: 0 3px 0px 0px ${Colors.red};
            }    
            button.clicked.red-orange.horizontal-orientation {
                border-bottom-color: ${Colors.redOrange};
                box-shadow: 0 3px 0px 0px ${Colors.redOrange};
            }            
            button.clicked.orange.horizontal-orientation {
                border-bottom-color: ${Colors.orange};
                box-shadow: 0 3px 0px 0px ${Colors.orange};
            }      
            button.clicked.gold.horizontal-orientation {
                border-bottom-color: ${Colors.gold};
                box-shadow: 0 3px 0px 0px ${Colors.orange};
            }      
            button.clicked.yellow.horizontal-orientation {
                border-bottom-color: ${Colors.yellow};
                box-shadow: 0 3px 0px 0px ${Colors.yellow};
            }      
            button.clicked.grass-green.horizontal-orientation {
                border-bottom-color: ${Colors.grassGreen};
                box-shadow: 0 3px 0px 0px ${Colors.grassGreen};
            }               
            button.clicked.green.horizontal-orientation {
                border-bottom-color: ${Colors.green};
                box-shadow: 0 3px 0px 0px ${Colors.green};
            }                
            button.clicked.dark-green.horizontal-orientation {
                border-bottom-color: ${Colors.darkGreen};
                box-shadow: 0 3px 0px 0px ${Colors.darkGreen};
            }                
            button.clicked.teal.horizontal-orientation {
                border-bottom-color: ${Colors.teal};
                box-shadow: 0 3px 0px 0px ${Colors.teal};
            }                 
            button.clicked.blue.horizontal-orientation {
                border-bottom-color: ${Colors.blue};
                box-shadow: 0 3px 0px 0px ${Colors.blue};
            }                 
            button.clicked.indigo.horizontal-orientation {
                border-bottom-color: ${Colors.indigo};
                box-shadow: 0 3px 0px 0px ${Colors.indigo};
            }      
            button.clicked.violet.horizontal-orientation {
                border-bottom-color: ${Colors.violet};
                box-shadow: 0 3px 0px 0px ${Colors.violet};
            }      
            button.clicked.purple.horizontal-orientation {
                border-bottom-color: ${Colors.purple};
                box-shadow: 0 3px 0px 0px ${Colors.purple};
            }      
            button.clicked.beige.horizontal-orientation {
                border-bottom-color: ${Colors.beige};
                box-shadow: 0 3px 0px 0px ${Colors.beige};
            }      
            button.clicked.light-brown.horizontal-orientation {
                border-bottom-color: ${Colors.lightBrown};
                box-shadow: 0 3px 0px 0px ${Colors.lightBrown};
            }      
            button.clicked.brown.horizontal-orientation {
                border-bottom-color: ${Colors.brown};
                box-shadow: 0 3px 0px 0px ${Colors.brown};
            }      
            button.clicked.dark-brown.horizontal-orientation {
                border-bottom-color: ${Colors.darkBrown};
                box-shadow: 0 3px 0px 0px ${Colors.darkBrown};
            }      
            button.clicked.pastel-pink.horizontal-orientation {
                border-bottom-color: ${Colors.pastelPink};
                box-shadow: 0 3px 0px 0px ${Colors.pastelPink};
            }      
            button.clicked.pastel-orange.horizontal-orientation {
                border-bottom-color: ${Colors.pastelOrange};
                box-shadow: 0 3px 0px 0px ${Colors.pastelOrange};
            }      
            button.clicked.pastel-yellow.horizontal-orientation {
                border-bottom-color: ${Colors.pastelYellow};
                box-shadow: 0 3px 0px 0px ${Colors.pastelYellow};
            }      
            button.clicked.pastel-green.horizontal-orientation {
                border-bottom-color: ${Colors.pastelGreen};
                box-shadow: 0 3px 0px 0px ${Colors.pastelGreen};
            }      
            button.clicked.pastel-blue.horizontal-orientation {
                border-bottom-color: ${Colors.pastelBlue};
                box-shadow: 0 3px 0px 0px ${Colors.pastelBlue};
            }      
            button.clicked.pastel-purple.horizontal-orientation {
                border-bottom-color: ${Colors.pastelPurple};
                box-shadow: 0 3px 0px 0px ${Colors.pastelPurple};
            }         
            button.clicked.light-blue.horizontal-orientation {
                border-bottom-color: ${Colors.lightBlue};
                box-shadow: 0 3px 0px 0px ${Colors.lightBlue};
            }      
            button.clicked.pink.horizontal-orientation {
                border-bottom-color: ${Colors.pink};
                box-shadow: 0 3px 0px 0px ${Colors.pink};
            }

            /* change tool color on selection (vertical orientation) */

            button.clicked.black.vertical-orientation {
                border-right-color: ${Colors.black};
                box-shadow: 3px 0px 0px 0px ${Colors.black};
            }  
            button.clicked.white.vertical-orientation {
                border-right-color: ${Colors.white};
                box-shadow: 3px 0px 0px 0px ${Colors.white};
            }        
            button.clicked.silver.vertical-orientation {
                border-right-color: ${Colors.silver};
                box-shadow: 3px 0px 0px 0px ${Colors.silver};
            }             
            button.clicked.gray.vertical-orientation {
                border-right-color: ${Colors.gray};
                box-shadow: 3px 0px 0px 0px ${Colors.gray};
            }               
            button.clicked.dark-gray.vertical-orientation {
                border-right-color: ${Colors.darkGray};
                box-shadow: 3px 0px 0px 0px ${Colors.darkGray};
            }              
            button.clicked.charcoal.vertical-orientation {
                border-right-color: ${Colors.charcoal};
                box-shadow: 3px 0px 0px 0px ${Colors.charcoal};
            }      
            button.clicked.magenta.vertical-orientation {
                border-right-color: ${Colors.magenta};
                box-shadow: 3px 0px 0px 0px ${Colors.magenta};
            }    
            button.clicked.red.vertical-orientation {
                border-right-color: ${Colors.red};
                box-shadow: 3px 0px 0px 0px ${Colors.red};
            }    
            button.clicked.red-orange.vertical-orientation {
                border-right-color: ${Colors.redOrange};
                box-shadow: 3px 0px 0px 0px ${Colors.redOrange};
            }            
            button.clicked.orange.vertical-orientation {
                border-right-color: ${Colors.orange};
                box-shadow: 3px 0px 0px 0px ${Colors.orange};
            }      
            button.clicked.gold.vertical-orientation {
                border-right-color: ${Colors.gold};
                box-shadow: 3px 0px 0px 0px ${Colors.gold};
            }      
            button.clicked.yellow.vertical-orientation {
                border-right-color: ${Colors.yellow};
                box-shadow: 3px 0px 0px 0px ${Colors.yellow};
            }      
            button.clicked.grass-green.vertical-orientation {
                border-right-color: ${Colors.grassGreen};
                box-shadow: 3px 0px 0px 0px ${Colors.grassGreen};
            }               
            button.clicked.green.vertical-orientation {
                border-right-color: ${Colors.green};
                box-shadow: 3px 0px 0px 0px ${Colors.green};
            }                
            button.clicked.dark-green.vertical-orientation {
                border-right-color: ${Colors.darkGreen};
                box-shadow: 3px 0px 0px 0px ${Colors.darkGreen};
            }                
            button.clicked.teal.vertical-orientation {
                border-right-color: ${Colors.teal};
                box-shadow: 3px 0px 0px 0px ${Colors.teal};
            }                 
            button.clicked.blue.vertical-orientation {
                border-right-color: ${Colors.blue};
                box-shadow: 3px 0px 0px 0px ${Colors.blue};
            }                 
            button.clicked.indigo.vertical-orientation {
                border-right-color: ${Colors.indigo};
                box-shadow: 3px 0px 0px 0px ${Colors.indigo};
            }      
            button.clicked.violet.vertical-orientation {
                border-right-color: ${Colors.violet};
                box-shadow: 3px 0px 0px 0px ${Colors.violet};
            }      
            button.clicked.purple.vertical-orientation {
                border-right-color: ${Colors.purple};
                box-shadow: 3px 0px 0px 0px ${Colors.purple};
            }      
            button.clicked.beige.vertical-orientation {
                border-right-color: ${Colors.beige};
                box-shadow: 3px 0px 0px 0px ${Colors.beige};
            }      
            button.clicked.light-brown.vertical-orientation {
                border-right-color: ${Colors.lightBrown};
                box-shadow: 3px 0px 0px 0px ${Colors.lightBrown};
            }      
            button.clicked.brown.vertical-orientation {
                border-right-color: ${Colors.brown};
                box-shadow: 3px 0px 0px 0px ${Colors.brown};
            }      
            button.clicked.dark-brown.vertical-orientation {
                border-right-color: ${Colors.darkBrown};
                box-shadow: 3px 0px 0px 0px ${Colors.darkBrown};
            }      
            button.clicked.pastel-pink.vertical-orientation {
                border-right-color: ${Colors.pastelPink};
                box-shadow: 3px 0px 0px 0px ${Colors.pastelPink};
            }      
            button.clicked.pastel-orange.vertical-orientation {
                border-right-color: ${Colors.pastelOrange};
                box-shadow: 3px 0px 0px 0px ${Colors.pastelOrange};
            }      
            button.clicked.pastel-yellow.vertical-orientation {
                border-right-color: ${Colors.pastelYellow};
                box-shadow: 3px 0px 0px 0px ${Colors.pastelYellow};
            }      
            button.clicked.pastel-green.vertical-orientation {
                border-right-color: ${Colors.pastelGreen};
                box-shadow: 3px 0px 0px 0px ${Colors.pastelGreen};
            }      
            button.clicked.pastel-blue.vertical-orientation {
                border-right-color: ${Colors.pastelBlue};
                box-shadow: 3px 0px 0px 0px ${Colors.pastelBlue};
            }      
            button.clicked.pastel-purple.vertical-orientation {
                border-right-color: ${Colors.pastelPurple};
                box-shadow: 3px 0px 0px 0px ${Colors.pastelPurple};
            }         
            button.clicked.light-blue.vertical-orientation {
                border-right-color: ${Colors.lightBlue};
                box-shadow: 3px 0px 0px 0px ${Colors.lightBlue};
            }      
            button.clicked.pink.vertical-orientation {
                border-right-color: ${Colors.pink};
                box-shadow: 3px 0px 0px 0px ${Colors.pink};
            }
        `;
    }
}