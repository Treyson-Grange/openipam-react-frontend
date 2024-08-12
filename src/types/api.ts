// Type definitions for the KCM API.
// Includes generic container types for API responses, as well as specific
// types for each endpoint. The specific types are accepted by POST requests,
// and the Response types are returned by GET requests and contain the ID field.
// PATCH-like requests take partial versions of the StoredObject generic
// types, and return the full Response type.

import { KeyofStorable } from '.';
import { ISO8601String } from '../utilities/dateUtils';
import * as Filters from './apiFilters';
export { Filters };

interface BaseListParams {
    page_size?: number;
    page?: number;
}

/**
 * Returned by an API endpoint that merely indicates a success or failure. Failure will
 * result in an ApiError being thrown, so when the promise resolves, success is guaranteed
 * to be true.
 */
export type GenericResponse = {
    detail?: string;
    message?: string;
    success: true;
};

export type AuthResponse = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_ipamadmin: boolean;
    is_active: boolean;
    last_login: string;
    groups: string[];
}

export type PaginatedApiFunction<
    ResponseData,
    Params extends PaginationParams = PaginationParams
> = (params: Params) => Promise<PaginatedData<ResponseData>>;

/**
 * Creates a type that represents the filters that can be passed to an advanced filtering endpoint
 * that supports multiple 'or' levels, based on the provided filter type indicating which fields are
 * available for filtering.
 */
export type AdvancedFilterParams<
    FilterType extends Partial<
        Record<string & KeyofStorable<FilterType>, string | number | boolean>
    >
> = {
        [key in KeyofStorable<FilterType> as `${'~' | ''}${key}${| `{${number}}[${number}]`
        | ''}`]?: FilterType[key];
    };

/**
 * Utility type to strip advanced filter syntax from a set of parameters, returning the base filter type.
 * If the parameters do not contain any advanced filter syntax, the original type is returned.
 * If multiple levels of advanced filters are present, all levels are stripped.
 * @template Params The type of the parameters to strip the advanced filter syntax from.
 * @returns The base filter type.
 */
export type StripAdvancedFilters<
    Params extends Partial<
        Record<string & KeyofStorable<Params>, string | number | boolean>
    >
> = Omit<Params, `${KeyofStorable<Params>}{${number}}[${number}]`>;

/**
 * Represents the parameters that can be passed to a paginated list endpoint.
 * @template Filters The type of the filters that can be passed to the endpoint.
 */
export type PaginationParams<
    Filters extends Partial<Record<string, string | number | boolean>> = {}
> = Filters & BaseListParams;

/**
 * Represents the parameters that can be passed to a paginated list endpoint that
 * supports results ordering.
 * @template Filters The type of the filters that can be passed to the endpoint.
 * @template Ordering The type of the ordering that can be passed to the endpoint.
 */
export type OrderablePaginationParams<
    Filters extends Partial<Record<string, string | number | boolean>> = Partial<
        Record<string, any>
    >,
    Ordering extends string = any
> = PaginationParams<Filters> & {
    ordering?: Ordering | `-${Ordering}`;
};

/**
 * Utility type to strip pagination parameters from a set of parameters, returning the base filter type.
 * Keeps the `ordering` field if present, as it is not a pagination parameter.
 */
export type StripPaginationParams<
    Params extends Partial<
        Record<string & KeyofStorable<Params>, string | number | boolean>
    >
> = Omit<Params, keyof BaseListParams>;
/**
 * Represents the version of an object that is stored in the database.
 * @template PostType The type of the object that is passed to the API in POST-like requests.
 * @template AdditionalFields Any additional fields that are returned by the API that the POST-like requests do not accept, not including the ID field.
 */
export type StoredObject<PostType, AdditionalFields = {}> = Required<PostType> &
    AdditionalFields & {
        /**
         * The ID of the object.
         */
        id: number;
    };

/**
 * Represents a response to a request that does not return any data. Used for standards-compliant
 * DELETE-like requests.
 */
export type EmptyResponse = Promise<void>;

/**
 * Represents a response to a request that directly returns a string.
 */
export type StringResponse = Promise<string>;

/**
 * Represents a response to a request for a single object.
 * @template PostType The type of the object that is passed to the API in POST-like requests.
 * @template AdditionalFields Any additional fields that are returned by the API that the POST-like requests do not accept, not including the ID field.
 */
export type Response<PostType, AdditionalFields = {}> = Promise<
    StoredObject<PostType, AdditionalFields>
>;

/**
 * Represents a non-paginated response to a request for a list of objects.
 * @template PostType The type of the object that is passed to the API in POST-like requests.
 * @template AdditionalFields Any additional fields that are returned by the API that the POST-like requests do not accept, not including the ID field.
 */
