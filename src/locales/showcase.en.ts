import { ShowcaseTranslations } from '@/types/showcase';

export const showcaseEn: ShowcaseTranslations = {
  sectionBadge: '[ PORTFOLIO // 3D & MOTION ENGINES ]',
  sectionTitle: 'PROJECT DEBRIEFS // 3D & INTERACTIVE WEBAPPS',
  sectionSubtitle:
    'Real-world production engineering debriefs across WebGL spatial 3D, physics simulation, autonomous video rendering, and cybernetic CAD interfaces.',
  badgeOperational: '[ STATUS: OPERATIONAL ]',
  contextObstacle: 'Context & Challenge',
  technicalObstacle: 'Technical Hurdle',
  coreSolution: 'Core Solution',
  behindTheScenes: '3 Behind-The-Scenes Pillars',
  strategy: 'Strategy',
  execution: 'Execution',
  impact: 'Impact',
  launchLiveApp: 'Launch 3D WebApp ↗',
  viewDemo: 'View Live Demo ➔',
  metricLabel: 'Key Milestone',
  debriefTag: 'PROJECT DEBRIEF',
  projects: {
    'puffy-3d-creative-engine': {
      title: 'Puffy 3D Showroom & Creative Engine',
      about:
        'An interactive 3D bedroom showroom on the web allowing customers to physically test mattress elasticity, inspect internal layers, and export high-res marketing banners in 5 seconds.',
      impressiveMetric:
        'Spatial 3D WebGL showroom and asset generator delivering 60 FPS deterministic canvas captures and two-tier tactile physics under sub-second latency.',
      contextObstacle:
        'Buying mattresses online suffers from trust friction because customers cannot feel physical comfort or verify internal build quality. This platform enables shoppers to compress foam layers in real time and trigger structural cutaways, while marketing teams can instantly frame angles and generate studio-grade ad banners without expensive physical photoshoots.',
      technicalObstacle:
        'Browser WebGL canvases aggressively clear their drawing buffers after compositing, causing automated screenshot pipelines and mobile user exports to fail with solid black frames. Simultaneous multi-material colorway updates also block the main thread, breaking 60 FPS tactile interaction.<br><br>Maintaining strict visual fidelity and codebase boundaries across rapid creative iterations required deterministic physics orchestration and automated agent governance.',
      coreSolution:
        'Engineered a Two-Pass synchronous WebGL capture routine that renders and flushes the buffer inside a single atomic frame, guaranteeing crisp exports on mobile and desktop browsers. Coupled a two-tier tactile physics engine with an automated 12-node PBR colorway swapper executing in under 60 milliseconds and governed via AGENT.md protocols.',
      behindTheScenes: {
        strategicAngle:
          'Customer Experience: Engineered tactile compression physics, allowing shoppers to press and inspect realistic foam elasticity directly in mobile browsers at 60 FPS.',
        technicalAngle:
          'Exploded Anatomy: Built an interactive cutaway inspection mechanism that separates internal pocket coils, gel memory foam, and cooling fabrics on click.',
        deliverableAngle:
          'Marketing Automation: Created a single-click canvas snapshot tool that exports high-res transparent product renders with pre-aligned logos in under 5 seconds.',
      },
    },
    'spatial-uiux-tactical-cad-systems': {
      title: 'Enterprise Spatial Computing & CAD Systems',
      about:
        'Cybernetic Swiss Brutalism design system, multi-tab creator workflows, and real-time 3D data visualization running at 60 FPS.',
      impressiveMetric:
        'Cybernetic Swiss Brutalism design system, multi-tab creator workflows, and real-time 3D data visualization running at 60 FPS.',
      contextObstacle:
        'Engineered an enterprise-grade UI/UX architecture unifying three major digital platforms: Artificial Craft, VibePath Studio, and 3D Data Metropolis. Established a zero-radius Cybernetic Swiss Brutalism design system, eliminating decorative bloat in favor of 1px CAD precision, Cartesian coordinate grids, and high-frequency electronic contrast. Extended the spatial computing stack across 3D Data Metropolis and 3D Robotics Factory.',
      technicalObstacle:
        'Standard consumer web UI trends rely on soft Gaussian shadows, arbitrary rounded corners, and low-contrast palettes that fail to communicate complex system telemetries and mission-critical workflows. Creator platforms frequently suffer from interaction ambiguity, where users confuse passive state previewing with irreversible async command execution.<br><br>Traditional enterprise financial and operational reporting relies on flat, static spreadsheets and PDF tables, creating visual fatigue and masking negative risk indicators buried within hundreds of data rows.',
      coreSolution:
        'Enforced a strict zero-radius and 1px border rule across all components, paired with 4-layer planar stratification and Space Grotesk / JetBrains Mono typography. Transformed flat numeric datasets into an interactive 3D Voxel Metropolis with negative-profit floor sinking and raycast holographic HUD cards via THREE.InstancedMesh single-draw-call rendering.',
      behindTheScenes: {
        strategicAngle:
          'Cybernetic Swiss Brutalism: Eliminated arbitrary decorative styles by enforcing border-radius: 0px and a strict obsidian (#09090B), electric indigo (#5322FF), and neon cyan (#00E5FF) palette.',
        technicalAngle:
          'Asynchronous Interaction Ergonomics: Architected a 3-tab creator workspace resolving UI collision. Physically decoupled mutually exclusive viewport switches from high-impact command triggers with dynamic async locking.',
        deliverableAngle:
          '3D Data Metropolis & Spatial Literacy: Converted 50+ corporate financial tables into an interactive 3D Voxel Matrix city running at 60 FPS via Three.js InstancedMesh with real-time Google Sheets API webhooks.',
      },
    },
    'robotics-factory-3d': {
      title: '3D Robotics Factory & Kinematic Simulator',
      about:
        'Meticulous 3D industrial assembly line viewport featuring real-time inverse kinematics, automated mechanical arms, and factory floor telemetry.',
      impressiveMetric:
        'Real-time 60FPS exploded view manipulator arm with 11-DOF inverse kinematics telemetry and LiDAR point cloud perception.',
      contextObstacle:
        'Static CAD models and flat industrial schematics fail to communicate multi-axis kinematic tolerances and collision boundaries in real-time robotic manufacturing.',
      technicalObstacle:
        'Rendering high-polygon 11-DOF industrial robot arms with real-time inverse kinematics and 50,000-point WebGL LiDAR shaders causes severe frame drops in mobile browsers.',
      coreSolution:
        'Engineered a 4-stage Bezier exploded disassembly pipeline with 11-DOF mechanical kinematics, GPU-accelerated magnetic attractor point clouds, and browser-native CAD HUD telemetry running at 60 FPS.',
      behindTheScenes: {
        strategicAngle:
          'Physical AI & Robotics Digital Twin: Replaced static CAD exports with browser-native 3D kinematics for real-time assembly verification.',
        technicalAngle:
          'Inverse Kinematics & LiDAR Shaders: Built custom WebGL shaders simulating 50,000 LiDAR points and sub-millimeter mechanical joint constraints.',
        deliverableAngle:
          'Interactive Industrial CAD HUD: Shipped an interactive ROS2-compatible telemetry dashboard with real-time joint angle inspection.',
      },
    },
    'project-98': {
      title: 'Project 98',
      about:
        'Successfully reduced team operational turnaround time by 20%, slashed client modification rates to below 15%.',
      impressiveMetric:
        'Successfully reduced team operational turnaround time by 20%, slashed client modification rates to below 15%.',
      contextObstacle:
        'Used packaging and brand design to elevate the product’s market position and turn a seasonal agricultural surplus into a standardized, higher-value consumer offering. Directed end-to-end design delivery, including production-ready packaging, trade materials, and a web showcase, with close attention to export labeling and print requirements.',
      technicalObstacle:
        'The product needed to meet detailed import, labeling, ingredient disclosure, and material requirements while entering a highly competitive market.<br><br>Prepress accuracy was essential: even minor errors in the packaging artwork could delay approval, affect logistics, or jeopardize shipment release.',
      coreSolution:
        'Created bespoke hand-drawn produce illustrations and a premium visual system that highlighted the product’s origin, while ensuring every asset was prepared for compliant production.',
      behindTheScenes: {
        strategicAngle:
          'Strategic Market Repositioning: Spearheaded brand identity and packaging for Lam Dong durian export to China, transforming raw agricultural goods into premium consumer products.',
        technicalAngle:
          'End-to-End Creative Execution: Delivered production-ready packaging, trade materials, and responsive Web UI/UX, ensuring 100% compliance with strict international printing standards.',
        deliverableAngle:
          'Cross-Border Leadership & Automation: Managed a remote design team between Vietnam and China with custom Python automation scripts to streamline file delivery.',
      },
    },
    'vibepath-gps-3d-map-pipeline': {
      title: 'VibePath Multi-Tab Studio Platform',
      about:
        'An automated creator suite that converts raw mobile GPS trip logs into cinematic 60 FPS 3D route animation videos with AI-generated bilingual captions in 45 seconds.',
      impressiveMetric:
        'Automated telemetry processing engine turning mobile GPS traces into cinematic 3D map flyovers and bilingual scripts in under 45 seconds.',
      contextObstacle:
        'Travel and food vloggers spend 4 to 8 hours per episode manually tracing map routes, smoothing jittery GPS recordings, and typing bilingual video subtitles. VibePath automates the entire post-production pipeline: creators upload raw mobile GPS tracks to instantly generate broadcast-grade 3D trajectory videos, bilingual SRT subtitles, and YouTube chapter markers.',
      technicalObstacle:
        'Raw mobile GPS coordinate logs suffer from multipath signal bouncing and altitude noise, resulting in violent camera shake in 3D renders. Processing 45-second multi-stage AI reasoning workflows caused standard synchronous webhooks to drop connection timeouts.<br><br>Generating culturally accurate, tone-adapted bilingual captions and voiceover scripts without human editorial delay.',
      coreSolution:
        'Built a Python FastAPI service applying Ramer-Douglas-Peucker (RDP) decimation and 3rd-order Cubic B-Spline smoothing to calculate continuous camera heading and pitch vectors. Architected an asynchronous polling architecture over Cloudflare Tunnels into Dockerized n8n on a Hetzner VPS.',
      behindTheScenes: {
        strategicAngle:
          'Jitter-Free GPS: Implemented cubic B-spline path smoothing to transform erratic mobile phone GPS logs into fluid, cinema-grade camera movements.',
        technicalAngle:
          'Turnaround Speed: Reduced map animation rendering and captioning workflows from half a day of manual editing to 45 seconds of automated execution.',
        deliverableAngle:
          'Bilingual AI Co-Pilot: Integrated Google Vertex AI to extract location context and generate synchronized, tone-adapted bilingual subtitles.',
      },
    },
    'video-as-code-remotion-pipeline': {
      title: 'Video-as-Code Engine (Remotion)',
      about:
        'A programmatic video production engine that generates hundreds of customized promotional videos from structured spreadsheet data using React components.',
      impressiveMetric:
        'Serverless Video-as-Code pipeline enforcing strict Zod schema contracts and frame-calculated animation tokens for smooth deterministic rendering.',
      contextObstacle:
        'During seasonal promotions or multi-SKU retail campaigns, video editors spend days manually duplicating After Effects compositions to swap product imagery, prices, and copy. This manual workflow creates severe delivery bottlenecks and introduces visual inconsistencies across video variants.',
      technicalObstacle:
        'Standard web animation libraries rely on CPU wall-clock timestamps, causing severe frame drops and out-of-sync audio when rendered in headless server environments.<br><br>Unvalidated video composition configurations frequently crashed serverless render nodes, causing cascading pipeline failures during batch rendering runs.',
      coreSolution:
        'Architected an immutable data contract between Gemini Architect and Google Jules Builder, using Zod AST parsing to guarantee layout parameters before render dispatch. Migrated rendering to Remotion 4.0 running on containerized Google Cloud Run instances.',
      behindTheScenes: {
        strategicAngle:
          'Automated Batching: Replaced manual After Effects timeline manipulation with code-driven React components powered by structured spreadsheet feeds.',
        technicalAngle:
          'Zero Design Drift: Enforced rigid schema controls, guaranteeing that every generated video strictly adheres to brand guidelines and typography hierarchies.',
        deliverableAngle:
          'Scalable Cloud Rendering: Deployed headless containerized rendering on Google Cloud Run, spitting out batches of ready-to-publish 60 FPS video ads in minutes.',
      },
    },
    'australia-experiences': {
      title: 'Australia Experiences — Tourism Identity',
      about:
        '100GB+Raw Footage + 400Hour Deadline + 100% Bespoke Soundtracks',
      impressiveMetric:
        '100GB+Raw Footage + 400Hour Deadline + 100% Bespoke Soundtracks',
      contextObstacle:
        'Developed brand identities and social media systems that expressed each business’s character and connected with its audience. Created cohesive content frameworks for Instagram, YouTube, and TikTok, using contemporary color, typography, and imagery to build a consistent visual narrative.',
      technicalObstacle:
        'Projects often began without established brand guidelines, design systems, or usable visual assets, yet required polished promotional content within short production windows.<br><br>The process required rapid concept development, efficient asset creation, and focused editing to turn large volumes of raw footage into clear, engaging social content.',
      coreSolution:
        'Implemented a streamlined multimedia workflow that enabled the team to develop visual identities, social grid systems, and promotional videos quickly while maintaining consistency across channels.',
      behindTheScenes: {
        strategicAngle:
          'Rapid Brand Identity Creation: Built comprehensive visual identities, logos, and high-engagement Instagram grid layouts from scratch for multiple hospitality brands.',
        technicalAngle:
          'High-Efficiency Video Production: Processed 2GB to 10GB of raw footage per project to conceptualize, edit, and deliver dynamic short-form videos within a strict 4-hour turnaround time.',
        deliverableAngle:
          'Multi-Tool Software Mastery: Orchestrated a hybrid editing workflow combining DaVinci Resolve, Adobe After Effects, and CapCut to maximize audience retention.',
      },
    },
    'the-growth-agency': {
      title: 'The Growth Agency — Growth Assets',
      about:
        '30+ logos successfully designed and put into practical use for individuals and organizations.',
      impressiveMetric:
        '30+ logos successfully designed and put into practical use for individuals and organizations.',
      contextObstacle:
        'Directed concepts for international branding, digital advertising, and marketing campaigns. Designed logos, brand systems, and campaign identities for clients across property, technology, retail, and hospitality.',
      technicalObstacle:
        'The team managed large volumes of campaign data and creative requests across markets with different languages, cultural contexts, and regulatory requirements.<br><br>Success depended on clear communication, disciplined prioritization, and reliable systems for tracking assets from concept to delivery.',
      coreSolution:
        'Standardised asset management and production processes with tailored automation for file preparation, review rounds, and handoff.',
      behindTheScenes: {
        strategicAngle:
          'Offshore Creative Leadership: Managed and coordinated an agile production team in Ho Chi Minh City to execute high-volume creative assets for international accounts.',
        technicalAngle:
          'Hybrid Full-Service Delivery: Oversaw simultaneous production cycles across branding, digital advertising, video editing, and print production.',
        deliverableAngle:
          'High-Volume Asset Governance: Implemented structured versioning and asset verification protocols that reduced production turnaround times.',
      },
    },
  },
};
