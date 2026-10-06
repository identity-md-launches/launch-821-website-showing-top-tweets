import { useEffect, useRef, useState } from 'react';
import { ArrowDownWideNarrow, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronRight, CircleHelp, Command, Compass, Crosshair, ExternalLink, Heart, MessageCircle, Radio, Repeat2, Search, Share2, Sparkles, Terminal, TrendingUp, Users, X, Zap } from 'lucide-react';
import { formatCount, topics, tweets, xSearchUrl, type Topic, type Tweet } from './data';

type View = 'explore' | 'saved';
const storageKey = 'imd-signal-bookmarks';

function readBookmarks(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && tweets.some(t => t.id === id)) : [];
  } catch { return []; }
}

function FrogMark() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 21C5 14 9 8 15 8c3 0 5 2 5 4 1-2 3-4 6-4 6 0 10 6 10 13 0 9-8 14-16 14S5 30 5 21Z" fill="currentColor"/><ellipse cx="14" cy="18" rx="5" ry="4" fill="#102017"/><ellipse cx="27" cy="18" rx="5" ry="4" fill="#102017"/><circle cx="15" cy="17" r="1.5" fill="#dceeca"/><circle cx="28" cy="17" r="1.5" fill="#dceeca"/><path d="M12 26q9 4 17-1" stroke="#102017" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>;
}

function TweetCard({ tweet, rank, saved, onSave, onShare }: { tweet: Tweet; rank: number; saved: boolean; onSave: () => void; onShare: () => void }) {
  return <article className={`tweet-card ${rank === 1 ? 'top-card' : ''}`} id={tweet.id} data-tweet-id={tweet.id}>
    <div className="card-topline"><span className="topic-label"><span className="topic-dot" />{tweet.topic}</span><span className="rank">{rank === 1 && <TrendingUp size={13} aria-hidden="true" />} #{String(rank).padStart(2, '0')}</span></div>
    <div className="author-row"><span className={`avatar ${tweet.avatar}`} aria-hidden="true">{tweet.initials}</span><div className="author-info"><a href={`https://x.com/${tweet.handle}`} target="_blank" rel="noreferrer" className="author-name">{tweet.name}<ArrowUpRight size={12} aria-hidden="true" /></a><span className="handle">@{tweet.handle}</span></div><span className="x-mark" aria-hidden="true">𝕏</span></div>
    <blockquote>{tweet.text}</blockquote>
    <p className="post-context">{tweet.context}</p>
    <div className="metrics" role="group" aria-label="Captured engagement counts">
      <span title="Captured likes"><Heart size={15} aria-hidden="true" /><span className="sr-only">Likes: </span>{formatCount(tweet.likes)}</span>
      <span title="Captured reposts"><Repeat2 size={16} aria-hidden="true" /><span className="sr-only">Reposts: </span>{formatCount(tweet.reposts)}</span>
      <span title="Captured replies"><MessageCircle size={15} aria-hidden="true" /><span className="sr-only">Replies: </span>{formatCount(tweet.replies)}</span>
      <span title="Captured views"><ArrowDownWideNarrow size={15} aria-hidden="true" /><span className="sr-only">Views: </span>{formatCount(tweet.views)}</span>
    </div>
    <div className="card-footer"><a className="source-link" href={tweet.source} target="_blank" rel="noreferrer">Read source <ArrowUpRight size={13} aria-hidden="true" /></a><div className="card-actions"><button type="button" className="icon-button" onClick={onShare} aria-label={`Share post by ${tweet.name}`} title="Copy post link"><Share2 size={16} aria-hidden="true" /></button><button type="button" className={`icon-button save-button ${saved ? 'is-saved' : ''}`} onClick={onSave} aria-pressed={saved} aria-label={`${saved ? 'Remove bookmark for' : 'Bookmark post by'} ${tweet.name}`} title={saved ? 'Remove bookmark' : 'Bookmark post'}><Bookmark size={17} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} /></button></div></div>
  </article>;
}

