Liferay.Loader.define('plain-old@1.0.0/index', ['module', 'exports', 'require'], function (module, exports, require) {
    var define = undefined;
    var global = window;
    {
        import Follow from 'follow-js';

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
            const follow = new Follow();

            setTimeout(() => {
                console.log('initiate follow.js');
                follow.initiate();

                setTimeout(() => {
                    console.log('destroyed follow.js');
                    follow.destroy();
                }, 5000);
            }, 5000);

            var node = document.getElementById(params.portletElementId);

            node.innerHTML = '<div>' + '<span class="tag" data-follow>' + 'Portlet Namespace' + ':' + '</span>' + '<span class="value">' + params.portletNamespace + '</span>' + '</div>' + '<div>' + '<span class="tag">' + 'Context Path' + ':' + '</span>' + '<span class="value">' + params.contextPath + '</span>' + '</div>' + '<div>' + '<span class="tag">' + 'Portlet Element Id' + ':' + '</span>' + '<span class="value">' + params.portletElementId + '</span>' + '</div>';
        }

        module.exports = main;
    }
});
//# sourceMappingURL=index.js.map