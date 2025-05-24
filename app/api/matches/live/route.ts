import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (typeof id !== "string") {
    return NextResponse.json({ message: "No id" }, { status: 400 });
  }

  try {
    const payload = await getLiveMatch(id);

    let matchId = null;

    if (payload.ONGOING && payload.ONGOING.length > 0) {
      matchId = payload.ONGOING[0].id;
    }

    return NextResponse.json({ id: matchId }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}

async function getLiveMatch(id: string) {
  const response = await fetch(
    `https://www.faceit.com/api/match/v1/matches/groupByState?userId=${id}`
  );

  const body = await response.json();

  if (body.payload && body.code === "OPERATION-OK") {
    const payload = body.payload;

    return payload;
  }

  throw {
    errors: [{ code: "err_queue_0", message: "failed to get live match" }],
  };
}
