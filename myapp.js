const express = require("express"); // loads the express package
const { engine } = require("express-handlebars"); // loads handlebars for Express
const port = 2001; // defines the port
const app = express(); // creates the Express application
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectSqlite3 = require("connect-sqlite3");
const SQLiteStore = connectSqlite3(session);
// define static directory "public" to access css/ and img/
app.use(express.static("public"));
//Model (DATA) här jag skappat min data base
const { db, initDb } = require("./db.init");
initDb();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true },
  })
);
// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

app.use((req, res, next) => {
  res.locals.session = req.session;
  console.log("Req. URL", req.url);
  next();
}); /////det här för skicka session med varje req och res ////viktig
app.get("/", (req, res) => {
  console.log("SESSION: ", req.session);
  const model = {
    isLoggedin: req.session.isLoggedin,
    fname: req.session.name,
    admin: req.session.isAdmin,
  };
  res.render("home", model);
});
app.get("/about", (req, res) => {
  const model = {
    isLoggedin: req.session.isLoggedin,
    fname: req.session.name,
    admin: req.session.isAdmin,
  };
  res.render("about", model); /// här jag tänker att det böhvs inte göras
});
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/register", (req, res) => {
  const model = {
    isLoggedin: req.session.isLoggedin,
    fname: req.session.name,
    admin: req.session.isAdmin,
  };
  res.render("register", model);
});
app.use((req, res, next) => {
  console.log("Middleware called");
  next();
});

app.use(express.urlencoded({ extended: false }));
app.get("/register", (req, res) => {
  res.render("register");
});
///

