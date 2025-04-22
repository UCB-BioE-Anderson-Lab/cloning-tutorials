// docs/js/C6-Test.js

function sayHello(name) {
    return `Hello, ${name}!`;
  }
  
  // Expose it globally so you can call from other scripts or browser console
  window.sayHello = sayHello;