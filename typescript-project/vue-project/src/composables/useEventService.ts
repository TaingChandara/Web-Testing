import { EVENT_BUS } from '@/constants';
import { useEmitter } from './useEmitter';

export function useEventService() {
    const emitter = useEmitter();

    function captureError(error?: unknown) {
        emitter.emit(EVENT_BUS.ERROR_CAPTURE, error);
    }

    function showProgress(label?: string) {
        emitter.emit(EVENT_BUS.SHOW_PROGRESS, label);
    }

    function hideProgress() {
        emitter.emit(EVENT_BUS.HIDE_PROGRESS);
    }

    return { captureError, showProgress, hideProgress };
}
