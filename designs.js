const grid = $("#pixel_canvas");
const createGrid = $("#createGrid");
const colorPicker = $("#colorPicker");
const container = $("#container");
const startingHeight = Number(container.css("height").slice(0,-2));
const saveButton = $("#save");
const palette = $("#target_canvas");
const inputHeight = $("#input_height");
const inputWidth = $("#input_width");
// color tracker variable
let selectedColor = colorPicker.val();

// FUNCTIONS
// create grid
function makeGrid() {
    // get user input
    let height = Number(inputHeight.val());
    let width = Number(inputWidth.val());
    // make sure values inside limit
    let limit = checkLimit(height, width);
    if(!limit){
        return;
    }
    // adjust height
    dynamicAdjustHeight(height);
    // reset current grid
    grid.html("");
    // create cols
    for(let i = 0; i < height; i++) {
        grid.append('<tr></tr>');
        let currentRow = grid.children().last();
        // create rows
        for(let j = 0; j < width; j++) {
            currentRow.append('<td></td>');
        }
    }
}

// save your painting using html2canvas
function saveArt() {
    html2canvas(grid.parent()[0]).then(function(canvas) {
        // prepare data
        let data = canvas.toDataURL();
        if(data.length < 10){
            alert("No canvas created yet!");
            return;
        }
        //call helper function
        promptToSave(data, "MyArt.png");
    });
}

// helper function for saveArt
function promptToSave(uri, name) {
    let link = $("<a></a>");
    link.attr("href", uri);
    link.attr("download", name);
    link[0].click(); 
}

// limit max size
function checkLimit(height, width){
    if(height>38 || width>38){
        alert("Maximum grid size is 38x38!");
        return false;
    }else if(height <= 0 || width <= 0){
        alert("Grid dimensions must be bigger than 0!");
        return false;
    }
    return true;
}

// dynamically change container height
function dynamicAdjustHeight(height){
    if(height>10){
        height -= 10;
        container.css("height", startingHeight + (height * 20));
    } else {
        container.css("height", startingHeight);
    }
}

// the next 5 functions are meant to assist with palette clicks.
// code below adapted/sourced from https://ourcodeworld.com/articles/read/185/how-to-get-the-pixel-color-from-a-canvas-on-click-or-mouse-event-with-javascript
function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj == obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function getEventLocation(element,event){
    var pos = getElementPosition(element);
    
    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}

function drawImageFromWebUrl(sourceurl){
      var img = new Image();

      img.addEventListener("load", function () {
          // The image can be drawn from any source
          palette[0].getContext("2d").drawImage(img, 0, 0, img.width,    img.height, 0, 0, palette[0].width, palette[0].height);
          
      });

      img.setAttribute("src", sourceurl);
}

// source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// EVENT HANDLERS
// when user clicks "create grid", call makeGrid()
createGrid.click(function(e){
    e.preventDefault();
    makeGrid();
});
createGrid.trigger("click");

// when user clicks Save
saveButton.click(function(e){
    e.preventDefault();
    saveArt();
});

// update color variable when user changes it
colorPicker.change(function() {
    selectedColor = colorPicker.val();
});

// bind function painting (clicking and dragging) on the grid
grid.on('mousemove click contextmenu', 'td', function(e) {
    // prevent issues with dragging and contextmenu
    e.preventDefault();
    
    // paint with left button, erase with right button
    if(e.which === 1) {
        $(this).css('background', selectedColor);
    } else if (event.which === 3) {
        $(this).css('background', 0);
    }
});

// listen to palette clicks
palette.on("click", function(e) {
    // get position of click
    let pos = getEventLocation(e.target, e);
    let x = pos.x;
    let y = pos.y;

    // context of canvas
    let ctx = e.target.getContext('2d');

    // p for pixel
    let p = ctx.getImageData(x, y, 1, 1).data; 

    // update selected color
    colorPicker.val(rgbToHex(p[0], p[1], p[2]));
    colorPicker.trigger("change");
});

//CREATE PALETTE
// draw from base64 to avoid tainting the canvas: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
drawImageFromWebUrl("data:image/gif;base64,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");
