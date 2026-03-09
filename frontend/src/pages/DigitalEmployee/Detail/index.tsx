import { ArrowLeftOutlined, SettingOutlined, BookOutlined, ThunderboltOutlined, CalendarOutlined, MessageOutlined } from '@ant-design/icons'
import { Button, Menu, Spin, message } from 'antd'
import { memo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import SettingPage from './tabs/Setting'
import KnowledgePage from './tabs/Knowledge'
import SkillPage from './tabs/Skill'
import PlanPage from './tabs/Plan'
import SessionPage from './tabs/Session'

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

const getMenuItems = (employeeId: string): MenuItem[] => [
  {
    key: 'setting',
    icon: <SettingOutlined />,
    label: '设定',
    onClick: () => window.location.href = `/studio/digital-employee/${employeeId}/setting`,
  },
  {
    key: 'knowledge',
    icon: <BookOutlined />,
    label: '知识',
    onClick: () => window.location.href = `/studio/digital-employee/${employeeId}/knowledge`,
  },
  {
    key: 'skill',
    icon: <ThunderboltOutlined />,
    label: '技能',
    onClick: () => window.location.href = `/studio/digital-employee/${employeeId}/skill`,
  },
  {
    key: 'plan',
    icon: <CalendarOutlined />,
    label: '计划',
    onClick: () => window.location.href = `/studio/digital-employee/${employeeId}/plan`,
  },
  {
    key: 'session',
    icon: <MessageOutlined />,
    label: '会话',
    onClick: () => window.location.href = `/studio/digital-employee/${employeeId}/session`,
  },
]

const DigitalEmployeeDetail = () => {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id || window.location.pathname.split('/')[3]
  const tab = params.tab || window.location.pathname.split('/')[4] || 'setting'
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState(mockEmployeeDetail)
  const [, messageContextHolder] = message.useMessage()

  useEffect(() => {
    // 模拟加载数据
    setLoading(true)
    setTimeout(() => {
      setEmployee(mockEmployeeDetail)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleBack = () => {
    navigate('/studio/digital-employee')
  }

  const handleSaveSetting = (content: string) => {
    setEmployee(prev => ({
      ...prev,
      settingContent: content,
    }))
  }

  const renderContent = () => {
    switch (tab) {
      case 'setting':
        return <SettingPage employee={employee} onSave={handleSaveSetting} />
      case 'knowledge':
        return <KnowledgePage />
      case 'skill':
        return <SkillPage />
      case 'plan':
        return <PlanPage />
      case 'session':
        return <SessionPage />
      default:
        return <SettingPage employee={employee} onSave={handleSaveSetting} />
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4">加载中...</p>
        </div>
      </div>
    )
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
            items={getMenuItems(id as string)}
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
