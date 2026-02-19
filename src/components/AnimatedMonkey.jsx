import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/animations/mm.json';

const AnimatedMonkey = ({ isEmailFocused, isPasswordFocused }) => {
    const lottieRef = useRef();
    const [shouldLoop, setShouldLoop] = useState(true);
    // Track previous focus to determine transitions
    const prevPasswordFocus = useRef(false);

    useEffect(() => {
        if (!lottieRef.current) return;

        if (isPasswordFocused) {
            // Monkey covers eyes
            // Play 32-141 and stop
            setShouldLoop(false);
            lottieRef.current.playSegments([32, 141], true);
        } else if (!isPasswordFocused && prevPasswordFocus.current) {
            // Just lost password focus -> Uncover eyes
            // Play 146-201 and stop
            setShouldLoop(false);
            lottieRef.current.playSegments([146, 201], true);
        } else if (isEmailFocused) {
            // Monkey tracks/idle
            setShouldLoop(true);
            lottieRef.current.playSegments([0, 32], true);
        } else {
            // Idle state
            if (!prevPasswordFocus.current) {
                setShouldLoop(true);
                lottieRef.current.playSegments([0, 32], true);
            }
        }

        prevPasswordFocus.current = isPasswordFocused;
    }, [isEmailFocused, isPasswordFocused]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-white p-8 overflow-hidden">
            <div className={`absolute top-12 left-0 right-0 text-center transition-all duration-500 transform z-10 ${isPasswordFocused ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                    <span className="text-3xl">🔒</span> Secure Login
                </p>
                <p className="text-lg font-medium text-muted-foreground mt-2">
                    Aapka Password aur Information Humare Pass Safe Hai
                </p>
            </div>

            <div className="w-80 h-80 md:w-96 md:h-96 transition-all duration-500">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={shouldLoop}
                    autoplay={true}
                    initialSegment={[0, 32]}
                />
            </div>
        </div>
    );
};

export default React.memo(AnimatedMonkey);
