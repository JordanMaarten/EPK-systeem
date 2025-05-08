'use strict';

export const hooktest = "successfully imported CMS.js";

// Element references
window.onload = (event) => {
    window.addEventListener("click", (event) => {
        // console.log(event.target);
    })
    console.log(document.readyState);
};

// Elements

// A collection of sidebar elements to be added to the sidebar.
// Downsides are that you can't add onclick events inside the html doc, this will have to be done as javascript code.
const sidebar_elements = {
    rowtab: `
        <div class="border border-slate">
            <div class="flex justify-between p-3 border-b border-slate cursor-pointer">
                <h3 class="row-title"></h3>
                <a class="row-close px-2">X</a>
            </div >
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
                            <span>#</span>
                            <input type="text" name="fontFamily" class="w-40 h-8 ms-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="arial" target/>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>background color:</span>
                        <span>
                            <span>#</span>
                            <input type="text" name="backgroundColor" class="w-40 h-8 ms-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="transparent" target/>
                        </span>
                    </div>
                </div>
            </div>
        </div > `,
    
}

// A collection of elements to be added to the content body.
const cms_elements = {
    row: `
        <div class="content-row editable">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci officia, qui dignissimos dolore asperiores dolorum architecto cum odio corrupti. Voluptates rem, fugiat delectus provident aspernatur aut nobis facilis quae suscipit!
        </div>`,
    p: `
        <p>
            This is an example text.
        </p>`,
    
}

//== Functions ==//

// Executes when the doc AND vue setup are ready.
export function onReady() {
    refreshRowList();
}

// Returns only one element and all it's children. CSS is still applied after parsing.
export function stringToDOM(string) {
    return new DOMParser().parseFromString(string, "text/html").body.firstChild;
}

// Will refresh the row list in the sidebar, sorting the list.
// Creates a new row and adds it to the sidebar when one does not exist for an existing row in the content body.
export function refreshRowList() {
    let rows = document.querySelectorAll(".content-row");
    let sidebar_rows = document.getElementById("sidebarRows");

    rows.forEach(r => {
        if (sidebar_rows.querySelector("[row-id='" + r.id + "']")) {
            console.log("found: " + r.id);
            let sidebar_row = sidebar_rows.querySelector("[row-id='" + r.id + "']");
            r.setAttribute("name", sidebar_row.querySelector(".row-title").innerHTML);
            sidebar_rows.appendChild(sidebar_rows.querySelector("[row-id='" + r.id + "']"));
        } else {
            console.log("added: " + r.id);
            let sidebar_row = stringToDOM(sidebar_elements.rowtab);
            sidebar_row.setAttribute("row-id", r.id);
            sidebar_row.querySelector(".row-close").addEventListener("click", () => removeRow(r.id));
            sidebar_row.querySelector(".row-title").innerHTML = ((r.getAttribute("name")) ? r.getAttribute("name") : "new row");
            sidebar_row.querySelector(".row-title").addEventListener("click", (event) => editTextAsInput(event.target));

            /* uses the input name with the same name as the style key in the style array (example: "fontSize")
            * uses the placeholder value if input value is empty
            * uses optional input attributes: 
            * - excluded, regex expression (without the slashes!) to exclude characters when setting the input value (always uses "g" as flag)
            * - prefix, string inserted before the value
            * - unit, the unit that the style value will use (example: "px" or "em")
            * 
            * I highly recommend setting a min and max attribute to number type inputs.
            */
            for (const [style_key, style_value] of Object.entries(r.style)) {
                if (sidebar_row.querySelector("[name='" + style_key + "']")) {
                    let input = sidebar_row.querySelector("[name='" + style_key + "']");
                    if (style_value) { 
                        if (input.getAttribute("excluded")) {
                            input.value = style_value.replace(new RegExp(input.getAttribute("excluded"), "g"), ""); // maybe make without constructor later

                        } else {
                            input.value = style_value; 
                        }
                    }  
                    input.addEventListener("input", (event) => 
                        updateStyle(
                            style_key, 
                            (
                                (event.target.getAttribute("prefix") ? event.target.getAttribute("prefix") : "") + 
                                (event.target.value ? event.target.value : event.target.getAttribute("placeholder")) + 
                                (event.target.getAttribute("unit") ? event.target.getAttribute("unit") : "")
                            ),
                            r
                        )
                    );
                }
            };

            sidebar_rows.appendChild(sidebar_row);
        }
    });

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

// Adds a row to the content body. If element content body does not exist, then a new one will be created.
export function addRow() {
    if (document.getElementById("content_body")) {
        let content_body = document.getElementById("content_body");
    } else {
        let content_body = document.createElement("div");
        content_body.setAttribute("id", "content_body");
        document.getElementById("content").appendChild(content_body);
    }
    let row = stringToDOM(cms_elements.row);
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

// Adds an element to a row with the specified id.
export function addElement(key, id) {
    let row = document.getElementById(id);
    let element = stringToDOM(cms_elements[key]);
    element.setAttribute("id", generateUniqueId());

    if (element.classList.contains("editable")) {
        element.addEventListener("click", (event) => editTextAsInput(event.target));
    }

    row.appendChild(element);
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

export function toggleHidden(target) {
    try {
        document.getElementById(target).toggleAttribute("aria-hidden");
    } catch {
        return console.log("Error: target element:" + target + "does not exist.");
    }
}

export function toggleTargets(target) {
    try {
        let targets = document.querySelectorAll("[aria-target=" + target + "]");
        targets.forEach(t => {
            t.toggleAttribute("aria-hidden");
        });
    } catch {
        return console.log("Error: target element:" + target + "does not exist.");
    }
}

export function appendElement(row_id, key) {
    try {
        let target = document.getElementById(row_id);
        let element = stringToDOM(cms_elements[key]);
        target.insertAdjacentElement("afterend", element);
    } catch {
        if (!document.getElementById(row_id)) {
            return console.log(`Error: row with id: ${row_id}, could not be found`);
        }
        if (!cms_elements[key]) {
            return console.log(`Error: key: ${key}, is not included in array: cms_elements`);
        }
    }
    
}

export function insertElement(target_id, key) {
    let target = document.getElementById(target_id);
    let element = stringToDOM(cms_elements[key]);
    
    target.appendChild(element);
}

// Turns an element into an input to change it's value and changes it back after submitting.
// Executes refreshRowList() when finished.
export function editTextAsInput(element) {
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
            temp_element.replaceWith(element);
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

// updates the style of an element, might become irrelevant in the future.
export function updateStyle(style_name, style_value, element) {
    if (element) {
        element.style[style_name] = style_value;
    } else {
        // log error here
    }
}
