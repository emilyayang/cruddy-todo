const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const express = require('express')

var items = express();

// Public API - Fix these CRUD functions ///////////////////////////////////////
// create
// 1) should create a new file for each todo
// 2) should use the generated unique id as the id
// 3) should only save todo text contents in file
// 4) "before each" hook: cleanTestDatastore
// ✓ should pass a todo object to the callback on success
// readAll
// readOne
//   5) should pass a todo object to the callback on success
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err, 0);
    } else {
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(filePath, text, (err => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      }))
    }
  })
};

exports.readAll = (callback) => {
  // Find out what todos are (we think ->00001 & 00002)
  // Return an empty array if there are no items in testData
  // Return an array with the names of all the todos ([00001,00002, etc])
  var todos = [];
  fs.readdir(exports.dataDir, (err, ids) => {
    if (err) {
      callback(err, 0);
    } else {
      _.map(ids, (id) => {
        console.log(ids)
        console.log(id)
        exports.readOne(id.slice(2), (err, todos) => {
          console.log(id)
          if (err) {
            callback(err, 0);
          } else {
            callback(null, todos)
          }
        })
      })
    }
  })
  // var filePath = path.join(exports.dataDir, `${id}.txt`);
  // fs.readFile(filePath, 'utf8', (err, text) => {
  //   if (err) {
  //     callback(err, 0);
  //   } else {
  //     callback(null, { id, text });
  //   }
  // })



  // ids.forEach(id => {
  //   console.log(id);
  // }
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  //[{ id, text },{ id, text },{ id, text }]
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(err, 0);
    } else {
      callback(null, { id, text });
    }
  })
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`)
  // if (!filePath) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  exports.readOne(id, (err) => {
    if (err) {
      callback(err, 0);
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err, 0);
        } else {
          callback(null, { id, text });
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err, 0)
    } else {
      callback(null, 0);
    }
  })
}

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
