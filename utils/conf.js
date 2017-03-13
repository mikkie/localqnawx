var conf = {
   host : 'https://www.yamixed.com',
   service : {
      login : '/user/login', 
      loadHomePageCommunities : '/community/loadIndexPageCommunities',
      createCommunity : '/community/createNewCommunity',
      findCommunityByName : '/community/findCommunitiesByName',
      toggleStarCommunity : '/user/toggleStarCommunity',
      toggleStarTopic : '/user/toggleStarTopics',
      createNewTopic : '/topic/createNewTopic',
      findTopicsByCommunityId : '/topic/findTopicsByCommunityId',
      findCommentsByTopicId : '/comment/findCommentsByTopicId',
      createNewComment : '/comment/createNewComment',
      getTopicById : '/topic/getTopicById',
      upOrDownComment : '/comment/upOrDownComment',
      findTopicsByOwner : '/topic/findTopicsByOwner',
      findUserRepliesTopics : '/user/findUserRepliesTopics',
      findAtmeTopics : '/user/findAtmeTopics',
      findStarCommunitiesByOwner : '/user/findStarCommunitiesByOwner',
      findStarTopicsByOwner : '/user/findStarTopicsByOwner',
      updateSettings : '/user/updateSettings',
      getGlobalSettings : '/globalSetting/getGlobalSettings',
      deleteTopic : '/topic/deleteTopic',
      deleteComment : '/comment/deleteComment',
      tagTopicReaded : '/topic/tagTopicReaded'
   }
};

module.exports = conf;