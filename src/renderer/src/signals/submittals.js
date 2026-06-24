import { signal } from '@preact/signals-react';

export const submittalListSignal = signal([]);

export const prependSubmittal = (newSubmittal) => {
  submittalListSignal.value = [newSubmittal, ...submittalListSignal.value];
};
