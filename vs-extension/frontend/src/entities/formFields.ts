import type { IDynamicField } from './DynamicField';


export const azure: IDynamicField[] = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'myconnection',
        required: true,
        type: 'text',
    },
    {
        name: 'uri',
        label: 'Remote URI',
        required: true,
        placeholder: 'https://example.com/mybucket/mypath',
        type: 'text',
    },
    {
        name: 'authType',
        label: 'Authentication',
        required: true,
        type: "select",
        options: [
            {
                name: 'az',
                label: 'Azure CLI'
            },
            {
                name: 'accountKey',
                label: 'Account Key',
                nested: [
                    {
                        name: 'account',
                        label: 'Account',
                        required: true,
                        type: 'text',
                    },
                    {
                        name: 'key',
                        label: 'Account Key',
                        required: true,
                        type: 'password',
                    },
                ]
            },
            {
                name: 'sasToken',
                label: 'SAS Token',
                nested: [
                    {
                        name: 'sas_url',
                        label: 'SAS Token',
                        required: true,
                        type: 'password',
                    },
                ]
            },
            {
                name: 'servicePrincipal',
                label: 'Service Principal',
                nested: [
                    {
                        name: 'tenant',
                        label: 'Tenant ID',
                        required: true,
                        type: 'text',
                    },
                    {
                        name: 'client_id',
                        label: 'Client ID',
                        required: true,
                        type: 'text',
                    },
                    {
                        name: 'client_secret',
                        label: 'Client Secret',
                        required: true,
                        type: 'password',
                    },
                ]
            },
        ],
    },

];


export const minio: IDynamicField[] = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'myconnection',
        required: true,
        type: 'text',
    },
    {
        name: 'uri',
        label: 'Remote URI',
        required: true,
        placeholder: 'https://example.com/mybucket/mypath',
        type: 'text',
    },
    {
        name: 'authType',
        label: 'Authentication',
        required: true,
        type: 'select',
        options: [
            {
                name: 'iam',
                label: 'IAM User',
                nested: [
                    {
                        name: 'access_key_id',
                        label: 'Access Key ID',
                        required: true,
                        type: 'text',
                    },
                    {
                        name: 'secret_access_key ',
                        label: 'Secret Access Key',
                        required: true,
                        type: 'password',
                    },
                ]
            },
        ],
    },

];


export const aws: IDynamicField[] = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'myconnection',
        required: true,
        type: 'text',
    },
    {
        name: 'uri',
        label: 'Remote URI',
        required: true,
        placeholder: 'https://example.com/mybucket/mypath',
        type: 'text',
    },
    {
        name: 'authType',
        label: 'Authentication',
        required: true,
        type: 'select',
        options: [
            {
                name: 'env_auth',
                label: 'AWS CLI',
                nested: [
                    {
                        name: 'profile',
                        label: 'AWS CLI Profile',
                        placeholder: 'default',
                        type: 'text',
                    }
                ]
            },
            {
                name: 'iam',
                label: 'IAM User',
                nested: [
                    {
                        name: 'access_key_id',
                        label: 'Access Key ID',
                        required: true,
                        type: 'text',
                    },
                    {
                        name: 'secret_access_key',
                        label: 'Secret Access Key',
                        required: true,
                        type: 'password',
                    },
                ]
            },
        ],
    },
];


export const gcs: IDynamicField[] = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'myconnection',
        required: true,
        type: 'text',
    },
    {
        name: 'uri',
        label: 'Remote URI',
        required: true,
        placeholder: 'https://example.com/mybucket/mypath',
        type: 'text',
    },
    {
        name: 'authType',
        label: 'Authentication',
        required: true,
        type: 'select',
        options: [
            {
                name: 'env_auth',
                label: 'Interactive Login',
            },
            {
                name: 'service_account_file',
                label: 'Service Account File',
                nested: [
                    {
                        name: 'service_account_file',
                        label: 'File Path',
                        required: true,
                        type: 'text',
                        placeholder: 'credentials.json',
                    },
                ]
            }
        ],
    },
];

export const connectionTypes = {
    blob: azure,
    minio,
    aws_s3: aws,
    gcs
};