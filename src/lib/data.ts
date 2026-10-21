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
    label: 'Craft Engine // Studio',
    sublabel: 'Graphic Precision → Deterministic Fanout',
    description:
      'Expressing the tension between graphic design precision and code automation: A Dify agent curates and formats structured brand assets, while n8n executes 100% deterministic fanout across production channels.',
    accent: 'cyan',
    stats: [
      { label: 'Craft Precision', value: '1px', delta: 'Swiss Grid' },
      { label: 'Execution Speed', value: '1.4s', delta: '-180ms' },
      { label: 'Engine SLA', value: '99.99%', delta: '+0.02%' },
    ],
    outputs: [
      { icon: MessageCircle, label: 'Telegram', sub: 'Broadcast Node' },
      { icon: Slack, label: 'Slack', sub: '#craft-feed' },
      { icon: Users, label: 'CRM', sub: 'HubSpot Log' },
    ],
  },
  {
    id: 'lead',
    label: 'Node Scoring Engine',
    sublabel: 'Telemetric Data → Predictive Routing',
    description:
      'Inbound Webhook events feed an ARTIFICIAL CRAFT neural filter. Firmographic and real-time behavioral vectors are fused into a sharp, deterministic score with rate-limit resiliency.',
    accent: 'purple',
    stats: [
      { label: 'Events / sec', value: '3,240', delta: '+12%' },
      { label: 'Filter Accuracy', value: '98.4%', delta: '+1.8%' },
      { label: 'Avg Latency', value: '420ms', delta: '-120ms' },
    ],
    outputs: [
      { icon: Slack, label: 'Slack', sub: '#sales-nodes' },
      { icon: Users, label: 'CRM', sub: 'Pipedrive Sync' },
      { icon: Webhook, label: 'Webhook', sub: 'Core API' },
    ],
  },
  {
    id: 'research',
    label: 'Artificial RAG Matrix',
    sublabel: 'Vector Retrieval → Structured Briefs',
    description:
      'Deep hybrid vector RAG retrieval with BM25 cross-reranking. The Dify reasoning core builds citations while n8n enforces zero-drift schema compliance.',
    accent: 'cyan',
    stats: [
      { label: 'Vector Nodes', value: '142', delta: 'Pinecone' },
      { label: 'RAG Latency', value: '540ms', delta: '-210ms' },
      { label: 'Schema Drift', value: '0.00%', delta: 'Deterministic' },
    ],
    outputs: [
      { icon: FileText, label: 'Docs', sub: 'Notion Sync' },
      { icon: Database, label: 'Vector Store', sub: 'Pinecone Node' },
      { icon: Webhook, label: 'Webhook', sub: 'Slack Digest' },
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
    tagline: 'Detect and repair orphaned vector embeddings before they disrupt retrieval precision.',
    category: 'Reliability',
    nodes: 7,
    difficulty: 'Advanced',
    accent: 'cyan',
    nodes_preview: [
      { icon: Database, label: 'Pinecone Scan', type: 'n8n' },
      { icon: Brain, label: 'Consistency Check', type: 'dify' },
      { icon: ShieldCheck, label: 'Auto-Reindex', type: 'n8n' },
    ],
    api: 'craft.blueprint.deploy("rag-guard", { region: "us-east" })',
  },
  {
    id: 'vision-qa',
    name: 'Two-Stage Multi-Model Vision QA',
    tagline: 'GPT-4o proposes, Claude verifies — zero-hallucination brutalist layout auditor.',
    category: 'Quality',
    nodes: 9,
    difficulty: 'Expert',
    accent: 'purple',
    nodes_preview: [
      { icon: ScanLine, label: 'GPT-4o Vision', type: 'dify' },
      { icon: Brain, label: 'Claude Verify', type: 'dify' },
      { icon: ShieldCheck, label: 'QA Gate', type: 'n8n' },
    ],
    api: 'craft.blueprint.deploy("vision-qa", { models: 2 })',
  },
  {
    id: 'lead-router',
    name: 'Predictive Lead Router Node',
    tagline: 'Score, segment, and route inbound leads to rep nodes in under 400ms.',
    category: 'Revenue',
    nodes: 6,
    difficulty: 'Core',
    accent: 'cyan',
    nodes_preview: [
      { icon: Webhook, label: 'Inbound Catch', type: 'n8n' },
      { icon: Brain, label: 'Score Agent', type: 'dify' },
      { icon: Users, label: 'CRM Route', type: 'n8n' },
    ],
    api: 'craft.blueprint.deploy("lead-router", { crm: "hubspot" })',
  },
  {
    id: 'auto-research',
    name: 'Autonomous Research Matrix',
    tagline: 'Self-directed literature synthesis with Swiss precision citations and immutable archives.',
    category: 'Research',
    nodes: 11,
    difficulty: 'Expert',
    accent: 'purple',
    nodes_preview: [
      { icon: Search, label: 'Query Planner', type: 'dify' },
      { icon: Database, label: 'Hybrid RAG', type: 'dify' },
      { icon: FileText, label: 'Brief Composer', type: 'n8n' },
    ],
    api: 'craft.blueprint.deploy("auto-research", { depth: "deep" })',
  },
  {
    id: 'rate-shield',
    name: 'Rate-Limit Shield & Backoff Node',
    tagline: 'Adaptive concurrency control and deterministic queue flushing across LLM clusters.',
    category: 'Reliability',
    nodes: 5,
    difficulty: 'Core',
    accent: 'cyan',
    nodes_preview: [
      { icon: Gauge, label: 'Limit Probe', type: 'n8n' },
      { icon: GitBranch, label: 'Backoff Logic', type: 'n8n' },
      { icon: Zap, label: 'Queue Flush', type: 'n8n' },
    ],
    api: 'craft.blueprint.deploy("rate-shield", { strategy: "adaptive" })',
  },
  {
    id: 'multi-synth',
    name: 'Multi-Model Asset Synthesis',
    tagline: 'Parallel generation from 3 models, merged by a design critic agent into one voice.',
    category: 'Content',
    nodes: 8,
    difficulty: 'Advanced',
    accent: 'purple',
    nodes_preview: [
      { icon: Cpu, label: 'Parallel Draft', type: 'dify' },
      { icon: Brain, label: 'Critic Merge', type: 'dify' },
      { icon: Activity, label: 'Publish Fanout', type: 'n8n' },
    ],
    api: 'craft.blueprint.deploy("multi-synth", { models: 3 })',
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
    workflow: 'Predictive Lead Router Node',
    accent: 'cyan',
    initials: 'MZ',
  },
  {
    id: 'e4',
    name: 'Søren Vahl',
    role: 'Principal Research Eng',
    workflow: 'Autonomous Research Matrix',
    accent: 'purple',
    initials: 'SV',
  },
];
