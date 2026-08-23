/** Cloudflare Worker entry point for the Boulet marketing site. */
import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
  isImageOptimizationPath,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import {
  handleSubmissionRequest,
  purgeExpiredSubmissions,
  type SubmissionEnv,
} from "./submissions";
import { resolveLegacyRedirect } from "./legacy-redirects";
import { withSecurityHeaders } from "./security-headers";

interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env extends SubmissionEnv {
  ASSETS?: AssetFetcher;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

function isWebpAsset(pathname: string): boolean {
  return pathname.toLowerCase().endsWith(".webp");
}

async function fetchTypedAsset(
  assets: AssetFetcher,
  request: Request,
): Promise<Response> {
  const response = await assets.fetch(request);
  if (!response.ok || !isWebpAsset(new URL(request.url).pathname)) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("content-type", "image/webp");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { ASSETS: assets, IMAGES: images } = env;

    const legacyDestination = resolveLegacyRedirect(url);
    if (legacyDestination) {
      return withSecurityHeaders(
        new Response(null, {
          status: 308,
          headers: { location: legacyDestination.toString() },
        }),
        request,
      );
    }

    const submissionResponse = await handleSubmissionRequest(request, env);
    if (submissionResponse) {
      return withSecurityHeaders(submissionResponse, request);
    }

    if (isImageOptimizationPath(url.pathname) && assets && images) {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const optimized = await handleImageOptimization(request, {
        fetchAsset: (path) =>
          fetchTypedAsset(assets, new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await images.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(optimized, request);
    }

    if (isWebpAsset(url.pathname) && assets) {
      return withSecurityHeaders(await fetchTypedAsset(assets, request), request);
    }

    return withSecurityHeaders(await handler.fetch(request, env, ctx), request);
  },
  async scheduled(
    _controller: unknown,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(purgeExpiredSubmissions(env));
  },
};

export default worker;
