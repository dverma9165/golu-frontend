/**
 * Generates a displayable image URL from a Google Drive ID.
 * Handles different URL prefixes and appends size parameters for better resolution.
 * 
 * @param {string} googleDriveId - The Google Drive File ID
 * @param {number} size - Requested size (width/height/quality factor depending on prefix)
 * @returns {string|null} - The formatted image URL or null
 */
export const getDisplayableImageUrl = (googleDriveId, size = 1000) => {
    if (!googleDriveId) return null;

    const prefix = import.meta.env.VITE_DRIVE_URL_PREFIX || 'https://drive.google.com/thumbnail?id=';

    // If the prefix is the newer lh3.googleusercontent.com/d/ format
    if (prefix.includes('lh3.googleusercontent.com')) {
        // lh3 supports =sX where X is the size
        return `${prefix}${googleDriveId}=s${size}`;
    }

    // For the standard drive.google.com/thumbnail?id= format
    // It supports &sz=wX where X is the width
    return `${prefix}${googleDriveId}&sz=w${size}`;
};
