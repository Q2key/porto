import {WaveSurfer} from "./WaveSurfer";

(async () => {
    const surfer = await WaveSurfer.MakeSurfer()

    function init(): void {
        initInput();
    }

    function initInput(): void {
        const input = document.querySelector('#audio-input');
        const playButton = document.querySelector('#play-button');
        const stopButton = document.querySelector('#stop-button');
        const analyzeButton = document.querySelector('#analyze-button');

        input?.addEventListener('change', onFileUpload);
        playButton?.addEventListener('click', onPlay);
        stopButton?.addEventListener('click', onStop);
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
        reader.onload = (): void => {
            toggleLoaderVisibility();

            const buff = reader.result as ArrayBuffer;
            if (buff) {
                surfer.prepare(buff).then(toggleLoaderVisibility);
            } else {
                console.error('error');
            }
        };

        reader.readAsArrayBuffer(file);
    }

    function toggleLoaderVisibility(): void {
        document.querySelector('#loader')?.classList.toggle('hidden');
    }

    await init();
})();