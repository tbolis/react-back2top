import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import DefaultExport, {Back2Top} from '../src';

const setScroll = (value: number) => {
    Object.defineProperty(window, 'pageYOffset', {value, configurable: true, writable: true});
    act(() => {
        window.dispatchEvent(new Event('scroll'));
        vi.advanceTimersByTime(150);
    });
};

describe('Back2Top', () => {
    let scrollTo: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.useFakeTimers();
        scrollTo = vi.fn();
        window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
        Object.defineProperty(window, 'pageYOffset', {value: 0, configurable: true, writable: true});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    const flush = (ms = 1000) => act(() => {
        vi.advanceTimersByTime(ms);
    });

    it('exports the component as named and default', () => {
        expect(DefaultExport).toBe(Back2Top);
        expect(Back2Top.displayName).toBe('Back2Top');
    });

    it('renders nothing before scrolling', () => {
        const {container} = render(<Back2Top/>);
        expect(container).toBeEmptyDOMElement();
    });

    it('has the default className and label', () => {
        render(<Back2Top alwaysVisible/>);
        const link = screen.getByRole('link');
        expect(link).toHaveClass('back-to-top');
        expect(link).toHaveAttribute('aria-label', 'Back to top');
    });

    it('accepts custom className, aria-label, style and extra props', () => {
        render(<Back2Top alwaysVisible className='mine' aria-label='Up' style={{color: 'red'}} data-testid='b'/>);
        const link = screen.getByTestId('b');
        expect(link).toHaveClass('mine');
        expect(link).toHaveAttribute('aria-label', 'Up');
        expect(link).toHaveStyle({color: 'rgb(255, 0, 0)', display: 'inline'});
    });

    it('renders children', () => {
        render(<Back2Top alwaysVisible><span>up</span></Back2Top>);
        expect(screen.getByText('up')).toBeInTheDocument();
    });

    it('fades in when alwaysVisible', () => {
        render(<Back2Top alwaysVisible/>);
        expect(screen.getByRole('link')).toHaveStyle({opacity: '0'});
        flush(100);
        expect(screen.getByRole('link')).toHaveStyle({opacity: '1'});
    });

    it('shows immediately without fade when fadeDuration is 0', () => {
        render(<Back2Top alwaysVisible fadeDuration={0}/>);
        expect(screen.getByRole('link')).toHaveStyle({opacity: '1', transition: 'opacity 0ms linear'});
    });

    it('becomes visible past the default visibility height and hides again', () => {
        const {container} = render(<Back2Top/>);
        setScroll(401);
        expect(screen.getByRole('link')).toBeInTheDocument();
        flush(100);
        expect(screen.getByRole('link')).toHaveStyle({opacity: '1'});

        setScroll(0);
        expect(screen.getByRole('link')).toHaveStyle({opacity: '0'});
        flush(400);
        expect(container).toBeEmptyDOMElement();
    });

    it('stays hidden at or below the visibility height', () => {
        const {container} = render(<Back2Top visibilityHeight={200}/>);
        setScroll(200);
        expect(container).toBeEmptyDOMElement();
        setScroll(201);
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('picks up the scroll position on mount', () => {
        Object.defineProperty(window, 'pageYOffset', {value: 1000, configurable: true, writable: true});
        render(<Back2Top/>);
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('falls back to documentElement/body scrollTop when pageYOffset is 0 (Safari)', () => {
        document.documentElement.scrollTop = 900;
        render(<Back2Top/>);
        expect(screen.getByRole('link')).toBeInTheDocument();
        document.documentElement.scrollTop = 0;
    });

    it('throttles scroll events', () => {
        const {container} = render(<Back2Top/>);
        Object.defineProperty(window, 'pageYOffset', {value: 1000, configurable: true, writable: true});
        act(() => {
            window.dispatchEvent(new Event('scroll'));
        });
        // within throttle window, update is deferred
        expect(container).toBeEmptyDOMElement();
        act(() => {
            window.dispatchEvent(new Event('scroll'));
        });
        flush(150);
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('removes the scroll listener on unmount', () => {
        const remove = vi.spyOn(window, 'removeEventListener');
        const {unmount} = render(<Back2Top/>);
        unmount();
        expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('unmounts safely with a pending throttled update', () => {
        const {unmount} = render(<Back2Top/>);
        act(() => {
            window.dispatchEvent(new Event('scroll'));
        });
        unmount();
        expect(() => flush(500)).not.toThrow();
    });

    describe('click', () => {
        it('prevents default navigation and calls onClick', () => {
            const onClick = vi.fn();
            render(<Back2Top alwaysVisible onClick={onClick}/>);
            const notPrevented = fireEvent.click(screen.getByRole('link'));
            expect(notPrevented).toBe(false);
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('works without an onClick handler', () => {
            render(<Back2Top alwaysVisible scrollDuration={0}/>);
            expect(() => fireEvent.click(screen.getByRole('link'))).not.toThrow();
        });

        it('scrolls instantly when scrollDuration is 0', () => {
            Object.defineProperty(window, 'pageYOffset', {value: 500, configurable: true, writable: true});
            render(<Back2Top scrollDuration={0}/>);
            fireEvent.click(screen.getByRole('link'));
            expect(scrollTo).toHaveBeenCalledWith(0, 0);
        });

        it('scrolls instantly when already at the top', () => {
            render(<Back2Top alwaysVisible/>);
            fireEvent.click(screen.getByRole('link'));
            expect(scrollTo).toHaveBeenCalledWith(0, 0);
        });

        it('animates to the top over scrollDuration', () => {
            Object.defineProperty(window, 'pageYOffset', {value: 1000, configurable: true, writable: true});
            render(<Back2Top scrollDuration={500}/>);
            fireEvent.click(screen.getByRole('link'));
            flush(250);
            const midway = scrollTo.mock.calls.at(-1)!;
            expect(midway[1]).toBeGreaterThan(0);
            expect(midway[1]).toBeLessThan(1000);
            flush(500);
            expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
        });

        it('restarts the animation on repeated clicks', () => {
            Object.defineProperty(window, 'pageYOffset', {value: 1000, configurable: true, writable: true});
            render(<Back2Top scrollDuration={500}/>);
            fireEvent.click(screen.getByRole('link'));
            flush(100);
            fireEvent.click(screen.getByRole('link'));
            flush(600);
            expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
        });

        it('stops animating on unmount', () => {
            Object.defineProperty(window, 'pageYOffset', {value: 1000, configurable: true, writable: true});
            const {unmount} = render(<Back2Top scrollDuration={500}/>);
            fireEvent.click(screen.getByRole('link'));
            flush(50);
            unmount();
            scrollTo.mockClear();
            flush(1000);
            expect(scrollTo).not.toHaveBeenCalled();
        });

        it('skips animation with prefers-reduced-motion', () => {
            window.matchMedia = vi.fn().mockReturnValue({matches: true}) as unknown as typeof window.matchMedia;
            Object.defineProperty(window, 'pageYOffset', {value: 1000, configurable: true, writable: true});
            render(<Back2Top scrollDuration={500}/>);
            fireEvent.click(screen.getByRole('link'));
            expect(scrollTo).toHaveBeenCalledTimes(1);
            expect(scrollTo).toHaveBeenCalledWith(0, 0);
            // @ts-expect-error cleanup of test stub
            delete window.matchMedia;
        });
    });
});
