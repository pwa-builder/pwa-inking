import { LitElement, html, property, customElement, query } from 'lit-element';
import { InkingToolbarButtonStyles } from './inking-toolbar-button-styles';
import { InkingToolbar } from "./inking-toolbar";

@customElement('inking-toolbar-pen')
export class InkingToolbarPen extends LitElement {

    @property({type: InkingToolbar}) private toolbar: InkingToolbar;
    @query("button") private toolButton: HTMLButtonElement;

    render() {
        return html`
            <button part="button" id="pen" class="toolbar-icon pen-icon tooltip"
            aria-label="pen" role="tab" aria-controls="dropdown-container">
                <span class="tooltip-text">Pen</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        this.toolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (this.toolbar) {

            // add this tool component to its parent toolbar
            this.toolbar.addToolbarButton(this, "inking-toolbar-pen");

            // update state of tool button for accessbility
            let toolName = this.toolbar.getCurrentToolName();
            this.toolbar.addEventListener("tool-changed", () => {
                toolName = this.toolbar.getCurrentToolName();
                this.toolButton.setAttribute("tabindex", toolName && toolName === "pen" ? "0" : "-1");
                this.toolButton.setAttribute("aria-pressed", toolName && toolName === "pen" ? "0" : "-1");
            }, false);

        }

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-pencil')
export class InkingToolbarPencil extends LitElement {

    @property({type: InkingToolbar}) private toolbar: InkingToolbar;
    @query("button") private toolButton: HTMLButtonElement;

    render() {
        return html`
            <button part="button" id="pencil" class="toolbar-icon pencil-icon tooltip"
            aria-label="pencil" role="tab" aria-controls="dropdown-container">
                <span class="tooltip-text">Pencil</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        this.toolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (this.toolbar) {

            // add this tool component to its parent toolbar            
            this.toolbar.addToolbarButton(this, "inking-toolbar-pencil");

            // update state of tool button for accessbility
            let toolName = this.toolbar.getCurrentToolName();
            this.toolbar.addEventListener("tool-changed", () => {
                toolName = this.toolbar.getCurrentToolName();
                this.toolButton.setAttribute("tabindex", toolName && toolName === "pencil" ? "0" : "-1");
                this.toolButton.setAttribute("aria-pressed", toolName && toolName === "pencil" ? "0" : "-1");
            }, false);

        }

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-highlighter')
export class InkingToolbarHighlighter extends LitElement {

    @property({type: InkingToolbar}) private toolbar: InkingToolbar;
    @query("button") private toolButton: HTMLButtonElement;

    render() {
        return html`
            <button part="button" id="highlighter" class="toolbar-icon highlighter-icon tooltip"
            aria-label="highlighter" role="tab" aria-controls="dropdown-container">
                <span class="tooltip-text">Highlighter</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        this.toolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (this.toolbar) {

            // add this tool component to its parent toolbar
            this.toolbar.addToolbarButton(this, "inking-toolbar-highlighter");

            // update state of tool button for accessbility
            let toolName = this.toolbar.getCurrentToolName();
            this.toolbar.addEventListener("tool-changed", () => {
                toolName = this.toolbar.getCurrentToolName();
                this.toolButton.setAttribute("tabindex", toolName && toolName === "highlighter" ? "0" : "-1");
                this.toolButton.setAttribute("aria-pressed", toolName && toolName === "highlighter" ? "0" : "-1");
            }, false);

        }

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-eraser')
export class InkingToolbarEraser extends LitElement {

    @property({type: InkingToolbar}) private toolbar: InkingToolbar;
    @query("button") private toolButton: HTMLButtonElement;

    render() {
        return html`
            <button part="button" id="eraser" class="toolbar-icon eraser-icon tooltip"
            aria-label="eraser" role="tab" aria-controls="dropdown-container">
                <span class="tooltip-text">Eraser</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        this.toolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (this.toolbar) {

            // add this tool component to its parent toolbar
            this.toolbar.addToolbarButton(this, "inking-toolbar-eraser");

            // update state of tool button for accessbility
            let toolName = this.toolbar.getCurrentToolName();
            this.toolbar.addEventListener("tool-changed", () => {
                toolName = this.toolbar.getCurrentToolName();
                this.toolButton.setAttribute("tabindex", toolName && toolName === "eraser" ? "0" : "-1");
                this.toolButton.setAttribute("aria-pressed", toolName && toolName === "eraser" ? "0" : "-1");
            }, false);

        }

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-copy')
export class InkingToolbarCopy extends LitElement {

    @property({type: InkingToolbar}) private toolbar: InkingToolbar;
    @query("button") private toolButton: HTMLButtonElement;

    render() {
        return html`
            <button part="button" id="copy" class="toolbar-icon copy-icon tooltip"
            aria-label="copy" role="tab">
                <span class="tooltip-text">Copy</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        this.toolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (this.toolbar) {

            // add this tool component to its parent toolbar
            this.toolbar.addToolbarButton(this, "inking-toolbar-copy");

            // update state of tool button for accessbility
            let toolName = this.toolbar.getCurrentToolName();
            this.toolbar.addEventListener("tool-changed", () => {
                toolName = this.toolbar.getCurrentToolName();
                this.toolButton.setAttribute("tabindex", toolName && toolName === "copy" ? "0" : "-1");
                this.toolButton.setAttribute("aria-pressed", toolName && toolName === "copy" ? "0" : "-1");
            }, false);

        }

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-save')
export class InkingToolbarSave extends LitElement {

    @property({type: InkingToolbar}) private toolbar: InkingToolbar;
    @query("button") private toolButton: HTMLButtonElement;

    render() {
        return html`
            <button part="button" id="save" class="toolbar-icon save-icon tooltip"
            aria-label="save" role="tab">
                <span class="tooltip-text">Save</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        this.toolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (this.toolbar) {

            // add this tool component to its parent toolbar
            this.toolbar.addToolbarButton(this, "inking-toolbar-save");

            // update state of tool button for accessbility
            let toolName = this.toolbar.getCurrentToolName();
            this.toolbar.addEventListener("tool-changed", () => {
                toolName = this.toolbar.getCurrentToolName();
                this.toolButton.setAttribute("tabindex", toolName && toolName === "save" ? "0" : "-1");
                this.toolButton.setAttribute("aria-pressed", toolName && toolName === "save" ? "0" : "-1");
            }, false);

        }

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}