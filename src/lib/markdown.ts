/**
 * 极简 Markdown 渲染，输出用于 dangerouslySetInnerHTML。
 *
 * 安全约定：所有文本在拼接前先做 HTML 转义，链接 href 走白名单协议。
 * 因此渲染用户提交的内容也不会产生 XSS —— 但代价是正文里不能内嵌原生 HTML。
 */

const SAFE_HREF = /^(https?:\/\/|mailto:|\/|#)/i;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 已转义文本里的 URL 白名单校验，未通过则降级为纯文本 */
function safeUrl(url: string): string | null {
  const decoded = url.replace(/&amp;/g, '&');
  return SAFE_HREF.test(decoded) ? url : null;
}

/** 行内语法：图片 → 链接 → 行内代码 → 加粗 */
function inline(text: string): string {
  let out = escapeHtml(text);

  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt, src) => {
    const url = safeUrl(src);
    return url ? `<img src="${url}" alt="${alt}" loading="lazy" />` : match;
  });

  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
    const url = safeUrl(href);
    if (!url) return match;
    const external = /^https?:\/\//i.test(url.replace(/&amp;/g, '&'));
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${attrs}>${label}</a>`;
  });

  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  return out;
}

export function markdownToHtml(md: string): string {
  const blocks: string[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        `<pre><code class="language-${escapeHtml(lang || 'text')}">${escapeHtml(codeLines.join('\n'))}</code></pre>`,
      );
      continue;
    }

    if (/^(---|\*\*\*)\s*$/.test(line)) {
      blocks.push('<hr />');
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(`<h3>${inline(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(`<h2>${inline(line.slice(3))}</h2>`);
      i++;
      continue;
    }

    // 引用块：连续的 "> " 行合并成一段，文学区和辩论区会大量用到
    if (line.startsWith('> ')) {
      const quoted: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoted.push(inline(lines[i].slice(2)));
        i++;
      }
      blocks.push(`<blockquote>${quoted.map((q) => `<p>${q}</p>`).join('')}</blockquote>`);
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[\s-:|]+\|$/));
      if (rows.length > 0) {
        const headerCells = rows[0].split('|').filter(Boolean).map((c) => `<th>${inline(c.trim())}</th>`).join('');
        const bodyRows = rows.slice(1).map((r) => {
          const cells = r.split('|').filter(Boolean).map((c) => `<td>${inline(c.trim())}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        blocks.push(`<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`);
      }
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s*/, ''))}</li>`);
        i++;
      }
      blocks.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(`<li>${inline(lines[i].slice(2))}</li>`);
        i++;
      }
      blocks.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    blocks.push(`<p>${inline(line)}</p>`);
    i++;
  }

  return blocks.join('\n');
}
