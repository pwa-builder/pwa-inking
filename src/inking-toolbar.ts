import {
    LitElement, html, customElement, property, css, query, CSSResult
} from 'lit-element';

import { InkingCanvas } from './inking-canvas';

@customElement('inking-toolbar')
export class InkingToolbar extends LitElement {

    // properties for toolbar and its dropdowns
    @property({type: String}) orientation: string = "";
    @query('#toolbar-container') private toolbarContainer: HTMLElement;
    @query('#tool-container') private toolContainer: HTMLElement;
    @property({type: NodeList}) private tools: NodeListOf<HTMLButtonElement>;
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

    // properties to influence connected inking canvas
    @property({type: CSSResult}) private selectedPenColor: CSSResult = InkingToolbar.black;
    @property({type: CSSResult}) private selectedPenColorName: string = 'black';
    @property({type: Number}) private selectedPenSize: number = this.defaultSliderSize;
    @property({type: CSSResult}) private selectedHighlighterColor: CSSResult = InkingToolbar.yellow;
    @property({type: CSSResult}) private selectedHighlighterColorName: string = 'yellow';
    @property({type: Number}) private selectedHighlighterSize: number = this.defaultSliderSize;
    @property({type: Number}) private eraserSize: number = this.defaultSliderSize;
    @property({type: String, attribute: "canvas"}) targetInkingCanvas: string = "";
    @property({type: InkingCanvas}) private inkingCanvas: InkingCanvas;

    // colors defined once, retrieved for css palette display and sending to canvas
    readonly colors = new Map<string, CSSResult>();
    static readonly black = css`#000000`;
    static readonly white = css`#ffffff`;
    static readonly silver = css`#d1d3d4`;
    static readonly gray = css`#a7a9ac`;
    static readonly darkGray = css`#808285`;
    static readonly charcoal = css`#58595b`;
    static readonly magenta = css`#b31564`;
    static readonly red = css`#e61b1b`;
    static readonly redOrange = css`#ff5500`;
    static readonly orange = css`#ffaa00`;
    static readonly gold = css`#ffce00`;
    static readonly yellow = css`#ffe600`;
    static readonly grassGreen = css`#a2e61b`;
    static readonly green = css`#26e600`;
    static readonly darkGreen = css`#008055`;
    static readonly teal = css`#00aacc`;
    static readonly blue = css`#004de6`;
    static readonly indigo = css`#3d00b8`;
    static readonly violet = css`#6600cc`;
    static readonly purple = css`#600080`;
    static readonly beige = css`#f7d7c4`;
    static readonly lightBrown = css`#bb9167`;
    static readonly brown = css`#8e562e`;
    static readonly darkBrown = css`#613d30`;
    static readonly pastelPink = css`#ff80ff`;
    static readonly pastelOrange = css`#ffc680`;
    static readonly pastelYellow = css`#ffff80`;
    static readonly pastelGreen = css`#80ff9e`;
    static readonly pastelBlue = css`#80d6ff`;
    static readonly pastelPurple = css`#bcb3ff`;
    static readonly colorPaletteBackground = css`#f2f2f2`;

    // colors specific to highlighter
    static readonly lightBlue = css`#44c8f5`;
    static readonly pink = css`#ec008c`;

    // color used in toolbar
    static readonly lightGray = css`#e8e8e8`;

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
                            <div class="black circle" @click="${this.clickedColor}"></div>
                            <div class="white circle" @click="${this.clickedColor}"></div>
                            <div class="silver circle" @click="${this.clickedColor}"></div>
                            <div class="gray circle" @click="${this.clickedColor}"></div>
                            <div class="dark-gray circle" @click="${this.clickedColor}"></div>
                            <div class="charcoal circle" @click="${this.clickedColor}"></div>
                            <div class="magenta circle" @click="${this.clickedColor}"></div>
                            <div class="red circle" @click="${this.clickedColor}"></div>
                            <div class="red-orange circle" @click="${this.clickedColor}"></div>
                            <div class="orange circle" @click="${this.clickedColor}"></div>
                            <div class="gold circle" @click="${this.clickedColor}"></div>
                            <div class="yellow circle" @click="${this.clickedColor}"></div>
                            <div class="grass-green circle" @click="${this.clickedColor}"></div>
                            <div class="green circle" @click="${this.clickedColor}"></div>
                            <div class="dark-green circle" @click="${this.clickedColor}"></div>
                            <div class="teal circle" @click="${this.clickedColor}"></div>
                            <div class="blue circle" @click="${this.clickedColor}"></div>
                            <div class="indigo circle" @click="${this.clickedColor}"></div>
                            <div class="violet circle" @click="${this.clickedColor}"></div>
                            <div class="purple circle" @click="${this.clickedColor}"></div>
                            <div class="beige circle" @click="${this.clickedColor}"></div>
                            <div class="light-brown circle" @click="${this.clickedColor}"></div>
                            <div class="brown circle" @click="${this.clickedColor}"></div>
                            <div class="dark-brown circle" @click="${this.clickedColor}"></div>
                            <div class="pastel-pink circle" @click="${this.clickedColor}"></div>
                            <div class="pastel-orange circle" @click="${this.clickedColor}"></div>
                            <div class="pastel-yellow circle" @click="${this.clickedColor}"></div>
                            <div class="pastel-green circle" @click="${this.clickedColor}"></div>
                            <div class="pastel-blue circle" @click="${this.clickedColor}"></div>
                            <div class="pastel-purple circle" @click="${this.clickedColor}"></div>
                        </div>
                        <div class="highlighter palette">
                            <div class="yellow circle" @click="${this.clickedColor}"></div>
                            <div class="green circle" @click="${this.clickedColor}"></div>
                            <div class="light-blue circle" @click="${this.clickedColor}"></div>
                            <div class="pink circle" @click="${this.clickedColor}"></div>
                            <div class="red-orange circle" @click="${this.clickedColor}"></div>
                            <div class="violet circle" @click="${this.clickedColor}"></div>
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

