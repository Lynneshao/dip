import { PlusOutlined, PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, List, Card, Modal, Form, Select, Space, Tag, message, Steps, Timeline, Switch, Popconfirm, DatePicker } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { Step } = Steps

// Mock 计划数据
const mockPlans = [
  {
    id: '1',
    name: '每日运营报表生成',
    executeType: '周期',
    cronExpr: '0 9 * * *',
    executeDesc: '每天上午9点执行',
    status: 'enabled',
    createdAt: '2026-03-01',
    creator: '张三',
    tasks: [
      {
        id: 't1',
        status: 'success',
        startTime: '2026-03-09 09:00:00',
        endTime: '2026-03-09 09:00:15',
        duration: '15s',
        result: '报表生成成功，已发送到运营组邮箱',
      },
      {
        id: 't2',
        status: 'success',
        startTime: '2026-03-08 09:00:00',
        endTime: '2026-03-08 09:00:12',
        duration: '12s',
        result: '报表生成成功，已发送到运营组邮箱',
      },
      {
        id: 't3',
        status: 'failed',
        startTime: '2026-03-07 09:00:00',
        endTime: '2026-03-07 09:00:20',
        duration: '20s',
        result: '数据库连接失败，报表生成失败',
      },
    ],
  },
  {
    id: '2',
    name: '用户活跃度周统计',
    executeType: '周期',
    cronExpr: '0 18 * * 1',
    executeDesc: '每周一晚上6点执行',
    status: 'enabled',
    createdAt: '2026-03-05',
    creator: '李四',
    tasks: [
      {
        id: 't1',
        status: 'success',
        startTime: '2026-03-04 18:00:00',
        endTime: '2026-03-04 18:00:30',
        duration: '30s',
        result: '周度用户活跃度统计完成，生成报告 20260304_用户活跃度报告.pdf',
      },
    ],
  },
  {
    id: '3',
    name: '系统异常告警',
    executeType: '条件',
    conditionDesc: '当系统错误率超过5%时触发',
    status: 'disabled',
    createdAt: '2026-03-08',
    creator: '王五',
    tasks: [],
  },
]

