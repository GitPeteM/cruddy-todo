const { log } = require('console');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

  fs.readdir( exports.dataDir, undefined, (err, data) => {
    var idArray = [];
    data.forEach((idPath) => {
      // console.log(idPath);
      let todoID = idPath.slice(0, 5);
      idArray.push({id: todoID, text: todoID});
    });

    callback( err, idArray );
  });
};

exports.readOne = (id, callback) => {
  // generate a filepath
  var todoPath = `${exports.dataDir}\\${id}.txt`;

  // use fs.readfile
  fs.readFile(todoPath, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text.toString();
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {

  var todoPath = `${exports.dataDir}\\${id}.txt`;

  if (fs.existsSync(todoPath)) {
    fs.writeFile(todoPath, text, (err) => {
      if (err) {
        throw new Error('error updating todo file');
      } else {
        // console.log(` ----- text: ${text}`);
        callback(null, {id: id, text: text});
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

exports.delete = (id, callback) => {

  var todoPath = `${exports.dataDir}\\${id}.txt`;

  try {
    fs.unlinkSync(todoPath);
  } catch (err) {
    callback(new Error('Bad file path'));
  }

  callback(null);
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
