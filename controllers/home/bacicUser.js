// packages
const path = require("path");
const fs = require("fs");

// imports
const Product = require("../../models/product");
const User = require("../../models/user");

// init
const url = process.env.API_URL;

// routers
const addProduct = async (req, res) => {
  try {
    const pathsArray = req.files.map((obj) => obj.path);
    const {
      userId,
      title,
      price,
      description,
      discount,
      remain,
      brand,
      category,
    } = req.body;
    const existingUser = await User.findOne({ _id: userId });
    if (existingUser) {
      let product = new Product({
        title,
        price,
        description,
        images: pathsArray,
        discount,
        remain,
        brand,
        category,
      });
      product = await product.save();
      list = existingUser.myProduct;
      let p = true;
      for (let i = 0; i < list.length; i++) {
        if (list[i] == product._id) {
          p = false;
        }
      }
      if (p) {
        list.push(product._id);
      }
      await User.updateOne({ _id: userId }, { $set: { myProduct: list } });
      return res.status(200).json({ product, message: "product created.." });
    } else {
      return res.status(400).json({ message: "user not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const pathsArray = req.files.map((obj) => obj.path);
    const {
      productId,
      title,
      price,
      description,
      discount,
      remain,
      brand,
      category,
    } = req.body;
    const existingProduct = await Product.findOne({ _id: productId });
    console.log(existingProduct);
    if (existingProduct) {
      const query = {};
      if (title) query.title = title;
      if (price) query.price = price;
      if (description) query.description = description;
      if (discount) query.discount = discount;
      if (remain) query.remain = remain;
      if (brand) query.brand = brand;
      if (category) query.category = category;
      if (pathsArray.length != 0) query.images = pathsArray;
      console.log(query);
      await Product.updateOne({ _id: productId }, { $set: query });
      const existingProduct = await Product.findOne({ _id: productId });
      console.log(existingProduct);
      return res.status(200).json({ message: "product edited.." });
    } else {
      return res.status(400).json({ message: "product not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const existingUser = await User.findOne({ _id: userId });
    if (existingUser) {
      const existingProduct = await Product.findOne({ _id: productId });
      if (existingProduct) {
        for (let i = 0; i < existingProduct.images.length; i++) {
          fs.unlinkSync(
            path.join(__dirname, `../../${existingProduct.images[i]}`)
          );
        }
        await Product.deleteOne({ _id: productId });
        const indexToRemove = existingUser.myProduct.indexOf(productId);
        if (indexToRemove !== -1) {
          const list = existingUser.myProduct.splice(indexToRemove, 1);
          await User.updateOne({ _id: userId }, { $set: { myProduct: list } });
        }
        return res.status(200).json({ message: "product deleted.." });
      } else {
        return res.status(400).json({ message: "product not exist" });
      }
    } else {
      return res.status(400).json({ message: "user not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(400).json({ message: "user not exist" });
    }
    let list = [];
    for (let i = 0; i < existingUser.cart.length; i++) {
      let existingProduct = await Product.findOne({
        _id: existingUser.cart[i],
      });
      list.push(existingProduct);
    }
    return res.status(200).json({ list });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(400).json({ message: "user not exist" });
    }
    let list = [];
    for (let i = 0; i < existingUser.favorite.length; i++) {
      let existingProduct = await Product.findOne({
        _id: existingUser.favorite[i],
      });
      list.push(existingProduct);
    }
    return res.status(200).json({ list });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(400).json({ message: "user not exist" });
    }
    list = existingUser.cart;
    let p = true;
    for (let i = 0; i < list.length; i++) {
      if (list[i] == productId) {
        p = false;
      }
    }
    if (p) {
      list.push(productId);
    }
    await User.updateOne({ _id: userId }, { $set: { cart: list } });
    return res.status(200).json({ message: "add to cart successfuly" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(400).json({ message: "user not exist" });
    }
    list = existingUser.favorite;
    let p = true;
    for (let i = 0; i < list.length; i++) {
      if (list[i] == productId) {
        p = false;
      }
    }
    if (p) {
      list.push(productId);
    }
    await User.updateOne({ _id: userId }, { $set: { favorite: list } });
    return res.status(200).json({ message: "add to favorite successfuly" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(400).json({ message: "user not exist" });
    }
    const indexToRemove = existingUser.cart.indexOf(productId);
    if (indexToRemove !== -1) {
      const list = existingUser.cart.splice(indexToRemove, 1);
      await User.updateOne({ _id: userId }, { $set: { cart: list } });
    }
    return res.status(200).json({ message: "delete from cart successfuly" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(400).json({ message: "user not exist" });
    }
    const indexToRemove = existingUser.favorite.indexOf(productId);
    if (indexToRemove !== -1) {
      const list = existingUser.favorite.splice(indexToRemove, 1);
      await User.updateOne({ _id: userId }, { $set: { favorite: list } });
    }
    return res
      .status(200)
      .json({ message: "delete from favorite successfuly" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addRate = async (req, res) => {
  try {
    const { productId, rating } = req.body;
    const existingProduct = await Product.findOne({ _id: productId });
    if (existingProduct) {
      number = Math.trunc(existingProduct.rating);
      fnumber = existingProduct.rating - number;
      result = (fnumber * 10 + rating) / 20 + (number + 1);
      await Product.updateOne({ _id: productId }, { $set: { rating: result } });
      return res.status(200).json({ message: "rated successfuly" });
    } else {
      return res.status(400).json({ message: "product not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBuyAgain = async (req, res) => {
  try {
    const userId = req.userId;
    const existingUser = await User.findOne({ _id: userId });
    if (existingUser) {
      let list = [];
      for (let i = 0; i < existingUser.buyAgain.length; i++) {
        let existingProduct = await Product.findOne({
          _id: existingUser.buyAgain[i],
        });
        list.push(existingProduct);
      }
      return res.status(200).json({ list });
    } else {
      return res.status(400).json({ message: "user not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { resevertId, message } = req.body;
    const existingChat = await Chat.findOne({
      $or: [
        { user1: userId, user2: resevertId },
        { user1: resevertId, user2: userId },
      ],
    });
    if (existingChat) {
      await Chat.updateOne(
        { _id: existingChat._id },
        { $push: { messages: { user: userId, message: message } } }
      );
      return res.status(200).json({ message: "send message successfuly" });
    } else {
      const newChat = new Chat({
        user1: userId,
        user2: resevertId,
        messages: [{ user: userId, message: message }],
      });
      await newChat.save();
      return res.status(200).json({ message: "send message successfuly" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllChat = async (req, res) => {
  try {
    const userId = req.userId;
    const existingUser = await User.findOne({ _id: userId }, { chats: 1 });
    let list = [];
    for (let i = 0; i < existingUser.chats.length; i++) {
      let existingChat = await Chat.findOne({ _id: existingUser.chats[i] });
      list.push(existingChat);
    }
    return res.status(200).json({ list });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getCart,
  getFavorite,
  addCart,
  addFavorite,
  deleteCart,
  deleteFavorite,
  addRate,
  getBuyAgain,
  sendMessage,
  getAllChat,
};
