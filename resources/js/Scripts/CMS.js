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

const CMS_elements = {
    element_selector : () => {
        let el = document.createElement("div"); 
        //el.classList.add("relative", "flex", "justify-between");

        let elements_keys = Object.keys(elements);
        return el;
    },
}

const elements = {
    row : () => {let el = document.createElement("div"); el.classList.add("relative", "flex", "justify-between"); return el;},
    p : () => {let el = document.createElement("p"); el.innerText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, quidem vitae doloremque mollitia ut in nobis velit quia impedit harum officiis cumque, excepturi sint exercitationem consequatur totam, eos deleniti fuga."; return el;},
}

// Methods

export function showElement(target_name) {
    let targets = document.querySelectorAll("[aria-hide][aria-trigger='" + target_name + "']");

    targets.forEach(t => {
        while (t.closest(".hidden[aria-hide]")) {
            t.closest(".hidden[aria-hide]").classList.remove("hidden");
        }
        t.classList.remove("hidden");
    });
}

export function hideElement(target_name) {
    let targets = document.querySelectorAll("[aria-hide][aria-trigger=" + target_name + "]");

    targets.forEach(t => {
        t.classList.add("hidden");
    });
}

export function hideElementsInId(scope_id) {
    let scope = document.getElementById(scope_id);
    let targets = scope.querySelectorAll("[aria-hide]");
    targets.forEach(t => {
        if (scope.hasAttribute("aria-hide")) {
            scope.classList.add("hidden");
        }
        t.classList.add("hidden");
    });
}

export function getCMSElement(key) { 
    return elements[key]();
}

export function showSidebar(key) {
    document.getElementById("CMSSidebar").setAttribute("aria-hidden", "false");

    document.getElementById("sidebarOverlay").classList.remove("hidden");
    document.getElementById("sidebarOverlay").classList.add("fixed");
}

export function hideSidebar() {
    document.getElementById("CMSSidebar").setAttribute("aria-hidden", "true");

    document.getElementById("sidebarOverlay").addEventListener("transitionend", function transitionEnd() {
        document.getElementById("sidebarOverlay").classList.remove("fixed");
        document.getElementById("sidebarOverlay").classList.add("hidden");
        this.removeEventListener("transitionend", transitionEnd);
    });
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