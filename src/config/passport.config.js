import dotenv from "dotenv";
import fetch from "node-fetch";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { UserModel } from "../DAO/models/users.model.js";
import { CartsService } from "../services/carts.service.js";
import { UserService } from "../services/users.service.js";
import { createHash, isValidPassword } from "../utils/Bcrypt.js";

dotenv.config();
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            console.log("User not found with username (email) " + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log("Invalid password");
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          let user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user",
            cartId: await CartsService.create(),
          };
          let userCreated = await UserModel.create(newUser);
          console.log(userCreated);
          console.log("User registration succesful");
          return done(null, userCreated);
        } catch (e) {
          console.log("Error in register");
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.5e0a43f2fd32b3ee",
        clientSecret: process.env.GITHUB_LOGIN_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, _, profile, done) => {
        console.log(profile);
        try {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: "Bearer " + accesToken,
              "X-Github-Api-Version": "2022-11-28",
            },
          });

          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error("cannot get a valid email for this user"));
          }
          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email });
          if (!user) {
            const newUser = {
              first_name: profile._json.name || profile._json.login || "noname",
              last_name: "noLast",
              email: profile.email,
              age: 0,
              password: "noPass",
              role: "user",
              cartId: await CartsService.create(),
            };
            let userCreated = await UserModel.create(newUser);
            console.log("User Registration succesful");
            return done(null, userCreated);
          } else {
            console.log("User already exists");
            return done(null, user);
          }
        } catch (e) {
          console.log("Error en auth github");
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserService.findById(id);
    /* console.log(user); */

    done(null, user);
  });
}
