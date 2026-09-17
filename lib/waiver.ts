/** Bump this whenever the waiver wording changes — accepted consents keep
 *  the version they were signed under so old PDFs stay accurate. */
export const WAIVER_VERSION = "2026-v1";

export interface WaiverSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export const WAIVER_TITLE = "Fort McKay First Nation Fitness Centre — Waiver Agreement";

export const WAIVER_SECTIONS: WaiverSection[] = [
  {
    heading: "Fitness Center Guidelines",
    bullets: [
      "Guest must be 16 years old to use the Fitness Center.",
      "Youth aged 12-15 are permitted to use the facility if they are actively supervised by an individual over 18yrs.",
      "Do not visit the facility if you are suffering from a cold, flu, etc.",
      "Person under the influence of intoxicants will not be allowed into the facility. Consumption of alcohol or illegal drugs on the premises is not permitted.",
      "Smoking or vaping is not permitted.",
      "Protect your belongings by securing them in a locker.",
      "Eating or drinking inside the Fitness Centre or studio is not permitted. Except water bottles in capped bottle.",
      "Use of equipment is on a first-come, first-serve basis.",
      "Weight plates are not to be leaned against stands, walls or machines.",
      "Return equipment to the original storage location after use.",
      "Wipe down the equipment after use, using the wipes provided.",
      "Immediately report any faulty equipment or any vandalism to our Fitness attendant.",
    ],
  },
  {
    heading: "Waiver Agreement",
    paragraphs: [
      "This Waiver Agreement acknowledges the risks associated with participation in activities at the Fort McKay First Nation Fitness Centre, including but not limited to physical injury, muscle strains, sprains, or other health-related impacts due to the nature of exercise and gym usage.",
    ],
  },
  {
    heading: "Participant Acknowledgments",
    paragraphs: ["By signing this agreement, I, the Participant, acknowledge the following:"],
    bullets: [
      "I confirm that I am in good health and do not have any medical conditions that could interfere with my ability to participate in fitness activities. I will provide emergency contact details and information regarding any allergies I may have prior to participation.",
      "I understand that it is my responsibility to seek a medical examination if I have any concerns regarding my health before participating in the activities at the Fitness Centre.",
      "I agree not to enter the gym area when there is no attendant present to ensure the availability of assistance in case of emergency.",
      "I commit to respecting the privacy of other members. I will not take photos or videos that include other participants without their express consent, especially in situations where their clothing or shoes may be visible.",
      "I will refrain from using any drugs or alcohol on the premises to ensure a safe environment for myself and other members.",
      "I acknowledge that the fitness activities carry inherent risks and I accept full responsibility for any injuries that may occur as a result of my participation.",
    ],
  },
  {
    heading: "Emergency Contact Information",
    paragraphs: [
      "I will provide an up-to-date emergency contact number to the Fitness Centre staff before starting my activities, ensuring that in case of any unforeseen events, assistance can be provided promptly.",
    ],
  },
  {
    heading: "Acceptance of Terms",
    paragraphs: [
      "By signing this waiver, I am voluntarily giving up my right to claim against Fort McKay First Nation for any injuries or damages incurred while participating in fitness activities. I confirm that I have read this waiver carefully, fully understand its contents, and agree to comply with all terms outlined herein.",
    ],
    bullets: [
      "I acknowledge that this waiver will remain in effect throughout all my activities at the Fort McKay First Nation Fitness Centre.",
      "I affirm that I am in good health and free from any medical conditions that would prohibit my participation in activities at the Fort McKay First Nation Fitness Centre. I understand that I should consult with a healthcare professional if I have any concerns regarding my health before using the facilities.",
      "I acknowledge that I am aware of the risks involved in participating in fitness activities, including but not limited to muscle strains, sprains, and other injuries that may occur as a result of my participation. I agree to assume all risks associated with these activities.",
      "I agree that I will not use any drugs or alcohol prior to or during my time at the Fitness Centre. I understand that doing so could impair my ability to safely participate in activities and may pose a risk to myself and others.",
      "I acknowledge that I will not take photographs or videos inside the Fitness Centre that could inadvertently capture the image of other members without their consent. I understand and respect the privacy of others while using the facilities.",
      "I confirm that I will not enter the Fitness Centre unless an attendant is present, understanding that my safety is a shared responsibility.",
      "I agree to provide emergency contact information prior to using the Fitness Centre and acknowledge that it is my responsibility to inform the staff of any allergies or medical conditions that could affect my participation in activities.",
      "I acknowledge that the Fort McKay First Nation Fitness Centre and its employees are not liable for any injuries or accidents that may occur because of my negligence or failure to follow safety protocols.",
    ],
  },
];
