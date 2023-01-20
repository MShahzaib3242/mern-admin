import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* READ */
export const verifyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({"_id": id, "role": "superadmin"});
    
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE USER 
export const updateUser = async (req, res) => {
  try {
      const { id, name, email, password, country, picturePath, role } = req.body;

      const Updateuser = await User.updateOne({"_id": id}, {$set: {
        name: name,
        email: email,
        country: country,
        password: password,
        picturePath: picturePath,
        role: role
      }});
      
      const user = await User.findById(id);
      
      const token = jwt.sign({ id: id }, process.env.JWT_SECRET);

      res.status(200).json({token, user});

  } catch (error) {
      res.status(400).json({message: error.message});
  }
}

// Add USER 
export const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      picturePath,
      country,
      role,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      picturePath,
      country,
      role
    });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    
    const user = await User.findByIdAndRemove({"_id": id});

    res.status(201).json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}