export type ListResponse<PostType, AdditionalFields = {}> = Promise<
    StoredObject<PostType, AdditionalFields>[]
>;

/**
 * Represents a paginated response to a request for a list of objects.
 * The `results` field is an array of StoredObjects of type `T`.
 * @template PostType The type of the object that is passed to the API in POST-like requests.
 * @template AdditionalFields Any additional fields that are returned by the API that the POST-like requests do not accept.
 */
export type PaginatedData<PostType, AdditionalFields = {}> = {
    /**
     * The total number of objects that match the query.
     */
    count: number;
    /**
     * The URL of the next page of results, or null if there is no next page.
     */
    next: string | null;
    /**
     * The URL of the previous page of results, or null if there is no previous page.
     */
    previous: string | null;
    /**
     * The results of the query.
     */
    results: StoredObject<PostType, AdditionalFields>[];
};

/**
 * The data that can be passed to an update-like endpoint.
 */
export type PatchData<PostType, AdditionalFields = {}> = Partial<
    StoredObject<PostType, AdditionalFields>
>;

export interface MultipleSelection {
    /**
     * The IDs of the objects to be operated on.
     */
    selected: number[];
}

/**
 * Interface for the User model.
 */
export interface User {
    /**
     * The username of the user. When a user is updating their own profile, this
     * must match their current username. Changing the username is not supported.
     */
    username: string;
    /**
     * The email address of the user.
     */
    email: string;
    /**
     * The first name of the user.
     */
    first_name: string;
    /**
     * The last name of the user.
     */
    last_name: string;
    /**
     * Whether the user is active. When a user is updating their own profile, this
     * field will be silently ignored.
     */
    is_active: boolean;
    /**
     * Whether the user is a staff member. When a user is updating their own
     * profile, this field will be silently ignored.
     */
    is_staff: boolean;
    /**
     * Whether the user is a superuser. When a user is updating their own profile,
     * this field will be silently ignored.
     */
    is_superuser: boolean;
    /**
     * The date of the user's last login, in ISO format.
     */
    last_login: string;
    /**
     * The date the user was created, in ISO format.
     */
    date_joined: string;
}

export interface DNSRecord {
    /**
     * The display name of the DNS record.
     */
    name: string;
    /**
     * the content of the DNS record. (IP address, hostname, etc.)
     */
    content: string;
    /**
     * The dns type of the DNS record.
     */
    dns_type: string;
    /**
     * The time-to-live of the DNS record.
     */
    ttl: number;
    /**
     * The host that the DNS record is associated with.
     */
    host: string;
    /**
     * The ID of the DNS record.
     */
    id: number;
    /**
     * The orphaned-dns url (only works if the record is orphaned)
     */
    url: string;
}

/**
 * Interface for the Filter model.
 */
export interface SavedFilter {
    /**
     * The name of the filter.
     */
    name: string;
    /**
     * The slug of the filter. This is a unique identifier for the filter.
     */
    slug: string;
    /**
     * The parameters of the filter, in JSON format.
     */
    json_string: string;
}

export interface Device {
    /**
     * The hostname of the device.
     */
    host: string;
    /**
     * The model of the device, if known.
     */
    model: string | null;
    /**
     * The firmware version of the device, if known.
     */
    version: string | null;
    /**
     * The vendor of the device.
     */
    vendor: string;
    /**
     * The location of the device, if known.
     */
    location: string | null;
    /**
     * The serial number of the device, if known.
     */
    serial: string | null;
    /**
     * The asset tag of the device.
     */
    asset: string;
    /**
     * Whether the device is reachable via SSH.
     */
    ssh: boolean;
    /**
     * The firmware version loaded on the primary flash of the device, if known.
     */
    primary_flash: string | null;
    /**
     * The firmware version loaded on the secondary flash of the device, if known.
     */
    secondary_flash: string | null;
    /**
     * The IP address of the device, if any.
     */
    ip: string | null;
    /**
     * Timestamp of the last successful update, in ISO format.
     */
    lastupdate: string;
    /**
     * Whether the last update was successful.
     */
    lastupdatesuccess: boolean;
    /**
     * The error message of the last update, if any.
     */
    lastupdateerror: string | null;
    /**
     * The time of a pending scheduled reload, in ISO format.
     * May be null if no reload is scheduled.
     */
    reloadat: ISO8601String | null;
}

/**
 * Interface for the Job model.
 */
export interface Job {
    /**
     * The time the job is scheduled to run, in ISO format.
     */
    scheduled_time: ISO8601String;
    /**
     * The command to run on the device. Multi-line string, should be
     * rendered as a code block.
     */
    command: string;
    /**
     * If true, the job will be run on devices concurrently. Defaults to true.
     */
    concurrency?: boolean;
    /**
     * If true, devices will be rediscovered after the job is run. Defaults to
     * false.
     */
    rediscover?: boolean;
    /**
     * Integer timeout for the job.
     */
    timeout: number;
    /**
     * The device IDs to run the job on.
     */
    devices: number[];
}

