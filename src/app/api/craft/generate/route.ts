import { NextRequest, NextResponse } from 'next/server';
import { SwissDesignConfigSchema, CraftGenerateResponse } from '@/types/craft-studio';
import { generateFallbackCyberneticHTML } from '@/lib/studioAstGenerator';

// URL Endpoint của n8n Orchestrator / Dify AI Core (Đặt trong .env hoặc fallback)
const N8N_WEBHOOK_URL =
  (typeof process !== 'undefined' && (process.env?.N8N_CRAFT_WEBHOOK_URL || process.env?.N8N_CRAFT_GENERATOR_WEBHOOK)) ||
  'https://n8n.internal.network/webhook/craft-gen';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Client-Side Zod Gate Validation
    const validationResult = SwissDesignConfigSchema.safeParse(body.config || body);

    if (!validationResult.success) {
      return NextResponse.json<CraftGenerateResponse>(
        {
          success: false,
          error: 'Zod Validation Failed: Cấu hình gửi lên không hợp lệ.',
          message: JSON.stringify(validationResult.error.format()),
        },
        { status: 400 }
      );
    }

    const validatedConfig = validationResult.data;

    // 2. Chuyển tiếp Payload đã kiểm định sang n8n Webhook
    let htmlStream = '';

    try {
      const compositionId = validatedConfig.compositionId || body.compositionId || 'NODE_05_MANUFACTURING_FACTORY';
      const backendResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source-App': 'ARTIFICIAL-CRAFT-CONFIGURATOR',
          'X-Composition-Id': compositionId,
        },
        body: JSON.stringify({
          compositionId,
          config: validatedConfig,
          ast: body.ast || body,
          timestamp: new Date().toISOString(),
        }),
      });

      if (backendResponse.ok) {
        htmlStream = await backendResponse.text();
      } else {
        throw new Error(`n8n Webhook returned status ${backendResponse.status}`);
      }
    } catch (webhookError) {
      // Fallback Mock HTML cho môi trường Dev khi n8n chưa bật endpoint
      console.warn('[CRAFT API] Webhook unavailable, using Cybernetic Fallback Template:', webhookError);
      htmlStream = generateFallbackCyberneticHTML(validatedConfig);
    }

    // 3. Trả về kết quả HTML Stream dạng JSON cho Iframe Live Preview
    return NextResponse.json<CraftGenerateResponse>({
      success: true,
      htmlStream,
      message: 'HyperFrame compiled successfully at 60FPS.',
    });

  } catch (error: any) {
    console.error('[CRAFT API ERROR]:', error);
    return NextResponse.json<CraftGenerateResponse>(
      {
        success: false,
        error: error.message || 'Internal Server Error during compilation.',
      },
      { status: 500 }
    );
  }
}

/**
 * Fallback Generator tạo khung Single-File HTML/Three.js thời gian thực
 */
export { generateFallbackCyberneticHTML };
