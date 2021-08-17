// the package json of the portlet
const pack = require(process.cwd() + '/package.json')

export default class PackageHandler {
    public static readonly pack = pack
}