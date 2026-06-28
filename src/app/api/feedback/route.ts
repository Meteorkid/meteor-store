import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedbacks } from '@/lib/db/schema';

const VALID_TYPES = ['bug', 'feature', 'question', 'other'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, type, content } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: '反馈类型和内容为必填项' },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: '无效的反馈类型' },
        { status: 400 }
      );
    }

    const id = `FB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const now = new Date().toISOString();

    await db.insert(feedbacks).values({
      id,
      email: email || null,
      type,
      content,
      createdAt: now,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
