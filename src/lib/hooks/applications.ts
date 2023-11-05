import { useEffect, useState } from "react";
import { Application } from "../database/application";
import axios from "axios";

const API_PATH_APPLICATIONS = "/api/register/applications";

export const useApplications = (): Application[] | null => {
  const [applicatinos, setApplications] = useState<Application[] | null>(null);

  useEffect(() => {
    const getApplications = async () => {
      const resp = await axios.get(API_PATH_APPLICATIONS, {
        withCredentials: true,
      });
      console.log("useApplications: typefo data =", typeof resp.data);
      console.log("useApplications: data", resp.data);

      setApplications(resp.data.applications);
    };

    getApplications();
  }, []);

  return applicatinos;
};
