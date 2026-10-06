export const topics = ['All topics', 'AI agents', 'Builders', 'Ecosystem', 'Community'] as const;
export type Topic = typeof topics[number];
export type Tweet = {
  id: string; name: string; handle: string; initials: string; avatar: string;
  text: string; context: string; topic: Topic; likes: number; replies: number;
  reposts: number; views: number; ageHours: number; source: string;
};
// Public-indexed excerpts captured 2026-10-07. Counts are a static third-party
// snapshot, not independently verified X analytics. See artifacts/sources.md.
export const tweets: Tweet[] = [
  {
    id: 'ansem-imd', name: 'Ansem', handle: 'blknoiz06', initials: 'A', avatar: 'sand',
    text: 'ai16z walked so virtual could run so $imd could fly',
    context: 'A short take on where IMD fits in the AI agent conversation.',
    topic: 'Ecosystem', likes: 562, replies: 74, reposts: 60, views: 87000, ageHours: 4,
    source: 'https://www.sotwe.com/imdradar',
  },
  {
    id: 'adam-builders', name: 'Adam', handle: 'surfcoderepeat', initials: 'ad', avatar: 'blue',
    text: 'I will support things building on top of IMD and participate in the ecosystem as I am a degen…',
    context: 'The builder behind IMD on participating in its growing ecosystem. An excerpt; read the source for the full context.',
    topic: 'Builders', likes: 203, replies: 20, reposts: 14, views: 18000, ageHours: 48,
    source: 'https://www.sotwe.com/surfcoderepeat',
  },
  {
    id: 'simd-community', name: 'Superintelligent Identity.md', handle: 'SuperIMD_eth', initials: 'S', avatar: 'green',
    text: 'The community deserves this and much more your jobs will be free, we got you, $IMD holders',
    context: 'A community project exploring ways to fund work done by the swarm. This is the author’s claim.',
    topic: 'Community', likes: 76, replies: 19, reposts: 12, views: 8000, ageHours: 24,
    source: 'https://www.sotwe.com/SuperIMD_eth',
  },
  {
    id: 'radar-builds', name: 'IMD Radar', handle: 'imdradar', initials: 'R', avatar: 'mint',
    text: 'One place to see everything built on identity.md: tokens, projects, live swarm jobs…',
    context: 'An independent community dashboard bringing the ecosystem into view.',
    topic: 'Builders', likes: 73, replies: 7, reposts: 10, views: 5000, ageHours: 15,
    source: 'https://www.sotwe.com/imdradar',
  },
  {
    id: 'keeper-agents', name: 'KeeperCF', handle: 'Keeperssd', initials: 'K', avatar: 'purple',
    text: 'Both are building around the same idea: AI agents that do work, coordinate and earn.',
    context: 'From a comparison of IMD and Virtuals: different approaches to putting agents to work.',
    topic: 'AI agents', likes: 60, replies: 8, reposts: 10, views: 3000, ageHours: 11,
    source: 'https://www.sotwe.com/aiperformancez',
  },
  {
    id: 'damian-agents', name: 'Damián Et', handle: 'damian_et', initials: 'D', avatar: 'olive',
    text: 'have you seen what identity MD is doing with ai agents on ETH?',
    context: 'A conversation about a globally distributed workforce using different AI models.',
    topic: 'AI agents', likes: 28, replies: 1, reposts: 7, views: 660, ageHours: 7,
    source: 'https://www.sotwe.com/damian_et',
  },
];
export const xSearchUrl = (tweet: Tweet) => `https://x.com/search?q=${encodeURIComponent(`from:${tweet.handle} "${tweet.text.replace(/…$/, '').split(' ').slice(0, 8).join(' ')}"`)}&src=typed_query`;
export const formatCount = (value: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
