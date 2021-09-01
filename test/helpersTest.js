const assert = require('chai').assert;

const getUserByEmail = require('../helpers');

const testUsers = {
  "123" : {
    id: "123",
    email: "jamesmay@grandtour.com",
    password: "captain-slow"
  },
  "456" : {
    id: "456",
    email: "hammond@grandtour.com",
    password: "hamster123"
  }
};

describe('getUserByEmail', () => {
  
  it('Should return the user when the email address exists in the database', () => {
    const user = getUserByEmail("hammond@grandtour.com", testUsers);
    assert.equal(user, testUsers[456]);
    
  });
  it('Should return undefined when the email address does not exist in the database', () => {
    const user = getUserByEmail("clarkson@grandtour.com", testUsers);
    assert.equal(user, undefined);
  })
});