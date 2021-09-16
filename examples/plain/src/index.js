/**
 * This is the main entry point of the portlet.
 *
 * See https://tinyurl.com/js-ext-portlet-entry-point for the most recent 
 * information on the signature of this function.
 *
 * @param  {Object} params a hash with values of interest to the portlet
 * @return {void}
 */
function main(params) {
    const node = document.getElementById(params.portletElementId);

    node.innerHTML =
        '<div>' +
            '<span class="tag">' +
                'portlet-namespace:' +
            '</span>' +
            '<span class="value">' +
                params.portletNamespace +
            '</span>' +
        '</div>' +
        '<div>' +
            '<span class="tag">' +
                'context-path:' +
            '</span>' +
            '<span class="value">' +
                params.contextPath +
            '</span>' +
        '</div>' +
        '<div>' +
            '<span class="tag">' +
                'portlet-element-id:' +
            '</span>' +
            '<span class="value">' +
                params.portletElementId +
            '</span>' +
        '</div>' +
        '<div>' +
            '<span class="tag">' +
                'configuration:' +
            '</span>' +
            '<span class="value">' +
                JSON.stringify(params.configuration, null, 2) +
            '</span>' +
        '</div>'
    ;
}

module.exports = main;
