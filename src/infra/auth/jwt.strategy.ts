import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { Env } from '../env/env'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: ConfigService<Env, true>) {
    const secretKey = env.get('JWT_SECRET')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
