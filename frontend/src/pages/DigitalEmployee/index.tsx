import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { Button, message, Spin, Tooltip, Card, Modal, Form, Input, Popconfirm, Avatar, Space } from 'antd'
import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from '@/components/SearchInput'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

// Mock 数据
const mockEmployees = [
  {
    id: '1',
    name: '运营小助手',
    description: '负责日常运营数据统计、报表生成和用户消息回复',
    creator: '张三',
    createdAt: '2026-03-01',
    userCount: 12,
    planCount: 5,
    taskSuccessRate: [
      { day: '1', value: 90 },
      { day: '2', value: 95 },
      { day: '3', value: 92 },
      { day: '4', value: 98 },
      { day: '5', value: 96 },
      { day: '6', value: 97 },
      { day: '7', value: 99 },
    ],
  },
  {
    id: '2',
    name: '开发助手',
    description: '协助代码审查、bug 分析和文档生成',
    creator: '李四',
    createdAt: '2026-03-05',
    userCount: 8,
    planCount: 3,
    taskSuccessRate: [
      { day: '1', value: 85 },
      { day: '2', value: 88 },
      { day: '3', value: 92 },
      { day: '4', value: 90 },
      { day: '5', value: 93 },
      { day: '6', value: 95 },
      { day: '7', value: 94 },
    ],
  },
  {
    id: '3',
    name: '客服机器人',
    description: '7*24 小时在线解答用户常见问题，处理售后工单',
    creator: '王五',
    createdAt: '2026-03-08',
    userCount: 25,
    planCount: 8,
    taskSuccessRate: [
      { day: '1', value: 95 },
      { day: '2', value: 96 },
      { day: '3', value: 98 },
      { day: '4', value: 97 },
      { day: '5', value: 99 },
      { day: '6', value: 98 },
      { day: '7', value: 100 },
    ],
  },
]

