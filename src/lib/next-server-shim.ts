/**
 * ARTIFICIAL CRAFT - Drop-in NextRequest / NextResponse shim for Vite/Edge environments
 */

export class NextRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
  }
}

export class NextResponse extends Response {
  static json<T = any>(body: T, init?: ResponseInit): Response {
    return new Response(JSON.stringify(body), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }
}
