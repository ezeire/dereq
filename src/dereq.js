/**
 * Takes the host, port, and protocol and returns the formatted URL.
 *
 * @param {string} host - the host name or IP address
 * @param {number | string} port - the port number (optional)
 * @param {string} protocol - the URL protocol (e.g. http, https)
 * @return {string} the formatted URL
 */
function formatURL(host, port, protocol) {
    return `${protocol}://${host}${port ? `:${port}` : ''}`;
}

/**
 * Transforms the routes object into a new object with modified URLs based on the provided URL and group.
 *
 * @param {string} url - The base URL for the routes
 * @param {string} group - The group name for the routes
 * @param {object} routes - The routes object to be transformed
 * @return {object} The transformed routes object with modified URLs
 */
function transformRoutes(url, group, routes) {
    return Object.keys(routes).reduce((acc, key) => {
        const value = routes[key];

        if(typeof value === 'string') {
            acc[key] = new URL(`${group}/${value}`, url).href;
        } else if(typeof value === 'function') {
            acc[key] = (...params) => new URL(`${group}/${value(...params)}`, url).href;
        } else if(typeof value === 'object') {
            acc[key] = transformRoutes(url, group, value);
        }

        return acc;
    }, {});
}

/**
 * Function to create and manage API route groups.
 *
 * @param {string} host - the host of the API
 * @param {string | number} [port=""] - the port of the API, defaults to an empty string
 * @param {string} [protocol="https"] - the protocol of the API, defaults to "https"
 * @return {object} an object containing the group function for creating route groups
 */
export default function dereq(host, port = '', protocol = 'https') {
    const baseURL = formatURL(host, port, protocol);
    if(!URL.canParse(baseURL)) {
        throw new TypeError('Invalid URL');
    }

    const requests = {};
    return {
        /**
         * Method to group routes under a common name.
         *
         * @param {string} name - the name of the group
         * @param {object} routes - the routes to be grouped
         * @return {object} the current object instance
         */
        group(name, routes) {
            if(name.length === 0) {
                throw new TypeError('Group name cannot be an empty string');
            }

            requests[name] = transformRoutes(baseURL, name, routes);
            return this;
        },
        /**
         * Method to create empty routes.
         *
         * @param {object} routes - the routes to be created
         * @return {object} the current object instance
         */
        root(routes) {
            Object.assign(requests, transformRoutes(baseURL, '', routes));
            return requests;
        },
        /**
         * Method to signify the end of a process.
         *
         * @return {Object} The requests object.
         */
        end() {
            return requests;
        }
    };
}