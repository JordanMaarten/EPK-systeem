'use strict';

import { stringToDOM } from "@/Scripts/util";

//== Templates ==// maybe import via seperate file

/** A collection of sidebar element templates to be added to the sidebar with DOMParser()
 * 
 * Onclick events will not work as an attribute, events are added externally with javascript.
 * 
 * Tailwind classes that initialize on load will not work unless previously used on a non-dynamic element, examples include: bg-indigo-400, p-[3em], etc..
 * Style attributes are used in these cases.
 * 
 * Style inputs require a class referencing the element to style, for example: "row-style" or "element-style". The name of the input specifies the style name as a computed style, for example: "fontSize" or "backgroundColor". If the value needs a prefix or unit, it can be added as an attribute.
 * 
 * Feel free to modify the layout and classes, but don't remove or alter specially named classes like: "sidebar-content-row-elements" or "element-add".
 */
const SIDEBAR_TEMPLATES = {
    sidebar_content_row: `
        <div class="border border-slate" content-id>
            <div class="flex justify-between p-3 border-b border-slate text-white cursor-pointer" style="background-color: rgb(5 150 105 / var(--tw-bg-opacity))">
                <h3 class="content-title"></h3>
                <a class="content-row-remove px-2">X</a>
            </div >
            <div class="dropdown-item flex flex-col overflow-hidden">
                <div class="relative flex justify-center p-3 border-b border-slate">
                    <h3>Elements</h3>
                </div>
                <div class="content-row-elements relative flex flex-col gap-2 justify-center mt-2"></div>
                <div class="relative flex flex-col gap-2 justify-center mt-2">
                    <div class="element-add relative flex justify-end px-3 pb-2 border-b border-slate">
                        <button class="element-add-button inline-flex items-center rounded-md border border-gray-300 text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm px-2 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-25">Add new +</button>
                    </div>
                </div>
            </div>
            <div class="dropdown-item flex flex-col overflow-hidden">
                <div class="relative flex justify-center p-3 border-b border-slate">
                    <h3>Styling</h3>
                </div>
                <div class="relative flex flex-col gap-2 justify-center mt-2">
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font size:</span>
                        <span>
                            <input type="number" min="8" max="50" unit="px" placeholder="16" name="fontSize" class="content-row-style w-20 h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value="16"/>
                            <span class="ms-2">px</span>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font:</span>
                        <span>
                            <input type="text" placeholder="arial" name="fontFamily" class="content-row-style w-40 h-8 ms-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>background color:</span>
                        <span>
                            <input type="text" placeholder="transparent" name="backgroundColor" class="content-row-style w-40 h-8 ms-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                        </span>
                    </div>
                </div>
            </div>
        </div > 
    `,
    element_row: `
        <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate" content-id>
            <span class="content-title"></span>
            <button class="element-edit">edit</button>
        </div>
    `,
    //try to fix the movement later
    element_selector: `
    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
        <select class="element-selector w-40" name="element-selector">
            <option value="p">text</option>
        </select>
        <span>
            <button class="element-selector-abort inline-flex items-center rounded-md border border-gray-300 text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm px-2 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-25">cancel</button>
            <button class="element-selector-confirm inline-flex items-center rounded-md border border-gray-300 text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm px-2 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-25">confirm</button>
        </span>
    </div>
    `,
}

/** A collection of element templates to be added to the content body with DOMParser().
 * 
 * Every element requires the content attribute to function.
 * 
 * If the element contains text that can be altered, then add the "content-text" class to the element containing the text, (adding the class to a seperate span tag works best).
 * 
 * Onclick events will not work as an attribute, events are added externally with javascript.
 * 
 * Tailwind classes that initialize on load will not work, examples include: bg-indigo-400, p-[3em], etc..
 * Style attributes are used in these cases.
 * 
 * Feel free to add more templates and modify existing templates.
 */
const CMS_TEMPLATES = {
    row: `
        <div class="content-row" content="true"></div>
    `,
    p: `
        <p content="true">
            <span class="content-text">
                This is an example text.
            </span>
        </p>
    `,
    
}

/** Stores all the relevant data of the elements inside the content element i.e.: name, text, etc..
 * 
 * Keys are not removed when the referenced element gets removed, in case I ever want to implement an undo feature.
 * Might need optimization, if it causes any performance issues.
 */
