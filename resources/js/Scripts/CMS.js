'use strict';

//== Templates ==//

// A collection of sidebar element templates to be added to the sidebar.
// Downsides are that you can't add onclick events inside the html doc, this will have to be done as javascript code.
const sidebar_templates = {
    sidebar_content_row: `
        <div class="border border-slate" link-id>
            <div class="flex justify-between p-3 border-b border-slate cursor-pointer">
                <h3 class="row-title"></h3>
                <a class="row-close px-2">X</a>
            </div >
            <div class="dropdown-item flex flex-col overflow-hidden">
                <div class="relative flex justify-center p-3 border-b border-slate">
                    <h3>Elements</h3>
                </div>
                <div class="element_list relative flex flex-col gap-2 justify-center mt-2"></div>
                <div class="relative flex flex-col gap-2 justify-center mt-2">
                    <div class="element_add relative flex justify-end px-3 pb-2 border-b border-slate">
                        <button class="element_add_button inline-flex items-center rounded-md border border-gray-300 text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm px-2 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-25">Add new +</button>
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
            <span class="element_title"></span>
            <button class="element_edit">edit</button>
        </div>
    `,
    //try to fix the movement later
    element_selector: `
    <div class="element_add relative flex justify-between px-3 pb-2 items-center border-b border-slate">
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

// A collection of element templates to be added to the content body.
const cms_templates = {
    row: `
        <div class="content-row">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci officia, qui dignissimos dolore asperiores dolorum architecto cum odio corrupti. Voluptates rem, fugiat delectus provident aspernatur aut nobis facilis quae suscipit!
        </div>
    `,
    p: `
        <p>
            This is an example text.
        </p>
    `,
    
}

export default new class CMS {
    constructor() {

    }

    /**
     * @param {HTMLElement} content
     * @param {ContentLink} link
     * @param {Array} default_attributes
     */
    setup(content, link, default_attributes) {
        if (typeof content === "object") {
            if (typeof link === "object") {
                this.content = content;
                this.link = new ContentLink(content, link, default_attributes);
            } else {
                console.log(`ERROR at CMS.setup(): link argument "${link}" is not of type "element"`);
            }
        } else {
            console.log(`ERROR at CMS.setup(): content argument "${content}" is not of type "element"`);
        } 
    }

    getContent() {
        return this.content;
    }

    getLinked() {
        if (this.link) {
            return this.link.getLink();
        } else {
            console.log(`ERROR at CMS.getLinked(): link has not been set, please use setup method first`);
        }
    }

    //== Utilities ==//

    /**
     * Returns only one DOM element and all it's children. CSS is still applied after parsing.
     * 
     * @param {String} string string value of the element to parse to DOM
     * @returns HTMLElement
     */
    stringToDOM(string) {
        return new DOMParser().parseFromString(string, "text/html").body.firstChild;
    }
}


//== Classes ==//
/**
 * All elements from "linked_element" with the attribute "link-id" are affected by the ElementLink methods.
 * This class cannot create elements, it will only link the attributes and values of the corresponding id between the two elements.
 * 
 * @param {HTMLElement} content the content to link (holds the text data and id)
 * @param {HTMLElement} link the element that that will hold the linked elements
 * @param {Array} default_attributes array or string of the default linked attributes (has to be iterable!)
 */
class ContentLink {
    constructor(content, link, default_attributes) {
        this.content = content;
        this.link = link;
        this.linked_attr = [];

        if (typeof default_attributes === "string") {
            this.linked_attr = [default_attributes];
        }

        if (typeof default_attributes === "object") {
            try {
                for (let a of default_attributes) {
                    this.linked_attr.push(a);
                }
            } catch {
                console.log(`ERROR at ContentLink constructor(): attributes argument "${default_attributes}" is invalid. Please assign an iterable array or string`);
            }
        } 
    }

    getLink() {
        return this.link;
    }

    setLink(element) {
        if (typeof element === "object") {
            this.link = element;
        } else {
            console.log(`ERROR at ContentLink.setLink(): element argument "${element}" is not of type "element"`);
        }
    }

    update() {

    }
}

/**
 * All elements from "linked_element" with the attribute "link-id" are affected by the ElementLink methods.
 * This class cannot create elements, it will only link the attributes and values of the corresponding id between the two elements.
 * 
 * @param {HTMLElement} target the element to link (holds the text data and id)
 * @param {HTMLElement} link the linked element
 * @param {Array} attributes array or string of the default linked attributes (has to be iterable!)
 */
class ElementLink {
    constructor(target, link) {
        this.element = target;
        this.link = link;
        this.data = {};
    }

    // this.addAttribute = (attribute) => {
    //     if (!attr.contains(attribute) && typeof attribute === "string") {
    //         attr.push(attribute);
    //     } else {
    //         if (!typeof attribute === "string") {
    //             console.log(`(${this}) ElementLink.addAttribute: argument "${attribute}" is not of type "string"`);
    //         } else {
    //             console.log(`(${this}) ElementLink.addAttribute: array "${attr}" already contains argument "${attribute}"`);
    //         }
    //     }
    // }

    getElement() {
        return this.element;
    }

    getLinkedElement() {
        return this.link;
    }

    setLinkedElement(target) {
        if (typeof target === "object") {
            this.link = target;
        } else {
            console.log(`(${this}) ElementLink.setLinkedElement: argument "${target}" is not of type "object"`);
        }
    }

    getData(id) {
        return this.data[id];
    }

    setData() {
        for (let e of this.element.querySelectorAll("[id]")) {
            this.data[e.id] = {
                element: e,
                text: e.innerHTML,
            }

            for (let a of this.linked_attr) {
                this.data[e.id].attr[a] = e.getAttribute(a);
            }
        }
    }

    removeData(id) {
        delete this.data[id];
    }

    updateData(id, key, value) {
        this.data[id][key] = value;
    }

    updateLink() {
        for (let d of this.data) {
            d.element.innerHTML = d.text;
            for (const [name, value] of Object.entries(this.data.attr)) {
                d.element.setAttribute(name, value);
            }
        }
    }
}

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
export function updateContentLink() {
    let content_body = ContentLink.getElement();
    let linked_element = ContentLink.getLinkedElement();
    let data = ContentLink.getData();

    for (const child of content_body) {
        if (linked_element.querySelector(`[link-id="${data[child.id]}"]`)) {
            const sidebar_row = stringToDOM(sidebar_templates.sidebar_content_row);
            sidebar_row.setAttribute("link-id", child.id);
            linked_element.appendChild(sidebar_row);
        } else {
            console.log("added: " + child.id);
        }
    }
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

    //            sidebar_row.querySelector(".element_list").appendChild(element_row);
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
    // };

    //> inserts RGB instead of HEX, maybe keep for later use (PLEASE DON'T IMPLEMENT A COLOR PICKER)
    // let color_inputs = sidebar_rows.querySelectorAll("[name='font-color']");
    // for (let i = 0; i < color_inputs.length; i++) {
    //     color_inputs[i].value = document.getElementById(color_inputs[i].getAttribute("target")).style.color.replace(/\D/g, "");
    //     color_inputs[i].addEventListener("input", (event) => 
    //         updateStyle(
    //             'color', 
    //             '#' + ((event.target.value) ? event.target.value : '000000'),
    //             color_inputs[i].getAttribute("target")
    //         )
    //     )
    // }
}

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



// Adds a row to the content body. If element content body does not exist, then a new one will be created.
export function addRow() {
    if (document.getElementById("content_body")) {
        let content_body = document.getElementById("content_body");
    } else {
        let content_body = document.createElement("div");
        content_body.setAttribute("id", "content_body");
        document.getElementById("content").appendChild(content_body);
    }
    let row = stringToDOM(cms_templates.row);
    row.setAttribute("id", generateUniqueId());

    content_body.appendChild(row);
    refreshRowList();
}

export function removeRow(id) {
    try {
        document.getElementById(id).remove();
        document.getElementById("sidebarRows").querySelector("[row-id='" + id + "']").remove();
        refreshRowList();
    } catch {
        return console.log(`Error: row with id: ${id}, could not be removed / does not exist`);
    }
}

// Generates a unique id to use as attribute.
export function generateUniqueId() {
    let id = Math.random().toString(16).slice(2); 
    if (document.getElementById(id)) {
        generateUniqueId();
    } else {
        return id;
    }
}

//-- (revisit this)

// export function toggleHidden(target) {
//     try {
//         document.getElementById(target).toggleAttribute("aria-hidden");
//     } catch {
//         return console.log("Error: target element:" + target + "does not exist.");
//     }
// }

// export function toggleTargets(target) {
//     try {
//         let targets = document.querySelectorAll("[aria-target=" + target + "]");
//         targets.forEach(t => {
//             t.toggleAttribute("aria-hidden");
//         });
//     } catch {
//         return console.log("Error: target element:" + target + "does not exist.");
//     }
// }


//-- (unused)

// export function appendElement(row_id, key) {
//     try {
//         let target = document.getElementById(row_id);
//         let element = stringToDOM(cms_templates[key]);
//         target.insertAdjacentElement("afterend", element);
//     } catch {
//         if (!document.getElementById(row_id)) {
//             return console.log(`Error: row with id: ${row_id}, could not be found`);
//         }
//         if (!cms_templates[key]) {
//             return console.log(`Error: key: ${key}, is not included in array: cms_templates`);
//         }
//     }
    
// }

// export function insertElement(target_id, key) {
//     let target = document.getElementById(target_id);
//     let element = stringToDOM(cms_templates[key]);
    
//     target.appendChild(element);
// }

// Turns an element into an input to change it's value and changes it back after submitting.
// Executes refreshRowList() when finished.
export function editTextAsField(element, callback) {
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
export function updateStyle(style_name, style_value, element) {
    if (element) {
        element.style[style_name] = style_value;
    } else {
        // log error here
    }
}
