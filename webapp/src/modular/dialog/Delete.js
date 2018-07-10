import React from 'react'
import BaseModal from '../../common/BaseModal'
import {graphql,compose} from 'react-apollo'
import systemmenuDelete from '../../graphql/systemmenuDelete'
class Delete extends BaseModal{
    modalProps={
        onOk:async ()=>{
          const {systemmenuDelete,dataSource,gData,systemmenuUpdate,close} = this.props
          const res=await systemmenuDelete({
            variables:{
                id:gData[0].id
            }
          })
          close('next')
        
        }
      }
      render(){
        const {dataSource} = this.props
        return <div>
            {dataSource.currentRows().map(item=><p key={item.id}>{item.displayname}</p>)}
        </div>
      }
}
export default compose(
    graphql(systemmenuDelete,{name:"systemmenuDelete"})
)(Delete)