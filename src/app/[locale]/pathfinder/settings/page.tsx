import type { Metadata } from 'next';
import PathfinderSettingsClient from './PathfinderSettingsClient';

export const metadata: Metadata = {
  title: '模型配置 · Meteor Pathfinder',
  description: '为 Meteor Pathfinder 配置你自己的兼容模型服务。',
  robots: { index: false, follow: false },
};

export default function PathfinderSettingsPage() {
  return <PathfinderSettingsClient />;
}
