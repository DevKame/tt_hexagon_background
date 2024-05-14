"use strict";
/** CUSTOMIZE THAT PATTERN YOURSELF:
 *  
 *  [SIZE OF THE HEXAGONS]
 *      let hexhori                 = sw / ( your_number );
 *      your_number : number        = the bigger the number, the smaller the hexagons
 * 
 *  [SCALE HEXA DOWN ON HOVER]
 *      let hoverPadding            = hexhori * ( your_padding );
 *      your_padding : number       = the bigger the number, the bigger the padding
 */

let svg = document.getElementById("svg-width-hexagons-as-bg");
let sw = svg.getBoundingClientRect().width;
let sh = svg.getBoundingClientRect().height;

//###################################MARGIN BETWEEN THE HEXAGONS
let hexamargin              = 4;
//###############################DIMENSIONS OF HEXAGON's SIDES
let hexhori                 = sw / 7;
let hexh                    = hexhori * 1.5;
let hexhalfh                = hexhori * .75;
let hexw                    = hexhori * 1.8;
let hexhalfw                = hexhori * .9;
let xOffset                 = hexhori * .35;

//###############################STARTING POINT OF FIRST ROW
let rowStartX               = -50;
let rowStartY               = -10;

//###############################STARTING POINT OF NEXT HEXAGON
let startX                  = -50;
let startY                  = -10;

//###############VALUES TO ADD FOR NEXT HEXAGON's STARTPOSITION
let xStep                   = hexhori + xOffset;
let yStep                   = hexhalfh;

//######DETERMINES IF NEXT HEXAGON OF CURRENT ROW IS TOP OR BOT
let BOTSIDE                 = true;

//#VALUES TO CHECK IF HEXAGONS ALREADY FILL HEIGHT/WIDTH OF SVG
let rowWidth                = hexhori + xOffset - startX;
let additionalHexaWidth     = hexhori;

let columnHeight            = hexh + hexhalfh - startY;
let additionalHexaHeight    = hexh;

//##########################VALUES TO SCALE THE HEXAGONS
let hoverPadding            = hexhori * .05;
let hoverDoublePadding      = hoverPadding *2;
let hoverHalfPadding        = hoverPadding / 2;

//WHILE DISPLAY HEIGHT IS NOT FILLED; RENDER NEW HEXA ROWS
while(columnHeight <= sh + (sh * .6)) {
    renderHexaRow();
    BOTSIDE = true;
    rowWidth = hexhori + xOffset - startY;
    computeNextRowStart();
    columnHeight += additionalHexaHeight;
}
/** Renders a row of hexagons until screenwidth
 * is full with them*/
function renderHexaRow() {
    while(rowWidth <= sw + (sw * .2)) {
    renderHexagon();
    computeNextHexaStart();
    rowWidth += additionalHexaWidth;
}
}
/** Computes the next startingpoint for the next Hexarow*/
function computeNextRowStart() {
    startX = rowStartX;
    if(startY < rowStartY) {
        startY += hexh + hexhalfh + hexamargin * 3;
    } else {
        startY += hexh + hexamargin * 2;
    }
    rowStartY = startY;
}
// Computes the startingpoint for the next hexagon
function computeNextHexaStart() {
    if(BOTSIDE) {
        startX += xStep + hexamargin;
        startY -= yStep + hexamargin;
        BOTSIDE = !BOTSIDE;
    } else {
        startX += xStep + hexamargin;
        startY += yStep + hexamargin;
        BOTSIDE = !BOTSIDE;
    }
}

/** Renders one Hexagon*/
function renderHexagon() {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d =
    `
    M ${startX} ${startY}

    l ${hexhori} 0

    l ${xOffset} ${hexhalfh}
    l -${xOffset} ${hexhalfh}

    l -${hexhori} 0

    l -${xOffset} -${hexhalfh}
    l ${xOffset} -${hexhalfh}
    `;
    path.setAttribute("d", d);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke", "black");
    path.setAttribute("class", "bg-hexas");
    path.setAttribute("fill", "#152145");
    path.addEventListener("mouseenter", e => {
        scaleHexagon(e.target);
    });
    path.addEventListener("mouseleave", e => {
        let oldD = e.target.getAttribute("oldD");
        e.target.setAttribute("d", oldD);
    });
    svg.append(path);
}
/** Callback: scales the hovered hexagon down
 * @param {<path>} hexa 
 */
function scaleHexagon(hexa) {
    let d = hexa.getAttribute("d");
    hexa.setAttribute("oldD", d);

    let hex = {};
    let startValues = (d.slice(0, d.indexOf("l"))).trim();

    hex.startX =
    +(startValues.slice(2, startValues.indexOf(" ", 2))) +hoverPadding;
    hex.startY =
    +(startValues.slice(startValues.indexOf(" ", 2), startValues.length)) +hoverPadding;

    let breakpointStartinValues = d.indexOf((hex.startY -hoverPadding).toString())
    

    d = d.slice(breakpointStartinValues);
    d = d.slice(d.indexOf("l"));

    let horiValues = (d.slice(2, d.indexOf("l", 1))).trim();
    hex.hori = +(horiValues.slice(0, horiValues.indexOf(" "))) - hoverDoublePadding;
    d = d.slice(d.indexOf("l", 1));
    
    let oSetValues = (d.slice(2, d.indexOf("l", 1))).trim();
    hex.xOffset = +(oSetValues.slice(0, oSetValues.indexOf(" "))) - hoverHalfPadding;
    hex.hexhalfh = +(oSetValues.slice(oSetValues.indexOf(" "), oSetValues.length)) -hoverPadding;

    d = d.slice(d.indexOf("l", 1));
    d = d.slice(d.indexOf("l", 1));

    let newD =
    `
    M ${hex.startX} ${hex.startY}

    l ${hex.hori} 0

    l ${hex.xOffset} ${hex.hexhalfh}
    l -${hex.xOffset} ${hex.hexhalfh}

    l -${hex.hori} 0

    l -${hex.xOffset} -${hex.hexhalfh}
    l ${hex.xOffset} -${hex.hexhalfh}

    `;

    hexa.setAttribute("d", newD);

}