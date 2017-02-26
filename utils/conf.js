var conf = {
   host : 'https://localhost',
   service : {
      login : '/user/login', 
      loadHomePageCommunities : '/community/loadIndexPageCommunities',
      createCommunity : '/community/createNewCommunity',
      findCommunityByName : '/community/findCommunitiesByName',
      toggleStarCommunity : '/user/toggleStarCommunity',
      createNewTopic : '/topic/createNewTopic',
      findTopicsByCommunityId : '/topic/findTopicsByCommunityId' 
   }
};

module.exports = conf;