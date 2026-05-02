export async function Get(path?: string) {
  const url = window.location.origin + path;
  const token = getJwt();

  await fetch(url, { method: "Get", headers: { token: token } });

  console.log(url);
}
export function Post() {}
export function Put() {}
export function Delete() {}

export function getJwt(isBear?: boolean): string | null {
  const token: string = window.localStorage.getItem("token");
  if (isBear) {
    return ["Bear ", ...token].join("");
  }
  return token;
}
