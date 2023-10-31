const db = require('../../data/dbConfig')


function add(user) {
    return db('users')
        .insert(user)
        .then(ids => {
            return db('users')
                .where({ id: ids[0] })
                .first();
        });
}
  
  function findByUsername(username) {
    return db('users').where({ username }).first();
  }
  
  module.exports = {
    add,
    findByUsername,
    
  };