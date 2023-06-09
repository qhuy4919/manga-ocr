import { useState, useEffect } from 'react'

type ImageContainerProps = {
    dataSrc: any,
    imgAlt: any,
    viewContainerIndex: any,
    visibilityIndex: any,
    isMagEnabled: any,
}

export const ImageContainer = ({
    dataSrc,
    imgAlt,
    viewContainerIndex,
    visibilityIndex,
    isMagEnabled,
}: ImageContainerProps) => {
    const [src, setSrc] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [clist, setClist] = useState('image')

    useEffect(() => {
        if (Math.abs(viewContainerIndex - visibilityIndex) <= 2) setSrc(dataSrc)
    }, [viewContainerIndex, dataSrc, visibilityIndex])

    useEffect(() => {
        isMagEnabled ? setClist('image image-enlarged') : setClist('image')
    }, [isMagEnabled])

    return (
        <div className="img-container">
            {!loaded && (
                <div className="img-overlay">
                    <div className="loader-inner ball-scale">
                        <div></div>
                    </div>
                </div>
            )}
            <img
                src={src}
                alt={imgAlt}
                className={clist}
                onLoad={() => setLoaded(true)}
            />
        </div>
    )
}

