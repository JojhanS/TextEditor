// Get the button element for installing the PWA
const butInstall = document.getElementById('buttonInstall');

// Variable to store the deferredPrompt
let deferredPrompt;

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default browser prompt for installation
  event.preventDefault();
  // Store the event object so we can use it later when the user clicks the install button
  deferredPrompt = event;
  // Show your custom install button or UI element
  // For example, enable the install button that was initially hidden
  butInstall.style.display = 'block';
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  // Check if the deferredPrompt is available (the PWA can be installed)
  if (deferredPrompt) {
    // Show the installation prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const result = await deferredPrompt.userChoice;

    // Check the result of the user's choice
    if (result.outcome === 'accepted') {
      console.log('PWA installation accepted by the user.');
    } else {
      console.log('PWA installation dismissed by the user.');
    }

    // Clear the deferredPrompt so it doesn't trigger again
    deferredPrompt = null;
  }
  // Hide the install button after installation
  butInstall.style.display = 'none';
});

// Add a handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  console.log('PWA was installed on the user device.');
});

// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data || localData || header);
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });
  }
}
