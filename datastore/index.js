const { log } = require('console');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // need to get an id from getUniqueId.
  counter.getNextUniqueId((err, id) => {
    // generate file path to new todo item
    const fileName = exports.dataDir + '\\' + id + '.txt';
    // Use fs to write the text parameter into the file path. 
    // console.log(` ----- fileName: ${fileName}`);
    fs.writeFile(fileName, text, (err) => {
      if (err) {
        throw ('error creating todo file');
      } else {
        // console.log(` ----- text: ${text}`);
        callback(null, {id: id, text: text});
      }
    });
  });
};

// should return an empty array when there are no todos
// sould return an array with all saved todos

exports.readAll = (callback) => {
  //get list of ids created so far
  
  // get array off ids, somehow
  fs.readdir( exports.dataDir, undefined, (err, data) => {
    var idArray = [];
    data.forEach((idPath) => {
      // console.log(idPath);
      let todoID = idPath.slice(0, 5);
      idArray.push({id: todoID, text: todoID});
    });

    callback( err, idArray );
  });

  // readFile( fileNamePath, callback )

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, {id: id, text: id});
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
