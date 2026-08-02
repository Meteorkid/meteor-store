interface CancellableTaskHandlers<T> {
  onSuccess: (value: T) => void;
  onError: (error: unknown) => void;
  onSettled: () => void;
}

/** 在组件仍挂载时分发异步任务结果，清理后忽略全部回调。 */
export function runCancellableTask<T>(
  task: Promise<T>,
  handlers: CancellableTaskHandlers<T>,
): () => void {
  let cancelled = false;

  void task
    .then((value) => {
      if (!cancelled) handlers.onSuccess(value);
    })
    .catch((error: unknown) => {
      if (!cancelled) handlers.onError(error);
    })
    .finally(() => {
      if (!cancelled) handlers.onSettled();
    });

  return () => {
    cancelled = true;
  };
}
