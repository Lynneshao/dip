import { SaveOutlined } from '@ant-design/icons'
import { Button, Card, message } from 'antd'
import { useState } from 'react'
import TiptapEditor from '@/components/TiptapEditor'

interface SettingPageProps {
  employee: any
  onSave: (content: string) => void
}

const SettingPage: React.FC<SettingPageProps> = ({ employee, onSave }) => {
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

export default SettingPage
