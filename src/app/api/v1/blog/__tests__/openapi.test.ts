import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { blogSections } from '@/data/blog-sections';
import { blogPublishingOpenApi } from '@/lib/blog-api-openapi';
import { GET } from '../openapi.json/route';

const expectedPaths = [
  '/api/v1/blog/openapi.json',
  '/api/v1/blog/sections',
  '/api/v1/blog/posts',
  '/api/v1/blog/posts/{id}',
  '/api/v1/blog/posts/{id}/preview',
  '/api/v1/blog/posts/{id}/submit',
  '/api/v1/blog/posts/{id}/withdraw',
  '/api/v1/blog/images',
] as const;

const routeFiles: Record<(typeof expectedPaths)[number], string> = {
  '/api/v1/blog/openapi.json': 'openapi.json/route.ts',
  '/api/v1/blog/sections': 'sections/route.ts',
  '/api/v1/blog/posts': 'posts/route.ts',
  '/api/v1/blog/posts/{id}': 'posts/[id]/route.ts',
  '/api/v1/blog/posts/{id}/preview': 'posts/[id]/preview/route.ts',
  '/api/v1/blog/posts/{id}/submit': 'posts/[id]/submit/route.ts',
  '/api/v1/blog/posts/{id}/withdraw': 'posts/[id]/withdraw/route.ts',
  '/api/v1/blog/images': 'images/route.ts',
};

describe('博客发布 OpenAPI 合约', () => {
  it('公开返回 OpenAPI 3.1 文档，且不要求 Bearer 令牌', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('cache-control')).toContain('public');
    expect(await response.json()).toEqual(blogPublishingOpenApi);
  });

  it('描述全部 v1 博客资源端点、四项 scope 和统一错误结构', () => {
    expect(blogPublishingOpenApi.openapi).toBe('3.1.0');
    expect(Object.keys(blogPublishingOpenApi.paths)).toEqual(expectedPaths);
    for (const routeFile of Object.values(routeFiles)) {
      expect(existsSync(join(process.cwd(), 'src/app/api/v1/blog', routeFile))).toBe(true);
    }
    expect(blogPublishingOpenApi.components.securitySchemes.bearerAuth['x-scopes'])
      .toEqual({
        'blog:read': expect.any(String),
        'blog:write': expect.any(String),
        'blog:submit': expect.any(String),
        'blog:image': expect.any(String),
      });
    expect(blogPublishingOpenApi.components.schemas.ErrorResponse.properties.error)
      .toEqual(expect.objectContaining({ $ref: '#/components/schemas/ApiError' }));
  });

  it('除自身外的资源操作都声明 Bearer 鉴权，示例不包含 PAT 明文', () => {
    for (const path of expectedPaths.filter((path) => path !== '/api/v1/blog/openapi.json')) {
      for (const operation of Object.values(blogPublishingOpenApi.paths[path])) {
        expect(operation.security).toEqual([{ bearerAuth: [] }]);
        expect(operation['x-required-scope']).toEqual(expect.any(String));
        expect(operation.responses).toHaveProperty('500');
      }
    }

    expect(JSON.stringify(blogPublishingOpenApi)).not.toMatch(/msb_[A-Za-z0-9_-]+/);
  });

  it('准确描述创建默认值、PATCH 最小字段和分区响应', () => {
    const schemas = blogPublishingOpenApi.components.schemas;
    const sectionIds = blogSections.map((section) => section.id);

    expect(schemas.CreatePostInput.required).not.toContain('sections');
    expect(schemas.CreatePostInput.required).not.toContain('tags');
    expect(schemas.UpdatePostInput.minProperties).toBe(2);
    expect(schemas.UpdatePostInput.properties.sections).not.toHaveProperty('minItems');
    expect(schemas.CreatePostInput.properties.sectionId.enum).toEqual(sectionIds);
    expect(schemas.CreatePostInput.properties.sections.items.enum).toEqual(sectionIds);
    expect(schemas.UpdatePostInput.properties.sectionId.enum).toEqual(sectionIds);
    expect(schemas.UpdatePostInput.properties.sections.items.enum).toEqual(sectionIds);
    for (const schema of [schemas.CreatePostInput, schemas.UpdatePostInput]) {
      expect(schema.properties.title.description).toContain('首尾空白');
      expect(schema.properties.excerpt.description).toContain('首尾空白');
      expect(schema.properties.content.description).toContain('首尾空白');
      expect(schema.properties.tags.description).toContain('每个标签的首尾空白');
    }
    expect(schemas.SectionsResponse.properties.sections.items)
      .toEqual({ $ref: '#/components/schemas/BlogSection' });
    expect(schemas.Post.required).toEqual(expect.arrayContaining([
      'content', 'createdAt', 'previewUrls',
    ]));
  });

  it('写操作只声明最小状态响应，单篇 GET 仍返回完整文章', () => {
    const mutationResponse = { $ref: '#/components/responses/MutationPost' };
    const paths = blogPublishingOpenApi.paths;
    const schemas = blogPublishingOpenApi.components.schemas;

    expect(paths['/api/v1/blog/posts'].post.responses[201]).toEqual(mutationResponse);
    expect(paths['/api/v1/blog/posts/{id}'].patch.responses[200]).toEqual(mutationResponse);
    expect(paths['/api/v1/blog/posts/{id}/submit'].post.responses[200]).toEqual(mutationResponse);
    expect(paths['/api/v1/blog/posts/{id}/withdraw'].post.responses[200]).toEqual(mutationResponse);
    expect(paths['/api/v1/blog/posts/{id}'].get.responses[200])
      .toEqual({ $ref: '#/components/responses/Post' });

    expect(schemas.MutationPost.required).toEqual(['id', 'status', 'updatedAt', 'previewUrls']);
    expect(Object.keys(schemas.MutationPost.properties))
      .toEqual(['id', 'status', 'updatedAt', 'previewUrls']);
    expect(schemas.MutationPostResponse.properties.post)
      .toEqual({ $ref: '#/components/schemas/MutationPost' });
    expect(blogPublishingOpenApi.components.responses.MutationPost.description)
      .toContain('blog:read');
  });
});
