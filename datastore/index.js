const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const express = require('express')

var items = express();

// Public API - Fix these CRUD functions ///////////////////////////////////////
// create
// 1) should create a new file for each todo
// 2) should use the generated unique id as the filename
// 3) should only save todo text contents in file
// 4) "before each" hook: cleanTestDatastore
// ✓ should pass a todo object to the callback on success
// readAll
// readOne
//   5) should pass a todo object to the callback on success
exports.create = (text, callback) => {
  var id = counter.getNextUniqueId();
  items.post(`/${id}`, function (req, res) {
    res.send(text)
  })
  // fs.writeFile(exports.dataDir/id, text, callback(null, { id, text }));

  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
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
