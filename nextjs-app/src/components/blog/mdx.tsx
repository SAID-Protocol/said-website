import Link from 'next/link';
import { Tweet } from 'react-tweet';
import type { ComponentProps } from 'react';

/** Embed an X / Twitter post by ID: <Tweet id="1234567890" /> — rendered server-side so the text is crawlable. */
function MdxTweet({ id }: { id: string }) {
  return (
    <div className="my-6 flex justify-center [&_.react-tweet-theme]:my-0" data-theme="dark">
      <Tweet id={id} />
    </div>
  );
}

function MdxLink({ href = '', ...props }: ComponentProps<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  if (isInternal) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noreferrer" {...props} />;
}

export const mdxComponents = {
  a: MdxLink,
  Tweet: MdxTweet,
};
