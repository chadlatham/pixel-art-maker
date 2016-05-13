// The global object to wrap global variables and function declarations.
var app = {};




// Keep at bottom of file
// Start scripting after DOM loads
var executeScripts = function (event) {
  console.log('DOMContentLoaded');
}

document.addEventListener('DOMContentLoaded', executeScripts);
