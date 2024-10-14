export const authConfig = {
  token:
    process.env.JWT_TOKEN_KEY || "B2obQmub50YsHJneoJj/s76ZbJE5CEAUw2LI0K+8AdE=",
  algorithm: "RS256",
  expiresIn: "365d",
};
