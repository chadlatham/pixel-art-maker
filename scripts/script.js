'use strict';
// The global object to wrap global variables and function declarations
// Avoids poluting the global namespace
var app = {};


// Generates a nested div structure with no text nodes between inner div elements.
// rows and columns must be even numbers.
app.generateGrid = function(cellCount) {
  var grid = document.querySelector('.grid');

  // Clear the existing children in grid
  var toClear = [];
  for (var i = 0; i < grid.childNodes.length; i++) {
    toClear.push(grid.childNodes[i]);
  }
  for (var i = 0; i < toClear.length; i++) {
    grid.removeChild(toClear[i]);
    // console.log(grid.childNodes.length);
  }
  console.log(grid.parentElement);

  // Loop and create the cell instances
  for (var n = 0; n < cellCount; n++) {
    var cell = document.createElement('div');
    cell.className = 'cell';
    grid.appendChild(cell);
  }
  // console.log(window.innerHeight);
  // console.log(grid.childNodes.length);
  console.log(grid.parentElement);
}






// Keep at bottom of file
// Start scripting after DOM loads
app.executeScripts = function (event) {
  console.log('DOMContentLoaded');
  // document.getElementsByClassName('row')[0].childNodes[2].remove();
  // console.log(document.getElementsByClassName('row'));
  app.generateGrid(2006);
}

document.addEventListener('DOMContentLoaded', app.executeScripts);
