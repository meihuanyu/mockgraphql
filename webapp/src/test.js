import React from 'react'
import { Table, Input, InputNumber, Popconfirm, Form ,DatePicker ,Select} from 'antd';
import moment from 'moment';
const Option = Select.Option;
const data = [];
for (let i = 1; i < 100; i++) {
  data.push({
    key: i.toString(),
    id: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    timer: `2018-06-${i}`,
    xiala:i%2==0?"2002UAES00IDRECOOB6G":"2002UAES00IDRECOOB6H",
    renren:i+i.toString(),
    renrenid:i+i.toString()+'xxx'
  });
}
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ ...props }) => {
    return <tr {...props} />
};


class EditableCell extends React.Component {
  state={
      selectData:[]
  }
  handleSearch=()=>{
    console.log('handleSearch')
    const selectData=[
        {id:"11xxx",text:"11"},
        {id:"22xxx",text:"22"},
        {id:"33xxx",text:"33"},
        {id:"44xxx",text:"44"},
    ]
    this.setState({selectData})
  }
  handleChange=()=>{
    console.log('handleChange')

  }
  render() {
    const {
      dataIndex,
      inputType,
      record,
      changeCell
    } = this.props;
    if(inputType=="text"){
        return  <td><Input value={record[dataIndex]} onChange={(e)=>changeCell(record.id,dataIndex,e.target.value)}/></td>;
    }else if(inputType=="date"){
        return  <td><DatePicker defaultValue={moment(record[dataIndex], "YYYY/MM/DD")} onChange={(date, dateString)=>changeCell(record.id,dataIndex,dateString)}/></td>;
    }else if(inputType=='select'){
        return   <td>
                    <Select defaultValue={record[dataIndex]} style={{ width: 120 }} onChange={(value)=>{changeCell(record.id,dataIndex,value)}}>
                        <Option value="2002UAES00IDRECOOB6G">Yes</Option>
                        <Option value="2002UAES00IDRECOOB6H">No</Option>
                    </Select>
                </td>
    }else if(inputType=="selectKey"){
        const url="/processTemplate/getProcessTemplateList"
        const options = this.state.selectData.map(d => <Option key={d.id} value={d.text}>{d.text}</Option>);
        return <td>
                    <Select
                        style={{ width: 120 }}
                        defaultValue={record[dataIndex]} 
                        mode="combobox"
                        onChange={(value,option)=>{changeCell(record.id,'renrenid',option.key)}}
                        onSearch={this.handleSearch}
                    >
                        {options}
                    </Select>
                </td>
    }


  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '10%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '10%',
        editable: true,
      },
      {
        title: 'timer',
        dataIndex: 'timer',
        width: '15%',
        editable: true,
      },
      {
        title: 'xiala',
        dataIndex: 'xiala',
        width: '25%',
        editable: true,
      },
      {
        title: 'renren',
        dataIndex: 'renren',
        width: '20%',
        editable: true,
      }
    ];
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  idtoindex=(data,id)=>{
        for(let i=0;i<data.length;i++){
            if(data[i].id==id){
                return i
            }
        }
  }
  inputType=(field)=>{
        if(field=="age" || field=="name"){
            return 'text'
        }else if(field=="timer"){
            return 'date'
        }else if(field=="xiala"){
            return 'select'
        }else if(field=="renren"){
            return "selectKey"
        }

  }
  changeCell=(id,field,value)=>{
    let temp=Object.assign({},this.state)
    const index= this.idtoindex(temp.data,id)
    temp.data[index][field]=value
    this.setState(temp)
 }
  render() {
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
            return {
                changeCell:this.changeCell,
                record,
                inputType: this.inputType(col.dataIndex),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: true,
              }
        },
      };
    });

    return (
      <div>
          <button onClick={()=>{console.log(this.state.data)}}>xxx</button>
          <Table
                components={components}
                bordered
                dataSource={this.state.data}
                columns={columns}
                rowClassName="editable-row"
            />
      </div>
    );
  }
}
export default EditableTable;