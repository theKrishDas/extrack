/**
 * Canonical error codes mapping to HTTP semantics.
 * Used as the `code` discriminant on {@link AppErrorData}.
 *
 * @example
 * throw AppError.notFound("User not found.", { context: { userId } })
 * // err.data.code === ErrorCode.NOT_FOUND
 */
export const ErrorCode = {
  // 4xx — business / caller errors
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  INVALID_INPUT: "INVALID_INPUT",
  PRECONDITION_FAILED: "PRECONDITION_FAILED",
  RATE_LIMITED: "RATE_LIMITED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  // 5xx — system errors surfaced intentionally
  INTERNAL: "INTERNAL",
  UNAVAILABLE: "UNAVAILABLE",
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * Operational severity levels used for alerting and observability routing.
 *
 * | Level      | Intent                     | Alert?      |
 * | :--------- | :------------------------- | :---------- |
 * | `low`      | Expected, user-facing      | Never       |
 * | `medium`   | Unexpected but recoverable | Maybe       |
 * | `high`     | Needs attention soon       | Yes         |
 * | `critical` | Page someone now           | Immediately |
 */
export const ErrorSeverity = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const

export type ErrorSeverity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity]

/**
 * Structured payload attached to every {@link AppError} instance.
 *
 * @template C - Shape of the per-call-site `context` object. Defaults to `Record<string, unknown>`.
 *
 * @property code     - Machine-readable error discriminant. Maps to HTTP status semantics.
 * @property severity - Observability/alerting signal. Never inferred from `code` — set explicitly.
 * @property message  - Safe for UI display. Never include internal detail here.
 * @property domain   - Functional domain tag (e.g. `"billing"`, `"auth"`). Used in Axiom filters.
 * @property detail   - Dev-facing root cause hint. Internal only — never render in UI.
 * @property context  - Arbitrary per-error KV pairs. Serialized as JSON in Axiom;
 *                      query with `parse_json(['data.context'])`.
 *
 * @example
 * // Quota error
 * const data: AppErrorData<{ limit: number; current: number }> = {
 *   code: ErrorCode.QUOTA_EXCEEDED,
 *   severity: ErrorSeverity.MEDIUM,
 *   message: "Account limit reached.",
 *   domain: "billing",
 *   context: { limit: 5, current: 5, userId: "usr_123", ownerId: "org_456" },
 * }
 *
 * // Validation error
 * const data: AppErrorData<{ field: string }> = {
 *   code: ErrorCode.INVALID_INPUT,
 *   severity: ErrorSeverity.LOW,
 *   message: "Name is required.",
 *   domain: "accounts",
 *   context: { field: "name", userId: "usr_123" },
 * }
 */
export interface AppErrorData<
  C extends Record<string, unknown> = Record<string, unknown>,
> {
  code: ErrorCode
  severity: ErrorSeverity
  message: string
  domain?: string
  detail?: string
  context?: C
}

/**
 * Optional overrides passed to {@link AppError} static factories.
 *
 * @template C - Shape of the `context` object.
 *
 * @property domain  - Functional domain tag. See {@link AppErrorData.domain}.
 * @property detail  - Internal root cause hint. See {@link AppErrorData.detail}.
 * @property context - Per-error structured context. See {@link AppErrorData.context}.
 */
export interface ErrorOptions<
  C extends Record<string, unknown> = Record<string, unknown>,
> {
  domain?: AppErrorData["domain"]
  detail?: AppErrorData["detail"]
  context?: C
}

/**
 * Typed application error with structured observability payload.
 *
 * Extends `Error` for native stack trace support. All construction goes through
 * static factories — direct `new AppError(data)` is reserved for {@link AppError.custom}.
 *
 * @template C - Shape of `data.context`. Defaults to `Record<string, unknown>`.
 *
 * @example
 * // Throw via factory
 * throw AppError.notFound("Account not found.", {
 *   domain: "accounts",
 *   context: { accountId: "acc_123" },
 * })
 *
 * @example
 * // Narrow unknown errors
 * try {
 *   await riskyOp()
 * } catch (err) {
 *   if (AppError.is(err)) {
 *     logger.error(err.data)   // fully typed
 *   }
 * }
 */
export class AppError<
  C extends Record<string, unknown> = Record<string, unknown>,
