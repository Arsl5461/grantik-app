var mongoose = require("mongoose");
var router = require("express").Router();
var passport = require("passport");
var User = mongoose.model("User");
var auth = require("../auth");

router.get("/auth/me", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json(user.toAuthJSON());
    })
    .catch(next);
});

router.get("/users", auth.required, function (req, res, next) {
  User.find().then(function (users) {
    return res.json(users);
  })
  .catch(next);
})

router.delete("/users/:id", auth.required, function (req, res, next) {
  User.findByIdAndRemove(req.params.id).then(function (user) {
    return res.json("success")
  }).catch(next);
})

router.put("/user/profile", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.username !== "undefined") {
        user.username = req.body.username;
      }
      if (typeof req.body.email !== "undefined") {
        user.email = req.body.email;
      }
      if (typeof req.body.bio !== "undefined") {
        user.bio = req.body.bio;
      }
      if (typeof req.body.image !== "undefined") {
        user.image = req.body.image;
      }
      if (typeof req.body.password !== "undefined") {
        user.setPassword(req.body.password);
      }

      return user.save().then(function () {
        return res.json({
          user: user.toAuthJSON(),
          jwt: user.generateJWT(),
        });
      });
    })
    .catch(next);
});

router.post("/auth/login", function (req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (user) {
        user.token = user.generateJWT();
        return res.json({
          user: user.toAuthJSON(),
          jwt: user.generateJWT(),
        });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

router.post("/auth/register", async function (req, res, next) {
  var user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  const users = await User.find();
  if (users.length === 0) {
    user.role = "ADMIN";
  }

  user
    .save()
    .then(function () {
      return res.json({
        user: user.toAuthJSON(),
        jwt: user.generateJWT(),
      });
    })
    .catch(next);
});

module.exports = router;
