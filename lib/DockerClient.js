'use strict';
const Image = require('./Image');
const url = require('url');
const _ = require('lodash');
const request = require('request');
const util = require('./util');
const through = require('through2');

class DockerClient {

  constructor(opts) {
    const defaultOpts = {
      protocol: 'http',
      hostname: '',
      port: ''
    };
    const options = _.assign({}, defaultOpts, opts);
    this.baseUrl = url.format(options);
    this.util = util;
    this._image = new Image(this);
    this.stdout = through();
    this.stderr = through();
  }

  get image() {
    return this._image
  }

  /*
  * @param pathName the pathname of the request ['images', 'json']
  * @param options queryString options 
  * */
  httpGet(pathName, opts) {
    const baseUrl = this.baseUrl;
    const defautOpts = {
      json: true
    };
    const options = _.assign({}, defautOpts, opts);
    const requestUrl = `${baseUrl}/${pathName.join('/')}`
    return new Promise(function(resolve, reject) {
      request.get({
        url: requestUrl,
        json: options.json
      }, function(err, response, body) {
        if(err) {
          return reject(err);
        }
        resolve(body);
      });
    }); 
  }
}

module.exports = DockerClient;
