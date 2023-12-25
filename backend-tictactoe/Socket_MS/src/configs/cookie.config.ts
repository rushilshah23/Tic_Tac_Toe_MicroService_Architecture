import { CookieOptions } from "express"
import { ENV_VAR as  env_config } from "@/configs/env.config"

export const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env_config.ENVIRNOMENT,
    sameSite: env_config.ENVIRNOMENT ? 'strict' : 'lax',
    domain: env_config.BASE_DOMAIN,
    path: '/',
    signed: true,
  }

