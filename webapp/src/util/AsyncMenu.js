import React from 'react';

class AsyncMenu extends React.Component{
    state = {
        loading: null,
    }
    Component=null
    async componentWillMount () {
        this.setState({loading: false});
        const xx=await import('../modular'+this.props.component)
        this.Component=xx.default
        this.setState({loading: true});
    }


    render() {
        const { loading } = this.state;
        const Component=this.Component;
        if(loading){
            console.log('加载'+this.props.component)
            return <Component {...this.props} />
        }else{
            return null
        }
    }
}
export default AsyncMenu