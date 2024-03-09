class TransparentProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputList, outputList, parameters) {
        const sourceLimit = Math.min(inputList.length, outputList.length);

        for (let inputNum = 0; inputNum < sourceLimit; inputNum++) {
            let input = inputList[inputNum];
            let output = outputList[inputNum];
            let channelCount = Math.min(input.length, output.length);

            // The input list and output list are each arrays of
            // Float32Array objects, each of which contains the
            // samples for one channel.

            for (let channel = 0; channel < channelCount; channel++) {
                let sampleCount = input[channel].length;
                for (let i = 0; i < sampleCount; i++) {
                    let sample = input[channel][i];
                    output[channel][i] = sample;
                }
            }
        }

        // Return; let the system know we're still active
        // and ready to process audio.

        return true;
    }

}
  
registerProcessor('transparent-processor', TransparentProcessor);