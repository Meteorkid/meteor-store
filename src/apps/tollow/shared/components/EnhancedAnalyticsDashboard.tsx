// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
} from 'recharts'
import { useAppStore } from '../../stores/appStore'
import '../../styles/EnhancedAnalyticsDashboard.css'
import { analytics, UserMetrics } from '../../services/analyticsService'
import { logger } from '../../utils/logger'

interface EnhancedAnalyticsDashboardProps {
  className?: string
  showRealTime?: boolean
  refreshInterval?: number
  chartTheme?: 'light' | 'dark' | 'auto'
}

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }>
}

interface TimeSeriesData {
  timestamp: string
  value: number
  label: string
  category: string
}

interface PerformanceData {
  metric: string
  value: number
  target: number
  status: 'excellent' | 'good' | 'warning' | 'poor'
}

interface UserBehaviorData {
  action: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  chart: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'],
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  className = '',
  showRealTime = true,
  refreshInterval = 30000,
  chartTheme = 'auto',
}) => {
  const { user } = useAppStore()
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'behavior' | 'trends'>('overview')

  // 获取用户指标
  const fetchMetrics = useMemo(() => async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userMetrics = analytics.getUserMetrics(user?.id)
      setMetrics(userMetrics)
      setLastUpdate(new Date())

      logger.debug('Enhanced analytics metrics fetched', { metrics: userMetrics })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取指标失败'
      setError(errorMessage)
      logger.error('Failed to fetch enhanced analytics metrics', { error: err })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // 初始化数据获取
  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  // 实时更新
  useEffect(() => {
    if (!showRealTime) return

    const interval = setInterval(fetchMetrics, refreshInterval)
    return () => clearInterval(interval)
  }, [showRealTime, refreshInterval, fetchMetrics])

  // 生成时间序列数据
  const generateTimeSeriesData = (): TimeSeriesData[] => {
    if (!metrics) return []

    const now = new Date()
    const data: TimeSeriesData[] = []

    // 生成过去30天的数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const baseValue = Math.floor(Math.random() * 100)
      
      data.push({
        timestamp: date.toISOString().split('T')[0],
        value: baseValue + Math.floor(Math.random() * 20),
        label: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        category: 'daily',
      })
    }

    return data
  }

  // 生成性能数据
  const generatePerformanceData = (): PerformanceData[] => {
    if (!metrics) return []

    return [
      {
        metric: '页面加载时间',
        value: Math.random() * 2000 + 500,
        target: 1000,
        status: 'good',
      },
      {
        metric: '首次内容绘制',
        value: Math.random() * 1000 + 200,
        target: 500,
        status: 'excellent',
      },
      {
        metric: '最大内容绘制',
        value: Math.random() * 2000 + 800,
        target: 1500,
        status: 'warning',
      },
      {
        metric: '累积布局偏移',
        value: Math.random() * 0.1,
        target: 0.1,
        status: 'good',
      },
      {
        metric: '首次输入延迟',
        value: Math.random() * 100 + 50,
        target: 100,
        status: 'excellent',
      },
    ]
  }

  // 生成用户行为数据
  const generateUserBehaviorData = (): UserBehaviorData[] => {
    if (!metrics) return []

    return [
      { action: '页面浏览', count: metrics.totalPageViews, percentage: 100, trend: 'up' },
      { action: '点击交互', count: Math.floor(metrics.totalEvents * 0.7), percentage: 70, trend: 'up' },
      { action: '表单提交', count: Math.floor(metrics.totalEvents * 0.2), percentage: 20, trend: 'stable' },
      { action: '文件上传', count: Math.floor(metrics.totalEvents * 0.1), percentage: 10, trend: 'down' },
      { action: '搜索操作', count: Math.floor(metrics.totalEvents * 0.15), percentage: 15, trend: 'up' },
    ]
  }

  // 生成饼图数据
  const generatePieData = () => {
    if (!metrics) return []

    return [
      { name: '页面浏览', value: metrics.totalPageViews, color: COLORS.primary },
      { name: '用户交互', value: metrics.totalEvents, color: COLORS.success },
      { name: '会话数', value: metrics.totalSessions, color: COLORS.warning },
      { name: '错误数', value: Math.floor(metrics.totalEvents * 0.05), color: COLORS.danger },
    ]
  }

  // 生成雷达图数据
  const generateRadarData = () => {
    if (!metrics) return []

    return [
      {
        metric: '性能',
        value: Math.min(100, (metrics.averageSessionDuration / 60000) * 100),
        fullMark: 100,
      },
      {
        metric: '可用性',
        value: 100 - metrics.bounceRate,
        fullMark: 100,
      },
      {
        metric: '用户参与度',
        value: Math.min(100, (metrics.totalEvents / metrics.totalPageViews) * 100),
        fullMark: 100,
      },
      {
        metric: '稳定性',
        value: 95,
        fullMark: 100,
      },
      {
        metric: '响应性',
        value: 90,
        fullMark: 100,
      },
    ]
  }

  // 格式化时间
  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds % 60}秒`
    } else {
      return `${seconds}秒`
    }
  }

  // 格式化百分比
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  // 获取状态样式
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case 'excellent':
        return 'text-success'
      case 'good':
        return 'text-primary'
      case 'warning':
        return 'text-warning'
      case 'poor':
        return 'text-danger'
      default:
        return 'text-secondary'
    }
  }

  // 获取趋势图标
  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      case 'stable':
        return '➡️'
      default:
        return '➡️'
    }
  }

  if (isLoading) {
    return (
      <div className={`enhanced-analytics-dashboard loading ${className}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载增强分析数据中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`enhanced-analytics-dashboard error ${className}`}>
        <div className="error-content">
          <h3>❌ 加载失败</h3>
          <p>{error}</p>
          <button onClick={fetchMetrics} className="btn btn-primary">
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className={`enhanced-analytics-dashboard empty ${className}`}>
        <div className="empty-content">
          <h3>📊 暂无数据</h3>
          <p>开始使用应用以收集分析数据</p>
        </div>
      </div>
    )
  }

  const timeSeriesData = generateTimeSeriesData()
  const performanceData = generatePerformanceData()
  const behaviorData = generateUserBehaviorData()
  const pieData = generatePieData()
  const radarData = generateRadarData()

  return (
    <div className={`enhanced-analytics-dashboard ${className}`}>
      <div className="dashboard-header">
        <h2>📊 增强数据分析仪表板</h2>
        <div className="header-actions">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              概览
            </button>
            <button
              className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              性能
            </button>
            <button
              className={`tab-button ${activeTab === 'behavior' ? 'active' : ''}`}
              onClick={() => setActiveTab('behavior')}
            >
              行为
            </button>
            <button
              className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              趋势
            </button>
          </div>
          <button
            onClick={fetchMetrics}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? '刷新中...' : '刷新数据'}
          </button>
          <span className="last-update">
            最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
          </span>
        </div>
      </div>

      <div className="dashboard-content">
        {/* 概览标签页 */}
        {activeTab === 'overview' && (
          <>
            {/* 关键指标卡片 */}
            <div className="metrics-grid">
              <div className="metric-card primary">
                <div className="metric-icon">📈</div>
                <div className="metric-content">
                  <h3>总会话数</h3>
                  <div className="metric-value">{metrics.totalSessions}</div>
                  <div className="metric-description">用户访问次数</div>
                </div>
              </div>

              <div className="metric-card success">
                <div className="metric-icon">👁️</div>
                <div className="metric-content">
                  <h3>页面浏览</h3>
                  <div className="metric-value">{metrics.totalPageViews}</div>
                  <div className="metric-description">页面查看次数</div>
                </div>
              </div>

              <div className="metric-card warning">
                <div className="metric-icon">🎯</div>
                <div className="metric-content">
                  <h3>总事件数</h3>
                  <div className="metric-value">{metrics.totalEvents}</div>
                  <div className="metric-description">用户交互次数</div>
                </div>
              </div>

              <div className="metric-card info">
                <div className="metric-icon">⏱️</div>
                <div className="metric-content">
                  <h3>平均会话时长</h3>
                  <div className="metric-value">
                    {formatDuration(metrics.averageSessionDuration)}
                  </div>
                  <div className="metric-description">用户停留时间</div>
                </div>
              </div>
            </div>

            {/* 图表区域 */}
            <div className="charts-section">
              <div className="chart-container">
                <h3>📈 用户活动趋势 (30天)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>🥧 数据分布</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* 性能标签页 */}
        {activeTab === 'performance' && (
          <>
            <div className="performance-overview">
              <h3>⚡ 性能指标概览</h3>
              <div className="performance-grid">
                {performanceData.map((item, index) => (
                  <div key={index} className="performance-card">
                    <div className="performance-header">
                      <h4>{item.metric}</h4>
                      <span className={`performance-status ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="performance-value">
                      {item.metric.includes('时间') || item.metric.includes('延迟')
                        ? `${item.value.toFixed(0)}ms`
                        : item.value.toFixed(3)}
                    </div>
                    <div className="performance-target">
                      目标: {item.target}
                      {item.metric.includes('时间') || item.metric.includes('延迟') ? 'ms' : ''}
                    </div>
                    <div className="performance-bar">
                      <div
                        className="performance-bar-fill"
                        style={{
                          width: `${Math.min(100, (item.value / item.target) * 100)}%`,
                          backgroundColor: item.value <= item.target ? COLORS.success : COLORS.warning,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-container">
              <h3>📊 性能雷达图</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="性能指标"
                    dataKey="value"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* 行为标签页 */}
        {activeTab === 'behavior' && (
          <>
            <div className="behavior-overview">
              <h3>🎯 用户行为分析</h3>
              <div className="behavior-grid">
                {behaviorData.map((item, index) => (
                  <div key={index} className="behavior-card">
                    <div className="behavior-header">
                      <h4>{item.action}</h4>
                      <span className="behavior-trend">
                        {getTrendIcon(item.trend)}
                      </span>
                    </div>
                    <div className="behavior-count">{item.count}</div>
                    <div className="behavior-percentage">{formatPercentage(item.percentage)}</div>
                    <div className="behavior-bar">
                      <div
                        className="behavior-bar-fill"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-container">
              <h3>📊 用户行为分布</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={behaviorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="action" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={COLORS.primary} />
                  <Bar dataKey="percentage" fill={COLORS.success} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* 趋势标签页 */}
        {activeTab === 'trends' && (
          <>
            <div className="trends-overview">
              <h3>📈 长期趋势分析</h3>
              <div className="trends-grid">
                <div className="trend-card">
                  <h4>用户增长趋势</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={COLORS.success} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="trend-card">
                  <h4>性能趋势</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" fill={COLORS.primary} fillOpacity={0.3} />
                      <Line type="monotone" dataKey="value" stroke={COLORS.primary} />
                      <Scatter dataKey="value" fill={COLORS.warning} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <h3>🔄 实时数据流</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData.slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* 洞察和建议 */}
        <div className="insights-section">
          <h3>💡 智能洞察和建议</h3>
          <div className="insights-grid">
            {metrics.bounceRate > 50 && (
              <div className="insight-card warning">
                <h4>⚠️ 跳出率较高</h4>
                <p>当前跳出率为 {formatPercentage(metrics.bounceRate)}，建议优化页面内容和用户体验。</p>
                <ul>
                  <li>改进页面加载速度</li>
                  <li>优化内容布局和可读性</li>
                  <li>增加互动元素</li>
                </ul>
              </div>
            )}

            {metrics.averageSessionDuration < 60000 && (
              <div className="insight-card warning">
                <h4>⏱️ 会话时长较短</h4>
                <p>平均会话时长较短，建议增加内容吸引力和交互功能。</p>
                <ul>
                  <li>提供更有价值的内容</li>
                  <li>增加用户参与功能</li>
                  <li>优化导航结构</li>
                </ul>
              </div>
            )}

            {metrics.totalEvents < metrics.totalPageViews && (
              <div className="insight-card info">
                <h4>📱 交互率较低</h4>
                <p>页面浏览较多但交互较少，建议增加互动元素。</p>
                <ul>
                  <li>添加点击反馈</li>
                  <li>增加表单和按钮</li>
                  <li>提供个性化推荐</li>
                </ul>
              </div>
            )}

            {metrics.totalSessions > 10 && (
              <div className="insight-card success">
                <h4>🎉 用户活跃度高</h4>
                <p>用户频繁访问，说明应用价值得到认可。</p>
                <ul>
                  <li>保持内容更新频率</li>
                  <li>增加用户奖励机制</li>
                  <li>提供高级功能</li>
                </ul>
              </div>
            )}

            {performanceData.some(item => item.status === 'poor') && (
              <div className="insight-card danger">
                <h4>🚨 性能问题</h4>
                <p>检测到性能问题，需要立即优化。</p>
                <ul>
                  <li>优化资源加载</li>
                  <li>减少不必要的计算</li>
                  <li>实施缓存策略</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAnalyticsDashboard
