# pwa-inking

`pwa-inking` is a [web component](https://meowni.ca/posts/web-components-with-otters/) from the [PWABuilder](https://pwabuilder.com) team that allows you to quickly add a 2D inking canvas (with an optional toolbar) to your Progressive Web App!

_Built with [lit-element](https://lit-element.polymer-project.org/)_

### What does it look like?

![An image of what the component looks like](assets/images/example.png?raw=true "pwa-inking")

## Supported Browsers
- Edge
- Chrome
- More coming soon!

## Using this component

## Install

There are two ways to use this component. For simple projects or just to get started fast, we recommend using the component by script tag. If your project is using [npm](https://www.npmjs.com/) then we recommend using the npm package.

### Script tag

- Put this script tag in the head of your index.html:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@pwabuilder/pwa-inking"
></script>
```

### NPM

- Run `npm install @pwabuilder/pwa-inking`
- Import with `import '@pwabuilder/pwa-inking'`

## Adding the component to your code

You can use the element `<inking-canvas></inking-canvas>` anywhere in your template, JSX, html etc. By itself, you will get a blank, bordered canvas which you can control through its APIs (see table for details).

You can also add the `<inking-toolbar></inking-toolbar>` element beneath the `<inking-canvas></inking-canvas>` element so the user can control the canvas visually. To connect these elements, their respective `canvas` and `name` attribute values must match.

By default `<inking-canvas></inking-canvas>` will create ink strokes with a width depending on the active pointer event:

| Pointer event       | Property influencing ink stroke width       | Notes
| ------------------- | ------------------------------------------- | --------------------------------------------------------- |
| `mouse`             | `width`                                     | Always 1 pixel                                            |
| `touch`             | `width`                                     | Changes with surface area of inking screen pressed        |
| `pen`               | `pressure`                                  | Changes with downward force applied to inking screen      |

For now, the stroke width regardless of pointer event type can be set and fixed through the `<inking-toolbar></inking-toolbar>`.

Check out a [live demo](https://pwa-inking.glitch.me) of pwa-inking!

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
| `changeUtensilColor(color: string)`       | Changes ink color                                             |
| `changeStrokeSize(strokeSize: number)`    | Changes ink stroke width                                      |
| `changeToolStyle(toolStyle: string)`      | Changes active canvas tool                                    | 
| `eraseAll()`                              | Deletes all canvas ink                                        |
| `getScale()`                              | Returns canvas size relative to its content's aspect ratio    |

## inking-toolbar

### Properties

| Property             | Attribute            | Description                                                                     | Type      | Default                                             |
| -------------------- | -------------------- | ------------------------------------------------------------------------------- | --------- | --------------------------------------------------- |
| `orientation`        | `orientation`        | Toolbar layout direction                                                        | `string`  | `horizontal`                                        |
| `targetInkingCanvas` | `canvas`             | Connects to canvas whose name matches its value                                 | `string`  | `""`                                                |

### Methods

None
