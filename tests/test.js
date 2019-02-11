'use strict';

const supertest = require('supertest'); 
const test = require('unit.js');
const app = require('../server.js');

const request = supertest(app);

describe('Tests app', function() {
  it('verifies get', function(done) {
    request.get('/').expect(200).end(function(err, result) {
      test.string(result.text).contains('Congratulations');
      test.value(result).hasHeader('content-type', 'text/html; charset=UTF-8');
      done(err);
    });
  });
  it('verifies coupon endpoint', function (done) {
    request.get('/api/coupons').expect(200).end(function(err, result) {
      test.value(result).isNotEmpty();
      done(err);
    });
  });
    it('verifies product endpoint', function (done) {
        request.get('/api/products').expect(200).end(function(err, result) {
            test.value(result).isNotEmpty();
            done(err);
        });
    });
    it('verifies summary population', function (done) {
        request.get('/summary').expect(200).end(function(err, result) {
            test.string(result.text).contains("<li>");
            done(err);
        });
    });
    it('verifies documentation', function(done) {
        request.get('/docs/').expect(200).end(function(err, result){
            console.log(result.text);
            test.string(result.text).contains("<title>Swagger UI</title>");
            done(err);
        });
    });
    it('verifies signup', function(done) {
        request.get('/docs/').expect(200).end(function(err, result){
            console.log(result.text);
            test.string(result.text).contains("<title>Swagger UI</title>");
            done(err);
        });
    });
});

