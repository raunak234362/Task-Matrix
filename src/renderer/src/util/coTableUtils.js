/* eslint-disable no-unused-vars */
/**
 * Utility functions for opening CoListTable in a new window/tab
 */

/**
 * Opens CoListTable in a new tab/window
 * @param {Object} selectedCO - The change order data to display
 * @param {Object} options - Optional configuration
 * @param {boolean} options.newWindow - Open in new window instead of tab (default: false)
 * @param {string} options.windowFeatures - Window features for new window (default: 'width=1200,height=800,scrollbars=yes,resizable=yes')
 */
export const openCoListTableInNewTab = (selectedCO, options = {}) => {
  if (!selectedCO) {
    console.error('No selectedCO data provided');
    return;
  }

  const { newWindow = false, windowFeatures = 'width=1200,height=800,scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no' } = options;

  try {
    // Encode the CO data to safely pass it via URL
    const encodedData = encodeURIComponent(JSON.stringify(selectedCO));
    
    // Build the URL with the data as a query parameter
    const baseUrl = window.location.origin;
    const targetUrl = `${baseUrl}/co-table?coData=${encodedData}`;

    if (newWindow) {
      // Open in new window with specific features
      const newWindowRef = window.open(targetUrl, '_blank', windowFeatures);
      
      if (!newWindowRef) {
        // Fallback if popup was blocked
        console.warn('Popup blocked, opening in new tab instead');
        window.open(targetUrl, '_blank');
      }
      
      return newWindowRef;
    } else {
      // Open in new tab
      const newTab = window.open(targetUrl, '_blank');
      
      if (!newTab) {
        console.error('Could not open new tab - popup might be blocked');
        return null;
      }
      
      return newTab;
    }
  } catch (error) {
    console.error('Error opening CoListTable:', error);
    return null;
  }
};

/**
 * Opens CoListTable in a new tab using React Router navigation state
 * This method is useful when you want to use React Router's navigation
 * @param {Function} navigate - React Router's navigate function
 * @param {Object} selectedCO - The change order data to display
 */
export const navigateToCoListTable = (navigate, selectedCO) => {
  if (!selectedCO) {
    console.error('No selectedCO data provided');
    return;
  }

  if (!navigate) {
    console.error('Navigate function is required');
    return;
  }

  try {
    navigate('/co-table', {
      state: { selectedCO },
      replace: false
    });
  } catch (error) {
    console.error('Error navigating to CoListTable:', error);
  }
};

/**
 * Opens CoListTable in a new tab with a custom URL (useful for sharing or bookmarking)
 * @param {Object} selectedCO - The change order data to display
 * @param {string} customPath - Custom path to use (optional, defaults to '/co-table')
 */
export const openCoListTableWithCustomUrl = (selectedCO, customPath = '/co-table') => {
  if (!selectedCO) {
    console.error('No selectedCO data provided');
    return;
  }

  try {
    // Create a more readable URL structure
    const coId = selectedCO.id || 'unknown';
    const coNumber = selectedCO.changeOrder || 'no-number';
    
    // Encode the full data
    const encodedData = encodeURIComponent(JSON.stringify(selectedCO));
    
    // Build a clean URL
    const baseUrl = window.location.origin;
    const targetUrl = `${baseUrl}${customPath}?id=${coId}&co=${coNumber}&coData=${encodedData}`;

    return window.open(targetUrl, '_blank');
  } catch (error) {
    console.error('Error opening CoListTable with custom URL:', error);
    return null;
  }
};

/**
 * Utility to check if popup blockers might prevent opening new windows
 * @returns {boolean} - Returns true if popups are likely allowed
 */
export const checkPopupSupport = () => {
  try {
    const popup = window.open('', '_blank', 'width=1,height=1,left=-1000,top=-1000');
    if (popup) {
      popup.close();
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Get a shareable URL for the CoListTable
 * @param {Object} selectedCO - The change order data
 * @returns {string} - The shareable URL
 */
export const getShareableCoListTableUrl = (selectedCO) => {
  if (!selectedCO) {
    return null;
  }

  try {
    const encodedData = encodeURIComponent(JSON.stringify(selectedCO));
    const baseUrl = window.location.origin;
    return `${baseUrl}/co-table?coData=${encodedData}`;
  } catch (error) {
    console.error('Error generating shareable URL:', error);
    return null;
  }
};
