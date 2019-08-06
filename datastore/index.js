const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const express = require('express')

// var items = express();

// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    }))
  })
};

//PROMISE.ALL checks all unresolved promises and resolves them and replaces the position of the promises in an array to keep order

exports.readAll = (callback) => {
  // Find out what todos are (we think ->00001 & 00002)
  // Return an empty array if there are no items in testData
  // Return an array with the names of all the todos ([00001,00002, etc])
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      if (files.length === 0) return callback(null, []);//if empty array

      var data = [];
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var id = file.slice(0, file.length - 4) //slice '.txt' off
        exports.readOne(id, (err, object) => {
          if (err) {
            callback(err);
          } else {
            data.push(object);
          }
          //when theres 5 items in the array
          if (data.length === files.length) {
            callback(null, data);
          }
        })
      }
    }
  })
}

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
