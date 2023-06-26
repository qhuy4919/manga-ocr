import React, { useCallback, useState } from 'react'
import { Popover, Spin } from 'antd';
import { mangaAPI } from '../../../../access';
import { toast } from 'react-toastify';
import './style.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'middleware/store';
import { imageDataCollection } from '../image-collection';

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

    const handleTranslateText = async (text: string) => {
        setLoading(true);
        try {
            const translateText = async () => {
                const response: any = await mangaAPI.translateText(text, currentLanguage);

                if (response) {
                    console.log(response[0].translations[0].text);
                    setTranslatedText(response[0].translations[0].text);
                }
            }

            await translateText();



        } catch (error) {
            toast.error('translate fail!', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 1500
            });
        } finally {
            setLoading(false);
        }
    }
    const handleMouseDown = useCallback(async () => {
        await handleTranslateText(imageDataCollection.getCurrentSaveData().getExtractedText(textBoxId) as string);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLanguage, textBoxId])

    return (
        <>
            <Popover
                overlayClassName='overlay-text-box-popover'
                title={isLoading
                    ? <Spin />
                    : <span>{transaltedText}</span>
                }
            >
                <div
                    id={`text-box-${textBoxId}`} className="text-box-wrapper"
                    style={{
                        position: 'absolute',
                        left: outlineSpecArray[1] * ratio - 10 + offsetList.left - 200,
                        top: outlineSpecArray[2] * ratio - 10 + offsetList.top - 70,
                        width: outlineSpecArray[3] * ratio + 20,
                        height: outlineSpecArray[4] * ratio + 20,
                        backgroundColor: 'rgb(64, 150, 255, 0.5)',
                        display: 'none'
                    }}
                    onMouseEnter={() => {
                        handleMouseDown();
                    }}
                ></div>
            </Popover>
        </>

    )
}
