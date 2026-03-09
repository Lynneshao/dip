import { MessageOutlined, SearchOutlined, SettingOutlined, WechatOutlined, DingtalkOutlined, QqOutlined } from '@ant-design/icons'
import { Button, Input, List, Card, Switch, Space, Tag, Tabs, Empty, Avatar } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'

const { TabPane } = Tabs

// Mock 通道配置
const mockChannels = [
  {
    id: 'feishu',
    name: '飞书',
    icon: <WechatOutlined />,
    enabled: true,
    config: {
      botName: '运营小助手',
      webhook: 'https://open.feishu.cn/webhook/xxx',
    },
  },
  {
    id: 'dingtalk',
    name: '钉钉',
    icon: <DingtalkOutlined />,
    enabled: false,
    config: {},
  },
  {
    id: 'wecom',
    name: '企业微信',
    icon: <QqOutlined />,
    enabled: false,
    config: {},
  },
]

// Mock 会话列表
const mockSessions = [
  {
    id: 's1',
    channel: 'feishu',
    channelName: '飞书',
    title: '运营群',
    type: 'group',
    lastMessage: '好的，我马上生成昨天的运营报表',
    lastMessageTime: '2026-03-09 10:30:00',
    unreadCount: 0,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: '张三',
        content: '帮我生成昨天的运营报表',
        time: '2026-03-09 10:29:00',
      },
      {
        id: 'm2',
        sender: 'ai',
        senderName: '运营小助手',
        content: '好的，我马上生成昨天的运营报表，请稍候...',
        time: '2026-03-09 10:29:05',
      },
      {
        id: 'm3',
        sender: 'ai',
        senderName: '运营小助手',
        content: '报表已生成，已发送到你的邮箱，请查收。',
        time: '2026-03-09 10:30:00',
      },
    ],
  },
  {
    id: 's2',
    channel: 'feishu',
    channelName: '飞书',
    title: '李四',
    type: 'private',
    lastMessage: '用户活跃度周统计已经完成，报告已上传到共享文件夹',
    lastMessageTime: '2026-03-08 18:05:00',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: '李四',
        content: '这周的用户活跃度统计出来了吗？',
        time: '2026-03-08 18:00:00',
      },
      {
        id: 'm2',
        sender: 'ai',
        senderName: '运营小助手',
        content: '正在统计中，请稍候...',
        time: '2026-03-08 18:00:10',
      },
      {
        id: 'm3',
        sender: 'ai',
        senderName: '运营小助手',
        content: '用户活跃度周统计已经完成，报告已上传到共享文件夹：https://example.com/report.pdf',
        time: '2026-03-08 18:05:00',
      },
    ],
  },
]

const SessionPage: React.FC = () => {
  const [channels, setChannels] = useState(mockChannels)
  const [sessions, setSessions] = useState(mockSessions)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeTab, setActiveTab] = useState('list')
  const [selectedSession, setSelectedSession] = useState<any>(mockSessions[0])

  const toggleChannelStatus = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ))
  }

  const filteredSessions = sessions.filter(item => 
    item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.lastMessage.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const getChannelIcon = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId)
    return channel?.icon || <MessageOutlined />
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold m-0">会话</h2>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="flex-shrink-0">
        <TabPane tab="会话列表" key="list" />
        <TabPane tab="通道配置" key="config" />
      </Tabs>

      {activeTab === 'list' && (
        <div className="flex-1 min-h-0 flex gap-4">
          {/* 左侧会话列表 */}
          <div className="w-1/3 border rounded bg-white flex flex-col">
            <div className="p-3 border-b flex-shrink-0">
              <Input.Search
                placeholder="搜索会话"
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-auto">
              <List
                dataSource={filteredSessions}
                renderItem={(session) => (
                  <List.Item
                    key={session.id}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedSession?.id === session.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex justify-between w-full">
                      <div className="flex items-start gap-2">
                        <Avatar icon={getChannelIcon(session.channel)} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{session.title}</span>
                            <Tag size="small" color={session.type === 'group' ? 'blue' : 'green'}>
                              {session.type === 'group' ? '群聊' : '私聊'}
                            </Tag>
                            {session.unreadCount > 0 && (
                              <Tag size="small" color="red">{session.unreadCount}</Tag>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{session.lastMessage}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {dayjs(session.lastMessageTime).format('HH:mm')}
                      </span>
                    </div>
                  </List.Item>
                )}
                locale={{ emptyText: <Empty description="暂无会话" /> }}
              />
            </div>
          </div>

          {/* 右侧会话详情 */}
          <div className="flex-1 border rounded bg-white flex flex-col">
            {selectedSession ? (
              <>
                <div className="p-3 border-b flex justify-between items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Avatar icon={getChannelIcon(selectedSession.channel)} />
                    <span className="font-medium">{selectedSession.title}</span>
                    <Tag size="small">{selectedSession.channelName}</Tag>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {selectedSession.messages.map((message: any) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 max-w-[70%] ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                    >
                      <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar 
                          style={{ backgroundColor: message.sender === 'user' ? '#1890ff' : '#52c41a' }}
                        >
                          {message.senderName.charAt(0)}
                        </Avatar>
                        <div>
                          <div className={`text-xs text-gray-500 mb-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                            {message.senderName} · {dayjs(message.time).format('HH:mm')}
                          </div>
                          <div 
                            className={`p-3 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-blue-500 text-white rounded-tr-none' 
                                : 'bg-gray-100 rounded-tl-none'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <Empty description="请选择一个会话查看详情" />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="flex-1 min-h-0">
          <Card title="通道配置" className="h-full">
            <List
              dataSource={channels}
              renderItem={(channel) => (
                <List.Item
                  key={channel.id}
                  actions={[
                    <Switch 
                      checked={channel.enabled} 
                      onChange={() => toggleChannelStatus(channel.id)}
                      checkedChildren="已启用"
                      unCheckedChildren="已禁用"
                    />,
                    <Button type="text" icon={<SettingOutlined />}>配置</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar size="large" icon={channel.icon} />}
                    title={channel.name}
                    description={channel.enabled ? '已连接' : '未启用'}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      )}
    </div>
  )
}

export default SessionPage
