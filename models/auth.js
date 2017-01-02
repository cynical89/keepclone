"use strict";
const config = require("../config.json");
const passport = require("../server.js").passport;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) =>{
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    }, (req, email, password, done) => {
        process.nextTick(() => {
            User.findOne({ 'local.email' :  email }, (err, user) => {
                if (err){
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    var newUser = new User();
                    newUser.local.email    = email;
                    newUser.local.password = password;
                    newUser.createUser(newUser, () => {
                    return done(null, newUser);
                })
                }
            });    
        });
    }));
};

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true }, (req, email, password, done) => {
        User.findOne({ 'local.email' :  email }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            return done(null, user);
        });

    }));