export default function App() {
  const [view, setView] = useState<View>(location.hash === '#bookmarks' ? 'saved' : 'explore');
  const [topic, setTopic] = useState<Topic>('All topics');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('likes');
  const [saved, setSaved] = useState<string[]>(readBookmarks);
  const [notice, setNotice] = useState('');
  const [shareTweet, setShareTweet] = useState<Tweet | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onHashChange = () => {
      if (location.hash === '#bookmarks') setView('saved');
      else if (location.hash === '#explore' || tweets.some(t => location.hash === `#${t.id}`)) setView('explore');
    };
    const onShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('keydown', onShortcut);
    return () => { window.removeEventListener('hashchange', onHashChange); window.removeEventListener('keydown', onShortcut); };
  }, []);

  const filtered = tweets.filter(tweet => (view !== 'saved' || saved.includes(tweet.id)) && (topic === 'All topics' || topic === tweet.topic) && `${tweet.name} ${tweet.handle} ${tweet.text} ${tweet.context} ${tweet.topic}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === 'recent' ? a.ageHours - b.ageHours : sort === 'views' ? b.views - a.views : b.likes - a.likes);

  const navigate = (next: View) => { setView(next); setQuery(''); setTopic('All topics'); };
  const resetFilters = () => { setQuery(''); setTopic('All topics'); };
  const goToFeed = () => { feedRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' }); feedRef.current?.focus({ preventScroll: true }); };
  const chooseTopic = (next: Topic) => { setTopic(next); setQuery(''); setView('explore'); location.hash = 'explore'; goToFeed(); };
  const toggleSave = (tweet: Tweet) => {
    const next = saved.includes(tweet.id) ? saved.filter(id => id !== tweet.id) : [...saved, tweet.id];
    setSaved(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setNotice(next.includes(tweet.id) ? 'Post bookmarked. Find it in Bookmarks.' : 'Bookmark removed.'); }
    catch { setNotice('Bookmark updated for this visit. Browser storage is unavailable, so it won’t persist after reload.'); }
  };
  const share = async (tweet: Tweet) => {
    const url = new URL(location.href); url.hash = tweet.id;
    try { await navigator.clipboard.writeText(url.href); setNotice(`Link to ${tweet.name}’s post copied.`); }
    catch { setShareTweet(tweet); setNotice('Copy the post link below to share it.'); }
  };
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (tweets.some(t => t.id === hash)) document.getElementById(hash)?.scrollIntoView({ block: 'center' });
  }, []);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <aside className="sidebar">
      <a className="brand" href="#explore" onClick={() => navigate('explore')} aria-label="IMD Signal home"><span className="brand-icon"><FrogMark /></span><span>imd<span className="brand-dot">.</span><span className="brand-sub">signal</span></span></a>
      <div className="sidebar-section-label">Community radar</div>
      <nav aria-label="Primary"><a className={`nav-link ${view === 'explore' ? 'active' : ''}`} href="#explore" onClick={() => navigate('explore')} aria-current={view === 'explore' ? 'page' : undefined}><Compass size={19} aria-hidden="true" />Explore<ChevronRight size={14} className="nav-arrow" aria-hidden="true" /></a><a className={`nav-link ${view === 'saved' ? 'active' : ''}`} href="#bookmarks" onClick={() => navigate('saved')} aria-current={view === 'saved' ? 'page' : undefined}><Bookmark size={19} aria-hidden="true" />Bookmarks<span className="nav-count">{saved.length}</span></a><button className="nav-link" type="button" onClick={() => dialogRef.current?.showModal()}><CircleHelp size={19} aria-hidden="true" /><span className="nav-about-long">About the feed</span><span className="nav-about-short">About</span></button></nav>
      <div className="sidebar-bottom"><div className="swarm-badge"><span className="swarm-icon"><Zap size={19} aria-hidden="true" /></span><div>Powered by curiosity<span>Built for the swarm.</span></div></div><div className="sidebar-note">A little less scrolling.<br />A lot more signal.</div><a className="sidebar-x" href="https://x.com/search?q=%22identity.md%22&src=typed_query" target="_blank" rel="noreferrer">Find IMD on X <ArrowUpRight size={14} aria-hidden="true" /></a><span className="version">Independent community project · v1.0</span></div>
    </aside>

    <div className="page-shell">
      <header className="topbar"><div className="breadcrumb"><span>Community</span><ChevronRight size={13} aria-hidden="true" /><span>Signal room</span></div><div className="topbar-right"><span className="snapshot-badge"><span />Snapshot mode</span><a className="outline-button" href="https://x.com/search?q=%22identity.md%22&src=typed_query" target="_blank" rel="noreferrer">Explore on 𝕏 <ArrowUpRight size={15} aria-hidden="true" /></a></div></header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-heading"><img className="hero-art" src={`${import.meta.env.BASE_URL}pepe-ai.webp`} alt="Pepe operatives equipped with glowing AI technology at a command station" fetchPriority="high" width="1500" height="844" /><div className="hero-shade" /><div className="hero-content"><span className="eyebrow"><Radio size={14} aria-hidden="true" />The IdentityMD conversation</span><h1 id="hero-heading">The signal.<br /><span>Without the noise.</span></h1><p>Big ideas. AI agents. A very online army of frogs.<br className="desktop-break" /> The best of the identity.md conversation, in one place.</p><div className="hero-actions"><button className="primary-button" type="button" onClick={goToFeed}>Explore the feed <ArrowRight size={16} aria-hidden="true" /></button><button className="text-button" type="button" onClick={() => dialogRef.current?.showModal()}>How this works <ArrowUpRight size={14} aria-hidden="true" /></button></div></div><span className="hero-caption"><Sparkles size={13} aria-hidden="true" />AI equipped. Community powered.</span></section>

        <div className="overview" role="group" aria-label="Feed summary"><div className="overview-item"><span className="overview-icon"><MessageCircle size={19} aria-hidden="true" /></span><div><span className="overview-value">06 <span>curated tweets</span></span><span className="overview-caption">Less noise, more perspective</span></div></div><div className="overview-item"><span className="overview-icon"><Users size={20} aria-hidden="true" /></span><div><span className="overview-value">06 <span>community voices</span></span><span className="overview-caption">Builders, thinkers & the swarm</span></div></div><div className="overview-item"><span className="overview-icon"><Crosshair size={20} aria-hidden="true" /></span><div><span className="overview-value">07 Oct <span>2026 snapshot</span></span><span className="overview-caption">Public-indexed posts · not live</span></div></div></div>

        <div className="content-layout"><section className="feed" id="feed" ref={feedRef} tabIndex={-1} aria-labelledby="feed-heading"><div className="feed-title"><div><div className="section-kicker"><span />Community intel</div><h2 id="feed-heading">{view === 'saved' ? 'Saved signals' : 'On the radar'}<span className="title-count">{view === 'saved' ? saved.length : tweets.length}</span></h2><p>{view === 'saved' ? 'The posts you want to come back to.' : 'Good tweets. Interesting ideas. All things IMD.'}</p></div><span className="feed-title-icon"><Radio size={22} aria-hidden="true" /></span></div>
          <div className="feed-controls"><div className="feed-tabs" role="group" aria-label="Feed view"><a href="#explore" className={view === 'explore' ? 'selected' : ''} aria-current={view === 'explore' ? 'page' : undefined} onClick={() => navigate('explore')}><TrendingUp size={15} aria-hidden="true" />All tweets</a><a href="#bookmarks" className={view === 'saved' ? 'selected' : ''} aria-current={view === 'saved' ? 'page' : undefined} onClick={() => navigate('saved')}><Bookmark size={15} aria-hidden="true" />Bookmarked {saved.length > 0 && <span>({saved.length})</span>}</a></div><label className="sort-label"><span className="sr-only">Sort tweets</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort tweets"><option value="likes">Top likes</option><option value="views">Most viewed</option><option value="recent">Most recent</option></select></label></div>
          <label className="search-label" htmlFor="search">Search the feed</label><div className="search-wrap"><Search size={18} aria-hidden="true" /><input ref={searchRef} id="search" type="search" name="search" placeholder="Search tweets, people, or topics…" autoComplete="off" value={query} onChange={e => setQuery(e.target.value)} /><kbd><Command size={10} aria-hidden="true" /> K</kbd>{query && <button type="button" className="search-clear" onClick={() => { setQuery(''); searchRef.current?.focus(); }} aria-label="Clear search"><X size={16} aria-hidden="true" /></button>}</div>
          <div className="topic-filters" role="group" aria-label="Filter by topic">{topics.map(item => <button type="button" key={item} className={`filter-chip ${topic === item ? 'selected' : ''}`} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item === 'All topics' && <span aria-hidden="true">✳</span>}{item}</button>)}</div>
          <div className="results-line"><span role="status">{filtered.length} {filtered.length === 1 ? 'tweet' : 'tweets'}{query.trim() && <> matching “{query.trim()}”</>}{topic !== 'All topics' && <> in {topic}</>}</span><span>Captured counts <CircleHelp size={12} aria-hidden="true" /></span></div>
          {filtered.length ? <div className="tweet-grid">{filtered.map(tweet => <TweetCard key={tweet.id} tweet={tweet} rank={tweets.findIndex(t => t.id === tweet.id) + 1} saved={saved.includes(tweet.id)} onSave={() => toggleSave(tweet)} onShare={() => { void share(tweet); }} />)}</div> : <div className="empty-state"><span className="empty-icon">{view === 'saved' && saved.length === 0 ? <Bookmark size={27} aria-hidden="true" /> : <Search size={27} aria-hidden="true" />}</span><h3>{view === 'saved' && saved.length === 0 ? 'Keep the good ones close.' : 'No signals found.'}</h3><p>{view === 'saved' && saved.length === 0 ? 'Bookmark a tweet to build your own collection. Saved posts stay in this browser.' : 'Try a different search or clear your filters to see more tweets.'}</p>{view === 'saved' && saved.length === 0 ? <a href="#explore" className="primary-button" onClick={() => navigate('explore')}>Explore tweets <ArrowRight size={16} aria-hidden="true" /></a> : <button type="button" className="primary-button" onClick={resetFilters}>Clear filters <X size={16} aria-hidden="true" /></button>}</div>}
          <div className="feed-end"><span className="end-mark"><FrogMark /></span><span>You’re all caught up.<br /><small>Stay curious. Keep building.</small></span></div>
        </section>

        <aside className="right-rail" aria-label="Explore the community"><section className="rail-panel"><h2><TrendingUp size={17} aria-hidden="true" />In the conversation</h2><p className="rail-description">Find your corner of the swarm.</p><div className="topic-list">{topics.slice(1).map((item, index) => <button type="button" key={item} onClick={() => chooseTopic(item)} className={topic === item ? 'current' : ''}><span className="topic-number">0{index + 1}</span><span><strong>{item}</strong><small>{tweets.filter(t => t.topic === item).length} {tweets.filter(t => t.topic === item).length === 1 ? 'tweet' : 'tweets'} in this snapshot</small></span><ArrowUpRight size={15} aria-hidden="true" /></button>)}</div></section>
          <section className="rail-panel voices"><h2><Users size={17} aria-hidden="true" />Community voices</h2><p className="rail-description">A few people worth listening to.</p>{tweets.slice(0, 3).map(tweet => <button type="button" className="voice" key={tweet.id} onClick={() => { setQuery(tweet.handle); setTopic('All topics'); setView('explore'); location.hash = 'explore'; goToFeed(); }}><span className={`avatar small ${tweet.avatar}`} aria-hidden="true">{tweet.initials}</span><span><strong>{tweet.name}</strong><small>@{tweet.handle}</small></span><ChevronRight size={14} aria-hidden="true" /></button>)}<button type="button" className="rail-text-button" onClick={() => { navigate('explore'); location.hash = 'explore'; goToFeed(); }}>Explore all voices <ArrowRight size={14} aria-hidden="true" /></button></section>
          <section className="swarm-card"><div className="terminal-heading"><Terminal size={14} aria-hidden="true" /><span>swarm.exe</span><span className="terminal-dots">•••</span></div><div className="terminal-art" aria-hidden="true"><span className="scan-grid" /><FrogMark /><span className="terminal-spark s1">✧</span><span className="terminal-spark s2">+</span><span className="terminal-spark s3">✧</span></div><span className="terminal-line"><span>&gt; </span>equip intelligence_</span><h2>Frogs with a purpose.</h2><p>Human ideas. AI firepower.<br />One very capable swarm.</p><button type="button" className="swarm-link" onClick={() => dialogRef.current?.showModal()}>Meet the signal room <ArrowUpRight size={15} aria-hidden="true" /></button></section>
          <div className="rail-footnote"><Sparkles size={13} aria-hidden="true" /><p>Community-curated, not community-endorsed. A snapshot of the conversation, not a live ranking.</p></div>
        </aside></div>
        <footer className="page-footer"><span>© 2026 IMD Signal <span className="footer-dot">/</span> Made for the curious.</span><button type="button" onClick={() => dialogRef.current?.showModal()}>About this snapshot <ArrowUpRight size={13} aria-hidden="true" /></button></footer>
      </main>
    </div>

    <div className="notice" role="status">{notice && <><Check size={16} aria-hidden="true" /><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} aria-hidden="true" /></button></>}</div>
    {shareTweet && <div className="share-fallback"><label htmlFor="share-url">Copy this post link</label><input id="share-url" readOnly value={`${location.href.split('#')[0]}#${shareTweet.id}`} onFocus={e => e.target.select()} /><a href={xSearchUrl(shareTweet)} target="_blank" rel="noreferrer">Find the post on X <ExternalLink size={14} aria-hidden="true" /></a><button type="button" className="outline-button" onClick={() => setShareTweet(null)}>Close</button></div>}
    <dialog ref={dialogRef} aria-labelledby="about-title" className="about-dialog" onKeyDown={e => {
      if (e.key !== 'Tab') return;
      const controls = e.currentTarget.querySelectorAll<HTMLButtonElement>('button');
      const first = controls[0]; const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }}><div className="dialog-top"><span className="brand-icon"><FrogMark /></span><button type="button" className="icon-button" aria-label="Close about the feed" onClick={() => dialogRef.current?.close()}><X size={20} aria-hidden="true" /></button></div><span className="eyebrow">A little context</span><h2 id="about-title">Welcome to the signal room.</h2><p>IMD Signal is an independent community feed about identity.md. We’ve collected six short, attributed excerpts from public-indexed X posts, captured on <strong>7 October 2026</strong>.</p><div className="about-detail"><TrendingUp size={19} aria-hidden="true" /><div><h3>Ranked within this collection</h3><p>Default order uses captured likes. Counts come from public third-party indexes and haven’t been independently verified on X. “Most recent” uses the index’s relative post ages at capture. This is a static snapshot, not a complete or live ranking.</p></div></div><div className="about-detail"><Bookmark size={19} aria-hidden="true" /><div><h3>A feed you can make your own</h3><p>Search by person or phrase, filter a topic, and bookmark the good ones. Bookmarks are saved only in this browser. Sharing copies a link to the post on this site.</p></div></div><div className="about-detail"><ExternalLink size={19} aria-hidden="true" /><div><h3>Go straight to the context</h3><p>“Read source” opens the public index where the excerpt was found. Author links open X profiles. Author claims and opinions remain their own; inclusion isn’t an endorsement.</p></div></div><button type="button" className="primary-button dialog-done" onClick={() => dialogRef.current?.close()}>Explore the conversation <ArrowRight size={16} aria-hidden="true" /></button></dialog>
  </>;
}
