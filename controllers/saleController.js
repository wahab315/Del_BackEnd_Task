const multer = require("multer");
const Jimp = require("jimp");
const Sale = require("./../models/sale");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Upload multiple images using 'images' as the key
exports.uploadSaleImages = upload.fields([{ name: "images", maxCount: 10 }]);

exports.resizeSaleImages = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  console.log("current user inages::::::::", req.files);
  console.log("current user body::::::::", req.body);

  if (!req.files.images) {
    return next(new AppError(" Please upload images.", 400));
  }

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `Sale-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;

      const image = await Jimp.read(file.buffer);
      image
        .resize(2000, 1333)
        .quality(90)
        .write(`public/img/sales/${filename}`);

      req.body.images.push(`public/img/sales/${filename}`);
    })
  );
  next();
});

exports.createSale = factory.createOne(Sale);
exports.allSale = factory.getAll(Sale);