const CONTENT_PROPERTIES = {

    /** Method to set content properties
     * 
     * @param {HTMLElement} element element to add to CONTENT_PROPERTIES
     * @param {String} row_id optional id when setting an element belonging to a row
     */
    setElement(element, row_id) {
        this[element.id] = {
            ref: element,
            name: (element.hasAttribute("name") ? element.getAttribute("name") : "undefined"),
            style: {},
            row_id: (row_id ? row_id : undefined),
        }
    },
};

export default new class CMS {
    constructor() {
        // soo empty...
    }

    /** Sets the content and sidebar elements and adds all element with a true content attribute to the CONTENT_PROPERTIES object.
     * 
     * If manual updating is required, use the updateContent(), updateContentById() and updateSidebar() method instead.
     * 
     * This is only required once for initialization!
     * Constructor was not used in case of HTML changes.
     * 
     * @param {HTMLElement} content specifies the CMS content body
     * @param {HTMLElement} sidebar specifies the content body of the sidebar where the CMS content will be listed
     */
    setup(content, sidebar) {
        if (typeof content === "object") {
            if (typeof sidebar === "object") {
                this.content = content;
                this.sidebar = sidebar;

                try {
                    let content_rows = this.content.querySelectorAll(":scope .content-row[content]");

                    for (const cr of content_rows) {
                        CONTENT_PROPERTIES.setElement(cr);

                        let content_elements = cr.querySelectorAll(":scope [content]");

                        for (const ce of content_elements) {
                            CONTENT_PROPERTIES.setElement(ce, cr.id);
                        }
                    }
                    
                    console.log(CONTENT_PROPERTIES); // testing
                } catch {
                    console.log("ERROR at CMS.setup(): CONTENT_PROPERTIES could not be initialized");
                }
            } else {
                console.log(`ERROR at CMS.setup(): sidebar argument "${sidebar}" is not of type "element"`);
            }
        } else {
            console.log(`ERROR at CMS.setup(): content argument "${content}" is not of type "element"`);
        }
    }

    /** Adds a new row to the sidebar content list.
     * 
     * Automatically assigns a unique id and a name.
     */
    addRow() {
        let new_row = stringToDOM(CMS_TEMPLATES.row);

        new_row.setAttribute("id", generateUniqueId());
        new_row.setAttribute("name", "new row");

        try {
            this.content.appendChild(new_row);

            CONTENT_PROPERTIES.setElement(new_row);
        } catch {
            console.log(`ERROR at CMS.addRow(): new row: ${new_row} could not be appended to the content element: ${this.content}`);
        }

        this.updateSidebar();
    }

    /** Adds a new element to a specified row inside the content element. 
     * 
     * Automatically assigns a unique id, the name reflects the template name.
     * 
     * @param {String} row_id id of the content row to append to
     * @param {String} template_name name of the CMS template to be created
     */
    addContent(row_id, template_name) {
        if (template_name) {
            let new_element = stringToDOM(CMS_TEMPLATES[template_name]);
    
            new_element.setAttribute("id", generateUniqueId());
            new_element.setAttribute("name", template_name);
    
            try {
                document.getElementById(row_id).appendChild(new_element);
    
                CONTENT_PROPERTIES.setElement(new_element, row_id);
            } catch {
                console.log(`ERROR at CMS.addContent(): new element: ${new_element} could not be appended to the element with id: ${parent_id}`);
            }
        } else {
            console.log("ERROR at CMS.addContent(): No CMS template specified in arguments");
        }
        
        this.updateSidebar();
    }

    /** Removes an element with the specified id from the CMS content body
     * 
     * Might add a cache feature for undoing acciden
     * 
     * @param {String} id id of the element to remove from the CMS content body
     */
    removeContent(id) {
        if (document.getElementById(id)) {
            document.getElementById(id).remove(); // Hier verder volgens mij?
        }
    }

    /** Updates all content from CONTENT_PROPERTIES inside the CMS content body.
     * 
     * Useful for manual refreshing.
     * 
     * Very resource intensive! use with caution.
     */
    updateContent() {
        for (const [id, properties] of CONTENT_PROPERTIES) {
            if (document.getElementById(id)) {
                let linked_element = document.getElementById(id);
    
                // combine cases for any duplicate results
                for (const [property, property_value] of Object.entries(properties)) {
                    switch(property) {
                        // if the attribute gets overwritten:
                        case "name":
                            linked_element.setAttribute(property, property_value);
                            break;
                        // for the style property:
                        case "style":
                            if (Object.keys(property_value).length > 0) {
                                for (const [style_name, style_value] of Object.entries(property_value)) {
                                    linked_element.style[style_name] = style_value;
                                }
                            }
                            break;
                    }
                }
            }
        }
    }
    
    /** Updates the content of an element from CONTENT_PROPERTIES with the specified id inside the CMS content body.
     * 
     * @param {String} id id of the content to update
     */
    updateContentById(id) {
        if (document.getElementById(id)) {
            let linked_element = document.getElementById(id);

            // combine cases for any duplicate results
            for (const [property, property_value] of Object.entries(CONTENT_PROPERTIES[id])) {
                switch(property) {
                    // if the attribute gets overwritten:
                    case "name":
                        linked_element.setAttribute(property, property_value);
                        break;
                    // for the style property:
                    case "style":
                        if (Object.keys(property_value).length > 0) {
                            for (const [style_name, style_value] of Object.entries(property_value)) {
                                linked_element.style[style_name] = style_value;
                            }
                        }
                        break;
                }
            }
        }
    }

    /** Updates the content of the sidebar.
     * 
     * Rows and elements are added and removed from the sidebar content based on the state of the CMS content body.
     */
    updateSidebar() {
        if (this.sidebar) {
            for (let [id, values] of Object.entries(CONTENT_PROPERTIES)) {
                
                // removes the sidebar row or element if the element doesn't currently exist inside the CMS content body: 
                if (document.getElementById(id)) {
                    // if the element already exists: 
                    if (this.sidebar.querySelector(`[content-id="${id}"]`)) {
                        let sidebar_content = this.sidebar.querySelector(`[content-id="${id}"]`);
    
                        sidebar_content.querySelector(".content-title").innerHTML = values.name;
                    } else { // if the element does not exist yet: 
    
                        // if the element is from a content row: 
                        if (this.sidebar.querySelector(`[content-id="${values.row_id}"]`)) { 
                            let sidebar_content_row = this.sidebar.querySelector(`[content-id="${values.row_id}"]`);
    
                            let element_row = stringToDOM(SIDEBAR_TEMPLATES.element_row);
    
                            element_row.setAttribute("content-id", id);
                            element_row.querySelector(".content-title").innerHTML = values.name;
    
                            // adds the element row to the element content inside the corresponding sidebar content row: 
                            sidebar_content_row.querySelector(".content-row-elements").appendChild(element_row);
                        } else { // if the parent element is the content body: 
                            let sidebar_content_row = stringToDOM(SIDEBAR_TEMPLATES.sidebar_content_row);
        
                            sidebar_content_row.setAttribute("content-id", id);
                            sidebar_content_row.querySelector(".content-title").innerHTML = values.name;

                            let content_row_style_inputs = sidebar_content_row.querySelectorAll(":scope .content-row-style");

                            // adds an event listener to all content style inputs.
                            // updates the content of CONTENT_PROPERTIES and updates the content of the row when typing.
                            try {
                                for (const input of content_row_style_inputs) {
                                    if (document.getElementById(id).style[input.getAttribute("name")]) {
                                        switch (input.getAttribute("type")) {
                                            case "number":
                                                input.value = parseFloat(document.getElementById(id).style[input.getAttribute("name")]);
                                                break;
                                            case "text":
                                                input.value = document.getElementById(id).style[input.getAttribute("name")];
                                                break;
                                        }
                                    }

                                    input.addEventListener("input", (event) => {
                                        values.style[event.target.getAttribute("name")] = 
                                            (event.target.getAttribute("prefix") ? event.target.getAttribute("prefix") : "") + 
                                            (event.target.value ? event.target.value : event.target.getAttribute("placeholder")) + 
                                            (event.target.getAttribute("unit") ? event.target.getAttribute("unit") : "");
                                        values.style[event.target.getAttribute("name")] =
                                            (event.target.value ? event.target.value : event.target.getAttribute("placeholder"));

                                        this.updateContentById(id);
                                    });
                                }
                            } catch {
                                console.log(`ERROR at CMS.updateSidebar(): CONTENT_PROPERTIES[${id}].style could not be set`);
                            }
    
                            // adds functionality to the element selector: 
                            let element_add = sidebar_content_row.querySelector(".element-add");
    
                            element_add.querySelector(".element-add-button").addEventListener("click", (event) => {
                                let element_selector = stringToDOM(SIDEBAR_TEMPLATES.element_selector);
    
                                let element_selector_input = element_selector.querySelector(".element-selector");
                                
                                element_add.replaceWith(element_selector);
                                
                                element_selector.querySelector(".element-selector-confirm").addEventListener("click", (event) => {
                                    if (element_selector_input.value) {
                                        this.addContent(id, element_selector_input.value);
                                        element_selector.replaceWith(element_add);
                                    } else {
                                        console.log("Please pick an element from the selector to add to the content element")
                                    }
                                });
    
                                element_selector.querySelector(".element-selector-abort").addEventListener("click", (event) => {
                                    element_selector.replaceWith(element_add);
                                });
                            });
                            
                            // adds the content row to the sidebar content: 
                            this.sidebar.appendChild(sidebar_content_row);
                        }
                    }
                } else {
                    if (this.sidebar.querySelector(`[content-id="${id}"]`)) {
                        this.sidebar.querySelector(`[content-id="${id}"]`).remove();
                    }
                }
            }
        } else {
            console.log(`ERROR at CMS.updateSidebar(): sidebar has not been set, please use the setup() method first`);
        }
    }
}

