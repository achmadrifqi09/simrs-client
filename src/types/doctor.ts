type DoctorPractice = {
    name: string,
    code: string,
    first_practice_hour: string,
    first_remaining_quota: number,
    first_total_quota: number,
    second_practice_hour: string,
    second_remaining_quota: number,
    second_total_quota: number,
    is_off: boolean
    schedules: DoctorSchedules[]
}

type DoctorSchedules = {
    day: number,
    is_off: boolean,
    practice_hours: PracticeHour[]
}

type PracticeHour = {
    open_practice_hour: string,
    close_practice_hour: string,
}

export type {DoctorPractice, PracticeHour, DoctorSchedules}
