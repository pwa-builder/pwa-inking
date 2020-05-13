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
var InkingToolbar_1;
import { LitElement, html, customElement, property, css, query, CSSResult } from 'lit-element';
import { InkingCanvas } from './inking-canvas';
let InkingToolbar = InkingToolbar_1 = class InkingToolbar extends LitElement {
    constructor() {
        super();
        // properties for toolbar and its dropdowns
        this.orientation = "";
        this.isWaitingToDrawSineCanvas = false;
        // properties to influence connected inking canvas
        this.currentTool = "pen";
        this.selectedPenColor = InkingToolbar_1.black;
        this.selectedPenColorName = 'black';
        this.selectedHighlighterColor = InkingToolbar_1.yellow;
        this.selectedHighlighterColorName = 'yellow';
        this.targetInkingCanvas = "";
        // colors defined once, retrieved for css palette display and sending to canvas
        this.colors = new Map();
    }
    render() {
        return html `
            <div id="toolbar-container">
                <div id="tool-container">
                    <button id="pen" class="toolbar-icon pen-icon" @click="${this.clickedUtensil}"></button>
                    <button id="highlighter" class="toolbar-icon highlighter-icon" @click="${this.clickedUtensil}"></button>
                    <button id="eraser" class="toolbar-icon eraser-icon" @click="${this.clickedEraser}"></button>
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
                        <div>
                            <input type="checkbox" id="slider-checkbox">Use slider size</input>
                        </div>
                        <canvas class="sineCanvas"></canvas>
                        <div class="slider-container">
                            <input type="range" min="1" max="24" value="12" class="slider" @input="${this.changeStrokeSize}">
                        </div>
                    </div>
                    <div class="eraser-dropdown">
                        <button id="erase-all-btn" @click="${this.clickedEraseAll}">Erase all ink</button>
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
        this.sineContext = this.sineCanvas.getContext('2d', {
            desynchronized: true
        });
        // check for low-latency
        if ("getContextAttributes" in this.sineContext && this.sineContext.getContextAttributes().desynchronized) {
            console.log('Low latency is supported for sine wave canvas.');
        }
        else {
            console.log('Low latency is NOT supported for sine wave canvas.');
        }
        // collect reference to all dropdowns
        this.dropdowns = this.dropdownContainer.querySelectorAll('#dropdown-container > div');
        // collect reference to all color circles
        this.circles = this.dropdownContainer.querySelectorAll('#dropdown-container div div .circle');
        // set canvas to use pointer event sizing by default
        this.slider.disabled = true;
        this.sliderCheckbox.addEventListener('change', () => this.toggleSliderCheckbox(), false);
        // draw example stroke for ink dropdowns
        this.isWaitingToDrawSineCanvas = true;
        window.requestIdleCallback(() => {
            this.drawSineCanvas();
            console.log("sine canvas drawn for first time");
        });
    }
    connectCanvas() {
        const possibleCanvases = document.querySelectorAll('inking-canvas');
        possibleCanvases.forEach(possibleCanvas => {
            if (possibleCanvas.name === this.targetInkingCanvas) {
                this.inkingCanvas = possibleCanvas;
            }
        });
        // TODO: find more performant way to watch & respond to canvas resize event
        window.addEventListener('resize', () => this.requestDrawSineCanvas(), false);
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
        this.colors.set('black', InkingToolbar_1.black);
        this.colors.set('white', InkingToolbar_1.white);
        this.colors.set('silver', InkingToolbar_1.silver);
        this.colors.set('gray', InkingToolbar_1.gray);
        this.colors.set('darkGray', InkingToolbar_1.darkGray);
        this.colors.set('charcoal', InkingToolbar_1.charcoal);
        this.colors.set('magenta', InkingToolbar_1.magenta);
        this.colors.set('red', InkingToolbar_1.red);
        this.colors.set('redOrange', InkingToolbar_1.redOrange);
        this.colors.set('orange', InkingToolbar_1.orange);
        this.colors.set('gold', InkingToolbar_1.gold);
        this.colors.set('yellow', InkingToolbar_1.yellow);
        this.colors.set('grassGreen', InkingToolbar_1.grassGreen);
        this.colors.set('green', InkingToolbar_1.green);
        this.colors.set('darkGreen', InkingToolbar_1.darkGreen);
        this.colors.set('teal', InkingToolbar_1.teal);
        this.colors.set('blue', InkingToolbar_1.blue);
        this.colors.set('indigo', InkingToolbar_1.indigo);
        this.colors.set('violet', InkingToolbar_1.violet);
        this.colors.set('purple', InkingToolbar_1.purple);
        this.colors.set('beige', InkingToolbar_1.beige);
        this.colors.set('lightBrown', InkingToolbar_1.lightBrown);
        this.colors.set('brown', InkingToolbar_1.brown);
        this.colors.set('darkBrown', InkingToolbar_1.darkBrown);
        this.colors.set('pastelPink', InkingToolbar_1.pastelPink);
        this.colors.set('pastelOrange', InkingToolbar_1.pastelOrange);
        this.colors.set('pastelYellow', InkingToolbar_1.pastelYellow);
        this.colors.set('pastelGreen', InkingToolbar_1.pastelGreen);
        this.colors.set('pastelBlue', InkingToolbar_1.pastelBlue);
        this.colors.set('pastelPurple', InkingToolbar_1.pastelPurple);
        this.colors.set('lightBlue', InkingToolbar_1.lightBlue);
        this.colors.set('pink', InkingToolbar_1.pink);
    }
    toggleSliderCheckbox() {
        this.slider.disabled = !this.slider.disabled;
        this.changeStrokeSize();
    }
    requestDrawSineCanvas() {
        if (!this.isWaitingToDrawSineCanvas) {
            this.isWaitingToDrawSineCanvas = true;
        }
    }
    getCurrentUtensilColor() {
        switch (this.currentTool) {
            case "pen":
                return this.selectedPenColor.toString();
                break;
            case "highlighter":
                return this.selectedHighlighterColor.toString();
                break;
            case "eraser":
                return InkingToolbar_1.white.toString();
            default:
                console.log("could not find color for selected utensil");
                break;
        }
    }
    getCurrentUtensilColorName() {
        switch (this.currentTool) {
            case "pen":
                return this.selectedPenColorName;
                break;
            case "highlighter":
                return this.selectedHighlighterColorName;
                break;
            case "eraser":
                return "white";
            default:
                console.log("could not find color for selected utensil");
                break;
        }
    }
    setCurrentUtensilColor(color) {
        switch (this.currentTool) {
            case "pen":
                this.selectedPenColor = color;
                break;
            case "highlighter":
                this.selectedHighlighterColor = color;
                break;
            case "eraser":
                return InkingToolbar_1.white;
            default:
                console.log("could not find color for selected utensil");
                break;
        }
    }
    setCurrentUtensilColorName(colorName) {
        switch (this.currentTool) {
            case "pen":
                this.selectedPenColorName = colorName;
                break;
            case "highlighter":
                this.selectedHighlighterColorName = colorName;
                break;
            case "eraser":
                break;
            default:
                console.log("could not find color for selected utensil");
                break;
        }
    }
    drawSineCanvas() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isWaitingToDrawSineCanvas) {
                // toggle semaphore to prevent unnecessary redraws
                this.isWaitingToDrawSineCanvas = false;
                // define stroke size and pen color for new sine wave
                let strokeWidth = parseInt(this.slider.value) * this.inkingCanvas.getScale() * 1.5;
                this.sineContext.lineWidth = strokeWidth;
                this.sineContext.strokeStyle = this.getCurrentUtensilColor();
                // clear canvas for new sine wave
                this.sineContext.clearRect(0, 0, this.sineCanvas.width, this.sineCanvas.height);
                this.sineContext.fillStyle = InkingToolbar_1.colorPaletteBackground.toString();
                this.sineContext.fillRect(0, 0, this.sineCanvas.width, this.sineCanvas.height);
                // make the stroke points round
                this.sineContext.lineCap = 'round';
                this.sineContext.lineJoin = 'round';
                let w = this.sineCanvas.width;
                // determine vertical center of sine wave in canvas
                let h = this.sineCanvas.height / 2;
                let a = h / 2; // amplitude (height of wave)
                let f = 1; // frequency (1 wave)
                // formula for sine wave is:
                // y = a * sin( ( 2 * pi * (frequency/timePeriod) * x ) + offsetFromOrigin)
                // where timePeriod is width of canvas & offsetFromOrigin is 0
                // and x & y are the coordinates we want to draw on
                // start drawing the sine wave at an horizontal offset so it doesn't appear clipped off
                let x = strokeWidth;
                // vertically center start of the output by subtracting
                // the sine wave y calcualation from h (half the canvas height)
                let previousY = h - (a * Math.sin(2 * Math.PI * f / w * x));
                let currentY;
                let strokesDrawn = 0;
                // draw the sine wave until just before the canvas ends to avoid clipping off end
                for (let i = strokeWidth; i < w - strokeWidth; i++) {
                    this.sineContext.beginPath();
                    this.sineContext.moveTo(x, previousY);
                    x = i;
                    currentY = h - (a * Math.sin(2 * Math.PI * f / w * x));
                    this.sineContext.lineTo(x, currentY);
                    previousY = currentY;
                    if (this.currentTool === "pencil") {
                        this.inkingCanvas.drawPencilStroke(this.sineContext, x - 1, x, previousY, currentY);
                    }
                    else {
                        this.sineContext.stroke();
                    }
                    strokesDrawn++;
                }
                // console.log("sineCanvas strokes drawn: " + strokesDrawn);
            }
            // start & continue sine wave drawing loop
            window.requestIdleCallback(() => {
                requestAnimationFrame(() => __awaiter(this, void 0, void 0, function* () { return this.drawSineCanvas(); }));
            });
        });
    }
    clickedUtensil(e) {
        let utensil = e.target;
        console.log(utensil.id + " button clicked!");
        this.updateCurrentTool(utensil);
        this.switchUtensil(utensil);
    }
    clickedEraser(e) {
        let eraser = e.target;
        console.log(eraser.id + " button clicked!");
        this.updateCurrentTool(eraser);
        this.toggleDropdown(this.eraserDropdown, "show-dropdown", eraser === this.lastClickedBtn);
        this.lastClickedBtn = eraser;
        this.toggleActiveTool(this.lastClickedBtn);
    }
    clickedEraseAll(e) {
        let eraseAllBtn = e.target;
        console.log(eraseAllBtn.id + " has been clicked!");
        window.requestIdleCallback(() => __awaiter(this, void 0, void 0, function* () {
            this.inkingCanvas.eraseAll();
        }));
        this.lastClickedBtn = eraseAllBtn;
    }
    // clickedCopy() {
    //     if (this.inkingCanvas) {
    //         this.inkingCanvas.copyCanvasContents();
    //     } else {
    //         console.log("cannot copy - inking canvas not connected");
    //     }
    // }
    switchUtensil(el) {
        let utensilName = el.id;
        this.inkingCanvas.changeToolStyle(utensilName);
        if (utensilName === "highlighter") {
            this.togglePalette(this.penPencilPalette, this.highlighterPalette);
            this.sineContext.globalCompositeOperation = "source-over";
        }
        else {
            this.togglePalette(this.highlighterPalette, this.penPencilPalette);
            this.sineContext.globalCompositeOperation = "source-over";
        }
        this.toggleDropdown(this.inkDropdown, "show-dropdown", el === this.lastClickedBtn);
        this.lastClickedBtn = el;
        this.toggleActiveTool(this.lastClickedBtn);
    }
    toggleActiveTool(lastClickedTool) {
        for (let tool of this.tools) {
            if (tool === lastClickedTool && this.isUtensil(tool.id) && !tool.classList.contains('clicked')) {
                tool.classList.add('clicked');
                // use the css friendly color class name with dashes
                let colorName = this.toDash(this.getCurrentUtensilColorName());
                tool.classList.add(colorName);
                let selectedCircle;
                if (this.currentTool === "highlighter") {
                    selectedCircle = this.inkDropdown.querySelector('.ink-dropdown .highlighter .' + colorName);
                }
                else {
                    selectedCircle = this.inkDropdown.querySelector('.ink-dropdown .pen-pencil .' + colorName);
                }
                this.toggleActiveCircles(selectedCircle);
                this.updateSliderColor(colorName);
            }
            else if (tool !== lastClickedTool) {
                if (tool.classList.contains('clicked')) {
                    // remove the color class which should be the last and 5th class
                    tool.classList.remove(tool.classList[4]);
                    tool.classList.remove('clicked');
                }
            }
        }
    }
    toggleActiveCircles(selectedCircle) {
        // make sure this circle looks clicked and others don't
        for (let circle of this.circles) {
            if (circle === selectedCircle && !circle.classList.contains("clicked")) {
                selectedCircle.classList.add("clicked");
            }
            else if (circle !== selectedCircle && circle.classList.contains("clicked")) {
                circle.classList.remove("clicked");
            }
        }
    }
    togglePalette(old, current) {
        if (old.classList.contains("show-palette"))
            old.classList.remove("show-palette");
        if (!current.classList.contains("show-palette")) {
            current.classList.add("show-palette");
        }
    }
    toggleDropdown(selectedDropdown, showClass, isLastElementClicked) {
        for (let dropdown of this.dropdowns) {
            if (dropdown === selectedDropdown) {
                if (selectedDropdown.classList.contains(showClass)) {
                    if (isLastElementClicked)
                        selectedDropdown.classList.remove(showClass);
                }
                else {
                    selectedDropdown.classList.add(showClass);
                }
            }
            else {
                if (dropdown.classList.contains(showClass))
                    dropdown.classList.remove(showClass);
            }
        }
    }
    isUtensil(tool) {
        return (tool === 'pen' || tool === 'pencil' || tool === 'highlighter');
    }
    updateCurrentTool(selectedTool) {
        if (selectedTool.id !== this.currentTool) {
            this.currentTool = selectedTool.id;
            this.inkingCanvas.changeToolStyle(this.currentTool);
            if (this.isUtensil(selectedTool.id) || selectedTool.id === 'eraser') {
                this.changeInkingColor();
                if (this.sineCanvas) {
                    this.requestDrawSineCanvas();
                }
            }
        }
    }
    changeInkingColor(color, colorName) {
        if (this.inkingCanvas) {
            if (color)
                this.setCurrentUtensilColor(color);
            if (colorName)
                this.setCurrentUtensilColorName(colorName);
            if (this.lastClickedBtn && this.lastClickedBtn.classList.contains('clicked')) {
                // remove the color class which should be the last and 5th class
                this.lastClickedBtn.classList.remove(this.lastClickedBtn.classList[4]);
                // use the css friendly color class name with dashes
                let modifiedColorName = this.toDash(this.getCurrentUtensilColorName());
                this.lastClickedBtn.classList.add(modifiedColorName);
            }
            this.inkingCanvas.changeUtensilColor(this.getCurrentUtensilColor());
        }
    }
    clickedColor(event) {
        // find clicked color grid element through its class
        let eventEl = event.target;
        let colorClass = eventEl.className.replace('clicked', '').replace('circle', '').trim();
        // get color string from css color
        let colorName = this.toCamelCase(colorClass);
        let backgroundColor = this.colors.get(colorName);
        this.changeInkingColor(backgroundColor, colorName);
        this.updateSliderColor(colorClass);
        if (this.sineCanvas) {
            this.requestDrawSineCanvas();
        }
        this.toggleActiveCircles(eventEl);
    }
    updateSliderColor(colorClass) {
        if (this.slider) {
            if (this.slider.classList.length > 1) {
                // "slider" class is at index 0 so anything after should be a color
                this.slider.classList.remove(this.slider.classList[1]);
            }
            this.slider.classList.add(colorClass);
        }
    }
    changeStrokeSize() {
        if (this.inkingCanvas) {
            if (this.slider.disabled) {
                this.inkingCanvas.changeStrokeSize(-1);
            }
            else {
                this.inkingCanvas.changeStrokeSize(parseInt(this.slider.value));
                if (this.sineCanvas) {
                    this.requestDrawSineCanvas();
                }
            }
        }
    }
    toCamelCase(str) {
        return str.toLowerCase().replace(/-(.)/g, function (match, upperLetter) {
            return upperLetter.toUpperCase();
        });
    }
    toDash(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    static get styles() {
        return css `
            #toolbar-container {
                position: relative;
                display: inline-block;
                margin: 2px;
            }
            #tool-container {
                background-color: ${InkingToolbar_1.white};
                border: 2px solid ${InkingToolbar_1.white};
                display: inline-block;
            }
            #tool-container.vertical-orientation {
                display: inline-block;
                vertical-align: top;
            }
            button {
                position: relative;
            }
            button.toolbar-icon {
                background-color: ${InkingToolbar_1.white};
                outline: none;
                border: 2px solid ${InkingToolbar_1.white};
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
            button#erase-all-btn {
                border: none;
                outline: none;
            }
            button:hover.toolbar-icon {
                border-color: ${InkingToolbar_1.gray};
                background-color: ${InkingToolbar_1.lightGray};
            }
            button:hover#erase-all-btn {
                background-color: ${InkingToolbar_1.silver};
            }  
            .toolbar-icon {
                height: 53px;
                width: 53px;
                background-size: 50px 50px;
                background-repeat: no-repeat;
                background-position: 0px 0px;
            }
            .title {
                display: block;
                padding-bottom: 10px;
            }
            .pen-icon {
                background-image: url(../icons/toolbar_icons/v1/ic_pen.svg);
            }
            .pencil-icon {
                background-image: url(../icons/toolbar_icons/v1/ic_pencil.svg);
            }
            .highlighter-icon {
                background-image: url(../icons/toolbar_icons/v1/ic_highlighter.svg);
            }
            .eraser-icon {
                background-image: url(../icons/toolbar_icons/v1/ic_eraser.svg);
            }
            .ruler-icon {
                background-image: url(../icons/toolbar_icons/v1/ic_ruler.svg);
            }
            .copy-icon {
                background-image: url(../icons/toolbar_icons/v1/ic_copy.svg);
            }
            .save-icon {
                background-image: url(../icons/toolbar_icons/v1/ic_save.svg);
            }
            #dropdown-container {
                background-color: ${this.colorPaletteBackground};
            }
            #dropdown-container.vertical-orientation {
                display: inline-block;
            }
            .ink-dropdown {
                display: none;
                padding: 10px;
                font-family: sans-serif;
                font-size: 16px;
            }
            .eraser-dropdown {
                display: none;
                margin: 0 auto;
            }
            .show-dropdown {
                display: block;
            }
            #erase-all-btn {
                width: 100%;
                padding: 25px;
                margin-top: 10px;
                margin-bottom: 10px;
                font-family: sans-serif;
                font-size: 16px;
            }
            .palette {
                display: none;
                grid-template-columns: repeat(6, 1fr);
                grid-gap: 5px;
                grid-auto-rows: minmax(25px, auto);
                justify-items: center;
                align-items: center;
                justify-content: center;
                align-content: center;
                padding-bottom: 15px;
            }
            .show-palette {
                display: grid
            }
            .circle {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                border: 7px solid ${this.colorPaletteBackground};
            }
            .circle:hover, .circle:active {
                width: 40px;
                height: 40px;
                border: 2px solid ${this.colorPaletteBackground};
            }
            .circle.clicked {
                width: 30px;
                height: 30px;
                border: 3px solid ${this.colorPaletteBackground};
                box-shadow: 0px 0px 0px 2px black;
                border-radius: 50%;
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
                height: 100px;
                width: 85%;
                background-color: transparent;
                padding-left: 0;
                padding-right: 0;
                margin-left: auto;
                margin-right: auto;
                display: block;
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
            }
            .slider:hover {
                opacity: 1;
            }
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 10px;
                height: 25px;
                background-color: gray;
                border-radius: 5px;
                cursor: pointer;
            }
            .slider::-moz-range-thumb {
                width: 10px;
                height: 25px;
                background-color: gray;
                border-radius: 5px;
                cursor: pointer;
            }
            .slider::-moz-range-progress {
                background: gray;
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
            .slider.black::-moz-range-thumb {
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
};
InkingToolbar.black = css `#000000`;
InkingToolbar.white = css `#ffffff`;
InkingToolbar.silver = css `#d1d3d4`;
InkingToolbar.gray = css `#a7a9ac`;
InkingToolbar.darkGray = css `#808285`;
InkingToolbar.charcoal = css `#58595b`;
InkingToolbar.magenta = css `#b31564`;
InkingToolbar.red = css `#e61b1b`;
InkingToolbar.redOrange = css `#ff5500`;
InkingToolbar.orange = css `#ffaa00`;
InkingToolbar.gold = css `#ffce00`;
InkingToolbar.yellow = css `#ffe600`;
InkingToolbar.grassGreen = css `#a2e61b`;
InkingToolbar.green = css `#26e600`;
InkingToolbar.darkGreen = css `#008055`;
InkingToolbar.teal = css `#00aacc`;
InkingToolbar.blue = css `#004de6`;
InkingToolbar.indigo = css `#3d00b8`;
InkingToolbar.violet = css `#6600cc`;
InkingToolbar.purple = css `#600080`;
InkingToolbar.beige = css `#f7d7c4`;
InkingToolbar.lightBrown = css `#bb9167`;
InkingToolbar.brown = css `#8e562e`;
InkingToolbar.darkBrown = css `#613d30`;
InkingToolbar.pastelPink = css `#ff80ff`;
InkingToolbar.pastelOrange = css `#ffc680`;
InkingToolbar.pastelYellow = css `#ffff80`;
InkingToolbar.pastelGreen = css `#80ff9e`;
InkingToolbar.pastelBlue = css `#80d6ff`;
InkingToolbar.pastelPurple = css `#bcb3ff`;
InkingToolbar.colorPaletteBackground = css `#f2f2f2`;
// colors specific to highlighter
InkingToolbar.lightBlue = css `#44c8f5`;
InkingToolbar.pink = css `#ec008c`;
// color used in toolbar
InkingToolbar.lightGray = css `#e8e8e8`;
__decorate([
    property({ type: String })
], InkingToolbar.prototype, "orientation", void 0);
__decorate([
    query('#tool-container')
], InkingToolbar.prototype, "toolContainer", void 0);
__decorate([
    property({ type: NodeList })
], InkingToolbar.prototype, "tools", void 0);
__decorate([
    query('#dropdown-container')
], InkingToolbar.prototype, "dropdownContainer", void 0);
__decorate([
    property({ type: NodeList })
], InkingToolbar.prototype, "dropdowns", void 0);
__decorate([
    query('.eraser-dropdown')
], InkingToolbar.prototype, "eraserDropdown", void 0);
__decorate([
    query('.ink-dropdown')
], InkingToolbar.prototype, "inkDropdown", void 0);
__decorate([
    property({ type: NodeList })
], InkingToolbar.prototype, "circles", void 0);
__decorate([
    query('#pen')
], InkingToolbar.prototype, "penBtn", void 0);
__decorate([
    query('#pencil')
], InkingToolbar.prototype, "pencilBtn", void 0);
__decorate([
    query('#highlighter')
], InkingToolbar.prototype, "highlighterBtn", void 0);
__decorate([
    query('#eraser')
], InkingToolbar.prototype, "eraserBtn", void 0);
__decorate([
    query('#erase-all-btn')
], InkingToolbar.prototype, "eraseAllBtn", void 0);
__decorate([
    query('.pen-pencil.palette')
], InkingToolbar.prototype, "penPencilPalette", void 0);
__decorate([
    query('.highlighter.palette')
], InkingToolbar.prototype, "highlighterPalette", void 0);
__decorate([
    query('#slider-checkbox')
], InkingToolbar.prototype, "sliderCheckbox", void 0);
__decorate([
    query('.slider')
], InkingToolbar.prototype, "slider", void 0);
__decorate([
    query('.sineCanvas')
], InkingToolbar.prototype, "sineCanvas", void 0);
__decorate([
    property({ type: CanvasRenderingContext2D })
], InkingToolbar.prototype, "sineContext", void 0);
__decorate([
    property({ type: Boolean })
], InkingToolbar.prototype, "isWaitingToDrawSineCanvas", void 0);
__decorate([
    property({ type: HTMLButtonElement })
], InkingToolbar.prototype, "lastClickedBtn", void 0);
__decorate([
    property({ type: String })
], InkingToolbar.prototype, "currentTool", void 0);
__decorate([
    property({ type: CSSResult })
], InkingToolbar.prototype, "selectedPenColor", void 0);
__decorate([
    property({ type: CSSResult })
], InkingToolbar.prototype, "selectedPenColorName", void 0);
__decorate([
    property({ type: CSSResult })
], InkingToolbar.prototype, "selectedHighlighterColor", void 0);
__decorate([
    property({ type: CSSResult })
], InkingToolbar.prototype, "selectedHighlighterColorName", void 0);
__decorate([
    property({ type: String })
], InkingToolbar.prototype, "targetInkingCanvas", void 0);
__decorate([
    property({ type: InkingCanvas })
], InkingToolbar.prototype, "inkingCanvas", void 0);
InkingToolbar = InkingToolbar_1 = __decorate([
    customElement('inking-toolbar')
], InkingToolbar);
export { InkingToolbar };
