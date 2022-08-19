/**
 * Main portlet entrypoint for Liferay.
 *
 * @param params
 */
function main(params) {
  const node = document.getElementById(params.portletElementId)

  node.innerHTML =
    '<div class="plain">' +
    '<div>' +
    '<span class="tag">' +
    Liferay.Language.get('portlet-namespace') +
    ': ' +
    '</span>' +
    '<span class="value">' +
    params.portletNamespace +
    '</span>' +
    '</div>' +
    '<div>' +
    '<span class="tag">' +
    Liferay.Language.get('context-path') +
    ': ' +
    '</span>' +
    '<span class="value">' +
    params.contextPath +
    '</span>' +
    '</div>' +
    '<div>' +
    '<span class="tag">' +
    Liferay.Language.get('portlet-element-id') +
    ': ' +
    '</span>' +
    '<span class="value">' +
    params.portletElementId +
    '</span>' +
    '</div>' +
    '<div>' +
    '<span class="tag">' +
    Liferay.Language.get('configuration') +
    ': ' +
    '</span>' +
    '<span class="value">' +
    JSON.stringify(params.configuration, null, 2) +
    '</span>' +
    '</div>' +
    '</div>'
}

module.exports = main
