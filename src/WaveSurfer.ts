export class WaveSurfer {
    #audioContext: AudioContext | undefined;
    #audioWorkletNode: AudioWorkletNode | undefined;
    #connected: boolean = false;

    constructor() {
        if (typeof window.AudioContext !== 'function') {
            console.error('AudioContext is missing');
            return;
        }

        this.#audioContext = new AudioContext();
    }

    public async initialize(): Promise<void> {
        if (!this.#audioContext) {
            return;
        }

        await this.#audioContext.audioWorklet.addModule("src/processors/white-noise-processor.js");
        this.#audioWorkletNode = new AudioWorkletNode(
            this.#audioContext,
          "white-noise-processor"
        );
    }

    public async play(): Promise<void> {
        if (!this.#audioContext) {
            return;
        }

        if (!this.#audioWorkletNode) {
            return;
        }

        if (this.#connected) {
            return;
        }

        this.#audioWorkletNode.connect(this.#audioContext.destination);
        this.#connected = true;
    }

    public async stop(): Promise<void> {
        if (!this.#audioContext) {
            return;
        }

        if (!this.#audioWorkletNode) {
            return;
        }

        if (!this.#connected) {
            return;
        }

        this.#audioWorkletNode.disconnect(this.#audioContext.destination);
        this.#connected = false;
    }

    public static MakeSurfer(): WaveSurfer {
        return new WaveSurfer();
    }
}