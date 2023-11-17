import { EntryAlreadyExistsError } from "ldapjs";
import { Application, getRepository } from "./database/application";
import { AddUserParams, addUser } from "./ldap";

export const approveApplication = async (token: string): Promise<boolean> => {
  const repository = await getRepository();
  const application = await repository.getApplicationByToken(token);

  if (application === null) {
    return false;
  }

  const params: AddUserParams = applicationToParams(application);

  const success = await addUser(params);

  if (success) {
    await repository.deleteEntry(application.token);
  }

  return success;
};

export const declineApplication = async (token: string): Promise<boolean> => {
  const repository = await getRepository();
  await repository.deleteEntry(token);
  return true;
};

const applicationToParams = (application: Application): AddUserParams => {
  console.log("applicationToParams: converting application:", application);

  const { loginName, email, passwordHash } = application;
  const params: AddUserParams = {
    loginName,
    email,
    passwd: passwordHash,
  };

  console.log("applicationToParams: output params:", params);

  return params;
};
