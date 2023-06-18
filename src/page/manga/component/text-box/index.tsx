import React, { useCallback, useState } from 'react'
import { Popover, Spin } from 'antd';
import { mangaAPI } from '../../../../access';
import { toast } from 'react-toastify';
import './style.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'middleware/store';

type TextBoxProps = {
    outlineSpecArray: number[],
    pageImage: string,
    ratio: number,
    offsetList: Record<string, any>,
}

export const TextBox = ({ outlineSpecArray, pageImage, ratio, offsetList }: TextBoxProps) => {
    const textBoxId = outlineSpecArray[0];
    const [isLoading, setLoading] = useState<boolean>(false);
    const [transaltedText, setTranslatedText] = useState<string>('...');
    const currentLanguage = useSelector((state: RootState) => state.manga.language);



    const cropToImage = (pointX,pointY,cropWidth,cropHeight) => {
        const imageElement = document.getElementById('current-reader-image') as HTMLCanvasElement;

       

        // create a temporary canvas sized to the cropped size
        const canvas1 = document.getElementById('cropCanvas') as HTMLCanvasElement;
        const ctx1= canvas1.getContext('2d');
        canvas1.width=cropWidth;
        canvas1.height=cropHeight;
        // use the extended from of drawImage to draw the
        // cropped area to the temp canvas
        if(ctx1) {
            ctx1?.drawImage(imageElement,pointX,pointY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);
        }

        //console.log(canvas1.toDataURL())
        return canvas1.toDataURL();
    }

    const handleConvertImage2TextAndTranslate = async (image: string) => {
        let convertedText = '';
        const data = {
            message: 'extract text in cropped image',
            content: image,
        }

        try {
            const translateText = async () => {
                const response: any = await mangaAPI.translateText(convertedText, currentLanguage);

                if (response) {
                    console.log(response[0].translations[0].text);
                    setTranslatedText(response[0].translations[0].text);
                }
            }

            const convertImage2Text = async () => {
                setLoading(true);
                const response: any = await mangaAPI.getTextFromImage(data);
                convertedText = response.content as any;
                await translateText()
            }
        


            await convertImage2Text();
        } catch (error) {
            toast.error('convert fail!', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 1500
            });
        } finally {
            setLoading(false);
        }
    }

    const handleMouseDown = useCallback(() => {
        handleConvertImage2TextAndTranslate(cropToImage(
            outlineSpecArray[1] -10,
            outlineSpecArray[2] - 10,
            outlineSpecArray[3] + 20,
            outlineSpecArray[4] + 20,
        ))
    }, [currentLanguage])

    return (
     <>
       <Popover
        overlayClassName='overlay-text-box-popover'
        title={isLoading 
            ? <Spin/> 
            : <span>{transaltedText}</span>
        }
       >
         <div 
            id={`${textBoxId}`} className="text-box-wrapper"
            style={{
                position: 'absolute',
                left: outlineSpecArray[1]* ratio -10 + offsetList.left - 200,
                top: outlineSpecArray[2]* ratio -10 + offsetList.top - 70,
                width: outlineSpecArray[3] * ratio+ 20 ,
                height: outlineSpecArray[4] * ratio+ 20 ,
                backgroundColor: 'rgb(64, 150, 255, 0.5)',
            }}
            onMouseEnter={() => {
                handleMouseDown();
            }}
        ></div>
       </Popover>
        <img id='current-reader-image' src={pageImage} style={{display: 'none'}} alt={`${textBoxId}`}/>
     </>

    )
}
