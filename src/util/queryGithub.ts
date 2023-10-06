import { GraphQLClient, gql } from "graphql-request"

type QueryInputs = {
  org: string,
  repo: string,
  user: string
}

export type QueryGithubType = {
  repository: {
    issues: {
      nodes: {
        number: number,
        title: string,
        url: string
      }[]
    }
  },
  search: {
    nodes: {
      number: number,
      state: string,
      title: string,
      url: string
    }[]
  }
}

export async function queryGithub({org, repo, user}: QueryInputs) : Promise<QueryGithubType>{
  const endpoint = 'https://api.github.com/graphql';
  const authToken = process.env.GITHUB_PAT

  const graphqlClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `bearer ${authToken}` 
    }
  });

  const searchString = `is:pr repo:${org}/${repo} author:${user}`

  const query = gql`
    query helpMaintainer($login: String!, $owner: String!, $repo: String!, $search: String!) {
      repository(owner: $owner, name: $repo) {
        issues(filterBy: {assignee: $login}, states: [OPEN], first: 5) {
          nodes {
            number
            title
            url
          }
        }
      }
      search(query: $search, type: ISSUE, first: 20){
        nodes{
          ... on PullRequest{
            number
            state
            title
            url
          }
        }
      }
    }
  `

  return graphqlClient.request(query,
    {
      "login": user,
      "owner": org,
      "repo": repo,
      "search": searchString
    }  
  );

}