import { taskHandlers } from './taskHandlers';
import { authHandlers } from './authHandlers';

export const handlers = [...authHandlers, ...taskHandlers];