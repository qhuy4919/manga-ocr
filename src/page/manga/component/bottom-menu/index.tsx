import { useEffect, useState } from 'react';
import { FaBookOpen } from 'react-icons/fa'
import { Input, Select } from 'antd';
import { mangaAPI } from '../../../../access';
import { toast } from 'react-toastify';
import './style.scss'

const { TextArea } = Input;

type BottomMenuProps = {
    showMenus: boolean,
    containersLen: number,
    sliderValue: number,
    onInput?: any
    convertedText: string,
}



export const BottomMenu = ({
    showMenus,
    containersLen,
    sliderValue,
    onInput,
    convertedText }: BottomMenuProps) => {
    const [translatedText, setTranslatedText] = useState<string>('');
    const [translateLang, setTranslateLang] = useState<string>('en');

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setTranslateLang(value);
      };

    useEffect(() => {
        const fetchTranslateText = async () => {
            try {
                const translateText = async () => {
                    const response: any = await mangaAPI.translateText(convertedText, translateLang);

                    if (response) {
                        console.log(response[0].translations[0].text);
                        setTranslatedText(response[0].translations[0].text);
                    }
                }

                if (convertedText) translateText();

            } catch (error) {
                toast.error('translate fail!', {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: 1500
                });
            }
            finally {
            }
        };

        fetchTranslateText();

    }, [convertedText, translateLang]);

    return (
        <div className={showMenus ? 'bottom-menu visible-menu' : 'bottom-menu'}>
            <div className="transalte-box">
                <div className="converted-text-wrapper">
                    <span className='resource-language'>Japanese</span>
                    <TextArea
                        value={convertedText}
                        autoSize={{ minRows: 5, maxRows: 10 }}
                        showCount
                    />
                </div>
                <div className="transalte-text-wrapper">
                        <Select
                            className='destination-language'
                            defaultValue={translateLang}
                            onChange={handleChange}
                            options={[
                                { value: 'vi', label: 'Vietnamese' },
                                { value: 'en', label: 'English' },
                                { value: 'fr', label: 'French' },
                                { value: 'es', label: 'Spanish' },
                            ]}
                        />
                    <TextArea
                        key={translatedText}
                        value={translatedText}
                        autoSize={{ minRows: 5, maxRows: 10 }}

                    />
                </div>
            </div>
            <div className="page-display">
                <p className="page-text">
                    {/* <span id="ImageID" className="page-current">{sliderValue} </span>
                    of
                    <span className="page-pairs"> {containersLen}</span> */}
                    <span id="ImageID" className="page-current">{sliderValue} </span>

                </p>
                <p className="info-text">
                    <FaBookOpen /> views
                </p>
            </div>
        </div>
    )
}
