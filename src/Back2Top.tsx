import React, {useCallback, useEffect, useRef, useState} from 'react';

export interface Back2TopProps extends Omit<React.ComponentPropsWithoutRef<'a'>, 'onClick'> {

    // Make the button visible regardless of the scroll position
    alwaysVisible?: boolean;

    // Duration of fade effect in ms
    fadeDuration?: number;

    // Duration of scroll-to-top effect in ms
    scrollDuration?: number;

    // Scroll offset (px) after which the button becomes visible
    visibilityHeight?: number;

    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const FADE_DURATION = 300;
const SCROLL_DURATION = 800;
const VISIBILITY_HEIGHT = 400;
const THROTTLE = 100;

// documentElement.scrollTop is always 0 on some Safari versions, window.pageYOffset is supported everywhere
const getScrollTop = (): number =>
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

const prefersReducedMotion = (): boolean =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Back2Top = ({
    alwaysVisible = false,
    fadeDuration = FADE_DURATION,
    scrollDuration = SCROLL_DURATION,
    visibilityHeight = VISIBILITY_HEIGHT,
    className = 'back-to-top',
    style,
    onClick,
    children,
    ...options
}: Back2TopProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [rendered, setRendered] = useState(false);
    const [shown, setShown] = useState(false);
    const frame = useRef(0);
    const visible = alwaysVisible || scrolled;

    // Track the scroll position, throttled
    useEffect(() => {
        let last = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const update = () => {
            last = Date.now();
            timer = undefined;
            setScrolled(getScrollTop() > visibilityHeight);
        };
        const onScroll = () => {
            if (timer !== undefined) return;
            const wait = THROTTLE - (Date.now() - last);
            if (wait <= 0) update();
            else timer = setTimeout(update, wait);
        };
        update();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (timer !== undefined) clearTimeout(timer);
        };
    }, [visibilityHeight]);

    // Mount before fading in, unmount after fading out
    useEffect(() => {
        if (visible) {
            setRendered(true);
            if (fadeDuration <= 0) {
                setShown(true);
                return;
            }
            let inner = 0;
            const outer = requestAnimationFrame(() => {
                inner = requestAnimationFrame(() => setShown(true));
            });
            return () => {
                cancelAnimationFrame(outer);
                cancelAnimationFrame(inner);
            };
        }
        setShown(false);
        const timer = setTimeout(() => setRendered(false), Math.max(fadeDuration, 0));
        return () => clearTimeout(timer);
    }, [visible, fadeDuration]);

    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    const scrollToTop = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        cancelAnimationFrame(frame.current);
        const startValue = getScrollTop();
        if (scrollDuration <= 0 || startValue === 0 || prefersReducedMotion()) {
            window.scrollTo(0, 0);
        } else {
            const startTime = performance.now();
            const step = (time: number) => {
                const progress = Math.min((time - startTime) / scrollDuration, 1);
                window.scrollTo(0, Math.round(startValue * (1 - progress)));
                if (progress < 1) frame.current = requestAnimationFrame(step);
            };
            frame.current = requestAnimationFrame(step);
        }
        if (onClick) onClick(event);
    }, [scrollDuration, onClick]);

    if (!rendered && !visible) return null;

    return (
        <a
            href='#'
            aria-label='Back to top'
            {...options}
            className={className}
            style={{
                display: 'inline',
                opacity: shown ? 1 : 0,
                transition: `opacity ${Math.max(fadeDuration, 0)}ms linear`,
                ...style
            }}
            onClick={scrollToTop}>
            {children}
        </a>
    );
};

Back2Top.displayName = 'Back2Top';

export default Back2Top;
