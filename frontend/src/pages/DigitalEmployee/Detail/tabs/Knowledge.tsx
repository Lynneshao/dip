import { PlusOutlined, SearchOutlined, BulbOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Input, Table, Card, Modal, Form, Select, Space, Tag, message } from 'antd'
import { useState } from 'react'

// Mock 知识数据
const mockKnowledge = [
  {
    id: '1',
    name: '运营数据统计规则',
    type: '业务规则',
    source: 'BKN',
    updatedAt: '2026-03-08',
    creator: '张三',
  },
  {
    id: '2',
    name: '用户常见问题解答',
    type: 'FAQ',
    source: '手动添加',
    updatedAt: '2026-03-07',
    creator: '李四',
  },
  {
    id: '3',
    name: '报表生成模板',
    type: '文档',
    source: 'BKN',
    updatedAt: '2026-03-05',
    creator: '王五',
  },
  {
    id: '4',
    name: '用户分级标准',
    type: '业务规则',
    source: 'BKN',
    updatedAt: '2026-03-01',
    creator: '赵六',
  },
]

// Mock BKN 可选知识
const mockBKNKnowledge = [
  { value: '1', label: '运营数据统计规则' },
  { value: '2', label: '用户分级标准' },
  { value: '3', label: '报表生成模板' },
  { value: '4', label: '客服回复话术' },
  { value: '5', label: '产品功能说明文档' },
]

const KnowledgePage: React.FC = () => {
  const [knowledge, setKnowledge] = useState(mockKnowledge)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [graphVisible, setGraphVisible] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    {
      title: '知识名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => (
        <Tag color={source === 'BKN' ? 'green' : 'orange'}>{source}</Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" size="small">查看</Button>
          <Button type="text" size="small" danger>移除</Button>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const selectedKnowledge = mockBKNKnowledge.find(item => item.value === values.knowledgeId)
      if (!selectedKnowledge) return

      const newKnowledge = {
        id: String(Date.now()),
        name: selectedKnowledge.label,
        type: '业务规则',
        source: 'BKN',
        updatedAt: new Date().toISOString().split('T')[0],
        creator: '当前用户',
      }
      setKnowledge([newKnowledge, ...knowledge])
      setAddModalVisible(false)
      form.resetFields()
      message.success('知识添加成功')
    })
  }

  const handleDynamicAdd = () => {
    Modal.info({
      title: '动态补充知识',
      content: '调用 BKN 智能体，通过自然语言描述补充业务知识网络。功能开发中...',
      onOk() {},
    })
  }

  const filteredKnowledge = knowledge.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold m-0">知识</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<BulbOutlined />} 
            onClick={handleDynamicAdd}
          >
            动态补充知识
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setAddModalVisible(true)}
          >
            从 BKN 添加
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => setKnowledge(mockKnowledge)}
          >
            刷新
          </Button>
        </Space>
      </div>

      <div className="mb-4 flex-shrink-0">
        <Input.Search
          placeholder="搜索知识"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Card className="flex-1 min-h-0 overflow-auto">
        <Table
          dataSource={filteredKnowledge}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <div className="mt-4 flex-shrink-0">
        <Card 
          title="知识关系图" 
          extra={<Button type="link" onClick={() => setGraphVisible(true)}>查看大图</Button>}
          className="h-64"
        >
          <div className="h-full flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-400">知识关系图谱展示区域（开发中，将使用 AntV G6 实现）</p>
          </div>
        </Card>
      </div>

      <Modal
        title="从 BKN 添加知识"
        open={addModalVisible}
        onOk={handleAdd}
        onCancel={() => setAddModalVisible(false)}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="knowledgeId"
            label="选择知识"
            rules={[{ required: true, message: '请选择要添加的知识' }]}
          >
            <Select
              placeholder="从业务知识网络中选择知识"
              options={mockBKNKnowledge}
              showSearch
              optionFilterProp="children"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="知识关系图"
        open={graphVisible}
        onCancel={() => setGraphVisible(false)}
        footer={null}
        width={800}
      >
        <div className="h-96 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-400">知识关系图谱全屏展示（开发中）</p>
        </div>
      </Modal>
    </div>
  )
}

export default KnowledgePage
