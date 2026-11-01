import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import zh from '../../../messages/zh.json';import en from '../../../messages/en.json';
const state=vi.hoisted(()=>({locale:'zh'}));
vi.mock('next-intl',async original=>{const actual=await original<typeof import('next-intl')>();return {...actual,useLocale:()=>state.locale,useTranslations:()=>actual.createTranslator({locale:state.locale,messages:state.locale==='en'?en:zh,namespace:'PostStats',onError:e=>{throw e;}})};});
vi.mock('../AuthProvider',()=>({useAuth:()=>({user:null})}));
import PostStats from '../PostStats';
describe('文章详情统计标签',()=>{it.each(['zh','en'])('%s 计数提供翻译参数而不触发详情页格式错误',locale=>{state.locale=locale;const html=renderToStaticMarkup(<PostStats targetId="qa" initialViewCount={1234} initialCommentCount={2}/>);expect(html).toContain(locale==='en'?'aria-label="1,234 views"':'aria-label="1,234 次阅读"');expect(html).toContain(locale==='en'?'aria-label="2 comments"':'aria-label="2 条评论"');});});
