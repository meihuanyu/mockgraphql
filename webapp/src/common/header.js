import React from 'react';
import {
    Link
  } from 'react-router-dom'
import { Menu } from 'antd';
const Header=({menuData})=>(
    <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
        >
            {menuData.map((item)=>
                    <Menu.Item key={item.id}>
                        <Link  to={'/'+item.name+"/"+item.id}>
                            {item.displayname}
                        </Link>
                    </Menu.Item>
            )}
    </Menu>
)
export default Header