import createImageUrlBuilder from '@sanity/image-url'
import { Image as SanityImage, type ImageProps } from 'next-sanity/image'
import { isSanityGif, stripUrlQuery } from './sanity-image-utils'

const imageBuilder = createImageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
})

export const urlForImage = (source: Parameters<(typeof imageBuilder)['image']>[0]) =>
    imageBuilder.image(source)

export function NextSanityImage(
    props: Omit<ImageProps, 'src' | 'alt'> & {
        src: {
            _key?: string | null
            _type?: 'image' | string
            asset: {
                _type: 'reference'
                _ref: string
            }
            crop: {
                top: number
                bottom: number
                left: number
                right: number
            } | null
            hotspot: {
                x: number
                y: number
                height: number
                width: number
            } | null
            alt?: string | undefined
        } | string
        alt?: string
    },
) {
    const { src, ...rest } = props
    const isGif = isSanityGif(src)

    const imageBuilder = typeof src === 'string' ? null : urlForImage(src)
    if (imageBuilder && !isGif && props.width) {
        imageBuilder.width(typeof props.width === 'string' ? parseInt(props.width, 10) : props.width)
    }
    if (imageBuilder && !isGif && props.height) {
        imageBuilder.height(
            typeof props.height === 'string' ? parseInt(props.height, 10) : props.height,
        )
    }
    let rawUrl = ''
    if (typeof src === 'string') {
        rawUrl = src
    } else if (imageBuilder) {
        rawUrl = imageBuilder.url()
    }
    const imageUrl = isGif ? stripUrlQuery(rawUrl) : rawUrl

    return (
        <SanityImage
            alt={''}
            {...rest}
            src={imageUrl}
            unoptimized={isGif || rest.unoptimized}
        />
    )
}