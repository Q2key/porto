//Inspired by https://github.com/mdn/webaudio-examples/blob/main/audio-analyser/index.html
enum PROCESSORS {
    TRANSPARENT_PROCESSOR = 'transparent-processor',
    WHITE_NOISE_PROCESSOR = 'white-noise-processor',
}

export class WaveSurfer {
    private readonly ctx: AudioContext;
    private readonly workletNode: AudioWorkletNode;
    private readonly audioBuffer: AudioBuffer;
    private readonly analyserNode: AnalyserNode;

    private sourceNode: AudioBufferSourceNode;

    constructor(
        audioContext: AudioContext,
        audioWorklet: AudioWorkletNode,
        audioBufferSourceNode: AudioBufferSourceNode,
        analyserNde: AnalyserNode,
        audioBuffer: AudioBuffer,
        canvasElt: HTMLCanvasElement,
    ) {
        this.ctx = audioContext;
        this.workletNode = audioWorklet;
        this.sourceNode = audioBufferSourceNode;
        this.analyserNode = analyserNde;
        this.audioBuffer = audioBuffer;
        this.workletNode.port.onmessage = (a: MessageEvent) => {
            const amplitudeArray = new Uint8Array(
                this.analyserNode.frequencyBinCount
            );

            // Get the time domain data for this sample
            this.analyserNode.getByteTimeDomainData(amplitudeArray);

            // Draw the display when the audio is playing
            if (this.ctx.state === "running") {
                // Draw the time domain in the canvas
                requestAnimationFrame(() => {
                    // Get the canvas 2d context
                    const canvasContext = canvasElt.getContext("2d");
                    
                    if (!canvasContext) {
                        return;
                    }

                    // Clear the canvas
                    canvasContext.clearRect(
                        0,
                        0,
                        canvasElt.width,
                        canvasElt.height
                    );

                    // Draw the amplitude inside the canvas
                    for (let i = 0; i < amplitudeArray.length; i++) {
                        const value = amplitudeArray[i] / 256;
                        const y = canvasElt.height - canvasElt.height * value;
                        canvasContext.fillStyle = "black";
                        canvasContext.fillRect(i, y, 1, 1);
                    }
                });
            }

        }
    }

    public async play(): Promise<void> {
        this.sourceNode = new AudioBufferSourceNode(this.ctx, {
            buffer: this.audioBuffer
        })

        this.sourceNode
            .connect(this.workletNode)
            .connect(this.ctx.destination);

        this.sourceNode.connect(this.analyserNode);
        this.sourceNode.start(0);
    }

    public async stop(): Promise<void> {
        this.sourceNode.stop(0);
    }

    public static async MakeSurfer(ctx: AudioContext, arrayBuffer: ArrayBuffer | undefined, canvasElt: HTMLCanvasElement): Promise<WaveSurfer> {
        if (!arrayBuffer?.byteLength) {
            throw Error('Buffer is empty')
        }

        await ctx.audioWorklet.addModule("src/processors/transparent-processor.js")

        const audioWorkletNode = new AudioWorkletNode(ctx, PROCESSORS.TRANSPARENT_PROCESSOR);
        const audioBufferSourceNode = ctx.createBufferSource();
        const buffer = await ctx.decodeAudioData(arrayBuffer);
        const analyserNode = new AnalyserNode(ctx);

        return new WaveSurfer(ctx,
            audioWorkletNode,
            audioBufferSourceNode,
            analyserNode,
            buffer,
            canvasElt,
        );
    }
}