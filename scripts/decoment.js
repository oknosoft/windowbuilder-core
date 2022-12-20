'use strict';

var through = require('through2');
var decomment = require('decomment');

// https://www.regextester.com/94246
function pre(text, options) {
  const tmp = text
    .replace(/(^|\s)\/\/.*$/gm, '')
    .replace(/^\s*\n/gm, ''); 
  return decomment(tmp, options);
}

function main(options, func) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        if (file.isStream()) {
            cb(new Error("Streaming not supported."));
        }
        file.contents = Buffer.from(func(file.contents.toString(), options));
        this.push(file);
        return cb();
    });
}

function gulpDecomment(options) {
    return main(options, pre);
}

gulpDecomment.text = function (options) {
    return main(options, decomment.text);
};

gulpDecomment.html = function (options) {
    return main(options, decomment.html);
};


module.exports = gulpDecomment;
