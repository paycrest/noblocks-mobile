import * as yup from "yup";

import { signupSchema } from "@/schema/authschema";

export type ISignUp = yup.InferType<typeof signupSchema>;
