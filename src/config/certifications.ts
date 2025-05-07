export const CERTIFICATIONS = {
    NASM_CERTIFIED: 'NASM Certified',
    RED_CROSS_LIFEGUARD: 'Red Cross Lifeguard',
    WAKEBOARD_INSTRUCTOR_LEVEL_1: 'Wakeboard Instructor Level 1',
    ACA_WATER_SAFETY: 'ACA Water Safety Instructor',
    ACA_WAKESURF: 'ACA Wake Surf Certification'
  } as const;
  
  export type CertificationKey = keyof typeof CERTIFICATIONS;
  export type CertificationValue = typeof CERTIFICATIONS[CertificationKey];