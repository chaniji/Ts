export async function GET() {
  const jokes = [
    "Why do devs prefer dark mode? Light attracts bugs.",
    "A SQL query walks into a bar, joins two tables.",
    "Why did the programmer quit? No arrays.",
  ];
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  return Response.json({ joke });
}
