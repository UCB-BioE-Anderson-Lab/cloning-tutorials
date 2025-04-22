
// C6-Utils.js - General Utility Functions for Web Applications
// Adapted from C6-Utils.gs for browser-based applications

// Function to merge multiple strings or arrays into a single string with a delimiter
function merge(...args) {
    if (args.length < 2) {
        throw new Error("At least two arguments are required");
    }

    const delimiter = args.pop();
    if (typeof delimiter !== "string") {
        throw new Error("The last argument must be a delimiter string");
    }

    return args.flat().join(delimiter);
}

// Function to extract a field from a JSON object or array as a string
function field(objJSON, fieldName) {
    try {
        const obj = JSON.parse(objJSON);
        const value = obj[fieldName];
        return typeof value === "object" ? JSON.stringify(value) : value;
    } catch (error) {
        throw new Error("Invalid JSON format or field not found.");
    }
}

// Simplified version: Converts an array of [key, value] pairs into a JSON object string
function makeJSON(inputArray) {
    const obj = {};
    inputArray.forEach(([key, value]) => {
        if (typeof key === 'string' && key.trim()) {
            obj[key.trim()] = value === 'null' ? null :
                              value === 'undefined' ? undefined :
                              value;
        }
    });
    return JSON.stringify(obj);
}



// Assign non-private functions to C6
Object.assign(window.C6, {
  merge,
  field,
  makeJSON
});