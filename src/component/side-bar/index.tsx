import React, { useState } from 'react'
import { Menu, Switch, Select } from 'antd';
import type { MenuProps, SwitchProps } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { changeLanguage, changeMode } from '../../middleware/manga-slice';
import { useDispatch, useSelector } from 'react-redux';

import './style.scss'
import { RootState } from 'middleware/store';


type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

type SwitchModeProps = {
    label: string;
} & SwitchProps

const SwitchMode = (props: SwitchModeProps) => {
    return <div className="switch-mode-container">
        <div className="label">{props.label}</div>
        <Switch {...props} />
    </div>
};


export const Sidebar = ({
    getSideBarItemKey
}: {
    getSideBarItemKey: (value: string) => void,
}) => {
    const dispatch = useDispatch();
    const currentLanguage = useSelector((state: RootState) => state.manga.language);

    const [currentKey, setCurrentKey] = useState('');


    const handleClickSideBar: MenuProps['onClick'] = async (e) => {
        setCurrentKey(e.key);
        getSideBarItemKey(e.key);
    }

    const handleChangeLanguage = (value: string) => {
        dispatch(changeLanguage({language: value}))
    };

    const items: MenuProps['items'] = [
        getItem('Mode', 'manga-mode', null,
            [
                getItem(<SwitchMode label='Manual Mode' onChange={(checked: boolean) => {
                    dispatch(changeMode({
                        mode: checked ? 'MANUAL' : '',
                    }))
                }} />, 'manual-mode'),
            ]),
        getItem('Edit', 'edit', <BookOutlined />, [
            getItem('Detect All Textbox', 'detect-all-box', null),
        ]),
        // getItem('Export', 'sub2', <SettingOutlined />, [
        //     getItem('PDF', 'export-pdf'),
        //     getItem('Image', 'export-image'),
        // ]),

        { type: 'divider' },
    ];

    return (
        <div className="sidebar-wrapper">
            <Menu
                onClick={handleClickSideBar}
                style={{ width: 256 }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['edit']}
                mode="inline"
                items={items}
            />
             <div className="preview-section language-section">
                <div className="label">Translate Languages</div>
                <Select
                className='destination-language'
                value={currentLanguage}
                onChange={handleChangeLanguage}
                options={[
                    { value: 'vi', label: 'Vietnamese' },
                    { value: 'en', label: 'English' },
                    { value: 'fr', label: 'French' },
                    { value: 'es', label: 'Spanish' },
                ]}
            />            </div>
         
            <div className="preview-section">
                <div className="label">Image Preivew</div>
                <img id='preview-crop-image' alt=''/>
            </div>
        </div>
    );
};
