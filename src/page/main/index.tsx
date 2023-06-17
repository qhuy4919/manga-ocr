import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateFile } from '../../middleware/manga-slice';
import './style.scss';

const { Dragger } = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: "image/png, image/jpeg",
    action: '',
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
    maxCount: 12,
    beforeUpload: () => false,
};


export const MainPage = () => {
    const [file, setFile] = useState<any[]>([]);
    const history = useHistory();
    const dispatch = useDispatch();



    const onChange = (info: any) => {
        const { status } = info.file;
        const fileArray: string[] = [];
        
        for (let i = 0; i < info.fileList.length; ++i) {
            fileArray.push(URL.createObjectURL(info.fileList[i].originFileObj));
        }

        setFile([...fileArray]);
        dispatch(updateFile({file: [...fileArray]}))
        localStorage.setItem('manga-image-file', JSON.stringify(fileArray));

        if (status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    return (
            <div className="main-page">
                {/* <div className="sidebar-container">
                    <Sidebar />
                </div> */}
                <div className="reader-container">
                    <Dragger 
                    {...props} 
                    onChange={onChange} 
                    className='dragger-manga'
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                            banned files.
                        </p>
                    </Dragger>
                    {
                        file.length > 0 && <Button
                            className='process-button'
                            onClick={() => { history.push('/preview') }}
                            type='primary'
                            size='large'
                        >Start!</Button>
                    }
                </div>
            </div>
    )
}
