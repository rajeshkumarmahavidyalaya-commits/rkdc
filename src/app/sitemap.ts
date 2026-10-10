import type { MetadataRoute } from "next";
import { PROGRAMMES, SITE_PATHS, SITE_URL } from "@/lib/site/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...SITE_PATHS, ...PROGRAMMES.map((p) => `/programmes/${p.slug}`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
