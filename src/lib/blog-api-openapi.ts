import { blogSections } from '@/data/blog-sections';

const apiPrefix = '/api/v1/blog';

const blogSectionIds = blogSections.map((section) => section.id);
const blogSectionIdSchema = { type: 'string', enum: blogSectionIds } as const;
const trimmedTextDescription = '服务端会先移除首尾空白，再校验长度并保存。';
const trimmedTagsDescription = '服务端会先移除每个标签的首尾空白，再校验长度并保存。';

const errorResponses = {
  400: { $ref: '#/components/responses/InvalidRequest' },
  401: { $ref: '#/components/responses/InvalidToken' },
  403: { $ref: '#/components/responses/InsufficientScope' },
  429: { $ref: '#/components/responses/RateLimited' },
  500: { $ref: '#/components/responses/InternalError' },
};

const bearerSecurity = [{ bearerAuth: [] }];

const postSchema = {
  type: 'object',
  required: [
    'id', 'authorId', 'authorName', 'authorBio', 'authorAvatarUrl', 'status', 'title',
    'excerpt', 'content', 'sectionId', 'sections', 'tags', 'reviewNote', 'eventDate',
    'publishedAt', 'createdAt', 'updatedAt', 'previewUrls',
  ],
  properties: {
    id: { type: 'string' },
    authorId: { type: 'string' },
    authorName: { type: ['string', 'null'] },
    authorBio: { type: ['string', 'null'] },
    authorAvatarUrl: { type: ['string', 'null'], format: 'uri' },
    status: { type: 'string', enum: ['draft', 'pending', 'published', 'rejected'] },
    title: { type: 'string' },
    excerpt: { type: 'string' },
    content: { type: 'string' },
    sectionId: { type: 'string' },
    sections: { type: 'array', items: { type: 'string' }, maxItems: 8 },
    tags: { type: 'array', items: { type: 'string' }, maxItems: 8 },
    eventDate: { type: ['string', 'null'], format: 'date' },
    reviewNote: { type: ['string', 'null'] },
    publishedAt: { type: ['string', 'null'], format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    previewUrls: { $ref: '#/components/schemas/PreviewUrls' },
  },
};

export const blogPublishingOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'Meteor Store Blog Publishing API',
    version: '1.0.0',
    description: '用于管理当前用户博客投稿的个人访问令牌 API。完整令牌仅通过 Authorization 请求头传递。',
  },
  paths: {
    [`${apiPrefix}/openapi.json`]: {
      get: {
        summary: '获取 OpenAPI 描述',
        responses: {
          200: {
            description: 'OpenAPI 3.1 文档',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    [`${apiPrefix}/sections`]: {
      get: {
        summary: '获取可投稿分区与字段限制',
        security: bearerSecurity,
        'x-required-scope': 'blog:read',
        responses: {
          200: { $ref: '#/components/responses/Sections' },
          ...errorResponses,
        },
      },
    },
    [`${apiPrefix}/posts`]: {
      get: {
        summary: '列出当前用户最近更新的文章摘要',
        security: bearerSecurity,
        'x-required-scope': 'blog:read',
        responses: {
          200: { $ref: '#/components/responses/PostList' },
          ...errorResponses,
        },
      },
      post: {
        summary: '创建草稿',
        security: bearerSecurity,
        'x-required-scope': 'blog:write',
        requestBody: { $ref: '#/components/requestBodies/CreatePost' },
        responses: {
          201: { $ref: '#/components/responses/MutationPost' },
          ...errorResponses,
        },
      },
    },
    [`${apiPrefix}/posts/{id}`]: {
      get: {
        summary: '读取当前用户文章的完整 Markdown',
        security: bearerSecurity,
        'x-required-scope': 'blog:read',
        parameters: [{ $ref: '#/components/parameters/PostId' }],
        responses: {
          200: { $ref: '#/components/responses/Post' },
          404: { $ref: '#/components/responses/PostNotFound' },
          ...errorResponses,
        },
      },
      patch: {
        summary: '更新草稿或被驳回文章',
        security: bearerSecurity,
        'x-required-scope': 'blog:write',
        parameters: [{ $ref: '#/components/parameters/PostId' }],
        requestBody: { $ref: '#/components/requestBodies/UpdatePost' },
        responses: {
          200: { $ref: '#/components/responses/MutationPost' },
          404: { $ref: '#/components/responses/PostNotFound' },
          409: { $ref: '#/components/responses/StateOrVersionConflict' },
          ...errorResponses,
        },
      },
    },
    [`${apiPrefix}/posts/{id}/preview`]: {
      get: {
        summary: '渲染当前文章的安全 HTML 预览',
        security: bearerSecurity,
        'x-required-scope': 'blog:read',
        parameters: [{ $ref: '#/components/parameters/PostId' }],
        responses: {
          200: { $ref: '#/components/responses/Preview' },
          404: { $ref: '#/components/responses/PostNotFound' },
          ...errorResponses,
        },
      },
    },
    [`${apiPrefix}/posts/{id}/submit`]: {
      post: {
        summary: '显式提交文章',
        description: '普通用户提交后进入审核；管理员只能直发自己的文章。',
        security: bearerSecurity,
        'x-required-scope': 'blog:submit',
        parameters: [{ $ref: '#/components/parameters/PostId' }],
        requestBody: { $ref: '#/components/requestBodies/ExpectedUpdatedAt' },
        responses: {
          200: { $ref: '#/components/responses/MutationPost' },
          404: { $ref: '#/components/responses/PostNotFound' },
          409: { $ref: '#/components/responses/StateOrVersionConflict' },
          ...errorResponses,
        },
      },
    },
    [`${apiPrefix}/posts/{id}/withdraw`]: {
      post: {
        summary: '撤回待审核文章到草稿',
        security: bearerSecurity,
        'x-required-scope': 'blog:submit',
        parameters: [{ $ref: '#/components/parameters/PostId' }],
        responses: {
          200: { $ref: '#/components/responses/MutationPost' },
          404: { $ref: '#/components/responses/PostNotFound' },
          409: { $ref: '#/components/responses/StateOrVersionConflict' },
          ...errorResponses,
        },
      },
    },
    [`${apiPrefix}/images`]: {
      post: {
        summary: '上传博客图片',
        description: '单图最大 5,000,000 字节。普通账户总配额 200 MiB，管理员账户 1 GiB；相同内容只计费一次。',
        security: bearerSecurity,
        'x-required-scope': 'blog:image',
        requestBody: { $ref: '#/components/requestBodies/BlogImage' },
        responses: {
          201: { $ref: '#/components/responses/Image' },
          409: { $ref: '#/components/responses/ImageUploadInProgress' },
          413: { $ref: '#/components/responses/ImageRejected' },
          415: { $ref: '#/components/responses/InvalidImage' },
          503: { $ref: '#/components/responses/StorageUnavailable' },
          ...errorResponses,
          429: { $ref: '#/components/responses/ImageUploadThrottled' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Meteor Store personal access token',
        'x-scopes': {
          'blog:read': '读取分区、自己的文章和预览。',
          'blog:write': '创建文章和修改自己的草稿或被驳回文章。',
          'blog:submit': '提交文章或撤回待审核文章。',
          'blog:image': '上传博客图片。',
        },
      },
    },
    parameters: {
      PostId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      },
    },
    requestBodies: {
      CreatePost: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePostInput' } } },
      },
      UpdatePost: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePostInput' } } },
      },
      ExpectedUpdatedAt: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ExpectedUpdatedAtInput' } } },
      },
      BlogImage: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: { file: { type: 'string', format: 'binary' } },
            },
          },
        },
      },
    },
    responses: {
      Sections: {
        description: '分区和字段约束',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/SectionsResponse' } } },
      },
      PostList: {
        description: '最多 100 篇文章摘要，不含正文',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/PostListResponse' } } },
      },
      Post: {
        description: '文章数据',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/PostResponse' } } },
      },
      MutationPost: {
        description: '写操作后的最小文章状态，不含正文；读取完整文章需要 blog:read scope',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/MutationPostResponse' } } },
      },
      Preview: {
        description: '安全 HTML 与浏览器预览地址',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/PreviewResponse' } } },
      },
      Image: {
        description: '可插入 Markdown 的公开图片 URL 与本次上传后的账户配额',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ImageResponse' },
            example: {
              url: 'https://images.example/blog/user/hash.webp',
              quota: {
                usedBytes: 5_242_880,
                limitBytes: 209_715_200,
                remainingBytes: 204_472_320,
              },
            },
          },
        },
      },
      InvalidRequest: { $ref: '#/components/responses/ErrorResponse' },
      InvalidToken: { $ref: '#/components/responses/ErrorResponse' },
      InsufficientScope: { $ref: '#/components/responses/ErrorResponse' },
      PostNotFound: { $ref: '#/components/responses/ErrorResponse' },
      StateOrVersionConflict: { $ref: '#/components/responses/ErrorResponse' },
      InvalidImage: { $ref: '#/components/responses/ErrorResponse' },
      ImageRejected: {
        description: '单图超过 5,000,000 字节（invalid_image），或账户图片总配额不足（storage_quota_exceeded）',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      ImageUploadInProgress: {
        description: '相同内容的图片正在上传（image_upload_in_progress）',
        headers: { 'Retry-After': { schema: { type: 'integer' } } },
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      ImageUploadThrottled: {
        description: '用户或全站上传频率超限（rate_limited），或当前进程的四个处理槽位已满（upload_busy）',
        headers: { 'Retry-After': { schema: { type: 'integer' } } },
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      StorageUnavailable: { $ref: '#/components/responses/ErrorResponse' },
      InternalError: { $ref: '#/components/responses/ErrorResponse' },
      RateLimited: {
        description: '请求频率过高',
        headers: { 'Retry-After': { schema: { type: 'integer' } } },
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      ErrorResponse: {
        description: '稳定错误响应',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
    },
    schemas: {
      PreviewUrls: {
        type: 'object',
        required: ['zh', 'en'],
        properties: { zh: { type: 'string' }, en: { type: 'string' } },
      },
      CreatePostInput: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'excerpt', 'content', 'sectionId'],
        properties: {
          title: { type: 'string', minLength: 4, maxLength: 80, description: trimmedTextDescription },
          excerpt: { type: 'string', minLength: 10, maxLength: 200, description: trimmedTextDescription },
          content: { type: 'string', minLength: 200, maxLength: 50000, description: trimmedTextDescription },
          sectionId: blogSectionIdSchema,
          sections: { type: 'array', maxItems: 8, items: blogSectionIdSchema },
          tags: {
            type: 'array',
            maxItems: 8,
            description: trimmedTagsDescription,
            items: { type: 'string', minLength: 1, maxLength: 24 },
          },
          eventDate: { type: ['string', 'null'], format: 'date' },
        },
      },
      UpdatePostInput: {
        type: 'object',
        additionalProperties: false,
        minProperties: 2,
        required: ['expectedUpdatedAt'],
        properties: {
          expectedUpdatedAt: { type: 'string', format: 'date-time' },
          title: { type: 'string', minLength: 4, maxLength: 80, description: trimmedTextDescription },
          excerpt: { type: 'string', minLength: 10, maxLength: 200, description: trimmedTextDescription },
          content: { type: 'string', minLength: 200, maxLength: 50000, description: trimmedTextDescription },
          sectionId: blogSectionIdSchema,
          sections: { type: 'array', maxItems: 8, items: blogSectionIdSchema },
          tags: {
            type: 'array',
            maxItems: 8,
            description: trimmedTagsDescription,
            items: { type: 'string', minLength: 1, maxLength: 24 },
          },
          eventDate: { type: ['string', 'null'], format: 'date' },
        },
      },
      ExpectedUpdatedAtInput: {
        type: 'object',
        additionalProperties: false,
        required: ['expectedUpdatedAt'],
        properties: { expectedUpdatedAt: { type: 'string', format: 'date-time' } },
      },
      Post: postSchema,
      PostSummary: {
        ...postSchema,
        required: [
          'id', 'authorId', 'status', 'title', 'excerpt', 'sectionId', 'sections', 'tags',
          'reviewNote', 'eventDate', 'publishedAt', 'createdAt', 'updatedAt', 'previewUrls',
        ],
        properties: Object.fromEntries(
          Object.entries(postSchema.properties).filter(([key]) => (
            !['content', 'authorName', 'authorBio', 'authorAvatarUrl'].includes(key)
          )),
        ),
      },
      PostResponse: {
        type: 'object',
        required: ['post'],
        properties: { post: { $ref: '#/components/schemas/Post' } },
      },
      MutationPost: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'status', 'updatedAt', 'previewUrls'],
        properties: {
          id: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'pending', 'published', 'rejected'] },
          updatedAt: { type: 'string', format: 'date-time' },
          previewUrls: { $ref: '#/components/schemas/PreviewUrls' },
        },
      },
      MutationPostResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['post'],
        properties: { post: { $ref: '#/components/schemas/MutationPost' } },
      },
      PostListResponse: {
        type: 'object',
        required: ['posts'],
        properties: { posts: { type: 'array', maxItems: 100, items: { $ref: '#/components/schemas/PostSummary' } } },
      },
      SectionsResponse: {
        type: 'object',
        required: ['sections', 'constraints'],
        properties: {
          sections: {
            type: 'array',
            items: { $ref: '#/components/schemas/BlogSection' },
          },
          constraints: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'excerpt', 'content', 'sections', 'tags', 'eventDate'],
            properties: {
              title: { $ref: '#/components/schemas/LengthRange' },
              excerpt: { $ref: '#/components/schemas/LengthRange' },
              content: { $ref: '#/components/schemas/LengthRange' },
              sections: {
                type: 'object',
                required: ['maxItems'],
                properties: { maxItems: { type: 'integer' } },
              },
              tags: {
                type: 'object',
                required: ['maxItems', 'maxLength'],
                properties: {
                  maxItems: { type: 'integer' },
                  maxLength: { type: 'integer' },
                },
              },
              eventDate: {
                type: 'object',
                required: ['format', 'nullable'],
                properties: {
                  format: { type: 'string', const: 'YYYY-MM-DD' },
                  nullable: { type: 'boolean', const: true },
                },
              },
            },
          },
        },
      },
      LengthRange: {
        type: 'object',
        required: ['min', 'max'],
        properties: {
          min: { type: 'integer' },
          max: { type: 'integer' },
        },
      },
      LocalizedText: {
        type: 'object',
        additionalProperties: false,
        required: ['zh', 'en'],
        properties: {
          zh: { type: 'string' },
          en: { type: 'string' },
        },
      },
      BlogSectionStar: {
        type: 'object',
        additionalProperties: false,
        required: ['sus', 'beast', 'symbolId', 'reason'],
        properties: {
          sus: { $ref: '#/components/schemas/LocalizedText' },
          beast: { $ref: '#/components/schemas/LocalizedText' },
          symbolId: { type: 'string' },
          reason: { $ref: '#/components/schemas/LocalizedText' },
        },
      },
      BlogSection: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'slug', 'label', 'description', 'channelId', 'rgb', 'allowProposals'],
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          label: { $ref: '#/components/schemas/LocalizedText' },
          description: { $ref: '#/components/schemas/LocalizedText' },
          channelId: { type: 'string' },
          rgb: { type: 'string' },
          allowProposals: { type: 'boolean' },
          star: { $ref: '#/components/schemas/BlogSectionStar' },
        },
      },
      PreviewResponse: {
        type: 'object',
        required: ['html', 'updatedAt', 'previewUrls'],
        properties: {
          html: { type: 'string' },
          updatedAt: { type: 'string', format: 'date-time' },
          previewUrls: { $ref: '#/components/schemas/PreviewUrls' },
        },
      },
      ImageResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['url', 'quota'],
        properties: {
          url: { type: 'string', format: 'uri' },
          quota: { $ref: '#/components/schemas/ImageQuota' },
        },
      },
      ImageQuota: {
        type: 'object',
        additionalProperties: false,
        required: ['usedBytes', 'limitBytes', 'remainingBytes'],
        properties: {
          usedBytes: { type: 'integer', format: 'int64', minimum: 0 },
          limitBytes: { type: 'integer', format: 'int64', minimum: 0 },
          remainingBytes: { type: 'integer', format: 'int64', minimum: 0 },
        },
      },
      ApiError: {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: { error: { $ref: '#/components/schemas/ApiError' } },
      },
    },
  },
} as const;
