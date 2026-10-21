import {
  Brain,
  Cpu,
  Database,
  Webhook,
  MessageCircle,
  Slack,
  Users,
  Search,
  FileText,
  ScanLine,
  ShieldCheck,
  Zap,
  GitBranch,
  Activity,
  Gauge,
} from 'lucide-react';

export type WorkflowMode = {
  id: string;
  label: string;
  sublabel: string;
  description: string;
  accent: 'cyan' | 'purple';
  stats: { label: string; value: string; delta: string }[];
  outputs: { icon: typeof Webhook; label: string; sub: string }[];
};

export const WORKFLOW_MODES: WorkflowMode[] = [
  {
    id: 'content',
    label: 'AI Content Engine',
    sublabel: 'Reasoning → Multi-channel publishing',
    description:
      'A Dify reasoning agent drafts, critiques, and iterates long-form content, then routes the finalized asset through n8n to Telegram, Slack, and your CRM in a single deterministic pass.',
    accent: 'cyan',
    stats: [
      { label: 'Tokens / run', value: '48.2K', delta: '+12%' },
      { label: 'Avg latency', value: '1.4s', delta: '-180ms' },
      { label: 'Success rate', value: '99.97%', delta: '+0.03%' },
    ],
    outputs: [
      { icon: MessageCircle, label: 'Telegram', sub: 'Channel broadcast' },
      { icon: Slack, label: 'Slack', sub: '#content-feed' },
      { icon: Users, label: 'CRM', sub: 'HubSpot log' },
    ],
  },
  {
    id: 'lead',
    label: 'Lead Scoring Agent',
    sublabel: 'Enrichment → Predictive ranking',
    description:
      'Inbound webhook triggers a Dify classifier that fuses firmographic + behavioral signals into a 0–100 score. n8n fans the verdict out to sales channels with auto-retry on rate limits.',
    accent: 'purple',
    stats: [
      { label: 'Leads / hour', value: '3,240', delta: '+8%' },
      { label: 'Score accuracy', value: '94.6%', delta: '+1.2%' },
      { label: 'Avg latency', value: '640ms', delta: '-90ms' },
    ],
    outputs: [
      { icon: Slack, label: 'Slack', sub: '#sales-alerts' },
      { icon: Users, label: 'CRM', sub: 'Pipedrive deal' },
      { icon: Webhook, label: 'Webhook', sub: 'Internal API' },
    ],
  },
  {
    id: 'research',
    label: 'Autonomous Research',
    sublabel: 'RAG retrieval → Synthesized reports',
    description:
      'A multi-step Dify agent queries a hybrid Pinecone vector store, cross-references sources, and compiles a cited brief. n8n schedules, retries, and archives every run.',
    accent: 'cyan',
    stats: [
      { label: 'Sources / brief', value: '142', delta: '+24' },
      { label: 'Retrieval p95', value: '780ms', delta: '-120ms' },
      { label: 'Citation rate', value: '100%', delta: '0%' },
    ],
    outputs: [
      { icon: FileText, label: 'Docs', sub: 'Notion page' },
      { icon: Database, label: 'Vector DB', sub: 'Pinecone archive' },
      { icon: Webhook, label: 'Webhook', sub: 'Slack digest' },
    ],
  },
];

