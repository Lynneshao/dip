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

const KnowledgePage = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">知识</h2>
    <p className="text-gray-600">这里可以管理数字员工的业务知识，支持从 BKN 选择或动态补充。</p>
  </div>
)

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
