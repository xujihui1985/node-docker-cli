'use strict';

const fs = require('fs');
const assert = require('assert');
const path = require('path');
const tar = require('tar-fs');
const request = require('request');
const _ = require('lodash');

class Image {

  constructor(client) {
    this.client = client;
    this.basePath = 'images';
  }

  getRequestUrl(endPoint) {
    return this.client.util.composeUrl(this.basePath)(endPoint);
  }

  listImages(options) {
    return this.client.httpGet(this.getRequestUrl(['json']), options);
  }

  inspect(imageName) {
    return this.client.httpGet(this.getRequestUrl([imageName, 'json']));
  }

  build(sourceLocation, callback) {
    assert(sourceLocation, 'can not find source location');
    if(!fs.existsSync(sourceLocation)) {
      throw new Error('source location does not exists');
    }
    if(!fs.existsSync(path.join(sourceLocation, 'Dockerfile'))) {
      throw new Error(`can not fild Dockerfile in location ${sourceLocation}`);
    }
    const req = request.post({
      url: 'http://192.168.1.104:2375/build',
      qs: {
        t: 'hello', //string
        q: true, //bool
        nocache: false, //bool
        rm: true, //Remove intermediate containers after a successful build 
        forcerm: true, //Always remove intermediate containers (includes rm)
        memory: '20000'
      }
    });
    let self = this;

    //Emitted after a socket is assigned to this request.
    //set timeout of the request 
    req.on('socket', function(socket) {
      socket.setTimeout(5000);
      socket.on('timeout', function() {
        req.abort();
        callback(new Error('timeout'));
      });
    });
    req.on('response', function(res) {
      res.pipe(self.client.stdout, {end: false});
      res.on('end', function() {
    //    self.client.stdout.end();
        callback(null, {success: true});
      })
    });
    req.on('error', callback);
    tar.pack(sourceLocation).pipe(req);
  }

  create(opts, callback) {
    const defaultOpts = {
      fromImage: '',  //Name of the image to pull.
      repo: '',
      tag: '',
      registry: ''
    }
    const options = _.assign({}, defaultOpts, opts);
    var req = request.post({
      url: 'http://192.168.1.104:2375/images/create',
      qs: options
    });
    const self = this;
    req.on('socket', function(socket) {
      socket.setTimeout(5000);
      socket.on('timeout', function() {
        req.abort();
        callback(new Error('timeout'));
      });
    });
    req.on('response', function(res) {
      res.pipe(self.client.stdout, {end: false});
      res.on('end', function(err, response) {
        console.log(err);
        callback(null, {success: true});
      })
    });
    req.on('error', callback);
  }
}

module.exports = Image;
