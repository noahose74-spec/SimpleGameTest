"use client";

import { useState, useEffect } from "react";
import { User, Shuffle, RefreshCw, Trash2, Link } from "lucide-react";
import confetti from "canvas-confetti";

export default function Randomizer() {
    const [inputText, setInputText] = useState("");
    const [candidates, setCandidates] = useState<string[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

    // Parse text input into list of non-empty strings
    const parseInput = (text: string) => {
        return text
            .split(/[\n,]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    };

    // Handle URL query parameters on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const namesParam = params.get("names");
        if (namesParam) {
            setInputText(namesParam.split(",").join("\n"));
        }
    }, []);

    // Update URL string when names change to allow easy sharing
    const updateUrlParams = (names: string[]) => {
        const url = new URL(window.location.href);
        if (names.length > 0) {
            url.searchParams.set("names", names.join(","));
        } else {
            url.searchParams.delete("names");
        }
        window.history.replaceState({}, "", url.toString());
    };

    useEffect(() => {
        const newCandidates = parseInput(inputText);
        setCandidates(newCandidates);
        updateUrlParams(newCandidates);
        setWinner(null); // Reset winner if input changes
    }, [inputText]);

    const handleSelect = () => {
        if (candidates.length === 0) return;

        setIsSelecting(true);
        setWinner(null);

        // Simple visual shuffle effect
        let shuffles = 0;
        const interval = setInterval(() => {
            setWinner(candidates[Math.floor(Math.random() * candidates.length)]);
            shuffles++;

            if (shuffles > 15) {
                clearInterval(interval);
                // Final selection
                const finalWinner = candidates[Math.floor(Math.random() * candidates.length)];
                setWinner(finalWinner);
                setIsSelecting(false);

                // Trigger confetti celebration
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                // Use window.setInterval instead of NodeJS.Timeout for browser compatibility
                const confettiInterval = window.setInterval(function () {
                    const timeLeft = animationEnd - Date.now();

                    if (timeLeft <= 0) {
                        return clearInterval(confettiInterval);
                    }

                    const particleCount = 50 * (timeLeft / duration);
                    // since particles fall down, start a bit higher than random
                    confetti({
                        ...defaults, particleCount,
                        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                    });
                    confetti({
                        ...defaults, particleCount,
                        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                    });
                }, 250);
            }
        }, 100);
    };

    const handleClear = () => {
        setInputText("");
        setWinner(null);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("URL copied to clipboard!");
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
                <label className="block text-sm font-medium text-slate-300 mb-2 mt-4 flex items-center gap-2">
                    <User size={16} /> Enter names (comma or enter separated)
                </label>

                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Alice, Bob, Charlie&#10;Dave&#10;Eve"
                    className="w-full h-40 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none font-medium"
                />

                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                    <div className="text-sm font-medium text-slate-400">
                        {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClear}
                            disabled={inputText.length === 0}
                            className="p-3 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Clear all"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={inputText.length === 0}
                            className="p-3 text-white/50 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Copy shareable link"
                        >
                            <Link size={20} />
                        </button>
                        <button
                            onClick={handleSelect}
                            disabled={candidates.length === 0 || isSelecting}
                            className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                        >
                            {isSelecting ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    Selecting...
                                </>
                            ) : (
                                <>
                                    <Shuffle className="group-hover:rotate-12 transition-transform" size={20} />
                                    Select Random
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Winner Display Area */}
            {winner && (
                <div className={`mt-8 bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-12 text-center transition-all duration-500 ${isSelecting ? "opacity-50 scale-95 blur-sm" : "opacity-100 scale-100"}`}>
                    <h2 className="text-xl md:text-2xl font-medium text-blue-200 mb-4 animate-in fade-in slide-in-from-top-4">
                        {isSelecting ? "Randomizing..." : "The chosen one is"}
                    </h2>
                    <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 tracking-tight">
                        {winner}
                    </div>
                </div>
            )}
        </div>
    );
}
