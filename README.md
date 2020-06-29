# pwa-inking

A [web component](https://meowni.ca/posts/web-components-with-otters/) from the [PWABuilder](https://pwabuilder.com) team that allows you to quickly add a 2D inking canvas (with an optional toolbar) to your Progressive Web App 🎨 ✨

_Built with [lit-element](https://lit-element.polymer-project.org/)_

## What does it look like?

<img loading="lazy" alt="an image of what the component looks like" src="https://github.com/pwa-builder/pwa-inking/raw/master/assets/images/example.png"/>

## Supported Browsers
- Edge
- Chrome
- Firefox
- Safari

## Using this component

## Install

There are two ways to use this component. For simple projects or just to get started fast, we recommend using the component by script tag. If your project is using [npm](https://www.npmjs.com/) then we recommend using the npm package.

### Script tag

1. Add this script tag in the head of your index.html:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@pwabuilder/pwa-inking"
></script>
```

### NPM

1. Run this command in your project directory:
```shell
npm install @pwabuilder/pwa-inking
```

2. Add this import statement to your script file:
```js
import @pwabuilder/pwa-inking
```

## Adding the component to your code

### Canvas only

You can use the element `<inking-canvas></inking-canvas>` anywhere in your template, JSX, html etc. By itself, you will get a blank, bordered canvas which you can control through its APIs (see [table](#inking-canvas) for details).

```html
    <inking-canvas name="myInkingCanvas"></inking-canvas>
```

Try it: [live](https://pwa-inking-canvas-only.glitch.me/) | [code](https://glitch.com/edit/#!/pwa-inking-canvas-only?path=index.html%3A20%3A41)

### Canvas with default toolbar

You can also add the `<inking-toolbar></inking-toolbar>` element within the `<inking-canvas></inking-canvas>` element so the user can control the canvas visually. To connect these elements, their respective `canvas` and `name` attribute values must match. The default toolbar contains all 6 tools in the following order: pen, pencil, highlighter, eraser, copy, and save.

```html
    <inking-canvas name="myInkingCanvas">
        <inking-toolbar canvas="myInkingCanvas"></inking-toolbar>
    </inking-canvas>
```

Try it: [live](https://pwa-inking.glitch.me/) | [code](https://glitch.com/edit/#!/pwa-inking?path=index.html%3A1%3A0)

### Canvas with customized toolbar

You can also specify the toolbar layout and select which subset of tools you want to include.

| Toolbar layout options | Possible values                                            | 
| ---------------------- | ---------------------------------------------------------- | 
| `orientation`          | horizontal or vertical                                     |                                                 
| `vertical`             | top, center, or bottom                                     |
| `horizontal`           | left, center, or right                                     ||

Available tool components (which can be added in any order):

- `<inking-toolbar-pen></inking-toolbar-pen>`
- `<inking-toolbar-pencil></inking-toolbar-pencil>`
- `<inking-toolbar-highlighter></inking-toolbar-highlighter>`
- `<inking-toolbar-eraser></inking-toolbar-eraser>`
- `<inking-toolbar-copy></inking-toolbar-copy>`
- `<inking-toolbar-save></inking-toolbar-save>`

Example usage:

```html
<inking-canvas name="myInkingCanvas">
        <inking-toolbar canvas="myInkingCanvas" orientation="vertical" vertical="bottom" horizontal="right">
            <inking-toolbar-highlighter></inking-toolbar-highlighter>
            <inking-toolbar-pen></inking-toolbar-pen>
            <inking-toolbar-eraser></inking-toolbar-eraser>
            <inking-toolbar-save></inking-toolbar-save>
        </inking-toolbar>
    </inking-canvas>
```

Try it: [live](https://pwa-inking-customized-toolbar.glitch.me/) | [code](https://glitch.com/edit/#!/pwa-inking-customized-toolbar?path=index.html%3A25%3A55)

## Default inking behavior

By default `<inking-canvas></inking-canvas>` will create ink strokes with a width depending on the active pointer event:

| Pointer event       | Property influencing ink stroke width       | Notes
| ------------------- | ------------------------------------------- | --------------------------------------------------------- |
| `mouse`             | `width`                                     | Always 1 pixel                                            |
| `touch`             | `width`                                     | Changes with surface area of inking screen pressed        |
| `pen`               | `pressure`                                  | Changes with downward force applied to inking screen      |


If a browser does not provide a value for its pointer event's pressure/width, then the canvas should default to treating this input like a mouse event.

The stroke width regardless of pointer event type can be set and fixed through the `<inking-toolbar></inking-toolbar>`.

## APIs

## inking-canvas

### Properties

| Property             | Attribute            | Description                                                                     | Type      | Default                                             |
| -------------------- | -------------------- | ------------------------------------------------------------------------------- | --------- | --------------------------------------------------- |
| `name`               | `name`               | Used to connect an inking toolbar                                               | `string`  | `""`                                                |
| `canvasHeight`       | `height`             | Fills parent by default                                                         | `number`  | `-1`                                                |
| `canvasWidth`        | `width`              | Fills parent by default                                                         | `number`  | `-1`                                                |


### Methods

| Name                                      | Description                                                   |
| ---------------                           | --------------------------                                    |
| `getStrokeColor()`       | Returns ink color 
| `setStrokeColor(color: string)`       | Changes ink color                                             |
| `getStrokeSize()`    | Returns ink stroke width 
| `setStrokeSize(strokeSize: number)`    | Changes ink stroke width                                      |
| `getStrokeStyle()`      | Returns name of active tool defining ink style     
| `setStrokeStyle(toolName: string)`      | Changes ink style to reflect provided tool name (pen, pencil, highlighter, or eraser)                            | 
| `copyCanvasContents()` | Copies canvas state to clipboard via Clipboard API (if supported by browser) |
| `saveCanvasContents()` | Opens native file system to allow user to save canvas state as png image |
| `eraseAll()`                              | Deletes all visible and cached canvas ink                                        |
| `getCanvas()` | Returns inner html canvas object for advanced use cases |
| `getScale()`                              | Returns canvas size relative to its content's aspect ratio    
| `requestDrawCanvas()` | Triggers an additional canvas redraw if one is not already queued up |


## inking-toolbar

### Properties

| Property             | Attribute            | Description                                                                     | Type      | Default                                             |
| -------------------- | -------------------- | ------------------------------------------------------------------------------- | --------- | --------------------------------------------------- |
| `orientation`        | `orientation`        | Toolbar layout direction                                                        | `string`  | `horizontal`                                        |
| `verticalAlignment`        | `vertical`        | Toolbar layout vertical alignment                                                  | `string`  | `top`                                        |
| `horizontalAlignment`        | `horizontal`        | Toolbar layout horizontal alignment                                                     | `string`  | `left`                                        |
| `targetInkingCanvas` | `canvas`             | Connects toolbar to canvas whose name matches this value                                 | `string`  | `""`                                                |



### Methods

| Name                                      | Description                                                   |
| ---------------                           | --------------------------                                    |
| `getCurrentToolName()`       | Returns the active tool name  
| `getCurrentStrokeColor()`       | Returns the current toolbar ink color of the active tool                                             |                                     |
| `getCurrentStrokeColorName()`    | Returns the current stroke color name of the active tool                              | Sets the current stroke color name for the active tool                               |
| `getCurrentStrokeSize()`      | Returns the current stroke width of the active tool                              
| `requestDrawSineCanvas()` | Triggers an additional example stroke redraw if one is not already queued up |

## Styling

### Shadow parts

You can style the different parts of pwa-inking using [CSS ::part selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::part). Below are the list of parts available for styling:

| Component | Part Name | Description |
| - | - | - |
|`inking-canvas` | `canvas` | The html canvas object  |
| `inking-toolbar-pen` | `button` | The toolbar pen button |
| `inking-toolbar-pencil` | `button` | The toolbar pencil button |
| `inking-toolbar-highlighter` | `button` | The toolbar highlighter button |
| `inking=toolbar-eraser` | `button` | The toolbar eraser button |
| `inking-toolbar-copy` | `button` | The toolbar copy button |
| `inking-toolbar-save` | `button` | The toolbar save button |

### Styling samples

Remove the canvas border:
```css
inking-canvas::part(canvas) {
    border: none;
}
```
Change the save button color:
```css
inking-toolbar-save::part(button) {
    background-color: blue;
}
```

Try it: [live](https://pwa-inking-styling-samples.glitch.me/) | [code](https://glitch.com/edit/#!/pwa-inking-styling-samples?path=index.html%3A29%3A20)


