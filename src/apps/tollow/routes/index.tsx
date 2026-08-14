// @ts-nocheck
/* eslint-disable */
import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { useAppStore } from '../stores/appStore'
import LoadingSpinner from '../shared/components/LoadingSpinner'
import ErrorBoundary from '../shared/components/ErrorBoundary'

// 懒加载组件
const Library = React.lazy(() => import('../features/library/Library'))
const BookDetails = React.lazy(() => import('../features/library/BookDetails'))
const Upload = React.lazy(() => import('../features/upload/Upload'))
const Practice = React.lazy(() => import('../features/typing/Practice'))
const Profile = React.lazy(() => import('../features/profile/Profile'))
const Settings = React.lazy(() => import('../features/settings/Settings'))
const NotFound = React.lazy(() => import('../shared/components/NotFound'))
const EnhancedAnalyticsDashboard = React.lazy(() => import('../shared/components/EnhancedAnalyticsDashboard'))

// 路由守卫组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppStore((state) => state.user)
  
  if (!user) {
    return <Navigate to="/library" replace />
  }
  
  return <>{children}</>
}

// 加载组件
const LoadingFallback: React.FC = () => (
  <div className="loading-container">
    <LoadingSpinner size="large" text="页面加载中..." />
  </div>
)

// 路由配置
export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* 默认路由 */}
          <Route path="/" element={<Navigate to="/library" replace />} />
          
          {/* 主要功能路由 */}
          <Route path="/library" element={<Library />} />
          <Route path="/library/:bookId" element={<BookDetails />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/analytics" element={<EnhancedAnalyticsDashboard />} />
          
          {/* 需要认证的路由 */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* 404页面 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

// 路由常量
export const ROUTES = {
  HOME: '/',
  LIBRARY: '/library',
  BOOK_DETAILS: (bookId: string) => `/library/${bookId}`,
  UPLOAD: '/upload',
  PRACTICE: '/practice',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

// 路由配置类型
export interface RouteConfig {
  path: string
  name: string
  icon: string
  component: React.LazyExoticComponent<React.ComponentType<any>>
  protected?: boolean
  children?: RouteConfig[]
}

// 路由配置数组
export const routeConfigs: RouteConfig[] = [
  {
    path: ROUTES.LIBRARY,
    name: '书库',
    icon: '📚',
    component: Library,
  },
  {
    path: ROUTES.UPLOAD,
    name: '上传',
    icon: '📁',
    component: Upload,
  },
  {
    path: ROUTES.PRACTICE,
    name: '练习',
    icon: '⌨️',
    component: Practice,
  },
  {
    path: ROUTES.PROFILE,
    name: '个人资料',
    icon: '👤',
    component: Profile,
    protected: true,
  },
  {
    path: ROUTES.SETTINGS,
    name: '设置',
    icon: '⚙️',
    component: Settings,
    protected: true,
  },
]
