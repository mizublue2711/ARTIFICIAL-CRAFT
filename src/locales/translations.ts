export type Language = 'en' | 'vi';

export interface Translations {
  // Navigation
  nav_engine: string;
  nav_architecture: string;
  nav_blueprints: string;
  nav_blackbox: string;
  nav_experts: string;
  nav_deploy_node: string;
  nav_studio_console: string;
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
  copied: string;
  export_clean_screenshot: string;
  rendering_hd: string;
  preview_ready: string;
  export_preview_title: string;
  download_png: string;
  bp_banner_title: string;
  bp_banner_sub: string;
  bp_browse_all: string;

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
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    nav_engine: 'ENGINE',
    nav_architecture: 'ARCHITECTURE',
    nav_blueprints: 'BLUEPRINTS',
    nav_blackbox: 'BLACKBOX',
    nav_experts: 'EXPERTS',
    nav_deploy_node: 'DEPLOY//NODE',
    nav_studio_console: 'STUDIO//CONSOLE',
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
    copied: 'COPIED',
    export_clean_screenshot: 'Export Clean Screenshot',
    rendering_hd: 'RENDERING HD...',
    preview_ready: 'PREVIEW READY',
    export_preview_title: 'EXPORT PREVIEW',
    download_png: 'DOWNLOAD PNG',
    bp_banner_title: 'ALL BLUEPRINTS ARE OPEN SOURCE',
    bp_banner_sub: 'MIT LICENSED · CRAFT//CODE CLI READY',
    bp_browse_all: 'BROWSE ALL 40+ TEMPLATES',

