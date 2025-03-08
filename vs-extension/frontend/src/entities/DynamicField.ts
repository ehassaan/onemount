
export interface IDynamicField {
    name: string;
    label: string;
    type: 'text' | 'select' | 'number' | 'password';
    required?: boolean;
    rules?: ((v: any) => boolean | string)[];
    options?: { name: string; label: string; icon?: any; nested?: IDynamicField[]; }[];
    placeholder?: string | (() => string);
}
