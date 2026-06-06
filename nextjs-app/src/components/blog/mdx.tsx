import Link from 'next/link';
import { EmbeddedTweet, TweetNotFound } from 'react-tweet';
import { getTweet } from 'react-tweet/api';
import type { ComponentProps } from 'react';

// react-tweet's entity enrichment iterates entities.hashtags/urls/user_mentions/symbols
// unguarded, but the syndication API omits empty ones (e.g. a media-only tweet) — which
// throws "entities is not iterable" and crashes the page. Backfill any missing arrays.
// Applies to the tweet and any quoted tweet, since both get enriched.
type EntityBag = { entities?: Record<string, unknown>; quoted_tweet?: EntityBag };

function sanitizeTweetEntities(tweet: EntityBag): void {
  if (tweet.entities) {
    tweet.entities = {
      hashtags: [],
      urls: [],
      user_mentions: [],
      symbols: [],
      ...tweet.entities,
    };
  }
  if (tweet.quoted_tweet) {
    sanitizeTweetEntities(tweet.quoted_tweet);
  }
}

/** Embed an X / Twitter post by ID: <Tweet id="1234567890" /> — fetched + rendered server-side so the text is crawlable. */
async function MdxTweet({ id }: { id: string }) {
  let tweet;
  try {
    tweet = await getTweet(id);
  } catch {
    tweet = undefined;
  }

  if (!tweet) {
    return (
      <div className="my-6 flex justify-center" data-theme="dark">
        <TweetNotFound />
      </div>
    );
  }

  sanitizeTweetEntities(tweet as unknown as EntityBag);

  return (
    <div className="my-6 flex justify-center [&_.react-tweet-theme]:my-0" data-theme="dark">
      <EmbeddedTweet tweet={tweet} />
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
