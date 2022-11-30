import { UserController } from "../controllers";

import { Router } from "express";

const UserRouter = Router();

/**
 * A User
 * @typedef {object} UserUpdateBody
 * @property {integer} id.required - uniqid - int64
 * */
/**
 * A User
 * @typedef {object} User
 * @property {integer} id - uniqid - int64
 * @property {string} fullName.required - full name
 * @property {string} birthDate - bith date in format YYYY-MM-DD
 * @property {string} email.required - Valid email
 * @property {string} username - Valid email
 * @property {string} status.required - Valid status enum:active,suspended,archived
 */
/**
 * POST /v1/add-user-account
 * @summary Add a new user account
 * @tags Users
 * @param {User} request.body.required - user info - application/json
 * @return {User} 200 - success response - application/json
 */
UserRouter.post("/add-user-account", UserController.addUserAccount);
/**
 * GET /v1/list-user-accounts
 * @summary Get list of user accounts
 * @tags Users
 * @return {array<User>} 200 - success response - application/json
 */
UserRouter.get("/list-user-accounts", UserController.listUseAccounts);
/**
 * PUT /v1/update-user-account
 * @summary update user account
 * @tags Users
 * @param {User} request.body.required - user info - application/json
 * @return {object} 200 - success response - application/json
 */
UserRouter.put("/update-user-account", UserController.updateUserAccount);
/**
 * DELETE /v1/remove-user-account
 * @summary Remove user account
 * @tags Users
 * @param {UserUpdateBody} request.body.required - user info - application/json
 * @return {object} 200 - success response - application/json
 */
UserRouter.delete("/remove-user-account", UserController.removeUserAccount);
/**
 * PATCH /v1/suspend-user-account
 * @summary suspend user account
 * @tags Users
 * @param {UserUpdateBody} request.body.required - user info - application/json
 * @return {object} 200 - success response - application/json
 */
UserRouter.patch("/suspend-user-account", UserController.suspendUserAccount);
/**
 * PATCH /v1/reactivate-user-account
 * @summary reactivate user account
 * @tags Users
 * @param {UserUpdateBody} request.body.required - user info - application/json
 * @return {object} 200 - success response - application/json
 */
UserRouter.patch(
  "/reactivate-user-account",
  UserController.reactivateUserAccount
);

export default UserRouter;
