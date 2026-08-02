import { describe, expect, it, vi } from 'vitest';
import { runCancellableTask } from '../cancellable-task';

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

async function flushPromiseChain() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('runCancellableTask', () => {
  it('任务成功后执行成功回调并结束 loading', async () => {
    const deferred = createDeferred<string>();
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();

    runCancellableTask(deferred.promise, { onSuccess, onError, onSettled });
    deferred.resolve('ok');
    await flushPromiseChain();

    expect(onSuccess).toHaveBeenCalledWith('ok');
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledOnce();
  });

  it('任务失败后执行失败回调并结束 loading', async () => {
    const deferred = createDeferred<string>();
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();
    const error = new Error('network error');

    runCancellableTask(deferred.promise, { onSuccess, onError, onSettled });
    deferred.reject(error);
    await flushPromiseChain();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
    expect(onSettled).toHaveBeenCalledOnce();
  });

  it('组件卸载后忽略任务结果和结束回调', async () => {
    const deferred = createDeferred<string>();
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();

    const cancel = runCancellableTask(deferred.promise, {
      onSuccess,
      onError,
      onSettled,
    });
    cancel();
    deferred.resolve('ok');
    await flushPromiseChain();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).not.toHaveBeenCalled();
  });
});
