import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/ask", "routes/api.ask.tsx"),
  route("api/usage", "routes/api.usage.tsx"),
  route("api/record-share", "routes/api.record-share.tsx"),
] satisfies RouteConfig;
