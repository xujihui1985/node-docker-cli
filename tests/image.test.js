'use strict';

const Client = require('../lib/DockerClient');
const expect = require('chai').expect;
const path = require('path');

describe('image', function() {
  
  describe('list images', function() {
    it('should get correct endpoint', function(done) {
      const client = new Client({
        protocol: 'http',
        hostname: '192.168.1.104',
        port: '2375'
      });
      client.image.listImages().then(function(result) {
        console.log(result);
        done(); 
      });
    });

  });

  describe('build images', function() {
    it('should build the images', function(done) {
      this.timeout(50000);
      const client = new Client({
        protocol: 'http',
        hostname: '192.168.1.104',
        port: '2375'
      });
      client.stdout.pipe(process.stdout);
      client.image.build(path.join(__dirname, './fixture/buildImage'), function(err, res) {
        console.log(res);
        console.log(err);
        done();
      });
    });

  });

  describe('create image from image', function() {
    it('should create image from base image', function(done) {
      this.timeout(50000);
      const client = new Client({
        protocol: 'http',
        hostname: '192.168.1.104',
        port: '2375'
      });
      client.stdout.pipe(process.stdout);
      client.image.create({
        fromImage: 'hello',
        repo: 'hello2',
        tag: 'v0.1.0'
      }, function(err, res) {
        console.log(res);
        console.log(err);
        done();
      });
    });

  });

  describe.only('inspect image', function() {
    it('should get image details', function(done) {
      const client = new Client({
        protocol: 'http',
        hostname: '192.168.1.104',
        port: '2375'
      });
      client.image.inspect('76296032fdbf').then(function(result) {
        console.log(result);
        done();
      });
    });
  });
});
