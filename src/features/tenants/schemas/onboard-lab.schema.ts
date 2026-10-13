import { z } from 'zod';

export const onboardLabSchema = z
  .object({
    labName: z
      .string()
      .min(3, 'Lab name must be at least 3 characters')
      .max(80, 'Lab name cannot exceed 80 characters')
      .regex(
        /^[a-zA-Z0-9\s.,&'-]+$/,
        'Lab name may only contain letters, numbers, spaces, and punctuation (. , & \' -)',
      ),
    city: z
      .string()
      .min(2, 'City / address must be at least 2 characters')
      .max(60, 'City / address cannot exceed 60 characters')
      .regex(
        /^[a-zA-Z0-9\s.,'-]+$/,
        'City may only contain letters, numbers, spaces, and basic punctuation',
      ),
    phoneNumber: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)',
      ),
    ownerFullName: z
      .string()
      .min(3, 'Owner full name must be at least 3 characters')
      .max(60, 'Owner full name cannot exceed 60 characters')
      .regex(
        /^[a-zA-Z\s.'-]+$/,
        'Owner name must contain letters only (no numbers or symbols)',
      ),
    ownerEmail: z
      .string()
      .email('Please enter a valid email address')
      .toLowerCase(),
    ownerPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
    planSlug: z.enum(['STARTER', 'GROWTH', 'SCALE']),
    billingCycle: z.enum(['MONTHLY', 'YEARLY']),
    paymentStatus: z.enum(['TRIAL', 'PAID']),
    utrNumber: z.string().optional().or(z.literal('')),
    notes: z.string().max(250, 'Notes cannot exceed 250 characters').optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.paymentStatus === 'PAID') {
        return Boolean(data.utrNumber && /^\d{12}$/.test(data.utrNumber.trim()));
      }
      return true;
    },
    {
      message: 'A valid 12-digit numeric Bank UTR is required for offline paid activations',
      path: ['utrNumber'],
    },
  );

export type OnboardLabFormValues = z.infer<typeof onboardLabSchema>;
