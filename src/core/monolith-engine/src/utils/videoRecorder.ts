/**
 * High-performance 60fps Video & Web Audio recorder for ArtificialCraft // Monolith.
 * Records the WebGL canvas stream and procedural synthesizer audio into a high-bitrate .webm container.
 */

export interface ExportProgress {
  isRecording: boolean;
  currentSecond: number;
  totalSeconds: number;
  progressPercent: number;
}

export class VideoExporter {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isExporting: boolean = false;

  public async exportTimelineVideo(
    canvas: HTMLCanvasElement,
    audioTrack: MediaStreamTrack | null,
    totalDurationSeconds: number = 30,
    onProgress: (prog: ExportProgress) => void,
    onFrameStep: (timeSec: number) => void
  ): Promise<Blob> {
    if (this.isExporting) {
      throw new Error('Export already in progress');
    }
    this.isExporting = true;
    this.recordedChunks = [];

    // Capture 60fps video stream from WebGL canvas
    const videoStream = canvas.captureStream(60);
    const videoTrack = videoStream.getVideoTracks()[0];

    const tracks: MediaStreamTrack[] = [videoTrack];
    if (audioTrack) {
      tracks.push(audioTrack);
    }

    const combinedStream = new MediaStream(tracks);

    // Pick best supported MIME type
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    let selectedMime = 'video/webm';
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    return new Promise<Blob>((resolve, reject) => {
      try {
        this.mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType: selectedMime,
          videoBitsPerSecond: 16000000, // 16 Mbps for crisp high-tech detail
        });

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };

        this.mediaRecorder.onerror = (err) => {
          this.isExporting = false;
          reject(err);
        };

        this.mediaRecorder.onstop = () => {
          this.isExporting = false;
          const blob = new Blob(this.recordedChunks, { type: selectedMime });
          this.triggerDownload(blob, `ArtificialCraft_Monolith_60fps_${Date.now()}.webm`);
          resolve(blob);
        };

        // Start recording
        this.mediaRecorder.start(500); // 500ms chunk slices

        // Deterministic recording timer loop
        const startTime = performance.now();
        const durationMs = totalDurationSeconds * 1000;

        const recordLoop = () => {
          if (!this.isExporting || !this.mediaRecorder) return;
          const elapsed = performance.now() - startTime;
          const currentSec = Math.min(totalDurationSeconds, elapsed / 1000);

          onFrameStep(currentSec);

          onProgress({
            isRecording: true,
            currentSecond: currentSec,
            totalSeconds: totalDurationSeconds,
            progressPercent: Math.min(100, Math.floor((currentSec / totalDurationSeconds) * 100)),
          });

          if (elapsed >= durationMs) {
            this.mediaRecorder.stop();
          } else {
            requestAnimationFrame(recordLoop);
          }
        };

        requestAnimationFrame(recordLoop);
      } catch (err) {
        this.isExporting = false;
        reject(err);
      }
    });
  }

  public cancelExport() {
    if (this.mediaRecorder && this.isExporting) {
      this.isExporting = false;
      this.mediaRecorder.stop();
    }
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }
}
