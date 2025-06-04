'use strict';

import { stringToDOM } from "@/Scripts/util";

//== Templates ==// maybe import via seperate file

// 
/** A collection of sidebar element templates to be added to the sidebar.
 * Onclick events will not work as an attribute, events are added externally with javascript.
 * Tailwind classes that initialize on load will not work, examples include: bg-indigo-400, p-[3em], etc..
 * Style attributes are used in these cases.
 */
const SIDEBAR_TEMPLATES = {
    sidebar_content_row: `
        <div class="border border-slate" link-id>
            <div class="flex justify-between p-3 border-b border-slate text-white cursor-pointer" style="background-color: rgb(5 150 105 / var(--tw-bg-opacity))">
                <h3 class="title"></h3>
                <a class="row-close px-2">X</a>
            </div >
            <div class="dropdown-item flex flex-col overflow-hidden">
                <div class="relative flex justify-center p-3 border-b border-slate">
                    <h3>Elements</h3>
                </div>
                <div class="sidebar-content-row-elements relative flex flex-col gap-2 justify-center mt-2"></div>
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
                            <input type="number" min="8" max="50" excluded="[A-z]" unit="px" name="fontSize" class="w-20 h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value="16" placeholder="16" target/>
                            <span class="ms-2">px</span>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font:</span>
                        <span>
                            <input type="text" name="fontFamily" class="w-40 h-8 ms-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="arial" target/>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>background color:</span>
                        <span>
                            <input type="text" name="backgroundColor" class="w-40 h-8 ms-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="transparent" target/>
                        </span>
                    </div>
                </div>
            </div>
        </div > 
    `,
    element_row: `
        <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate" link-id>
            <span class="title"></span>
            <button class="element_edit">edit</button>
        </div>
    `,
    //try to fix the movement later
    element_selector: `
    <div class="element-selector relative flex justify-between px-3 pb-2 items-center border-b border-slate">
        <select class="selector w-40" name="selector">
            <option value="p">text</option>
        </select>
        <span>
            <button class="abort inline-flex items-center rounded-md border border-gray-300 text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm px-2 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-25">cancel</button>
            <button class="confirm inline-flex items-center rounded-md border border-gray-300 text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm px-2 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-25">confirm</button>
        </span>
    </div>
    `,
}

/** A collection of element templates to be added to the content body.
 * Onclick events will not work as an attribute, events are added externally with javascript.
 * Tailwind classes that initialize on load will not work, examples include: bg-indigo-400, p-[3em], etc..
 * Style attributes are used in these cases.
 */
const CMS_TEMPLATES = {
    row: `
        <div class="row">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci officia, qui dignissimos dolore asperiores dolorum architecto cum odio corrupti. Voluptates rem, fugiat delectus provident aspernatur aut nobis facilis quae suscipit!
        </div>
    `,
    p: `
        <p>
            This is an example text.
        </p>
    `,
    
}

/**
 * Stores all the relevant data of the elements inside the content element i.e.: name, text, etc..
 * Keys are not removed when the referenced element gets removed, in case I ever want to implement an undo feature.
 * Styles are not stored, but returned from the element directly via the window.getComputedStyle() method.
 */
const LINK_PROPERTIES = {};

