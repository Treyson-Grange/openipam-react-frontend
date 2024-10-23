// Type definitions for the openIPAM API.
// Includes generic container types for API responses, as well as specific
// types for each endpoint. The specific types are accepted by POST requests,
// and the Response types are returned by GET requests and contain the ID field.
// PATCH-like requests take partial versions of the StoredObject generic
// types, and return the full Response type.

import { KeyofStorable } from '.';
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
    /**
     * ID of the user.
     */
    id: number;
    /**
     * The username of the user.
     */
    username: string;
    /**
     * The first name of the user.
     */
    first_name: string;
    /**
     * The last name of the user.
     */
    last_name: string;
    /**
     * The email address of the user.
     */
    email: string;
    /**
     * Whether the user is a staff member.
     */
    is_staff: boolean;
    /**
     * Whether the user is a superuser.
     */
    is_superuser: boolean;
    /**
     * Whether the user is an IPAM admin.
     */
    is_ipamadmin: boolean;
    /**
     * Whether the user is active.
     */
    is_active: boolean;
    /**
     * The date the user last logged in.
     */
    last_login: string;
    /**
     * Groups the user is a member of.
     */
    groups: string[];
};

export type PaginatedApiFunction<
    ResponseData,
    Params extends PaginationParams = PaginationParams,
> = (params: Params) => Promise<PaginatedData<ResponseData>>;

/**
 * Creates a type that represents the filters that can be passed to an advanced filtering endpoint
 * that supports multiple 'or' levels, based on the provided filter type indicating which fields are
 * available for filtering.
 */
export type AdvancedFilterParams<
    FilterType extends Partial<
        Record<string & KeyofStorable<FilterType>, string | number | boolean>
    >,
