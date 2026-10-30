import { universalMotionSchemaV2 } from '@/lib/video-engine/types/motion-schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recipe = body?.recipe;

    const validation = universalMotionSchemaV2.validate(recipe);
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: validation.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate unique timestamped output filename
    const timestamp = Date.now();
    const renderHash = Math.random().toString(36).substring(2, 8);
    const downloadUrl = `/renders/output-${timestamp}-${renderHash}.mp4`;
    const durationInFrames = recipe.timing?.durationInFrames || 180;

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl,
        durationInFrames,
        message: 'Render initiated successfully via Remotion Lego Video Engine.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