export default new class CMS {
    constructor() {}

    /**
     * 
     * @param {HTMLElement} content content to link to the sidebar
     * @param {HTMLElement} sidebar element list from the sidebar
     */
    setupLink(content, sidebar) {
        if (typeof content === "object") {
            if (typeof sidebar === "object") {
                this.content = content;
                this.sidebar = sidebar;

                try {
                    let link_elements = this.content.querySelectorAll(":scope [link]");
            
                    if (link_elements.length > 0) {
                        for (let le of link_elements) {
                            LINK_PROPERTIES[le.id] = {
                                name: (le.hasAttribute("name") ? le.getAttribute("name") : "undefined"),
                                text: le.innerHTML,
                                parent: le.parentElement
                            }
                        }
                    }
                    
                    console.log(LINK_PROPERTIES); // testing
                } catch {
                    console.log("ERROR at CMS.setupLink(): LINK_PROPERTIES could not be initialized");
                }
            } else {
                console.log(`ERROR at CMS.setupLink(): sidebar argument "${sidebar}" is not of type "element"`);
            }
        } else {
            console.log(`ERROR at CMS.setupLink(): content argument "${content}" is not of type "element"`);
        }
    }

    addRow() {
        let new_row = stringToDOM(CMS_TEMPLATES.row);

        new_row.setAttribute("id", generateUniqueId());
        new_row.setAttribute("name", "new row");

        try {
            this.content.appendChild(new_row);

            LINK_PROPERTIES[new_row.id] = {
                name: new_row.getAttribute("name"),
                text: new_row.innerHTML
            }
        } catch {
            console.log(`ERROR at CMS.addRow(): new row: ${new_row} could not be appended to the content element: ${this.content}`);
        }

        this.updateSidebar();
    }

    /** Adds a new element to a specified row inside the content element. 
     * 
     * @param {String} parent_id id of the parent element to append to
     * @param {String} template_name name of the CMS template to be created
     */
    addContent(parent_id, template_name) {
        if (template_name) {
            let new_element = stringToDOM(CMS_TEMPLATES[template_name]);
    
            new_element.setAttribute("id", generateUniqueId());
            new_element.setAttribute("name", template_name);
    
            try {
                document.getElementById(parent_id).appendChild(new_element);
    
                LINK_PROPERTIES[new_element.id] = {
                    name: new_element.getAttribute("name"),
                    text: new_element.innerHTML,
                    parent_id: parent_id
                }
            } catch {
                console.log(`ERROR at CMS.addContent(): new element: ${new_element} could not be appended to the element with id: ${parent_id}`);
            }
        } else {
            console.log("ERROR at CMS.addContent(): No CMS template specified in arguments");
        }

        this.updateSidebar();
    }

    /** Updates the content inside the CMS content body.
     *  I might merge this with updateSidebar() in the future.
     */
    updateContent() {
        for (const [id, properties] of Object.entries(LINK_PROPERTIES)) {
            if (document.getElementById(id)) { // Skips if the element doesn't currently exist
                let linked_element = document.getElementById(id);

                // combine cases for any duplicate results
                for (const [property, value] of Object.entries(properties)) {
                    switch(property) {
                        // if the attribute gets overwritten:
                        case "name":
                            linked_element.setAttribute(property, value);
                            break;
                        // only for innerHTML changes:
                        case "text":
                            linked_element.innerHTML = value;
                            break;
                    }
                }
            }
        }
    }

    /** Updates the content of the sidebar.
     * Rows and elements are added and removed from the sidebar content based on the state of the CMS content body.
     */
    updateSidebar() {
        if (this.sidebar) {
            for (let [id, values] of Object.entries(LINK_PROPERTIES)) {
                
                // skip if the element doesn't currently exist: 
                if (document.getElementById(id)) {
                    // if the element already exists: 
                    if (this.sidebar.querySelector(`[link-id="${id}"]`)) {
                        let sidebar_element = this.sidebar.querySelector(`[link-id="${id}"]`);
    
                        sidebar_element.querySelector(".title").innerHTML = values.name;
                    } else { // if the element does not exist yet: 
    
                        // if the element has a linked parent: 
                        if (this.sidebar.querySelector(`[link-id="${values.parent_id}"]`)) { 
                            let sidebar_row = this.sidebar.querySelector(`[link-id="${values.parent_id}"]`);
    
                            let element_row = stringToDOM(SIDEBAR_TEMPLATES.element_row);
    
                            element_row.setAttribute("link-id", id);
                            element_row.querySelector(".title").innerHTML = values.name;
    
                            // adds the element row to the element content inside the corresponding sidebar content row: 
                            sidebar_row.querySelector(".sidebar-content-row-elements").appendChild(element_row);
                        } else { // if the parent element is the content body: 
                            let sidebar_row = stringToDOM(SIDEBAR_TEMPLATES.sidebar_content_row);
        
                            sidebar_row.setAttribute("link-id", id);
                            sidebar_row.querySelector(".title").innerHTML = values.name;
    
                            // adds functionality to the element selector: 
                            let element_add = sidebar_row.querySelector(".element-add");
    
                            element_add.querySelector(".element-add-button").addEventListener("click", (event) => {
                                let element_selector = stringToDOM(SIDEBAR_TEMPLATES.element_selector);
    
                                let element_selector_input = element_selector.querySelector(".selector");
                                
                                element_add.replaceWith(element_selector);
                                
                                element_selector.querySelector(".confirm").addEventListener("click", (event) => {
                                    if (element_selector_input.value) {
                                        this.addContent(id, element_selector_input.value);
                                        element_selector.replaceWith(element_add);
                                    } else {
                                        console.log("Please pick an element from the selector to add to the content element")
                                    }
                                });
    
                                element_selector.querySelector(".abort").addEventListener("click", (event) => {
                                    element_selector.replaceWith(element_add);
                                });
                            });
                            
                            // adds the row to the sidebar content: 
                            this.sidebar.appendChild(sidebar_row);
                        }
    
                        this.updateSidebar();
                    }
                }
            }
        } else {
            console.log(`ERROR at CMS.updateSidebar(): sidebar has not been set, please use the setupLink() method first`);
        }
    }
}


