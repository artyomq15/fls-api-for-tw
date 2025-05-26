import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (typeof id !== "string") {
    return NextResponse.json({ message: "No id" }, { status: 400 });
  }

  try {
    const payload = await getLiveMatch(id);

    if (payload.ONGOING && payload.ONGOING.length > 0) {
      const match = await getMatch(payload.ONGOING[0].id);

      return NextResponse.json(match, { status: 200 });
    }

    return NextResponse.json(null, { status: 200 });
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

async function getMatch(id: string) {
  const response = await fetch(
    `https://www.faceit.com/api/match/v2/match/${id}`
  );
  const body = await response.json();

  const payload = body.payload;

  if (payload) {
    return payload;
  }

  throw {
    errors: [{ code: "err_match_not_found", message: "failed to find match" }],
  };
}
