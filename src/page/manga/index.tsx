import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../middleware/store';
import { BottomMenu } from './component'
import { Sidebar } from '../../component';
import { imageDataCollection } from './component/image-collection';
import { Slide, SlideshowRef } from 'react-slideshow-image';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import { mangaAPI } from '../../access';
import { toCanvas } from 'html-to-image';
import { TextBox } from './component';
import "cropperjs/dist/cropper.css";
import Cropper from 'cropperjs';
import './style.scss';



export const ItemReader = () => {
    const imageArray = useSelector((state: RootState) => state.manga.file);
    const MODE = useSelector((state: RootState) => state.manga.mode);
    const [currentImage, setCurrentImage] = useState<string>('');

    const [showMenus, setShowMenus] = useState(false);
    const [containersLen, setContainersLen] = useState(0);
    const [visibilityIndex, setVisibilityIndex] = useState(0);
    const [isMagEnabled, setIsMagEnabled] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [convertedText, setConvertedText] = useState<string>('');
    const [allTextBoxes, setAllTextBoxes] = useState<number[][]>([]);
    const [allTextBoxesData, setAllTextBoxesData] = useState<any>();
    const [pageImage, setPageImage] = useState<string>('');


    const sliderRef = useRef<SlideshowRef>(null);

    useEffect(() => {
        imageDataCollection.initiateAndSaveAllNewImagesData(imageArray);
        // (imageArray ?? []).forEach((image: string) => {
        //     imageDataCollection.initiateAndSaveImageData(image);
        // })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageArray]);


    useEffect(() => {
        const handleKeyDown = (e: any) => {
            if (
                e.code === 'Space' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowDown' ||
                e.code === 'KeyJ'
            ) {
                const lastIndex = containersLen - 1
                if (visibilityIndex < lastIndex)
                    setVisibilityIndex(visibilityIndex + 1)
            } else if (
                e.code === 'ArrowRight' ||
                e.code === 'ArrowUp' ||
                e.code === 'KeyL'
            ) {
                if (visibilityIndex > 0) setVisibilityIndex(visibilityIndex - 1)
            } else if (e.code === 'KeyF') {
                if (document.fullscreenElement === null)
                    document.documentElement.requestFullscreen()
                else document.exitFullscreen()
            } else if (e.code === 'KeyM') setIsMagEnabled(!isMagEnabled)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [containersLen, visibilityIndex, isMagEnabled])

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
                        // var ctx = cropImageElement.getContext('2d');
                        // ctx?.drawImage(cropImage, 0, 0);
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
    }, [currentImage, MODE]);

    useEffect(() => {
        (async () => {
            if (allTextBoxes.length > 0) {
                const image = document.getElementById('imageCanvas') as HTMLCanvasElement;
                const currentImage = await imageDataCollection.getCurrentSaveData();
                if (currentImage && image) {
                    currentImage.convertAndAddAllCoordinatesArraysFromServer(allTextBoxes);
                    // imageDataCollection.getAllTextboxesDataFromAnImage().forEach(corrdinateArray => {
                    //     showAllTextBox(new Textbox(corrdinateArray).returnColorfulTextbox());
                    // })
                    setAllTextBoxesData(imageDataCollection.getAllTextboxesDataFromAnImage());
                    showAllTextBox();

                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    const showAllTextBox = () => {
        const outlinesContainer = document.getElementById("outlinesContainer");
        if (outlinesContainer) {
            outlinesContainer.style.display = 'block';
        }

    }

    const handleClick = () => setShowMenus(!showMenus);

    const handleChangePage = (from: number, to: number) => {
        setCurrentPage(to);
        setCurrentImage(imageArray[to]);
        imageDataCollection.initiateNextImage();
        imageDataCollection.initiateCurrentImage();
    }

    const handleConvertImage2Text = (image: string) => {
        const data = {
            message: 'extract text in cropped image',
            content: image,
        }
        try {
            const convertImage2Text = async () => {
                const response = await mangaAPI.getTextFromImage(data);

                if (response) {
                    setConvertedText(JSON.stringify(response));
                }
            }

            convertImage2Text();
        } catch (error) {
            toast.error('convert fail!', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 1500
            });
        }
    }

    const handleClickSideBar = async (value: string) => {
        const currentImageId = imageDataCollection.getCurrentSaveData().imageFile;
        const imageElement = document.getElementById(`${currentImageId}`) as HTMLCanvasElement;

        const image = await toCanvas(imageElement);
        setPageImage(image.toDataURL());
        
        try {
            if (value === 'detect-all-box') {
                if (image) {
                    const response = await mangaAPI.detextAllBox({
                        message: 'detect all textboxes',
                        content:  image.toDataURL('image/png'),
                    })

                    setAllTextBoxes(response as any);
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
        }
    }

    const renderTextBox = (allTextBoxData: any) => {
        const allTextBoxData2Array: any[] = [];

        allTextBoxData.forEach((item: any[]) => {
            allTextBoxData2Array.push(item);
        })

        return allTextBoxData2Array.map(coordinate => <TextBox 
            outlineSpecArray={coordinate} 
            pageImage={pageImage}
            />)
    }

    return (
        <>
            <div className="reader-container">
                <div className="sidebar-container">
                    <Sidebar getSideBarItemKey={handleClickSideBar} />
                    {
                        MODE === 'MANUAL' && <div className="manual-action-button">
                            <Button id='crop-button'>Submit</Button>
                        </div>
                    }
                </div>
                {imageArray && (
                    <div className='slider-container'>

                        <Slide
                            ref={sliderRef}
                            autoplay={false}
                            onChange={handleChangePage}
                            transitionDuration={0.5}
                            infinite={false}
                        >
                            {
                                imageArray.map((image: string) => (
                                    <div id={image} key={image} className="each-slide-effect" onClick={handleClick}>
                                        {/* <img key={image} src={image} alt="..." style={{display: 'none'}}/> */}
                                        <canvas id="imageCanvas"></canvas>
                                        <canvas id='cropCanvas' style={{ display: 'none' }}></canvas>

                                        <canvas id="overlayCanvas" style={{ display: 'none' }}></canvas>
                                        <div key={JSON.stringify(allTextBoxes)} id="outlinesContainer" style={{ display: 'none' }}>
                                                {allTextBoxesData && renderTextBox(allTextBoxesData)}
                                        </div>
                                    </div>

                                ))
                            }
                        </Slide>
                        <BottomMenu
                            sliderValue={currentPage}
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