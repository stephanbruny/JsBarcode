/* global HTMLImageElement */
/* global HTMLCanvasElement */
/* global SVGElement */

import getOptionsFromElement from "./getOptionsFromElement.js";

// Takes an element and returns an object with information about how
// it should be rendered
// This could also return an array with these objects
// {
//   element: The element that the renderer should draw on
//   renderer: The name of the renderer
//   afterRender (optional): If something has to done after the renderer
//     completed, calls afterRender (function)
//   options (optional): Options that can be defined in the element
// }

function getRenderProperties(element){
	// If the element is a string, query select call again
	if(typeof element === "string"){
		return querySelectedRenderProperties(element);
	}
	// If element is array. Recursivly call with every object in the array
	else if(Array.isArray(element)){
		var returnArray = [];
		for(let i = 0; i < element.length; i++){
			returnArray.push(getRenderProperties(element[i]));
		}
		return returnArray;
	}
	// If element, render on canvas and set the uri as src
	else if(typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLImageElement){
		return newCanvasRenderProperties(element);
	}
	// If SVG
	else if(typeof SVGElement !== 'undefined' && element instanceof SVGElement){
		return {
			element: element,
			options: getOptionsFromElement(element),
			renderer: "svg"
		};
	}
	// If canvas (in browser)
	else if(typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLCanvasElement){
		return {
			element: element,
			options: getOptionsFromElement(element),
			renderer: "canvas"
		};
	}
	// If canvas (in node)
	else if(element.getContext){
		return {
			element: element,
			renderer: "canvas"
		};
	}
	else{
		throw new Error("Not supported type to render on.");
	}
}


function querySelectedRenderProperties(string){
	var selector = document.querySelectorAll(string);
	if(selector.length === 0){
		throw new Error("No element found");
	}
	else{
		let returnArray = [];
		for(let i = 0; i < selector.length; i++){
			returnArray.push(getRenderProperties(selector[i]));
		}
		return returnArray;
	}
}


function newCanvasRenderProperties(imgElement){
	var canvas = document.createElement('canvas');
	return {
		element: canvas,
		options: getOptionsFromElement(imgElement),
		renderer: "canvas",
		afterRender: function(){
			imgElement.setAttribute("src", canvas.toDataURL());
		}
	};
}

export default getRenderProperties;
