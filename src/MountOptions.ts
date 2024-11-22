
export interface S3MountOptions {
    provider: "AWS";
    region?: string;
    env_auth?: boolean;
    access_key_id?: string;
    secret_access_key?: string;
    endpoint?: string;
    location_constraint?: string; // same as region
    server_side_encryption?: "AES256" | "aws:kms";
    sse_kms_key_id?: string,
    sse_customer_algorithm?: string;
    sse_customer_key?: string;
    sse_customer_key_base64?: boolean;
    profile?: string;
    session_token?: string;
}

export const s3Defaults = {
    config_fs_advanced: true,
    no_check_bucket: true,
    env_auth: true
};
// .\lib\win32\amd64\rclone.exe config create testremote s3 --non-interactive --all provider=AWS env_auth=false access_key_id= secret_access_key= region=us-east-1 endpoint= location_constraint=us-east-1 acl= server_side_encryption=AES256 sse_kms_key_id= storage_class= config_fs_advanced=true bucket_acl= requester_pays=false sse_customer_algorithm= sse_customer_key= sse_customer_key_base64= sse_customer_key_md5= upload_cutoff= chunk_size= max_upload_parts= copy_cutoff= disable_checksum= shared_credentials_file= profile= session_token= upload_concurrency= force_path_style= v2_auth= use_dual_stack= use_accelerate_endpoint= leave_parts_on_error= list_chunk= list_version= list_url_encode= no_check_bucket=true no_head= no_head_object= encoding= disable_http2= download_url= directory_markers= use_multipart_etag= use_unsigned_payload= use_presigned_request= versions= version_at= version_deleted= decompress= might_gzip= use_accept_encoding_gzip= no_system_metadata= use_already_exists= use_multipart_uploads= sdk_log_mode=

export interface MountOptions {
    type: "s3" | "blob" | "minio" | "gcs";
    localPath: string;
    remoteUri: string;
    authType: "SSO" | "KEY";
    nativeArgs: S3MountOptions;
};
