import React from "react";

export const HaloBackground = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-600/10 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-400/20 dark:bg-sky-600/10 blur-[100px] animate-pulse delay-700" />
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-orange-300/20 dark:bg-orange-600/10 blur-[80px] animate-pulse delay-1000" />
        </div>
    );
};
