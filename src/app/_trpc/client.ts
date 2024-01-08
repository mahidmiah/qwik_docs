import {createTRPCReact} from '@trpc/react-query'
import { AppRouter } from '@/app/trpc'

export const trpc = createTRPCReact<AppRouter>({});