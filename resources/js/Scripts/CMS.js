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

const elements = {
    row : () => {let el = document.createElement("div"); el.classList.add("relative", "flex", "justify-between"); return el;},
    p : () => {let el = document.createElement("p"); el.innerText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, quidem vitae doloremque mollitia ut in nobis velit quia impedit harum officiis cumque, excepturi sint exercitationem consequatur totam, eos deleniti fuga."; return el;},
}

// Methods

export function onReady() {
    refreshRowList();
    
}

function refreshRowList() {
    let rows = document.querySelectorAll(".content-row");
    content_rows = {};

    rows.forEach(r => {
        content_rows[r.id] = r;    
    });

    console.log(content_rows);

    content_rows.forEach(r => {
        r
    });
}

export function getCMSElement(key) { 
    return elements[key]();
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
        console.log("Warning: target element:" + target + "does not exist.")
    }
}

export function appendElement(target_id, key) {
    let target = document.getElementById(target_id);
    let element = getCMSElement(key);
    
    target.insertAdjacentElement("afterend", element);
}

export function insertElement(target_id, key) {
    let target = document.getElementById(target_id);
    let element = getCMSElement(key);
    
    target.appendChild(element);
}

export function updateStyle(style_name, style_value, element) {
    if (element) {
        element.style[style_name] = style_value;
    } else {
        document.getElementById("content").style[style_name] = "" + style_value;
    }
}