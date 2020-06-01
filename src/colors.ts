import { css, CSSResult } from 'lit-element';

export default class Colors {

    constructor() {
        this.mapColors();
    }
    
    // toolbar colors defined once, retrieved for css palette display and sending to canvas
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

    // toolbar colors specific to highlighter
    static readonly lightBlue = css`#44c8f5`;
    static readonly pink = css`#ec008c`;

    // background color used in toolbar
    static readonly lightGray = css`#e8e8e8`;

    // create quick way to retrieve a color value based on its css class
    private mapColors() {
        this.colors.set('black', Colors.black);
        this.colors.set('white', Colors.white);
        this.colors.set('silver', Colors.silver);
        this.colors.set('gray', Colors.gray);
        this.colors.set('darkGray', Colors.darkGray);
        this.colors.set('charcoal', Colors.charcoal);
        this.colors.set('magenta', Colors.magenta);
        this.colors.set('red', Colors.red);
        this.colors.set('redOrange', Colors.redOrange);
        this.colors.set('orange', Colors.orange);
        this.colors.set('gold', Colors.gold);
        this.colors.set('yellow', Colors.yellow);
        this.colors.set('grassGreen', Colors.grassGreen);
        this.colors.set('green', Colors.green);
        this.colors.set('darkGreen', Colors.darkGreen);
        this.colors.set('teal', Colors.teal);
        this.colors.set('blue', Colors.blue);
        this.colors.set('indigo', Colors.indigo);
        this.colors.set('violet', Colors.violet);
        this.colors.set('purple', Colors.purple);
        this.colors.set('beige', Colors.beige);
        this.colors.set('lightBrown', Colors.lightBrown);
        this.colors.set('brown', Colors.brown);
        this.colors.set('darkBrown', Colors.darkBrown);
        this.colors.set('pastelPink', Colors.pastelPink);
        this.colors.set('pastelOrange', Colors.pastelOrange);
        this.colors.set('pastelYellow', Colors.pastelYellow);
        this.colors.set('pastelGreen', Colors.pastelGreen);
        this.colors.set('pastelBlue', Colors.pastelBlue);
        this.colors.set('pastelPurple', Colors.pastelPurple);
        this.colors.set('lightBlue',  Colors.lightBlue);
        this.colors.set('pink', Colors.pink);
    }
}