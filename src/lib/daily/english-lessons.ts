import type { EnglishContent } from './types';

export interface EnglishLesson {
  id: string;
  title: string;
  summary: string;
  content: EnglishContent;
}

/** 原创课程初稿；选入日刊后仍须管理员审核，不能据此宣称已经审校。 */
export const englishLessons: readonly EnglishLesson[] = [
  {
    id: 'small-first-step',
    title: '从一个小步骤开始',
    summary: '用三个表达描述目标、拆分工作和开始行动。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'break down', meaning: '把任务拆分成较小的部分', example: 'We broke down the project into three tasks.', translation: '我们把这个项目拆分成了三个任务。' },
        { term: 'get started', meaning: '开始做某事', example: 'I only need ten minutes to get started.', translation: '我只需要十分钟就能开始。' },
        { term: 'make progress', meaning: '取得进展', example: 'A short practice session can help you make progress.', translation: '一次短时间练习也能帮助你取得进展。' },
      ],
      passage: 'Mia wants to build a small website, but the whole project feels difficult. She breaks it down into three tasks: write a heading, add a picture, and create a link. Today, she only works on the heading. After ten minutes, she can see something on the page. The website is not finished, but she has made progress. Tomorrow, she will add the picture. A small first step makes it easier to get started.',
      passageTranslation: 'Mia 想做一个小网站，但整个项目让她觉得很难。她把它拆成三个任务：写一个标题、添加一张图片、创建一个链接。今天她只处理标题。十分钟后，她已经能在页面上看到一些内容。网站还没完成，但她取得了进展。明天她会添加图片。一个小的第一步能让开始行动变得容易。',
      questions: [
        { question: 'What does Mia work on today?', options: ['The heading.', 'All three tasks.', 'The picture.'], answerIndex: 0, explanation: '原文说 Today, she only works on the heading，因此今天只完成标题。' },
        { question: 'Choose the natural expression: We are _____ progress.', options: ['doing', 'making', 'taking'], answerIndex: 1, explanation: '表示“取得进展”的固定搭配是 make progress；这里用现在进行时 making。' },
      ],
    },
  },
  {
    id: 'clear-project-update',
    title: '说清楚项目进展',
    summary: '练习汇报已完成的工作、遇到的问题和下一步。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'so far', meaning: '到目前为止', example: 'So far, we have tested two pages.', translation: '到目前为止，我们已经测试了两个页面。' },
        { term: 'run into', meaning: '遇到问题或困难', example: 'I ran into a problem with the login form.', translation: '我在登录表单上遇到了一个问题。' },
        { term: 'next step', meaning: '下一步', example: 'The next step is to check the error message.', translation: '下一步是检查错误信息。' },
      ],
      passage: 'Leo sends his teammate a short update: “So far, I have finished the page layout. I ran into a problem with the login form: the button does not respond on my phone. The next step is to check the error message and test the form again. I will send another update after lunch.” His teammate now knows what is ready, what is blocked, and what Leo plans to do. The message is useful because it is specific.',
      passageTranslation: 'Leo 给队友发了一条简短进展：“到目前为止，我完成了页面布局。我在登录表单上遇到了问题：按钮在我的手机上没有反应。下一步是检查错误信息，再测试一次表单。午饭后我会再发一次进展。”队友现在知道了什么已经就绪、什么遇到了阻碍，以及 Leo 打算做什么。这条消息有用，因为它足够具体。',
      questions: [
        { question: 'Why is Leo’s message useful?', options: ['It promises that every problem is solved.', 'It avoids mentioning the problem.', 'It explains the current state and the next step.'], answerIndex: 2, explanation: '消息分别说明已完成的布局、按钮问题和下一步检查计划。' },
        { question: 'What does “ran into a problem” mean here?', options: ['Encountered a problem.', 'Ran outside.', 'Finished a problem.'], answerIndex: 0, explanation: 'run into 在这个语境中表示“遇到”，过去式是 ran into。' },
      ],
    },
  },
  {
    id: 'reading-research-carefully',
    title: '阅读论文时保留判断',
    summary: '区分 evidence、suggest 和 limitation，避免把结果说得过满。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'evidence', meaning: '证据；通常作不可数名词', example: 'The report provides evidence for this explanation.', translation: '这份报告为这个解释提供了证据。' },
        { term: 'suggest', meaning: '表明或提示某种可能性，不等于完全证明', example: 'The results suggest that the method may help.', translation: '这些结果表明，这个方法可能有帮助。' },
        { term: 'limitation', meaning: '局限或限制', example: 'The small sample is a limitation of the study.', translation: '样本较小是这项研究的一个局限。' },
      ],
      passage: 'A student reads a paper about a new study method. The authors tested the method with one small class. Their results suggest that the method may help students remember new words. However, the paper also describes a limitation: the study did not include students from other schools. The student writes down both the result and the limitation. She wants to understand the evidence before deciding whether to try the method herself.',
      passageTranslation: '一名学生阅读了一篇介绍新学习方法的论文。作者在一个小班级里测试了这个方法。结果表明，它可能帮助学生记住新单词。不过，论文也描述了一个局限：研究没有包括其他学校的学生。她同时记下结果和局限，希望先理解证据，再决定是否亲自尝试。',
      questions: [
        { question: 'Which limitation is mentioned?', options: ['The study had no authors.', 'The study included only one small class.', 'The paper did not describe its results.'], answerIndex: 1, explanation: '文中说明研究只测试了一个小班，没有包括其他学校的学生。' },
        { question: 'Which sentence best matches the passage?', options: ['The method works for everyone.', 'The method can never work.', 'The method may help, but the evidence has limits.'], answerIndex: 2, explanation: 'suggest 和 may 表达有限度的结论；原文没有证明该方法对所有人都有效。' },
      ],
    },
  },
  {
    id: 'reproduce-a-bug',
    title: '把问题描述得可复现',
    summary: '练习复现步骤、预期结果与实际结果的表达。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'reproduce', meaning: '重现或复现某个现象', example: 'Can you reproduce the error in another browser?', translation: '你能在另一个浏览器里复现这个错误吗？' },
        { term: 'expected result', meaning: '预期结果', example: 'The expected result is a saved note.', translation: '预期结果是笔记保存成功。' },
        { term: 'actual result', meaning: '实际结果', example: 'The actual result is an empty page.', translation: '实际结果是一个空白页面。' },
      ],
      passage: 'Instead of writing “the app is broken,” Nora records three steps: open a note, change its title, and press Save. She then describes the expected result: the new title should remain after the page reloads. The actual result is different: the old title appears again. Her teammate follows the same steps and can reproduce the problem. They now have a clear starting point for their investigation, even though they do not yet know the cause.',
      passageTranslation: 'Nora 没有只写“应用坏了”，而是记录了三个步骤：打开笔记、修改标题、点击保存。然后她说明预期结果：刷新页面后，新标题应该保留下来。实际结果却不同：旧标题再次出现。队友按照相同步骤复现了问题。虽然还不知道原因，他们已经有了清晰的排查起点。',
      questions: [
        { question: 'What happens after the page reloads?', options: ['The old title appears.', 'The note is deleted.', 'The new title remains.'], answerIndex: 0, explanation: '实际结果是 the old title appears again，而不是新标题保留。' },
        { question: 'Do the teammates already know the cause?', options: ['Yes, the passage names the cause.', 'No, they only have a clear starting point.'], answerIndex: 1, explanation: '最后一句明确说 they do not yet know the cause。能复现不等于已经找到原因。' },
      ],
    },
  },
  {
    id: 'agree-on-a-deadline',
    title: '确认截止时间',
    summary: '用 by、due 和 time zone 把时间约定说清楚。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'by Friday', meaning: '最晚在周五；具体时刻仍需另行确认', example: 'Please send the draft by Friday.', translation: '请最晚在周五发来草稿。' },
        { term: 'due', meaning: '应在某个时间提交或完成的', example: 'The report is due at noon.', translation: '报告应在中午提交。' },
        { term: 'time zone', meaning: '时区', example: 'Which time zone does the schedule use?', translation: '这个时间表使用哪个时区？' },
      ],
      passage: 'Two students in different countries are preparing a presentation. One says, “The slides are due on Friday.” The other asks for the exact time and time zone. They agree on Friday at 5 p.m. in Beijing. They also plan to exchange drafts one day earlier, so they have time to review each other’s work. A clear deadline helps them coordinate without assuming that Friday means the same moment for both of them.',
      passageTranslation: '两个身在不同国家的学生在准备演示。一人说：“幻灯片周五要交。”另一人询问具体时刻和时区。他们约定北京时间周五下午五点，还计划提前一天交换草稿，以便互相检查。明确的截止时间能帮助他们协作，而不必假定“周五”对两人意味着同一个时刻。',
      questions: [
        { question: 'Why do they exchange drafts early?', options: ['To avoid using a time zone.', 'To cancel the presentation.', 'To leave time for review.'], answerIndex: 2, explanation: '原文 so they have time to review each other’s work 说明提前交换是为了留出检查时间。' },
        { question: 'What does “by” express in “send it by Friday”?', options: ['A deadline.', 'Only an action after Friday.', 'A place.'], answerIndex: 0, explanation: 'by 加时间表示“不晚于”该时间，不表示只能在周五当天发送。' },
      ],
    },
  },
  {
    id: 'check-a-source',
    title: '分享消息前检查出处',
    summary: '练习 source、confirm 和 up to date，并区分发布与转发。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'source', meaning: '信息来源', example: 'The article links to its original source.', translation: '这篇文章链接到了它的原始来源。' },
        { term: 'confirm', meaning: '确认或核实', example: 'I checked the official page to confirm the date.', translation: '我查看了官方页面来核实日期。' },
        { term: 'up to date', meaning: '最新的；反映当前情况的', example: 'Make sure the timetable is up to date.', translation: '确保时间表反映的是当前情况。' },
      ],
      passage: 'A message in a group chat says that a workshop will take place tomorrow. Before sharing it, Jun opens the link to the original source. The official page says that the workshop has moved to next week. The message in the chat was copied from an older announcement. Jun shares the current page and explains the change. Checking the source takes a little longer, but it helps everyone make plans using information that is up to date.',
      passageTranslation: '群聊里有一条消息说工作坊明天举行。转发前，Jun 打开了原始来源的链接。官方页面说工作坊已经改到下周。群里的消息是从较早的公告复制来的。Jun 分享了当前页面并解释了变化。核实出处要多花一点时间，但能帮助大家依据最新信息安排计划。',
      questions: [
        { question: 'When will the workshop take place according to the current page?', options: ['Tomorrow.', 'Next week.', 'Last week.'], answerIndex: 1, explanation: '官方当前页面说明活动 has moved to next week；“明天”来自旧消息。' },
        { question: 'What does Jun share?', options: ['Only the old message.', 'An unconfirmed guess.', 'The current official page and an explanation.'], answerIndex: 2, explanation: '文中明确说 Jun shares the current page and explains the change。' },
      ],
    },
  },
  {
    id: 'useful-feedback',
    title: '给出可执行的反馈',
    summary: '练习 point out、clarify 和 suggestion，让反馈更具体。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'point out', meaning: '指出某个具体事实或问题', example: 'She pointed out a missing step in the guide.', translation: '她指出了指南中遗漏的一个步骤。' },
        { term: 'clarify', meaning: '说明清楚；澄清', example: 'Could you clarify what this button does?', translation: '你能说明一下这个按钮的作用吗？' },
        { term: 'suggestion', meaning: '建议，可数名词', example: 'My suggestion is to add a short example.', translation: '我的建议是加一个简短的例子。' },
      ],
      passage: 'After reading a classmate’s guide, Sara avoids saying only “It is confusing.” She points out the exact place where she got lost: the guide asks readers to save a file but does not name the folder. She asks her classmate to clarify the location. Her suggestion is to add the folder name and one example. The classmate can now make a specific change. Useful feedback describes an experience and gives the writer a practical next step.',
      passageTranslation: '读完同学的指南后，Sara 没有只说“看不懂”。她指出了自己卡住的具体位置：指南要求读者保存文件，却没有写明文件夹。她请同学说明保存位置，建议补上文件夹名称和一个例子。这样，同学就能做出具体修改。有用的反馈描述实际体验，并给作者一个可操作的下一步。',
      questions: [
        { question: 'What information is missing from the guide?', options: ['The folder name.', 'The writer’s age.', 'The class timetable.'], answerIndex: 0, explanation: '指南没有写出保存文件的文件夹名称，这是 Sara 指出的具体问题。' },
        { question: 'Which feedback is the most specific?', options: ['Everything is bad.', 'Please name the folder where I should save the file.', 'I do not like it.'], answerIndex: 1, explanation: '第二个选项指出了缺少的信息，并给出可以执行的修改建议。' },
      ],
    },
  },
];
