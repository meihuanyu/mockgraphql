import React from 'react';
 /**
 * 类属性
 * modalParams 通过setState内的数据 去改变showModal组件的属性 以在业务组件内修改modal属性
 * 
 * this.props
 * 
 * close        关闭modal方法
 * dataSource   上层组件内方法或数据
 * gData        通过menuflow g方法获取的流程数据
 * menu         菜单数据
 * resolve      调用方法执行下一个 promise
 */
class BaseModal extends React.Component{
   
    modalProps={
        
    }
    componentDidMount(){
        const {rModal}=this.props
        rModal.setState({
            modalProps:this.modalProps
        })
    }
}
export default BaseModal;