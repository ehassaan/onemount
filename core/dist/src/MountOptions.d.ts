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
export declare const s3Defaults: {
    config_fs_advanced: boolean;
    no_check_bucket: boolean;
    env_auth: boolean;
};
export interface MountOptions {
    type: keyof typeof backends;
    localPath: string;
    remoteUri: string;
    authType: "SSO" | "KEY";
    nativeArgs: {
        [k: string]: any;
    };
}
//# sourceMappingURL=MountOptions.d.ts.map