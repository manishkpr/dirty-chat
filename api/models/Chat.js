/**
* Chat.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    index : 'string',
    name: 'string',
    messages: {
        collection: 'message',
        via: 'chat'
    },

    users: {
        collection: 'user',
        via: 'chats'
    }
  }
};
