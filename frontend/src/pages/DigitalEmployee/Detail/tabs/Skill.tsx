import { PlusOutlined, PlayCircleOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, List, Card, Modal, Form, Input as AntInput, Space, Tag, message, Steps, Collapse } from 'antd'
import { useState } from 'react'

const { TextArea } = AntInput
const { Step } = Steps

// Mock 技能数据
const mockSkills = [
  {
    id: '1',
    name: '生成运营报表',
    description: '自动统计一周运营数据，生成 PDF 报表并发送邮件',
    version: 'v1.0.0',
    publishDesc: '初始版本，支持日报、周报生成',
    createdAt: '2026-03-05',
    creator: '张三',
    script: `import pandas as pd
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def generate_operation_report(date_range: str = "7d"):
    """
    生成运营报表
    :param date_range: 时间范围，支持 1d, 7d, 30d
    """
    # 1. 从数据库查询数据
    df = pd.read_sql(f"SELECT * FROM operation_data WHERE date >= DATE_SUB(NOW(), INTERVAL {date_range[:-1]}) DAY")
    
    # 2. 生成统计报表
    report = df.describe().to_html()
    
    # 3. 生成 PDF
    # TODO: 集成 PDF 生成逻辑
    
    # 4. 发送邮件
    send_email(report)
    
    return {"status": "success", "message": "报表生成并发送成功"}`,
  },
  {
    id: '2',
    name: '用户问题解答',
    description: '根据用户问题，从知识库中查找答案并回复',
    version: 'v2.1.0',
    publishDesc: '优化了匹配算法，准确率提升到95%',
    createdAt: '2026-03-08',
    creator: '李四',
    script: `from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

def answer_user_question(question: str):
    """
    解答用户问题
    :param question: 用户问题
    """
    # 1. 加载知识库
    embeddings = OpenAIEmbeddings()
    db = Chroma(persist_directory="./knowledge_base", embedding_function=embeddings)
    
    # 2. 相似度搜索
    docs = db.similarity_search(question, k=3)
    
    # 3. 生成答案
    answer = generate_answer(question, docs)
    
    return {"status": "success", "answer": answer}`,
  },
]

