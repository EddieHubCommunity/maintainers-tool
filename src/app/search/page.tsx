import { GraphQLClient, gql } from "graphql-request"
import IssueLink from "@/components/IssueLink"
import PrLink from "@/components/PrLink"

type QueryType = {
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

  const data: QueryType = await graphqlClient.request(query,
    {
      "login": user,
      "owner": org,
      "repo": repo,
      "search": searchString
    }  
  );

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-center text-2xl pb-8">{user}</h1>
      <h2 className="text-center text-xl py-4">Assigned Open Issues</h2>
      <section className="flex flex-col">
        {data.repository.issues.nodes.length > 0 ?
          data.repository.issues.nodes.map(node => (
            <IssueLink key={node.number} number={node.number} title={node.title} url={node.url}/>
          )) :
          null
        }
      </section>
      <h2 className="text-center text-xl py-4">Previous Pull Requests</h2>
      <section className="flex flex-col">
        {data.search.nodes.length > 0 ?
          data.search.nodes.map(node => (
            <PrLink key={node.number} number={node.number} state={node.state} title={node.title} url={node.url}/>
          )) :
          null
        }
      </section>
    </main>
  )
}