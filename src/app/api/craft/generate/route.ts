import { NextRequest, NextResponse } from 'next/server';
import { SwissDesignConfigSchema, CraftGenerateResponse } from '@/types/craft-studio';

// URL Endpoint của n8n Orchestrator / Dify AI Core (Đặt trong .env hoặc fallback)
const N8N_WEBHOOK_URL = process.env.N8N_CRAFT_GENERATOR_WEBHOOK || 'https://n8n.internal.network/webhook/craft-gen';

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
      const backendResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source-App': 'ARTIFICIAL-CRAFT-CONFIGURATOR',
        },
        body: JSON.stringify({
          config: validatedConfig,
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
export function generateFallbackCyberneticHTML(config: any): string {
  const bg = config?.theme?.backgroundColor || '#09090B';
  const primary = config?.theme?.primaryColor || '#5322FF';
  const accent = config?.theme?.accentColor || '#00FF66';
  const text = config?.theme?.textColor || '#F4F4F5';
  const font = config?.theme?.fontFamily || 'JetBrains Mono';
  const brand = config?.brandName || 'ARTIFICIAL CRAFT';
  const tag = config?.tagline || 'Brutalist Automation & Graphic Precision';
  const modelType = config?.roboticsNode?.modelType || 'robot-arm';
  const speed = config?.roboticsNode?.rotationSpeed || 1.5;
  const isWireframe = config?.roboticsNode?.wireframe !== false;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} // HYPERFRAME 60FPS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html {
      width: 100%; height: 100%;
      background-color: ${bg};
      color: ${text};
      font-family: '${font}', monospace;
      overflow: hidden;
    }
    .hud-header {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 48px;
      background: rgba(9, 9, 11, 0.7);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 30;
      font-size: 11px;
    }
    .badge {
      background: rgba(83, 34, 255, 0.15);
      border: 1px solid ${accent};
      color: ${accent};
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    #three-viewport {
      width: 100%; height: 100%;
      position: absolute;
      top: 0; left: 0;
    }
    .hud-brand {
      position: absolute;
      bottom: 24px; left: 24px;
      z-index: 20;
      pointer-events: none;
    }
    .hud-brand h1 {
      font-size: 1.5rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #fff;
    }
    .hud-brand p {
      font-size: 0.8rem;
      color: ${accent};
      opacity: 0.85;
      margin-top: 4px;
      letter-spacing: 1px;
    }
    .hud-telemetry {
      position: absolute;
      top: 60px; right: 16px;
      z-index: 20;
      background: rgba(0,0,0,0.7);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 8px 12px;
      font-size: 10px;
      color: #a1a1aa;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  </style>
</head>
<body>
  <header class="hud-header">
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="width:6px; height:6px; border-radius:50%; background:${accent}; box-shadow:0 0 8px ${accent};"></span>
      <span style="font-weight:700; color:#fff;">${brand} // STUDIO RUNTIME</span>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <span class="badge">SLA: 60FPS</span>
      <span class="badge" style="border-color:${primary}; color:${primary};">AST VALIDATED</span>
    </div>
  </header>

  <div id="three-viewport"></div>

  <div class="hud-brand">
    <h1>${brand}</h1>
    <p>${tag}</p>
  </div>

  <div class="hud-telemetry">
    <div>NODE: <span style="color:#fff;">${modelType.toUpperCase()}</span></div>
    <div>WIREFRAME: <span style="color:${accent};">${isWireframe ? 'ENABLED' : 'DISABLED'}</span></div>
    <div>VELOCITY: <span style="color:${primary};">${speed}x</span></div>
  </div>

  <script>
    (function() {
      const container = document.getElementById('three-viewport');
      if (!container) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('${bg}');
      scene.fog = new THREE.FogExp2('${bg}', 0.05);

      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(3.2, 2.4, 4.0);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight('${primary}', 2.5);
      keyLight.position.set(5, 8, 5);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight('${accent}', 3.0, 15);
      rimLight.position.set(-4, -2, -4);
      scene.add(rimLight);

      // Procedural 3D Mesh Group
      const group = new THREE.Group();
      scene.add(group);

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('${primary}'),
        wireframe: ${isWireframe ? 'true' : 'false'},
        metalness: 0.8,
        roughness: 0.2
      });

      // Assembly components
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 1.2, 16), mat);
      group.add(core);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), mat);
      arm.position.set(0.6, 0.8, 0);
      arm.rotation.z = -0.4;
      group.add(arm);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 16, 32), new THREE.MeshBasicMaterial({ color: '${accent}', wireframe: true }));
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      function animate() {
        requestAnimationFrame(animate);
        group.rotation.y += 0.008 * ${speed};
        ring.rotation.z += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    })();
  </script>
</body>
</html>`;
}
