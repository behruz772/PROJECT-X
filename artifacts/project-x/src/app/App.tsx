import { useState, useRef, useEffect } from "react";
import {
  Home, Compass, Plus, Users, MessageCircle, Sparkles, User, Bell,
  Settings, Moon, Sun, Search, ArrowRight, Share2, MoreHorizontal,
  Camera, Video, FileText, Wand2, Globe, Trophy, Languages, Shield,
  Calendar, Award, Zap, X, Check, Image, Send, Edit3, Lock, Eye,
  EyeOff, ChevronLeft, ChevronRight, Upload, Hash, Star,
  TrendingUp, Bookmark, RefreshCw, Flame, Layers, Heart,
  BarChart2, Play, MapPin, Target, Mic, AlignLeft, Phone, Filter, AudioLines
} from "lucide-react";
import {
  ActivityPage, AccountPage, AudioDetailPage, CollectionsPage, DraftsPage, ForgotPasswordPage,
  GlobalSearchPage, LoginPage, MusicLibraryPage, NotesPage, NotificationDetailPage, RecoveryPage,
  ReelCreatePage, SafetyPage, SavedPage, StoriesPage, StoryCreatePage, Track, TRACKS
} from "./FeaturePages";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen =
  | "landing" | "signup" | "interests" | "ai-onboarding"
  | "home" | "discover" | "create" | "ai-creator"
  | "profile" | "creator-level" | "communities" | "community-detail"
  | "messages" | "chat" | "my-ai" | "passport" | "events"
  | "notifications" | "settings" | "rankings" | "stories" | "story-create"
  | "music" | "audio-detail" | "reel-create" | "saved" | "collections"
  | "notes" | "search" | "account" | "login" | "forgot-password" | "recovery"
  | "drafts" | "activity" | "safety" | "notification-detail";

interface Community { id: number; name: string; members: number; desc: string; icon: string; category: string; channels: string[]; }
interface Conversation { id: number; name: string; username: string; avatar: string; type: string; lastMsg: string; time: string; unread: number; autoTranslate: boolean; messages: { id: number; sender: string; original: string; translated: string | null; lang: string; time: string; }[]; }

// ─── Data ────────────────────────────────────────────────────────────────────

const INTERESTS = ["AI", "Technology", "Gaming", "Business", "Art", "Music", "Education", "Sports", "Travel", "Film", "Programming", "Startups"];

const POSTS = [
  { id: 1, user: { name: "Alex Kim", username: "alexkim", level: 52, avatar: "AK" }, type: "video", content: "Just dropped my new cinematic travel video shot entirely in Tokyo. The AI color grading really brought the neon lights to life. 🎥", tags: ["travel", "cinematics", "ai"], helpful: 342, inspired: 891, collaborated: 12, learned: 156, time: "2h ago", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=320&fit=crop&auto=format" },
  { id: 2, user: { name: "Zara Chen", username: "zarachen", level: 38, avatar: "ZC" }, type: "creation", content: "My latest generative art series using diffusion models + hand-painted textures. Each piece took 3 days of iteration.", tags: ["art", "ai", "design"], helpful: 218, inspired: 1203, collaborated: 7, learned: 89, time: "5h ago", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=320&fit=crop&auto=format" },
  { id: 3, user: { name: "Marcus Rodriguez", username: "marcusr", level: 67, avatar: "MR" }, type: "text", content: "6 months in: our startup went from 0 to 12K users with $0 marketing. Here's everything I learned about building in public and why community is your best growth engine.", tags: ["startup", "growth", "business"], helpful: 1847, inspired: 432, collaborated: 29, learned: 678, time: "1d ago", image: null },
  { id: 4, user: { name: "Yuki Tanaka", username: "yukitanaka", level: 24, avatar: "YT" }, type: "photo", content: "Golden hour in Kyoto. Sometimes the best camera is the one you have with you.", tags: ["photography", "travel", "japan"], helpful: 89, inspired: 445, collaborated: 2, learned: 34, time: "3h ago", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=320&fit=crop&auto=format" },
];

const PEOPLE = [
  { id: 1, name: "Ali Hassan", username: "alihassan", role: "Python Developer", level: 72, projects: 17, collabs: 39, skills: ["Python", "AI", "Backend"], match: 94, avatar: "AH" },
  { id: 2, name: "Sofia Martini", username: "sofiamartini", role: "Product Designer", level: 58, projects: 23, collabs: 61, skills: ["Design", "UX", "Figma"], match: 87, avatar: "SM" },
  { id: 3, name: "James Okafor", username: "jamesokafor", role: "ML Engineer", level: 81, projects: 31, collabs: 88, skills: ["ML", "Python", "Research"], match: 79, avatar: "JO" },
  { id: 4, name: "Lena Müller", username: "lenamuller", role: "Content Creator", level: 44, projects: 9, collabs: 28, skills: ["Video", "Writing", "Social"], match: 72, avatar: "LM" },
];

const COMMUNITIES: Community[] = [
  { id: 1, name: "AI Builders", members: 12430, desc: "For builders creating with AI tools", icon: "🤖", category: "Technology", channels: ["general", "projects", "help", "showcase", "jobs"] },
  { id: 2, name: "Startup Founders", members: 8921, desc: "Share your journey, learn from others", icon: "🚀", category: "Business", channels: ["general", "funding", "hiring", "wins", "advice"] },
  { id: 3, name: "Photography Circle", members: 15200, desc: "Share your world through your lens", icon: "📸", category: "Art", channels: ["general", "critique", "gear", "showcase", "challenges"] },
  { id: 4, name: "Gaming Universe", members: 34100, desc: "All things gaming, dev, culture", icon: "🎮", category: "Gaming", channels: ["general", "game-dev", "reviews", "clips", "lfg"] },
  { id: 5, name: "Design Collective", members: 9800, desc: "Designers helping designers grow", icon: "✏️", category: "Design", channels: ["general", "feedback", "resources", "jobs", "inspiration"] },
];

const CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: "Sofia Martini", username: "sofiamartini", avatar: "SM", type: "friend",
    lastMsg: "Love the progress on your project!", time: "2m", unread: 2, autoTranslate: true,
    messages: [
      { id: 1, sender: "them", original: "Salom! Bugun project qanday ketmoqda?", translated: "Hey! How is the project going today?", lang: "uz", time: "10:30" },
      { id: 2, sender: "me", original: "It's going great!", translated: "Juda yaxshi ketyapti!", lang: "en", time: "10:32" },
      { id: 3, sender: "them", original: "Amazing! I saw your latest creation — really impressive 🔥", translated: null, lang: "en", time: "10:33" },
      { id: 4, sender: "them", original: "Love the progress on your project!", translated: null, lang: "en", time: "10:35" },
    ]
  },
  {
    id: 2, name: "AI Builders Community", username: "ai-builders", avatar: "🤖", type: "community",
    lastMsg: "New challenge posted: AI Video Week!", time: "1h", unread: 5, autoTranslate: false,
    messages: [
      { id: 1, sender: "other", original: "Who's joining the AI Video Challenge this week?", translated: null, lang: "en", time: "09:00" },
      { id: 2, sender: "other", original: "New challenge posted: AI Video Week! 🎥", translated: null, lang: "en", time: "09:45" },
    ]
  },
  {
    id: 3, name: "Ali Hassan", username: "alihassan", avatar: "AH", type: "collaborator",
    lastMsg: "I pushed the backend updates", time: "3h", unread: 0, autoTranslate: false,
    messages: [
      { id: 1, sender: "me", original: "Hey! Did you finish the API integration?", translated: null, lang: "en", time: "07:20" },
      { id: 2, sender: "them", original: "I pushed the backend updates", translated: null, lang: "en", time: "07:55" },
    ]
  },
];

const NOTIFS = [
  { id: 0, emoji: "🌍", text: "You moved up 327 positions this week! You're now ranked #8,888 globally.", time: "just now", unread: true },
  { id: 1, emoji: "🏆", text: "You reached Creator Level 25!", time: "1h ago", unread: true },
  { id: 2, emoji: "✨", text: "Your creation inspired 12 people.", time: "2h ago", unread: true },
  { id: 3, emoji: "🤝", text: "Ali Hassan invited you to collaborate on a project.", time: "5h ago", unread: true },
  { id: 4, emoji: "🌐", text: "Global AI Challenge starts tomorrow.", time: "1d ago", unread: false },
  { id: 5, emoji: "🤖", text: "Your AI identified 3 new collaboration opportunities.", time: "2d ago", unread: false },
  { id: 6, emoji: "💡", text: "Marcus Rodriguez found your post helpful.", time: "3d ago", unread: false },
];

// ─── Ranking Data ─────────────────────────────────────────────────────────────

const MY_RANK = {
  global: 8888, globalTotal: 12400000,
  countryCode: "🇺🇿", countryName: "Uzbekistan", countryRank: 143, countryTotal: 84200,
  weekChange: 327, bestWeek: 1284,
};

const CAT_RANKS = [
  { id: "ai", label: "AI", emoji: "🤖", rank: 312, total: 840000, change: 44 },
  { id: "video", label: "Video", emoji: "🎥", rank: 27, total: 312000, change: 8 },
  { id: "programming", label: "Programming", emoji: "💻", rank: 181, total: 920000, change: 22 },
  { id: "design", label: "Design", emoji: "🎨", rank: 445, total: 680000, change: -12 },
  { id: "startups", label: "Startups", emoji: "🚀", rank: 89, total: 420000, change: 31 },
  { id: "gaming", label: "Gaming", emoji: "🎮", rank: 1204, total: 1100000, change: -5 },
];

const FRIEND_RANKS = [
  { name: "Ali Hassan", avatar: "AH", rank: 4231, level: 72, change: 142, isYou: false },
  { name: "Begzod Karimov", avatar: "BK", rank: 8887, level: 68, change: 89, isYou: false },
  { name: "Alex Kim", avatar: "AK", rank: 8888, level: 74, change: 327, isYou: true },
  { name: "Aziz Rahimov", avatar: "AR", rank: 12421, level: 44, change: -23, isYou: false },
  { name: "Sofia Martini", avatar: "SM", rank: 18204, level: 58, change: 15, isYou: false },
];

const NEARBY_CREATORS = [
  { rank: 8885, name: "Hana Yamoto", avatar: "HY", level: 71, country: "🇯🇵", isFriend: false, isYou: false },
  { rank: 8886, name: "Carlos Vega", avatar: "CV", level: 69, country: "🇲🇽", isFriend: false, isYou: false },
  { rank: 8887, name: "Begzod Karimov", avatar: "BK", level: 68, country: "🇺🇿", isFriend: true, isYou: false },
  { rank: 8888, name: "Alex Kim", avatar: "AK", level: 74, country: "🇺🇿", isFriend: false, isYou: true },
  { rank: 8889, name: "Priya Singh", avatar: "PS", level: 73, country: "🇮🇳", isFriend: false, isYou: false },
  { rank: 8890, name: "Felix Braun", avatar: "FB", level: 70, country: "🇩🇪", isFriend: false, isYou: false },
  { rank: 8891, name: "Nour Khalil", avatar: "NK", level: 67, country: "🇪🇬", isFriend: false, isYou: false },
];

const RANK_TARGETS = [
  { action: "Create 2 high-quality projects", reward: "+180 positions", icon: "🎯", progress: 1, total: 2 },
  { action: "Help 10 creators", reward: "+95 positions", icon: "💡", progress: 6, total: 10 },
  { action: "Complete 1 collaboration", reward: "+120 positions", icon: "🤝", progress: 0, total: 1 },
  { action: "Receive 25 Helpful interactions", reward: "+60 positions", icon: "✨", progress: 17, total: 25 },
  { action: "Improve your Video skill score", reward: "+45 positions", icon: "🎬", progress: 64, total: 100 },
];

// ─── Utility Components ───────────────────────────────────────────────────────

const Logo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="2" y="2" width="10" height="10" rx="2.5" fill="var(--primary)" />
    <rect x="16" y="2" width="10" height="10" rx="2.5" fill="var(--primary)" opacity="0.4" />
    <rect x="2" y="16" width="10" height="10" rx="2.5" fill="var(--primary)" opacity="0.4" />
    <rect x="16" y="16" width="10" height="10" rx="2.5" fill="var(--primary)" />
  </svg>
);

