import { signal, computed } from '@preact/signals-react';

// Currently viewed estimation details
export const estimationSignal = signal(null);

// List of estimations for tables/views
export const estimationsSignal = signal([]);

// Line item groups for the active estimation
export const lineItemGroupsSignal = signal([]);

// Which line item group is expanded (id or null)
export const expandedLineItemGroupSignal = signal(null);

// Items within the expanded group (derived)
export const expandedGroupItemsSignal = computed(() => {
  const groups = lineItemGroupsSignal.value || [];
  const id = expandedLineItemGroupSignal.value;
  if (!id) return [];
  const g = groups.find((gr) => gr.id === id);
  return g?.lineItems || [];
});
