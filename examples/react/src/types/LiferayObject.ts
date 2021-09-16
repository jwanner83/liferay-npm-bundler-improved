/**
 * The type for the liferay object
 */
type LiferayObject = {
    Language: {
        get: (key: string, params: Array<string> | string = []) => string
    }
}

export default LiferayObject