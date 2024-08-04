const canvas = document.getElementById("canvas");
const colorInput = document.getElementById("color-input");
const colorDisplay = document.getElementById("stroke-color");
const widthInput = document.getElementById("width-input");
const widthDisplay = document.getElementById("stroke-width");
const saveButton = document.getElementById("save-button");
const clearButton = document.getElementById("clear-button");
const fillButton = document.getElementById("fill-button");
const ctx = canvas.getContext("2d");
let boundings = canvas.getBoundingClientRect();
canvas.addEventListener("mousedown", (e) => handleMouseDown(e));
canvas.addEventListener("mouseup", (e) => handleMouseUp(e));
canvas.addEventListener("mousemove", (e) => handleDrawing(e));
colorInput.addEventListener("change", (e) => changeColor(e));
widthInput.addEventListener("change", (e) => changeWidth(e));
saveButton.addEventListener("click", saveImage);
clearButton.addEventListener("click", clearCanvas);
fillButton.addEventListener("click", fillCanvas);
ctx.strokeStyle = colorInput.value;

setInterval(() => (boundings = canvas.getBoundingClientRect()), 1000);
function handleMouseDown(event) {
    let { mouseX, mouseY } = getMouseCoords(event);
    console.log("down");
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    isDrawing = true;
}
function handleMouseUp() {
    console.log("up");
    ctx.closePath();
    isDrawing = false;
}
function handleDrawing(event) {
    if (isDrawing) {
        let { mouseX, mouseY } = getMouseCoords(event);
        console.log("moving");
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }
}

function getMouseCoords(event) {
    mouseX = event.clientX - boundings.left;
    mouseY = event.clientY - boundings.top;
    return { mouseX, mouseY };
}

function changeColor(event) {
    ctx.strokeStyle = event.target.value;
    colorDisplay.innerHTML = event.target.value;
}
function changeWidth(event) {
    ctx.lineWidth = event.target.value;
    widthDisplay.innerHTML = event.target.value;
}

function saveImage() {
    const canvasDataURL = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = canvasDataURL;
    a.download = "MyPainting";
    a.click();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function fillCanvas() {
    ctx.fillStyle = colorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
