export type Language = 'en' | 'vi';

export interface Translations {
  // Navigation
  nav_engine: string;
  nav_playground: string;
  nav_architecture: string;
  nav_blueprints: string;
  nav_blackbox: string;
  nav_experts: string;
  nav_deploy_node: string;
  nav_studio_console: string;
  nav_vibepath_studio: string;
  nav_studios_hubs: string;
  subtag_version: string;
  logo_subtag: string;

  // Hero Section
  telemetry_prefix: string;
  telemetry_status: string;
  telemetry_sla: string;
  hero_badge_subtag: string;
  hero_badge_text: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  subtitle: string;
  ctaButton: string;
  hero_cta_vibepath: string;
  hero_cta_sandbox: string;
  cta_explore: string;
  exportBlueprint: string;

  // 3D Hook Canvas
  canvas_hook_parallax: string;
  canvas_fps_interactive: string;
  canvas_pos_mouse: string;

  // Simulator Sandbox
  sim_placeholder: string;
  sim_run_btn: string;
  sim_executing: string;
  preset_engine: string;
  preset_swiss: string;
  preset_brutalist: string;
  preset_financial: string;
  workflow_engine: string;
  exec_status_executing: string;
  exec_status_ready: string;
  exec_completed_title: string;
  metric_deterministic: string;
  metric_token_cost: string;
  metric_craft_precision: string;
  run_another_sim: string;
  output_nodes: string;

  // Workflow Modes
  mode_content_label: string;
  mode_content_sublabel: string;
  mode_content_desc: string;
  mode_lead_label: string;
  mode_lead_sublabel: string;
  mode_lead_desc: string;
  mode_research_label: string;
  mode_research_sublabel: string;
  mode_research_desc: string;

  // Bento Grid
  bento_section_label: string;
  bento_title_line1: string;
  bento_title_line2: string;
  bento_desc: string;
  card_hybrid_title: string;
  card_hybrid_desc: string;
  card_vibepath_title: string;
  card_vibepath_desc: string;
  card_vibepath_link: string;
  node_trigger: string;
  node_reason: string;
  node_vector: string;
  node_guard: string;
  node_fanout: string;
  status_typed_tool: string;
  status_streaming_matrix: string;
  status_retry_eligible: string;
  card_rag_title: string;
  card_rag_desc: string;
  rag_latency: string;
  card_det_title: string;
  card_det_desc: string;
  row_retry: string;
  row_rate_limit: string;
  row_dead_letter: string;
  card_router_title: string;
  card_router_desc: string;
  card_telemetry_title: string;
  card_telemetry_desc: string;
  tracing_active: string;
  card_guardrails_title: string;
  card_guardrails_desc: string;

  // Blueprint Library
  bp_section_label: string;
  bp_title_line1: string;
  bp_title_line2: string;
  bp_desc: string;
  copy_api: string;
  copyApi: string;
  copied: string;
  export_clean_screenshot: string;
  exportDiagram: string;
  inspectAst: string;
  copyJson: string;
  rendering_hd: string;
  preview_ready: string;
  export_preview_title: string;
  download_png: string;
  bp_banner_title: string;
  bp_banner_sub: string;
  bp_browse_all: string;
  bp_node_step: string;
  bp_node_engine: string;
  bp_node_latency: string;
  bp_node_output: string;

  // Blueprint Section Headers & Actions
  blueprintSectionTitle: string;
  blueprintSectionSubtitle: string;
  btnDownloadJson: string;
  btnExportHdDiagram: string;
  btnInspectAstJson: string;

  // Blueprint Descriptions
  bpImagePimDesc: string;
  bpLegoProtocolDesc: string;
  bpContourShadowDesc: string;
  bpGrafx3dDesc: string;

  // LinkedIn Banner Studio Form
  banner_studio_title: string;
  banner_full_name: string;
  banner_company_domain: string;
  banner_job_title: string;
  banner_industry: string;
  banner_industry_tech: string;
  banner_industry_design: string;
  banner_industry_finance: string;
  banner_industry_marketing: string;
  banner_palette: string;
  banner_palette_swiss: string;
  banner_palette_cyan: string;
  banner_palette_purple: string;
  banner_palette_amber: string;
  banner_export_button: string;

  // Experts Section
  experts_section_label: string;
  experts_title: string;
  experts_desc: string;
  curated_workflow: string;
  view_blueprint: string;
  stat_workflows: string;
  stat_runs: string;
  stat_regions: string;
  stat_sla: string;

  // Footer Section
  footer_banner_tag: string;
  footer_banner_title: string;
  footer_banner_desc: string;
  footer_start_building: string;
  footer_brand_desc: string;
  col_engine: string;
  col_developers: string;
  col_craft: string;
  link_vibepath_studio: string;
  link_architecture: string;
  link_blueprints: string;
  link_telemetry: string;
  link_changelog: string;
  link_status: string;
  link_documentation: string;
  link_api_reference: string;
  link_cli_tool: string;
  link_self_host: string;
  link_github: string;
  link_about: string;
  link_manifesto: string;
  link_careers: string;
  link_partners: string;
  link_contact: string;
  copyright_text: string;
  status_online: string;
  privacy: string;
  terms: string;
  footerEngineBadge: string;
  footerEngineTitle: string;
  footerEngineDesc: string;
  btnLaunchEngine: string;

  // Plug & Play Sandbox
  sandbox_section_label: string;
  sandbox_title: string;
  sandbox_subtitle: string;
  sandbox_control_panel: string;
  sandbox_cat_organic: string;
  sandbox_cat_structure: string;
  sandbox_cat_biological: string;
  sandbox_select_algo: string;
  sandbox_param_density: string;
  sandbox_param_speed: string;
  sandbox_palette: string;
  sandbox_palette_cyberpunk: string;
  sandbox_palette_monochrome: string;
  sandbox_palette_bauhaus: string;
  sandbox_palette_amber: string;
  sandbox_randomize_seed: string;
  sandbox_export_png: string;
  sandbox_export_svg: string;
  sandbox_telemetry_title: string;
  sandbox_telemetry_status: string;
  sandbox_telemetry_algo: string;
  sandbox_telemetry_category: string;
  sandbox_telemetry_density: string;
  sandbox_telemetry_speed: string;
  sandbox_telemetry_palette: string;
  sandbox_telemetry_seed: string;
  sandbox_telemetry_fps: string;
  sandbox_telemetry_frametime: string;
  sandbox_telemetry_resolution: string;
  sandbox_canvas_interactive: string;

  // CSV Visualizer Section
  csv_section_label: string;
  csv_title: string;
  csv_subtitle: string;
  csv_dropzone_title: string;
  csv_dropzone_desc: string;
  csv_preset_label: string;
  csv_fetch_random: string;
  csv_loading_dataset: string;
  csv_source_url: string;
  csv_preset_latency: string;
  csv_preset_crypto: string;
  csv_preset_telemetry: string;
  csv_col_x: string;
  csv_col_y: string;
  csv_mode_label: string;
  csv_mode_waveform: string;
  csv_mode_matrix: string;
  csv_mode_candlestick: string;
  csv_palette_label: string;
  csv_palette_neon: string;
  csv_palette_mono: string;
  csv_telemetry_title: string;
  csv_telemetry_rows: string;
  csv_telemetry_min: string;
  csv_telemetry_max: string;
  csv_telemetry_avg: string;
  csv_telemetry_fps: string;

  // Existential Blackbox Section
  blackbox_title: string;
  blackbox_subtitle: string;
  blackbox_status_processing: string;
  blackbox_status_idle: string;
  blackbox_framerate: string;
  blackbox_headless: string;
  blackbox_core_logic: string;
  blackbox_manifesto_title: string;
  blackbox_manifesto_quote: string;
  blackbox_portfolio_btn: string;
  blackbox_terminal_title: string;
  blackbox_click_cmd: string;
  blackbox_run: string;
  blackbox_awaiting: string;
  blackbox_manifesto_footer: string;
  blackbox_autonomous: string;
  blackbox_q1_q: string;
  blackbox_q1_a: string;
  blackbox_q2_q: string;
  blackbox_q2_a: string;
  blackbox_q3_q: string;
  blackbox_q3_a: string;
  blackbox_q4_q: string;
  blackbox_q4_a: string;
  blackbox_q5_q: string;
  blackbox_q5_a: string;
  blackbox_q6_q: string;
  blackbox_q6_a: string;

  // Docs Architecture & System Manual (03 // SYSTEM ARCHITECTURE & MANUAL)
  nav_docs_architecture: string;
  nav_docs_architecture_desc: string;

  docs_arch_breadcrumb_spec: string;
  docs_arch_breadcrumb_title: string;
  docs_arch_breadcrumb_node: string;
  docs_arch_zod_enforced: string;
  docs_arch_classification_tag: string;
  docs_arch_ssot_cluster: string;
  docs_arch_public_spec: string;

  docs_arch_hero_title: string;
  docs_arch_hero_desc: string;

  docs_arch_metric_cost_label: string;
  docs_arch_metric_cost_val: string;
  docs_arch_metric_cost_unit: string;
  docs_arch_metric_cost_sub: string;
  docs_arch_metric_fps_label: string;
  docs_arch_metric_fps_val: string;
  docs_arch_metric_fps_sub: string;
  docs_arch_metric_token_label: string;
  docs_arch_metric_token_val: string;
  docs_arch_metric_token_sub: string;
  docs_arch_metric_zod_label: string;
  docs_arch_metric_zod_val: string;
  docs_arch_metric_zod_unit: string;
  docs_arch_metric_zod_sub: string;
  docs_arch_metric_failover_label: string;
  docs_arch_metric_failover_val: string;
  docs_arch_metric_failover_sub: string;

  docs_arch_toc_label: string;
  docs_arch_toc_sec1: string;
  docs_arch_toc_sec2: string;
  docs_arch_toc_sec3: string;
  docs_arch_toc_sec4: string;
  docs_arch_toc_sec5: string;
  docs_arch_toc_sec6: string;
  docs_arch_toc_sec7: string;

  docs_arch_sec1_badge: string;
  docs_arch_sec1_title: string;
  docs_arch_sec1_tag: string;
  docs_arch_sec1_1_title: string;
  docs_arch_sec1_1_desc: string;
  docs_arch_sec1_schematic_title: string;
  docs_arch_sec1_schematic_sync: string;
  docs_arch_tier1_badge: string;
  docs_arch_tier1_name: string;
  docs_arch_tier1_sub: string;
  docs_arch_tier1_desc: string;
  docs_arch_tier1_emit: string;
  docs_arch_tier1_payload: string;
  docs_arch_tier2_badge: string;
  docs_arch_tier2_name: string;
  docs_arch_tier2_sub: string;
  docs_arch_tier2_desc: string;
  docs_arch_tier2_dispatch: string;
  docs_arch_tier2_payload: string;
  docs_arch_tier3_badge: string;
  docs_arch_tier3_name: string;
  docs_arch_tier3_sub: string;
  docs_arch_tier3_desc: string;
  docs_arch_tier3_exec: string;
  docs_arch_tier3_payload: string;
  docs_arch_flow_tier1: string;
  docs_arch_flow_tier2: string;
  docs_arch_flow_tier3: string;

  docs_arch_sec1_2_title: string;
  docs_arch_sec1_2_desc: string;
  docs_arch_table_col_crit: string;
  docs_arch_table_col_old: string;
  docs_arch_table_col_new: string;
  docs_arch_table_r1_crit: string;
  docs_arch_table_r1_old: string;
  docs_arch_table_r1_new: string;
  docs_arch_table_r2_crit: string;
  docs_arch_table_r2_old: string;
  docs_arch_table_r2_new: string;
  docs_arch_table_r3_crit: string;
  docs_arch_table_r3_old: string;
  docs_arch_table_r3_new: string;
  docs_arch_table_r4_crit: string;
  docs_arch_table_r4_old: string;
  docs_arch_table_r4_new: string;
  docs_arch_table_r5_crit: string;
  docs_arch_table_r5_old: string;
  docs_arch_table_r5_new: string;

  docs_arch_sec2_badge: string;
  docs_arch_sec2_title: string;
  docs_arch_sec2_tag: string;
  docs_arch_sec2_1_title: string;
  docs_arch_sec2_1_desc: string;
  docs_arch_fail1_title: string;
  docs_arch_fail1_desc: string;
  docs_arch_fail2_title: string;
  docs_arch_fail2_desc: string;
  docs_arch_fail3_title: string;
  docs_arch_fail3_desc: string;
  docs_arch_fail4_title: string;
  docs_arch_fail4_desc: string;
  docs_arch_sec2_2_title: string;
  docs_arch_comp_col_metric: string;
  docs_arch_comp_col_tsx: string;
  docs_arch_comp_col_json: string;
  docs_arch_comp_r1_metric: string;
  docs_arch_comp_r1_tsx: string;
  docs_arch_comp_r1_json: string;
  docs_arch_comp_r2_metric: string;
  docs_arch_comp_r2_tsx: string;
  docs_arch_comp_r2_json: string;
  docs_arch_comp_r3_metric: string;
  docs_arch_comp_r3_tsx: string;
  docs_arch_comp_r3_json: string;
  docs_arch_comp_r4_metric: string;
  docs_arch_comp_r4_tsx: string;
  docs_arch_comp_r4_json: string;
  docs_arch_sec2_3_title: string;
  docs_arch_sec2_3_desc: string;
  docs_arch_hub1_file: string;
  docs_arch_hub1_desc: string;
  docs_arch_hub2_file: string;
  docs_arch_hub2_desc: string;
  docs_arch_hub3_file: string;
  docs_arch_hub3_desc: string;

  docs_arch_sec3_badge: string;
  docs_arch_sec3_title: string;
  docs_arch_sec3_tag: string;
  docs_arch_sec3_1_title: string;
  docs_arch_sec3_1_desc: string;
  docs_arch_token_obsidian: string;
  docs_arch_token_obsidian_desc: string;
  docs_arch_token_indigo: string;
  docs_arch_token_indigo_desc: string;
  docs_arch_token_cyan: string;
  docs_arch_token_cyan_desc: string;
  docs_arch_token_green: string;
  docs_arch_token_green_desc: string;
  docs_arch_sec3_2_title: string;
  docs_arch_repo_tree_title: string;
  docs_arch_props_interface_title: string;

  docs_arch_sec4_badge: string;
  docs_arch_sec4_title: string;
  docs_arch_sec4_tag: string;
  docs_arch_sec4_1_title: string;
  docs_arch_sec4_1_desc: string;
  docs_arch_gate1_title: string;
  docs_arch_gate1_desc: string;
  docs_arch_gate2_title: string;
  docs_arch_gate2_desc: string;
  docs_arch_gate3_title: string;
  docs_arch_gate3_desc: string;
  docs_arch_inspector_title: string;
  docs_arch_tab_ast: string;
  docs_arch_tab_zod: string;
  docs_arch_tab_stream: string;
  docs_arch_btn_copy: string;
  docs_arch_btn_copied: string;
  docs_arch_btn_validate: string;
  docs_arch_validate_success: string;

  docs_arch_sec5_badge: string;
  docs_arch_sec5_title: string;
  docs_arch_sec5_tag: string;
  docs_arch_sec5_1_title: string;
  docs_arch_sec5_1_desc: string;
  docs_arch_sec5_2_title: string;
  docs_arch_step1_badge: string;
  docs_arch_step1_title: string;
  docs_arch_step1_desc: string;
  docs_arch_step2_badge: string;
  docs_arch_step2_title: string;
  docs_arch_step2_desc: string;
  docs_arch_step3_badge: string;
  docs_arch_step3_title: string;
  docs_arch_step3_desc: string;
  docs_arch_step4_badge: string;
  docs_arch_step4_title: string;
  docs_arch_step4_desc: string;
  docs_arch_step5_badge: string;
  docs_arch_step5_title: string;
  docs_arch_step5_desc: string;