export type Blueprint = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  nodes: number;
  difficulty: 'Core' | 'Advanced' | 'Expert';
  accent: 'cyan' | 'purple';
  nodes_preview: { icon: typeof Brain; label: string; type: 'dify' | 'n8n' }[];
  api: string;
};

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'rag-guard',
    name: 'RAG Anti-Deletion Index Guard',
    tagline: 'Detect & repair orphaned vector embeddings before they poison retrieval.',
    category: 'Reliability',
    nodes: 7,
    difficulty: 'Advanced',
    accent: 'cyan',
    nodes_preview: [
      { icon: Database, label: 'Pinecone Scan', type: 'n8n' },
      { icon: Brain, label: 'Consistency Check', type: 'dify' },
      { icon: ShieldCheck, label: 'Auto-Reindex', type: 'n8n' },
    ],
    api: 'nexora.blueprint.deploy("rag-guard", { region: "us-east" })',
  },
  {
    id: 'vision-qa',
    name: 'Two-Stage Multi-Model Vision QA',
    tagline: 'GPT-4o proposes, Claude verifies — zero hallucination image auditing.',
    category: 'Quality',
    nodes: 9,
    difficulty: 'Expert',
    accent: 'purple',
    nodes_preview: [
      { icon: ScanLine, label: 'GPT-4o Vision', type: 'dify' },
      { icon: Brain, label: 'Claude Verify', type: 'dify' },
      { icon: ShieldCheck, label: 'QA Gate', type: 'n8n' },
    ],
    api: 'nexora.blueprint.deploy("vision-qa", { models: 2 })',
  },
  {
    id: 'lead-router',
    name: 'Predictive Lead Router',
    tagline: 'Score, segment, and route inbound leads to the right rep in <800ms.',
    category: 'Revenue',
    nodes: 6,
    difficulty: 'Core',
    accent: 'cyan',
    nodes_preview: [
      { icon: Webhook, label: 'Inbound Catch', type: 'n8n' },
      { icon: Brain, label: 'Score Agent', type: 'dify' },
      { icon: Users, label: 'CRM Route', type: 'n8n' },
    ],
    api: 'nexora.blueprint.deploy("lead-router", { crm: "hubspot" })',
  },
  {
    id: 'auto-research',
    name: 'Autonomous Research Brief',
    tagline: 'Self-directed literature review with cited, archived output.',
    category: 'Research',
    nodes: 11,
    difficulty: 'Expert',
    accent: 'purple',
    nodes_preview: [
      { icon: Search, label: 'Query Planner', type: 'dify' },
      { icon: Database, label: 'Hybrid RAG', type: 'dify' },
      { icon: FileText, label: 'Brief Composer', type: 'n8n' },
    ],
    api: 'nexora.blueprint.deploy("auto-research", { depth: "deep" })',
  },
  {
    id: 'rate-shield',
    name: 'Rate-Limit Shield & Backoff',
    tagline: 'Adaptive concurrency control across every upstream LLM provider.',
    category: 'Reliability',
    nodes: 5,
    difficulty: 'Core',
    accent: 'cyan',
    nodes_preview: [
      { icon: Gauge, label: 'Limit Probe', type: 'n8n' },
      { icon: GitBranch, label: 'Backoff Logic', type: 'n8n' },
      { icon: Zap, label: 'Queue Flush', type: 'n8n' },
    ],
    api: 'nexora.blueprint.deploy("rate-shield", { strategy: "adaptive" })',
  },
  {
    id: 'multi-synth',
    name: 'Multi-Model Content Synthesis',
    tagline: 'Parallel drafts from 3 models, merged by a critic agent into one voice.',
    category: 'Content',
    nodes: 8,
    difficulty: 'Advanced',
    accent: 'purple',
    nodes_preview: [
      { icon: Cpu, label: 'Parallel Draft', type: 'dify' },
      { icon: Brain, label: 'Critic Merge', type: 'dify' },
      { icon: Activity, label: 'Publish Fanout', type: 'n8n' },
    ],
    api: 'nexora.blueprint.deploy("multi-synth", { models: 3 })',
  },
];

export type Expert = {
  id: string;
  name: string;
  role: string;
  workflow: string;
  accent: 'cyan' | 'purple';
  initials: string;
};

export const EXPERTS: Expert[] = [
  {
    id: 'e1',
    name: 'Aria Kondo',
    role: 'Head of AI Platform',
    workflow: 'RAG Anti-Deletion Index Guard',
    accent: 'cyan',
    initials: 'AK',
  },
  {
    id: 'e2',
    name: 'Devon Pierce',
    role: 'Staff ML Engineer',
    workflow: 'Two-Stage Multi-Model Vision QA',
    accent: 'purple',
    initials: 'DP',
  },
  {
    id: 'e3',
    name: 'Mei Lin Zhao',
    role: 'Automation Architect',
    workflow: 'Predictive Lead Router',
    accent: 'cyan',
    initials: 'MZ',
  },
  {
    id: 'e4',
    name: 'Søren Vahl',
    role: 'Principal Research Eng',
    workflow: 'Autonomous Research Brief',
    accent: 'purple',
    initials: 'SV',
  },
];