//== Classes ==//


/**
 * All elements from "linked_element" with the attribute "link-id" are affected by the ElementLink methods.
 * This class cannot create elements, it will only link the attributes and values of the corresponding id between the two elements.
 * 
 * @param {HTMLElement} target the element to link (holds the text data and id)
 * @param {HTMLElement} link the linked element
 * @param {Array} attributes array or string of the default linked attributes (has to be iterable!)
 */
// class ElementLink {
//     constructor(target, link) {
//         this.element = target;
//         this.link = link;
//         this.data = {};
//     }

//     // this.addAttribute = (attribute) => {
//     //     if (!attr.contains(attribute) && typeof attribute === "string") {
//     //         attr.push(attribute);
//     //     } else {
//     //         if (!typeof attribute === "string") {
//     //             console.log(`(${this}) ElementLink.addAttribute: argument "${attribute}" is not of type "string"`);
//     //         } else {
//     //             console.log(`(${this}) ElementLink.addAttribute: array "${attr}" already contains argument "${attribute}"`);
//     //         }
//     //     }
//     // }

//     getElement() {
//         return this.element;
//     }

//     getLinkedElement() {
//         return this.link;
//     }

//     setLinkedElement(target) {
//         if (typeof target === "object") {
//             this.link = target;
//         } else {
//             console.log(`(${this}) ElementLink.setLinkedElement: argument "${target}" is not of type "object"`);
//         }
//     }

//     getData(id) {
//         return this.data[id];
//     }

//     setData() {
//         for (let e of this.element.querySelectorAll("[id]")) {
//             this.data[e.id] = {
//                 element: e,
//                 text: e.innerHTML,
//             }

//             for (let a of this.linked_attr) {
//                 this.data[e.id].attr[a] = e.getAttribute(a);
//             }
//         }
//     }

//     removeData(id) {
//         delete this.data[id];
//     }

//     updateData(id, key, value) {
//         this.data[id][key] = value;
//     }

//     updateLink() {
//         for (let d of this.data) {
//             d.element.innerHTML = d.text;
//             for (const [name, value] of Object.entries(this.data.attr)) {
//                 d.element.setAttribute(name, value);
//             }
//         }
//     }
// }

// Will refresh the row list in the sidebar, sorting the list.
// Creates a new row and adds it to the sidebar when one does not exist for an existing row in the content body.

/**
 * Mental note:
 * Element similarities between sidebar and content body for both rows and elements inside the rows:
 * - id
 * - name
 * - name defining
 * - name click event
 * Exceptions:
 * - some extra click events like row deletion
 */
// export function updateContentLink() {
//     if (sidebar_row) {

//         // let sidebar_row = sidebar_rows.querySelector("[row-id='" + r.id + "']");
//         // r.setAttribute("name", sidebar_row.querySelector(".row-title").innerHTML);

//         // sidebar_rows.appendChild(sidebar_row);
//         // console.log(r.children);
        
//         // for (const e of r.children) {
//         //     const element_list = sidebar_row.querySelector(".element_list");
//         //     if (element_list.querySelector("[element-id='" + e.id + "']")) {
//         //         let element_row = element_list.querySelector("[element-id='" + e.id + "']");
//         //         e.setAttribute("name", element_row.querySelector(".element_title").innerHTML);
//         //         element_row.querySelector(".element_title").addEventListener("click", (event) => editTextAsField(event.target));
//         //         element_list.appendChild(element_row);
//         //     } else {
//         //         e.remove();
//         //     }
//         // };
//     } else {
//         console.log("added: " + r.id);
//         let sidebar_row = stringToDOM(sidebar_templates.row_tab);
//         sidebar_row.setAttribute("row-id", r.id);

