import { LitElement, html, property, customElement } from 'lit-element';
import { InkingToolbarButtonStyles } from './inking-toolbar-button-styles.js';
import { InkingToolbar } from "./inking-toolbar";

@customElement('inking-toolbar-pen')
export class InkingToolbarPen extends LitElement {
    render() {
        return html`
            <button part="button" id="pen" class="toolbar-icon pen-icon tooltip">
                <span class="tooltip-text">Pen</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        let toolbar: InkingToolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (toolbar) toolbar.addToolbarButton(this, "inking-toolbar-pen");

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-pencil')
export class InkingToolbarPencil extends LitElement {
    render() {
        return html`
            <button part="button" id="pencil" class="toolbar-icon pencil-icon tooltip">
                <span class="tooltip-text">Pencil</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        let toolbar: InkingToolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (toolbar) toolbar.addToolbarButton(this, "inking-toolbar-pencil");

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-highlighter')
export class InkingToolbarHighlighter extends LitElement {
    render() {
        return html`
            <button part="button" id="highlighter" class="toolbar-icon highlighter-icon tooltip">
                <span class="tooltip-text">Highlighter</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        let toolbar: InkingToolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (toolbar) toolbar.addToolbarButton(this, "inking-toolbar-highlighter");

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-eraser')
export class InkingToolbarEraser extends LitElement {
    render() {
        return html`
            <button part="button" id="eraser" class="toolbar-icon eraser-icon tooltip">
                <span class="tooltip-text">Eraser</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        let toolbar: InkingToolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (toolbar) toolbar.addToolbarButton(this, "inking-toolbar-eraser");

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-copy')
export class InkingToolbarCopy extends LitElement {
    render() {
        return html`
            <button part="button" id-"copy" class="toolbar-icon copy-icon tooltip">
                <span class="tooltip-text">Copy</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        let toolbar: InkingToolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (toolbar) toolbar.addToolbarButton(this, "inking-toolbar-copy");

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}

@customElement('inking-toolbar-save')
export class InkingToolbarSave extends LitElement {
    render() {
        return html`
            <button part="button" id-"save" class="toolbar-icon save-icon tooltip">
                <span class="tooltip-text">Save</span>
            </button>
        `;
    }
    constructor() {
        super();
    }
    firstUpdated() {
        
        // find parent inking toolbar
        let toolbar: InkingToolbar = <InkingToolbar>this.shadowRoot.host.parentElement;
        if (toolbar) toolbar.addToolbarButton(this, "inking-toolbar-save");

    }
    static get styles() {
        return [
            InkingToolbarButtonStyles
        ]
    }
}