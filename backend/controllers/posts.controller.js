const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const Post = require('../models/post.model');

/* ADDITIONAL CONSTS AND FUNCTIONS FOR INPUT VALIDATION */
// Characters used in id generator
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

// ASCII forbidden in inputs
const forbidden = [ '&amp;', '&lt;', '&gt;', '&quot;', '&#039;'];

// Escaping characters to ASCII
const escape = (html) => {
  if(typeof html === 'string') {
    return html.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

// Text input validation
const verifyText = (res, text) => {
  const escapedText = escape(text);

  for (let item of forbidden) {
    if(escapedText.includes(item)) {
      res.status(400).json({ msg: 'Wrong input!' });
    }
  }

  if (escapedText.length > 1) {
    return escapedText;
  } else {
    res.status(400).json({ msg: 'Wrong input!' });
  }
};

// Email input validation
const verifyEmail = (res, email) => {
  const regex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
  const escapedEmail = escape(email);

  for (let item of forbidden) {
    if(escapedEmail.includes(item)) {
      res.status(400).json({ msg: 'Wrong input!' });
    }
  }

  if(regex.test(escapedEmail) && escapedEmail.length > 1) {
    return escapedEmail;
  } else {
    res.status(400).json({ msg: 'Wrong input!' });
  }
};

// Price input validation
const verifyPrice = (res, price) => {

  if (!isNaN(price)) {
    return parseInt(price);
  } else {
    res.status(400).json({ msg: 'Wrong input!' });
  }
};

// Phone number input validation
const verifyPhone = (res, phone) => {
  if (typeof phone === 'string') {
    const escapedPhone = escape(phone);

    for (let item of forbidden) {
      if(escapedPhone.includes(item)) {
        res.status(400).json({ msg: 'Wrong input!' });
      }
    }

    if (!isNaN(escapedPhone) && escapedPhone.length > 1 && escapedPhone.length < 12) {
      return escapedPhone;
    } else {
      res.status(400).json({ msg: 'Wrong input!' });
    }
  } else {
    res.status(400).json({ msg: 'Wrong input!' });
  }
};

// Category Selector validation
const verifyCategory = (res, select) => {
  const escapedSelect = escape(select);
  const options = [
    'Announcements',
    'Real Estate',
    'House and Garden',
    'Entertainment',
    'Automotive',
    'Work',
    'Electronics',
    'Services',
    'Sport',
    'Buy/Sell',
    'Other',
  ];

  for (let item of forbidden) {
    if(escapedSelect.includes(item)) {
      res.status(400).json({ msg: 'Wrong input!' });
    }
  }

  for (let option of options) {
    if(escapedSelect.includes(option)) {
      return escapedSelect;
    }
  }
  res.status(400).json({ msg: 'Wrong input!' });
};

// Photo name validation
const verifyPhoto = (res, photoName) => {
  const escapedPhotoName = escape(photoName);
  const allowedExtensions = ['jpg','jpeg','jfif','png'];
  const extension = escapedPhotoName.split('.')[1];

  for (let item of forbidden) {
    if(escapedPhotoName.includes(item)) {
      res.status(400).json({ msg: 'Wrong input!' });
    }
  }

  for (let item of allowedExtensions) {
    if(extension === item) {
      return escapedPhotoName;
    }
  }
  res.status(400).json({ msg: 'Wrong input!' });
};

// Status validation
const verifyStatus = (res, status) => {
  const escapedStatus = escape(status);

  for (let item of forbidden) {
    if(escapedStatus.includes(item)) {
      res.status(400).json({ msg: 'Wrong input!' });
    }
  }

  if (escapedStatus === 'draft' || escapedStatus === 'published' || escapedStatus === 'closed') {
    return escapedStatus;
  } else {
    res.status(400).json({ msg: 'Wrong input!' });
  }
};

/* CONTROLLER GETTING ALL PUBLISHED POSTS */
exports.getAll = async (req, res) => {
  try {
    const result = await Post
      .find({status: 'published'})
      .select('email publishedDate title text additional')
      .sort({created: -1});
    if(!result) res.status(404).json({ post: 'Not found' });
    else res.json(result);
  }
  catch(err) {
    res.status(500).json(err);
  }
};

/* CONTROLLER GETTING ALL OWNED POSTS */
exports.getOwned = async (req, res) => {
  try {
    const result = await Post
      .find({email: req.params.user})
      .select('email publishedDate title text additional')
      .sort({created: -1});
    if(!result) res.status(404).json({ post: 'Not found' });
    else res.json(result);
  }
  catch(err) {
    res.status(500).json(err);
  }
};

/* CONTROLLER GETTING ONE SPECIFIC POST */
exports.getOne = async (req, res) => {
  try {
    const result = await Post
      .findById(req.params.id);
    if(!result) res.status(404).json({ post: 'Not found' });
    else res.json(result);
  }
  catch(err) {
    res.status(500).json(err);
  }
};

/* CONTROLLER POSTING NEW POST */
exports.post = async (req, res) => {
  try {
    const post = {};
    post.additional = {};

    // Setting Published and Update dates for new Post
    post.publishedDate = new Date(Date.now());
    post.updatedDate = new Date(Date.now());

    // Collecting, verifying and saving all required info given in body
    post.title = verifyText(res, req.body.title);
    post.text = verifyText(res, req.body.text);
    post.additional.category = verifyCategory(res, req.body.category);
    post.additional.area = verifyText(res, req.body.area);
    post.additional.email = verifyEmail(res, req.body.email);
    post.additional.status = verifyStatus(res, req.body.status);

    // Collecting, verifying and saving all additional info given in body
    if(req.body.photo) post.photo  = verifyPhoto(res, req.body.photo);
    if(req.body.price) post.additional.price = verifyPrice(res, req.body.price);
    if(req.body.phone) post.additional.phone = verifyPhone(res, req.body.phone);

    // Saving data as new Post and sending it to Database
    const newPost = new Post(post);
    await newPost.save();
    res.send(newPost);
  }
  catch(err) {
    res.status(500).json(err);
  }
};

/* CONTROLLER EDITING SPECIFIC EXISTING POST */
exports.edit = async (req, res) => {
  try {
    const result = await Post.findById(req.params.id);
    if(result) {

      // Setting Update date for updated Post
      result.updatedDate = new Date(Date.now());

      // Collecting, verifying and saving all required info given in body
      result._id = verifyText(res, req.body.id);
      result.title = verifyText(res, req.body.title);
      result.text = verifyText(res, req.body.text);
      result.additional.category = verifyCategory(res, req.body.category);
      result.additional.area = verifyText(res, req.body.area);
      result.additional.email = verifyEmail(res, req.body.email);
      result.additional.status = verifyStatus(res, req.body.status);

      // Collecting, verifying and saving all additional info given in body
      if(req.body.photo) result.photo = verifyPhoto(res, req.body.photo);
      if(req.body.price) result.additional.price = verifyPrice(res, req.body.price);
      if(req.body.phone) result.additional.phone = verifyPhone(res, req.body.phone);

      // Saving edited data and sending it to Database
      await result.save();
      res.json(result);
    }
    else res.status(404).json({ post: 'Not found' });
  }
  catch(err) {
    res.status(500).json(err);
  }
};

/* CONTROLLER SAVING PHOTO FOR SPECIFIC POST */
exports.postPhoto = async (req, res) => {
  try {
    const photo = req.files.photo;
    const nameArray = photo.name.split('.');

    // Setting new file name with id generator
    nameArray[0] = shortid.generate();
    photo.name = nameArray.join('.');

    // Saving the file in Public folder
    photo.mv(path.join(__dirname, '../public/uploaded/', photo.name));

    res.send(photo.name);
  }
  catch(err) {
    res.status(500).json(err);
  }
};

/* CONTROLLER DELETING PHOTO SAVED IN SPECIFIC POST */
exports.deleteSavedPhoto = async (req, res) => {
  try {
    const result = await Post.findById(req.params.id);
    const filePath = path.join(__dirname, '../public/uploaded/', req.body.name);

    // Deleting data about photo from Database
    result.photo = null;
    await result.save();

    // Deleting the photo from Public folder
    try {
      fs.unlink(filePath, function(err) {
        if (err) {
          console.log(false);
        } else {
          console.log(true);
        }
      });
    } catch(err) {
      res.status(500).json(err);
    }

    res.json(result);
  }
  catch(err) {
    res.status(500).json(err);
  }
};


/* CONTROLLER DELETING PHOTO NOT YET SAVED IN SPECIFIC POST */
exports.deletePhoto = async (req, res) => {
  const filePath = path.join(__dirname, '../public/uploaded/', req.body.deletePhoto);

  try {
    fs.unlink(filePath, function(err) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.send(true);
      }
    });
  } catch(err) {
    res.status(500).json(err);
  }
};
