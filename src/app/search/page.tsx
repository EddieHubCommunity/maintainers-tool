import { z } from "zod"
import { queryGithub, QueryGithubType } from "@/util/queryGithub"
import IssueLink from "@/components/IssueLink"
import PrLink from "@/components/PrLink"

export default async function Search({
  searchParams: {org, repo, user},
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const zodErr = [];
  let data: QueryGithubType;

  const Login = z.string().regex(/^[A-Za-z0-9_.-]+$/).safeParse(user)
  if (!Login.success) {
    zodErr.push(`Username invalid: ${user}`)
  }

  const Repo = z.string().regex(/^[A-Za-z0-9_.-]+$/).safeParse(repo)
  if (!Repo.success) {
    zodErr.push(`Repo Name invalid: ${repo}`)
  }
  
  const Owner = z.string().regex(/^[A-Za-z0-9_.-]+$/).safeParse(org)
  if (!Owner.success) {
    zodErr.push(`Repo Owner invalid: ${org}`)
  }

  if (!Repo.success || !Login.success || !Owner.success) {
    return (
      <div>
        {zodErr.map((err, index) => <div key={index}>{err}</div> )}
      </div>
    )
  }
  
  try {
    data = await queryGithub({
      user: Login.data,
      org: Owner.data,
      repo: Repo.data
    });
  } catch (err) {
    if (typeof err === "string") {
      return <div>{err.includes('{') ? err.split('{')[0] : err}</div>
    }
    else if (err instanceof Error) {
      return <div>{err.message.includes('{') ? err.message.split('{')[0] : err.message}</div>  
    }

    return <div>An error occurred fetching data.</div>
  }

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