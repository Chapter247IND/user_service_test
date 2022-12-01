import dayjs from "dayjs";
import { Validator } from "jsonschema";
import { pick, rest } from "lodash";
import ShortUniqueID from "short-unique-id";
import validator from "validator";
import Sequelize from "sequelize";

import { User } from "../models";
const Op = Sequelize.Op;

const uuid = new ShortUniqueID({
  length: 24,
});
const addSchemaValidator = new Validator();

const addUserAccountSchema = {
  id: "/UserAccount",
  type: "object",
  properties: {
    fullName: { type: "string", maxLength: 100 },
    email: { type: "string", format: "email", maxLength: 200 },
    birthDate: { type: "string", format: "date" },
  },
  required: ["fullName", "email", "birthDate"],
};

const activeSuspendAndRemoveSchema = {
  id: "/remove",
  type: "object",
  properties: {
    id: { type: "number", minimum: 1 },
  },
  required: ["id"],
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const addUserAccount = async (req, res) => {
  try {
    const validate = addSchemaValidator.validate(
      req.body,
      addUserAccountSchema
    );
    if (!validate.valid) {
      return res.status(400).json(validate.errors);
    }

    const body = pick(req.body, ["fullName", "email", "birthDate"]);
      const newUser = new User({
      ...body,
      username: uuid(),
      status: "active",
    });

    await newUser.save();

    return res.status(201).json({'message':'User has been added successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const listUseAccounts = async (req, res) => {
  try {
    const users = await User.findAndCountAll({
      where: {
        status: { [Op.ne]: "archived" },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const updateUserAccount = async (req, res) => {
  try {
    const { id, fullName, birthDate, status } = req.body;
    const errors = {};

    if (!id || !validator.isNumeric(String(id))) {
      errors.id = "Please provide id to update.";
    }

    if (
      !fullName ||
      validator.isEmpty(fullName) ||
      !validator.isLength(fullName, {
        min: 1,
        max: 100,
      })
    ) {
      errors.fullName =
        "Please provide valid full name, maximum length allowed is 100.";
    }
    if (
      !birthDate ||
      validator.isEmpty(birthDate) ||
      !dayjs(birthDate).isValid() ||
      validator.isAfter(
        birthDate,
        dayjs().subtract(18, "years").format("YYYY-MM-DD")
      )
    ) {
      errors.birthDate = `Please provide valid date of birth, format should be "YYYY-MM-DD" and should be before ${dayjs()
        .subtract(18, "years")
        .format("YYYY-MM-DD")}.`;
    }

    if (
      !status ||
      validator.isEmpty(status) ||
      !validator.isIn(status, ["active", "suspended", "archived"])
    ) {
      errors.status = `Please provide valid status, status can only be one of "active", "suspended", "archived".`;
    }

    if (Object.keys(errors).length) {
      return res.status(400).json(errors);
    }
    await User.update(
      { fullName, birthDate, status },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({'message':'User has been updated successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const removeUserAccount = async (req, res) => {
  try {
    const { id } = req.body;
    const validate = addSchemaValidator.validate(
      req.body,
      activeSuspendAndRemoveSchema
    );
    if (!validate.valid) {
      return res.status(400).json(validate.errors);
    }
    const userCheck = await User.findOne({where:{id}});
    if (!userCheck) {
      return res.status(400).json({error:"User doesn't found."});
    }
    await User.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({'message':'User has been deleted successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const suspendUserAccount = async (req, res) => {
  try {
    const { id } = req.body;
    const validate = addSchemaValidator.validate(
      req.body,
      activeSuspendAndRemoveSchema
    );
    if (!validate.valid) {
      return res.status(400).json(validate.errors);
    }
    const userCheck = await User.findOne({where:{id}});
    if (!userCheck) {
      return res.status(400).json({error:"User doesn't found."});
    }

    await User.update(
      { status: "suspended" },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({'message':'User account has been suspended successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reactivateUserAccount = async (req, res) => {
  try {
    const { id } = req.body;
    const validate = addSchemaValidator.validate(
      req.body,
      activeSuspendAndRemoveSchema
    );
    if (!validate.valid) {
      return res.status(400).json(validate.errors);
    }
    await User.update(
      { status: "active" },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({'message':'User account has been suspended successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export default {
  addUserAccount,
  listUseAccounts,
  updateUserAccount,
  removeUserAccount,
  suspendUserAccount,
  reactivateUserAccount,
};
