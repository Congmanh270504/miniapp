// Utility function to get audio duration from URL
export async function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(0);
      return;
    }

    const audio = new Audio();
    let resolved = false;
    
    // Set crossorigin to handle CORS - try different values
    audio.crossOrigin = "anonymous";
    
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        audio.src = '';
        audio.load();
      }
    };

    const handleLoadedMetadata = () => {
      if (resolved) return;
      
      console.log('Audio duration loaded:', audio.duration, 'for URL:', url);
      
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        resolved = true;
        clearTimeout(timeout);
        resolve(audio.duration);
      } else {
        console.warn('Invalid duration for audio:', url, audio.duration);
        resolved = true;
        clearTimeout(timeout);
        resolve(0);
      }
      cleanup();
    };
    
    const handleError = (e: any) => {
      if (resolved) return;
      console.error('Error loading audio metadata:', url, e);
      resolved = true;
      clearTimeout(timeout);
      resolve(0);
      cleanup();
    };

    // Set timeout to avoid hanging
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.warn('Audio loading timeout for:', url);
        resolved = true;
        resolve(0);
        cleanup();
      }
    }, 15000); // 15 seconds timeout

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('abort', handleError);
    
    // Try to preload metadata
    audio.preload = 'metadata';
    audio.src = url;
    
    // Force load metadata
    try {
      audio.load();
    } catch (error) {
      console.error('Error calling audio.load():', error);
      handleError(error);
    }
  });
}

// Format duration to MM:SS format
export function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
