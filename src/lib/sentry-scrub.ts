const BLOG_TOKEN_PATTERN = /msb_[A-Za-z0-9_-]+/g;

function scrubValue(value: unknown, seen: WeakSet<object>): unknown {
  if (typeof value === 'string') {
    return value.replace(BLOG_TOKEN_PATTERN, '[REDACTED]');
  }
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return value;
  seen.add(value);

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      value[index] = scrubValue(value[index], seen);
    }
    return value;
  }

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key.toLowerCase() === 'authorization') {
      delete record[key];
      continue;
    }
    record[key] = scrubValue(record[key], seen);
  }
  return value;
}

/** 在 Sentry 事件离开进程前移除博客 PAT，避免请求上下文或错误文本泄漏。 */
export function scrubSentryEvent<T>(event: T): T {
  return scrubValue(event, new WeakSet()) as T;
}
