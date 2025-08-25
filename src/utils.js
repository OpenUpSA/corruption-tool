'use strict';


/** * Constructs the Kobo proxy endpoint URL based on the current location.
 * @param {Location} location - The current location object.
 * @param {string} KOBO_PROXY - The Kobo proxy environment variable.
 * @param {boolean} is_local - Whether the environment is local.
 * @returns {string} The Kobo endpoint URL.
 * @example
 * // Assuming the current location is https://example.com
 * const endpoint = getKoboEndpoint(window.location);
 * console.log(endpoint); // Outputs: "https://example.com/.netlify/functions/proxy"
 */
function getKoboEndpoint(location, KOBO_PROXY, isLocal = false) {
    // If KOBO_PROXY is set and not in a local environment, return it directly
    if (KOBO_PROXY && isLocal) {
        return KOBO_PROXY;
    }
    // get bare domain from location
    const domain = location.hostname;
    // construct Kobo endpoint URL
    const scheme = location.protocol === 'https:' ? 'https' : 'http';
    return `${scheme}://${domain}/.netlify/functions/proxy`;
}

module.exports = {
    getKoboEndpoint
};