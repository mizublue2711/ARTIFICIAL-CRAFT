BẢN ĐỒ KIẾN TRÚC THƯ MỤC REPO ARTIFICIAL-CRAFT & QUY TRÌNH VẬN HÀNH BẮT BUỘC

1. TỔNG QUAN KIẾN TRÚC & TRIẾT LÝ THIẾT KẾ (JSON-DRIVEN ARCHITECTURE)

Hệ thống web tương tác 3D artificialcraft.space vận hành trong bối cảnh hạ tầng phần mềm phức tạp, nơi ngôn ngữ thị giác Cybernetic Brutalism với độ phân giải đồ họa 60FPS đòi hỏi sự kết nối liền mạch với các đường ống (pipelines) tự động hóa AI Hybrid. Để duy trì tính ổn định tuyệt đối của hệ thống web tương tác mà không gây quá tải bộ nhớ trình duyệt hay phát sinh chi phí hạ tầng máy chủ, dự án áp dụng triết lý thiết kế chiến lược JSON-Driven Architecture. Triết lý này đóng vai trò như một cơ chế đóng băng mã nguồn giao diện frontend, biến toàn bộ trải nghiệm web thành một "máy chiếu" dữ liệu động, qua đó loại bỏ hoàn toàn nguy cơ rò rỉ bộ nhớ, triệt tiêu lỗi trôi cấu hình ngầm (silent schema drift) và tối ưu hóa hiệu năng thực thi trên thiết bị đầu cuối.

1.1 Triết lý Vận hành 0-Code (0-Code Website Operations) & Giải pháp Khắc phục Tràn Ngữ Cảnh (Context Bloat)

Trong quy trình phát triển phần mềm hỗ trợ bởi AI, các tác nhân AI Worker (Cursor, Jules, Dify Bot, Claude) gặp phải sự cố quá tải bộ nhớ nghiêm trọng—được định danh là hiện tượng Tràn Ngữ Cảnh (Context Bloat). Nguyên nhân cốt lõi xuất phát từ việc AI Worker phải gánh đồng thời hai nhiệm vụ: vừa duy trì mã nguồn giao diện phức tạp bằng React/TypeScript (.tsx, JSX Structure, Layout Hooks), vừa xử lý các logic tự động hóa và suy luận đa tầng. Sự gia tăng dung lượng token trong bộ nhớ làm việc làm giảm khả năng suy luận chính xác, dẫn đến tình trạng AI tự ý sinh code thừa, vỡ cấu hình Type, hoặc làm hỏng kiến trúc trang.

