import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './App.css';

import { Table, Input, InputNumber, Popconfirm, Form, Layout, Breadcrumb, PageHeader, DatePicker } from 'antd';

const { Header, Content, Footer } = Layout;

const originData = [];
let arr = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
let index = 0;

for (let i = 0; i < 100; i++) {
  if(i%11 == 0) {
    index = 0;
  }
  originData.push({
    key: i.toString(),
    name: `${arr[index]}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
  index++;
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
          children
        )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Time Interval',
      dataIndex: 'name',
      width: '5%',
      editable: true,
    },
    {
      title: 'Monday',
      dataIndex: 'Monday',
      width: '13%',
      editable: true,
    },
    {
      title: 'Tuesday',
      dataIndex: 'Tuesday',
      width: '13%',
      editable: true,
    },
    {
      title: 'Wednesday',
      dataIndex: 'Wednesday',
      width: '13%',
      editable: true,
    },
    {
      title: 'Thursday',
      dataIndex: 'Thursday',
      width: '13%',
      editable: true,
    },
    {
      title: 'Friday',
      dataIndex: 'Friday',
      width: '13%',
      editable: true,
    },
    {
      title: 'Saturday',
      dataIndex: 'Saturday',
      width: '13%',
      editable: true,
    },
    {
      title: 'Sunday',
      dataIndex: 'Sunday',
      width: '13%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </a>
          );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
          pageSize: 11
        }}
      />
    </Form>
  );
};

function App() {
  return (<>
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%'}}>
        <div className="logo" />
        <PageHeader style = {{ color : '#fff'}}
    className="site-page-header"
    onBack={() => null}
    title="Time Table"
    subTitle="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Create your own custom time table"
  />
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Time Table</Breadcrumb.Item>
          <Breadcrumb.Item>Date</Breadcrumb.Item>
        </Breadcrumb>
        <div><DatePicker/></div>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          <EditableTable />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout></>
  );
}

export default App;