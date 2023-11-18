import { EntryAlreadyExistsError } from "ldapjs";
import { Application, getRepository } from "./database/application";
import { AddUserParams, addUser } from "./ldap";
import { notifyApproval } from "./slack/post";

export const approveApplication = async (token: string): Promise<boolean> => {
  const repository = await getRepository();
  const application = await repository.getApplicationByToken(token);

  if (application === null) {
    return false;
  }

  const params: AddUserParams = applicationToParams(application);

  const success = await addUser(params, { replaceEmpty: true });

  if (success) {
    await repository.deleteEntry(application.token);
    await notifyApproval(application);
    console.log(
      `approveApplication: Approved application from ${application.loginName} and notified to slack.`
    );
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
