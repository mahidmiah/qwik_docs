import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';

export const appRouter = router({
  authCallBack: publicProcedure.query(async () => {
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user?.id || !user?.email){
      throw new TRPCError({code: 'UNAUTHORIZED', message: 'User is not logged in'})
    }

    // check if user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    if(!dbUser){
      // Create user in database
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        }
      })
    }

    return {sucess: true}
  }),
  getUserFiles: privateProcedure.query(async ({ctx}) => {
    const {userId, user} = ctx;
    return await db.file.findMany({
      where: {
        userId: userId
      },
    })
  }),
  deleteFile: privateProcedure.input(
    z.object({ id: z.string() })
  ).mutation(async ({ctx, input}) => {
    const {userId} = ctx;

    const file = await db.file.findFirst({
      where: {
        id: input.id,
        userId: userId
      },
    });

    if(!file) throw new TRPCError({code: 'NOT_FOUND', message: 'File not found'});

    await db.file.delete({
      where: {
        id: input.id
      },
    })

    return file;
  }),
  getFile: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({ctx, input}) => {
    const {userId} = ctx;

    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId: userId
      },
    });

    if(!file) throw new TRPCError({code: 'NOT_FOUND', message: 'File not found'});

    return file;
  }),
});

export type AppRouter = typeof appRouter; 