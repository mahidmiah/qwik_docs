import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.create();

const isAuth = t .middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User is not logged in' })
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);