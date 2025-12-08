import { signal } from '@preact/signals-react';

export const rfiListSignal = signal([]);

export const prependRFI = (newRFI) => {
  rfiListSignal.value = [newRFI, ...rfiListSignal.value];
};
