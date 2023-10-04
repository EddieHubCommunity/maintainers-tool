import { GraphQLClient, gql } from "graphql-request"

export default async function Search({
  searchParams: {org, repo, user},
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
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
            url
          }
        }
      }
      search(query: $search, type: ISSUE, first: 100){
        nodes{
          ... on PullRequest{
            number
          }
        }
      }
    }
  `

  const data = await graphqlClient.request(query,
    {
      "login": user,
      "owner": org,
      "repo": repo,
      "search": searchString
    }  
  );

  return <div className="whitespace-pre">{JSON.stringify(data, null, 2)}</div>
}