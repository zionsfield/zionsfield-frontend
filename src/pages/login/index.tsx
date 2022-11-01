import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { LinkRoutes, Role } from "../../utils/enums";

type Props = {};

interface FormData {
  username: string;
  password: string;
}

const Login = (props: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const route = useNavigate();
  const roleRef = useRef<HTMLSelectElement>(null!);
  const { doRequest: login, errors: loginErrors } = useRequest({
    url: `/api/users/signin`,
    method: "post",
  });

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    console.log(roleRef.current.value);
    await login(formData, `?role=${roleRef?.current?.value}`);

    console.log(loginErrors);
    route(LinkRoutes.DASHBOARD);
    window.location.reload();
  });

  return (
    <div className="my-16">
      <h1 className="text-3xl font-bold text-center">Login</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center my-5 space-y-5 px-5"
      >
        <div className="flex space-x-12 w-full items-center">
          <span className="flex-shrink-0">Login as </span>
          <select
            ref={roleRef}
            className="border rounded shadow px-4 py-3 flex-1 mt-1 outline-none"
          >
            <option value={Role.STUDENT}>Student</option>
            <option value={Role.TEACHER}>Teacher</option>
          </select>
        </div>
        <div className="flex space-x-14 w-full items-center">
          <span>Username</span>
          <input
            type="text"
            {...register("username", { required: true })}
            placeholder="Enter username"
            className="border rounded shadow px-4 py-3 flex-1 mt-1 outline-none"
          />
        </div>
        {errors.username?.type === "required" && (
          <p className="text-red-500"> - Username is required</p>
        )}
        <div className="flex space-x-6 w-full items-center">
          <span>Password</span>
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Enter password"
            className="border rounded shadow px-4 py-3 flex-1 mt-1 outline-none"
          />
        </div>
        {errors.password?.type === "required" && (
          <p className="text-red-500"> - Password is required</p>
        )}
        {loginErrors.map((e, i) => (
          <p key={i + 1} className="text-red-500">
            - {e.message}
          </p>
        ))}
        <input
          type="submit"
          value="Login"
          className="w-full border rounded py-2 bg-blue-400 text-white cursor-pointer mx-5"
        />
      </form>
    </div>
  );
};

export default Login;
