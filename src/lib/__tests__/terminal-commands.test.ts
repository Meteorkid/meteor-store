import { describe, it, expect } from 'vitest';
import { runCommand } from '../terminal-commands';

describe('runCommand', () => {
  it('help 列出可用命令且含隐藏提示', () => {
    const { lines } = runCommand('help');
    expect(lines.some(l => l.includes('story'))).toBe(true);
    expect(lines[lines.length - 1]).toContain('没写在这里的');
  });

  it('story 返回导航动作', () => {
    const result = runCommand('story');
    expect(result.action).toBe('navigate-story');
    expect(result.lines.length).toBeGreaterThan(0);
  });

  it('clear 返回清屏动作且无输出', () => {
    const result = runCommand('clear');
    expect(result.action).toBe('clear');
    expect(result.lines).toEqual([]);
  });

  it('cat secret.txt 泄露 Konami 秘技', () => {
    const { lines } = runCommand('cat secret.txt');
    expect(lines.join('\n')).toContain('↑↑↓↓←→←→BA');
  });

  it('cat 其他文件返回找不到', () => {
    const { lines } = runCommand('cat nothing.txt');
    expect(lines[0]).toContain('没有那个文件');
  });

  it('sudo give-me-discount 拒绝但友好', () => {
    const { lines } = runCommand('sudo give-me-discount');
    expect(lines[0]).toContain('权限不足');
  });

  it('sudo rm -rf / 被求生欲拦截', () => {
    const { lines } = runCommand('sudo rm -rf /');
    expect(lines.join('')).toContain('学费');
  });

  it('命令大小写不敏感', () => {
    expect(runCommand('HELP').lines).toEqual(runCommand('help').lines);
  });

  it('空输入返回空', () => {
    expect(runCommand('   ').lines).toEqual([]);
  });

  it('未知命令提示 help', () => {
    const { lines } = runCommand('foobar');
    expect(lines[0]).toContain('command not found: foobar');
    expect(lines[0]).toContain('help');
  });

  it('中文命令 晚安 可用', () => {
    const { lines } = runCommand('晚安');
    expect(lines[0]).toContain('晚安');
  });

  it('konami 命令返回爆发动作', () => {
    expect(runCommand('konami').action).toBe('burst');
  });
});
