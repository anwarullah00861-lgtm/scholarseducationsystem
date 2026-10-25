import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string()
    .pattern(/^postgres(ql)?:\/\//)
    .required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_DAYS: Joi.number().integer().min(1).max(30).default(14),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),
  THROTTLE_TTL_MS: Joi.number().integer().min(1000).max(3600000).default(60000),
  THROTTLE_LIMIT: Joi.number().integer().min(1).max(100).default(10),
  CORS_ORIGIN: Joi.string().default('http://localhost:4200'),
});

export type EnvironmentVariables = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_DAYS: number;
  BCRYPT_SALT_ROUNDS: number;
  THROTTLE_TTL_MS: number;
  THROTTLE_LIMIT: number;
  CORS_ORIGIN: string;
};

export const validateEnv = (config: Record<string, unknown>): Record<string, unknown> => {
  const { error, value } = envSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    throw new Error(`Environment validation failed: ${error.message}`);
  }

  return value;
};
