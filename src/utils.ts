// helper methods for inking canvas and toolbar

export function getLowLatencyContext(canvas: HTMLCanvasElement, canvasName: string) {

    let context = (canvas.getContext('2d', {
        desynchronized: true
        }) as CanvasRenderingContext2D);

    // check for low-latency
    if ("getContextAttributes" in context && (context as any).getContextAttributes().desynchronized) {
    console.log("Low latency is supported for " + canvasName + " canvas.");
    } else {
    console.log("Low latency is NOT supported for " + canvasName + " canvas.");
    }

    return context;
}

export function runAsynchronously(func: Function) {
    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback( () => {
            func();
        }); 
    } else {
        (async () => { 
            func();
        })()
    }
}

export function drawPencilStroke(context: CanvasRenderingContext2D, previousX: number, currentX: number, previousY: number, currentY: number) {
    
    // record context properties before modifying
    let strokeColor = context.strokeStyle;
    let strokeLayer = context.globalCompositeOperation;
    let strokeWidth = context.lineWidth;
    let opacity = context.globalAlpha;

    // use the distance formula to calcuate the line length between the two points on the canvas
    let distance  = Math.round(Math.sqrt(Math.pow(currentX - previousX, 2)+Math.pow(currentY - previousY, 2)));
    // console.log("distance: "+ distance);

    // split length into incremental pieces
    let stepX = (currentX - previousX)/distance;
    let stepY = (currentY - previousY)/distance;
    
    for (let i = 0; i < distance; i++ ) {

        let currentX = previousX + (i * stepX);	
        let currentY = previousY + (i * stepY);
        
        // create light base for whole stroke width as a first layer
        context.globalAlpha = 0.7;
        let randomX = currentX + ((Math.random()-0.5) * strokeWidth * 1);			
        let randomY = currentY + ((Math.random()-0.5) * strokeWidth * 1);
        context.fillRect(randomX, randomY, Math.random() + 2, Math.random() + 1);
        
        // thicken center of stroke with a second more opaque layer
        context.globalAlpha = 1;
        randomX = currentX + ((Math.random()-0.5) * strokeWidth * 0.8);			
        randomY = currentY + ((Math.random()-0.5) * strokeWidth * 0.8);
        context.fillRect(randomX, randomY, Math.random() + 2, Math.random() +1 );
    }

    // restore context properties
    context.fillStyle = strokeColor;
    context.globalCompositeOperation = strokeLayer;
    context.lineWidth = strokeWidth;
    context.globalAlpha = opacity;
}

export function hideElementIfVisible(el: HTMLElement) {
    if (el.classList.contains("show")) 
        el.classList.remove("show");
}

export function toCamelCase(str: string) {
    return str.toLowerCase().replace(/-(.)/g, function(match, upperLetter) {
        return upperLetter.toUpperCase();
    });
}

export function toDash(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}