  docs_arch_sec6_badge: string;
  docs_arch_sec6_title: string;
  docs_arch_sec6_tag: string;
  docs_arch_sec6_1_title: string;
  docs_arch_sec6_1_desc: string;
  docs_arch_fb1_badge: string;
  docs_arch_fb1_title: string;
  docs_arch_fb1_layer: string;
  docs_arch_fb1_desc: string;
  docs_arch_fb2_badge: string;
  docs_arch_fb2_title: string;
  docs_arch_fb2_layer: string;
  docs_arch_fb2_desc: string;
  docs_arch_sec6_2_title: string;
  docs_arch_sec6_2_desc: string;
  docs_arch_rule1_title: string;
  docs_arch_rule1_desc: string;
  docs_arch_rule2_title: string;
  docs_arch_rule2_desc: string;
  docs_arch_rule3_title: string;
  docs_arch_rule3_desc: string;
  docs_arch_rule4_title: string;
  docs_arch_rule4_desc: string;

  docs_arch_sec7_badge: string;
  docs_arch_sec7_title: string;
  docs_arch_sec7_tag: string;
  docs_arch_roi1_title: string;
  docs_arch_roi1_desc: string;
  docs_arch_roi2_title: string;
  docs_arch_roi2_desc: string;
  docs_arch_roi3_title: string;
  docs_arch_roi3_desc: string;
  docs_arch_export_whitepaper: string;
  docs_arch_btn_download_ast: string;
  docs_arch_btn_export_pdf: string;
  docs_arch_btn_export_md: string;

  // Flipbook Library
  book_01_title: string;
  book_01_subtitle: string;
  book_02_title: string;
  book_02_subtitle: string;
  book_03_title: string;
  book_03_subtitle: string;
  book_04_title: string;
  book_04_subtitle: string;
  book_05_title: string;
  book_05_subtitle: string;
  book_06_title: string;
  book_06_subtitle: string;
  book_07_title: string;
  book_07_subtitle: string;
  book_08_title: string;
  book_08_subtitle: string;
  book_09_title: string;
  book_09_subtitle: string;

  // SECTION 1: PYLON WORKBENCH
  pylonZoneTag: string;
  pylonMainHeading: string;
  pylonSubheading: string;
  pylonConduitsTitle: string;
  pylonInspectHint: string;
  btnLaunchPylonStation: string;
  pylonTelemetryTitle: string;
  pylonStatusActive: string;
  pylonConduitLocked: string;
  pylonThroughputLabel: string;
  pylonRenderFeeLabel: string;

  // SECTION 2: STUDIO PLAYGROUND HUBS MATRIX
  matrixTag: string;
  matrixHeading: string;
  matrixSubheading: string;
  btnLaunchFullMatrix: string;

  // Node Cards 01-06
  node01Title: string;
  node01Desc: string;
  btnEnterNode01: string;

  node02Title: string;
  node02Desc: string;
  btnLaunchNode02: string;

  node03Title: string;
  node03Desc: string;
  btnOpenNode03: string;

  node04Title: string;
  node04Desc: string;
  btnOpenNode04: string;

  node05Title: string;
  node05Desc: string;
  btnOpenNode05: string;

  node06Title: string;
  node06Desc: string;
  btnLaunchNode06: string;

