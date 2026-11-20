/**
 * ARTIFICIAL CRAFT // STANDARDIZED SHOWCASE DATA
 * Generated from Framer_Export_Work_populated.csv with zero-trust type safety
 * 
 * Order Rule: Strict Reverse-Chronological Showcase Order
 * - Index 0: puffy-3d-creative-engine (Puffy 3D Showroom & Creative Engine) -> https://enter-to-dream.artificialcraft.space/
 * - Index 1: vibepath-gps-3d-map-pipeline (VibePath Multi-Tab Studio Platform) -> https://vibepath.artificialcraft.space/
 * - Index 2: video-as-code-remotion-pipeline (Video-as-Code Engine - Remotion) -> https://auto-video-engine.artificialcraft.space/
 * - Index 3: spatial-uiux-tactical-cad-systems (3D Data Metropolis) -> https://metropolis.artificialcraft.space/
 * - Index 4: robotics-factory-3d (Robotics 3D Factory) -> https://artificialcraft.space/robotics
 * Non-core projects hidden from public feed: project-98, australia-experiences, the-growth-agency.
 */

import { ShowcaseProject } from '@/types/showcase';

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    "id": "puffy-3d-creative-engine",
    "title": "Puffy 3D Showroom & Creative Engine",
    "tags": [
      "spatial-3d-web-interactive-configurators",
      "motion-web-app-interactive"
    ],
    "dateText": "Nov 2026",
    "impressiveMetric": "Spatial 3D WebGL showroom and asset generator delivering 60 FPS deterministic canvas captures and two-tier tactile physics under sub-second latency.",
    "about": "An interactive 3D bedroom showroom on the web allowing customers to physically test mattress elasticity, inspect internal layers, and export high-res marketing banners in 5 seconds.",
    "contextObstacle": "Buying mattresses online suffers from trust friction because customers cannot feel physical comfort or verify internal build quality.<br>This platform enables shoppers to compress foam layers in real time and trigger structural cutaways, while marketing teams can instantly frame angles and generate studio-grade ad banners without expensive physical photoshoots.",
    "technicalObstacle": "Browser WebGL canvases aggressively clear their drawing buffers after compositing, causing automated screenshot pipelines and mobile user exports to fail with solid black frames.<br>Simultaneous multi-material colorway updates also block the main thread, breaking 60 FPS tactile interaction.<br><br>Maintaining strict visual fidelity and codebase boundaries across rapid creative iterations required deterministic physics orchestration and automated agent governance.",
    "coreSolution": "Engineered a Two-Pass synchronous WebGL capture routine that renders and flushes the buffer inside a single atomic frame, guaranteeing crisp exports on mobile and desktop browsers.<br>Coupled a two-tier tactile physics engine with an automated 12-node PBR colorway swapper executing in under 60 milliseconds and governed via AGENT.md protocols.",
    "behindTheScenes": {
      "strategicAngle": "Engineered tactile compression physics, allowing shoppers to press and inspect realistic foam elasticity directly in mobile browsers at 60 FPS.",
      "technicalAngle": "Built an interactive cutaway inspection mechanism that separates internal pocket coils, gel memory foam, and cooling fabrics on click.",
      "deliverableAngle": "Created a single-click canvas snapshot tool that exports high-res transparent product renders with pre-aligned logos in under 5 seconds."
    },
    "media": {
      "heroBannerUrl": "https://raw.githubusercontent.com/mizublue2711/mizublue2711/main/assets/PUFFY/2.png",
      "featureImages": [
        "https://raw.githubusercontent.com/mizublue2711/mizublue2711/main/assets/PUFFY/3.png",
        "https://raw.githubusercontent.com/mizublue2711/mizublue2711/main/assets/PUFFY/4.png",
        "https://raw.githubusercontent.com/mizublue2711/mizublue2711/main/assets/PUFFY/5.png"
      ]
    },
    "links": {
      "liveUrl": "https://enter-to-dream.artificialcraft.space/"
    }
  },
  {
    "id": "vibepath-gps-3d-map-pipeline",
    "title": "VibePath Multi-Tab Studio Platform",
    "tags": [
      "motion-web-app-interactive",
      "branding",
      "graphic",
      "creative-operations"
    ],
    "dateText": "May 2026",
    "impressiveMetric": "Automated telemetry processing engine turning mobile GPS traces into cinematic 3D map flyovers and bilingual scripts in under 45 seconds.",
    "about": "An automated creator suite that converts raw mobile GPS trip logs into cinematic 60 FPS 3D route animation videos with AI-generated bilingual captions in 45 seconds.",
    "contextObstacle": "Travel and food vloggers spend 4 to 8 hours per episode manually tracing map routes, smoothing jittery GPS recordings, and typing bilingual video subtitles.<br>VibePath automates the entire post-production pipeline: creators upload raw mobile GPS tracks to instantly generate broadcast-grade 3D trajectory videos, bilingual SRT subtitles, and YouTube chapter markers with a single click.",
    "technicalObstacle": "Raw mobile GPS coordinate logs suffer from multipath signal bouncing and altitude noise, resulting in violent camera shake in 3D renders.<br>Processing 45-second multi-stage AI reasoning workflows caused standard synchronous webhooks to drop connection timeouts.<br><br>Generating culturally accurate, tone-adapted bilingual (English/Vietnamese) captions and voiceover scripts without human editorial delay.",
    "coreSolution": "Built a Python FastAPI service applying Ramer-Douglas-Peucker (RDP) decimation and 3rd-order Cubic B-Spline smoothing to calculate continuous camera heading and pitch vectors.<br>Architected an asynchronous polling architecture over Cloudflare Tunnels into Dockerized n8n on a Hetzner VPS.<br>Leveraged Dify with Google Vertex AI (Gemini Flash) to generate timed bilingual voiceover scripts and YouTube chapters automatically.",
    "behindTheScenes": {
      "strategicAngle": "Implemented cubic B-spline path smoothing to transform erratic mobile phone GPS logs into fluid, cinema-grade camera movements.",
      "technicalAngle": "Reduced post-production map rendering from half a day of manual After Effects keyframing down to an automated 45-second render.",
      "deliverableAngle": "Integrated an automated linguistic pipeline generating synchronized English/Vietnamese subtitles and structured video descriptions instantly."
    },
    "media": {
      "heroBannerUrl": "https://framerusercontent.com/images/YpJLHbSHCtBg3WG1R72EwAJDbbE.png",
      "featureImages": [
        "https://framerusercontent.com/images/MLrlScZY4wh1Y4GfYezSEpPEME.png",
        "https://framerusercontent.com/images/GoZXnlYr1GBXynSbrHX9Be5rU.png",
        "https://framerusercontent.com/images/NEPycq7UYwvXTOZvT4odxiGjk.png"
      ]
    },
    "links": {
      "liveUrl": "https://vibepath.artificialcraft.space/"
    }
  },
  {
    "id": "video-as-code-remotion-pipeline",
    "title": "Video-as-Code Engine (Remotion)",
    "tags": [
      "motion-web-app-interactive",
      "video-as-code-remotion-pipelines"
    ],
    "dateText": "November 2025",
    "impressiveMetric": "Serverless Video-as-Code pipeline enforcing strict Zod schema contracts and frame-calculated animation tokens for smooth deterministic rendering.",
    "about": "A programmatic video production engine that generates hundreds of customized promotional videos from structured spreadsheets, replacing manual timeline editing.",
    "contextObstacle": "During seasonal promotions or multi-SKU retail campaigns, video editors spend days manually duplicating project files, replacing product images, retyping prices, and waiting on renders.<br>This engine renders hundreds of perfectly branded, motion-consistent promotional videos directly from a spreadsheet, cutting production turnarounds by 90% while eliminating human typography and pricing errors.",
    "technicalObstacle": "Standard web animation libraries rely on CPU wall-clock timestamps (performance.now()), causing severe frame skipping and visual desynchronization across distributed cloud rendering instances.<br>Dynamic text overlays and asset length variations caused frequent layout collisions and typography overflow.<br><br>Unvalidated video composition configurations frequently crashed serverless render nodes, causing cascading pipeline timeouts and wasted cloud compute budgets.",
    "coreSolution": "Architected an immutable data contract between Gemini Architect (motion-rules.json) and Google Jules Builder (.tsx components).Calculated all kinetic typography, 3D tilts, and velocity curves strictly from frame numbers via Remotion useCurrentFrame() hook.Integrated pre-render headless Zod validation gates (npm validate:configs) on GCP Cloud Run.",
    "behindTheScenes": {
      "strategicAngle": "Replaced manual After Effects timeline manipulation with code-driven React components powered by structured spreadsheet feeds.",
      "technicalAngle": "Enforced rigid schema controls, guaranteeing that every generated video strictly adheres to brand guidelines, typography hierarchies, and layout rules.",
      "deliverableAngle": "Deployed headless containerized rendering on Google Cloud Run, spitting out batches of ready-to-publish 60 FPS video ads in minutes."
    },
    "media": {
      "heroBannerUrl": "https://framerusercontent.com/images/bwj5VpqwtDcbq3Nu4xh94GcDA.png",
      "featureImages": [
        "https://framerusercontent.com/images/7zOJNV21juNUPCs3o9WQqeinF8.png",
        "https://framerusercontent.com/images/67tQbyScN5c8eaQk6JDAS0jkw8s.png",
        "https://framerusercontent.com/images/1zh9XkCvGLdLNiOuRNagHq6w.png"
      ]
    },
    "links": {
      "liveUrl": "https://auto-video-engine.artificialcraft.space/"
    }
  },
  {
    "id": "spatial-uiux-tactical-cad-systems",
    "title": "Enterprise Spatial Computing & CAD Systems",
    "tags": [
      "spatial-3d-web-interactive-configurators",
      "motion-web-app-interactive",
      "branding",
      "creative-operations"
    ],
    "dateText": "Nov 2026",
    "impressiveMetric": "Cybernetic Swiss Brutalism design system, multi-tab creator workflows, and real-time 3D data visualization running at 60 FPS.",
    "about": "Cybernetic Swiss Brutalism design system, multi-tab creator workflows, and real-time 3D data visualization running at 60 FPS.",
    "contextObstacle": "Engineered an enterprise-grade UI/UX architecture unifying three major digital platforms: Artificial Craft, VibePath Studio, and 3D Data Metropolis.<br>Established a zero-radius Cybernetic Swiss Brutalism design system, eliminating decorative bloat in favor of 1px CAD precision, Cartesian coordinate grids, and high-frequency electronic contrast.<br>Integrated dynamic creator studio workflows and interactive 3D WebGL data ergonomics running at 60 FPS with $0.00 server render overhead.<br>Extended the spatial computing stack across 3D Data Metropolis (a Three.js InstancedMesh 60 FPS financial voxel city synced via Google Sheets API + Zod) and 3D Robotics Factory (an interactive industrial robotics Digital Twin featuring 11-DOF kinematics, LiDAR point cloud perception, and browser-native CAD HUD telemetry).",
    "technicalObstacle": "Standard consumer web UI trends rely on soft Gaussian shadows, arbitrary rounded corners, and low-contrast palettes that fail to communicate complex system telemetries and mission-critical workflows.<br>Creator platforms frequently suffer from interaction ambiguity, where users confuse passive state previewing with irreversible async command execution.<br><br>Traditional enterprise financial and operational reporting relies on flat, static spreadsheets and PDF tables, creating visual fatigue and masking negative risk indicators buried within hundreds of data rows.",
    "coreSolution": "Enforced a strict zero-radius and 1px border rule across all components, paired with 4-layer planar stratification and Space Grotesk / JetBrains Mono typography.<br>Segregated state selectors from master command execution triggers with chisel-notched buttons and dynamic async state locks.<br>Transformed flat numeric datasets into an interactive 3D Voxel Metropolis with negative-profit floor sinking and raycast holographic HUD cards.<br>Utilized THREE.InstancedMesh single-draw-call rendering in 3D Data Metropolis for the 'Sink of Shame' subterranean negative-profit cavern with two-way Google Sheets API, local CSV/XLSX fallback, and Zod schema guards.<br>Built the 3D Robotics Factory industrial robotics Digital Twin featuring a 4-stage exploded Bezier disassembly slider (11-DOF kinematics), a 50,000-point WebGL LiDAR magnetic attractor shader, and raycasting ROS2/Python CAD HUD overlays.",
    "behindTheScenes": {
      "strategicAngle": "Eliminated arbitrary decorative styles by enforcing border-radius: 0px and a strict obsidian (#09090B), electric indigo (#5322FF), and neon cyan (#00E5FF) palette. Designed mechanical 45-degree chisel notches for master CTAs, 4-tier elevation stratification, and bracketed telemetry syntax ([ GATE: ZOD VALIDATED ]). Replaced generic iconography with square-cornered 1.25px stroke technical lineart.",
      "technicalAngle": "Architected a 3-tab creator workspace (Vlogger Simulator, Editor Studio, Feedback) resolving UI collision. Physically decoupled mutually exclusive viewport switches from high-impact command triggers. Implemented dynamic async locking (isSubmitting states with mechanical spinners) and sticky viewport headers, preventing double-submission traps and layout overflow.",
      "deliverableAngle": "Converted 50+ corporate financial tables into an interactive 3D Voxel Matrix city running at 60 FPS via Three.js InstancedMesh. Designed negative-profit sub-level sinking mechanics where loss-making entities sink below the obsidian ground into alert red illumination. Added raycasting holographic HUD cards (xb.UICard) and 3D duel comparison lasers for multi-dimensional data literacy.<br>Completed the 3D Data Metropolis spatial intelligence layer with the 'Sink of Shame' subterranean negative-profit cavern synced via real-time Google Sheets API webhooks and client-side Zod validation, alongside the 3D Robotics Factory industrial robotics Digital Twin featuring 4-stage Bezier exploded disassembly, 11-DOF mechanical kinematics, a 50,000-point WebGL LiDAR magnetic attractor shader, and interactive ROS2/Python CAD HUD telemetry."
    },
    "media": {
      "heroBannerUrl": "https://framerusercontent.com/images/c0icF1d2f9V6AIQp4aaAceWLibc.png",
      "featureImages": [
        "https://framerusercontent.com/images/hnks3kius8DF9j4SMfF85eBD2w.png",
        "https://framerusercontent.com/images/wRz6bfwQkdbZl3Yw1j9nVdvy4M.png",
        "https://framerusercontent.com/images/uOlBXmSpCIxLnjQ4ST9KEJoRiM.png"
      ]
    },
    "links": {
      "liveUrl": "https://metropolis.artificialcraft.space/"
    }
  },
  {
    "id": "robotics-factory-3d",
    "title": "3D Robotics Factory & Kinematic Simulator",
    "tags": [
      "spatial-3d-web-interactive-configurators",
      "motion-web-app-interactive"
    ],
    "dateText": "Nov 2026",
    "impressiveMetric": "Real-time 60FPS exploded view manipulator arm with 11-DOF inverse kinematics telemetry and LiDAR point cloud perception.",
    "about": "Meticulous 3D industrial assembly line viewport featuring real-time inverse kinematics, automated mechanical arms, and factory floor telemetry.",
    "contextObstacle": "Static CAD models and flat industrial schematics fail to communicate multi-axis kinematic tolerances and collision boundaries in real-time robotic manufacturing.",
    "technicalObstacle": "Rendering high-polygon 11-DOF industrial robot arms with real-time inverse kinematics and 50,000-point WebGL LiDAR shaders causes severe frame drops in mobile browsers.",
    "coreSolution": "Engineered a 4-stage Bezier exploded disassembly pipeline with 11-DOF mechanical kinematics, GPU-accelerated magnetic attractor point clouds, and browser-native CAD HUD telemetry running at 60 FPS.",
    "behindTheScenes": {
      "strategicAngle": "Physical AI & Robotics Digital Twin: Replaced static CAD exports with browser-native 3D kinematics for real-time assembly verification.",
      "technicalAngle": "Inverse Kinematics & LiDAR Shaders: Built custom WebGL shaders simulating 50,000 LiDAR points and sub-millimeter mechanical joint constraints.",
      "deliverableAngle": "Interactive Industrial CAD HUD: Shipped an interactive ROS2-compatible telemetry dashboard with real-time joint angle inspection."
    },
    "media": {
      "heroBannerUrl": "https://framerusercontent.com/images/c0icF1d2f9V6AIQp4aaAceWLibc.png",
      "featureImages": [
        "https://framerusercontent.com/images/hnks3kius8DF9j4SMfF85eBD2w.png",
        "https://framerusercontent.com/images/wRz6bfwQkdbZl3Yw1j9nVdvy4M.png",
        "https://framerusercontent.com/images/uOlBXmSpCIxLnjQ4ST9KEJoRiM.png"
      ]
    },
    "links": {
      "liveUrl": "https://artificialcraft.space/robotics"
    }
  },
  {
    "id": "project-98",
    "title": "Project 98",
    "tags": [
      "motion-web-app-interactive",
      "branding",
      "graphic"
    ],
    "dateText": "Sep 2026",
    "impressiveMetric": "Successfully reduced team operational turnaround time by 20%, slashed client modification rates to below 15%.",
    "about": "Successfully reduced team operational turnaround time by 20%, slashed client modification rates to below 15%.",
    "contextObstacle": "Used packaging and brand design to elevate the product’s market position and turn a seasonal agricultural surplus into a standardized, higher-value consumer offering.<br><br>Directed end-to-end design delivery, including production-ready packaging, trade materials, and a web showcase, with close attention to export labeling and print requirements.<br><br>Coordinated cross-border stakeholders and a local design team while introducing automation to improve file handling, task tracking, and feedback cycles.",
    "technicalObstacle": "The product needed to meet detailed import, labeling, ingredient disclosure, and material requirements while entering a highly competitive market.<br><br>Prepress accuracy was essential: even minor errors in the packaging artwork could delay approval, affect logistics, or jeopardize shipment release.",
    "coreSolution": "Created bespoke hand-drawn produce illustrations and a premium visual system that highlighted the product’s origin, while ensuring every asset was prepared for compliant production.",
    "behindTheScenes": {
      "strategicAngle": "Spearheaded brand identity and packaging for Lam Dong's durian export to China, solving the \"good harvest, bad prices\" dilemma by transforming raw agricultural goods into premium consumer products.",
      "technicalAngle": "Delivered production-ready packaging, trade materials (Publishing Design), and responsive Web UI/UX, ensuring 100% compliance with strict international printing and custom-labeling standards.",
      "deliverableAngle": "Managed a remote, agile design team between Vietnam and China; built custom Python automation scripts to streamline file delivery, reducing operational turnaround time by 20%."
    },
    "media": {
      "heroBannerUrl": "https://framerusercontent.com/images/alOwjhppv1v5N2oXoOmKTjiBS3o.png",
      "featureImages": [
        "https://framerusercontent.com/images/0KMbccjrspmBIWSt9MfLeKM1gU.png",
        "https://framerusercontent.com/images/hBR3wvVreDIaGtONcOd6xrnO7Xw.png",
        "https://framerusercontent.com/images/2Gt9tE2ZwNHlnwvnQwXkycthj0.png"
      ],
      "youtubeEmbedUrl": "https://www.youtube.com/embed/s62GdiJMzgw"
    },
    "links": {
      "liveUrl": "https://youtu.be/s62GdiJMzgw"
    },
    "hidden": true
  },
  {
    "id": "australia-experiences",
    "title": "Australia Experiences — Tourism Identity",
    "tags": [
      "motion-web-app-interactive",
      "branding",
      "graphic"
    ],
    "dateText": "Aug 2025",
    "impressiveMetric": "100GB+Raw Footage + 400Hour Deadline + 100% Bespoke Soundtracks",
    "about": "100GB+Raw Footage + 400Hour Deadline + 100% Bespoke Soundtracks",
    "contextObstacle": "Developed brand identities and social media systems that expressed each business’s character and connected with its audience.<br><br>Created cohesive content frameworks for Instagram, YouTube, and TikTok, using contemporary color, typography, and imagery to build a consistent visual narrative.<br><br>Produced short-form video, motion graphics, and dynamic reels designed to strengthen attention, awareness, and engagement.",
    "technicalObstacle": "Projects often began without established brand guidelines, design systems, or usable visual assets, yet required polished promotional content within short production windows.<br><br>The process required rapid concept development, efficient asset creation, and focused editing to turn large volumes of raw footage into clear, engaging social content.",
    "coreSolution": "Implemented a streamlined multimedia workflow that enabled the team to develop visual identities, social grid systems, and promotional videos quickly while maintaining consistency across channels.",
    "behindTheScenes": {
      "strategicAngle": "Built comprehensive visual identities, logos, and high-engagement Instagram grid layouts from scratch for multiple hospitality brands, ensuring cohesive digital storytelling under tight market launch timelines.",
      "technicalAngle": "Processed 2GB to 10GB of raw footage per project to conceptualize, edit, and deliver dynamic short-form videos and motion graphics within a strict 4-hour turnaround time per video.",
      "deliverableAngle": "Orchestrated a hybrid editing workflow combining DaVinci Resolve (color/grading), Adobe After Effects (motion graphics), and CapCut (fast-paced pacing) to maximize audience retention and elevate brand awareness."
    },
    "media": {
      "heroBannerUrl": "https://framerusercontent.com/images/m1HClvOk0DuUGA4qnooq9kNU.png",
      "featureImages": [
        "https://framerusercontent.com/images/tFcrqlc10UCQsrXUxi80yh71SU.png",
        "https://framerusercontent.com/images/AcY6Di0iO4Sy3OoZVJ6JVRjfU0.png",
        "https://framerusercontent.com/images/bxR50FaMNMQLdGeUPeR9kuOK2o4.png"
      ],
      "youtubeEmbedUrl": "https://www.youtube.com/embed/OyrikXrAJw4"
    },
    "links": {
      "liveUrl": "https://www.youtube.com/watch?v=OyrikXrAJw4&list=PLa0lgj6kRqgg"
    },
    "hidden": true
  },
  {
    "id": "the-growth-agency",
    "title": "The Growth Agency — Growth Assets",
    "tags": [
      "motion-web-app-interactive",
      "branding",
      "graphic"
    ],
    "dateText": "Oct 2018",
    "impressiveMetric": "30+ logos successfully designed and put into practical use for individuals and organizations.",
    "about": "30+ logos successfully designed and put into practical use for individuals and organizations.",
    "contextObstacle": "Directed concepts for international branding, digital advertising, and marketing campaigns.<br><br>Designed high-fidelity websites, application interfaces, and paid-media assets using modern design and user-experience practices.<br><br>Worked with the production manager to plan workloads, coordinate the Ho Chi Minh City team, and introduce relevant design and marketing practices into daily workflows.",
    "technicalObstacle": "The team managed large volumes of campaign data and creative requests across markets with different working rhythms and expectations.<br><br>Success depended on clear communication, disciplined prioritization, and reliable systems for tracking assets, feedback, and approvals across time zones.",
    "coreSolution": "Standardised asset management and production processes with tailored automation for file preparation and batching, improving visibility, coordination, and delivery speed.",
    "behindTheScenes": {
      "strategicAngle": "Managed and coordinated an agile production team in Ho Chi Minh City to execute high-volume creative assets for an Australian agency, successfully bridge-managing communication and workflow bottlenecks.",
      "technicalAngle": "Owned the end-to-end execution of diverse multi-disciplinary projects, spanning from structural print and corporate branding to promotional video production and responsive Frontend/WordPress UI-UX layouts.",
      "deliverableAngle": "Acted as the central custodian for massive raw client data and creative assets, independently structuring the production pipeline and working under extended hours to ensure 100% on-time delivery across international time zones."
    },
    "media": {
      "heroBannerUrl": "https://framerusercontent.com/images/K23whkmX4C82evxqozLSt3oA9o.png",
      "featureImages": [
        "https://framerusercontent.com/images/tG9IS6dvhx3IV90Yl8pcIauFQ.png",
        "https://framerusercontent.com/images/IVHrWDjyTk8tKwzDtYP31Hmbk.png",
        "https://framerusercontent.com/images/Hy1l0FbuMVkSOVMenu1EhidXA.png"
      ]
    },
    "links": {
      "liveUrl": "https://www.youtube.com/@TheGrowthAgencyUK"
    },
    "hidden": true
  }
];

export const FLAGSHIP_SHOWCASE_PROJECT = SHOWCASE_PROJECTS[0];

export const getShowcaseProjectById = (id: string): ShowcaseProject | undefined => {
  return SHOWCASE_PROJECTS.find((p) => p.id === id);
};
