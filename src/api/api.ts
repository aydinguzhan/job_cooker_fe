export async function Get(path?: string) {
  const url = window.location.origin + path;
  const token = getJwt();

  await fetch(url, {
    method: "GET",
    headers: token ? { token } : undefined,
  });

  console.log(url);
}
export function Post() {}
export function Put() {}
export function Delete() {}

export function getJwt(isBear?: boolean): string | null {
  const token = window.localStorage.getItem("token");
  if (isBear) {
    return token ? `Bear ${token}` : null;
  }
  return token;
}