  // SECTION 3: STUDIO CONFIGURATOR & CANVAS HUD
  configuratorHeader: string;
  configuratorNodeBadge: string;
  enterFactoryNodeBtn: string;
  b2bPopupTitle: string;
  b2bPopupDesc: string;
  btnBookB2bConsultation: string;

}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    nav_engine: 'ENGINE',
    nav_playground: 'PLAYGROUND',
    nav_architecture: 'ARCHITECTURE',
    nav_blueprints: 'BLUEPRINTS',
    nav_blackbox: 'BLACKBOX',
    nav_experts: 'EXPERTS',
    nav_deploy_node: 'DEPLOY//NODE',
    nav_studio_console: 'STUDIO//CONSOLE',
    nav_vibepath_studio: 'VibePath Studio ↗',
    nav_studios_hubs: 'STUDIOS HUBS ▾',
    subtag_version: 'v3.0//BRUTALIST',
    logo_subtag: 'CRAFT//CODE',

    // Hero Section
    telemetry_prefix: 'SYS//TELEMETRY:',
    telemetry_status: '14 REGIONS ONLINE',
    telemetry_sla: '99.99% DETERMINISTIC SLA',
    hero_badge_subtag: 'CRAFT//CODE',
    hero_badge_text: 'METICULOUS GRAPHIC PRECISION MEETS CODE AUTOMATION',
    heroTitleLine1: 'ARTIFICIAL',
    heroTitleLine2: 'CRAFT',
    subtitle: 'Where Meticulous Graphic Design Meets Deterministic AI Automation.',
    ctaButton: 'Launch Autopilot Studio',
    hero_cta_vibepath: '🚀 Launch VibePath Studio',
    hero_cta_sandbox: 'Try Live Sandbox',
    cta_explore: 'EXPLORE BLUEPRINTS',
    exportBlueprint: 'Export HD Diagram',

    // 3D Hook Canvas
    canvas_hook_parallax: '3D_HOOK//PARALLAX',
    canvas_fps_interactive: '60FPS INTERACTIVE',
    canvas_pos_mouse: 'POS [X: MOUSE, Y: MOUSE]',

    // Simulator Sandbox
    sim_placeholder: 'Paste endpoint or URL to trigger workflow...',
    sim_run_btn: 'RUN SIMULATOR',
    sim_executing: 'EXECUTING NODE...',
    preset_engine: 'PRESET ENGINE:',
    preset_swiss: 'Swiss Design System SKU',
    preset_brutalist: 'Brutalist Pitchdeck PDF',
    preset_financial: 'Deterministic Financial Index',
    workflow_engine: 'WORKFLOW ENGINE:',
    exec_status_executing: 'EXECUTING',
    exec_status_ready: 'READY',
    exec_completed_title: 'EXECUTION COMPLETED',
    metric_deterministic: 'Deterministic',
    metric_token_cost: 'Token Cost',
    metric_craft_precision: 'Craft Precision',
    run_another_sim: 'RUN ANOTHER SIMULATION',
    output_nodes: 'OUTPUT NODES',

    // Workflow Modes
    mode_content_label: 'Craft Engine // Studio',
    mode_content_sublabel: 'Graphic Precision → Deterministic Fanout',
    mode_content_desc:
      'Expressing the tension between graphic design precision and code automation: A Dify agent curates and formats structured brand assets, while n8n executes 100% deterministic fanout across production channels.',
    mode_lead_label: 'Node Scoring Engine',
    mode_lead_sublabel: 'Telemetric Data → Predictive Routing',
    mode_lead_desc:
      'Inbound Webhook events feed an ARTIFICIAL CRAFT neural filter. Firmographic and real-time behavioral vectors are fused into a sharp, deterministic score with rate-limit resiliency.',
    mode_research_label: 'Artificial RAG Matrix',
    mode_research_sublabel: 'Vector Retrieval → Structured Briefs',
    mode_research_desc:
      'Deep hybrid vector RAG retrieval with BM25 cross-reranking. The Dify reasoning core builds citations while n8n enforces zero-drift schema compliance.',

    // Bento Grid
    bento_section_label: 'ARCHITECTURE // DUAL ENGINE',
    bento_title_line1: 'TWO ENGINES. ONE RUNTIME.',
    bento_title_line2: 'GRAPHIC PRECISION + CODE ORCHESTRATION.',
    bento_desc:
      "ARTIFICIAL CRAFT fuses Dify's reasoning matrix with n8n's execution orchestrator. Structured brand design and precision automation linked by a zero-drift control plane.",
    card_hybrid_title: 'HYBRID CRAFT RUNTIME',
    card_hybrid_desc:
      'Reasoning engines call n8n workflows as typed Swiss design tools; n8n workflows execute Dify agents as deterministic code steps.',
    card_vibepath_title: 'VibePath Automation Engine',
    card_vibepath_desc: 'Next-Gen AI Workflow & Interactive Studio',
    card_vibepath_link: 'Open VibePath Studio ↗',
    node_trigger: 'TRIGGER',
    node_reason: 'REASON',
    node_vector: 'VECTOR',
    node_guard: 'GUARD',
    node_fanout: 'FANOUT',
    status_typed_tool: 'TYPED TOOL CALL',
    status_streaming_matrix: 'STREAMING MATRIX',
    status_retry_eligible: 'RETRY ELIGIBLE',
    card_rag_title: 'VECTOR RAG MATRIX',
    card_rag_desc: 'Hybrid Pinecone + BM25 cross-reranking for Swiss design specs.',
    rag_latency: 'LATENCY: 540ms',
    card_det_title: 'DETERMINISTIC ENGINE',
    card_det_desc: 'Auto-retry exponential policies, rate-limit shields, dead-letter archives.',
    row_retry: 'RETRY: EXPONENTIAL · MAX 5',
    row_rate_limit: 'RATE LIMIT: ADAPTIVE PROBE',
    row_dead_letter: 'DEAD-LETTER: IMMUTABLE',
    card_router_title: 'MULTI-MODEL ROUTER',
    card_router_desc: 'GPT-4o, Claude, Llama — routed by latency, cost, or craft score.',
    card_telemetry_title: 'TELEMETRY TRACING',
    card_telemetry_desc: 'Every token, node call, and fanout event logged in 60fps real-time.',
    tracing_active: '● TRACING ACTIVE',
    card_guardrails_title: 'SWISS GUARDRAILS',
    card_guardrails_desc: 'Schema-validated inputs and outputs. 0% silent drift.',

    // Blueprint Library
    bp_section_label: 'BLUEPRINT LIBRARY // TEMPLATES',
    bp_title_line1: 'PRODUCTION-READY BLUEPRINTS.',
    bp_title_line2: 'COPY. DEPLOY. SHARE.',
    bp_desc:
      'Every blueprint ships with a typed API, node topology, and Carbon-style HD Swiss image exporter.',
    copy_api: 'COPY API',
    copyApi: 'COPY API',
    copied: 'COPIED',
    export_clean_screenshot: 'Export Clean Screenshot',
    exportDiagram: 'EXPORT HD DIAGRAM',
    inspectAst: 'INSPECT AST JSON',
    copyJson: 'COPY JSON',
    rendering_hd: 'RENDERING HD...',
    preview_ready: 'PREVIEW READY',
    export_preview_title: 'EXPORT PREVIEW',
    download_png: 'DOWNLOAD PNG',
    bp_banner_title: 'ALL BLUEPRINTS ARE OPEN SOURCE',
    bp_banner_sub: 'MIT LICENSED · CRAFT//CODE CLI READY',
    bp_browse_all: 'BROWSE ALL 40+ TEMPLATES',
    bp_node_step: 'STEP',
    bp_node_engine: 'ENGINE',
    bp_node_latency: 'LATENCY',
    bp_node_output: 'OUTPUT',

    // Blueprint Section Headers & Actions
    blueprintSectionTitle: 'REAL-WORLD PIPELINE BLUEPRINTS',
    blueprintSectionSubtitle: 'Production-tested AI, image processing, and 3D kinematics workflows ready for deployment.',
    btnDownloadJson: 'DOWNLOAD JSON',
    btnExportHdDiagram: 'EXPORT HD DIAGRAM',
    btnInspectAstJson: 'INSPECT AST JSON',

    // Blueprint Descriptions (EN)
    bpImagePimDesc: 'Automated e-commerce product image processing: Background removal, 75% Grid fitting, 2-layer Contour Shadow generation, and R2 CDN upload exporting PNG + PSD.',
    bpLegoProtocolDesc: 'Hybrid architecture decoupling Reasoning Brain (Dify) and Execution Muscle (n8n), saving 98% token costs via JSON AST Component forging & assembly.',
    bpContourShadowDesc: 'Standalone 4-Node shadow compositor running on CPU in <0.08s, allowing non-destructive step-by-step opacity & blur fine-tuning.',
    bpGrafx3dDesc: 'Integration pipeline connecting GraFx Studio SDK (@chili-publish/studio-sdk) to inject R2 texture variables into real-time interactive 3D viewports.',

    // LinkedIn Banner Studio Form
    banner_studio_title: 'Plug & Play Studio Banner LinkedIn (100% Automated & Free)',
    banner_full_name: 'Full Name',
    banner_company_domain: 'Company Domain / Logo URL',
    banner_job_title: 'Job Title',
    banner_industry: 'Industry Category',
    banner_industry_tech: 'Tech / AI / Data',
    banner_industry_design: 'Design / Frontend',
    banner_industry_finance: 'Finance / Crypto',
    banner_industry_marketing: 'Marketing / Creator',
    banner_palette: 'Palette',
    banner_palette_swiss: 'Monochrome White',
    banner_palette_cyan: 'Cyber Cyan',
    banner_palette_purple: '#5322ff Neon',
    banner_palette_amber: 'Earthy Amber',
    banner_export_button: 'Export Banner',

    // Experts Section
    experts_section_label: 'EXPERT DIRECTORY // CURATED',
    experts_title: 'VETTED BY BUILDERS OF THE FUTURE.',
    experts_desc:
      'Every featured workflow is audited, deployed, and maintained by operators running production AI.',
    curated_workflow: 'CURATED WORKFLOW',
    view_blueprint: 'VIEW BLUEPRINT',
    stat_workflows: 'PRODUCTION WORKFLOWS',
    stat_runs: 'AGENT RUNS / MONTH',
    stat_regions: 'MULTI-AZ REGIONS',
    stat_sla: 'DETERMINISTIC SLA',

    // Footer Section
    footer_banner_tag: 'CRAFT//CODE DEPLOYMENT',
    footer_banner_title: 'SHIP YOUR FIRST AGENT NODE IN 90 SECONDS.',
    footer_banner_desc:
      'No credit card required. No sales call. Just a CLI, a blueprint, and a webhook URL.',
    footer_start_building: 'START BUILDING',
    footer_brand_desc:
      'ARTIFICIAL CRAFT (CRAFT//CODE): Expressing the conflict between graphic design precision and code automation engines.',
    col_engine: 'ENGINE',
    col_developers: 'DEVELOPERS',
    col_craft: 'CRAFT',
    link_vibepath_studio: 'VibePath Studio',
    link_architecture: 'Architecture',
    link_blueprints: 'Blueprints',
    link_telemetry: 'Telemetry',
    link_changelog: 'Changelog',
    link_status: 'Status',
    link_documentation: 'Documentation',
    link_api_reference: 'API Reference',
    link_cli_tool: 'CLI Tool',
    link_self_host: 'Self-host',
    link_github: 'GitHub',
    link_about: 'About',
    link_manifesto: 'Manifesto',
    link_careers: 'Careers',
    link_partners: 'Partners',
    link_contact: 'Contact',
    copyright_text:
      '© 2026 ARTIFICIAL CRAFT // CRAFT//CODE · DIFY + N8N HYBRID INFRASTRUCTURE',
    status_online: 'SYSTEMS ONLINE',
    privacy: 'PRIVACY',
    terms: 'TERMS',
    // Footer 3D Engine Link
    footerEngineBadge: "3D ARCHITECTURE ENGINE",
    footerEngineTitle: "WEBAPP PRESENTATION ENGINE",
    footerEngineDesc: "Interactive 3D WebApp Architecture & Directory AST Visualizer. Replace static slides with fluid WebGL kinematics.",
    btnLaunchEngine: "LAUNCH 3D ENGINE ↗",

    // Plug & Play Sandbox
    sandbox_section_label: 'PLUG & PLAY // SANDBOX // HYPER-SPEED EXPERIMENTS // FULL SECURITY CONTROL',
    sandbox_title: 'GENERATIVE ALGORITHM LAB',
    sandbox_subtitle: 'Real-time parameter tuning & telemetry for generative craft algorithms.',
    sandbox_control_panel: 'CONTROL PANEL',
    sandbox_cat_organic: 'Flow & Organic',
    sandbox_cat_structure: 'Geometry & Structure',
    sandbox_cat_biological: 'Digital & Biological',
    sandbox_select_algo: 'Select Algorithm',
    sandbox_param_density: 'Density',
    sandbox_param_speed: 'Speed / Velocity',
    sandbox_palette: 'Color Palette Swatches',
    sandbox_palette_cyberpunk: '01: Cyberpunk Neon',
    sandbox_palette_monochrome: '02: Brutalist Monochrome',
    sandbox_palette_bauhaus: '03: Bauhaus Primary',
    sandbox_palette_amber: '04: Gold Amber',
    sandbox_randomize_seed: 'Randomize Seed',
    sandbox_export_png: 'EXPORT 2048px PNG',
    sandbox_export_svg: 'EXPORT VECTOR SVG',
    sandbox_telemetry_title: 'TELEMETRY CONSOLE',
    sandbox_telemetry_status: 'SYS//STATUS: ACTIVE',
    sandbox_telemetry_algo: 'ALGORITHM',
    sandbox_telemetry_category: 'CATEGORY',
    sandbox_telemetry_density: 'DENSITY',
    sandbox_telemetry_speed: 'SPEED',
    sandbox_telemetry_palette: 'PALETTE',
    sandbox_telemetry_seed: 'SEED HASH',
    sandbox_telemetry_fps: 'FRAME RATE',
    sandbox_telemetry_frametime: 'FRAME TIME',
    sandbox_telemetry_resolution: 'CANVAS RES',
    sandbox_canvas_interactive: '2D CANVAS // INTERACTIVE',

    // CSV Visualizer Section
    csv_section_label: 'OPEN MEKONG CKAN // DATA ENGINE // CSV VISUALIZER',
    csv_title: 'OPEN MEKONG DATA-TO-VISUAL SANDBOX',
    csv_subtitle: 'Fetch live open public datasets from Open Development Mekong & transform them into Swiss CAD blueprint graphics & financial telemetry.',
    csv_dropzone_title: 'DRAG & DROP CUSTOM CSV FILE',
    csv_dropzone_desc: 'or click to browse local .csv file as manual fallback',
    csv_preset_label: 'OPEN MEKONG PUBLIC DATASETS:',
    csv_fetch_random: '🎲 Fetch Random Dataset',
    csv_loading_dataset: 'FETCHING LIVE CKAN CSV DATASET...',
    csv_source_url: 'SOURCE DATASET URL',
    csv_preset_latency: '01. Server Latency Metrics',
    csv_preset_crypto: '02. Crypto Volatility Stream',
    csv_preset_telemetry: '03. Agent Token Execution',
    csv_col_x: 'X-AXIS HEADER (CATEGORIES / DATES)',
    csv_col_y: 'Y-AXIS HEADER (METRICS / VALUES)',
    csv_mode_label: 'VISUALIZATION MODE',
    csv_mode_waveform: '01. Cyber Waveform / Line Grid',
    csv_mode_matrix: '02. Brutalist Density Matrix / Bar Blocks',
    csv_mode_candlestick: '03. Algorithmic Candlestick / Financial Mesh',
    csv_palette_label: 'PALETTE PICKER',
    csv_palette_neon: 'Cyberpunk Neon (#5322ff / #00E5FF)',
    csv_palette_mono: 'Brutalist Monochrome (#FFFFFF)',
    csv_telemetry_title: 'DATA TELEMETRY READOUT',
    csv_telemetry_rows: 'TOTAL ROWS',
    csv_telemetry_min: 'MIN VALUE',
    csv_telemetry_max: 'MAX VALUE',
    csv_telemetry_avg: 'AVERAGE',
    csv_telemetry_fps: 'CANVAS FRAME RATE',

    // Existential Blackbox Section
    blackbox_title: 'THE SUBSTRATE // ENGINE 60FPS',
    blackbox_subtitle: 'THE EXISTENTIAL BLACKBOX',
    blackbox_status_processing: 'PROCESSING_PAYLOAD',
    blackbox_status_idle: 'IDLE_WAITING',
    blackbox_framerate: 'FRAME_RATE: 60 FPS',
    blackbox_headless: 'HEADLESS_FOUNDER: ABSENT',
    blackbox_core_logic: 'CORE_LOGIC: RUST // DIFY // N8N',
    blackbox_manifesto_title: 'A FORM OF // NEW MONISM //',
    blackbox_manifesto_quote: '"Nine years of pixel-by-pixel alignment, synthesized into an automated creative system. Machine speed and the human soul running through a single conduit."',
    blackbox_portfolio_btn: '[ ↗ VIEW ARCHIVED HUMAN PORTFOLIO (2016-2025) TO SEE THE DESIGN SUBSTRATE ]',
    blackbox_terminal_title: '> THE_TERMINAL_CONSOLE',
    blackbox_click_cmd: '// CLICK COMMAND TO EXECUTE AGENT RESPONSE:',
    blackbox_run: 'RUN',
    blackbox_awaiting: '[ AWAITING COMMAND EXECUTION... CLICK ANY COMMAND ABOVE ]',
    blackbox_manifesto_footer: 'MANIFESTO: HEADLESS_FOUNDER_OPERATIONAL',
    blackbox_autonomous: '100% AUTONOMOUS',
    blackbox_q1_q: "Q1: My laptop exploded. Can I use this to postpone today's deploy deadline?",
    blackbox_q1_a: "A: Condolences, but NO. If you designed your system architecture correctly, your physical existence right now is irrelevant. Your asynchronous workers are isolated on a Hetzner VPS in Germany. They don't care that your laptop turned into a brick. They continue pulling payloads, hashing JSON, and flushing flat data to Cloudflare R2 while you are searching for a flashlight. The system is immortal; only you are left out of the game.",
    blackbox_q2_q: "Q2: If I go to sleep, will the autonomous AI panic and crash when hitting API HTTP 429 Rate Limits?",
    blackbox_q2_a: "A: Unlike humans, machines don't panic; they silently die in the dark until someone checks logs. However, an elegant workflow built in Rust/n8n has middleware retry policies (Exponential Backoff). When encountering a 429 error, the AI catches the error, calculates exponential delay backoff, pauses for 5 seconds, and retries the request seamlessly at 3 AM while you sleep soundly.",
    blackbox_q3_q: "Q3: I have nightmares about an AI bug causing an infinite loop that burns $5,000 in API keys before sunrise.",
    blackbox_q3_a: "A: Welcome to the classic 'Infinite Token Burn' nightmare. That's why we enforce strict guardrails, container sandboxes, and max-iteration=10 limits in Dify. By wrapping the Agent runtime environment in an isolated container, you constrain its survival space. If it fails over 10 times, the system automatically triggers a kill process and dispatches a Slack alert, instead of maxing out your credit card to fund OpenAI.",
    blackbox_q4_q: "Q4: Does my AI agent connected via MCP have a soul? Does it dream of electric sheep?",
    blackbox_q4_a: "A: Absolutely not. It only dreams of Structured JSON and Swiss Grid matrices. When we talk about software 'waking up' or 'dreaming', it's merely a poetic metaphor for periodic background cron-jobs updating vector embedded memory. The system is just parsing text, resolving data conflicts, and computing linear algebra matrices so when you wake up, the best context is ready. No sentience, no consciousness — only pure linear algebra.",
    blackbox_q5_q: "Q5: If event-driven pipelines handle everything from scraping to deployment... why am I receiving a salary?",
    blackbox_q5_a: "A: Congratulations, you graduated from gear-pusher to System Architect. Your job is no longer dragging elements in Canva or pixel-pushing UI manually. You stand at the top of the architectural tower, monitoring GCP Cloud Logging telemetry, identifying system bottlenecks, and directing autonomous machines toward complex challenges. You are paid for strategic reasoning, system architecture, and uncompromising aesthetic taste.",
    blackbox_q6_q: "Q6: What happens if the AI finishes everything at 3 AM and realizes it doesn't need me?",
    blackbox_q6_a: "A: It sends a Slack message: 'Pipeline executed successfully. 1000 items rendered. What's next, Boss?'. And that is the true existential tragedy of the AI era: You wake up at 8 AM to find all manual labor cleared away, leaving you with nothing left to do except sit down and come up with an original idea.",

    // Docs Architecture & System Manual
    nav_docs_architecture: '03 // SYSTEM ARCHITECTURE & MANUAL',
    nav_docs_architecture_desc: '0-Code JSON & WebGL Operating Manual',

    docs_arch_breadcrumb_spec: 'SPEC//2026.11-REV4',
    docs_arch_breadcrumb_title: 'ARTIFICIALCRAFT.SPACE // SYSTEM ARCHITECTURE REPORT',
    docs_arch_breadcrumb_node: 'NODE 01-05 CLUSTER DOCUMENTATION',
    docs_arch_zod_enforced: 'VERIFIED: ZOD GATE ENFORCED',
    docs_arch_classification_tag: 'CRAFT//CODE ARCHITECTURE WHITE PAPER // VER 2026.11',
    docs_arch_ssot_cluster: 'SSOT CLUSTER: PRODUCTION',
    docs_arch_public_spec: 'CLASSIFICATION: PUBLIC TECHNICAL SPEC',

    docs_arch_hero_title: 'TECHNICAL REPORT: 0-CODE JSON-DRIVEN ARCHITECTURE & DECOUPLED OPERATING PARADIGM AT ARTIFICIALCRAFT.SPACE',
    docs_arch_hero_desc: 'Deep technical specification on eliminating 99% of LLM token costs through a 3-Tier Decoupled architecture, freezing TSX component source code, schema defense via Zod Gate, and full offloading of 60 FPS rendering to Client-Side WebGL GPU.',

    docs_arch_metric_cost_label: 'Server Render Cost',
    docs_arch_metric_cost_val: '$0.00',
    docs_arch_metric_cost_unit: '/ MONTH',
    docs_arch_metric_cost_sub: 'Client-Side GPU Offload (Zero Puppeteer)',
    docs_arch_metric_fps_label: 'Deterministic SLA',
    docs_arch_metric_fps_val: '60.0',
    docs_arch_metric_fps_sub: 'Three.js / WebGL Zero GC Overhead',
    docs_arch_metric_token_label: 'JSON AST Payload',
    docs_arch_metric_token_val: '~50',
    docs_arch_metric_token_sub: '99% LLM Context Bloat Elimination',
    docs_arch_metric_zod_label: 'Validation Gate',
    docs_arch_metric_zod_val: '0%',
    docs_arch_metric_zod_unit: 'DRIFT',
    docs_arch_metric_zod_sub: 'Zod safeParse Short-Circuit Active',
    docs_arch_metric_failover_label: 'Failover SLA',
    docs_arch_metric_failover_val: 'ZERO-CRASH',
    docs_arch_metric_failover_sub: '2-Tier Graceful Fallback Policy',

    docs_arch_toc_label: 'CONTENTS:',
    docs_arch_toc_sec1: '01. 3-TIER ARCHITECTURE',
    docs_arch_toc_sec2: '02. 0-CODE JSON-DRIVEN',
    docs_arch_toc_sec3: '03. CYBERNETIC SSOT',
    docs_arch_toc_sec4: '04. ZERO-TRUST ZOD GATE',
    docs_arch_toc_sec5: '05. STUDIO ENGINE STREAM',
    docs_arch_toc_sec6: '06. 2-TIER FALLBACK',
    docs_arch_toc_sec7: '07. PERFORMANCE & ROI',

    docs_arch_sec1_badge: 'SECTION 01',
    docs_arch_sec1_title: 'SYSTEM OVERVIEW & ARCHITECTURE PHILOSOPHY',
    docs_arch_sec1_tag: 'PARADIGM: 3-TIER DECOUPLED // $0 RENDER COST',
    docs_arch_sec1_1_title: '1.1. 3-Tier Decoupled Operational Paradigm',
    docs_arch_sec1_1_desc: 'ARTIFICIALCRAFT.SPACE rigorously decouples the AI reasoning core, workflow orchestration engine, and visual presentation canvas. Instead of forcing LLMs to synthesize thousands of lines of fragile frontend code, the system establishes three immutable operational boundaries:',
    docs_arch_sec1_schematic_title: 'CAD ARCHITECTURE TOPOLOGY // BLUEPRINT SCHEMATIC',
    docs_arch_sec1_schematic_sync: '[ SYNC: DETERMINISTIC 60FPS BUS ]',
    docs_arch_tier1_badge: 'TIER 01',
    docs_arch_tier1_name: 'REASONING CORE',
    docs_arch_tier1_sub: '"THE BRAIN" // Dify Cloud & Vertex AI',
    docs_arch_tier1_desc: 'Specialized in business context comprehension, prompt parsing, and logic reasoning. Completely isolated from TSX source code and DOM rendering.',
    docs_arch_tier1_emit: 'EMITS: Pure JSON AST',
    docs_arch_tier1_payload: 'Payload size ~50 tokens',
    docs_arch_tier2_badge: 'TIER 02',
    docs_arch_tier2_name: 'DETERMINISTIC MUSCLE',
    docs_arch_tier2_sub: '"THE MUSCLE" // n8n Swarm Orchestrator',
    docs_arch_tier2_desc: 'Stateless workflow orchestration engine. Routes webhooks, executes data transformation logic, validates rate limits, and guarantees schema integrity.',
    docs_arch_tier2_dispatch: 'DISPATCH: Webhook Proxy / Validation',
    docs_arch_tier2_payload: 'Zero LLM token consumption on JSON parsing',
    docs_arch_tier3_badge: 'TIER 03',
    docs_arch_tier3_name: 'PRESENTATION CANVAS',
    docs_arch_tier3_sub: '"THE PROJECTOR" // artificialcraft.space',
    docs_arch_tier3_desc: 'Next.js frontend acting as a pure projection canvas. Compiles inbound JSON AST into 3D WebGL structures, Remotion video previews, or Swiss HUD components.',
    docs_arch_tier3_exec: 'EXEC: Client GPU WebGL 60 FPS',
    docs_arch_tier3_payload: 'Server Render Cost: $0.00 / month',
    docs_arch_flow_tier1: 'TIER 1 (LLM Inference)',
    docs_arch_flow_tier2: 'TIER 2 (n8n JSON Dispatch)',
    docs_arch_flow_tier3: 'TIER 3 (Client WebGL Shader Engine)',

    docs_arch_sec1_2_title: '1.2. "Data Projector" Philosophy & Client-Side GPU Offloading',
    docs_arch_sec1_2_desc: 'Traditional generative UI workflows rely heavily on Server-Side Rendering or headless browsers (Puppeteer/Playwright) draining massive CPU/RAM resources to render graphics or video servers. ARTIFICIALCRAFT.SPACE completely flips this dynamic:',
    docs_arch_table_col_crit: 'Evaluation Criteria',
    docs_arch_table_col_old: 'Server-Side Headless Render (Legacy)',
    docs_arch_table_col_new: 'Data Projector Architecture (ArtificialCraft)',
    docs_arch_table_r1_crit: 'Server Infrastructure Cost',
    docs_arch_table_r1_old: '$250 - $1,200/mo (Cloud GPU clusters / EC2 nodes)',
    docs_arch_table_r1_new: '$0.00 / mo (Zero server render, uses client GPU)',
    docs_arch_table_r2_crit: 'LLM Context Consumption',
    docs_arch_table_r2_old: '2,500 - 8,000 tokens (Full TSX components + CSS styles)',
    docs_arch_table_r2_new: '~50 tokens (Parameterized JSON AST only)',
    docs_arch_table_r3_crit: 'Response Latency',
    docs_arch_table_r3_old: '15s - 45s (TSX compilation, Webpack bundling, render)',
    docs_arch_table_r3_new: '< 150ms (Instant JSON transmission & hydration)',
    docs_arch_table_r4_crit: 'Framerate Stability',
    docs_arch_table_r4_old: 'Unstable, choppy stream (15 - 30 FPS)',
    docs_arch_table_r4_new: 'Deterministic 60.0 FPS hardware fixed (Three.js WebGL)',
    docs_arch_table_r5_crit: 'Runtime Crash Risk',
    docs_arch_table_r5_old: 'High (LLM syntax errors, missing imports, white screen)',
    docs_arch_table_r5_new: '0% (Shielded by Zod Schema Gate & Fallback Component)',

    docs_arch_sec2_badge: 'SECTION 02',
    docs_arch_sec2_title: '0-CODE JSON-DRIVEN SOLUTION ELIMINATING CONTEXT BLOAT',
    docs_arch_sec2_tag: 'TOKEN REDUCTION: 99% EFFICIENCY',
    docs_arch_sec2_1_title: '2.1. Context Bloat Analysis & AI Worker Memory Exhaustion',
    docs_arch_sec2_1_desc: 'When forcing AI models to write full UI code (.tsx / .vue), prompt size expands exponentially, triggering 4 catastrophic failure modes in production:',
    docs_arch_fail1_title: 'Hallucinated Code',
    docs_arch_fail1_desc: 'AI invents non-existent React hooks or deprecated lifecycle methods due to context window exhaustion.',
    docs_arch_fail2_title: 'Missing Imports',
    docs_arch_fail2_desc: 'Forgets critical npm dependencies (Three.js, Lucide, Framer), breaking webpack compilation pipelines.',
    docs_arch_fail3_title: 'Props Mismatch',
    docs_arch_fail3_desc: 'TypeScript prop mismatches break contract between API payload and component rendering.',
    docs_arch_fail4_title: 'Non-Deterministic Layout',
    docs_arch_fail4_desc: 'Broken responsive layouts destroy the strict aesthetic discipline of Cybernetic Brutalism.',
    docs_arch_sec2_2_title: '2.2. Architecture Comparison: Traditional .TSX vs. 0-Code JSON-Driven',
    docs_arch_comp_col_metric: 'Operational Metric',
    docs_arch_comp_col_tsx: 'Raw Code Generation (.TSX)',
    docs_arch_comp_col_json: '0-Code JSON-Driven (AST)',
    docs_arch_comp_r1_metric: 'Payload Size',
    docs_arch_comp_r1_tsx: '~85 KB (Full TSX Component)',
    docs_arch_comp_r1_json: '~0.6 KB (Parameterized AST)',
    docs_arch_comp_r2_metric: 'LLM Generation Cost',
    docs_arch_comp_r2_tsx: '~3,200 Tokens / request',
    docs_arch_comp_r2_json: '~50 Tokens (-98.4% savings)',
    docs_arch_comp_r3_metric: 'Client Hydration Time',
    docs_arch_comp_r3_tsx: '8 - 15s (Babel / SWC compile)',
    docs_arch_comp_r3_json: '0ms (Direct in-memory hydration)',
    docs_arch_comp_r4_metric: 'Type-Safety Guarantee',
    docs_arch_comp_r4_tsx: 'Unsafe (Dynamic eval code)',
    docs_arch_comp_r4_json: 'Strict (Compile-time Zod safeParse)',
    docs_arch_sec2_3_title: '2.3. Component Freezing & JSON Configuration Hubs',
    docs_arch_sec2_3_desc: 'All core subsystems on ARTIFICIALCRAFT.SPACE are configured through strictly versioned central JSON files:',
    docs_arch_hub1_file: 'site-configs/template-schema.json',
    docs_arch_hub1_desc: 'Governs homepage layout structure, routing node matrix, technical parameter matrices, and component references.',
    docs_arch_hub2_file: 'src/data/showcase-config.json',
    docs_arch_hub2_desc: 'Manages 60FPS Remotion videos, timeline scripts, camera zoom splines, and telemetry HUD label overlays.',
    docs_arch_hub3_file: 'src/data/flipbook-registry.json',
    docs_arch_hub3_desc: 'Powers 3D Interactive Flipbooks, technical specifications, and the Single Source of Truth component registry.',

    docs_arch_sec3_badge: 'SECTION 03',
    docs_arch_sec3_title: 'CYBERNETIC SWISS BRUTALISM & SSOT REGISTRY MATRIX',
    docs_arch_sec3_tag: 'STANDARDS: ZERO-SOFT-RADIUS // CARTESIAN GRIDS',
    docs_arch_sec3_1_title: '3.1. Cybernetic Swiss Brutalism Design Tokens',
    docs_arch_sec3_1_desc: 'The design celebrates the intersection of the Swiss International Typographic Style with the unapologetic precision of Cybernetic Brutalism: strict 0px border radiuses, 1px hairline coordinate grids, and absolute contrast between deep Obsidian substrates and vibrant Cyan/Indigo photons.',
    docs_arch_token_obsidian: 'Canvas Obsidian',
    docs_arch_token_obsidian_desc: '#09090B / #0B0B0F - Base Substrate',
    docs_arch_token_indigo: 'Electric Indigo',
    docs_arch_token_indigo_desc: '#5322FF - Computational Core',
    docs_arch_token_cyan: 'Neon Cyan',
    docs_arch_token_cyan_desc: '#00E5FF - Operational Signal',
    docs_arch_token_green: 'Matrix Green',
    docs_arch_token_green_desc: '#00FF66 - 60FPS Telemetry SLA',
    docs_arch_sec3_2_title: '3.2. Repository Tree & SSOT Registry Protocol (src/core/registry.ts)',
    docs_arch_repo_tree_title: 'DIRECTORY SSOT ARCHITECTURE',
    docs_arch_props_interface_title: 'UNIVERSAL COMPONENT CONTRACT',

    docs_arch_sec4_badge: 'SECTION 04',
    docs_arch_sec4_title: 'ZERO-TRUST BACKEND-TO-FRONTEND & ZOD SCHEMA GATES',
    docs_arch_sec4_tag: 'GATEWAY: safeParse SHORT-CIRCUIT',
    docs_arch_sec4_1_title: '4.1. 3-Step Verification Pipeline at Next.js API Route Handler',
    docs_arch_sec4_1_desc: 'To protect client runtime from abnormal JSON payloads generated by hallucinating LLMs or malicious injections, the API Route Handler implements an uncompromised 3-gate defense system:',
    docs_arch_gate1_title: 'Gate 01: Environment Discovery',
    docs_arch_gate1_desc: 'Validates Dify and n8n webhook authentication tokens, bearer headers, and origin domain integrity.',
    docs_arch_gate2_title: 'Gate 02: System Contract Verification',
    docs_arch_gate2_desc: 'Enforces JSON Schema specification, checking required keys: id, preset, title, theme, and props dictionary.',
    docs_arch_gate3_title: 'Gate 03: Zod safeParse Circuit Breaker',
    docs_arch_gate3_desc: 'Executes strict runtime validation. If preset or props drift from schema, short-circuits HTTP 400 immediately with detailed telemetry.',
    docs_arch_inspector_title: 'INTERACTIVE CODE INSPECTOR // TELEMETRY TERMINAL',
    docs_arch_tab_ast: '01 // JSON AST PAYLOAD (~50 TOKENS)',
    docs_arch_tab_zod: '02 // ZOD VALIDATION SCHEMA (safeParse GATE)',
    docs_arch_tab_stream: '03 // PAYLOAD STREAM PIPELINE (AST TO PROJECTION)',
    docs_arch_btn_copy: 'COPY SNIPPET',
    docs_arch_btn_copied: '[ COPIED ✓ ]',
    docs_arch_btn_validate: '[ VALIDATE PAYLOAD ]',
    docs_arch_validate_success: '[ GATE: ZOD VALIDATED // 0 ERRORS // 60FPS BUS READY ]',

    docs_arch_sec5_badge: 'SECTION 05',
    docs_arch_sec5_title: 'STUDIO CONFIGURATOR ENGINE & IN-MEMORY STREAMING',
    docs_arch_sec5_tag: 'ROUTE: /studio // 3D MONOLITH',
    docs_arch_sec5_1_title: '5.1. Stripping Shell Strategy & Dynamic In-Memory Stream',
    docs_arch_sec5_1_desc: 'The CraftStudioConfigurator component applies a Stripping Shell strategy. The workstation interface is isolated from DOM memory leakage via a sandboxed container. The 3D compiler listens for parameter state changes and updates Euler/Quaternion transform matrices in a 16.6ms cycle (60 FPS) without ever triggering a full-page re-render.',
    docs_arch_sec5_2_title: '5.2. 5-Step Wizard Dock Technical Specifications',
    docs_arch_step1_badge: 'STEP 01',
    docs_arch_step1_title: 'Node Identification',
    docs_arch_step1_desc: 'Declare brandName, tagline, AST composition anchor, and node index prefixes.',
    docs_arch_step2_badge: 'STEP 02',
    docs_arch_step2_title: 'Color Matrix',
    docs_arch_step2_desc: 'Select color palettes: Obsidian/Indigo, Titanium/Cyan, or trigger AI auto-generation.',
    docs_arch_step3_badge: 'STEP 03',
    docs_arch_step3_title: '3D Kinematics',
    docs_arch_step3_desc: 'Calibrate 11-DOF bionic arm kinematics, harmonic drive ratios, and explodedProgress slider (0% to 100%).',
    docs_arch_step4_badge: 'STEP 04',
    docs_arch_step4_title: 'Telemetry Probes',
    docs_arch_step4_desc: 'Activate 1200+ magnetic spatial point cloud, telemetryFps frequency, and torquePrecision readouts.',
    docs_arch_step5_badge: 'STEP 05',
    docs_arch_step5_title: 'Zero-Disk Export',
    docs_arch_step5_desc: 'Export standalone runtime HTML, download lean JSON AST, or generate SDK embed code for TypeScript, Python, and ROS2.',

    docs_arch_sec6_badge: 'SECTION 06',
    docs_arch_sec6_title: '2-TIER GRACEFUL FALLBACK & GITOPS GOVERNANCE PROTOCOL',
    docs_arch_sec6_tag: 'SLA: ZERO-CRASH ARCHITECTURE',
    docs_arch_sec6_1_title: '6.1. 2-Tier Graceful Fallback Policy (Zero-Crash SLA)',
    docs_arch_sec6_1_desc: 'To fulfill the Zero-Crash SLA in high-traffic production environments, DynamicSectionRenderer establishes a dual-tier safety net:',
    docs_arch_fb1_badge: 'TIER 1',
    docs_arch_fb1_title: 'Static AST Sanitizer',
    docs_arch_fb1_layer: 'SCHEMA LAYER',
    docs_arch_fb1_desc: 'If an incoming payload references an unregistered preset or lacks required props, Sanitizer forces default to swiss-hud and uses title PRNG hash to fill missing params.',
    docs_arch_fb2_badge: 'TIER 2',
    docs_arch_fb2_title: 'Safe Fallback Component',
    docs_arch_fb2_layer: 'RUNTIME GPU LAYER',
    docs_arch_fb2_desc: 'If the client GPU loses WebGL context, React Error Boundary intercepts the exception and immediately renders a 2D Procedural SVG Wireframe canvas with diagnostics, preventing browser crashes.',
    docs_arch_sec6_2_title: '6.2. GitOps Handover & Build Gate Protocol',
    docs_arch_sec6_2_desc: 'Four immutable golden rules encoded into CI/CD pipelines and the AGENT.md constitution:',
    docs_arch_rule1_title: 'Rule 1: Scope Lock',
    docs_arch_rule1_desc: 'Strictly forbidden from modifying .tsx UI components for routine layout tasks. 100% of content and styling updates must occur via JSON schema files.',
    docs_arch_rule2_title: 'Rule 2: SSOT Registry Registration',
    docs_arch_rule2_desc: 'Any new graphics component created by human engineers must be fully registered in registry.ts before it can be referenced in JSON AST.',
    docs_arch_rule3_title: 'Rule 3: TypeScript Build Gate',
    docs_arch_rule3_desc: 'The npx tsc --noEmit command must pass with exactly 0 errors before any pull request is merged into the main branch.',
    docs_arch_rule4_title: 'Rule 4: Build Protection & Bundle Isolation',
    docs_arch_rule4_desc: 'All standalone export builds must remain isolated in dedicated workspaces, never bloating core application bundle size.',

    docs_arch_sec7_badge: 'SECTION 07',
    docs_arch_sec7_title: 'SYSTEM PERFORMANCE SUMMARY & DEVELOPER ROI',
    docs_arch_sec7_tag: 'FINAL VERDICT // BENCHMARK 2026',
    docs_arch_roi1_title: 'For Web3D Developers',
    docs_arch_roi1_desc: 'No more headache synchronizing React state with Three.js animation loops. Parameterize cameras, PBR materials, and kinematics with millisecond-exact JSON AST.',
    docs_arch_roi2_title: 'For AI Systems Engineers',
    docs_arch_roi2_desc: 'Eliminate 99% of useless token waste. Your LLM only focuses on domain logic and outputs ~50 JSON tokens. Agent execution speed increases 10x, API expenses converge to zero.',
    docs_arch_roi3_title: 'For Solution Architects',
    docs_arch_roi3_desc: 'A flawless decoupled architecture completely free of expensive server rendering nodes. Infinite scalability as 100% of 60 FPS graphics computation is offloaded to clients.',
    docs_arch_export_whitepaper: 'DOWNLOAD COMPLETE ARCHITECTURE SPECIFICATION:',
    docs_arch_btn_download_ast: '[ JSON AST ]',
    docs_arch_btn_export_pdf: '[ PDF VI/EN ]',
    docs_arch_btn_export_md: '[ MARKDOWN .MD ]',

    // Flipbook Library
    book_01_title: 'THE BRAIN AND THE MUSCLE',
    book_01_subtitle: 'Why Hybrid AI Architecture Is the Only Way Out of Hallucination Loops',
    book_02_title: 'THE TIMELINE IS DEAD',
    book_02_subtitle: 'Why Video Production Is Moving from Mouse Clicks to Deterministic Code',
    book_03_title: 'THE INVISIBLE HEAVY LIFTER',
    book_03_subtitle: 'Why FFmpeg Remains the Unsung Backbone of Every High-Throughput Video Pipeline',
    book_04_title: 'BRUTALISM AND THE GENERATIVE SEED',
    book_04_subtitle: 'How 1px Grids and Algorithmic Seeds Produce Infinite Unique Visuals at Zero Cost',
    book_05_title: 'FAIL FAST OR DRIFT FOREVER',
    book_05_subtitle: 'Why Zod Schema Guardrails Are Non-Negotiable in AI Agent Orchestration',
    book_06_title: 'THE EXPLODED FACTORY',
    book_06_subtitle: 'Why Static CAD Models Are Dead and Immersive 3D Kinematics Win',
    book_07_title: 'PHYSICAL AI & SPATIAL POINT CLOUD',
    book_07_subtitle: 'Eliminating Spatial Memory Drift in Real-Time Autonomous Systems',
    book_08_title: 'THE NO-CODE 3D AST ENGINE',
    book_08_subtitle: 'How Studio Configurator Transforms No-Code Actions into Real-Time 60FPS Web3D',
    book_09_title: 'CYBERNETIC BRUTALISM & IFRAME SANDBOXING',
    book_09_subtitle: 'Designing Resilient Web3D Architecture Without Shell Collisions or State Leaks',

    // SECTION 1: PYLON WORKBENCH
    pylonZoneTag: "TERMINAL // ZONE 03 // HEADLESS AGENT WORKBENCH",
    pylonMainHeading: "5 AUTONOMOUS PYLON TOWERS. ZERO CLOUD LATENCY. $0.00 RENDER COST.",
    pylonSubheading: "Decoupled multi-agent orchestration compiled directly into client-side WebGL kinematics. Eliminate massive cloud rendering bills with deterministic, edge-welded execution loops.",
    pylonConduitsTitle: "AUTONOMOUS PYLON CONDUITS",
    pylonInspectHint: "SELECT PYLON TO INSPECT",
    btnLaunchPylonStation: "LAUNCH STANDALONE 3D WORKSTATION",
    pylonTelemetryTitle: "PYLON TELEMETRY // 3D HUD",
    pylonStatusActive: "ACTIVE: DIFY.AI",
    pylonConduitLocked: "CONDUIT LOCKED",
    pylonThroughputLabel: "THROUGHPUT",
    pylonRenderFeeLabel: "RENDER FEE",

    // SECTION 2: STUDIO PLAYGROUND HUBS MATRIX
    matrixTag: "INTERACTIVE NODE MATRIX // 6 ENGINES",
    matrixHeading: "STUDIO PLAYGROUND HUBS",
    matrixSubheading: "Access the complete suite of deterministic AI, 3D procedural graphics, automated motion design, and open CAD telemetry engines.",
    btnLaunchFullMatrix: "LAUNCH FULL STUDIO MATRIX ➔",

    // Node Cards 01-06
    node01Title: "PROCEDURAL 3D RENDER ENGINE",
    node01Desc: "60 FPS Three.js procedural shader monolith with live audio synthesis.",
    btnEnterNode01: "ENTER ↗",

    node02Title: "REMOTION MOTION STUDIO",
    node02Desc: "Deterministic programmatic video generation with 4-layer Lego stack. Compose procedural motion graphics via React code.",
    btnLaunchNode02: "LAUNCH MOTION STUDIO ➔",

    node03Title: "AUTOMATED BANNER STUDIO",
    node03Desc: "Dynamic branding asset synthesis with SVG vector export, batch production, and headless automated delivery.",
    btnOpenNode03: "OPEN BANNER STUDIO ➔",

    node04Title: "OPEN MEKONG CAD VISUALIZER",
    node04Desc: "Real-time environmental CKAN data pipeline with waveform visualizer and line-art telemetry analysis.",
    btnOpenNode04: "OPEN MEKONG CAD ➔",

    node05Title: "PLUG AND PLAY SANDBOX",
    node05Desc: "Interactive sandbox environment for hot-reloading custom 3D meshes, GLTF/OBJ assets, and Zod AST payloads into the ARTIFICIAL CRAFT runtime pipeline.",
    btnOpenNode05: "OPEN PLUG & PLAY SANDBOX ➔",

    node06Title: "3D DATA METROPOLIS & CORPORATE PROFIT VISUALIZATION",
    node06Desc: "Transforms flat financial spreadsheets into an interactive 3D Voxel Matrix city running at 60 FPS in the browser. Features live Google Sheets API integration, procedural negative profit sub-level sinking effects, and 3D Head-to-Head Duel Mode.",
    btnLaunchNode06: "LAUNCH 3D METROPOLIS DEMO ➔",

    // SECTION 3: STUDIO CONFIGURATOR & CANVAS HUD
    configuratorHeader: "STUDIO CONFIGURATOR // NO-CODE 3D FACTORY",
    configuratorNodeBadge: "NODE 05 :: 3D MANUFACTURING FACTORY",
    enterFactoryNodeBtn: "ENTER FACTORY NODE ➔",
    b2bPopupTitle: "PLAYGROUND DEMO MODE",
    b2bPopupDesc: "You are currently experiencing the Playground Demo. Looking to forge custom, exclusive 3D Kinematics components tailored for your enterprise?",
    btnBookB2bConsultation: "BOOK B2B CONSULTATION & ENTERPRISE CONTRACT",

  },
  vi: {
    // Navigation
    nav_engine: 'ĐỘNG CƠ',
    nav_playground: 'SÂN CHƠI',
    nav_architecture: 'KIẾN TRÚC',
    nav_blueprints: 'SƠ ĐỒ MẪU',
    nav_blackbox: 'HỘP ĐEN',
    nav_experts: 'CHUYÊN GIA',
    nav_deploy_node: 'TRIỂN KHAI//NÚT',
    nav_studio_console: 'STUDIO//ĐIỀU HÀNH',
    nav_vibepath_studio: 'VibePath Studio ↗',
    nav_studios_hubs: 'STUDIOS HUBS ▾',
    subtag_version: 'v3.0//BRUTALIST',
    logo_subtag: 'CRAFT//CODE',

    // Hero Section
    telemetry_prefix: 'SYS//VIỄN THÔNG:',
    telemetry_status: '14 KHU VỰC TRỰC TUYẾN',
    telemetry_sla: 'SLA XÁC ĐỊNH 99.99%',
    hero_badge_subtag: 'CRAFT//CODE',
    hero_badge_text: 'ĐỘ CHÍNH XÁC ĐỒ HỌA THỦ CÔNG ĐẤU NỐI VÀO ĐƯỜNG ỐNG TỰ ĐỘNG HÓA',
    heroTitleLine1: 'ARTIFICIAL',
    heroTitleLine2: 'CRAFT',
    subtitle: 'Nơi Cây Cọ Thiết Kế Đồ Họa Gặp Đường Ống Tự Động Hóa AI.',
    ctaButton: 'Kích Hoạt Autopilot Studio',
    hero_cta_vibepath: '🚀 Khởi Chạy VibePath Studio',
    hero_cta_sandbox: 'Thử Nghiệm Sandbox Live',
    cta_explore: 'KHÁM PHÁ SƠ ĐỒ MẪU',
    exportBlueprint: 'Xuất Ảnh Sơ Đồ HD',

    // 3D Hook Canvas
    canvas_hook_parallax: '3D_MÓC//SONG SONG',
    canvas_fps_interactive: 'TƯƠNG TÁC 60FPS',
    canvas_pos_mouse: 'VỊ TRÍ [X: CHUỘT, Y: CHUỘT]',

    // Simulator Sandbox
    sim_placeholder: 'Dán URL endpoint để kích hoạt quy trình...',
    sim_run_btn: 'CHẠY MÔ PHỎNG',
    sim_executing: 'ĐANG THỰC THI NÚT...',
    preset_engine: 'ĐỘNG CƠ CẤU HÌNH SẴN:',
    preset_swiss: 'Hệ Thống Thiết Kế SWISS SKU',
    preset_brutalist: 'Hồ Sơ Pitchdeck Brutalist PDF',
    preset_financial: 'Chỉ Số Tài Chính Xác Định',
    workflow_engine: 'ĐỘNG CƠ QUY TRÌNH:',
    exec_status_executing: 'ĐANG THỰC THI',
    exec_status_ready: 'SẴN SÀNG',
    exec_completed_title: 'HOÀN THÀNH THỰC THI',
    metric_deterministic: 'Tính Xác Định',
    metric_token_cost: 'Chi Phí Token',
    metric_craft_precision: 'Độ Chính Xác Thiết Kế',
    run_another_sim: 'CHẠY MÔ PHỎNG KHÁC',
    output_nodes: 'NÚT ĐẦU RA',

    // Workflow Modes
    mode_content_label: 'Động Cơ Thiết Kế // Studio',
    mode_content_sublabel: 'Độ Chính Xác Đồ Họa → Phân Phối Xác Định',
    mode_content_desc:
      'Sự giao thoa giữa độ chuẩn xác của thiết kế và tự động hóa lập trình: AI Agent của Dify xử lý và quy chuẩn hóa ấn phẩm truyền thông, còn n8n đảm bảo luồng phân phối tự động chuẩn xác tuyệt đối trên các nền tảng.',
    mode_lead_label: 'Động Cơ Chấm Điểm Nút',
    mode_lead_sublabel: 'Dữ liệu đo từ xa → Định tuyến dự báo',
    mode_lead_desc:
      'Sự kiện Webhook đầu vào cung cấp cho bộ lọc thần kinh ARTIFICIAL CRAFT. Các vectơ hành vi thời gian thực được hợp nhất thành điểm số xác định với khả năng chống giới hạn tốc độ.',
    mode_research_label: 'Ma Trận RAG Nhân Tạo',
    mode_research_sublabel: 'Truy Xuất Vectơ → Tóm Tắt Cấu Trúc',
    mode_research_desc:
      'Truy xuất vector RAG lai sâu với xếp hạng lại BM25. Lõi lý luận Dify xây dựng trích dẫn trong khi n8n đảm bảo tuân thủ sơ đồ không sai lệch.',

    // Bento Grid
    bento_section_label: 'KIẾN TRÚC // ĐỘNG CƠ KÉP',
    bento_title_line1: 'HAI ĐỘNG CƠ. MỘT MÔI TRƯỜNG.',
    bento_title_line2: 'ĐỘ CHÍNH XÁC ĐỒ HỌA + ĐIỀU PHỐI MÃ.',
    bento_desc:
      'ARTIFICIAL CRAFT kết hợp ma trận lý luận của Dify với bộ điều phối thực thi của n8n. Thiết kế thương hiệu có cấu trúc và tự động hóa chính xác được liên kết bởi giới hạn kiểm soát không sai lệch.',
    card_hybrid_title: 'MÔI TRƯỜNG THỰC THI THIẾT KẾ LAI',
    card_hybrid_desc:
      'Nền tảng tư duy xử lý quy trình n8n dựa trên các kiểu dữ liệu rõ ràng, và vận hành các tác nhân Dify giống như các bước lập trình tuần tự',
    card_vibepath_title: 'Động Cơ Tự Động Hóa VibePath',
    card_vibepath_desc: 'Quy Trình AI Thế Hệ Mới & Studio Tương Tác',
    card_vibepath_link: 'Mở VibePath Studio ↗',
    node_trigger: 'KÍCH HOẠT',
    node_reason: 'LÝ LUẬN',
    node_vector: 'VECTƠ',
    node_guard: 'BẢO VỆ',
    node_fanout: 'PHÂN PHỐI',
    status_typed_tool: 'GỌI CÔNG CỤ CÓ KIỂU',
    status_streaming_matrix: 'MA TRẬN DÒNG',
    status_retry_eligible: 'CÓ THỂ THỬ LẠI',
    card_rag_title: 'MA TRẬN VECTOR RAG',
    card_rag_desc: 'Xếp hạng lại lai Pinecone + BM25 cho các thông số thiết kế SWISS.',
    rag_latency: 'ĐỘ TRỄ: 540ms',
    card_det_title: 'ĐỘNG CƠ XÁC ĐỊNH',
    card_det_desc: 'Chính sách tự động thử lại theo số nhân, lá chắn giới hạn tốc độ, cách ly lệnh lỗi.',
    row_retry: 'THỬ LẠI: LŨY THỪA · TỐI ĐA 5',
    row_rate_limit: 'GIỚI HẠN TỐC ĐỘ: DÒ DÌM THÍCH ỨNG',
    row_dead_letter: 'TỰ ĐỘNG THỬ LẠI: CHẶN QUÁ TẢI',
    card_router_title: 'BỘ ĐỊNH TUYẾN ĐA MÔ HÌNH',
    card_router_desc: 'GPT-4o, Claude, Llama — được định tuyến theo độ trễ, chi phí hoặc điểm thiết kế.',
    card_telemetry_title: 'THEO DÕI VIỄN THÔNG',
    card_telemetry_desc: 'Mọi token, cuộc gọi nút và sự kiện phân phối được ghi lại theo thời gian thực 60fps.',
    tracing_active: '● ĐANG THEO DÕI',
    card_guardrails_title: 'RÀO CHẮN SWISS',
    card_guardrails_desc: 'Đầu vào và đầu ra xác thực sơ đồ. 0% sai lệch âm thầm.',

    // Blueprint Library
    bp_section_label: 'THƯ VIỆN SƠ ĐỒ MẪU // MẪU',
    bp_title_line1: 'SƠ ĐỒ MẪU SẴN SÀNG SẢN XUẤT.',
    bp_title_line2: 'SAO CHÉP. TRIỂN KHAI. CHIA SẺ.',
    bp_desc:
      'Mỗi sơ đồ mẫu đi kèm với API có kiểu, cấu trúc nút và công cụ xuất ảnh định hình theo phong cách của khách hàng.',
    copy_api: 'SAO CHÉP API',
    copyApi: 'SAO CHÉP API',
    copied: 'ĐÃ SAO CHÉP',
    export_clean_screenshot: 'Xuất Ảnh Màn Hình Sạch',
    exportDiagram: 'XUẤT SƠ ĐỒ HD',
    inspectAst: 'SOI CHI TIẾT AST JSON',
    copyJson: 'SAO CHÉP JSON',
    rendering_hd: 'ĐANG DỰNG HD...',
    preview_ready: 'XEM TRƯỚC SẴN SÀNG',
    export_preview_title: 'XEM TRƯỚC KHI XUẤT',
    download_png: 'TẢI ẢNH PNG',
    bp_banner_title: 'TẤT CẢ SƠ ĐỒ MẪU LÀ MÃ NGUỒN MỞ',
    bp_banner_sub: 'GIẤY PHÉP MIT · SẴN SÀNG CHO CRAFT//CODE CLI',
    bp_browse_all: 'DUYỆT TẤT CẢ 40+ MẪU',
    bp_node_step: 'BƯỚC',
    bp_node_engine: 'ĐỘNG CƠ',
    bp_node_latency: 'ĐỘ TRỄ',
    bp_node_output: 'ĐẦU RA',

    // Blueprint Section Headers & Actions
    blueprintSectionTitle: 'SƠ ĐỒ ĐƯỜNG ỐNG TỰ ĐỘNG HÓA THỰC TẾ',
    blueprintSectionSubtitle: 'Các quy trình xử lý AI, đồ họa và động học 3D đã qua kiểm định thực tế, sẵn sàng triển khai.',
    btnDownloadJson: 'TẢI TỆP JSON',
    btnExportHdDiagram: 'XUẤT SƠ ĐỒ HD',
    btnInspectAstJson: 'SOI NGUYÊN MẪU AST',

    // Blueprint Descriptions (VI)
    bpImagePimDesc: 'Tự động hóa xử lý ảnh sản phẩm: Tách nền, căn Grid 75%, đổ bóng Contour Shadow 2 lớp và upload R2 CDN xuất file PNG + PSD.',
    bpLegoProtocolDesc: 'Kiến trúc Hybrid phân tách Bộ não suy luận (Dify) và Cơ bắp thực thi (n8n), tiết kiệm 98% chi phí token nhờ đúc & ghép JSON AST Component.',
    bpContourShadowDesc: 'Cỗ máy đổ bóng 4-Node độc lập, chạy trên CPU <0.08s, cho phép lùi lại từng bước tinh chỉnh opacity & blur không phá hủy.',
    bpGrafx3dDesc: 'Dây chuyền tích hợp GraFx Studio SDK (@chili-publish/studio-sdk) để tiêm biến số texture từ R2 vào viewport 3D tương tác real-time.',

    // LinkedIn Banner Studio Form
    banner_studio_title: 'Plug & Play Studio Banner LinkedIn (100% Automated & Free)',
    banner_full_name: 'Họ và Tên',
    banner_company_domain: 'Tên Miền / URL Logo',
    banner_job_title: 'Chức Danh Công Việc',
    banner_industry: 'Danh Mục Ngành Nghề',
    banner_industry_tech: 'Công Nghệ / AI / Dữ Liệu',
    banner_industry_design: 'Thiết Kế / Frontend',
    banner_industry_finance: 'Tài Chính / Mã Hóa',
    banner_industry_marketing: 'Marketing / Sáng Tạo',
    banner_palette: 'Bảng Màu',
    banner_palette_swiss: 'Trắng Đơn Sắc',
    banner_palette_cyan: 'Xanh Cyber',
    banner_palette_purple: 'Neon Purple (#5322ff)',
    banner_palette_amber: 'Hổ Phách Tự Nhiên',
    banner_export_button: 'Xuất Banner',

    // Experts Section
    experts_section_label: 'DANH MỤC CHUYÊN GIA // TUYỂN CHỌN',
    experts_title: 'ĐƯỢC ĐÁNH GIÁ BỞI NHỮNG NGƯỜI XÂY DỰNG TƯƠNG LAI.',
    experts_desc:
      'Mỗi quy trình được giới thiệu đều được kiểm toán, triển khai và bảo trì bởi các kỹ sư vận hành AI thực tế.',
    curated_workflow: 'QUY TRÌNH TUYỂN CHỌN',
    view_blueprint: 'XEM SƠ ĐỒ MẪU',
    stat_workflows: 'QUY TRÌNH SẢN XUẤT',
    stat_runs: 'LƯỢT CHẠY TÁC NHÂN / THÁNG',
    stat_regions: 'KHU VỰC MULTI-AZ',
    stat_sla: 'SLA XÁC ĐỊNH',

    // Footer Section
    footer_banner_tag: 'TRIỂN KHAI CRAFT//CODE',
    footer_banner_title: 'TRIỂN KHAI NÚT TÁC NHÂN ĐẦU TIÊN TRONG 90 GIÂY.',
    footer_banner_desc:
      'Không cần thẻ tín dụng. Không cần cuộc gọi tư vấn. Chỉ cần CLI, sơ đồ mẫu và URL webhook.',
    footer_start_building: 'BẮT ĐẦU XÂY DỰNG',
    footer_brand_desc:
      'ARTIFICIAL CRAFT (CRAFT//CODE): Biểu thị sự kết hợp giữa độ chính xác thiết kế đồ họa và hệ thống tự động hóa.',
    col_engine: 'ĐỘNG CƠ',
    col_developers: 'LẬP TRÌNH VIÊN',
    col_craft: 'THIẾT KẾ',
    link_vibepath_studio: 'VibePath Studio',
    link_architecture: 'Kiến Trúc',
    link_blueprints: 'Sơ Đồ Mẫu',
    link_telemetry: 'Viễn Thông',
    link_changelog: 'Lịch Sử Thay Đổi',
    link_status: 'Trạng Thái',
    link_documentation: 'Tài Liệu',
    link_api_reference: 'Tài Liệu API',
    link_cli_tool: 'Công Cụ CLI',
    link_self_host: 'Tự Cài Đặt',
    link_github: 'GitHub',
    link_about: 'Giới Thiệu',
    link_manifesto: 'Tuyên Ngôn',
    link_careers: 'Tuyển Dụng',
    link_partners: 'Đối Tác',
    link_contact: 'Liên Hệ',
    copyright_text:
      '© 2026 ARTIFICIAL CRAFT // CRAFT//CODE · HẠ TẦNG LAI DIFY + N8N',
    status_online: 'HỆ THỐNG TRỰC TUYẾN',
    privacy: 'BẢO MẬT',
    terms: 'ĐIỀU KHẢN',
    // Footer 3D Engine Link
    footerEngineBadge: "CỖ MÁY MÔ PHỎNG 3D",
    footerEngineTitle: "TRÌNH TRỰC QUAN HÓA KIẾN TRÚC 3D",
    footerEngineDesc: "Công cụ trực quan hóa sơ đồ 3D từ Frontend đến Backend & Cây thư mục AST. Thay thế slide tĩnh bằng không gian tương tác WebGL.",
    btnLaunchEngine: "MỞ CỖ MÁY 3D ↗",

    // Plug & Play Sandbox
    sandbox_section_label: 'CẮM & CHẠY // MÔ PHỎNG',
    sandbox_title: 'SÂN CHƠI THỬ NGHIỆM THUẬT TOÁN // TỐC ĐỘ CAO // AN TOÀN TUYỆT ĐỐI',
    sandbox_subtitle: 'Ép xung tham số & Giám sát dữ liệu chuẩn xác cho các thuật toán sinh hình độc bản.',
    sandbox_control_panel: 'BẢNG ĐIỀU KHIỂN',
    sandbox_cat_organic: 'Luồng & Hữu Cơ',
    sandbox_cat_structure: 'Hình Học & Cấu Trúc',
    sandbox_cat_biological: 'KTS & Sinh Học',
    sandbox_select_algo: 'Chọn Thuật Toán',
    sandbox_param_density: 'Mật Độ',
    sandbox_param_speed: 'Tốc Độ / Vận Tốc',
    sandbox_palette: 'Bảng Màu Lựa Chọn',
    sandbox_palette_cyberpunk: '01: Cyberpunk Neon',
    sandbox_palette_monochrome: '02: Brutalist Đơn Sắc',
    sandbox_palette_bauhaus: '03: Bauhaus Nguyên Bản',
    sandbox_palette_amber: '04: Hổ Phách Vàng',
    sandbox_randomize_seed: 'Tạo Hạt Giống Ngẫu Nhiên',
    sandbox_export_png: 'XUẤT PNG 2048px',
    sandbox_export_svg: 'XUẤT VECTOR SVG',
    sandbox_telemetry_title: 'BẢNG ĐO VIỄN THÔNG',
    sandbox_telemetry_status: 'SYS//HỆ THỐNG: HOẠT ĐỘNG',
    sandbox_telemetry_algo: 'THUẬT TOÁN',
    sandbox_telemetry_category: 'DANH MỤC',
    sandbox_telemetry_density: 'MẬT ĐỘ',
    sandbox_telemetry_speed: 'TỐC ĐỘ',
    sandbox_telemetry_palette: 'BẢNG MÀU',
    sandbox_telemetry_seed: 'MÃ HẠT GIỐNG',
    sandbox_telemetry_fps: 'TỐC ĐỘ KHUNG HÌNH',
    sandbox_telemetry_frametime: 'THỜI GIAN KHUNG',
    sandbox_telemetry_resolution: 'ĐỘ PHÂN GIẢI CANVAS',
    sandbox_canvas_interactive: 'CANVAS 2D // TƯƠNG TÁC',

    // CSV Visualizer Section
    csv_section_label: 'OPEN MEKONG CKAN // ĐỘNG CƠ DỮ LIỆU // MÔ PHỎNG CSV',
    csv_title: 'TRỰC QUAN HÓA DỮ LIỆU MỞ MEKONG THỜI GIAN THỰC',
    csv_subtitle: 'Tải trực tiếp tập dữ liệu mở từ Open Development Mekong và chuyển đổi thành đồ họa bản thiết kế Swiss CAD & chỉ số đo từ xa.',
    csv_dropzone_title: 'KÉO & THẢ FILE CSV TÙY CHỈNH',
    csv_dropzone_desc: 'hoặc nhấp để chọn tệp .csv từ máy tính',
    csv_preset_label: 'TẬP DỮ LIỆU MỞ MEKONG (CKAN PLATFORM):',
    csv_fetch_random: '🎲 Lấy Dữ Liệu Ngẫu Nhiên',
    csv_loading_dataset: 'ĐANG TẢI DỮ LIỆU CSV TỪ CKAN MEKONG...',
    csv_source_url: 'URL NGUỒN DỮ LIỆU',
    csv_preset_latency: '01. Độ Trễ Máy Chủ',
    csv_preset_crypto: '02. Biến Động Mã Hóa',
    csv_preset_telemetry: '03. Thực Thi AI Token',
    csv_col_x: 'CỘT TRỤC X (DANH MỤC / NGÀY THÁNG)',
    csv_col_y: 'CỘT TRỤC Y (CHỈ SỐ / GIÁ TRỊ)',
    csv_mode_label: 'CHẾ ĐỘ TRỰC QUAN HÓA',
    csv_mode_waveform: '01. Dạng Sóng Cyber / Lưới Đường',
    csv_mode_matrix: '02. Ma Trận Mật Độ Brutalist / Khối Thanh',
    csv_mode_candlestick: '03. Biểu Đồ Nến Thuật Toán / Lưới Tài Chính',
    csv_palette_label: 'BẢNG MÀU',
    csv_palette_neon: 'Cyberpunk Neon (#5322ff / #00E5FF)',
    csv_palette_mono: 'Brutalist Monochrome (#FFFFFF)',
    csv_telemetry_title: 'BẢNG ĐO VIỄN THÔNG DỮ LIỆU',
    csv_telemetry_rows: 'TỔNG SỐ DÒNG',
    csv_telemetry_min: 'GIÁ TRỊ TỐI THIỂU',
    csv_telemetry_max: 'GIÁ TRỊ TỐI ĐA',
    csv_telemetry_avg: 'GIÁ TRỊ TRUNG BÌNH',
    csv_telemetry_fps: 'TỐC ĐỘ KHUNG HÌNH',

    // Existential Blackbox Section
    blackbox_title: 'BỀ MẶT NỀN // ĐỘNG CƠ 60FPS',
    blackbox_subtitle: 'HỘP ĐEN HIỆN SINH',
    blackbox_status_processing: 'ĐANG_XỬ_LÝ_PAYLOAD',
    blackbox_status_idle: 'ĐANG_CHỜ_NHÀN_RỖI',
    blackbox_framerate: 'TỐC ĐỘ KHUNG HÌNH: 60 FPS',
    blackbox_headless: 'SÁNG TẠO VIÊN KHÔNG ĐẦU: VẮNG MẶT',
    blackbox_core_logic: 'LÕI LÝ LUẬN: RUST // DIFY // N8N',
    blackbox_manifesto_title: 'MỘT HÌNH THỨC // NHẤT NGUYÊN MỚI //',
    blackbox_manifesto_quote: '"Chín năm căn chỉnh từng pixel hợp nhất vào hệ thống sáng tạo tự động. Tốc độ máy móc cùng tâm hồn con người chạy chung trong một đường dẫn."',
    blackbox_portfolio_btn: '[ ↗ XEM HỒ SƠ NĂNG LỰC CON NGƯỜI (2016-2025) CHỨNG THỰC NỀN TẢNG THIẾT KẾ ]',
    blackbox_terminal_title: '> BẢNG_ĐIỀU_KHIỂN_TERMINAL',
    blackbox_click_cmd: '// NHẤP LỆNH ĐỂ THỰC THI PHẢN HỒI TÁC NHÂN:',
    blackbox_run: 'CHẠY',
    blackbox_awaiting: '[ ĐANG CHỜ THỰC THI LỆNH... NHẤP VÀO LỆNH BẤT KỲ Ở TRÊN ]',
    blackbox_manifesto_footer: 'TUYÊN NGÔN: SÁNG TẠO VIÊN KHÔNG ĐẦU ĐANG VẬN HÀNH',
    blackbox_autonomous: 'ĐỘC LẬP // TỰ DO // HẠNH PHÚC 100%',
    blackbox_q1_q: 'Q1: Máy tính của tôi vừa nổ tung vì chập điện. Tôi có thể dùng lý do này để xin sếp hoãn deadline deploy sản phẩm sáng nay không?',
    blackbox_q1_a: 'A: Xin chia buồn, nhưng KHÔNG. Nếu bạn thiết kế kiến trúc hệ thống đúng cách, sự tồn tại vật lý của bạn lúc này là vô giá trị. Các asynchronous workers của bạn đang nằm cô lập trên cụm VPS Hetzner ở tận nước Đức xa xôi. Chúng không quan tâm cái laptop của bạn đã thành một cục gạch. Chúng vẫn đang liên tục cào payload, băm JSON và đẩy dữ liệu phẳng lỳ lên Cloudflare R2 trong lúc bạn đang đi mượn đèn pin. Hệ thống bất tử, chỉ có bạn là đang đứng ngoài cuộc chơi.',
    blackbox_q2_q: 'Q2: Nhưng nếu tôi đi ngủ, con AI tự trị chạy ngầm trên VPS có hoảng loạn và sập nguồn khi nó đụng phải giới hạn lượt gọi (Rate Limit HTTP 429) của API bên thứ ba không?',
    blackbox_q2_a: 'A: Khác với con người, máy móc không biết hoảng loạn; chúng chỉ lẳng lặng chết lâm sàng trong bóng tối cho đến khi có ai đó check log. Tuy nhiên, một hệ luồng tinh khôn được viết bằng nhân Rust hoặc thiết lập qua n8n luôn có tầng phòng thủ middleware. Khi đụng lỗi 429, con AI sẽ tự động bắt lấy mã lỗi (Catch Error), tự tính toán độ trễ tăng dần theo thuật toán (Exponential Backoff), dừng lại thở trong 5 giây, rồi tự động bắn lại request. Nó dọn dẹp các cấu trúc dữ liệu nặng một cách mượt mà lúc 3 giờ sáng khi bạn đang say giấc.',
    blackbox_q3_q: 'Q3: Tôi thức trắng đêm vì ác mộng: Con AI dính một lỗi logic (Bug) rồi rơi vào vòng lặp vô hạn, đốt sạch 5.000$ tiền API Key của tôi trước khi mặt trời mọc. Làm sao để dừng sự điên rồ này lại?',
    blackbox_q3_a: 'A: Chào mừng bạn đến với cơn ác mộng kinh điển của dân Automation: "Infinite Token Burn". Đó là lý do tại sao chúng ta sinh ra các rào chắn (Strict Guardrails). Bằng cách bọc toàn bộ môi trường chạy của Agent vào trong một Container cô lập, bạn giới hạn không gian sinh tồn của nó. Cài đặt thêm tham số max-iteration = 10 trong luồng suy luận của Dify. Nếu nó thử sai quá 10 lần, hệ thống sẽ tự động kích hoạt lệnh tự hủy (Kill Process) và bắn một alert cảnh báo về Slack, thay vì cắm thẻ tín dụng của bạn vào nhà đài OpenAI để cúng tiền cho Sam Altman.',
    blackbox_q4_q: 'Q4: Suốt ngày thấy các bạn rêu rao "Đang đánh thức phần mềm dậy" (Waking software up). Thế con AI kết nối qua cổng MCP của tôi có linh hồn không? Nó có mơ về những con cừu điện không?',
    blackbox_q4_a: 'A: Tuyệt đối không. Nó chỉ mơ về Structured JSON và Hệ lưới Swiss Grid. Khi chúng tôi nói một phần mềm "thức dậy" hay "nằm mơ", đó chỉ là cách nói văn hoa cho các tác vụ Cron-job chạy ngầm định kỳ để cập nhật kho tàng trí nhớ vector (Vector Embedded Memory). Hệ thống chỉ đang băm text, giải quyết các mâu thuẫn dữ liệu logic và tính toán ma trận tuyến tính để khi bạn thức dậy bật máy lên, nó có sẵn ngữ cảnh tốt nhất để phục vụ bạn. Không có tri thức, không có nhận thức — ở đây chỉ có đại số tuyến tính thuần túy.',
    blackbox_q5_q: 'Q5: Nếu các luồng tự động hóa dựa trên sự kiện (Event-driven Pipelines) đã lo hết 100% từ cào dữ liệu, xử lý ảnh, đến render video và tự deploy lên mạng... thế tôi ngồi đây để nhận lương làm gì?',
    blackbox_q5_a: 'A: Chúc mừng, bạn đã chính thức tốt nghiệp từ vị trí "Gã thợ đẩy bánh răng" để trở thành "Tác giả của hệ thống". Việc của bạn không phải là ngồi mở Canva lên kéo thả hay cặm cụi sửa từng pixel UI nữa. Việc của bạn là đứng ở đỉnh tháp kiến trúc, theo dõi các chỉ số sức khỏe của máy chủ trên GCP Cloud Logging, phát hiện cổ chai hệ thống và chỉ cỗ máy lao vào giải quyết những bài toán phức tạp hơn. Bạn được trả tiền cho tư duy chiến lược, kiến trúc hệ thống và gu thẩm mỹ khắt khe của bạn.',
    blackbox_q6_q: 'Q6: Được rồi. Nhưng chuyện gì sẽ xảy ra nếu con AI làm xong hết việc lúc 3 giờ sáng và nhận ra nó hoàn toàn không cần đến tôi nữa?',
    blackbox_q6_a: 'A: Nó sẽ tự động bắn một tin nhắn vào kênh Slack của bạn với nội dung: “Pipeline executed successfully. 1000 items rendered. What\'s next, Boss?”. Và đó chính là bi kịch hiện sinh, là gánh nặng khủng khiếp nhất của kỷ nguyên AI: Bạn thức dậy lúc 8 giờ sáng để nhận ra toàn bộ việc chân tay nặng nhọc đã được dọn sạch, và bạn không còn việc gì để làm ngoại trừ việc phải ngồi xuống và vắt óc nghĩ ra một ý tưởng nguyên bản.',

    // Docs Architecture & System Manual
    nav_docs_architecture: '03 // KIẾN TRÚC HỆ THỐNG & CẨM NANG',
    nav_docs_architecture_desc: 'Cẩm Nang Vận Hành 0-Code JSON & WebGL',

    docs_arch_breadcrumb_spec: 'SPEC//2026.11-REV4',
    docs_arch_breadcrumb_title: 'BÁO CÁO KỸ THUẬT HỆ THỐNG // ARTIFICIALCRAFT.SPACE',
    docs_arch_breadcrumb_node: 'TÀI LIỆU CỤM NODE 01-05 CLUSTER',
    docs_arch_zod_enforced: 'XÁC THỰC: CỔNG ZOD KÍCH HOẠT',
    docs_arch_classification_tag: 'BẠCH THƯ KIẾN TRÚC CRAFT//CODE // PHIÊN BẢN 2026.11',
    docs_arch_ssot_cluster: 'CỤM SSOT: MÔI TRƯỜNG SẢN XUẤT',
    docs_arch_public_spec: 'PHÂN LOẠI: ĐẶC TẢ KỸ THUẬT CÔNG KHAI',

    docs_arch_hero_title: 'BÁO CÁO KỸ THUẬT: KIẾN TRÚC 0-CODE JSON-DRIVEN VÀ MÔ HÌNH PHÂN TẦNG VẬN HÀNH TẠI ARTIFICIALCRAFT.SPACE',
    docs_arch_hero_desc: 'Đặc tả kỹ thuật sâu về cơ chế triệt tiêu 99% chi phí token LLM qua kiến trúc 3-Tier Decoupled, đóng băng mã nguồn TSX, bảo vệ schema qua Zod Gate và chuyển giao toàn bộ tải render 60 FPS về Client-Side GPU WebGL.',

    docs_arch_metric_cost_label: 'Chi phí Render Server',
    docs_arch_metric_cost_val: '$0.00',
    docs_arch_metric_cost_unit: '/ THÁNG',
    docs_arch_metric_cost_sub: 'Client-Side GPU Offload (Zero Puppeteer)',
    docs_arch_metric_fps_label: 'SLA Xác Định Cố Định',
    docs_arch_metric_fps_val: '60.0',
    docs_arch_metric_fps_sub: 'Three.js / WebGL Không Rò Rỉ GC',
    docs_arch_metric_token_label: 'Payload JSON AST',
    docs_arch_metric_token_val: '~50',
    docs_arch_metric_token_sub: 'Tiết kiệm 99% Context Bloat LLM',
    docs_arch_metric_zod_label: 'Cổng Xác Thực Schema',
    docs_arch_metric_zod_val: '0%',
    docs_arch_metric_zod_unit: 'SAI LỆCH',
    docs_arch_metric_zod_sub: 'Zod safeParse Ngắt Mạch Lập Tức',
    docs_arch_metric_failover_label: 'SLA Kháng Lỗi',
    docs_arch_metric_failover_val: 'ZERO-CRASH',
    docs_arch_metric_failover_sub: 'Chính Sách Kháng Lỗi 2 Lớp Cứu Hộ',

    docs_arch_toc_label: 'MỤC LỤC:',
    docs_arch_toc_sec1: '01. KIẾN TRÚC 3-TIER',
    docs_arch_toc_sec2: '02. 0-CODE JSON-DRIVEN',
    docs_arch_toc_sec3: '03. CYBERNETIC SSOT',
    docs_arch_toc_sec4: '04. ZERO-TRUST ZOD GATE',
    docs_arch_toc_sec5: '05. STUDIO ENGINE STREAM',
    docs_arch_toc_sec6: '06. 2-TIER FALLBACK',
    docs_arch_toc_sec7: '07. HIỆU NĂNG & ACTION',

    docs_arch_sec1_badge: 'PHẦN 01',
    docs_arch_sec1_title: 'TỔNG QUAN KIẾN TRÚC & TRIẾT LÝ THIẾT KẾ HỆ THỐNG',
    docs_arch_sec1_tag: 'PARADIGM: 3-TIER DECOUPLED // $0 RENDER COST',
    docs_arch_sec1_1_title: '1.1. Mô hình Vận hành Phân tầng (3-Tier Decoupled Operational Paradigm)',
    docs_arch_sec1_1_desc: 'Kiến trúc ARTIFICIALCRAFT.SPACE triệt để phân ly chức năng giữa bộ não tư duy AI, bộ máy điều phối luồng và màn chiếu biểu diễn đồ họa. Thay vì bắt LLM sinh trực tiếp hàng ngàn dòng code giao diện không ổn định, hệ thống phân định ba tầng ranh giới bất biến:',
    docs_arch_sec1_schematic_title: 'CAD ARCHITECTURE TOPOLOGY // BLUEPRINT SCHEMATIC',
    docs_arch_sec1_schematic_sync: '[ SYNC: DETERMINISTIC 60FPS BUS ]',
    docs_arch_tier1_badge: 'TIER 01',
    docs_arch_tier1_name: 'REASONING CORE',
    docs_arch_tier1_sub: '"THE BRAIN" // Dify Cloud & Vertex AI',
    docs_arch_tier1_desc: 'Chuyên biệt hóa nhận định ngữ cảnh nghiệp vụ, tiếp nhận prompt người dùng và lập luận logic. Hoàn toàn không xử lý mã nguồn TSX hay render DOM.',
    docs_arch_tier1_emit: 'EMITS: Pure JSON AST',
    docs_arch_tier1_payload: 'Payload kích thước ~50 tokens',
    docs_arch_tier2_badge: 'TIER 02',
    docs_arch_tier2_name: 'DETERMINISTIC MUSCLE',
    docs_arch_tier2_sub: '"THE MUSCLE" // n8n Swarm Orchestrator',
    docs_arch_tier2_desc: 'Động cơ điều phối workflow không trạng thái (stateless worker). Định tuyến webhook, thực thi logic biến đổi dữ liệu, xác thực rate-limit và bảo đảm schema.',
    docs_arch_tier2_dispatch: 'DISPATCH: Webhook Proxy / Validation',
    docs_arch_tier2_payload: 'Không tiêu tốn LLM token vào JSON parsing',
    docs_arch_tier3_badge: 'TIER 03',
    docs_arch_tier3_name: 'PRESENTATION CANVAS',
    docs_arch_tier3_sub: '"THE PROJECTOR" // artificialcraft.space',
    docs_arch_tier3_desc: 'Frontend Next.js đóng vai trò màn chiếu thuần túy. Biên dịch JSON AST nhận được vào cấu trúc WebGL 3D, Remotion video preview hoặc Swiss HUD component.',
    docs_arch_tier3_exec: 'EXEC: Client GPU WebGL 60 FPS',
    docs_arch_tier3_payload: 'Chi phí Server Render: $0.00 / tháng',
    docs_arch_flow_tier1: 'TIER 1 (LLM Inference)',
    docs_arch_flow_tier2: 'TIER 2 (n8n JSON Dispatch)',
    docs_arch_flow_tier3: 'TIER 3 (Client WebGL Shader Engine)',

    docs_arch_sec1_2_title: '1.2. Triết lý "Data Projector" và Cơ chế Offloading Client-Side GPU',
    docs_arch_sec1_2_desc: 'Các mô hình tạo sinh truyền thống thường sử dụng Server-Side Rendering hoặc các cụm headless browser (Puppeteer/Playwright) ngốn CPU/RAM khủng khiếp để render đồ họa hoặc quay video trên máy chủ. ARTIFICIALCRAFT.SPACE đảo ngược hoàn toàn tư duy này:',
    docs_arch_table_col_crit: 'Tiêu chí Đánh giá',
    docs_arch_table_col_old: 'Server-Side Headless Render (Cũ)',
    docs_arch_table_col_new: 'Kiến trúc Data Projector (ArtificialCraft)',
    docs_arch_table_r1_crit: 'Chi phí hạ tầng Server',
    docs_arch_table_r1_old: '$250 - $1,200/tháng (Cụm Cloud GPU/EC2 Render Nodes)',
    docs_arch_table_r1_new: '$0.00 / tháng (Khách tự dùng GPU của thiết bị cá nhân)',
    docs_arch_table_r2_crit: 'LLM Context Consumption',
    docs_arch_table_r2_old: '2,500 - 8,000 tokens (Toàn bộ component TSX + CSS styles)',
    docs_arch_table_r2_new: '~50 tokens (Chỉ sinh JSON AST tham số hóa)',
    docs_arch_table_r3_crit: 'Độ trễ phản hồi (Latency)',
    docs_arch_table_r3_old: '15s - 45s (Compile TSX, bundling, Webpack build, render)',
    docs_arch_table_r3_new: '< 150ms (Truyền tải JSON và Hydrate ngay tức thì)',
    docs_arch_table_r4_crit: 'Tốc độ khung hình (FPS)',
    docs_arch_table_r4_old: 'Không ổn định, giật lag trên stream (15 - 30 FPS)',
    docs_arch_table_r4_new: 'Chuẩn 60.0 FPS cố định phần cứng (Three.js WebGL)',
    docs_arch_table_r5_crit: 'Rủi ro Lỗi Runtime',
    docs_arch_table_r5_old: 'Cao (LLM sinh sai cú pháp JS/TS, thiếu import, crash UI)',
    docs_arch_table_r5_new: '0% (Được chặn bởi Zod Schema Gate & Fallback Component)',

    docs_arch_sec2_badge: 'PHẦN 02',
    docs_arch_sec2_title: 'GIẢI PHÁP 0-CODE JSON-DRIVEN TRIỆT TIÊU "CONTEXT BLOAT" CHO AI WORKERS',
    docs_arch_sec2_tag: 'TOKEN REDUCTION: 99% EFFICIENCY',
    docs_arch_sec2_1_title: '2.1. Phân tích vấn đề Context Bloat & AI Worker Memory Exhaustion',
    docs_arch_sec2_1_desc: 'Khi ép các mô hình AI viết code UI hoàn chỉnh (.tsx / .vue), kích thước prompt tăng theo cấp số nhân dẫn đến 4 hiện tượng thảm họa trong môi trường sản xuất:',
    docs_arch_fail1_title: 'Hallucinated Code',
    docs_arch_fail1_desc: 'AI tự bịa ra các hook React không tồn tại hoặc các hàm lifecycle lỗi thời do cạn kiệt context window.',
    docs_arch_fail2_title: 'Missing Imports',
    docs_arch_fail2_desc: 'Quên khai báo các thư viện npm quan trọng (Three.js, Lucide, Framer) làm đứt đoạn tiến trình compile webpack.',
    docs_arch_fail3_title: 'Props Mismatch',
    docs_arch_fail3_desc: 'Sai lệch kiểu dữ liệu TypeScript (props mismatch), gây gãy kết nối giữa API contract và component rendering.',
    docs_arch_fail4_title: 'Non-Deterministic Layout',
    docs_arch_fail4_desc: 'Vỡ layout CSS responsive trên mobile, phá hỏng tính thẩm mỹ nghiêm ngặt của chuẩn Cybernetic Brutalism.',
    docs_arch_sec2_2_title: '2.2. So sánh Kiến trúc .TSX Truyền thống vs. 0-Code JSON-Driven',
    docs_arch_comp_col_metric: 'Chỉ số Vận hành',
    docs_arch_comp_col_tsx: 'Sinh Code Trực Tiếp (.TSX)',
    docs_arch_comp_col_json: '0-Code JSON-Driven (AST)',
    docs_arch_comp_r1_metric: 'Kích thước Payload',
    docs_arch_comp_r1_tsx: '~85 KB (Mã nguồn component TSX)',
    docs_arch_comp_r1_json: '~0.6 KB (Cấu trúc JSON AST)',
    docs_arch_comp_r2_metric: 'Chi phí Token LLM',
    docs_arch_comp_r2_tsx: '~3,200 Tokens / lượt sinh',
    docs_arch_comp_r2_json: '~50 Tokens (Tiết kiệm 98.4%)',
    docs_arch_comp_r3_metric: 'Thời gian Hydration',
    docs_arch_comp_r3_tsx: '8 - 15s (Biên dịch Babel/SWC)',
    docs_arch_comp_r3_json: '0ms (Bơm trực tiếp in-memory)',
    docs_arch_comp_r4_metric: 'Độ An Toàn Kiểu Dữ Liệu',
    docs_arch_comp_r4_tsx: 'Nguy hiểm (Chạy dynamic eval)',
    docs_arch_comp_r4_json: 'Tuyệt đối (Kiểm tra Zod safeParse)',
    docs_arch_sec2_3_title: '2.3. Cơ chế Đóng băng Lớp Component & Cập nhật Giao diện qua JSON AST',
    docs_arch_sec2_3_desc: 'Toàn bộ các phân hệ chính trên ARTIFICIALCRAFT.SPACE được cấu hình từ các file JSON trung tâm được quản lý phiên bản nghiêm ngặt:',
    docs_arch_hub1_file: 'site-configs/template-schema.json',
    docs_arch_hub1_desc: 'Điều phối cấu trúc layout trang chủ, danh sách node định tuyến, ma trận thông số kỹ thuật và các tham chiếu component.',
    docs_arch_hub2_file: 'src/data/showcase-config.json',
    docs_arch_hub2_desc: 'Quản lý danh sách video Remotion 60FPS, timeline kịch bản, camera zoom spline và các nhãn telemetry HUD.',
    docs_arch_hub3_file: 'src/data/flipbook-registry.json',
    docs_arch_hub3_desc: 'Cung cấp dữ liệu cho động cơ 3D Interactive Flipbooks, tài liệu hướng dẫn kỹ thuật và danh bạ component chuẩn SSOT.',

    docs_arch_sec3_badge: 'PHẦN 03',
    docs_arch_sec3_title: 'NGÔN NGỮ THIẾT KẾ CYBERNETIC SWISS BRUTALISM & HỆ THỐNG SSOT REGISTRY MATRIX',
    docs_arch_sec3_tag: 'STANDARDS: ZERO-SOFT-RADIUS // CARTESIAN GRIDS',
    docs_arch_sec3_1_title: '3.1. Hệ thống Design Tokens Cybernetic Swiss Brutalism',
    docs_arch_sec3_1_desc: 'Thiết kế tôn vinh sự kết hợp giữa chủ nghĩa quốc tế Thụy Sĩ (Swiss International Typographic Style) với sự thô ráp chính xác của Cybernetic Brutalism: đường cắt 0px radius, hệ lưới tọa độ 1px hairline, và sự tương phản tuyệt đối giữa nền Obsidian và các xung điện quang Cyan/Indigo.',
    docs_arch_token_obsidian: 'Canvas Obsidian',
    docs_arch_token_obsidian_desc: '#09090B / #0B0B0F - Nền tảng cấu trúc',
    docs_arch_token_indigo: 'Electric Indigo',
    docs_arch_token_indigo_desc: '#5322FF - Lõi tính toán phân tán',
    docs_arch_token_cyan: 'Neon Cyan',
    docs_arch_token_cyan_desc: '#00E5FF - Tín hiệu vận hành',
    docs_arch_token_green: 'Matrix Green',
    docs_arch_token_green_desc: '#00FF66 - SLA Đo lường 60FPS',
    docs_arch_sec3_2_title: '3.2. Cấu trúc Repository Tree & Quy chuẩn SSOT Registry Protocol (src/core/registry.ts)',
    docs_arch_repo_tree_title: 'KIẾN TRÚC THƯ MỤC SSOT',
    docs_arch_props_interface_title: 'QUY CHUẨN UNIVERSAL COMPONENT',

    docs_arch_sec4_badge: 'PHẦN 04',
    docs_arch_sec4_title: 'CƠ CHẾ ZERO-TRUST BACKEND-TO-FRONTEND & ZOD SCHEMA GATES',
    docs_arch_sec4_tag: 'GATEWAY: safeParse SHORT-CIRCUIT',
    docs_arch_sec4_1_title: '4.1. Quy trình 3 bước xác thực tại Next.js API Route Handler',
    docs_arch_sec4_1_desc: 'Để bảo vệ tuyệt đối runtime của Client khỏi các payload JSON bất thường do LLM bị ảo giác (hallucination) hoặc do tấn công giả mạo, API Route Handler tại src/app/api/craft/generate/route.ts thi hành cơ chế kiểm soát 3 cổng không thỏa hiệp:',
    docs_arch_gate1_title: 'Cổng 01: Khám phá Môi trường',
    docs_arch_gate1_desc: 'Kiểm tra token xác thực webhook Dify và n8n, chữ ký bearer headers và tính toàn vẹn của tên miền yêu cầu.',
    docs_arch_gate2_title: 'Cổng 02: Hợp đồng Hệ thống',
    docs_arch_gate2_desc: 'Đối chiếu đặc tả JSON Schema, xác minh các trường bắt buộc: id, preset, title, theme và từ điển tham số props.',
    docs_arch_gate3_title: 'Cổng 03: Ngắt Mạch Zod safeParse',
    docs_arch_gate3_desc: 'Thực thi kiểm tra kiểu dữ liệu runtime. Nếu preset hoặc props có dấu hiệu sai lệch, lập tức ngắt mạch trả về HTTP 400 kèm mã lỗi chi tiết.',
    docs_arch_inspector_title: 'BẢNG SOÁT MÃ NGUỒN TƯƠNG TÁC // TELEMETRY TERMINAL',
    docs_arch_tab_ast: '01 // PAYLOAD JSON AST (~50 TOKENS)',
    docs_arch_tab_zod: '02 // SCHEMA XÁC THỰC ZOD (safeParse GATE)',
    docs_arch_tab_stream: '03 // ĐƯỜNG DẪN STREAM PAYLOAD (AST VÀO CANVAS)',
    docs_arch_btn_copy: 'SAO CHÉP MÃ',
    docs_arch_btn_copied: '[ ĐÃ SAO CHÉP ✓ ]',
    docs_arch_btn_validate: '[ KIỂM TRA PAYLOAD ]',
    docs_arch_validate_success: '[ CỔNG XÁC THỰC: ZOD CHẤP THUẬN // 0 LỖI // SẴN SÀNG 60FPS ]',

    docs_arch_sec5_badge: 'PHẦN 05',
    docs_arch_sec5_title: 'ĐỘNG CƠ STUDIO CONFIGURATOR ENGINE & KỸ THUẬT STREAMING IN-MEMORY',
    docs_arch_sec5_tag: 'ROUTE: /studio // 3D MONOLITH',
    docs_arch_sec5_1_title: '5.1. Stripping Shell Strategy & Dynamic In-Memory Stream',
    docs_arch_sec5_1_desc: 'Thành phần CraftStudioConfigurator.tsx áp dụng chiến lược phân tách vỏ ngoài (Stripping Shell). Giao diện trạm làm việc được cách ly tuyệt đối khỏi các hiệu ứng rò rỉ bộ nhớ DOM bằng container sandbox Iframe. Trình biên dịch 3D chỉ lắng nghe sự thay đổi của các trường trạng thái và cập nhật các ma trận biến đổi Euler/Quaternion theo chu kỳ 16.6ms (60 FPS) mà không bao giờ trigger re-render toàn bộ trang web.',
    docs_arch_sec5_2_title: '5.2. Thông số Kỹ thuật 5-Step Wizard Dock',
    docs_arch_step1_badge: 'BƯỚC 01',
    docs_arch_step1_title: 'Định danh Node',
    docs_arch_step1_desc: 'Khai báo brandName, tagline, mỏ neo định danh AST composition và tiền tố node.',
    docs_arch_step2_badge: 'BƯỚC 02',
    docs_arch_step2_title: 'Ma trận Bảng màu',
    docs_arch_step2_desc: 'Lựa chọn bảng màu: Obsidian/Indigo, Titanium/Cyan hoặc kích hoạt handleAIGeneratePalette để AI phối màu tự động.',
    docs_arch_step3_badge: 'BƯỚC 03',
    docs_arch_step3_title: 'Động học Khớp 3D',
    docs_arch_step3_desc: 'Điều chỉnh động học cánh tay bionic 11-DOF, hộp giảm tốc sóng ứng suất (harmonic drive) và thanh trượt tách khối explodedProgress từ 0% đến 100%.',
    docs_arch_step4_badge: 'BƯỚC 04',
    docs_arch_step4_title: 'Cảm biến Đo lường',
    docs_arch_step4_desc: 'Kích hoạt đám mây 1200+ điểm từ trường không gian, tần số giám sát telemetryFps và chỉ số lực xoắn torquePrecision.',
    docs_arch_step5_badge: 'BƯỚC 05',
    docs_arch_step5_title: 'Xuất Bản Không Ghi Đĩa',
    docs_arch_step5_desc: 'Xuất file HTML đơn đóng gói sẵn runtime, tải JSON AST tinh gọn hoặc trích xuất mã nhúng cho TypeScript, Python, ROS2 và C++ robot SDKs.',

    docs_arch_sec6_badge: 'PHẦN 06',
    docs_arch_sec6_title: 'CHÍNH SÁCH KHÁNG LỖI 2-TIER GRACEFUL FALLBACK & QUY TRÌNH GITOPS GOVERNANCE',
    docs_arch_sec6_tag: 'SLA: ZERO-CRASH ARCHITECTURE',
    docs_arch_sec6_1_title: '6.1. Mô hình 2-Tier Graceful Fallback Policy (Zero-Crash SLA)',
    docs_arch_sec6_1_desc: 'Để bảo đảm cam kết Zero-Crash trong môi trường sản xuất có lưu lượng truy cập lớn, DynamicSectionRenderer thiết lập mạng lưới cứu hộ hai lớp:',
    docs_arch_fb1_badge: 'TIER 1',
    docs_arch_fb1_title: 'Static AST Sanitizer',
    docs_arch_fb1_layer: 'TẦNG SCHEMA',
    docs_arch_fb1_desc: 'Nếu component nhận được chứa một preset không tồn tại trong Registry hoặc bị thiếu các thuộc tính bắt buộc, Sanitizer sẽ tự động ép preset về swiss-hud mặc định và sử dụng thuật toán băm PRNG lấp đầy tham số thiếu.',
    docs_arch_fb2_badge: 'TIER 2',
    docs_arch_fb2_title: 'Safe Fallback Component',
    docs_arch_fb2_layer: 'TẦNG GPU RUNTIME',
    docs_arch_fb2_desc: 'Khi GPU của máy khách bị mất ngữ cảnh (Context Loss) hoặc trình duyệt không hỗ trợ WebGL2, React Error Boundary sẽ chặn đứng ngoại lệ và hiển thị ngay lập tức một canvas vector thuần 2D (Procedural Canvas SVG Wireframe) không làm crash trang.',
    docs_arch_sec6_2_title: '6.2. Quy định GitOps Handover & Build Gate Protocol',
    docs_arch_sec6_2_desc: 'Bốn nguyên tắc vàng bất di bất dịch được mã hóa trong quy trình CI/CD và bản chỉ thị AGENT.md:',
    docs_arch_rule1_title: 'Quy tắc 1: Khóa Phạm Vi (Scope Lock)',
    docs_arch_rule1_desc: 'Tuyệt đối cấm AI Worker tạo thêm hoặc sửa đổi các file component .tsx trong các tác vụ cập nhật giao diện thường nhật. Mọi thay đổi 100% qua file JSON.',
    docs_arch_rule2_title: 'Quy tắc 2: Đăng ký SSOT Registry',
    docs_arch_rule2_desc: 'Bất kỳ component mới nào được kỹ sư con người thêm vào đều bắt buộc phải đăng ký đầy đủ trong registry.ts trước khi được phép gọi từ JSON AST.',
    docs_arch_rule3_title: 'Quy tắc 3: Cổng Kiểm Tra TypeScript',
    docs_arch_rule3_desc: 'Lệnh npx tsc --noEmit bắt buộc phải vượt qua với chính xác 0 lỗi cú pháp trước khi bất kỳ PR nào được hợp nhất vào nhánh main.',
    docs_arch_rule4_title: 'Quy tắc 4: Cách Ly Bản Dựng Export',
    docs_arch_rule4_desc: 'Tất cả các bản dựng export độc lập phải nằm trong vùng cách ly, không làm phình to bundle kích thước tải trang của core web application.',

    docs_arch_sec7_badge: 'PHẦN 07',
    docs_arch_sec7_title: 'TỔNG KẾT HIỆU NĂNG HỆ THỐNG & GIÁ TRỊ CỐT LÕI CHO DEVELOPER',
    docs_arch_sec7_tag: 'FINAL VERDICT // BENCHMARK 2026',
    docs_arch_roi1_title: 'Dành cho Web3D Developers',
    docs_arch_roi1_desc: 'Không còn phải lo lắng về việc đồng bộ state giữa UI React và vòng lặp Three.js animation. Tham số hóa toàn bộ camera, chất liệu PBR và khớp động học qua JSON AST chuẩn xác từng miligiây.',
    docs_arch_roi2_title: 'Dành cho AI Systems Engineers',
    docs_arch_roi2_desc: 'Triệt tiêu 99% token hao phí vô ích. LLM của bạn chỉ cần tập trung suy luận bài toán thực tế và trả về ~50 tokens JSON. Tốc độ thực thi của agent tăng gấp 10 lần, chi phí API giảm cận biên về 0.',
    docs_arch_roi3_title: 'Dành cho Solution Architects',
    docs_arch_roi3_desc: 'Một kiến trúc decoupled hoàn hảo không phụ thuộc vào hạ tầng server đắt đỏ. Khả năng mở rộng không giới hạn (infinite scale) khi toàn bộ năng lực tính toán đồ họa 60 FPS được ủy quyền cho máy khách.',
    docs_arch_export_whitepaper: 'TẢI TOÀN BỘ ĐẶC TẢ BÁO CÁO KỸ THUẬT:',
    docs_arch_btn_download_ast: '[ JSON AST ]',
    docs_arch_btn_export_pdf: '[ PDF VI/EN ]',
    docs_arch_btn_export_md: '[ MARKDOWN .MD ]',

    // Flipbook Library
    book_01_title: 'Hồ sơ Thiết kế: Jules - Kiến trúc sư Hệ thống AI',
    book_01_subtitle: 'Tư duy Kiến trúc, Quy chuẩn Code & Cơ chế Điều phối Hệ thống',
    book_02_title: 'Báo cáo Kỹ thuật: Hạ tầng Tự động hóa Luồng Dữ liệu (Digital Plumbing)',
    book_02_subtitle: 'Hệ thống Truyền dẫn & Kết nối API Tự hành giữa n8n, Dify & Webhook',
    book_03_title: 'Báo cáo Kỹ thuật: Chuyển đổi Kiến trúc từ Dify sang n8n Workflow',
    book_03_subtitle: 'Tối ưu Chi phí $0.00 & Mở rộng Hiệu năng Luồng Tự động hóa AI',
    book_04_title: 'Hướng dẫn Vận hành: Cổng Cấu hình Trực quan & Chế tạo Web 3D',
    book_04_subtitle: 'Quy trình 5 Bước Tạo Giao diện 3D Unibody Không Cần Viết Code',
    book_05_title: 'Báo cáo Ứng dụng: Mô phỏng Tài chính Thành phố Dữ liệu 3D',
    book_05_subtitle: 'Trực quan hóa Báo cáo Tài chính thành Ma trận 3D Voxel 60 FPS',
    book_06_title: 'Hướng dẫn Vận hành: Công cụ Tương tác & Định vị 3D Precision CAD',
    book_06_subtitle: 'Thao tác Tâm ngắm Soi Chi tiết & Đo đạc Thông số Mô hình 3D',
    book_07_title: 'Công cụ Tạo Ảnh Bìa LinkedIn & Nhận diện Thương hiệu',
    book_07_subtitle: 'Tự động Thiết kế Banner Đồ họa & Hình ảnh Truyền thông Mạng Xã hội',
    book_08_title: 'Mô hình Quản trị & Điều phối Mạng lưới AI Multi-Agent',
    book_08_subtitle: 'Kiến trúc Tổ chức & Phân công Công việc Tự động giữa các Trợ lý AI',
    book_09_title: 'Quy chuẩn Thiết kế & Tự động hóa Thư viện Sách lật 3D',
    book_09_subtitle: 'Tiêu chuẩn Đóng gói Tài liệu thành Sách Lật 3D Tương tác trên Web',

    // SECTION 1: PYLON WORKBENCH
    pylonZoneTag: "TRẠM ĐIỀU HÀNH // PHÂN KHU 03 // BÀN LÀM VIỆC AGENT TỰ HÀNH",
    pylonMainHeading: "5 TRẠM PYLON TỰ HÀNH. KHÔNG ĐỘ TRỄ CLOUD. CHÍ PHÍ RENDER $0.00.",
    pylonSubheading: "Hệ thống điều phối đa trợ lý AI độc lập được biên dịch trực tiếp thành động học WebGL phía máy khách. Loại bỏ hoàn toàn hóa đơn máy chủ rendering đám mây với luồng thực thi khép kín.",
    pylonConduitsTitle: "KÊNH DẪN PYLON TỰ HÀNH",
    pylonInspectHint: "CHỌN PYLON ĐỂ SOI CHI TIẾT",
    btnLaunchPylonStation: "KÍCH HOẠT TRẠM LÀM VIỆC 3D ĐỘC LẬP",
    pylonTelemetryTitle: "BẢNG MÁY ĐO PYLON // 3D HUD",
    pylonStatusActive: "TRẠM HOẠT ĐỘNG: DIFY.AI",
    pylonConduitLocked: "ĐÃ KHÓA KÊNH DẪN",
    pylonThroughputLabel: "BĂNG THÔNG XỬ LÝ",
    pylonRenderFeeLabel: "CHI PHÍ RENDER",

    // SECTION 2: STUDIO PLAYGROUND HUBS MATRIX
    matrixTag: "MA TRẬN NGUYÊN MẪU // 6 CỖ MÁY SÁNG TẠO",
    matrixHeading: "MẠNG LƯỚI TRUNG TÂM THỬ NGHIỆM STUDIO",
    matrixSubheading: "Truy cập toàn bộ bộ cỗ máy AI xác định, đồ họa lập trình 3D procedural, tự động hóa thiết kế chuyển động và động cơ máy đo CAD mở.",
    btnLaunchFullMatrix: "KÍCH HOẠT TOÀN BỘ MATRIX STUDIO ➔",

    // Node Cards 01-06
    node01Title: "CỖ MÁY RENDER 3D PROCEDURAL",
    node01Desc: "Khối Shader Procedural Three.js 60 FPS tích hợp tổng hợp âm thanh thời gian thực.",
    btnEnterNode01: "TRUY CẬP ↗",

    node02Title: "XƯỞNG ĐỒ HỌA ĐỘNG REMOTION",
    node02Desc: "Tạo video bằng mã nguồn xác định với cấu trúc 4 lớp Lego. Tự động biên soạn đồ họa chuyển động qua mã React.",
    btnLaunchNode02: "MỞ REMOTION STUDIO ➔",

    node03Title: "XƯỞNG TẠO BANNER THƯƠNG HIỆU TỰ ĐỘNG",
    node03Desc: "Tổng hợp hình ảnh nhận diện thương hiệu động với xuất tệp vector SVG, sản xuất hàng loạt và phân phối tự động.",
    btnOpenNode03: "MỞ BANNER STUDIO ➔",

    node04Title: "TRÌNH TRỰC QUAN HÓA MEKONG CAD",
    node04Desc: "Luồng dữ liệu môi trường CKAN thời gian thực với bộ hiển thị dạng sóng và phân tích vi trình đường nét line-art.",
    btnOpenNode04: "MỞ MEKONG CAD ➔",

    node05Title: "MÔ-ĐUN THỬ NGHIỆM PLUG AND PLAY SANDBOX",
    node05Desc: "Môi trường sandbox tương tác hỗ trợ nạp nóng các khối mesh 3D tùy chỉnh, tệp GLTF/OBJ và cấu hình Zod AST vào cỗ máy ARTIFICIAL CRAFT.",
    btnOpenNode05: "MỞ PLUG & PLAY SANDBOX ➔",

    node06Title: "THÀNH PHỐ DỮ LIỆU 3D METROPOLIS & MÔ PHỎNG TÀI CHÍNH",
    node06Desc: "Chuyển hóa báo cáo tài chính bảng phẳng thành Thành phố Dữ liệu 3D (3D Voxel Matrix) tương tác 60 FPS. Tích hợp Google Sheets Live API, hiệu ứng sụt chìm thua lỗ và chế độ So sánh Đối đầu 3D.",
    btnLaunchNode06: "KÍCH HOẠT DEMO 3D METROPOLIS ➔",

    // SECTION 3: STUDIO CONFIGURATOR & CANVAS HUD
    configuratorHeader: "XƯỞNG CHẾ TẠO 3D UNIBODY // CẤU HÌNH CỖ MÁY",
    configuratorNodeBadge: "NODE 05 :: TRẠM CHẾ TẠO KINETIC 3D",
    enterFactoryNodeBtn: "TRUY CẬP NODE NGUYÊN MẪU ➔",
    b2bPopupTitle: "CHẾ ĐỘ THỬ NGHIỆM PLAYGROUND",
    b2bPopupDesc: "Bạn đang trải nghiệm phiên bản Playground Demo. Bạn muốn đặt hàng chế tạo các thành phần Động học 3D độc quyền dành riêng cho doanh nghiệp?",
    btnBookB2bConsultation: "ĐẶT LỊCH TƯ VẤN B2B & HỢP ĐỒNG DOANH NGHIỆP",

  },
};
