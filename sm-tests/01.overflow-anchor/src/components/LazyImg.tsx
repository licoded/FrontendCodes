import { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../utils/useIntersectionObserver";

interface LazyImgProps{
    preloadDistance?: number;
    imgSrc: string;
    preloadDelayMs?: number
};

function LazyImg({
    preloadDistance = 200,
    preloadDelayMs = 0,
    imgSrc,
}: LazyImgProps) {
    const [displayImgSrc, setDisplayImgSrc] = useState('https://res.lgdsunday.club/img-load.png');
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const rootMargin = `${preloadDistance}px 0px`

        const catchSrc = imgSrc;
        const { stop } = useIntersectionObserver(
            imgRef.current!,
            ([{ isIntersecting }]) => {
                if (isIntersecting) {
                    setTimeout(() => {
                        setDisplayImgSrc(catchSrc);
                    }, preloadDelayMs);
                    stop();
                }
            },
            { rootMargin }
        )
    }, []);

    return (<img ref={imgRef} src={displayImgSrc} />)
}

export default LazyImg;