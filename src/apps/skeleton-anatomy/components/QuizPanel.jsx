// @ts-nocheck
/* eslint-disable */
import { useState } from 'react'
import useStore from '../store/useStore'
import { getRandomBoneId, getBoneById, boneCategories } from '../data/boneData'

export default function QuizPanel({ locale = 'zh' }) {
  const isZh = locale !== 'en'
  const quizMode = useStore((s) => s.quizMode)
  const quizBone = useStore((s) => s.quizBone)
  const quizResult = useStore((s) => s.quizResult)
  const quizScore = useStore((s) => s.quizScore)
  const setQuizBone = useStore((s) => s.setQuizBone)
  const setQuizResult = useStore((s) => s.setQuizResult)
  const selectBoneAndFly = useStore((s) => s.selectBoneAndFly)
  const stopQuiz = useStore((s) => s.stopQuiz)
  const updateQuizScore = useStore((s) => s.updateQuizScore)
  const resetQuizScore = useStore((s) => s.resetQuizScore)

  const [showHint, setShowHint] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const bone = quizBone ? getBoneById(quizBone) : null
  const category = bone ? boneCategories.find((c) => c.id === bone.category) : null

  const pickRandomBone = () => {
    setQuizBone(getRandomBoneId())
    setShowHint(false)
    setInputValue('')
  }

  const handleSubmit = () => {
    if (!bone || !inputValue.trim()) return
    const ans = inputValue.trim().toLowerCase()
    const isCorrect =
      ans === bone.nameZh ||
      ans === bone.nameEn.toLowerCase() ||
      ans === bone.id.toLowerCase()

    setQuizResult(isCorrect ? 'correct' : 'wrong')
    updateQuizScore(isCorrect)
    selectBoneAndFly(bone.id)
  }

  const handleNext = () => {
    pickRandomBone()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (quizResult) {
        handleNext()
      } else {
        handleSubmit()
      }
    }
  }

  if (!quizMode) return null

  return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <h3>{isZh ? '骨骼测验' : 'Bone quiz'}</h3>
        <div className="quiz-score">
          {quizScore.correct} / {quizScore.total}
          {quizScore.total > 0 && (
            <span style={{ marginLeft: 6, fontSize: 12, opacity: 0.6 }}>
              ({Math.round(quizScore.correct / quizScore.total * 100)}%)
            </span>
          )}
        </div>
        <button type="button" className="quiz-close" onClick={resetQuizScore} aria-label={isZh ? '重置测验分数' : 'Reset quiz score'}>↺</button>
        <button type="button" className="quiz-close" onClick={stopQuiz} aria-label={isZh ? '退出骨骼测验' : 'Exit bone quiz'}>✕</button>
      </div>

      {bone && (
        <>
          <div className="quiz-question">
            <p>{isZh ? '请说出这块骨骼的名称：' : 'Name the highlighted bone:'}</p>
            <div className="quiz-hint-area">
              <button
                type="button"
                className="quiz-hint-btn"
                onClick={() => setShowHint(!showHint)}
                aria-expanded={showHint}
              >
                {showHint ? (isZh ? '隐藏提示' : 'Hide hint') : (isZh ? '显示提示' : 'Show hint')}
              </button>
              {showHint && (
                <div className="quiz-hint">
                  <p>{isZh ? '分类' : 'Category'}：{isZh ? category?.name : category?.nameEn}</p>
                  <p>{isZh ? '编号' : 'ID'}：{bone.id}</p>
                  <p>{isZh ? '描述' : 'Description'}：{(isZh ? bone.descriptionZh : bone.descriptionEn).slice(0, 60)}...</p>
                </div>
              )}
            </div>
          </div>

          <div className="quiz-input-area">
            <input
              type="text"
              placeholder={isZh ? '输入骨骼名称（中文或英文）' : 'Enter the bone name'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!!quizResult}
              autoFocus
            />
            {!quizResult && (
              <button type="button" className="quiz-submit" onClick={handleSubmit}>
                {isZh ? '提交' : 'Submit'}
              </button>
            )}
          </div>

          {quizResult && (
            <div className={`quiz-result ${quizResult}`}>
              {quizResult === 'correct' ? (
                <p>{isZh ? '正确！' : 'Correct!'}</p>
              ) : (
                <p>{isZh ? '错误。答案是：' : 'Incorrect. The answer is: '}<strong>{isZh ? bone.nameZh : bone.nameEn}</strong> ({isZh ? bone.nameEn : bone.nameZh})</p>
              )}
              <button type="button" className="quiz-next" onClick={handleNext}>
                {isZh ? '下一题 →' : 'Next →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
