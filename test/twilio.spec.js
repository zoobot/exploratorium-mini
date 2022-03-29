const util = require('util');
const { twilioConfig } = require('../config');
const has = Object.prototype.hasOwnProperty;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../index');
const should = chai.should();

describe('Twilio messaging', function() {
  describe('#setData()', function() {
    it('should return object with 4 keys', function(done) {
      const data = {key1:1,key2:2,key3:3,key4:4};
      if (Object.keys(data).length === 4) done();
    });
  });

  describe('#setData()', function() {
    it('should expose data', async function() {
      const data = { 
        to: 4152835202, 
        body: 'test body', 
        statusCallback: twilioConfig.statusCallback, 
        messagingServiceSid: twilioConfig.messagingServiceSid 
      };
      data.should.have.property('to', 4152835202);
      data.should.have.property('body', 'test body');
      data.should.have.property('statusCallback', `https://644b3760f30cc1e9d0e7c642e914ea32.balena-devices.com/smsstatus/gibberishy98234jkasjdnflkjaQTYU`);
      data.should.have.property('phoneNumberSid', 'PN05e35cc3faebbe89b9118bfe10dfcb1d');
    });
  });

  describe('processTwilio', function() {
    it('should have a timeout', async function() {
     const a = new Date();
     await util.promisify(setTimeout)(1000);
     const b = new Date();
     const differenceTime = (b - a) / 1000;
     if (differenceTime >= 1 && differenceTime > 2) done();
    });
  });
});