const GENERATED_KEYS = []; // prevents the small chance that a new element takes on the saved properties of a removed element

/** Generates a unique id to use as attribute
 * 
 * @returns unique id
 */
function generateUniqueId() {
    let id = Math.random().toString(16).slice(2); 
    if (document.getElementById(id) || GENERATED_KEYS[id]) {
        generateUniqueId();
    } else {
        GENERATED_KEYS.push(id);
        return id;
    }
}

/** Turns an element into an input to change it's value and changes it back after submitting.
 * Executes refreshRowList() when finished.
 * 
 * @param {HTMLElement} element 
 * @param {()=>{}} callback 
 */
// function editTextAsField(element, callback) {
//     let temp_element = stringToDOM(`
//         <span class="relative flex items-center w-full">
//             <input type="text" class="new_text absolute p-1 w-full" placeholder="type here.." value="${element.innerHTML}">
//             <button class="update_text absolute right-0 me-2">update</button>
//         </span>
//     `);

//     const input = temp_element.querySelector(".new_text");
//     const button = temp_element.querySelector(".update_text");

//     element.replaceWith(temp_element);

//     input.setSelectionRange(input.value.length, input.value.length);
//     input.focus();

//     button.addEventListener("click", () => {
//         if (input.value != "") {
//             element.innerHTML = input.value;
//             try {temp_element.replaceWith(element);} catch {
//                 /**
//                  * - To avoid the following exception message:
//                  * Uncaught NotFoundError: Failed to execute 'replaceWith' on 'Element': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler.
//                  * 
//                  * - Reason: 
//                  * Every time an element gets removed (replaced in this case), a blur event is triggered. This is mostly used for accessibility.
//                  * When the element doesn't exist, it will throw an exception. 
//                  * In this case, it doesn't matter if the blur event is triggered or not. It's not being used anyways.
//                  */
//             }
//             refreshRowList();
//         }
//     });