    // LinkedIn Banner Studio Form
    banner_studio_title: 'LinkedIn Banner Studio',
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
  },
  vi: {
    // Navigation
    nav_engine: 'ĐỘNG CƠ',
    nav_architecture: 'KIẾN TRÚC',
    nav_blueprints: 'SƠ ĐỒ MẪU',
    nav_blackbox: 'HỘP ĐEN',
    nav_experts: 'CHUYÊN GIA',
    nav_deploy_node: 'TRIỂN KHAI//NÚT',
    nav_studio_console: 'STUDIO//ĐIỀU HÀNH',
    subtag_version: 'v3.0//BRUTALIST',
    logo_subtag: 'CRAFT//CODE',

    // Hero Section
    telemetry_prefix: 'SYS//VIỄN THÔNG:',
    telemetry_status: '14 KHU VỰC TRỰC TUYẾN',
    telemetry_sla: 'SLA XÁC ĐỊNH 99.99%',
    hero_badge_subtag: 'CRAFT//CODE',
    hero_badge_text: 'ĐỘ CHÍNH XÁC ĐỒ HỌA TỈ MẨN GẶP TỰ ĐỘNG HÓA MÃ',
    heroTitleLine1: 'ARTIFICIAL',
    heroTitleLine2: 'CRAFT',
    subtitle: 'Nơi Thiết Kế Đồ Họa Tỉ Mẩn Gặp Tự Động Hóa AI Xác Định.',
    ctaButton: 'Kích Hoạt Autopilot Studio',
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
    preset_swiss: 'Hệ Thống Thiết Kế Thụy Sĩ SKU',
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
      'Biểu thị sự kết hợp giữa độ chính xác thiết kế đồ họa và tự động hóa mã: Tác nhân Dify biên tập và định dạng tài sản thương hiệu, trong khi n8n thực thi phân phối xác định 100% trên các kênh sản xuất.',
    mode_lead_label: 'Động Cơ Chấm Điểm Nút',
    mode_lead_sublabel: 'Dữ Liệu Viễn Thông → Định Tuyến Dự Đoán',
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
      'ARTIFICIAL CRAFT kết hợp ma trận lý luận của Dify với bộ điều phối thực thi của n8n. Thiết kế thương hiệu có cấu trúc và tự động hóa chính xác được liên kết bởi mặt phẳng kiểm soát không sai lệch.',
    card_hybrid_title: 'MÔI TRƯỜNG THỰC THI THIẾT KẾ LAI',
    card_hybrid_desc:
      'Động cơ lý luận gọi quy trình n8n như các công cụ thiết kế Thụy Sĩ có kiểu dữ liệu; quy trình n8n thực thi tác nhân Dify như các bước mã xác định.',
    node_trigger: 'KÍCH HOẠT',
    node_reason: 'LÝ LUẬN',
    node_vector: 'VECTƠ',
    node_guard: 'BẢO VỆ',
    node_fanout: 'PHÂN PHỐI',
    status_typed_tool: 'GỌI CÔNG CỤ CÓ KIỂU',
    status_streaming_matrix: 'MA TRẬN DÒNG',
    status_retry_eligible: 'CÓ THỂ THỬ LẠI',
    card_rag_title: 'MA TRẬN VECTOR RAG',
    card_rag_desc: 'Xếp hạng lại lai Pinecone + BM25 cho các thông số thiết kế Thụy Sĩ.',
    rag_latency: 'ĐỘ TRỄ: 540ms',
    card_det_title: 'ĐỘNG CƠ XÁC ĐỊNH',
    card_det_desc: 'Chính sách tự động thử lại theo số nhân, lá chắn giới hạn tốc độ, lưu trữ thư chết.',
    row_retry: 'THỬ LẠI: LŨY THỪA · TỐI ĐA 5',
    row_rate_limit: 'GIỚI HẠN TỐC ĐỘ: DÒ DÌM THÍCH ỨNG',
    row_dead_letter: 'LƯU TRỮ THƯ CHẾT: BẤT BIẾN',
    card_router_title: 'BỘ ĐỊNH TUYẾN ĐA MÔ HÌNH',
    card_router_desc: 'GPT-4o, Claude, Llama — được định tuyến theo độ trễ, chi phí hoặc điểm thiết kế.',
    card_telemetry_title: 'THEO DÕI VIỄN THÔNG',
    card_telemetry_desc: 'Mọi token, cuộc gọi nút và sự kiện phân phối được ghi lại theo thời gian thực 60fps.',
    tracing_active: '● ĐANG THEO DÕI',
    card_guardrails_title: 'RÀO CHẮN THỤY SĨ',
    card_guardrails_desc: 'Đầu vào và đầu ra xác thực sơ đồ. 0% sai lệch âm thầm.',

    // Blueprint Library
    bp_section_label: 'THƯ VIỆN SƠ ĐỒ MẪU // MẪU',
    bp_title_line1: 'SƠ ĐỒ MẪU SẴN SÀNG SẢN XUẤT.',
    bp_title_line2: 'SAO CHÉP. TRIỂN KHAI. CHIA SẺ.',
    bp_desc:
      'Mỗi sơ đồ mẫu đi kèm với API có kiểu, cấu trúc nút và công cụ xuất ảnh HD phong cách Thụy Sĩ.',
    copy_api: 'SAO CHÉP API',
    copied: 'ĐÃ SAO CHÉP',
    export_clean_screenshot: 'Xuất Ảnh Màn Hình Sạch',
    rendering_hd: 'ĐANG DỰNG HD...',
    preview_ready: 'XEM TRƯỚC SẴN SÀNG',
    export_preview_title: 'XEM TRƯỚC KHI XUẤT',
    download_png: 'TẢI ẢNH PNG',
    bp_banner_title: 'TẤT CẢ SƠ ĐỒ MẪU LÀ MÃ NGUỒN MỞ',
    bp_banner_sub: 'GIẤY PHÉP MIT · SẴN SÀNG CHO CRAFT//CODE CLI',
    bp_browse_all: 'DUYỆT TẤT CẢ 40+ MẪU',

    // LinkedIn Banner Studio Form
    banner_studio_title: 'Studio Banner LinkedIn',
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
      'ARTIFICIAL CRAFT (CRAFT//CODE): Biểu thị sự kết hợp giữa độ chính xác thiết kế đồ họa và động cơ tự động hóa mã.',
    col_engine: 'ĐỘNG CƠ',
    col_developers: 'LẬP TRÌNH VIÊN',
    col_craft: 'THIẾT KẾ',
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
  },
};
