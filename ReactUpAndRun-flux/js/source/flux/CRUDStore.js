import {EventEmitter} from 'fbemitter';

let data;
let schema;
const emitter = new EventEmitter();

const CRUDStore = {
  
  init(initialSchema) {
    schema = initialSchema;
    const storage = 'localStorage' in window
      ? localStorage.getItem('data')
      : null;

    if (!storage) {
      data = [{}];
      schema.forEach(item => data[0][item.id] = item.sample);      
    } else {
      data = JSON.parse(storage);
    }
  },

  getData() {
    return data;
  },
  
  getSchema() {
    return schema;
  },
  
  setData(newData, commit) {
    data = newData;
    if (commit && 'localStorage' in window) {
      localStorage.setItem('data', JSON.stringify(newData));      
    }
    emitter.emit('change');
  },

  addListener(eventType, fn) {
    emitter.addListener(eventType, fn);
  },

  getCount() {
    return data.length;
  },
  
  getRecord(recordId) {
    return recordId in data ? data[recordId] : null;
  },

};

export default CRUDStore