const Av = ({ text, size = "md", emoji = false }: { text: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; emoji?: boolean }) => {
  const sz = { xs: "w-6 h-6 text-[10px]", sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-2xl" }[size];
  return (
    <div className={`${sz} rounded-full ${emoji ? "bg-muted" : "bg-primary/10 text-primary"} flex items-center justify-center font-semibold flex-shrink-0`}>
      {text}
    </div>
  );
};

const LvBadge = ({ level }: { level: number }) => (
  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full whitespace-nowrap">
    <Zap size={7} strokeWidth={3} />Lv.{level}
  </span>
);

const PBar = ({ value, max = 100 }: { value: number; max?: number }) => (
  <div className="h-1.5 bg-muted rounded-full overflow-hidden flex-1">
    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
  </div>
);

const CircleProgress = ({ value, max, label, sub, size = 140 }: { value: number; max: number; label: string; sub?: string; size?: number }) => {
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / max) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary)" strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div className="absolute text-center pointer-events-none">
        <div className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </div>
  );
};

// ─── Landing Page ─────────────────────────────────────────────────────────────

const LandingPage = ({ navigate, darkMode, toggleDark }: { navigate: (s: Screen) => void; darkMode: boolean; toggleDark: () => void }) => (
  <div className="min-h-screen bg-background">
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>PROJECT X</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {["Discover", "Creators", "Communities"].map(l => (
            <button key={l} className="hover:text-foreground transition-colors">{l}</button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggleDark} className="text-muted-foreground hover:text-foreground p-2 rounded-lg transition-colors">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => navigate("login")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Sign in</button>
          <button onClick={() => navigate("signup")} className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </header>

    <section className="pt-36 pb-24 px-6 text-center">
      <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 border border-primary/20">
        <Sparkles size={11} /> Introducing AI Creator Tools
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight max-w-4xl mx-auto" style={{ fontFamily: "var(--font-display)" }}>
        Create your<br /><span className="text-primary">digital world.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
        Create. Connect. Collaborate. Grow. A global ecosystem where your value is defined by what you create, not how many followers you have.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button onClick={() => navigate("signup")} className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          Get Started <ArrowRight size={16} />
        </button>
        <button onClick={() => navigate("discover")} className="text-foreground font-medium px-8 py-3.5 rounded-full border border-border hover:bg-muted transition-colors">
          Explore
        </button>
      </div>
    </section>

    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-display)" }}>Everything you need to create and connect</h2>
          <p className="text-muted-foreground">Your entire creative world, in one place.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Wand2, title: "AI Creator", desc: "Turn your ideas into cinematic content with AI tools built for creators.", emoji: "🎬" },
            { icon: TrendingUp, title: "Creator Level", desc: "Your reputation grows with every contribution, not just follower count.", emoji: "📈" },
            { icon: Users, title: "Communities", desc: "Find your people. Build projects together across every interest and language.", emoji: "🌍" },
            { icon: Languages, title: "Language AI", desc: "Communicate naturally with anyone worldwide. Real-time translation, invisibly.", emoji: "💬" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:-translate-y-0.5 transition-all cursor-default group">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors text-xl">{f.emoji}</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="bg-card border-y border-border py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-primary text-xs font-bold uppercase tracking-widest">Creator Passport</span>
          <h2 className="text-3xl font-bold text-foreground mt-3 mb-4 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Your digital identity belongs to you</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">Your Creator Passport captures your skills, projects, achievements, and contributions — a living portfolio that grows with you, shareable anywhere.</p>
          <button onClick={() => navigate("signup")} className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors">Build your passport</button>
        </div>
        <div className="bg-background rounded-3xl border border-border p-6 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Creator Passport</p>
              <h3 className="font-bold text-foreground text-xl" style={{ fontFamily: "var(--font-display)" }}>Alex Kim</h3>
              <p className="text-sm text-muted-foreground">@alexkim</p>
            </div>
            <div className="bg-primary/10 rounded-2xl px-4 py-2 text-center">
              <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>74</p>
              <p className="text-[9px] text-primary font-bold uppercase tracking-wider">Creator Lv.</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-5 bg-muted rounded-xl p-3">
            {[["231", "Creations"], ["19", "Projects"], ["12.8K", "Helpful"], ["42", "Collabs"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-bold text-foreground text-sm">{v}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            {[["AI", 89], ["Programming", 81], ["Video", 64], ["Design", 47]].map(([skill, val]) => (
              <div key={skill as string} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{skill as string}</span>
                <PBar value={val as number} />
                <span className="text-xs font-semibold text-foreground w-6 text-right flex-shrink-0">{val as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 px-6 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>"I found my digital world."</h2>
        <p className="text-muted-foreground mb-8">Join a global community of creators, builders, and collaborators.</p>
        <button onClick={() => navigate("signup")} className="bg-primary text-primary-foreground font-bold px-10 py-4 rounded-full hover:bg-primary/90 transition-colors text-base shadow-xl shadow-primary/20">
          Start for free
        </button>
      </div>
    </section>

    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span className="text-sm font-semibold text-foreground">PROJECT X</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 PROJECT X. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          {["Privacy", "Terms", "Safety"].map(l => <button key={l} className="hover:text-foreground transition-colors">{l}</button>)}
        </div>
      </div>
    </footer>
  </div>
);

// ─── Sign Up Page ─────────────────────────────────────────────────────────────

const SignUpPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "", dob: "" });
  const [showPw, setShowPw] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputCls = "w-full bg-input-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-10">
          <Logo size={36} />
          <span className="font-bold text-foreground text-lg" style={{ fontFamily: "var(--font-display)" }}>PROJECT X</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1 text-center" style={{ fontFamily: "var(--font-display)" }}>Create your account</h1>
        <p className="text-muted-foreground text-sm text-center mb-8">Join a global community of creators</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <input type="text" placeholder="yourcreatorname" value={form.username} onChange={set("username")} className={inputCls + " pl-7"} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="Create a strong password" value={form.password} onChange={set("password")} className={inputCls + " pr-10"} />
              <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Date of birth</label>
            <input type="date" value={form.dob} onChange={set("dob")} className={inputCls} />
          </div>
        </div>

        <button onClick={() => { localStorage.setItem("px-account", JSON.stringify({ name: form.username || "Alex Kim", username: form.username || "alexkim", email: form.email || "alex@example.com", remember: true })); navigate("interests"); }} className="w-full mt-6 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">
          Continue
        </button>
        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{" "}
          <button onClick={() => navigate("home")} className="text-primary font-semibold hover:underline">Sign in</button>
        </p>
        <p className="text-center text-[11px] text-muted-foreground mt-3">By continuing you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

// ─── Interests Page ───────────────────────────────────────────────────────────

const InterestsPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (i: string) => setSel(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-10"><Logo size={36} /></div>
        <div className="text-center mb-8">
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Step 2 of 3</div>
          <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>What are you into?</h1>
          <p className="text-muted-foreground text-sm">Select your interests — we'll personalize your experience.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 justify-center mb-8">
          {INTERESTS.map(i => (
            <button key={i} onClick={() => toggle(i)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sel.includes(i) ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
              {i}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("ai-onboarding")} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Skip</button>
          <button onClick={() => navigate("ai-onboarding")} className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40" disabled={sel.length === 0}>
            Continue {sel.length > 0 && `(${sel.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Onboarding Page ───────────────────────────────────────────────────────

const AIOnboardingPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const questions = ["What do you want to create?", "What are you currently learning?", "What are you working on right now?", "What kind of content do you enjoy most?"];
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    const next = [...answers, input.trim()];
    setAnswers(next);
    setInput("");
    if (next.length >= questions.length) setTimeout(() => navigate("home"), 800);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [answers]);

  const msgs: { role: "ai" | "user"; text: string }[] = [
    { role: "ai", text: "Hey! I'm your AI companion. 👋" },
    { role: "ai", text: "I'll learn how you think, create and explore — and help you get more from PROJECT X." },
    { role: "ai", text: questions[0] },
    ...answers.flatMap((a, i) => [
      { role: "user" as const, text: a },
      ...(i + 1 < questions.length ? [{ role: "ai" as const, text: questions[i + 1] }] : []),
    ]),
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6"><Logo size={36} /></div>
        <div className="text-center mb-6">
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Step 3 of 3</div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Meet your AI companion</h1>
        </div>
        <div className="bg-card rounded-3xl border border-border p-4 mb-3 h-72 overflow-y-auto flex flex-col gap-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles size={13} className="text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "ai" ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type your answer..." className="flex-1 bg-input-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          <button onClick={send} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
            <Send size={16} />
          </button>
        </div>
        <button onClick={() => navigate("home")} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
          Skip — go to home
        </button>
      </div>
    </div>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "create", label: "Create", icon: Plus },
  { id: "stories", label: "Stories", icon: Eye },
  { id: "music", label: "Music", icon: AudioLines },
  { id: "communities", label: "Communities", icon: Users },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "my-ai", label: "My AI", icon: Sparkles },
  { id: "rankings", label: "Rankings", icon: Trophy },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "notes", label: "Private Notes", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

const MOBILE_NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "create", label: "", icon: Plus },
  { id: "communities", label: "Communities", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

const isNavActive = (id: string, screen: Screen) =>
  screen === id ||
  (id === "communities" && screen === "community-detail") ||
  (id === "messages" && screen === "chat") ||
  (id === "music" && screen === "audio-detail") ||
  (id === "stories" && screen === "story-create") ||
  (id === "profile" && (screen === "creator-level" || screen === "passport"));

const AppShell = ({ children, screen, navigate, darkMode, toggleDark }: {
  children: React.ReactNode; screen: Screen; navigate: (s: Screen) => void; darkMode: boolean; toggleDark: () => void;
}) => (
  <div className="flex h-screen bg-background overflow-hidden">
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card flex-shrink-0">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
        <Logo /><span className="font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>PROJECT X</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = isNavActive(id, screen);
          return (
            <button key={id} onClick={() => navigate(id as Screen)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon size={18} /><span>{label}</span>
              {id === "messages" && <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">7</span>}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        <button onClick={() => navigate("notifications")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${screen === "notifications" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          <Bell size={18} /><span>Notifications</span><span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>
        <button onClick={() => navigate("settings")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${screen === "settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          <Settings size={18} /><span>Settings</span>
        </button>
        <button onClick={toggleDark} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}<span>{darkMode ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
    </aside>

    <main className="flex-1 overflow-y-auto relative pb-16 md:pb-0">
      {children}
      <button onClick={() => navigate("my-ai")} className="md:hidden fixed bottom-20 right-4 bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-colors z-40">
        <Sparkles size={20} />
      </button>
    </main>

    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {MOBILE_NAV.map(({ id, label, icon: Icon }) => {
          const active = isNavActive(id, screen);
          return (
            <button key={id} onClick={() => navigate(id as Screen)} className={`flex flex-col items-center gap-1 flex-1 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
              {id === "create"
                ? <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center -mt-4 shadow-lg shadow-primary/30"><Icon size={22} className="text-primary-foreground" /></div>
                : <><Icon size={20} /><span className="text-[10px] font-medium">{label}</span></>}
            </button>
          );
        })}
      </div>
    </nav>
  </div>
);

// ─── Home / Feed ──────────────────────────────────────────────────────────────

const REACTION_TYPES = [
  { id: "helpful", label: "Helpful", emoji: "💡" },
  { id: "inspired", label: "Inspired me", emoji: "✨" },
  { id: "collaborated", label: "Collaborated", emoji: "🤝" },
  { id: "learned", label: "Learned", emoji: "📖" },
];

const HomePage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [tab, setTab] = useState<"for-you" | "following" | "communities">("for-you");
  const [reactions, setReactions] = useState<Record<number, string>>({});
  const react = (id: number, r: string) => setReactions(p => ({ ...p, [id]: p[id] === r ? "" : r }));

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 md:hidden">
          <div className="flex items-center gap-2"><Logo size={22} /><span className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-display)" }}>PROJECT X</span></div>
          <button onClick={() => navigate("notifications")} className="relative p-1">
            <Bell size={20} className="text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">3</span>
          </button>
        </div>
        <div className="hidden md:flex items-center justify-between px-4 h-14">
          <h1 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Home</h1>
          <button onClick={() => navigate("notifications")} className="relative p-1">
            <Bell size={20} className="text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">3</span>
          </button>
        </div>
        <div className="flex">
          {[{ id: "for-you", label: "For You" }, { id: "following", label: "Following" }, { id: "communities", label: "Communities" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.id ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><Sparkles size={16} /></div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Welcome back, Alex</p>
              <p className="text-sm font-bold text-foreground mt-1">Your creative world is ready.</p>
              <p className="text-xs text-muted-foreground mt-1">Continue a draft, revisit an audio idea, or see what your circle made.</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => navigate("drafts")} className="bg-card border border-border rounded-full px-3 py-1.5 text-xs font-bold text-foreground">Continue editing</button>
            <button onClick={() => navigate("activity")} className="text-primary text-xs font-bold px-2">View activity</button>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-3">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-[10px] font-bold text-primary uppercase tracking-widest">Stories</p><p className="text-sm font-bold text-foreground">Fresh from your circle</p></div>
            <button onClick={() => navigate("stories")} className="text-xs text-primary font-bold">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {[["AK", "Your story"], ["SM", "Sofia"], ["AH", "Ali"], ["YT", "Yuki"]].map(([initials, label], i) => (
              <button key={label} onClick={() => i === 0 ? navigate("story-create") : navigate("stories")} className="flex-shrink-0 text-center">
                <div className={`w-12 h-12 rounded-full p-0.5 mx-auto mb-1 ${i === 0 ? "border-2 border-dashed border-primary" : "bg-primary/20"}`}><div className="w-full h-full rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{i === 0 ? <Plus size={15} /> : initials}</div></div>
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => navigate("music")} className="flex items-center gap-1.5 whitespace-nowrap bg-primary/8 text-primary border border-primary/20 rounded-full px-3 py-1.5 text-xs font-bold"><AudioLines size={13} />Music library</button>
          <button onClick={() => navigate("search")} className="flex items-center gap-1.5 whitespace-nowrap bg-muted text-muted-foreground rounded-full px-3 py-1.5 text-xs font-bold"><Search size={13} />Search everything</button>
          <button onClick={() => navigate("saved")} className="flex items-center gap-1.5 whitespace-nowrap bg-muted text-muted-foreground rounded-full px-3 py-1.5 text-xs font-bold"><Bookmark size={13} />Saved</button>
        </div>
        {POSTS.map(post => {
          const r = reactions[post.id] || "";
          return (
            <article key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <button onClick={() => navigate("profile")} className="flex items-center gap-2.5">
                  <Av text={post.user.avatar} />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">{post.user.name}</span>
                      <LvBadge level={post.user.level} />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">@{post.user.username}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>
                </button>
                 <button onClick={() => navigate("safety")} className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors" title="Safety actions"><MoreHorizontal size={16} /></button>
              </div>
              <div className="px-4 pb-3">
                <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.tags.map(t => <span key={t} className="text-xs text-primary font-medium">#{t}</span>)}
                </div>
              </div>
              {post.image && (
                <div className="px-4 pb-3">
                  <img src={post.image} alt="" className="w-full rounded-xl object-cover h-48 bg-muted" loading="lazy" />
                </div>
              )}
              <div className="px-4 py-3 border-t border-border">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex gap-1 flex-wrap">
                    {REACTION_TYPES.map(rt => (
                      <button key={rt.id} onClick={() => react(post.id, rt.id)} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${r === rt.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        <span>{rt.emoji}</span>
                        <span className="hidden sm:block">{rt.label}</span>
                        <span>{post[rt.id as keyof typeof post] as number}</span>
                      </button>
                    ))}
                  </div>
                   <div className="flex items-center gap-1">
                     {post.type === "video" && <button onClick={() => navigate("music")} className="text-muted-foreground hover:text-primary p-1 transition-colors" title="View audio"><AudioLines size={15} /></button>}
                     <button onClick={() => navigate("saved")} className="text-muted-foreground hover:text-primary p-1 transition-colors" title="Save"><Bookmark size={15} /></button>
                     <button onClick={() => navigate("stories")} className="text-muted-foreground hover:text-foreground p-1 transition-colors" title="Share"><Share2 size={15} /></button>
                   </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

// ─── Discover Page ────────────────────────────────────────────────────────────

const DiscoverPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [tab, setTab] = useState<"all" | "people" | "communities" | "talent">("all");
  const [query, setQuery] = useState("");
  const [talentQuery, setTalentQuery] = useState("");
  const [talentStep, setTalentStep] = useState(0);
  const [showMatches, setShowMatches] = useState(false);

  const sendTalent = () => {
    if (!talentQuery.trim()) return;
    if (talentStep === 0) { setTalentStep(1); }
    else { setShowMatches(true); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="px-4 h-14 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, creators, projects, communities..." className="w-full bg-input-background rounded-full py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <button className="text-muted-foreground hover:text-foreground p-2 transition-colors"><Filter size={18} /></button>
        </div>
        <div className="flex px-4 gap-1 pb-2">
          {[{ id: "all", label: "All" }, { id: "people", label: "People" }, { id: "communities", label: "Communities" }, { id: "talent", label: "🔍 Find Talent" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">
        {(tab === "all" || tab === "people") && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider text-muted-foreground">Top Creators</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {PEOPLE.map(p => (
                <button key={p.id} onClick={() => navigate("profile")} className="bg-card rounded-2xl border border-border p-4 text-left hover:border-primary/30 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start gap-3">
                    <Av text={p.avatar} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-foreground text-sm">{p.name}</span>
                        <LvBadge level={p.level} />
                      </div>
                      <p className="text-xs text-muted-foreground">{p.role}</p>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span><strong className="text-foreground">{p.projects}</strong> Projects</span>
                        <span><strong className="text-foreground">{p.collabs}</strong> Collabs</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.skills.map(s => <span key={s} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">{s}</span>)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(tab === "all" || tab === "communities") && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Communities</h2>
            <div className="space-y-2">
              {COMMUNITIES.slice(0, 3).map(c => (
                <button key={c.id} onClick={() => navigate("communities")} className="w-full bg-card rounded-2xl border border-border p-4 flex items-center gap-3 text-left hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">{c.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.members.toLocaleString()} members · {c.category}</div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "talent" && (
          <div>
            <div className="bg-card rounded-2xl border border-border p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Sparkles size={15} className="text-primary-foreground" /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Talent Finder</p>
                  <p className="text-xs text-muted-foreground">Tell me what you're looking for</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">
                  What kind of talent are you looking for?
                </div>
                {talentQuery && <div className="bg-primary rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-primary-foreground max-w-[85%] ml-auto">{talentQuery}</div>}
                {talentStep >= 1 && <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">What matters most to you?<br /><span className="text-muted-foreground text-xs">Skills · Projects · Creator Level · Availability · Language</span></div>}
              </div>
              {!showMatches && (
                <div className="flex gap-2">
                  <input value={talentQuery} onChange={e => setTalentQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && sendTalent()} placeholder={talentStep === 0 ? "e.g. Python backend developer for my startup" : "e.g. Projects and Creator Level"} className="flex-1 bg-input-background border border-border rounded-xl py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  <button onClick={sendTalent} className="bg-primary text-primary-foreground px-3 py-2 rounded-xl hover:bg-primary/90 transition-colors"><Send size={15} /></button>
                </div>
              )}
            </div>
            {showMatches && (
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Best Matches</h3>
                <div className="space-y-3">
                  {PEOPLE.map(p => (
                    <div key={p.id} className="bg-card rounded-2xl border border-border p-4 flex items-start gap-3">
                      <Av text={p.avatar} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">{p.name}</span>
                          <LvBadge level={p.level} />
                          <span className="ml-auto text-sm font-bold text-primary">{p.match}% match</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{p.role}</p>
                        <div className="flex gap-3 my-2 text-xs text-muted-foreground">
                          <span><strong className="text-foreground">{p.projects}</strong> Projects</span>
                          <span><strong className="text-foreground">{p.collabs}</strong> Collaborations</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => navigate("profile")} className="bg-muted text-foreground text-xs font-medium px-3 py-1.5 rounded-full hover:bg-muted/70 transition-colors">View Profile</button>
                          <button className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors">Invite to Project</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Create Page ──────────────────────────────────────────────────────────────

const CreatePage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const types = [
    { icon: Camera, label: "Photo", desc: "Share a moment" },
    { icon: Video, label: "Video", desc: "Capture & tell stories" },
    { icon: AlignLeft, label: "Post", desc: "Write your thoughts" },
    { icon: Edit3, label: "Design", desc: "Visual creation" },
    { icon: Layers, label: "Project", desc: "Multi-part work" },
    { icon: Star, label: "Idea", desc: "Quick concepts" },
  ];
  return (
    <div className="max-w-xl mx-auto">
      <div className="px-4 pt-6 pb-2 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>Create</h1>
        <p className="text-muted-foreground text-sm">What do you want to create?</p>
      </div>
      <div className="px-4 pt-5">
        <button onClick={() => navigate("ai-creator")} className="w-full mb-5 bg-primary/8 border-2 border-dashed border-primary/30 hover:bg-primary/12 hover:border-primary/50 rounded-2xl p-6 flex items-center gap-4 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Wand2 size={22} className="text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">Create with AI</p>
            <p className="text-sm text-muted-foreground">Turn your idea into a creation</p>
          </div>
          <ArrowRight size={18} className="text-primary ml-auto" />
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {types.map(({ icon: Icon, label, desc }) => (
            <button key={label} className="bg-card rounded-2xl border border-border p-5 text-left hover:border-primary/30 hover:-translate-y-0.5 transition-all group">
              <Icon size={22} className="text-muted-foreground group-hover:text-primary mb-3 transition-colors" />
              <p className="font-semibold text-foreground text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Start</p>
          <textarea placeholder="What's on your mind?" className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-24" />
          <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
            <div className="flex gap-3 text-muted-foreground">
              <button className="hover:text-foreground transition-colors"><Image size={18} /></button>
              <button className="hover:text-foreground transition-colors"><Camera size={18} /></button>
              <button className="hover:text-foreground transition-colors"><Hash size={18} /></button>
              <button className="hover:text-foreground transition-colors"><Globe size={18} /></button>
            </div>
            <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AI Creator Page ──────────────────────────────────────────────────────────

const CREATOR_STEPS = ["Idea", "Media", "Style", "Story", "Edit", "Caption", "Cover", "Publish"];
const STYLES = ["Cinematic", "Documentary", "Vlog", "Travel Diary", "Short Film", "Ambient"];

const AICreatorPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [caption, setCaption] = useState("A journey through Tokyo — where ancient temples meet neon-lit streets. Built with AI. Shot with purpose. ✈️🎬");
  const [visibility, setVisibility] = useState("Everyone");
  const [aiMsg, setAiMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const next = () => {
    if (step < CREATOR_STEPS.length - 1) setStep(s => s + 1);
  };
  const prev = () => { if (step > 0) setStep(s => s - 1); };

  const handleIdeaSubmit = () => {
    if (!idea.trim()) return;
    setAiMsg("Absolutely. Let's build it. 🎬");
    setTimeout(() => next(), 600);
  };

  if (submitted) return (
    <div className="max-w-xl mx-auto flex items-center justify-center min-h-screen">
      <div className="text-center px-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>Published!</h2>
        <p className="text-muted-foreground mb-6">Your creation is now live. The world can see it.</p>
        <button onClick={() => navigate("home")} className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={step === 0 ? () => navigate("create") : prev} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium">Step {step + 1} of {CREATOR_STEPS.length}</p>
            <p className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{CREATOR_STEPS[step]}</p>
          </div>
          <div className="flex gap-1">
            {CREATOR_STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-muted"} ${i === step ? "w-5" : "w-2"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {step === 0 && (
          <div>
            <div className="bg-primary/8 rounded-2xl p-4 flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Sparkles size={14} className="text-primary-foreground" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Your AI Creator</p>
                <p className="text-sm text-foreground">{aiMsg || "What do you want to create? Tell me your idea."}</p>
              </div>
            </div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Your idea</label>
            <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g. A cinematic travel video through Tokyo — capturing the contrast between ancient temples and neon city lights." className="w-full bg-input-background border border-border rounded-2xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none min-h-32 mb-4" />
            <button onClick={handleIdeaSubmit} disabled={!idea.trim()} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40">
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-muted-foreground text-sm mb-5">Choose your media source</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[{ icon: Upload, label: "Upload files", desc: "From your device" }, { icon: Camera, label: "Use camera", desc: "Record now" }, { icon: Image, label: "Stock footage", desc: "AI-selected clips" }, { icon: Wand2, label: "AI generated", desc: "Create from scratch" }].map(({ icon: Icon, label, desc }) => (
                <button key={label} onClick={next} className="bg-card rounded-2xl border border-border p-5 text-left hover:border-primary hover:-translate-y-0.5 transition-all group">
                  <Icon size={20} className="text-muted-foreground group-hover:text-primary mb-3 transition-colors" />
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-muted-foreground text-sm mb-5">Choose a visual style</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {STYLES.map(s => (
                <button key={s} onClick={() => { setStyle(s); next(); }} className={`rounded-2xl border p-4 text-sm font-semibold transition-all ${style === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary/40"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="bg-primary/8 rounded-2xl p-4 flex gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Sparkles size={14} className="text-primary-foreground" /></div>
              <p className="text-sm text-foreground">Here's the story structure I've built based on your idea:</p>
            </div>
            <div className="space-y-3 mb-6">
              {["Opening — Aerial shot of Tokyo skyline at dawn", "Act 1 — Street-level exploration: Shibuya crossing, local market", "Act 2 — Ancient contrast: Senso-ji temple, quiet garden", "Climax — Neon city at night, time-lapse", "Close — Reflection moment, voiceover"].map((s, i) => (
                <div key={i} className="flex items-start gap-3 bg-card rounded-xl border border-border p-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <p className="text-sm text-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 border border-border text-foreground text-sm font-medium py-3 rounded-xl hover:bg-muted transition-colors">Edit story</button>
              <button onClick={next} className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">Approve & continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="bg-muted rounded-2xl overflow-hidden mb-5 relative aspect-video flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=338&fit=crop&auto=format" alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"><Play size={24} className="text-white" /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {["Trim", "Color", "Sound", "Speed", "Text", "Effects"].map(t => (
                <button key={t} className="bg-card border border-border rounded-xl py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">{t}</button>
              ))}
            </div>
            <button onClick={next} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">Looks good — continue</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Caption</label>
            <textarea value={caption} onChange={e => setCaption(e.target.value)} className="w-full bg-input-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none min-h-24 mb-3" />
            <div className="bg-primary/8 rounded-xl p-3 flex items-center gap-2 mb-5">
              <Wand2 size={14} className="text-primary flex-shrink-0" />
              <p className="text-xs text-primary">AI suggestion generated. Tap to edit or <button className="font-semibold underline" onClick={() => setCaption("Exploring Tokyo through a cinematic lens — ancient meets modern. Every frame tells a story. 🗾✨")}>regenerate</button>.</p>
            </div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Hashtags</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {["#travel", "#tokyo", "#cinematics", "#AIcreator", "#videography", "#japan"].map(t => (
                <span key={t} className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full">{t}</span>
              ))}
              <button className="bg-muted text-primary text-sm px-3 py-1 rounded-full hover:bg-primary/10 transition-colors">+ Add</button>
            </div>
            <button onClick={next} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">Continue</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Cover image</label>
            <div className="bg-muted rounded-2xl overflow-hidden aspect-video mb-5 flex items-center justify-center relative">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=338&fit=crop&auto=format" alt="cover" className="w-full h-full object-cover" />
              <button className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur hover:bg-black/60 transition-colors">Change cover</button>
            </div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Visibility</label>
            <div className="flex gap-2 mb-6">
              {["Everyone", "Friends", "Community"].map(v => (
                <button key={v} onClick={() => setVisibility(v)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${visibility === v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>{v}</button>
              ))}
            </div>
            <button onClick={next} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">Preview creation</button>
          </div>
        )}

        {step === 7 && (
          <div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=300&fit=crop&auto=format" alt="cover" className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="font-semibold text-foreground mb-1">Tokyo — Ancient Meets Neon</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{caption}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Globe size={12} /><span>{visibility}</span>
                  <span>·</span><span>{style} style</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mb-3">
              <button onClick={prev} className="flex-1 border border-border text-foreground font-medium py-3 rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2"><Edit3 size={15} /> Edit</button>
              <button onClick={() => { setCaption(caption + " ✨"); }} className="border border-border text-foreground font-medium py-3 px-4 rounded-xl hover:bg-muted transition-colors"><RefreshCw size={15} /></button>
            </div>
            <button onClick={() => setSubmitted(true)} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-base">Publish creation</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Profile Page ─────────────────────────────────────────────────────────────

const ProfilePage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [tab, setTab] = useState("creations");
  const profileTabs = ["Creations", "Projects", "Communities", "Achievements", "About"];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border-b border-border">
        <div className="h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
        <div className="px-4 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-card bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>AK</div>
            <div className="flex gap-2 pb-1">
              <button onClick={() => navigate("passport")} className="bg-muted text-foreground text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-muted/70 transition-colors flex items-center gap-1.5"><Award size={13} />Passport</button>
              <button onClick={() => navigate("messages")} className="bg-muted text-foreground text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-muted/70 transition-colors flex items-center gap-1.5"><MessageCircle size={13} />Message</button>
              <button className="bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1.5"><Edit3 size={13} />Edit profile</button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Alex Kim</h1>
            <button onClick={() => navigate("creator-level")} className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              <Zap size={10} strokeWidth={3} />Creator Level 74
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">@alexkim · AI builder, creator, filmmaker. Building things that matter.</p>
          <div className="grid grid-cols-4 gap-1 mb-4">
            {[["231", "Creations"], ["19", "Projects"], ["12.8K", "Helpful"], ["42", "Collabs"]].map(([v, l]) => (
              <div key={l} className="text-center bg-muted rounded-xl py-2.5">
                <p className="font-bold text-foreground text-sm">{v}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>

          {/* World Ranking card */}
          <button onClick={() => navigate("rankings")} className="w-full bg-primary/6 border border-primary/20 hover:bg-primary/10 hover:border-primary/35 rounded-2xl p-4 mb-4 text-left transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">World Ranking</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>#8,888</span>
                  <span className="text-xs text-muted-foreground">/ 12.4M</span>
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-2.5 py-1.5 text-center">
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm"><TrendingUp size={12} />↑ 327</div>
                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">this week</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">🇺🇿 <strong className="text-foreground">#143</strong> Uzbekistan</span>
              <span>·</span>
              <span className="flex items-center gap-1">🎥 <strong className="text-foreground">#27</strong> Video</span>
              <span>·</span>
              <span className="flex items-center gap-1">🤖 <strong className="text-foreground">#312</strong> AI</span>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
              View Rankings <ChevronRight size={13} />
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => navigate("account")} className="bg-muted rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground flex items-center gap-2"><Settings size={14} className="text-primary" />Account</button>
            <button onClick={() => navigate("drafts")} className="bg-muted rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground flex items-center gap-2"><FileText size={14} className="text-primary" />Drafts</button>
            <button onClick={() => navigate("activity")} className="bg-muted rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground flex items-center gap-2"><Calendar size={14} className="text-primary" />Activity</button>
            <button onClick={() => navigate("notes")} className="bg-muted rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground flex items-center gap-2"><Lock size={14} className="text-primary" />Private notes</button>
          </div>

          <div className="space-y-2.5">
            {[["AI", 89], ["Programming", 81], ["Video", 64], ["Design", 47]].map(([skill, val]) => (
              <div key={skill as string} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-24 flex-shrink-0">{skill as string}</span>
                <PBar value={val as number} />
                <span className="text-xs font-bold text-foreground w-6 text-right flex-shrink-0">{val as number}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex border-t border-border overflow-x-auto">
          {profileTabs.map(t => (
            <button key={t} onClick={() => setTab(t.toLowerCase())} className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.toLowerCase() ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-6">
        {tab === "creations" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...POSTS.map(p => p.image), "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=300&fit=crop&auto=format"].filter(Boolean).map((img, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl overflow-hidden">
                <img src={img!} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
              </div>
            ))}
          </div>
        )}
        {tab === "projects" && (
          <div className="space-y-3">
            {[{ name: "Tokyo Cinematic Series", status: "In Progress", collabs: 3, tags: ["video", "ai"] }, { name: "AI Art Generator Tool", status: "Completed", collabs: 7, tags: ["programming", "ai"] }, { name: "Travel Photography Book", status: "In Progress", collabs: 2, tags: ["photography", "design"] }].map(p => (
              <div key={p.name} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-foreground text-sm">{p.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-primary/10 text-primary"}`}>{p.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.collabs} collaborators</p>
                <div className="flex gap-1.5 mt-2">{p.tags.map(t => <span key={t} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">#{t}</span>)}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "achievements" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[{ icon: "🏆", name: "Level 50", desc: "Reached Creator Level 50" }, { icon: "💡", name: "10K Helpful", desc: "Helped 10K people" }, { icon: "🌍", name: "Global Creator", desc: "Collaborated across 10+ countries" }, { icon: "🔥", name: "30-day streak", desc: "Created for 30 days straight" }, { icon: "🚀", name: "First Project", desc: "Launched your first project" }, { icon: "⭐", name: "Top Creator", desc: "Reached top 1% in your field" }].map(a => (
              <div key={a.name} className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">{a.icon}</div>
                <p className="font-semibold text-foreground text-xs">{a.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{a.desc}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "communities" && (
          <div className="space-y-2">
            {COMMUNITIES.slice(0, 3).map(c => (
              <button key={c.id} onClick={() => navigate("community-detail")} className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left hover:border-primary/30 transition-all">
                <div className="text-2xl">{c.icon}</div>
                <div><p className="font-semibold text-foreground text-sm">{c.name}</p><p className="text-xs text-muted-foreground">{c.members.toLocaleString()} members</p></div>
                <ChevronRight size={16} className="text-muted-foreground ml-auto" />
              </button>
            ))}
          </div>
        )}
        {tab === "about" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
              <p className="text-sm text-foreground leading-relaxed">AI builder, creator, and filmmaker passionate about using technology to tell human stories. I build tools, create content, and collaborate with creators worldwide.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Info</p>
              <div className="space-y-2">
                {[{ icon: MapPin, label: "Seoul, South Korea" }, { icon: Globe, label: "alexkim.world" }, { icon: Calendar, label: "Member since January 2025" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground"><Icon size={14} className="flex-shrink-0" />{label}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Creator Level Page ───────────────────────────────────────────────────────

const CreatorLevelPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const factors = [
    { name: "Creation", value: 88, desc: "Quality & frequency of your work" },
    { name: "Contribution", value: 92, desc: "Helpful interactions & feedback" },
    { name: "Collaboration", value: 74, desc: "Projects built with others" },
    { name: "Quality", value: 81, desc: "Community trust signals" },
    { name: "Consistency", value: 79, desc: "Regular creative activity" },
    { name: "Community", value: 85, desc: "Your role in community growth" },
  ];

  return (
    <div className="max-w-xl mx-auto">
      <div className="px-4 h-14 flex items-center gap-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <button onClick={() => navigate("profile")} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
        <h1 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Creator Level</h1>
      </div>

      <div className="px-4 py-6">
        <div className="bg-card rounded-3xl border border-border p-6 mb-5 flex flex-col items-center">
          <CircleProgress value={74} max={100} label="74" sub="CREATOR LEVEL" size={160} />
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-foreground">Alex Kim</p>
            <p className="text-xs text-muted-foreground">Top 8% of creators</p>
          </div>
          <div className="w-full mt-5 p-4 bg-muted rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-foreground">Progress to Level 75</p>
              <p className="text-xs text-muted-foreground">74%</p>
            </div>
            <PBar value={74} />
            <p className="text-xs text-muted-foreground mt-2">Next unlock: <strong className="text-foreground">Advanced Creator Analytics</strong></p>
          </div>
        </div>

        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Creator Journey</h2>
        <div className="space-y-3 mb-5">
          {factors.map(f => (
            <div key={f.name} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
                <span className="text-base font-bold text-primary ml-3">{f.value}</span>
              </div>
              <PBar value={f.value} />
            </div>
          ))}
        </div>

        <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Level Milestones</p>
          <div className="space-y-2">
            {[{ lv: 75, unlock: "Advanced Creator Analytics" }, { lv: 80, unlock: "Priority Discovery" }, { lv: 90, unlock: "Creator Partner Badge" }, { lv: 100, unlock: "Legendary Creator Status" }].map(m => (
              <div key={m.lv} className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full px-2 py-0.5 text-xs font-bold text-primary flex-shrink-0">Lv.{m.lv}</div>
                <p className="text-xs text-foreground">{m.unlock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Communities Page ─────────────────────────────────────────────────────────

const CommunitiesPage = ({ navigate, setSelectedCommunity }: { navigate: (s: Screen) => void; setSelectedCommunity: (c: Community) => void }) => {
  const [query, setQuery] = useState("");
  const filtered = COMMUNITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="px-4 h-14 flex items-center gap-3">
          <h1 className="font-bold text-foreground flex-1" style={{ fontFamily: "var(--font-display)" }}>Communities</h1>
          <button className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1"><Plus size={12} />Create</button>
        </div>
        <div className="px-4 pb-3 relative">
          <Search size={15} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search communities..." className="w-full bg-input-background rounded-full py-2 pl-8 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
      </div>

      <div className="px-4 pt-2 pb-6">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {["All", "Technology", "Business", "Art", "Gaming", "Design"].map(cat => (
            <button key={cat} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors">{cat}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(c => (
            <button key={c.id} onClick={() => { setSelectedCommunity(c); navigate("community-detail"); }} className="w-full bg-card rounded-2xl border border-border p-5 text-left hover:border-primary/30 hover:-translate-y-0.5 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-foreground">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.desc}</p>
                    </div>
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-full flex-shrink-0">{c.category}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Users size={12} />{c.members.toLocaleString()} members</div>
                    <span className="text-xs font-semibold text-primary group-hover:underline">View →</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Community Detail Page ────────────────────────────────────────────────────

const CommunityDetailPage = ({ community, navigate }: { community: Community; navigate: (s: Screen) => void }) => {
  const [channel, setChannel] = useState(community.channels[0]);
  const [joined, setJoined] = useState(false);
  const msgs = [
    { user: "Sofia M.", avatar: "SM", text: "Just finished the new AI art generator module. Who wants to beta test?", time: "10:24" },
    { user: "James O.", avatar: "JO", text: "I'll try it! Send me the link when ready.", time: "10:31" },
    { user: "Lena M.", avatar: "LM", text: "The Global AI Challenge starts tomorrow — anyone joining?", time: "10:45" },
    { user: "Marcus R.", avatar: "MR", text: "Absolutely joining. Been working on a video generation tool for this.", time: "11:02" },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row h-full">
      <div className="md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <button onClick={() => navigate("communities")} className="text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1 mb-3 transition-colors"><ChevronLeft size={14} />Communities</button>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">{community.icon}</div>
            <div>
              <p className="font-bold text-foreground text-sm">{community.name}</p>
              <p className="text-xs text-muted-foreground">{community.members.toLocaleString()} members</p>
            </div>
          </div>
          <button onClick={() => setJoined(v => !v)} className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${joined ? "bg-muted text-foreground hover:bg-muted/70" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
            {joined ? "Joined ✓" : "Join Community"}
          </button>
        </div>

        <div className="p-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">Channels</p>
          {community.channels.map(ch => (
            <button key={ch} onClick={() => setChannel(ch)} className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${channel === ch ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              <Hash size={14} />{ch}
            </button>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">Voice</p>
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Mic size={14} />AI Lounge
            </button>
          </div>
          <div className="mt-2 border-t border-border pt-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">Events</p>
            <button onClick={() => navigate("events")} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors">
              <Calendar size={14} />Global AI Challenge
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 h-12 flex items-center gap-2 border-b border-border bg-card flex-shrink-0">
          <Hash size={16} className="text-muted-foreground" />
          <span className="font-semibold text-foreground text-sm">{channel}</span>
          <span className="text-xs text-muted-foreground ml-1">— {community.name}</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className="flex gap-3">
              <Av text={m.avatar} size="sm" />
              <div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{m.user}</span>
                  <span className="text-xs text-muted-foreground">{m.time}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2">
            <input placeholder={`Message #${channel}`} className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <button className="hover:text-foreground transition-colors"><Image size={16} /></button>
              <button className="hover:text-foreground transition-colors"><Sparkles size={16} /></button>
              <button className="hover:text-foreground transition-colors"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Messages Page ────────────────────────────────────────────────────────────

const MessagesPage = ({ navigate, setSelectedConversation }: { navigate: (s: Screen) => void; setSelectedConversation: (c: Conversation) => void }) => (
  <div className="max-w-xl mx-auto">
    <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border px-4 h-14 flex items-center gap-3">
      <h1 className="font-bold text-foreground flex-1" style={{ fontFamily: "var(--font-display)" }}>Messages</h1>
      <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-colors"><Edit3 size={18} /></button>
    </div>
    <div className="px-4 pt-3 pb-2">
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search conversations..." className="w-full bg-input-background rounded-full py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
      </div>
    </div>
    <div className="flex gap-2 px-4 py-2 text-xs font-medium">
      {["All", "Friends", "Collaborators", "Communities"].map(t => (
        <button key={t} className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">{t}</button>
      ))}
    </div>
    <div className="divide-y divide-border">
      {CONVERSATIONS.map(conv => (
        <button key={conv.id} onClick={() => { setSelectedConversation(conv); navigate("chat"); }} className="w-full flex items-start gap-3 px-4 py-4 hover:bg-muted/40 transition-colors text-left">
          <div className="relative flex-shrink-0">
            <Av text={conv.avatar} size="lg" emoji={conv.type === "community"} />
            {conv.unread > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{conv.unread}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-semibold text-foreground text-sm">{conv.name}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
            </div>
            <div className="flex items-center gap-1">
              {conv.autoTranslate && <Languages size={11} className="text-primary flex-shrink-0" />}
              <p className="text-xs text-muted-foreground truncate">{conv.lastMsg}</p>
            </div>
            {conv.type === "collaborator" && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full mt-1 inline-block">Collaborator</span>}
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ─── Chat Page ────────────────────────────────────────────────────────────────

const ChatPage = ({ conversation, navigate }: { conversation: Conversation; navigate: (s: Screen) => void }) => {
  const [autoTranslate, setAutoTranslate] = useState(conversation.autoTranslate);
  const [showOriginals, setShowOriginals] = useState<Record<number, boolean>>({});
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(conversation.messages);
  const [status, setStatus] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const toggleOriginal = (id: number) => setShowOriginals(p => ({ ...p, [id]: !p[id] }));

  const sendMsg = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), sender: "me", original: input.trim(), translated: autoTranslate ? "Juda yaxshi ketyapti!" : null, lang: "en", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border bg-card flex-shrink-0">
        <button onClick={() => navigate("messages")} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
        <Av text={conversation.avatar} size="sm" emoji={conversation.type === "community"} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{conversation.name}</p>
          <p className="text-xs text-muted-foreground">@{conversation.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground p-1.5 transition-colors"><Phone size={16} /></button>
           <button onClick={() => navigate("safety")} className="text-muted-foreground hover:text-foreground p-1.5 transition-colors" title="Conversation safety"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      {conversation.autoTranslate && (
        <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Languages size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">Language AI is active</span>
            <span className="text-xs text-muted-foreground">· Messages translated automatically</span>
          </div>
          <button onClick={() => setAutoTranslate(v => !v)} className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${autoTranslate ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {autoTranslate ? "ON" : "OFF"}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.map(m => {
          const isMe = m.sender === "me";
          const showOrig = showOriginals[m.id];
          const displayText = autoTranslate && !isMe && m.translated ? m.translated : m.original;
          const originalText = !isMe && m.translated ? m.original : null;
          const translatedText = isMe && m.translated && autoTranslate ? m.translated : null;

          return (
            <div key={m.id} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && <Av text={conversation.avatar} size="xs" emoji={conversation.type === "community"} />}
              <div className={`max-w-[78%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border text-foreground rounded-tl-sm"}`}>
                  {displayText}
                </div>
                {originalText && (
                  <button onClick={() => toggleOriginal(m.id)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Languages size={9} /> {showOrig ? `English: "${displayText}"` : `Uzbek original`} · {showOrig ? "Show translation" : "Show original"}
                  </button>
                )}
                {showOrig && originalText && (
                  <div className="bg-muted px-3 py-2 rounded-xl text-xs text-muted-foreground italic">{originalText}</div>
                )}
                {translatedText && (
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Languages size={9} /> Sent as: <em>"{translatedText}"</em>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <button onClick={() => setStatus("Reaction added")} className="hover:text-primary flex items-center gap-1"><Heart size={11} />React</button>
                  <button onClick={() => setStatus("Reply mode ready")} className="hover:text-primary">Reply</button>
                  <button onClick={() => setStatus("Message forwarded")} className="hover:text-primary">Forward</button>
                  {isMe && <button onClick={() => setMsgs(p => p.filter(x => x.id !== m.id))} className="hover:text-destructive">Delete</button>}
                </div>
                <span className="text-[10px] text-muted-foreground">{m.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2 bg-input-background rounded-2xl px-3 py-2">
           <button onClick={() => setStatus("Attachment picker ready")} className="text-muted-foreground hover:text-foreground transition-colors p-0.5"><Image size={18} /></button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Message..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none mx-1" />
           <button onClick={() => setStatus("Language AI suggestions ready")} className="text-muted-foreground hover:text-foreground transition-colors p-0.5"><Sparkles size={18} /></button>
          <button onClick={sendMsg} disabled={!input.trim()} className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 flex-shrink-0">
            <Send size={13} />
          </button>
        </div>
        {status && <button onClick={() => setStatus("")} className="text-xs text-primary mt-2">{status} · dismiss</button>}
      </div>
    </div>
  );
};

// ─── My AI Page ───────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { icon: Wand2, label: "Create something" },
  { icon: Compass, label: "Help me discover" },
  { icon: Users, label: "Find someone" },
  { icon: Layers, label: "Help with my project" },
  { icon: BarChart2, label: "Analyze my activity" },
  { icon: Shield, label: "What do you know about me?" },
];

const AI_MEMORY = [
  { cat: "Interests", items: ["AI & Machine Learning", "Programming", "Cinematography", "Travel"] },
  { cat: "Goals", items: ["Build a startup", "Improve storytelling", "Reach Creator Level 80"] },
  { cat: "Projects", items: ["Tokyo Cinematic Series", "AI Art Generator Tool"] },
  { cat: "Creative style", items: ["Cinematic", "Minimal", "Data-driven storytelling"] },
];

const MyAIPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [input, setInput] = useState("");
  const [aiTab, setAiTab] = useState<"chat" | "memory">("chat");
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Hey Alex! What can I help you with today?" }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = (text?: string) => {
    const t = text || input.trim();
    if (!t) return;
    const next = [...msgs, { role: "user", text: t }];
    setMsgs(next);
    setInput("");
    setTimeout(() => {
      setMsgs(p => [...p, { role: "ai", text: getAIResponse(t) }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 700);
  };

  const getAIResponse = (q: string): string => {
    if (q.toLowerCase().includes("creat")) return "Based on your style, I'd suggest a short-form cinematic video — you've been on a streak with those. Want me to start an AI Creator session?";
    if (q.toLowerCase().includes("discover")) return "I found 4 creators whose work aligns with your AI interests. Sofia Martini just published a new design system you might find inspiring.";
    if (q.toLowerCase().includes("find") || q.toLowerCase().includes("someone")) return "Opening AI Talent Finder — tell me what you're looking for and I'll match you with the right people.";
    if (q.toLowerCase().includes("project")) return "Your Tokyo Cinematic Series has 3 pending collaborator requests. Want to review them, or should I suggest who fits best?";
    return "I'm on it. Based on your history, I have a few ideas that could work well. Want me to elaborate?";
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col h-full">
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Sparkles size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg" style={{ fontFamily: "var(--font-display)" }}>Your AI</h1>
            <p className="text-xs text-muted-foreground">Personal digital companion</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setAiTab("chat")} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${aiTab === "chat" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Chat</button>
          <button onClick={() => setAiTab("memory")} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${aiTab === "memory" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Memory</button>
        </div>
      </div>

      {aiTab === "chat" && (
        <>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Quick actions</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
                <button key={label} onClick={() => send(label)} className="flex items-center gap-1.5 bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0">
                  <Icon size={12} />{label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Sparkles size={13} className="text-primary-foreground" /></div>}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "ai" ? "bg-card border border-border text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="px-4 py-3 border-t border-border">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="What can I help you with?" className="flex-1 bg-input-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              <button onClick={() => send()} className="bg-primary text-primary-foreground px-4 rounded-xl hover:bg-primary/90 transition-colors"><Send size={16} /></button>
            </div>
          </div>
        </>
      )}

      {aiTab === "memory" && (
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-6">
          <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-foreground mb-1">What I know about you</p>
            <p className="text-xs text-muted-foreground leading-relaxed">This is built from your activity and what you've shared. You're always in control — edit or remove anything below.</p>
          </div>
          {AI_MEMORY.map(section => (
            <div key={section.cat} className="bg-card rounded-2xl border border-border p-4 mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{section.cat}</p>
              <div className="flex flex-wrap gap-2">
                {section.items.map(item => (
                  <span key={item} className="bg-muted text-foreground text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    {item}
                    <button className="text-muted-foreground hover:text-destructive transition-colors"><X size={10} /></button>
                  </span>
                ))}
                <button className="bg-muted text-primary text-xs px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">+ Add</button>
              </div>
            </div>
          ))}
          <div className="space-y-2 mt-4">
            <button className="w-full bg-muted hover:bg-muted/70 text-foreground text-sm font-medium py-3 rounded-xl transition-colors flex items-center justify-between px-4">
              Edit preferences <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            <button className="w-full bg-muted hover:bg-muted/70 text-muted-foreground text-sm font-medium py-3 rounded-xl transition-colors">
              Pause personalization
            </button>
            <button className="w-full bg-destructive/10 hover:bg-destructive/15 text-destructive text-sm font-medium py-3 rounded-xl transition-colors">
              Clear all AI memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Creator Passport Page ────────────────────────────────────────────────────

const PassportPage = ({ navigate }: { navigate: (s: Screen) => void }) => (
  <div className="max-w-md mx-auto">
    <div className="px-4 h-14 flex items-center gap-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
      <button onClick={() => navigate("profile")} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
      <h1 className="font-bold text-foreground flex-1" style={{ fontFamily: "var(--font-display)" }}>Creator Passport</h1>
      <button className="bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1.5"><Share2 size={12} />Share</button>
    </div>

    <div className="px-4 py-6">
      <div className="bg-card rounded-3xl border border-border overflow-hidden mb-5 shadow-sm">
        <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-8">
          <div className="w-16 h-16 rounded-2xl border-4 border-card bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>AK</div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Alex Kim</h2>
              <p className="text-sm text-muted-foreground">@alexkim</p>
              <p className="text-xs text-muted-foreground mt-1">Seoul, South Korea · Member since Jan 2025</p>
            </div>
            <div className="bg-primary/10 rounded-2xl px-4 py-2 text-center">
              <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>74</p>
              <p className="text-[9px] text-primary font-bold uppercase tracking-wider">Creator Lv.</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-5 bg-muted rounded-2xl p-3">
            {[["231", "Creations"], ["19", "Projects"], ["12.8K", "Helpful"], ["42", "Collabs"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-bold text-foreground text-sm">{v}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Skills</p>
            <div className="space-y-2.5">
              {[["AI", 89], ["Programming", 81], ["Video", 64], ["Design", 47]].map(([skill, val]) => (
                <div key={skill as string} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{skill as string}</span>
                  <PBar value={val as number} />
                  <span className="text-xs font-bold text-foreground w-6 text-right">{val as number}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Achievements</p>
            <div className="flex flex-wrap gap-2">
              {["🏆 Level 74", "💡 10K Helpful", "🌍 Global Creator", "🔥 30-day streak", "⭐ Top 8%"].map(a => (
                <span key={a} className="bg-muted text-foreground text-xs px-3 py-1 rounded-full">{a}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="text-xs font-bold text-foreground">PROJECT X</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Verified Creator Passport · 2026</span>
        </div>
      </div>

      <button className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        <Share2 size={16} />Share my passport
      </button>
      <p className="text-center text-xs text-muted-foreground mt-3">Share your passport as a link or PDF. It updates automatically as you grow.</p>
    </div>
  </div>
);

// ─── Events Page ──────────────────────────────────────────────────────────────

const EventsPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [joined, setJoined] = useState(false);
  const leaderboard = [
    { rank: 1, name: "Zara Chen", avatar: "ZC", level: 81, points: 9420, medal: "🥇" },
    { rank: 2, name: "Marcus Rodriguez", avatar: "MR", level: 67, points: 8810, medal: "🥈" },
    { rank: 3, name: "James Okafor", avatar: "JO", level: 74, points: 7900, medal: "🥉" },
    { rank: 4, name: "Sofia Martini", avatar: "SM", level: 58, points: 7240, medal: "" },
    { rank: 5, name: "Alex Kim", avatar: "AK", level: 74, points: 6880, medal: "" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border px-4 h-14 flex items-center">
        <h1 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Events</h1>
      </div>

      <div className="px-4 py-4">
        <div className="bg-card rounded-3xl border border-border overflow-hidden mb-5">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=700&h=300&fit=crop&auto=format" alt="event" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={12} />
                <span className="text-xs font-semibold">Global Event</span>
              </div>
              <h2 className="text-xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>Global AI Creator Week</h2>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5"><Users size={14} /><strong className="text-foreground">184K</strong> participants</div>
              <div className="flex items-center gap-1.5"><Calendar size={14} />Aug 19–25, 2026</div>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4">The biggest AI creation event of the year. Show what you can build, collaborate with creators worldwide, and compete for global recognition.</p>
            <button onClick={() => setJoined(v => !v)} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${joined ? "bg-muted text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
              {joined ? "✓ Joined — You're in!" : "Join Event"}
            </button>
          </div>
        </div>

        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Active Challenges</h2>
        <div className="space-y-3 mb-6">
          {[
            { name: "AI Video Challenge", desc: "Create a short film using AI tools", participants: "42.1K", days: 5, color: "text-violet-500", bg: "bg-violet-500/10" },
            { name: "AI Art Challenge", desc: "Generate + hand-edit a piece in your style", participants: "38.7K", days: 5, color: "text-rose-500", bg: "bg-rose-500/10" },
            { name: "Build Something", desc: "Ship a working product or tool", participants: "28.4K", days: 6, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map(ch => (
            <div key={ch.name} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${ch.bg} flex items-center justify-center flex-shrink-0`}><Flame size={18} className={ch.color} /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{ch.name}</p>
                <p className="text-xs text-muted-foreground">{ch.desc}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Users size={10} />{ch.participants} · {ch.days}d left
                </div>
              </div>
              <button className="bg-muted text-foreground text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all flex-shrink-0">Join</button>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Leaderboard</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {leaderboard.map((p, i) => (
            <div key={p.rank} className={`flex items-center gap-3 px-4 py-3 ${i < leaderboard.length - 1 ? "border-b border-border" : ""} ${p.name === "Alex Kim" ? "bg-primary/5" : ""}`}>
              <span className="text-sm font-bold text-muted-foreground w-5 text-center">{p.medal || p.rank}</span>
              <Av text={p.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{p.name} {p.name === "Alex Kim" && <span className="text-xs text-primary font-normal">(you)</span>}</p>
              </div>
              <LvBadge level={p.level} />
              <span className="text-sm font-bold text-foreground">{p.points.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Notifications Page ───────────────────────────────────────────────────────

const NotificationsPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [notifs, setNotifs] = useState(NOTIFS);
  const markAll = () => setNotifs(p => p.map(n => ({ ...n, unread: false })));
  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Notifications</h1>
        <button onClick={markAll} className="text-xs text-primary font-medium hover:underline">Mark all read</button>
      </div>
      <div className="divide-y divide-border">
        {notifs.map(n => (
          <button key={n.id} onClick={() => navigate("notification-detail")} className={`w-full text-left flex items-start gap-3 px-4 py-4 transition-colors hover:bg-muted/40 ${n.unread ? "bg-primary/3" : ""}`}>
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-xl flex-shrink-0">{n.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed">{n.text}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Rankings Page ────────────────────────────────────────────────────────────

const fmtTotal = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : `${Math.round(n / 1000)}K`;
const RANK_TABS = [{ id: "overview", label: "Overview" }, { id: "friends", label: "Friends" }, { id: "categories", label: "Categories" }, { id: "nearby", label: "Nearby" }];
const WEEK_BARS = [44, 32, 68, 91, 55, 78, 85];
const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const RankingsPage = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [tab, setTab] = useState<"overview" | "friends" | "categories" | "nearby">("overview");
  const [rankSearch, setRankSearch] = useState("");
  const prevFriend = FRIEND_RANKS.find(f => f.rank === MY_RANK.global - 1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <h1 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>World Ranking</h1>
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1.5 rounded-full">
            <Globe size={11} /> Global
          </div>
        </div>
        <div className="flex border-b border-border">
          {RANK_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.id ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-8 space-y-4">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && <>
          {/* Hero rank card */}
          <div className="bg-card rounded-3xl border border-border p-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/6 rounded-full pointer-events-none" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Your World Rank</p>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground leading-none" style={{ fontFamily: "var(--font-display)" }}>#8,888</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">
                  out of <strong className="text-foreground">{fmtTotal(MY_RANK.globalTotal)}</strong> creators worldwide
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-3 py-2 text-center flex-shrink-0">
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-base">
                  <TrendingUp size={14} /><span>↑ {MY_RANK.weekChange}</span>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">this week</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm mt-3 pt-3 border-t border-border text-muted-foreground">
              <span>You're in the top</span>
              <strong className="text-primary">0.07%</strong>
              <span>of all creators globally.</span>
            </div>
          </div>

          {/* Country + best category */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: MY_RANK.countryCode, label: MY_RANK.countryName, rank: MY_RANK.countryRank, total: MY_RANK.countryTotal, change: 12 },
              { emoji: "🎥", label: "Video Creators", rank: 27, total: 312000, change: 8 },
            ].map(c => (
              <div key={c.label} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <span>{c.emoji}</span><span>{c.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-0.5" style={{ fontFamily: "var(--font-display)" }}>#{c.rank.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">of {fmtTotal(c.total)}</p>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold mt-2">
                  <TrendingUp size={10} />↑ {c.change} this week
                </div>
              </div>
            ))}
          </div>

          {/* Weekly progress bar chart */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-foreground">Weekly Progress</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Flame size={11} />Best week: +{MY_RANK.bestWeek.toLocaleString()}
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-16 mb-2.5">
              {WEEK_BARS.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-sm transition-all duration-500 ${i === 6 ? "bg-primary" : "bg-muted"}`} style={{ height: `${h}%`, minHeight: 4 }} />
                  <span className="text-[9px] text-muted-foreground">{WEEK_LABELS[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <span>Total movement this week</span>
              <span className="font-bold text-emerald-500">↑ {MY_RANK.weekChange} positions</span>
            </div>
          </div>

          {/* Next targets — quality-focused */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground">What moves your rank</p>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Quality over quantity</span>
            </div>
            <div className="space-y-2">
              {RANK_TARGETS.map((t, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{t.action}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (t.progress / t.total) * 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{t.progress}/{t.total}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 flex-shrink-0 whitespace-nowrap">{t.reward}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ── FRIENDS ── */}
        {tab === "friends" && <>
          {/* 1 place ahead callout */}
          {prevFriend && (
            <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-2xl mt-0.5">🏁</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">1 place ahead of you</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {prevFriend.name} — <strong className="text-foreground">#{prevFriend.rank.toLocaleString()}</strong>
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-muted-foreground">Next target</p>
                <p className="text-xs font-bold text-primary mt-0.5">Reach #{(MY_RANK.global - 1).toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Keep building 🚀</p>
              </div>
            </div>
          )}

          {/* Friends leaderboard */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Your Friends</p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {FRIEND_RANKS.map((f, i) => {
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div key={f.name} className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${f.isYou ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                    <span className="w-7 text-center text-base flex-shrink-0">
                      {medals[i] || <span className="text-sm font-semibold text-muted-foreground">{i + 1}</span>}
                    </span>
                    <Av text={f.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-sm font-semibold ${f.isYou ? "text-primary" : "text-foreground"}`}>{f.name}</span>
                        {f.isYou && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">you</span>}
                        <LvBadge level={f.level} />
                      </div>
                      <span className={`text-[11px] font-medium ${f.change > 0 ? "text-emerald-500" : "text-rose-400"}`}>
                        {f.change > 0 ? "↑" : "↓"} {Math.abs(f.change)} this week
                      </span>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${f.isYou ? "text-primary" : "text-foreground"}`}>
                      #{f.rank.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="w-full border border-dashed border-border rounded-2xl py-4 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
            + Invite friends to compare rankings
          </button>
        </>}

        {/* ── CATEGORIES ── */}
        {tab === "categories" && <>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Global & Country</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { emoji: "🌍", label: "Global", rank: MY_RANK.global, total: MY_RANK.globalTotal, change: MY_RANK.weekChange },
                { emoji: MY_RANK.countryCode, label: MY_RANK.countryName, rank: MY_RANK.countryRank, total: MY_RANK.countryTotal, change: 12 },
              ].map(c => (
                <div key={c.label} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base">{c.emoji}</span>
                    <span className="text-xs text-muted-foreground">{c.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-0.5" style={{ fontFamily: "var(--font-display)" }}>#{c.rank.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">of {fmtTotal(c.total)}</p>
                  <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${c.change > 0 ? "text-emerald-500" : "text-rose-400"}`}>
                    <TrendingUp size={10} />{c.change > 0 ? "↑" : "↓"} {Math.abs(c.change)} this week
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">By Category</p>
            <div className="grid grid-cols-2 gap-3">
              {CAT_RANKS.map(c => (
                <div key={c.id} className="bg-card rounded-2xl border border-border p-4 hover:border-primary/30 transition-all cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{c.emoji}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.change > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-400/10 text-rose-400"}`}>
                      {c.change > 0 ? "↑" : "↓"}{Math.abs(c.change)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-1 font-medium">{c.label}</p>
                  <p className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>#{c.rank.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">of {fmtTotal(c.total)}</p>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ── NEARBY ── */}
        {tab === "nearby" && <>
          {/* Progress banner */}
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <TrendingUp size={15} className="text-emerald-500" /> You're moving up
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">↑ {MY_RANK.weekChange} positions this week</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Next milestone</p>
              <p className="text-sm font-bold text-primary mt-0.5">Reach #8,500</p>
              <p className="text-[10px] text-muted-foreground">~388 positions away</p>
            </div>
          </div>

          {/* Nearby list */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Creators Near You</p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {NEARBY_CREATORS.map((c, i) => (
                <div key={c.rank}>
                  {c.isYou && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/8">
                      <div className="flex-1 h-px bg-primary/25" />
                      <span className="text-[9px] font-bold text-primary uppercase tracking-[0.15em] whitespace-nowrap flex items-center gap-1">
                        <MapPin size={9} /> YOU ARE HERE
                      </span>
                      <div className="flex-1 h-px bg-primary/25" />
                    </div>
                  )}
                  <div className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${i < NEARBY_CREATORS.length - 1 ? "border-b border-border" : ""} ${c.isYou ? "bg-primary/5" : c.isFriend ? "bg-muted/30 hover:bg-muted/50" : "hover:bg-muted/20"}`}>
                    <span className={`text-sm font-bold w-14 flex-shrink-0 ${c.isYou ? "text-primary" : "text-muted-foreground"}`}>
                      #{c.rank.toLocaleString()}
                    </span>
                    <Av text={c.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-sm font-semibold ${c.isYou ? "text-primary" : "text-foreground"}`}>{c.name}</span>
                        {c.isYou && <span className="text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">you</span>}
                        {c.isFriend && !c.isYou && <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">friend</span>}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-muted-foreground">{c.country}</span>
                        <LvBadge level={c.level} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next friend target */}
          <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🏁</span>
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Next friend to pass</p>
              <p className="text-sm font-bold text-foreground mt-0.5">Begzod Karimov — #8,887</p>
              <p className="text-xs text-muted-foreground">Just 1 position away</p>
            </div>
            <button className="bg-primary text-primary-foreground text-xs font-bold px-3.5 py-2 rounded-full hover:bg-primary/90 transition-colors flex-shrink-0">
              Keep building
            </button>
          </div>

          {/* Creator search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={rankSearch} onChange={e => setRankSearch(e.target.value)} placeholder="Search any creator's rank..." className="w-full bg-input-background border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
        </>}

      </div>
    </div>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────

const SettingsPage = ({ navigate, darkMode, toggleDark }: { navigate: (s: Screen) => void; darkMode: boolean; toggleDark: () => void }) => {
  const [toggles, setToggles] = useState({ push: true, email: false, mature: false, pause: false, rankGlobal: true, rankCountry: true, rankFriends: true, rankShowOthers: true });
  const tog = (k: keyof typeof toggles) => setToggles(p => ({ ...p, [k]: !p[k] }));
  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${on ? "bg-primary" : "bg-muted"}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-all ${on ? "left-5" : "left-1"}`} />
    </button>
  );

  const groups = [
    { title: "Account", items: [{ label: "Edit Profile", icon: User }, { label: "Username & Email", icon: Lock }] },
    { title: "Privacy", items: [{ label: "Who can see your profile", icon: Eye }, { label: "Who can message you", icon: MessageCircle }] },
    { title: "AI Memory", items: [{ label: "What I know about you", icon: Sparkles }, { label: "Edit Preferences", icon: Edit3 }] },
    { title: "Security", items: [{ label: "Two-factor authentication", icon: Shield }, { label: "Login activity", icon: Lock }] },
    { title: "Language", items: [{ label: "App language: English", icon: Languages }, { label: "Content language", icon: Globe }] },
    { title: "Safety Center", items: [{ label: "Report content", icon: Shield }, { label: "Blocked accounts", icon: X }, { label: "Appeal a decision", icon: ChevronRight }] },
  ];

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border px-4 h-14 flex items-center">
        <h1 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
      </div>
      <div className="px-4 py-4 pb-6 space-y-5">
        {groups.map(g => (
          <div key={g.title}>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">{g.title}</p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {g.items.map(({ label, icon: Icon }) => (
                <button key={label} onClick={label === "What I know about you" ? () => navigate("my-ai") : label === "Edit Profile" || label === "Username & Email" ? () => navigate("account") : g.title === "Safety Center" ? () => navigate("safety") : undefined} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left">
                  <Icon size={16} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground flex-1">{label}</span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Notifications</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-3.5"><Bell size={16} className="text-muted-foreground" /><span className="text-sm text-foreground flex-1">Push notifications</span><Toggle on={toggles.push} onClick={() => tog("push")} /></div>
            <div className="flex items-center gap-3 px-4 py-3.5"><Bell size={16} className="text-muted-foreground" /><span className="text-sm text-foreground flex-1">Email updates</span><Toggle on={toggles.email} onClick={() => tog("email")} /></div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Rankings & Visibility</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            <button onClick={() => navigate("rankings")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left">
              <Globe size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground flex-1">View my World Ranking</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Globe size={16} className="text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-foreground block">World Rank visible</span>
                <span className="text-[11px] text-muted-foreground">Others can see your global ranking</span>
              </div>
              <Toggle on={toggles.rankGlobal} onClick={() => tog("rankGlobal")} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-sm w-4 text-center flex-shrink-0">🇺🇿</span>
              <div className="flex-1">
                <span className="text-sm text-foreground block">Country Rank visible</span>
                <span className="text-[11px] text-muted-foreground">Show your country ranking on profile</span>
              </div>
              <Toggle on={toggles.rankCountry} onClick={() => tog("rankCountry")} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Users size={16} className="text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-foreground block">Friends ranking</span>
                <span className="text-[11px] text-muted-foreground">Participate in friend comparisons</span>
              </div>
              <Toggle on={toggles.rankFriends} onClick={() => tog("rankFriends")} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Eye size={16} className="text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-foreground block">Show my position to others</span>
                <span className="text-[11px] text-muted-foreground">Appear in nearby rankings lists</span>
              </div>
              <Toggle on={toggles.rankShowOthers} onClick={() => tog("rankShowOthers")} />
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Appearance</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-3.5">
              {darkMode ? <Moon size={16} className="text-muted-foreground" /> : <Sun size={16} className="text-muted-foreground" />}
              <span className="text-sm text-foreground flex-1">Dark mode</span>
              <Toggle on={darkMode} onClick={toggleDark} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5"><Shield size={16} className="text-muted-foreground" /><span className="text-sm text-foreground flex-1">Pause AI personalization</span><Toggle on={toggles.pause} onClick={() => tog("pause")} /></div>
          </div>
        </div>

        <div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            <button onClick={() => navigate("landing")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left text-destructive">
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

const PRE_AUTH: Screen[] = ["landing", "signup", "interests", "ai-onboarding", "login", "forgot-password", "recovery"];

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => localStorage.getItem("px-session") ? "home" : "landing");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community>(COMMUNITIES[0]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(CONVERSATIONS[0]);
  const [selectedAudio, setSelectedAudio] = useState<Track>(TRACKS[0]);

  const navigate = (s: string) => setScreen(s as Screen);
  const toggleDark = () => setDarkMode(v => !v);
  const isAuth = !PRE_AUTH.includes(screen);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {!isAuth && (
          <>
            {screen === "landing" && <LandingPage navigate={navigate} darkMode={darkMode} toggleDark={toggleDark} />}
            {screen === "signup" && <SignUpPage navigate={navigate} />}
            {screen === "interests" && <InterestsPage navigate={navigate} />}
            {screen === "ai-onboarding" && <AIOnboardingPage navigate={navigate} />}
            {screen === "login" && <LoginPage navigate={navigate} onLogin={() => navigate("home")} />}
            {screen === "forgot-password" && <ForgotPasswordPage navigate={navigate} />}
            {screen === "recovery" && <RecoveryPage navigate={navigate} />}
          </>
        )}
        {isAuth && (
          <AppShell screen={screen} navigate={navigate} darkMode={darkMode} toggleDark={toggleDark}>
            {screen === "home" && <HomePage navigate={navigate} />}
            {screen === "discover" && <DiscoverPage navigate={navigate} />}
            {screen === "create" && <CreatePage navigate={navigate} />}
            {screen === "ai-creator" && <AICreatorPage navigate={navigate} />}
            {screen === "profile" && <ProfilePage navigate={navigate} />}
            {screen === "creator-level" && <CreatorLevelPage navigate={navigate} />}
            {screen === "communities" && <CommunitiesPage navigate={navigate} setSelectedCommunity={setSelectedCommunity} />}
            {screen === "community-detail" && <CommunityDetailPage community={selectedCommunity} navigate={navigate} />}
            {screen === "messages" && <MessagesPage navigate={navigate} setSelectedConversation={setSelectedConversation} />}
            {screen === "chat" && <ChatPage conversation={selectedConversation} navigate={navigate} />}
            {screen === "my-ai" && <MyAIPage navigate={navigate} />}
            {screen === "rankings" && <RankingsPage navigate={navigate} />}
            {screen === "passport" && <PassportPage navigate={navigate} />}
            {screen === "events" && <EventsPage navigate={navigate} />}
            {screen === "notifications" && <NotificationsPage navigate={navigate} />}
            {screen === "settings" && <SettingsPage navigate={navigate} darkMode={darkMode} toggleDark={toggleDark} />}
            {screen === "stories" && <StoriesPage navigate={navigate} />}
            {screen === "story-create" && <StoryCreatePage navigate={navigate} />}
            {screen === "music" && <MusicLibraryPage navigate={navigate} onDetail={track => { setSelectedAudio(track); navigate("audio-detail"); }} onUse={track => { setSelectedAudio(track); navigate("reel-create"); }} />}
            {screen === "audio-detail" && <AudioDetailPage track={selectedAudio} navigate={navigate} onUse={track => { setSelectedAudio(track); navigate("reel-create"); }} />}
            {screen === "reel-create" && <ReelCreatePage navigate={navigate} audio={selectedAudio} />}
            {screen === "saved" && <SavedPage navigate={navigate} />}
            {screen === "collections" && <CollectionsPage navigate={navigate} />}
            {screen === "notes" && <NotesPage navigate={navigate} />}
            {screen === "search" && <GlobalSearchPage navigate={navigate} />}
            {screen === "account" && <AccountPage navigate={navigate} />}
            {screen === "drafts" && <DraftsPage navigate={navigate} />}
            {screen === "activity" && <ActivityPage navigate={navigate} />}
            {screen === "safety" && <SafetyPage navigate={navigate} />}
            {screen === "notification-detail" && <NotificationDetailPage navigate={navigate} />}
          </AppShell>
        )}
      </div>
    </div>
  );
}
