import React from 'react'
import MenuFlow from '../util/MenuFlow'
import { Layout, Icon ,Menu ,Modal} from 'antd';


class TopMenu extends React.Component{
    state={
        xx:"gg"
    }
    hindeClick=(item)=>{
        new MenuFlow(item.oper,this.props.dataSource,this)
    }
    render(){
        let items=[]
        if(!this.props.menuData){
            return null
        }
        items= this.props.menuData.map((item)=>{
            return <Menu.Item 
                        key={item.id}
                        onClick={()=>this.hindeClick(item)}
                    >
                        {item.displayname}
                    </Menu.Item>
        })
        return <Menu
                    mode="horizontal"
                >
                    {items}
                    <Menu.Item key={11}>{this.state.xx}</Menu.Item >
                </Menu>
    }
}
export default TopMenu


