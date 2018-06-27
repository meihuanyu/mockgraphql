import React from 'react'

import CreateField from '../modular/system/createField'
class ShowModal extends React.Component{
    state = { visible: true }

    closeModal=()=>{
        this.setState({
            visible: false,
        });
    }
    handleOk = (e) => {
        console.log(e);
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    render(){
        return <Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
    >
        <CreateField handleOk={this.handleOk} />
    </Modal>
    }
}

export default ShowModal