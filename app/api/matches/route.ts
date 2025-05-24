import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  const faceitCall = await fetch(
    `https://api.faceit.com/stats/v1/stats/time/users/${id}/games/cs2?size=31`
  );
  const data = await faceitCall.json();

  return Response.json(data);
}
