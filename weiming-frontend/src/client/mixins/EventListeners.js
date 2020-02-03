import clickListenerNotifier from './helpers/ClickListenerNotifier';
import mouseListenerNotifier from './helpers/MouseListenerNotifier';
import touchListenerNotifier from './helpers/TouchListenerNotifier';
import resizeNotifier from './helpers/ResizeNotifier';
import { onBeforeUnmount } from '@vue/composition-api';

export function useClickListener(observers) {
    clickListenerNotifier.attach(observers);
    onBeforeUnmount(() => {
        clickListenerNotifier.detach(observers);
    });
}

export function useMouseListener(observers) {
    mouseListenerNotifier.attach(observers);

    onBeforeUnmount(() => {
        mouseListenerNotifier.detach(observers);
    });
}


export function useMouseAndTouchListener(observers) {
    mouseListenerNotifier.attach(observers);
    touchListenerNotifier.attach(observers);

    onBeforeUnmount(() => {
        mouseListenerNotifier.detach(observers);
        touchListenerNotifier.detach(observers);
    });
}

export function useResizeListener(observers) {
    resizeNotifier.attach(observers);

    onBeforeUnmount(() => {
        resizeNotifier.detach(observers);
    });
}