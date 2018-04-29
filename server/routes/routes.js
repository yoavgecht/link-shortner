  const express = require("express");
  const router = express.Router();
  const path = require("path");
  const controller = require('../apis/link-shortner-controller');


  router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
  });
    
  //called on page load to retrieve the user links history
  router.get('/api/get-saved-links-list', controller.getHistoryLinkslist);

  //called on 'shorten this link' button click
  router.post('/api/shorten', controller.saveUrl);

  //called on short link click
  router.get('/api/redirect/:encoded_id', controller.getUrl);

  //called on 'trash' icon click
  router.delete(`/api/delete-history-link/:encoded_id`, controller.deleteUrl)

 
module.exports = router;