export default function CheckIcon({ className = 'text-emerald-400' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

/** 紧凑版 CheckIcon（w-4 h-4），用于卡片/表格内 */
export function CheckIconSm({ className = 'text-emerald-400' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
