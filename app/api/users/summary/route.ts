/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const ids: string[] = await request.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ message: "No ids" }, { status: 400 });
    }

    const summaries = await getPlayersSummary(ids);
    const matches = await Promise.all(ids.map((id) => getLastMatches(id)));

    return NextResponse.json({ summaries, matches });
  } catch (err: any) {
    return NextResponse.json(err, { status: 400 });
  }
}

async function getPlayersSummary(ids: string[]) {
  const response = await fetch(
    `https://www.faceit.com/api/user-summary/v2/list`,
    {
      method: "POST",
      body: JSON.stringify({
        ids: ids,
      }),
    }
  );
  const body = await response.json();

  const payload = body.payload;

  if (payload) {
    return payload;
  }

  throw body;
}

async function getLastMatches(id: string) {
  try {
    const response = await fetch(
      `https://api.faceit.com/stats/v1/stats/time/users/${id}/games/cs2?size=31`
    );

    const body = await response.json();

    if (body) {
      return {
        id: id,
        matches: body,
      };
    }

    return {
      id: id,
      matches: [],
    };
  } catch (err: any) {
    return {
      id: id,
      matches: [],
    };
  }
}
