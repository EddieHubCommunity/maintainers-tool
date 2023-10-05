type PrProps = {
  number: number,
  state: string,
  title: string,
  url: string
}

export default function PrLink({number, state, title, url}: PrProps) {
  let color = 'text-green-800 dark:text-green-500';

  switch (state) {
    case 'CLOSED':
      color = 'text-red-700 dark:text-red-500'
      break;
    case 'MERGED':
      color = 'text-violet-700 dark:text-violet-400'
      break;
  }

  return <a href={url} className={`${color} text-center`} rel="noreferrer noopener" target="_blank">
    {`${number} ${state} - ${title}`}
  </a>
}