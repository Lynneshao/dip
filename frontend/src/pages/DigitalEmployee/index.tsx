import { ReloadOutlined } from '@ant-design/icons'
import { Button, message, Spin, Tooltip } from 'antd'
import { memo, useState } from 'react'
import Empty from '@/components/Empty'
import SearchInput from '@/components/SearchInput'

const DigitalEmployee = () => {
  const [loading, setLoading] = useState(false)
  const [, messageContextHolder] = message.useMessage()

  const handleSearch = (_value: string) => {
    // TODO: 实现搜索逻辑
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const renderStateContent = () => {
    if (loading) {
      return <Spin size="large" />
    }

    return (
      <Empty
        title="数字员工"
        subDesc="数字员工功能正在开发中，敬请期待..."
      />
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
        </div>
      </div>
      <div className="flex-1 min-h-0 relative flex flex-col items-center justify-center">
        {renderStateContent()}
      </div>
    </div>
  )
}

export default memo(DigitalEmployee)
