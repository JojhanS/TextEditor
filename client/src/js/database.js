import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Implement logic to save content to the database
export const putDb = async (content) => {
  try {
    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    await store.put({ content }); // Save the content in an object with a single property 'content'
    await tx.done; // Complete the transaction
    console.log('Data saved to IndexedDB successfully');
  } catch (error) {
    console.error('Error saving data to IndexedDB:', error);
  }
};

// Implement logic to retrieve all content from the database
export const getDb = async () => {
  try {
    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const data = await store.getAll(); // Retrieve all data from the object store
    await tx.done; // Complete the transaction
    console.log('Data retrieved from IndexedDB successfully');
    return data.map((item) => item.content); // Extract the 'content' property from each item
  } catch (error) {
    console.error('Error retrieving data from IndexedDB:', error);
    return null;
  }
};

// Initialize the database
initdb();
