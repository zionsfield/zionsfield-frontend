import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NewSOW from "../../components/NewSOW";
import useForceUpdate from "../../hooks/useForceUpdate";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { getQueryFromObject } from "../../utils/api";
import { LinkRoutes, Role } from "../../utils/enums";
import { IClass, ISOW, ISubject, ITerm } from "../../utils/typings.d";

type Props = {};

interface FormData {
  class?: string;
  subject?: string;
  term?: string;
}

const Dashboard = (props: Props) => {
  const [schemes, setSchemes] = useState<ISOW[]>([]);
  const [classes, setClasses] = useState<IClass[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [sessions, setSessions] = useState<ITerm[]>([]);

  const user = useAppSelector((state) => state.users.user);

  const forceUpdate = useForceUpdate();

  const location = useLocation();
  const route = useNavigate();
  const [query, setQuery] = useSearchParams();

  const currentClass = query.get("class");
  const currentSubject = query.get("subject");

  const classRef = useRef<HTMLSelectElement>(null!);
  const subjectRef = useRef<HTMLSelectElement>(null!);
  const sessionRef = useRef<HTMLSelectElement>(null!);

  const { doRequest: getSchemes, errors: getSchemesErrors } = useRequest({
    url: "/api/schemes",
    method: "get",
  });

  const { doRequest: getClasses, errors: getClassesErrors } = useRequest({
    url: "/api/classes",
    method: "get",
  });

  const { doRequest: getSubjects, errors: getSubjectsErrors } = useRequest({
    url: "/api/subjects",
    method: "get",
  });

  const { doRequest: getSessions, errors: getSessionsErrors } = useRequest({
    url: "/api/sessions",
    method: "get",
  });

  const { register, watch } = useForm<FormData>();

  useEffect(() => {
    (async () => {
      const classesData = (await getClasses()).data;
      const subjectsData = (await getSubjects()).data;
      const sessionsData = (await getSessions()).data;
      setClasses(classesData);
      setSubjects(subjectsData);
      setSessions(sessionsData);
    })();
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!query.get("subject")) {
      return;
    }
    if (!query.get("class")) {
      return;
    }
    if (localStorage.getItem("session") === "select") {
      return;
    }
    const queryParams = getQueryFromObject<FormData>({
      subject: query.get("subject") || undefined,
      class: query.get("class") || undefined,
      term: localStorage.getItem("session") || undefined,
    });
    const data = (await getSchemes({}, `?${queryParams}`)).data.schemes;
    console.log(data);
    setSchemes(data);
    forceUpdate();
  };

  return (
    <div className="mt-4 max-w-7xl mx-auto space-y-2 px-3">
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Scheme of Work</h1>
        {/* user?.role === Role.TEACHER */}
        {user?.role === Role.TEACHER && (
          <div>
            {query.get("new") ? (
              <button
                className="bg-blue-400 px-2 py-1 rounded-sm text-white"
                onClick={() => route(`${LinkRoutes.DASHBOARD}`)}
              >
                All
              </button>
            ) : (
              <button
                className="bg-blue-400 px-2 py-1 rounded-sm text-white"
                onClick={() => route(`${LinkRoutes.DASHBOARD}?new=true`)}
              >
                New
              </button>
            )}
          </div>
        )}
      </div>
      {query.get("new") ? (
        <NewSOW classes={classes} subjects={subjects} sessions={sessions} />
      ) : (
        <div>
          <form onSubmit={onSubmit} className="mt-3">
            <div className="flex space-x-2 mb-3">
              <select
                id="class"
                defaultValue={query.get("class") || "select"}
                {...register("class")}
                ref={classRef}
                onChange={(e) =>
                  route(
                    `${LinkRoutes.DASHBOARD}?class=${e.target.value}${
                      currentSubject ? `&subject=${currentSubject}` : ""
                    }`
                  )
                }
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
                defaultValue={query.get("subject") || "select"}
                {...register("subject")}
                ref={subjectRef}
                onChange={(e) =>
                  route(
                    `${LinkRoutes.DASHBOARD}?subject=${e.target.value}${
                      currentClass ? `&class=${currentClass}` : ""
                    }`
                  )
                }
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
                ref={sessionRef}
                onChange={(e) =>
                  localStorage.setItem("session", e.target.value)
                }
                defaultValue={localStorage.getItem("session") || "select"}
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
            {getSchemesErrors.map((e, i) => (
              <p key={i + 1} className="text-red-500">
                {" "}
                - {e.message}
              </p>
            ))}
            <div className="flex space-x-0 md:space-x-2 mb-3 flex-col md:flex-row md:items-center">
              <input
                type="submit"
                value="Search"
                className="md:flex-1 border rounded py-2 bg-blue-400 text-white cursor-pointer"
              />
            </div>
          </form>
          {schemes.length > 0 ? (
            <div>
              {schemes?.map((scheme) => (
                <div key={scheme.id}>{scheme.content}</div>
              ))}
            </div>
          ) : (
            <div>Please select subject, class and session</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