        // connect color declarations to click handling 
        this.mapColors();

        // TODO: make canvas helper methods to use in both ts files
        // enable low-latency if possible
        this.sineContext = (this.sineCanvas.getContext('2d', {
            desynchronized: true
          }) as CanvasRenderingContext2D);
    
        // check for low-latency
        if ("getContextAttributes" in this.sineContext && (this.sineContext as any).getContextAttributes().desynchronized) {
        console.log('Low latency is supported for sine wave canvas.');
        } else {
        console.log('Low latency is NOT supported for sine wave canvas.');
        }

        // set canvas to use pointer event sizing by default
        this.slider.disabled = true;
        this.sliderCheckbox.checked = false;
        this.sliderCheckbox.addEventListener('change', () => this.toggleSliderCheckbox(), false);

        // draw example stroke for ink dropdowns
        this.isWaitingToDrawSineCanvas = true;
        this.inkingCanvas.runAsynchronously( () => { 
            this.drawSineCanvas();
            console.log("sine canvas drawn for first time");
        });
    }

    connectCanvas() {
        const possibleCanvases = document.querySelectorAll('inking-canvas');
        possibleCanvases.forEach(possibleCanvas => {
            if ((<InkingCanvas>possibleCanvas).name === this.targetInkingCanvas) {
                this.inkingCanvas = <InkingCanvas>possibleCanvas;
            }
        });

        if (this.inkingCanvas) {

            // make toolbar appear when connected to an inking canvas
            this.toolbarContainer.classList.add("show");

            // hide dropdown once inking starts
            this.inkingCanvas.addEventListener('inking-started', () => {
                this.hideElementIfVisible(this.inkDropdown);
            }, false);

            // redraw example stroke with new size when inking canvas resizes
            this.inkingCanvas.addEventListener('inking-canvas-resized', () => {
                this.requestDrawSineCanvas();
            }, false);

        }
    }

    setOrientation() {

        // default choice is "horizontal"

        this.tools = this.toolContainer.querySelectorAll('button');
        if (this.orientation === "vertical") {
            
            this.toolContainer.classList.add("vertical-orientation");
            this.dropdownContainer.classList.add("vertical-orientation");
 
            this.tools.forEach(tool => {
                tool.classList.add('vertical-orientation');
            });
            
            const lastTool = this.toolContainer.querySelector("button:last-child");
            lastTool.classList.add("vertical-orientation");
        }
        else {
            this.tools.forEach(tool => {
                tool.classList.add('horizontal-orientation');
            });
        }
    }

    // create quick way to retrieve a color value based on its class
    mapColors() {
        this.colors.set('black', InkingToolbar.black);
        this.colors.set('white', InkingToolbar.white);
        this.colors.set('silver', InkingToolbar.silver);
        this.colors.set('gray', InkingToolbar.gray);
        this.colors.set('darkGray', InkingToolbar.darkGray);
        this.colors.set('charcoal', InkingToolbar.charcoal);
        this.colors.set('magenta', InkingToolbar.magenta);
        this.colors.set('red', InkingToolbar.red);
        this.colors.set('redOrange', InkingToolbar.redOrange);
        this.colors.set('orange', InkingToolbar.orange);
        this.colors.set('gold', InkingToolbar.gold);
        this.colors.set('yellow', InkingToolbar.yellow);
        this.colors.set('grassGreen', InkingToolbar.grassGreen);
        this.colors.set('green', InkingToolbar.green);
        this.colors.set('darkGreen', InkingToolbar.darkGreen);
        this.colors.set('teal', InkingToolbar.teal);
        this.colors.set('blue', InkingToolbar.blue);
        this.colors.set('indigo', InkingToolbar.indigo);
        this.colors.set('violet', InkingToolbar.violet);
        this.colors.set('purple', InkingToolbar.purple);
        this.colors.set('beige', InkingToolbar.beige);
        this.colors.set('lightBrown', InkingToolbar.lightBrown);
        this.colors.set('brown', InkingToolbar.brown);
        this.colors.set('darkBrown', InkingToolbar.darkBrown);
        this.colors.set('pastelPink', InkingToolbar.pastelPink);
        this.colors.set('pastelOrange', InkingToolbar.pastelOrange);
        this.colors.set('pastelYellow', InkingToolbar.pastelYellow);
        this.colors.set('pastelGreen', InkingToolbar.pastelGreen);
        this.colors.set('pastelBlue', InkingToolbar.pastelBlue);
        this.colors.set('pastelPurple', InkingToolbar.pastelPurple);
        this.colors.set('lightBlue',  InkingToolbar.lightBlue);
        this.colors.set('pink', InkingToolbar.pink);
    }
    getCurrentUtensilColor() {
        switch (this.selectedTool.id) {
            case "pen" :
                return this.selectedPenColor.toString();
                break;
            case "highlighter" :
                return this.selectedHighlighterColor.toString();
                break;
            case "eraser" :
                return InkingToolbar.white.toString();
                break;
            default:
                console.log("could not find color value for selected utensil");
                break;
        }
    }
    getCurrentUtensilColorName() {
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
    setCurrentUtensilColor(color: CSSResult) {
        switch (this.selectedTool.id) {
            case "pen" :
                this.selectedPenColor = color;
                break;
            case "highlighter" :
                this.selectedHighlighterColor = color;
                break;
            case "eraser" :
                return InkingToolbar.white;
                break;
            default:
                console.log("could not set color value for selected utensil");
                break;
        }
    }
    setCurrentUtensilColorName(colorName: string) {
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
    setCurrentStrokeSize() {
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
    requestDrawSineCanvas() {
        if (!this.isWaitingToDrawSineCanvas) {
            this.isWaitingToDrawSineCanvas = true;
        }
    }
    async drawSineCanvas() {
        if (this.isWaitingToDrawSineCanvas && this.sineCanvas.classList.contains("show")) {

            // toggle semaphore to prevent unnecessary redraws
            this.isWaitingToDrawSineCanvas = false;

            // define stroke size and pen color for new sine wave
            let strokeWidth = parseInt(this.slider.value) * this.inkingCanvas.getScale() / devicePixelRatio;
            this.sineContext.lineWidth = strokeWidth;
            this.sineContext.strokeStyle = this.getCurrentUtensilColor();

            // clear canvas for new sine wave
            this.sineContext.clearRect(0, 0, this.sineCanvas.width, this.sineCanvas.height);
            this.sineContext.fillStyle = InkingToolbar.colorPaletteBackground.toString();
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
                    this.inkingCanvas.drawPencilStroke(this.sineContext, x-1, x, previousY, currentY);
                } else {
                    this.sineContext.stroke();
                }
                strokesDrawn++;
            }
            // console.log("sineCanvas strokes drawn: " + strokesDrawn);
        }

        // start & continue sine wave drawing loop
        this.inkingCanvas.runAsynchronously( () => { 
            requestAnimationFrame(async () => this.drawSineCanvas());
        });
    }
    clickedUtensil(e: Event) {
        let utensil = <HTMLButtonElement>e.target;
        console.log(utensil.id + " button clicked!");
        this.updateSelectedTool(utensil);
    }
    clickedEraseAll(e: Event) {
        let eraser = (<HTMLButtonElement>e.target);
        console.log(eraser.id + " has been clicked!");
        this.inkingCanvas.runAsynchronously( () => {
            this.inkingCanvas.eraseAll();
        });
        this.selectedTool = eraser;
    }
    clickedColor(event: Event) {

        // find clicked color grid element through its class
        let selectedCircle = (<HTMLDivElement>event.target);
        let colorClass = selectedCircle.className.replace('clicked', '').replace('circle', '').trim();

        // get color string from css color
        let colorName = this.toCamelCase(colorClass);
        let backgroundColor = this.colors.get(colorName);

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
    isUtensil(tool: string) {
        return (tool === "pen" || tool === "pencil" 
        || tool === "highlighter" || tool === "eraser");
    }
    updateSelectedTool(selectedTool: HTMLButtonElement) {
        if (selectedTool !== this.selectedTool) {
            if (this.isUtensil(selectedTool.id)) {
                this.switchUtensil(selectedTool);
                this.changeInkingColor();
            }
            this.inkingCanvas.changeToolStyle(this.selectedTool.id);
        } else {
            this.selectedDropdown.classList.toggle("show");
        }
    }
    switchUtensil(el: HTMLButtonElement) {
        let utensilName = el.id;
        if (utensilName === "highlighter") {
            this.inkDropdownTitle.classList.add("show");            
            this.togglePalette(this.penPencilPalette, this.highlighterPalette);
            this.hideElementIfVisible(this.eraseAllBtn);
        } else if (utensilName === "eraser") {
            this.hideElementIfVisible(this.inkDropdownTitle);                
            this.hideElementIfVisible(this.penPencilPalette);
            this.hideElementIfVisible(this.highlighterPalette);
            if (!this.eraseAllBtn.classList.contains("show")) 
                this.eraseAllBtn.classList.add("show");
        } else  {  // must be pen or pencil
            this.inkDropdownTitle.classList.add("show");            
            this.togglePalette(this.highlighterPalette, this.penPencilPalette);
            this.hideElementIfVisible(this.eraseAllBtn);
        }
        this.toggleDropdown(this.inkDropdown, el === this.selectedTool);
        this.toggleActiveTool(el);
    }
    hideElementIfVisible(el: HTMLElement) {
        if (el.classList.contains("show")) 
            el.classList.remove("show");
    }
    toggleActiveTool(lastClickedTool: HTMLButtonElement) {
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
                let colorName = this.toDash(this.getCurrentUtensilColorName());

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
    toggleSliderCheckbox() {
        this.updateCheckboxColor();
        this.slider.disabled = !this.slider.disabled;
        this.sineCanvas.classList.toggle("show");
        this.slider.classList.toggle("show");
        this.onText.classList.toggle("show");
        this.offText.classList.toggle("show");
        this.changeStrokeSize();
    }
    togglePalette(old: HTMLElement, current?: HTMLElement) {
        this.hideElementIfVisible(old);
        if (current && !current.classList.contains("show")) {
            current.classList.add("show");
        }
    }
    toggleDropdown(selectedDropdown: HTMLDivElement, isLastElementClicked: boolean) {
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
    changeInkingColor(color?: CSSResult, colorName?: string) {
        if (this.inkingCanvas) {        

            if (color) this.setCurrentUtensilColor(color);
            if (colorName) this.setCurrentUtensilColorName(colorName);

            if (this.selectedTool && this.selectedTool.classList.contains('clicked')) {

                // remove the color class which should be the last and 5th class
                this.selectedTool.classList.remove(this.selectedTool.classList[4]);

                // use the css friendly color class name with dashes
                let modifiedColorName = this.toDash(this.getCurrentUtensilColorName());

                this.selectedTool.classList.add(modifiedColorName);
            }
            this.inkingCanvas.changeUtensilColor(this.getCurrentUtensilColor());
        }
    }
    changeStrokeSize() {
        if (this.inkingCanvas) {
            if (this.slider.disabled) {
                this.inkingCanvas.changeStrokeSize(-1); 
            } else  {
                this.setCurrentStrokeSize();
                this.inkingCanvas.changeStrokeSize(this.getCurrentStrokeSize());
                if (this.sineCanvas) {
                    this.requestDrawSineCanvas();
                }
            }
        }
    }
    updateSelectedColor(selectedCircle: HTMLDivElement) {
        if (this.selectedCircle !== selectedCircle) {
            if (this.selectedCircle && this.selectedCircle.classList.contains("clicked")) {
                this.selectedCircle.classList.remove("clicked");
            }
            this.selectedCircle = selectedCircle;
            this.selectedCircle.classList.add("clicked");
        }
    }
    updateCheckboxColor() {
        if (this.sliderCheckboxTrack) {
            let color = this.toDash(this.getCurrentUtensilColorName());
            if (this.sliderCheckboxTrack.classList.length > 1) {
                    this.sliderCheckboxTrack.classList.remove(this.sliderCheckboxTrack.classList[1]);
                    if (this.sliderCheckbox.checked) 
                        this.sliderCheckboxTrack.classList.add(color);
            } else if (this.sliderCheckbox.checked) {
                this.sliderCheckboxTrack.classList.add(color);
            }
        }
    }
    updateSliderColor(colorClass: string) {
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
    updateSliderSize() {
        if (this.slider) {
            this.slider.value = this.getCurrentStrokeSize().toString();
            this.changeStrokeSize();
        }
    }
    toCamelCase(str: string) {
        return str.toLowerCase().replace(/-(.)/g, function(match, upperLetter) {
          return upperLetter.toUpperCase();
        });
    }
    toDash(str: string) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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
                background-color: ${InkingToolbar.white};
                border: 2px solid ${InkingToolbar.white};
                border-bottom: 0px solid ${InkingToolbar.white};
                margin: 2px 2px 0px 2px; /* no gap between bottom of tool and dropdown */
                display: inline-block;
            }
            #tool-container.vertical-orientation {
                vertical-align: top;
                margin: 2px 0px 2px 2px; /* no gap between right of tool and dropdown */ 
                border-bottom: 2px solid ${InkingToolbar.white};
                border-right: 0px solid ${InkingToolbar.white};
            }
            button {
                position: relative;
            }
            /* prevent Firefox from adding extra styling on focused button */
            button::-moz-focus-inner {
                border: 0;
            }
            button.toolbar-icon {
                background-color: ${InkingToolbar.white};
                outline: none;
                border: 2px solid ${InkingToolbar.white};
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
                background-color: ${InkingToolbar.lightGray};
                padding: 25px;
                margin-top: 25px;
                font-family: sans-serif;
                font-size: 16px;
            }
            button#erase-all.show {
                display: inline-block;
            }
            button:hover.toolbar-icon {
                border-color: ${InkingToolbar.gray};
                background-color: ${InkingToolbar.lightGray};
            }
            button:hover#erase-all {
                background-color: ${InkingToolbar.silver};
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
                background-color: ${this.colorPaletteBackground};
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
            .circle {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 7px solid ${this.colorPaletteBackground};
            }
            .circle:hover, .circle:active {
                width: 40px;
                height: 40px;
                border: 2px solid ${this.colorPaletteBackground};
                transition: all 0.2s ease;
            }
            .circle.clicked {
                width: 30px;
                height: 30px;
                border: 3px solid ${this.colorPaletteBackground};
                box-shadow: 0px 0px 0px 2px black;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            .circle.black {                
                background-color: ${this.black};
            }            
            .circle.white {              
                background-color: ${this.white};
            }
            .circle.silver {            
                background-color: ${this.silver};
            }
            .circle.gray {            
                background-color: ${this.gray};
            }
            .circle.dark-gray {               
                background-color: ${this.darkGray};
            }
            .circle.charcoal {               
                background-color: ${this.charcoal};
            }
            .circle.magenta {              
                background-color: ${this.magenta};
            }
            .circle.red {
                background-color: ${this.red};
            }
            .circle.red-orange {
                background-color: ${this.redOrange};
            }
            .circle.orange {
                background-color: ${this.orange};
            }
            .circle.gold {
                background-color: ${this.gold};
            }
            .circle.yellow {
                background-color: ${this.yellow};
            }
            .circle.grass-green {
                background-color: ${this.grassGreen};
            }
            .circle.green {
                background-color: ${this.green};
            }
            .circle.dark-green {
                background-color: ${this.darkGreen};
            }
            .circle.teal {
                background-color: ${this.teal};
            }
            .circle.blue {
                background-color: ${this.blue};
            }
            .circle.indigo {
                background-color: ${this.indigo};
            }
            .circle.violet {
                background-color: ${this.violet};
            }
            .circle.purple {
                background-color: ${this.purple};
            }
            .circle.beige {
                background-color: ${this.beige};
            }
            .circle.light-brown {
                background-color: ${this.lightBrown};
            }
            .circle.brown {
                background-color: ${this.brown};
            }
            .circle.dark-brown {
                background-color: ${this.darkBrown};
            }
            .circle.pastel-pink {
                background-color: ${this.pastelPink};
            }
            .circle.pastel-orange {
                background-color: ${this.pastelOrange};
            }
            .circle.pastel-yellow {
                background-color: ${this.pastelYellow};
            }
            .circle.pastel-green {
                background-color: ${this.pastelGreen};
            }
            .circle.pastel-blue {
                background-color: ${this.pastelBlue};
            }
            .circle.pastel-purple {
                background-color: ${this.pastelPurple};
            }
            .circle.light-blue {
                background-color: ${this.lightBlue};
            }
            .circle.pink {
                background-color: ${this.pink};
            }
            .sineCanvas {
                height: 50%;
                width: 100%;
                background-color: transparent;
                padding-left: 0;
                padding-right: 0;
                margin-left: auto;
                margin-right: auto;
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
                background: ${InkingToolbar.darkGray};
                border-radius: 20px;
                transition: all 0.2s ease;
                color: ${InkingToolbar.white};
            }
            .checkbox-track::after {
                position: absolute;
                content: "";
                width: 20px;
                height: 20px;
                background-color: ${InkingToolbar.white};
                border-radius: 50%;
                border: 4px solid ${InkingToolbar.darkGray};
                top: 1px;
                left: 1px;
                transition: all 0.2s ease;
            }
            input:checked + .checkbox-track.white::after {
                background-color: ${InkingToolbar.silver};
                border-color: ${InkingToolbar.white};
            }
            .checkbox-track.black::after {
                border-color: ${InkingToolbar.black};
            }
            .checkbox-track.silver::after {
                border-color: ${InkingToolbar.silver};
            }
            .checkbox-track.gray::after {
                border-color: ${InkingToolbar.gray};
            }
            .checkbox-track.dark-gray::after {
                border-color: ${InkingToolbar.darkGray};
            }
            .slider-checkbox-track.charcoal::after {
                border-color: ${InkingToolbar.charcoal};
            }
            .checkbox-track.magenta::after {
                border-color: ${InkingToolbar.magenta};
            }
            .checkbox-track.red::after {
                border-color: ${InkingToolbar.red};
            }
            .checkbox-track.red-orange::after {
                border-color: ${InkingToolbar.redOrange};
            }
            .checkbox-track.orange::after {
                border-color: ${InkingToolbar.orange};
            }
            .checkbox-track.gold::after {
                border-color: ${InkingToolbar.gold};
            }
            .checkbox-track.yellow::after {
                border-color: ${InkingToolbar.yellow};
            }
            .checkbox-track.grass-green::after {
                border-color: ${InkingToolbar.grassGreen};
            }
            .checkbox-track.green::after {
                border-color: ${InkingToolbar.green};
            }
            .checkbox-track.dark-green::after {
                border-color: ${InkingToolbar.darkGreen};
            }
            .checkbox-track.teal::after {
                border-color: ${InkingToolbar.teal};
            }
            .checkbox-track.blue::after {
                border-color: ${InkingToolbar.blue};
            }
            .checkbox-track.indigo::after {
                border-color: ${InkingToolbar.indigo};
            }
            .checkbox-track.purple::after {
                border-color: ${InkingToolbar.purple};
            }
            .checkbox-track.violet::after {
                border-color: ${InkingToolbar.violet};
            }
            .checkbox-track.beige::after {
                border-color: ${InkingToolbar.beige};
            }
            .checkbox-track.light-brown::after {
                border-color: ${InkingToolbar.lightBrown};
            }
            .checkbox-track.brown::after {
                border-color: ${InkingToolbar.brown};
            }
            .checkbox-track.dark-brown::after {
                border-color: ${InkingToolbar.darkBrown};
            }
            .checkbox-track.pastel-pink::after {
                border-color: ${InkingToolbar.pastelPink};
            }
            .checkbox-track.pastel-orange::after {
                border-color: ${InkingToolbar.pastelOrange};
            }
            .checkbox-track.pastel-yellow::after {
                border-color: ${InkingToolbar.pastelYellow};
            }
            .checkbox-track.pastel-green::after {
                border-color: ${InkingToolbar.pastelGreen};
            }
            .checkbox-track.pastel-blue::after {
                border-color: ${InkingToolbar.pastelBlue};
            }
            .checkbox-track.pastel-purple::after {
                border-color: ${InkingToolbar.pastelPurple};
            }
            .checkbox-track.light-blue::after {
                border-color: ${InkingToolbar.lightBlue};
            }
            .checkbox-track.pink::after {
                border-color: ${InkingToolbar.pink};
            }
            input:checked + .checkbox-track {
                background-color: ${InkingToolbar.darkGreen};
            }
            input:checked + .checkbox-track.black {
                background-color: ${InkingToolbar.black};
                border-color: ${InkingToolbar.black};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.white {
                background-color: ${InkingToolbar.white};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.silver {
                background-color: ${InkingToolbar.silver};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.gray {
                background-color: ${InkingToolbar.gray};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.dark-gray {
                background-color: ${InkingToolbar.darkGray};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.charcoal {
                background-color: ${InkingToolbar.charcoal};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.magenta {
                background-color: ${InkingToolbar.magenta};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.red {
                background-color: ${InkingToolbar.red};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.red-orange {
                background-color: ${InkingToolbar.redOrange};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.orange {
                background-color: ${InkingToolbar.orange};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.gold {
                background-color: ${InkingToolbar.gold};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.yellow {
                background-color: ${InkingToolbar.yellow};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.grass-green {
                background-color: ${InkingToolbar.grassGreen};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.green {
                background-color: ${InkingToolbar.green};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.dark-green {
                background-color: ${InkingToolbar.darkGreen};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.teal {
                background-color: ${InkingToolbar.teal};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.blue {
                background-color: ${InkingToolbar.blue};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.indigo {
                background-color: ${InkingToolbar.indigo};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.purple {
                background-color: ${InkingToolbar.purple};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.violet {
                background-color: ${InkingToolbar.violet};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.beige {
                background-color: ${InkingToolbar.beige};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.light-brown {
                background-color: ${InkingToolbar.lightBrown};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.brown {
                background-color: ${InkingToolbar.brown};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.dark-brown {
                background-color: ${InkingToolbar.darkBrown};
                color: ${InkingToolbar.white};
            }
            input:checked + .checkbox-track.pastel-pink {
                background-color: ${InkingToolbar.pastelPink};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.pastel-orange {
                background-color: ${InkingToolbar.pastelOrange};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.pastel-yellow {
                background-color: ${InkingToolbar.pastelYellow};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.pastel-green {
                background-color: ${InkingToolbar.pastelGreen};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.pastel-blue {
                background-color: ${InkingToolbar.pastelBlue};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.pastel-purple {
                background-color: ${InkingToolbar.pastelPurple};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.light-blue {
                background-color: ${InkingToolbar.lightBlue};
                color: ${InkingToolbar.black};
            }
            input:checked + .checkbox-track.pink {
                background-color: ${InkingToolbar.pink};
                color: ${InkingToolbar.white};
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
                background-color: ${this.black};
            }  
            .slider.black::-moz-range-thumb {
                background-color: ${this.black};
            }
            .slider.white::-webkit-slider-thumb {
                background-color: ${this.white};
            }        
            .slider.white::-moz-range-thumb {
                background-color: ${this.white};
            }
            .slider.silver::-webkit-slider-thumb {
                background-color: ${this.silver};
            }             
            .slider.silver::-moz-range-thumb {
                background-color: ${this.silver};
            }
            .slider.gray::-webkit-slider-thumb {
                background-color: ${this.gray};
            }               
            .slider.gray::-moz-range-thumb {
                background-color: ${this.gray};
            }
            .slider.dark-gray::-webkit-slider-thumb {
                background-color: ${this.darkGray};
            }              
            .slider.dark-gray::-moz-range-thumb {
                background-color: ${this.darkGray};
            }
            .slider.charcoal::-webkit-slider-thumb {
                background-color: ${this.charcoal};
            }      
            .slider.charcoal::-moz-range-thumb {
                background-color: ${this.charcoal};
            }
            .slider.magenta::-webkit-slider-thumb {
                background-color: ${this.magenta};
            }    
            .slider.magenta::-moz-range-thumb {
                background-color: ${this.magenta};
            }
            .slider.red::-webkit-slider-thumb {
                background-color: ${this.red};
            }    
            .slider.red::-moz-range-thumb {
                background-color: ${this.red};
            }
            .slider.red-orange::-webkit-slider-thumb {
                background-color: ${this.redOrange};
            }            
            .slider.red-orange::-moz-range-thumb {
                background-color: ${this.redOrange};
            }
            .slider.orange::-webkit-slider-thumb {
                background-color: ${this.orange};
            }      
            .slider.orange::-moz-range-thumb {
                background-color: ${this.orange};
            }
            .slider.gold::-webkit-slider-thumb {
                background-color: ${this.gold};
            }      
            .slider.gold::-moz-range-thumb {
                background-color: ${this.gold};
            }
            .slider.yellow::-webkit-slider-thumb {
                background-color: ${this.yellow};
            }      
            .slider.yellow::-moz-range-thumb {
                background-color: ${this.yellow};
            }
            .slider.grass-green::-webkit-slider-thumb {
                background-color: ${this.grassGreen};
            }      
            .slider.grass-green::-moz-range-thumb {
                background-color: ${this.grassGreen};
            }            
            .slider.green::-webkit-slider-thumb {
                background-color: ${this.green};
            }      
            .slider.green::-moz-range-thumb {
                background-color: ${this.green};
            }            
            .slider.dark-green::-webkit-slider-thumb {
                background-color: ${this.darkGreen};
            }      
            .slider.dark-green::-moz-range-thumb {
                background-color: ${this.darkGreen};
            }            
            .slider.teal::-webkit-slider-thumb {
                background-color: ${this.teal};
            }      
            .slider.teal::-moz-range-thumb {
                background-color: ${this.teal};
            }            
            .slider.blue::-webkit-slider-thumb {
                background-color: ${this.blue};
            }      
            .slider.blue::-moz-range-thumb {
                background-color: ${this.blue};
            }            
            .slider.indigo::-webkit-slider-thumb {
                background-color: ${this.indigo};
            }      
            .slider.indigo::-moz-range-thumb {
                background-color: ${this.indigo};
            }
            .slider.violet::-webkit-slider-thumb {
                background-color: ${this.violet};
            }      
            .slider.violet::-moz-range-thumb {
                background-color: ${this.violet};
            }
            .slider.purple::-webkit-slider-thumb {
                background-color: ${this.purple};
            }      
            .slider.purple::-moz-range-thumb {
                background-color: ${this.purple};
            }
            .slider.beige::-webkit-slider-thumb {
                background-color: ${this.beige};
            }      
            .slider.beige::-moz-range-thumb {
                background-color: ${this.beige};
            }
            .slider.light-brown::-webkit-slider-thumb {
                background-color: ${this.lightBrown};
            }      
            .slider.light-brown::-moz-range-thumb {
                background-color: ${this.lightBrown};
            }
            .slider.brown::-webkit-slider-thumb {
                background-color: ${this.brown};
            }      
            .slider.brown::-moz-range-thumb {
                background-color: ${this.brown};
            }
            .slider.dark-brown::-webkit-slider-thumb {
                background-color: ${this.darkBrown};
            }      
            .slider.dark-brown::-moz-range-thumb {
                background-color: ${this.darkBrown};
            }
            .slider.pastel-pink::-webkit-slider-thumb {
                background-color: ${this.pastelPink};
            }      
            .slider.pastel-pink::-moz-range-thumb {
                background-color: ${this.pastelPink};
            }
            .slider.pastel-orange::-webkit-slider-thumb {
                background-color: ${this.pastelOrange};
            }      
            .slider.pastel-orange::-moz-range-thumb {
                background-color: ${this.pastelOrange};
            }
            .slider.pastel-yellow::-webkit-slider-thumb {
                background-color: ${this.pastelYellow};
            }      
            .slider.pastel-yellow::-moz-range-thumb {
                background-color: ${this.pastelYellow};
            }
            .slider.pastel-green::-webkit-slider-thumb {
                background-color: ${this.pastelGreen};
            }      
            .slider.pastel-green::-moz-range-thumb {
                background-color: ${this.pastelGreen};
            }
            .slider.pastel-blue::-webkit-slider-thumb {
                background-color: ${this.pastelBlue};
            }      
            .slider.pastel-blue::-moz-range-thumb {
                background-color: ${this.pastelBlue};
            }
            .slider.pastel-purple::-webkit-slider-thumb {
                background-color: ${this.pastelPurple};
            }      
            .slider.pastel-purple::-moz-range-thumb {
                background-color: ${this.pastelPurple};
            }
            .slider.light-blue::-webkit-slider-thumb {
                background-color: ${this.lightBlue};
            }      
            .slider.light-blue::-moz-range-thumb {
                background-color: ${this.lightBlue};
            }
            .slider.pink::-webkit-slider-thumb {
                background-color: ${this.pink};
            }      
            .slider.pink::-moz-range-thumb {
                background-color: ${this.pink};
            }

            /* change tool color on selection (horizontal orientation) */

            button.clicked.black.horizontal-orientation {
                border-bottom-color: ${this.black};
                box-shadow: 0 3px 0px 0px ${this.black};
            }  
            button.clicked.white.horizontal-orientation {
                border-bottom-color: ${this.white};
                box-shadow: 0 3px 0px 0px ${this.white};
            }        
            button.clicked.silver.horizontal-orientation {
                border-bottom-color: ${this.silver};
                box-shadow: 0 3px 0px 0px ${this.silver};
            }             
            button.clicked.gray.horizontal-orientation {
                border-bottom-color: ${this.gray};
                box-shadow: 0 3px 0px 0px ${this.gray};
            }               
            button.clicked.dark-gray.horizontal-orientation {
                border-bottom-color: ${this.darkGray};
                box-shadow: 0 3px 0px 0px ${this.darkGray};
            }              
            button.clicked.charcoal.horizontal-orientation {
                border-bottom-color: ${this.charcoal};
                box-shadow: 0 3px 0px 0px ${this.charcoal};
            }      
            button.clicked.magenta.horizontal-orientation {
                border-bottom-color: ${this.magenta};
                box-shadow: 0 3px 0px 0px ${this.magenta};
            }    
            button.clicked.red.horizontal-orientation {
                border-bottom-color: ${this.red};
                box-shadow: 0 3px 0px 0px ${this.red};
            }    
            button.clicked.red-orange.horizontal-orientation {
                border-bottom-color: ${this.redOrange};
                box-shadow: 0 3px 0px 0px ${this.redOrange};
            }            
            button.clicked.orange.horizontal-orientation {
                border-bottom-color: ${this.orange};
                box-shadow: 0 3px 0px 0px ${this.orange};
            }      
            button.clicked.gold.horizontal-orientation {
                border-bottom-color: ${this.gold};
                box-shadow: 0 3px 0px 0px ${this.orange};
            }      
            button.clicked.yellow.horizontal-orientation {
                border-bottom-color: ${this.yellow};
                box-shadow: 0 3px 0px 0px ${this.yellow};
            }      
            button.clicked.grass-green.horizontal-orientation {
                border-bottom-color: ${this.grassGreen};
                box-shadow: 0 3px 0px 0px ${this.grassGreen};
            }               
            button.clicked.green.horizontal-orientation {
                border-bottom-color: ${this.green};
                box-shadow: 0 3px 0px 0px ${this.green};
            }                
            button.clicked.dark-green.horizontal-orientation {
                border-bottom-color: ${this.darkGreen};
                box-shadow: 0 3px 0px 0px ${this.darkGreen};
            }                
            button.clicked.teal.horizontal-orientation {
                border-bottom-color: ${this.teal};
                box-shadow: 0 3px 0px 0px ${this.teal};
            }                 
            button.clicked.blue.horizontal-orientation {
                border-bottom-color: ${this.blue};
                box-shadow: 0 3px 0px 0px ${this.blue};
            }                 
            button.clicked.indigo.horizontal-orientation {
                border-bottom-color: ${this.indigo};
                box-shadow: 0 3px 0px 0px ${this.indigo};
            }      
            button.clicked.violet.horizontal-orientation {
                border-bottom-color: ${this.violet};
                box-shadow: 0 3px 0px 0px ${this.violet};
            }      
            button.clicked.purple.horizontal-orientation {
                border-bottom-color: ${this.purple};
                box-shadow: 0 3px 0px 0px ${this.purple};
            }      
            button.clicked.beige.horizontal-orientation {
                border-bottom-color: ${this.beige};
                box-shadow: 0 3px 0px 0px ${this.beige};
            }      
            button.clicked.light-brown.horizontal-orientation {
                border-bottom-color: ${this.lightBrown};
                box-shadow: 0 3px 0px 0px ${this.lightBrown};
            }      
            button.clicked.brown.horizontal-orientation {
                border-bottom-color: ${this.brown};
                box-shadow: 0 3px 0px 0px ${this.brown};
            }      
            button.clicked.dark-brown.horizontal-orientation {
                border-bottom-color: ${this.darkBrown};
                box-shadow: 0 3px 0px 0px ${this.darkBrown};
            }      
            button.clicked.pastel-pink.horizontal-orientation {
                border-bottom-color: ${this.pastelPink};
                box-shadow: 0 3px 0px 0px ${this.pastelPink};
            }      
            button.clicked.pastel-orange.horizontal-orientation {
                border-bottom-color: ${this.pastelOrange};
                box-shadow: 0 3px 0px 0px ${this.pastelOrange};
            }      
            button.clicked.pastel-yellow.horizontal-orientation {
                border-bottom-color: ${this.pastelYellow};
                box-shadow: 0 3px 0px 0px ${this.pastelYellow};
            }      
            button.clicked.pastel-green.horizontal-orientation {
                border-bottom-color: ${this.pastelGreen};
                box-shadow: 0 3px 0px 0px ${this.pastelGreen};
            }      
            button.clicked.pastel-blue.horizontal-orientation {
                border-bottom-color: ${this.pastelBlue};
                box-shadow: 0 3px 0px 0px ${this.pastelBlue};
            }      
            button.clicked.pastel-purple.horizontal-orientation {
                border-bottom-color: ${this.pastelPurple};
                box-shadow: 0 3px 0px 0px ${this.pastelPurple};
            }         
            button.clicked.light-blue.horizontal-orientation {
                border-bottom-color: ${this.lightBlue};
                box-shadow: 0 3px 0px 0px ${this.lightBlue};
            }      
            button.clicked.pink.horizontal-orientation {
                border-bottom-color: ${this.pink};
                box-shadow: 0 3px 0px 0px ${this.pink};
            }

            /* change tool color on selection (vertical orientation) */

            button.clicked.black.vertical-orientation {
                border-right-color: ${this.black};
                box-shadow: 3px 0px 0px 0px ${this.black};
            }  
            button.clicked.white.vertical-orientation {
                border-right-color: ${this.white};
                box-shadow: 3px 0px 0px 0px ${this.white};
            }        
            button.clicked.silver.vertical-orientation {
                border-right-color: ${this.silver};
                box-shadow: 3px 0px 0px 0px ${this.silver};
            }             
            button.clicked.gray.vertical-orientation {
                border-right-color: ${this.gray};
                box-shadow: 3px 0px 0px 0px ${this.gray};
            }               
            button.clicked.dark-gray.vertical-orientation {
                border-right-color: ${this.darkGray};
                box-shadow: 3px 0px 0px 0px ${this.darkGray};
            }              
            button.clicked.charcoal.vertical-orientation {
                border-right-color: ${this.charcoal};
                box-shadow: 3px 0px 0px 0px ${this.charcoal};
            }      
            button.clicked.magenta.vertical-orientation {
                border-right-color: ${this.magenta};
                box-shadow: 3px 0px 0px 0px ${this.magenta};
            }    
            button.clicked.red.vertical-orientation {
                border-right-color: ${this.red};
                box-shadow: 3px 0px 0px 0px ${this.red};
            }    
            button.clicked.red-orange.vertical-orientation {
                border-right-color: ${this.redOrange};
                box-shadow: 3px 0px 0px 0px ${this.redOrange};
            }            
            button.clicked.orange.vertical-orientation {
                border-right-color: ${this.orange};
                box-shadow: 3px 0px 0px 0px ${this.orange};
            }      
            button.clicked.gold.vertical-orientation {
                border-right-color: ${this.gold};
                box-shadow: 3px 0px 0px 0px ${this.gold};
            }      
            button.clicked.yellow.vertical-orientation {
                border-right-color: ${this.yellow};
                box-shadow: 3px 0px 0px 0px ${this.yellow};
            }      
            button.clicked.grass-green.vertical-orientation {
                border-right-color: ${this.grassGreen};
                box-shadow: 3px 0px 0px 0px ${this.grassGreen};
            }               
            button.clicked.green.vertical-orientation {
                border-right-color: ${this.green};
                box-shadow: 3px 0px 0px 0px ${this.green};
            }                
            button.clicked.dark-green.vertical-orientation {
                border-right-color: ${this.darkGreen};
                box-shadow: 3px 0px 0px 0px ${this.darkGreen};
            }                
            button.clicked.teal.vertical-orientation {
                border-right-color: ${this.teal};
                box-shadow: 3px 0px 0px 0px ${this.teal};
            }                 
            button.clicked.blue.vertical-orientation {
                border-right-color: ${this.blue};
                box-shadow: 3px 0px 0px 0px ${this.blue};
            }                 
            button.clicked.indigo.vertical-orientation {
                border-right-color: ${this.indigo};
                box-shadow: 3px 0px 0px 0px ${this.indigo};
            }      
            button.clicked.violet.vertical-orientation {
                border-right-color: ${this.violet};
                box-shadow: 3px 0px 0px 0px ${this.violet};
            }      
            button.clicked.purple.vertical-orientation {
                border-right-color: ${this.purple};
                box-shadow: 3px 0px 0px 0px ${this.purple};
            }      
            button.clicked.beige.vertical-orientation {
                border-right-color: ${this.beige};
                box-shadow: 3px 0px 0px 0px ${this.beige};
            }      
            button.clicked.light-brown.vertical-orientation {
                border-right-color: ${this.lightBrown};
                box-shadow: 3px 0px 0px 0px ${this.lightBrown};
            }      
            button.clicked.brown.vertical-orientation {
                border-right-color: ${this.brown};
                box-shadow: 3px 0px 0px 0px ${this.brown};
            }      
            button.clicked.dark-brown.vertical-orientation {
                border-right-color: ${this.darkBrown};
                box-shadow: 3px 0px 0px 0px ${this.darkBrown};
            }      
            button.clicked.pastel-pink.vertical-orientation {
                border-right-color: ${this.pastelPink};
                box-shadow: 3px 0px 0px 0px ${this.pastelPink};
            }      
            button.clicked.pastel-orange.vertical-orientation {
                border-right-color: ${this.pastelOrange};
                box-shadow: 3px 0px 0px 0px ${this.pastelOrange};
            }      
            button.clicked.pastel-yellow.vertical-orientation {
                border-right-color: ${this.pastelYellow};
                box-shadow: 3px 0px 0px 0px ${this.pastelYellow};
            }      
            button.clicked.pastel-green.vertical-orientation {
                border-right-color: ${this.pastelGreen};
                box-shadow: 3px 0px 0px 0px ${this.pastelGreen};
            }      
            button.clicked.pastel-blue.vertical-orientation {
                border-right-color: ${this.pastelBlue};
                box-shadow: 3px 0px 0px 0px ${this.pastelBlue};
            }      
            button.clicked.pastel-purple.vertical-orientation {
                border-right-color: ${this.pastelPurple};
                box-shadow: 3px 0px 0px 0px ${this.pastelPurple};
            }         
            button.clicked.light-blue.vertical-orientation {
                border-right-color: ${this.lightBlue};
                box-shadow: 3px 0px 0px 0px ${this.lightBlue};
            }      
            button.clicked.pink.vertical-orientation {
                border-right-color: ${this.pink};
                box-shadow: 3px 0px 0px 0px ${this.pink};
            }
        `;
    }
}