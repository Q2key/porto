import { WaveSurfer } from "./WaveSurfer";

(async () => {
  const surfer = WaveSurfer.MakeSurfer();
  await surfer.initialize();

  let buffer: ArrayBuffer | undefined;
  let file: File | undefined;

  function init(): void {
    console.log('init');
    initInput();
  }

  function initInput(): void {
    const input = document.getElementById('audio-input');
    const playButton = document.getElementById('play-button');
    const stopButton = document.getElementById('stop-button');
    const analyzeButton = document.getElementById('analyze-button');

    if (!input) {
      console.error('audio input was not found');
      return;
    }

    if (!analyzeButton) {
      console.error('analyze button was not found');
      return;
    }

    if (!playButton) {
      console.error('play button was not found');
      return;
    }

    if (!stopButton) {
      console.error('stop button was not found');
      return;
    }

    input.addEventListener('change', onFileUpload);
    playButton.addEventListener('click', onPlay);
    stopButton.addEventListener('click', onStop);
  }

  async function onPlay(): Promise<void> {
    await surfer.play();
  }

  async function onStop(): Promise<void> {
    await surfer.stop();
  }

  async function onFileUpload(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      console.error("file doesn't contain any file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (): Promise<void> => {
      toggleLoaderVisibility();

      const buff = reader.result as ArrayBuffer;
      if (buff) {
        console.log('buff was loaded!');
        buffer = buff;
        toggleLoaderVisibility();
        Promise.resolve();
      } else {
        console.error('error');
        Promise.reject('error');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  function toggleLoaderVisibility(): void {
    document.getElementById('loader')?.classList.toggle('hidden');
  }


  init();
})();