app.post("/register", (req, res) => {
  const { username, password, fname, lname, gender } = req.body;
  console.log(req.body);
  const {
    Degree,
    edstartDate,
    edendDate,
    language_of_edu,
    exstartDate,
    exendDate,
    jobTitle,
    place,
  } = req.body;
  const { sname, stype, slevel } = req.body;

  // Requires bcrypt to be installed
  const hash = bcrypt.hashSync(password, 10);
  console.log(hash);
  // Requires a sqlite3 database
  db.run(
    "INSERT INTO user (email, password, fname, lname, gender, uRole) VALUES (?, ?,?,? ,?,?)",
    [username, hash, fname, lname, gender, "visitor"],

    (err) => {
      if (err) {
        console.log(err);

        res.status(500).send({ error: "Server error" });
      } else {
        db.run(
          "INSERT INTO userprofile (email,proffession, plevel, descyourself) VALUES (?, ?,?,?)",
          [
            username,
            req.body.proffession,
            req.body.plevel,
            req.body.descyourself,
          ],

          (err) => {
            if (err) {
              console.log(err);
              res.status(500).send({ error: "Server error" });
            } else {
              db.get(
                "SELECT userPid FROM userprofile where email = ?",
                [username],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    db.run(
                      "INSERT INTO education (userPid, Degree, startDate, endDate, language_of_edu) VALUES (?, ?, ?, ?, ?)",
                      [
                        result.userPid,
                        Degree,
                        edstartDate,
                        edendDate,
                        language_of_edu,
                      ],
                      (err) => {
                        if (err) {
                          console.log(err);
                          res.status(500).send({ error: "Server error" });
                        } else {
                          db.run(
                            "INSERT INTO skills (userPid, sname, stype, slevel) VALUES (?, ?, ?, ?)",
                            [result.userPid, sname, stype, slevel],
                            (err) => {
                              if (err) {
                                console.log(err);
                                res.status(500).send({ error: "Server error" });
                              } else {
                                insertExp(
                                  result.userPid,
                                  jobTitle,
                                  exstartDate,
                                  exendDate,
                                  place,
                                  res
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
        ///res.redirect("/login");
      }
    }
  );
});
// Definiera modellen
const model = {
  title: "Välkommen till min webbplats",
  description: "Det här är en enkel webbplats med Node.js och Express.",
  author: "Ahmed",
};

app.get("/login", (req, res) => {
  const model = {
    admin: req.session.isAdmin,
    isLoggedin: req.session.isLoggedin,
  };
  res.render("login", model);
  /*const username = req.body.username;
  const password = req.body.password;
  if (username === "elah22nv@student.ju.se" && password === "1992") {
    console.log("Ahmed är inloggad");
    req.session.isAdmin = true;
    req.session.isLoggedin = true;
    req.session.name = "Ahmed";
    console.log("admin");
    return res.redirect("/");
  }*/

  // Skicka med modellen till vyn
  //res.render("login", { model });
});

// Add an API endpoint  // här jag har gojrt a data API end punkt men jag fattade inte behövet till det
app.get("/api/data", (req, res) => {
  const data = {
    message: "This is your API data!",
    timestamp: new Date().toISOString(),
  };

  res.json(data);
});

// Setup Express app
app.get("/api/users", (req, res) => {
  // Get all users
});

app.get("/api/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const profile = await getUserProfile(id);

    if (profile) {
      /// console.log("SFFAGAGAFFGFGAGAFGAGFGAFGGAGGGFAGAF");
      console.log("SESSION: ", req.session);
      profile.admin = req.session.isAdmin;
      profile.isLoggedin = req.session.isLoggedin;
      profile.username = req.session.fname;
      profile.testjerome = "HEJ";

      res.render("user.handlebars", profile);
    } else {
      res.status(404).json({ error: "The profile is not found" });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

function insertExp(username, jobTitle, startDate, endDate, place, res) {
  db.run(
    "INSERT INTO Experience (userPid ,jobTitle, startDate, endDate, place) VALUES (?, ?, ?, ?, ?)",
    [username, jobTitle, startDate, endDate, place],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "server error" });
      } else {
        res.redirect("/login");
      }
    }
  );
}

function getUserProfile(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const userResult = await queryDb(
        "SELECT userprofile.*,user.fname,user.lname,user.gender from userprofile left join user on user.email = userprofile.email where userprofile.email = ?",
        [id],
        false
      );
      if (!userResult) {
        resolve(null);
        return;
      }

      const profile = { ...userResult };

      const skillsResult = await queryDb(
        "SELECT * from skills where userPid = ?",
        [userResult.userPid],
        true
      );
      if (skillsResult) {
        profile.skills = skillsResult;
      }

      const educationResult = await queryDb(
        "SELECT * from education where userPid = ?",
        [userResult.userPid],
        true
      );
      if (educationResult) {
        profile.education = educationResult;
      }

      const experienceResult = await queryDb(
        "SELECT * from Experience where userPid = ?",
        [userResult.userPid],
        true
      );
      if (experienceResult) {
        profile.experience = experienceResult;
      }

      resolve(profile);
    } catch (err) {
      reject(err);
    }
  });
}

function queryDb(query, params, all) {
  return new Promise((resolve, reject) => {
    if (all) {
      db.all(query, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      db.get(query, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  });
}
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("INFO: ", req.body);
  // Requires a sqlite3 database
  db.get("SELECT * FROM user WHERE email=?", [username], (err, user) => {
    if (err) {
      console.log("ERROR: ", err);
      res.status(500).send({ error: "Server error" });
    } else if (!user) {
      res.status(401).send({ error: "User not found" });
    } else {
      // Use bcrypt.compare to compare the provided password with the hashed password
      console.log("Checking password now");
      bcrypt.compare(password, user.password, (bcryptErr, result) => {
        if (bcryptErr) {
          console.log(bcryptErr);
          res.status(500).send({ error: "Password comparison error" });
        } else if (result) {
          if (user.uRole === "admin") {
            req.session.isAdmin = true;
            console.log(password);
            req.session.isLoggedin = true;
            req.session.fname = user.fname;
            res.redirect("/api/users/" + user.email);
          } else {
            req.session.isAdmin = false;
            console.log("tttttttttttt");
            req.session.isLoggedin = true;
            req.session.fname = user.fname;
            res.redirect("/api/users/" + user.email);
          }

          // res.render("/user", { profile });
        } else {
          console.log("Wrong password");
          req.session.admin = false;
          req.session.isLoggedin = false;
          req.session.fname = "";
          res.redirect("/login");

          // res.status(401).send({ error: "Wrong password" });
        }
      });
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying the session:", err);
    } else {
      console.log("Session destroyed successfully.");
      console.log("logged out");
      res.redirect("/");
    }
  });
});

app.delete("/api/users/:id", (req, res) => {
  // Delete user with id req.params.id
});

app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});

app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});
