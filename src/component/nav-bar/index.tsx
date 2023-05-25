import React, { useState } from 'react'
import { Menu } from 'antd';
import logo from '../../asset/icon/logo.png';
import type {MenuProps} from 'antd';
import './style.scss'

const MenuItem: MenuProps['items'] = [
    {
        label: '',
        key: 'app-icon',
        icon: <img className='app-logo' src={logo} alt="logo-not-found" />
    }
];

export const Navbar = () => {
    const [currentKey, setCurrentKey] = useState('');

    const handleClickNavBar: MenuProps['onClick'] = (e) => {
        setCurrentKey(e.key);
    }

  return (
        <Menu className='app-navbar' onClick={handleClickNavBar} selectedKeys={[currentKey]} mode="horizontal" items={MenuItem} />
    );
};
