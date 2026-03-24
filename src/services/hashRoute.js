export function parseHash() {
  const hash = window.location.hash || "#/";
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
  const [pathPart, queryPart] = cleaned.split("?");
  const path = pathPart && pathPart.startsWith("/") ? pathPart : "/";

  const params = new URLSearchParams(queryPart || "");
  return { path: path === "" ? "/" : path, params };
}

export function go(path) {
  window.location.hash = `#${path}`;
}