const DigitalEmployee = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<typeof mockEmployees[0] | null>(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [, messageContextHolder] = message.useMessage()

  const handleSearch = (value: string) => {
    setSearchKeyword(value.trim())
    if (!value.trim()) {
      setEmployees(mockEmployees)
      return
    }
    const filtered = mockEmployees.filter(
      (emp) => 
        emp.name.toLowerCase().includes(value.toLowerCase()) || 
        emp.description.toLowerCase().includes(value.toLowerCase())
    )
    setEmployees(filtered)
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setEmployees(mockEmployees)
      setSearchKeyword('')
      setLoading(false)
    }, 1000)
  }

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const newEmployee = {
        id: String(Date.now()),
        name: values.name,
        description: values.description || '',
        creator: '当前用户',
        createdAt: new Date().toISOString().split('T')[0],
        userCount: 0,
        planCount: 0,
        taskSuccessRate: Array.from({ length: 7 }, (_, i) => ({ day: String(i + 1), value: 0 })),
      }
      setEmployees([newEmployee, ...employees])
      setCreateModalVisible(false)
      form.resetFields()
      message.success('数字员工创建成功')
      // 跳转到详情页
      window.location.href = `/studio/digital-employee/${newEmployee.id}/setting`
    })
  }

  const handleEditClick = (employee: typeof mockEmployees[0]) => {
    setEditingEmployee(employee)
    editForm.setFieldsValue({
      name: employee.name,
      description: employee.description,
    })
    setEditModalVisible(true)
  }

  const handleEdit = () => {
    if (!editingEmployee) return
    
    editForm.validateFields().then((values) => {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, name: values.name, description: values.description }
          : emp
      ))
      setEditModalVisible(false)
      setEditingEmployee(null)
      editForm.resetFields()
      message.success('数字员工信息更新成功')
    })
  }

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
    message.success('数字员工删除成功')
  }

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    // 避免点击卡片内的按钮时触发跳转
    if ((e.target as HTMLElement).closest('.ant-btn, .ant-popover')) {
      return
    }
    window.location.href = `/studio/digital-employee/${id}/setting`
  }

  const renderEmployeeCard = (employee: typeof mockEmployees[0]) => {
    const successRate = employee.taskSuccessRate[employee.taskSuccessRate.length - 1].value

    return (
      <Card
        key={employee.id}
        className="w-full mb-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={(e) => handleCardClick(employee.id, e)}
        actions={[
          <Tooltip title="编辑基本信息">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleEditClick(employee)
              }}
            />
          </Tooltip>,
          <Popconfirm
            title="确定要删除这个数字员工吗？"
            description="删除后会同时删除相关的任务、会话和工件，且无法恢复。"
            onConfirm={(e) => {
              e?.stopPropagation()
              handleDelete(employee.id)
            }}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            placement="center"
            getPopupContainer={() => document.body}
          >
            <Tooltip title="删除">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold m-0">{employee.name}</h3>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                运行中
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{employee.description}</p>
            
            <div className="flex gap-8">
              <div>
                <div className="text-xs text-gray-500 mb-1">使用者</div>
                <div className="flex items-center gap-1">
                  <Avatar.Group max={{ count: 3 }}>
                    {Array.from({ length: Math.min(employee.userCount, 5) }).map((_, i) => (
                      <Avatar key={i} size="small" icon={<UserOutlined />} />
                    ))}
                  </Avatar.Group>
                  {employee.userCount > 3 && (
                    <span className="text-sm text-gray-600">+{employee.userCount - 3}</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">计划</div>
                <div className="text-lg font-semibold">{employee.planCount}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">任务成功率</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">{successRate}%</div>
                  <div className="w-24 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={employee.taskSuccessRate}>
                        <YAxis domain={[0, 100]} hide />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={successRate >= 90 ? '#52c41a' : successRate >= 70 ? '#faad14' : '#ff4d4f'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <Spin size="large" />
        </div>
      )
    }

    if (employees.length === 0) {
      return (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
          {searchKeyword ? (
            <>
              <div className="text-gray-400 mb-2">没有找到与「{searchKeyword}」相关的数字员工</div>
              <Button type="link" onClick={() => handleSearch('')}>
                清空搜索
              </Button>
            </>
          ) : (
            <>
              <div className="text-gray-400 mb-4">暂无数字员工</div>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
                新建数字员工
              </Button>
            </>
          )}
        </div>
      )
    }

    return (
      <div className="flex-1 min-h-0 overflow-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(renderEmployeeCard)}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full p-6 flex flex-col relative overflow-auto">
      {messageContextHolder}
      <div className="flex justify-between mb-4 flex-shrink-0 z-20">
        <div className="flex flex-col gap-y-3">
          <span className="text-2xl font-bold text-[--dip-text-color-75]">数字员工</span>
          <span className="text-[--dip-text-color-65]">
            智能自动化，释放你的生产力
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <SearchInput onSearch={handleSearch} placeholder="搜索数字员工" />
          <Tooltip title="刷新">
            <Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh} />
          </Tooltip>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            新建数字员工
          </Button>
        </div>
      </div>

      {renderContent()}

      <Modal
        title="新建数字员工"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => setCreateModalVisible(false)}
        okText="创建"
        cancelText="取消"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入数字员工名称' }]}
          >
            <Input placeholder="最多128个字符" maxLength={128} />
          </Form.Item>
          <Form.Item
            name="description"
            label="简介"
            rules={[{ max: 400, message: '简介最多400个字符' }]}
          >
            <Input.TextArea placeholder="描述这个数字员工的职责和用途（可选）" rows={4} maxLength={400} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑数字员工"
        open={editModalVisible}
        onOk={handleEdit}
        onCancel={() => {
          setEditModalVisible(false)
          setEditingEmployee(null)
          editForm.resetFields()
        }}
        okText="保存"
        cancelText="取消"
        centered
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入数字员工名称' }]}
          >
            <Input placeholder="最多128个字符" maxLength={128} />
          </Form.Item>
          <Form.Item
            name="description"
            label="简介"
            rules={[{ max: 400, message: '简介最多400个字符' }]}
          >
            <Input.TextArea placeholder="描述这个数字员工的职责和用途（可选）" rows={4} maxLength={400} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default memo(DigitalEmployee)
