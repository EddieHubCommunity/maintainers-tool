type IssueProps = {
  number: number,
  title: string,
  url: string
}

export default function IssueLink({number, title, url}: IssueProps) {
  return <a href={url} className="text-center" target="_blank" rel="noreferrer noopener">
    {`${number} - ${title}`}
  </a>
}