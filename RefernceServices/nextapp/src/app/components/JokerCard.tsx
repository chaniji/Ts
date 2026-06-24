"use client";
import { useState } from "react";

export default function JokeCard() {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchJoke() {
    setLoading(true);
    const res = await fetch("/api/joke");
    const data = await res.json();
    setJoke(data.joke);
    setLoading(false);
  }

  return (
    <div className="border-4 border-black p-6 mt-8 bg-yellow-100">
      <p className="font-mono text-base mb-6 min-h-[3rem]">
        {joke || "Press button. Get joke."}
      </p>
      <button
        onClick={fetchJoke}
        disabled={loading}
        className="bg-black text-white font-bold uppercase px-6 py-3 border-4 border-black hover:bg-yellow-300 hover:text-black disabled:opacity-40"
      >
        {loading ? "Loading..." : "Get Joke"}
      </button>
    </div>
  );
}
