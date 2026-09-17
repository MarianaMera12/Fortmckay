export type MembershipStatus = "active" | "paused" | "inactive";

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  membership_status: MembershipStatus;
  member_id: string | null;
  date_of_birth: string | null;
  address: string | null;
  medical_info: string | null;
  created_at: string;
}

export interface Attendance {
  id: string;
  member_id: string;
  check_in: string;
  check_out: string | null;
}

export interface AttendanceWithMember extends Attendance {
  members: Pick<Member, "first_name" | "last_name" | "phone" | "member_id"> | null;
}

export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  date: string;        // YYYY-MM-DD
  start_time: string;  // HH:MM:SS
  end_time: string;    // HH:MM:SS
  capacity: number;
  created_at: string;
}

export interface ClassWithCount extends GymClass {
  reserved: number;
}

export type ReservationStatus = "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  class_id: string;
  name: string;
  phone: string;
  email: string;
  status: ReservationStatus;
  created_at: string;
}

export interface MemberInput {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  membership_status: MembershipStatus;
  member_id: string;
  date_of_birth: string;
  address: string;
  medical_info: string;
}

export interface Consent {
  id: string;
  member_id: string;
  full_name: string;
  email: string | null;
  phone: string;
  date_of_birth: string | null;
  address: string | null;
  medical_info: string | null;
  waiver_version: string;
  accepted_at: string;
}

export interface ClassInput {
  name: string;
  instructor: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
}

export interface ReservationInput {
  name: string;
  phone: string;
  email: string;
}

export interface DashboardStats {
  occupancy: number;
  visitsToday: number;
  visitsThisWeek: number;
  avgDailyVisits: number;
  hourly: { hour: string; visits: number }[];
  topClasses: { name: string; reservations: number }[];
}
