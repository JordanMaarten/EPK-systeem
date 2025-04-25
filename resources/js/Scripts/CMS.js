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

let content_rows = {}

const sidebar_elements = {
    rowtab: `
        <div class="border border-slate">
            <div class= "flex justify-between p-3 border-b border-slate cursor-pointer" >
                <h3 class="row-title"></h3>
                <a class="row-close px-2"">X</a>
            </div >
            <div class="dropdown-item flex flex-col overflow-hidden">
                <div class="relative flex justify-center p-3 border-b border-slate">
                    <h3>Styling</h3>
                </div>
                <div class="relative flex flex-col gap-2 justify-center mt-2">
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font size:</span>
                        <span>
                            <input type="number" name="font-size" class="w-20 h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="16" target/>
                            <span class="ms-2">px</span>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font color:</span>
                        <span>
                            <span>#</span>
                            <input type="number" name="font-color" class="w-40 h-8 ms-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="000000" target/>
                        </span>
                    </div>
                </div>
            </div>
        </div > `,

}

const cms_elements = {
    row: `
        <div class="content-row">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci officia, qui dignissimos dolore asperiores dolorum architecto cum odio corrupti. Voluptates rem, fugiat delectus provident aspernatur aut nobis facilis quae suscipit!
        </div>`,
    p: `
        <p>
            This is an example text.
        </p>`,
}

// Methods

export function onReady() {
    refreshRowList();
}

export function stringToDOM(string) {
    return new DOMParser().parseFromString(string, "text/html").body.firstChild;
}

export function refreshRowList() {
    let rows = document.querySelectorAll(".content-row");
    let sidebar_rows = document.getElementById("sidebarRows");
    let x = 0;

    rows.forEach(r => {
        content_rows[r.id] = r;    
        if (sidebar_rows.querySelector("[row-id='" + r.id + "']")) {
            console.log("found: " + r.id);
            let sidebar_row = sidebar_rows.querySelector("[row-id='" + r.id + "']");
            sidebar_row.getElementsByClassName("row-title")[0].innerHTML = ((r.getAttribute("name")) ? r.getAttribute("name") : "new row");
        } else {
            console.log("added: " + r.id);
            let sidebar_row = stringToDOM(sidebar_elements.rowtab);
            sidebar_row.setAttribute("row-id", r.id);
            sidebar_row.getElementsByClassName("row-title")[0].innerHTML = ((r.getAttribute("name")) ? r.getAttribute("name") : "new row");
            sidebar_row.querySelectorAll("[target]").forEach(e => {
                e.setAttribute("target", r.id);
            });

            let size_input = sidebar_row.querySelector("[name='font-size']");
            size_input.value = r.style.fontSize.replace(/\D/g, "");
            size_input.addEventListener("input", (event) => 
                updateStyle(
                    'fontSize', 
                    ((event.target.value < 50 && event.target.value > 0) ? event.target.value : '16') + 'px',
                    r
                )
            );
            sidebar_rows.appendChild(sidebar_row);
        }
    });

    //> inserts RGB instead of HEX, maybe keep for later use
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

export function addRow() {
    let content = document.getElementById("content");
    let row = stringToDOM(cms_elements.row);
    row.setAttribute("id", generateUniqueId());

    content.appendChild(row);
    refreshRowList();
}

export function generateUniqueId() {
    let id = Math.random().toString(16).slice(2); 
    if (document.getElementById(id)) {
        generateUniqueId();
    } else {
        return id;
    }
}

export function toggleHidden(target) {
    document.getElementById(target).toggleAttribute("aria-hidden");
}

export function toggleTargets(target) {
    let targets = document.querySelectorAll("[aria-target=" + target + "]");

    if (targets.length > 0) {
        console.log(targets);
        targets.forEach(t => {
            t.toggleAttribute("aria-hidden");
        });
    } else {
        console.log("Warning: target element:" + target + "does not exist.");
    }
}

export function appendElement(target_id, key) {
    let target = document.getElementById(target_id);
    let element = stringToDOM(cms_elements[key]);
    
    target.insertAdjacentElement("afterend", element);
}

export function insertElement(target_id, key) {
    let target = document.getElementById(target_id);
    let element = stringToDOM(cms_elements[key]);
    
    target.appendChild(element);
}

export function updateStyle(style_name, style_value, element) {
    if (element) {
        element.style[style_name] = style_value;
    } else {
        document.getElementById("content").style[style_name] = "" + style_value;
    }
}
