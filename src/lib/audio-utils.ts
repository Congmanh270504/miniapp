// Utility function to get audio duration from URL
export async function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(0);
      return;
    }

    const audio = new Audio();
    
    // Set crossorigin to handle CORS
    audio.crossOrigin = "anonymous";
    
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        resolve(audio.duration);
      } else {
        resolve(0);
      }
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Error loading audio:', url, e);
      resolve(0); // Return 0 if error
    });

    // Set timeout to avoid hanging
    const timeout = setTimeout(() => {
      resolve(0);
    }, 10000); // 10 seconds timeout

    audio.addEventListener('loadedmetadata', () => {
      clearTimeout(timeout);
    });
    
    audio.src = url;
    audio.load(); // Force load
  });
}

// Format duration to MM:SS format
export function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
