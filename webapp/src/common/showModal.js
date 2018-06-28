import React from 'react'
import AsyncMenu from '../util/AsyncMenu'
import {Modal } from 'antd'

class ShowModal extends React.Component{
    state = { 
        patch: true,
        modalProps:{} 
    }
    componentDidMount (){
        this.setState({
            patch:this.props.component
        })
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            patch:nextProps.component
        })
    }
    closeModal=()=>{
        //改变上一层topmenu的状态
        this.props.upperCom.setState({
            modalPatch: "",
            flowData:""
        });
    }
    render(){
        const _this=this
        const {patch}=this.state;
        const {displayname}=this.props.menuFlowProps.menu

        const defaultParams={
            title:displayname,
            visible:patch?true:false,
            onCancel:this.closeModal
        }

        const ModalParams=Object.assign({},defaultParams,this.state.modalProps)
        return <Modal
                    {...ModalParams}
                >
                {patch?<AsyncMenu component={patch} {...this.props.menuFlowProps} close={this.closeModal}  rModal={_this} />:null}
            </Modal>
    }
}

export default ShowModal