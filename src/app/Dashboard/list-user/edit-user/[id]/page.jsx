"use client";
import withAuth from "@/components/AuthProvider";
import useRoleManagement from "@/hooks/role";
import { useUpdateUser, useUsers } from "@/hooks/users";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Edituser() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const { roleList } = useRoleManagement();

  // const { user, isUserLoading } = useGetUserById(userId);

  const { users, isUserLoading, getUserById } = useUsers();

  const { updateUser } = useUpdateUser(userId);

  useEffect(() => {
    const fetchUser = async () => {
      if (users) {
        const user = await getUserById(userId);
        setUser(user);
        reset(user);
      }
    };

    fetchUser();
  }, [users]);

  const handleSave = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        full_name: data.full_name,
        email: data.email,
        username: data.username,
        password: data.password,
        password_confirmation: data.confirmPassword,
        roles: [data.role],
      }
      await updateUser(payload);
      router.push("/Dashboard/list-user?success=true");
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/Dashboard/list-user");
  };

  return (
    <div className="p-6 min-h-screen">
      <p></p>
      <div className="flex flex-col justify-start items-start mb-6">
        <h1 className="text-xl font-bold text-primary mt-2">
          Edit User
        </h1>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-3xl">
        <form className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("full_name", { required: "Full name is required" })}
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("username", { required: "username is required" })}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>


          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm-password"
              {...register("confirmPassword", {
                required: "Password confirmation is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <select
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("role", {
                required: "Role name is required",
              })}
            >
              {roleList?.data.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>


          <div className="flex justify-start items-start gap-4">
            <button
              onClick={handleSubmit(handleSave)}
              className="bg-secondary text-black hover:text-white px-6 py-2 rounded-2xl hover:bg-primary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default withAuth(Edituser, 'admin');