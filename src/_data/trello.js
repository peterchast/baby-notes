const fetch = require('node-fetch');

require('dotenv').config();


  module.exports = () => {

    const TRELLO_LIST_ID = process.env.TRELLO_LIST_ID;
    const TRELLO_BOARD_ID = process.env.TRELLO_BOARD_ID;
    const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
    const TRELLO_KEY = process.env.TRELLO_KEY;

    let url = 'https://api.trello.com/1/boards/' + TRELLO_BOARD_ID + '/cards?fields=due,desc,idList&attachments=true&attachment_fields=url&key=' + TRELLO_KEY + '&token=' + TRELLO_TOKEN;
  
    return fetch(url)
      .then(data => data.json())
      .then(json => {
  
        // Just focus on the cards which are in the list we want
        // and do not have a closed status
        let contentCards = json.filter(card => {
          return card.idList == TRELLO_LIST_ID && !card.closed;
        });
  
        // only include cards labelled with "live" or with
        // the name of the branch we are in
        let contextCards = contentCards;
      
  
        // If a card has an attachment, add it as an image in the descriotion markdown
        /*
        contextCards.forEach(card => {
          if(card.attachments.length) {
            card.name = "";
            card.desc = card.desc + `\n![${card.name}](${card.attachments[0].url} '${card.name}')`;
          }
        })
        */
  
        // return our data
        return contextCards;
    });
  };