function useIntersectionObserver(el: HTMLElement, cb: IntersectionObserverCallback, config = {}) {
    if (!(cb instanceof Function)) {
        throw new Error("The second parameter callbackFn must be a Function!");
    }

    const observer = new IntersectionObserver(cb, config);
    observer.observe(el);

    const stop = () => observer.unobserve(el);

    return { stop };
}

export default useIntersectionObserver;