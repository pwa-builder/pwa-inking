import { css, CSSResult } from 'lit-element';
    
// toolbar colors defined once, retrieved for css paexport lette display and sending to canvas
export let black: CSSResult = css`#000000`;
export let white: CSSResult = css`#ffffff`;
export let silver: CSSResult = css`#d1d3d4`;
export let gray: CSSResult = css`#a7a9ac`;
export let darkGray: CSSResult = css`#808285`;
export let charcoal: CSSResult = css`#58595b`;
export let magenta: CSSResult = css`#b31564`;
export let red: CSSResult = css`#e61b1b`;
export let redOrange: CSSResult = css`#ff5500`;
export let orange: CSSResult = css`#ffaa00`;
export let gold: CSSResult = css`#ffce00`;
export let yellow: CSSResult = css`#ffe600`;
export let grassGreen: CSSResult = css`#a2e61b`;
export let green: CSSResult = css`#26e600`;
export let darkGreen: CSSResult = css`#008055`;
export let teal: CSSResult = css`#00aacc`;
export let blue: CSSResult = css`#004de6`;
export let indigo: CSSResult = css`#3d00b8`;
export let violet: CSSResult = css`#6600cc`;
export let purple: CSSResult = css`#600080`;
export let beige: CSSResult = css`#f7d7c4`;
export let lightBrown: CSSResult = css`#bb9167`;
export let brown: CSSResult = css`#8e562e`;
export let darkBrown: CSSResult = css`#613d30`;
export let pastelPink: CSSResult = css`#ff80ff`;
export let pastelOrange: CSSResult = css`#ffc680`;
export let pastelYellow: CSSResult = css`#ffff80`;
export let pastelGreen: CSSResult = css`#80ff9e`;
export let pastelBlue: CSSResult = css`#80d6ff`;
export let pastelPurple: CSSResult = css`#bcb3ff`;
export let colorPaletteBackground: CSSResult = css`#f2f2f2`;

// toolbar colors specific to highlighter
export let lightBlue: CSSResult = css`#44c8f5`;
export let pink: CSSResult = css`#ec008c`;

// background color used in toolbar
export let lightGray: CSSResult = css`#e8e8e8`;

// create quick way to retrieve a color value based on its css class
export function getColors() {

    let colors = new Map<string, CSSResult>();

    colors.set('black', black);
    colors.set('white', white);
    colors.set('silver', silver);
    colors.set('gray', gray);
    colors.set('darkGray', darkGray);
    colors.set('charcoal', charcoal);
    colors.set('magenta', magenta);
    colors.set('red', red);
    colors.set('redOrange', redOrange);
    colors.set('orange', orange);
    colors.set('gold', gold);
    colors.set('yellow', yellow);
    colors.set('grassGreen', grassGreen);
    colors.set('green', green);
    colors.set('darkGreen', darkGreen);
    colors.set('teal', teal);
    colors.set('blue', blue);
    colors.set('indigo', indigo);
    colors.set('vioexport let', violet);
    colors.set('purple', purple);
    colors.set('beige', beige);
    colors.set('lightBrown', lightBrown);
    colors.set('brown', brown);
    colors.set('darkBrown', darkBrown);
    colors.set('pastelPink', pastelPink);
    colors.set('pastelOrange', pastelOrange);
    colors.set('pastelYellow', pastelYellow);
    colors.set('pastelGreen', pastelGreen);
    colors.set('pastelBlue', pastelBlue);
    colors.set('pastelPurple', pastelPurple);
    colors.set('lightBlue',  lightBlue);
    colors.set('pink', pink);

    return colors;
}
