import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import { getQueryFromObject } from "../utils/api";
import { LinkRoutes } from "../utils/enums";
import { IClass, ISubject, ITerm } from "../utils/typings";

type Props = {
  classes: IClass[];
  subjects: ISubject[];
  sessions: ITerm[];
};

interface FormData {
  class: string;
  subject: string;
  term: string;
  content: string;
}

const NewSOW = ({ classes, subjects, sessions }: Props) => {
  const route = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { doRequest: newScheme, errors: newSchemeErrors } = useRequest({
    url: "/api/schemes",
    method: "post",
    onSuccess: () => route(LinkRoutes.DASHBOARD),
  });

  const onSubmit = handleSubmit(async (formData) => {
    if (formData.class === "select") return;
    if (formData.subject === "select") return;
    if (formData.term === "select") return;
    console.log(formData);
    await newScheme(formData);
  });

  function auto_grow(element: HTMLTextAreaElement) {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="mt-3">
        <div className="flex space-x-2 mb-3">
          <select
            id="class"
            defaultValue={"select"}
            {...register("class")}
            className="shadow block border rounded px-3 py-2 outline-none flex-1"
          >
            <option value="select">Select Class</option>
            {classes?.map((className) => (
              <option key={className.id} value={className.id}>
                {className.className}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2 mb-3">
          <select
            id="subject"
            defaultValue={"select"}
            {...register("subject")}
            className="shadow block border rounded px-3 py-2 outline-none flex-1"
          >
            <option value="select">Select Subject</option>
            {subjects?.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2 mb-3">
          <select
            id="session"
            {...register("term")}
            defaultValue={"select"}
            className="shadow block border rounded px-3 py-2 outline-none flex-1"
          >
            <option value="select">Select Session</option>
            {sessions?.map((session) => (
              <option key={session.id} value={session.id}>
                {session.startYear} / {session.endYear}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2 mb-3">
          <textarea
            {...register("content")}
            onInput={(e) => auto_grow(e.currentTarget)}
            className="resize-none overflow-hidden shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-blue-400 outline-none focus:ring"
            rows={8}
          ></textarea>
        </div>
        {newSchemeErrors?.map((e, i) => (
          <p key={i + 1} className="text-red-500">
            {" "}
            - {e.message}
          </p>
        ))}
        <div className="flex space-x-0 md:space-x-2 mb-3 flex-col md:flex-row md:items-center">
          <input
            type="submit"
            value="New Scheme of Work"
            className="md:flex-1 border rounded py-2 bg-blue-400 text-white cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default NewSOW;
