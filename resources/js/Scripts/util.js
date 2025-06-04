/** Returns only one DOM element and all it's children. CSS is still applied after parsing.
 * 
 * @param {String} string string value of the element to parse to DOM
 * @returns ChildNode
 */
export function stringToDOM(string) {
    return new DOMParser().parseFromString(string, "text/html").body.firstChild;
}