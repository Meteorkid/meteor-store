import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { blogPublishingOpenApi } from '../blog-api-openapi';
import { BlogApiCreatePostSchema, BlogApiUpdatePostSchema } from '../post-validation';

const guide = readFileSync(join(process.cwd(), 'docs/blog-publishing-api.md'), 'utf8');

describe('博客发布 API 指南', () => {
  it('创建草稿示例满足真实服务端 Schema', () => {
    const match = /--data '(\{[\s\S]*?\})'\n```/.exec(guide);
    expect(match).not.toBeNull();
    const example = JSON.parse(match?.[1] ?? '{}');

    expect(BlogApiCreatePostSchema.safeParse(example).success).toBe(true);
  });

  it('不建议把 PAT 明文写进 shell 历史', () => {
    expect(guide).not.toMatch(/export METEOR_BLOG_TOKEN=['\"]/);
    expect(guide).toContain('read -r -s METEOR_BLOG_TOKEN');
  });

  it('PATCH 示例用 rawfile 安全生成请求，并在发送前检查正文长度', () => {
    const match = /```bash\n([\s\S]*?-X PATCH[\s\S]*?)\n```/.exec(guide);
    expect(match).not.toBeNull();
    const example = match?.[1] ?? '';

    expect(example).toContain('--rawfile content /absolute/path/article.md');
    expect(example).toContain('--arg expectedUpdatedAt "$EXPECTED_UPDATED_AT"');
    expect(example).toContain('length) < 200');
    expect(example).toContain('{expectedUpdatedAt: $expectedUpdatedAt, content: $content}');
    expect(example).toContain('PATCH_BODY="$(');
    expect(example).toContain(')" || exit 1');
    expect(example).toContain('--data-binary "$PATCH_BODY"');
    expect(example).not.toContain('--arg content');

    const generatedPayload = {
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      content: '这是从 Markdown 文件读取的安全正文。'.repeat(20),
    };
    expect(BlogApiUpdatePostSchema.safeParse(generatedPayload).success).toBe(true);
  });

  it('明确写操作不返回正文，完整读取需要 blog:read', () => {
    expect(guide).toContain('写操作只返回 `id`、`status`、`updatedAt` 和 `previewUrls`');
    expect(guide).toContain('**不返回正文**');
    expect(guide).toContain('令牌必须额外拥有 `blog:read` scope');
  });

  it('记录图片配额、共享门控和可恢复错误', () => {
    expect(guide).toContain('200 MiB（209,715,200 字节）');
    expect(guide).toContain('1 GiB（1,073,741,824 字节）');
    expect(guide).toContain('共用每用户 10 次/分钟');
    expect(guide).toContain('全站最多 30 次/分钟');
    expect(guide).toContain('最多同时处理 4 张图片');
    expect(guide).toContain('`storage_quota_exceeded`');
    expect(guide).toContain('`image_upload_in_progress`');
    expect(guide).toContain('`upload_busy`');
  });

  it('OpenAPI 的图片成功响应包含配额，错误响应覆盖配额和上传门控', () => {
    const imagePath = blogPublishingOpenApi.paths['/api/v1/blog/images'].post;
    const schemas = blogPublishingOpenApi.components.schemas;

    expect(imagePath.description).toContain('200 MiB');
    expect(imagePath.responses[409]).toEqual({
      $ref: '#/components/responses/ImageUploadInProgress',
    });
    expect(imagePath.responses[413]).toEqual({
      $ref: '#/components/responses/ImageRejected',
    });
    expect(imagePath.responses[429]).toEqual({
      $ref: '#/components/responses/ImageUploadThrottled',
    });
    expect(schemas.ImageResponse.required).toEqual(['url', 'quota']);
    expect(schemas.ImageResponse.properties.quota).toEqual({
      $ref: '#/components/schemas/ImageQuota',
    });
    expect(schemas.ImageQuota.required).toEqual([
      'usedBytes',
      'limitBytes',
      'remainingBytes',
    ]);
    expect(blogPublishingOpenApi.components.responses.Image.content['application/json'].example)
      .toMatchObject({
        quota: { limitBytes: 209_715_200 },
      });
  });
});
