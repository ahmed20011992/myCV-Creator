const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cvcreator.db");
const initDb = function () {
  db.run(
    "CREATE TABLE user (email TEXT NOT NULL PRIMARY KEY, password TEXT NOT NULL, fname TEXT NOT NULL, lname TEXT NOT NULL, gender TEXT NOT NULL, uRole TEXT NOT NULL CHECK (uRole IN ('admin', 'visitor')))",
    (error) => {
      if (error) {
        console.log("ERROR:", error);
      } else {
        console.log("----> Table user created!");
        const users = [
          {
            email: "elah22nv@student.ju.se",
            password:
              "$2b$10$0rwQVn5eC3p4/LY2tG9YI.AJr67DI57bJB8oLl6DN8d8EjWIgMvnW",
            fname: "Ahmed",
            lname: "Elhasan",
            gender: "male",
            uRole: "admin",
          },
          {
            email: "jane.smith@gmail.com",
            password:
              "$2b$10$E8yLSw3Xr/BDZhcwc1.yHezHfxxyjJQbgNuWA2r9UQ6VgJvWUY2A2",
            fname: "Jane",
            lname: "Smith",
            gender: "female",
            uRole: "visitor",
          },
        ];

        users.forEach((oneUser) => {
          db.run(
            "INSERT INTO user (email, password, fname, lname, gender, uRole) VALUES (?, ?, ?, ?, ?, ?)",
            [
              oneUser.email,
              oneUser.password,
              oneUser.fname,
              oneUser.lname,
              oneUser.gender,
              oneUser.uRole,
            ],
            (error) => {
              if (error) {
                console.log("ERROR:", error);
              } else {
                console.log("Row added to the user table!");
              }
            }
          );
        });
      }
    }
  );

  db.run(
    "CREATE TABLE userprofile(userPid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, proffession TEXT NOT NULL, plevel INTEGER, descyourself TEXT NOT NULL, FOREIGN KEY (email) REFERENCES user(email))",
    (error) => {
      if (error) {
        console.log("ERROR: ", error);
      } else {
        console.log("---> Table userprofile created!");
        const userprofile = [
          {
            userPid: 1,
            email: "elah22nv@student.ju.se",
            proffession: "software developer",
            plevel: 10,
            descyourself: "a hard worker!",
          },
          {
            userPid: 2,
            email: "jane.smith@gmail.com",
            proffession: "Web Designer",
            plevel: 8,
            descyourself:
              "Passionate about creating beautiful and user-friendly websites.",
          },
        ];

        // Insert userprofile data
        userprofile.forEach((oneUserp) => {
          db.run(
            "INSERT INTO userprofile (userPid, email, proffession, plevel, descyourself) VALUES (?, ?, ?, ?, ?)",
            [
              oneUserp.userPid,
              oneUserp.email,
              oneUserp.proffession,
              oneUserp.plevel,
              oneUserp.descyourself,
            ],
            (error) => {
              if (error) {
                console.log("ERROR: ", error);
              } else {
                console.log("Line added into the userprofile table!");
              }
            }
          );
        });
      }
    }
  );

  // creates skills projects at startup
  db.run(
    "CREATE TABLE skills (sid INTEGER PRIMARY KEY AUTOINCREMENT, userPid INTEGER, sname TEXT NOT NULL, stype TEXT NOT NULL, slevel TEXT NOT NULL, FOREIGN KEY(userPid) REFERENCES userprofile(userPid))",
    (error) => {
      if (error) {
        // Handle error: display error
        console.log("ERROR: ", error);
      } else {
        // Table skills created successfully
        console.log("---> Table skills created!");

        const skills = [
          {
            id: 1,
            userPid: 1,
            sname: "c++",
            stype: "Programming language",
            slevel: "high",
          },
          {
            id: 2,
            userPid: 1,
            sname: "HTML",
            stype: "Programming language",
            slevel: "high",
          },
          {
            id: 3,
            userPid: 1,
            sname: "Java",
            stype: "Programming language",
            slevel: "good",
          },
          {
            id: 4,
            userPid: 1,
            sname: "css",
            stype: "style sheet language",
            slevel: "good",
          },
          {
            id: 5,
            userPid: 1,
            sname: "Javascript",
            stype: "Programming language",
            slevel: "beginner",
          },
          {
            id: 6,
            userPid: 1,
            sname: "Node",
            stype: "Programming language",
            slevel: "good",
          },
          {
            id: 7,
            userPid: 1,
            sname: "Express",
            stype: "Framework",
            slevel: "very good",
          },
          {
            id: 9,
            userPid: 2,
            sname: "Graphic Design",
            stype: "Design",
            slevel: "expert",
          },
          {
            id: 10,
            userPid: 2,
            sname: "UI/UX Design",
            stype: "Design",
            slevel: "expert",
          },
          {
            id: 11,
            userPid: 2,
            sname: "JavaScript",
            stype: "Programming language",
            slevel: "good",
          },
          {
            id: 12,
            userPid: 2,
            sname: "HTML/CSS",
            stype: "Programming language",
            slevel: "good",
          },
        ];

        // Insert skills
        skills.forEach((oneSkill) => {
          db.run(
            "INSERT INTO skills (userPid, sname, stype, slevel) VALUES (?, ?, ?, ?)",
            [oneSkill.userPid, oneSkill.sname, oneSkill.stype, oneSkill.slevel],
            (error) => {
              if (error) {
                console.log("ERROR: ", error);
              } else {
                console.log("Line added into the skills table!");
              }
            }
          );
        });
      }
    }
  );
  // Create education table
  db.run(
    "CREATE TABLE education (edID INTEGER PRIMARY KEY AUTOINCREMENT , userPid INTEGER NOT NULL, Degree TEXT NOT NULL, startDate DATE NOT NULL, endDate DATE, language_of_edu TEXT NOT NULL, FOREIGN KEY(userPid) REFERENCES userprofile(userPid))",
    (error) => {
      if (error) {
        console.log("ERROR: ", error);
      } else {
        console.log("---> Table education created!");

        const educationData = [
          {
            userPid: 1,
            Degree: "Bachelor of Computer Science",
            startDate: "2022-09-01",
            endDate: "2025-05-30",
            language_of_edu: "English and Swedish",
          },
          {
            userPid: 1,
            Degree: "mathematics",
            startDate: "2012-09-01",
            endDate: null,
            language_of_edu: "Arabic",
          },
          {
            userPid: 1,
            Degree: "Electrical Engineering",
            startDate: "2015-09-01",
            endDate: null,
            language_of_edu: "Turkish",
          },
          {
            userPid: 2,
            Degree: "Master of Fine Arts",
            startDate: "2018-08-15",
            endDate: "2020-05-20",
            language_of_edu: "English",
          },
        ];

        // Insert education data
        educationData.forEach((edu) => {
          db.run(
            "INSERT INTO education (userPid, Degree, startDate, endDate, language_of_edu) VALUES (?, ?, ?, ?, ?)",
            [
              edu.userPid,
              edu.Degree,
              edu.startDate,
              edu.endDate,
              edu.language_of_edu,
            ],
            (error) => {
              if (error) {
                console.log("ERROR: ", error);
              } else {
                console.log("Row added to the education table!");
              }
            }
          );
        });
      }
    }
  );

  // Create Experience table
  db.run(
    "CREATE TABLE Experience (exID INTEGER PRIMARY KEY AUTOINCREMENT, userPid INTEGER NOT NULL, jobTitle TEXT NOT NULL, startDate DATE NOT NULL, endDate DATE, place TEXT,FOREIGN KEY(userPid) REFERENCES userprofile(userPid))",
    (error) => {
      if (error) {
        console.log("ERROR: ", error);
      } else {
        console.log("---> Table Experience created!");

        const experienceData = [
          {
            userPid: 1,
            jobTitle: "a math teacher",
            startDate: "2013-01-01",
            endDate: "2019-08-01",
            place: "middle school in Turkey",
          },
          {
            userPid: 1,
            jobTitle: "mother language teacher",
            startDate: "2020-01-01",
            endDate: "2022-07-01",
            place: "in a school in Sweden",
          },
          {
            userPid: 1,
            jobTitle: "health and care",
            startDate: "2021-01-01",
            endDate: "2023-08-01",
            place: "Mörbylånga Kommun",
          },
          {
            userPid: 2,
            jobTitle: "Web Designer",
            startDate: "2020-03-01",
            endDate: "2021-12-15",
            place: "England",
          },
        ];

        // Insert experience data
        experienceData.forEach((exp) => {
          db.run(
            "INSERT INTO Experience (userPid, jobTitle, startDate, endDate, place) VALUES (?, ?, ?, ?, ?)",
            [exp.userPid, exp.jobTitle, exp.startDate, exp.endDate, exp.place],
            (error) => {
              if (error) {
                console.log("ERROR: ", error);
              } else {
                console.log("Row added to the Experience table!");
              }
            }
          );
        });
      }
    }
  );
};

module.exports = { initDb, db };
