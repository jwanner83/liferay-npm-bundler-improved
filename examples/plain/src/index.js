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
            '<span class="tag" data-follow>' +
                'Portlet Namespace' + ':' +
            '</span>' +
            '<span class="value" data-follow>' +
                params.portletNamespace +
            '</span>' +
        '</div>' +
        '<div>' +
            '<span class="tag" data-follow>' +
                'Context Path' + ':' +
            '</span>' +
            '<span class="value" data-follow>' +
                params.contextPath +
            '</span>' +
        '</div>' +
        '<div>' +
            '<span class="tag" data-follow>' +
                'Portlet Element Id' + ':' +
            '</span>' +
            '<span class="value" data-follow>' +
                params.portletElementId +
            '</span>' +
        '</div>';
}

module.exports = main;
