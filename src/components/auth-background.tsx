export function AuthBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-zinc-950">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(24,24,27,0)_0%,_rgba(9,9,11,1)_100%)] z-10" />

            {/* Animated Orbs */}
            <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
            <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute bottom-[20%] left-[30%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0" />
        </div>
    );
}
