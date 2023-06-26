import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../middleware/store';
import { BottomMenu } from './component'
import { Sidebar } from '../../component';
import { imageDataCollection } from './component/image-collection';
import { toast, ToastContainer } from 'react-toastify';
import { mangaAPI } from '../../access';
import { TextBox } from './component';
import { cropImageViaCoordinate } from '../../util'
import { LeftCircleOutlined, RightCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import "cropperjs/dist/cropper.css";
import "react-toastify/dist/ReactToastify.css";
import Cropper from 'cropperjs';
import './style.scss';



export const ItemReader = () => {
    const imageArray = useSelector((state: RootState) => state.manga.file);
    const MODE = useSelector((state: RootState) => state.manga.mode);

    const [showMenus, setShowMenus] = useState(false);
    const [convertedText, setConvertedText] = useState<string>('');
    const [allTextBoxes, setAllTextBoxes] = useState<any>([]);
    const [allTextBoxesData, setAllTextBoxesData] = useState<any>([]);
    const [pageImage, setPageImage] = useState<string>('');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [ratio, setRatio] = useState<number>(1);
    const [offsetList, setOffsetList] = useState<Record<string, any>>({});
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isProcessTextBox, setProcessTextBox] = useState<boolean>(false);

    useEffect(() => {
        imageDataCollection.initiateAndSaveAllNewImagesData(imageArray);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageArray]);

    useEffect(() => {
        window.addEventListener("beforeunload", handleAlertWhenReload);
        return () => {
            window.removeEventListener("beforeunload", handleAlertWhenReload);
        };
    }, []);

    useEffect(() => {
        imageDataCollection.initiateCurrentImage();
        const image = document.getElementById('imageCanvas') as HTMLCanvasElement;
        const cropperContainer = document.getElementsByClassName('cropper-container')[0] as HTMLElement;
        const cropImageElement = document.getElementById('preview-crop-image') as HTMLImageElement;
        // const cropImageElement = document.getElementById('imageCanvas01') as HTMLCanvasElement;
        let cropper;

        const cropButton = document.getElementById('crop-button')
        let cropButtonEvent = () => { };

        if (image && MODE === 'MANUAL') {
            if (cropperContainer) {
                cropperContainer.style.display = 'block';
                image.classList.add('cropper-hidden');
            }

            cropper = new Cropper(image, {
                aspectRatio: 0,
                zoomable: false,
                center: true,
                scalable: false,
            });


            if (cropButton) {
                cropButtonEvent = () => {
                    if (cropImageElement && cropImageElement) {
                        var cropImageCanvasUrl = cropper.getCroppedCanvas({
                            maxHeight: 4096,
                            maxWidth: 4096,
                            imageSmoothingEnabled: false,
                            imageSmoothingQuality: 'high',
                        }).toDataURL('image/png');
                        var cropImage = new Image();
                        cropImage.src = cropImageCanvasUrl;
                        cropImageElement.src = cropImageCanvasUrl;

                        handleConvertImage2Text(cropImageCanvasUrl);
                    }
                }
                cropButton.addEventListener('click', cropButtonEvent)
            }

        }
        else if (!image || MODE === '') {
            if (cropperContainer) {
                cropperContainer.style.display = 'none';
                image.classList.remove('cropper-hidden');
            }
        }

        return () => {
            cropButton?.removeEventListener('click', cropButtonEvent)
            if (cropper) cropper.destroy();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MODE]);

    useEffect(() => {
        (async () => {
            if (allTextBoxes.length > 0) {
                const image = document.getElementById('imageCanvas') as HTMLCanvasElement;
                const currentImage = await imageDataCollection.getCurrentSaveData();
                if (currentImage && image) {
                    currentImage.convertAndAddAllCoordinatesArraysFromServer(allTextBoxes);
                    await convertImage2Text(imageDataCollection.getAllTextboxesDataFromAnImage());
                    setAllTextBoxesData(imageDataCollection.getAllTextboxesDataFromAnImage());
                    // showAllTextBox();

                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(allTextBoxes)]);

    const showAllTextBox = () => {
        const textBoxListCollection = document.getElementById("outlinesContainer")?.children;
        if (textBoxListCollection) {
            for (let i = 0; i < textBoxListCollection.length; i++) {
                (textBoxListCollection[i] as HTMLElement).style.display = 'block';
            }
        }
    }

    const showTextBoxById = (textBoxId: string) => {
        const textBoxContainer = document.getElementById(`text-box-${textBoxId}`);
        if (textBoxContainer) {
            textBoxContainer.style.display = 'block';
        }
    }

    const handleAlertWhenReload = () => {
        alert("This page is reloaded and all current image all gone");
    }

    const handleClick = () => setShowMenus(!showMenus);

    const handleConvertImage2Text = async (image: string) => {
        const data = {
            message: 'extract text in cropped image',
            content: image,
        }
        try {
            setLoading(true);
            const internalConvertImage2Text = async () => {
                const response: any = await mangaAPI.getTextFromImage(data);

                if (response) {
                    setConvertedText(response?.content);
                    toast.success("Convert Text Successfully!", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            }

            await internalConvertImage2Text();
        } catch (error) {
            toast.error('convert fail!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1500
            });
        } finally {
            setLoading(false)
        }
    }

    const handleClickSideBar = async (value: string) => {

        const image = document.getElementById('imageCanvas') as HTMLCanvasElement;
        const originalImageSize = [
            image.width,
            image.height,
        ];

        const elementImageSize = [
            image.getBoundingClientRect().width,
            image.getBoundingClientRect().height,
        ]

        setRatio(elementImageSize[0] / originalImageSize[0]);
        setOffsetList({
            left: image.getBoundingClientRect().left,
            right: image.getBoundingClientRect().right,
            top: image.getBoundingClientRect().top,
        })


        setPageImage(image.toDataURL());

        try {
            if (value === 'detect-all-box') {
                setAllTextBoxes([]);
                setAllTextBoxesData([]);
                if (image) {
                    setLoading(true)
                    const response: any = await mangaAPI.detextAllBox({
                        message: 'detect all textboxes',
                        content: image.toDataURL('image/png'),
                    })

                    setAllTextBoxes(JSON.parse(response?.content) as any);
                    toast.success("Dectect All Boxes Successfully!", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
                else {
                    toast.error("Error HTML Canvas !", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            }
        } catch (error) {
            toast.error("Error Dectect All Boxes !", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        } finally {
            setLoading(false);
        }
    }

    const renderTextBox = (allTextBoxData: any) => {
        const allTextBoxData2Array: any[] = [];

        allTextBoxData.forEach((item: any[]) => {
            allTextBoxData2Array.push(item);
        })

        return allTextBoxData2Array.map(coordinate => <TextBox
            key={coordinate[0]}
            ratio={ratio}
            offsetList={offsetList}
            outlineSpecArray={coordinate}
            pageImage={pageImage}
        />)
    }



    const convertImage2Text = async (coordinateMap: any) => {
        //convert map to object
        let normalizeCoordinateMap = Object.fromEntries(coordinateMap)
        try {
            setProcessTextBox(true);
            let successPromiseCnt = 0;
            const coordinateEntryList = Object.entries(normalizeCoordinateMap);
            const handleConvertText = async outlineSpecArray => {
                const textBoxId = outlineSpecArray[0];


                const image = cropImageViaCoordinate(
                    outlineSpecArray[1][1] - 10,
                    outlineSpecArray[1][2] - 10,
                    outlineSpecArray[1][3] + 20,
                    outlineSpecArray[1][4] + 20,
                    textBoxId
                )
                const data = {
                    message: 'extract text in cropped image',
                    content: image,
                }

                return mangaAPI.getTextFromImage(data);
            };

            coordinateEntryList.map(async outlineSpecArray => {
                const textBoxId = outlineSpecArray[0];
                const response: any = await handleConvertText(outlineSpecArray);
                let convertedText = response.content as any;
                successPromiseCnt += 1;
                if (successPromiseCnt === coordinateEntryList.length) setProcessTextBox(false);
                imageDataCollection.getCurrentSaveData().saveExtractedText(textBoxId, convertedText);
                showTextBoxById(textBoxId);
            });

            showAllTextBox();


        } catch (error) {
            toast.error('convert fail!', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 1500
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleNextPage = () => {
        setAllTextBoxes([]);
        setAllTextBoxesData([])
        setPageNumber(pageNumber + 1);
        imageDataCollection.initiateNextImage();
    }

    const handlePreviousPage = () => {
        setAllTextBoxes([]);
        setAllTextBoxesData([]);
        imageDataCollection.initiatePreviousImage();
        setPageNumber(pageNumber - 1);
    }

    return (
        <>
            <div className="reader-container">
                <ToastContainer />
                <div className="sidebar-container">
                    <Sidebar getSideBarItemKey={handleClickSideBar} />
                    {
                        MODE === 'MANUAL' && <div className="manual-action-button">
                            <Button id='crop-button' type='primary'>Scan</Button>
                        </div>
                    }
                    {
                        <div className="manual-action-button">
                            {
                                isProcessTextBox ? <Spin /> : <CheckCircleFilled style={{
                                    color: '#43a047',
                                    fontSize: '2.5rem',
                                }} />
                            }
                        </div>
                    }

                </div>
                {imageArray && (
                    <div className='slider-container'>
                        <div className="reader-image-container">
                            <Button
                                className='navigate-button-left'
                                icon={<LeftCircleOutlined />}
                                size='large'
                                shape='circle'
                                disabled={imageDataCollection.currentImageData === 0}
                                onClick={handlePreviousPage}
                            />
                            <Spin spinning={isLoading}>
                                <div id='main-screen-reader' className="each-slide-effect" onClick={handleClick}>
                                    {/* <img key={image} src={image} alt="..." style={{display: 'none'}}/> */}
                                    <canvas id="imageCanvas"></canvas>
                                    <canvas id='cropCanvas' style={{ display: 'none' }}></canvas>

                                    <canvas id="overlayCanvas" style={{ display: 'none' }}></canvas>
                                    <div key={JSON.stringify(allTextBoxes)} id="outlinesContainer" style={{ display: 'block' }}>
                                        {allTextBoxesData && renderTextBox(allTextBoxesData)}
                                    </div>
                                </div>
                            </Spin>
                            <Button
                                className='navigate-button-right'
                                icon={<RightCircleOutlined />}
                                size='large'
                                shape='circle'
                                disabled={imageDataCollection.currentImageData === imageArray.length - 1}
                                onClick={handleNextPage}
                            />
                        </div>
                        <BottomMenu
                            sliderValue={pageNumber}
                            containersLen={imageArray.length}
                            showMenus={showMenus}
                            convertedText={convertedText}
                        />
                    </div>
                )}
            </div>
        </>
    )
}