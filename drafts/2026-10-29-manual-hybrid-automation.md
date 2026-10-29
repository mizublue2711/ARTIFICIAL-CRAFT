
---
slug: manual-hybrid-ai-automation
title: "HYBRID AI AUTOMATION BLUEPRINT"
subtitle: "Tuyệt kỹ Nối Ống 0-Token: Tách Brain Dify & Muscle n8n"
category: MANUAL
version: "v1.0.4"
author: "ARTIFICIAL CRAFT"
tags: ["DIFY", "N8N", "LLMOPS", "ARCHITECTURE"]
---

## [PAGE: p01_cover] [TYPE: COVER]
# HYBRID AI AUTOMATION BLUEPRINT
**Subtitle**: Tuyệt kỹ Nối Ống 0-Token: Tách Brain Dify & Muscle n8n
**Version**: BUILD // 2026.10
**Tags**: DIFY, N8N, LLMOPS, ARCHITECTURE

---

## [PAGE: p02_brain_and_muscle] [TYPE: TECH_DOC] [LAYOUT: SPLIT_LEFT_RIGHT]
### 01 // TRIẾT LÝ TÁCH NÃO VÀ CƠ BẮP

Cử n8n đi suy luận LLM phức tạp là tự sát hạ tầng. Ngược lại, bắt Dify đi làm Webhook polling hay xử lý file nhị phân sẽ gây đứt gãy luồng.

Công thức sống còn cho dân nối ống: **Dify đóng vai Bộ Não** (RAG, Prompt, LLMOps), còn **n8n làm Cơ Bắp** (Trigger, Retry 429, Commit DB).

```javascript
const res = await fetch('https://dify.local/v1/workflows/run', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${apiKey}` },
  body: JSON.stringify({ inputs: { draft: cleanText } })
});


[PAGE: p03_pipeline_flow] [TYPE: DIAGRAM] [LAYOUT: CANVAS_CENTER]
02 // LUỒNG NỐI ỐNG 0-TOKEN AN TOÀN
Graphic: AUTOMATION_FLOW Caption: Luồng xử lý khép kín: n8n Webhook -> Code Sanitizer 0-Token -> Dify Brain -> FLUX Render -> Cloudflare R2

[PAGE: p04_data_hygiene] [TYPE: TECH_DOC] [LAYOUT: STACKED_CODE_BOTTOM]
03 // BỘ LỌC RÁC DATA HYGIENE 0-TOKEN
Cụm từ "Lỗi 500 giữa đêm" luôn là nỗi ám ảnh của anh em thợ ống. Nguyên nhân 90% đến từ payload rác, field null hoặc dính ký tự xuống dòng chưa escape làm vỡ JSON.
Hãy dựng một Node JavaScript gác cổng gắt gao ngay tại n8n để chặn đứng rác dữ liệu trước khi tốn tiền gọi API AI.
const items = \$input.all();
const raw = items.json.text || "";
if (!raw.trim()) throw new Error("ERR_EMPTY_PAYLOAD");
const clean = raw.replace(/"/g, '\\"').replace(/\n/g, '\\n');
return [{ json: { cleanText: clean } }];


[PAGE: p05_sanitizer_matrix] [TYPE: DIAGRAM] [LAYOUT: SPLIT_DIAGRAM_RIGHT]
04 // MA TRẬN NẮN CHUẨN PAYLOAD
Graphic: DATA_MATRIX Caption: Mô hình lọc rửa và nắn chuẩn JSON payload rác trước khi nạp vào LLM Context.

[PAGE: p06_memory_offload] [TYPE: TECH_DOC] [LAYOUT: HERO_CODE_TOP]
05 // CHỐNG OOM VPS BẰNG R2 OFFLOADING
Đừng bao giờ để n8n ôm các file ảnh nhị phân hay chuỗi Base64 dài ngoẵng trong bộ nhớ tạm. Rủi ro tràn RAM (OOM Crash) trên VPS 4GB là cực kỳ cao.
Đẩy ngay file vừa render sang Cloudflare R2 (Miễn phí Egress) và chỉ truyền duy nhất chuỗi Public CDN URL qua các node tiếp theo.
# Offload binary to Cloudflare R2 (0 Egress Fee)
aws s3 cp /tmp/banner.png s3://artcraft-cdn/ \
  --endpoint-url https://<account_id>.r2.cloudflarestorage.com
rm -rf /tmp/banner.png
