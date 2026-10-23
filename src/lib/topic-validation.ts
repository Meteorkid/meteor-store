import { z } from 'zod';
import { blogSections } from '@/data/blog-sections';

/** 只有开放提议的分区能收提议，白名单从分区配置推导 */
const PROPOSABLE_SECTION_IDS = blogSections
  .filter((s) => s.allowProposals)
  .map((s) => s.id) as [string, ...string[]];

export const TopicProposalSchema = z.object({
  sectionId: z.enum(PROPOSABLE_SECTION_IDS),
  title: z.string().trim().min(4, '话题标题太短了').max(80, '话题标题不要超过 80 字'),
  pitch: z.string().trim().min(10, '再多写几句为什么值得写').max(1000, '先写个梗概就好，不要超过 1000 字'),
  email: z.string().email('邮箱格式不对').max(254).optional(),
});