> = {
    [key in KeyofStorable<FilterType> as `${'~' | ''}${key}${`{${number}}[${number}]` | ''}`]?: FilterType[key];
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
    >,
> = Omit<Params, `${KeyofStorable<Params>}{${number}}[${number}]`>;

/**
 * Represents the parameters that can be passed to a paginated list endpoint.
 * @template Filters The type of the filters that can be passed to the endpoint.
 */
export type PaginationParams<
    Filters extends Partial<Record<string, string | number | boolean>> = {},
> = Filters & BaseListParams;

/**
 * Represents the parameters that can be passed to a paginated list endpoint that
 * supports results ordering.
 * @template Filters The type of the filters that can be passed to the endpoint.
 * @template Ordering The type of the ordering that can be passed to the endpoint.
 */
export type OrderablePaginationParams<
    Filters extends Partial<
        Record<string, string | number | boolean>
    > = Partial<Record<string, any>>,
    Ordering extends string = any,
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
    >,
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
 * Interface for the User model. Not sure this is needed, from KCM, but its used below
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
     * Whether the user is an IPAM admin. When a user is updating their own profile,
     * this field will be silently ignored.
     */
    is_ipamadmin: boolean;
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
     * The IP Content of the DNS record.
     */
    ip_content?: string;
    /**
     * The text content of the DNS record.
     */
    text_content?: string;
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

export interface AutoComplete {
    /**
     * The ID of the item. Generally follows the format, "object_type:pk"
     * Ex: "user:A00000000" or "group:CCA-ART"
     */
    id: string;
    /**
     * The text of the item.
     */
    text: string;
}

export interface Host {
    /**
     * The MAC address of the host.
     */
    mac: string;
    /**
     * Link to api endpoint for host detail.
     */
    details: string;
    /**
     * The vendor of the host. (Ex: aruba)
     */
    vendor: string;
    /**
     * The hostname of the host.
     */
    hostname: string;
    /**
     * The expiration date of the host in ISO format.
     */
    expires: string;
    /**
     * Description of the host
     */
    description: string;
    /**
     * Whether the host is dynamic.
     */
    is_dynamic: boolean;
    /**
     * If the host is disabled or not. Very nullable
     */
    disabled_host: boolean;
    /**
     * DHCP group of the host.
     */
    dhcp_group: any[]; //TODO: create a dhcp group type
    /**
     * The associated attributes of the host.
     */
    attributes: string[];
    /**
     * object with list of leased, and static addresses
     */
    addresses: any[]; //TODO: create an address type
    /**
     * The master IP address of the host.
     */
    master_ip_address: string;
    /**
     * The users who own the host.
     */
    user_owners: string[];
    /**
     * The groups that own the host.
     */
    group_owners: string[];
    /**
     * Date object of the last time the host was changed.
     */
    changed: string;
    /**
     * The user object who last changed the host.
     */
    changed_by: User;
    /**
     * Date object of the last time the host was seen.
     */
    last_seen: string;
    /**
     * The IP address of the last time the host was seen.
     */
    last_seen_ip: string;
    /**
     * Address type of the host, dynamic or other.
     */
    address_type: string;
}

export interface Domain {
    /**
     * The ID of the domain.
     */
    id: number;
    /**
     * How the domain was last changed.
     */
    changed_by: string;
    /**
     * Object with user permissions. For each user, there is a list of permissions (strings) that the user has. So its more like a dictionary of lists.
     */
    user_perms: string[]; // TODO: create a user_perms type. It is NOT a list of strings.
    /**
     * Same as user_perms, but for groups. //TODO: create a group_perms type. It is NOT a list of strings.
     */
    group_perms: string[];
    /**
     * URL to the endpoint for domain records.
     */
    records: string;
    /**
     * The number of records in the domain.
     */
    record_count: number;
    /**
     * The name of the domain.
     */
    name: string;
    /**
     * either null of "". Not sure what this is.
     */
    master: string;
    /**
     * same with master, either null or "" no idea what this is.
     */
    last_check: string;
    /**
     * Mainly "NATIVE" not sure what else it can be.
     */
    type: string;
    /**
     * Again, no idea.
     */
    notified_serial: number;
    /**
     * Again, no idea.
     */
    account: string;
    /**
     * Description of the domain.
     */
    description: string;
    /**
     * Date object of the last time the domain was changed.
     */
    changed: string;
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
    /**
     * How many hosts were edited today.
     */
    hosts_today: number;
    /**
     * How many hosts were edited this week.
     */
    hosts_week: number;
    /**
     * How many hosts were edited this month.
     */
    hosts_month: number;
    /**
     * How many users were created today.
     */
    users_today: number;
    /**
     * How many users were created this week.
     */
    users_week: number;
    /**
     * How many users were created this month.
     */
    users_month: number;
    /**
     * How many DNS records were edited today.
     */
    dns_today: number;
    /**
     * How many DNS records were edited this week.
     */
    dns_week: number;
    /**
     * How many DNS records were edited this month.
     */
    dns_month: number;
}

export interface Host {
    /**
     * The MAC address of the host.
     */
    mac: string;
    /**
     * The API URL of the host.
     */
    details: string;
    /**
     * The vendor of the host.
     */
    vendor: string;
    /**
     * The hostname of the host.
     */
    hostname: string;
    /**
     * The expiration date of the host, in ISO format.
     */
    expires: string;
    /**
     * The optional description of the host.
     */
    description: string;
    /**
     * Whether or not the host is dynamic.
     */
    is_dynamic: boolean;
    /**
     * If the host is disabled, this will include 3 fields, 'reason', 'changed', and 'changed_by'.
     */
    disabled_host: boolean;
    /**
     * If the host has a dhcp group, this will include 3 fields, 'id', 'name', and 'description'.
     */
    dhcp_group: any[];
    /**
     * The associated attributes of the host.
     */
    attributes: string[];
    /**
     * The master IP address of the host.
     */
    master_ip_address: string;
    /**
     * The groups that own this host
     */
    group_owners: string[];
    /**
     * The user who last changed the host.
     */
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

export type UserResponse = {
    username: string;
    email: string;
    id: number;
};
