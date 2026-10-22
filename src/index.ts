export interface Env {
  // Khai báo biến môi trường đã set ở Bước 1
  LOGO_DEV_TOKEN?: string;
  ASSETS?: { fetch: (request: Request | string) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // -------------------------------------------------------------
    // ROUTE PROXY: Xử lý bypass CORS cho Logo API
    // -------------------------------------------------------------
    if (url.pathname === '/api/logo-proxy') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=86400',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      // 1. Kiểm tra tham số url hoặc domain truyền lên từ Client
      const imageUrlParam = url.searchParams.get('url');
      const domain = url.searchParams.get('domain');

      if (!imageUrlParam && !domain) {
        return new Response(JSON.stringify({ error: 'Missing url or domain parameter' }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }

      // 2. Xác định URL nguồn ảnh
      let logoApiUrl: string;
      if (imageUrlParam) {
        logoApiUrl = imageUrlParam;
      } else {
        const apiToken = env.LOGO_DEV_TOKEN || 'pk_free_tier_key';
        logoApiUrl = `https://img.logo.dev/${encodeURIComponent(domain!)}?token=${apiToken}`;
      }

      try {
        // 3. Worker đóng vai trò Server-to-Server gọi sang Logo / Image Provider
        const imageRes = await fetch(logoApiUrl);

        if (!imageRes.ok) {
          return new Response('Logo not found', {
            status: imageRes.status,
            headers: corsHeaders,
          });
        }

        // 4. Khởi tạo Response trả về dữ liệu Binary của ảnh
        const response = new Response(imageRes.body, imageRes);

        // 5. GÁN HEADER CORS BẤT TỬ - CHỐNG LỖI CANVAS TAINT
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', '*');
        response.headers.set('Cache-Control', 'public, max-age=86400'); // Cache trên CDN Cloudflare 24h

        return response;
      } catch {
        return new Response('Error fetching logo proxy', {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Chuyển tiếp các request tĩnh còn lại cho Cloudflare Workers Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