Triết lý JSON-Driven Architecture giải quyết triệt để vấn đề Context Bloat bằng cách bóc tách tuyệt đối lớp nội dung khỏi mã nguồn hiển thị. Mọi thao tác vận hành website—bao gồm bổ sung bài viết, cập nhật cấu hình section, xuất bản sách Flipbook 3D hay cập nhật thẻ Video Showcase—đều được đóng gói thành các file cấu hình JSON siêu nhẹ (~50 token) như site-configs/template-schema.json, src/data/showcase-config.json, và src/data/books/*.json.

Trước khi nạp vào Dynamic Engine, các file cấu hình JSON này được bộ biên dịch chuyển đổi trực tiếp thành cây cú pháp trừu tượng (JSON AST Payload). AI Worker và nhà vận hành hệ thống chỉ giao tác với các tệp JSON cấu hình AST này mà không bao giờ cần can thiệp hay sửa đổi mã nguồn .tsx.

Tiêu chí so sánh	Vận hành Lập trình Truyền thống (Truy cập sửa code .tsx)	Vận hành Kiến trúc JSON-Driven (Chỉ chỉnh sửa cấu hình JSON)
Mức tiêu thụ Token	Rất cao (phải tải toàn bộ file .tsx, layout, props và các module phụ thuộc).	Siêu thấp (~50 token cho một file cấu hình JSON AST cập nhật).
Rủi ro sinh lỗi TypeScript	Cao (dễ văng lỗi build, sai lệch types, mất import hoặc vỡ cấu trúc JSX).	0% (giao diện React đã đóng đanh, chỉ nạp dữ liệu qua schema JSON hợp lệ).
Tốc độ triển khai	Chậm (cần biên dịch lại toàn bộ UI, kiểm soát rủi ro vỡ giao diện).	Tức thì (chỉ cần đẩy JSON payload mới, hệ thống dynamic render thời gian thực).
Yêu cầu can thiệp mã nguồn	Bắt buộc can thiệp trực tiếp mã nguồn React/TypeScript giao diện.	Không can thiệp mã nguồn (0-Code Operations dành cho AI Worker/Operator).

1.2 Mô hình Phân tách Trách nhiệm: Bộ não (Dify), Cơ bắp (n8n) & Máy chiếu (Web Substrate)

Kiến trúc vận hành toàn cục của ARTIFICIAL-CRAFT được thiết lập dựa trên sự phân tách trách nhiệm tuyệt đối giữa ba tầng hệ thống phụ thuộc tất định:

* Bộ não suy luận (Dify Cloud / Vertex AI - Reasoning Core): Đóng vai trò hạt nhân suy luận đa tầng. Dify chịu trách nhiệm phân tích bối cảnh, cào dữ liệu, tổng hợp nội dung bản thảo và đưa ra các quyết định logic phức tạp. Đầu ra của Dify là dữ liệu cấu trúc chuẩn hóa định dạng JSON AST.
* Cơ bắp thực thi (n8n Orchestrator - Deterministic Execution): Đóng vai trò điều phối luồng công việc tất định 100% (deterministic fanout). n8n nhận JSON AST từ Dify, kích hoạt các webhook, xử lý dữ liệu trung gian, phân phối thông điệp đa kênh (Telegram, Slack, CRM HubSpot) và đẩy JSON payload cuối cùng đến website.
* Máy chiếu & Showroom (Website artificialcraft.space - Client-Side Canvas/GPU): Đóng vai trò hiển thị và là môi trường tương tác đồ họa. Website không tham gia tính toán logic AI và không thực hiện render đồ họa phía server. Thay vào đó, nó đọc payload JSON AST để dựng khung hình đồ họa Cybernetic Brutalism 60FPS bằng GPU trực tiếp của trình duyệt người dùng. Cơ chế này giúp chi phí server render duy trì ở mức tuyệt đối: $0.00.

Cấu trúc phân tách 3 tầng này tạo ra một hành lang kỹ thuật an toàn. Việc nâng cấp logic suy luận phía backend không gây xáo trộn giao diện frontend. Để kiểm soát chính xác không gian lưu trữ các module của kiến trúc này, Section 2 sẽ khảo sát bản đồ cây thư mục toàn cục và ma trận tích hợp thành phần.

2. CẤU TRÚC THƯ MỤC TOÀN CỤC & MA TRẬN THÀNH PHẦN (DIRECTORY TREE & COMPONENT MATRIX)

Thiết lập một quy chuẩn không gian thư mục chặt chẽ là điều kiện bắt buộc để bảo vệ tính toàn vẹn mã nguồn của repository ARTIFICIAL-CRAFT. Khi dự án được phát triển và vận hành bởi sự phối hợp giữa lập trình viên con người và các AI Agent độc lập, quy hoạch thư mục rõ ràng giúp ngăn chặn việc ghi đè file, loại bỏ tình trạng rò rỉ bộ nhớ và triệt tiêu mã nguồn rác phát sinh.

2.1 Sơ đồ Cây Thư mục Chi tiết từ Cấp Gốc đến Chức năng

ARTIFICIAL-CRAFT/
├── AGENT.md                       <-- Hiến pháp vận hành & quy tắc bắt buộc cho AI Worker
├── AGENT_FLIPBOOK_SPEC.md         <-- Quy chuẩn kỹ thuật biên dịch Flipbook cho AI Agent
├── ARCHITECTURE_HANDOVER.md       <-- Báo cáo kiến trúc bàn giao toàn cục hệ thống
├── motion-rules.json              <-- Quy tắc chuyển động Remotion gốc
├── package.json                   <-- Khai báo dependencies, scripts build và CLI tools
├── vite.config.ts                 <-- Cấu hình Vite build pipeline & alias paths
├── wrangler.json                  <-- Cấu hình Cloudflare Workers Edge Deployment
├── site-configs/
│   └── template-schema.json       <-- Cấu hình JSON SSOT dựng toàn bộ Sections trang chủ
├── drafts/                        <-- Thư mục chứa các bản thảo thô (.md, .txt)
├── assets/
│   └── audio/                     <-- Thư viện âm thanh hiệu ứng (Synth Sub-Drop, Cyber Chime)
├── dist/                          <-- THƯ MỤC BUILD ĐÃ ĐÓNG NẮP (CẤM CAN THIỆP/COMMIT)
├── src/
│   ├── app/                       <-- Next.js App Router Architecture
│   │   ├── api/
│   │   │   └── craft/
│   │   │       └── generate/
│   │   │           └── route.ts   <-- Next.js API Proxy Handler, Zod Gate & Webhook Forwarder
│   │   └── studio/
│   │       └── page.tsx           <-- Page Route hiển thị chính cho Studio Configurator
│   ├── components/                <-- Kho linh kiện UI Frontend (Đã đóng đanh)
│   │   ├── DynamicSectionRenderer.tsx <-- Engine đọc JSON AST dựng trang chủ Web
│   │   ├── VideoShowcase.tsx           <-- Engine render Video Showcase 60FPS
│   │   ├── flipbook/
│   │   │   └── FlipBookEngine.tsx      <-- Engine render Sách Flipbook 3D tương tác
│   │   └── studio/
│   │       └── CraftStudioConfigurator.tsx <-- Bảng điều khiển 5 bước & Live Preview Stage
│   ├── core/                      <-- Thư mục lõi quản lý Registry & Graphic Presets (SSOT)
│   │   ├── registry.ts            <-- SỔ TAY TỔNG (SSOT): Khai báo & đăng ký Component ID
│   │   ├── remotionRegistry.ts    <-- Sổ tay ánh xạ Component cho Video Showcase
│   │   └── remotion-presets/      <-- Kho chứa mã nguồn 3D / HUD / Canvas 2D/3D procedural
│   ├── data/                      <-- Data Layer chứa cấu hình JSON động
│   │   ├── showcase-config.json   <-- File cấu hình danh sách Video Showcase
│   │   └── books/                 <-- Thư mục chứa các file cấu hình Sách Flipbook (*.json)
│   │       └── registry.ts        <-- Registry đăng ký danh mục Sách Flipbook
│   ├── lib/                       <-- Thư viện tiện ích, AST Generator & Fallback HTML
│   │   └── studioAstGenerator.ts  <-- Bộ đúc AST Payload & Fallback HTML Generator
│   └── types/                     <-- Định nghĩa kiểu dữ liệu TypeScript & Zod Schema Gates
│       ├── craft-studio.ts        <-- TypeScript Interfaces & Zod Schema (SwissDesignConfigSchema)
│       ├── flipbook.ts            <-- Schema cho hệ thống Flipbook & Wealth Extensions
│       └── preset.ts              <-- UniversalComponentProps interface chuẩn


2.2 Bảng Ma trận Tích hợp Thành phần Kỹ thuật (Technical Integration Matrix)

STT	Đường dẫn File (Path)	Định dạng / Nhiệm vụ	Mô tả Chức năng	File phụ thuộc liên quan
1	src/types/craft-studio.ts	TypeScript & Zod Schema	Định nghĩa cấu trúc dữ liệu JSON AST và chứa Zod Schema (SwissDesignConfigSchema) để kiểm định client-side/server-side, triệt tiêu lỗi trôi cấu hình ngầm.	@/components/studio/CraftStudioConfigurator, @/app/api/craft/generate/route
2	src/components/studio/CraftStudioConfigurator.tsx	React Client Component	Khung giao diện chính chứa Bảng điều khiển Wizard Dock 5 bước, bộ Visual AI Stylist hook, và Live Preview Stage nhúng <iframe srcdoc="...">.	@/types/craft-studio, @/lib/studioAstGenerator
3	src/app/api/craft/generate/route.ts	Next.js API Route Handler	Route trạm trung chuyển bảo mật: nhận JSON từ Frontend, kiểm định Zod safeParse, chuyển tiếp sang n8n Webhook và hứng chuỗi HTML stream trả về.	@/types/craft-studio, @/lib/studioAstGenerator
4	src/app/studio/page.tsx	Next.js Page Route	Trang hiển thị chính cho tuyến đường /studio. Nhúng CraftStudioConfigurator vào Layout tổng của website mà không lồng trùng Navbar/Footer.	@/components/studio/CraftStudioConfigurator
5	src/core/registry.ts & site-configs/template-schema.json	SSOT Registry Configuration	Khai báo Single Source of Truth duy nhất: đăng ký Dynamic Import cho linh kiện mới và cấu hình route/card spec trong sổ tay hệ thống.	@/core/remotion-presets/, @/components/DynamicSectionRenderer

Kiểm soát ma trận tích hợp 5 vị trí file trọng yếu này là điều kiện cần. Bước tiếp theo là tuân thủ nghiêm ngặt quy tắc quản lý tài nguyên đồ họa tập trung tại trung tâm Registry SSOT ở Section 3.

3. QUY TẮC BẮT BUỘC VỀ REGISTRY TRUNG TÂM (SSOT REGISTRY & GRAPHIC PRESETS)

Nguyên tắc Nguồn sự thật duy nhất (Single Source of Truth - SSOT) là trụ cột trong kiến trúc quản trị tài nguyên đồ họa của dự án ARTIFICIAL-CRAFT. Việc bắt buộc đăng ký tập trung triệt tiêu tình trạng phân tán mã nguồn visual, ngăn chặn sự cô lập của các linh kiện nằm rải rác trong thư mục tính năng ngẫu nhiên và đảm bảo mọi component đồ họa đều tuân thủ chuẩn interface chung.

3.1 Cơ chế Đăng ký Linh kiện Đồ họa tại src/core/registry.ts

Toàn bộ các linh kiện visual, mô hình 3D Canvas, các khối dựng procedural và Motion Presets mới khi phát triển bắt buộc phải tuân thủ quy trình 2 bước đóng đanh:

1. Vị trí lưu trữ tập trung: Đặt toàn bộ mã nguồn component mới vào thư mục src/core/remotion-presets/. Nghiêm cấm hành vi khởi tạo các UI Visual Component rải rác bên trong các thư mục tính năng ngẫu nhiên (src/components/feature/, src/app/...).
2. Đăng ký ID tập trung: Khai báo và ánh xạ ID duy nhất của component tại Sổ tay kiểm kê trung tâm src/core/registry.ts (hoặc src/core/remotionRegistry.ts).

Mọi linh kiện đồ họa khi khởi tạo phải tuân thủ chuẩn giao tiếp thuộc tính (Strict Data Contract) bằng cách kế thừa interface UniversalComponentProps từ @/types/preset. Các component phải là dạng thuần React/SVG/Canvas có khả năng render mượt mà trên cả Web DOM chuẩn (Web Sections, Flipbook Engine) lẫn nền tảng @remotion/player.

Các thuộc tính tiêu chuẩn bắt buộc hỗ trợ bao gồm:

* seed?: string (Chuỗi hạt giống thuật toán để khởi tạo đồ họa ngẫu nhiên tất định).
* primaryColor?: string (Màu chủ đạo, mặc định theo tone Swiss Cyber-Brutalism #5322FF).
* speed?: number (Hệ số tốc độ chuyển động của animation hoặc vòng xoay 3D).
* interactive?: boolean (Trạng thái cho phép hoặc tắt phản hồi tương tác con trỏ).

3.2 Danh mục Graphic Presets & Protocol Dự phòng Trôi Cấu hình (Graceful Fallback Policy)

Hệ thống SSOT Registry khai báo sẵn danh mục các Graphic Presets chuẩn mực, bao gồm các preset hệ thống và các preset mở rộng phục vụ báo cáo tài chính/quản trị tài sản (Wealth Management):

* Danh mục Core Presets: swiss-hud, isometric-matrix, bento-3d, logarithmic-spiral, code-editor, rubik-3d, dual-engine.
* Danh mục Wealth Management Extensions (theo AGENT_FLIPBOOK_SPEC.md): PORTFOLIO_ALLOCATOR, EXECUTIVE_PORTRAIT, RISK_RADAR, GLOBAL_GEO_NODES, CANDLESTICK_STREAM, WATERFALL_FLOW.

Nhằm đảm bảo hệ thống duy trì trạng thái hoạt động liên tục ngay cả khi dữ liệu đầu vào từ AI Agent hoặc Webhook bị vỡ cấu trúc, ARTIFICIAL-CRAFT áp dụng Protocol dự phòng lỗi 2 cấp (Graceful Fallback Policy / Zero-Crash Policy):

Payload JSON AST từ AI Agent / n8n Webhook
                   │
                   ▼
     ┌───────────────────────────┐
     │ CẤP 1: JSON Parsing Phase │ ──(Phát hiện ID graphicType chưa đăng ký)──► Tự động reassign:
     └───────────────────────────┘                                              graphicType = 'swiss-hud'
                   │                                                            & Tạo seed từ Tiêu đề trang
                   ▼ (Payload đã chuẩn hóa qua Cấp 1)
     ┌───────────────────────────┐
     │ CẤP 2: Runtime Component  │ ──(<GenerativeVisual /> nhận Key lạ)────────► Chuyển sang Procedural Canvas 2D/3D
     └───────────────────────────┘                                              dựa trên seed (Zero-Crash SLA)


1. Cấp độ Biên dịch (JSON Parsing Phase): Nếu AI Agent hoặc payload JSON truyền một graphicType chưa được đăng ký trong Registry, bộ biên dịch sẽ không tạo file .tsx mới hay sửa đổi Type definitions. Hệ thống tự động reassign về graphicType: "swiss-hud" và khởi tạo chuỗi seed từ tiêu đề trang.
2. Cấp độ Trình diễn (Runtime Component Phase): Tại thời điểm render, nếu component <GenerativeVisual /> nhận một ID lạ, hệ thống lập tức chuyển hướng sang Canvas 2D/3D procedural để vẽ họa tiết thuật toán dựa trên chuỗi seed. Nhờ đó, ứng dụng không bao giờ bị dừng hoặc văng lỗi giao diện (Zero-Crash).

Cơ chế Registry an toàn này đóng vai trò như lớp giáp bảo vệ cho frontend. Tiếp theo, Section 4 sẽ phân tích cơ chế kiểm định dữ liệu đầu vào thông qua Zod Schema Gate và kiến trúc thực thi của Studio Configurator Engine.

4. NGUYÊN TẮC KIỂM ĐỊNH ZOD SCHEMA GATE & STUDIO CONFIGURATOR ENGINE

Nhằm đảm bảo tính đồng nhất dữ liệu AST giữa Client Frontend, API Proxy Route và Backend AI/n8n Webhook, hệ thống thiết lập cổng kiểm định Zod Schema. Cơ chế này loại bỏ hoàn toàn tình trạng silent schema drift, đảm bảo mọi dữ liệu truyền tải đều tuân thủ chính xác định dạng kỹ thuật.

4.1 Cấu trúc Kiểm định Payload Zod (SwissDesignConfigSchema) & API Route Proxy

Mọi payload JSON AST tạo ra từ giao diện hoặc AI Stylist đều phải đi qua Zod Gate tại hai cấp (Client-Side và Server-Side API Proxy) trước khi nạp vào hệ thống tự động hóa:

[ FRONTEND CONFIGURATOR UI ] ──(Client-Side Zod Gate)──► [ JSON AST PAYLOAD ]
           │                                                    │
           ▼                                                    ▼
[ LIVE PREVIEW <IFRAME SRCDOC> ] ◄──(Dynamic HTML Stream)── [ NEXT.JS API ROUTE PROXY ]
                                                                │
                                                                ▼
                                                   [ N8N WEBHOOK + DIFY REASONING ]


Khi request gửi đến Next.js API Proxy Route tại src/app/api/craft/generate/route.ts, hàm xử lý bất đồng bộ (async POST handler) thực hiện đúng 3 bước:

1. Kiểm định Zod Gate: Bóc tách request body và gọi lệnh SwissDesignConfigSchema.safeParse(body.config || body). Nếu validation thất bại (!validationResult.success), API ngắt luồng ngay lập tức và trả về response HTTP 400 Bad Request kèm thông báo lỗi format JSON.
2. Chuyển tiếp Webhook Bảo mật: Nếu payload hợp lệ, API Proxy chuyển tiếp JSON AST sang endpoint n8n Webhook được chỉ định trong biến môi trường: process.env.N8N_CRAFT_GENERATOR_WEBHOOK (với fallback ưu tiên process.env.N8N_CRAFT_WEBHOOK_URL). Request gửi sang n8n bắt buộc đính kèm header xác thực hệ thống:

{
  "Content-Type": "application/json",
  "X-Source-App": "ARTIFICIAL-CRAFT-CONFIGURATOR"
}


1. Kích hoạt Local Dev Fallback: Trong môi trường phát triển (Dev mode) khi Webhook n8n ngoại tuyến, API Proxy tự động bắt lỗi catch và kích hoạt hàm dự phòng tại chỗ generateFallbackCyberneticHTML(validatedConfig) từ @/lib/studioAstGenerator. Hàm này đúc một khung Single-File HTML/Three.js độc lập đạt 60FPS trả về cho client.

4.2 Luồng Render 60FPS In-Memory Stream & Stripping Shell Strategy

Studio Configurator Engine được thiết kế dựa trên hai nguyên lý hạ tầng tối ưu cho trình duyệt:

* Stripping Shell Strategy (Chiến lược Bóc tách Khung Layout): Component CraftStudioConfigurator.tsx tuyệt đối không render lại Navbar hoặc Footer bên trong chính nó. Trang /studio/page.tsx nhúng component này trực tiếp vào Layout tổng của Next.js App Router. Chiến lược này loại bỏ hiện tượng trùng lặp Navbar/Footer và giữ cho cây DOM tinh gọn.
* In-Memory Dynamic Stream: Hệ thống không ghi các file .html tĩnh lên ổ đĩa cứng của server. Chuỗi mã HTML/WebGL sinh ra từ API Proxy được lưu giữ trong bộ nhớ RAM và bơm trực tiếp vào thẻ Iframe phía Client qua thuộc tính:

<iframe 
  srcdoc={htmlStream} 
  sandbox="allow-scripts allow-modals" 
  className="w-full h-full bg-black border border-white/10" 
/>


Bảng điều khiển 5 bước (Wizard Dock) trong CraftStudioConfigurator.tsx vận hành theo thông số kỹ thuật chi tiết:

* Step 1 (Brand Identification): Định danh thương hiệu qua brandName, thiết lập slogan tagline, khởi tạo Composition ID anchor cho bộ biên dịch AST và kích hoạt bộ trích xuất palette tự động từ logoUrl.
* Step 2 (Aesthetic & Visual AI Stylist): Tùy biến thị giác qua 3 lớp:
  * Lớp 1 (Preset Swatches): Obsidian & Indigo (#09090B, #5322FF, #00E5FF), Titanium & Cyan (#18181B, #00E5FF, #5322FF), Cybernetic Matrix (#05050A, #5322FF, #00FF66), Industrial Amber (#0C0A09, #F59E0B, #10B981).
  * Lớp 2 (AI Stylist Hook): handleAIGeneratePalette() tự động phân tích prompt và chuyển đổi palette.
  * Lớp 3 (Manual Fine-Tuning & Motion Tokens): Tùy chỉnh màu hex, chọn Typography (JetBrains Mono, Space Grotesk, Inter), và bật/tắt các Motion Tokens (kinetic-parallax, chromatic-aberration, text-clipping-reveal, magnetic-attraction, glitch-flicker).
* Step 3 (3D Engine & Exploded Assembly): Chọn mô hình Actuator 3D (robot-arm, kinematic-assembler, point-cloud-node, holographic-core), điều chỉnh thanh trượt rã linh kiện explodedProgress (0% - 100%) qua 4 giai đoạn:
  * stage0: 0% // Assembled Unibody Core
  * stage33: 33% // Tactical Aerogel Shell
  * stage66: 66% // High-Torque Motor Stator
  * stage100: 100% // Micro Tactile Sensor Array
  * Bật/tắt công tắc raycastingLaser (Cyan Laser 1px) và wireframe (Khung dây CAD).
* Step 4 (Telemetry & Bento Grid): Cấu hình chỉ số SLA Telemetry (telemetryFps, torquePrecision, dofSensorCount, aiLatency), bật/tắt các module Bento Grid 3D (viewport3d, performanceGraph, interactiveTactileMatrix) và kích hoạt spatialPointCloud với hơn 1200 hạt dữ liệu từ tính.
* Step 5 (Export & Hand-off Dock): Cho phép xuất JSON AST Payload (handleExportJsonAst), tải tệp Single-File HTML (handleDownloadSingleFileHtml), chọn ngôn ngữ SDK (typescript, python, ros2, cpp) và theo dõi Console Log biên dịch 60FPS thời gian thực.

Quy trình vận hành chuẩn xác của Studio Configurator đòi hỏi kỷ luật nghiêm ngặt khi tiếp quản mã nguồn. Section 5 sẽ thiết lập các điều khoản bàn giao bắt buộc cho toàn bộ lập trình viên và AI Agent.

5. HƯỚNG DẪN THỰC THI DÀNH CHO AI AGENTS VÀ LẬP TRÌNH VIÊN TIẾP QUẢN (HANDOVER RULES)

Nhằm đảm bảo di sản kiến trúc ARTIFICIAL-CRAFT duy trì độ tin cậy hạ tầng và hiệu năng 60FPS lâu dài, toàn bộ lập trình viên con người và các AI Worker tiếp quản (Cursor, Jules, Claude, Dify Bot) bắt buộc phải tuân thủ các quy định đóng đanh và giới hạn biên ngữ cảnh dưới đây.

5.1 3 Quy tắc Đóng đanh & Giới hạn Biên Ngữ cảnh (Token Efficiency & Boundaries)

Mọi kỹ sư và AI Worker khi thao tác trên repository phải áp dụng 3 Quy tắc Đóng đanh vận hành (Immutable Operational Rules):

1. QUY TẮC 0-CODE (TỰ ĐỘNG HÓA HOÀN TOÀN BẰNG JSON): Tuyệt đối không can thiệp hoặc sửa đổi mã nguồn giao diện .tsx trong src/components/ khi chỉ có nhu cầu thêm nội dung, tạo bài viết mới, xuất bản sách Flipbook hay chèn video showcase. Mọi thao tác cập nhật nội dung chỉ được thực hiện thông qua các file cấu hình JSON (site-configs/template-schema.json, src/data/showcase-config.json, src/data/books/*.json).
2. QUY TẮC TRA CỨU SSOT REGISTRY: AI Agent khi tự động sinh nội dung visual chỉ được phép trích xuất và gán các presetId / graphicType đã đăng ký sẵn trong src/core/registry.ts hoặc src/core/remotionRegistry.ts. Cấm tự ý tạo mới các component đồ họa nằm ngoài danh mục Registry.
3. QUY TẮC PHÂN CHIA BỘ NÃO & MÁY CHIẾU: Giữ đúng ranh giới vận hành: Dify + n8n là Bộ brain suy luận và Cơ bắp thực thi phía backend; Website artificialcraft.space chỉ đóng vai trò Máy chiếu hiển thị 60FPS phía frontend. Không chuyển các tác vụ tính toán nặng về client.

Giới hạn biên đọc tệp dành cho AI Worker (Context Boundaries): Để tối ưu hóa tiêu thụ token và duy trì hiệu suất suy luận cho AI Worker, khi phân công tác vụ, chỉ chỉ định AI đọc tệp trong giới hạn 3 thư mục:

* src/components/
* src/lib/
* site-configs/

Nghiêm cấm việc ra lệnh cho AI Worker duyệt tràn lan toàn bộ repository (unneeded folders) để tìm kiếm linh kiện visual.

5.2 Quy trình Kiểm duyệt Chất lượng Build Gate (npx tsc --noEmit) & Quy tắc Cấm Tác động Thư mục dist/

Để tránh gây hỏng hóc hạ tầng hoặc vỡ quy trình CI/CD, đội ngũ tiếp quản phải tuân thủ hai quy định kiểm duyệt bắt buộc:

* Quy tắc Cấm tác động Thư mục dist/: Nghiêm cấm tuyệt đối việc tạo mới, chỉnh sửa, hoặc commit bất kỳ file nào bên trong thư mục dist/ hoặc build/. Thư mục này thuộc quyền quản lý của hệ thống tự động build và được bảo vệ nghiêm ngặt.
* Quy trình Kiểm duyệt Build Gate: Trước khi thực hiện checkout nhánh git (ví dụ: feat/studio-node), commit mã nguồn hoặc tạo Pull Request, lập trình viên/AI Agent bắt buộc phải thực thi lệnh kiểm tra cú pháp TypeScript:

npx tsc --noEmit


Lệnh này phải trả về kết quả hoàn toàn 0 lỗi TypeScript (0 errors). Nếu phát sinh lỗi type, Pull Request sẽ bị ngắt luồng và từ chối phê duyệt.

Checklist Quy trình Bàn giao & Tiếp quản Dự án 4 Bước (Handover Checklist)

[ ] BƯỚC 1: KIỂM TRA TÍNH TOÀN VẸN TypeScript BUILD GATE
    Thực thi lệnh CLI trên Terminal:
    $ npx tsc --noEmit
    Yêu cầu: Kết quả phải đạt đúng 0 lỗi TypeScript trước khi tạo bất kỳ thay đổi nào.

[ ] BƯỚC 2: XÁC NHẬN LUỒNG VẬN HÀNH 0-CODE
    Kiểm tra các cập nhật nội dung (Sections, Flipbooks, Videos) đã được đưa vào file JSON 
    trong `site-configs/` hoặc `src/data/` chưa. Đảm bảo mã nguồn `.tsx` không bị can thiệp.

[ ] BƯỚC 3: ĐĂNG KÝ REGISTRY CHO LINH KIỆN MỚI (NẾU CÓ)
    Nếu phát triển linh kiện 3D/Canvas mới, xác nhận file đã nằm trong `src/core/remotion-presets/` 
    và đã được đăng ký ID chuẩn `UniversalComponentProps` tại `src/core/registry.ts`.

[ ] BƯỚC 4: VERIFY BẢO VỆ THƯ MỤC `dist/` VÀ COMMIT ATOMIC
    Xác nhận không có tệp nào trong `dist/` bị thay đổi hoặc commit. Thực hiện commit atomic 
    với thông điệp chuẩn mực (ví dụ: `feat(studio): add ast generator validation`) và mở Pull Request.
