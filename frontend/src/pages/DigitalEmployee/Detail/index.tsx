import { ArrowLeftOutlined, SettingOutlined, BookOutlined, ThunderboltOutlined, CalendarOutlined, MessageOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Menu, Spin, message, Card } from 'antd'
import { memo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import TiptapEditor from '@/components/TiptapEditor'

// Mock 数字员工详情数据
const mockEmployeeDetail = {
  id: '1',
  name: '运营小助手',
  description: '负责日常运营数据统计、报表生成和用户消息回复',
  creator: '张三',
  createdAt: '2026-03-01',
  status: 'running',
}

type MenuItem = Required<MenuProps>['items'][number]

const getMenuItems = (employeeId: string, navigate: any): MenuItem[] => [
  {
    key: 'setting',
    icon: <SettingOutlined />,
    label: '设定',
    onClick: () => navigate(`/studio/digital-employee/${employeeId}/setting`),
  },
  {
    key: 'knowledge',
    icon: <BookOutlined />,
    label: '知识',
    onClick: () => navigate(`/studio/digital-employee/${employeeId}/knowledge`),
  },
  {
    key: 'skill',
    icon: <ThunderboltOutlined />,
    label: '技能',
    onClick: () => navigate(`/studio/digital-employee/${employeeId}/skill`),
  },
  {
    key: 'plan',
    icon: <CalendarOutlined />,
    label: '计划',
    onClick: () => navigate(`/studio/digital-employee/${employeeId}/plan`),
  },
  {
    key: 'session',
    icon: <MessageOutlined />,
    label: '会话',
    onClick: () => navigate(`/studio/digital-employee/${employeeId}/session`),
  },
]

// 子页面组件
const SettingPage = ({ employee, onSave }: { employee: any; onSave: (content: string) => void }) => {
  const [content, setContent] = useState(
    employee.settingContent || `# ${employee.name}\n\n## 职责描述\n\n${employee.description}\n\n## 能力范围\n\n- 可以处理日常运营数据统计\n- 自动生成运营报表\n- 回复用户常见问题\n\n## 限制条件\n\n- 不处理敏感数据\n- 所有操作需要人工审核`
  )
  const [saving, setSaving] = useState(false)
  const [editorLoading, setEditorLoading] = useState(true)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      onSave(content)
      setSaving(false)
      message.success('设定保存成功')
    }, 1000)
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold m-0">设定</h2>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={handleSave}
          loading={saving}
          disabled={editorLoading}
        >
          保存
        </Button>
      </div>
      
      <Card className="flex-1 min-h-0 overflow-auto">
        <TiptapEditor
          initialContent={content}
          onChange={setContent}
          onLoadingStateChange={setEditorLoading}
          placeholder="请输入数字员工的设定描述..."
          className="min-h-[500px]"
        />
      </Card>
    </div>
  )
}

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

const KnowledgePage = () => {
  const [knowledge, setKnowledge] = useState(mockKnowledge)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [graphVisible, setGraphVisible] = useState(false)

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
      </div>

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

const SkillPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">技能</h2>
    <p className="text-gray-600">这里可以管理数字员工的技能，支持自然语言创建和测试技能。</p>
  </div>
)

const PlanPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">计划</h2>
    <p className="text-gray-600">这里可以管理数字员工的任务计划，支持定时/周期/条件执行。</p>
  </div>
)

const SessionPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">会话</h2>
    <p className="text-gray-600">这里可以查看数字员工的会话记录，支持飞书/钉钉/企业微信等通道。</p>
  </div>
)

// 页面映射
const getPageMap = (employee: any, onSaveSetting: (content: string) => void): Record<string, React.ReactNode> => ({
  setting: <SettingPage employee={employee} onSave={onSaveSetting} />,
  knowledge: <KnowledgePage />,
  skill: <SkillPage />,
  plan: <PlanPage />,
  session: <SessionPage />,
})

const DigitalEmployeeDetail = () => {
  const navigate = useNavigate()
  const { id, tab = 'setting' } = useParams<{ id: string; tab?: string }>()
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState(mockEmployeeDetail)
  const [, messageContextHolder] = message.useMessage()

  const handleSaveSetting = (content: string) => {
    setEmployee(prev => ({
      ...prev,
      settingContent: content,
    }))
  }

  useEffect(() => {
    // 如果没有 tab 参数，默认跳转到 setting
    if (!tab) {
      navigate(`/studio/digital-employee/${id}/setting`, { replace: true })
      return
    }

    // 模拟加载数据
    setLoading(true)
    setTimeout(() => {
      setEmployee(mockEmployeeDetail)
      setLoading(false)
    }, 1000)
  }, [id, tab, navigate])

  const handleBack = () => {
    navigate('/studio/digital-employee')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  const renderContent = () => {
    const pageMap = getPageMap(employee, handleSaveSetting)
    return pageMap[tab as string] || pageMap.setting
  }

  return (
    <div className="h-full flex flex-col">
      {messageContextHolder}
      {/* 顶部导航栏 */}
      <div className="flex-shrink-0 px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回列表
          </Button>
          <div>
            <h1 className="text-xl font-bold m-0 flex items-center gap-2">
              {employee.name}
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                运行中
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 m-0">{employee.description}</p>
          </div>
        </div>
      </div>

      {/* 主体内容区 */}
      <div className="flex-1 min-h-0 flex">
        {/* 左侧菜单 */}
        <div className="w-56 border-r flex-shrink-0 pt-4">
          <Menu
            mode="inline"
            selectedKeys={[tab as string]}
            items={getMenuItems(id as string, navigate)}
            style={{ border: 'none' }}
          />
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 min-h-0 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default memo(DigitalEmployeeDetail)
