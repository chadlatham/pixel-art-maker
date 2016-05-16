'use strict';

// The global object to wrap global variables and function declarations
// Avoids polluting the global namespace
var app = {};

// General functions ***********************************************************

// Generates divs with class of "cell" to fill the flexible grid.
app.generateCells = function(element, cellCount) {
  for (var n = 0; n < cellCount; n++) {
    var cell = document.createElement('div');
    cell.className = 'cell';
    element.appendChild(cell);
  }
}

// Clears existing nodes (removes either existing cells or text/comment nodes)
app.clearChildren = function (element) {

  // Store the children to clear in an array
  var toClear = [];
  for (var i = 0; i < element.childNodes.length; i++) {
    toClear.push(element.childNodes[i]);
  }

  // Clear children from element.childNodes
  for (var i = 0; i < toClear.length; i++) {
    element.removeChild(toClear[i]);
  }
}

// Changes the background color to be the current color
// Should have been implemented as a property of the app object!!!!!!!!!!!!!!!!!
app.setCurrentColor = function (color) {
  var gridBorder = document.querySelector('.grid-border');
  var primaryNav = document.querySelector('.primary-nav');
  gridBorder.style.backgroundColor = color;
  primaryNav.style.backgroundColor = color;
  app.currentColor = color;
}

// Sets the default colors of the 6 color option buttons
// CSS did not allow the property value to be read later to apply color
app.setDefaultColors = function () {
  var colorOptionButtons = document.querySelectorAll('.color');
  var options = ['#31d9a5', '#72b4b6', '#6e8581', '#feff50', '#ffba50', '#000000']
  for (var i = 0; i < colorOptionButtons.length; i++) {
    colorOptionButtons[i].style.backgroundColor = options[i];
  }
}

// Resets all tool operation flags
// Flags determine the active tool (2 tools currently)
app.resetTools = function (defaultFlag) {
  app.defaultTool = !!defaultFlag;
  app.rectangleTool = false;
  document.querySelector('.rectangle').style.boxShadow = "";
}


// Event handlers **************************************************************

// Change the background color of a cell
app.changeCellColor = function (event) {

  // Guard clause for non cell event or not default tool
  if (event.target.className !== "cell" || !app.defaultTool) { return; }

  // Paint the cell if the button is depressed (could be a hover)
  if (event.buttons === 1) {
    event.target.style.backgroundColor = app.currentColor;
  }
}

// Pull the background color from the button pass it to setCurrentColor update the app
app.colorOptionClick = function (event) {
  app.setCurrentColor(event.target.style.backgroundColor);
}

// Update the button with the color from the color-picker
app.colorOptionDblClick = function (event) {
  var colorPicker = document.getElementById('color-picker');
  app.setCurrentColor(colorPicker.value);
  event.target.style.backgroundColor = colorPicker.value;
}

// Used to set the default values for the app at app init or during a reset
app.resetApp = function () {
  app.clearChildren(app.grid);
  app.generateCells(app.grid, app.cellCount);
  app.setCurrentColor('#ff7552');
  app.setDefaultColors();
  app.resetTools(true);
  document.getElementById('color-picker').value = '#ffffff';
}

// Set the currentColor to white but apply blank to cells
app.eraseButtonClick = function (event) {
  app.setCurrentColor('#ffffff');
  app.currentColor = '';
}

// Update the currentColor with the value from the color-picker
app.colorPickerChanged = function(event) {
  app.setCurrentColor(event.target.value);
}

// Enable or disable the rectangle tool
app.rectangleToolClick = function (event) {

  // Deactivate tool if already activated
  if (app.rectangleTool) {
    app.resetTools(true);
    event.target.style.boxShadow = '';
  } else {

    // Activate tool
    app.resetTools(false);
    app.rectangleTool = true; // Flag for tool active

    // CSS would not allow stacking of box-shadow's to accomodate the shadow on hover
    event.target.style.boxShadow = 'inset 0 0 1em gold, 0 0 1em red';
  }
}

// Rectangle tool active - store the origin points of the drag operation
app.startRectangle = function (event) {
  if (app.rectangleTool) {
    app.recStartX = event.x;
    app.recStartY = event.y;
  }
}

// Rectangle tool active - paint the cells enclosed or touching the rectangle
app.endRectangle = function (event) {

  // Guard clause to prevent non rectangle tool events
  // This guard clause may be unnecessary. Need to investigate.
  if (! app.rectangleTool) { return; }

  app.resetTools(true);

  // Calculate the min's and max's of the rectangle
  var minX = Math.min(app.recStartX,event.x);
  var minY = Math.min(app.recStartY,event.y);
  var maxX = Math.max(app.recStartX,event.x);
  var maxY = Math.max(app.recStartY,event.y);

  // Change the cells that fall within the rectangle
  for (var i = 0; i < app.grid.children.length; i++) {

    // Get the viewport boundaries of the cell to examine
    var rec = app.grid.children[i].getBoundingClientRect();

    // Determine if it falls within the selection rectangle and apply background color
    if (rec.right >= minX && rec.left <= maxX && rec.bottom >= minY && rec.top <= maxY) {
      app.grid.children[i].style.backgroundColor = app.currentColor;
    }
  }
}


// Keep at bottom of file ******************************************************
// Application execution *******************************************************
app.executeScripts = function (event) {

  // Create grid
  app.grid = document.querySelector('.grid');
  app.cellCount = 2405;
  app.resetApp();

  // Establish event listeners on grid elements
  app.grid.addEventListener('mouseover', app.changeCellColor);
  app.grid.addEventListener('mousedown', app.changeCellColor);
  app.grid.addEventListener('mousedown', app.startRectangle);
  app.grid.addEventListener('mouseup', app.endRectangle);

  // Establish event listeners on color option buttons
  var colorOptionButtons = document.querySelectorAll('.color');
  for (var i = 0; i < colorOptionButtons.length; i++) {
    colorOptionButtons[i].addEventListener('click', app.colorOptionClick);
    colorOptionButtons[i].addEventListener('dblclick', app.colorOptionDblClick);
  }

  // Establish event listener on reset button
  var resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', app.resetApp);

  // Establish event listener erase button
  var eraseButton = document.querySelector('.erase');
  eraseButton.addEventListener('click', app.eraseButtonClick);

  // Establish event listener for the color picker
  var colorPicker = document.getElementById('color-picker');
  colorPicker.addEventListener('input', app.colorPickerChanged);

  // Establish event listener for the rectangle picker
  var rectangleButton = document.querySelector('.rectangle');
  rectangleButton.addEventListener('click', app.rectangleToolClick);

}



document.addEventListener('DOMContentLoaded', app.executeScripts);
