import { css } from 'lit-element';
import * as Colors from "./colors";

export const InkingToolbarButtonStyles = css`

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
    }
    button#erase-all {
        border: none;
        outline: none;
        display: none;
        width: 100%;
        min-width: 200px;
        background-color: ${Colors.lightGray};
        padding: 25px;
        margin-top: 15px;
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
        box-shadow: 0 3px 0px 0px ${Colors.gold};
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

    button.clicked.black.vertical-orientation.left, button.clicked.black.vertical-orientation.center {
        border-right-color: ${Colors.black};
        box-shadow: 3px 0px 0px 0px ${Colors.black};
    }  
    button.clicked.white.vertical-orientation.left, button.clicked.white.vertical-orientation.center {
        border-right-color: ${Colors.white};
        box-shadow: 3px 0px 0px 0px ${Colors.white};
    }        
    button.clicked.silver.vertical-orientation.left, button.clicked.silver.vertical-orientation.center {
        border-right-color: ${Colors.silver};
        box-shadow: 3px 0px 0px 0px ${Colors.silver};
    }             
    button.clicked.gray.vertical-orientation.left, button.clicked.gray.vertical-orientation.center {
        border-right-color: ${Colors.gray};
        box-shadow: 3px 0px 0px 0px ${Colors.gray};
    }               
    button.clicked.dark-gray.vertical-orientation.left, button.clicked.gray.vertical-orientation.center {
        border-right-color: ${Colors.darkGray};
        box-shadow: 3px 0px 0px 0px ${Colors.darkGray};
    }              
    button.clicked.charcoal.vertical-orientation.left, button.clicked.charcoal.vertical-orientation.center {
        border-right-color: ${Colors.charcoal};
        box-shadow: 3px 0px 0px 0px ${Colors.charcoal};
    }      
    button.clicked.magenta.vertical-orientation.left, button.clicked.magenta.vertical-orientation.center {
        border-right-color: ${Colors.magenta};
        box-shadow: 3px 0px 0px 0px ${Colors.magenta};
    }    
    button.clicked.red.vertical-orientation.left, button.clicked.red.vertical-orientation.center {
        border-right-color: ${Colors.red};
        box-shadow: 3px 0px 0px 0px ${Colors.red};
    }    
    button.clicked.red-orange.vertical-orientation.left, button.clicked.red-orange.vertical-orientation.center {
        border-right-color: ${Colors.redOrange};
        box-shadow: 3px 0px 0px 0px ${Colors.redOrange};
    }            
    button.clicked.orange.vertical-orientation.left, button.clicked.orange.vertical-orientation.center {
        border-right-color: ${Colors.orange};
        box-shadow: 3px 0px 0px 0px ${Colors.orange};
    }      
    button.clicked.gold.vertical-orientation.left, button.clicked.gold.vertical-orientation.center {
        border-right-color: ${Colors.gold};
        box-shadow: 3px 0px 0px 0px ${Colors.gold};
    }      
    button.clicked.yellow.vertical-orientation.left, button.clicked.yellow.vertical-orientation.center {
        border-right-color: ${Colors.yellow};
        box-shadow: 3px 0px 0px 0px ${Colors.yellow};
    }      
    button.clicked.grass-green.vertical-orientation.left, button.clicked.grass-green.vertical-orientation.center {
        border-right-color: ${Colors.grassGreen};
        box-shadow: 3px 0px 0px 0px ${Colors.grassGreen};
    }               
    button.clicked.green.vertical-orientation.left, button.clicked.green.vertical-orientation.center {
        border-right-color: ${Colors.green};
        box-shadow: 3px 0px 0px 0px ${Colors.green};
    }                
    button.clicked.dark-green.vertical-orientation.left, button.clicked.dark-green.vertical-orientation.center {
        border-right-color: ${Colors.darkGreen};
        box-shadow: 3px 0px 0px 0px ${Colors.darkGreen};
    }                
    button.clicked.teal.vertical-orientation.left, button.clicked.teal.vertical-orientation.center {
        border-right-color: ${Colors.teal};
        box-shadow: 3px 0px 0px 0px ${Colors.teal};
    }                 
    button.clicked.blue.vertical-orientation.left, button.clicked.blue.vertical-orientation.center {
        border-right-color: ${Colors.blue};
        box-shadow: 3px 0px 0px 0px ${Colors.blue};
    }                 
    button.clicked.indigo.vertical-orientation.left, button.clicked.indigo.vertical-orientation.center {
        border-right-color: ${Colors.indigo};
        box-shadow: 3px 0px 0px 0px ${Colors.indigo};
    }      
    button.clicked.violet.vertical-orientation.left, button.clicked.violet.vertical-orientation.center {
        border-right-color: ${Colors.violet};
        box-shadow: 3px 0px 0px 0px ${Colors.violet};
    }      
    button.clicked.purple.vertical-orientation.left, button.clicked.purple.vertical-orientation.center {
        border-right-color: ${Colors.purple};
        box-shadow: 3px 0px 0px 0px ${Colors.purple};
    }      
    button.clicked.beige.vertical-orientation.left, button.clicked.beige.vertical-orientation.center {
        border-right-color: ${Colors.beige};
        box-shadow: 3px 0px 0px 0px ${Colors.beige};
    }      
    button.clicked.light-brown.vertical-orientation.left, button.clicked.light-brown.vertical-orientation.center {
        border-right-color: ${Colors.lightBrown};
        box-shadow: 3px 0px 0px 0px ${Colors.lightBrown};
    }      
    button.clicked.brown.vertical-orientation.left, button.clicked.brown.vertical-orientation.center {
        border-right-color: ${Colors.brown};
        box-shadow: 3px 0px 0px 0px ${Colors.brown};
    }      
    button.clicked.dark-brown.vertical-orientation.left, button.clicked.dark-brown.vertical-orientation.center  {
        border-right-color: ${Colors.darkBrown};
        box-shadow: 3px 0px 0px 0px ${Colors.darkBrown};
    }      
    button.clicked.pastel-pink.vertical-orientation.left, button.clicked.pastel-pink.vertical-orientation.center {
        border-right-color: ${Colors.pastelPink};
        box-shadow: 3px 0px 0px 0px ${Colors.pastelPink};
    }      
    button.clicked.pastel-orange.vertical-orientation.left, button.clicked.pastel-orange.vertical-orientation.center {
        border-right-color: ${Colors.pastelOrange};
        box-shadow: 3px 0px 0px 0px ${Colors.pastelOrange};
    }      
    button.clicked.pastel-yellow.vertical-orientation.left, button.clicked.pastel-yellow.vertical-orientation.center {
        border-right-color: ${Colors.pastelYellow};
        box-shadow: 3px 0px 0px 0px ${Colors.pastelYellow};
    }      
    button.clicked.pastel-green.vertical-orientation.left, button.clicked.pastel-green.vertical-orientation.center {
        border-right-color: ${Colors.pastelGreen};
        box-shadow: 3px 0px 0px 0px ${Colors.pastelGreen};
    }      
    button.clicked.pastel-blue.vertical-orientation.left, button.clicked.pastel-blue.vertical-orientation.center {
        border-right-color: ${Colors.pastelBlue};
        box-shadow: 3px 0px 0px 0px ${Colors.pastelBlue};
    }      
    button.clicked.pastel-purple.vertical-orientation.left, button.clicked.pastel-purple.vertical-orientation.center {
        border-right-color: ${Colors.pastelPurple};
        box-shadow: 3px 0px 0px 0px ${Colors.pastelPurple};
    }         
    button.clicked.light-blue.vertical-orientation.left, button.clicked.light-blue.vertical-orientation.center {
        border-right-color: ${Colors.lightBlue};
        box-shadow: 3px 0px 0px 0px ${Colors.lightBlue};
    }      
    button.clicked.pink.vertical-orientation.left, button.clicked.pink.vertical-orientation.center {
        border-right-color: ${Colors.pink};
        box-shadow: 3px 0px 0px 0px ${Colors.pink};
    }

    button.clicked.black.vertical-orientation.right {
        border-left-color: ${Colors.black};
        box-shadow: -3px 0px 0px 0px ${Colors.black};
    }  
    button.clicked.white.vertical-orientation.right {
        border-left-color: ${Colors.white};
        box-shadow: -3px 0px 0px 0px ${Colors.white};
    }        
    button.clicked.silver.vertical-orientation.right {
        border-left-color: ${Colors.silver};
        box-shadow: -3px 0px 0px 0px ${Colors.silver};
    }             
    button.clicked.gray.vertical-orientation.right {
        border-left-color: ${Colors.gray};
        box-shadow: -3px 0px 0px 0px ${Colors.gray};
    }               
    button.clicked.dark-gray.vertical-orientation.right {
        border-left-color: ${Colors.darkGray};
        box-shadow: -3px 0px 0px 0px ${Colors.darkGray};
    }              
    button.clicked.charcoal.vertical-orientation.right {
        border-left-color: ${Colors.charcoal};
        box-shadow: -3px 0px 0px 0px ${Colors.charcoal};
    }      
    button.clicked.magenta.vertical-orientation.right {
        border-left-color: ${Colors.magenta};
        box-shadow: -3px 0px 0px 0px ${Colors.magenta};
    }    
    button.clicked.red.vertical-orientation.right {
        border-left-color: ${Colors.red};
        box-shadow: -3px 0px 0px 0px ${Colors.red};
    }    
    button.clicked.red-orange.vertical-orientation.right {
        border-left-color: ${Colors.redOrange};
        box-shadow: -3px 0px 0px 0px ${Colors.redOrange};
    }            
    button.clicked.orange.vertical-orientation.right {
        border-left-color: ${Colors.orange};
        box-shadow: -3px 0px 0px 0px ${Colors.orange};
    }      
    button.clicked.gold.vertical-orientation.right {
        border-left-color: ${Colors.gold};
        box-shadow: -3px 0px 0px 0px ${Colors.gold};
    }      
    button.clicked.yellow.vertical-orientation.right {
        border-left-color: ${Colors.yellow};
        box-shadow: -3px 0px 0px 0px ${Colors.yellow};
    }      
    button.clicked.grass-green.vertical-orientation.right {
        border-left-color: ${Colors.grassGreen};
        box-shadow: -3px 0px 0px 0px ${Colors.grassGreen};
    }               
    button.clicked.green.vertical-orientation.right {
        border-left-color: ${Colors.green};
        box-shadow: -3px 0px 0px 0px ${Colors.green};
    }                
    button.clicked.dark-green.vertical-orientation.right {
        border-left-color: ${Colors.darkGreen};
        box-shadow: -3px 0px 0px 0px ${Colors.darkGreen};
    }                
    button.clicked.teal.vertical-orientation.right {
        border-left-color: ${Colors.teal};
        box-shadow: -3px 0px 0px 0px ${Colors.teal};
    }                 
    button.clicked.blue.vertical-orientation.right {
        border-left-color: ${Colors.blue};
        box-shadow: -3px 0px 0px 0px ${Colors.blue};
    }                 
    button.clicked.indigo.vertical-orientation.right {
        border-left-color: ${Colors.indigo};
        box-shadow: -3px 0px 0px 0px ${Colors.indigo};
    }      
    button.clicked.violet.vertical-orientation.right {
        border-left-color: ${Colors.violet};
        box-shadow: -3px 0px 0px 0px ${Colors.violet};
    }      
    button.clicked.purple.vertical-orientation.right {
        border-left-color: ${Colors.purple};
        box-shadow: -3px 0px 0px 0px ${Colors.purple};
    }      
    button.clicked.beige.vertical-orientation.right {
        border-left-color: ${Colors.beige};
        box-shadow: -3px 0px 0px 0px ${Colors.beige};
    }      
    button.clicked.light-brown.vertical-orientation.right {
        border-left-color: ${Colors.lightBrown};
        box-shadow: -3px 0px 0px 0px ${Colors.lightBrown};
    }      
    button.clicked.brown.vertical-orientation.right {
        border-left-color: ${Colors.brown};
        box-shadow: -3px 0px 0px 0px ${Colors.brown};
    }      
    button.clicked.dark-brown.vertical-orientation.right {
        border-left-color: ${Colors.darkBrown};
        box-shadow: -3px 0px 0px 0px ${Colors.darkBrown};
    }      
    button.clicked.pastel-pink.vertical-orientation.right {
        border-left-color: ${Colors.pastelPink};
        box-shadow: -3px 0px 0px 0px ${Colors.pastelPink};
    }      
    button.clicked.pastel-orange.vertical-orientation.right {
        border-left-color: ${Colors.pastelOrange};
        box-shadow: -3px 0px 0px 0px ${Colors.pastelOrange};
    }      
    button.clicked.pastel-yellow.vertical-orientation.right {
        border-left-color: ${Colors.pastelYellow};
        box-shadow: -3px 0px 0px 0px ${Colors.pastelYellow};
    }      
    button.clicked.pastel-green.vertical-orientation.right {
        border-left-color: ${Colors.pastelGreen};
        box-shadow: -3px 0px 0px 0px ${Colors.pastelGreen};
    }      
    button.clicked.pastel-blue.vertical-orientation.right {
        border-left-color: ${Colors.pastelBlue};
        box-shadow: -3px 0px 0px 0px ${Colors.pastelBlue};
    }      
    button.clicked.pastel-purple.vertical-orientation.right {
        border-left-color: ${Colors.pastelPurple};
        box-shadow: -3px 0px 0px 0px ${Colors.pastelPurple};
    }         
    button.clicked.light-blue.vertical-orientation.right {
        border-left-color: ${Colors.lightBlue};
        box-shadow: -3px 0px 0px 0px ${Colors.lightBlue};
    }      
    button.clicked.pink.vertical-orientation.right {
        border-left-color: ${Colors.pink};
        box-shadow: -3px 0px 0px 0px ${Colors.pink};
    }
    
`;