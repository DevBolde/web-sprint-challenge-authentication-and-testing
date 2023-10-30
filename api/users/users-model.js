const db = require('../../data/dbConfig')


function add(user) {
    return db('users').insert(user, 'id');
  }
  
  function findByUsername(username) {
    return db('users').where({ username }).first();
  }
  
  module.exports = {
    add,
    findByUsername,
    
  };