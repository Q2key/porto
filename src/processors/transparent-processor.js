/* eslint-disable no-undef */
class TransparentProcessor extends AudioWorkletProcessor {
  process (inputList, outputList, parameters) {
    const sourceLimit = Math.min(inputList.length, outputList.length);

    for (let inputNum = 0; inputNum < sourceLimit; inputNum++) {
      const input = inputList[inputNum];
      const output = outputList[inputNum];
      const channelCount = Math.min(input.length, output.length);

      // The input list and output list are each arrays of
      // Float32Array objects, each of which contains the
      // samples for one channel.

      for (let channel = 0; channel < channelCount; channel++) {
        const sampleCount = input[channel].length;
        for (let i = 0; i < sampleCount; i++) {
          const sample = input[channel][i];
          output[channel][i] = sample;
        }

        this.port.postMessage('Hello');
      }
    }

    // Return; let the system know we're still active
    // and ready to process audio.

    return true;
  }
}

registerProcessor('transparent-processor', TransparentProcessor);
