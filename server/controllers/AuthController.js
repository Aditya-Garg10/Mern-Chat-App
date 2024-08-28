import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const expire = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, UserId) => {
  return jwt.sign({ email, UserId }, process.env.JWT_KEY, {
    expiresIn: expire,
  });
};

export const SignUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Email and Password is Required");
    }

    const user = await User.create({ email, password });
    if(user){

      res.status(201).json({success:true,user});
    }

    // return res.cookie("jwt",createToken(email,User.id),{
    //     expire,
    //     secure : true,
    //     sameSite : "None",
    // }).status(201).send({user:{
    //     id: user.id,
    //     email : user.email,
    //     firstName : user.firstName,
    //     lastName : user.lastName,
    //     image: user.image,
    //     profileSetup : user.profileSetup,
    // },})
  } catch (error) {
    console.log(error);
    return res.status(500).send("User Already Exists");
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Email and Password is Required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(204).json("No user exist with this Email");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(204).json("Incorrect Password");
    }
    
    const authtoken = createToken(user.email,user.id);
    const success = true;
    res.json({
      success,
      authtoken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });

    //     return res.json("jwt",createToken(email,user.id),{
    //         expire,
    //         secure : true,
    //         sameSite : "None",
    //     }).status(200).json({user:{
    //         id: user.id,
    //         email : user.email,
    //         firstName : user.firstName,
    //         lastName : user.lastName,
    //         image: user.image,
    //         profileSetup : user.profileSetup,
    //         firstName : user.firstName,
    //         lastName : user.lastName,
    //         image : user.image,
    //         color : user.color
    //     },
    // })
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.UserId);
    if (!userData) {
      return res.status(404).send("User not Found");
    }
    return res.status(200).send({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        profileSetup: userData.profileSetup,
        color: userData.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { UserId } = req.body;
    console.log(UserId);
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).send("All field are required");
    }
    const userData = await User.findOneAndUpdate(
      { _id: UserId },
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).send({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is Required");
    } else {
      const date = Date.now();
      let fileName = "uploads/profiles/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);

      const { UserId } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { _id: UserId },
        { image: fileName },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        image: updatedUser.image,
      });
    }
  } catch (error) {
    console.log({ error });
    res.json(error);
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const { UserId } = req.body;
    const user = await User.findById(UserId);

    if (!user) {
      return res.status(404).send("User not Found");
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    user.save();

    return res.status(200).send("Profile Image Removed  Successfully");
  } catch (error) {
    res.json(error).status(500);
  }
};

export const logOut = async (req, res, next) => {
  try {
    res.header("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Logout Successfull.");
  } catch (error) {
    res.json(error).status(500);
  }
};