> extends Error {
  /** Structured payload. Safe to log/serialize; never expose `detail` or `context` to end users. */
  readonly data: AppErrorData<C>
  name = "AppError"

  constructor(data: AppErrorData<C>) {
    super(data.message)
    this.data = data
  }

  /**
   * Returns the structured error data payload.
   *
   * Provides direct access to the typed error data without exposing the full error instance.
   * Useful for serialization, logging, or when you need to pass only the data payload.
   *
   * @returns The structured {@link AppErrorData} payload containing code, severity, message,
   *          domain, detail, and context. The generic type `C` is preserved from the error instance.
   *
   * @example
   * // Extract data for logging
   * try {
   *   await riskyOperation()
   * } catch (err) {
   *   if (AppError.is(err)) {
   *     const errorData = err.toData()
   *     logger.error("Operation failed", errorData)
   *     // errorData is typed as AppErrorData<C>
   *   }
   * }
   *
   * @example
   * // Serialize for API response
   * const error = AppError.notFound("User not found.", {
   *   context: { userId: "usr_123" }
   * })
   * const serialized = error.toData()
   * // Can safely serialize and send to client
   */
  toData(): AppErrorData<C> {
    return this.data
  }

  /**
   * Type guard — narrows `unknown` to `AppError`.
   *
   * @param err - Value to check.
   * @returns `true` if `err` is an {@link AppError} instance.
   *
   * @example
   * if (AppError.is(err)) {
   *   console.log(err.data.code) // typed
   * }
   */
  static is(err: unknown): err is AppError {
    return err instanceof AppError
  }

  /**
   * Internal factory. All public factories delegate here.
   *
   * @param code     - Error code discriminant.
   * @param severity - Observability severity level.
   * @param message  - UI-safe message.
   * @param opts     - Optional domain, detail, context overrides.
   * @returns New {@link AppError} instance.
   */
  private static make(
    code: ErrorCode,
    severity: ErrorSeverity,
    message: string,
    opts: ErrorOptions = {}
  ): AppError {
    return new AppError({ code, severity, message, ...opts })
  }

  /**
   * `404` — Resource does not exist.
   *
   * Severity: `LOW` (expected, user-facing).
   *
   * @param message - UI-safe description of the missing resource.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: NOT_FOUND`.
   *
   * @example
   * throw AppError.notFound("Transaction not found.", {
   *   domain: "transactions",
   *   context: { transactionId: id },
   * })
   */
  static notFound(message: string, opts?: ErrorOptions): AppError {
    return AppError.make(ErrorCode.NOT_FOUND, ErrorSeverity.LOW, message, opts)
  }

  /**
   * `401` — Caller has no identity / session is missing or expired.
   *
   * Severity: `LOW`.
   *
   * @param message - Defaults to `"Authentication required."`.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: UNAUTHORIZED`.
   *
   * @example
   * throw AppError.unauthorized(undefined, { domain: "auth" })
   */
  static unauthorized(
    message = "Authentication required.",
    opts?: ErrorOptions
  ): AppError {
    return AppError.make(
      ErrorCode.UNAUTHORIZED,
      ErrorSeverity.LOW,
      message,
      opts
    )
  }

  /**
   * `403` — Caller is authenticated but lacks permission for this action.
   *
   * Severity: `LOW`.
   *
   * @param message - Defaults to `"You don't have permission to perform this action."`.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: FORBIDDEN`.
   *
   * @example
   * throw AppError.forbidden(undefined, {
   *   domain: "accounts",
   *   context: { userId, requiredRole: "owner" },
   * })
   */
  static forbidden(
    message = "You don't have permission to perform this action.",
    opts?: ErrorOptions
  ): AppError {
    return AppError.make(ErrorCode.FORBIDDEN, ErrorSeverity.LOW, message, opts)
  }

  /**
   * `409` — State conflict (duplicate, already-exists, wrong-state transition).
   *
   * Severity: `MEDIUM` (unexpected but recoverable).
   *
   * @param message - UI-safe conflict description.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: CONFLICT`.
   *
   * @example
   * throw AppError.conflict("An account with this name already exists.", {
   *   domain: "accounts",
   *   context: { name: input.name, ownerId },
   * })
   */
  static conflict(message: string, opts?: ErrorOptions): AppError {
    return AppError.make(
      ErrorCode.CONFLICT,
      ErrorSeverity.MEDIUM,
      message,
      opts
    )
  }

  /**
   * `422` — Input is structurally valid but semantically wrong.
   *
   * Use for business-rule violations after schema validation has passed.
   * Severity: `LOW`.
   *
   * @param message - UI-safe validation message.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: INVALID_INPUT`.
   *
   * @example
   * throw AppError.invalidInput("Start date must be before end date.", {
   *   domain: "reports",
   *   context: { startDate, endDate },
   * })
   */
  static invalidInput(message: string, opts?: ErrorOptions): AppError {
    return AppError.make(
      ErrorCode.INVALID_INPUT,
      ErrorSeverity.LOW,
      message,
      opts
    )
  }

  /**
   * `412` — A required pre-condition is not satisfied.
   *
   * Severity: `MEDIUM`.
   *
   * @param message - UI-safe pre-condition description.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: PRECONDITION_FAILED`.
   *
   * @example
   * throw AppError.preconditionFailed("Connect a bank account before importing.", {
   *   domain: "imports",
   *   context: { userId },
   * })
   */
  static preconditionFailed(message: string, opts?: ErrorOptions): AppError {
    return AppError.make(
      ErrorCode.PRECONDITION_FAILED,
      ErrorSeverity.MEDIUM,
      message,
      opts
    )
  }

  /**
   * `429` — Caller has exceeded the request rate limit.
   *
   * Severity: `LOW`.
   *
   * @param message - Defaults to `"Too many requests. Please slow down."`.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: RATE_LIMITED`.
   *
   * @example
   * throw AppError.rateLimited(undefined, {
   *   domain: "api",
   *   context: { userId, windowMs: 60_000 },
   * })
   */
  static rateLimited(
    message = "Too many requests. Please slow down.",
    opts?: ErrorOptions
  ): AppError {
    return AppError.make(
      ErrorCode.RATE_LIMITED,
      ErrorSeverity.LOW,
      message,
      opts
    )
  }

  /**
   * `402` — Plan or usage quota has been reached.
   *
   * Severity: `MEDIUM`.
   *
   * @param message - UI-safe quota description.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: QUOTA_EXCEEDED`.
   *
   * @example
   * throw AppError.quotaExceeded("You've reached your 5-account limit.", {
   *   domain: "billing",
   *   context: { limit: 5, current: 5, ownerId },
   * })
   */
  static quotaExceeded(message: string, opts?: ErrorOptions): AppError {
    return AppError.make(
      ErrorCode.QUOTA_EXCEEDED,
      ErrorSeverity.MEDIUM,
      message,
      opts
    )
  }

  /**
   * `500` — Intentional surface of an internal/unexpected failure.
   *
   * Severity: `HIGH` — will trigger alerts.
   *
   * @param message - Defaults to `"An unexpected error occurred."`.
   * @param opts    - Optional domain, detail, context. Put root cause in `detail`.
   * @returns `AppError` with `code: INTERNAL`.
   *
   * @example
   * throw AppError.internal("Failed to persist transaction.", {
   *   domain: "transactions",
   *   detail: err instanceof Error ? err.message : String(err),
   *   context: { transactionId },
   * })
   */
  static internal(
    message = "An unexpected error occurred.",
    opts?: ErrorOptions
  ): AppError {
    return AppError.make(ErrorCode.INTERNAL, ErrorSeverity.HIGH, message, opts)
  }

  /**
   * `503` — An upstream dependency is unavailable.
   *
   * Severity: `HIGH` — will trigger alerts.
   *
   * @param message - Defaults to `"Service temporarily unavailable."`.
   * @param opts    - Optional domain, detail, context.
   * @returns `AppError` with `code: UNAVAILABLE`.
   *
   * @example
   * throw AppError.unavailable(undefined, {
   *   domain: "db",
   *   detail: "Prisma connection timeout after 5000ms",
   *   context: { service: "postgres" },
   * })
   */
  static unavailable(
    message = "Service temporarily unavailable.",
    opts?: ErrorOptions
  ): AppError {
    return AppError.make(
      ErrorCode.UNAVAILABLE,
      ErrorSeverity.HIGH,
      message,
      opts
    )
  }

  /**
   * Escape hatch for errors that don't fit a standard factory.
   *
   * Accepts the full {@link AppErrorData} shape directly — use when you need
   * a non-standard `severity` or a strongly-typed `context` generic.
   *
   * @template C - Explicit context shape.
   * @param data - Full error data payload.
   * @returns `AppError<C>` with the provided data.
   *
   * @example
   * throw AppError.custom<{ retryAfter: number }>({
   *   code: ErrorCode.RATE_LIMITED,
   *   severity: ErrorSeverity.MEDIUM, // override default LOW
   *   message: "Slow down — retry after the window.",
   *   domain: "api",
   *   context: { retryAfter: 30 },
   * })
   */
  static custom<C extends Record<string, unknown> = Record<string, unknown>>(
    data: AppErrorData<C>
  ): AppError<C> {
    return new AppError<C>(data)
  }
}
