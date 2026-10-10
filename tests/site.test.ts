import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { FAQ, NAV, PROGRAMMES, SITE_PATHS, addressOneLine } from "@/lib/site/content";

// What the website must not do and must not forget. No browser, no network.

const ROOT = join(__dirname, "..");
const APP = join(ROOT, "src", "app");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Comments out, then match: a comment can hide a violation and fake one. */
function code(file: string) {
  return readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const sources = walk(join(ROOT, "src")).filter((f) => /\.tsx?$/.test(f));

describe("the website", () => {
  it("has a page behind every address it advertises", () => {
    expect(existsSync(join(APP, "page.tsx")), "/ has no page").toBe(true);
    for (const path of SITE_PATHS) {
      const page = join(APP, path, "page.tsx");
      expect(existsSync(page), `${path} is advertised and has no ${relative(ROOT, page)}`).toBe(true);
    }
  });

  it("has a page for every programme through one dynamic route, with unique slugs", () => {
    expect(existsSync(join(APP, "programmes", "[slug]", "page.tsx"))).toBe(true);
    expect(new Set(PROGRAMMES.map((p) => p.slug)).size).toBe(PROGRAMMES.length);
  });

  it("has its own 404 and error floor", () => {
    expect(existsSync(join(APP, "not-found.tsx"))).toBe(true);
    expect(existsSync(join(APP, "error.tsx"))).toBe(true);
  });

  it("keeps the header navigation in step with the content list", () => {
    expect(NAV.map((n) => n.href)).toEqual(["/about", "/programmes", "/admissions", "/facilities", "/contact"]);
  });

  it("hardcodes no colour in a component: everything goes through the tokens", () => {
    for (const f of sources) {
      expect(code(f), relative(ROOT, f)).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/);
    }
  });

  it("uses logical utilities, so it survives a right-to-left reader", () => {
    for (const f of sources) {
      expect(code(f), relative(ROOT, f)).not.toMatch(/\b(?:ml|mr|pl|pr)-(?:\d|\[|auto)|\btext-(?:left|right)\b|\b(?:left|right)-\d/);
    }
  });

  it("prints an address with no empty parts", () => {
    expect(addressOneLine()).not.toMatch(/,\s*,|undefined|null/);
  });

  it("does not claim an email or website nobody has given us", () => {
    const content = readFileSync(join(ROOT, "src", "lib", "site", "content.ts"), "utf8");
    expect(content).toMatch(/email:\s*null/);
    expect(content).toMatch(/website:\s*null/);
  });

  it("offers a portal login only when a portal is configured", () => {
    // Without NEXT_PUBLIC_PORTAL_URL there is nowhere to log in to, so the
    // site must not offer it or mention it in the answers it gives.
    expect(process.env.NEXT_PUBLIC_PORTAL_URL).toBeUndefined();
    expect(FAQ.some((f) => /log in|portal/i.test(f.q + f.a))).toBe(false);
  });

  it("links to the portal only through the configured address", () => {
    for (const f of sources.filter((f) => /\.tsx$/.test(f))) {
      expect(code(f), relative(ROOT, f)).not.toMatch(/["'`]\/(?:login|apply)\b/);
    }
  });
});