export interface JobAdditionalFields {
    /**
     * The state of the job. A value of 0 indicates success, other values indicate
     * errors.
     */
    state: number;
    /**
     * The number of devices that succeeded in running the job. Only present on returned
     * objects, do not pass this field to the API.
     */
    success: number;
    /**
     * The number of devices that failed to run the job. Only present on returned
     * objects, do not pass this field to the API.
     */
    failed: number;
}

/**
 * Interface for the list websocket action's data array.
 */
export interface JobListData {
    id: number;
    scheduled_time: string;
    progress: {
        pending: number;
        running: number;
        failed: number;
        success: number;
    };
    state: number;
    tasks: StoredObject<JobStatus>[];
    devices: number[];
    url: string;
}

/**
 * Interface for the JobStatus model, which is read-only.
 */
export interface JobStatus {
    /**
     * The job start timestamp, in ISO format. May be null if the job has not
     * started yet.
     */
    start_time: string | null;
    /**
     * The job end timestamp, in ISO format. May be null if the job has not
     * finished yet.
     */
    end_time: string | null;
    /**
     * Whether the job was successful. Will be false if the job has not finished
     * yet.
     */
    success: boolean;
    /**
     * The hostname of the device the job was run on.
     */
    host: string;
    /**
     * The output of the job. Multi-line string, should be rendered as a code
     * block.
     */
    output: string;
    /**
     * The ID of the device the job was run on.
     */
    device_id: number;
}

/**
 * File list used by the firmware list endpoint.
 */
export interface FileList {
    /**
     * A list of files. Each file is a tuple of the filename and the name of the
     * firmware. Also includes a special value for the 'Select a File' option.
     */
    files: ([string, string] | '' | 'Select a File')[];
}

/**
 * Interface for the Firmware model.
 */
export interface Firmware {
    /**
     * The filename of the firmware, relative to the firmware directory on the
     * server.
     */
    filename: string;
    /**
     * The name of the firmware, as displayed to the user.
     */
    name: string;
    /**
     * Ordering of the firmware. Higher values are displayed first.
     */
    ordering?: number;
}

/**
 * Interface for the FirmwareUpdate endpoint.
 */
export interface FirmwareUpdateArguments {
    /**
     * The IDs of the devices to update.
     */
    devices: number[];
    /**
     * The ID of the firmware to update to.
     */
    firmware: number;
    /**
     * The time the update is scheduled to run, in ISO format.
     */
    scheduled_time: string;
}

/**
 * Interface for the DiscoverGroup model.
 */
export interface DiscoverGroup {
    /**
     * The name of the OpenIPAM group this DiscoverGroup is associated with.
     */
    ipamgroup: string;
    /**
     * The username to use when logging into devices.
     */
    username: string;
    /**
     * The password to use when logging into devices.
     */
    password: string;
    /**
     * The enable password to use when logging into devices. May be null.
     */
    enablepassword: string | null;
}

export interface ConfigDiff {
    /**
     * The diff string
     */
    diff: string;
    /**
     * Added lines
     */
    added: string[];
    /**
     * Removed lines
     */
    removed: string[];
}

export interface ConfigVersion {
    /**
     * The date the config was created, in ISO format.
     */
    date_created: string;
    /**
     * The comment included with this revision.
     */
    comment: string;
    /**
     * The configuration file.
     */
    config: string;
}

export interface LogEntry {
    /**
     * The ID of the job this log entry is associated with.
     */
    job: number;
    /**
     * The ID of the device this log entry is associated with.
     */
    device: number;
    /**
     * The timestamp of the log entry, in ISO format.
     */
    stamp: string;
    /**
     * The severity of the log entry.
     */
    severity: number;
    /**
     * The message of the log entry.
     */
    message: string;
}

export interface RecentReport {
    hosts_today: number;
    hosts_week: number;
    hosts_month: number;
    users_today: number;
    users_week: number;
    users_month: number;
}

export interface Host {
    mac: string;
    details: string;
    vendor: string;
    hostname: string;
    expires: string;
    description: string;
    is_dynamic: boolean;
    disabled_host: boolean;
    dhcp_group: string[];
    attributes: string[];
    master_ip_address: string;
    group_owners: string[];
    changed_by: User;
}

export interface Interface {
    description: string;
    is_enabled: boolean;
    is_operational: boolean;
    name: string;
    snmpid: number;
    speed: number;
    tagged: number[];
    untagged: number[];
}
