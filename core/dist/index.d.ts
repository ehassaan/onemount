import { ChildProcessWithoutNullStreams } from 'node:child_process';

var alias = {
	name: "alias",
	description: "Alias for an existing remote",
	options: {
		remote: {
			Name: "remote",
			FieldName: "",
			Help: "Remote or path to alias.\n\nCan be \"myremote:path/to/dir\", \"myremote:bucket\", \"myremote:\" or \"/local/path\".",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var memory = {
	name: "memory",
	description: "In memory object storage system.",
	options: {
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var crypt = {
	name: "crypt",
	description: "Encrypt/Decrypt a remote",
	options: {
		remote: {
			Name: "remote",
			FieldName: "",
			Help: "Remote to encrypt/decrypt.\n\nNormally should contain a ':' and a path, e.g. \"myremote:path/to/dir\",\n\"myremote:bucket\" or maybe \"myremote:\" (not recommended).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		filename_encryption: {
			Name: "filename_encryption",
			FieldName: "",
			Help: "How to encrypt the filenames.",
			Default: "standard",
			Value: null,
			Examples: [
				{
					Value: "standard",
					Help: "Encrypt the filenames.\nSee the docs for the details."
				},
				{
					Value: "obfuscate",
					Help: "Very simple filename obfuscation."
				},
				{
					Value: "off",
					Help: "Don't encrypt the file names.\nAdds a \".bin\", or \"suffix\" extension only."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "standard",
			ValueStr: "standard",
			Type: "string"
		},
		directory_name_encryption: {
			Name: "directory_name_encryption",
			FieldName: "",
			Help: "Option to either encrypt directory names or leave them intact.\n\nNB If filename_encryption is \"off\" then this option will do nothing.",
			Default: true,
			Value: null,
			Examples: [
				{
					Value: "true",
					Help: "Encrypt directory names."
				},
				{
					Value: "false",
					Help: "Don't encrypt directory names, leave them intact."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "Password or pass phrase for encryption.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password2: {
			Name: "password2",
			FieldName: "",
			Help: "Password or pass phrase for salt.\n\nOptional but recommended.\nShould be different to the previous password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		server_side_across_configs: {
			Name: "server_side_across_configs",
			FieldName: "",
			Help: "Deprecated: use --server-side-across-configs instead.\n\nAllow server-side operations (e.g. copy) to work across different crypt configs.\n\nNormally this option is not what you want, but if you have two crypts\npointing to the same backend you can use it.\n\nThis can be used, for example, to change file name encryption type\nwithout re-uploading all the data. Just make two crypt backends\npointing to two different directories with the single changed\nparameter and use rclone move to move the files between the crypt\nremotes.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_data_encryption: {
			Name: "no_data_encryption",
			FieldName: "",
			Help: "Option to either encrypt file data or leave it unencrypted.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "true",
					Help: "Don't encrypt file data, leave it unencrypted."
				},
				{
					Value: "false",
					Help: "Encrypt file data."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		pass_bad_blocks: {
			Name: "pass_bad_blocks",
			FieldName: "",
			Help: "If set this will pass bad blocks through as all 0.\n\nThis should not be set in normal operation, it should only be set if\ntrying to recover an encrypted file with errors and it is desired to\nrecover as much of the file as possible.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		strict_names: {
			Name: "strict_names",
			FieldName: "",
			Help: "If set, this will raise an error when crypt comes across a filename that can't be decrypted.\n\n(By default, rclone will just log a NOTICE and continue as normal.)\nThis can happen if encrypted and unencrypted files are stored in the same\ndirectory (which is not recommended.) It may also indicate a more serious\nproblem that should be investigated.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		filename_encoding: {
			Name: "filename_encoding",
			FieldName: "",
			Help: "How to encode the encrypted filename to text string.\n\nThis option could help with shortening the encrypted filename. The \nsuitable option would depend on the way your remote count the filename\nlength and if it's case sensitive.",
			Default: "base32",
			Value: null,
			Examples: [
				{
					Value: "base32",
					Help: "Encode using base32. Suitable for all remote."
				},
				{
					Value: "base64",
					Help: "Encode using base64. Suitable for case sensitive remote."
				},
				{
					Value: "base32768",
					Help: "Encode using base32768. Suitable if your remote counts UTF-16 or\nUnicode codepoint instead of UTF-8 byte length. (Eg. Onedrive, Dropbox)"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "base32",
			ValueStr: "base32",
			Type: "string"
		},
		suffix: {
			Name: "suffix",
			FieldName: "",
			Help: "If this is set it will override the default suffix of \".bin\".\n\nSetting suffix to \"none\" will result in an empty suffix. This may be useful \nwhen the path length is critical.",
			Default: ".bin",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: ".bin",
			ValueStr: ".bin",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var hdfs = {
	name: "hdfs",
	description: "Hadoop distributed file system",
	options: {
		namenode: {
			Name: "namenode",
			FieldName: "",
			Help: "Hadoop name nodes and ports.\n\nE.g. \"namenode-1:8020,namenode-2:8020,...\" to connect to host namenodes at port 8020.",
			Default: null,
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "CommaSepList"
		},
		username: {
			Name: "username",
			FieldName: "",
			Help: "Hadoop user name.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "root",
					Help: "Connect to hdfs as root."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		service_principal_name: {
			Name: "service_principal_name",
			FieldName: "",
			Help: "Kerberos service principal name for the namenode.\n\nEnables KERBEROS authentication. Specifies the Service Principal Name\n(SERVICE/FQDN) for the namenode. E.g. \\\"hdfs/namenode.hadoop.docker\\\"\nfor namenode running as service 'hdfs' with FQDN 'namenode.hadoop.docker'.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		data_transfer_protection: {
			Name: "data_transfer_protection",
			FieldName: "",
			Help: "Kerberos data transfer protection: authentication|integrity|privacy.\n\nSpecifies whether or not authentication, data signature integrity\nchecks, and wire encryption are required when communicating with\nthe datanodes. Possible values are 'authentication', 'integrity'\nand 'privacy'. Used only with KERBEROS enabled.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "privacy",
					Help: "Ensure authentication, integrity and encryption enabled."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50430082,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Colon,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,Colon,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var local = {
	name: "local",
	description: "Local Disk",
	options: {
		nounc: {
			Name: "nounc",
			FieldName: "",
			Help: "Disable UNC (long path names) conversion on Windows.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "true",
					Help: "Disables long file names."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		copy_links: {
			Name: "copy_links",
			FieldName: "",
			Help: "Follow symlinks and copy the pointed to item.",
			Default: false,
			Value: null,
			ShortOpt: "L",
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: true,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		links: {
			Name: "links",
			FieldName: "",
			Help: "Translate symlinks to/from regular files with a '.rclonelink' extension.",
			Default: false,
			Value: null,
			ShortOpt: "l",
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: true,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		skip_links: {
			Name: "skip_links",
			FieldName: "",
			Help: "Don't warn about skipped symlinks.\n\nThis flag disables warning messages on skipped symlinks or junction\npoints, as you explicitly acknowledge that they should be skipped.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: true,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		zero_size_links: {
			Name: "zero_size_links",
			FieldName: "",
			Help: "Assume the Stat size of links is zero (and read them instead) (deprecated).\n\nRclone used to use the Stat size of links as the link size, but this fails in quite a few places:\n\n- Windows\n- On some virtual filesystems (such ash LucidLink)\n- Android\n\nSo rclone now always reads the link.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		unicode_normalization: {
			Name: "unicode_normalization",
			FieldName: "",
			Help: "Apply unicode NFC normalization to paths and filenames.\n\nThis flag can be used to normalize file names into unicode NFC form\nthat are read from the local filesystem.\n\nRclone does not normally touch the encoding of file names it reads from\nthe file system.\n\nThis can be useful when using macOS as it normally provides decomposed (NFD)\nunicode which in some language (eg Korean) doesn't display properly on\nsome OSes.\n\nNote that rclone compares filenames with unicode normalization in the sync\nroutine so this flag shouldn't normally be used.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_check_updated: {
			Name: "no_check_updated",
			FieldName: "",
			Help: "Don't check to see if the files change during upload.\n\nNormally rclone checks the size and modification time of files as they\nare being uploaded and aborts with a message which starts \"can't copy -\nsource file is being updated\" if the file changes during upload.\n\nHowever on some file systems this modification time check may fail (e.g.\n[Glusterfs #2206](https://github.com/rclone/rclone/issues/2206)) so this\ncheck can be disabled with this flag.\n\nIf this flag is set, rclone will use its best efforts to transfer a\nfile which is being updated. If the file is only having things\nappended to it (e.g. a log) then rclone will transfer the log file with\nthe size it had the first time rclone saw it.\n\nIf the file is being modified throughout (not just appended to) then\nthe transfer may fail with a hash check failure.\n\nIn detail, once the file has had stat() called on it for the first\ntime we:\n\n- Only transfer the size that stat gave\n- Only checksum the size that stat gave\n- Don't update the stat info for the file\n\n**NB** do not use this flag on a Windows Volume Shadow (VSS). For some\nunknown reason, files in a VSS sometimes show different sizes from the\ndirectory listing (where the initial stat value comes from on Windows)\nand when stat is called on them directly. Other copy tools always use\nthe direct stat value and setting this flag will disable that.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		one_file_system: {
			Name: "one_file_system",
			FieldName: "",
			Help: "Don't cross filesystem boundaries (unix/macOS only).",
			Default: false,
			Value: null,
			ShortOpt: "x",
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: true,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		case_sensitive: {
			Name: "case_sensitive",
			FieldName: "",
			Help: "Force the filesystem to report itself as case sensitive.\n\nNormally the local backend declares itself as case insensitive on\nWindows/macOS and case sensitive for everything else.  Use this flag\nto override the default choice.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		case_insensitive: {
			Name: "case_insensitive",
			FieldName: "",
			Help: "Force the filesystem to report itself as case insensitive.\n\nNormally the local backend declares itself as case insensitive on\nWindows/macOS and case sensitive for everything else.  Use this flag\nto override the default choice.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_clone: {
			Name: "no_clone",
			FieldName: "",
			Help: "Disable reflink cloning for server-side copies.\n\nNormally, for local-to-local transfers, rclone will \"clone\" the file when\npossible, and fall back to \"copying\" only when cloning is not supported.\n\nCloning creates a shallow copy (or \"reflink\") which initially shares blocks with\nthe original file. Unlike a \"hardlink\", the two files are independent and\nneither will affect the other if subsequently modified.\n\nCloning is usually preferable to copying, as it is much faster and is\ndeduplicated by default (i.e. having two identical files does not consume more\nstorage than having just one.)  However, for use cases where data redundancy is\npreferable, --local-no-clone can be used to disable cloning and force \"deep\" copies.\n\nCurrently, cloning is only supported when using APFS on macOS (support for other\nplatforms may be added in the future.)",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_preallocate: {
			Name: "no_preallocate",
			FieldName: "",
			Help: "Disable preallocation of disk space for transferred files.\n\nPreallocation of disk space helps prevent filesystem fragmentation.\nHowever, some virtual filesystem layers (such as Google Drive File\nStream) may incorrectly set the actual file size equal to the\npreallocated space, causing checksum and file size checks to fail.\nUse this flag to disable preallocation.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_sparse: {
			Name: "no_sparse",
			FieldName: "",
			Help: "Disable sparse files for multi-thread downloads.\n\nOn Windows platforms rclone will make sparse files when doing\nmulti-thread downloads. This avoids long pauses on large files where\nthe OS zeros the file. However sparse files may be undesirable as they\ncause disk fragmentation and can be slow to work with.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_set_modtime: {
			Name: "no_set_modtime",
			FieldName: "",
			Help: "Disable setting modtime.\n\nNormally rclone updates modification time of files after they are done\nuploading. This can cause permissions issues on Linux platforms when \nthe user rclone is running as does not own the file uploaded, such as\nwhen copying to a CIFS mount owned by another user. If this option is \nenabled, rclone will no longer update the modtime after copying a file.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		time_type: {
			Name: "time_type",
			FieldName: "",
			Help: "Set what kind of time is returned.\n\nNormally rclone does all operations on the mtime or Modification time.\n\nIf you set this flag then rclone will return the Modified time as whatever\nyou set here. So if you use \"rclone lsl --local-time-type ctime\" then\nyou will see ctimes in the listing.\n\nIf the OS doesn't support returning the time_type specified then rclone\nwill silently replace it with the modification time which all OSes support.\n\n- mtime is supported by all OSes\n- atime is supported on all OSes except: plan9, js\n- btime is only supported on: Windows, macOS, freebsd, netbsd\n- ctime is supported on all Oses except: Windows, plan9, js\n\nNote that setting the time will still set the modified time so this is\nonly useful for reading.\n",
			Default: 0,
			Value: null,
			Examples: [
				{
					Value: "mtime",
					Help: "The last modification time."
				},
				{
					Value: "atime",
					Help: "The last access time."
				},
				{
					Value: "btime",
					Help: "The creation time."
				},
				{
					Value: "ctime",
					Help: "The last status change time."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "mtime",
			ValueStr: "mtime",
			Type: "mtime|atime|btime|ctime"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 56698766,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,RightSpace,RightPeriod,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,RightSpace,RightPeriod,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var protondrive = {
	name: "protondrive",
	description: "Proton Drive",
	options: {
		username: {
			Name: "username",
			FieldName: "",
			Help: "The username of your proton account",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "The password of your proton account.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		"2fa": {
			Name: "2fa",
			FieldName: "",
			Help: "The 2FA code\n\nThe value can also be provided with --protondrive-2fa=000000\n\nThe 2FA code of your proton drive account if the account is set up with \ntwo-factor authentication",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		mailbox_password: {
			Name: "mailbox_password",
			FieldName: "",
			Help: "The mailbox password of your two-password proton account.\n\nFor more information regarding the mailbox password, please check the \nfollowing official knowledge base article: \nhttps://proton.me/support/the-difference-between-the-mailbox-password-and-login-password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 52559874,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LeftSpace,RightSpace,InvalidUtf8,Dot",
			ValueStr: "Slash,LeftSpace,RightSpace,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		original_file_size: {
			Name: "original_file_size",
			FieldName: "",
			Help: "Return the file size before encryption\n\t\t\t\nThe size of the encrypted file will be different from (bigger than) the \noriginal file size. Unless there is a reason to return the file size \nafter encryption is performed, otherwise, set this option to true, as \nfeatures like Open() which will need to be supplied with original content \nsize, will fail to operate properly",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		app_version: {
			Name: "app_version",
			FieldName: "",
			Help: "The app version string \n\nThe app version string indicates the client that is currently performing \nthe API request. This information is required and will be sent with every \nAPI request.",
			Default: "macos-drive@1.0.0-alpha.1+rclone",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "macos-drive@1.0.0-alpha.1+rclone",
			ValueStr: "macos-drive@1.0.0-alpha.1+rclone",
			Type: "string"
		},
		replace_existing_draft: {
			Name: "replace_existing_draft",
			FieldName: "",
			Help: "Create a new revision when filename conflict is detected\n\nWhen a file upload is cancelled or failed before completion, a draft will be \ncreated and the subsequent upload of the same file to the same location will be \nreported as a conflict.\n\nThe value can also be set by --protondrive-replace-existing-draft=true\n\nIf the option is set to true, the draft will be replaced and then the upload \noperation will restart. If there are other clients also uploading at the same \nfile location at the same time, the behavior is currently unknown. Need to set \nto true for integration tests.\nIf the option is set to false, an error \"a draft exist - usually this means a \nfile is being uploaded at another client, or, there was a failed upload attempt\" \nwill be returned, and no upload will happen.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		enable_caching: {
			Name: "enable_caching",
			FieldName: "",
			Help: "Caches the files and folders metadata to reduce API calls\n\nNotice: If you are mounting ProtonDrive as a VFS, please disable this feature, \nas the current implementation doesn't update or clear the cache when there are \nexternal changes. \n\nThe files and folders on ProtonDrive are represented as links with keyrings, \nwhich can be cached to improve performance and be friendly to the API server.\n\nThe cache is currently built for the case when the rclone is the only instance \nperforming operations to the mount point. The event system, which is the proton\nAPI system that provides visibility of what has changed on the drive, is yet \nto be implemented, so updates from other clients won’t be reflected in the \ncache. Thus, if there are concurrent clients accessing the same mount point, \nthen we might have a problem with caching the stale data.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var storj = {
	name: "storj",
	description: "Storj Decentralized Cloud Storage",
	options: {
		provider: {
			Name: "provider",
			FieldName: "",
			Help: "Choose an authentication method.",
			Default: "existing",
			Value: null,
			Examples: [
				{
					Value: "existing",
					Help: "Use an existing access grant."
				},
				{
					Value: "new",
					Help: "Create a new access grant from satellite address, API key, and passphrase."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "existing",
			ValueStr: "existing",
			Type: "string"
		},
		access_grant: {
			Name: "access_grant",
			FieldName: "",
			Help: "Access grant.",
			Provider: "existing",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var tardigrade = {
	name: "tardigrade",
	description: "Storj Decentralized Cloud Storage",
	options: {
	}
};
var azurefiles = {
	name: "azurefiles",
	description: "Microsoft Azure Files",
	options: {
		account: {
			Name: "account",
			FieldName: "",
			Help: "Azure Storage Account Name.\n\nSet this to the Azure Storage Account Name in use.\n\nLeave blank to use SAS URL or connection string, otherwise it needs to be set.\n\nIf this is blank and if env_auth is set it will be read from the\nenvironment variable `AZURE_STORAGE_ACCOUNT_NAME` if possible.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		share_name: {
			Name: "share_name",
			FieldName: "",
			Help: "Azure Files Share Name.\n\nThis is required and is the name of the share to access.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		env_auth: {
			Name: "env_auth",
			FieldName: "",
			Help: "Read credentials from runtime (environment variables, CLI or MSI).\n\nSee the [authentication docs](/azurefiles#authentication) for full info.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		key: {
			Name: "key",
			FieldName: "",
			Help: "Storage Account Shared Key.\n\nLeave blank to use SAS URL or connection string.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sas_url: {
			Name: "sas_url",
			FieldName: "",
			Help: "SAS URL.\n\nLeave blank if using account/key or connection string.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		connection_string: {
			Name: "connection_string",
			FieldName: "",
			Help: "Azure Files Connection String.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		tenant: {
			Name: "tenant",
			FieldName: "",
			Help: "ID of the service principal's tenant. Also called its directory ID.\n\nSet this if using\n- Service principal with client secret\n- Service principal with certificate\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "The ID of the client in use.\n\nSet this if using\n- Service principal with client secret\n- Service principal with certificate\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "One of the service principal's client secrets\n\nSet this if using\n- Service principal with client secret\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_certificate_path: {
			Name: "client_certificate_path",
			FieldName: "",
			Help: "Path to a PEM or PKCS12 certificate file including the private key.\n\nSet this if using\n- Service principal with certificate\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_certificate_password: {
			Name: "client_certificate_password",
			FieldName: "",
			Help: "Password for the certificate file (optional).\n\nOptionally set this if using\n- Service principal with certificate\n\nAnd the certificate has a password.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_send_certificate_chain: {
			Name: "client_send_certificate_chain",
			FieldName: "",
			Help: "Send the certificate chain when using certificate auth.\n\nSpecifies whether an authentication request will include an x5c header\nto support subject name / issuer based authentication. When set to\ntrue, authentication requests include the x5c header.\n\nOptionally set this if using\n- Service principal with certificate\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		username: {
			Name: "username",
			FieldName: "",
			Help: "User name (usually an email address)\n\nSet this if using\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "The user's password\n\nSet this if using\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		service_principal_file: {
			Name: "service_principal_file",
			FieldName: "",
			Help: "Path to file containing credentials for use with a service principal.\n\nLeave blank normally. Needed only if you want to use a service principal instead of interactive login.\n\n    $ az ad sp create-for-rbac --name \"<name>\" \\\n      --role \"Storage Files Data Owner\" \\\n      --scopes \"/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/<container>\" \\\n      > azure-principal.json\n\nSee [\"Create an Azure service principal\"](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli) and [\"Assign an Azure role for access to files data\"](https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad-rbac-cli) pages for more details.\n\n**NB** this section needs updating for Azure Files - pull requests appreciated!\n\nIt may be more convenient to put the credentials directly into the\nrclone config file under the `client_id`, `tenant` and `client_secret`\nkeys instead of setting `service_principal_file`.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		use_msi: {
			Name: "use_msi",
			FieldName: "",
			Help: "Use a managed service identity to authenticate (only works in Azure).\n\nWhen true, use a [managed service identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)\nto authenticate to Azure Storage instead of a SAS token or account key.\n\nIf the VM(SS) on which this program is running has a system-assigned identity, it will\nbe used by default. If the resource has no system-assigned but exactly one user-assigned identity,\nthe user-assigned identity will be used by default. If the resource has multiple user-assigned\nidentities, the identity to use must be explicitly specified using exactly one of the msi_object_id,\nmsi_client_id, or msi_mi_res_id parameters.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		msi_object_id: {
			Name: "msi_object_id",
			FieldName: "",
			Help: "Object ID of the user-assigned MSI to use, if any.\n\nLeave blank if msi_client_id or msi_mi_res_id specified.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		msi_client_id: {
			Name: "msi_client_id",
			FieldName: "",
			Help: "Object ID of the user-assigned MSI to use, if any.\n\nLeave blank if msi_object_id or msi_mi_res_id specified.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		msi_mi_res_id: {
			Name: "msi_mi_res_id",
			FieldName: "",
			Help: "Azure resource ID of the user-assigned MSI to use, if any.\n\nLeave blank if msi_client_id or msi_object_id specified.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for the service.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Upload chunk size.\n\nNote that this is stored in memory and there may be up to\n\"--transfers\" * \"--azurefile-upload-concurrency\" chunks stored at once\nin memory.",
			Default: 4194304,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4Mi",
			ValueStr: "4Mi",
			Type: "SizeSuffix"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for multipart uploads.\n\nThis is the number of chunks of the same file that are uploaded\nconcurrently.\n\nIf you are uploading small numbers of large files over high-speed\nlinks and these uploads do not fully utilize your bandwidth, then\nincreasing this may help to speed up the transfers.\n\nNote that chunks are stored in memory and there may be up to\n\"--transfers\" * \"--azurefile-upload-concurrency\" chunks stored at once\nin memory.",
			Default: 16,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "16",
			ValueStr: "16",
			Type: "int"
		},
		max_stream_size: {
			Name: "max_stream_size",
			FieldName: "",
			Help: "Max size for streamed files.\n\nAzure files needs to know in advance how big the file will be. When\nrclone doesn't know it uses this value instead.\n\nThis will be used when rclone is streaming data, the most common uses are:\n\n- Uploading files with `--vfs-cache-mode off` with `rclone mount`\n- Using `rclone rcat`\n- Copying files with unknown length\n\nYou will need this much free space in the share as the file will be this size temporarily.\n",
			Default: 10737418240,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Gi",
			ValueStr: "10Gi",
			Type: "SizeSuffix"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 54634382,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,RightPeriod,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,RightPeriod,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var fichier = {
	name: "fichier",
	description: "1Fichier",
	options: {
		api_key: {
			Name: "api_key",
			FieldName: "",
			Help: "Your API Key, get it from https://1fichier.com/console/params.pl.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		shared_folder: {
			Name: "shared_folder",
			FieldName: "",
			Help: "If you want to download a shared folder, add this parameter.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		file_password: {
			Name: "file_password",
			FieldName: "",
			Help: "If you want to download a shared file that is password protected, add this parameter.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		folder_password: {
			Name: "folder_password",
			FieldName: "",
			Help: "If you want to list the files in a shared folder that is password protected, add this parameter.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		cdn: {
			Name: "cdn",
			FieldName: "",
			Help: "Set if you wish to use CDN download links.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 52666494,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,SingleQuote,BackQuote,Dollar,BackSlash,Del,Ctl,LeftSpace,RightSpace,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,SingleQuote,BackQuote,Dollar,BackSlash,Del,Ctl,LeftSpace,RightSpace,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var filefabric = {
	name: "filefabric",
	description: "Enterprise File Fabric",
	options: {
		url: {
			Name: "url",
			FieldName: "",
			Help: "URL of the Enterprise File Fabric to connect to.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "https://storagemadeeasy.com",
					Help: "Storage Made Easy US"
				},
				{
					Value: "https://eu.storagemadeeasy.com",
					Help: "Storage Made Easy EU"
				},
				{
					Value: "https://yourfabric.smestorage.com",
					Help: "Connect to your Enterprise File Fabric"
				}
			],
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "ID of the root folder.\n\nLeave blank normally.\n\nFill in to make rclone start with directory of a given ID.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		permanent_token: {
			Name: "permanent_token",
			FieldName: "",
			Help: "Permanent Authentication Token.\n\nA Permanent Authentication Token can be created in the Enterprise File\nFabric, on the users Dashboard under Security, there is an entry\nyou'll see called \"My Authentication Tokens\". Click the Manage button\nto create one.\n\nThese tokens are normally valid for several years.\n\nFor more info see: https://docs.storagemadeeasy.com/organisationcloud/api-tokens\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "Session Token.\n\nThis is a session token which rclone caches in the config file. It is\nusually valid for 1 hour.\n\nDon't set this value - rclone will set it automatically.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_expiry: {
			Name: "token_expiry",
			FieldName: "",
			Help: "Token expiry time.\n\nDon't set this value - rclone will set it automatically.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		version: {
			Name: "version",
			FieldName: "",
			Help: "Version read from the file fabric.\n\nDon't set this value - rclone will set it automatically.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50429954,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var filescom = {
	name: "filescom",
	description: "Files.com",
	options: {
		site: {
			Name: "site",
			FieldName: "",
			Help: "Your site subdomain (e.g. mysite) or custom domain (e.g. myfiles.customdomain.com).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		username: {
			Name: "username",
			FieldName: "",
			Help: "The username used to authenticate with Files.com.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "The password used to authenticate with Files.com.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		api_key: {
			Name: "api_key",
			FieldName: "",
			Help: "The API key used to authenticate with Files.com.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 60923906,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,RightSpace,RightCrLfHtVt,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,RightSpace,RightCrLfHtVt,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var ftp = {
	name: "ftp",
	description: "FTP",
	options: {
		host: {
			Name: "host",
			FieldName: "",
			Help: "FTP host to connect to.\n\nE.g. \"ftp.example.com\".",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "FTP username.",
			Default: "CDOCS\\Hassan.Akbar",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "CDOCS\\Hassan.Akbar",
			ValueStr: "CDOCS\\Hassan.Akbar",
			Type: "string"
		},
		port: {
			Name: "port",
			FieldName: "",
			Help: "FTP port number.",
			Default: 21,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "21",
			ValueStr: "21",
			Type: "int"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "FTP password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		tls: {
			Name: "tls",
			FieldName: "",
			Help: "Use Implicit FTPS (FTP over TLS).\n\nWhen using implicit FTP over TLS the client connects using TLS\nright from the start which breaks compatibility with\nnon-TLS-aware servers. This is usually served over port 990 rather\nthan port 21. Cannot be used in combination with explicit FTPS.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		explicit_tls: {
			Name: "explicit_tls",
			FieldName: "",
			Help: "Use Explicit FTPS (FTP over TLS).\n\nWhen using explicit FTP over TLS the client explicitly requests\nsecurity from the server in order to upgrade a plain text connection\nto an encrypted one. Cannot be used in combination with implicit FTPS.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		concurrency: {
			Name: "concurrency",
			FieldName: "",
			Help: "Maximum number of FTP simultaneous connections, 0 for unlimited.\n\nNote that setting this is very likely to cause deadlocks so it should\nbe used with care.\n\nIf you are doing a sync or copy then make sure concurrency is one more\nthan the sum of `--transfers` and `--checkers`.\n\nIf you use `--check-first` then it just needs to be one more than the\nmaximum of `--checkers` and `--transfers`.\n\nSo for `concurrency 3` you'd use `--checkers 2 --transfers 2\n--check-first` or `--checkers 1 --transfers 1`.\n\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		no_check_certificate: {
			Name: "no_check_certificate",
			FieldName: "",
			Help: "Do not verify the TLS certificate of the server.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_epsv: {
			Name: "disable_epsv",
			FieldName: "",
			Help: "Disable using EPSV even if server advertises support.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_mlsd: {
			Name: "disable_mlsd",
			FieldName: "",
			Help: "Disable using MLSD even if server advertises support.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_utf8: {
			Name: "disable_utf8",
			FieldName: "",
			Help: "Disable using UTF-8 even if server advertises support.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		writing_mdtm: {
			Name: "writing_mdtm",
			FieldName: "",
			Help: "Use MDTM to set modification time (VsFtpd quirk)",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		force_list_hidden: {
			Name: "force_list_hidden",
			FieldName: "",
			Help: "Use LIST -a to force listing of hidden files and folders. This will disable the use of MLSD.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		idle_timeout: {
			Name: "idle_timeout",
			FieldName: "",
			Help: "Max time before closing idle connections.\n\nIf no connections have been returned to the connection pool in the time\ngiven, rclone will empty the connection pool.\n\nSet to 0 to keep connections indefinitely.\n",
			Default: 60000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1m0s",
			ValueStr: "1m0s",
			Type: "Duration"
		},
		close_timeout: {
			Name: "close_timeout",
			FieldName: "",
			Help: "Maximum time to wait for a response to close.",
			Default: 60000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1m0s",
			ValueStr: "1m0s",
			Type: "Duration"
		},
		tls_cache_size: {
			Name: "tls_cache_size",
			FieldName: "",
			Help: "Size of TLS session cache for all control and data connections.\n\nTLS cache allows to resume TLS sessions and reuse PSK between connections.\nIncrease if default size is not enough resulting in TLS resumption errors.\nEnabled by default. Use 0 to disable.",
			Default: 32,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "32",
			ValueStr: "32",
			Type: "int"
		},
		disable_tls13: {
			Name: "disable_tls13",
			FieldName: "",
			Help: "Disable TLS 1.3 (workaround for FTP servers with buggy TLS)",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		shut_timeout: {
			Name: "shut_timeout",
			FieldName: "",
			Help: "Maximum time to wait for data connection closing status.",
			Default: 60000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1m0s",
			ValueStr: "1m0s",
			Type: "Duration"
		},
		ask_password: {
			Name: "ask_password",
			FieldName: "",
			Help: "Allow asking for FTP password when needed.\n\nIf this is set and no password is supplied then rclone will ask for a password\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		socks_proxy: {
			Name: "socks_proxy",
			FieldName: "",
			Help: "Socks 5 proxy host.\n\t\t\n\t\tSupports the format user:pass@host:port, user@host:port, host:port.\n\t\t\n\t\tExample:\n\t\t\n\t\t\tmyUser:myPass@localhost:9005\n\t\t",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 35749890,
			Value: null,
			Examples: [
				{
					Value: "Asterisk,Ctl,Dot,Slash",
					Help: "ProFTPd can't handle '*' in file names"
				},
				{
					Value: "BackSlash,Ctl,Del,Dot,RightSpace,Slash,SquareBracket",
					Help: "PureFTPd can't handle '[]' or '*' in file names"
				},
				{
					Value: "Ctl,LeftPeriod,Slash",
					Help: "VsFTPd can't handle file names starting with dot"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Del,Ctl,RightSpace,Dot",
			ValueStr: "Slash,Del,Ctl,RightSpace,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var gofile = {
	name: "gofile",
	description: "Gofile",
	options: {
		access_token: {
			Name: "access_token",
			FieldName: "",
			Help: "API Access token\n\nYou can get this from the web control panel.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "ID of the root folder\n\nLeave this blank normally, rclone will fill it in automatically.\n\nIf you want rclone to be restricted to a particular folder you can\nfill it in - see the docs for more info.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		account_id: {
			Name: "account_id",
			FieldName: "",
			Help: "Account ID\n\nLeave this blank normally, rclone will fill it in automatically.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		list_chunk: {
			Name: "list_chunk",
			FieldName: "",
			Help: "Number of items to list in each call",
			Default: 1000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1000",
			ValueStr: "1000",
			Type: "int"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 323331982,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,LeftPeriod,RightPeriod,InvalidUtf8,Dot,Exclamation",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,LeftPeriod,RightPeriod,InvalidUtf8,Dot,Exclamation",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var http = {
	name: "http",
	description: "HTTP",
	options: {
		url: {
			Name: "url",
			FieldName: "",
			Help: "URL of HTTP host to connect to.\n\nE.g. \"https://example.com\", or \"https://user:pass@example.com\" to use a username and password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		no_escape: {
			Name: "no_escape",
			FieldName: "",
			Help: "Do not escape URL metacharacters in path names.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		headers: {
			Name: "headers",
			FieldName: "",
			Help: "Set HTTP headers for all transactions.\n\nUse this to set additional HTTP headers for all transactions.\n\nThe input format is comma separated list of key,value pairs.  Standard\n[CSV encoding](https://godoc.org/encoding/csv) may be used.\n\nFor example, to set a Cookie use 'Cookie,name=value', or '\"Cookie\",\"name=value\"'.\n\nYou can set multiple headers, e.g. '\"Cookie\",\"name=value\",\"Authorization\",\"xxx\"'.",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "CommaSepList"
		},
		no_slash: {
			Name: "no_slash",
			FieldName: "",
			Help: "Set this if the site doesn't end directories with /.\n\nUse this if your target website does not use / on the end of\ndirectories.\n\nA / on the end of a path is how rclone normally tells the difference\nbetween files and directories.  If this flag is set, then rclone will\ntreat all files with Content-Type: text/html as directories and read\nURLs from them rather than downloading them.\n\nNote that this may cause rclone to confuse genuine HTML files with\ndirectories.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_head: {
			Name: "no_head",
			FieldName: "",
			Help: "Don't use HEAD requests.\n\nHEAD requests are mainly used to find file sizes in dir listing.\nIf your site is being very slow to load then you can try this option.\nNormally rclone does a HEAD request for each potential file in a\ndirectory listing to:\n\n- find its size\n- check it really exists\n- check to see if it is a directory\n\nIf you set this option, rclone will not do the HEAD request. This will mean\nthat directory listings are much quicker, but rclone won't have the times or\nsizes of any files, and some files that don't exist may be in the listing.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var imagekit = {
	name: "imagekit",
	description: "ImageKit.io",
	options: {
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "You can find your ImageKit.io URL endpoint in your [dashboard](https://imagekit.io/dashboard/developer/api-keys)",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		public_key: {
			Name: "public_key",
			FieldName: "",
			Help: "You can find your ImageKit.io public key in your [dashboard](https://imagekit.io/dashboard/developer/api-keys)",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		private_key: {
			Name: "private_key",
			FieldName: "",
			Help: "You can find your ImageKit.io private key in your [dashboard](https://imagekit.io/dashboard/developer/api-keys)",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		only_signed: {
			Name: "only_signed",
			FieldName: "",
			Help: "If you have configured `Restrict unsigned image URLs` in your dashboard settings, set this to true.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		versions: {
			Name: "versions",
			FieldName: "",
			Help: "Include old versions in directory listings.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		upload_tags: {
			Name: "upload_tags",
			FieldName: "",
			Help: "Tags to add to the uploaded files, e.g. \"tag1,tag2\".",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 117553486,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Dollar,Question,Hash,Percent,BackSlash,Del,Ctl,InvalidUtf8,Dot,SquareBracket",
			ValueStr: "Slash,LtGt,DoubleQuote,Dollar,Question,Hash,Percent,BackSlash,Del,Ctl,InvalidUtf8,Dot,SquareBracket",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var internetarchive = {
	name: "internetarchive",
	description: "Internet Archive",
	options: {
		access_key_id: {
			Name: "access_key_id",
			FieldName: "",
			Help: "IAS3 Access Key.\n\nLeave blank for anonymous access.\nYou can find one here: https://archive.org/account/s3.php",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		secret_access_key: {
			Name: "secret_access_key",
			FieldName: "",
			Help: "IAS3 Secret Key (password).\n\nLeave blank for anonymous access.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "IAS3 Endpoint.\n\nLeave blank for default value.",
			Default: "https://s3.us.archive.org",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "https://s3.us.archive.org",
			ValueStr: "https://s3.us.archive.org",
			Type: "string"
		},
		front_endpoint: {
			Name: "front_endpoint",
			FieldName: "",
			Help: "Host of InternetArchive Frontend.\n\nLeave blank for default value.",
			Default: "https://archive.org",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "https://archive.org",
			ValueStr: "https://archive.org",
			Type: "string"
		},
		disable_checksum: {
			Name: "disable_checksum",
			FieldName: "",
			Help: "Don't ask the server to test against MD5 checksum calculated by rclone.\nNormally rclone will calculate the MD5 checksum of the input before\nuploading it so it can ask the server to check the object against checksum.\nThis is great for data integrity checking but can cause long delays for\nlarge files to start uploading.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		wait_archive: {
			Name: "wait_archive",
			FieldName: "",
			Help: "Timeout for waiting the server's processing tasks (specifically archive and book_op) to finish.\nOnly enable if you need to be guaranteed to be reflected after write operations.\n0 to disable waiting. No errors to be thrown in case of timeout.",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0s",
			ValueStr: "0s",
			Type: "Duration"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50446342,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,CrLf,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,CrLf,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var koofr = {
	name: "koofr",
	description: "Koofr, Digi Storage and other Koofr-compatible storage providers",
	options: {
		provider: {
			Name: "provider",
			FieldName: "",
			Help: "Choose your storage provider.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "koofr",
					Help: "Koofr, https://app.koofr.net/"
				},
				{
					Value: "digistorage",
					Help: "Digi Storage, https://storage.rcs-rds.ro/"
				},
				{
					Value: "other",
					Help: "Any other Koofr API compatible storage service"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "The Koofr API endpoint to use.",
			Provider: "other",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "Your user name.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "Your password for rclone generate one at https://app.koofr.net/app/admin/preferences/password.",
			Provider: "koofr",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		mountid: {
			Name: "mountid",
			FieldName: "",
			Help: "Mount ID of the mount to use.\n\nIf omitted, the primary mount is used.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		setmtime: {
			Name: "setmtime",
			FieldName: "",
			Help: "Does the backend support setting modification time.\n\nSet this to false if you use a mount ID that points to a Dropbox or Amazon Drive backend.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50438146,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var linkbox = {
	name: "linkbox",
	description: "Linkbox",
	options: {
		token: {
			Name: "token",
			FieldName: "",
			Help: "Token from https://www.linkbox.to/admin/account",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var mega = {
	name: "mega",
	description: "Mega",
	options: {
		user: {
			Name: "user",
			FieldName: "",
			Help: "User name.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "Password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		debug: {
			Name: "debug",
			FieldName: "",
			Help: "Output more debug from Mega.\n\nIf this flag is set (along with -vv) it will print further debugging\ninformation from the mega backend.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		hard_delete: {
			Name: "hard_delete",
			FieldName: "",
			Help: "Delete files permanently rather than putting them into the trash.\n\nNormally the mega backend will put all deletions into the trash rather\nthan permanently deleting them.  If you specify this then rclone will\npermanently delete objects instead.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_https: {
			Name: "use_https",
			FieldName: "",
			Help: "Use HTTPS for transfers.\n\nMEGA uses plain text HTTP connections by default.\nSome ISPs throttle HTTP connections, this causes transfers to become very slow.\nEnabling this will force MEGA to use HTTPS for all transfers.\nHTTPS is normally not necessary since all data is already encrypted anyway.\nEnabling it will increase CPU usage and add network overhead.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50331650,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,InvalidUtf8,Dot",
			ValueStr: "Slash,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var netstorage = {
	name: "netstorage",
	description: "Akamai NetStorage",
	options: {
		host: {
			Name: "host",
			FieldName: "",
			Help: "Domain+path of NetStorage host to connect to.\n\nFormat should be `<domain>/<internal folders>`",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		account: {
			Name: "account",
			FieldName: "",
			Help: "Set the NetStorage account name",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		secret: {
			Name: "secret",
			FieldName: "",
			Help: "Set the NetStorage account secret/G2O key for authentication.\n\nPlease choose the 'y' option to set your own password then enter your secret.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		protocol: {
			Name: "protocol",
			FieldName: "",
			Help: "Select between HTTP or HTTPS protocol.\n\nMost users should choose HTTPS, which is the default.\nHTTP is provided primarily for debugging purposes.",
			Default: "https",
			Value: null,
			Examples: [
				{
					Value: "http",
					Help: "HTTP protocol"
				},
				{
					Value: "https",
					Help: "HTTPS protocol"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "https",
			ValueStr: "https",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var opendrive = {
	name: "opendrive",
	description: "OpenDrive",
	options: {
		username: {
			Name: "username",
			FieldName: "",
			Help: "Username.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "Password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 62007182,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,LeftSpace,LeftCrLfHtVt,RightSpace,RightCrLfHtVt,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,LeftSpace,LeftCrLfHtVt,RightSpace,RightCrLfHtVt,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Files will be uploaded in chunks this size.\n\nNote that these chunks are buffered in memory so increasing them will\nincrease memory use.",
			Default: 10485760,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Mi",
			ValueStr: "10Mi",
			Type: "SizeSuffix"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var pixeldrain = {
	name: "pixeldrain",
	description: "Pixeldrain Filesystem",
	options: {
		api_key: {
			Name: "api_key",
			FieldName: "",
			Help: "API key for your pixeldrain account.\nFound on https://pixeldrain.com/user/api_keys.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "Root of the filesystem to use.\n\nSet to 'me' to use your personal filesystem. Set to a shared directory ID to use a shared directory.",
			Default: "me",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "me",
			ValueStr: "me",
			Type: "string"
		},
		api_url: {
			Name: "api_url",
			FieldName: "",
			Help: "The API endpoint to connect to. In the vast majority of cases it's fine to leave\nthis at default. It is only intended to be changed for testing purposes.",
			Default: "https://pixeldrain.com/api",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "https://pixeldrain.com/api",
			ValueStr: "https://pixeldrain.com/api",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var qingstor = {
	name: "qingstor",
	description: "QingCloud Object Storage",
	options: {
		env_auth: {
			Name: "env_auth",
			FieldName: "",
			Help: "Get QingStor credentials from runtime.\n\nOnly applies if access_key_id and secret_access_key is blank.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "false",
					Help: "Enter QingStor credentials in the next step."
				},
				{
					Value: "true",
					Help: "Get QingStor credentials from the environment (env vars or IAM)."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		access_key_id: {
			Name: "access_key_id",
			FieldName: "",
			Help: "QingStor Access Key ID.\n\nLeave blank for anonymous access or runtime credentials.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		secret_access_key: {
			Name: "secret_access_key",
			FieldName: "",
			Help: "QingStor Secret Access Key (password).\n\nLeave blank for anonymous access or runtime credentials.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Enter an endpoint URL to connection QingStor API.\n\nLeave blank will use the default value \"https://qingstor.com:443\".",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		zone: {
			Name: "zone",
			FieldName: "",
			Help: "Zone to connect to.\n\nDefault is \"pek3a\".",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "pek3a",
					Help: "The Beijing (China) Three Zone.\nNeeds location constraint pek3a."
				},
				{
					Value: "sh1a",
					Help: "The Shanghai (China) First Zone.\nNeeds location constraint sh1a."
				},
				{
					Value: "gd2a",
					Help: "The Guangdong (China) Second Zone.\nNeeds location constraint gd2a."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		connection_retries: {
			Name: "connection_retries",
			FieldName: "",
			Help: "Number of connection retries.",
			Default: 3,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "3",
			ValueStr: "3",
			Type: "int"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to chunked upload.\n\nAny files larger than this will be uploaded in chunks of chunk_size.\nThe minimum is 0 and the maximum is 5 GiB.",
			Default: 209715200,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "200Mi",
			ValueStr: "200Mi",
			Type: "SizeSuffix"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Chunk size to use for uploading.\n\nWhen uploading files larger than upload_cutoff they will be uploaded\nas multipart uploads using this chunk size.\n\nNote that \"--qingstor-upload-concurrency\" chunks of this size are buffered\nin memory per transfer.\n\nIf you are transferring large files over high-speed links and you have\nenough memory, then increasing this will speed up the transfers.",
			Default: 4194304,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4Mi",
			ValueStr: "4Mi",
			Type: "SizeSuffix"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for multipart uploads.\n\nThis is the number of chunks of the same file that are uploaded\nconcurrently.\n\nNB if you set this to > 1 then the checksums of multipart uploads\nbecome corrupted (the uploads themselves are not corrupted though).\n\nIf you are uploading small numbers of large files over high-speed links\nand these uploads do not fully utilize your bandwidth, then increasing\nthis may help to speed up the transfers.",
			Default: 1,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1",
			ValueStr: "1",
			Type: "int"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 16842754,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Ctl,InvalidUtf8",
			ValueStr: "Slash,Ctl,InvalidUtf8",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var seafile = {
	name: "seafile",
	description: "seafile",
	options: {
		url: {
			Name: "url",
			FieldName: "",
			Help: "URL of seafile host to connect to.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "https://cloud.seafile.com/",
					Help: "Connect to cloud.seafile.com."
				}
			],
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "User name (usually email address).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "Password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		"2fa": {
			Name: "2fa",
			FieldName: "",
			Help: "Two-factor authentication ('true' if the account has 2FA enabled).",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		library: {
			Name: "library",
			FieldName: "",
			Help: "Name of the library.\n\nLeave blank to access all non-encrypted libraries.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		library_key: {
			Name: "library_key",
			FieldName: "",
			Help: "Library password (for encrypted libraries only).\n\nLeave blank if you pass it through the command line.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		create_library: {
			Name: "create_library",
			FieldName: "",
			Help: "Should rclone create a library if it doesn't exist.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 16850954,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,DoubleQuote,BackSlash,Ctl,InvalidUtf8",
			ValueStr: "Slash,DoubleQuote,BackSlash,Ctl,InvalidUtf8",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var sftp = {
	name: "sftp",
	description: "SSH/SFTP",
	options: {
		host: {
			Name: "host",
			FieldName: "",
			Help: "SSH host to connect to.\n\nE.g. \"example.com\".",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "SSH username.",
			Default: "CDOCS\\Hassan.Akbar",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "CDOCS\\Hassan.Akbar",
			ValueStr: "CDOCS\\Hassan.Akbar",
			Type: "string"
		},
		port: {
			Name: "port",
			FieldName: "",
			Help: "SSH port number.",
			Default: 22,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "22",
			ValueStr: "22",
			Type: "int"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "SSH password, leave blank to use ssh-agent.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		key_pem: {
			Name: "key_pem",
			FieldName: "",
			Help: "Raw PEM-encoded private key.\n\nNote that this should be on a single line with line endings replaced with '\\n', eg\n\n    key_pem = -----BEGIN RSA PRIVATE KEY-----\\nMaMbaIXtE\\n0gAMbMbaSsd\\nMbaass\\n-----END RSA PRIVATE KEY-----\n\nThis will generate the single line correctly:\n\n    awk '{printf \"%s\\\\n\", $0}' < ~/.ssh/id_rsa\n\nIf specified, it will override the key_file parameter.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		key_file: {
			Name: "key_file",
			FieldName: "",
			Help: "Path to PEM-encoded private key file.\n\nLeave blank or set key-use-agent to use ssh-agent.\n\nLeading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		key_file_pass: {
			Name: "key_file_pass",
			FieldName: "",
			Help: "The passphrase to decrypt the PEM-encoded private key file.\n\nOnly PEM encrypted key files (old OpenSSH format) are supported. Encrypted keys\nin the new OpenSSH format can't be used.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		pubkey_file: {
			Name: "pubkey_file",
			FieldName: "",
			Help: "Optional path to public key file.\n\nSet this if you have a signed certificate you want to use for authentication.\n\nLeading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		key_use_agent: {
			Name: "key_use_agent",
			FieldName: "",
			Help: "When set forces the usage of the ssh-agent.\n\nWhen key-file is also set, the \".pub\" file of the specified key-file is read and only the associated key is\nrequested from the ssh-agent. This allows to avoid `Too many authentication failures for *username*` errors\nwhen the ssh-agent contains many keys.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_insecure_cipher: {
			Name: "use_insecure_cipher",
			FieldName: "",
			Help: "Enable the use of insecure ciphers and key exchange methods.\n\nThis enables the use of the following insecure ciphers and key exchange methods:\n\n- aes128-cbc\n- aes192-cbc\n- aes256-cbc\n- 3des-cbc\n- diffie-hellman-group-exchange-sha256\n- diffie-hellman-group-exchange-sha1\n\nThose algorithms are insecure and may allow plaintext data to be recovered by an attacker.\n\nThis must be false if you use either ciphers or key_exchange advanced options.\n",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "false",
					Help: "Use default Cipher list."
				},
				{
					Value: "true",
					Help: "Enables the use of the aes128-cbc cipher and diffie-hellman-group-exchange-sha256, diffie-hellman-group-exchange-sha1 key exchange."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_hashcheck: {
			Name: "disable_hashcheck",
			FieldName: "",
			Help: "Disable the execution of SSH commands to determine if remote file hashing is available.\n\nLeave blank or set to false to enable hashing (recommended), set to true to disable hashing.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		ssh: {
			Name: "ssh",
			FieldName: "",
			Help: "Path and arguments to external ssh binary.\n\nNormally rclone will use its internal ssh library to connect to the\nSFTP server. However it does not implement all possible ssh options so\nit may be desirable to use an external ssh binary.\n\nRclone ignores all the internal config if you use this option and\nexpects you to configure the ssh binary with the user/host/port and\nany other options you need.\n\n**Important** The ssh command must log in without asking for a\npassword so needs to be configured with keys or certificates.\n\nRclone will run the command supplied either with the additional\narguments \"-s sftp\" to access the SFTP subsystem or with commands such\nas \"md5sum /path/to/file\" appended to read checksums.\n\nAny arguments with spaces in should be surrounded by \"double quotes\".\n\nAn example setting might be:\n\n    ssh -o ServerAliveInterval=20 user@example.com\n\nNote that when using an external ssh binary rclone makes a new ssh\nconnection for every hash it calculates.\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "SpaceSepList"
		},
		known_hosts_file: {
			Name: "known_hosts_file",
			FieldName: "",
			Help: "Optional path to known_hosts file.\n\nSet this value to enable server host key validation.\n\nLeading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "~/.ssh/known_hosts",
					Help: "Use OpenSSH's known_hosts file."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		ask_password: {
			Name: "ask_password",
			FieldName: "",
			Help: "Allow asking for SFTP password when needed.\n\nIf this is set and no password is supplied then rclone will:\n- ask for a password\n- not contact the ssh agent\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		path_override: {
			Name: "path_override",
			FieldName: "",
			Help: "Override path used by SSH shell commands.\n\nThis allows checksum calculation when SFTP and SSH paths are\ndifferent. This issue affects among others Synology NAS boxes.\n\nE.g. if shared folders can be found in directories representing volumes:\n\n    rclone sync /home/local/directory remote:/directory --sftp-path-override /volume2/directory\n\nE.g. if home directory can be found in a shared folder called \"home\":\n\n    rclone sync /home/local/directory remote:/home/directory --sftp-path-override /volume1/homes/USER/directory\n\t\nTo specify only the path to the SFTP remote's root, and allow rclone to add any relative subpaths automatically (including unwrapping/decrypting remotes as necessary), add the '@' character to the beginning of the path.\n\nE.g. the first example above could be rewritten as:\n\n\trclone sync /home/local/directory remote:/directory --sftp-path-override @/volume2\n\t\nNote that when using this method with Synology \"home\" folders, the full \"/homes/USER\" path should be specified instead of \"/home\".\n\nE.g. the second example above should be rewritten as:\n\n\trclone sync /home/local/directory remote:/homes/USER/directory --sftp-path-override @/volume1",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		set_modtime: {
			Name: "set_modtime",
			FieldName: "",
			Help: "Set the modified time on the remote if set.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		shell_type: {
			Name: "shell_type",
			FieldName: "",
			Help: "The type of SSH shell on remote server, if any.\n\nLeave blank for autodetect.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "none",
					Help: "No shell access"
				},
				{
					Value: "unix",
					Help: "Unix shell"
				},
				{
					Value: "powershell",
					Help: "PowerShell"
				},
				{
					Value: "cmd",
					Help: "Windows Command Prompt"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		md5sum_command: {
			Name: "md5sum_command",
			FieldName: "",
			Help: "The command used to read md5 hashes.\n\nLeave blank for autodetect.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sha1sum_command: {
			Name: "sha1sum_command",
			FieldName: "",
			Help: "The command used to read sha1 hashes.\n\nLeave blank for autodetect.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		skip_links: {
			Name: "skip_links",
			FieldName: "",
			Help: "Set to skip any symlinks and any other non regular files.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		subsystem: {
			Name: "subsystem",
			FieldName: "",
			Help: "Specifies the SSH2 subsystem on the remote host.",
			Default: "sftp",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "sftp",
			ValueStr: "sftp",
			Type: "string"
		},
		server_command: {
			Name: "server_command",
			FieldName: "",
			Help: "Specifies the path or command to run a sftp server on the remote host.\n\nThe subsystem option is ignored when server_command is defined.\n\nIf adding server_command to the configuration file please note that \nit should not be enclosed in quotes, since that will make rclone fail.\n\nA working example is:\n\n    [remote_name]\n    type = sftp\n    server_command = sudo /usr/libexec/openssh/sftp-server",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		use_fstat: {
			Name: "use_fstat",
			FieldName: "",
			Help: "If set use fstat instead of stat.\n\nSome servers limit the amount of open files and calling Stat after opening\nthe file will throw an error from the server. Setting this flag will call\nFstat instead of Stat which is called on an already open file handle.\n\nIt has been found that this helps with IBM Sterling SFTP servers which have\n\"extractability\" level set to 1 which means only 1 file can be opened at\nany given time.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_concurrent_reads: {
			Name: "disable_concurrent_reads",
			FieldName: "",
			Help: "If set don't use concurrent reads.\n\nNormally concurrent reads are safe to use and not using them will\ndegrade performance, so this option is disabled by default.\n\nSome servers limit the amount number of times a file can be\ndownloaded. Using concurrent reads can trigger this limit, so if you\nhave a server which returns\n\n    Failed to copy: file does not exist\n\nThen you may need to enable this flag.\n\nIf concurrent reads are disabled, the use_fstat option is ignored.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_concurrent_writes: {
			Name: "disable_concurrent_writes",
			FieldName: "",
			Help: "If set don't use concurrent writes.\n\nNormally rclone uses concurrent writes to upload files. This improves\nthe performance greatly, especially for distant servers.\n\nThis option disables concurrent writes should that be necessary.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		idle_timeout: {
			Name: "idle_timeout",
			FieldName: "",
			Help: "Max time before closing idle connections.\n\nIf no connections have been returned to the connection pool in the time\ngiven, rclone will empty the connection pool.\n\nSet to 0 to keep connections indefinitely.\n",
			Default: 60000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1m0s",
			ValueStr: "1m0s",
			Type: "Duration"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Upload and download chunk size.\n\nThis controls the maximum size of payload in SFTP protocol packets.\nThe RFC limits this to 32768 bytes (32k), which is the default. However,\na lot of servers support larger sizes, typically limited to a maximum\ntotal package size of 256k, and setting it larger will increase transfer\nspeed dramatically on high latency links. This includes OpenSSH, and,\nfor example, using the value of 255k works well, leaving plenty of room\nfor overhead while still being within a total packet size of 256k.\n\nMake sure to test thoroughly before using a value higher than 32k,\nand only use it if you always connect to the same server or after\nsufficiently broad testing. If you get errors such as\n\"failed to send packet payload: EOF\", lots of \"connection lost\",\nor \"corrupted on transfer\", when copying a larger file, try lowering\nthe value. The server run by [rclone serve sftp](/commands/rclone_serve_sftp)\nsends packets with standard 32k maximum payload so you must not\nset a different chunk_size when downloading files, but it accepts\npackets up to the 256k total size, so for uploads the chunk_size\ncan be set as for the OpenSSH example above.\n",
			Default: 32768,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "32Ki",
			ValueStr: "32Ki",
			Type: "SizeSuffix"
		},
		concurrency: {
			Name: "concurrency",
			FieldName: "",
			Help: "The maximum number of outstanding requests for one file\n\nThis controls the maximum number of outstanding requests for one file.\nIncreasing it will increase throughput on high latency links at the\ncost of using more memory.\n",
			Default: 64,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "64",
			ValueStr: "64",
			Type: "int"
		},
		connections: {
			Name: "connections",
			FieldName: "",
			Help: "Maximum number of SFTP simultaneous connections, 0 for unlimited.\n\nNote that setting this is very likely to cause deadlocks so it should\nbe used with care.\n\nIf you are doing a sync or copy then make sure connections is one more\nthan the sum of `--transfers` and `--checkers`.\n\nIf you use `--check-first` then it just needs to be one more than the\nmaximum of `--checkers` and `--transfers`.\n\nSo for `connections 3` you'd use `--checkers 2 --transfers 2\n--check-first` or `--checkers 1 --transfers 1`.\n\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		set_env: {
			Name: "set_env",
			FieldName: "",
			Help: "Environment variables to pass to sftp and commands\n\nSet environment variables in the form:\n\n    VAR=value\n\nto be passed to the sftp client and to any commands run (eg md5sum).\n\nPass multiple variables space separated, eg\n\n    VAR1=value VAR2=value\n\nand pass variables with spaces in quotes, eg\n\n    \"VAR3=value with space\" \"VAR4=value with space\" VAR5=nospacehere\n\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "SpaceSepList"
		},
		ciphers: {
			Name: "ciphers",
			FieldName: "",
			Help: "Space separated list of ciphers to be used for session encryption, ordered by preference.\n\nAt least one must match with server configuration. This can be checked for example using ssh -Q cipher.\n\nThis must not be set if use_insecure_cipher is true.\n\nExample:\n\n    aes128-ctr aes192-ctr aes256-ctr aes128-gcm@openssh.com aes256-gcm@openssh.com\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "SpaceSepList"
		},
		key_exchange: {
			Name: "key_exchange",
			FieldName: "",
			Help: "Space separated list of key exchange algorithms, ordered by preference.\n\nAt least one must match with server configuration. This can be checked for example using ssh -Q kex.\n\nThis must not be set if use_insecure_cipher is true.\n\nExample:\n\n    sntrup761x25519-sha512@openssh.com curve25519-sha256 curve25519-sha256@libssh.org ecdh-sha2-nistp256\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "SpaceSepList"
		},
		macs: {
			Name: "macs",
			FieldName: "",
			Help: "Space separated list of MACs (message authentication code) algorithms, ordered by preference.\n\nAt least one must match with server configuration. This can be checked for example using ssh -Q mac.\n\nExample:\n\n    umac-64-etm@openssh.com umac-128-etm@openssh.com hmac-sha2-256-etm@openssh.com\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "SpaceSepList"
		},
		host_key_algorithms: {
			Name: "host_key_algorithms",
			FieldName: "",
			Help: "Space separated list of host key algorithms, ordered by preference.\n\nAt least one must match with server configuration. This can be checked for example using ssh -Q HostKeyAlgorithms.\n\nNote: This can affect the outcome of key negotiation with the server even if server host key validation is not enabled.\n\nExample:\n\n    ssh-ed25519 ssh-rsa ssh-dss\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "SpaceSepList"
		},
		socks_proxy: {
			Name: "socks_proxy",
			FieldName: "",
			Help: "Socks 5 proxy host.\n\t\nSupports the format user:pass@host:port, user@host:port, host:port.\n\nExample:\n\n\tmyUser:myPass@localhost:9005\n\t",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		copy_is_hardlink: {
			Name: "copy_is_hardlink",
			FieldName: "",
			Help: "Set to enable server side copies using hardlinks.\n\nThe SFTP protocol does not define a copy command so normally server\nside copies are not allowed with the sftp backend.\n\nHowever the SFTP protocol does support hardlinking, and if you enable\nthis flag then the sftp backend will support server side copies. These\nwill be implemented by doing a hardlink from the source to the\ndestination.\n\nNot all sftp servers support this.\n\nNote that hardlinking two files together will use no additional space\nas the source and the destination will be the same file.\n\nThis feature may be useful backups made with --copy-dest.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var sia = {
	name: "sia",
	description: "Sia Decentralized Cloud",
	options: {
		api_url: {
			Name: "api_url",
			FieldName: "",
			Help: "Sia daemon API URL, like http://sia.daemon.host:9980.\n\nNote that siad must run with --disable-api-security to open API port for other hosts (not recommended).\nKeep default if Sia daemon runs on localhost.",
			Default: "http://127.0.0.1:9980",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "http://127.0.0.1:9980",
			ValueStr: "http://127.0.0.1:9980",
			Type: "string"
		},
		api_password: {
			Name: "api_password",
			FieldName: "",
			Help: "Sia Daemon API Password.\n\nCan be found in the apipassword file located in HOME/.sia/ or in the daemon directory.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user_agent: {
			Name: "user_agent",
			FieldName: "",
			Help: "Siad User Agent\n\nSia daemon requires the 'Sia-Agent' user agent by default for security",
			Default: "Sia-Agent",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Sia-Agent",
			ValueStr: "Sia-Agent",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50436354,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Question,Hash,Percent,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,Question,Hash,Percent,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var smb = {
	name: "smb",
	description: "SMB / CIFS",
	options: {
		host: {
			Name: "host",
			FieldName: "",
			Help: "SMB server hostname to connect to.\n\nE.g. \"example.com\".",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "SMB username.",
			Default: "CDOCS\\Hassan.Akbar",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "CDOCS\\Hassan.Akbar",
			ValueStr: "CDOCS\\Hassan.Akbar",
			Type: "string"
		},
		port: {
			Name: "port",
			FieldName: "",
			Help: "SMB port number.",
			Default: 445,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "445",
			ValueStr: "445",
			Type: "int"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "SMB password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		domain: {
			Name: "domain",
			FieldName: "",
			Help: "Domain name for NTLM authentication.",
			Default: "WORKGROUP",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "WORKGROUP",
			ValueStr: "WORKGROUP",
			Type: "string"
		},
		spn: {
			Name: "spn",
			FieldName: "",
			Help: "Service principal name.\n\nRclone presents this name to the server. Some servers use this as further\nauthentication, and it often needs to be set for clusters. For example:\n\n    cifs/remotehost:1020\n\nLeave blank if not sure.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		idle_timeout: {
			Name: "idle_timeout",
			FieldName: "",
			Help: "Max time before closing idle connections.\n\nIf no connections have been returned to the connection pool in the time\ngiven, rclone will empty the connection pool.\n\nSet to 0 to keep connections indefinitely.\n",
			Default: 60000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1m0s",
			ValueStr: "1m0s",
			Type: "Duration"
		},
		hide_special_share: {
			Name: "hide_special_share",
			FieldName: "",
			Help: "Hide special shares (e.g. print$) which users aren't supposed to access.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		case_insensitive: {
			Name: "case_insensitive",
			FieldName: "",
			Help: "Whether the server is configured to be case-insensitive.\n\nAlways true on Windows shares.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 56698766,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,RightSpace,RightPeriod,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,RightSpace,RightPeriod,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var sugarsync = {
	name: "sugarsync",
	description: "Sugarsync",
	options: {
		app_id: {
			Name: "app_id",
			FieldName: "",
			Help: "Sugarsync App ID.\n\nLeave blank to use rclone's.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		access_key_id: {
			Name: "access_key_id",
			FieldName: "",
			Help: "Sugarsync Access Key ID.\n\nLeave blank to use rclone's.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		private_access_key: {
			Name: "private_access_key",
			FieldName: "",
			Help: "Sugarsync Private Access Key.\n\nLeave blank to use rclone's.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		hard_delete: {
			Name: "hard_delete",
			FieldName: "",
			Help: "Permanently delete files if true\notherwise put them in the deleted files.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		refresh_token: {
			Name: "refresh_token",
			FieldName: "",
			Help: "Sugarsync refresh token.\n\nLeave blank normally, will be auto configured by rclone.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		authorization: {
			Name: "authorization",
			FieldName: "",
			Help: "Sugarsync authorization.\n\nLeave blank normally, will be auto configured by rclone.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		authorization_expiry: {
			Name: "authorization_expiry",
			FieldName: "",
			Help: "Sugarsync authorization expiry.\n\nLeave blank normally, will be auto configured by rclone.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "Sugarsync user.\n\nLeave blank normally, will be auto configured by rclone.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_id: {
			Name: "root_id",
			FieldName: "",
			Help: "Sugarsync root id.\n\nLeave blank normally, will be auto configured by rclone.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		deleted_id: {
			Name: "deleted_id",
			FieldName: "",
			Help: "Sugarsync deleted folder id.\n\nLeave blank normally, will be auto configured by rclone.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50397186,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var ulozto = {
	name: "ulozto",
	description: "Uloz.to",
	options: {
		app_token: {
			Name: "app_token",
			FieldName: "",
			Help: "The application token identifying the app. An app API key can be either found in the API\ndoc https://uloz.to/upload-resumable-api-beta or obtained from customer service.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		username: {
			Name: "username",
			FieldName: "",
			Help: "The username of the principal to operate as.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "The password for the user.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_slug: {
			Name: "root_folder_slug",
			FieldName: "",
			Help: "If set, rclone will use this folder as the root folder for all operations. For example,\nif the slug identifies 'foo/bar/', 'ulozto:baz' is equivalent to 'ulozto:foo/bar/baz' without\nany root slug set.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		list_page_size: {
			Name: "list_page_size",
			FieldName: "",
			Help: "The size of a single page for list commands. 1-500",
			Default: 500,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "500",
			ValueStr: "500",
			Type: "int"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50438146,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var uptobox = {
	name: "uptobox",
	description: "Uptobox",
	options: {
		access_token: {
			Name: "access_token",
			FieldName: "",
			Help: "Your access token.\n\nGet it from https://uptobox.com/my_account.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		"private": {
			Name: "private",
			FieldName: "",
			Help: "Set to make uploaded files private",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50561070,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,BackQuote,Del,Ctl,LeftSpace,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,BackQuote,Del,Ctl,LeftSpace,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var webdav = {
	name: "webdav",
	description: "WebDAV",
	options: {
		url: {
			Name: "url",
			FieldName: "",
			Help: "URL of http host to connect to.\n\nE.g. https://example.com.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		vendor: {
			Name: "vendor",
			FieldName: "",
			Help: "Name of the WebDAV site/service/software you are using.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "fastmail",
					Help: "Fastmail Files"
				},
				{
					Value: "nextcloud",
					Help: "Nextcloud"
				},
				{
					Value: "owncloud",
					Help: "Owncloud"
				},
				{
					Value: "sharepoint",
					Help: "Sharepoint Online, authenticated by Microsoft account"
				},
				{
					Value: "sharepoint-ntlm",
					Help: "Sharepoint with NTLM authentication, usually self-hosted or on-premises"
				},
				{
					Value: "rclone",
					Help: "rclone WebDAV server to serve a remote over HTTP via the WebDAV protocol"
				},
				{
					Value: "other",
					Help: "Other site/service or software"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "User name.\n\nIn case NTLM authentication is used, the username should be in the format 'Domain\\User'.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "Password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		bearer_token: {
			Name: "bearer_token",
			FieldName: "",
			Help: "Bearer token instead of user/pass (e.g. a Macaroon).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		bearer_token_command: {
			Name: "bearer_token_command",
			FieldName: "",
			Help: "Command to run to get a bearer token.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.\n\nDefault encoding is Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,Hash,Percent,BackSlash,Del,Ctl,LeftSpace,LeftTilde,RightSpace,RightPeriod,InvalidUtf8 for sharepoint-ntlm or identity otherwise.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		headers: {
			Name: "headers",
			FieldName: "",
			Help: "Set HTTP headers for all transactions.\n\nUse this to set additional HTTP headers for all transactions\n\nThe input format is comma separated list of key,value pairs.  Standard\n[CSV encoding](https://godoc.org/encoding/csv) may be used.\n\nFor example, to set a Cookie use 'Cookie,name=value', or '\"Cookie\",\"name=value\"'.\n\nYou can set multiple headers, e.g. '\"Cookie\",\"name=value\",\"Authorization\",\"xxx\"'.\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "CommaSepList"
		},
		pacer_min_sleep: {
			Name: "pacer_min_sleep",
			FieldName: "",
			Help: "Minimum time to sleep between API calls.",
			Default: 10000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10ms",
			ValueStr: "10ms",
			Type: "Duration"
		},
		nextcloud_chunk_size: {
			Name: "nextcloud_chunk_size",
			FieldName: "",
			Help: "Nextcloud upload chunk size.\n\nWe recommend configuring your NextCloud instance to increase the max chunk size to 1 GB for better upload performances.\nSee https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/big_file_upload_configuration.html#adjust-chunk-size-on-nextcloud-side\n\nSet to 0 to disable chunked uploading.\n",
			Default: 10485760,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Mi",
			ValueStr: "10Mi",
			Type: "SizeSuffix"
		},
		owncloud_exclude_shares: {
			Name: "owncloud_exclude_shares",
			FieldName: "",
			Help: "Exclude ownCloud shares",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		owncloud_exclude_mounts: {
			Name: "owncloud_exclude_mounts",
			FieldName: "",
			Help: "Exclude ownCloud mounted storages",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		unix_socket: {
			Name: "unix_socket",
			FieldName: "",
			Help: "Path to a unix domain socket to dial to, instead of opening a TCP connection directly",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var azureblob = {
	name: "azureblob",
	description: "Microsoft Azure Blob Storage",
	options: {
		account: {
			Name: "account",
			FieldName: "",
			Help: "Azure Storage Account Name.\n\nSet this to the Azure Storage Account Name in use.\n\nLeave blank to use SAS URL or Emulator, otherwise it needs to be set.\n\nIf this is blank and if env_auth is set it will be read from the\nenvironment variable `AZURE_STORAGE_ACCOUNT_NAME` if possible.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		env_auth: {
			Name: "env_auth",
			FieldName: "",
			Help: "Read credentials from runtime (environment variables, CLI or MSI).\n\nSee the [authentication docs](/azureblob#authentication) for full info.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		key: {
			Name: "key",
			FieldName: "",
			Help: "Storage Account Shared Key.\n\nLeave blank to use SAS URL or Emulator.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sas_url: {
			Name: "sas_url",
			FieldName: "",
			Help: "SAS URL for container level access only.\n\nLeave blank if using account/key or Emulator.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		tenant: {
			Name: "tenant",
			FieldName: "",
			Help: "ID of the service principal's tenant. Also called its directory ID.\n\nSet this if using\n- Service principal with client secret\n- Service principal with certificate\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "The ID of the client in use.\n\nSet this if using\n- Service principal with client secret\n- Service principal with certificate\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "One of the service principal's client secrets\n\nSet this if using\n- Service principal with client secret\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_certificate_path: {
			Name: "client_certificate_path",
			FieldName: "",
			Help: "Path to a PEM or PKCS12 certificate file including the private key.\n\nSet this if using\n- Service principal with certificate\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_certificate_password: {
			Name: "client_certificate_password",
			FieldName: "",
			Help: "Password for the certificate file (optional).\n\nOptionally set this if using\n- Service principal with certificate\n\nAnd the certificate has a password.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_send_certificate_chain: {
			Name: "client_send_certificate_chain",
			FieldName: "",
			Help: "Send the certificate chain when using certificate auth.\n\nSpecifies whether an authentication request will include an x5c header\nto support subject name / issuer based authentication. When set to\ntrue, authentication requests include the x5c header.\n\nOptionally set this if using\n- Service principal with certificate\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		username: {
			Name: "username",
			FieldName: "",
			Help: "User name (usually an email address)\n\nSet this if using\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "The user's password\n\nSet this if using\n- User with username and password\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		service_principal_file: {
			Name: "service_principal_file",
			FieldName: "",
			Help: "Path to file containing credentials for use with a service principal.\n\nLeave blank normally. Needed only if you want to use a service principal instead of interactive login.\n\n    $ az ad sp create-for-rbac --name \"<name>\" \\\n      --role \"Storage Blob Data Owner\" \\\n      --scopes \"/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/<container>\" \\\n      > azure-principal.json\n\nSee [\"Create an Azure service principal\"](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli) and [\"Assign an Azure role for access to blob data\"](https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad-rbac-cli) pages for more details.\n\nIt may be more convenient to put the credentials directly into the\nrclone config file under the `client_id`, `tenant` and `client_secret`\nkeys instead of setting `service_principal_file`.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		use_msi: {
			Name: "use_msi",
			FieldName: "",
			Help: "Use a managed service identity to authenticate (only works in Azure).\n\nWhen true, use a [managed service identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)\nto authenticate to Azure Storage instead of a SAS token or account key.\n\nIf the VM(SS) on which this program is running has a system-assigned identity, it will\nbe used by default. If the resource has no system-assigned but exactly one user-assigned identity,\nthe user-assigned identity will be used by default. If the resource has multiple user-assigned\nidentities, the identity to use must be explicitly specified using exactly one of the msi_object_id,\nmsi_client_id, or msi_mi_res_id parameters.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		msi_object_id: {
			Name: "msi_object_id",
			FieldName: "",
			Help: "Object ID of the user-assigned MSI to use, if any.\n\nLeave blank if msi_client_id or msi_mi_res_id specified.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		msi_client_id: {
			Name: "msi_client_id",
			FieldName: "",
			Help: "Object ID of the user-assigned MSI to use, if any.\n\nLeave blank if msi_object_id or msi_mi_res_id specified.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		msi_mi_res_id: {
			Name: "msi_mi_res_id",
			FieldName: "",
			Help: "Azure resource ID of the user-assigned MSI to use, if any.\n\nLeave blank if msi_client_id or msi_object_id specified.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		use_emulator: {
			Name: "use_emulator",
			FieldName: "",
			Help: "Uses local storage emulator if provided as 'true'.\n\nLeave blank if using real azure storage endpoint.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for the service.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to chunked upload (<= 256 MiB) (deprecated).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Upload chunk size.\n\nNote that this is stored in memory and there may be up to\n\"--transfers\" * \"--azureblob-upload-concurrency\" chunks stored at once\nin memory.",
			Default: 4194304,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4Mi",
			ValueStr: "4Mi",
			Type: "SizeSuffix"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for multipart uploads.\n\nThis is the number of chunks of the same file that are uploaded\nconcurrently.\n\nIf you are uploading small numbers of large files over high-speed\nlinks and these uploads do not fully utilize your bandwidth, then\nincreasing this may help to speed up the transfers.\n\nIn tests, upload speed increases almost linearly with upload\nconcurrency. For example to fill a gigabit pipe it may be necessary to\nraise this to 64. Note that this will use more memory.\n\nNote that chunks are stored in memory and there may be up to\n\"--transfers\" * \"--azureblob-upload-concurrency\" chunks stored at once\nin memory.",
			Default: 16,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "16",
			ValueStr: "16",
			Type: "int"
		},
		list_chunk: {
			Name: "list_chunk",
			FieldName: "",
			Help: "Size of blob list.\n\nThis sets the number of blobs requested in each listing chunk. Default\nis the maximum, 5000. \"List blobs\" requests are permitted 2 minutes\nper megabyte to complete. If an operation is taking longer than 2\nminutes per megabyte on average, it will time out (\n[source](https://docs.microsoft.com/en-us/rest/api/storageservices/setting-timeouts-for-blob-service-operations#exceptions-to-default-timeout-interval)\n). This can be used to limit the number of blobs items to return, to\navoid the time out.",
			Default: 5000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "5000",
			ValueStr: "5000",
			Type: "int"
		},
		access_tier: {
			Name: "access_tier",
			FieldName: "",
			Help: "Access tier of blob: hot, cool, cold or archive.\n\nArchived blobs can be restored by setting access tier to hot, cool or\ncold. Leave blank if you intend to use default access tier, which is\nset at account level\n\nIf there is no \"access tier\" specified, rclone doesn't apply any tier.\nrclone performs \"Set Tier\" operation on blobs while uploading, if objects\nare not modified, specifying \"access tier\" to new one will have no effect.\nIf blobs are in \"archive tier\" at remote, trying to perform data transfer\noperations from remote will not be allowed. User should first restore by\ntiering blob to \"Hot\", \"Cool\" or \"Cold\".",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		archive_tier_delete: {
			Name: "archive_tier_delete",
			FieldName: "",
			Help: "Delete archive tier blobs before overwriting.\n\nArchive tier blobs cannot be updated. So without this flag, if you\nattempt to update an archive tier blob, then rclone will produce the\nerror:\n\n    can't update archive tier blob without --azureblob-archive-tier-delete\n\nWith this flag set then before rclone attempts to overwrite an archive\ntier blob, it will delete the existing blob before uploading its\nreplacement.  This has the potential for data loss if the upload fails\n(unlike updating a normal blob) and also may cost more since deleting\narchive tier blobs early may be chargable.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_checksum: {
			Name: "disable_checksum",
			FieldName: "",
			Help: "Don't store MD5 checksum with object metadata.\n\nNormally rclone will calculate the MD5 checksum of the input before\nuploading it so it can add it to metadata on the object. This is great\nfor data integrity checking but can cause long delays for large files\nto start uploading.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 21078018,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,RightPeriod,InvalidUtf8",
			ValueStr: "Slash,BackSlash,Del,Ctl,RightPeriod,InvalidUtf8",
			Type: "Encoding"
		},
		public_access: {
			Name: "public_access",
			FieldName: "",
			Help: "Public access level of a container: blob or container.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "The container and its blobs can be accessed only with an authorized request.\nIt's a default value."
				},
				{
					Value: "blob",
					Help: "Blob data within this container can be read via anonymous request."
				},
				{
					Value: "container",
					Help: "Allow full public read access for container and blob data."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		directory_markers: {
			Name: "directory_markers",
			FieldName: "",
			Help: "Upload an empty object with a trailing slash when a new directory is created\n\nEmpty folders are unsupported for bucket based remotes, this option\ncreates an empty object ending with \"/\", to persist the folder.\n\nThis object also has the metadata \"hdi_isfolder = true\" to conform to\nthe Microsoft standard.\n ",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_check_container: {
			Name: "no_check_container",
			FieldName: "",
			Help: "If set, don't attempt to check the container exists or create it.\n\nThis can be useful when trying to minimise the number of transactions\nrclone does if you know the container exists already.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_head_object: {
			Name: "no_head_object",
			FieldName: "",
			Help: "If set, do not do HEAD before GET when getting objects.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		delete_snapshots: {
			Name: "delete_snapshots",
			FieldName: "",
			Help: "Set to specify how to deal with snapshots on blob deletion.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "By default, the delete operation fails if a blob has snapshots"
				},
				{
					Value: "include",
					Help: "Specify 'include' to remove the root blob and all its snapshots"
				},
				{
					Value: "only",
					Help: "Specify 'only' to remove only the snapshots but keep the root blob."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: true,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var b2 = {
	name: "b2",
	description: "Backblaze B2",
	options: {
		account: {
			Name: "account",
			FieldName: "",
			Help: "Account ID or Application Key ID.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		key: {
			Name: "key",
			FieldName: "",
			Help: "Application Key.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		hard_delete: {
			Name: "hard_delete",
			FieldName: "",
			Help: "Permanently delete files on remote removal, otherwise hide files.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for the service.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		versions: {
			Name: "versions",
			FieldName: "",
			Help: "Include old versions in directory listings.\n\nNote that when using this no file write operations are permitted,\nso you can't upload files or delete them.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		version_at: {
			Name: "version_at",
			FieldName: "",
			Help: "Show file versions as they were at the specified time.\n\nNote that when using this no file write operations are permitted,\nso you can't upload files or delete them.",
			Default: "0001-01-01T00:00:00Z",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "off",
			ValueStr: "off",
			Type: "Time"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to chunked upload.\n\nFiles above this size will be uploaded in chunks of \"--b2-chunk-size\".\n\nThis value should be set no larger than 4.657 GiB (== 5 GB).",
			Default: 209715200,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "200Mi",
			ValueStr: "200Mi",
			Type: "SizeSuffix"
		},
		copy_cutoff: {
			Name: "copy_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to multipart copy.\n\nAny files larger than this that need to be server-side copied will be\ncopied in chunks of this size.\n\nThe minimum is 0 and the maximum is 4.6 GiB.",
			Default: 4294967296,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4Gi",
			ValueStr: "4Gi",
			Type: "SizeSuffix"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Upload chunk size.\n\nWhen uploading large files, chunk the file into this size.\n\nMust fit in memory. These chunks are buffered in memory and there\nmight a maximum of \"--transfers\" chunks in progress at once.\n\n5,000,000 Bytes is the minimum size.",
			Default: 100663296,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "96Mi",
			ValueStr: "96Mi",
			Type: "SizeSuffix"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for multipart uploads.\n\nThis is the number of chunks of the same file that are uploaded\nconcurrently.\n\nNote that chunks are stored in memory and there may be up to\n\"--transfers\" * \"--b2-upload-concurrency\" chunks stored at once\nin memory.",
			Default: 4,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4",
			ValueStr: "4",
			Type: "int"
		},
		disable_checksum: {
			Name: "disable_checksum",
			FieldName: "",
			Help: "Disable checksums for large (> upload cutoff) files.\n\nNormally rclone will calculate the SHA1 checksum of the input before\nuploading it so it can add it to metadata on the object. This is great\nfor data integrity checking but can cause long delays for large files\nto start uploading.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		download_url: {
			Name: "download_url",
			FieldName: "",
			Help: "Custom endpoint for downloads.\n\nThis is usually set to a Cloudflare CDN URL as Backblaze offers\nfree egress for data downloaded through the Cloudflare network.\nRclone works with private buckets by sending an \"Authorization\" header.\nIf the custom endpoint rewrites the requests for authentication,\ne.g., in Cloudflare Workers, this header needs to be handled properly.\nLeave blank if you want to use the endpoint provided by Backblaze.\n\nThe URL provided here SHOULD have the protocol and SHOULD NOT have\na trailing slash or specify the /file/bucket subpath as rclone will\nrequest files with \"{download_url}/file/{bucket_name}/{path}\".\n\nExample:\n> https://mysubdomain.mydomain.tld\n(No trailing \"/\", \"file\" or \"bucket\")",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		download_auth_duration: {
			Name: "download_auth_duration",
			FieldName: "",
			Help: "Time before the public link authorization token will expire in s or suffix ms|s|m|h|d.\n\nThis is used in combination with \"rclone link\" for making files\naccessible to the public and sets the duration before the download\nauthorization token will expire.\n\nThe minimum value is 1 second. The maximum value is one week.",
			Default: 604800000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1w",
			ValueStr: "1w",
			Type: "Duration"
		},
		lifecycle: {
			Name: "lifecycle",
			FieldName: "",
			Help: "Set the number of days deleted files should be kept when creating a bucket.\n\nOn bucket creation, this parameter is used to create a lifecycle rule\nfor the entire bucket.\n\nIf lifecycle is 0 (the default) it does not create a lifecycle rule so\nthe default B2 behaviour applies. This is to create versions of files\non delete and overwrite and to keep them indefinitely.\n\nIf lifecycle is >0 then it creates a single rule setting the number of\ndays before a file that is deleted or overwritten is deleted\npermanently. This is known as daysFromHidingToDeleting in the b2 docs.\n\nThe minimum value for this parameter is 1 day.\n\nYou can also enable hard_delete in the config also which will mean\ndeletions won't cause versions but overwrites will still cause\nversions to be made.\n\nSee: [rclone backend lifecycle](#lifecycle) for setting lifecycles after bucket creation.\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50438146,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var quatrix = {
	name: "quatrix",
	description: "Quatrix by Maytech",
	options: {
		api_key: {
			Name: "api_key",
			FieldName: "",
			Help: "API key for accessing Quatrix account",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		host: {
			Name: "host",
			FieldName: "",
			Help: "Host name of Quatrix account",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50438146,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		effective_upload_time: {
			Name: "effective_upload_time",
			FieldName: "",
			Help: "Wanted upload time for one chunk",
			Default: "4s",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4s",
			ValueStr: "4s",
			Type: "string"
		},
		minimal_chunk_size: {
			Name: "minimal_chunk_size",
			FieldName: "",
			Help: "The minimal size for one chunk",
			Default: 10000269,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "9.537Mi",
			ValueStr: "9.537Mi",
			Type: "SizeSuffix"
		},
		maximal_summary_chunk_size: {
			Name: "maximal_summary_chunk_size",
			FieldName: "",
			Help: "The maximal summary for all chunks. It should not be less than 'transfers'*'minimal_chunk_size'",
			Default: 99999547,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "95.367Mi",
			ValueStr: "95.367Mi",
			Type: "SizeSuffix"
		},
		hard_delete: {
			Name: "hard_delete",
			FieldName: "",
			Help: "Delete files permanently rather than putting them into the trash",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		skip_project_folders: {
			Name: "skip_project_folders",
			FieldName: "",
			Help: "Skip project folders in operations",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var cache = {
	name: "cache",
	description: "Cache a remote",
	options: {
		remote: {
			Name: "remote",
			FieldName: "",
			Help: "Remote to cache.\n\nNormally should contain a ':' and a path, e.g. \"myremote:path/to/dir\",\n\"myremote:bucket\" or maybe \"myremote:\" (not recommended).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		plex_url: {
			Name: "plex_url",
			FieldName: "",
			Help: "The URL of the Plex server.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		plex_username: {
			Name: "plex_username",
			FieldName: "",
			Help: "The username of the Plex user.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		plex_password: {
			Name: "plex_password",
			FieldName: "",
			Help: "The password of the Plex user.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "The size of a chunk (partial file data).\n\nUse lower numbers for slower connections. If the chunk size is\nchanged, any downloaded chunks will be invalid and cache-chunk-path\nwill need to be cleared or unexpected EOF errors will occur.",
			Default: 5242880,
			Value: null,
			Examples: [
				{
					Value: "1M",
					Help: "1 MiB"
				},
				{
					Value: "5M",
					Help: "5 MiB"
				},
				{
					Value: "10M",
					Help: "10 MiB"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "5Mi",
			ValueStr: "5Mi",
			Type: "SizeSuffix"
		},
		info_age: {
			Name: "info_age",
			FieldName: "",
			Help: "How long to cache file structure information (directory listings, file size, times, etc.). \nIf all write operations are done through the cache then you can safely make\nthis value very large as the cache store will also be updated in real time.",
			Default: 21600000000000,
			Value: null,
			Examples: [
				{
					Value: "1h",
					Help: "1 hour"
				},
				{
					Value: "24h",
					Help: "24 hours"
				},
				{
					Value: "48h",
					Help: "48 hours"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "6h0m0s",
			ValueStr: "6h0m0s",
			Type: "Duration"
		},
		chunk_total_size: {
			Name: "chunk_total_size",
			FieldName: "",
			Help: "The total size that the chunks can take up on the local disk.\n\nIf the cache exceeds this value then it will start to delete the\noldest chunks until it goes under this value.",
			Default: 10737418240,
			Value: null,
			Examples: [
				{
					Value: "500M",
					Help: "500 MiB"
				},
				{
					Value: "1G",
					Help: "1 GiB"
				},
				{
					Value: "10G",
					Help: "10 GiB"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Gi",
			ValueStr: "10Gi",
			Type: "SizeSuffix"
		},
		plex_insecure: {
			Name: "plex_insecure",
			FieldName: "",
			Help: "Skip all certificate verification when connecting to the Plex server.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		db_path: {
			Name: "db_path",
			FieldName: "",
			Help: "Directory to store file structure metadata DB.\n\nThe remote name is used as the DB file name.",
			Default: "C:\\Users\\Hassan.Akbar\\AppData\\Local\\rclone\\cache-backend",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "C:\\Users\\Hassan.Akbar\\AppData\\Local\\rclone\\cache-backend",
			ValueStr: "C:\\Users\\Hassan.Akbar\\AppData\\Local\\rclone\\cache-backend",
			Type: "string"
		},
		chunk_path: {
			Name: "chunk_path",
			FieldName: "",
			Help: "Directory to cache chunk files.\n\nPath to where partial file data (chunks) are stored locally. The remote\nname is appended to the final path.\n\nThis config follows the \"--cache-db-path\". If you specify a custom\nlocation for \"--cache-db-path\" and don't specify one for \"--cache-chunk-path\"\nthen \"--cache-chunk-path\" will use the same path as \"--cache-db-path\".",
			Default: "C:\\Users\\Hassan.Akbar\\AppData\\Local\\rclone\\cache-backend",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "C:\\Users\\Hassan.Akbar\\AppData\\Local\\rclone\\cache-backend",
			ValueStr: "C:\\Users\\Hassan.Akbar\\AppData\\Local\\rclone\\cache-backend",
			Type: "string"
		},
		chunk_clean_interval: {
			Name: "chunk_clean_interval",
			FieldName: "",
			Help: "How often should the cache perform cleanups of the chunk storage.\n\nThe default value should be ok for most people. If you find that the\ncache goes over \"cache-chunk-total-size\" too often then try to lower\nthis value to force it to perform cleanups more often.",
			Default: 60000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1m0s",
			ValueStr: "1m0s",
			Type: "Duration"
		},
		read_retries: {
			Name: "read_retries",
			FieldName: "",
			Help: "How many times to retry a read from a cache storage.\n\nSince reading from a cache stream is independent from downloading file\ndata, readers can get to a point where there's no more data in the\ncache.  Most of the times this can indicate a connectivity issue if\ncache isn't able to provide file data anymore.\n\nFor really slow connections, increase this to a point where the stream is\nable to provide data but your experience will be very stuttering.",
			Default: 10,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10",
			ValueStr: "10",
			Type: "int"
		},
		workers: {
			Name: "workers",
			FieldName: "",
			Help: "How many workers should run in parallel to download chunks.\n\nHigher values will mean more parallel processing (better CPU needed)\nand more concurrent requests on the cloud provider.  This impacts\nseveral aspects like the cloud provider API limits, more stress on the\nhardware that rclone runs on but it also means that streams will be\nmore fluid and data will be available much more faster to readers.\n\n**Note**: If the optional Plex integration is enabled then this\nsetting will adapt to the type of reading performed and the value\nspecified here will be used as a maximum number of workers to use.",
			Default: 4,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4",
			ValueStr: "4",
			Type: "int"
		},
		chunk_no_memory: {
			Name: "chunk_no_memory",
			FieldName: "",
			Help: "Disable the in-memory cache for storing chunks during streaming.\n\nBy default, cache will keep file data during streaming in RAM as well\nto provide it to readers as fast as possible.\n\nThis transient data is evicted as soon as it is read and the number of\nchunks stored doesn't exceed the number of workers. However, depending\non other settings like \"cache-chunk-size\" and \"cache-workers\" this footprint\ncan increase if there are parallel streams too (multiple files being read\nat the same time).\n\nIf the hardware permits it, use this feature to provide an overall better\nperformance during streaming but it can also be disabled if RAM is not\navailable on the local machine.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		rps: {
			Name: "rps",
			FieldName: "",
			Help: "Limits the number of requests per second to the source FS (-1 to disable).\n\nThis setting places a hard limit on the number of requests per second\nthat cache will be doing to the cloud provider remote and try to\nrespect that value by setting waits between reads.\n\nIf you find that you're getting banned or limited on the cloud\nprovider through cache and know that a smaller number of requests per\nsecond will allow you to work with it then you can use this setting\nfor that.\n\nA good balance of all the other settings should make this setting\nuseless but it is available to set for more special cases.\n\n**NOTE**: This will limit the number of requests during streams but\nother API calls to the cloud provider like directory listings will\nstill pass.",
			Default: -1,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "-1",
			ValueStr: "-1",
			Type: "int"
		},
		writes: {
			Name: "writes",
			FieldName: "",
			Help: "Cache file data on writes through the FS.\n\nIf you need to read files immediately after you upload them through\ncache you can enable this flag to have their data stored in the\ncache store at the same time during upload.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		tmp_upload_path: {
			Name: "tmp_upload_path",
			FieldName: "",
			Help: "Directory to keep temporary files until they are uploaded.\n\nThis is the path where cache will use as a temporary storage for new\nfiles that need to be uploaded to the cloud provider.\n\nSpecifying a value will enable this feature. Without it, it is\ncompletely disabled and files will be uploaded directly to the cloud\nprovider",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		tmp_wait_time: {
			Name: "tmp_wait_time",
			FieldName: "",
			Help: "How long should files be stored in local cache before being uploaded.\n\nThis is the duration that a file must wait in the temporary location\n_cache-tmp-upload-path_ before it is selected for upload.\n\nNote that only one file is uploaded at a time and it can take longer\nto start the upload if a queue formed for this purpose.",
			Default: 15000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "15s",
			ValueStr: "15s",
			Type: "Duration"
		},
		db_wait_time: {
			Name: "db_wait_time",
			FieldName: "",
			Help: "How long to wait for the DB to be available - 0 is unlimited.\n\nOnly one process can have the DB open at any one time, so rclone waits\nfor this duration for the DB to become available before it gives an\nerror.\n\nIf you set it to 0 then it will wait forever.",
			Default: 1000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1s",
			ValueStr: "1s",
			Type: "Duration"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var chunker = {
	name: "chunker",
	description: "Transparently chunk/split large files",
	options: {
		remote: {
			Name: "remote",
			FieldName: "",
			Help: "Remote to chunk/unchunk.\n\nNormally should contain a ':' and a path, e.g. \"myremote:path/to/dir\",\n\"myremote:bucket\" or maybe \"myremote:\" (not recommended).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Files larger than chunk size will be split in chunks.",
			Default: 2147483648,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "2Gi",
			ValueStr: "2Gi",
			Type: "SizeSuffix"
		},
		hash_type: {
			Name: "hash_type",
			FieldName: "",
			Help: "Choose how chunker handles hash sums.\n\nAll modes but \"none\" require metadata.",
			Default: "md5",
			Value: null,
			Examples: [
				{
					Value: "none",
					Help: "Pass any hash supported by wrapped remote for non-chunked files.\nReturn nothing otherwise."
				},
				{
					Value: "md5",
					Help: "MD5 for composite files."
				},
				{
					Value: "sha1",
					Help: "SHA1 for composite files."
				},
				{
					Value: "md5all",
					Help: "MD5 for all files."
				},
				{
					Value: "sha1all",
					Help: "SHA1 for all files."
				},
				{
					Value: "md5quick",
					Help: "Copying a file to chunker will request MD5 from the source.\nFalling back to SHA1 if unsupported."
				},
				{
					Value: "sha1quick",
					Help: "Similar to \"md5quick\" but prefers SHA1 over MD5."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "md5",
			ValueStr: "md5",
			Type: "string"
		},
		name_format: {
			Name: "name_format",
			FieldName: "",
			Help: "String format of chunk file names.\n\nThe two placeholders are: base file name (*) and chunk number (#...).\nThere must be one and only one asterisk and one or more consecutive hash characters.\nIf chunk number has less digits than the number of hashes, it is left-padded by zeros.\nIf there are more digits in the number, they are left as is.\nPossible chunk files are ignored if their name does not match given format.",
			Default: "*.rclone_chunk.###",
			Value: null,
			Hide: 1,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "*.rclone_chunk.###",
			ValueStr: "*.rclone_chunk.###",
			Type: "string"
		},
		start_from: {
			Name: "start_from",
			FieldName: "",
			Help: "Minimum valid chunk number. Usually 0 or 1.\n\nBy default chunk numbers start from 1.",
			Default: 1,
			Value: null,
			Hide: 1,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1",
			ValueStr: "1",
			Type: "int"
		},
		meta_format: {
			Name: "meta_format",
			FieldName: "",
			Help: "Format of the metadata object or \"none\".\n\nBy default \"simplejson\".\nMetadata is a small JSON file named after the composite file.",
			Default: "simplejson",
			Value: null,
			Examples: [
				{
					Value: "none",
					Help: "Do not use metadata files at all.\nRequires hash type \"none\"."
				},
				{
					Value: "simplejson",
					Help: "Simple JSON supports hash sums and chunk validation.\n\nIt has the following fields: ver, size, nchunks, md5, sha1."
				}
			],
			Hide: 1,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "simplejson",
			ValueStr: "simplejson",
			Type: "string"
		},
		fail_hard: {
			Name: "fail_hard",
			FieldName: "",
			Help: "Choose how chunker should handle files with missing or invalid chunks.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "true",
					Help: "Report errors and abort current command."
				},
				{
					Value: "false",
					Help: "Warn user, skip incomplete file and proceed."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		transactions: {
			Name: "transactions",
			FieldName: "",
			Help: "Choose how chunker should handle temporary files during transactions.",
			Default: "rename",
			Value: null,
			Examples: [
				{
					Value: "rename",
					Help: "Rename temporary files after a successful transaction."
				},
				{
					Value: "norename",
					Help: "Leave temporary file names and write transaction ID to metadata file.\nMetadata is required for no rename transactions (meta format cannot be \"none\").\nIf you are using norename transactions you should be careful not to downgrade Rclone\nas older versions of Rclone don't support this transaction style and will misinterpret\nfiles manipulated by norename transactions.\nThis method is EXPERIMENTAL, don't use on production systems."
				},
				{
					Value: "auto",
					Help: "Rename or norename will be used depending on capabilities of the backend.\nIf meta format is set to \"none\", rename transactions will always be used.\nThis method is EXPERIMENTAL, don't use on production systems."
				}
			],
			Hide: 1,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "rename",
			ValueStr: "rename",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var combine = {
	name: "combine",
	description: "Combine several remotes into one",
	options: {
		upstreams: {
			Name: "upstreams",
			FieldName: "",
			Help: "Upstreams for combining\n\nThese should be in the form\n\n    dir=remote:path dir2=remote2:path\n\nWhere before the = is specified the root directory and after is the remote to\nput there.\n\nEmbedded spaces can be added using quotes\n\n    \"dir=remote:path with space\" \"dir2=remote2:path with space\"\n\n",
			Default: null,
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "SpaceSepList"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var hasher = {
	name: "hasher",
	description: "Better checksums for other remotes",
	options: {
		remote: {
			Name: "remote",
			FieldName: "",
			Help: "Remote to cache checksums for (e.g. myRemote:path).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		hashes: {
			Name: "hashes",
			FieldName: "",
			Help: "Comma separated list of supported checksum types.",
			Default: [
				"md5",
				"sha1"
			],
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "md5,sha1",
			ValueStr: "md5,sha1",
			Type: "CommaSepList"
		},
		max_age: {
			Name: "max_age",
			FieldName: "",
			Help: "Maximum time to keep checksums in cache (0 = no cache, off = cache forever).",
			Default: 9223372036854776000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "off",
			ValueStr: "off",
			Type: "Duration"
		},
		auto_size: {
			Name: "auto_size",
			FieldName: "",
			Help: "Auto-update checksum for files smaller than this size (disabled by default).",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "SizeSuffix"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var oos = {
	name: "oos",
	description: "Oracle Cloud Infrastructure Object Storage",
	options: {
		provider: {
			Name: "provider",
			FieldName: "",
			Help: "Choose your Auth Provider",
			Default: "env_auth",
			Value: null,
			Examples: [
				{
					Value: "env_auth",
					Help: "automatically pickup the credentials from runtime(env), first one to provide auth wins"
				},
				{
					Value: "user_principal_auth",
					Help: "use an OCI user and an API key for authentication.\nyou’ll need to put in a config file your tenancy OCID, user OCID, region, the path, fingerprint to an API key.\nhttps://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm"
				},
				{
					Value: "instance_principal_auth",
					Help: "use instance principals to authorize an instance to make API calls. \neach instance has its own identity, and authenticates using the certificates that are read from instance metadata. \nhttps://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/callingservicesfrominstances.htm"
				},
				{
					Value: "workload_identity_auth",
					Help: "use workload identity to grant OCI Container Engine for Kubernetes workloads policy-driven access to OCI resources using OCI Identity and Access Management (IAM).\nhttps://docs.oracle.com/en-us/iaas/Content/ContEng/Tasks/contenggrantingworkloadaccesstoresources.htm"
				},
				{
					Value: "resource_principal_auth",
					Help: "use resource principals to make API calls"
				},
				{
					Value: "no_auth",
					Help: "no credentials needed, this is typically for reading public buckets"
				}
			],
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "env_auth",
			ValueStr: "env_auth",
			Type: "string"
		},
		namespace: {
			Name: "namespace",
			FieldName: "",
			Help: "Object storage namespace",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		compartment: {
			Name: "compartment",
			FieldName: "",
			Help: "Object storage compartment OCID",
			Provider: "!no_auth",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		region: {
			Name: "region",
			FieldName: "",
			Help: "Object storage Region",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for Object storage API.\n\nLeave blank to use the default endpoint for the region.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		storage_tier: {
			Name: "storage_tier",
			FieldName: "",
			Help: "The storage class to use when storing new objects in storage. https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/understandingstoragetiers.htm",
			Default: "Standard",
			Value: null,
			Examples: [
				{
					Value: "Standard",
					Help: "Standard storage tier, this is the default tier"
				},
				{
					Value: "InfrequentAccess",
					Help: "InfrequentAccess storage tier"
				},
				{
					Value: "Archive",
					Help: "Archive storage tier"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Standard",
			ValueStr: "Standard",
			Type: "string"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to chunked upload.\n\nAny files larger than this will be uploaded in chunks of chunk_size.\nThe minimum is 0 and the maximum is 5 GiB.",
			Default: 209715200,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "200Mi",
			ValueStr: "200Mi",
			Type: "SizeSuffix"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Chunk size to use for uploading.\n\nWhen uploading files larger than upload_cutoff or files with unknown\nsize (e.g. from \"rclone rcat\" or uploaded with \"rclone mount\" they will be uploaded \nas multipart uploads using this chunk size.\n\nNote that \"upload_concurrency\" chunks of this size are buffered\nin memory per transfer.\n\nIf you are transferring large files over high-speed links and you have\nenough memory, then increasing this will speed up the transfers.\n\nRclone will automatically increase the chunk size when uploading a\nlarge file of known size to stay below the 10,000 chunks limit.\n\nFiles of unknown size are uploaded with the configured\nchunk_size. Since the default chunk size is 5 MiB and there can be at\nmost 10,000 chunks, this means that by default the maximum size of\na file you can stream upload is 48 GiB.  If you wish to stream upload\nlarger files then you will need to increase chunk_size.\n\nIncreasing the chunk size decreases the accuracy of the progress\nstatistics displayed with \"-P\" flag.\n",
			Default: 5242880,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "5Mi",
			ValueStr: "5Mi",
			Type: "SizeSuffix"
		},
		max_upload_parts: {
			Name: "max_upload_parts",
			FieldName: "",
			Help: "Maximum number of parts in a multipart upload.\n\nThis option defines the maximum number of multipart chunks to use\nwhen doing a multipart upload.\n\nOCI has max parts limit of 10,000 chunks.\n\nRclone will automatically increase the chunk size when uploading a\nlarge file of a known size to stay below this number of chunks limit.\n",
			Default: 10000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10000",
			ValueStr: "10000",
			Type: "int"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for multipart uploads.\n\nThis is the number of chunks of the same file that are uploaded\nconcurrently.\n\nIf you are uploading small numbers of large files over high-speed links\nand these uploads do not fully utilize your bandwidth, then increasing\nthis may help to speed up the transfers.",
			Default: 10,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10",
			ValueStr: "10",
			Type: "int"
		},
		copy_cutoff: {
			Name: "copy_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to multipart copy.\n\nAny files larger than this that need to be server-side copied will be\ncopied in chunks of this size.\n\nThe minimum is 0 and the maximum is 5 GiB.",
			Default: 4999341932,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4.656Gi",
			ValueStr: "4.656Gi",
			Type: "SizeSuffix"
		},
		copy_timeout: {
			Name: "copy_timeout",
			FieldName: "",
			Help: "Timeout for copy.\n\nCopy is an asynchronous operation, specify timeout to wait for copy to succeed\n",
			Default: 60000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1m0s",
			ValueStr: "1m0s",
			Type: "Duration"
		},
		disable_checksum: {
			Name: "disable_checksum",
			FieldName: "",
			Help: "Don't store MD5 checksum with object metadata.\n\nNormally rclone will calculate the MD5 checksum of the input before\nuploading it so it can add it to metadata on the object. This is great\nfor data integrity checking but can cause long delays for large files\nto start uploading.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50331650,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,InvalidUtf8,Dot",
			ValueStr: "Slash,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		leave_parts_on_error: {
			Name: "leave_parts_on_error",
			FieldName: "",
			Help: "If true avoid calling abort upload on a failure, leaving all successfully uploaded parts for manual recovery.\n\nIt should be set to true for resuming uploads across different sessions.\n\nWARNING: Storing parts of an incomplete multipart upload counts towards space usage on object storage and will add\nadditional costs if not cleaned up.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		attempt_resume_upload: {
			Name: "attempt_resume_upload",
			FieldName: "",
			Help: "If true attempt to resume previously started multipart upload for the object.\nThis will be helpful to speed up multipart transfers by resuming uploads from past session.\n\nWARNING: If chunk size differs in resumed session from past incomplete session, then the resumed multipart upload is \naborted and a new multipart upload is started with the new chunk size.\n\nThe flag leave_parts_on_error must be true to resume and optimize to skip parts that were already uploaded successfully.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_check_bucket: {
			Name: "no_check_bucket",
			FieldName: "",
			Help: "If set, don't attempt to check the bucket exists or create it.\n\nThis can be useful when trying to minimise the number of transactions\nrclone does if you know the bucket exists already.\n\nIt can also be needed if the user you are using does not have bucket\ncreation permissions.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		sse_customer_key_file: {
			Name: "sse_customer_key_file",
			FieldName: "",
			Help: "To use SSE-C, a file containing the base64-encoded string of the AES-256 encryption key associated\nwith the object. Please note only one of sse_customer_key_file|sse_customer_key|sse_kms_key_id is needed.'",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_customer_key: {
			Name: "sse_customer_key",
			FieldName: "",
			Help: "To use SSE-C, the optional header that specifies the base64-encoded 256-bit encryption key to use to\nencrypt or  decrypt the data. Please note only one of sse_customer_key_file|sse_customer_key|sse_kms_key_id is\nneeded. For more information, see Using Your Own Keys for Server-Side Encryption \n(https://docs.cloud.oracle.com/Content/Object/Tasks/usingyourencryptionkeys.htm)",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_customer_key_sha256: {
			Name: "sse_customer_key_sha256",
			FieldName: "",
			Help: "If using SSE-C, The optional header that specifies the base64-encoded SHA256 hash of the encryption\nkey. This value is used to check the integrity of the encryption key. see Using Your Own Keys for \nServer-Side Encryption (https://docs.cloud.oracle.com/Content/Object/Tasks/usingyourencryptionkeys.htm).",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_kms_key_id: {
			Name: "sse_kms_key_id",
			FieldName: "",
			Help: "if using your own master key in vault, this header specifies the\nOCID (https://docs.cloud.oracle.com/Content/General/Concepts/identifiers.htm) of a master encryption key used to call\nthe Key Management service to generate a data encryption key or to encrypt or decrypt a data encryption key.\nPlease note only one of sse_customer_key_file|sse_customer_key|sse_kms_key_id is needed.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_customer_algorithm: {
			Name: "sse_customer_algorithm",
			FieldName: "",
			Help: "If using SSE-C, the optional header that specifies \"AES256\" as the encryption algorithm.\nObject Storage supports \"AES256\" as the encryption algorithm. For more information, see\nUsing Your Own Keys for Server-Side Encryption (https://docs.cloud.oracle.com/Content/Object/Tasks/usingyourencryptionkeys.htm).",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				},
				{
					Value: "AES256",
					Help: "AES256"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var s3 = {
	name: "s3",
	description: "Amazon S3 Compliant Storage Providers including AWS, Alibaba, ArvanCloud, Ceph, ChinaMobile, Cloudflare, DigitalOcean, Dreamhost, GCS, HuaweiOBS, IBMCOS, IDrive, IONOS, LyveCloud, Leviia, Liara, Linode, Magalu, Minio, Netease, Petabox, RackCorp, Rclone, Scaleway, SeaweedFS, StackPath, Storj, Synology, TencentCOS, Wasabi, Qiniu and others",
	options: {
		provider: {
			Name: "provider",
			FieldName: "",
			Help: "Choose your S3 provider.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "AWS",
					Help: "Amazon Web Services (AWS) S3"
				},
				{
					Value: "Alibaba",
					Help: "Alibaba Cloud Object Storage System (OSS) formerly Aliyun"
				},
				{
					Value: "ArvanCloud",
					Help: "Arvan Cloud Object Storage (AOS)"
				},
				{
					Value: "Ceph",
					Help: "Ceph Object Storage"
				},
				{
					Value: "ChinaMobile",
					Help: "China Mobile Ecloud Elastic Object Storage (EOS)"
				},
				{
					Value: "Cloudflare",
					Help: "Cloudflare R2 Storage"
				},
				{
					Value: "DigitalOcean",
					Help: "DigitalOcean Spaces"
				},
				{
					Value: "Dreamhost",
					Help: "Dreamhost DreamObjects"
				},
				{
					Value: "GCS",
					Help: "Google Cloud Storage"
				},
				{
					Value: "HuaweiOBS",
					Help: "Huawei Object Storage Service"
				},
				{
					Value: "IBMCOS",
					Help: "IBM COS S3"
				},
				{
					Value: "IDrive",
					Help: "IDrive e2"
				},
				{
					Value: "IONOS",
					Help: "IONOS Cloud"
				},
				{
					Value: "LyveCloud",
					Help: "Seagate Lyve Cloud"
				},
				{
					Value: "Leviia",
					Help: "Leviia Object Storage"
				},
				{
					Value: "Liara",
					Help: "Liara Object Storage"
				},
				{
					Value: "Linode",
					Help: "Linode Object Storage"
				},
				{
					Value: "Magalu",
					Help: "Magalu Object Storage"
				},
				{
					Value: "Minio",
					Help: "Minio Object Storage"
				},
				{
					Value: "Netease",
					Help: "Netease Object Storage (NOS)"
				},
				{
					Value: "Petabox",
					Help: "Petabox Object Storage"
				},
				{
					Value: "RackCorp",
					Help: "RackCorp Object Storage"
				},
				{
					Value: "Rclone",
					Help: "Rclone S3 Server"
				},
				{
					Value: "Scaleway",
					Help: "Scaleway Object Storage"
				},
				{
					Value: "SeaweedFS",
					Help: "SeaweedFS S3"
				},
				{
					Value: "StackPath",
					Help: "StackPath Object Storage"
				},
				{
					Value: "Storj",
					Help: "Storj (S3 Compatible Gateway)"
				},
				{
					Value: "Synology",
					Help: "Synology C2 Object Storage"
				},
				{
					Value: "TencentCOS",
					Help: "Tencent Cloud Object Storage (COS)"
				},
				{
					Value: "Wasabi",
					Help: "Wasabi Object Storage"
				},
				{
					Value: "Qiniu",
					Help: "Qiniu Object Storage (Kodo)"
				},
				{
					Value: "Other",
					Help: "Any other S3 compatible provider"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		env_auth: {
			Name: "env_auth",
			FieldName: "",
			Help: "Get AWS credentials from runtime (environment variables or EC2/ECS meta data if no env vars).\n\nOnly applies if access_key_id and secret_access_key is blank.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "false",
					Help: "Enter AWS credentials in the next step."
				},
				{
					Value: "true",
					Help: "Get AWS credentials from the environment (env vars or IAM)."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		access_key_id: {
			Name: "access_key_id",
			FieldName: "",
			Help: "AWS Access Key ID.\n\nLeave blank for anonymous access or runtime credentials.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		secret_access_key: {
			Name: "secret_access_key",
			FieldName: "",
			Help: "AWS Secret Access Key (password).\n\nLeave blank for anonymous access or runtime credentials.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		region: {
			Name: "region",
			FieldName: "",
			Help: "Region to connect to.",
			Provider: "AWS",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "us-east-1",
					Help: "The default endpoint - a good choice if you are unsure.\nUS Region, Northern Virginia, or Pacific Northwest.\nLeave location constraint empty."
				},
				{
					Value: "us-east-2",
					Help: "US East (Ohio) Region.\nNeeds location constraint us-east-2."
				},
				{
					Value: "us-west-1",
					Help: "US West (Northern California) Region.\nNeeds location constraint us-west-1."
				},
				{
					Value: "us-west-2",
					Help: "US West (Oregon) Region.\nNeeds location constraint us-west-2."
				},
				{
					Value: "ca-central-1",
					Help: "Canada (Central) Region.\nNeeds location constraint ca-central-1."
				},
				{
					Value: "eu-west-1",
					Help: "EU (Ireland) Region.\nNeeds location constraint EU or eu-west-1."
				},
				{
					Value: "eu-west-2",
					Help: "EU (London) Region.\nNeeds location constraint eu-west-2."
				},
				{
					Value: "eu-west-3",
					Help: "EU (Paris) Region.\nNeeds location constraint eu-west-3."
				},
				{
					Value: "eu-north-1",
					Help: "EU (Stockholm) Region.\nNeeds location constraint eu-north-1."
				},
				{
					Value: "eu-south-1",
					Help: "EU (Milan) Region.\nNeeds location constraint eu-south-1."
				},
				{
					Value: "eu-central-1",
					Help: "EU (Frankfurt) Region.\nNeeds location constraint eu-central-1."
				},
				{
					Value: "ap-southeast-1",
					Help: "Asia Pacific (Singapore) Region.\nNeeds location constraint ap-southeast-1."
				},
				{
					Value: "ap-southeast-2",
					Help: "Asia Pacific (Sydney) Region.\nNeeds location constraint ap-southeast-2."
				},
				{
					Value: "ap-northeast-1",
					Help: "Asia Pacific (Tokyo) Region.\nNeeds location constraint ap-northeast-1."
				},
				{
					Value: "ap-northeast-2",
					Help: "Asia Pacific (Seoul).\nNeeds location constraint ap-northeast-2."
				},
				{
					Value: "ap-northeast-3",
					Help: "Asia Pacific (Osaka-Local).\nNeeds location constraint ap-northeast-3."
				},
				{
					Value: "ap-south-1",
					Help: "Asia Pacific (Mumbai).\nNeeds location constraint ap-south-1."
				},
				{
					Value: "ap-east-1",
					Help: "Asia Pacific (Hong Kong) Region.\nNeeds location constraint ap-east-1."
				},
				{
					Value: "sa-east-1",
					Help: "South America (Sao Paulo) Region.\nNeeds location constraint sa-east-1."
				},
				{
					Value: "il-central-1",
					Help: "Israel (Tel Aviv) Region.\nNeeds location constraint il-central-1."
				},
				{
					Value: "me-south-1",
					Help: "Middle East (Bahrain) Region.\nNeeds location constraint me-south-1."
				},
				{
					Value: "af-south-1",
					Help: "Africa (Cape Town) Region.\nNeeds location constraint af-south-1."
				},
				{
					Value: "cn-north-1",
					Help: "China (Beijing) Region.\nNeeds location constraint cn-north-1."
				},
				{
					Value: "cn-northwest-1",
					Help: "China (Ningxia) Region.\nNeeds location constraint cn-northwest-1."
				},
				{
					Value: "us-gov-east-1",
					Help: "AWS GovCloud (US-East) Region.\nNeeds location constraint us-gov-east-1."
				},
				{
					Value: "us-gov-west-1",
					Help: "AWS GovCloud (US) Region.\nNeeds location constraint us-gov-west-1."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for S3 API.\n\nLeave blank if using AWS to use the default endpoint for the region.",
			Provider: "AWS",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		location_constraint: {
			Name: "location_constraint",
			FieldName: "",
			Help: "Location constraint - must be set to match the Region.\n\nUsed when creating buckets only.",
			Provider: "AWS",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "Empty for US Region, Northern Virginia, or Pacific Northwest"
				},
				{
					Value: "us-east-2",
					Help: "US East (Ohio) Region"
				},
				{
					Value: "us-west-1",
					Help: "US West (Northern California) Region"
				},
				{
					Value: "us-west-2",
					Help: "US West (Oregon) Region"
				},
				{
					Value: "ca-central-1",
					Help: "Canada (Central) Region"
				},
				{
					Value: "eu-west-1",
					Help: "EU (Ireland) Region"
				},
				{
					Value: "eu-west-2",
					Help: "EU (London) Region"
				},
				{
					Value: "eu-west-3",
					Help: "EU (Paris) Region"
				},
				{
					Value: "eu-north-1",
					Help: "EU (Stockholm) Region"
				},
				{
					Value: "eu-south-1",
					Help: "EU (Milan) Region"
				},
				{
					Value: "EU",
					Help: "EU Region"
				},
				{
					Value: "ap-southeast-1",
					Help: "Asia Pacific (Singapore) Region"
				},
				{
					Value: "ap-southeast-2",
					Help: "Asia Pacific (Sydney) Region"
				},
				{
					Value: "ap-northeast-1",
					Help: "Asia Pacific (Tokyo) Region"
				},
				{
					Value: "ap-northeast-2",
					Help: "Asia Pacific (Seoul) Region"
				},
				{
					Value: "ap-northeast-3",
					Help: "Asia Pacific (Osaka-Local) Region"
				},
				{
					Value: "ap-south-1",
					Help: "Asia Pacific (Mumbai) Region"
				},
				{
					Value: "ap-east-1",
					Help: "Asia Pacific (Hong Kong) Region"
				},
				{
					Value: "sa-east-1",
					Help: "South America (Sao Paulo) Region"
				},
				{
					Value: "il-central-1",
					Help: "Israel (Tel Aviv) Region"
				},
				{
					Value: "me-south-1",
					Help: "Middle East (Bahrain) Region"
				},
				{
					Value: "af-south-1",
					Help: "Africa (Cape Town) Region"
				},
				{
					Value: "cn-north-1",
					Help: "China (Beijing) Region"
				},
				{
					Value: "cn-northwest-1",
					Help: "China (Ningxia) Region"
				},
				{
					Value: "us-gov-east-1",
					Help: "AWS GovCloud (US-East) Region"
				},
				{
					Value: "us-gov-west-1",
					Help: "AWS GovCloud (US) Region"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		acl: {
			Name: "acl",
			FieldName: "",
			Help: "Canned ACL used when creating buckets and storing or copying objects.\n\nThis ACL is used for creating objects and if bucket_acl isn't set, for creating buckets too.\n\nFor more info visit https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl\n\nNote that this ACL is applied when server-side copying objects as S3\ndoesn't copy the ACL from the source but rather writes a fresh one.\n\nIf the acl is an empty string then no X-Amz-Acl: header is added and\nthe default (private) will be used.\n",
			Provider: "!Storj,Synology,Cloudflare",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "default",
					Help: "Owner gets Full_CONTROL.\nNo one else has access rights (default).",
					Provider: "TencentCOS"
				},
				{
					Value: "private",
					Help: "Owner gets FULL_CONTROL.\nNo one else has access rights (default).",
					Provider: "!IBMCOS,TencentCOS"
				},
				{
					Value: "public-read",
					Help: "Owner gets FULL_CONTROL.\nThe AllUsers group gets READ access.",
					Provider: "!IBMCOS"
				},
				{
					Value: "public-read-write",
					Help: "Owner gets FULL_CONTROL.\nThe AllUsers group gets READ and WRITE access.\nGranting this on a bucket is generally not recommended.",
					Provider: "!IBMCOS"
				},
				{
					Value: "authenticated-read",
					Help: "Owner gets FULL_CONTROL.\nThe AuthenticatedUsers group gets READ access.",
					Provider: "!IBMCOS"
				},
				{
					Value: "bucket-owner-read",
					Help: "Object owner gets FULL_CONTROL.\nBucket owner gets READ access.\nIf you specify this canned ACL when creating a bucket, Amazon S3 ignores it.",
					Provider: "!IBMCOS,ChinaMobile"
				},
				{
					Value: "bucket-owner-full-control",
					Help: "Both the object owner and the bucket owner get FULL_CONTROL over the object.\nIf you specify this canned ACL when creating a bucket, Amazon S3 ignores it.",
					Provider: "!IBMCOS,ChinaMobile"
				},
				{
					Value: "private",
					Help: "Owner gets FULL_CONTROL.\nNo one else has access rights (default).\nThis acl is available on IBM Cloud (Infra), IBM Cloud (Storage), On-Premise COS.",
					Provider: "IBMCOS"
				},
				{
					Value: "public-read",
					Help: "Owner gets FULL_CONTROL.\nThe AllUsers group gets READ access.\nThis acl is available on IBM Cloud (Infra), IBM Cloud (Storage), On-Premise IBM COS.",
					Provider: "IBMCOS"
				},
				{
					Value: "public-read-write",
					Help: "Owner gets FULL_CONTROL.\nThe AllUsers group gets READ and WRITE access.\nThis acl is available on IBM Cloud (Infra), On-Premise IBM COS.",
					Provider: "IBMCOS"
				},
				{
					Value: "authenticated-read",
					Help: "Owner gets FULL_CONTROL.\nThe AuthenticatedUsers group gets READ access.\nNot supported on Buckets.\nThis acl is available on IBM Cloud (Infra) and On-Premise IBM COS.",
					Provider: "IBMCOS"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		server_side_encryption: {
			Name: "server_side_encryption",
			FieldName: "",
			Help: "The server-side encryption algorithm used when storing this object in S3.",
			Provider: "AWS,Ceph,ChinaMobile,Minio",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				},
				{
					Value: "AES256",
					Help: "AES256"
				},
				{
					Value: "aws:kms",
					Help: "aws:kms",
					Provider: "!ChinaMobile"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_kms_key_id: {
			Name: "sse_kms_key_id",
			FieldName: "",
			Help: "If using KMS ID you must provide the ARN of Key.",
			Provider: "AWS,Ceph,Minio",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				},
				{
					Value: "arn:aws:kms:us-east-1:*",
					Help: "arn:aws:kms:*"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		storage_class: {
			Name: "storage_class",
			FieldName: "",
			Help: "The storage class to use when storing new objects in S3.",
			Provider: "AWS",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "Default"
				},
				{
					Value: "STANDARD",
					Help: "Standard storage class"
				},
				{
					Value: "REDUCED_REDUNDANCY",
					Help: "Reduced redundancy storage class"
				},
				{
					Value: "STANDARD_IA",
					Help: "Standard Infrequent Access storage class"
				},
				{
					Value: "ONEZONE_IA",
					Help: "One Zone Infrequent Access storage class"
				},
				{
					Value: "GLACIER",
					Help: "Glacier storage class"
				},
				{
					Value: "DEEP_ARCHIVE",
					Help: "Glacier Deep Archive storage class"
				},
				{
					Value: "INTELLIGENT_TIERING",
					Help: "Intelligent-Tiering storage class"
				},
				{
					Value: "GLACIER_IR",
					Help: "Glacier Instant Retrieval storage class"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		bucket_acl: {
			Name: "bucket_acl",
			FieldName: "",
			Help: "Canned ACL used when creating buckets.\n\nFor more info visit https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl\n\nNote that this ACL is applied when only when creating buckets.  If it\nisn't set then \"acl\" is used instead.\n\nIf the \"acl\" and \"bucket_acl\" are empty strings then no X-Amz-Acl:\nheader is added and the default (private) will be used.\n",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "private",
					Help: "Owner gets FULL_CONTROL.\nNo one else has access rights (default)."
				},
				{
					Value: "public-read",
					Help: "Owner gets FULL_CONTROL.\nThe AllUsers group gets READ access."
				},
				{
					Value: "public-read-write",
					Help: "Owner gets FULL_CONTROL.\nThe AllUsers group gets READ and WRITE access.\nGranting this on a bucket is generally not recommended."
				},
				{
					Value: "authenticated-read",
					Help: "Owner gets FULL_CONTROL.\nThe AuthenticatedUsers group gets READ access."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		requester_pays: {
			Name: "requester_pays",
			FieldName: "",
			Help: "Enables requester pays option when interacting with S3 bucket.",
			Provider: "AWS",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		sse_customer_algorithm: {
			Name: "sse_customer_algorithm",
			FieldName: "",
			Help: "If using SSE-C, the server-side encryption algorithm used when storing this object in S3.",
			Provider: "AWS,Ceph,ChinaMobile,Minio",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				},
				{
					Value: "AES256",
					Help: "AES256"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_customer_key: {
			Name: "sse_customer_key",
			FieldName: "",
			Help: "To use SSE-C you may provide the secret encryption key used to encrypt/decrypt your data.\n\nAlternatively you can provide --sse-customer-key-base64.",
			Provider: "AWS,Ceph,ChinaMobile,Minio",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_customer_key_base64: {
			Name: "sse_customer_key_base64",
			FieldName: "",
			Help: "If using SSE-C you must provide the secret encryption key encoded in base64 format to encrypt/decrypt your data.\n\nAlternatively you can provide --sse-customer-key.",
			Provider: "AWS,Ceph,ChinaMobile,Minio",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		sse_customer_key_md5: {
			Name: "sse_customer_key_md5",
			FieldName: "",
			Help: "If using SSE-C you may provide the secret encryption key MD5 checksum (optional).\n\nIf you leave it blank, this is calculated automatically from the sse_customer_key provided.\n",
			Provider: "AWS,Ceph,ChinaMobile,Minio",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "None"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to chunked upload.\n\nAny files larger than this will be uploaded in chunks of chunk_size.\nThe minimum is 0 and the maximum is 5 GiB.",
			Default: 209715200,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "200Mi",
			ValueStr: "200Mi",
			Type: "SizeSuffix"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Chunk size to use for uploading.\n\nWhen uploading files larger than upload_cutoff or files with unknown\nsize (e.g. from \"rclone rcat\" or uploaded with \"rclone mount\" or google\nphotos or google docs) they will be uploaded as multipart uploads\nusing this chunk size.\n\nNote that \"--s3-upload-concurrency\" chunks of this size are buffered\nin memory per transfer.\n\nIf you are transferring large files over high-speed links and you have\nenough memory, then increasing this will speed up the transfers.\n\nRclone will automatically increase the chunk size when uploading a\nlarge file of known size to stay below the 10,000 chunks limit.\n\nFiles of unknown size are uploaded with the configured\nchunk_size. Since the default chunk size is 5 MiB and there can be at\nmost 10,000 chunks, this means that by default the maximum size of\na file you can stream upload is 48 GiB.  If you wish to stream upload\nlarger files then you will need to increase chunk_size.\n\nIncreasing the chunk size decreases the accuracy of the progress\nstatistics displayed with \"-P\" flag. Rclone treats chunk as sent when\nit's buffered by the AWS SDK, when in fact it may still be uploading.\nA bigger chunk size means a bigger AWS SDK buffer and progress\nreporting more deviating from the truth.\n",
			Default: 5242880,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "5Mi",
			ValueStr: "5Mi",
			Type: "SizeSuffix"
		},
		max_upload_parts: {
			Name: "max_upload_parts",
			FieldName: "",
			Help: "Maximum number of parts in a multipart upload.\n\nThis option defines the maximum number of multipart chunks to use\nwhen doing a multipart upload.\n\nThis can be useful if a service does not support the AWS S3\nspecification of 10,000 chunks.\n\nRclone will automatically increase the chunk size when uploading a\nlarge file of a known size to stay below this number of chunks limit.\n",
			Default: 10000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10000",
			ValueStr: "10000",
			Type: "int"
		},
		copy_cutoff: {
			Name: "copy_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to multipart copy.\n\nAny files larger than this that need to be server-side copied will be\ncopied in chunks of this size.\n\nThe minimum is 0 and the maximum is 5 GiB.",
			Default: 4999341932,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4.656Gi",
			ValueStr: "4.656Gi",
			Type: "SizeSuffix"
		},
		disable_checksum: {
			Name: "disable_checksum",
			FieldName: "",
			Help: "Don't store MD5 checksum with object metadata.\n\nNormally rclone will calculate the MD5 checksum of the input before\nuploading it so it can add it to metadata on the object. This is great\nfor data integrity checking but can cause long delays for large files\nto start uploading.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		shared_credentials_file: {
			Name: "shared_credentials_file",
			FieldName: "",
			Help: "Path to the shared credentials file.\n\nIf env_auth = true then rclone can use a shared credentials file.\n\nIf this variable is empty rclone will look for the\n\"AWS_SHARED_CREDENTIALS_FILE\" env variable. If the env value is empty\nit will default to the current user's home directory.\n\n    Linux/OSX: \"$HOME/.aws/credentials\"\n    Windows:   \"%USERPROFILE%\\.aws\\credentials\"\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		profile: {
			Name: "profile",
			FieldName: "",
			Help: "Profile to use in the shared credentials file.\n\nIf env_auth = true then rclone can use a shared credentials file. This\nvariable controls which profile is used in that file.\n\nIf empty it will default to the environment variable \"AWS_PROFILE\" or\n\"default\" if that environment variable is also not set.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		session_token: {
			Name: "session_token",
			FieldName: "",
			Help: "An AWS session token.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for multipart uploads and copies.\n\nThis is the number of chunks of the same file that are uploaded\nconcurrently for multipart uploads and copies.\n\nIf you are uploading small numbers of large files over high-speed links\nand these uploads do not fully utilize your bandwidth, then increasing\nthis may help to speed up the transfers.",
			Default: 4,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4",
			ValueStr: "4",
			Type: "int"
		},
		force_path_style: {
			Name: "force_path_style",
			FieldName: "",
			Help: "If true use path style access if false use virtual hosted style.\n\nIf this is true (the default) then rclone will use path style access,\nif false then rclone will use virtual path style. See [the AWS S3\ndocs](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingBucket.html#access-bucket-intro)\nfor more info.\n\nSome providers (e.g. AWS, Aliyun OSS, Netease COS, or Tencent COS) require this set to\nfalse - rclone will do this automatically based on the provider\nsetting.\n\nNote that if your bucket isn't a valid DNS name, i.e. has '.' or '_' in,\nyou'll need to set this to true.\n",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		v2_auth: {
			Name: "v2_auth",
			FieldName: "",
			Help: "If true use v2 authentication.\n\nIf this is false (the default) then rclone will use v4 authentication.\nIf it is set then rclone will use v2 authentication.\n\nUse this only if v4 signatures don't work, e.g. pre Jewel/v10 CEPH.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_dual_stack: {
			Name: "use_dual_stack",
			FieldName: "",
			Help: "If true use AWS S3 dual-stack endpoint (IPv6 support).\n\nSee [AWS Docs on Dualstack Endpoints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/dual-stack-endpoints.html)",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_accelerate_endpoint: {
			Name: "use_accelerate_endpoint",
			FieldName: "",
			Help: "If true use the AWS S3 accelerated endpoint.\n\nSee: [AWS S3 Transfer acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration-examples.html)",
			Provider: "AWS",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		leave_parts_on_error: {
			Name: "leave_parts_on_error",
			FieldName: "",
			Help: "If true avoid calling abort upload on a failure, leaving all successfully uploaded parts on S3 for manual recovery.\n\nIt should be set to true for resuming uploads across different sessions.\n\nWARNING: Storing parts of an incomplete multipart upload counts towards space usage on S3 and will add additional costs if not cleaned up.\n",
			Provider: "AWS",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		list_chunk: {
			Name: "list_chunk",
			FieldName: "",
			Help: "Size of listing chunk (response list for each ListObject S3 request).\n\nThis option is also known as \"MaxKeys\", \"max-items\", or \"page-size\" from the AWS S3 specification.\nMost services truncate the response list to 1000 objects even if requested more than that.\nIn AWS S3 this is a global maximum and cannot be changed, see [AWS S3](https://docs.aws.amazon.com/cli/latest/reference/s3/ls.html).\nIn Ceph, this can be increased with the \"rgw list buckets max chunk\" option.\n",
			Default: 1000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1000",
			ValueStr: "1000",
			Type: "int"
		},
		list_version: {
			Name: "list_version",
			FieldName: "",
			Help: "Version of ListObjects to use: 1,2 or 0 for auto.\n\nWhen S3 originally launched it only provided the ListObjects call to\nenumerate objects in a bucket.\n\nHowever in May 2016 the ListObjectsV2 call was introduced. This is\nmuch higher performance and should be used if at all possible.\n\nIf set to the default, 0, rclone will guess according to the provider\nset which list objects method to call. If it guesses wrong, then it\nmay be set manually here.\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		list_url_encode: {
			Name: "list_url_encode",
			FieldName: "",
			Help: "Whether to url encode listings: true/false/unset\n\nSome providers support URL encoding listings and where this is\navailable this is more reliable when using control characters in file\nnames. If this is set to unset (the default) then rclone will choose\naccording to the provider setting what to apply, but you can override\nrclone's choice here.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		no_check_bucket: {
			Name: "no_check_bucket",
			FieldName: "",
			Help: "If set, don't attempt to check the bucket exists or create it.\n\nThis can be useful when trying to minimise the number of transactions\nrclone does if you know the bucket exists already.\n\nIt can also be needed if the user you are using does not have bucket\ncreation permissions. Before v1.52.0 this would have passed silently\ndue to a bug.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_head: {
			Name: "no_head",
			FieldName: "",
			Help: "If set, don't HEAD uploaded objects to check integrity.\n\nThis can be useful when trying to minimise the number of transactions\nrclone does.\n\nSetting it means that if rclone receives a 200 OK message after\nuploading an object with PUT then it will assume that it got uploaded\nproperly.\n\nIn particular it will assume:\n\n- the metadata, including modtime, storage class and content type was as uploaded\n- the size was as uploaded\n\nIt reads the following items from the response for a single part PUT:\n\n- the MD5SUM\n- The uploaded date\n\nFor multipart uploads these items aren't read.\n\nIf an source object of unknown length is uploaded then rclone **will** do a\nHEAD request.\n\nSetting this flag increases the chance for undetected upload failures,\nin particular an incorrect size, so it isn't recommended for normal\noperation. In practice the chance of an undetected upload failure is\nvery small even with this flag.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_head_object: {
			Name: "no_head_object",
			FieldName: "",
			Help: "If set, do not do HEAD before GET when getting objects.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50331650,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,InvalidUtf8,Dot",
			ValueStr: "Slash,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		disable_http2: {
			Name: "disable_http2",
			FieldName: "",
			Help: "Disable usage of http2 for S3 backends.\n\nThere is currently an unsolved issue with the s3 (specifically minio) backend\nand HTTP/2.  HTTP/2 is enabled by default for the s3 backend but can be\ndisabled here.  When the issue is solved this flag will be removed.\n\nSee: https://github.com/rclone/rclone/issues/4673, https://github.com/rclone/rclone/issues/3631\n\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		download_url: {
			Name: "download_url",
			FieldName: "",
			Help: "Custom endpoint for downloads.\nThis is usually set to a CloudFront CDN URL as AWS S3 offers\ncheaper egress for data downloaded through the CloudFront network.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		directory_markers: {
			Name: "directory_markers",
			FieldName: "",
			Help: "Upload an empty object with a trailing slash when a new directory is created\n\nEmpty folders are unsupported for bucket based remotes, this option creates an empty\nobject ending with \"/\", to persist the folder.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_multipart_etag: {
			Name: "use_multipart_etag",
			FieldName: "",
			Help: "Whether to use ETag in multipart uploads for verification\n\nThis should be true, false or left unset to use the default for the provider.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		use_unsigned_payload: {
			Name: "use_unsigned_payload",
			FieldName: "",
			Help: "Whether to use an unsigned payload in PutObject\n\nRclone has to avoid the AWS SDK seeking the body when calling\nPutObject. The AWS provider can add checksums in the trailer to avoid\nseeking but other providers can't.\n\nThis should be true, false or left unset to use the default for the provider.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		use_presigned_request: {
			Name: "use_presigned_request",
			FieldName: "",
			Help: "Whether to use a presigned request or PutObject for single part uploads\n\nIf this is false rclone will use PutObject from the AWS SDK to upload\nan object.\n\nVersions of rclone < 1.59 use presigned requests to upload a single\npart object and setting this flag to true will re-enable that\nfunctionality. This shouldn't be necessary except in exceptional\ncircumstances or for testing.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		versions: {
			Name: "versions",
			FieldName: "",
			Help: "Include old versions in directory listings.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		version_at: {
			Name: "version_at",
			FieldName: "",
			Help: "Show file versions as they were at the specified time.\n\nThe parameter should be a date, \"2006-01-02\", datetime \"2006-01-02\n15:04:05\" or a duration for that long ago, eg \"100d\" or \"1h\".\n\nNote that when using this no file write operations are permitted,\nso you can't upload files or delete them.\n\nSee [the time option docs](/docs/#time-option) for valid formats.\n",
			Default: "0001-01-01T00:00:00Z",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "off",
			ValueStr: "off",
			Type: "Time"
		},
		version_deleted: {
			Name: "version_deleted",
			FieldName: "",
			Help: "Show deleted file markers when using versions.\n\nThis shows deleted file markers in the listing when using versions. These will appear\nas 0 size files. The only operation which can be performed on them is deletion.\n\nDeleting a delete marker will reveal the previous version.\n\nDeleted files will always show with a timestamp.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		decompress: {
			Name: "decompress",
			FieldName: "",
			Help: "If set this will decompress gzip encoded objects.\n\nIt is possible to upload objects to S3 with \"Content-Encoding: gzip\"\nset. Normally rclone will download these files as compressed objects.\n\nIf this flag is set then rclone will decompress these files with\n\"Content-Encoding: gzip\" as they are received. This means that rclone\ncan't check the size and hash but the file contents will be decompressed.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		might_gzip: {
			Name: "might_gzip",
			FieldName: "",
			Help: "Set this if the backend might gzip objects.\n\nNormally providers will not alter objects when they are downloaded. If\nan object was not uploaded with `Content-Encoding: gzip` then it won't\nbe set on download.\n\nHowever some providers may gzip objects even if they weren't uploaded\nwith `Content-Encoding: gzip` (eg Cloudflare).\n\nA symptom of this would be receiving errors like\n\n    ERROR corrupted on transfer: sizes differ NNN vs MMM\n\nIf you set this flag and rclone downloads an object with\nContent-Encoding: gzip set and chunked transfer encoding, then rclone\nwill decompress the object on the fly.\n\nIf this is set to unset (the default) then rclone will choose\naccording to the provider setting what to apply, but you can override\nrclone's choice here.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		use_accept_encoding_gzip: {
			Name: "use_accept_encoding_gzip",
			FieldName: "",
			Help: "Whether to send `Accept-Encoding: gzip` header.\n\nBy default, rclone will append `Accept-Encoding: gzip` to the request to download\ncompressed objects whenever possible.\n\nHowever some providers such as Google Cloud Storage may alter the HTTP headers, breaking\nthe signature of the request.\n\nA symptom of this would be receiving errors like\n\n\tSignatureDoesNotMatch: The request signature we calculated does not match the signature you provided.\n\nIn this case, you might want to try disabling this option.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		no_system_metadata: {
			Name: "no_system_metadata",
			FieldName: "",
			Help: "Suppress setting and reading of system metadata",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_already_exists: {
			Name: "use_already_exists",
			FieldName: "",
			Help: "Set if rclone should report BucketAlreadyExists errors on bucket creation.\n\nAt some point during the evolution of the s3 protocol, AWS started\nreturning an `AlreadyOwnedByYou` error when attempting to create a\nbucket that the user already owned, rather than a\n`BucketAlreadyExists` error.\n\nUnfortunately exactly what has been implemented by s3 clones is a\nlittle inconsistent, some return `AlreadyOwnedByYou`, some return\n`BucketAlreadyExists` and some return no error at all.\n\nThis is important to rclone because it ensures the bucket exists by\ncreating it on quite a lot of operations (unless\n`--s3-no-check-bucket` is used).\n\nIf rclone knows the provider can return `AlreadyOwnedByYou` or returns\nno error then it can report `BucketAlreadyExists` errors when the user\nattempts to create a bucket not owned by them. Otherwise rclone\nignores the `BucketAlreadyExists` error which can lead to confusion.\n\nThis should be automatically set correctly for all providers rclone\nknows about - please make a bug report if not.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		use_multipart_uploads: {
			Name: "use_multipart_uploads",
			FieldName: "",
			Help: "Set if rclone should use multipart uploads.\n\nYou can change this if you want to disable the use of multipart uploads.\nThis shouldn't be necessary in normal operation.\n\nThis should be automatically set correctly for all providers rclone\nknows about - please make a bug report if not.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		sdk_log_mode: {
			Name: "sdk_log_mode",
			FieldName: "",
			Help: "Set to debug the SDK\n\nThis can be set to a comma separated list of the following functions:\n\n- `Signing`\n- `Retries`\n- `Request`\n- `RequestWithBody`\n- `Response`\n- `ResponseWithBody`\n- `DeprecatedUsage`\n- `RequestEventMessage`\n- `ResponseEventMessage`\n\nUse `Off` to disable and `All` to set all log levels. You will need to\nuse `-vv` to see the debug level logs.\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Off",
			ValueStr: "Off",
			Type: "Bits"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var swift = {
	name: "swift",
	description: "OpenStack Swift (Rackspace Cloud Files, Blomp Cloud Storage, Memset Memstore, OVH)",
	options: {
		env_auth: {
			Name: "env_auth",
			FieldName: "",
			Help: "Get swift credentials from environment variables in standard OpenStack form.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "false",
					Help: "Enter swift credentials in the next step."
				},
				{
					Value: "true",
					Help: "Get swift credentials from environment vars.\nLeave other fields blank if using this."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "User name to log in (OS_USERNAME).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		key: {
			Name: "key",
			FieldName: "",
			Help: "API key or password (OS_PASSWORD).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth: {
			Name: "auth",
			FieldName: "",
			Help: "Authentication URL for server (OS_AUTH_URL).",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "https://auth.api.rackspacecloud.com/v1.0",
					Help: "Rackspace US"
				},
				{
					Value: "https://lon.auth.api.rackspacecloud.com/v1.0",
					Help: "Rackspace UK"
				},
				{
					Value: "https://identity.api.rackspacecloud.com/v2.0",
					Help: "Rackspace v2"
				},
				{
					Value: "https://auth.storage.memset.com/v1.0",
					Help: "Memset Memstore UK"
				},
				{
					Value: "https://auth.storage.memset.com/v2.0",
					Help: "Memset Memstore UK v2"
				},
				{
					Value: "https://auth.cloud.ovh.net/v3",
					Help: "OVH"
				},
				{
					Value: "https://authenticate.ain.net",
					Help: "Blomp Cloud Storage"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user_id: {
			Name: "user_id",
			FieldName: "",
			Help: "User ID to log in - optional - most swift systems use user and leave this blank (v3 auth) (OS_USER_ID).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		domain: {
			Name: "domain",
			FieldName: "",
			Help: "User domain - optional (v3 auth) (OS_USER_DOMAIN_NAME)",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		tenant: {
			Name: "tenant",
			FieldName: "",
			Help: "Tenant name - optional for v1 auth, this or tenant_id required otherwise (OS_TENANT_NAME or OS_PROJECT_NAME).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		tenant_id: {
			Name: "tenant_id",
			FieldName: "",
			Help: "Tenant ID - optional for v1 auth, this or tenant required otherwise (OS_TENANT_ID).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		tenant_domain: {
			Name: "tenant_domain",
			FieldName: "",
			Help: "Tenant domain - optional (v3 auth) (OS_PROJECT_DOMAIN_NAME).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		region: {
			Name: "region",
			FieldName: "",
			Help: "Region name - optional (OS_REGION_NAME).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		storage_url: {
			Name: "storage_url",
			FieldName: "",
			Help: "Storage URL - optional (OS_STORAGE_URL).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_token: {
			Name: "auth_token",
			FieldName: "",
			Help: "Auth Token from alternate authentication - optional (OS_AUTH_TOKEN).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		application_credential_id: {
			Name: "application_credential_id",
			FieldName: "",
			Help: "Application Credential ID (OS_APPLICATION_CREDENTIAL_ID).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		application_credential_name: {
			Name: "application_credential_name",
			FieldName: "",
			Help: "Application Credential Name (OS_APPLICATION_CREDENTIAL_NAME).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		application_credential_secret: {
			Name: "application_credential_secret",
			FieldName: "",
			Help: "Application Credential Secret (OS_APPLICATION_CREDENTIAL_SECRET).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_version: {
			Name: "auth_version",
			FieldName: "",
			Help: "AuthVersion - optional - set to (1,2,3) if your auth URL has no version (ST_AUTH_VERSION).",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		endpoint_type: {
			Name: "endpoint_type",
			FieldName: "",
			Help: "Endpoint type to choose from the service catalogue (OS_ENDPOINT_TYPE).",
			Default: "public",
			Value: null,
			Examples: [
				{
					Value: "public",
					Help: "Public (default, choose this if not sure)"
				},
				{
					Value: "internal",
					Help: "Internal (use internal service net)"
				},
				{
					Value: "admin",
					Help: "Admin"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "public",
			ValueStr: "public",
			Type: "string"
		},
		storage_policy: {
			Name: "storage_policy",
			FieldName: "",
			Help: "The storage policy to use when creating a new container.\n\nThis applies the specified storage policy when creating a new\ncontainer. The policy cannot be changed afterwards. The allowed\nconfiguration values and their meaning depend on your Swift storage\nprovider.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "Default"
				},
				{
					Value: "pcs",
					Help: "OVH Public Cloud Storage"
				},
				{
					Value: "pca",
					Help: "OVH Public Cloud Archive"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		leave_parts_on_error: {
			Name: "leave_parts_on_error",
			FieldName: "",
			Help: "If true avoid calling abort upload on a failure.\n\nIt should be set to true for resuming uploads across different sessions.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		fetch_until_empty_page: {
			Name: "fetch_until_empty_page",
			FieldName: "",
			Help: "When paginating, always fetch unless we received an empty page.\n\nConsider using this option if rclone listings show fewer objects\nthan expected, or if repeated syncs copy unchanged objects.\n\nIt is safe to enable this, but rclone may make more API calls than\nnecessary.\n\nThis is one of a pair of workarounds to handle implementations\nof the Swift API that do not implement pagination as expected.  See\nalso \"partial_page_fetch_threshold\".",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		partial_page_fetch_threshold: {
			Name: "partial_page_fetch_threshold",
			FieldName: "",
			Help: "When paginating, fetch if the current page is within this percentage of the limit.\n\nConsider using this option if rclone listings show fewer objects\nthan expected, or if repeated syncs copy unchanged objects.\n\nIt is safe to enable this, but rclone may make more API calls than\nnecessary.\n\nThis is one of a pair of workarounds to handle implementations\nof the Swift API that do not implement pagination as expected.  See\nalso \"fetch_until_empty_page\".",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Above this size files will be chunked.\n\nAbove this size files will be chunked into a a `_segments` container\nor a `.file-segments` directory. (See the `use_segments_container` option\nfor more info). Default for this is 5 GiB which is its maximum value, which\nmeans only files above this size will be chunked.\n\nRclone uploads chunked files as dynamic large objects (DLO).\n",
			Default: 5368709120,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "5Gi",
			ValueStr: "5Gi",
			Type: "SizeSuffix"
		},
		no_chunk: {
			Name: "no_chunk",
			FieldName: "",
			Help: "Don't chunk files during streaming upload.\n\nWhen doing streaming uploads (e.g. using `rcat` or `mount` with\n`--vfs-cache-mode off`) setting this flag will cause the swift backend\nto not upload chunked files.\n\nThis will limit the maximum streamed upload size to 5 GiB. This is\nuseful because non chunked files are easier to deal with and have an\nMD5SUM.\n\nRclone will still chunk files bigger than `chunk_size` when doing\nnormal copy operations.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_large_objects: {
			Name: "no_large_objects",
			FieldName: "",
			Help: "Disable support for static and dynamic large objects\n\nSwift cannot transparently store files bigger than 5 GiB. There are\ntwo schemes for chunking large files, static large objects (SLO) or\ndynamic large objects (DLO), and the API does not allow rclone to\ndetermine whether a file is a static or dynamic large object without\ndoing a HEAD on the object. Since these need to be treated\ndifferently, this means rclone has to issue HEAD requests for objects\nfor example when reading checksums.\n\nWhen `no_large_objects` is set, rclone will assume that there are no\nstatic or dynamic large objects stored. This means it can stop doing\nthe extra HEAD calls which in turn increases performance greatly\nespecially when doing a swift to swift transfer with `--checksum` set.\n\nSetting this option implies `no_chunk` and also that no files will be\nuploaded in chunks, so files bigger than 5 GiB will just fail on\nupload.\n\nIf you set this option and there **are** static or dynamic large objects,\nthen this will give incorrect hashes for them. Downloads will succeed,\nbut other operations such as Remove and Copy will fail.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_segments_container: {
			Name: "use_segments_container",
			FieldName: "",
			Help: "Choose destination for large object segments\n\nSwift cannot transparently store files bigger than 5 GiB and rclone\nwill chunk files larger than `chunk_size` (default 5 GiB) in order to\nupload them.\n\nIf this value is `true` the chunks will be stored in an additional\ncontainer named the same as the destination container but with\n`_segments` appended. This means that there won't be any duplicated\ndata in the original container but having another container may not be\nacceptable.\n\nIf this value is `false` the chunks will be stored in a\n`.file-segments` directory in the root of the container. This\ndirectory will be omitted when listing the container. Some\nproviders (eg Blomp) require this mode as creating additional\ncontainers isn't allowed. If it is desired to see the `.file-segments`\ndirectory in the root then this flag must be set to `true`.\n\nIf this value is `unset` (the default), then rclone will choose the value\nto use. It will be `false` unless rclone detects any `auth_url`s that\nit knows need it to be `true`. In this case you'll see a message in\nthe DEBUG log.\n",
			Default: {
				Value: false,
				Valid: false
			},
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "unset",
			ValueStr: "unset",
			Type: "Tristate"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 16777218,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,InvalidUtf8",
			ValueStr: "Slash,InvalidUtf8",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var union = {
	name: "union",
	description: "Union merges the contents of several upstream fs",
	options: {
		upstreams: {
			Name: "upstreams",
			FieldName: "",
			Help: "List of space separated upstreams.\n\nCan be 'upstreama:test/dir upstreamb:', '\"upstreama:test/space:ro dir\" upstreamb:', etc.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		action_policy: {
			Name: "action_policy",
			FieldName: "",
			Help: "Policy to choose upstream on ACTION category.",
			Default: "epall",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "epall",
			ValueStr: "epall",
			Type: "string"
		},
		create_policy: {
			Name: "create_policy",
			FieldName: "",
			Help: "Policy to choose upstream on CREATE category.",
			Default: "epmfs",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "epmfs",
			ValueStr: "epmfs",
			Type: "string"
		},
		search_policy: {
			Name: "search_policy",
			FieldName: "",
			Help: "Policy to choose upstream on SEARCH category.",
			Default: "ff",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "ff",
			ValueStr: "ff",
			Type: "string"
		},
		cache_time: {
			Name: "cache_time",
			FieldName: "",
			Help: "Cache time of usage and free space (in seconds).\n\nThis option is only useful when a path preserving policy is used.",
			Default: 120,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "120",
			ValueStr: "120",
			Type: "int"
		},
		min_free_space: {
			Name: "min_free_space",
			FieldName: "",
			Help: "Minimum viable free space for lfs/eplfs policies.\n\nIf a remote has less than this much free space then it won't be\nconsidered for use in lfs or eplfs policies.",
			Default: 1073741824,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1Gi",
			ValueStr: "1Gi",
			Type: "SizeSuffix"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var compress = {
	name: "compress",
	description: "Compress a remote",
	options: {
		remote: {
			Name: "remote",
			FieldName: "",
			Help: "Remote to compress.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		mode: {
			Name: "mode",
			FieldName: "",
			Help: "Compression mode.",
			Default: "gzip",
			Value: null,
			Examples: [
				{
					Value: "gzip",
					Help: "Standard gzip compression with fastest parameters."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "gzip",
			ValueStr: "gzip",
			Type: "string"
		},
		level: {
			Name: "level",
			FieldName: "",
			Help: "GZIP compression level (-2 to 9).\n\nGenerally -1 (default, equivalent to 5) is recommended.\nLevels 1 to 9 increase compression at the cost of speed. Going past 6 \ngenerally offers very little return.\n\nLevel -2 uses Huffman encoding only. Only use if you know what you\nare doing.\nLevel 0 turns off compression.",
			Default: -1,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "-1",
			ValueStr: "-1",
			Type: "int"
		},
		ram_cache_limit: {
			Name: "ram_cache_limit",
			FieldName: "",
			Help: "Some remotes don't allow the upload of files with unknown size.\nIn this case the compressed file will need to be cached to determine\nit's size.\n\nFiles smaller than this limit will be cached in RAM, files larger than \nthis limit will be cached on disk.",
			Default: 20971520,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "20Mi",
			ValueStr: "20Mi",
			Type: "SizeSuffix"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var dropbox = {
	name: "dropbox",
	description: "Dropbox",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Upload chunk size (< 150Mi).\n\nAny files larger than this will be uploaded in chunks of this size.\n\nNote that chunks are buffered in memory (one at a time) so rclone can\ndeal with retries.  Setting this larger will increase the speed\nslightly (at most 10% for 128 MiB in tests) at the cost of using more\nmemory.  It can be set smaller if you are tight on memory.",
			Default: 50331648,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "48Mi",
			ValueStr: "48Mi",
			Type: "SizeSuffix"
		},
		impersonate: {
			Name: "impersonate",
			FieldName: "",
			Help: "Impersonate this user when using a business account.\n\nNote that if you want to use impersonate, you should make sure this\nflag is set when running \"rclone config\" as this will cause rclone to\nrequest the \"members.read\" scope which it won't normally. This is\nneeded to lookup a members email address into the internal ID that\ndropbox uses in the API.\n\nUsing the \"members.read\" scope will require a Dropbox Team Admin\nto approve during the OAuth flow.\n\nYou will have to use your own App (setting your own client_id and\nclient_secret) to use this option as currently rclone's default set of\npermissions doesn't include \"members.read\". This can be added once\nv1.55 or later is in use everywhere.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		shared_files: {
			Name: "shared_files",
			FieldName: "",
			Help: "Instructs rclone to work on individual shared files.\n\nIn this mode rclone's features are extremely limited - only list (ls, lsl, etc.) \noperations and read operations (e.g. downloading) are supported in this mode.\nAll other operations will be disabled.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		shared_folders: {
			Name: "shared_folders",
			FieldName: "",
			Help: "Instructs rclone to work on shared folders.\n\t\t\t\nWhen this flag is used with no path only the List operation is supported and \nall available shared folders will be listed. If you specify a path the first part \nwill be interpreted as the name of shared folder. Rclone will then try to mount this \nshared to the root namespace. On success shared folder rclone proceeds normally. \nThe shared folder is now pretty much a normal folder and all normal operations \nare supported. \n\nNote that we don't unmount the shared folder afterwards so the \n--dropbox-shared-folders can be omitted after the first use of a particular \nshared folder.\n\nSee also --dropbox-root-namespace for an alternative way to work with shared\nfolders.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		pacer_min_sleep: {
			Name: "pacer_min_sleep",
			FieldName: "",
			Help: "Minimum time to sleep between API calls.",
			Default: 10000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10ms",
			ValueStr: "10ms",
			Type: "Duration"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 52469762,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,RightSpace,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,RightSpace,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		root_namespace: {
			Name: "root_namespace",
			FieldName: "",
			Help: "Specify a different Dropbox namespace ID to use as the root for all paths.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		batch_mode: {
			Name: "batch_mode",
			FieldName: "",
			Help: "Upload file batching sync|async|off.\n\nThis sets the batch mode used by rclone.\n\nFor full info see [the main docs](https://rclone.org/dropbox/#batch-mode)\n\nThis has 3 possible values\n\n- off - no batching\n- sync - batch uploads and check completion (default)\n- async - batch upload and don't check completion\n\nRclone will close any outstanding batches when it exits which may make\na delay on quit.\n",
			Default: "sync",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "sync",
			ValueStr: "sync",
			Type: "string"
		},
		batch_size: {
			Name: "batch_size",
			FieldName: "",
			Help: "Max number of files in upload batch.\n\nThis sets the batch size of files to upload. It has to be less than 1000.\n\nBy default this is 0 which means rclone will calculate the batch size\ndepending on the setting of batch_mode.\n\n- batch_mode: async - default batch_size is 100\n- batch_mode: sync - default batch_size is the same as --transfers\n- batch_mode: off - not in use\n\nRclone will close any outstanding batches when it exits which may make\na delay on quit.\n\nSetting this is a great idea if you are uploading lots of small files\nas it will make them a lot quicker. You can use --transfers 32 to\nmaximise throughput.\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		batch_timeout: {
			Name: "batch_timeout",
			FieldName: "",
			Help: "Max time to allow an idle upload batch before uploading.\n\nIf an upload batch is idle for more than this long then it will be\nuploaded.\n\nThe default for this is 0 which means rclone will choose a sensible\ndefault based on the batch_mode in use.\n\n- batch_mode: async - default batch_timeout is 10s\n- batch_mode: sync - default batch_timeout is 500ms\n- batch_mode: off - not in use\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0s",
			ValueStr: "0s",
			Type: "Duration"
		},
		batch_commit_timeout: {
			Name: "batch_commit_timeout",
			FieldName: "",
			Help: "Max time to wait for a batch to finish committing",
			Default: 600000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10m0s",
			ValueStr: "10m0s",
			Type: "Duration"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var gphotos = {
	name: "gphotos",
	description: "Google Photos",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		read_only: {
			Name: "read_only",
			FieldName: "",
			Help: "Set to make the Google Photos backend read only.\n\nIf you choose read only then rclone will only request read only access\nto your photos, otherwise rclone will request full access.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		read_size: {
			Name: "read_size",
			FieldName: "",
			Help: "Set to read the size of media items.\n\nNormally rclone does not read the size of media items since this takes\nanother transaction.  This isn't necessary for syncing.  However\nrclone mount needs to know the size of files in advance of reading\nthem, so setting this flag when using rclone mount is recommended if\nyou want to read the media.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		start_year: {
			Name: "start_year",
			FieldName: "",
			Help: "Year limits the photos to be downloaded to those which are uploaded after the given year.",
			Default: 2000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "2000",
			ValueStr: "2000",
			Type: "int"
		},
		include_archived: {
			Name: "include_archived",
			FieldName: "",
			Help: "Also view and download archived media.\n\nBy default, rclone does not request archived media. Thus, when syncing,\narchived media is not visible in directory listings or transferred.\n\nNote that media in albums is always visible and synced, no matter\ntheir archive status.\n\nWith this flag, archived media are always visible in directory\nlistings and transferred.\n\nWithout this flag, archived media will not be visible in directory\nlistings and won't be transferred.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50348034,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,CrLf,InvalidUtf8,Dot",
			ValueStr: "Slash,CrLf,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		batch_mode: {
			Name: "batch_mode",
			FieldName: "",
			Help: "Upload file batching sync|async|off.\n\nThis sets the batch mode used by rclone.\n\nThis has 3 possible values\n\n- off - no batching\n- sync - batch uploads and check completion (default)\n- async - batch upload and don't check completion\n\nRclone will close any outstanding batches when it exits which may make\na delay on quit.\n",
			Default: "sync",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "sync",
			ValueStr: "sync",
			Type: "string"
		},
		batch_size: {
			Name: "batch_size",
			FieldName: "",
			Help: "Max number of files in upload batch.\n\nThis sets the batch size of files to upload. It has to be less than 50.\n\nBy default this is 0 which means rclone will calculate the batch size\ndepending on the setting of batch_mode.\n\n- batch_mode: async - default batch_size is 50\n- batch_mode: sync - default batch_size is the same as --transfers\n- batch_mode: off - not in use\n\nRclone will close any outstanding batches when it exits which may make\na delay on quit.\n\nSetting this is a great idea if you are uploading lots of small files\nas it will make them a lot quicker. You can use --transfers 32 to\nmaximise throughput.\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "int"
		},
		batch_timeout: {
			Name: "batch_timeout",
			FieldName: "",
			Help: "Max time to allow an idle upload batch before uploading.\n\nIf an upload batch is idle for more than this long then it will be\nuploaded.\n\nThe default for this is 0 which means rclone will choose a sensible\ndefault based on the batch_mode in use.\n\n- batch_mode: async - default batch_timeout is 10s\n- batch_mode: sync - default batch_timeout is 1s\n- batch_mode: off - not in use\n",
			Default: 0,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "0s",
			ValueStr: "0s",
			Type: "Duration"
		},
		batch_commit_timeout: {
			Name: "batch_commit_timeout",
			FieldName: "",
			Help: "Max time to wait for a batch to finish committing",
			Default: 600000000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10m0s",
			ValueStr: "10m0s",
			Type: "Duration"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var hidrive = {
	name: "hidrive",
	description: "HiDrive",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		scope_access: {
			Name: "scope_access",
			FieldName: "",
			Help: "Access permissions that rclone should use when requesting access from HiDrive.",
			Default: "rw",
			Value: null,
			Examples: [
				{
					Value: "rw",
					Help: "Read and write access to resources."
				},
				{
					Value: "ro",
					Help: "Read-only access to resources."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "rw",
			ValueStr: "rw",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		scope_role: {
			Name: "scope_role",
			FieldName: "",
			Help: "User-level that rclone should use when requesting access from HiDrive.",
			Default: "user",
			Value: null,
			Examples: [
				{
					Value: "user",
					Help: "User-level access to management permissions.\nThis will be sufficient in most cases."
				},
				{
					Value: "admin",
					Help: "Extensive access to management permissions."
				},
				{
					Value: "owner",
					Help: "Full access to management permissions."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "user",
			ValueStr: "user",
			Type: "string"
		},
		root_prefix: {
			Name: "root_prefix",
			FieldName: "",
			Help: "The root/parent folder for all paths.\n\nFill in to use the specified folder as the parent for all paths given to the remote.\nThis way rclone can use any folder as its starting point.",
			Default: "/",
			Value: null,
			Examples: [
				{
					Value: "/",
					Help: "The topmost directory accessible by rclone.\nThis will be equivalent with \"root\" if rclone uses a regular HiDrive user account."
				},
				{
					Value: "root",
					Help: "The topmost directory of the HiDrive user account"
				},
				{
					Value: "",
					Help: "This specifies that there is no root-prefix for your paths.\nWhen using this you will always need to specify paths to this remote with a valid parent e.g. \"remote:/path/to/dir\" or \"remote:root/path/to/dir\"."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "/",
			ValueStr: "/",
			Type: "string"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for the service.\n\nThis is the URL that API-calls will be made to.",
			Default: "https://api.hidrive.strato.com/2.1",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "https://api.hidrive.strato.com/2.1",
			ValueStr: "https://api.hidrive.strato.com/2.1",
			Type: "string"
		},
		disable_fetching_member_count: {
			Name: "disable_fetching_member_count",
			FieldName: "",
			Help: "Do not fetch number of objects in directories unless it is absolutely necessary.\n\nRequests may be faster if the number of objects in subdirectories is not fetched.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Chunksize for chunked uploads.\n\nAny files larger than the configured cutoff (or files of unknown size) will be uploaded in chunks of this size.\n\nThe upper limit for this is 2147483647 bytes (about 2.000Gi).\nThat is the maximum amount of bytes a single upload-operation will support.\nSetting this above the upper limit or to a negative value will cause uploads to fail.\n\nSetting this to larger values may increase the upload speed at the cost of using more memory.\nIt can be set to smaller values smaller to save on memory.",
			Default: 50331648,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "48Mi",
			ValueStr: "48Mi",
			Type: "SizeSuffix"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff/Threshold for chunked uploads.\n\nAny files larger than this will be uploaded in chunks of the configured chunksize.\n\nThe upper limit for this is 2147483647 bytes (about 2.000Gi).\nThat is the maximum amount of bytes a single upload-operation will support.\nSetting this above the upper limit will cause uploads to fail.",
			Default: 100663296,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "96Mi",
			ValueStr: "96Mi",
			Type: "SizeSuffix"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for chunked uploads.\n\nThis is the upper limit for how many transfers for the same file are running concurrently.\nSetting this above to a value smaller than 1 will cause uploads to deadlock.\n\nIf you are uploading small numbers of large files over high-speed links\nand these uploads do not fully utilize your bandwidth, then increasing\nthis may help to speed up the transfers.",
			Default: 4,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "4",
			ValueStr: "4",
			Type: "int"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 33554434,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Dot",
			ValueStr: "Slash,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var jottacloud = {
	name: "jottacloud",
	description: "Jottacloud",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		md5_memory_limit: {
			Name: "md5_memory_limit",
			FieldName: "",
			Help: "Files bigger than this will be cached on disk to calculate the MD5 if required.",
			Default: 10485760,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Mi",
			ValueStr: "10Mi",
			Type: "SizeSuffix"
		},
		trashed_only: {
			Name: "trashed_only",
			FieldName: "",
			Help: "Only show files that are in the trash.\n\nThis will show trashed files in their original directory structure.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		hard_delete: {
			Name: "hard_delete",
			FieldName: "",
			Help: "Delete files permanently rather than putting them into the trash.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		upload_resume_limit: {
			Name: "upload_resume_limit",
			FieldName: "",
			Help: "Files bigger than this can be resumed if the upload fail's.",
			Default: 10485760,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Mi",
			ValueStr: "10Mi",
			Type: "SizeSuffix"
		},
		no_versions: {
			Name: "no_versions",
			FieldName: "",
			Help: "Avoid server side versioning by deleting files and recreating files instead of overwriting them.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50431886,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var mailru = {
	name: "mailru",
	description: "Mail.ru Cloud",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user: {
			Name: "user",
			FieldName: "",
			Help: "User name (usually email).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "Password.\n\nThis must be an app password - rclone will not work with your normal\npassword. See the Configuration section in the docs for how to make an\napp password.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		speedup_enable: {
			Name: "speedup_enable",
			FieldName: "",
			Help: "Skip full upload if there is another file with same data hash.\n\nThis feature is called \"speedup\" or \"put by hash\". It is especially efficient\nin case of generally available files like popular books, video or audio clips,\nbecause files are searched by hash in all accounts of all mailru users.\nIt is meaningless and ineffective if source file is unique or encrypted.\nPlease note that rclone may need local memory and disk space to calculate\ncontent hash in advance and decide whether full upload is required.\nAlso, if rclone does not know file size in advance (e.g. in case of\nstreaming or partial uploads), it will not even try this optimization.",
			Default: true,
			Value: null,
			Examples: [
				{
					Value: "true",
					Help: "Enable"
				},
				{
					Value: "false",
					Help: "Disable"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		speedup_file_patterns: {
			Name: "speedup_file_patterns",
			FieldName: "",
			Help: "Comma separated list of file name patterns eligible for speedup (put by hash).\n\nPatterns are case insensitive and can contain '*' or '?' meta characters.",
			Default: "*.mkv,*.avi,*.mp4,*.mp3,*.zip,*.gz,*.rar,*.pdf",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "Empty list completely disables speedup (put by hash)."
				},
				{
					Value: "*",
					Help: "All files will be attempted for speedup."
				},
				{
					Value: "*.mkv,*.avi,*.mp4,*.mp3",
					Help: "Only common audio/video files will be tried for put by hash."
				},
				{
					Value: "*.zip,*.gz,*.rar,*.pdf",
					Help: "Only common archives or PDF books will be tried for speedup."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "*.mkv,*.avi,*.mp4,*.mp3,*.zip,*.gz,*.rar,*.pdf",
			ValueStr: "*.mkv,*.avi,*.mp4,*.mp3,*.zip,*.gz,*.rar,*.pdf",
			Type: "string"
		},
		speedup_max_disk: {
			Name: "speedup_max_disk",
			FieldName: "",
			Help: "This option allows you to disable speedup (put by hash) for large files.\n\nReason is that preliminary hashing can exhaust your RAM or disk space.",
			Default: 3221225472,
			Value: null,
			Examples: [
				{
					Value: "0",
					Help: "Completely disable speedup (put by hash)."
				},
				{
					Value: "1G",
					Help: "Files larger than 1Gb will be uploaded directly."
				},
				{
					Value: "3G",
					Help: "Choose this option if you have less than 3Gb free on local disk."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "3Gi",
			ValueStr: "3Gi",
			Type: "SizeSuffix"
		},
		speedup_max_memory: {
			Name: "speedup_max_memory",
			FieldName: "",
			Help: "Files larger than the size given below will always be hashed on disk.",
			Default: 33554432,
			Value: null,
			Examples: [
				{
					Value: "0",
					Help: "Preliminary hashing will always be done in a temporary disk location."
				},
				{
					Value: "32M",
					Help: "Do not dedicate more than 32Mb RAM for preliminary hashing."
				},
				{
					Value: "256M",
					Help: "You have at most 256Mb RAM free for hash calculations."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "32Mi",
			ValueStr: "32Mi",
			Type: "SizeSuffix"
		},
		check_hash: {
			Name: "check_hash",
			FieldName: "",
			Help: "What should copy do if file checksum is mismatched or invalid.",
			Default: true,
			Value: null,
			Examples: [
				{
					Value: "true",
					Help: "Fail with error."
				},
				{
					Value: "false",
					Help: "Ignore and continue."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50440078,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var onedrive = {
	name: "onedrive",
	description: "Microsoft OneDrive",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		region: {
			Name: "region",
			FieldName: "",
			Help: "Choose national cloud region for OneDrive.",
			Default: "global",
			Value: null,
			Examples: [
				{
					Value: "global",
					Help: "Microsoft Cloud Global"
				},
				{
					Value: "us",
					Help: "Microsoft Cloud for US Government"
				},
				{
					Value: "de",
					Help: "Microsoft Cloud Germany"
				},
				{
					Value: "cn",
					Help: "Azure and Office 365 operated by Vnet Group in China"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "global",
			ValueStr: "global",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Chunk size to upload files with - must be multiple of 320k (327,680 bytes).\n\nAbove this size files will be chunked - must be multiple of 320k (327,680 bytes) and\nshould not exceed 250M (262,144,000 bytes) else you may encounter \\\"Microsoft.SharePoint.Client.InvalidClientQueryException: The request message is too big.\\\"\nNote that the chunks will be buffered into memory.",
			Default: 10485760,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Mi",
			ValueStr: "10Mi",
			Type: "SizeSuffix"
		},
		drive_id: {
			Name: "drive_id",
			FieldName: "",
			Help: "The ID of the drive to use.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		drive_type: {
			Name: "drive_type",
			FieldName: "",
			Help: "The type of the drive (personal | business | documentLibrary).",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "ID of the root folder.\n\nThis isn't normally needed, but in special circumstances you might\nknow the folder ID that you wish to access but not be able to get\nthere through a path traversal.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		access_scopes: {
			Name: "access_scopes",
			FieldName: "",
			Help: "Set scopes to be requested by rclone.\n\nChoose or manually enter a custom space separated list with all scopes, that rclone should request.\n",
			Default: [
				"Files.Read",
				"Files.ReadWrite",
				"Files.Read.All",
				"Files.ReadWrite.All",
				"Sites.Read.All",
				"offline_access"
			],
			Value: null,
			Examples: [
				{
					Value: "Files.Read Files.ReadWrite Files.Read.All Files.ReadWrite.All Sites.Read.All offline_access",
					Help: "Read and write access to all resources"
				},
				{
					Value: "Files.Read Files.Read.All Sites.Read.All offline_access",
					Help: "Read only access to all resources"
				},
				{
					Value: "Files.Read Files.ReadWrite Files.Read.All Files.ReadWrite.All offline_access",
					Help: "Read and write access to all resources, without the ability to browse SharePoint sites. \nSame as if disable_site_permission was set to true"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Files.Read Files.ReadWrite Files.Read.All Files.ReadWrite.All Sites.Read.All offline_access",
			ValueStr: "Files.Read Files.ReadWrite Files.Read.All Files.ReadWrite.All Sites.Read.All offline_access",
			Type: "SpaceSepList"
		},
		expose_onenote_files: {
			Name: "expose_onenote_files",
			FieldName: "",
			Help: "Set to make OneNote files show up in directory listings.\n\nBy default, rclone will hide OneNote files in directory listings because\noperations like \"Open\" and \"Update\" won't work on them.  But this\nbehaviour may also prevent you from deleting them.  If you want to\ndelete OneNote files or otherwise want them to show up in directory\nlisting, set this option.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		server_side_across_configs: {
			Name: "server_side_across_configs",
			FieldName: "",
			Help: "Deprecated: use --server-side-across-configs instead.\n\nAllow server-side operations (e.g. copy) to work across different onedrive configs.\n\nThis will work if you are copying between two OneDrive *Personal* drives AND the files to\ncopy are already shared between them. Additionally, it should also function for a user who\nhas access permissions both between Onedrive for *business* and *SharePoint* under the *same\ntenant*, and between *SharePoint* and another *SharePoint* under the *same tenant*. In other\ncases, rclone will fall back to normal copy (which will be slightly slower).",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		list_chunk: {
			Name: "list_chunk",
			FieldName: "",
			Help: "Size of listing chunk.",
			Default: 1000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1000",
			ValueStr: "1000",
			Type: "int"
		},
		no_versions: {
			Name: "no_versions",
			FieldName: "",
			Help: "Remove all versions on modifying operations.\n\nOnedrive for business creates versions when rclone uploads new files\noverwriting an existing one and when it sets the modification time.\n\nThese versions take up space out of the quota.\n\nThis flag checks for versions after file upload and setting\nmodification time and removes all but the last version.\n\n**NB** Onedrive personal can't currently delete versions so don't use\nthis flag there.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		hard_delete: {
			Name: "hard_delete",
			FieldName: "",
			Help: "Permanently delete files on removal.\n\nNormally files will get sent to the recycle bin on deletion. Setting\nthis flag causes them to be permanently deleted. Use with care.\n\nOneDrive personal accounts do not support the permanentDelete API,\nit only applies to OneDrive for Business and SharePoint document libraries.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		link_scope: {
			Name: "link_scope",
			FieldName: "",
			Help: "Set the scope of the links created by the link command.",
			Default: "anonymous",
			Value: null,
			Examples: [
				{
					Value: "anonymous",
					Help: "Anyone with the link has access, without needing to sign in.\nThis may include people outside of your organization.\nAnonymous link support may be disabled by an administrator."
				},
				{
					Value: "organization",
					Help: "Anyone signed into your organization (tenant) can use the link to get access.\nOnly available in OneDrive for Business and SharePoint."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "anonymous",
			ValueStr: "anonymous",
			Type: "string"
		},
		link_type: {
			Name: "link_type",
			FieldName: "",
			Help: "Set the type of the links created by the link command.",
			Default: "view",
			Value: null,
			Examples: [
				{
					Value: "view",
					Help: "Creates a read-only link to the item."
				},
				{
					Value: "edit",
					Help: "Creates a read-write link to the item."
				},
				{
					Value: "embed",
					Help: "Creates an embeddable link to the item."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "view",
			ValueStr: "view",
			Type: "string"
		},
		link_password: {
			Name: "link_password",
			FieldName: "",
			Help: "Set the password for links created by the link command.\n\nAt the time of writing this only works with OneDrive personal paid accounts.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		hash_type: {
			Name: "hash_type",
			FieldName: "",
			Help: "Specify the hash in use for the backend.\n\nThis specifies the hash type in use. If set to \"auto\" it will use the\ndefault hash which is QuickXorHash.\n\nBefore rclone 1.62 an SHA1 hash was used by default for Onedrive\nPersonal. For 1.62 and later the default is to use a QuickXorHash for\nall onedrive types. If an SHA1 hash is desired then set this option\naccordingly.\n\nFrom July 2023 QuickXorHash will be the only available hash for\nboth OneDrive for Business and OneDrive Personal.\n\nThis can be set to \"none\" to not use any hashes.\n\nIf the hash requested does not exist on the object, it will be\nreturned as an empty string which is treated as a missing hash by\nrclone.\n",
			Default: "auto",
			Value: null,
			Examples: [
				{
					Value: "auto",
					Help: "Rclone chooses the best hash"
				},
				{
					Value: "quickxor",
					Help: "QuickXor"
				},
				{
					Value: "sha1",
					Help: "SHA1"
				},
				{
					Value: "sha256",
					Help: "SHA256"
				},
				{
					Value: "crc32",
					Help: "CRC32"
				},
				{
					Value: "none",
					Help: "None - don't use any hashes"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "auto",
			ValueStr: "auto",
			Type: "string"
		},
		av_override: {
			Name: "av_override",
			FieldName: "",
			Help: "Allows download of files the server thinks has a virus.\n\nThe onedrive/sharepoint server may check files uploaded with an Anti\nVirus checker. If it detects any potential viruses or malware it will\nblock download of the file.\n\nIn this case you will see a message like this\n\n    server reports this file is infected with a virus - use --onedrive-av-override to download anyway: Infected (name of virus): 403 Forbidden: \n\nIf you are 100% sure you want to download this file anyway then use\nthe --onedrive-av-override flag, or av_override = true in the config\nfile.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		delta: {
			Name: "delta",
			FieldName: "",
			Help: "If set rclone will use delta listing to implement recursive listings.\n\nIf this flag is set the onedrive backend will advertise `ListR`\nsupport for recursive listings.\n\nSetting this flag speeds up these things greatly:\n\n    rclone lsf -R onedrive:\n    rclone size onedrive:\n    rclone rc vfs/refresh recursive=true\n\n**However** the delta listing API **only** works at the root of the\ndrive. If you use it not at the root then it recurses from the root\nand discards all the data that is not under the directory you asked\nfor. So it will be correct but may not be very efficient.\n\nThis is why this flag is not set as the default.\n\nAs a rule of thumb if nearly all of your data is under rclone's root\ndirectory (the `root/directory` in `onedrive:root/directory`) then\nusing this flag will be be a big performance win. If your data is\nmostly not under the root then using this flag will be a big\nperformance loss.\n\nIt is recommended if you are mounting your onedrive at the root\n(or near the root when using crypt) and using rclone `rc vfs/refresh`.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		metadata_permissions: {
			Name: "metadata_permissions",
			FieldName: "",
			Help: "Control whether permissions should be read or written in metadata.\n\nReading permissions metadata from files can be done quickly, but it\nisn't always desirable to set the permissions from the metadata.\n",
			Default: 0,
			Value: null,
			Examples: [
				{
					Value: "off",
					Help: "Do not read or write the value"
				},
				{
					Value: "read",
					Help: "Read the value only"
				},
				{
					Value: "write",
					Help: "Write the value only"
				},
				{
					Value: "read,write",
					Help: "Read and Write the value."
				},
				{
					Value: "failok",
					Help: "If writing fails log errors only, don't fail the transfer"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "off",
			ValueStr: "off",
			Type: "Bits"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 57386894,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,LeftSpace,LeftTilde,RightSpace,RightPeriod,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,LeftSpace,LeftTilde,RightSpace,RightPeriod,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var pcloud = {
	name: "pcloud",
	description: "Pcloud",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50438146,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "Fill in for rclone to use a non root folder as its starting point.",
			Default: "d0",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "d0",
			ValueStr: "d0",
			Type: "string"
		},
		hostname: {
			Name: "hostname",
			FieldName: "",
			Help: "Hostname to connect to.\n\nThis is normally set when rclone initially does the oauth connection,\nhowever you will need to set it by hand if you are using remote config\nwith rclone authorize.\n",
			Default: "api.pcloud.com",
			Value: null,
			Examples: [
				{
					Value: "api.pcloud.com",
					Help: "Original/US region"
				},
				{
					Value: "eapi.pcloud.com",
					Help: "EU region"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "api.pcloud.com",
			ValueStr: "api.pcloud.com",
			Type: "string"
		},
		username: {
			Name: "username",
			FieldName: "",
			Help: "Your pcloud username.\n\t\t\t\nThis is only required when you want to use the cleanup command. Due to a bug\nin the pcloud API the required API does not support OAuth authentication so\nwe have to rely on user password authentication for it.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		password: {
			Name: "password",
			FieldName: "",
			Help: "Your pcloud password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: true,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var pikpak = {
	name: "pikpak",
	description: "PikPak",
	options: {
		user: {
			Name: "user",
			FieldName: "",
			Help: "Pikpak username.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		pass: {
			Name: "pass",
			FieldName: "",
			Help: "Pikpak password.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: true,
			IsPassword: true,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		device_id: {
			Name: "device_id",
			FieldName: "",
			Help: "Device ID used for authorization.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user_agent: {
			Name: "user_agent",
			FieldName: "",
			Help: "HTTP user agent for pikpak.\n\nDefaults to \"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0\" or \"--pikpak-user-agent\" provided on command line.",
			Default: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
			ValueStr: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "ID of the root folder.\nLeave blank normally.\n\nFill in for rclone to use a non root folder as its starting point.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		use_trash: {
			Name: "use_trash",
			FieldName: "",
			Help: "Send files to the trash instead of deleting permanently.\n\nDefaults to true, namely sending files to the trash.\nUse `--pikpak-use-trash=false` to delete files permanently instead.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		trashed_only: {
			Name: "trashed_only",
			FieldName: "",
			Help: "Only show files that are in the trash.\n\nThis will show trashed files in their original directory structure.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		hash_memory_limit: {
			Name: "hash_memory_limit",
			FieldName: "",
			Help: "Files bigger than this will be cached on disk to calculate hash if required.",
			Default: 10485760,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "10Mi",
			ValueStr: "10Mi",
			Type: "SizeSuffix"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Chunk size for multipart uploads.\n\t\nLarge files will be uploaded in chunks of this size.\n\nNote that this is stored in memory and there may be up to\n\"--transfers\" * \"--pikpak-upload-concurrency\" chunks stored at once\nin memory.\n\nIf you are transferring large files over high-speed links and you have\nenough memory, then increasing this will speed up the transfers.\n\nRclone will automatically increase the chunk size when uploading a\nlarge file of known size to stay below the 10,000 chunks limit.\n\nIncreasing the chunk size decreases the accuracy of the progress\nstatistics displayed with \"-P\" flag.",
			Default: 5242880,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "5Mi",
			ValueStr: "5Mi",
			Type: "SizeSuffix"
		},
		upload_concurrency: {
			Name: "upload_concurrency",
			FieldName: "",
			Help: "Concurrency for multipart uploads.\n\nThis is the number of chunks of the same file that are uploaded\nconcurrently for multipart uploads.\n\nNote that chunks are stored in memory and there may be up to\n\"--transfers\" * \"--pikpak-upload-concurrency\" chunks stored at once\nin memory.\n\nIf you are uploading small numbers of large files over high-speed links\nand these uploads do not fully utilize your bandwidth, then increasing\nthis may help to speed up the transfers.",
			Default: 5,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "5",
			ValueStr: "5",
			Type: "int"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 56829838,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,LeftSpace,RightSpace,RightPeriod,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,LeftSpace,RightSpace,RightPeriod,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var premiumizeme = {
	name: "premiumizeme",
	description: "premiumize.me",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50438154,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,DoubleQuote,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,DoubleQuote,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var putio = {
	name: "putio",
	description: "Put.io",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50438146,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var sharefile = {
	name: "sharefile",
	description: "Citrix Sharefile",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "ID of the root folder.\n\nLeave blank to access \"Personal Folders\".  You can use one of the\nstandard values here or any folder ID (long hex number ID).",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "Access the Personal Folders (default)."
				},
				{
					Value: "favorites",
					Help: "Access the Favorites folder."
				},
				{
					Value: "allshared",
					Help: "Access all the shared folders."
				},
				{
					Value: "connectors",
					Help: "Access all the individual connectors."
				},
				{
					Value: "top",
					Help: "Access the home, favorites, and shared folders as well as the connectors."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to multipart upload.",
			Default: 134217728,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "128Mi",
			ValueStr: "128Mi",
			Type: "SizeSuffix"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Upload chunk size.\n\nMust a power of 2 >= 256k.\n\nMaking this larger will improve performance, but note that each chunk\nis buffered in memory one per transfer.\n\nReducing this will reduce memory usage but decrease performance.",
			Default: 67108864,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "64Mi",
			ValueStr: "64Mi",
			Type: "SizeSuffix"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for API calls.\n\nThis is usually auto discovered as part of the oauth process, but can\nbe set manually to something like: https://XXX.sharefile.com\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 57091982,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,LeftSpace,LeftPeriod,RightSpace,RightPeriod,InvalidUtf8,Dot",
			ValueStr: "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,LeftSpace,LeftPeriod,RightSpace,RightPeriod,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var yandex = {
	name: "yandex",
	description: "Yandex Disk",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		hard_delete: {
			Name: "hard_delete",
			FieldName: "",
			Help: "Delete files permanently rather than putting them into the trash.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50429954,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,Del,Ctl,InvalidUtf8,Dot",
			ValueStr: "Slash,Del,Ctl,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var zoho = {
	name: "zoho",
	description: "Zoho",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		region: {
			Name: "region",
			FieldName: "",
			Help: "Zoho region to connect to.\n\nYou'll have to use the region your organization is registered in. If\nnot sure use the same top level domain as you connect to in your\nbrowser.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "com",
					Help: "United states / Global"
				},
				{
					Value: "eu",
					Help: "Europe"
				},
				{
					Value: "in",
					Help: "India"
				},
				{
					Value: "jp",
					Help: "Japan"
				},
				{
					Value: "com.cn",
					Help: "China"
				},
				{
					Value: "com.au",
					Help: "Australia"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 16875520,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Del,Ctl,InvalidUtf8",
			ValueStr: "Del,Ctl,InvalidUtf8",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var box = {
	name: "box",
	description: "Box",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		box_config_file: {
			Name: "box_config_file",
			FieldName: "",
			Help: "Box App config.json location\n\nLeave blank normally.\n\nLeading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		access_token: {
			Name: "access_token",
			FieldName: "",
			Help: "Box App Primary Access Token\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		box_sub_type: {
			Name: "box_sub_type",
			FieldName: "",
			Help: "",
			Default: "user",
			Value: null,
			Examples: [
				{
					Value: "user",
					Help: "Rclone should act on behalf of a user."
				},
				{
					Value: "enterprise",
					Help: "Rclone should act on behalf of a service account."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "user",
			ValueStr: "user",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "Fill in for rclone to use a non root folder as its starting point.",
			Default: "0",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "0",
			ValueStr: "0",
			Type: "string"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to multipart upload (>= 50 MiB).",
			Default: 52428800,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "50Mi",
			ValueStr: "50Mi",
			Type: "SizeSuffix"
		},
		commit_retries: {
			Name: "commit_retries",
			FieldName: "",
			Help: "Max number of times to try committing a multipart file.",
			Default: 100,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "100",
			ValueStr: "100",
			Type: "int"
		},
		list_chunk: {
			Name: "list_chunk",
			FieldName: "",
			Help: "Size of listing chunk 1-1000.",
			Default: 1000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1000",
			ValueStr: "1000",
			Type: "int"
		},
		owned_by: {
			Name: "owned_by",
			FieldName: "",
			Help: "Only show items owned by the login (email address) passed in.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		impersonate: {
			Name: "impersonate",
			FieldName: "",
			Help: "Impersonate this user ID when using a service account.\n\nSetting this flag allows rclone, when using a JWT service account, to\nact on behalf of another user by setting the as-user header.\n\nThe user ID is the Box identifier for a user. User IDs can found for\nany user via the GET /users endpoint, which is only available to\nadmins, or by calling the GET /users/me endpoint with an authenticated\nuser session.\n\nSee: https://developer.box.com/guides/authentication/jwt/as-user/\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 52535298,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,BackSlash,Del,Ctl,RightSpace,InvalidUtf8,Dot",
			ValueStr: "Slash,BackSlash,Del,Ctl,RightSpace,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var drive = {
	name: "drive",
	description: "Google Drive",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "Google Application Client Id\nSetting your own is recommended.\nSee https://rclone.org/drive/#making-your-own-client-id for how to create your own.\nIf you leave this blank, it will use an internal key which is low performance.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		scope: {
			Name: "scope",
			FieldName: "",
			Help: "Comma separated list of scopes that rclone should use when requesting access from drive.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "drive",
					Help: "Full access all files, excluding Application Data Folder."
				},
				{
					Value: "drive.readonly",
					Help: "Read-only access to file metadata and file contents."
				},
				{
					Value: "drive.file",
					Help: "Access to files created by rclone only.\nThese are visible in the drive website.\nFile authorization is revoked when the user deauthorizes the app."
				},
				{
					Value: "drive.appfolder",
					Help: "Allows read and write access to the Application Data folder.\nThis is not visible in the drive website."
				},
				{
					Value: "drive.metadata.readonly",
					Help: "Allows read-only access to file metadata but\ndoes not allow any access to read or download file content."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		service_account_file: {
			Name: "service_account_file",
			FieldName: "",
			Help: "Service Account Credentials JSON file path.\n\nLeave blank normally.\nNeeded only if you want use SA instead of interactive login.\n\nLeading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		root_folder_id: {
			Name: "root_folder_id",
			FieldName: "",
			Help: "ID of the root folder.\nLeave blank normally.\n\nFill in to access \"Computers\" folders (see docs), or for rclone to use\na non root folder as its starting point.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_owner_only: {
			Name: "auth_owner_only",
			FieldName: "",
			Help: "Only consider files owned by the authenticated user.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		use_trash: {
			Name: "use_trash",
			FieldName: "",
			Help: "Send files to the trash instead of deleting permanently.\n\nDefaults to true, namely sending files to the trash.\nUse `--drive-use-trash=false` to delete files permanently instead.",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		copy_shortcut_content: {
			Name: "copy_shortcut_content",
			FieldName: "",
			Help: "Server side copy contents of shortcuts instead of the shortcut.\n\nWhen doing server side copies, normally rclone will copy shortcuts as\nshortcuts.\n\nIf this flag is used then rclone will copy the contents of shortcuts\nrather than shortcuts themselves when doing server side copies.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		skip_gdocs: {
			Name: "skip_gdocs",
			FieldName: "",
			Help: "Skip google documents in all listings.\n\nIf given, gdocs practically become invisible to rclone.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		show_all_gdocs: {
			Name: "show_all_gdocs",
			FieldName: "",
			Help: "Show all Google Docs including non-exportable ones in listings.\n\nIf you try a server side copy on a Google Form without this flag, you\nwill get this error:\n\n    No export formats found for \"application/vnd.google-apps.form\"\n\nHowever adding this flag will allow the form to be server side copied.\n\nNote that rclone doesn't add extensions to the Google Docs file names\nin this mode.\n\nDo **not** use this flag when trying to download Google Docs - rclone\nwill fail to download them.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		skip_checksum_gphotos: {
			Name: "skip_checksum_gphotos",
			FieldName: "",
			Help: "Skip checksums on Google photos and videos only.\n\nUse this if you get checksum errors when transferring Google photos or\nvideos.\n\nSetting this flag will cause Google photos and videos to return a\nblank checksums.\n\nGoogle photos are identified by being in the \"photos\" space.\n\nCorrupted checksums are caused by Google modifying the image/video but\nnot updating the checksum.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		shared_with_me: {
			Name: "shared_with_me",
			FieldName: "",
			Help: "Only show files that are shared with me.\n\nInstructs rclone to operate on your \"Shared with me\" folder (where\nGoogle Drive lets you access the files and folders others have shared\nwith you).\n\nThis works both with the \"list\" (lsd, lsl, etc.) and the \"copy\"\ncommands (copy, sync, etc.), and with all other commands too.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		trashed_only: {
			Name: "trashed_only",
			FieldName: "",
			Help: "Only show files that are in the trash.\n\nThis will show trashed files in their original directory structure.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		starred_only: {
			Name: "starred_only",
			FieldName: "",
			Help: "Only show files that are starred.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		export_formats: {
			Name: "export_formats",
			FieldName: "",
			Help: "Comma separated list of preferred formats for downloading Google docs.",
			Default: "docx,xlsx,pptx,svg",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "docx,xlsx,pptx,svg",
			ValueStr: "docx,xlsx,pptx,svg",
			Type: "string"
		},
		import_formats: {
			Name: "import_formats",
			FieldName: "",
			Help: "Comma separated list of preferred formats for uploading Google docs.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		allow_import_name_change: {
			Name: "allow_import_name_change",
			FieldName: "",
			Help: "Allow the filetype to change when uploading Google docs.\n\nE.g. file.doc to file.docx. This will confuse sync and reupload every time.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		list_chunk: {
			Name: "list_chunk",
			FieldName: "",
			Help: "Size of listing chunk 100-1000, 0 to disable.",
			Default: 1000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "1000",
			ValueStr: "1000",
			Type: "int"
		},
		impersonate: {
			Name: "impersonate",
			FieldName: "",
			Help: "Impersonate this user when using a service account.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		upload_cutoff: {
			Name: "upload_cutoff",
			FieldName: "",
			Help: "Cutoff for switching to chunked upload.",
			Default: 8388608,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "8Mi",
			ValueStr: "8Mi",
			Type: "SizeSuffix"
		},
		chunk_size: {
			Name: "chunk_size",
			FieldName: "",
			Help: "Upload chunk size.\n\nMust a power of 2 >= 256k.\n\nMaking this larger will improve performance, but note that each chunk\nis buffered in memory one per transfer.\n\nReducing this will reduce memory usage but decrease performance.",
			Default: 8388608,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "8Mi",
			ValueStr: "8Mi",
			Type: "SizeSuffix"
		},
		acknowledge_abuse: {
			Name: "acknowledge_abuse",
			FieldName: "",
			Help: "Set to allow files which return cannotDownloadAbusiveFile to be downloaded.\n\nIf downloading a file returns the error \"This file has been identified\nas malware or spam and cannot be downloaded\" with the error code\n\"cannotDownloadAbusiveFile\" then supply this flag to rclone to\nindicate you acknowledge the risks of downloading the file and rclone\nwill download it anyway.\n\nNote that if you are using service account it will need Manager\npermission (not Content Manager) to for this flag to work. If the SA\ndoes not have the right permission, Google will just ignore the flag.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		keep_revision_forever: {
			Name: "keep_revision_forever",
			FieldName: "",
			Help: "Keep new head revision of each file forever.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		v2_download_min_size: {
			Name: "v2_download_min_size",
			FieldName: "",
			Help: "If Object's are greater, use drive v2 API to download.",
			Default: -1,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "off",
			ValueStr: "off",
			Type: "SizeSuffix"
		},
		pacer_min_sleep: {
			Name: "pacer_min_sleep",
			FieldName: "",
			Help: "Minimum time to sleep between API calls.",
			Default: 100000000,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "100ms",
			ValueStr: "100ms",
			Type: "Duration"
		},
		pacer_burst: {
			Name: "pacer_burst",
			FieldName: "",
			Help: "Number of API calls to allow without sleeping.",
			Default: 100,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "100",
			ValueStr: "100",
			Type: "int"
		},
		server_side_across_configs: {
			Name: "server_side_across_configs",
			FieldName: "",
			Help: "Deprecated: use --server-side-across-configs instead.\n\nAllow server-side operations (e.g. copy) to work across different drive configs.\n\nThis can be useful if you wish to do a server-side copy between two\ndifferent Google drives.  Note that this isn't enabled by default\nbecause it isn't easy to tell if it will work between any two\nconfigurations.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		disable_http2: {
			Name: "disable_http2",
			FieldName: "",
			Help: "Disable drive using http2.\n\nThere is currently an unsolved issue with the google drive backend and\nHTTP/2.  HTTP/2 is therefore disabled by default for the drive backend\nbut can be re-enabled here.  When the issue is solved this flag will\nbe removed.\n\nSee: https://github.com/rclone/rclone/issues/3631\n\n",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		stop_on_upload_limit: {
			Name: "stop_on_upload_limit",
			FieldName: "",
			Help: "Make upload limit errors be fatal.\n\nAt the time of writing it is only possible to upload 750 GiB of data to\nGoogle Drive a day (this is an undocumented limit). When this limit is\nreached Google Drive produces a slightly different error message. When\nthis flag is set it causes these errors to be fatal.  These will stop\nthe in-progress sync.\n\nNote that this detection is relying on error message strings which\nGoogle don't document so it may break in the future.\n\nSee: https://github.com/rclone/rclone/issues/3857\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		stop_on_download_limit: {
			Name: "stop_on_download_limit",
			FieldName: "",
			Help: "Make download limit errors be fatal.\n\nAt the time of writing it is only possible to download 10 TiB of data from\nGoogle Drive a day (this is an undocumented limit). When this limit is\nreached Google Drive produces a slightly different error message. When\nthis flag is set it causes these errors to be fatal.  These will stop\nthe in-progress sync.\n\nNote that this detection is relying on error message strings which\nGoogle don't document so it may break in the future.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		skip_shortcuts: {
			Name: "skip_shortcuts",
			FieldName: "",
			Help: "If set skip shortcut files.\n\nNormally rclone dereferences shortcut files making them appear as if\nthey are the original file (see [the shortcuts section](#shortcuts)).\nIf this flag is set then rclone will ignore shortcut files completely.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		skip_dangling_shortcuts: {
			Name: "skip_dangling_shortcuts",
			FieldName: "",
			Help: "If set skip dangling shortcut files.\n\nIf this is set then rclone will not show any dangling shortcuts in listings.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		resource_key: {
			Name: "resource_key",
			FieldName: "",
			Help: "Resource key for accessing a link-shared file.\n\nIf you need to access files shared with a link like this\n\n    https://drive.google.com/drive/folders/XXX?resourcekey=YYY&usp=sharing\n\nThen you will need to use the first part \"XXX\" as the \"root_folder_id\"\nand the second part \"YYY\" as the \"resource_key\" otherwise you will get\n404 not found errors when trying to access the directory.\n\nSee: https://developers.google.com/drive/api/guides/resource-keys\n\nThis resource key requirement only applies to a subset of old files.\n\nNote also that opening the folder once in the web interface (with the\nuser you've authenticated rclone with) seems to be enough so that the\nresource key is not needed.\n",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		fast_list_bug_fix: {
			Name: "fast_list_bug_fix",
			FieldName: "",
			Help: "Work around a bug in Google Drive listing.\n\nNormally rclone will work around a bug in Google Drive when using\n--fast-list (ListR) where the search \"(A in parents) or (B in\nparents)\" returns nothing sometimes. See #3114, #4289 and\nhttps://issuetracker.google.com/issues/149522397\n\nRclone detects this by finding no items in more than one directory\nwhen listing and retries them as lists of individual directories.\n\nThis means that if you have a lot of empty directories rclone will end\nup listing them all individually and this can take many more API\ncalls.\n\nThis flag allows the work-around to be disabled. This is **not**\nrecommended in normal use - only if you have a particular case you are\nhaving trouble with like many empty directories.\n",
			Default: true,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "true",
			ValueStr: "true",
			Type: "bool"
		},
		metadata_owner: {
			Name: "metadata_owner",
			FieldName: "",
			Help: "Control whether owner should be read or written in metadata.\n\nOwner is a standard part of the file metadata so is easy to read. But it\nisn't always desirable to set the owner from the metadata.\n\nNote that you can't set the owner on Shared Drives, and that setting\nownership will generate an email to the new owner (this can't be\ndisabled), and you can't transfer ownership to someone outside your\norganization.\n",
			Default: 1,
			Value: null,
			Examples: [
				{
					Value: "off",
					Help: "Do not read or write the value"
				},
				{
					Value: "read",
					Help: "Read the value only"
				},
				{
					Value: "write",
					Help: "Write the value only"
				},
				{
					Value: "failok",
					Help: "If writing fails log errors only, don't fail the transfer"
				},
				{
					Value: "read,write",
					Help: "Read and Write the value."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "read",
			ValueStr: "read",
			Type: "Bits"
		},
		metadata_permissions: {
			Name: "metadata_permissions",
			FieldName: "",
			Help: "Control whether permissions should be read or written in metadata.\n\nReading permissions metadata from files can be done quickly, but it\nisn't always desirable to set the permissions from the metadata.\n\nNote that rclone drops any inherited permissions on Shared Drives and\nany owner permission on My Drives as these are duplicated in the owner\nmetadata.\n",
			Default: 0,
			Value: null,
			Examples: [
				{
					Value: "off",
					Help: "Do not read or write the value"
				},
				{
					Value: "read",
					Help: "Read the value only"
				},
				{
					Value: "write",
					Help: "Write the value only"
				},
				{
					Value: "failok",
					Help: "If writing fails log errors only, don't fail the transfer"
				},
				{
					Value: "read,write",
					Help: "Read and Write the value."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "off",
			ValueStr: "off",
			Type: "Bits"
		},
		metadata_labels: {
			Name: "metadata_labels",
			FieldName: "",
			Help: "Control whether labels should be read or written in metadata.\n\nReading labels metadata from files takes an extra API transaction and\nwill slow down listings. It isn't always desirable to set the labels\nfrom the metadata.\n\nThe format of labels is documented in the drive API documentation at\nhttps://developers.google.com/drive/api/reference/rest/v3/Label -\nrclone just provides a JSON dump of this format.\n\nWhen setting labels, the label and fields must already exist - rclone\nwill not create them. This means that if you are transferring labels\nfrom two different accounts you will have to create the labels in\nadvance and use the metadata mapper to translate the IDs between the\ntwo accounts.\n",
			Default: 0,
			Value: null,
			Examples: [
				{
					Value: "off",
					Help: "Do not read or write the value"
				},
				{
					Value: "read",
					Help: "Read the value only"
				},
				{
					Value: "write",
					Help: "Write the value only"
				},
				{
					Value: "failok",
					Help: "If writing fails log errors only, don't fail the transfer"
				},
				{
					Value: "read,write",
					Help: "Read and Write the value."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "off",
			ValueStr: "off",
			Type: "Bits"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 16777216,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "InvalidUtf8",
			ValueStr: "InvalidUtf8",
			Type: "Encoding"
		},
		env_auth: {
			Name: "env_auth",
			FieldName: "",
			Help: "Get IAM credentials from runtime (environment variables or instance meta data if no env vars).\n\nOnly applies if service_account_file and service_account_credentials is blank.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "false",
					Help: "Enter credentials in the next step."
				},
				{
					Value: "true",
					Help: "Get GCP IAM credentials from the environment (env vars or IAM)."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var gcs = {
	name: "gcs",
	description: "Google Cloud Storage (this is not Google Drive)",
	options: {
		client_id: {
			Name: "client_id",
			FieldName: "",
			Help: "OAuth Client Id.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		client_secret: {
			Name: "client_secret",
			FieldName: "",
			Help: "OAuth Client Secret.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		project_number: {
			Name: "project_number",
			FieldName: "",
			Help: "Project number.\n\nOptional - needed only for list/create/delete buckets - see your developer console.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		user_project: {
			Name: "user_project",
			FieldName: "",
			Help: "User project.\n\nOptional - needed only for requester pays.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		service_account_file: {
			Name: "service_account_file",
			FieldName: "",
			Help: "Service Account Credentials JSON file path.\n\nLeave blank normally.\nNeeded only if you want use SA instead of interactive login.\n\nLeading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		anonymous: {
			Name: "anonymous",
			FieldName: "",
			Help: "Access public buckets and objects without credentials.\n\nSet to 'true' if you just want to download files and don't configure credentials.",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		object_acl: {
			Name: "object_acl",
			FieldName: "",
			Help: "Access Control List for new objects.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "authenticatedRead",
					Help: "Object owner gets OWNER access.\nAll Authenticated Users get READER access."
				},
				{
					Value: "bucketOwnerFullControl",
					Help: "Object owner gets OWNER access.\nProject team owners get OWNER access."
				},
				{
					Value: "bucketOwnerRead",
					Help: "Object owner gets OWNER access.\nProject team owners get READER access."
				},
				{
					Value: "private",
					Help: "Object owner gets OWNER access.\nDefault if left blank."
				},
				{
					Value: "projectPrivate",
					Help: "Object owner gets OWNER access.\nProject team members get access according to their roles."
				},
				{
					Value: "publicRead",
					Help: "Object owner gets OWNER access.\nAll Users get READER access."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		bucket_acl: {
			Name: "bucket_acl",
			FieldName: "",
			Help: "Access Control List for new buckets.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "authenticatedRead",
					Help: "Project team owners get OWNER access.\nAll Authenticated Users get READER access."
				},
				{
					Value: "private",
					Help: "Project team owners get OWNER access.\nDefault if left blank."
				},
				{
					Value: "projectPrivate",
					Help: "Project team members get access according to their roles."
				},
				{
					Value: "publicRead",
					Help: "Project team owners get OWNER access.\nAll Users get READER access."
				},
				{
					Value: "publicReadWrite",
					Help: "Project team owners get OWNER access.\nAll Users get WRITER access."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		bucket_policy_only: {
			Name: "bucket_policy_only",
			FieldName: "",
			Help: "Access checks should use bucket-level IAM policies.\n\nIf you want to upload objects to a bucket with Bucket Policy Only set\nthen you will need to set this.\n\nWhen it is set, rclone:\n\n- ignores ACLs set on buckets\n- ignores ACLs set on objects\n- creates buckets with Bucket Policy Only set\n\nDocs: https://cloud.google.com/storage/docs/bucket-policy-only\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		location: {
			Name: "location",
			FieldName: "",
			Help: "Location for the newly created buckets.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "Empty for default location (US)"
				},
				{
					Value: "asia",
					Help: "Multi-regional location for Asia"
				},
				{
					Value: "eu",
					Help: "Multi-regional location for Europe"
				},
				{
					Value: "us",
					Help: "Multi-regional location for United States"
				},
				{
					Value: "asia-east1",
					Help: "Taiwan"
				},
				{
					Value: "asia-east2",
					Help: "Hong Kong"
				},
				{
					Value: "asia-northeast1",
					Help: "Tokyo"
				},
				{
					Value: "asia-northeast2",
					Help: "Osaka"
				},
				{
					Value: "asia-northeast3",
					Help: "Seoul"
				},
				{
					Value: "asia-south1",
					Help: "Mumbai"
				},
				{
					Value: "asia-south2",
					Help: "Delhi"
				},
				{
					Value: "asia-southeast1",
					Help: "Singapore"
				},
				{
					Value: "asia-southeast2",
					Help: "Jakarta"
				},
				{
					Value: "australia-southeast1",
					Help: "Sydney"
				},
				{
					Value: "australia-southeast2",
					Help: "Melbourne"
				},
				{
					Value: "europe-north1",
					Help: "Finland"
				},
				{
					Value: "europe-west1",
					Help: "Belgium"
				},
				{
					Value: "europe-west2",
					Help: "London"
				},
				{
					Value: "europe-west3",
					Help: "Frankfurt"
				},
				{
					Value: "europe-west4",
					Help: "Netherlands"
				},
				{
					Value: "europe-west6",
					Help: "Zürich"
				},
				{
					Value: "europe-central2",
					Help: "Warsaw"
				},
				{
					Value: "us-central1",
					Help: "Iowa"
				},
				{
					Value: "us-east1",
					Help: "South Carolina"
				},
				{
					Value: "us-east4",
					Help: "Northern Virginia"
				},
				{
					Value: "us-west1",
					Help: "Oregon"
				},
				{
					Value: "us-west2",
					Help: "California"
				},
				{
					Value: "us-west3",
					Help: "Salt Lake City"
				},
				{
					Value: "us-west4",
					Help: "Las Vegas"
				},
				{
					Value: "northamerica-northeast1",
					Help: "Montréal"
				},
				{
					Value: "northamerica-northeast2",
					Help: "Toronto"
				},
				{
					Value: "southamerica-east1",
					Help: "São Paulo"
				},
				{
					Value: "southamerica-west1",
					Help: "Santiago"
				},
				{
					Value: "asia1",
					Help: "Dual region: asia-northeast1 and asia-northeast2."
				},
				{
					Value: "eur4",
					Help: "Dual region: europe-north1 and europe-west4."
				},
				{
					Value: "nam4",
					Help: "Dual region: us-central1 and us-east1."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		storage_class: {
			Name: "storage_class",
			FieldName: "",
			Help: "The storage class to use when storing objects in Google Cloud Storage.",
			Default: "",
			Value: null,
			Examples: [
				{
					Value: "",
					Help: "Default"
				},
				{
					Value: "MULTI_REGIONAL",
					Help: "Multi-regional storage class"
				},
				{
					Value: "REGIONAL",
					Help: "Regional storage class"
				},
				{
					Value: "NEARLINE",
					Help: "Nearline storage class"
				},
				{
					Value: "COLDLINE",
					Help: "Coldline storage class"
				},
				{
					Value: "ARCHIVE",
					Help: "Archive storage class"
				},
				{
					Value: "DURABLE_REDUCED_AVAILABILITY",
					Help: "Durable reduced availability storage class"
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		env_auth: {
			Name: "env_auth",
			FieldName: "",
			Help: "Get GCP IAM credentials from runtime (environment variables or instance meta data if no env vars).\n\nOnly applies if service_account_file and service_account_credentials is blank.",
			Default: false,
			Value: null,
			Examples: [
				{
					Value: "false",
					Help: "Enter credentials in the next step."
				},
				{
					Value: "true",
					Help: "Get GCP IAM credentials from the environment (env vars or IAM)."
				}
			],
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: false,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		token: {
			Name: "token",
			FieldName: "",
			Help: "OAuth Access Token as a JSON blob.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: true,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		auth_url: {
			Name: "auth_url",
			FieldName: "",
			Help: "Auth server URL.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		token_url: {
			Name: "token_url",
			FieldName: "",
			Help: "Token server url.\n\nLeave blank to use the provider defaults.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		directory_markers: {
			Name: "directory_markers",
			FieldName: "",
			Help: "Upload an empty object with a trailing slash when a new directory is created\n\nEmpty folders are unsupported for bucket based remotes, this option creates an empty\nobject ending with \"/\", to persist the folder.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		no_check_bucket: {
			Name: "no_check_bucket",
			FieldName: "",
			Help: "If set, don't attempt to check the bucket exists or create it.\n\nThis can be useful when trying to minimise the number of transactions\nrclone does if you know the bucket exists already.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		decompress: {
			Name: "decompress",
			FieldName: "",
			Help: "If set this will decompress gzip encoded objects.\n\nIt is possible to upload objects to GCS with \"Content-Encoding: gzip\"\nset. Normally rclone will download these files as compressed objects.\n\nIf this flag is set then rclone will decompress these files with\n\"Content-Encoding: gzip\" as they are received. This means that rclone\ncan't check the size and hash but the file contents will be decompressed.\n",
			Default: false,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "false",
			ValueStr: "false",
			Type: "bool"
		},
		endpoint: {
			Name: "endpoint",
			FieldName: "",
			Help: "Endpoint for the service.\n\nLeave blank normally.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		},
		encoding: {
			Name: "encoding",
			FieldName: "",
			Help: "The encoding for the backend.\n\nSee the [encoding section in the overview](/overview/#encoding) for more info.",
			Default: 50348034,
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "Slash,CrLf,InvalidUtf8,Dot",
			ValueStr: "Slash,CrLf,InvalidUtf8,Dot",
			Type: "Encoding"
		},
		description: {
			Name: "description",
			FieldName: "",
			Help: "Description of the remote.",
			Default: "",
			Value: null,
			Hide: 0,
			Required: false,
			IsPassword: false,
			NoPrefix: false,
			Advanced: true,
			Exclusive: false,
			Sensitive: false,
			DefaultStr: "",
			ValueStr: "",
			Type: "string"
		}
	}
};
var backends = {
	alias: alias,
	memory: memory,
	crypt: crypt,
	hdfs: hdfs,
	local: local,
	protondrive: protondrive,
	storj: storj,
	tardigrade: tardigrade,
	azurefiles: azurefiles,
	fichier: fichier,
	filefabric: filefabric,
	filescom: filescom,
	ftp: ftp,
	gofile: gofile,
	http: http,
	imagekit: imagekit,
	internetarchive: internetarchive,
	koofr: koofr,
	linkbox: linkbox,
	mega: mega,
	netstorage: netstorage,
	opendrive: opendrive,
	pixeldrain: pixeldrain,
	qingstor: qingstor,
	seafile: seafile,
	sftp: sftp,
	sia: sia,
	smb: smb,
	sugarsync: sugarsync,
	ulozto: ulozto,
	uptobox: uptobox,
	webdav: webdav,
	azureblob: azureblob,
	b2: b2,
	quatrix: quatrix,
	cache: cache,
	chunker: chunker,
	combine: combine,
	hasher: hasher,
	oos: oos,
	s3: s3,
	swift: swift,
	union: union,
	compress: compress,
	dropbox: dropbox,
	gphotos: gphotos,
	hidrive: hidrive,
	jottacloud: jottacloud,
	mailru: mailru,
	onedrive: onedrive,
	pcloud: pcloud,
	pikpak: pikpak,
	premiumizeme: premiumizeme,
	putio: putio,
	sharefile: sharefile,
	yandex: yandex,
	zoho: zoho,
	box: box,
	drive: drive,
	gcs: gcs
};

interface S3MountOptions {
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
interface MountOptions<T extends BackendType> {
    type: T;
    localPath: string;
    remoteUri: string;
    authType: "SSO" | "KEY";
    nativeArgs: Partial<{
        [k in NativeArgName<T>]: any;
    }>;
}
type BackendType = keyof typeof backends;
type Backend<T extends BackendType> = typeof backends[T];
type NativeArgName<T extends BackendType> = keyof Backend<T>["options"];
interface BackendOption {
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

declare class TypedEmitter<T = any> {
    private _subscriptions;
    private _counterSub;
    private _dispose;
    private _counterDis;
    emit(event: T): void;
    on(callback: (event: T) => any): () => void;
    onDispose(callback: (code: number) => any): () => void;
    dispose(code?: number): void;
}

interface RCloneOptions {
    cwd?: string;
}
interface RunningProcess {
    stdout: TypedEmitter<string>;
    stderr: TypedEmitter<string>;
    exit: TypedEmitter<number | null>;
    process: ChildProcessWithoutNullStreams;
}
interface ProcessResult {
    stdout: string;
    stderr: string;
    exitCode: number | null;
    signal: string | null;
}
declare class RClone {
    opts: RCloneOptions;
    onExit: TypedEmitter<any>;
    stdio: TypedEmitter<string>;
    stderr: TypedEmitter<string | null>;
    constructor(opts?: RCloneOptions);
    runCommand(args: string[], timeout?: number): Promise<ProcessResult>;
    runProcess(args: string[]): RunningProcess;
    getRClonePath(): string;
}

declare enum MountStatus {
    Mounted = 0,
    Unmounted = 1,
    Disposed = 2
}
declare class FSMount<T extends BackendType> {
    private _process;
    private _remoteName;
    private _opts;
    readonly bucket: string;
    readonly endpoint: string;
    readonly rclone: RClone;
    constructor(options: MountOptions<T>);
    createRemote(name: string): Promise<void>;
    runMountProcess(remoteName: string, bucket: string, localPath: string): Promise<void>;
    mount(): Promise<void>;
    unmount(): void;
    dispose(): void;
}

declare let BackendOptions: {
    alias: {
        name: string;
        description: string;
        options: {
            remote: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    memory: {
        name: string;
        description: string;
        options: {
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    crypt: {
        name: string;
        description: string;
        options: {
            remote: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            filename_encryption: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            directory_name_encryption: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password2: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            server_side_across_configs: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_data_encryption: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            pass_bad_blocks: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            strict_names: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            filename_encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            suffix: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    hdfs: {
        name: string;
        description: string;
        options: {
            namenode: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            service_principal_name: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            data_transfer_protection: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    local: {
        name: string;
        description: string;
        options: {
            nounc: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            copy_links: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                ShortOpt: string;
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
            };
            links: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                ShortOpt: string;
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
            };
            skip_links: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            zero_size_links: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            unicode_normalization: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_check_updated: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            one_file_system: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                ShortOpt: string;
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
            };
            case_sensitive: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            case_insensitive: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_clone: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_preallocate: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_sparse: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_set_modtime: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            time_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    protondrive: {
        name: string;
        description: string;
        options: {
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            "2fa": {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            mailbox_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            original_file_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            app_version: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            replace_existing_draft: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            enable_caching: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    storj: {
        name: string;
        description: string;
        options: {
            provider: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            access_grant: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    tardigrade: {
        name: string;
        description: string;
        options: {};
    };
    azurefiles: {
        name: string;
        description: string;
        options: {
            account: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            share_name: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            env_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            sas_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            connection_string: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            tenant: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_certificate_path: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_certificate_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_send_certificate_chain: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            service_principal_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            use_msi: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            msi_object_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            msi_client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            msi_mi_res_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            max_stream_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    fichier: {
        name: string;
        description: string;
        options: {
            api_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            shared_folder: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            file_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            folder_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            cdn: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    filefabric: {
        name: string;
        description: string;
        options: {
            url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            permanent_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_expiry: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            version: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    filescom: {
        name: string;
        description: string;
        options: {
            site: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            api_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    ftp: {
        name: string;
        description: string;
        options: {
            host: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            port: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            tls: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            explicit_tls: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            no_check_certificate: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            disable_epsv: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            disable_mlsd: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            disable_utf8: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            writing_mdtm: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            force_list_hidden: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            idle_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            close_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            tls_cache_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            disable_tls13: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            shut_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            ask_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            socks_proxy: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    gofile: {
        name: string;
        description: string;
        options: {
            access_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            account_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            list_chunk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    http: {
        name: string;
        description: string;
        options: {
            url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            no_escape: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            headers: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            no_slash: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_head: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    imagekit: {
        name: string;
        description: string;
        options: {
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            public_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            private_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            only_signed: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            versions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            upload_tags: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    internetarchive: {
        name: string;
        description: string;
        options: {
            access_key_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            secret_access_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            front_endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            disable_checksum: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            wait_archive: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    koofr: {
        name: string;
        description: string;
        options: {
            provider: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
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
            };
            mountid: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            setmtime: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    linkbox: {
        name: string;
        description: string;
        options: {
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    mega: {
        name: string;
        description: string;
        options: {
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            debug: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            hard_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_https: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    netstorage: {
        name: string;
        description: string;
        options: {
            host: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            account: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            protocol: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    opendrive: {
        name: string;
        description: string;
        options: {
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    pixeldrain: {
        name: string;
        description: string;
        options: {
            api_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            api_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    qingstor: {
        name: string;
        description: string;
        options: {
            env_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            access_key_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            secret_access_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            zone: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            connection_retries: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    seafile: {
        name: string;
        description: string;
        options: {
            url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            "2fa": {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            library: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            library_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            create_library: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    sftp: {
        name: string;
        description: string;
        options: {
            host: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            port: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            key_pem: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            key_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            key_file_pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            pubkey_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            key_use_agent: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_insecure_cipher: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            disable_hashcheck: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            ssh: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            known_hosts_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            ask_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            path_override: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            set_modtime: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            shell_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            md5sum_command: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            sha1sum_command: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            skip_links: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            subsystem: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            server_command: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            use_fstat: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            disable_concurrent_reads: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            disable_concurrent_writes: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            idle_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            connections: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            set_env: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            ciphers: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            key_exchange: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            macs: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            host_key_algorithms: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            socks_proxy: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            copy_is_hardlink: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    sia: {
        name: string;
        description: string;
        options: {
            api_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            api_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user_agent: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    smb: {
        name: string;
        description: string;
        options: {
            host: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            port: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            domain: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            spn: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            idle_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            hide_special_share: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            case_insensitive: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    sugarsync: {
        name: string;
        description: string;
        options: {
            app_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            access_key_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            private_access_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            hard_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            refresh_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            authorization: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            authorization_expiry: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            deleted_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    ulozto: {
        name: string;
        description: string;
        options: {
            app_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_slug: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            list_page_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    uptobox: {
        name: string;
        description: string;
        options: {
            access_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            private: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    webdav: {
        name: string;
        description: string;
        options: {
            url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            vendor: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            bearer_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            bearer_token_command: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            headers: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            pacer_min_sleep: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            nextcloud_chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            owncloud_exclude_shares: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            owncloud_exclude_mounts: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            unix_socket: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    azureblob: {
        name: string;
        description: string;
        options: {
            account: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            env_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            sas_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            tenant: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_certificate_path: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_certificate_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_send_certificate_chain: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            service_principal_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            use_msi: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            msi_object_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            msi_client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            msi_mi_res_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            use_emulator: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            list_chunk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            access_tier: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            archive_tier_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            disable_checksum: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            public_access: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            directory_markers: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_check_container: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_head_object: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            delete_snapshots: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    b2: {
        name: string;
        description: string;
        options: {
            account: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            hard_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            versions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            version_at: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            copy_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            disable_checksum: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            download_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            download_auth_duration: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            lifecycle: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    quatrix: {
        name: string;
        description: string;
        options: {
            api_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            host: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            effective_upload_time: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            minimal_chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            maximal_summary_chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            hard_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            skip_project_folders: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    cache: {
        name: string;
        description: string;
        options: {
            remote: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            plex_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            plex_username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            plex_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            info_age: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            chunk_total_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            plex_insecure: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            db_path: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_path: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_clean_interval: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            read_retries: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            workers: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_no_memory: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            rps: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            writes: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            tmp_upload_path: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            tmp_wait_time: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            db_wait_time: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    chunker: {
        name: string;
        description: string;
        options: {
            remote: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            hash_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            name_format: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            start_from: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            meta_format: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            fail_hard: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            transactions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    combine: {
        name: string;
        description: string;
        options: {
            upstreams: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: null;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    hasher: {
        name: string;
        description: string;
        options: {
            remote: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            hashes: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string[];
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
            };
            max_age: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            auto_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    oos: {
        name: string;
        description: string;
        options: {
            provider: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            namespace: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            compartment: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
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
            };
            region: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            storage_tier: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            max_upload_parts: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            copy_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            copy_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            disable_checksum: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            leave_parts_on_error: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            attempt_resume_upload: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_check_bucket: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            sse_customer_key_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            sse_customer_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            sse_customer_key_sha256: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            sse_kms_key_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            sse_customer_algorithm: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    s3: {
        name: string;
        description: string;
        options: {
            provider: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            env_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            access_key_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            secret_access_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            region: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
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
            };
            location_constraint: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            acl: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                    Provider: string;
                }[];
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
            };
            server_side_encryption: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: ({
                    Value: string;
                    Help: string;
                    Provider?: undefined;
                } | {
                    Value: string;
                    Help: string;
                    Provider: string;
                })[];
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
            };
            sse_kms_key_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            storage_class: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            bucket_acl: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            requester_pays: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: boolean;
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
            };
            sse_customer_algorithm: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            sse_customer_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            sse_customer_key_base64: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            sse_customer_key_md5: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            max_upload_parts: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            copy_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            disable_checksum: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            shared_credentials_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            profile: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            session_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            force_path_style: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            v2_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_dual_stack: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_accelerate_endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: boolean;
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
            };
            leave_parts_on_error: {
                Name: string;
                FieldName: string;
                Help: string;
                Provider: string;
                Default: boolean;
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
            };
            list_chunk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            list_version: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            list_url_encode: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            no_check_bucket: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_head: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_head_object: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            disable_http2: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            download_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            directory_markers: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_multipart_etag: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            use_unsigned_payload: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            use_presigned_request: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            versions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            version_at: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            version_deleted: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            decompress: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            might_gzip: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            use_accept_encoding_gzip: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            no_system_metadata: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_already_exists: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            use_multipart_uploads: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            sdk_log_mode: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    swift: {
        name: string;
        description: string;
        options: {
            env_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            user_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            domain: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            tenant: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            tenant_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            tenant_domain: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            region: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            storage_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            application_credential_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            application_credential_name: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            application_credential_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_version: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            endpoint_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            storage_policy: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            leave_parts_on_error: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            fetch_until_empty_page: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            partial_page_fetch_threshold: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            no_chunk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_large_objects: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_segments_container: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: {
                    Value: boolean;
                    Valid: boolean;
                };
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    union: {
        name: string;
        description: string;
        options: {
            upstreams: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            action_policy: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            create_policy: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            search_policy: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            cache_time: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            min_free_space: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    compress: {
        name: string;
        description: string;
        options: {
            remote: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            mode: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            level: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            ram_cache_limit: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    dropbox: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            impersonate: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            shared_files: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            shared_folders: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            pacer_min_sleep: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            root_namespace: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            batch_mode: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            batch_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            batch_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            batch_commit_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    gphotos: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            read_only: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            read_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            start_year: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            include_archived: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            batch_mode: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            batch_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            batch_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            batch_commit_timeout: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    hidrive: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            scope_access: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            scope_role: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            root_prefix: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            disable_fetching_member_count: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    jottacloud: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            md5_memory_limit: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            trashed_only: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            hard_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            upload_resume_limit: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            no_versions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    mailru: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            speedup_enable: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            speedup_file_patterns: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            speedup_max_disk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            speedup_max_memory: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            check_hash: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    onedrive: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            region: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            drive_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            drive_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            access_scopes: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string[];
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            expose_onenote_files: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            server_side_across_configs: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            list_chunk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            no_versions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            hard_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            link_scope: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            link_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            link_password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            hash_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            av_override: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            delta: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            metadata_permissions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    pcloud: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            hostname: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            username: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            password: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    pikpak: {
        name: string;
        description: string;
        options: {
            user: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            pass: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            device_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user_agent: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            use_trash: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            trashed_only: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            hash_memory_limit: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            upload_concurrency: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    premiumizeme: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    putio: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    sharefile: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    yandex: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            hard_delete: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    zoho: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            region: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    box: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            box_config_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            access_token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            box_sub_type: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            commit_retries: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            list_chunk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            owned_by: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            impersonate: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    drive: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            scope: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            service_account_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            root_folder_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_owner_only: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            use_trash: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            copy_shortcut_content: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            skip_gdocs: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            show_all_gdocs: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            skip_checksum_gphotos: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            shared_with_me: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            trashed_only: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            starred_only: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            export_formats: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            import_formats: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            allow_import_name_change: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            list_chunk: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            impersonate: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            upload_cutoff: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            chunk_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            acknowledge_abuse: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            keep_revision_forever: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            v2_download_min_size: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            pacer_min_sleep: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            pacer_burst: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            server_side_across_configs: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            disable_http2: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            stop_on_upload_limit: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            stop_on_download_limit: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            skip_shortcuts: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            skip_dangling_shortcuts: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            resource_key: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            fast_list_bug_fix: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            metadata_owner: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            metadata_permissions: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            metadata_labels: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            env_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
    gcs: {
        name: string;
        description: string;
        options: {
            client_id: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            client_secret: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            project_number: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            user_project: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            service_account_file: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            anonymous: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            object_acl: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            bucket_acl: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            bucket_policy_only: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            location: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            storage_class: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            env_auth: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
                Value: null;
                Examples: {
                    Value: string;
                    Help: string;
                }[];
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
            };
            token: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            auth_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            token_url: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            directory_markers: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            no_check_bucket: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            decompress: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: boolean;
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
            };
            endpoint: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
            encoding: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: number;
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
            };
            description: {
                Name: string;
                FieldName: string;
                Help: string;
                Default: string;
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
            };
        };
    };
};

export { type Backend, type BackendOption, BackendOptions, type BackendType, FSMount, type MountOptions, MountStatus, type NativeArgName, type ProcessResult, RClone, type RCloneOptions, type RunningProcess, type S3MountOptions };
