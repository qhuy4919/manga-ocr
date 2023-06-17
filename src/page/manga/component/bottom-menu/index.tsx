import { useEffect, useState } from 'react';
import { FaBookOpen } from 'react-icons/fa'
import { Input, Select, Spin } from 'antd';
import { mangaAPI } from '../../../../access';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
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
    const [isLoading, setLoading] = useState<boolean>(false);

    const handleChange = (value: string) => {
        setTranslateLang(value);
    };

    const translateText = async () => {
        try {
            setLoading(true);
            const response: any = await mangaAPI.translateText(convertedText, translateLang);
    
            if (response) {
                console.log(response[0].translations[0].text);
                setTranslatedText(response[0].translations[0].text);
            }
        } catch (error) {
            toast.error('translate fail!', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 1500
            });   
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (convertedText) translateText();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <Spin spinning={isLoading}>
                        <TextArea
                            key={translatedText}
                            value={translatedText}
                            autoSize={{ minRows: 5, maxRows: 10 }}

                        />
                    </Spin>
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
