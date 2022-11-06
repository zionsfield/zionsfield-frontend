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

interface FormData2 {
  content: string;
}

const Dashboard = (props: Props) => {
  const [scheme, setScheme] = useState<ISOW>(null!);
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

  const { doRequest: newSession, errors: newSessionsErrors } = useRequest({
    url: "/api/sessions",
    method: "post",
  });

  const { doRequest: editScheme, errors: editSchemeErrors } = useRequest({
    url: "/api/schemes",
    method: "put",
  });

  const { doRequest: deleteScheme, errors: deleteSchemeErrors } = useRequest({
    url: "/api/schemes",
    method: "delete",
  });

  const [content, setContent] = useState("");
  const [classSelect, setClass] = useState(
    localStorage.getItem("class") || "select"
  );
  const [subjectSelect, setSubject] = useState(
    localStorage.getItem("subject") || "select"
  );
  const [sessionSelect, setSession] = useState(
    localStorage.getItem("session") || "select"
  );

  const loadSchemes = async () => {
    const queryObject: FormData = {
      subject: localStorage.getItem("subject") || undefined,
      class: localStorage.getItem("class") || undefined,
      term: localStorage.getItem("session") || undefined,
    };
    console.log(queryObject);
    const queryParams = getQueryFromObject<FormData>(queryObject);
    console.log(queryParams);
    const data2 = (await getSchemes({}, `?${queryParams}`)).data;
    console.log(data2);
    setScheme(data2);
    setContent(data2.content);
  };

  // const {
  //   register,
  //   watch,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormData2>();

  useEffect(() => {
    (async () => {
      const classesData = (await getClasses()).data;
      const subjectsData = (await getSubjects()).data;
      const sessionsData = (await getSessions()).data;
      setClasses(classesData);
      setSubjects(subjectsData);
      setSessions(sessionsData);
      const cachedClass = localStorage.getItem("class");
      const cachedSubject = localStorage.getItem("subject");
      if (
        cachedClass &&
        cachedSubject &&
        cachedClass !== "null" &&
        cachedSubject !== "null"
      ) {
        route(
          `${LinkRoutes.DASHBOARD}?class=${cachedClass}&subject=${cachedSubject}`
        );
        await loadSchemes();
      }
    })();
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log(query.get("subject"));
    if (!query.get("subject") || query.get("subject") === "null") {
      return;
    }
    if (!query.get("class") || query.get("class") === "null") {
      return;
    }
    if (localStorage.getItem("session") === "select") {
      return;
    }

    await loadSchemes();
    forceUpdate();
  };

  const onSubmit2 = async (e: any) => {
    if (
      !query.get("edit") ||
      !query.get("subject") ||
      !query.get("class") ||
      !localStorage.getItem("session")
    )
      return;
    const data = {
      subject: query.get("subject"),
      class: query.get("class"),
      term: localStorage.getItem("session"),
      content,
    };

    await editScheme(data, `/${query.get("edit")}`);
    await loadSchemes();
    forceUpdate();
  };

  function auto_grow(element: HTMLTextAreaElement) {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  return (
    <div className="mt-4 max-w-7xl mx-auto space-y-2 px-3">
      <div className="flex space-x-3 md:justify-between items-center">
        <h1 className="font-bold text-xl md:text-2xl">Scheme of Work</h1>
        {/* user?.role === Role.TEACHER */}
        {user?.role === Role.TEACHER && (
          <div>
            {query.get("new") ? (
              <button
                className="bg-blue-400 px-2 py-1 rounded-sm text-white"
                onClick={() => route(`${LinkRoutes.DASHBOARD}`)}
              >
                All Schemes
              </button>
            ) : (
              <button
                className="bg-blue-400 px-2 py-1 rounded-sm text-white"
                onClick={() => route(`${LinkRoutes.DASHBOARD}?new=true`)}
              >
                New Scheme
              </button>
            )}
          </div>
        )}
        {user?.role === Role.TEACHER && (
          <div>
            <button
              className="bg-blue-400 px-2 py-1 rounded-sm text-white"
              onClick={() => newSession()}
            >
              New Session
            </button>
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
                value={classSelect}
                ref={classRef}
                onChange={(e) => {
                  localStorage.setItem("class", e.target.value);
                  setClass(e.target.value);
                  route(
                    `${LinkRoutes.DASHBOARD}?class=${e.target.value}${
                      currentSubject ? `&subject=${currentSubject}` : ""
                    }`
                  );
                }}
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
                value={subjectSelect}
                ref={subjectRef}
                onChange={(e) => {
                  localStorage.setItem("subject", e.target.value);
                  setSubject(e.target.value);
                  route(
                    `${LinkRoutes.DASHBOARD}?subject=${e.target.value}${
                      currentClass ? `&class=${currentClass}` : ""
                    }`
                  );
                }}
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
                ref={sessionRef}
                onChange={(e) => {
                  localStorage.setItem("session", e.target.value);
                  setSession(e.target.value);
                }}
                value={sessionSelect}
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
          <div className="">
            {scheme ? (
              <div className="">
                <div key={scheme.id} className="flex-col flex">
                  {user?.role === Role.TEACHER && (
                    <div className="w-full flex justify-end space-x-3">
                      {query.get("edit") ? (
                        <button
                          onClick={(e) => {
                            onSubmit2(e);
                            route(
                              `${LinkRoutes.DASHBOARD}?subject=${currentSubject}&class=${currentClass}`
                            );
                          }}
                          className=" z-50 bg-blue-500 right-10 px-2 py-1 text-white rounded-md"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={(e) =>
                            route(
                              `${LinkRoutes.DASHBOARD}?edit=${scheme.id}${
                                currentSubject
                                  ? `&subject=${currentSubject}`
                                  : ""
                              }${currentClass ? `&class=${currentClass}` : ""}`
                            )
                          }
                          className="self-end z-50 bg-blue-500 right-10 px-2 py-1 text-white rounded-md"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={async (e) => {
                          await deleteScheme({}, `/${scheme.id}`);
                          route(LinkRoutes.DASHBOARD);
                          window.location.reload();
                        }}
                        className="z-50 bg-blue-500 right-10 px-2 py-1 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {query.get("edit") === scheme.id &&
                  user?.role === Role.TEACHER ? (
                    <textarea
                      onInput={(e) => auto_grow(e.currentTarget)}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="resize-none overflow-hidden shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-blue-400 outline-none focus:ring"
                      rows={8}
                    ></textarea>
                  ) : (
                    <div>
                      {scheme.content
                        .split("\n")
                        .map((line, i) =>
                          line == "" ? (
                            <br key={i + 1} />
                          ) : (
                            <p key={i + 1}>{line}</p>
                          )
                        )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-col flex">
                {/* <button className="self-end z-50 bg-blue-500 right-10 px-2 py-1 text-white rounded-md">
                  Edit
                </button> */}
                {query.get("class") && query.get("subject") ? (
                  <p>No scheme of work here</p>
                ) : (
                  <p>Please select subject, class and session</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
