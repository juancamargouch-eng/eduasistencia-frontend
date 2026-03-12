import { useState, useLayoutEffect, useRef } from 'react';

export interface BoxSize {
    width: number;
    height: number;
}

export function useMeasure<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [size, setSize] = useState<BoxSize>({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(([entry]) => {
            if (entry && entry.contentRect) {
                const { width, height } = entry.contentRect;
                // Solo actualizamos si las dimensiones son positivas y han cambiado
                setSize(prev => {
                    if (prev.width === width && prev.height === height) return prev;
                    return { width, height };
                });
            }
        });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, size] as const;
}
