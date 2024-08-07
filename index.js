const URL = "https://guess-what-ixoj.onrender.com";
let canvas = document.getElementById("canvas-mobile");
if (screen.availWidth > 768) {
    canvas = document.getElementById("canvas-desktop");
}
const colorInput = document.getElementById("color-input");
const colorDisplay = document.getElementById("stroke-color");
const widthInput = document.getElementById("width-input");
const widthDisplay = document.getElementById("width-input-div");
const saveButton = document.getElementById("save-button");
const clearButton = document.getElementById("clear-button");
const fillButton = document.getElementById("fill-button");
const guessDiv = document.getElementById("ai-guess");
const ctx = canvas.getContext("2d");

let boundings = canvas.getBoundingClientRect();
let intervalId;
// desktop
canvas.addEventListener("mousedown", (e) => handleMouseDown(e));
window.addEventListener("mouseup", (e) => handleMouseUp(e));
canvas.addEventListener("mousemove", (e) => handleDrawing(e));
// touch
canvas.addEventListener("touchstart", (e) => handleMouseDown(e));
window.addEventListener("touchend", (e) => handleMouseUp(e));
canvas.addEventListener("touchmove", (e) => handleDrawing(e));

// window.addEventListener("resize", handleResize);
colorInput.addEventListener("change", (e) => changeColor(e));
widthInput.addEventListener("input", (e) => changeWidth(e));
saveButton.addEventListener("click", saveImage);
clearButton.addEventListener("click", clearCanvas);
fillButton.addEventListener("click", fillCanvas);

ctx.strokeStyle = colorInput.value;
let isDrawing = false;
setInterval(() => (boundings = canvas.getBoundingClientRect()), 1000);

// function handleResize() {
//     if (canvas.classList.contains("hidden")) {
//         canvas =
//             canvas.id === "canvas-desktop"
//                 ? (canvas = document.getElementById("canvas-mobile"))
//                 : document.getElementById("canvas-desktop");
//     }
// }
function handleMouseDown(event) {
    console.log("down");
    clearTimeout(intervalId);
    let { x, y } = decodeCoords(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing = true;
}
function handleMouseUp() {
    if (isDrawing) {
        intervalId = setTimeout(async () => {
            guessDiv.innerHTML = await guessWhatsThat();
        }, 1000);
    }

    ctx.closePath();
    isDrawing = false;
}
function handleDrawing(event) {
    if (isDrawing) {
        let { x, y } = decodeCoords(event);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function decodeCoords(event) {
    let coords;
    if (!event.touches) {
        coords = getMouseCoords(event);
    } else {
        coords = getTouchCoords(event);
    }
    let x = coords.x;
    let y = coords.y;
    return { x, y };
}
function getMouseCoords(event) {
    let x = event.clientX - boundings.left;
    let y = event.clientY - boundings.top;
    return { x, y };
}
function getTouchCoords(event) {
    let x = event.touches[0].clientX - boundings.left;
    let y = event.touches[0].clientY - boundings.top;
    return { x, y };
}
function changeColor(event) {
    ctx.strokeStyle = event.target.value;
    colorDisplay.innerHTML = event.target.value;
}
function changeWidth(event) {
    ctx.lineWidth = event.target.value;
    widthDisplay.title = `Thickness: ${event.target.value}`;
}

function saveImage() {
    const canvasDataURL = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = canvasDataURL;
    a.download = "MyPainting";
    a.click();
}

async function guessWhatsThat() {
    const canvasDataURL = canvas.toDataURL();
    const res = await fetch(`${URL}/imageToText`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ blob: `${canvasDataURL.slice(22)}` }),
    });
    const data = await res.json();
    if (data.success) {
        return data.message;
    }
    return "I dont know what that is...";
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function fillCanvas() {
    ctx.fillStyle = colorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
