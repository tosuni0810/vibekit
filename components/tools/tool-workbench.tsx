"use client";

import { EnvTool, JsonTypeTool, MetadataTool, PromptBuilderTool, SecretTool, SvgTool } from "./code-tools";
import { FaviconTool, ImageResizerTool, OgImageTool } from "./image-tools";

export function ToolWorkbench({ slug }: { slug: string }) {
  switch (slug) {
    case "favicon": return <FaviconTool />;
    case "og-image": return <OgImageTool />;
    case "image-resizer": return <ImageResizerTool />;
    case "svg": return <SvgTool />;
    case "metadata": return <MetadataTool />;
    case "env": return <EnvTool />;
    case "secret": return <SecretTool />;
    case "json-to-typescript": return <JsonTypeTool />;
    case "prompt-builder": return <PromptBuilderTool />;
    default: return null;
  }
}

