import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, env, codeVerifier, state } = body;

    console.log("Callback received:", {
      hasCode: !!code,
      env,
      hasCodeVerifier: !!codeVerifier,
      hasState: !!state
    });

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    if (!codeVerifier) {
      return NextResponse.json({ error: "Missing code verifier for PKCE" }, { status: 400 });
    }

    const loginUrl =
      env === "sandbox"
        ? process.env.NEXT_PUBLIC_SF_LOGIN_URL_SANDBOX
        : process.env.NEXT_PUBLIC_SF_LOGIN_URL_PROD;

    const tokenEndpoint = `${loginUrl}/services/oauth2/token`;

    // For PKCE flow, we don't need client_secret, but if your Connected App requires it:
    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_SF_CONSUMER_KEY!,
      redirect_uri: process.env.NEXT_PUBLIC_SF_REDIRECT_URI!,
      code: code,
      code_verifier: codeVerifier,
    });

    // Only add client_secret if not using PKCE (some orgs might require both)
    if (process.env.SF_CONSUMER_SECRET) {
      tokenBody.append("client_secret", process.env.SF_CONSUMER_SECRET);
    }

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenBody,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Token exchange failed:", {
        status: response.status,
        statusText: response.statusText,
        error: data,
        tokenEndpoint,
      });
      return NextResponse.json(
        {
          error: data.error_description || data.error || "Failed to get access token",
          details: data
        },
        { status: response.status }
      );
    }

    console.log("Token exchange successful:", {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      instanceUrl: data.instance_url,
      expiresIn: data.expires_in,
      userId: data.id?.split("/").pop(),
    });

    // Return only safe data to frontend
    // Default to 2 hours (7200 seconds) if expires_in is not provided
    const expiresIn = data.expires_in || 7200;
    
    return NextResponse.json({
      accessToken: data.access_token,
      refreshToken: data.refresh_token || null,
      instanceUrl: data.instance_url,
      expiresIn: expiresIn,
      userId: data.id?.split("/").slice(-1)[0],
      orgId: data.id?.split("/").slice(-2, -1)[0],
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}