
const s3AuthTypes = [
    {
        name: 'env_auth',
        label: 'ENV Auth (CLI / Environment variables)'
    },
    {
        name: 'iam_user',
        label: 'IAM User'
    },
];

export const authTypes = {
    blob: [
        {
            name: 'env_auth',
            label: 'ENV Auth (CLI / Environment variables)'
        },
        {
            name: 'account_key',
            label: 'Account Key'
        },
        {
            name: 'sas_token',
            label: 'SAS Token'
        },
        {
            name: 'service_principal',
            label: 'Service Principal'
        }
    ],
    minio: s3AuthTypes,
    gcs: s3AuthTypes,
    aws_s3: s3AuthTypes
} as { [k: string]: { name: AuthType; label: string; }[]; };

export type AuthType = 'env_auth' | 'iam_user' | 'account_key' | 'sas_token' | 'service_principal';