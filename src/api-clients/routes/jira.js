const routes = {
  get: key => ({
    method: 'GET',
    url: `/rest/api/latest/issue/${key}`,
  }),
  find: payload => ({
    method: 'POST',
    url: `/rest/graphql/1/`,
    data: payload,
  }),
  getDevDetails: issueId => ({
    method: 'POST',
    url: '/jsw/graphql?operation=DevDetailsDialog',
    data: {
      operationName: 'DevDetailsDialog',
      query: `query DevDetailsDialog ($issueId: ID!) { 
            developmentInformation(issueId: $issueId){
            details {
              instanceTypes {
                id
                name
                type
                typeName
                isSingleInstance
                baseUrl
                devStatusErrorMessages
                repository {
                  name
                  avatarUrl
                  description
                  url
                  parent {
                    name
                    url
                  }
                  branches {
                    name
                    url
                    createReviewUrl
                    createPullRequestUrl
                    lastCommit {
                      url
                      displayId
                      timestamp
                    }
                    pullRequests {
                      name
                      url
                      status
                      lastUpdate
                    }
                    reviews {
                      state
                      url
                      id
                    }
                  }
                  pullRequests {
                    id
                    url
                    name
                    branchName
                    branchUrl
                    lastUpdate
                    status
                    author {
                      name
                      avatarUrl
                    }
                    reviewers {
                      name
                      avatarUrl
                      isApproved
                    }
                  }
                }
                danglingPullRequests {
                  id
                  url
                  name
                  branchName
                  branchUrl
                  lastUpdate
                  status
                  author {
                    name
                    avatarUrl
                  }
                  reviewers {
                    name
                    avatarUrl
                    isApproved
                  }
                }
              }
            }
          }
        }`,
      variables: { issueId },
    },
  }),
};

module.exports = {
  routes,
};
