/**
 * Detect the best supported audio MIME type for MediaRecorder.
 * Tries formats in order of preference.
 */
function getSupportedMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) {
      console.log("[Audio] Using MIME type:", type);
      return type;
    }
  }
  console.warn("[Audio] No preferred MIME type supported, using browser default");
  return ""; // Let the browser pick
}

// Store chunks globally per recorder instance
const recorderChunks = new WeakMap();
// Store the mimeType used per recorder so the blob can match
const recorderMimeTypes = new WeakMap();

/**
 * Record audio from microphone
 * @param {function} onDataAvailable - Callback for audio chunks (optional)
 * @returns {Promise<MediaRecorder>}
 */
export async function startRecording(onDataAvailable) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    const mimeType = getSupportedMimeType();
    const options = mimeType ? { mimeType } : {};
    const mediaRecorder = new MediaRecorder(stream, options);

    // Track which mimeType this recorder is using
    recorderMimeTypes.set(mediaRecorder, mediaRecorder.mimeType || mimeType || "audio/webm");
    // Initialize chunks array for this recorder
    const chunks = [];
    recorderChunks.set(mediaRecorder, chunks);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
        console.log(
          "[Audio] Chunk received:",
          event.data.size,
          "bytes, total chunks:",
          chunks.length
        );
        if (onDataAvailable) {
          onDataAvailable(event.data);
        }
      }
    };

    // Request data every 250ms for better chunk collection
    mediaRecorder.start(250);
    console.log("[Audio] Recording started");

    return mediaRecorder;
  } catch (error) {
    console.error("Error starting recording:", error);
    throw error;
  }
}

/**
 * Stop recording and get the complete audio blob
 * @param {MediaRecorder} recorder
 * @returns {Promise<Blob>}
 */
export function stopRecording(recorder) {
  return new Promise((resolve) => {
    // Get the chunks array for this recorder
    const chunks = recorderChunks.get(recorder) || [];

    recorder.onstop = () => {
      console.log("[Audio] Recording stopped, chunks:", chunks.length);

      // Create blob using the actual recorded mimeType
      const actualMimeType = recorderMimeTypes.get(recorder) || "audio/webm";
      const blob = new Blob(chunks, { type: actualMimeType });
      console.log("[Audio] Final blob:", blob.size, "bytes, type:", actualMimeType);

      // Cleanup
      recorderChunks.delete(recorder);
      recorderMimeTypes.delete(recorder);
      recorder.stream.getTracks().forEach((track) => track.stop());

      resolve(blob);
    };

    // Request any remaining data before stopping
    recorder.requestData();
    recorder.stop();
  });
}
