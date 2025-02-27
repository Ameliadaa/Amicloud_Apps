

"use client";
import withAuth from "@/components/AuthProvider";
import useRoleManagement from "@/hooks/role";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";

function AddRole() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const { addRole, error, isLoading } = useRoleManagement();


  const handleSave = async (data) => {
    try {
      await addRole(data);
      router.push("/Dashboard/management-role?success=true");
    } catch (error) {
      setError("name", {
        type: "manual",
        message: error.response.data.errors.name[0],
      });
      console.error("Gagal memperbarui profil:", error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    router.push("/Dashboard/management-role");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col justify-start items-start mb-6">
        <h1 className="text-xl font-bold text-primary mt-2">
          Add Role
        </h1>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-3xl">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
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
              onClick={(e) => handleCancel(e)}
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

export default withAuth(AddRole, 'admin');
