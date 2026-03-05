import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { z } from "zod";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Upload procedure: receives base64-encoded file data and returns CDN URL
  upload: router({
    file: publicProcedure
      .input(
        z.object({
          base64: z.string(), // base64-encoded file content
          mimeType: z.string(), // e.g. "image/jpeg", "video/mp4"
          fileName: z.string(), // original file name for extension
        })
      )
      .mutation(async ({ input }) => {
        const { base64, mimeType, fileName } = input;
        const ext = fileName.split(".").pop() || "bin";
        const key = `nova-habitar/uploads/${nanoid()}.${ext}`;
        const buffer = Buffer.from(base64, "base64");
        const { url } = await storagePut(key, buffer, mimeType);
        return { url, key };
      }),
  }),
});

export type AppRouter = typeof appRouter;
