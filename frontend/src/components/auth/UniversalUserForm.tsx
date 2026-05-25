import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  type Class,
  type UserRole,
  type pagination,
  type subject,
  type user,
} from "@/types";

import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { api } from "@/lib/api";
import { CustomSelect } from "@/components/global/CustomSelect";
import { CustomMultiSelect } from "@/components/global/CustomMultiSelect";

export type FormType = "login" | "create" | "update";

interface Props {
  type: FormType;
  initialData?: user | null;
  onSuccess?: () => void;
  role?: UserRole;
}

/* ---------------- SCHEMA ---------------- */
const createSchema = (type: FormType) =>
  z
    .object({
      name:
        type === "login"
          ? z.string().optional()
          : z.string().min(2, "Name is required"),

      classId: z.string().optional(),
      subjectIds: z.array(z.string()).optional(),

      email: z.string().email("Invalid email address"),

      role: z.string().optional(),

      password:
        type === "update"
          ? z
              .string()
              .optional()
              .refine((val) => !val || val.length >= 6, {
                message: "Password must be at least 6 characters",
              })
          : z.string().min(6, "Password must be at least 6 characters"),

      confirmPassword:
        type === "create"
          ? z.string().min(6, "Password must be at least 6 characters")
          : z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        type === "create" &&
        data.password !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
    });

type FormValues = z.infer<ReturnType<typeof createSchema>>;

/* ---------------- COMPONENT ---------------- */
const UniversalUserForm = ({
  type,
  initialData,
  onSuccess,
  role,
}: Props) => {
  const navigate = useNavigate();

  const isUpdate = type === "update";
  const isLogin = type === "login";

  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createSchema(type)),
    defaultValues: {
      name: "",
      email: "",
      role: role || "",
      password: "",
      classId: "",
      subjectIds: [],
      confirmPassword: "",
    },
  });

  /* ---------------- FETCH CLASSES ---------------- */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const { data } = (await api.get("/classes")) as {
          data: { classes: Class[]; pagination: pagination };
        };
        setClasses(data.classes);
      } catch {
        if (!isLogin) toast.error("Failed to load Classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [isLogin]);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingOptions(true);
        const { data } = (await api.get("/subjects")) as {
          data: { subjects: subject[]; pagination: pagination };
        };
        setSubjects(data.subjects);
      } catch {
        if (!isLogin) toast.error("Failed to load subjects");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchSubjects();
  }, [isLogin]);

  /* ---------------- RESET FORM ---------------- */
  useEffect(() => {
    if (initialData && isUpdate) {
      const existingClassId =
        typeof initialData.studentClass === "object"
          ? initialData.studentClass?._id
          : initialData.studentClass;

      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "",
        password: "",
        confirmPassword: "",
        classId: existingClassId || "",
        subjectIds:
          initialData.teacherSubjects?.map((s) => s._id) || [],
      });
    }
  }, [initialData, isUpdate]);

  /* ---------------- SUBMIT ---------------- */
  async function onSubmit(data: FormValues) {
    try {
      const payload = {
        ...data,
        studentClass: data.classId || undefined,
        teacherSubjects: data.subjectIds || [],
      };

      /* LOGIN */
      if (isLogin) {
        const { data: user } = await api.post("/users/login", {
          email: data.email,
          password: data.password,
        });

        console.log(user);
        toast.success("Logged in successfully");

        navigate("/dashboard");
        return;
      }

      /* CREATE */
      if (type === "create") {
        await api.post("/users/register", payload);
        toast.success("Account created successfully!");
        onSuccess?.();
      }

      /* UPDATE */
      if (type === "update" && initialData?._id) {
        await api.put(`/users/update/${initialData._id}`, payload);
        toast.success("User updated successfully");
        onSuccess?.();
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  }

  /* ---------------- OPTIONS ---------------- */
  const classOptions = classes.map((c) => ({
    label: c.name,
    value: c._id,
  }));

  const subjectOptions = subjects.map((s) => ({
    label: s.name,
    value: s._id,
  }));

  const roleOptions = role ? [{ label: role, value: role }] : [];

  const pending = form.formState.isSubmitting;

  const showRoleSelector = !isLogin;
  const showClassSelector = !isLogin && role === "student";
  const showSubjectSelector = !isLogin && role === "teacher";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4 w-full">

          {!isLogin && (
            <CustomInput
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Jane Doe"
              disabled={pending}
            />
          )}

          {showRoleSelector && (
            <CustomSelect
              control={form.control}
              name="role"
              label="Role"
              placeholder="Select role"
              options={roleOptions}
              disabled={pending}
            />
          )}

          <div className="col-span-2 space-y-2">

            {showClassSelector && (
              <CustomSelect
                control={form.control}
                name="classId"
                label="Class"
                placeholder="Select Class"
                options={classOptions}
                disabled={pending}
                loading={loading}
              />
            )}

            {showSubjectSelector && (
              <CustomMultiSelect
                control={form.control}
                name="subjectIds"
                label="Subjects"
                placeholder="Select subjects..."
                options={subjectOptions}
                loading={loadingOptions}
                disabled={pending}
              />
            )}

            <CustomInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="m@example.com"
              disabled={pending}
            />
          </div>

          <div className="col-span-2">
            <CustomInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder={isUpdate ? "New Password (Optional)" : "Password"}
              disabled={pending}
            />
          </div>

          {type === "create" && (
            <div className="col-span-2">
              <CustomInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
                disabled={pending}
              />
            </div>
          )}

          <div className="col-span-2 mt-2">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending
                ? "Processing..."
                : type === "login"
                ? "Sign In"
                : type === "create"
                ? "Create Account"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
};

export default UniversalUserForm;