
import localForage from 'localforage';

// Configure localForage
localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'cardshow-app',
  version: 1.0,
  storeName: 'cards',
  description: 'Local storage for trading cards'
});

export { localForage };
