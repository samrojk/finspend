const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export async function checkApiHealth() {
  const response = await fetch(`${API_URL}/api/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Finspend API is unavailable");
  }

  return response.json() as Promise<{
    status: string;
    service: string;
    timestamp: string;
  }>;
}
