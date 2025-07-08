import { superdevClient } from "@/lib/superdev/client";

export const MedicalScan = superdevClient.entity("MedicalScan");
export const User = superdevClient.auth;
