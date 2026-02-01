function getExtensionFromUrl(url: string) {
    const cleanUrl = url.split('?')[0]
    const match = cleanUrl.match(/\.([a-z0-9]+)$/i)
    return match ? match[1].toLowerCase() : null
}

export function stripUrlQuery(url: string) {
    return url.split('?')[0]
}

export function getSanityAssetExtension(source: unknown) {
    if (!source) return null

    if (typeof source === 'string') {
        return getExtensionFromUrl(source)
    }

    if (typeof source === 'object') {
        const asset = (source as { asset?: { _ref?: string; _id?: string; url?: string } }).asset
        const ref = asset?._ref || asset?._id
        if (ref) {
            const parts = ref.split('-')
            const last = parts[parts.length - 1]
            if (last && !/^\d+x\d+$/i.test(last)) {
                return last.toLowerCase()
            }
        }

        const url = asset?.url || (source as { url?: string }).url
        if (url) {
            return getExtensionFromUrl(url)
        }
    }

    return null
}

export function isSanityGif(source: unknown) {
    return getSanityAssetExtension(source) === 'gif'
}
