enum PROCESSORS {
    TRANSPARENT_PROCESSOR = 'transparent-processor',
    WHITE_NOISE_PROCESSOR = 'white-noise-processor',
}

export class WaveSurfer {
    private readonly audioContext: AudioContext;
    private readonly audioWorkletNode: AudioWorkletNode;
    private readonly audioBufferSourceNode: AudioBufferSourceNode;

    constructor(audioContext: AudioContext, audioWorklet: AudioWorkletNode, audioBufferSourceNode) {
        this.audioContext = audioContext;
        this.audioWorkletNode = audioWorklet;
        this.audioBufferSourceNode = audioBufferSourceNode;
    }

    public static async MakeSurfer(ctx: AudioContext): Promise<WaveSurfer> {
        await ctx.audioWorklet.addModule("src/processors/transparent-processor.js")
        const audioWorkletNode = new AudioWorkletNode(ctx, PROCESSORS.TRANSPARENT_PROCESSOR);
        const audioBufferSourceNode = ctx.createBufferSource();
        return new WaveSurfer(ctx, audioWorkletNode, audioBufferSourceNode);
    }

    public async play(): Promise<void> {
        await this.audioContext.resume();
        this.audioBufferSourceNode.connect(this.audioWorkletNode).connect(this.audioContext.destination);
    }

    public async stop(): Promise<void> {
        await this.audioContext.suspend();
        this.audioBufferSourceNode.disconnect();
    }

    async prepare(arrayBuffer: ArrayBuffer) {
        const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        if (buffer?.length) {
            this.audioBufferSourceNode.buffer = buffer;
            this.audioBufferSourceNode.start();
        }
    }
}