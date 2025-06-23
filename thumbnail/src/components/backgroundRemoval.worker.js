import { removeBackground } from '@imgly/background-removal';

self.onmessage = async (e) => {
  const { imageUrl } = e.data;
  try {
    const result = await removeBackground(imageUrl, {
      debug: false,
      proxyToWorker: false, // Already in a worker!
      model: 'isnet_fp16',
      output: {
        format: 'image/png',
        quality: 0.6,
      },
    });
    // result is a Blob
    self.postMessage({ success: true, blob: result });
  } catch (error) {
    let message = 'Unknown error';
    if (error && typeof error === 'object' && 'message' in error && typeof (error.message) === 'string') {
      message = error.message;
    }
    self.postMessage({ success: false, error: message });
  }
}; 