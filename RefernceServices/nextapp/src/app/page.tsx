import JokeCard from "./components/JokerCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-300 p-8">
      <div className="border-4 border-black max-w-xl mx-auto bg-white p-8">
        <h1 className="text-5xl font-black uppercase tracking-tight border-b-4 border-black pb-4 mb-6">
          Next.js App
        </h1>
        <JokeCard />
        <p className="text-lg font-mono mb-8">Raw. Brutal. Functional.</p>
        <button className="bg-black text-white text-sm font-bold uppercase px-6 py-3 hover:bg-yellow-300 hover:text-black border-4 border-black transition-none">
          Click Me
        </button>
      </div>
    </main>
  );
}
