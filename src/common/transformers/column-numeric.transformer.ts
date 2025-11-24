// src/common/transformers/column-numeric.transformer.ts
import { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (data !== null && data !== undefined) {
      return data;
    }
    return null;
  }

  from(data?: string | null): number | null {
    if (data !== null && data !== undefined) {
      const res = parseFloat(data);
      if (isNaN(res)) {
        return null;
      }
      return res;
    }
    return null;
  }
}
