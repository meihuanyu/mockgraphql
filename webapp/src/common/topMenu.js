import React from 'react'
import MenuFlow from '../util/MenuFlow'
import { Layout, Icon ,Menu ,Modal} from 'antd';
import ShowModal from './showModal'
class TopMenu extends React.Component{
    state={
        modalPatch:'',
        flowData:''
    }
    hindeClick=(item)=>{
        new MenuFlow(item,this.props.dataSource,this)
    }
    render(){
        let items=[]
        const { modalPatch ,flowData}=this.state
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
        return <div>
                    <Menu
                            mode="horizontal"
                        >
                            {items}
                    </Menu>
                    {modalPatch?<ShowModal match={this.props.match}  component={modalPatch} menuFlowProps={flowData} upperCom={this} />:null}
                </div>
    }
}
export default TopMenu


