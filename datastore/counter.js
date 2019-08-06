const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));//reads counter and puts file data into number
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);//writes a counter putting the count into a string
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
// getNextUniqueId
//     1) should use error first callback pattern
//     2) should give an id as a zero padded string
//     3) should give the next id based on the count in the file
//     4) should update the counter file with the next value
exports.getNextUniqueId = (callback) => {
  //All todo entries are identified by an auto-incrementing id aka counter
  //have id? in string format
  //read file and puts data into number
  //increase count
  //use write counter on num to put into string
  readCounter((err, count) => {
    writeCounter(count + 1, (err, counterString) => {
      callback(null, counterString);
    })
  })
};
// readCounter((err, count) => {
//   if (err) {
//     throw ('error'); dont need these errors because read and write already have them
//   } else {
//     count++;
//     writeCounter(count, (err, counterString) => {
//       if (err) {
//         throw ('error');
//       } else {
//         callback(null, counterString);
//       }
//     })
//   }
// })
// };


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
