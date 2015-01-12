var http = require('http')
var url = require('url')
var path = require('path')
var express = require('express')
var fs = require('fs')
var exec = require('child_process').exec
var gm = require('gm')
var async = require('async')

var targetPath = process.argv.slice(2)

var extensions = ['.jpg', '.JPG', '.jpeg', '.CR2', '.CRW', '.NEF']
var raw = ['.CR2', '.CRW', '.NEF']




var fs = require('fs');
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};



walk(process.cwd(), function(err, results) {
  if (err)
    throw err;
    var results = results.filter(function(element) {
      return element.match(/\.jp(eg|g)?/ig)
    });
    return results
  })

async.each(, function(element, callback) {
  var resizedName = element.substr(0, element.lastIndexOf(".") - 1) + "-RESIZED" + path.extname(element);

  var readStream = fs.createReadStream(element);
  gm(readStream, resizedName)
  .resize('200')
  .stream(function(err, stdout, stderr) {
    var writeStream = fs.createWriteStream(resizedName);
    stdout.pipe(writeStream);
  });
  callback();
}, function(err) {
  if (err) {
    console.log('A file failed to process');
  } else {
    console.log('All files have been processed successfully');
  }
});
