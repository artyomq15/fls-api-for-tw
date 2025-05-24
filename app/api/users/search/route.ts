import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nickname = searchParams.get("nickname");

  if (typeof nickname !== "string") {
    return NextResponse.json({ message: "No nickname" }, { status: 400 });
  }

  try {
    const profile = await getProfile(nickname);

    const [regionRanking, countryRanking] = await Promise.all([
      getRanking(profile.id, profile.games.cs2.region),
      getRanking(profile.id, profile.games.cs2.region, profile.country),
    ]);

    return NextResponse.json(
      {
        ...profile,
        ranking: { region: regionRanking, country: countryRanking },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}

async function getProfile(nickname: string) {
  const response = await fetch(
    `https://www.faceit.com/api/users/v1/nicknames/${nickname}`
  );
  const body = await response.json();

  const payload = body.payload;

  if (payload) {
    if (payload?.games?.cs2) {
      return payload;
    } else {
      throw { errors: [{ code: "err_no_cs2", message: "no cs2 game" }] };
    }
  }

  throw body;
}

async function getRanking(id: string, region: string, country?: string) {
  const countryQuery = country ? `country=${country}` : "";
  const response = await fetch(
    `https://www.faceit.com/api/ranking/v1/globalranking/cs2/${region}/${id}?${countryQuery}`
  );
  const body = await response.json();

  if (body.payload) {
    return body.payload;
  }

  throw {
    errors: [{ code: "err_ranking_0", message: "failed to get ranking" }],
  };
}