const SkillPage: React.FC = () => {
  const [skills, setSkills] = useState(mockSkills)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [testingSkill, setTestingSkill] = useState<any>(null)
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState('')
  const [testing, setTesting] = useState(false)
  const [createStep, setCreateStep] = useState(1) // 1: 生成, 2: 预览, 3: 发布
  const [generatedSkill, setGeneratedSkill] = useState<any>(null)
  const [form] = Form.useForm()
  const [publishForm] = Form.useForm()

  const handleCreate = () => {
    if (createStep === 1) {
      // 模拟生成技能
      form.validateFields().then((values) => {
        setTesting(true)
        setTimeout(() => {
          setGeneratedSkill({
            name: values.name || '新技能',
            description: values.description,
            script: `# 自动生成的技能脚本
# ${values.name}
# 描述：${values.description}

def execute():
    print("技能执行成功")
    return {"status": "success"}`,
            version: 'v0.0.1',
          })
          setCreateStep(2)
          setTesting(false)
        }, 2000)
      })
    } else if (createStep === 2) {
      // 预览后到发布步骤
      setCreateStep(3)
    } else if (createStep === 3) {
      // 发布技能
      publishForm.validateFields().then((values) => {
        const newSkill = {
          id: String(Date.now()),
          name: generatedSkill.name,
          description: generatedSkill.description,
          version: values.version,
          publishDesc: values.description,
          createdAt: new Date().toISOString().split('T')[0],
          creator: '当前用户',
          script: generatedSkill.script,
        }
        setSkills([newSkill, ...skills])
        setCreateModalVisible(false)
        setCreateStep(1)
        setGeneratedSkill(null)
        form.resetFields()
        publishForm.resetFields()
        message.success('技能发布成功')
      })
    }
  }

  const handleTest = (skill: any) => {
    setTestingSkill(skill)
    setTestInput('')
    setTestResult('')
    setTestModalVisible(true)
  }

  const runTest = () => {
    if (!testInput.trim()) {
      message.warning('请输入测试参数')
      return
    }
    setTesting(true)
    setTimeout(() => {
      setTestResult(`执行结果：
{
  "status": "success",
  "data": "测试执行成功",
  "input": "${testInput}",
  "timestamp": "${new Date().toISOString()}"
}`)
      setTesting(false)
    }, 1500)
  }

  const filteredSkills = skills.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.description.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold m-0">技能</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setCreateModalVisible(true)}
        >
          创建新技能
        </Button>
      </div>

      <div className="mb-4 flex-shrink-0">
        <Input.Search
          placeholder="搜索技能"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredSkills}
          renderItem={(skill) => (
            <List.Item key={skill.id}>
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <span>{skill.name}</span>
                    <Tag color="blue">{skill.version}</Tag>
                  </div>
                }
                extra={
                  <Space>
                    <Button 
                      type="text" 
                      icon={<PlayCircleOutlined />} 
                      onClick={() => handleTest(skill)}
                    >
                      测试
                    </Button>
                    <Button type="text" icon={<EditOutlined />}>编辑</Button>
                    <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
                  </Space>
                }
              >
                <p className="text-gray-600 mb-3">{skill.description}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>创建人：{skill.creator}</span>
                  <span>创建时间：{skill.createdAt}</span>
                </div>
                <Collapse ghost>
                  <Collapse.Panel header="查看脚本" key="1">
                    <pre className="bg-gray-900 text-white p-4 rounded overflow-auto max-h-60 text-sm">
                      <code>{skill.script}</code>
                    </pre>
                  </Collapse.Panel>
                </Collapse>
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* 创建技能弹窗 */}
      <Modal
        title="创建新技能"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => {
          setCreateModalVisible(false)
          setCreateStep(1)
          setGeneratedSkill(null)
          form.resetFields()
          publishForm.resetFields()
        }}
        okText={createStep === 1 ? '生成技能' : createStep === 2 ? '下一步' : '发布'}
        cancelText="取消"
        width={800}
        confirmLoading={testing}
      >
        <Steps current={createStep - 1} className="mb-6">
          <Step title="生成" description="描述技能需求" />
          <Step title="预览" description="确认技能内容" />
          <Step title="发布" description="填写版本信息" />
        </Steps>

        {createStep === 1 && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="技能名称"
              rules={[{ required: true, message: '请输入技能名称' }]}
            >
              <Input placeholder="例如：生成运营报表" />
            </Form.Item>
            <Form.Item
              name="description"
              label="技能描述"
              rules={[{ required: true, message: '请描述技能的功能' }]}
            >
              <TextArea 
                placeholder="详细描述技能的功能和使用场景，例如：自动统计一周运营数据，生成 PDF 报表并发送给相关人员" 
                rows={4} 
              />
            </Form.Item>
          </Form>
        )}

        {createStep === 2 && generatedSkill && (
          <div>
            <h4 className="mb-2 font-bold">技能预览</h4>
            <p className="mb-4"><strong>名称：</strong>{generatedSkill.name}</p>
            <p className="mb-4"><strong>描述：</strong>{generatedSkill.description}</p>
            <p className="mb-2 font-bold">脚本：</p>
            <pre className="bg-gray-900 text-white p-4 rounded overflow-auto max-h-60 text-sm">
              <code>{generatedSkill.script}</code>
            </pre>
          </div>
        )}

        {createStep === 3 && (
          <Form form={publishForm} layout="vertical">
            <Form.Item
              name="version"
              label="版本号"
              rules={[{ required: true, message: '请输入版本号' }]}
              initialValue="v0.0.1"
            >
              <Input placeholder="遵循语义版本规则，例如：v1.0.0" />
            </Form.Item>
            <Form.Item
              name="description"
              label="发布描述"
              rules={[{ required: true, message: '请输入发布描述' }]}
            >
              <TextArea 
                placeholder="描述此版本的更新内容，不超过400字" 
                rows={3} 
                maxLength={400}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 测试技能弹窗 */}
      <Modal
        title={`测试技能：${testingSkill?.name}`}
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={null}
        width={800}
      >
        {testingSkill && (
          <div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">测试参数</label>
              <TextArea 
                placeholder="输入测试参数，JSON 格式或者自然语言描述" 
                rows={3}
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end mb-4">
              <Button 
                type="primary" 
                onClick={runTest} 
                loading={testing}
                disabled={!testInput.trim()}
              >
                运行测试
              </Button>
            </div>

            {testResult && (
              <div>
                <label className="block mb-2 font-medium">执行结果</label>
                <pre className="bg-gray-900 text-white p-4 rounded overflow-auto max-h-60 text-sm">
                  <code>{testResult}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SkillPage
