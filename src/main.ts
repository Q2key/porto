import {WaveSurfer} from "./WaveSurfer";

(async () => {
    const surfer = await WaveSurfer.MakeSurfer()

    function init(): void {
        initListeners();
        initErrorHandlers();
    }

    function initListeners(): void {
        const input = document.querySelector<HTMLButtonElement>('#audio-input');
        const playButton = document.querySelector<HTMLButtonElement>('#play-button');
        const stopButton = document.querySelector<HTMLButtonElement>('#stop-button');
        const analyzeButton = document.querySelector<HTMLButtonElement>('#analyze-button');

        input?.addEventListener('change', onFileUpload);
        playButton?.addEventListener('click', onPlay);
        stopButton?.addEventListener('click', onStop);
    }

    function initErrorHandlers(): void {
        window.onunhandledrejection = function (e: PromiseRejectionEvent) {
            reportError(new Error(e.reason))
        }

        window.onerror = function (
            event,
            source,
            lineno,
            colno,
            error) {
            reportError(error)
        }
    }

    async function onPlay(): Promise<void> {
        try {
            await surfer.play();
        } catch (e) {
            reportError(e);
        }
    }

    async function onStop(): Promise<void> {
        try {
            await surfer.stop();
        } catch (e) {
            reportError(e);
        }
    }

    function onFileLoad(e: ProgressEvent<FileReader>): void {
        toggleLoaderIndicator();

        const buff = e.target?.result as ArrayBuffer;
        if (!buff) {
            return;
        }

        surfer.prepare(buff)
            .catch(reportError)
            .finally(toggleLoaderIndicator)
    }

    async function onFileUpload(e: Event): Promise<void> {
        const target = e.target as HTMLInputElement;
        if (!target.files?.length) {
            return;
        }

        const [file] = target.files;
        const reader = new FileReader();
        reader.onload = onFileLoad;
        reader.onerror = onFileError;
        reader.onabort = onFileError;
        reader.readAsArrayBuffer(file);
    }

    function onFileError(e: ProgressEvent<FileReader>): void {
        reportError(new Error('Something happened in Porto'))
    }

    function toggleLoaderIndicator(): void {
        document.querySelector<HTMLDivElement>('#loader')?.classList.toggle('hidden');
    }

    function reportError(error?: Error): void {
        const el = document.querySelector<HTMLDivElement>("#error-report");
        if (!el) return;
        el.innerText = error?.message ?? 'Unhandled Error'
    }

    await init();
})();