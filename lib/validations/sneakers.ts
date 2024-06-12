import * as z from 'zod';

export const SneakersValidation = z.object({
    nickname: z.string().min(3, { message: "Minimum 3 characters required" }),
    colorway: z.string().min(3, { message: "Minimum 3 characters required" }),
    releaseDate: z.string().min(3, { message: "Minimum 3 characters required" }),
    accountId: z.string().min(1),
})

export const CommentValidation = z.object({
    thread: z.string().min(3, { message: "Minimum 3 characters required" }),
})  