//     input.addEventListener("input", (event) => {
//         if (event.target.value == "") {
//             input.classList.add("invalid");
//         } else {
//             input.classList.remove("invalid"); 
//         }
//     });

//     temp_element.addEventListener("focusout", (event) => {
//         if (event.relatedTarget != button) {
//             temp_element.replaceWith(element);
//         }
//     });
// }

//// DO THIS IN THE SIDEBAR
// export function editTextAsArea(element) {
//     let temp_element = stringToDOM(`
//         <div class="relative flex items-center w-full">
//             <textarea class="new_text p-1 w-full" placeholder="type here.." style="height: ${element.offsetHeight}px">${element.innerHTML.trim()}</textarea>
//             <button class="update_text absolute right-0 me-2">update</button>
//         </div>
//     `);

//     const area = temp_element.querySelector(".new_text");
//     const button = temp_element.querySelector(".update_text");

//     element.replaceWith(temp_element);

//     area.setSelectionRange(area.value.length, area.value.length);
//     area.focus();

//     button.addEventListener("click", () => {
//         if (area.innerHTML != "") {
//             element.innerHTML = area.innerHTML;
//             temp_element.replaceWith(element);
//             refreshRowList();
//         }
//     });

//     area.addEventListener("input", (event) => {
//         if (event.target.value == "") {
//             area.classList.add("invalid");
//         } else {
//             area.classList.remove("invalid"); 
//         }
//     });

//     temp_element.addEventListener("focusout", (event) => {
//         if (event.relatedTarget != button) {
//             temp_element.replaceWith(element);
//         }
//     });
// }