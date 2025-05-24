import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await getMatch(id);

    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
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
