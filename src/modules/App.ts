import { WaveSurfer } from "./WaveSurfer";

export class App {
    #surfer: WaveSurfer | undefined;

    init = (): void => {
        this.initListeners();
        this.initErrorHandlers();
    }

    initListeners = (): void => {
        const input = document.querySelector<HTMLButtonElement>('#audio-input');
        const playButton = document.querySelector<HTMLButtonElement>('#play-button');
        const stopButton = document.querySelector<HTMLButtonElement>('#stop-button');
        const analyzeButton = document.querySelector<HTMLButtonElement>('#analyze-button');

        input?.addEventListener('change', this.onFileUpload);
        playButton?.addEventListener('click', this.onPlay);
        stopButton?.addEventListener('click', this.onStop);
    }

    initErrorHandlers = (): void => {
        window.onunhandledrejection = (e: PromiseRejectionEvent) => {
            this.reportErrorMessage(new Error(e.reason))
        }

        window.onerror = (
            event,
            source,
            lineno,
            colno,
            error) => {
            this.reportErrorMessage(error)
        }
    }

    onPlay = async (): Promise<void> => {
        try {
            await this.#surfer?.play();
        } catch (e) {
            reportError(e as Error);
        }
    }

    onStop = async (): Promise<void> => {
        try {
            await this.#surfer?.stop();
        } catch (e) {
            this.reportErrorMessage(e as Error);
        }
    }

    onFileLoad = async (e: ProgressEvent<FileReader>): Promise<void> => {
        try {
            this.toggleLoaderIndicator();
            const context = new AudioContext();
            const buff = e.target?.result as ArrayBuffer;
            
            const canvasEl = document.querySelector<HTMLCanvasElement>("#canvas"); 
            if (!canvasEl) {
                throw new Error("Threre's no html canvas");
            }

            this.#surfer = await WaveSurfer.MakeSurfer(context, buff, canvasEl);
        } catch (e) {
            this.reportErrorMessage(e as Error);
        } finally {
            this.toggleLoaderIndicator();
        }
    }
    onFileUpload = async (e: Event): Promise<void> => {
        const target = e.target as HTMLInputElement;
        if (!target.files?.length) {
            return;
        }

        const file = target.files[0];

        const reader = new FileReader();
        reader.onload = this.onFileLoad;
        reader.onerror = this.onFileError;
        reader.onabort = this.onFileError;
        reader.readAsArrayBuffer(file);
    }

    onFileError = (e: ProgressEvent<FileReader>): void => {
        reportError(new Error('Something happened in Porto'))
    }

    toggleLoaderIndicator = (): void => {
        document.querySelector<HTMLDivElement>('#loader')?.classList.toggle('hidden');
    }

    reportErrorMessage = (error?: Error): void => {
        const el = document.querySelector<HTMLDivElement>("#error-report");
        if (!el) return;
        el.innerText = error?.message ?? 'Unhandled Error'
    }
}