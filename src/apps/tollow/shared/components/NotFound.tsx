// @ts-nocheck
/* eslint-disable */
import React from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../routes'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(ROUTES.LIBRARY)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>页面未找到</h2>
        <p>抱歉，您访问的页面不存在或已被移除。</p>
        
        <div className="not-found-actions">
          <button onClick={handleGoHome} className="btn btn-primary">
            返回首页
          </button>
          <button onClick={handleGoBack} className="btn btn-secondary">
            返回上页
          </button>
        </div>
        
        <div className="not-found-suggestions">
          <h3>您可以尝试：</h3>
          <ul>
            <li>检查URL是否正确</li>
            <li>返回上一页</li>
            <li>访问书库页面</li>
            <li>联系技术支持</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NotFound
