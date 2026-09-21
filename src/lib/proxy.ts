import { z, ZodSchema } from 'zod';

export interface ProxyResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ProxyOptions<TInput, TOutput> {
  schema?: ZodSchema<TInput>;
  onSuccessToast?: string | ((data: TOutput) => string);
  onErrorToast?: string | ((error: string) => string);
}

/**
 * Validates payload against Zod schema and runs server handler / API call safely.
 */
export async function proxyAction<TInput, TOutput>(
  action: (validatedInput: TInput) => Promise<any>,
  input: TInput,
  options?: ProxyOptions<TInput, TOutput>
): Promise<ProxyResponse<TOutput>> {
  try {
    let payload = input;

    // 1. Zod Validation
    if (options?.schema) {
      const parsed = options.schema.safeParse(input);
      if (!parsed.success) {
        const fieldErrors: Record<string, string[]> = {};
        const issues = (parsed.error as any).issues || (parsed.error as any).errors || [];

        issues.forEach((issue: any) => {
          const path = issue.path.join('.') || 'general';
          if (!fieldErrors[path]) fieldErrors[path] = [];
          fieldErrors[path].push(issue.message);
        });

        const firstErrorMsg = issues[0]?.message || 'Validation failed. Please check your inputs.';

        return {
          success: false,
          error: firstErrorMsg,
          errors: fieldErrors,
          status: 422,
        };
      }
      payload = parsed.data;
    }

    // 2. Execute Action / Database operation
    const result = await action(payload);

    if (result && typeof result === 'object') {
      if (result.success === false) {
        return {
          success: false,
          error: result.error || 'Operation failed',
          message: result.message,
          status: 400,
        };
      }
      return {
        success: true,
        data: result.data !== undefined ? result.data : result,
        message: result.message || 'Operation successful',
        status: 200,
      };
    }

    return {
      success: true,
      data: result as TOutput,
      status: 200,
    };
  } catch (error: any) {
    console.error('proxyAction execution error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected server error occurred',
      status: 500,
    };
  }
}

/**
 * Client-side Proxy Fetcher with Zod validation, HTTP status handling, and response typing.
 */
export async function proxyFetch<TInput, TOutput>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: TInput;
    schema?: ZodSchema<TInput>;
    headers?: Record<string, string>;
  } = {}
): Promise<ProxyResponse<TOutput>> {
  try {
    const { method = 'GET', body, schema, headers = {} } = options;

    let payload = body;

    // Validate body before network request
    if (schema && body !== undefined) {
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        const issues = (parsed.error as any).issues || (parsed.error as any).errors || [];
        return {
          success: false,
          error: issues[0]?.message || 'Validation failed',
          status: 422,
        };
      }
      payload = parsed.data;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (payload && method !== 'GET') {
      fetchOptions.body = JSON.stringify(payload);
    }

    const res = await fetch(url, fetchOptions);
    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      return {
        success: false,
        error: data.error || `HTTP error ${res.status}: ${res.statusText}`,
        status: res.status,
      };
    }

    return {
      success: true,
      data: data.data !== undefined ? data.data : data,
      message: data.message,
      status: res.status,
    };
  } catch (err: any) {
    console.error('proxyFetch error:', err);
    return {
      success: false,
      error: err.message || 'Network request failed. Please check your connection.',
      status: 0,
    };
  }
}
