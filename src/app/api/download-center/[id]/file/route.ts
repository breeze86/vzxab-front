import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const fallbackFileNames: Record<string, string> = {
  PDF: "download.pdf",
  EXE: "download.exe",
  ZIP: "download.zip",
  DOC: "download.doc",
  DOCX: "download.docx",
  XLS: "download.xls",
  XLSX: "download.xlsx",
  PPT: "download.ppt",
  PPTX: "download.pptx",
};

const attachmentPrefix = "attachment; filename*=UTF-8" + String.fromCharCode(39) + String.fromCharCode(39);

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const buildFileName = (name: string, fileType: string) => {
  const normalizedName = sanitizeFileName(name) || "download";
  const normalizedType = fileType.trim().toUpperCase();
  const fallback = fallbackFileNames[normalizedType];

  if (fallback === undefined) {
    return normalizedName;
  }

  const extension = fallback.slice(fallback.lastIndexOf("."));
  return normalizedName.toLowerCase().endsWith(extension.toLowerCase())
    ? normalizedName
    : normalizedName + extension;
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const itemId = Number(id);

  if (Number.isInteger(itemId) === false || itemId <= 0) {
    return NextResponse.json({ error: "无效的下载项" }, { status: 400 });
  }

  const item = await prisma.downloadCenterItem.findUnique({
    where: { id: itemId },
  });

  if (item === null) {
    return NextResponse.json({ error: "下载项不存在" }, { status: 404 });
  }

  if (item.actionType === "PREVIEW") {
    return NextResponse.redirect(item.downloadUrl, { status: 307 });
  }

  const upstream = await fetch(item.downloadUrl, {
    cache: "no-store",
  });

  if (upstream.ok === false || upstream.body === null) {
    return NextResponse.json({ error: "文件暂时无法下载" }, { status: 502 });
  }

  const headers = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  const hasSpecificType = Boolean(upstreamType) && upstreamType !== "application/octet-stream";
  headers.set(
    "content-type",
    hasSpecificType ? upstreamType as string : "application/octet-stream"
  );
  headers.set(
    "content-disposition",
    attachmentPrefix + encodeURIComponent(buildFileName(item.name, item.fileType))
  );
  headers.set("cache-control", "no-store");

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) {
    headers.set("content-length", contentLength);
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}
