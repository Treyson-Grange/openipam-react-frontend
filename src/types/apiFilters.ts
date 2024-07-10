// Filter interfaces for API list endpoints

import { AdvancedFilterParams } from "./api";

export enum PythonBoolString {
    true = "True",
    false = "False",
}

/**
 * Serialize a boolean value to a Python boolean string, since our API is Python-based.
 * This should only be necessary for query parameters, as any body data will be JSON.
 * @param value The boolean value to serialize
 * @returns The Python boolean string (True or False)
 */
export function serializeBoolean(value: boolean): PythonBoolString {
    return value ? PythonBoolString.true : PythonBoolString.false;
}

export type JobFilter = Partial<{
    id: string;
    scheduled_time__gte: string;
    scheduled_time__lte: string;
    command: string;
    device: number;
}>;

export type JobStatusFilter = Partial<{
    job: number;
    success: boolean;
}>;

export type FirmwareFilter = Partial<{
    id: number;
    filename: string;
    name: string;
}>;

export type DiscoverGroupFilter = Partial<{
    id: number;
    ipamgroup: string;
    username: string;
}>;

export enum DeviceOrdering {
    ID = "id",
    Host = "host",
    Model = "model",
    Version = "version",
    IP = "ip",
    Vendor = "vendor",
    Location = "location",
    PrimaryFlash = "primary_flash",
    LastUpdateSuccess = "lastupdatesuccess",
    LastUpdateError = "lastupdateerror",
    LastUpdate = "lastupdate",
    DeviceConfig = "device_config",
    Serial = "serial",
    SSH = "ssh",
    SecondaryFlash = "secondary_flash",
}

export enum DeviceVendor {
    Aruba = "Aruba",
    Brocade = "Brocade/Foundry",
    HPE = "HPE/Aruba",
    Juniper = "Juniper Networks",
    Ubiquiti = "Ubiquiti airOS",
    Unknown = "unknown (failed discovery)",
}

export type DeviceFilter = AdvancedFilterParams<
    Partial<{
        id: string;
        host: string;
        model: string;
        version: string;
        ip: string;
        vendor: DeviceVendor;
        location: string;
        primary_flash: string;
        lastupdatesuccess: boolean;
        lastupdateerror: string;
        lastupdate__gte: string;
        lastupdate__lte: string;
        device_config: string;
        serial: string;
    }>
>;

export type LogFilter = Partial<{
    device: number;
    severity: number;
    message: string;
    job: string;
    stamp__gte: string;
    stamp__lte: string;
}>;

export type InterfaceFilter = Partial<{
    /**
     * The ID of the device to filter interfaces by.
     */
    device: number;
    /**
     * The SNMP ID of the interface.
     */
    snmpid: string;
    /**
     * The name of the interface.
     */
    name: string;
    /**
     * The description of the interface.
     */
    description: string;
    /**
     * The link speed of the interface.
     */
    speed: number;
}>;

export enum InterfaceOrdering {
    SNMPID = "snmpid",
    Name = "name",
    Description = "description",
    Speed = "speed",
    IsEnabled = "is_enabled",
    IsOperational = "is_operational",
}
