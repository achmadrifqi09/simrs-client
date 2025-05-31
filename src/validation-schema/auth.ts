import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username tidak boleh kosong" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export { loginSchema };
