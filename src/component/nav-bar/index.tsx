import React from 'react'
import { Menu } from 'antd';
import logo from '../../asset/icon/logo.png';
import type { MenuProps } from 'antd';
import './style.scss'
import { useHistory } from 'react-router-dom';

const MenuItem: MenuProps['items'] = [
    {
        label: '',
        key: 'app-icon',
        icon: <img className='app-logo' src={logo} alt="logo-not-found" />
    }
];

export const Navbar = () => {
    const history = useHistory();

    const handleClickNavBar: MenuProps['onClick'] = (e) => {
        if (e.key === 'app-icon')
            history.push('/')
    }

    return (
        <Menu className='app-navbar' onClick={handleClickNavBar} mode="horizontal" items={MenuItem} />
    );
};
