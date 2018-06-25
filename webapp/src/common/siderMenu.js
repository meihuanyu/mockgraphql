import React ,{Component} from 'react';

class siderMenu extends Component{
    state = {
        collapsed: false,
        treeData:[]
    };
         
    async componentDidMount(){
        const { data }=await http.get('/librarys/node_menus',{typeName:"XOT_LIBTOP",relationTypeName:"XRT_LibContent",id: "4006000000RECOAAA102"
        });
        this.setState({
            treeData:data
        })
        
    }
    onLoadData = async (treeNode) => {
        if (treeNode.props.children) {
            return false;
        }
        const { data }=await http.get('/librarys/node_menus',{id:treeNode.props.eventKey,relationTypeName:"XRT_LibContent",typeName:"XOT_LIB"});
        treeNode.props.dataRef.children = data;
        this.setState({
            treeData: [...this.state.treeData],
        });
    }
    renderTreeNodes = (data) => {
        const currentUrl=this.props.match.url;
        return data.map((item) => {
            if (item.children) {
                return (
                    <SubMenu  title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </SubMenu>
                );
            }
            if(item.storageType=='STOR'){
                return  <Menu.Item 
                            isLeaf={true}  
                            key={item.id} 
                            dataRef={item}
                            >
                            <Link to={`${currentUrl}/${item.id}`}>{item.name}</Link>
                        </Menu.Item>      
            }else{
                return <SubMenu onClick={(item)=>this.xx(item)} title={item.name} key={item.id} dataRef={item} />;
            }
            
        });
    }
    render(){
        <Sider width={300} breakpoint="xl" collapsedWidth="0" style={{ background: '#fff', height: '100%'}}>
                <Menu 
                mode="inline"
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </Menu>
        </Sider>
    }
}