const PlanPage: React.FC = () => {
  const [plans, setPlans] = useState(mockPlans)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [createStep, setCreateStep] = useState(1) // 1: 生成, 2: 预览, 3: 发布
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, status: plan.status === 'enabled' ? 'disabled' : 'enabled' }
        : plan
    ))
    message.success('计划状态更新成功')
  }

  const handleCreate = () => {
    if (createStep === 1) {
      form.validateFields().then((values) => {
        setLoading(true)
        setTimeout(() => {
          let executeDesc = ''
          if (values.executeType === 'timer') {
            executeDesc = `定时执行：${dayjs(values.executeTime).format('YYYY-MM-DD HH:mm')}`
          } else if (values.executeType === 'period') {
            executeDesc = `周期执行：每${values.interval}${values.intervalUnit}执行一次`
          } else {
            executeDesc = `条件触发：${values.condition}`
          }

          setGeneratedPlan({
            name: values.name,
            description: values.description,
            executeType: values.executeType,
            executeDesc,
            cronExpr: values.executeType === 'period' ? `0 */${values.interval} * * *` : undefined,
          })
          setCreateStep(2)
          setLoading(false)
        }, 1500)
      })
    } else if (createStep === 2) {
      setCreateStep(3)
    } else if (createStep === 3) {
      publishForm.validateFields().then((values) => {
        const newPlan = {
          id: String(Date.now()),
          name: generatedPlan.name,
          executeType: generatedPlan.executeType === 'timer' ? '定时' : generatedPlan.executeType === 'period' ? '周期' : '条件',
          cronExpr: generatedPlan.cronExpr,
          executeDesc: generatedPlan.executeDesc,
          status: 'enabled',
          createdAt: new Date().toISOString().split('T')[0],
          creator: '当前用户',
          tasks: [],
        }
        setPlans([newPlan, ...plans])
        setCreateModalVisible(false)
        setCreateStep(1)
        setGeneratedPlan(null)
        form.resetFields()
        message.success('计划发布成功')
      })
    }
  }

  const viewPlanDetail = (plan: any) => {
    setSelectedPlan(plan)
    setDetailModalVisible(true)
  }

  const runPlanNow = (planId: string) => {
    setLoading(true)
    setTimeout(() => {
      setPlans(plans.map(plan => {
        if (plan.id === planId) {
          const newTask = {
            id: `t${Date.now()}`,
            status: 'success',
            startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs().add(10, 'second').format('YYYY-MM-DD HH:mm:ss'),
            duration: '10s',
            result: '手动执行成功',
          }
          return {
            ...plan,
            tasks: [newTask, ...plan.tasks],
          }
        }
        return plan
      }))
      setLoading(false)
      message.success('计划执行成功')
    }, 2000)
  }

  const deletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId))
    message.success('计划删除成功')
  }

  const filteredPlans = plans.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.executeDesc.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const getExecuteTypeTag = (type: string) => {
    const colorMap: Record<string, string> = {
      '定时': 'blue',
      '周期': 'green',
      '条件': 'orange',
    }
    return <Tag color={colorMap[type] || 'default'}>{type}</Tag>
  }

  const getStatusTag = (status: string) => {
    return status === 'enabled' 
      ? <Tag color="success">已启用</Tag>
      : <Tag color="default">已禁用</Tag>
  }

  const getTaskStatusIcon = (status: string) => {
    return status === 'success' 
      ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
      : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold m-0">计划</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setCreateModalVisible(true)}
        >
          创建新计划
        </Button>
      </div>

      <div className="mb-4 flex-shrink-0">
        <Input.Search
          placeholder="搜索计划"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredPlans}
          renderItem={(plan) => (
            <List.Item key={plan.id}>
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <span>{plan.name}</span>
                    {getExecuteTypeTag(plan.executeType)}
                    {getStatusTag(plan.status)}
                  </div>
                }
                extra={
                  <Space>
                    <Switch 
                      checked={plan.status === 'enabled'} 
                      onChange={() => togglePlanStatus(plan.id)}
                      checkedChildren="启用"
                      unCheckedChildren="禁用"
                    />
                    <Button 
                      type="text" 
                      icon={<PlayCircleOutlined />} 
                      onClick={() => runPlanNow(plan.id)}
                      loading={loading}
                    >
                      立即执行
                    </Button>
                    <Button type="text" onClick={() => viewPlanDetail(plan)}>详情</Button>
                    <Popconfirm
                      title="确定要删除这个计划吗？"
                      onConfirm={() => deletePlan(plan.id)}
                      okText="删除"
                      cancelText="取消"
                      okButtonProps={{ danger: true }}
                    >
                      <Button type="text" danger>删除</Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <p className="text-gray-600 mb-2">{plan.executeDesc}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>创建人：{plan.creator}</span>
                  <span>创建时间：{plan.createdAt}</span>
                  <span>已执行：{plan.tasks.length} 次</span>
                  <span>成功率：{plan.tasks.length ? Math.round(plan.tasks.filter(t => t.status === 'success').length / plan.tasks.length * 100) : 0}%</span>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* 创建计划弹窗 */}
      <Modal
        title="创建新计划"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => {
          setCreateModalVisible(false)
          setCreateStep(1)
          setGeneratedPlan(null)
          form.resetFields()
        }}
        okText={createStep === 1 ? '生成计划' : createStep === 2 ? '下一步' : '发布'}
        cancelText="取消"
        width={700}
        confirmLoading={loading}
      >
        <Steps current={createStep - 1} className="mb-6">
          <Step title="生成" description="描述计划需求" />
          <Step title="预览" description="确认计划配置" />
          <Step title="发布" description="完成创建" />
        </Steps>

        {createStep === 1 && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="计划名称"
              rules={[{ required: true, message: '请输入计划名称' }]}
            >
              <Input placeholder="例如：每日运营报表生成" />
            </Form.Item>
            <Form.Item
              name="description"
              label="计划描述"
              rules={[{ required: true, message: '请描述计划的功能' }]}
            >
              <Input.TextArea 
                placeholder="详细描述计划的执行内容，例如：每天上午9点统计前一天的运营数据，生成报表并发送到运营组邮箱" 
                rows={3} 
              />
            </Form.Item>
            <Form.Item
              name="executeType"
              label="执行类型"
              rules={[{ required: true, message: '请选择执行类型' }]}
            >
              <Select placeholder="选择执行类型">
                <Option value="timer">定时执行（一次性）</Option>
                <Option value="period">周期执行（重复）</Option>
                <Option value="condition">条件触发</Option>
              </Select>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.executeType !== curr.executeType}>
              {({ getFieldValue }) => {
                const executeType = getFieldValue('executeType')
                if (executeType === 'timer') {
                  return (
                    <Form.Item
                      name="executeTime"
                      label="执行时间"
                      rules={[{ required: true, message: '请选择执行时间' }]}
                    >
                      <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                  )
                } else if (executeType === 'period') {
                  return (
                    <Space className="w-full" direction="vertical">
                      <Form.Item
                        name="interval"
                        label="执行间隔"
                        rules={[{ required: true, message: '请输入执行间隔' }]}
                      >
                        <Input.Number min={1} style={{ width: 200 }} />
                      </Form.Item>
                      <Form.Item
                        name="intervalUnit"
                        label="间隔单位"
                        rules={[{ required: true, message: '请选择间隔单位' }]}
                        initialValue="hour"
                      >
                        <Select style={{ width: 200 }}>
                          <Option value="minute">分钟</Option>
                          <Option value="hour">小时</Option>
                          <Option value="day">天</Option>
                          <Option value="week">周</Option>
                        </Select>
                      </Form.Item>
                    </Space>
                  )
                } else if (executeType === 'condition') {
                  return (
                    <Form.Item
                      name="condition"
                      label="触发条件"
                      rules={[{ required: true, message: '请输入触发条件' }]}
                    >
                      <Input.TextArea 
                        placeholder="描述触发条件，例如：当系统错误率超过5%时触发" 
                        rows={2} 
                      />
                    </Form.Item>
                  )
                }
                return null
              }}
            </Form.Item>
          </Form>
        )}

        {createStep === 2 && generatedPlan && (
          <div>
            <h4 className="mb-2 font-bold">计划预览</h4>
            <p className="mb-2"><strong>名称：</strong>{generatedPlan.name}</p>
            <p className="mb-2"><strong>描述：</strong>{generatedPlan.description}</p>
            <p className="mb-2"><strong>执行类型：</strong>{generatedPlan.executeType === 'timer' ? '定时执行' : generatedPlan.executeType === 'period' ? '周期执行' : '条件触发'}</p>
            <p className="mb-2"><strong>执行规则：</strong>{generatedPlan.executeDesc}</p>
            {generatedPlan.cronExpr && (
              <p className="mb-2"><strong>Cron 表达式：</strong><code>{generatedPlan.cronExpr}</code></p>
            )}
          </div>
        )}

        {createStep === 3 && (
          <div>
            <p className="mb-4">确认创建计划？创建后计划将自动按配置执行。</p>
          </div>
        )}
      </Modal>

      {/* 计划详情弹窗 */}
      <Modal
        title={`计划详情：${selectedPlan?.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPlan && (
          <div>
            <div className="mb-4">
              <p className="mb-2"><strong>执行规则：</strong>{selectedPlan.executeDesc}</p>
              <p className="mb-2"><strong>状态：</strong>{getStatusTag(selectedPlan.status)}</p>
              <p className="mb-2"><strong>创建人：</strong>{selectedPlan.creator}</p>
              <p className="mb-2"><strong>创建时间：</strong>{selectedPlan.createdAt}</p>
            </div>

            <h4 className="mb-3 font-bold">执行记录</h4>
            {selectedPlan.tasks.length === 0 ? (
              <p className="text-gray-400 text-center py-4">暂无执行记录</p>
            ) : (
              <Timeline>
                {selectedPlan.tasks.map((task: any) => (
                  <Timeline.Item key={task.id} dot={getTaskStatusIcon(task.status)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="mb-1 font-medium">
                          {task.status === 'success' ? '执行成功' : '执行失败'}
                          <Tag color={task.status === 'success' ? 'success' : 'error'} className="ml-2">
                            {task.duration}
                          </Tag>
                        </p>
                        <p className="text-sm text-gray-600 mb-1">{task.result}</p>
                        <p className="text-xs text-gray-500">{task.startTime} - {task.endTime}</p>
                      </div>
                      <Button type="link" size="small">查看详情</Button>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PlanPage