//         sidebar_row.querySelector(".row-close").addEventListener("click", () => removeRow(r.id));

//         sidebar_row.querySelector(".row-title").innerHTML = ((r.getAttribute("name")) ? r.getAttribute("name") : "new row");
//         sidebar_row.querySelector(".row-title").addEventListener("click", (event) => editTextAsField(event.target));

//         for (const e of r.children) {
//             let element_row = stringToDOM(sidebar_templates.element_row);
//             element_row.setAttribute("element_id", e.id);
//             element_row.querySelector(".element_title").innerHTML = ((e.getAttribute("name")) ? e.getAttribute("name") : "new element");
//             element_row.querySelector(".element_title").addEventListener("click", (event) => editTextAsField(event.target));

//             sidebar_row.querySelector(".element_list").appendChild(element_row);
//         };
        
//         sidebar_row.querySelector(".element_add_button").addEventListener("click", (event) => {
//             let element_list = sidebar_row.querySelector(".element_list");
//             let element_add = sidebar_row.querySelector(".element_add");

//             let element_selector = stringToDOM(sidebar_templates.element_selector);

//             element_add.replaceWith(element_selector);

//             const selector = element_selector.querySelector(".selector");
//             const confirm = element_selector.querySelector(".confirm");
//             const abort = element_selector.querySelector(".abort");

//             confirm.addEventListener("click", () => {
//                 let new_element = stringToDOM(cms_templates[selector.value]);
//                 new_element.setAttribute("id", generateUniqueId());
//                 new_element.setAttribute("name", `new ${selector.options[selector.selectedIndex].text}`);
//                 r.appendChild(new_element);

//                 let element_row = stringToDOM(sidebar_templates.element_row);
//                 element_row.setAttribute("element-id", new_element.id);
//                 element_row.querySelector(".element_title").innerHTML = new_element.getAttribute("name");

//                 element_row.querySelector(".element_title").addEventListener("click", (event) => editTextAsField(event.target, () => {
//                     new_element.setAttribute("name", event.target.innerHTML);
//                 }));
//                 // element_row.querySelector(".element_edit").addEventListener("click", () => {
//                 //     openEditor();
//                 // });

//                 element_list.appendChild(element_row);
//                 element_selector.replaceWith(element_add);
//             });

//             abort.addEventListener("click", () => {
//                 element_selector.replaceWith(element_add);
//             });
//         });

//         /* uses the input name with the same name as the style key in the style array (example: "fontSize")
//         * uses the placeholder value if input value is empty
//         * uses optional input attributes: 
//         * - excluded, regex expression (without the slashes!) to exclude characters when setting the input value (always uses "g" as flag)
//         * - prefix, string inserted before the value
//         * - unit, the unit that the style value will use (example: "px" or "em")
//         * 
//         * I highly recommend setting a min and max attribute to number type inputs.
//         */
//         for (const [style_key, style_value] of Object.entries(r.style)) {
//             if (sidebar_row.querySelector("[name='" + style_key + "']")) {
//                 let input = sidebar_row.querySelector("[name='" + style_key + "']");
//                 if (style_value) { 
//                     if (input.getAttribute("excluded")) {
//                         input.value = style_value.replace(new RegExp(input.getAttribute("excluded"), "g"), ""); // maybe make without constructor later
//                     } else {
//                         input.value = style_value; 
//                     }
//                 }  
//                 input.addEventListener("input", (event) => 
//                     updateStyle(
//                         style_key, 
//                         (
//                             (event.target.getAttribute("prefix") ? event.target.getAttribute("prefix") : "") + 
//                             (event.target.value ? event.target.value : event.target.getAttribute("placeholder")) + 
//                             (event.target.getAttribute("unit") ? event.target.getAttribute("unit") : "")
//                         ),
//                         r
//                     )
//                 );
//             }
//         };

//         sidebar_rows.appendChild(sidebar_row);
//     }

