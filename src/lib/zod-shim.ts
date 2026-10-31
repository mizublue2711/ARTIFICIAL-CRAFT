/**
 * ARTIFICIAL CRAFT - Lightweight Type-Safe Zod Drop-in Shim
 * Provides zero-dependency Zod compatibility for SwissDesignConfigSchema
 */

export interface SafeParseSuccess<T> {
  success: true;
  data: T;
}

export interface SafeParseError {
  success: false;
  error: {
    issues: Array<{ path: (string | number)[]; message: string }>;
    format: () => Record<string, unknown>;
  };
}

export type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseError;

export abstract class ZodType<Output = any, Input = any> {
  _output!: Output;
  _input!: Input;

  abstract parse(val: unknown): Output;

  safeParse(val: unknown): SafeParseResult<Output> {
    try {
      const data = this.parse(val);
      return { success: true, data };
    } catch (err: any) {
      const message = err?.message || 'Validation error';
      return {
        success: false,
        error: {
          issues: [{ path: [], message }],
          format: () => ({ _errors: [message] }),
        },
      };
    }
  }

  default(def: any): ZodDefault<this> {
    return new ZodDefault(this, def);
  }

  optional(): ZodOptional<this> {
    return new ZodOptional(this);
  }
}

export class ZodDefault<T extends ZodType> extends ZodType<T['_output']> {
  constructor(public innerType: T, public defaultValue: any) {
    super();
  }

  parse(val: unknown): T['_output'] {
    if (val === undefined || val === null || (typeof val === 'object' && Object.keys(val as any).length === 0)) {
      const def = typeof this.defaultValue === 'function' ? this.defaultValue() : this.defaultValue;
      try {
        return this.innerType.parse(def);
      } catch {
        return def;
      }
    }
    return this.innerType.parse(val);
  }
}

export class ZodOptional<T extends ZodType> extends ZodType<T['_output'] | undefined> {
  constructor(public innerType: T) {
    super();
  }

  parse(val: unknown): T['_output'] | undefined {
    if (val === undefined) return undefined;
    return this.innerType.parse(val);
  }
}

export class ZodString extends ZodType<string> {
  private minLength?: number;
  private minMessage?: string;
  private maxLength?: number;
  private isUrl = false;

  min(len: number, msg?: string): this {
    this.minLength = len;
    this.minMessage = msg;
    return this;
  }

  max(len: number): this {
    this.maxLength = len;
    return this;
  }

  url(): this {
    this.isUrl = true;
    return this;
  }

  parse(val: unknown): string {
    if (typeof val !== 'string') {
      throw new Error('Expected string');
    }
    if (this.minLength !== undefined && val.length < this.minLength) {
      throw new Error(this.minMessage || `String must contain at least ${this.minLength} character(s)`);
    }
    if (this.maxLength !== undefined && val.length > this.maxLength) {
      throw new Error(`String must contain at most ${this.maxLength} character(s)`);
    }
    return val;
  }
}

export class ZodNumber extends ZodType<number> {
  private minVal?: number;
  private maxVal?: number;

  min(val: number): this {
    this.minVal = val;
    return this;
  }

  max(val: number): this {
    this.maxVal = val;
    return this;
  }

  parse(val: unknown): number {
    if (typeof val !== 'number' || isNaN(val)) {
      throw new Error('Expected number');
    }
    if (this.minVal !== undefined && val < this.minVal) {
      throw new Error(`Number must be greater than or equal to ${this.minVal}`);
    }
    if (this.maxVal !== undefined && val > this.maxVal) {
      throw new Error(`Number must be less than or equal to ${this.maxVal}`);
    }
    return val;
  }
}

export class ZodBoolean extends ZodType<boolean> {
  parse(val: unknown): boolean {
    if (typeof val !== 'boolean') {
      throw new Error('Expected boolean');
    }
    return val;
  }
}

export class ZodEnum<U extends string, T extends [U, ...U[]]> extends ZodType<T[number]> {
  constructor(public values: T) {
    super();
  }

  parse(val: unknown): T[number] {
    if (typeof val !== 'string' || !this.values.includes(val as any)) {
      throw new Error(`Invalid enum value. Expected one of: ${this.values.join(', ')}`);
    }
    return val as T[number];
  }
}

export class ZodObject<T extends Record<string, ZodType>> extends ZodType<{ [K in keyof T]: T[K]['_output'] }> {
  constructor(public shape: T) {
    super();
  }

  parse(val: unknown): { [K in keyof T]: T[K]['_output'] } {
    if (!val || typeof val !== 'object') {
      val = {};
    }
    const raw = val as Record<string, unknown>;
    const result: any = {};

    for (const key of Object.keys(this.shape)) {
      const fieldType = this.shape[key];
      const rawVal = raw[key];
      result[key] = fieldType.parse(rawVal);
    }

    return result;
  }
}

export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  boolean: () => new ZodBoolean(),
  enum: <U extends string, T extends [U, ...U[]]>(values: T) => new ZodEnum(values),
  object: <T extends Record<string, ZodType>>(shape: T) => new ZodObject(shape),
};

export namespace z {
  export type infer<T extends ZodType<any, any>> = T['_output'];
}

export default z;
