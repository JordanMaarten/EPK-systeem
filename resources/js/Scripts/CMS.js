'use strict';

export const hooktest = "successfully imported CMS.js";

export function appendRow(target) {
    console.log(target);

    let row = document.createElement("div");

    row.classList.add("row");

    target.appendChild(row);
}