//     //> inserts RGB instead of HEX, maybe keep for later use (PLEASE DON'T IMPLEMENT A COLOR PICKER)
//     let color_inputs = sidebar_rows.querySelectorAll("[name='font-color']");
//     for (let i = 0; i < color_inputs.length; i++) {
//         color_inputs[i].value = document.getElementById(color_inputs[i].getAttribute("target")).style.color.replace(/\D/g, "");
//         color_inputs[i].addEventListener("input", (event) => 
//             updateStyle(
//                 'color', 
//                 '#' + ((event.target.value) ? event.target.value : '000000'),
//                 color_inputs[i].getAttribute("target")
//             )
//         )
//     }
// }

/** Updates the values of a linked list and sorts it in the same order as the referenced list.
 *  A link-id is unique inside a list.
 * @param {HTMLElement} list 
 */
// function updateLinkedList(list) {
//     const linked_list = document.querySelector("[list-id='" + list.id + "']");

//     // first check if a linked list exists:
//     if (linked_list) {

//         // remove any link items that have no reference.
//         for (const link_item of linked_list) {
//             if (!list.getElementById(link_item.getAttribute("link-id"))) {
//                 link_item.remove();
//             }
//         }

//         for (const item of list) {
//             const linked_item = linked_list.querySelector("[link-id='" + item.id + "']");
//             if (linked_item) {
//                 linked_item.setAttribute("name", item.getAttribute("name"));
//                 linked_list.appendChild(linked_item);
//             } else {
//                 console.log(`updateLinkedList: linked item could not be found with link-id: "${item.id}". Skipping...`)
//             }
//         }
//     } else {
//         console.log(`updateLinkedList: linked list could not be found with list-id: "${list.id}". Skipping... `);
//     }
// }

const GENERATED_KEYS = []; // prevents the small chance that a new element takes on the saved properties of a removed element

/** Generates a unique id to use as attribute.
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

/** Converts array generated by the window.getComputedStyle() method to a String.
 * Useful when setting the style of an element without using a for loop. 
 * Example: element.setAttribute("style", style_string)
 * 
 * @param {Array} styles computed style from the window.getComputedStyle() method
 * @returns string containing the styles
 */
// function computedStyleToString(styles) {
//     let style_string = "";
//     for (const [style, value] of Object.entries(styles)) {
//         style_string += `${style}: ${value};`;
//     }

//     return style_string;
// }

/** Turns an element into an input to change it's value and changes it back after submitting.
 * Executes refreshRowList() when finished.
 * 
 * @param {HTMLElement} element 
 * @param {()=>{}} callback 
 */
function editTextAsField(element, callback) {
    let temp_element = stringToDOM(`
        <span class="relative flex items-center w-full">
            <input type="text" class="new_text absolute p-1 w-full" placeholder="type here.." value="${element.innerHTML}">
            <button class="update_text absolute right-0 me-2">update</button>
        </span>
    `);

    const input = temp_element.querySelector(".new_text");
    const button = temp_element.querySelector(".update_text");

    element.replaceWith(temp_element);

    input.setSelectionRange(input.value.length, input.value.length);
    input.focus();

    button.addEventListener("click", () => {
        if (input.value != "") {
            element.innerHTML = input.value;
            try {temp_element.replaceWith(element);} catch {
                /**
                 * - To avoid the following exception message:
                 * Uncaught NotFoundError: Failed to execute 'replaceWith' on 'Element': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler.
                 * 
                 * - Reason: 
                 * Every time an element gets removed (replaced in this case), a blur event is triggered. This is mostly used for accessibility.
                 * When the element doesn't exist, it will throw an exception. 
                 * In this case, it doesn't matter if the blur event is triggered or not. It's not being used anyways.
                 */
            }
            refreshRowList();
        }
    });

    input.addEventListener("input", (event) => {
        if (event.target.value == "") {
            input.classList.add("invalid");
        } else {
            input.classList.remove("invalid"); 
        }
    });

    temp_element.addEventListener("focusout", (event) => {
        if (event.relatedTarget != button) {
            temp_element.replaceWith(element);
        }
    });
}

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

// updates the style of an element, might become irrelevant in the future.
function updateStyle(style_name, style_value, element) {
    if (element) {
        element.style[style_name] = style_value;
    } else {
        // log error here
    }
}
