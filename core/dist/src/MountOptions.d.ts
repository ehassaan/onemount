import backends from "../assets/options.json";
export interface S3MountOptions {
    provider?: string;
    region?: string;
    env_auth?: boolean;
    access_key_id?: string;
    secret_access_key?: string;
    endpoint?: string;
    location_constraint?: string;
    server_side_encryption?: "AES256" | "aws:kms";
    sse_kms_key_id?: string;
    sse_customer_algorithm?: string;
    sse_customer_key?: string;
    sse_customer_key_base64?: boolean;
    profile?: string;
    session_token?: string;
}
export interface MountOptions<T extends BackendType> {
    type: T;
    localPath: string;
    remoteUri: string;
    authType: "SSO" | "KEY";
    nativeArgs: Partial<{
        [k in NativeArgName<T>]: any;
    }>;
}
export type BackendType = keyof typeof backends;
export type Backend<T extends BackendType> = typeof backends[T];
export type NativeArgName<T extends BackendType> = keyof Backend<T>["options"];
export interface BackendOption {
    Name: string;
    FieldName: string;
    Help: string;
    Default: any;
    Value: null;
    Hide: number;
    Required: boolean;
    IsPassword: boolean;
    NoPrefix: boolean;
    Advanced: boolean;
    Exclusive: boolean;
    Sensitive: boolean;
    DefaultStr: string;
    ValueStr: string;
    Type: string;
}
//# sourceMappingURL=MountOptions.d.ts.map