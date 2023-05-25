import { useState, useLayoutEffect } from 'react'
import { ImageContainer } from '../image-container'
// import '../styles/readercontainer.scss'

export type ContainerProps = {
    data: string[],
    itemInfo?: any,
    itemType?: any,
    visibilityIndex: any,
    isMagEnabled: any,
    containFirstImg: any,
    setContainersLen: any,
    showFirstContainer: any,
    onClick: any,
}

export const Container = ({
    data,
    itemInfo,
    itemType,
    visibilityIndex,
    isMagEnabled,
    containFirstImg,
    setContainersLen,
    showFirstContainer,
    onClick,
}: ContainerProps) => {
    const [viewDataList, setViewDataList] = useState(data);

    // useLayoutEffect(() => {
    //     // let tempViewList = []
    //     // const { common_width: commonWidth, img_list: imgList } = imgData

    //     // let toSkip = false
    //     // for (let i = 0; i < imgList.length; i++) {
    //     //     const img = imgList[i]
    //     //     if (itemType === 'chapter' && containFirstImg && i === 0) {
    //     //         tempViewList.push([img])
    //     //         continue
    //     //     }
    //     //     if (img.width / commonWidth <= 1.4) {
    //     //         if (!toSkip) {
    //     //             let imgObjList = [img]
    //     //             const nextImg = imgList[i + 1]
    //     //             if (nextImg && nextImg.width / commonWidth <= 1.4) {
    //     //                 imgObjList.push(nextImg)
    //     //                 toSkip = true
    //     //             }
    //     //             tempViewList.push(imgObjList)
    //     //         } else toSkip = false
    //     //     } else tempViewList.push([img])
    //     // }

    //     setViewDataList(tempViewList)
    //     setContainersLen(tempViewList.length)
    //     showFirstContainer()
    // }, [containFirstImg, itemInfo]) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="container" onClick={onClick}>
            {viewDataList.map((viewData) => (
                <div
                    className={
                        viewDataList.indexOf(viewData) === visibilityIndex
                            ? 'view-container visible-container'
                            : 'view-container'
                    }
                >
                    <ImageContainer
                            key={`${viewData}`}
                            dataSrc={viewData}
                            imgAlt={`${viewData}`}
                            viewContainerIndex={viewDataList.indexOf(viewData)}
                            visibilityIndex={visibilityIndex}
                            isMagEnabled={isMagEnabled}
                        />
                </div>
            ))}
        </div>
    )
}
