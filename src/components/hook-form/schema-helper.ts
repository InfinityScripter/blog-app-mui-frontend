import dayjs from "dayjs";
import { z as zod } from "zod";

// ----------------------------------------------------------------------

interface SchemaHelperMessage {
  required_error?: string;
  invalid_type_error?: string;
}

interface SchemaHelperProps {
  message?: SchemaHelperMessage;
}

interface PhoneNumberProps extends SchemaHelperProps {
  isValidPhoneNumber?: (text: string) => boolean;
}

interface FilesProps extends SchemaHelperProps {
  minFiles?: number;
}

// ----------------------------------------------------------------------

export const schemaHelper = {
  /**
   * Phone number
   * defaultValue === null
   */
  phoneNumber: (props?: PhoneNumberProps) =>
    zod
      .string()
      .min(1, {
        message: props?.message?.required_error ?? "Phone number is required!",
      })
      .refine((data) => props?.isValidPhoneNumber?.(data), {
        message: props?.message?.invalid_type_error ?? "Invalid phone number!",
      }),
  /**
   * date
   * defaultValue === null
   */
  date: (props?: SchemaHelperProps) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required_error ?? "Date is required!",
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.invalid_type_error ?? "Invalid Date!!",
          });
        }

        return date;
      })
      .pipe(zod.union([zod.string(), zod.null()])),
  /**
   * editor
   * defaultValue === '' | <p></p>
   */
  editor: (props?: SchemaHelperProps) =>
    zod.string().min(8, {
      message: props?.message?.required_error ?? "Editor is required!",
    }),
  /**
   * object
   * defaultValue === null
   */
  objectOrNull: (props?: SchemaHelperProps) =>
    zod
      .custom()
      .refine((data) => data !== null, {
        message: props?.message?.required_error ?? "Field is required!",
      })
      .refine((data) => data !== "", {
        message: props?.message?.required_error ?? "Field is required!",
      }),
  /**
   * boolean
   * defaultValue === false
   */
  boolean: (props?: SchemaHelperProps) =>
    zod.coerce.boolean().refine((bool) => bool === true, {
      message: props?.message?.required_error ?? "Switch is required!",
    }),
  /**
   * file
   * defaultValue === '' || null
   */
  file: (props?: SchemaHelperProps) =>
    zod.custom().transform((data, ctx) => {
      const hasFile =
        data instanceof File || (typeof data === "string" && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? "File is required!",
        });
        return null;
      }

      return data;
    }),
  /**
   * files
   * defaultValue === []
   */
  files: (props?: FilesProps) =>
    zod.array(zod.custom()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 2;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? "Files is required!",
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Must have at least ${minFiles} items!`,
        });
      }

      return data;
    }),
};
